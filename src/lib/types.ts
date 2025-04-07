export interface Student {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  prn: string;
  class: string;
  division: string;
  role: 'student' | 'admin';
  registeredEvents: string[];
  createdAt?: string;
}

export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop' | 'seminar';
  image?: string;
  organizer: string;
  registrationDeadline: string;
  capacity: number;
  registeredStudents: StudentRegistration[];
  createdAt?: string;
}

export interface StudentRegistration {
  _id?: string;
  name: string;
  email: string;
  prn: string;
  class: string;
  division: string;
  registrationDate: string;
}

export interface EventStats {
  totalRegistrations: number;
  registrationsPerDay: Array<{ date: string; count: number }>;
  classwiseDistribution: Array<{ class: string; count: number }>;
  divisionwiseDistribution: Array<{ division: string; count: number }>;
}

export interface AuthContextType {
  user: Student | null;
  loading: boolean;
  login: (user: Student) => void;
  logout: () => void;
  setUser: (user: Student) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errors?: string[];
  user?: Student;
  event?: Event;
  events?: Event[];
  users?: Student[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  prn: string;
  class: string;
  division: string;
} 