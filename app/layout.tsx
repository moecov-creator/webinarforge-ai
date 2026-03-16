// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WebinarForge AI — The AI OS for Evergreen Webinars",
    template: "%s | WebinarForge AI",
  },
  description:
    "Generate webinar scripts, slide outlines, evergreen rooms, timed comments, affiliate funnels, and AI presenter delivery in one platform.",
  keywords: ["webinar", "AI", "evergreen webinar", "webinar automation", "webinar script generator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "WebinarForge AI",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${syne.variable}`}>
        <body className="font-sans antialiased bg-background text-foreground">
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
