import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

// GET /api/events - Get all events
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const searchTerm = url.searchParams.get('search');
    
    // Build query
    let query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { organizer: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Fetch events
    const events = await Event.find(query).sort({ date: -1 });
    
    return NextResponse.json({ success: true, events });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Create the event
    const event = new Event(body);
    await event.save();
    
    return NextResponse.json(
      { success: true, message: 'Event created successfully', event },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error creating/fetching events:', error);
    
    // Handle validation errors
    if (error && error.name === 'ValidationError' && error.errors) {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
} 