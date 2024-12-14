import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function validateAdmin() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  // Replace this with your admin email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  
  if (!session?.user || session.user.email !== ADMIN_EMAIL) {
    return false;
  }
  
  return true;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await validateAdmin();

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/posts" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Posts
              </Link>
            </div>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="py-4">{children}</main>
    </div>
  );
} 