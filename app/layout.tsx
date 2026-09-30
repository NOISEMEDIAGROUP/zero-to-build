import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const barlowCondensed = Barlow_Condensed({ variable: "--font-barlow-condensed", subsets: ["latin"], weight: ["600", "700"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noisemediagroup.github.io/zero-to-build/"),
  title: "Zero to Build | Noise technical tutorials",
  description: "Session 1 of the Noise technical tutorials: vibe coding in the terminal with Codex. Walk in with no coding experience, leave with a platform of your own.",
  openGraph: {
    title: "Zero to Build | Noise technical tutorials",
    description: "Vibe coding in the terminal with Codex: from your first prompt to shipping your own page. Noise internal training, session 1 of 4.",
    images: [{ url: "noise-logo-black.png", width: 1920, height: 830, alt: "Noise Media" }],
  },
  twitter: {
    card: "summary",
    title: "Zero to Build | Noise technical tutorials",
    description: "Vibe coding in the terminal with Codex: from your first prompt to shipping your own page. Noise internal training, session 1 of 4.",
    images: ["noise-logo-black.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${dmSans.variable} ${barlowCondensed.variable}`}>{children}</body></html>;
}
