'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, useLocalStorage } from '@/lib/hooks';
import { Event, Student, StudentRegistration } from '@/lib/types';

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [events, setEvents] = useLocalStorage<Event[]>('pccoe_events', []);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const foundEvent = events.find(event => event._id === id);
    
    if (foundEvent) {
      setEvent(foundEvent);
      
      // Check if current user is registered for this event
      if (user.registeredEvents && foundEvent._id && user.registeredEvents.includes(foundEvent._id)) {
        setIsRegistered(true);
      }
    } else {
      // Event not found
      router.push('/events');
    }
    
    setLoading(false);
  }, [id, user, router, events]);

  const handleRegister = () => {
    if (!user || !event) return;
    
    setIsRegisterLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Add user to event's registered students
        const registration: StudentRegistration = {
          _id: user._id,
          name: user.name,
          email: user.email,
          prn: user.prn || 'N/A',
          class: user.class || 'N/A',
          division: user.division || 'N/A',
          department: user.department || 'N/A',
          registrationDate: new Date().toISOString()
        };
        
        const updatedEvent = {
          ...event,
          registeredStudents: [
            ...event.registeredStudents,
            registration
          ]
        };
        
        // Update events array
        setEvents(events.map(e => e._id === event._id ? updatedEvent : e));
        
        // Update user's registered events
        const updatedUser: Student = {
          ...user,
          registeredEvents: [...(user.registeredEvents || []), event._id as string]
        };
        setUser(updatedUser);
        
        setIsRegistered(true);
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setIsRegisterLoading(false);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const isEventFull = event.registeredStudents.length >= event.capacity;
  const isEventPassed = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/events" className="inline-flex items-center text-primary hover:underline">
              <FaArrowLeft className="mr-2" />
              Back to Events
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <div className="h-64 w-full overflow-hidden">
                <img 
                  src={event.image || '/images/event-placeholder.jpg'} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full capitalize">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaCalendarAlt className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaClock className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaMapMarkerAlt className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaUsers className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registrations</p>
                    <p className="font-medium">{event.registeredStudents.length} / {event.capacity}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Event Description</h2>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                {isRegistered ? (
                  <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    You are registered for this event!
                  </div>
                ) : isEventPassed ? (
                  <div className="bg-gray-100 text-gray-800 px-6 py-4 rounded-lg">
                    This event has already taken place.
                  </div>
                ) : isEventFull ? (
                  <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">
                    Registration closed - Event is at full capacity.
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isRegisterLoading}
                    className={`btn-primary w-full max-w-md py-3 flex justify-center items-center ${isRegisterLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isRegisterLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                        Processing...
                      </>
                    ) : (
                      'Register for this Event'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 