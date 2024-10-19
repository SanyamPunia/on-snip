import { Star } from "lucide-react";
import RoomCreator from "@/components/RoomCreator";
import { redis } from "@/lib/redis";

export default async function Home() {
  const servedRequests = await redis.get("served-requests");

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-6">Live Collaborative Rooms</h1>

      <RoomCreator />

      <p className="mt-4 text-xs text-neutral-400">
        Create or join a room to start collaborating
      </p>

      <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="flex flex-col gap-1 justify-between items-center">
          <div className="flex gap-0.5">
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
            <Star className="h-3 w-3 text-green-600 fill-green-600" />
          </div>

          <p className="text-sm">
            <span className="font-semibold">
              {Math.ceil(Number(servedRequests) / 10) * 10}
            </span>{" "}
            served requests
          </p>
        </div>
      </div>
    </div>
  );
}
