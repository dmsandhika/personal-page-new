import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomCode = searchParams.get("roomCode") || "general";

    // Fetch rooms list
    const { data: rooms } = await supabaseAdmin
      .from("lab_chat_rooms")
      .select("*")
      .order("created_at", { ascending: true });

    // Fetch message history for the requested room
    const { data: messages, error } = await supabaseAdmin
      .from("lab_realtime_messages")
      .select("*")
      .eq("room_code", roomCode)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.warn("Supabase fetch messages error:", error);
    }

    return NextResponse.json({
      rooms: rooms || [],
      messages: messages || [],
    });
  } catch (err: unknown) {
    console.error("GET /api/realtime-chat error:", err);
    return NextResponse.json({ rooms: [], messages: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomCode = "general", senderName, content } = body;

    if (!senderName || !content || content.trim() === "") {
      return NextResponse.json(
        { error: "Sender name dan content tidak boleh kosong." },
        { status: 400 }
      );
    }

    const { data: newMessage, error } = await supabaseAdmin
      .from("lab_realtime_messages")
      .insert({
        room_code: roomCode,
        sender_name: senderName,
        content: content.trim(),
      })
      .select("*")
      .single();

    if (error) {
      console.warn("Supabase insert message error:", error);
    }

    return NextResponse.json({
      message: newMessage || null,
    });
  } catch (err: unknown) {
    console.error("POST /api/realtime-chat error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan pesan." },
      { status: 500 }
    );
  }
}
