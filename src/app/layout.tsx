import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawSearchDarkDesk — Zero-FP Solana Migration Engine",
  description:
    "Autonomous AST codemods verified by an adversarial AI-compiler loop. Open live PRs with zero false positives.",
  metadataBase: new URL("https://clawsearchdarkdesk.vercel.app"),
  openGraph: {
    title: "ClawSearchDarkDesk — Zero-FP Solana Migration Engine",
    description:
      "Compiler-in-the-loop AI codemods that migrate @solana/web3.js to @solana/kit with zero false positives.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawSearchDarkDesk — Zero-FP Solana Migration Engine",
    description:
      "Compiler-in-the-loop AI codemods that migrate @solana/web3.js to @solana/kit with zero false positives.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground noise-overlay">
        {children}
      </body>
    </html>
  );
}
