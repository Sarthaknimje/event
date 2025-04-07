import mongoose, { Schema } from 'mongoose';

// StudentRegistration schema (embedded in Event)
const StudentRegistrationSchema = new Schema({
  name: String,
  email: String,
  prn: String,
  class: String,
  division: String,
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

// Event schema
const EventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
  },
  category: {
    type: String,
    required: [true, 'Please provide an event category'],
    enum: ['technical', 'cultural', 'sports', 'workshop', 'seminar'],
  },
  image: {
    type: String,
    default: '/event-default.svg',
  },
  organizer: {
    type: String,
    required: [true, 'Please provide an event organizer'],
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please provide a registration deadline'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide a capacity'],
    min: [1, 'Capacity must be at least 1'],
  },
  registeredStudents: {
    type: [StudentRegistrationSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema); 