import mongoose, { Schema } from 'mongoose';

// User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  prn: {
    type: String,
    required: [true, 'Please provide a PRN'],
    unique: true,
  },
  class: {
    type: String,
    required: [true, 'Please provide a class'],
  },
  division: {
    type: String,
    required: [true, 'Please provide a division'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  registeredEvents: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 