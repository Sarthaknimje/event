'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaDownload, FaUser, FaIdCard, FaEnvelope, FaBook, FaArrowLeft, FaEdit } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, useLocalStorage } from '@/lib/hooks';
import { Event } from '@/lib/types';

export default function EventParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events] = useLocalStorage<Event[]>('pccoe_events', []);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  
  // Fetch event data
  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/student/dashboard');
      return;
    }
    
    if (!id) return;
    
    // Find event by ID
    const foundEvent = events.find(event => event._id === id);
    
    if (foundEvent) {
      setEvent(foundEvent);
      setFilteredStudents(foundEvent.registeredStudents);
    } else {
      setError('Event not found');
    }
    
    setLoading(false);
  }, [id, events, user, router]);
  
  // Update filtered students when search or filters change
  useEffect(() => {
    if (!event) return;
    
    let result = [...event.registeredStudents];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.prn.includes(term)
      );
    }
    
    // Apply class filter
    if (filterClass !== 'all') {
      result = result.filter(student => student.class === filterClass);
    }
    
    // Apply division filter
    if (filterDivision !== 'all') {
      result = result.filter(student => student.division === filterDivision);
    }
    
    setFilteredStudents(result);
  }, [searchTerm, filterClass, filterDivision, event]);
  
  // Get unique classes and divisions for filters
  const getUniqueClasses = () => {
    if (!event) return [];
    const classes = event.registeredStudents.map(student => student.class);
    return Array.from(new Set(classes)).sort();
  };
  
  const getUniqueDivisions = () => {
    if (!event) return [];
    const divisions = event.registeredStudents.map(student => student.division);
    return Array.from(new Set(divisions)).sort();
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
  
  // Export participants to CSV
  const exportToCSV = () => {
    if (!event) return;
    
    // Define CSV columns and headers
    const headers = ['Name', 'Email', 'PRN', 'Class', 'Division', 'Registration Date'];
    
    // Convert students to CSV rows
    const studentRows = filteredStudents.map(student => [
      student.name,
      student.email,
      student.prn,
      student.class,
      student.division,
      new Date(student.registrationDate).toLocaleString()
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...studentRows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title}-participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse max-w-6xl w-full mx-auto p-4">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') return null;
  
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="text-2xl font-semibold mb-2 text-red-500">Event Not Found</h1>
            <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <Link href="/admin/dashboard" className="btn-primary">
              Return to Dashboard
            </Link>
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
        <div className="container mx-auto px-4">
          {/* Header with navigation */}
          <div className="mb-8">
            <Link 
              href="/admin/dashboard"
              className="inline-flex items-center text-primary hover:underline mb-4"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-0">
                Event Participants
              </h1>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  <span>Export CSV</span>
                </button>
                
                <Link
                  href={`/admin/events/${event._id}/edit`}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  <span>Edit Event</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Event details card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Event image */}
              <div className="md:w-1/4">
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src={event.image || '/event-default.svg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Event details */}
              <div className="md:w-3/4">
                <h2 className="text-2xl font-bold mb-3 text-primary">{event.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <FaCalendarAlt className="mt-1 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-medium">{formatDate(event.date)} • {event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaUser className="mt-1 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Organizer</p>
                      <p className="font-medium">{event.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaClock className="mt-1 mr-2 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Registration Deadline</p>
                      <p className="font-medium">{formatDate(event.registrationDeadline)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary capitalize text-sm font-medium mr-2">
                      {event.category}
                    </span>
                    <span className="text-gray-600">
                      {event.registeredStudents.length} / {event.capacity} registered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Participant listing */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold mb-4">Registered Participants</h3>
              
              {/* Search and filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="input-field"
                    placeholder="Search by name, email or PRN"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="filterClass" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Class
                  </label>
                  <select
                    id="filterClass"
                    className="input-field"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="all">All Classes</option>
                    {getUniqueClasses().map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filterDivision" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Division
                  </label>
                  <select
                    id="filterDivision"
                    className="input-field"
                    value={filterDivision}
                    onChange={(e) => setFilterDivision(e.target.value)}
                  >
                    <option value="all">All Divisions</option>
                    {getUniqueDivisions().map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Participants table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRN
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class & Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                        No students found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <FaUser className="text-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaIdCard className="mr-2" />
                            <span>{student.prn}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaBook className="mr-2" />
                            <span>{student.class} - {student.division}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(student.registrationDate).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination and stats */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {filteredStudents.length} of {event.registeredStudents.length} participants
                </div>
                <div>
                  {Math.round((filteredStudents.length / event.capacity) * 100)}% of capacity filled
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 