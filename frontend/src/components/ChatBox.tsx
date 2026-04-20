import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import API from "@/lib/api";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  _id?: string;
  complaintId: string;
  senderRole: "user" | "agent" | "admin";
  senderName: string;
  text: string;
  createdAt?: string;
}

interface ChatBoxProps {
  complaintId: string;
  senderRole: "user" | "agent";
  senderName: string;
}

let socket: Socket | null = null;

const ChatBox = ({ complaintId, senderRole }: ChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= SOCKET + LOAD ================= */

  useEffect(() => {
    if (!isOpen) return;

    // 🔥 Load messages
    API.get(`/api/messages/${complaintId}`).then((res) => {
      setMessages(res.data);
    });

    // 🔥 Init socket only once
    if (!socket) {
      socket = io("http://localhost:5000", {
        withCredentials: true,
      });
    }

    // 🔥 Join room
    socket.emit("joinComplaint", complaintId);

    // 🔥 Clean previous listener (VERY IMPORTANT)
    socket.off("receiveMessage");

    // 🔥 Listen realtime
    socket.on("receiveMessage", (msg: ChatMessage) => {
      if (msg.complaintId === complaintId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket?.emit("leaveComplaint", complaintId);
      socket?.off("receiveMessage");
    };
  }, [isOpen, complaintId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await API.post("/api/messages", {
        complaintId,
        text,
      });

      // ❌ DO NOT EMIT HERE (backend already emits)
      setText("");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-primary/80 hover:text-primary font-medium"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {isOpen ? "Hide chat" : `Chat (${messages.length})`}
      </button>

      {isOpen && (
        <div className="mt-2 rounded-xl border border-border/30 bg-background/30 backdrop-blur-sm overflow-hidden">
          {/* Messages */}
          <div className="h-48 overflow-y-auto p-3 space-y-2.5">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">
                No messages yet
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={m._id || i}
                className={cn(
                  "flex flex-col",
                  m.senderRole === senderRole
                    ? "items-end"
                    : "items-start"
                )}
              >
                <span className="text-[10px] text-muted-foreground mb-1 px-1">
                  {m.senderName}
                </span>

                <div
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm max-w-[80%]",
                    m.senderRole === senderRole
                      ? "bg-primary/12 rounded-br-md"
                      : "bg-secondary/60 rounded-bl-md"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-2.5 border-t border-border/30">
            <Input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="h-8 text-sm bg-secondary/30 border-border/30 rounded-lg"
            />

            <Button
              size="sm"
              onClick={sendMessage}
              className="h-8 w-8 p-0 bg-primary rounded-lg"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;