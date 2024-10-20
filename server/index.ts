import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Redis } from "ioredis";
import "dotenv/config";

const app = express();
app.use(
  cors({
    origin: ["https://on-snip.org", "https://www.on-snip.org"],
    credentials: true,
  })
);

const redis = new Redis(process.env.REDIS_CONNECTION_STRING);
const subRedis = new Redis(process.env.REDIS_CONNECTION_STRING);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://on-snip.org", "https://www.on-snip.org"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

subRedis.on("message", (channel, message) => {
  io.to(channel).emit("room-update", JSON.parse(message));
});

subRedis.on("error", (err) => {
  console.log("Redis subscr iption error", err);
});

io.on("connection", async (socket) => {
  const { id } = socket;

  socket.on("join-room", async (room: string) => {

    const subscribedRooms = await redis.smembers("subscribed-rooms");
    await socket.join(room);
    await redis.sadd(`rooms:${id}`, room);
    await redis.hincrby("room-connections", room, 1);

    if (!subscribedRooms.includes(room)) {
      subRedis.subscribe(room, async (err) => {
        if (err) {
          console.log("Failed to subscribe:", err);
        } else {
          await redis.sadd("subscribed-rooms", room);
        }
      });
    }
  });

  socket.on("leave-room", async (room: string) => {
    await socket.leave(room);
    await redis.srem(`rooms:${id}`, room);
    const remainingConnections = await redis.hincrby(
      "room-connections",
      room,
      -1
    );

    if (remainingConnections <= 0) {
      await redis.hdel("room-connections", room);
      await redis.srem("subscribed-rooms", room);
      subRedis.unsubscribe(room, (err) => {
        if (err) console.log("Failed to unsubscribe:", err);
      });
    }
  });

  socket.on("disconnect", async () => {
    const joinedRooms = await redis.smembers(`rooms:${id}`);
    await redis.del(`rooms:${id}`);

    for (const room of joinedRooms) {
      await socket.leave(room);
      const remainingConnections = await redis.hincrby(
        "room-connections",
        room,
        -1
      );

      if (remainingConnections <= 0) {
        await redis.hdel("room-connections", room);
        await redis.srem("subscribed-rooms", room);
        subRedis.unsubscribe(room, (err) => {
          if (err) console.log("Failed to unsubscribe:", err);
        });
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

export default app;
