#!/usr/bin/env node

const https = require('https');

// Fixed API URL
const API_URL = 'https://api-surius.ru.tuna.am';

// Test webhook endpoint
const testWebhook = async (url, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📨 Response: ${responseData}`);
        resolve({ status: res.statusCode, data: responseData });
      });
    });
    
    req.on('error', (err) => {
      console.error(`❌ Error: ${err.message}`);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
};

// Test cases
const runTests = async () => {
  console.log('🧪 Testing webhook endpoints...\n');
  console.log(`🔗 Using API URL: ${API_URL}\n`);
  
  try {
    // Test 1: General webhook
    console.log('1️⃣ Testing general webhook...');
    await testWebhook(`${API_URL}/api/webhooks`, {
      type: 'user.created',
      data: { id: 123, name: 'John Doe', email: 'john@example.com' }
    });
    
    console.log('\n');
    
    // Test 2: System-specific webhook
    console.log('2️⃣ Testing system-specific webhook...');
    await testWebhook(`${API_URL}/api/webhooks/stripe`, {
      event: 'payment.completed',
      amount: 1000,
      currency: 'usd',
      customer: 'cus_123456'
    });
    
    console.log('\n');
    
    // Test 3: Health check
    console.log('3️⃣ Testing health check...');
    const healthUrl = `${API_URL}/api/health`;
    const healthReq = https.get(healthUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ Health Status: ${res.statusCode}`);
        console.log(`📊 Response: ${data}`);
      });
    });
    
    healthReq.on('error', (err) => {
      console.error(`❌ Health check error: ${err.message}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run tests
runTests();
