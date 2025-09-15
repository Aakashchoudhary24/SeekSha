"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MessageCircle, Users, ChevronUp, Filter } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    initials: string
  }
  createdAt: string
  commentsCount: number
  upvotes: number
  tags: string[]
  category: string
}

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Need guidance on College Admission in CSE",
    content:
      "I'm exploring admission opportunities in Computer Science and Engineering (CSE) and would love to hear from this community. What factors should I consider while choosing a college for CSE (placements, faculty, labs, research, coding culture, etc.)? Are there any particular colleges you'd recommend that have a strong IT/CS program? How important are internships, coding clubs, and project opportunities compared to rankings? For...",
    author: {
      name: "acmarkrishnak2005",
      avatar: "",
      initials: "A",
    },
    createdAt: "15/09/2025",
    commentsCount: 0,
    upvotes: 1,
    tags: ["engineering", "advice"],
    category: "Academic",
  },
  {
    id: "2",
    title: "Help With Resume Creation",
    content:
      "I am new to this job search buisness soo would be interested in knowing how to create and design a good ATS friendly resume. I would like to score jobs in the IT Industry",
    author: {
      name: "kurtsony16",
      avatar: "",
      initials: "K",
    },
    createdAt: "13/09/2025",
    commentsCount: 1,
    upvotes: 4,
    tags: ["resume", "job", "FAANG", "help"],
    category: "Career",
  },
]

const categories = ["All Categories", "Academic", "Career", "Technical", "General"]

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
    ]
    return colors[tag.length % colors.length]
  }

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#d4621a] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#8b4513]">Community Forum</h1>
                  <p className="text-[#a0826d] text-lg">Connect, share, and learn with your peers.</p>
                </div>
              </div>
              <Button className="bg-[#d4621a] hover:bg-[#b8541a] text-white px-6 py-3 text-base">
                <Plus className="w-5 h-5 mr-2" />
                Create Post
              </Button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a0826d] w-5 h-5" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-[#e5e1dc] focus:border-[#d4621a] bg-white"
                />
              </div>
              <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12 border-[#e5e1dc] focus:border-[#d4621a] bg-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Forum Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white border-[#e5e1dc] hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {/* Upvote Section */}
                      <div className="flex flex-col items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto hover:bg-[#d4621a]/10 hover:text-[#d4621a]"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </Button>
                        <span className="text-2xl font-bold text-[#8b4513]">{post.upvotes}</span>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h2 className="text-xl font-bold text-[#8b4513] hover:text-[#d4621a] transition-colors leading-tight">
                            {post.title}
                          </h2>
                        </div>

                        <p className="text-[#6b5b73] leading-relaxed mb-4 line-clamp-3">{post.content}</p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <Badge key={tag} className={`${getTagColor(tag)} text-xs font-medium`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Post Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs bg-[#d4621a] text-white">
                                  {post.author.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-[#a0826d]">
                                Posted by <span className="font-medium">{post.author.name}</span>
                              </span>
                            </div>
                            <span className="text-sm text-[#a0826d]">{post.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-[#a0826d]">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.commentsCount} Comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-[#a0826d] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#8b4513] mb-2">No discussions found</h3>
              <p className="text-[#a0826d] mb-4">Be the first to start a conversation or adjust your search criteria</p>
              <Button className="bg-[#d4621a] hover:bg-[#b8541a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
