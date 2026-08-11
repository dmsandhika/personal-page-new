"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Globe } from "lucide-react";
import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";
import { sendContactMessage } from "@/app/contact-action";

export function Contact({ profile }: { profile: Profile }) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendContactMessage(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t("contact.form.success"));
        formRef.current?.reset();
      }
    });
  }

  const categoryLabels: Record<string, string> = {
    feedback: t("contact.form.category.feedback"),
    collaboration: t("contact.form.category.collaboration"),
    other: t("contact.form.category.other"),
  };

  const links = [
    { href: profile.github_url, label: "GitHub", icon: GithubIcon },
    { href: profile.linkedin_url, label: "LinkedIn", icon: LinkedinIcon },
    { href: profile.twitter_url, label: "Twitter", icon: TwitterIcon },
    { href: profile.website_url, label: "Website", icon: Globe },
  ].filter((link) => link.href);

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-32 text-center sm:px-10">
      <FadeIn>
        <SectionHeading number="05" align="center">
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

        <div className="mt-14 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("contact.form.divider")}
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          ref={formRef}
          action={handleSubmit}
          className="mt-8 space-y-4 text-left"
        >
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">{t("contact.form.name")}</Label>
              <Input id="contact-name" name="name" required disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">{t("contact.form.email")}</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-category">{t("contact.form.category")}</Label>
            <Select name="category" defaultValue="feedback" disabled={isPending}>
              <SelectTrigger id="contact-category" className="w-full">
                <SelectValue>{(value: string) => categoryLabels[value] ?? categoryLabels.feedback}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">{categoryLabels.feedback}</SelectItem>
                <SelectItem value="collaboration">{categoryLabels.collaboration}</SelectItem>
                <SelectItem value="other">{categoryLabels.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message">{t("contact.form.message")}</Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder={t("contact.form.messagePlaceholder")}
              required
              disabled={isPending}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? t("contact.form.submitting") : t("contact.form.submit")}
          </Button>
        </form>
      </FadeIn>
    </section>
  );
}
