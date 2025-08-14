# 🚀 Render Deployment Guide for f-dev Branch

## Prerequisites
- MongoDB Atlas account
- Render.com account
- GitHub repository connected

## Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new cluster (M0 Free tier)

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Add database name: `sales-inventory`

## Step 2: Backend Deployment

1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `ZoyaAnsari19/sales-inventory-dashboard`
   - **Important:** Select branch `f-dev`

3. **Service Configuration:**
   - **Name:** `sales-inventory-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** `backend`

4. **Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sales-inventory
   PORT=10000
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL: `https://sales-inventory-backend.onrender.com`

## Step 3: Frontend Deployment

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository: `ZoyaAnsari19/sales-inventory-dashboard`
   - **Important:** Select branch `f-dev`

2. **Site Configuration:**
   - **Name:** `sales-inventory-frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist/sales-inventory-dashboard`

3. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL: `https://sales-inventory-frontend.onrender.com`

## Step 4: Update Frontend Environment

After backend deployment, update the frontend environment:

1. **Edit:** `src/environment.prod.ts`
2. **Update API URL:**
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://sales-inventory-backend.onrender.com/api'
   };
   ```
3. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin f-dev
   ```

## Step 5: Testing

1. **Test Backend API:**
   ```bash
   curl https://sales-inventory-backend.onrender.com
   ```

2. **Test Frontend:**
   - Open `https://sales-inventory-frontend.onrender.com`
   - Try adding a product
   - Check if data saves to MongoDB

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (should be 18+)
   - Verify all dependencies in package.json

2. **MongoDB Connection:**
   - Ensure MongoDB Atlas network access allows `0.0.0.0/0`
   - Verify connection string format

3. **Environment Variables:**
   - Double-check MONGO_URI format
   - Ensure all required variables are set

### Support:
- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
