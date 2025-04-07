# PCCOE Events Application Deployment Guide

This guide provides instructions for deploying the PCCOE Events application to a production environment using Vercel.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
  - [Vercel Deployment](#vercel-deployment)
  - [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Testing Your Deployment](#testing-your-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account (for Vercel deployment)
2. A MongoDB Atlas account (for the database)
3. The application code pushed to a GitHub repository
4. Node.js and npm installed locally for testing

## Deployment Options

### Vercel Deployment

#### Method 1: Using the Vercel Dashboard (Recommended)

1. Sign up or log in to [Vercel](https://vercel.com)
2. Click "Add New" and select "Project"
3. Import your GitHub repository containing the PCCOE Events application
4. Configure project:
   - Set the root directory to where your Next.js application is located (if not in the repository root)
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
5. Configure environment variables (see [Environment Variables](#environment-variables) section)
6. Click "Deploy"

#### Method 2: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory and run:
   ```bash
   vercel
   ```

3. Follow the prompts to link to your Vercel account and configure your project

### Manual Deployment

If not using Vercel, you can deploy the application to any platform that supports Node.js:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Set up a process manager like PM2 to keep the application running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "pccoe-events" -- start
   ```

## Environment Variables

Create the following environment variables in your deployment platform:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
NEXTAUTH_SECRET=your_random_secure_secret
NEXTAUTH_URL=https://your-deployment-url.com
NODE_ENV=production
```

Notes:
- Replace placeholders with your actual MongoDB connection string
- Generate a random secure string for NEXTAUTH_SECRET
- Set NEXTAUTH_URL to your actual deployment URL

## Database Setup

1. Create a MongoDB Atlas cluster:
   - Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier works for testing)
   - Set up a database user with read/write permissions
   - Whitelist all IP addresses (0.0.0.0/0) or specific IPs for your deployment

2. Configure the connection string:
   - In the Vercel dashboard, go to your project settings
   - Add the MONGODB_URI environment variable with your connection string

3. Initialize admin user:
   - After deployment, create at least one admin user using the signup page
   - You can use the provided script to create an admin user directly in the database

## Testing Your Deployment

After deployment, verify:

1. Authentication works (signup and login)
2. Admin and student dashboards load correctly
3. Events can be created and managed by admins
4. Students can register for events

Use the `test-deployment.sh` script to quickly verify key endpoints:

```bash
./test-deployment.sh https://your-deployment-url.com
```

Look for the deployment status indicators on both admin and student dashboards to verify the deployment is working correctly.

## Troubleshooting

Common issues and solutions:

1. **Database connection problems**
   - Verify your MONGODB_URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure your database user has the correct permissions

2. **Authentication issues**
   - Check that NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
   - Verify that your browser allows cookies for the deployed domain

3. **Build failures**
   - Check the build logs for specific errors
   - Ensure all dependencies are properly installed
   - Verify that your code doesn't have any TypeScript or ESLint errors

4. **Missing environment variables**
   - In the Vercel dashboard, go to your project settings
   - Check that all required environment variables are set

5. **Deployment appears blank or shows 404**
   - Ensure the build completed successfully
   - Check if the correct branch was deployed
   - Verify routing in Next.js configuration

For more help, check the Vercel documentation or contact your system administrator. 