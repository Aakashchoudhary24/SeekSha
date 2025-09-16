"use client";

import { useState, useEffect } from "react";
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
  Lock,
  PersonStanding,
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
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; avatar: string; points: number }>({
    name: "",
    avatar: "",
    points: 0,
  });

  useEffect(() => {
    // Load user from localStorage if exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name || "User",
        avatar: parsed.avatar || "/placeholder.svg",
        points: 64, // you can replace with real points if you store it somewhere
      });
    }
  }, []);

  return (
    <div className="w-64 h-screen bg-[#f5f3f0] border-r border-[#e5e1dc] flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#e5e1dc]">
        <h1 className="text-lg font-bold text-[#8b4513]">PathFinders</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
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

      {/* User Profile */}
      <div className="p-4 border-t border-[#e5e1dc]">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-[#d4621a] text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#8b4513] truncate">{user.name}</p>
            <Badge variant="secondary" className="bg-[#d4621a] text-white text-xs px-2 py-0">
              {user.points} points
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
