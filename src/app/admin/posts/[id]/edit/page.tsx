'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PostForm } from '../../_components/post-form';
import type { Post } from '@/lib/supabase';
import { use } from 'react';

export default function EditPostPage({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(asyncParams);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        router.push('/admin/posts');
        return;
      }

      setPost(data);
      setIsLoading(false);
    }

    fetchPost();
  }, [params.id, router]);

  const handleSave = async (data: Partial<Post>) => {
    const { error } = await supabase
      .from('posts')
      .update({
        ...data,
        published_at: null,
      })
      .eq('id', params.id);

    if (error) {
      toast.error('Failed to save draft');
      console.error('Error saving draft:', error);
      return;
    }

    toast.success('Draft saved successfully');
    router.push('/admin/posts');
  };

  const handlePublish = async (data: Partial<Post>) => {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('posts')
      .update({
        ...data,
        published_at: now,
      })
      .eq('id', params.id);

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
      initialData={post || undefined}
      isLoading={isLoading}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
} 