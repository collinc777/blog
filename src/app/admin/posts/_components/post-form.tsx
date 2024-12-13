'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Post } from '@/lib/supabase';
import { MarkdownEditor } from './markdown-editor';
import { ImageUpload } from './image-upload';
import { useToast } from '@/hooks/use-toast';

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface PostFormProps {
  initialData?: Partial<Post>;
  isLoading: boolean;
  onSave: (data: Partial<Post>) => Promise<void>;
  onPublish: (data: Partial<Post>) => Promise<void>;
}

export function PostForm({
  initialData = {
    title: '',
    excerpt: '',
    content: '',
    cover_image: '/assets/blog/default-cover.jpg',
  },
  isLoading,
  onSave,
  onPublish,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [content, setContent] = useState(initialData.content || '');
  const [coverImage, setCoverImage] = useState(initialData.cover_image || '/assets/blog/default-cover.jpg');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setExcerpt(initialData.excerpt || '');
      setContent(initialData.content || '');
      setCoverImage(initialData.cover_image || '/assets/blog/default-cover.jpg');
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a title",
      });
      return;
    }

    if (!excerpt) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter an excerpt",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await onSave({
        title,
        excerpt,
        content,
        cover_image: coverImage,
        slug: generateSlug(title),
      });
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save draft",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a title",
      });
      return;
    }

    if (!excerpt) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter an excerpt",
      });
      return;
    }

    if (!content) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter some content",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      await onPublish({
        title,
        excerpt,
        content,
        cover_image: coverImage,
        slug: generateSlug(title),
      });
      toast({
        title: "Success",
        description: "Post published successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish post",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {initialData.id ? 'Edit Post' : 'New Post'}
          </h1>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt for your post..."
              className="h-24"
            />
          </div>

          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onChange={setCoverImage}
          />

          <MarkdownEditor
            label="Content"
            value={content}
            onChange={(value) => setContent(value || '')}
          />
        </div>
      </div>
    </div>
  );
} 