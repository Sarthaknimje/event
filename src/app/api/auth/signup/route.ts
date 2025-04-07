import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, prn, class: className, division, role } = await req.json();
    
    // Check if required fields are present
    if (!name || !email || !password || !prn) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { prn }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email or PRN already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user - use the role from the request or default to 'student'
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      prn,
      class: className,
      division,
      role: role || 'student',
      registeredEvents: []
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    
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