"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Star,
  Trophy,
  Target,
  Heart,
  Zap,
  ArrowRight,
  Sparkles,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
  points: number;
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
    options: [
      "Solving complex problems",
      "Creating something new",
      "Helping others succeed",
      "Leading a team project",
    ],
    category: "Interests",
    points: 15,
  },
  {
    id: 3,
    question: "What motivates you most in your work?",
    options: [
      "Making a positive impact",
      "Financial success",
      "Personal growth",
      "Recognition and achievement",
    ],
    category: "Values",
    points: 20,
  },
  {
    id: 4,
    question: "How do you prefer to learn new skills?",
    options: [
      "Hands-on practice",
      "Reading and research",
      "Group discussions",
      "Online courses and videos",
    ],
    category: "Learning Style",
    points: 10,
  },
  {
    id: 5,
    question: "Which subject area interests you most?",
    options: [
      "Science and Technology",
      "Arts and Humanities",
      "Business and Economics",
      "Social Sciences",
    ],
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
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string>("");
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const router = useRouter();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion];
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    setTotalPoints((prev) => prev + question.points);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  const generateAIRecommendations = async () => {
    setIsGeneratingRecommendations(true);

    // Prepare user responses for AI analysis
    const userProfile = questions.map((q) => ({
      question: q.question,
      answer: answers[q.id],
      category: q.category,
    }));

    try {
      // TODO: Replace with actual AI API call
      // const response = await fetch('/api/career-recommendations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userProfile, totalPoints })
      // })
      // const data = await response.json()
      // setAiRecommendations(data.recommendations)

      // Placeholder AI recommendations - replace with actual API
      const recommendations = generatePlaceholderRecommendations(userProfile);

      setTimeout(() => {
        setAiRecommendations(recommendations);
        setIsGeneratingRecommendations(false);
        setShowRecommendations(true);
      }, 2000);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setIsGeneratingRecommendations(false);
    }
  };

  const generatePlaceholderRecommendations = (profile: any[]): string => {
    const interests =
      profile.find((p) => p.category === "Academic Interest")?.answer || "";
    const workStyle =
      profile.find((p) => p.category === "Work Style")?.answer || "";
    const purpose = profile.find((p) => p.category === "Purpose")?.answer || "";

    let recommendations = "## 🎯 Your Personalized Career Recommendations\n\n";

    if (interests.includes("Science and Technology")) {
      recommendations += "### 💻 Technology & Engineering Paths\n";
      recommendations +=
        "- **Software Engineering**: Build applications and systems\n";
      recommendations +=
        "- **Data Science**: Analyze data to drive decisions\n";
      recommendations +=
        "- **Cybersecurity**: Protect digital infrastructure\n";
      recommendations +=
        "- **AI/ML Engineering**: Develop intelligent systems\n\n";

      recommendations += "### 📚 Recommended Learning Path\n";
      recommendations +=
        "1. Master programming languages (Python, Java, JavaScript)\n";
      recommendations += "2. Build projects and contribute to open source\n";
      recommendations +=
        "3. Pursue computer science or related engineering degree\n";
      recommendations += "4. Gain internship experience at tech companies\n\n";
    }

    if (interests.includes("Business and Economics")) {
      recommendations += "### 💼 Business & Management Paths\n";
      recommendations +=
        "- **Management Consulting**: Solve complex business problems\n";
      recommendations += "- **Product Management**: Lead product development\n";
      recommendations +=
        "- **Investment Banking**: Financial analysis and deals\n";
      recommendations += "- **Entrepreneurship**: Start your own venture\n\n";
    }

    if (purpose.includes("Educate and inspire")) {
      recommendations += "### 🎓 Education & Training Paths\n";
      recommendations +=
        "- **Corporate Training**: Develop professional skills\n";
      recommendations +=
        "- **Educational Technology**: Create learning platforms\n";
      recommendations +=
        "- **Academic Research**: Advance knowledge in your field\n\n";
    }

    recommendations += "### 🚀 Next Steps\n";
    recommendations += "1. Research these career paths in detail\n";
    recommendations += "2. Connect with professionals in these fields\n";
    recommendations += "3. Seek internships or shadowing opportunities\n";
    recommendations +=
      "4. Develop relevant skills through courses and projects\n";
    recommendations +=
      "5. Consider informational interviews with industry experts";

    return recommendations;
  };

  const handleContinue = () => {
    if (!showRecommendations) {
      generateAIRecommendations();
    } else {
      router.push("/dashboard");
    }
  };

  if (showResults) {
    return (
      <div className="flex min-h-screen bg-[#f5f3f0]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <Card className="bg-white border-[#e5e1dc] text-center shadow-lg">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-20 h-20 bg-[#d4621a] rounded-full flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <CardTitle className="text-3xl text-[#8b4513] mb-2">
                  Congratulations!
                </CardTitle>
                <p className="text-[#a0826d] text-lg">
                  You've completed the personality assessment
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#d4621a]">
                      {totalPoints}
                    </div>
                    <div className="text-sm text-[#a0826d]">Points Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8b4513]">
                      {questions.length}
                    </div>
                    <div className="text-sm text-[#a0826d]">
                      Questions Completed
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  <Badge className="bg-[#d4621a] text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Assessment Complete
                  </Badge>
                  <Badge className="bg-[#8b4513] text-white">
                    <Target className="w-4 h-4 mr-1" />
                    Ready for AI Analysis
                  </Badge>
                </div>

                {!showRecommendations ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {isGeneratingRecommendations ? (
                      <div className="space-y-4">
                        <div className="flex justify-center items-center space-x-2 text-[#d4621a]">
                          <Bot className="w-6 h-6 animate-pulse" />
                          <Sparkles className="w-5 h-5 animate-spin" />
                        </div>
                        <p className="text-[#a0826d] mb-6">
                          Our AI is analyzing your responses to create
                          personalized career recommendations...
                        </p>
                        <div className="w-full bg-[#e5e1dc] rounded-full h-2">
                          <div
                            className="bg-[#d4621a] h-2 rounded-full animate-pulse"
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#a0826d] mb-6">
                          Ready to discover your perfect career path? Our AI
                          will analyze your responses and provide personalized
                          recommendations!
                        </p>
                        <Button
                          onClick={handleContinue}
                          size="lg"
                          className="w-full bg-[#d4621a] hover:bg-[#b8541a] text-white"
                        >
                          <Bot className="mr-2 w-5 h-5" />
                          Generate AI Career Recommendations
                          <Sparkles className="ml-2 w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#f5f3f0] border border-[#e5e1dc] rounded-lg p-6 text-left">
                      <div className="flex items-center mb-4">
                        <Bot className="w-6 h-6 text-[#d4621a] mr-2" />
                        <h3 className="text-lg font-semibold text-[#8b4513]">
                          AI Career Analysis
                        </h3>
                      </div>
                      <div className="prose prose-sm max-w-none text-[#8b4513]">
                        {aiRecommendations.split("\n").map((line, index) => {
                          if (line.startsWith("##")) {
                            return (
                              <h2
                                key={index}
                                className="text-xl font-bold text-[#8b4513] mt-4 mb-2"
                              >
                                {line.replace("##", "").trim()}
                              </h2>
                            );
                          }
                          if (line.startsWith("###")) {
                            return (
                              <h3
                                key={index}
                                className="text-lg font-semibold text-[#d4621a] mt-3 mb-2"
                              >
                                {line.replace("###", "").trim()}
                              </h3>
                            );
                          }
                          if (line.startsWith("-")) {
                            return (
                              <li key={index} className="ml-4 mb-1">
                                {line.replace("-", "").trim()}
                              </li>
                            );
                          }
                          if (line.match(/^\d+\./)) {
                            return (
                              <li
                                key={index}
                                className="ml-4 mb-1 list-decimal"
                              >
                                {line.replace(/^\d+\./, "").trim()}
                              </li>
                            );
                          }
                          return line.trim() ? (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          ) : (
                            <br key={index} />
                          );
                        })}
                      </div>
                    </div>
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-[#d4621a] hover:bg-[#b8541a] text-white"
                    >
                      Continue to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9e7d1]">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-[#d4621a] mr-2" />
              <span className="text-2xl font-bold text-[#8b4513]">
                PathFinders
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-[#d4621a] text-white">
                <Zap className="w-4 h-4 mr-1" />
                {totalPoints} Points
              </Badge>
              <Badge className="bg-[#8b4513] text-white">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#8b4513]">
                Progress
              </span>
              <span className="text-sm text-[#a0826d]">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-[#e5e1dc]" />
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
              <Card className="bg-white border-[#e5e1dc] shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-[#f5f3f0] text-[#8b4513] border border-[#e5e1dc]">
                      {questions[currentQuestion].category}
                    </Badge>
                    <div className="flex items-center text-[#d4621a]">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {questions[currentQuestion].points} points
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-[#8b4513] text-balance">
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
                        className="p-4 text-left border border-[#e5e1dc] rounded-lg hover:border-[#d4621a] hover:bg-[#f5f3f0] transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[#8b4513] group-hover:text-[#d4621a] transition-colors">
                            {option}
                          </span>
                          <ArrowRight className="w-5 h-5 text-[#a0826d] group-hover:text-[#d4621a] opacity-0 group-hover:opacity-100 transition-all duration-200" />
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
            <p className="text-[#a0826d]">
              <Heart className="w-4 h-4 inline mr-1" />
              Every answer brings you closer to your perfect career path
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
