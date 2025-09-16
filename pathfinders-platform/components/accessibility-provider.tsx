"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AccessibilityContextType {
  textSize: "small" | "medium" | "large";
  setTextSize: (size: "small" | "medium" | "large") => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const pathname = usePathname();

  // Apply text size to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-small", "text-medium", "text-large");
    root.classList.add(`text-${textSize}`);
  }, [textSize]);

  // Voice navigation announcements
  useEffect(() => {
    if (voiceEnabled && pathname) {
      const pageName = getPageName(pathname);
      speak(`Navigated to ${pageName}`);
    }
  }, [pathname, voiceEnabled]);

  const speak = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  const getPageName = (path: string): string => {
    const routes: Record<string, string> = {
      "/": "Home page",
      "/learn": "Learn page",
      "/quiz": "Quiz page",
      "/dashboard": "Dashboard page",
      "/roadmap": "Roadmap page",
      "/colleges": "Colleges page",
      "/community": "Community page",
      "/notes": "Notes page",
      "/chat": "Chat Assistant page",
      "/leaderboard": "Leaderboard page",
    };
    return routes[path] || "Unknown page";
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        voiceEnabled,
        setVoiceEnabled,
        speak,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}
