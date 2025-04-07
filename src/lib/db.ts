import mongoose from 'mongoose';

// Connection object
let connection: { 
  isConnected: boolean | mongoose.Connection;
} = { 
  isConnected: false
};

async function dbConnect() {
  if (connection.isConnected) {
    // Use existing connection
    return;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pccoe_events';
  
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    connection.isConnected = db.connection;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect;