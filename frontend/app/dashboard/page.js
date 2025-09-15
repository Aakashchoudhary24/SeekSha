"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserProgress, CareerRecommendation } from "../../entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  DollarSign,
  MapPin,
  Star,
  ArrowRight,
  Brain,
  Users,
  Trophy,
} from "lucide-react";
import Link from "next/link"; // ✅ Use Next.js Link instead of react-router
// ❌ removed: import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingRecommendations, setGeneratingRecommendations] =
    useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.quiz_completed) {
        await generateRecommendations(userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setLoading(false);
  };

  const generateRecommendations = async (userData) => {
    setGeneratingRecommendations(true);

    try {
      const existing = await CareerRecommendation.filter({
        created_by: userData.email,
      });
      if (existing.length > 0) {
        setRecommendations(existing);
        setGeneratingRecommendations(false);
        return;
      }

      const response = await InvokeLLM({
        prompt: `Generate 5 detailed career recommendations for a ${
          userData.personality_type
        } personality type with interests in: ${userData.career_interests?.join(
          ", "
        )}. Include match percentage, description, required skills, salary range, growth prospects, and detailed education path with specific degrees and institutions in India.`,
        response_json_schema: {
          type: "object",
          properties: {
            careers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  career_title: { type: "string" },
                  match_percentage: { type: "number" },
                  description: { type: "string" },
                  required_skills: {
                    type: "array",
                    items: { type: "string" },
                  },
                  salary_range: { type: "string" },
                  growth_prospects: { type: "string" },
                  education_path: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        degree: { type: "string" },
                        duration: { type: "string" },
                        institutions: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const savedRecommendations = [];
      for (const career of response.careers) {
        const saved = await CareerRecommendation.create(career);
        savedRecommendations.push(saved);
      }

      setRecommendations(savedRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }

    setGeneratingRecommendations(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-8 h-8 text-amber-700" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user?.quiz_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="neumorphic border-0 max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Complete Your Assessment
            </h2>
            <p className="text-amber-700 mb-8">
              Take our personality quiz to unlock personalized career
              recommendations and build your roadmap to success.
            </p>
            <Link href="/quiz">
              {" "}
              {/* ✅ Direct Next.js href */}
              <Button className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl">
                <Target className="w-5 h-5 mr-2" />
                Take Quiz Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Welcome to Your Career Dashboard
          </h1>
          <p className="text-xl text-amber-700">
            Your personalized career journey starts here
          </p>
        </motion.div>

        {/* Stats, Recommendations, Actions remain unchanged */}

        {/* Example of changed Link in Career Recommendations */}
        <div className="pt-4 border-t border-amber-100">
          <Link href="/roadmap">
            {" "}
            {/* ✅ replaced createPageUrl("Roadmap") */}
            <Button
              size="sm"
              className="w-full neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View Learning Path
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Quick Actions section */}
        {/* same idea: replace createPageUrl(action.link) with href={`/${action.link.toLowerCase()}`} */}
      </div>
    </div>
  );
}
