"use client";

import { Mail, Globe } from "lucide-react";
import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";

export function Contact({ profile }: { profile: Profile }) {
  const { t } = useLocale();
  const links = [
    { href: profile.github_url, label: "GitHub", icon: GithubIcon },
    { href: profile.linkedin_url, label: "LinkedIn", icon: LinkedinIcon },
    { href: profile.twitter_url, label: "Twitter", icon: TwitterIcon },
    { href: profile.website_url, label: "Website", icon: Globe },
  ].filter((link) => link.href);

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-32 text-center sm:px-10">
      <FadeIn>
        <SectionHeading number="04" align="center">
          {t("section.contact")}
        </SectionHeading>
        <p className="mx-auto mb-10 max-w-md text-xl leading-snug text-muted-foreground sm:text-2xl">
          {t("contact.subtitle")}
        </p>

        <Button
          size="lg"
          nativeButton={false}
          className="h-auto min-h-11 max-w-full rounded-full px-6 py-2.5 text-sm leading-snug break-all whitespace-normal shadow-[0_12px_30px_-12px_var(--primary)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_var(--primary)]"
          render={<a href={`mailto:${profile.email}`} />}
        >
          <Mail className="size-4" />
          {profile.email}
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
                className="text-muted-foreground hover:text-primary"
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
