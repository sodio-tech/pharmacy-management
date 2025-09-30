// Simple test script to check our APIs without authentication
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testAPIs() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test products endpoint
    const productsResponse = await makeRequest('/api/products');
    console.log('Products API Status:', productsResponse.status);
    console.log('Products Response:', JSON.stringify(productsResponse.data, null, 2));
    
    console.log('\n---\n');
    
    // Test inventory stock endpoint
    const stockResponse = await makeRequest('/api/inventory/stock');
    console.log('Stock API Status:', stockResponse.status);
    console.log('Stock Response:', JSON.stringify(stockResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error testing APIs:', error);
  }
}

testAPIs();