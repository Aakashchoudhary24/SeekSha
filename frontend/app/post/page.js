'use client'
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link"; 
import { ForumPost, ForumReply, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  ArrowUp,
  Tag,
  Send,
  Award,
  ArrowLeft
} from "lucide-react";

export default function Post({ searchParams }) {  
  const postId = searchParams?.id;

  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState("");

  const loadData = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [userData, postData, repliesData] = await Promise.all([
        User.me(),
        ForumPost.get(postId),
        ForumReply.filter({ post_id: postId }, "-created_date")
      ]);
      setUser(userData);
      setPost(postData);
      setReplies(repliesData);
    } catch (error) {
      console.error("Error loading post data:", error);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleUpvote = async (entityType, entityId) => {
    try {
      if (entityType === 'post') {
        const updatedPost = await ForumPost.update(entityId, { upvotes: (post.upvotes || 0) + 1 });
        setPost(updatedPost);
      } else {
        const reply = replies.find(r => r.id === entityId);
        const updatedReply = await ForumReply.update(entityId, { upvotes: (reply.upvotes || 0) + 1 });
        setReplies(prev => prev.map(r => r.id === entityId ? updatedReply : r));
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handlePostReply = async () => {
    if (!newReply.trim()) return;
    try {
      const createdReply = await ForumReply.create({
        post_id: postId,
        content: newReply
      });
      setReplies(prev => [createdReply, ...prev]);
      setNewReply("");
      
      const updatedPost = await ForumPost.update(postId, { replies_count: (post.replies_count || 0) + 1 });
      setPost(updatedPost);
    } catch(error) {
      console.error("Error posting reply:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <MessageSquare className="w-16 h-16 text-amber-500 animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link href="/community"> {/* ✅ Next.js link */}
          <Button variant="link">Back to Community</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/community">
        <Button variant="outline" className="neumorphic-button border-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>
      
      {/* Main Post */}
      <Card className="neumorphic border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleUpvote('post', post.id)}>
                <ArrowUp className="w-5 h-5" style={{color: 'var(--text-secondary)'}}/>
              </Button>
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{post.upvotes || 0}</span>
            </div>
            <div className="flex-1">
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                Posted by {post.created_by.split('@')[0]} on {new Date(post.created_date).toLocaleDateString()}
              </div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-brown)' }}>
                {post.title}
              </h1>
              <p className="whitespace-pre-wrap mb-4">{post.content}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="outline"><Tag className="w-3 h-3 mr-1"/>{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Reply Form */}
      <Card className="neumorphic border-0">
        <CardHeader>
          <CardTitle className="text-lg">Join the Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Write your reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="neumorphic-pressed border-0 bg-transparent"
          />
          <div className="flex justify-end">
            <Button onClick={handlePostReply} className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0">
              <Send className="w-4 h-4 mr-2"/>
              Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{replies.length} Replies</h2>
        {replies.map(reply => (
          <Card key={reply.id} className="neumorphic border-0">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleUpvote('reply', reply.id)}>
                    <ArrowUp className="w-4 h-4" style={{color: 'var(--text-secondary)'}}/>
                  </Button>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{reply.upvotes || 0}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold" style={{backgroundColor: 'var(--neumorphic-dark)', color: 'var(--text-primary)'}}>
                      {reply.created_by.charAt(0).toUpperCase()}
                    </div>
                    <span>{reply.created_by.split('@')[0]}</span>
                    <span>•</span>
                    <span>{new Date(reply.created_date).toLocaleDateString()}</span>
                    {reply.is_answer && (
                        <Badge className="bg-green-100 text-green-800"><Award className="w-3 h-3 mr-1"/> Answer</Badge>
                    )}
                  </div>
                  <p>{reply.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
