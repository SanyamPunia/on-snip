// "use client";

// import { useState, useRef, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import { submitComment } from "../actions";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:8080");

// const Room = ({
//   room,
//   initialData,
// }: {
//   room: string;
//   initialData: { text: string }[];
// }) => {
//   const [messages, setMessages] = useState(initialData);
//   const [input, setInput] = useState<string>("");

//   const pathname = usePathname();
//   const slug = pathname.split("/").pop();

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // trigger event on the web server backend
//     socket.emit("join-room", `room:${room}`);
//   }, []);

//   useEffect(() => {
//     console.log("log");
//     // socket.on("room-update", (message: string) => {
//     //   console.log("message", message);
//     //   const data = JSON.parse(message) as { text: string }[];

//     //   // add to state
//     //   setMessages(data);
//     // });

//     // return () => {
//     //   socket.off("room-update");
//     // };
//     socket.on("room-update", (message: string) => {
//       console.log("message");
//     });
//   }, [messages]);

//   const { mutate, error, isPending } = useMutation({
//     mutationFn: submitComment,
//   });

//   return (
//     <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col p-4 max-w-2xl mx-auto">
//       <header className="mb-4">
//         <h1 className="text-lg font-semibold mb-1">#{slug}</h1>
//         <p className="text-xs">(updated in real-time)</p>
//       </header>

//       <main className="flex-grow overflow-auto mb-4 space-y-3">
//         {messages.map((msg, index) => (
//           <div key={index} className="bg-neutral-800 p-2 rounded text-sm">
//             <p className="text-neutral-300">{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </main>

//       <footer>
//         <div className="flex items-center space-x-2">
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message"
//             className="flex-grow bg-neutral-800 border-neutral-700 text-sm"
//           />
//           <Button
//             disabled={isPending}
//             onClick={() => {
//               mutate({ comment: input, room });
//               setInput("");
//             }}
//             size="sm"
//             className="bg-neutral-700 hover:bg-neutral-600"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Room;

"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitComment } from "../actions";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

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
      console.log("Received message:", newMessage);
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

  const { mutate, error, isPending } = useMutation({
    mutationFn: submitComment,
    onSuccess: (newMessage) => {
      // We don't need to update the state here, as it will be handled by the socket event
    },
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
              <p className="text-neutral-300">{msg.text.text}</p> // Handling nested object case
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
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
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
