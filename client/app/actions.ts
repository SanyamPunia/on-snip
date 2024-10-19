"use server";

import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";

export const createTopic = async ({ topicName }: { topicName: string }) => {
  const regex = /^[a-zA-Z-]+$/;

  if (!topicName || topicName.length > 50) {
    return {
      error: "Name must be in b/w 1 & 50 chars",
    };
  }

  if (!regex.test(topicName)) {
    return {
      error: "Only letters and hyphens allowed in name",
    };
  }

  await redis.sadd("exisiting-topics", topicName);

  redirect(`/${topicName}`);
};

// export const submitComment = async ({
//   comment,
//   room,
// }: {
//   comment: string;
//   room: string;
// }) => {
//   // await redis.zadd(`room:${room}`, {
//   //   score: timestamp,
//   //   member: comment,
//   // });

//   await redis.lpush(`room:${room}:comments`, comment);

//   await redis.incr("served-requests");
//   await redis.publish(`room:${room}`, comment);

//   return comment;
// };

export const submitComment = async ({
  comment,
  room,
}: {
  comment: string;
  room: string;
}) => {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const messageObject = { text: comment, id };

  await redis.rpush(`room:${room}:comments`, JSON.stringify(messageObject));

  await redis.incr("served-requests");
  await redis.publish(`room:${room}`, JSON.stringify(messageObject));

  return messageObject;
};


export const deleteComment = async ({ id, room }: { id: string; room: string }) => {
  // Remove the message from the Redis list
  await redis.lrem(`room:${room}:comments`, 0, id);

  return id; // Return the deleted message ID to update the UI
};