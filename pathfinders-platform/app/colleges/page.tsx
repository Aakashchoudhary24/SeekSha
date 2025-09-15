"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, GraduationCap, Search, Filter, ExternalLink, Phone, Mail, Globe } from "lucide-react"

interface College {
  id: string
  name: string
  location: string
  type: string
  rating: number
  students: string
  courses: string[]
  fees: string
  contact: {
    phone: string
    email: string
    website: string
  }
  distance: string
  established: string
}

const mockColleges: College[] = [
  {
    id: "1",
    name: "Government Engineering College",
    location: "Mumbai, Maharashtra",
    type: "Government",
    rating: 4.5,
    students: "3,500+",
    courses: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    fees: "₹50,000/year",
    contact: {
      phone: "+91-22-2345-6789",
      email: "admissions@gec-mumbai.edu.in",
      website: "www.gec-mumbai.edu.in",
    },
    distance: "2.5 km",
    established: "1985",
  },
  {
    id: "2",
    name: "Delhi University - North Campus",
    location: "Delhi, NCR",
    type: "Central University",
    rating: 4.7,
    students: "15,000+",
    courses: ["Arts", "Science", "Commerce", "Law"],
    fees: "₹25,000/year",
    contact: {
      phone: "+91-11-2766-7777",
      email: "info@du.ac.in",
      website: "www.du.ac.in",
    },
    distance: "5.2 km",
    established: "1922",
  },
  {
    id: "3",
    name: "Indian Institute of Technology",
    location: "Bangalore, Karnataka",
    type: "Institute of National Importance",
    rating: 4.9,
    students: "8,000+",
    courses: ["Engineering", "Technology", "Research"],
    fees: "₹2,50,000/year",
    contact: {
      phone: "+91-80-2293-2456",
      email: "admissions@iisc.ac.in",
      website: "www.iisc.ac.in",
    },
    distance: "12.8 km",
    established: "1909",
  },
]

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setColleges(mockColleges)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
            <h1 className="text-4xl font-bold text-[#8b4513] mb-2">Nearby Government Colleges</h1>
            <p className="text-[#a0826d] text-lg">Discover quality education options in your area</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0826d] w-4 h-4" />
                <Input
                  placeholder="Search colleges, locations, or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#e5e1dc] focus:border-[#d4621a]"
                />
              </div>
              <Button
                variant="outline"
                className="border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* College Cards */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4621a] mx-auto"></div>
                <p className="text-[#a0826d] mt-4">Loading colleges...</p>
              </div>
            ) : (
              filteredColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white border-[#e5e1dc] hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-[#8b4513] mb-2">{college.name}</CardTitle>
                          <div className="flex items-center text-[#a0826d] mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{college.location}</span>
                            <span className="mx-2">•</span>
                            <span>{college.distance} away</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-[#d4621a]/10 text-[#d4621a]">
                              {college.type}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-[#8b4513] font-medium">{college.rating}</span>
                            </div>
                            <div className="flex items-center text-[#a0826d]">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{college.students}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#d4621a]">{college.fees}</p>
                          <p className="text-sm text-[#a0826d]">Annual Fees</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[#8b4513] mb-2 flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Available Courses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {college.courses.map((course) => (
                              <Badge key={course} variant="outline" className="border-[#d4621a] text-[#d4621a]">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-[#a0826d]">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              <span>{college.contact.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              <span>{college.contact.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              <span>{college.contact.website}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#d4621a] text-[#d4621a] hover:bg-[#d4621a] hover:text-white bg-transparent"
                            >
                              View Details
                            </Button>
                            <Button size="sm" className="bg-[#d4621a] hover:bg-[#b8541a] text-white">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visit Website
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {filteredColleges.length === 0 && !loading && (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-[#a0826d] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#8b4513] mb-2">No colleges found</h3>
              <p className="text-[#a0826d]">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
