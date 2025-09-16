"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/components/accessibility-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Brain,
  BarChart3,
  Map,
  GraduationCap,
  Users,
  FileText,
  MessageCircle,
  Trophy,
  Settings,
  RefreshCw,
  Sparkles,
  Lock,
  PersonStanding,
  Sun,
  Volume2,
  Languages,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Quiz", href: "/quiz", icon: Brain },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Colleges", href: "/colleges", icon: GraduationCap },
  { name: "Community", href: "/community", icon: Users },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Chat Assistant", href: "/chat", icon: MessageCircle },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Auth", href: "/auth", icon: Lock },
  { name: "Account", href: "/account", icon: PersonStanding },
];

export function Sidebar() {
  const { textSize, setTextSize, voiceEnabled, setVoiceEnabled, speak } =
    useAccessibility();
  const pathname = usePathname();
  const [user, setUser] = useState({
    name: "Guest",
    points: 0,
    avatar: "/placeholder.svg",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || "Guest",
        avatar: parsedUser.avatar || "/placeholder.svg",
        points: parsedUser.points || 0,
      });
    }
  }, []);

  return (
    <div className="w-64 h-screen bg-[#f5f3f0] border-r border-[#e5e1dc] flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#e5e1dc]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#d4621a] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#8b4513]">PathFinders</h1>
            <p className="text-xs text-[#a0826d]">Enhanced Learning</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-[#e5e1dc] cen">
        <div className="flex space-x-2 items-center relative">
          {/* 1st button: Home */}
          <button
            className="p-2 rounded-lg bg-[#e5e1dc] hover:bg-[#d4c5b9] transition-colors"
            onClick={() => {
              speak("Navigated to Home page");
              window.location.href = "/";
            }}
            title="Home"
          >
            <Home className="w-4 h-4 text-[#8b4513]" />
          </button>
          {/* 2nd button: Theme (placeholder, can be replaced with actual theme logic) */}
          <button
            className="p-2 rounded-lg bg-[#e5e1dc] hover:bg-[#d4c5b9] transition-colors"
            title="Theme"
          >
            <Sun className="w-4 h-4 text-[#8b4513]" />
          </button>
          {/* 3rd button: Dictator (voice) */}
          <button
            className={`p-2 rounded-lg ${
              voiceEnabled
                ? "bg-[#d4621a] text-white"
                : "bg-[#e5e1dc] text-[#8b4513]"
            } hover:bg-[#d4c5b9] transition-colors`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={
              voiceEnabled ? "Disable voice narrator" : "Enable voice narrator"
            }
          >
            <Volume2 className="w-4 h-4" />
          </button>
          {/* 4th button: Accessibility (text size) */}
          {/* 4th button: Accessibility (Languages icon, can be used for other accessibility features) */}
          <button
            className="p-2 rounded-lg bg-[#e5e1dc] hover:bg-[#d4c5b9] transition-colors"
            title="Accessibility"
            // Placeholder for future accessibility features
          >
            <Languages className="w-4 h-4" />
          </button>
          {/* 5th button: Text size dropdown (T icon) */}
          <div className="relative group">
            <button
              className="p-2 rounded-lg bg-[#e5e1dc] hover:bg-[#d4c5b9] transition-colors"
              title="Text size options"
              aria-haspopup="true"
              aria-expanded="false"
              tabIndex={0}
            >
              <Type className="w-4 h-4 text-[#8b4513]" />
            </button>
            <div className="absolute left-full top-0 ml-2 w-40 bg-white border border-[#e5e1dc] rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-auto z-[9999] transition-opacity">
              <button
                onClick={() => setTextSize("small")}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  textSize === "small"
                    ? "bg-[#d4621a] text-white"
                    : "text-[#8b4513]"
                }`}
              >
                Small Text
              </button>
              <button
                onClick={() => setTextSize("medium")}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  textSize === "medium"
                    ? "bg-[#d4621a] text-white"
                    : "text-[#8b4513]"
                }`}
              >
                Medium Text
              </button>
              <button
                onClick={() => setTextSize("large")}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  textSize === "large"
                    ? "bg-[#d4621a] text-white"
                    : "text-[#8b4513]"
                }`}
              >
                Large Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-[#a0826d] uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#d4621a] text-white shadow-sm"
                      : "text-[#8b4513] hover:bg-[#e5e1dc] hover:text-[#6b3410]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[#e5e1dc]">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#d4621a] text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#8b4513] truncate">
              {user.name}
            </p>
            <div className="flex items-center space-x-1">
              <Badge
                variant="secondary"
                className="bg-[#d4621a] text-white text-xs px-2 py-0"
              >
                {user.points} points
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
