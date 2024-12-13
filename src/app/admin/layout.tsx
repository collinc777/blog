import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function validateAdmin() {
  // TODO: Implement proper authentication
  return true; // Temporarily allow all access
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
          <nav className="flex items-center space-x-4">
            <Link 
              href="/admin/posts" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Posts
            </Link>
            {/* Add more nav items here */}
          </nav>
        </div>
      </header>
      <main className="py-4">{children}</main>
    </div>
  );
} 