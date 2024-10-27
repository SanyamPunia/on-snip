"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createTopic } from "@/app/actions";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getCaptchaToken } from "@/lib/captcha";

const RoomCreator = () => {
  const [roomName, setRoomName] = useState<string>("");

  const { mutate, error, isPending } = useMutation({
    mutationFn: createTopic,
  });

  const handleSubmit = async () => {
    const token = await getCaptchaToken();

    if (roomName.trim()) {
      mutate({
        topicName: roomName,
        token: token,
      });
    }
  };

  return (
    <>
      <div className="w-full max-w-sm flex items-center space-x-2">
        <Input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter a room name"
          className="bg-neutral-800 border-neutral-700 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Button
          disabled={isPending}
          onClick={handleSubmit}
          type="submit"
          size="sm"
          className="bg-neutral-700 hover:bg-neutral-600"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </>
  );
};

export default RoomCreator;
