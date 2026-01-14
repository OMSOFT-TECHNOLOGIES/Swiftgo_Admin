// Test script for the signup functionality
const API_BASE = 'https://api.swiftgo.com'; // Update this to your actual API endpoint

async function testSignup() {
  console.log('Testing signup functionality...');
  
  const testUser = {
    fullName: 'Test Admin User',
    email: 'test.admin@globeswiftgo.com.gh',
    password: 'TestPassword123!',
    type: 'admin'
  };

  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Signup successful!');
      console.log('Response data:', data);
      
      // Check if we received the expected fields
      if (data.token && (data.admin || data.user)) {
        console.log('✅ Response contains required fields: token and user data');
      } else {
        console.log('⚠️  Response missing expected fields');
        console.log('Expected: token, admin/user');
        console.log('Received keys:', Object.keys(data));
      }
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('❌ Signup failed');
      console.log('Error data:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

async function testLogin() {
  console.log('\nTesting login functionality...');
  
  const loginCredentials = {
    email: 'test.admin@globeswiftgo.com.gh',
    password: 'TestPassword123!'
  };

  try {
    const response = await fetch(`${API_BASE}/api/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginCredentials)
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('Response data:', data);
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('❌ Login failed');
      console.log('Error data:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run tests
(async () => {
  console.log('🚀 Starting SwitGo Admin Signup Test');
  console.log('=====================================');
  
  await testSignup();
  await testLogin();
  
  console.log('\n✨ Test completed!');
  console.log('Note: Update the API_BASE constant in this file to match your actual API endpoint.');
})();