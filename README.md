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