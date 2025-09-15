'use client'
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LearningModule, User, UserProgress } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Search, 
  Filter,
  Video,
  FileText,
  PenTool,
  Gamepad2,
  Download,
  Clock,
  Star,
  TrendingUp,
  Globe,
  Wifi,
  WifiOff
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Learn() {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [userProgress, setUserProgress] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const categories = [
    { value: "mathematics", label: "Mathematics", icon: "📊" },
    { value: "science", label: "Science", icon: "🔬" },
    { value: "commerce", label: "Commerce", icon: "💼" },
    { value: "arts", label: "Arts", icon: "🎨" },
    { value: "engineering", label: "Engineering", icon: "⚙️" },
    { value: "medical", label: "Medical", icon: "🏥" },
    { value: "law", label: "Law", icon: "⚖️" },
    { value: "management", label: "Management", icon: "📈" }
  ];

  const contentTypeIcons = {
    video: Video,
    text: FileText,
    assessment: PenTool,
    interactive: Gamepad2,
    mixed: BookOpen
  };

  const loadData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load learning modules - in real app, this would be paginated
      const modulesData = await LearningModule.list();
      setModules(modulesData);

      // Load user progress
      const progressData = await UserProgress.filter({ created_by: userData.email });
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.module_id] = p;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, []); // Dependencies for state setters (setUser, setModules, setUserProgress, setLoading) are stable. API entities (User, LearningModule, UserProgress) are stable.

  const filterModules = useCallback(() => {
    let filtered = [...modules];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(module => 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(module => module.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(module => module.difficulty_level === selectedDifficulty);
    }

    // Content type filter
    if (selectedContentType !== "all") {
      filtered = filtered.filter(module => module.content_type === selectedContentType);
    }

    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(module => module.language === selectedLanguage);
    }

    // Sort by user's learning preferences and progress
    filtered.sort((a, b) => {
      const aProgress = userProgress[a.id]?.mastery_level || 0;
      const bProgress = userProgress[b.id]?.mastery_level || 0;
      
      // Prioritize partially completed modules
      if (aProgress > 0 && aProgress < 100 && bProgress === 0) return -1;
      if (bProgress > 0 && bProgress < 100 && aProgress === 0) return 1;
      
      // Fallback to creation date if progress is similar or non-existent
      return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    });

    setFilteredModules(filtered);
  }, [modules, searchQuery, selectedCategory, selectedDifficulty, selectedContentType, selectedLanguage, userProgress]); // All state dependencies are correctly listed here.

  useEffect(() => {
    loadData();
    
    // Online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]); // loadData is now a stable callback

  useEffect(() => {
    filterModules();
  }, [filterModules]); // filterModules is now a stable callback

  const startModule = async (module) => {
    try {
      // Create or update progress
      const existingProgress = userProgress[module.id];
      
      if (existingProgress) {
        await UserProgress.update(existingProgress.id, {
          last_accessed: new Date().toISOString(),
          attempts: (existingProgress.attempts || 0) + 1
        });
      } else {
        const newProgress = await UserProgress.create({
          module_id: module.id,
          competency: module.competencies?.[0] || module.title,
          mastery_level: 0,
          last_accessed: new Date().toISOString(),
          attempts: 1
        });
        
        setUserProgress(prev => ({
          ...prev,
          [module.id]: newProgress
        }));
      }

      // In a real app, this would navigate to the module content
      alert(`Starting module: ${module.title}`);
    } catch (error) {
      console.error("Error starting module:", error);
    }
  };

  const downloadModule = async (module) => {
    try {
      // In a real app, this would download the module for offline use
      alert(`Downloading ${module.title} for offline use...`);
    } catch (error) {
      console.error("Error downloading module:", error);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <BookOpen className="w-8 h-8 text-amber-700" />
          </motion.div>
        </div>
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
            📚 Learning Hub
          </h1>
          <p className="text-xl text-amber-700 mb-6">
            Discover personalized learning modules tailored to your career path
          </p>

          {/* Connection Status */}
          <div className="flex justify-center mb-6">
            <Badge className={`px-4 py-2 ${isOffline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {isOffline ? <WifiOff className="w-4 h-4 mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
              {isOffline ? 'Offline Mode' : 'Online Mode'}
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Filter className="w-5 h-5" />
              Find Your Perfect Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
              <Input
                placeholder="Search for courses, topics, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 neumorphic-pressed border-0 bg-transparent"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="neumorphic-pressed border-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="neumorphic-pressed border-0">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="neumorphic-pressed border-0">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="interactive">Interactive</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="neumorphic-pressed border-0">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="malayalam">🇮🇳 Malayalam</SelectItem>
                  <SelectItem value="tamil">🇮🇳 Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Category: {categories.find(c => c.value === selectedCategory)?.label}
                </Badge>
              )}
              {selectedDifficulty !== "all" && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Level: {selectedDifficulty}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <p className="text-amber-700">
            Found <span className="font-semibold">{filteredModules.length}</span> learning modules
          </p>
          <div className="flex gap-2">
            <Badge className="bg-amber-100 text-amber-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              AI Recommended
            </Badge>
          </div>
        </div>

        {/* Learning Modules Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredModules.map((module, index) => {
              const ContentIcon = contentTypeIcons[module.content_type] || BookOpen;
              const progress = userProgress[module.id];
              const masteryLevel = progress?.mastery_level || 0;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="neumorphic border-0 h-full hover:transform hover:-translate-y-2 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 neumorphic-pressed rounded-xl flex items-center justify-center">
                            <ContentIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-amber-900 truncate">
                              {module.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(module.difficulty_level)}>
                                {module.difficulty_level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Globe className="w-3 h-3 mr-1" />
                                {module.language}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {module.downloadable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadModule(module)}
                            className="neumorphic-button p-2"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-amber-700 text-sm leading-relaxed">
                        {module.description}
                      </p>

                      {/* Progress Bar */}
                      {masteryLevel > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-600">Progress</span>
                            <span className="font-semibold text-amber-800">{masteryLevel}%</span>
                          </div>
                          <Progress value={masteryLevel} className="h-2" />
                        </div>
                      )}

                      {/* Module Info */}
                      <div className="flex items-center gap-4 text-sm text-amber-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration_minutes}m
                        </div>
                        {module.competencies?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {module.competencies.length} skills
                          </div>
                        )}
                      </div>

                      {/* Competencies */}
                      {module.competencies?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {module.competencies.slice(0, 3).map((competency, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700">
                              {competency}
                            </Badge>
                          ))}
                          {module.competencies.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                              +{module.competencies.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => startModule(module)}
                        className="w-full neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0"
                        size="sm"
                      >
                        {masteryLevel > 0 ? 'Continue Learning' : 'Start Module'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <Card className="neumorphic border-0">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                No modules found
              </h3>
              <p className="text-amber-700 mb-6">
                Try adjusting your filters or search terms to find relevant content.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                  setSelectedContentType("all");
                  setSelectedLanguage("all");
                }}
                className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
