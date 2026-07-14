import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import type { Profile } from "@/lib/types";

// Public site URL used for SEO (metadataBase, canonical, sitemap, robots,
// JSON-LD). Falls back to localhost for local dev.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Cached so the home page and its generateMetadata() share a single query
// within the same request.
export const getProfile = cache(async (): Promise<Profile | null> => {
  const { data } = await supabasePublic
    .from("profile")
    .select("*")
    .limit(1)
    .single();
  return data;
});
