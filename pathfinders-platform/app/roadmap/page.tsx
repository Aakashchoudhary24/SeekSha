"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Star,
  Award,
  ExternalLink,
  CheckCircle,
  Circle,
  Trophy,
} from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: "skill" | "education" | "experience" | "certification" | "project";
  priority: "High Priority" | "Medium Priority" | "Low Priority";
  duration: string;
  points: number;
  isCompleted: boolean;
  resources: Array<{
    title: string;
    type: "course" | "book" | "tutorial" | "practice";
    url: string;
  }>;
}

const mockRoadmapItems: RoadmapItem[] = [
  {
    id: "1",
    title: "Learn Python Programming",
    description:
      "Master Python programming language for web development, data science, and automation",
    category: "skill",
    priority: "High Priority",
    duration: "3 months",
    points: 450,
    isCompleted: false,
    resources: [
      {
        title: "Python for Beginners",
        type: "course",
        url: "#",
      },
      {
        title: "Automate the Boring Stuff with Python",
        type: "book",
        url: "#",
      },
    ],
  },
  {
    id: "2",
    title: "Build Portfolio Projects",
    description:
      "Create 3-5 projects showcasing your skills in web development and programming",
    category: "project",
    priority: "High Priority",
    duration: "6 months",
    points: 750,
    isCompleted: false,
    resources: [
      {
        title: "Project Ideas for Beginners",
        type: "tutorial",
        url: "#",
      },
      {
        title: "GitHub Portfolio Guide",
        type: "tutorial",
        url: "#",
      },
    ],
  },
  {
    id: "3",
    title: "Complete Data Structures Course",
    description:
      "Learn fundamental data structures and algorithms for technical interviews",
    category: "education",
    priority: "Medium Priority",
    duration: "4 months",
    points: 600,
    isCompleted: true,
    resources: [
      {
        title: "Data Structures Fundamentals",
        type: "course",
        url: "#",
      },
    ],
  },
];

const filterOptions = [
  { value: "All", label: "All", count: mockRoadmapItems.length },
  {
    value: "Education",
    label: "Education",
    count: mockRoadmapItems.filter((item) => item.category === "education")
      .length,
  },
  {
    value: "Skill",
    label: "Skill",
    count: mockRoadmapItems.filter((item) => item.category === "skill").length,
  },
  {
    value: "Experience",
    label: "Experience",
    count: mockRoadmapItems.filter((item) => item.category === "experience")
      .length,
  },
  {
    value: "Certification",
    label: "Certification",
    count: mockRoadmapItems.filter((item) => item.category === "certification")
      .length,
  },
  {
    value: "Project",
    label: "Project",
    count: mockRoadmapItems.filter((item) => item.category === "project")
      .length,
  },
];

export default function RoadmapPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [roadmapItems, setRoadmapItems] =
    useState<RoadmapItem[]>(mockRoadmapItems);

  const filteredItems = roadmapItems.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category === selectedFilter.toLowerCase();
  });

  const completedItems = roadmapItems.filter((item) => item.isCompleted).length;
  const totalItems = roadmapItems.length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);
  const totalPoints = roadmapItems
    .filter((item) => item.isCompleted)
    .reduce((sum, item) => sum + item.points, 0);

  const toggleComplete = (id: string) => {
    setRoadmapItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "skill":
        return "bg-blue-100 text-blue-700";
      case "education":
        return "bg-green-100 text-green-700";
      case "experience":
        return "bg-purple-100 text-purple-700";
      case "certification":
        return "bg-yellow-100 text-yellow-700";
      case "project":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High Priority":
        return "bg-red-100 text-red-700";
      case "Medium Priority":
        return "bg-yellow-100 text-yellow-700";
      case "Low Priority":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-[#8b4513] mb-4">
              Your Career Roadmap
            </h1>
            <p className="text-[#d4621a] text-lg">
              Step-by-step path to your dream career
            </p>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#d4621a] rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#8b4513]">
                        {completedItems} of {totalItems} Completed
                      </h3>
                      <p className="text-[#d4621a] font-medium">
                        {progressPercentage}% Progress
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-[#d4621a] font-semibold">
                      <Award className="w-5 h-5" />
                      {totalPoints} Points
                    </div>
                  </div>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-3 bg-[#f5f3f0]"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedFilter === option.value ? "default" : "outline"
                  }
                  onClick={() => setSelectedFilter(option.value)}
                  className={
                    selectedFilter === option.value
                      ? "bg-[#d4621a] hover:bg-[#b8541a] text-white"
                      : "border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
                  }
                >
                  <span className="mr-2">🔽</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Roadmap Items */}
          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white border-[#e5e1dc] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Status Icon */}
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {item.isCompleted ? (
                          <CheckCircle className="w-8 h-8 text-green-500 fill-current" />
                        ) : (
                          <Circle className="w-8 h-8 text-[#a0826d] hover:text-[#d4621a] transition-colors" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-[#8b4513] mb-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                className={`${getCategoryColor(
                                  item.category
                                )} text-sm font-medium`}
                              >
                                {item.category}
                              </Badge>
                              <Badge
                                className={`${getPriorityColor(
                                  item.priority
                                )} text-sm font-medium`}
                              >
                                {item.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-[#6b5b73] text-lg leading-relaxed mb-6">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex items-center gap-2 text-[#a0826d]">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#d4621a]">
                            <Star className="w-5 h-5" />
                            <span className="font-medium">
                              {item.points} points
                            </span>
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-[#8b4513] mb-3">
                            Resources:
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {item.resources.map((resource, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {resource.title}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className={
                            item.isCompleted
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-[#d4621a] hover:bg-[#b8541a] text-white"
                          }
                          disabled={item.isCompleted}
                        >
                          {item.isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            "Mark Complete"
                          )}
                        </Button>
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
  );
}
