import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawSearch DarkDesk — OTC Real World Assets",
  description:
    "Institutional dark pool for tokenized Real World Assets, featuring iExec Confidential Tokens and AI-brokered negotiations.",
  metadataBase: new URL("https://clawsearchdarkdesk.vercel.app"),
  openGraph: {
    title: "ClawSearch DarkDesk — OTC Real World Assets",
    description:
      "Institutional dark pool for RWAs with confidential settlement.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawSearch DarkDesk",
    description: "Confidential OTC Dark Pool for RWAs.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200 noise-overlay font-sans selection:bg-cyan-500/30">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
