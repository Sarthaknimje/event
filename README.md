# PCCOE Event Management System

A comprehensive web application for managing events at Pimpri Chinchwad College of Engineering (PCCOE), Pune. The system allows administrators to create and manage events, while students can browse and register for these events.

## Features

### For Students
- Browse upcoming events with filters and search
- View detailed event information
- Register for events with college email verification
- Track registered events in student dashboard
- Responsive UI for all devices

### For Administrators
- Comprehensive admin dashboard with analytics
- Create and manage events
- View and export participant lists
- Filter and search through registrations
- Monitor event registration statistics

## Technology Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Visualization**: Chart.js
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Storage**: Local Storage (client-side)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pccoe-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Student Account
- Sign up with your college email (ending with @pccoepune.org)
- Enter your PRN, class, and division details
- Browse events and register for the ones you're interested in
- View your registered events in your dashboard

### Administrator Account
- Login with an admin account (You can sign up and modify the role to 'admin' in localStorage for testing)
- View analytics on the admin dashboard
- Create new events with detailed information
- Manage existing events and view participant lists

## Local Storage Schema

The application uses the following localStorage items:
- `pccoe_users`: Array of registered users
- `pccoe_events`: Array of events
- `pccoe_current_user`: Currently logged in user information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Built for Pimpri Chinchwad College of Engineering, Pune
- Made with ❤️ by PCCOE students 

## Deployment

### Deploying to Vercel

This application is optimized for deployment on Vercel. Follow these steps to deploy:

1. **Create a Vercel Account**: If you don't have one, sign up at [vercel.com](https://vercel.com).

2. **Push to GitHub**: Make sure your project is pushed to a GitHub repository.

3. **Connect to Vercel**:
   - Log in to Vercel and click "Import Project"
   - Select your GitHub repository 
   - Select the "Next.js" framework preset

4. **Set Environment Variables**:
   In the Vercel deployment settings, add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/pccoe_events?retryWrites=true&w=majority`)
   - `NEXTAUTH_SECRET`: A random secure string for session encryption (you can generate one with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)

5. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Vercel will automatically build and deploy your application

### Setting up MongoDB Atlas for Production

1. **Create MongoDB Atlas Account**: 
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in
   - Create a new cluster (the free tier is sufficient to start)

2. **Configure Database Access**:
   - Go to "Database Access" and create a new database user with a secure password
   - Assign read/write permissions to this user

3. **Configure Network Access**:
   - Go to "Network Access" and add a new IP address
   - For development, you can allow access from anywhere (`0.0.0.0/0`)
   - For more security, restrict to Vercel IP addresses

4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string and replace `<username>`, `<password>`, and `<dbname>` with your credentials and database name (`pccoe_events`)

### Testing Your Deployment

After deploying to Vercel, you can test the API endpoints using the provided script:

```bash
chmod +x test-deployment.sh
./test-deployment.sh https://your-vercel-app-url.vercel.app
```

This script will check all endpoints for correct responses and help ensure your deployment is working properly.

### Alternative Deployment Options

#### Deploy to Heroku

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the Heroku CLI and login
3. Create a new Heroku app: `heroku create pccoe-events`
4. Add MongoDB add-on or set environment variables for external MongoDB
5. Push to Heroku: `git push heroku main`

#### Self-Hosting

1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Consider using PM2 for process management in production

## Export Functionality

The application includes functionality to export student data in CSV and PDF formats:

- **CSV Export**: Exports a spreadsheet with student information
- **PDF Export**: Generates a formatted PDF document with student data

This feature is available to administrators from the dashboard. 