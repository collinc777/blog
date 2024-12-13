import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function validateAdmin() {
  // TODO: Implement proper authentication
  // For now, we'll use a simple header check
  const headersList = headers();
  const isAdmin = headersList.get('x-admin-auth') === process.env.ADMIN_SECRET;
  return isAdmin;
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-4">
            <a href="/admin/posts" className="font-medium">
              Posts
            </a>
            {/* Add more nav items here */}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
} 