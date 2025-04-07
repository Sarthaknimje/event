import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';
import mongoose from 'mongoose';
import { StudentRegistration } from '@/lib/types';

// Handler for POST request to register for an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the event has reached its capacity
    if (event.registeredStudents.length >= event.capacity) {
      return NextResponse.json(
        { success: false, message: 'Event is at full capacity' },
        { status: 400 }
      );
    }

    // Check if registration deadline has passed
    const registrationDeadline = new Date(event.registrationDeadline);
    const currentDate = new Date();
    if (currentDate > registrationDeadline) {
      return NextResponse.json(
        { success: false, message: 'Registration deadline has passed' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const alreadyRegistered = event.registeredStudents.some(
      (student: StudentRegistration) => student.email === user.email
    );
    
    if (alreadyRegistered) {
      return NextResponse.json(
        { success: false, message: "User is already registered for this event" },
        { status: 400 }
      );
    }

    // Create student registration object
    const studentRegistration = {
      name: user.name,
      email: user.email,
      prn: user.prn,
      class: user.class,
      division: user.division,
      registrationDate: new Date().toISOString()
    };

    // Add user to event's registered students
    event.registeredStudents.push(studentRegistration);
    await event.save();

    // Add event to user's registered events if not already added
    if (!user.registeredEvents.includes(id)) {
      user.registeredEvents.push(id);
      await user.save();
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully registered for the event',
        event: event
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register for event' },
      { status: 500 }
    );
  }
} 