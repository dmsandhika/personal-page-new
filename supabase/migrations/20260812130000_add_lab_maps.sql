-- Migration: Create tables for Dimas Lab Maps & Routing (Experiment 04)

CREATE TABLE IF NOT EXISTS public.lab_saved_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    origin_lat DOUBLE PRECISION NOT NULL,
    origin_lng DOUBLE PRECISION NOT NULL,
    dest_name TEXT NOT NULL,
    dest_lat DOUBLE PRECISION NOT NULL,
    dest_lng DOUBLE PRECISION NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    duration_min DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lab_saved_routes ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for lab demo
CREATE POLICY "Allow public select lab_saved_routes" ON public.lab_saved_routes FOR SELECT USING (true);
CREATE POLICY "Allow public insert lab_saved_routes" ON public.lab_saved_routes FOR INSERT WITH CHECK (true);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_lab_saved_routes_created_at ON public.lab_saved_routes(created_at DESC);
