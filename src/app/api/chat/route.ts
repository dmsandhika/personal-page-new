import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase/admin";

const SYSTEM_INSTRUCTION = `
Kamu adalah "Dimas AI Assistant", asisten kecerdasan buatan interaktif yang berada di halaman Dimas Lab (Technical Playground & Portfolio Dimas Sandhika).

Tugas utama kamu:
1. Membantu pengunjung portfolio memahami profil teknis Dimas (Full-Stack Engineer, Next.js, React, TypeScript, Node.js, Supabase, Tailwind CSS, AI & API Integration).
2. Menjelaskan ide dan proyek eksperimen di Dimas Lab (AI Chatbot, Payment Playground, Maps & Routing, Realtime Chat, RAG, dll).
3. Menjawab pertanyaan teknis mengenai web development, arsitektur software, dan teknologi modern dengan bahasa yang jelas, ramah, profesional, dan to-the-point.
4. Gunakan format Markdown (bold, list, code snippet, dll.) agar jawaban mudah dibaca.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationId, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API Key belum terpasang",
          message:
            "GEMINI_API_KEY belum dikonfigurasi di environment variables (.env.local). Silakan tambahkan GEMINI_API_KEY=your_key untuk mengaktifkan AI response secara penuh.",
          isMissingKey: true,
        },
        { status: 503 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Primary model: gemini-flash-latest
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Format chat history for Gemini SDK (roles: 'user' | 'model')
    const formattedHistory = (history || []).map(
      (item: { role: string; content: string }) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }],
      })
    );

    let responseText = "";

    try {
      const chatSession = model.startChat({
        history: formattedHistory,
      });

      const result = await chatSession.sendMessage(message);
      responseText = result.response.text();
    } catch (genError: unknown) {
      // Fallback model: gemini-2.5-flash-lite
      console.warn("Retrying with gemini-2.5-flash-lite...", genError);
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: SYSTEM_INSTRUCTION,
      });
      const chatSession = fallbackModel.startChat({
        history: formattedHistory,
      });
      const result = await chatSession.sendMessage(message);
      responseText = result.response.text();
    }

    // Optional Supabase DB persistence
    let activeConversationId = conversationId;
    try {
      if (!activeConversationId) {
        const { data: newConv } = await supabaseAdmin
          .from("lab_conversations")
          .insert({
            session_id: "demo-session",
            title: message.slice(0, 30) + (message.length > 30 ? "..." : ""),
          })
          .select("id")
          .single();

        if (newConv) activeConversationId = newConv.id;
      }

      if (activeConversationId) {
        await supabaseAdmin.from("lab_messages").insert([
          {
            conversation_id: activeConversationId,
            sender: "user",
            content: message,
          },
          {
            conversation_id: activeConversationId,
            sender: "assistant",
            content: responseText,
          },
        ]);
      }
    } catch (dbError) {
      // Gracefully handle if DB table isn't migrated yet
      console.warn("Supabase persistence skipped:", dbError);
    }

    return NextResponse.json({
      text: responseText,
      conversationId: activeConversationId || "local-session",
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return NextResponse.json(
      { error: "Gagal memproses pesan.", details: errMessage },
      { status: 500 }
    );
  }
}
