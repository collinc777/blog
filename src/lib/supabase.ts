import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Post = {
  id: string;
  title: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
}; 