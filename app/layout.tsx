import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Fits | See it. Grab it. Own it.",
  description: "Your digital wardrobe and AI stylist.",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${playfair.variable} font-body antialiased bg-bg text-tx`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: 'var(--bg-surface)',
                color: 'var(--tx)',
                border: '1px solid var(--border)',
                borderRadius: '0px'
              }
            }}/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
