'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapMilestone, User } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  Star,
  BookOpen,
  Award,
  ExternalLink,
  Plus,
  Filter,
  Trophy,
  Target,
  Play // Added Play import
} from "lucide-react";

export default function Roadmap() {
  const [milestones, setMilestones] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const existing = await RoadmapMilestone.filter({ created_by: userData.email });
      if (existing.length > 0) {
        setMilestones(existing);
      } else {
        await generateRoadmap(userData);
      }
    } catch (error) {
      console.error("Error loading roadmap:", error);
    }
    setLoading(false);
  };

  const generateRoadmap = async (userData) => {
    if (!userData.personality_type || !userData.career_interests?.length) return;
    
    setGenerating(true);
    
    try {
      const response = await InvokeLLM({
        prompt: `Generate a comprehensive career roadmap for a ${userData.personality_type} personality type interested in ${userData.career_interests?.join(', ')}. Create 12 specific milestones covering education, skills, certifications, projects, and experiences. Each milestone should have detailed resources including courses, articles, videos, and books.`,
        response_json_schema: {
          type: "object",
          properties: {
            roadmap: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { 
                    type: "string",
                    enum: ["education", "skill", "experience", "certification", "project"]
                  },
                  priority: {
                    type: "string",
                    enum: ["high", "medium", "low"]
                  },
                  estimated_duration: { type: "string" },
                  points_reward: { type: "number" },
                  resources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        type: {
                          type: "string",
                          enum: ["course", "article", "video", "book", "certification"]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const savedMilestones = [];
      for (const milestone of response.roadmap) {
        const saved = await RoadmapMilestone.create({
          ...milestone,
          career_path: userData.personality_type
        });
        savedMilestones.push(saved);
      }

      setMilestones(savedMilestones);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    }
    
    setGenerating(false);
  };

  const completeMilestone = async (milestone) => {
    try {
      await RoadmapMilestone.update(milestone.id, { completed: true });
      
      // Update user points
      const newPoints = (user.total_points || 0) + (milestone.points_reward || 10);
      await User.updateMyUserData({ total_points: newPoints });
      
      setUser({ ...user, total_points: newPoints });
      setMilestones(prev => prev.map(m => 
        m.id === milestone.id ? { ...m, completed: true } : m
      ));
    } catch (error) {
      console.error("Error completing milestone:", error);
    }
  };

  const categoryColors = {
    education: "bg-blue-100 text-blue-800",
    skill: "bg-purple-100 text-purple-800",
    experience: "bg-green-100 text-green-800",
    certification: "bg-orange-100 text-orange-800",
    project: "bg-pink-100 text-pink-800"
  };

  const resourceIcons = {
    course: BookOpen,
    article: BookOpen,
    video: Play,
    book: BookOpen,
    certification: Award
  };

  const filteredMilestones = filter === "all" 
    ? milestones 
    : milestones.filter(m => m.category === filter);

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <MapPin className="w-8 h-8 text-amber-700" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Your Career Roadmap
          </h1>
          <p className="text-xl text-amber-700 mb-6">
            Step-by-step path to your dream career
          </p>
          
          {/* Progress Overview */}
          <Card className="neumorphic border-0 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 neumorphic-pressed rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-amber-900">
                      {completedCount} of {milestones.length} Completed
                    </div>
                    <div className="text-sm text-amber-600">
                      {Math.round(progressPercentage)}% Progress
                    </div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-1" />
                  {user?.total_points || 0} Points
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {generating ? (
          <Card className="neumorphic border-0">
            <CardContent className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MapPin className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Building Your Personalized Roadmap
              </h3>
              <p className="text-amber-700">
                Our AI is creating a tailored learning path based on your profile...
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["all", "education", "skill", "experience", "certification", "project"].map((category) => (
                <Button
                  key={category}
                  onClick={() => setFilter(category)}
                  variant={filter === category ? "default" : "outline"}
                  className={`neumorphic-button border-0 ${
                    filter === category 
                      ? 'bg-amber-600 text-white' 
                      : 'text-amber-800 hover:text-amber-900'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Roadmap Timeline */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index < filteredMilestones.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-16 bg-amber-200 z-0" />
                    )}
                    
                    <Card className={`neumorphic border-0 relative ${
                      milestone.completed ? 'opacity-75' : ''
                    }`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            milestone.completed 
                              ? 'bg-green-100 neumorphic-pressed' 
                              : 'neumorphic-pressed'
                          }`}>
                            {milestone.completed ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <div className="w-3 h-3 bg-amber-600 rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <CardTitle className="text-xl text-amber-900">
                                {milestone.title}
                              </CardTitle>
                              <Badge className={categoryColors[milestone.category]}>
                                {milestone.category}
                              </Badge>
                              {milestone.priority === 'high' && (
                                <Badge className="bg-red-100 text-red-800">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-amber-700 mb-4">{milestone.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-600 mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {milestone.estimated_duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                +{milestone.points_reward || 10} points
                              </div>
                            </div>

                            {/* Resources */}
                            {milestone.resources && milestone.resources.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-amber-900">Resources:</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {milestone.resources.slice(0, 4).map((resource, resourceIndex) => {
                                    const ResourceIcon = resourceIcons[resource.type] || BookOpen;
                                    return (
                                      <div
                                        key={resourceIndex}
                                        className="neumorphic-pressed p-3 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300"
                                      >
                                        <div className="flex items-center gap-2">
                                          <ResourceIcon className="w-4 h-4 text-amber-700 flex-shrink-0" />
                                          <span className="text-sm font-medium text-amber-800 truncate">
                                            {resource.title}
                                          </span>
                                          <ExternalLink className="w-3 h-3 text-amber-500 ml-auto flex-shrink-0" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="mt-6">
                              {!milestone.completed ? (
                                <Button
                                  onClick={() => completeMilestone(milestone)}
                                  className="neumorphic-button bg-green-600 hover:bg-green-700 text-white border-0"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              ) : (
                                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
