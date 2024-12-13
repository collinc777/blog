import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  author_name: string;
  author_picture: string;
  og_image_url: string;
}; 