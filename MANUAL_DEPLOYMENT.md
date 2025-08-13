# 🚀 Manual Deployment Guide for Render

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
   - Configure settings:
     - **Name:** `sales-inventory-backend`
     - **Environment:** `Node`
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && node server.js`
     - **Root Directory:** `backend`

3. **Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sales-inventory
   PORT=10000
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL: `https://sales-inventory-backend.onrender.com`

## Step 3: Frontend Deployment

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure settings:
     - **Name:** `sales-inventory-frontend`
     - **Build Command:** `npm run build`
     - **Publish Directory:** `dist/sales-inventory-dashboard`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   ```

3. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment
   - Note the URL: `https://sales-inventory-frontend.onrender.com`

## Step 4: Update Frontend API URL

1. **Update environment.prod.ts:**
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://sales-inventory-backend.onrender.com/api'
   };
   ```

2. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin main
   ```

## Step 5: Test Deployment

1. **Test Backend:**
   - Visit: `https://sales-inventory-backend.onrender.com`
   - Should show: "Backend is running ✅"

2. **Test Frontend:**
   - Visit: `https://sales-inventory-frontend.onrender.com`
   - Should load the Angular app

3. **Test API Connection:**
   - Try creating a product
   - Check if data saves to MongoDB

## Troubleshooting

### Common Issues:
1. **Build Failures:**
   - Check build logs in Render dashboard
   - Verify package.json dependencies

2. **MongoDB Connection:**
   - Ensure connection string is correct
   - Check IP whitelist in MongoDB Atlas

3. **CORS Issues:**
   - Backend CORS is already configured
   - Check if frontend URL is allowed

### Support:
- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com

## URLs After Deployment:
- **Backend:** `https://sales-inventory-backend.onrender.com`
- **Frontend:** `https://sales-inventory-frontend.onrender.com`
- **API Base:** `https://sales-inventory-backend.onrender.com/api`
