import { Github, Linkedin, Mail, Twitter, Globe } from "lucide-react";
import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function Contact({ profile }: { profile: Profile }) {
  const links = [
    { href: profile.github_url, label: "GitHub", icon: Github },
    { href: profile.linkedin_url, label: "LinkedIn", icon: Linkedin },
    { href: profile.twitter_url, label: "Twitter", icon: Twitter },
    { href: profile.website_url, label: "Website", icon: Globe },
  ].filter((link) => link.href);

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24 text-center">
      <FadeIn>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Contact
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Terbuka untuk peluang kerja sama atau sekadar ngobrol.
        </p>

        <Button asChild size="lg">
          <a href={`mailto:${profile.email}`}>
            <Mail className="size-4" />
            {profile.email}
          </a>
        </Button>

        {links.length > 0 && (
          <div className="mt-8 flex justify-center gap-4">
            {links.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        )}
      </FadeIn>
    </section>
  );
}
