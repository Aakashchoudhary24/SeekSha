'use client'
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Note, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  StickyNote, 
  Plus, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Heart,
  HeartOff,
  Tag,
  Calendar,
  BookOpen,
  MessageCircle
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

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Form state
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "personal",
    tags: "",
    color: "#FFF3CD"
  });

  const categories = [
    { value: "personal", label: "Personal", icon: "👤" },
    { value: "course", label: "Course Notes", icon: "📚" },
    { value: "career", label: "Career Planning", icon: "💼" },
    { value: "chatbot", label: "AI Conversations", icon: "🤖" },
    { value: "research", label: "Research", icon: "🔍" }
  ];

  const colors = [
    "#FFF3CD", "#D1ECF1", "#D4EDDA", "#F8D7DA", "#E2E3E5",
    "#FCF4FF", "#FFF0F5", "#F0F8FF", "#FFFACD", "#E6FFE6"
  ];

  const loadNotes = useCallback(async () => {
    try {
      const notesData = await Note.list("-created_date");
      setNotes(notesData);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
    setLoading(false);
  }, []); // Dependencies: setNotes, setLoading are stable. Note.list is imported, assumed stable.

  const filterNotes = useCallback(() => {
    let filtered = [...notes];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(note => note.is_favorite);
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedCategory, showFavoritesOnly]); // Dependencies: notes, searchQuery, selectedCategory, showFavoritesOnly change the filtered results. setFilteredNotes is stable.

  useEffect(() => {
    loadNotes();
  }, [loadNotes]); // Dependency: loadNotes is now memoized by useCallback

  useEffect(() => {
    filterNotes();
  }, [filterNotes]); // Dependency: filterNotes is now memoized by useCallback

  const resetForm = () => {
    setNoteForm({
      title: "",
      content: "",
      category: "personal",
      tags: "",
      color: "#FFF3CD"
    });
  };

  const handleCreateNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) return;

    try {
      const tagsArray = noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const newNote = await Note.create({
        title: noteForm.title,
        content: noteForm.content,
        category: noteForm.category,
        tags: tagsArray,
        color: noteForm.color
      });

      setNotes(prev => [newNote, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !noteForm.title.trim() || !noteForm.content.trim()) return;

    try {
      const tagsArray = noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const updatedNote = await Note.update(editingNote.id, {
        title: noteForm.title,
        content: noteForm.content,
        category: noteForm.category,
        tags: tagsArray,
        color: noteForm.color
      });

      setNotes(prev => prev.map(note => note.id === editingNote.id ? updatedNote : note));
      setEditingNote(null);
      resetForm();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const toggleFavorite = async (note) => {
    try {
      const updatedNote = await Note.update(note.id, {
        is_favorite: !note.is_favorite
      });
      
      setNotes(prev => prev.map(n => n.id === note.id ? updatedNote : n));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await Note.delete(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags?.join(', ') || "",
      color: note.color || "#FFF3CD"
    });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    resetForm();
  };

  const getCategoryIcon = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.icon : "📝";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 neumorphic-pressed rounded-full flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <StickyNote className="w-8 h-8 text-amber-700" />
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
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
              📝 My Notes
            </h1>
            <p className="text-xl text-amber-700">
              Organize your learning journey with smart notes
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new note to organize your thoughts and learning materials.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Input
                  placeholder="Note title..."
                  value={noteForm.title}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    value={noteForm.category} 
                    onValueChange={(value) => setNoteForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    {colors.slice(0, 5).map(color => (
                      <button
                        key={color}
                        onClick={() => setNoteForm(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          noteForm.color === color ? 'border-amber-600' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Input
                  placeholder="Tags (comma separated)..."
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
                />
                
                <Textarea
                  placeholder="Write your note content here..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateNote}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search and Filters */}
        <Card className="neumorphic border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
                <Input
                  placeholder="Search notes, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 neumorphic-pressed border-0 bg-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 neumorphic-pressed border-0">
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

                <Button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  variant={showFavoritesOnly ? "default" : "outline"}
                  className={`neumorphic-button border-0 ${
                    showFavoritesOnly ? 'bg-amber-600 text-white' : 'text-amber-800'
                  }`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="neumorphic border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">{notes.length}</div>
              <div className="text-sm text-amber-600">Total Notes</div>
            </CardContent>
          </Card>
          <Card className="neumorphic border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">
                {notes.filter(n => n.is_favorite).length}
              </div>
              <div className="text-sm text-amber-600">Favorites</div>
            </CardContent>
          </Card>
          <Card className="neumorphic border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">
                {notes.filter(n => n.category === 'course').length}
              </div>
              <div className="text-sm text-amber-600">Course Notes</div>
            </CardContent>
          </Card>
          <Card className="neumorphic border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-900">
                {notes.filter(n => n.category === 'chatbot').length}
              </div>
              <div className="text-sm text-amber-600">AI Conversations</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        {editingNote && (
          <Card className="neumorphic border-0">
            <CardHeader>
              <CardTitle>Edit Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title..."
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={noteForm.category} 
                  onValueChange={(value) => setNoteForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  {colors.slice(0, 5).map(color => (
                    <button
                      key={color}
                      onClick={() => setNoteForm(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        noteForm.color === color ? 'border-amber-600' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Input
                placeholder="Tags (comma separated)..."
                value={noteForm.tags}
                onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
              />
              
              <Textarea
                placeholder="Write your note content here..."
                value={noteForm.content}
                onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditNote}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                style={{ backgroundColor: note.color }}
                className="neumorphic rounded-xl p-4 hover:transform hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(note.category)}</span>
                    <Badge className="bg-white/50 text-amber-800 text-xs">
                      {categories.find(cat => cat.value === note.category)?.label}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(note)}
                      className="p-1 h-auto hover:bg-white/20"
                    >
                      {note.is_favorite ? (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      ) : (
                        <HeartOff className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Note Title */}
                <h3 className="font-bold text-amber-900 mb-2 line-clamp-2">
                  {note.title}
                </h3>

                {/* Note Content */}
                <p className="text-amber-800 text-sm mb-3 line-clamp-4">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} className="bg-white/30 text-amber-700 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge className="bg-white/30 text-amber-700 text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Note Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.created_date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(note)}
                      className="p-1 h-auto hover:bg-white/20"
                    >
                      <Edit3 className="w-4 h-4 text-amber-700" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="p-1 h-auto hover:bg-white/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <Card className="neumorphic border-0">
            <CardContent className="p-12 text-center">
              <StickyNote className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                {notes.length === 0 ? 'No notes yet' : 'No notes match your search'}
              </h3>
              <p className="text-amber-700 mb-6">
                {notes.length === 0 
                  ? 'Start organizing your learning journey by creating your first note.' 
                  : 'Try adjusting your search or filters to find your notes.'
                }
              </p>
              <Button
                onClick={() => notes.length === 0 ? setIsCreateDialogOpen(true) : setSearchQuery("")}
                className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white border-0"
              >
                {notes.length === 0 ? 'Create First Note' : 'Clear Search'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
