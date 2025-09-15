"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, BookOpen, Play, Clock, Star, Users, ChevronRight, Bot, User, Sparkles } from "lucide-react"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: string
  rating: number
  students: number
  thumbnail: string
  progress?: number
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
    description: "Build meaningful professional relationships and expand your network",
    duration: "2.5 hours",
    level: "Beginner",
    rating: 4.6,
    students: 950,
    thumbnail: "/networking-course.jpg",
  },
]

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI Career Assistant. I'm here to help you with career guidance, course recommendations, and answer any questions you might have about your professional journey. How can I assist you today?",
    sender: "assistant",
    timestamp: new Date(),
  },
]

export default function LearnPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your interests, I'd recommend exploring the courses in our learning library. The 'Introduction to Career Planning' course would be a perfect starting point.",
        "I can help you with that! Let me suggest some resources that align with your career goals. Have you considered taking our 'Resume Writing Masterclass'?",
        "Excellent! Career development is a journey, and I'm here to guide you every step of the way. What specific area would you like to focus on first?",
        "That's wonderful to hear! Based on your profile, I think you'd benefit from our 'Interview Skills Workshop'. It's designed to help you feel confident in any interview situation.",
      ]

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-[#8b4513] mb-4">Learn & Grow</h1>
            <p className="text-[#d4621a] text-lg">Enhance your skills with our curated courses and AI assistant</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Courses Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#8b4513] flex items-center">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Featured Courses
                  </h2>
                  <Button
                    variant="outline"
                    className="border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
                  >
                    View All Courses
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-white border-[#e5e1dc] hover:shadow-lg transition-all duration-300 h-full">
                        <div className="relative">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          {course.progress && (
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-black/50 rounded-full p-2">
                                <div className="flex items-center justify-between text-white text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-1">
                                  <div
                                    className="bg-white h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold text-[#8b4513] leading-tight">{course.title}</h3>
                            <Badge className={`${getLevelColor(course.level)} text-xs font-medium ml-2`}>
                              {course.level}
                            </Badge>
                          </div>

                          <p className="text-[#6b5b73] text-sm leading-relaxed mb-4">{course.description}</p>

                          <div className="flex items-center justify-between text-sm text-[#a0826d] mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              <span className="font-medium">{course.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                          </div>

                          <Button className="w-full bg-[#d4621a] hover:bg-[#b8541a] text-white">
                            <Play className="w-4 h-4 mr-2" />
                            {course.progress ? "Continue Learning" : "Start Course"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Chat Assistant */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white border-[#e5e1dc] shadow-lg h-[600px] flex flex-col">
                  <CardHeader className="pb-4 border-b border-[#e5e1dc]">
                    <CardTitle className="text-xl text-[#8b4513] flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#d4621a] to-[#b8541a] rounded-full flex items-center justify-center mr-3">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      AI Career Assistant
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
                              message.sender === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              {message.sender === "assistant" ? (
                                <div className="w-full h-full bg-gradient-to-r from-[#d4621a] to-[#b8541a] rounded-full flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <>
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback className="bg-[#8b4513] text-white">
                                    <User className="w-4 h-4" />
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender === "user"
                                  ? "bg-[#d4621a] text-white"
                                  : "bg-[#f5f3f0] text-[#6b5b73] border border-[#e5e1dc]"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
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
                          placeholder="Ask me anything about your career..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 border-[#e5e1dc] focus:border-[#d4621a]"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          className="bg-[#d4621a] hover:bg-[#b8541a] text-white px-4"
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
  )
}
