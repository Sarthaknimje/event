'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks';
import { Event, StudentRegistration } from '@/lib/types';

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Fetch event details and check registration status
  useEffect(() => {
    async function fetchEventDetails() {
      try {
        // Fetch event details from API
        const response = await fetch(`/api/events/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        
        if (data.success && data.event) {
          setEvent(data.event);
          
          // Check if current user is registered for this event
          if (user && user.registeredEvents && user.registeredEvents.includes(id)) {
            setIsRegistered(true);
          }
        } else {
          router.push('/events');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEventDetails();
    }
  }, [id, user, router]);

  const handleRegister = async () => {
    if (!user || !event) {
      // If not logged in, redirect to login
      if (!user) {
        router.push('/auth/login');
      }
      return;
    }
    
    setIsRegisterLoading(true);
    setRegistrationError(null);
    
    try {
      // Register for event via API
      const response = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsRegistered(true);
        
        // Refresh event data to show updated registration count
        const updatedEventResponse = await fetch(`/api/events/${id}`);
        if (updatedEventResponse.ok) {
          const updatedData = await updatedEventResponse.json();
          if (updatedData.success && updatedData.event) {
            setEvent(updatedData.event);
          }
        }
      } else {
        setRegistrationError(data.message || 'Failed to register for event');
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setRegistrationError('An unexpected error occurred. Please try again.');
    } finally {
      setIsRegisterLoading(false);
    }
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
  
  const isEventFull = event.registeredStudents?.length >= event.capacity;
  const isEventPassed = new Date(event.date) < new Date();
  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();

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
              <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={event.image || `/images/${event.category}-event.svg`}
                    alt={event.title}
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
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
                    <p className="font-medium">{event.registeredStudents?.length || 0} / {event.capacity}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Event Description</h2>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </div>
              
              {event.targetDepartment && (
                <div className="mb-8 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">Department-Specific Event</h3>
                  <p className="text-blue-700">This event is specifically for students from the {event.targetDepartment} department.</p>
                </div>
              )}
              
              {registrationError && (
                <div className="mb-8 bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700">{registrationError}</p>
                </div>
              )}
              
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
                ) : isDeadlinePassed ? (
                  <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">
                    Registration deadline has passed.
                  </div>
                ) : isEventFull ? (
                  <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">
                    Registration closed - Event is at full capacity.
                  </div>
                ) : !user ? (
                  <Link href={`/auth/login?redirect=/events/${id}`} className="btn-primary w-full max-w-md py-3 flex justify-center items-center">
                    Log in to Register
                  </Link>
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