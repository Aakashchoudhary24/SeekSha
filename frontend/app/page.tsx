"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Globe, ArrowRight, Sparkles, Play } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

const StatCard = ({
  number,
  label,
  icon: Icon,
}: {
  number: string
  label: string
  icon: any
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
    <Card className="bg-white/80 backdrop-blur-sm border-[#e5e1dc] shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-[#d4621a] mr-2" />
          <span className="text-2xl font-bold text-[#8b4513]">{number}</span>
        </div>
        <p className="text-sm text-[#a0826d] font-medium">{label}</p>
      </CardContent>
    </Card>
  </motion.div>
)

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#e5e1dc] rounded-full opacity-40" />
          <div className="absolute bottom-40 right-40 w-24 h-24 bg-[#d4c5b9] rounded-full opacity-30" />
          <div className="absolute bottom-20 right-60 w-40 h-40 bg-[#f0ebe6] rounded-full opacity-50" />
          <div className="absolute top-40 right-80 w-16 h-16 bg-[#a0826d] rounded-full opacity-20" />
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          {/* Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="bg-[#d4621a] text-white border-[#d4621a] px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by AI • Backed by Research
            </Badge>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
                <span className="text-[#8b4513]">Your Personalized</span>
                <br />
                <span className="text-[#d4621a]">Career & Education</span>
                <br />
                <span className="text-[#8b4513]">Advisor</span>
              </h1>

              <p className="text-xl text-[#a0826d] mb-8 max-w-2xl text-pretty leading-relaxed">
                Discover your potential, explore career paths, and build your future with AI-powered guidance tailored
                just for you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-[#d4621a] hover:bg-[#b8541a] text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/quiz" className="flex items-center">
                    <Play className="mr-2 w-5 h-5" />
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  <Link href="/dashboard" className="flex items-center">
                    View Dashboard
                  </Link>
                </Button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                <StatCard number="50,000+" label="Students Guided" icon={Users} />
                <StatCard number="500+" label="Career Paths" icon={MapPin} />
                <StatCard number="12+" label="Languages" icon={Globe} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
