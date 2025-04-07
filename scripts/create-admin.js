/**
 * Script to create an admin user in MongoDB
 * 
 * Usage:
 * node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clg';

// Define the user schema similar to our app
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  prn: String,
  class: String,
  division: String,
  role: String,
  registeredEvents: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model
const User = mongoose.model('User', UserSchema);

// Function to create admin user
async function createAdmin(userData) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      console.log('User with this email already exists');
      
      // If not an admin, update to admin
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('User role updated to admin');
      } else {
        console.log('User is already an admin');
      }
      
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create admin user
    const adminUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      prn: userData.prn,
      class: userData.class,
      division: userData.division,
      role: 'admin',
      registeredEvents: [],
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Interactive prompt for user details
function promptUserDetails() {
  const userData = {};
  
  rl.question('Enter admin name: ', (name) => {
    userData.name = name;
    
    rl.question('Enter admin email: ', (email) => {
      userData.email = email;
      
      rl.question('Enter admin password: ', (password) => {
        userData.password = password;
        
        rl.question('Enter admin PRN: ', (prn) => {
          userData.prn = prn;
          
          rl.question('Enter admin class (e.g., BE): ', (cls) => {
            userData.class = cls;
            
            rl.question('Enter admin division (e.g., A): ', (division) => {
              userData.division = division;
              rl.close();
              
              createAdmin(userData).then(() => {
                process.exit(0);
              });
            });
          });
        });
      });
    });
  });
}

// Start the script
console.log('Creating admin user for PCCOE Event Management System');
promptUserDetails(); 