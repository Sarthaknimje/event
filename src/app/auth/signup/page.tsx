'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaBook, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks';
import { authAPI } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    prn: '',
    class: '',
    division: '',
    role: 'student'
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  }, [user, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    if (!formData.password) newErrors.push('Password is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (!formData.prn.trim()) newErrors.push('PRN is required');
    if (!formData.class) newErrors.push('Class is required');
    if (!formData.division) newErrors.push('Division is required');
    
    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors([]);
    
    try {
      const response = await authAPI.register(formData);
      
      if (response.success) {
        // Log the user in
        login(response.user);
        
        // Redirect to dashboard
        router.push('/student/dashboard');
      }
    } catch (error: any) {
      if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(['An error occurred during registration. Please try again.']);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-6">
                <div className="inline-block p-2 rounded-full bg-primary/10 mb-4">
                  <FaUserGraduate className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
                <p className="text-gray-600 mt-1">Join the PCCOE Events platform</p>
              </div>
              
              {errors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  <ul className="list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input-field pl-10"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input-field pl-10"
                        placeholder="your.email@pccoepune.org"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="input-field pl-10"
                        placeholder="Choose a secure password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {/* PRN */}
                  <div>
                    <label htmlFor="prn" className="block text-sm font-medium text-gray-700 mb-1">
                      PRN (Permanent Registration Number)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="prn"
                        name="prn"
                        className="input-field pl-10"
                        placeholder="Your PRN"
                        value={formData.prn}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {/* Class and Division - Side by Side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="text-gray-400" />
                        </div>
                        <select
                          id="class"
                          name="class"
                          className="input-field pl-10 appearance-none"
                          value={formData.class}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="FE">FE</option>
                          <option value="SE">SE</option>
                          <option value="TE">TE</option>
                          <option value="BE">BE</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                        Division
                      </label>
                      <select
                        id="division"
                        name="division"
                        className="input-field"
                        value={formData.division}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserTie className="text-gray-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        className="input-field pl-10"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select 'Administrator' only if you are authorized to manage events</p>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full btn-primary py-2 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 