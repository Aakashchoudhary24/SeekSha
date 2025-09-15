"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Heart, User, Briefcase, BookOpen, Bot, Calendar } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: "Personal" | "Career Planning" | "Course Notes" | "AI Conversations"
  tags: string[]
  createdAt: string
  isFavorite: boolean
  color: string
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "College Application Checklists",
    content:
      "1. Research colleges and programs 2. Prepare entrance exams (JEE, NEET, CAT) 3. Gather required documents 4. Write statement of purpose 5. Apply for...",
    category: "Personal",
    tags: ["college", "applications", "checklist"],
    createdAt: "15/09/2025",
    isFavorite: false,
    color: "bg-blue-50",
  },
  {
    id: "2",
    title: "Resume Building Tips",
    content:
      "Keep your resume ATS-friendly: use simple formatting, standard headings, and relevant keywords. Highlight technical skills, projects, and achievements with...",
    category: "Personal",
    tags: ["resume", "job-friendly"],
    createdAt: "15/09/2025",
    isFavorite: true,
    color: "bg-yellow-50",
  },
  {
    id: "3",
    title: "Interview Preparation Tips",
    content:
      "Technical interviews: Practice coding problems, system design, and domain-specific questions. Behavioral interviews: Use STAR method (Situation, Task, Action...",
    category: "Career Planning",
    tags: ["interviews", "job search", "preparation"],
    createdAt: "12/09/2025",
    isFavorite: false,
    color: "bg-orange-50",
  },
  {
    id: "4",
    title: "Machine Learning Fundamentals",
    content:
      "Core concepts: Supervised learning (classification, regression), Unsupervised learning (clustering, dimensionality reduction), Reinforcement learning. Key...",
    category: "Course Notes",
    tags: ["machine learning", "algorithms", "AI"],
    createdAt: "12/09/2025",
    isFavorite: true,
    color: "bg-green-50",
  },
  {
    id: "5",
    title: "AI Assistant Conversation - Career Advice",
    content:
      "Asked about transitioning from engineering to data science. AI suggested: 1) Learn Python and SQL, 2) Complete online courses in statistics, 3) Build portfolio...",
    category: "AI Conversations",
    tags: [],
    createdAt: "10/09/2025",
    isFavorite: false,
    color: "bg-purple-50",
  },
  {
    id: "6",
    title: "College Application Checklist",
    content:
      "1. Research colleges and programs 2. Prepare entrance exams (JEE, NEET, CAT) 3. Gather required documents 4. Write statement of purpose 5. Apply for...",
    category: "Personal",
    tags: [],
    createdAt: "08/09/2025",
    isFavorite: false,
    color: "bg-yellow-50",
  },
  {
    id: "7",
    title: "Data Science Career Path",
    content:
      "Key skills needed: Python, R, SQL, Statistics, Machine Learning, Data Visualization. Popular tools: Jupyter, Pandas, Matplotlib, Scikit-learn. Career...",
    category: "Career Planning",
    tags: [],
    createdAt: "05/09/2025",
    isFavorite: false,
    color: "bg-blue-50",
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const categories = ["All Categories", "Personal", "Career Planning", "Course Notes", "AI Conversations"]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalNotes: notes.length,
    favorites: notes.filter((note) => note.isFavorite).length,
    courseNotes: notes.filter((note) => note.category === "Course Notes").length,
    aiConversations: notes.filter((note) => note.category === "AI Conversations").length,
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Personal":
        return <User className="w-4 h-4" />
      case "Career Planning":
        return <Briefcase className="w-4 h-4" />
      case "Course Notes":
        return <BookOpen className="w-4 h-4" />
      case "AI Conversations":
        return <Bot className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Personal":
        return "bg-blue-100 text-blue-700"
      case "Career Planning":
        return "bg-orange-100 text-orange-700"
      case "Course Notes":
        return "bg-green-100 text-green-700"
      case "AI Conversations":
        return "bg-purple-100 text-purple-700"
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
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#d4621a] rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#8b4513]">My Notes</h1>
                  <p className="text-[#d4621a] text-lg">Organize your learning journey with smart notes</p>
                </div>
              </div>
              <Button className="bg-[#d4621a] hover:bg-[#b8541a] text-white px-6 py-3 text-base">
                <Plus className="w-5 h-5 mr-2" />
                New Note
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
                  placeholder="Search notes, tags, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-[#e5e1dc] focus:border-[#d4621a] bg-white"
                />
              </div>
              <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12 border-[#e5e1dc] focus:border-[#d4621a] bg-white">
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
                <Button
                  variant="outline"
                  className="h-12 px-6 border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#8b4513] mb-1">{stats.totalNotes}</div>
                <div className="text-[#d4621a] font-medium">Total Notes</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#8b4513] mb-1">{stats.favorites}</div>
                <div className="text-[#d4621a] font-medium">Favorites</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#8b4513] mb-1">{stats.courseNotes}</div>
                <div className="text-[#d4621a] font-medium">Course Notes</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#8b4513] mb-1">{stats.aiConversations}</div>
                <div className="text-[#d4621a] font-medium">AI Conversations</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card
                  className={`${note.color} border-[#e5e1dc] hover:shadow-lg transition-all duration-300 h-full cursor-pointer group`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(note.category)}`}
                      >
                        {getCategoryIcon(note.category)}
                        {note.category}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <Edit className="w-4 h-4 text-[#8b4513]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-[#8b4513] leading-tight line-clamp-2">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-[#6b5b73] text-sm leading-relaxed line-clamp-4 mb-4">{note.content}</p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-[#d4621a]/10 text-[#d4621a] hover:bg-[#d4621a]/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-[#a0826d]">
                        <Calendar className="w-3 h-3 mr-1" />
                        {note.createdAt}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Edit className="w-4 h-4 text-[#d4621a]" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Trash2 className="w-4 h-4 text-[#8b4513]" />
                        </Button>
                        {note.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
