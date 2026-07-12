import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

// Read-only client using the anon key. Safe to use in both Server and
// Client Components — writes are only ever done server-side via the
// admin client, gated behind the admin password check in middleware.
export const supabasePublic = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
