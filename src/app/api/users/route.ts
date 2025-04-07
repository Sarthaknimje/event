import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET /api/users - Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get users, excluding password field
    const users = await User.find({}).select('-password');
    
    return NextResponse.json({ success: true, users });
    
  } catch (error: any) {
    console.error('Error processing users request:', error);
    
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

// POST /api/users - Create a new user (admin function)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { prn: body.prn }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email or PRN already exists' },
        { status: 409 }
      );
    }
    
    // Create the user
    const user = new User(body);
    await user.save();
    
    // Return user without password
    const savedUser = user.toObject();
    delete savedUser.password;
    
    return NextResponse.json(
      { success: true, message: 'User created successfully', user: savedUser },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error processing users request:', error);
    
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