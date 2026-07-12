import { supabasePublic } from "@/lib/supabase/public";
import { ProfileForm } from "./profile-form";

export default async function AdminProfilePage() {
  const { data: profile } = await supabasePublic
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  if (!profile) {
    return <p>Profile belum ada. Jalankan supabase/schema.sql terlebih dahulu.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
