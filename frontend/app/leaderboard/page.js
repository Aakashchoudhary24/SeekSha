"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { User } from "@/entities/all"; // Removed: 'User' not exported from entities/all.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

// Mock data for demonstration - in real app this would come from database
const mockLeaderboardData = [
  {
    id: 1,
    name: "Arjun Patel",
    total_points: 1250,
    quiz_score: 38,
    badges_earned: ["quiz_master", "skill_seeker", "roadmap_champion"],
    personality_type: "investigative",
    rank: 1,
    avatar: "A",
  },
  {
    id: 2,
    name: "Priya Singh",
    total_points: 1180,
    quiz_score: 36,
    badges_earned: ["quiz_master", "career_explorer"],
    personality_type: "social",
    rank: 2,
    avatar: "P",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    total_points: 1120,
    quiz_score: 35,
    badges_earned: ["quiz_completed", "milestone_achiever"],
    personality_type: "enterprising",
    rank: 3,
    avatar: "R",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    total_points: 1050,
    quiz_score: 34,
    badges_earned: ["quiz_master", "learning_enthusiast"],
    personality_type: "creative",
    rank: 4,
    avatar: "S",
  },
  {
    id: 5,
    name: "Vikram Sharma",
    total_points: 980,
    quiz_score: 32,
    badges_earned: ["quiz_completed", "goal_setter"],
    personality_type: "realistic",
    rank: 5,
    avatar: "V",
  },
];

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");

  const loadData = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);

      // In a real app, you would fetch leaderboard data from the backend
      // For now, we'll add the current user to the mock data if they have points
      if (userData.total_points > 0) {
        const userEntry = {
          id: "current",
          name: userData.full_name || "You",
          total_points: userData.total_points || 0,
          quiz_score: userData.quiz_score || 0,
          badges_earned: userData.badges_earned || [],
          personality_type: userData.personality_type || "unknown",
          avatar: userData.full_name?.[0] || "U",
          isCurrentUser: true,
        };

        // Use functional update to ensure we're working with the latest state
        setLeaderboardData((prevLeaderboardData) => {
          // Determine where to insert the user based on their total_points
          const insertIndex = prevLeaderboardData.findIndex(
            (u) => userData.total_points > u.total_points
          );

          // Create a new array to avoid direct mutation of the previous state
          const newLeaderboard = [...prevLeaderboardData];

          // If user already exists in the list (e.g., from a prior addition or re-fetch), remove them first
          // This check prevents duplicate 'You' entries if loadData runs multiple times
          const existingUserIndex = newLeaderboard.findIndex(
            (u) => u.isCurrentUser
          );
          if (existingUserIndex !== -1) {
            newLeaderboard.splice(existingUserIndex, 1);
          }

          // Insert the current user's entry
          // If no user has fewer points, add to the end; otherwise, insert at the appropriate spot
          const actualInsertIndex =
            insertIndex === -1 ? newLeaderboard.length : insertIndex;
          newLeaderboard.splice(actualInsertIndex, 0, userEntry);

          // Sort the entire list by total_points in descending order and re-assign ranks
          newLeaderboard.sort((a, b) => b.total_points - a.total_points);
          newLeaderboard.forEach((user, index) => {
            user.rank = index + 1;
          });

          return newLeaderboard;
        });
      }
    } catch (error) {
      console.error("Error loading leaderboard data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []); // Empty dependency array means this runs once on mount

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="text-xl font-bold text-amber-700">#{rank}</span>
        );
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      quiz_master: "bg-purple-100 text-purple-800",
      quiz_completed: "bg-blue-100 text-blue-800",
      skill_seeker: "bg-green-100 text-green-800",
      roadmap_champion: "bg-orange-100 text-orange-800",
      career_explorer: "bg-pink-100 text-pink-800",
      milestone_achiever: "bg-indigo-100 text-indigo-800",
      learning_enthusiast: "bg-teal-100 text-teal-800",
      goal_setter: "bg-red-100 text-red-800",
    };
    return colors[badge] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-8 h-8 text-amber-700" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Ensure top 3 users are always the first 3 elements for podium
  const top3Leaderboard = leaderboardData.slice(0, 3);
  const podiumUsers = [
    top3Leaderboard[1], // 2nd place
    top3Leaderboard[0], // 1st place
    top3Leaderboard[2], // 3rd place
  ].filter(Boolean); // Filter out undefined if there are fewer than 3 users

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
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-amber-700 mb-6">
            See how you rank among fellow career explorers
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Players",
              value: leaderboardData.length.toLocaleString(),
              icon: Users,
              color: "text-blue-600",
            },
            {
              title: "Your Rank",
              value:
                currentUser?.total_points > 0
                  ? `#${
                      leaderboardData.find((u) => u.isCurrentUser)?.rank ||
                      "N/A"
                    }`
                  : "N/A",
              icon: Target,
              color: "text-purple-600",
            },
            {
              title: "Your Points",
              value: currentUser?.total_points?.toLocaleString() || "0",
              icon: Star,
              color: "text-yellow-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="neumorphic border-0">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color}`}
                  >
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-amber-600">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top 3 Podium */}
        <Card className="neumorphic border-0 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-amber-900">
              🎖️ Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex justify-center items-end gap-8 mb-8">
              {podiumUsers.map((user, index) => {
                const heights = ["h-40", "h-32", "h-28"]; // Heights for 1st, 2nd, 3rd place
                const currentHeight =
                  user.rank === 1
                    ? heights[0]
                    : user.rank === 2
                    ? heights[1]
                    : heights[2];

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        user.isCurrentUser
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-500"
                      }`}
                    >
                      {user.avatar}
                    </div>

                    <div
                      className={`neumorphic-pressed rounded-t-lg p-4 ${currentHeight} flex flex-col justify-end`}
                    >
                      <div className="mb-2">{getRankIcon(user.rank)}</div>
                      <div className="text-lg font-bold text-amber-900 mb-1 truncate max-w-[100px] mx-auto">
                        {user.name}
                      </div>
                      <div className="text-sm text-amber-700 mb-2">
                        {user.total_points.toLocaleString()} pts
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {user.badges_earned
                          .slice(0, 2)
                          .map((badge, badgeIndex) => (
                            <Badge
                              key={badgeIndex}
                              className={`text-xs px-2 py-1 ${getBadgeColor(
                                badge
                              )}`}
                            >
                              {badge.replace("_", " ")}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">
              All Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-amber-50 transition-colors ${
                    user.isCurrentUser
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          user.isCurrentUser
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                        }`}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-amber-900 truncate">
                            {user.name}
                          </h3>
                          {user.isCurrentUser && (
                            <Badge className="bg-amber-100 text-amber-800 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-amber-600 capitalize">
                          {user.personality_type?.replace("_", " ")} personality
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-900">
                          {user.total_points.toLocaleString()}
                        </div>
                        <div className="text-xs text-amber-600">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-900">
                          {user.quiz_score}/40
                        </div>
                        <div className="text-xs text-amber-600">Quiz</div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 max-w-40">
                      {user.badges_earned
                        .slice(0, 3)
                        .map((badge, badgeIndex) => (
                          <Badge
                            key={badgeIndex}
                            className={`text-xs ${getBadgeColor(badge)}`}
                          >
                            {badge.replace("_", " ")}
                          </Badge>
                        ))}
                      {user.badges_earned.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          +{user.badges_earned.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="neumorphic border-0 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">
                  Keep Growing! 🌱
                </h3>
                <p className="text-amber-700 mb-6">
                  Complete more milestones, engage with the AI assistant, and
                  climb the leaderboard. Every step forward brings you closer to
                  your dream career!
                </p>
                <div className="flex justify-center gap-4">
                  <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
                    <Star className="w-4 h-4 mr-1" />
                    Current Points: {currentUser.total_points || 0}
                  </Badge>
                  {currentUser.total_points < 1000 && (
                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                      <Target className="w-4 h-4 mr-1" />
                      Next Goal: 1,000 pts
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
