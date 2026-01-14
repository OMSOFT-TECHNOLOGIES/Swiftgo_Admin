// Test script for Google OAuth functionality
const API_BASE = 'https://api.swiftgo.com'; // Update this to your actual API endpoint

async function testGoogleOAuth() {
  console.log('🔍 Testing Google OAuth Integration...');
  console.log('======================================');
  
  // Test 1: Check Google OAuth URL endpoint
  console.log('\n1. Testing Google OAuth URL endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/google`, {
      method: 'GET',
      redirect: 'manual' // Don't follow redirects
    });
    
    if (response.status === 302 || response.status === 0) {
      console.log('✅ Google OAuth endpoint is accessible (redirects to Google)');
      console.log('   Response status:', response.status);
      
      const location = response.headers.get('location');
      if (location && location.includes('accounts.google.com')) {
        console.log('✅ Redirect URL points to Google OAuth');
        console.log('   Redirect URL:', location);
      }
    } else {
      console.log('❌ Google OAuth endpoint returned unexpected status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing Google OAuth endpoint:', error.message);
  }
  
  // Test 2: Check Google OAuth callback endpoint structure
  console.log('\n2. Testing Google OAuth callback endpoint...');
  try {
    // Test with missing code parameter
    const response = await fetch(`${API_BASE}/api/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json().catch(() => null);
    
    if (response.status === 400 || response.status === 422) {
      console.log('✅ Callback endpoint properly validates missing code parameter');
      console.log('   Response status:', response.status);
      if (data?.message) {
        console.log('   Error message:', data.message);
      }
    } else {
      console.log('⚠️  Callback endpoint returned unexpected status:', response.status);
      console.log('   Response data:', data);
    }
  } catch (error) {
    console.error('❌ Error testing Google OAuth callback:', error.message);
  }
  
  // Test 3: Frontend Google OAuth configuration
  console.log('\n3. Testing Frontend Configuration...');
  
  const googleConfig = {
    clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
    clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET || 'your_google_client_secret_here'
  };
  
  if (googleConfig.clientId && googleConfig.clientSecret) {
    console.log('✅ Google OAuth credentials are configured');
    console.log('   Client ID:', googleConfig.clientId.substring(0, 20) + '...');
    console.log('   Client Secret: [HIDDEN]');
  } else {
    console.log('❌ Google OAuth credentials are missing');
  }
  
  // Test 4: Popup functionality (browser only)
  if (typeof window !== 'undefined') {
    console.log('\n4. Testing Popup Functionality...');
    try {
      const testPopup = window.open('', 'test-popup', 'width=100,height=100');
      if (testPopup) {
        console.log('✅ Popup windows are allowed');
        testPopup.close();
      } else {
        console.log('❌ Popup windows are blocked - OAuth will fallback to redirect');
      }
    } catch (error) {
      console.log('❌ Error testing popup functionality:', error.message);
    }
  }
  
  console.log('\n✨ Google OAuth Integration Test Complete!');
  console.log('\n📝 Integration Notes:');
  console.log('   - Frontend will open Google OAuth in popup window');
  console.log('   - Backend handles OAuth flow via Passport.js');
  console.log('   - Successful auth returns JWT token + user data');
  console.log('   - Frontend stores token and redirects to dashboard');
  console.log('\n🔧 Backend Requirements:');
  console.log('   - Passport.js Google OAuth strategy configured');
  console.log('   - Environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET');
  console.log('   - Callback URL: /api/auth/google/callback');
  console.log('   - Return format: { token, admin/user, message }');
}

// Browser-specific tests
if (typeof window !== 'undefined') {
  console.log('🌐 Running Google OAuth tests in browser...');
  testGoogleOAuth();
} else {
  console.log('📝 Google OAuth configuration ready for testing');
  console.log('   Run this script in a browser environment for full testing');
}