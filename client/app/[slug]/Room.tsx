"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitComment } from "../actions";
import { io } from "socket.io-client";

const IS_PROD = process.env.NODE_ENV === "production";
const URL = IS_PROD
  ? "https://hot-hattie-sanyam-personal-9c829822.koyeb.app/"
  : "http://localhost:8080";
const socket = io(URL, {
  withCredentials: true,
});

const Room = ({
  room,
  initialData,
}: {
  room: string;
  initialData: { text: string | { text: string }; id: string }[];
}) => {
  const [messages, setMessages] = useState(initialData);
  const [input, setInput] = useState<string>("");

  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("join-room", `room:${room}`);

    socket.on("room-update", (newMessage: { text: string; id: string }) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("room-update");
      socket.emit("leave-room", `room:${room}`);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate, isPending } = useMutation({
    mutationFn: submitComment,
  });

  const handleSubmit = () => {
    if (input.trim()) {
      mutate({ comment: input, room });
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col p-4 max-w-2xl mx-auto">
      <header className="mb-4">
        <h1 className="text-lg font-semibold mb-1">#{slug}</h1>
        <p className="text-xs">(updated in real-time)</p>
      </header>

      <main className="flex-grow overflow-auto mb-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-neutral-800 p-2 rounded text-sm">
            {typeof msg.text === "string" ? (
              <p className="text-neutral-300">{msg.text}</p>
            ) : (
              <p className="text-neutral-300">{msg.text.text}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer>
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Type a message"
            className="flex-grow bg-neutral-800 border-neutral-700 text-sm"
          />
          <Button
            disabled={isPending}
            onClick={() => {
              if (input.trim()) {
                mutate({ comment: input, room });
                setInput("");
              }
            }}
            size="sm"
            className="bg-neutral-700 hover:bg-neutral-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Room;
