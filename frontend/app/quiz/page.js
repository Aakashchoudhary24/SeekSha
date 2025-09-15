"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, quizresponse } from "../../components/entities/";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Award,
  Target,
} from "lucide-react";

const quizQuestions = [
  {
    id: "creativity",
    question: "How do you prefer to solve problems?",
    options: [
      {
        text: "Think outside the box with creative solutions",
        points: 5,
        category: "creative",
      },
      {
        text: "Analyze data and use logical reasoning",
        points: 3,
        category: "analytical",
      },
      {
        text: "Collaborate with others to find solutions",
        points: 4,
        category: "social",
      },
      {
        text: "Take charge and lead the solution process",
        points: 4,
        category: "enterprising",
      },
    ],
  },
  {
    id: "work_environment",
    question: "What type of work environment energizes you most?",
    options: [
      {
        text: "A dynamic startup with lots of change",
        points: 5,
        category: "enterprising",
      },
      {
        text: "A quiet lab or research facility",
        points: 4,
        category: "investigative",
      },
      {
        text: "An open office with team collaboration",
        points: 5,
        category: "social",
      },
      {
        text: "A workshop or hands-on environment",
        points: 4,
        category: "realistic",
      },
    ],
  },
  {
    id: "motivation",
    question: "What motivates you most in your work?",
    options: [
      {
        text: "Making a positive impact on people's lives",
        points: 5,
        category: "social",
      },
      {
        text: "Discovering new knowledge or innovations",
        points: 5,
        category: "investigative",
      },
      {
        text: "Building something tangible with my hands",
        points: 4,
        category: "realistic",
      },
      {
        text: "Creating beautiful or meaningful art/content",
        points: 5,
        category: "creative",
      },
    ],
  },
  {
    id: "communication",
    question: "How do you prefer to communicate ideas?",
    options: [
      {
        text: "Through visual presentations and storytelling",
        points: 4,
        category: "creative",
      },
      {
        text: "With detailed reports and data analysis",
        points: 5,
        category: "analytical",
      },
      {
        text: "Face-to-face discussions and meetings",
        points: 5,
        category: "social",
      },
      {
        text: "Through demonstrations and hands-on examples",
        points: 4,
        category: "realistic",
      },
    ],
  },
  {
    id: "interests",
    question: "Which subjects fascinated you most in school?",
    options: [
      {
        text: "Art, Literature, and Creative Writing",
        points: 5,
        category: "creative",
      },
      {
        text: "Math, Science, and Technology",
        points: 5,
        category: "investigative",
      },
      {
        text: "Psychology, History, and Social Studies",
        points: 5,
        category: "social",
      },
      {
        text: "Business, Economics, and Leadership",
        points: 5,
        category: "enterprising",
      },
    ],
  },
  {
    id: "decision_making",
    question: "When making important decisions, you tend to:",
    options: [
      {
        text: "Go with your gut feeling and intuition",
        points: 4,
        category: "creative",
      },
      {
        text: "Research thoroughly and analyze all options",
        points: 5,
        category: "analytical",
      },
      {
        text: "Seek advice from friends and mentors",
        points: 4,
        category: "social",
      },
      {
        text: "Make quick decisions and adapt as you go",
        points: 5,
        category: "enterprising",
      },
    ],
  },
  {
    id: "ideal_outcome",
    question: "What would be your ideal career outcome?",
    options: [
      {
        text: "Leading a successful company or organization",
        points: 5,
        category: "enterprising",
      },
      {
        text: "Making groundbreaking discoveries or inventions",
        points: 5,
        category: "investigative",
      },
      {
        text: "Creating art or content that inspires others",
        points: 5,
        category: "creative",
      },
      {
        text: "Helping others achieve their potential",
        points: 5,
        category: "social",
      },
    ],
  },
  {
    id: "work_style",
    question: "Which work style suits you best?",
    options: [
      {
        text: "Working independently on focused projects",
        points: 4,
        category: "investigative",
      },
      { text: "Collaborating in diverse teams", points: 5, category: "social" },
      {
        text: "Leading and managing other people",
        points: 5,
        category: "enterprising",
      },
      {
        text: "Creating and building things yourself",
        points: 4,
        category: "realistic",
      },
    ],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = async (option) => {
    const newAnswer = {
      question_id: quizQuestions[currentQuestion].id,
      answer: option.text,
      points_earned: option.points,
      category: option.category,
    };

    setAnswers([...answers, newAnswer]);
    setTotalPoints(totalPoints + option.points);

    const newCategoryScores = { ...categoryScores };
    newCategoryScores[option.category] =
      (newCategoryScores[option.category] || 0) + option.points;
    setCategoryScores(newCategoryScores);

    await QuizResponse.create(newAnswer);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await completeQuiz(newCategoryScores, totalPoints + option.points);
    }
  };

  const completeQuiz = async (finalScores, finalPoints) => {
    setIsCompleting(true);

    const topCategory = Object.entries(finalScores).reduce((a, b) =>
      finalScores[a[0]] > finalScores[b[0]] ? a : b
    )[0];

    try {
      const careerInterests = await InvokeLLM({
        prompt: `Based on a personality assessment, the user scored highest in "${topCategory}" category with these scores: ${JSON.stringify(
          finalScores
        )}. Generate 5 relevant career interests/fields for this person.`,
        response_json_schema: {
          type: "object",
          properties: {
            interests: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      });

      await User.updateMyUserData({
        quiz_completed: true,
        quiz_score: finalPoints,
        personality_type: topCategory,
        career_interests: careerInterests.interests || [],
        total_points: finalPoints,
        badges_earned: finalPoints > 35 ? ["quiz_master"] : ["quiz_completed"],
      });

      setShowResults(true);
    } catch (error) {
      console.error("Error completing quiz:", error);
    }

    setIsCompleting(false);
  };

  const goToDashboard = () => {
    navigate("/dashboard"); // replaced
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isCompleting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="neumorphic border-0 max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Brain className="w-8 h-8 text-purple-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Analyzing Your Responses
            </h2>
            <p className="text-amber-700">
              Our AI is processing your answers to create personalized career
              recommendations...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="neumorphic border-0 max-w-2xl w-full">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Award className="w-10 h-10 text-yellow-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-amber-900 mb-4">
                🎉 Congratulations!
              </h1>
              <p className="text-xl text-amber-700">
                Your personalized journey begins here
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="neumorphic-pressed p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-amber-900">
                      Quiz Score
                    </span>
                    <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      {totalPoints} points
                    </Badge>
                  </div>
                  <Progress value={(totalPoints / 40) * 100} className="h-3" />
                </div>

                <div className="text-center space-y-4">
                  <p className="text-amber-700 text-lg">
                    Based on your responses, we've identified your personality
                    type and generated personalized career recommendations.
                  </p>

                  <div className="flex justify-center gap-4">
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Assessment Complete
                    </Badge>
                    {totalPoints > 35 && (
                      <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                        <Award className="w-4 h-4 mr-1" />
                        Quiz Master
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={goToDashboard}
                    size="lg"
                    className="w-full neumorphic-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl text-lg font-semibold border-0"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    View Your Recommendations
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="neumorphic border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-amber-900">
                  Career Assessment Quiz
                </h1>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-amber-600">
                <span>Progress: {Math.round(progress)}%</span>
                <span>Points earned: {totalPoints}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="neumorphic border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 neumorphic-pressed rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                    {quizQuestions[currentQuestion].question}
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid gap-4">
                  {quizQuestions[currentQuestion].options.map(
                    (option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          onClick={() => handleAnswer(option)}
                          variant="outline"
                          className="neumorphic-button w-full p-6 h-auto text-left justify-start border-0 text-amber-800 hover:text-amber-900"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-8 h-8 neumorphic-pressed rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-amber-700">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                            <span className="text-lg">{option.text}</span>
                            <div className="ml-auto">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                +{option.points} pts
                              </Badge>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-between"
        >
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="neumorphic-button border-0 text-amber-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="flex items-center gap-2 text-amber-700">
            {Array(quizQuestions.length)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= currentQuestion ? "bg-amber-600" : "bg-amber-200"
                  }`}
                />
              ))}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
