'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/lib/types';
import { useLocalStorage } from '@/lib/hooks';
import { AuthContext } from '@/lib/hooks';

// Provider component for auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<Student | null>('pccoe_current_user', null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user exists in localStorage
    setLoading(false);
  }, []);
  
  const login = async (userData: Student) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
} 