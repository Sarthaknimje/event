'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaImage, FaTag, FaUsers, FaInfoCircle, FaSave, FaTimes } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, useLocalStorage } from '@/lib/hooks';
import { Event } from '@/lib/types';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useLocalStorage<Event[]>('pccoe_events', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'technical',
    image: '/technical-event.svg',
    organizer: '',
    registrationDeadline: '',
    capacity: 100,
    targetDepartment: '',
  });
  
  // Categories for selection
  const categories = [
    { id: 'technical', name: 'Technical', image: '/technical-event.svg' },
    { id: 'cultural', name: 'Cultural', image: '/cultural-event.svg' },
    { id: 'sports', name: 'Sports', image: '/sports-event.svg' },
    { id: 'workshop', name: 'Workshop', image: '/workshop-event.svg' },
    { id: 'seminar', name: 'Seminar', image: '/seminar-event.svg' }
  ];
  
  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/student/dashboard');
    }
  }, [user, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update image when category changes
    if (name === 'category') {
      const category = categories.find(cat => cat.id === value);
      if (category) {
        setFormData(prev => ({ ...prev, image: category.image }));
      }
    }
  };
  
  const validateForm = () => {
    // Check required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'organizer', 'registrationDeadline'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return false;
      }
    }
    
    // Validate dates
    const currentDate = new Date();
    const eventDate = new Date(formData.date);
    const regDeadline = new Date(formData.registrationDeadline);
    
    if (eventDate < currentDate) {
      setError('Event date cannot be in the past');
      return false;
    }
    
    if (regDeadline > eventDate) {
      setError('Registration deadline must be before the event date');
      return false;
    }
    
    // Validate capacity
    if (formData.capacity <= 0) {
      setError('Capacity must be greater than 0');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        image: formData.image,
        organizer: formData.organizer,
        registrationDeadline: formData.registrationDeadline,
        capacity: formData.capacity,
        targetDepartment: formData.targetDepartment,
      };
      
      // Call API to create event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }
      
      // Also update local storage for immediate use in UI
      const newEvent = data.event;
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'technical',
        image: '/technical-event.svg',
        organizer: '',
        registrationDeadline: '',
        capacity: 100,
        targetDepartment: '',
      });
      
      // Redirect to admin dashboard after a delay
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Event creation error:', err);
      setError(err.message || 'An error occurred while creating the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Create New Event</h1>
            <Link 
              href="/admin/dashboard" 
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FaTimes className="mr-2" />
              <span>Cancel</span>
            </Link>
          </div>
          
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6 flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>Event created successfully! Redirecting to dashboard...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Event Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaInfoCircle className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input-field pl-10"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Event Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="input-field pl-10"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Event Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    className="input-field pl-10"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="input-field pl-10"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Organizer */}
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    className="input-field pl-10"
                    placeholder="Enter organizer name"
                    value={formData.organizer}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    className="input-field pl-10"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Registration Deadline */}
              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    className="input-field pl-10"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="input-field pl-10"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Target Department */}
              <div>
                <label htmlFor="targetDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Department (Optional)
                </label>
                <select
                  id="targetDepartment"
                  name="targetDepartment"
                  className="input-field pl-10"
                  value={formData.targetDepartment}
                  onChange={handleChange}
                >
                  <option value="">All Departments</option>
                  <option value="Computer">Computer Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="ENTC">Electronics & Telecommunication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="AI&DS">AI & Data Science</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">If specified, the event will be primarily shown to students from this department.</p>
              </div>
              
              {/* Event Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      className={`
                        relative border rounded-lg overflow-hidden cursor-pointer
                        ${formData.image === category.image ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-200'}
                      `}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        image: category.image,
                        category: category.id
                      }))}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full relative">
                        <div className="p-2 h-24 flex items-center justify-center">
                          <FaImage className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 text-center text-sm font-medium capitalize">
                        {category.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="input-field"
                  placeholder="Enter event description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <FaSave className="mr-2" />
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 