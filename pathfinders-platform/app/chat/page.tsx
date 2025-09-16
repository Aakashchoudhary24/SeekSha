"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Sparkles, Lightbulb, Clock } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const suggestedQuestions = [
  "What career paths match my interests in technology?",
  "How do I prepare for engineering entrance exams?",
  "What skills should I develop for data science?",
  "Tell me about different medical specializations",
  "How to choose between arts and science streams?",
  "What are the emerging career opportunities?",
]

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI career counselor. I'm here to help you explore career paths, understand different professions, and guide you through your educational journey. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: messages })
      })
      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "Sorry, I couldn't get a response from the AI.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  // Removed generatePlaceholderResponse. Now using real API.

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <Sidebar />
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border border-[#e5e1dc] shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#d4621a] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#8b4513]">AI Career Assistant</h1>
                <p className="text-sm text-[#a0826d]">Your personal career guidance counselor</p>
              </div>
            </div>
            <Badge className="bg-[#d4621a] text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col bg-white border-[#e5e1dc] shadow-sm">
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          {message.role === "user" ? (
                            <>
                              <AvatarImage src="/student-avatar.png" />
                              <AvatarFallback className="bg-[#8b4513] text-white">
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="bg-[#d4621a] text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-[#d4621a] text-white"
                            : "bg-[#f5f3f0] text-[#8b4513] border border-[#e5e1dc]"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-orange-100" : "text-[#a0826d]"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-3 max-w-[80%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#d4621a] text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-[#f5f3f0] text-[#8b4513] border border-[#e5e1dc] rounded-lg p-3">
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
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-[#e5e1dc]">
              <h3 className="text-sm font-medium text-[#8b4513] mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Suggested Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="text-left p-2 text-xs text-[#8b4513] bg-[#f5f3f0] border border-[#e5e1dc] rounded-lg hover:bg-[#e5e1dc] transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-[#e5e1dc]">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about careers, education, or your future path..."
                className="flex-1 border-[#e5e1dc] focus:border-[#d4621a] focus:ring-[#d4621a]"
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-[#d4621a] hover:bg-[#b8541a] text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-[#a0826d] mt-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              AI responses are generated to help guide your career decisions
            </p>
          </div>
        </Card>
      </div>
    </main>
  </div>
  )
}

