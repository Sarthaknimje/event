# Deploying PCCOE Event Management System to Vercel

This guide provides step-by-step instructions for deploying the PCCOE Event Management System to Vercel.

## Prerequisites

1. **GitHub Account**: Ensure your code is pushed to GitHub (which you've already done)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account**: For the database

## Setting up MongoDB Atlas

1. **Create a MongoDB Atlas Account**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Click "Build a Cluster"
   - Choose the free tier option (M0)
   - Select a cloud provider and region close to your users
   - Click "Create Cluster"

3. **Set Up Database Access**:
   - Go to the "Database Access" tab
   - Click "Add New Database User"
   - Create a username and password (save these securely)
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to the "Network Access" tab
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" for development (you can restrict this later)
   - Click "Confirm"

5. **Get Connection String**:
   - Wait for the cluster to be created
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with "pccoe-events" or your preferred name

## Deploying to Vercel

### Method 1: Using the Vercel Dashboard (Recommended)

1. **Import Your GitHub Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Continue with GitHub" and authenticate
   - Select the `Sarthaknimje/event` repository
   - Choose the "pccoe-app" directory as the root

2. **Configure Project Settings**:
   - Project Name: Choose a name like "pccoe-event-management"
   - Framework Preset: Select "Next.js"
   - Root Directory: Set to "pccoe-app" if not already selected

3. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add `MONGODB_URI` with the connection string you obtained from MongoDB Atlas

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

5. **Access Your Application**:
   - Once deployed, Vercel will provide a URL like `https://pccoe-event-management.vercel.app`
   - Your application is now live!

### Method 2: Using the Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to Your Project Directory**:
   ```bash
   cd /path/to/pccoe-app
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Answer the prompts:
     - Set up and deploy: Yes
     - Link to existing project: No
     - Project name: pccoe-event-management
     - Directory: ./
     - Override settings: No

5. **Add Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   ```
   - Paste your MongoDB connection string
   - Choose which environments to add this to (Production, Preview, Development)

6. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

## Testing the Deployment

1. **Verify the Application Loads**:
   - Visit your Vercel deployment URL
   - Check that the homepage loads correctly

2. **Test Authentication**:
   - Try signing up as a new user
   - Login with the created credentials

3. **Test Event Creation**:
   - Login as an admin
   - Create a new event
   - Verify it appears on the events page

4. **Test API Endpoints**:
   - Use curl to test key API endpoints against your production URL
   - Example: `curl https://your-app.vercel.app/api/users/export`

## Troubleshooting

- **Build Errors**: Check the build logs in Vercel for detailed error messages
- **MongoDB Connection Issues**: Verify your connection string and network access settings
- **Environment Variables**: Ensure they're correctly set in the Vercel dashboard
- **Runtime Errors**: Check browser console and Vercel logs

## Updating Your Deployment

When you push changes to your GitHub repository, Vercel will automatically rebuild and deploy if you've set up continuous deployment.

To manually trigger a redeploy:
```bash
vercel --prod
```

## Custom Domain (Optional)

1. **Add a Custom Domain**:
   - In the Vercel dashboard, go to your project
   - Click "Settings" > "Domains"
   - Add your domain
   - Follow the instructions to configure DNS settings

## Security Considerations

1. **Restrict MongoDB Access**:
   - Update Network Access to only allow connections from your Vercel deployment
   - Use environment-specific variables for different environments
   
2. **Enable Authentication**:
   - Consider adding more robust authentication like NextAuth.js
   
3. **Regular Backups**:
   - Set up automated backups for your MongoDB database 