'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaFilter, FaSort, FaUserFriends, FaInfoCircle, FaClock } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocalStorage, useAuth } from '@/lib/hooks';
import { Event, Student } from '@/lib/types';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  const [storedEvents] = useLocalStorage<Event[]>('pccoe_events', []);
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: '',
    department: '',
  });
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'technical', name: 'Technical' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'seminar', name: 'Seminars' }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'date', name: 'Date (Newest)' },
    { id: 'dateAsc', name: 'Date (Oldest)' },
    { id: 'name', name: 'Name (A-Z)' },
    { id: 'nameDesc', name: 'Name (Z-A)' }
  ];
  
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        if (data.success && data.events) {
          setEvents(data.events);
          setFilteredEvents(data.events);
        } else if (storedEvents && storedEvents.length > 0) {
          // Fall back to localStorage if API fails but we have cached events
          setEvents(storedEvents);
          setFilteredEvents(storedEvents);
        } else {
          // Default events if both API and localStorage fail
          const defaultEvents: Event[] = [
            {
              _id: '1',
              title: 'Annual Tech Fest - TechnoZeal 2023',
              description: 'Join us for the biggest technical festival with competitions, workshops, and exhibitions showcasing the latest technologies and innovations.',
              date: '2023-10-15',
              time: '09:00 AM',
              location: 'Main Campus Auditorium',
              category: 'technical',
              image: '/technical-event.svg',
              organizer: 'Computer Science Department',
              registrationDeadline: '2023-10-10',
              capacity: 500,
              registeredStudents: []
            },
            {
              _id: '2',
              title: 'Cultural Night - Rhythm 2023',
              description: 'A celebration of art, music, and dance performances by students, showcasing the rich cultural diversity at PCCOE.',
              date: '2023-09-25',
              time: '06:00 PM',
              location: 'Open Air Theatre',
              category: 'cultural',
              image: '/cultural-event.svg',
              organizer: 'Cultural Committee',
              registrationDeadline: '2023-09-20',
              capacity: 300,
              registeredStudents: []
            },
            {
              _id: '3',
              title: 'Sports Tournament - PCCOE Champions League',
              description: 'Inter-departmental sports competition including cricket, football, basketball, and athletics.',
              date: '2023-11-05',
              time: '08:30 AM',
              location: 'PCCOE Sports Ground',
              category: 'sports',
              image: '/sports-event.svg',
              organizer: 'Sports Department',
              registrationDeadline: '2023-10-30',
              capacity: 200,
              registeredStudents: []
            },
            {
              _id: '4',
              title: 'AI & Machine Learning Workshop',
              description: 'Hands-on workshop covering fundamentals of AI, machine learning algorithms, and practical implementations.',
              date: '2023-10-08',
              time: '10:00 AM',
              location: 'Computer Lab Building',
              category: 'workshop',
              image: '/workshop-event.svg',
              organizer: 'AI Club',
              registrationDeadline: '2023-10-05',
              capacity: 50,
              registeredStudents: []
            },
            {
              _id: '5',
              title: 'Industry Seminar: Future of Engineering',
              description: 'Distinguished speakers from top companies sharing insights on emerging trends and career opportunities.',
              date: '2023-09-30',
              time: '11:00 AM',
              location: 'Seminar Hall',
              category: 'seminar',
              image: '/seminar-event.svg',
              organizer: 'Training & Placement Cell',
              registrationDeadline: '2023-09-28',
              capacity: 150,
              registeredStudents: []
            }
          ];
          
          setEvents(defaultEvents);
          setFilteredEvents(defaultEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        
        // Use local storage as fallback
        if (storedEvents && storedEvents.length > 0) {
          setEvents(storedEvents);
          setFilteredEvents(storedEvents);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [storedEvents]);
  
  // Filter and sort events when search term, category or sort criteria changes
  useEffect(() => {
    let result = [...events];
    
    // Filter by search, category, date, and department
    result = result.filter(event => {
      // Text search
      if (filters.search && 
          !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && event.category !== filters.category) {
        return false;
      }
      
      // Date filter
      if (filters.date) {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        if (eventDate !== filters.date) {
          return false;
        }
      }
      
      // Department filter - only show events for the user's department if selected
      if (filters.department && user?.department) {
        // If the event has a targetDepartment field, check if it matches the user's department
        // If an event doesn't have a targetDepartment, it's for all departments
        if (event.targetDepartment && event.targetDepartment !== user.department) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'dateAsc':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'nameDesc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredEvents(result);
  }, [events, sortBy, filters, user]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if registration deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  // Animation variants for events list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-primary">
            Upcoming Events
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore the wide range of events happening at PCCOE. Register and participate to enhance your skills and college experience.
          </p>
          
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-4 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              
              {/* Category Filter */}
              <div className="md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="input-field pl-10 appearance-none"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              
              {/* Date Filter */}
              <div className="md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="input-field pl-10"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              {/* Department Filter */}
              {user && (
                <div className="md:w-64 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserFriends className="text-gray-400" />
                  </div>
                  <select
                    className="input-field pl-10 appearance-none"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">All Departments</option>
                    <option value="my-department">Only My Department ({user.department})</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>
          
          {filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <FaInfoCircle className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500">
                {filters.search ? (
                  <>No events match your search criteria. Try adjusting your filters.</>
                ) : (
                  <>No events are currently available in this category.</>
                )}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible" 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map(event => (
                <motion.div 
                  key={event._id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/events/${event._id}`} className="block">
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                        <Image
                          src={event.image || `/images/${event.category}-event.svg`}
                          alt={event.title}
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute top-0 right-0 p-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-primary capitalize">
                          {event.category}
                        </span>
                      </div>
                      {isDeadlinePassed(event.registrationDeadline) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-center text-sm py-1 font-medium">
                          Registration Closed
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-primary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUserFriends className="mr-2 text-primary" />
                          <span>{event.registeredStudents?.length || 0} / {event.capacity} Registered</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          By <span className="font-medium">{event.organizer}</span>
                        </div>
                        <div className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center">
                          View Details 
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
} 