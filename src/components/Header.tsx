'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="PCCOE Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl text-primary">PCCOE Events</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-foreground hover:text-primary transition-colors">
              Events
            </Link>
            {mounted && user && user.role === 'admin' && (
              <Link href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">
                Admin Dashboard
              </Link>
            )}
            {mounted && user && user.role === 'student' && (
              <Link href="/student/dashboard" className="text-foreground hover:text-primary transition-colors">
                My Dashboard
              </Link>
            )}
          </nav>
          
          {/* Authentication Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {mounted && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUserCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {user.role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            
            {mounted && user && user.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {mounted && user && user.role === 'student' && (
              <Link
                href="/student/dashboard"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {mounted && user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <FaUserCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {user.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex justify-center items-center space-x-1 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="w-full py-2 text-center text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full py-2 text-center bg-primary text-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 