import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-6 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          About
        </h2>
        <p className="text-lg leading-relaxed whitespace-pre-line">{profile.bio}</p>
        {profile.location && (
          <p className="mt-4 text-sm text-muted-foreground">📍 {profile.location}</p>
        )}
      </FadeIn>
    </section>
  );
}
