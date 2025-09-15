"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Star, TrendingUp, Users, Crown, Zap, Target } from "lucide-react"

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  initials: string
  points: number
  level: number
  streak: number
  coursesCompleted: number
  rank: number
  badge: string
  progress: number
}

const mockUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "",
    initials: "PS",
    points: 2850,
    level: 12,
    streak: 15,
    coursesCompleted: 8,
    rank: 1,
    badge: "Career Champion",
    progress: 95,
  },
  {
    id: "2",
    name: "Rahul Kumar",
    avatar: "",
    initials: "RK",
    points: 2720,
    level: 11,
    streak: 12,
    coursesCompleted: 7,
    rank: 2,
    badge: "Learning Master",
    progress: 88,
  },
  {
    id: "3",
    name: "Ananya Patel",
    avatar: "",
    initials: "AP",
    points: 2650,
    level: 11,
    streak: 18,
    coursesCompleted: 6,
    rank: 3,
    badge: "Streak Legend",
    progress: 92,
  },
  {
    id: "4",
    name: "Vikram Singh",
    avatar: "",
    initials: "VS",
    points: 2480,
    level: 10,
    streak: 8,
    coursesCompleted: 6,
    rank: 4,
    badge: "Rising Star",
    progress: 75,
  },
  {
    id: "5",
    name: "Sneha Gupta",
    avatar: "",
    initials: "SG",
    points: 2350,
    level: 10,
    streak: 10,
    coursesCompleted: 5,
    rank: 5,
    badge: "Dedicated Learner",
    progress: 82,
  },
  {
    id: "6",
    name: "Arjun Mehta",
    avatar: "",
    initials: "AM",
    points: 2200,
    level: 9,
    streak: 6,
    coursesCompleted: 5,
    rank: 6,
    badge: "Knowledge Seeker",
    progress: 68,
  },
  {
    id: "7",
    name: "Kavya Reddy",
    avatar: "",
    initials: "KR",
    points: 2100,
    level: 9,
    streak: 14,
    coursesCompleted: 4,
    rank: 7,
    badge: "Consistent Performer",
    progress: 78,
  },
  {
    id: "8",
    name: "Rohit Jain",
    avatar: "",
    initials: "RJ",
    points: 1950,
    level: 8,
    streak: 5,
    coursesCompleted: 4,
    rank: 8,
    badge: "Ambitious Learner",
    progress: 65,
  },
]

const timeframes = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "alltime", label: "All Time" },
]

export default function LeaderboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")
  const [users] = useState<LeaderboardUser[]>(mockUsers)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-[#8b4513]">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-[#d4621a]"
    }
  }

  const getBadgeColor = (badge: string) => {
    const colors = [
      "bg-purple-100 text-purple-700",
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ]
    return colors[badge.length % colors.length]
  }

  // Current user (for demonstration)
  const currentUser = {
    rank: 15,
    points: 1650,
    level: 7,
    streak: 3,
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
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#8b4513]">Leaderboard</h1>
                  <p className="text-[#a0826d] text-lg">See how you rank among your peers</p>
                </div>
              </div>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-48 border-[#e5e1dc] focus:border-[#d4621a] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Current User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-[#d4621a] text-white text-lg">YU</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-[#8b4513]">Your Current Rank</h3>
                      <p className="text-[#a0826d]">Keep learning to climb higher!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#d4621a]">#{currentUser.rank}</div>
                      <div className="text-sm text-[#a0826d]">Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#d4621a]">{currentUser.points}</div>
                      <div className="text-sm text-[#a0826d]">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#d4621a]">{currentUser.level}</div>
                      <div className="text-sm text-[#a0826d]">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#d4621a]">{currentUser.streak}</div>
                      <div className="text-sm text-[#a0826d]">Day Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="flex flex-col items-center order-1">
                <Card className="bg-white border-[#e5e1dc] shadow-lg w-full">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto">
                        <AvatarImage src={users[1]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-400 text-white text-xl">{users[1]?.initials}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#8b4513] mb-1">{users[1]?.name}</h3>
                    <Badge className={`${getBadgeColor(users[1]?.badge || "")} text-xs mb-2`}>{users[1]?.badge}</Badge>
                    <div className="text-2xl font-bold text-[#d4621a] mb-1">{users[1]?.points}</div>
                    <div className="text-sm text-[#a0826d]">points</div>
                  </CardContent>
                </Card>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center order-2">
                <Card className="bg-white border-[#e5e1dc] shadow-xl w-full transform scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage src={users[0]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-yellow-500 text-white text-2xl">
                          {users[0]?.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-[#8b4513] mb-1 text-lg">{users[0]?.name}</h3>
                    <Badge className={`${getBadgeColor(users[0]?.badge || "")} text-xs mb-2`}>{users[0]?.badge}</Badge>
                    <div className="text-3xl font-bold text-[#d4621a] mb-1">{users[0]?.points}</div>
                    <div className="text-sm text-[#a0826d]">points</div>
                  </CardContent>
                </Card>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center order-3">
                <Card className="bg-white border-[#e5e1dc] shadow-lg w-full">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto">
                        <AvatarImage src={users[2]?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-amber-600 text-white text-xl">
                          {users[2]?.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#8b4513] mb-1">{users[2]?.name}</h3>
                    <Badge className={`${getBadgeColor(users[2]?.badge || "")} text-xs mb-2`}>{users[2]?.badge}</Badge>
                    <div className="text-2xl font-bold text-[#d4621a] mb-1">{users[2]?.points}</div>
                    <div className="text-sm text-[#a0826d]">points</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white border-[#e5e1dc] shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#8b4513] flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Full Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-[#f5f3f0] transition-colors border-b border-[#e5e1dc] last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center">{getRankIcon(user.rank)}</div>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#d4621a] text-white">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-[#8b4513]">{user.name}</h4>
                          <Badge className={`${getBadgeColor(user.badge)} text-xs`}>{user.badge}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="flex items-center text-[#d4621a] font-bold">
                            <Zap className="w-4 h-4 mr-1" />
                            {user.points}
                          </div>
                          <div className="text-xs text-[#a0826d]">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center text-[#8b4513] font-bold">
                            <Star className="w-4 h-4 mr-1" />
                            {user.level}
                          </div>
                          <div className="text-xs text-[#a0826d]">Level</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center text-green-600 font-bold">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {user.streak}
                          </div>
                          <div className="text-xs text-[#a0826d]">Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center text-blue-600 font-bold">
                            <Target className="w-4 h-4 mr-1" />
                            {user.coursesCompleted}
                          </div>
                          <div className="text-xs text-[#a0826d]">Courses</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
