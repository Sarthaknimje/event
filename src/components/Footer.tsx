'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* College Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10 bg-white rounded-full p-1">
                <Image
                  src="/logo.png"
                  alt="PCCOE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">PCCOE</span>
            </div>
            <p className="text-sm text-gray-200 mb-4">
              Pimpri Chinchwad College of Engineering (PCCOE) is one of the leading engineering colleges in Pune, Maharashtra.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-200 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-200 hover:text-white transition-colors">
                  Administrator
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-200 hover:text-white transition-colors">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Event Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events/category/technical" className="text-gray-200 hover:text-white transition-colors">
                  Technical
                </Link>
              </li>
              <li>
                <Link href="/events/category/cultural" className="text-gray-200 hover:text-white transition-colors">
                  Cultural
                </Link>
              </li>
              <li>
                <Link href="/events/category/sports" className="text-gray-200 hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/events/category/workshop" className="text-gray-200 hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/events/category/seminar" className="text-gray-200 hover:text-white transition-colors">
                  Seminars
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Sector -26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-secondary flex-shrink-0" />
                <span className="text-sm">+91 20 2765 3168</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-secondary flex-shrink-0" />
                <span className="text-sm">principal@pccoepune.org</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-primary-dark py-4 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} PCCOE Event Management. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 