import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/auth/login');
  }

  // Redirect based on user role
  if (user.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/student/dashboard');
  }

  // This part won't execute due to redirects above
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Redirecting to your dashboard...</h1>
    </div>
  );
}