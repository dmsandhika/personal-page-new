-- Migration: Create tables for Dimas Lab Realtime Multi-room Chat (Experiment 05)

CREATE TABLE IF NOT EXISTS public.lab_chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lab_realtime_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lab_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_realtime_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for lab demo
CREATE POLICY "Allow public select lab_chat_rooms" ON public.lab_chat_rooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert lab_chat_rooms" ON public.lab_chat_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select lab_realtime_messages" ON public.lab_realtime_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert lab_realtime_messages" ON public.lab_realtime_messages FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lab_realtime_messages_room_code ON public.lab_realtime_messages(room_code);
CREATE INDEX IF NOT EXISTS idx_lab_realtime_messages_created_at ON public.lab_realtime_messages(created_at ASC);

-- Insert default public rooms
INSERT INTO public.lab_chat_rooms (code, name) VALUES
    ('general', 'General Lounge'),
    ('tech-talk', 'Tech & Code Talk')
ON CONFLICT (code) DO NOTHING;
