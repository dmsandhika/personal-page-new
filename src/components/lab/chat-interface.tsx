"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Trash2, Sparkles, RefreshCw, AlertCircle, Terminal, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocale } from "@/lib/i18n/locale-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const PROMPTS_BY_LOCALE = {
  id: [
    "Apa saja keahlian teknis utama Dimas?",
    "Jelaskan arsitektur teknis yang digunakan di Dimas Lab!",
    "Teknologi apa saja yang dipakai di portfolio ini?",
    "Bagaimana cara mengintegrasikan Gemini AI di Next.js?",
  ],
  en: [
    "What are Dimas's primary technical skills?",
    "Explain the architecture used in Dimas Lab!",
    "What technologies are used in this portfolio?",
    "How to integrate Gemini AI into Next.js?",
  ],
  ar: [
    "ما هي المهارات التقنية الرئيسية لدماس؟",
    "اشرح المعمارية التقنية المستخدمة في دماس لاب!",
    "ما هي التقنيات المستخدمة في هذه المحفظة؟",
    "كيفية دمج Gemini AI في Next.js؟",
  ],
  jv: [
    "Apa wae keahlian teknis utamane Dimas?",
    "Jelasno arsitektur teknis ing Dimas Lab!",
    "Teknologi apa wae sing dienggo ing portofolio iki?",
    "Kepiye cara ngintegrasikake Gemini AI ing Next.js?",
  ],
};

export function ChatInterface() {
  const { locale } = useLocale();
  const suggestions = PROMPTS_BY_LOCALE[locale] || PROMPTS_BY_LOCALE.id;

  const getWelcomeMsg = () => {
    switch (locale) {
      case "en":
        return "Hello! 👋 I am **Dimas AI Assistant**.\n\nYou can ask about Dimas's technical skills, experimental projects in Dimas Lab, or modern web development. What would you like to know?";
      case "ar":
        return "مرحبًا! 👋 أنا **مساعد دماس بالذكاء الاصطناعي**.\n\nيمكنك السؤال عن المهارات التقنية، والمشاريع التجريبية، وتطوير الويب الحديث. ماذا تريد أن تعرف؟";
      case "jv":
        return "Halo! 👋 Kulo **Dimas AI Assistant**.\n\nSampeyan saged takon babagan keahlian teknis Dimas, proyek eksperimen ing Dimas Lab, utawa web development modern. Wonten sing pengin ditakokake?";
      default:
        return "Halo! 👋 Saya adalah **Dimas AI Assistant**.\n\nKamu bisa bertanya tentang keahlian teknis Dimas, proyek eksperimen di Dimas Lab, atau diskusi seputar web development modern. Ada yang ingin kamu ketahui?";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMsg(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isMissingApiKey, setIsMissingApiKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

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
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    setErrorNotice(null);
    setIsMissingApiKey(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationId,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isMissingKey) {
          setIsMissingApiKey(true);
          setErrorNotice(data.message || "GEMINI_API_KEY belum dikonfigurasi.");
        } else {
          setErrorNotice(data.error || "Gagal mendapatkan respon dari AI.");
        }
        setIsLoading(false);
        return;
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error(err);
      setErrorNotice("Terjadi kesalahan jaringan atau server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: getWelcomeMsg(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setErrorNotice(null);
    setIsMissingApiKey(false);
    setConversationId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[520px] sm:h-[650px] w-full bg-card text-card-foreground border border-border rounded-xl shadow-md overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Bot className="size-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-primary border-2 border-card rounded-full" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
              Dimas AI Assistant
              <span className="text-[0.65rem] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Gemini Flash
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">Interactive Technical Assistant</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-all"
          title="Clear Chat History"
        >
          <Trash2 className="size-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Missing API Key Alert */}
      {isMissingApiKey && (
        <div className="m-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">API Key Belum Terkonfigurasi</p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Tambahkan <code className="bg-muted px-1.5 py-0.5 rounded font-mono">GEMINI_API_KEY</code> di file <code className="bg-muted px-1.5 py-0.5 rounded font-mono">.env.local</code> proyek kamu.
            </p>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Bot className="size-4" />
                </div>
              )}

              <div className="group relative max-w-[82%] space-y-1">
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground font-medium rounded-br-xs shadow-xs"
                      : "bg-muted/60 border border-border text-foreground rounded-bl-xs"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none text-sm prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border prose-code:text-primary">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 text-[0.65rem] font-mono text-muted-foreground px-1 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="size-3 text-primary" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="size-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                  <User className="size-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 text-sm justify-start items-center">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 animate-pulse">
              <Sparkles className="size-4" />
            </div>
            <div className="px-4 py-3 rounded-xl rounded-bl-xs bg-muted/60 border border-border text-muted-foreground flex items-center gap-2 text-xs font-mono">
              <RefreshCw className="size-3.5 animate-spin text-primary" />
              <span>
                {locale === "en"
                  ? "Dimas AI is typing..."
                  : locale === "ar"
                  ? "جارٍ الكتابة..."
                  : locale === "jv"
                  ? "Dimas AI lagi ngetik..."
                  : "Dimas AI sedang mengetik..."}
              </span>
            </div>
          </div>
        )}

        {/* Generic Error Notice */}
        {errorNotice && !isMissingApiKey && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-6 py-3 border-t border-border bg-muted/20">
          <p className="text-[0.65rem] font-mono text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Terminal className="size-3 text-primary" />{" "}
            {locale === "en"
              ? "Suggested Prompts:"
              : locale === "ar"
              ? "الأسئلة المقترحة:"
              : locale === "jv"
              ? "Contoh Pitakon:"
              : "Contoh Pertanyaan:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs font-mono bg-muted/80 hover:bg-muted text-foreground px-3 py-1.5 rounded-md border border-border transition-all text-left truncate max-w-full"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
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
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              locale === "en"
                ? "Ask anything about Dimas or technology..."
                : locale === "ar"
                ? "اسأل أي شيء عن دماس أو التقنية..."
                : locale === "jv"
                ? "Takono apa wae babagan Dimas utawa teknologi..."
                : "Tanyakan sesuatu tentang Dimas atau teknologinya..."
            }
            disabled={isLoading}
            className="flex-1 bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="size-3.5" />
            <span className="hidden sm:inline">
              {locale === "en"
                ? "Send"
                : locale === "ar"
                ? "إرسال"
                : locale === "jv"
                ? "Kirim"
                : "Kirim"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
