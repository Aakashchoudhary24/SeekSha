"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Users,
  Award,
  TrendingUp,
  MapPin,
  DollarSign,
  ArrowRight,
} from "lucide-react";

interface CareerRecommendation {
  id: string;
  title: string;
  description: string;
  match: number;
  salaryRange: string;
  demandLevel: string;
  requiredSkills: string[];
  growthProspects: string;
}

const careerRecommendations: CareerRecommendation[] = [
  {
    id: "1",
    title: "Human Resources Manager",
    description:
      "Human Resources Managers are responsible for managing the workforce of an organization, overseeing hiring, training, employee benefits, and compliance with labor laws. They work on employee relations, organizational development, and company culture.",
    match: 95,
    salaryRange: "INR 8,00,000 - INR 20,00,000 per annum",
    demandLevel:
      "High. As companies continue to grow, the demand for skilled HR professionals is increasing, leading to more opportunities for advancement into senior roles.",
    requiredSkills: [
      "Interpersonal Skills",
      "Conflict Resolution",
      "Organizational Skills",
    ],
    growthProspects:
      "Excellent growth opportunities with potential for senior leadership roles",
  },
  {
    id: "2",
    title: "Sales Executive",
    description:
      "Sales Executives are responsible for selling products and services to customers, identifying their needs, and matching them with the right solutions. They maintain relationships with clients and work towards achieving sales targets.",
    match: 90,
    salaryRange:
      "INR 3,00,000 - INR 12,00,000 per annum (including commissions)",
    demandLevel:
      "Moderate to High. With experience and success in sales, one can progress to roles like Sales Manager or Regional Sales Director.",
    requiredSkills: ["Persuasion", "Negotiation", "Communication"],
    growthProspects:
      "Strong growth potential with performance-based advancement",
  },
  {
    id: "3",
    title: "Public Relations Specialist",
    description:
      "Public Relations Specialists manage an organization's public image and communications strategy. They write press releases, interact with media, organize events, and handle crisis communications to maintain positive public perception.",
    match: 88,
    salaryRange: "INR 4,00,000 - INR 15,00,000 per annum",
    demandLevel:
      "Moderate. PR roles are essential for brand management and corporate communications, with opportunities in various industries.",
    requiredSkills: ["Communication", "Writing", "Media Relations"],
    growthProspects:
      "Good advancement opportunities in corporate communications",
  },
  {
    id: "4",
    title: "Social Services Manager",
    description:
      "Social Services Managers coordinate and oversee social service programs and lead teams that help individuals improve their socio-economic conditions. They work towards achieving social welfare goals.",
    match: 85,
    salaryRange: "INR 5,00,000 - INR 18,00,000 per annum",
    demandLevel:
      "Steady demand in government and non-profit sectors with focus on social development and community welfare programs.",
    requiredSkills: ["Leadership", "Program Management", "Community Outreach"],
    growthProspects:
      "Stable career path with opportunities in policy development",
  },
];

export default function DashboardPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const stats = {
    quizScore: { current: 44, total: 40 },
    totalPoints: 44,
    personalityType: "SOCIAL",
    badgesEarned: 1,
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-100 text-green-700";
    if (match >= 85) return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

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
            <h1 className="text-4xl font-bold text-[#8b4513] mb-4">
              Welcome to Your Career Dashboard
            </h1>
            <p className="text-[#d4621a] text-lg">
              Your personalized career journey starts here
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-2 flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-[#d4621a] rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-[#8b4513] leading-tight">
                  {stats.quizScore.current}/{stats.quizScore.total}
                </span>
                <span className="text-xs text-[#a0826d] font-medium truncate">
                  Quiz Score
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-2 flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-lg font-bold text-[#8b4513] leading-tight">
                  {stats.totalPoints}
                </span>
                <span className="text-xs text-[#a0826d] font-medium truncate">
                  Total Points
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-2 flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-[#8b4513] leading-tight">
                  {stats.personalityType}
                </span>
                <span className="text-xs text-[#a0826d] font-medium truncate">
                  Personality Type
                </span>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-2 flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-lg font-bold text-[#8b4513] leading-tight">
                  {stats.badgesEarned}
                </span>
                <span className="text-xs text-[#a0826d] font-medium truncate">
                  Badges Earned
                </span>
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-[#8b4513] mb-6">
              Your Career Recommendations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {careerRecommendations.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white border-[#e5e1dc] hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <CardTitle className="text-xl text-[#8b4513] leading-tight">
                          {career.title}
                        </CardTitle>
                        <Badge
                          className={`${getMatchColor(
                            career.match
                          )} font-semibold`}
                        >
                          {career.match}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-[#6b5b73] leading-relaxed mb-4 line-clamp-3">
                        {career.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#6b5b73]">
                            {career.salaryRange}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#6b5b73] line-clamp-2">
                            {career.demandLevel}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#8b4513] mb-2 flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          Required Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.requiredSkills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-[#8b4513] text-white hover:bg-[#6b4423] border-0"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-[#d4621a] hover:bg-[#b8541a] text-white">
                        <MapPin className="w-4 h-4 mr-2" />
                        View Learning Path
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
