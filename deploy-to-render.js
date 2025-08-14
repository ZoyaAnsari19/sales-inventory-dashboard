#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Sales Inventory Dashboard - Render Deployment Helper');
console.log('=====================================================\n');

console.log('📋 Pre-deployment Checklist:');
console.log('1. ✅ MongoDB Atlas cluster created');
console.log('2. ✅ MongoDB connection string ready');
console.log('3. ✅ Code pushed to GitHub');
console.log('4. ✅ Render account created\n');

console.log('🔧 Next Steps:');
console.log('1. Go to https://dashboard.render.com');
console.log('2. Click "New" → "Blueprint"');
console.log('3. Connect your GitHub repository');
console.log('4. Render will auto-detect render.yaml');
console.log('5. Set MONGODB_URI environment variable\n');

console.log('📁 Files created for deployment:');
console.log('✅ render.yaml - Render configuration');
console.log('✅ RENDER_DEPLOYMENT_GUIDE.md - Detailed guide');
console.log('✅ backend/.env.example - Environment template\n');

console.log('🌐 After deployment:');
console.log('- Backend: https://sales-inventory-backend.onrender.com');
console.log('- Frontend: https://sales-inventory-frontend.onrender.com\n');

console.log('📞 Need help? Check RENDER_DEPLOYMENT_GUIDE.md for detailed instructions!');
