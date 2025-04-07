'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaUsers, FaCalendarAlt, FaChartBar, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, useLocalStorage } from '@/lib/hooks';
import { Event, EventStats, Student } from '@/lib/types';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [events] = useLocalStorage<Event[]>('pccoe_events', []);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/student/dashboard');
      return;
    }
    
    // Calculate stats
    if (events.length > 0) {
      calculateStats();
    }
    
    setIsLoading(false);
  }, [user, router, events]);
  
  const calculateStats = () => {
    // Total registrations across all events
    const totalRegistrations = events.reduce(
      (sum, event) => sum + event.registeredStudents.length, 
      0
    );
    
    // Count registrations by date
    const registrationsByDate = new Map<string, number>();
    
    // Count registrations by class
    const classCounts = new Map<string, number>();
    
    // Count registrations by division
    const divisionCounts = new Map<string, number>();
    
    // Count events by category
    const categoryMap = new Map<string, number>();
    
    events.forEach(event => {
      // Count category
      const category = event.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      
      // Process student registrations
      event.registeredStudents.forEach(student => {
        // Format date to YYYY-MM-DD
        const registrationDate = student.registrationDate.split('T')[0];
        registrationsByDate.set(
          registrationDate, 
          (registrationsByDate.get(registrationDate) || 0) + 1
        );
        
        // Count by class
        classCounts.set(
          student.class,
          (classCounts.get(student.class) || 0) + 1
        );
        
        // Count by division
        divisionCounts.set(
          student.division,
          (divisionCounts.get(student.division) || 0) + 1
        );
      });
    });
    
    // Convert Maps to sorted arrays for charts
    const registrationsPerDay = Array.from(registrationsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const classwiseDistribution = Array.from(classCounts.entries())
      .map(([className, count]) => ({ class: className, count }))
      .sort((a, b) => b.count - a.count);
    
    const divisionwiseDistribution = Array.from(divisionCounts.entries())
      .map(([division, count]) => ({ division, count }))
      .sort((a, b) => b.count - a.count);
    
    const categoriesData = Object.fromEntries(categoryMap);
    
    setStats({
      totalRegistrations,
      registrationsPerDay,
      classwiseDistribution,
      divisionwiseDistribution
    });
    
    setCategoryCounts(categoriesData);
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse max-w-6xl w-full mx-auto p-4">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') return null;
  
  // Chart data for Event Categories
  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Events by Category',
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(0, 74, 173, 0.7)',  // Primary
          'rgba(255, 107, 0, 0.7)',  // Secondary
          'rgba(59, 177, 73, 0.7)',  // Accent
          'rgba(107, 114, 128, 0.7)',  // Gray
          'rgba(124, 58, 237, 0.7)',  // Purple
        ],
        borderColor: [
          'rgba(0, 74, 173, 1)',
          'rgba(255, 107, 0, 1)',
          'rgba(59, 177, 73, 1)',
          'rgba(107, 114, 128, 1)',
          'rgba(124, 58, 237, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for Registrations per Day
  const registrationsChartData = {
    labels: stats?.registrationsPerDay.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Registrations',
        data: stats?.registrationsPerDay.map(item => item.count) || [],
        backgroundColor: 'rgba(0, 74, 173, 0.7)',
        borderColor: 'rgba(0, 74, 173, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for Class-wise Distribution
  const classDistributionData = {
    labels: stats?.classwiseDistribution.map(item => item.class) || [],
    datasets: [
      {
        label: 'Registrations by Class',
        data: stats?.classwiseDistribution.map(item => item.count) || [],
        backgroundColor: 'rgba(255, 107, 0, 0.7)',
        borderColor: 'rgba(255, 107, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 md:mb-0">
              Administrator Dashboard
            </h1>
            
            <div className="flex space-x-4">
              <Link href="/admin/events/create" className="btn-primary flex items-center">
                <FaPlus className="mr-2" />
                Create Event
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/20 p-3 mr-4">
                  <FaCalendarAlt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Events</h3>
                  <p className="text-3xl font-bold text-primary">{events.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-center">
                <div className="rounded-full bg-secondary/20 p-3 mr-4">
                  <FaUsers className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Registrations</h3>
                  <p className="text-3xl font-bold text-secondary">{stats?.totalRegistrations || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="flex items-center">
                <div className="rounded-full bg-accent/20 p-3 mr-4">
                  <FaChartBar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Avg. Registrations/Event</h3>
                  <p className="text-3xl font-bold text-accent">
                    {events.length > 0 
                      ? Math.round((stats?.totalRegistrations || 0) / events.length) 
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Events by Category</h3>
              <div className="h-64">
                <Pie 
                  data={categoryChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Registrations Over Time</h3>
              <div className="h-64">
                <Bar 
                  data={registrationsChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Event Management */}
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Events</h2>
              <Link href="/admin/events/create" className="text-primary flex items-center hover:underline">
                <FaPlus className="mr-1" />
                <span>Add New</span>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">
                          {event.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary capitalize">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {event.registeredStudents.length} / {event.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/events/${event._id}`} 
                            className="text-secondary hover:text-secondary/80"
                          >
                            <FaUsers className="h-5 w-5" />
                          </Link>
                          <Link 
                            href={`/admin/events/${event._id}/edit`} 
                            className="text-primary hover:text-primary/80"
                          >
                            <FaEdit className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No events found. Create your first event!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 