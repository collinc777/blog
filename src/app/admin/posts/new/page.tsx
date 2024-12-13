'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PostForm } from '../_components/post-form';

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = async (data: any) => {
    const { error } = await supabase.from('posts').insert({
      ...data,
      published_at: null,
      author_name: 'Collin Caram',
      author_picture: '/assets/blog/authors/collin.jpeg',
      og_image_url: data.cover_image,
    });

    if (error) {
      toast.error('Failed to save draft');
      console.error('Error saving draft:', error);
      return;
    }

    toast.success('Draft saved successfully');
    router.push('/admin/posts');
  };

  const handlePublish = async (data: any) => {
    const now = new Date().toISOString();
    
    const { error } = await supabase.from('posts').insert({
      ...data,
      published_at: now,
      author_name: 'Collin Caram',
      author_picture: '/assets/blog/authors/collin.jpeg',
      og_image_url: data.cover_image,
    });

    if (error) {
      toast.error('Failed to publish post');
      console.error('Error publishing post:', error);
      return;
    }

    toast.success('Post published successfully');
    router.push('/admin/posts');
  };

  return (
    <PostForm
      isLoading={false}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
} 