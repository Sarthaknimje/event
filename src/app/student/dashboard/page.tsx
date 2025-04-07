'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUserCircle, FaBook, FaIdCard, FaEnvelope, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, useLocalStorage } from '@/lib/hooks';
import { Event } from '@/lib/types';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [events] = useLocalStorage<Event[]>('pccoe_events', []);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Get registered events for current user
    if (user && user.registeredEvents && events.length > 0) {
      const registered = events.filter(event => 
        event._id && user.registeredEvents?.includes(event._id)
      );
        
      const today = new Date();
      const upcoming = registered.filter(event => new Date(event.date) >= today);
      const past = registered.filter(event => new Date(event.date) < today);
      
      // Sort upcoming events by date (closest first)
      upcoming.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Sort past events by date (most recent first)
      past.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setRegisteredEvents(registered);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
    
    setIsLoading(false);
  }, [user, router, events]);
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse max-w-4xl w-full mx-auto p-4">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Student Dashboard
          </h1>
          
          {/* Student Profile */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="card">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar and basic info */}
                <div className="text-center md:text-left">
                  <div className="mx-auto md:mx-0 h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <FaUserCircle className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600 mb-2">{user.class} {user.division}</p>
                </div>
                
                {/* Detailed info */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-3 text-center md:text-left">Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaIdCard className="mr-2 text-primary" />
                      <span className="text-gray-700 font-medium mr-2">PRN:</span>
                      <span className="text-gray-600">{user.prn}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-primary" />
                      <span className="text-gray-700 font-medium mr-2">Email:</span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBook className="mr-2 text-primary" />
                      <span className="text-gray-700 font-medium mr-2">Class:</span>
                      <span className="text-gray-600">{user.class}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUserCircle className="mr-2 text-primary" />
                      <span className="text-gray-700 font-medium mr-2">Division:</span>
                      <span className="text-gray-600">{user.division}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBook className="mr-2 text-primary" />
                      <span className="text-gray-700 font-medium mr-2">Department:</span>
                      <span className="text-gray-600">{user.department}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Registered Events */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Your Registered Events</h2>
            
            {registeredEvents.length === 0 ? (
              <div className="card text-center py-8">
                <div className="mb-4 text-gray-400">
                  <FaCalendarAlt className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  You haven't registered for any events yet. Browse the events listing and register for events you're interested in.
                </p>
                <Link href="/events" className="btn-primary">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registeredEvents.map(event => (
                  <div key={event._id} className="card hover:shadow-md transition-shadow">
                    <Link href={`/events/${event._id}`} className="flex flex-col md:flex-row gap-4">
                      <div className="relative h-48 md:h-auto md:w-48 rounded-md overflow-hidden">
                        <Image
                          src={event.image || '/images/event-placeholder.jpg'}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap justify-between items-start">
                          <h3 className="text-xl font-semibold mb-2 text-primary">
                            {event.title}
                          </h3>
                          <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded capitalize mb-2">
                            {event.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 