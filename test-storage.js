// This script simulates the localStorage functionality of the app

// Sample student user
const testStudent = {
  name: "Test Student",
  email: "student@pccoepune.org",
  password: "password123",
  prn: "1234567890",
  class: "TE",
  division: "A",
  role: "student",
  registeredEvents: []
};

// Sample admin user
const testAdmin = {
  name: "Admin User",
  email: "admin@pccoepune.org",
  password: "adminpass",
  prn: "9876543210",
  class: "BE",
  division: "B",
  role: "admin",
  registeredEvents: []
};

// Sample events
const sampleEvents = [
  {
    id: "evt-1",
    title: "Technical Workshop on AI",
    description: "Learn about the basics of Artificial Intelligence and its applications in the real world. This workshop will cover fundamental concepts and hands-on exercises.",
    date: "2023-12-15",
    time: "10:00 AM",
    location: "Seminar Hall 1, PCCOE",
    category: "technical",
    image: "/technical-event.svg",
    organizer: "Computer Department",
    registrationDeadline: "2023-12-10",
    capacity: 50,
    registeredStudents: []
  },
  {
    id: "evt-2",
    title: "Cultural Fest 2023",
    description: "Annual cultural festival with dance, music, drama and various other cultural activities. Participate and showcase your talent.",
    date: "2023-11-20",
    time: "9:00 AM",
    location: "Main Auditorium, PCCOE",
    category: "cultural",
    image: "/cultural-event.svg",
    organizer: "Student Council",
    registrationDeadline: "2023-11-15",
    capacity: 100,
    registeredStudents: []
  },
  {
    id: "evt-3",
    title: "Sports Tournament",
    description: "Inter-college sports tournament featuring cricket, football, basketball, and many more sports. Represent your class and win exciting prizes.",
    date: "2023-10-25",
    time: "8:00 AM",
    location: "Sports Ground, PCCOE",
    category: "sports",
    image: "/sports-event.svg",
    organizer: "Sports Department",
    registrationDeadline: "2023-10-20",
    capacity: 200,
    registeredStudents: []
  }
];

// Store the data in localStorage (will only work in browser environment)
if (typeof localStorage !== 'undefined') {
  const users = [testStudent, testAdmin];
  localStorage.setItem('pccoe_users', JSON.stringify(users));
  localStorage.setItem('pccoe_events', JSON.stringify(sampleEvents));
  console.log('Test data set up successfully!');
} else {
  console.log('This script needs to be run in a browser environment with localStorage support');
}

// Instructions to use this script:
// 1. Open the browser console in the application
// 2. Copy and paste this entire script into the console
// 3. Press Enter to execute
// 4. The test data will be stored in your browser's localStorage
// 5. Use these credentials to test:
//    - Student: student@pccoepune.org / password123
//    - Admin: admin@pccoepune.org / adminpass 