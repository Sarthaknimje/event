import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image 
              src="/clg.jpeg" 
              alt="PCCOE Campus" 
              fill 
              priority
              className="object-cover brightness-[0.7]"
            />
          </div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            PCCOE Event Management
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in">
            Discover, participate, and excel in events at 
            Pimpri Chinchwad College of Engineering
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/events" className="btn-primary">
              Browse Events
            </Link>
            <Link href="/auth/login" className="btn-secondary">
              Student Login
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Event Management Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Discovery</h3>
                <p className="text-gray-600">
                  Explore and register for various technical, cultural, and sports events happening at PCCOE.
                </p>
              </div>
            </div>
            
            <div className="card transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <FaUsers className="text-secondary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
                <p className="text-gray-600">
                  Simple registration process for students with college email ID and PRN verification.
                </p>
              </div>
            </div>
            
            <div className="card transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <FaChartLine className="text-accent text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Administrator Dashboard</h3>
                <p className="text-gray-600">
                  Comprehensive analytics and participant management for event administrators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to explore events?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join the vibrant community of PCCOE students and participate in exciting events throughout the year.
          </p>
          <Link href="/events" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 