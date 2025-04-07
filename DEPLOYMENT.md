# Deploying PCCOE Events to Vercel

This guide will help you deploy the PCCOE Event Management System to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [GitHub](https://github.com) account
3. A MongoDB database (MongoDB Atlas recommended for production)

## Steps to Deploy

### 1. Push your code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git remote add origin https://github.com/yourusername/pccoe-events.git
git push -u origin main
```

### 2. Connect to Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Select the GitHub repository containing your PCCOE Events project
4. Vercel will automatically detect the Next.js framework

### 3. Configure Environment Variables

In the Vercel deployment interface, add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb://your-mongodb-url/clg` | Your MongoDB connection string |
| `NEXTAUTH_SECRET` | `a-long-random-string` | Secret for NextAuth session encryption |
| `NEXTAUTH_URL` | `https://your-vercel-url.vercel.app` | Your Vercel deployment URL |

For MongoDB:
- For development, you can use local MongoDB (`mongodb://localhost:27017/clg`)
- For production, use MongoDB Atlas (`mongodb+srv://username:password@cluster.mongodb.net/clg`)

### 4. Deploy

Click the "Deploy" button and wait for the build to complete.

### 5. Test Your Deployment

Once deployed, you can test the API endpoints using the provided script:

```bash
chmod +x test-deployment.sh
./test-deployment.sh https://your-vercel-url.vercel.app
```

## Troubleshooting

### MongoDB Connection Issues

- Make sure your MongoDB connection string is correctly formatted
- For MongoDB Atlas, ensure your IP address is whitelisted in the Network Access settings
- Add "retryWrites=true&w=majority" to your MongoDB Atlas connection string

### Build Failures

If you encounter build failures:

1. Check the Vercel build logs for specific errors
2. Ensure all dependencies are correctly listed in package.json
3. Verify that all API routes are properly formatted

### API Endpoint Issues

If API endpoints are not working:

1. Check browser console for specific error messages
2. Verify that MongoDB is properly connected
3. Ensure environment variables are correctly set in Vercel

## Continuous Deployment

Vercel will automatically redeploy your application whenever you push changes to your GitHub repository. To manually trigger a redeployment:

1. Go to your project in the Vercel dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment 