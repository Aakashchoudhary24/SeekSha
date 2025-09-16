import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { AccessibilityProvider } from "@/components/accessibility-provider";

export const metadata: Metadata = {
  title: "PathFinders - Your Personalized Career & Education Advisor",
  description:
    "Discover your potential, explore career paths, and build your future with AI-powered guidance tailored just for you.",
  generator: "PathFinders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  );
}
