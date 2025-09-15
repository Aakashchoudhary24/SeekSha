"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Star, Trophy, Target, Heart, Zap, ArrowRight, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  options: string[]
  category: string
  points: number
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of environment do you thrive in?",
    options: [
      "Collaborative team settings",
      "Independent work spaces",
      "Dynamic, fast-paced environments",
      "Structured, organized environments",
    ],
    category: "Work Style",
    points: 10,
  },
  {
    id: 2,
    question: "Which activity sounds most appealing to you?",
    options: ["Solving complex problems", "Creating something new", "Helping others succeed", "Leading a team project"],
    category: "Interests",
    points: 15,
  },
  {
    id: 3,
    question: "What motivates you most in your work?",
    options: ["Making a positive impact", "Financial success", "Personal growth", "Recognition and achievement"],
    category: "Values",
    points: 20,
  },
  {
    id: 4,
    question: "How do you prefer to learn new skills?",
    options: ["Hands-on practice", "Reading and research", "Group discussions", "Online courses and videos"],
    category: "Learning Style",
    points: 10,
  },
  {
    id: 5,
    question: "Which subject area interests you most?",
    options: ["Science and Technology", "Arts and Humanities", "Business and Economics", "Social Sciences"],
    category: "Academic Interest",
    points: 25,
  },
  {
    id: 6,
    question: "What's your ideal work-life balance?",
    options: [
      "Flexible hours, work from anywhere",
      "Standard 9-5 with clear boundaries",
      "Intense periods with long breaks",
      "Project-based with variety",
    ],
    category: "Lifestyle",
    points: 15,
  },
  {
    id: 7,
    question: "How do you handle challenges?",
    options: [
      "Break them down systematically",
      "Brainstorm creative solutions",
      "Seek advice from others",
      "Take immediate action",
    ],
    category: "Problem Solving",
    points: 20,
  },
  {
    id: 8,
    question: "What type of impact do you want to make?",
    options: [
      "Innovate and create new technologies",
      "Educate and inspire others",
      "Build and grow businesses",
      "Improve society and communities",
    ],
    category: "Purpose",
    points: 30,
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [totalPoints, setTotalPoints] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion]
    setAnswers((prev) => ({ ...prev, [question.id]: answer }))
    setTotalPoints((prev) => prev + question.points)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 500)
    } else {
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }

  const handleContinue = () => {
    if (showUpload) {
      router.push("/dashboard")
    } else {
      setShowUpload(true)
    }
  }

  const skipUpload = () => {
    router.push("/dashboard")
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-card border-border text-center">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-secondary-foreground" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl text-card-foreground mb-2">Congratulations!</CardTitle>
              <p className="text-muted-foreground text-lg">You've completed the personality assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions Completed</div>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <Badge className="bg-secondary text-secondary-foreground">
                  <Star className="w-4 h-4 mr-1" />
                  Assessment Complete
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  <Target className="w-4 h-4 mr-1" />
                  Ready for Recommendations
                </Badge>
              </div>

              {!showUpload ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <p className="text-muted-foreground mb-6">
                    Your personalized journey begins here! We'll now create custom career recommendations based on your
                    responses.
                  </p>
                  <Button onClick={handleContinue} size="lg" className="w-full">
                    Continue to Recommendations
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Upload Your Resume (Optional)</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your resume to get even more personalized recommendations
                    </p>
                    <Button variant="outline" className="mb-2 bg-transparent">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX files only</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={skipUpload} variant="outline" className="flex-1 bg-transparent">
                      Skip for Now
                    </Button>
                    <Button onClick={handleContinue} className="flex-1">
                      Continue to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-primary mr-2" />
            <span className="text-2xl font-bold text-foreground">PathFinders</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-secondary text-secondary-foreground">
              <Zap className="w-4 h-4 mr-1" />
              {totalPoints} Points
            </Badge>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {questions[currentQuestion].category}
                  </Badge>
                  <div className="flex items-center text-secondary">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{questions[currentQuestion].points} points</span>
                  </div>
                </div>
                <CardTitle className="text-2xl text-card-foreground text-balance">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className="p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-card-foreground group-hover:text-primary transition-colors">
                          {option}
                        </span>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Motivational Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            <Heart className="w-4 h-4 inline mr-1" />
            Every answer brings you closer to your perfect career path
          </p>
        </div>
      </div>
    </div>
  )
}
