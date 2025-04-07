import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET /api/users/export - Export all users with student role
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Check for authorization (should be admin only)
    // In a real-world scenario, we'd verify a session token or JWT
    // But for this demo, we'll just return the data
    
    // Query all students
    const students = await User.find({ role: 'student' })
      .select('-password') // Exclude password field
      .lean();
    
    return NextResponse.json({ success: true, students });
    
  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export users' },
      { status: 500 }
    );
  }
} 