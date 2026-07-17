import type { Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { SplashScreen } from "@/components/splash-screen";
import { AuroraBackground } from "@/components/aurora-background";
import { LocaleProvider, LOCALE_COOKIE } from "@/lib/i18n/locale-context";
import type { Locale } from "@/lib/i18n/dictionaries";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Grotesque modern & tegas untuk seluruh teks + mono untuk label teknis.
// Menjauh dari font generik (Inter/Geist/Arial/Space Grotesk).
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Personal Page",
  description: "Personal page & portfolio",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    // Favicon adaptif: versi yang cocok dengan tema browser (light/dark).
    icon: [
      { url: "/assets/logo/Logo_bg_light.png", media: "(prefers-color-scheme: light)" },
      { url: "/assets/logo/Logo_bg_dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/assets/logo/Logo_bg_light.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get(LOCALE_COOKIE)?.value as Locale) || "id";

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      className={`${schibsted.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SplashScreen />
          <AuroraBackground />
          <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
