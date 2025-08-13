const https = require('https');
const fs = require('fs');

// Your Render token
const RENDER_TOKEN = 'rnd_RDWdvLTBgNBnZSjKSz5XD77WQD9m';

// Function to make API request
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      path: url,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Deploy function
async function deploy() {
  try {
    console.log('🚀 Starting deployment to Render...');
    
    // Get services list
    console.log('📋 Getting services list...');
    const services = await makeRequest('/v1/services');
    console.log('Services found:', services.length);
    
    // Find backend service
    const backendService = services.find(s => s.name === 'sales-inventory-backend');
    if (backendService) {
      console.log('🔧 Deploying backend...');
      await makeRequest(`/v1/services/${backendService.id}/deploys`, 'POST');
      console.log('✅ Backend deployment triggered');
    } else {
      console.log('❌ Backend service not found');
    }
    
    // Find frontend service
    const frontendService = services.find(s => s.name === 'sales-inventory-frontend');
    if (frontendService) {
      console.log('🎨 Deploying frontend...');
      await makeRequest(`/v1/services/${frontendService.id}/deploys`, 'POST');
      console.log('✅ Frontend deployment triggered');
    } else {
      console.log('❌ Frontend service not found');
    }
    
    console.log('🎉 Deployment process completed!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

// Run deployment
deploy();
