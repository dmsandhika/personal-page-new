import { createClient } from "@supabase/supabase-js";

// Secret-key client — bypasses RLS. Import only from Server Actions or
// Route Handlers that already sit behind the admin session check.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: { persistSession: false },
  }
);
