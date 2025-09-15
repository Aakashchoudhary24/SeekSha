"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ForumPost, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  ArrowUp,
  Tag,
  Check,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // New Post Form State
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "general",
    tags: ""
  });

  const categories = [
    { value: "general", label: "General Discussion" },
    { value: "career_guidance", label: "Career Guidance" },
    { value: "college_admission", label: "College Admission" },
    { value: "study_tips", label: "Study Tips" },
    { value: "peer_help", label: "Peer Help" },
    { value: "success_stories", label: "Success Stories" }
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, postsData] = await Promise.all([
        User.me(),
        ForumPost.list("-created_date")
      ]);
      setUser(userData);
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading community data:", error);
    }
    setLoading(false);
  }, []);

  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const handleCreatePost = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    try {
      const newPostData = {
        ...postForm,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const newPost = await ForumPost.create(newPostData);
      setPosts(prev => [newPost, ...prev]);
      setIsCreateDialogOpen(false);
      setPostForm({ title: "", content: "", category: "general", tags: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      const updatedPost = await ForumPost.update(postId, { upvotes: (post.upvotes || 0) + 1 });
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Users className="w-16 h-16 text-amber-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🤝 Community Forum
          </h1>
          <p className="text-xl mt-2" style={{ color: 'var(--text-secondary)' }}>
            Connect, share, and learn with your peers.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>Share your thoughts with the community.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Post Title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              />
              <Select value={postForm.category} onValueChange={(value) => setPostForm({ ...postForm, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea
                placeholder="What's on your mind?"
                rows={6}
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              />
              <Input
                placeholder="Tags (comma-separated, e.g., engineering, IIT, advice)"
                value={postForm.tags}
                onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePost} className="bg-amber-600 hover:bg-amber-700 text-white">Post</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="neumorphic border-0">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 neumorphic-pressed border-0 bg-transparent"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-56 neumorphic-pressed border-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              layout
            >
              <Card className="neumorphic border-0 hover:transform hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleUpvote(post.id)}>
                      <ArrowUp className="w-5 h-5" style={{color: 'var(--text-secondary)'}}/>
                    </Button>
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{post.upvotes || 0}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center font-bold" style={{backgroundColor: 'var(--neumorphic-dark)', color: 'var(--text-primary)'}}>
                            {post.created_by.charAt(0).toUpperCase()}
                        </div>
                        <span>Posted by {post.created_by.split('@')[0]}</span>
                        <span>•</span>
                        <span>{new Date(post.created_date).toLocaleDateString()}</span>
                    </div>

                    <Link href={`/post?id=${post.id}`}> {/* ✅ Updated for Next.js */}
                      <h3 className="text-xl font-bold mb-2 cursor-pointer hover:underline" style={{ color: 'var(--primary-brown)' }}>
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-primary)' }}>
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <MessageSquare className="w-4 h-4"/>
                                {post.replies_count || 0} Comments
                            </div>
                            {post.is_solved && <Badge className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1"/> Solved</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {post.tags?.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1"/>{tag}</Badge>
                            ))}
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && !loading && (
          <Card className="neumorphic border-0 text-center">
            <CardContent className="p-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Discussions Yet</h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Be the first to start a conversation in this category!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
