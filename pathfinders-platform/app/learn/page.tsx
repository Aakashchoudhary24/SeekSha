"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  BookOpen,
  Play,
  Clock,
  Star,
  Users,
  Bot,
  User,
  Sparkles,
  Search,
  Award,
  Target,
  TrendingUp,
  File as Fire,
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  thumbnail: string;
  progress?: number;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Career Planning",
    description: "Learn the fundamentals of career planning and goal setting",
    duration: "2 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    thumbnail: "/career-planning-course.jpg",
    progress: 75,
  },
  {
    id: "2",
    title: "Resume Writing Masterclass",
    description: "Create compelling resumes that get you noticed by employers",
    duration: "3 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 2100,
    thumbnail: "/resume-writing-course.jpg",
    progress: 30,
  },
  {
    id: "3",
    title: "Interview Skills Workshop",
    description: "Master the art of interviewing and land your dream job",
    duration: "4 hours",
    level: "Intermediate",
    rating: 4.7,
    students: 1800,
    thumbnail: "/interview-skills-course.jpg",
  },
  {
    id: "4",
    title: "Networking for Success",
    description:
      "Build meaningful professional relationships and expand your network",
    duration: "2.5 hours",
    level: "Beginner",
    rating: 4.6,
    students: 950,
    thumbnail: "/networking-course.jpg",
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI Career Assistant. I'm here to help you with career guidance, course recommendations, and answer any questions you might have about your professional journey. How can I assist you today?",
    sender: "assistant",
    timestamp: new Date(),
  },
];

export default function LearnPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#8b4513] mb-2">
                  Learn & Grow
                </h1>
                <p className="text-[#a0826d]">
                  Discover courses tailored to your career journey
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0826d] w-5 h-5" />
                <Input
                  placeholder="Search a course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#e5e1dc] focus:border-[#d4621a] bg-white"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-r from-[#d4621a] to-[#b8541a] text-white border-none overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-3">
                          Ready to keep learning?
                        </h2>
                        <p className="text-white/90 mb-6 text-lg">
                          Let's keep your learning journey going. You're just
                          one step closer to your goals.
                        </p>
                        <div className="flex gap-4">
                          <Button
                            variant="secondary"
                            className="bg-white text-[#8b4513] hover:bg-white/90 font-semibold"
                          >
                            Resume Last Course
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-[#8b4513] bg-transparent"
                          >
                            Explore New Courses
                          </Button>
                        </div>
                      </div>

                      {/* Decorative Icons */}
                      <div className="hidden md:flex items-center space-x-4 opacity-20">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6" />
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Award className="w-7 h-7" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="bg-white border-none p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-lg font-bold text-[#8b4513] leading-tight">
                    3
                  </span>
                  <span className="text-xs text-[#a0826d] font-medium truncate">
                    Courses
                  </span>
                </Card>
                <Card className="bg-white border-none p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-lg font-bold text-[#8b4513] leading-tight">
                    2
                  </span>
                  <span className="text-xs text-[#a0826d] font-medium truncate">
                    Certificates
                  </span>
                </Card>
                <Card className="bg-white border-none p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-lg font-bold text-[#8b4513] leading-tight">
                    18.5
                  </span>
                  <span className="text-xs text-[#a0826d] font-medium truncate">
                    Hours
                  </span>
                </Card>
                <Card className="bg-white border-none p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-lg font-bold text-[#8b4513] leading-tight">
                    3
                  </span>
                  <span className="text-xs text-[#a0826d] font-medium truncate">
                    Streak
                  </span>
                </Card>
              </motion.div>

              {/* Continue Learning Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#8b4513]">
                    Continue Learning
                  </h2>
                  <Button
                    variant="ghost"
                    className="text-[#d4621a] hover:text-[#b8541a]"
                  >
                    See All
                  </Button>
                </div>

                <Card className="bg-white border-[#e5e1dc] p-6">
                  <div className="flex items-center gap-6">
                    <img
                      src="/person-learning-python-programming.jpg"
                      alt="Course thumbnail"
                      className="w-48 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Badge className="bg-[#d4621a]/10 text-[#d4621a] mb-2">
                        CODING
                      </Badge>
                      <h3 className="text-xl font-bold text-[#8b4513] mb-2">
                        Mastering Python Basics
                      </h3>
                      <p className="text-[#a0826d] mb-3">
                        Next Module: Functions & Modules
                      </p>
                      <div className="w-full bg-[#e5e1dc] rounded-full h-2 mb-4">
                        <div
                          className="bg-[#d4621a] h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <Button className="bg-[#d4621a] hover:bg-[#b8541a] text-white">
                        Resume Course
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* For You Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#8b4513]">For You</h2>
                  <Button
                    variant="ghost"
                    className="text-[#d4621a] hover:text-[#b8541a]"
                  >
                    See All
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.slice(0, 6).map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="bg-white border-[#e5e1dc] hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative">
                          <img
                            src={
                              course.thumbnail ||
                              `/placeholder.svg?height=200&width=300&query=${course.title}`
                            }
                            alt={course.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge
                              className={`${getLevelColor(
                                course.level
                              )} text-xs font-medium`}
                            >
                              {course.level.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-[#8b4513] mb-2 group-hover:text-[#d4621a] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-[#6b5b73] text-sm mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-[#a0826d] mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              <span>{course.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-[#a0826d]">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-[#d4621a] hover:bg-[#b8541a] text-white"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Learning Boy Graphic */}
              <div className="flex flex-col items-center justify-center pt-2 pb-3 -mt-4">
                <img
                  src="/learning-boy.jpg"
                  alt="Learning Boy"
                  className="w-64 h-64 object-contain rounded-xl"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    background: "#f5f3f0",
                    borderRadius: "1rem",
                  }}
                />
              </div>

              {/* AI Chat Assistant */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white border-[#e5e1dc] shadow-lg h-[500px] flex flex-col">
                  <CardHeader className="pb-4 border-b border-[#e5e1dc]">
                    <CardTitle className="text-lg text-[#8b4513] flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#d4621a] to-[#b8541a] rounded-full flex items-center justify-center mr-3">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      AI Assistant
                      <Sparkles className="w-4 h-4 ml-2 text-[#d4621a]" />
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 ${
                              message.sender === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                            }`}
                          >
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              {message.sender === "assistant" ? (
                                <div className="w-full h-full bg-gradient-to-r from-[#d4621a] to-[#b8541a] rounded-full flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <>
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback className="bg-[#8b4513] text-white text-xs">
                                    <User className="w-3 h-3" />
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div
                              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                message.sender === "user"
                                  ? "bg-[#d4621a] text-white"
                                  : "bg-[#f5f3f0] text-[#6b5b73] border border-[#e5e1dc]"
                              }`}
                            >
                              <p className="leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex items-start gap-3">
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              <div className="w-full h-full bg-gradient-to-r from-[#d4621a] to-[#b8541a] rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            </Avatar>
                            <div className="bg-[#f5f3f0] text-[#6b5b73] border border-[#e5e1dc] rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-[#d4621a] rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-[#d4621a] rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-[#d4621a] rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-[#e5e1dc]">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask me anything..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 border-[#e5e1dc] focus:border-[#d4621a] text-sm"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          size="sm"
                          className="bg-[#d4621a] hover:bg-[#b8541a] text-white px-3"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
