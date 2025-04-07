/**
 * PCCOE Event Management System Validation Script
 * 
 * This script checks if all the necessary files and components are present
 * and whether the application structure is valid.
 */

const fs = require('fs');
const path = require('path');

console.log('Validating PCCOE Event Management System...');

// Define all the expected files
const expectedFiles = [
  // Core pages
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/events/page.tsx',
  'src/app/events/[id]/page.tsx',
  'src/app/auth/login/page.tsx',
  'src/app/auth/signup/page.tsx',
  'src/app/student/dashboard/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/events/create/page.tsx',
  'src/app/admin/events/[id]/page.tsx',
  
  // Components
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  
  // Hooks and types
  'src/lib/hooks.ts',
  'src/lib/types.ts',
  
  // Styles
  'src/styles/globals.css',
  
  // Configuration files
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'package.json',
  
  // Public assets
  'public/technical-event.svg',
  'public/cultural-event.svg',
  'public/sports-event.svg',
  'public/workshop-event.svg',
  'public/seminar-event.svg',
  'public/event-default.svg',
  'public/logo.png',
  'public/clg.jpeg'
];

// Check if all expected files exist
let missingFiles = [];
let fileCount = 0;

console.log('\nChecking files...');
for (const file of expectedFiles) {
  const fullPath = path.join(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file}`);
    fileCount++;
  } else {
    console.log(`✗ Missing: ${file}`);
    missingFiles.push(file);
  }
}

// Validate package.json dependencies
console.log('\nValidating dependencies...');
const packageJson = require('./package.json');
const requiredDeps = [
  'next', 'react', 'react-dom', 'typescript', 'tailwindcss',
  'chart.js', 'react-chartjs-2', 'react-icons', 'framer-motion'
];

let missingDeps = [];
for (const dep of requiredDeps) {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✓ ${dep}`);
  } else {
    console.log(`✗ Missing dependency: ${dep}`);
    missingDeps.push(dep);
  }
}

// Print validation summary
console.log('\n=== Validation Summary ===');
console.log(`Files: ${fileCount}/${expectedFiles.length} found`);
if (missingFiles.length > 0) {
  console.log(`Missing files: ${missingFiles.length}`);
}

console.log(`Dependencies: ${requiredDeps.length - missingDeps.length}/${requiredDeps.length} found`);

if (missingFiles.length === 0 && missingDeps.length === 0) {
  console.log('\n✅ Validation passed! The application is correctly structured.');
  console.log('\nTo test the application:');
  console.log('1. Start the development server with "npm run dev"');
  console.log('2. Open your browser to http://localhost:3000');
  console.log('3. Use the test script to create sample data:');
  console.log('   - Open browser console in the running application');
  console.log('   - Copy/paste the contents of test-storage.js into the console');
  console.log('   - Use these credentials to log in:');
  console.log('     * Student: student@pccoepune.org / password123');
  console.log('     * Admin: admin@pccoepune.org / adminpass');
} else {
  console.log('\n❌ Validation failed. Please fix the missing components.');
} 