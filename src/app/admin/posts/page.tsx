'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/supabase';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
      setIsLoading(false);
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/posts/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet. Create your first post to get started.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{post.title}</h2>
                  <div className="flex space-x-2 text-sm text-muted-foreground mt-1">
                    <time dateTime={post.created_at}>
                      Created: {new Date(post.created_at).toLocaleDateString()}
                    </time>
                    {post.published_at && (
                      <time dateTime={post.published_at}>
                        • Published: {new Date(post.published_at).toLocaleDateString()}
                      </time>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <div className={cn(
                    "px-2 py-1 rounded text-sm",
                    post.published_at 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {post.published_at ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 