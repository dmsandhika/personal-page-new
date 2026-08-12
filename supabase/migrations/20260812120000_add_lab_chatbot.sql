-- Migration: Create tables for Dimas Lab AI Chatbot (Experiment 01)

CREATE TABLE IF NOT EXISTS public.lab_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    title TEXT DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lab_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.lab_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lab_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write based on session_id or public access for lab demo
CREATE POLICY "Allow public select lab_conversations" ON public.lab_conversations
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert lab_conversations" ON public.lab_conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select lab_messages" ON public.lab_messages
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert lab_messages" ON public.lab_messages
    FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lab_messages_conversation_id ON public.lab_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_lab_conversations_session_id ON public.lab_conversations(session_id);
