const https = require('https');

const RENDER_TOKEN = 'rnd_RDWdvLTBgNBnZSjKSz5XD77WQD9m';

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

async function createServices() {
  try {
    console.log('🚀 Creating Render services...');
    
    // Get owner ID (you need to replace this with your actual owner ID)
    const owners = await makeRequest('/v1/owners');
    const owner = owners[0]; // Assuming first owner
    console.log('Owner ID:', owner.id);
    
    // Create Backend Service
    console.log('🔧 Creating backend service...');
    const backendService = await makeRequest('/v1/services', 'POST', {
      name: 'sales-inventory-backend',
      type: 'web_service',
      ownerId: owner.id,
      repo: 'https://github.com/ZoyaAnsari19/sales-inventory-dashboard',
      branch: 'main',
      rootDir: 'backend',
      buildCommand: 'npm install',
      startCommand: 'node server.js',
      plan: 'free',
      envVars: [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '10000' }
      ]
    });
    console.log('✅ Backend service created:', backendService.id);
    
    // Create Frontend Service
    console.log('🎨 Creating frontend service...');
    const frontendService = await makeRequest('/v1/services', 'POST', {
      name: 'sales-inventory-frontend',
      type: 'static_site',
      ownerId: owner.id,
      repo: 'https://github.com/ZoyaAnsari19/sales-inventory-dashboard',
      branch: 'main',
      buildCommand: 'npm run build',
      publishPath: 'dist/sales-inventory-dashboard',
      plan: 'free'
    });
    console.log('✅ Frontend service created:', frontendService.id);
    
    console.log('🎉 All services created successfully!');
    console.log('Backend URL:', `https://${backendService.serviceId}.onrender.com`);
    console.log('Frontend URL:', `https://${frontendService.serviceId}.onrender.com`);
    
  } catch (error) {
    console.error('❌ Service creation failed:', error.message);
  }
}

createServices();
