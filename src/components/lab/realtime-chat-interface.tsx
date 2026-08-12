"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Users,
  Send,
  Sparkles,
  MessageSquare,
  Bot,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Hash,
  Copy,
  Check,
  Circle,
} from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useLocale } from "@/lib/i18n/locale-context";

interface ChatMessage {
  id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}

const DEFAULT_ROOMS = [
  { code: "general", name: "General Lounge" },
  { code: "tech-talk", name: "Tech & Code Talk" },
];

const AUTO_REPLIES = [
  "Halo! Saya lawan bicara simulasi di Dimas Lab. Fitur realtime Supabase Broadcast ini sangat cepat ya! 🚀",
  "Pesan kamu langsung masuk tanpa perlu refresh halaman! 👍",
  "Eksperimen ini membuktikan bahwa Supabase Realtime Channels sangat cocok untuk chat multi-user.",
  "Keren banget! Ada hal lain yang mau kamu tanyakan seputar arsitektur Next.js & Supabase ini?",
];

export function RealtimeChatInterface() {
  const { locale } = useLocale();

  const [senderName, setSenderName] = useState(() => {
    return "Guest-" + Math.floor(100 + Math.random() * 900);
  });
  const [activeRoomCode, setActiveRoomCode] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [onlineCount, setOnlineCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSimulatedGuestActive, setIsSimulatedGuestActive] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Channel ref for Supabase Broadcast
  const channelRef = useRef<ReturnType<typeof supabasePublic.channel> | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Load message history from API
  const loadMessageHistory = useCallback(async (code: string) => {
    try {
      const res = await fetch(`/api/realtime-chat?roomCode=${code}`);
      const data = await res.json();
      if (data.messages) {
        const formatted = data.messages.map((m: { id: string; sender_name: string; content: string; created_at: string }) => ({
          id: m.id,
          sender_name: m.sender_name,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.warn("Failed to load message history:", err);
    }
  }, []);

  // Connect to Supabase Realtime Channel (Broadcast & Presence)
  useEffect(() => {
    loadMessageHistory(activeRoomCode);

    const channel = supabasePublic.channel(`room:${activeRoomCode}`, {
      config: {
        broadcast: { self: false },
        presence: { key: senderName },
      },
    });

    // Handle broadcasted messages from other clients
    channel
      .on("broadcast", { event: "message" }, (payload) => {
        const newMsg: ChatMessage = payload.payload;
        setMessages((prev) => [...prev, newMsg]);
      })
      // Handle typing indicator broadcast
      .on("broadcast", { event: "typing" }, (payload) => {
        const { sender } = payload.payload;
        setTypingUsers((prev) => Array.from(new Set([...prev, sender])));
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((name) => name !== sender));
        }, 2000);
      })
      // Track Presence (online users count)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(Math.max(1, count));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [activeRoomCode, senderName, loadMessageHistory]);

  // Handle typing broadcast
  const handleInputChange = (text: string) => {
    setInputContent(text);
    if (channelRef.current && text.trim().length > 0) {
      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender: senderName },
      });
    }
  };

  // Send Message
  const handleSendMessage = async () => {
    const text = inputContent.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender_name: senderName,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Append locally
    setMessages((prev) => [...prev, userMsg]);
    setInputContent("");

    // Broadcast to other connected clients via Supabase Realtime
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "message",
        payload: userMsg,
      });
    }

    // Persist to Supabase Database
    try {
      await fetch("/api/realtime-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: activeRoomCode,
          senderName: senderName,
          content: text,
        }),
      });
    } catch (err) {
      console.warn("DB save skipped:", err);
    }

    // Trigger Simulated Guest Auto-Reply if enabled
    if (isSimulatedGuestActive) {
      const guestName = "Simulated Guest 🤖";

      // Show typing indicator for simulated guest
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setTypingUsers((prev) => Array.from(new Set([...prev, guestName])));

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((n) => n !== guestName));

        const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        const replyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender_name: guestName,
          content: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSimulated: true,
        };

        setMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Controls Bar: Nickname & Rooms & Simulated Guest Toggle */}
      <div className="p-4 bg-card text-card-foreground border border-border rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Nickname & Online Count */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="size-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground uppercase">Nickname:</span>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value || "Guest")}
              className="bg-background border border-border focus:border-primary/50 rounded-lg px-2.5 py-1 font-mono text-xs text-foreground outline-none max-w-[130px]"
            />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
            <Circle className="size-2 fill-primary animate-pulse" />
            <span>{onlineCount} Online</span>
          </div>
        </div>

        {/* Room Buttons */}
        <div className="flex items-center gap-2">
          {DEFAULT_ROOMS.map((room) => (
            <button
              key={room.code}
              onClick={() => setActiveRoomCode(room.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                activeRoomCode === room.code
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/60 hover:bg-muted text-foreground border border-border"
              }`}
            >
              <Hash className="size-3.5" />
              <span>{room.name}</span>
            </button>
          ))}
        </div>

        {/* Simulated Guest Toggle */}
        <button
          onClick={() => setIsSimulatedGuestActive((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted/80 border border-border font-mono text-xs text-foreground transition-all"
        >
          <Bot className="size-4 text-primary" />
          <span>Simulasi Guest:</span>
          {isSimulatedGuestActive ? (
            <ToggleRight className="size-5 text-primary" />
          ) : (
            <ToggleLeft className="size-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="flex flex-col h-[520px] sm:h-[600px] w-full bg-card text-card-foreground border border-border rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
              Room #{activeRoomCode}
            </h3>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted/50 border border-border rounded-md transition-all"
            title="Salin Link Halaman Chat"
          >
            {isCopied ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}
            <span>{isCopied ? "Tersalin" : "Bagikan Link"}</span>
          </button>
        </div>

        {/* Message Stream */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-muted-foreground">
              <Sparkles className="size-8 text-primary animate-pulse" />
              <p className="font-mono text-xs">Belum ada pesan di room #{activeRoomCode}.</p>
              <p className="text-xs">Ketik pesan di bawah untuk memulai obrolan realtime!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.sender_name === senderName;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col text-sm ${isSelf ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="font-mono text-[0.65rem] font-bold text-foreground">
                      {msg.sender_name}
                    </span>
                    {msg.isSimulated && (
                      <span className="text-[0.6rem] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                        BOT
                      </span>
                    )}
                    <span className="font-mono text-[0.6rem] text-muted-foreground">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                      isSelf
                        ? "bg-primary text-primary-foreground font-medium rounded-br-xs shadow-xs"
                        : "bg-muted/60 border border-border text-foreground rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground pt-2">
              <Users className="size-3.5 text-primary animate-bounce" />
              <span>
                {typingUsers.join(", ")} {typingUsers.length > 1 ? "sedang mengetik..." : "sedang mengetik..."}
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-border bg-muted/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputContent}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Tulis pesan di #${activeRoomCode} sebagai ${senderName}...`}
              className="flex-1 bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="size-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
