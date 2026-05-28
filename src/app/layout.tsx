 import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "VisionaryPort | Premium Artist Portfolio",
  description: "A premium, media-centric portfolio platform for digital creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700;1,900&family=Syncopate:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="font-inter"
        style={{
          "--font-bebas": '"Bebas Neue", sans-serif',
          "--font-syne": '"Syne", sans-serif',
          "--font-inter": '"Inter", sans-serif',
          "--font-syncopate": '"Syncopate", sans-serif',
          "--font-playfair": '"Playfair Display", serif',
        } as React.CSSProperties}
      >
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
