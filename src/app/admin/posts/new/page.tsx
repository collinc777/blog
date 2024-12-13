'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    const slug = generateSlug(title);

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      slug,
      published_at: null,
    });

    setIsSaving(false);

    if (error) {
      toast.error('Failed to save draft');
      console.error('Error saving draft:', error);
      return;
    }

    toast.success('Draft saved successfully');
    router.push('/admin/posts');
  };

  const handlePublish = async () => {
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    if (!content) {
      toast.error('Please enter some content');
      return;
    }

    setIsPublishing(true);
    const slug = generateSlug(title);
    const now = new Date().toISOString();

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      slug,
      published_at: now,
    });

    setIsPublishing(false);

    if (error) {
      toast.error('Failed to publish post');
      console.error('Error publishing post:', error);
      return;
    }

    toast.success('Post published successfully');
    router.push('/admin/posts');
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">New Post</h1>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              className="min-h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 