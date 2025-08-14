# Render Deployment Guide

## Prerequisites
1. MongoDB Atlas account (for database)
2. Render account
3. GitHub repository with your code

## Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your actual password

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file
6. Set the `MONGODB_URI` environment variable in the backend service

### Option B: Manual Deployment

#### Backend Deployment:
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sales-inventory-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (will use root)

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string

#### Frontend Deployment:
1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `sales-inventory-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/sales-inventory-dashboard/browser`

5. Add Environment Variables:
   - `API_URL`: `https://your-backend-service-name.onrender.com/api`

## Step 3: Update Frontend API URL
After backend deployment, update the frontend environment:
1. Go to your frontend service in Render
2. Add/Update environment variable:
   - `API_URL`: `https://your-backend-service-name.onrender.com/api`

## Step 4: Test Your Deployment
1. Backend should be accessible at: `https://your-backend-service-name.onrender.com`
2. Frontend should be accessible at: `https://your-frontend-service-name.onrender.com`

## Troubleshooting
- Check Render logs for build errors
- Ensure MongoDB connection string is correct
- Verify all environment variables are set
- Check CORS settings if frontend can't connect to backend

## Environment Variables Reference
### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Frontend
```
API_URL=https://your-backend-service-name.onrender.com/api
```
