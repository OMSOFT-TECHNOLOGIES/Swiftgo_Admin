// Debug utility for testing API calls
import { authService } from '../services/auth';

export const debugApi = {
  // Test the API endpoint directly
  async testLoginEndpoint() {
    const url = 'http://localhost:5000/api/auth/login/admin';
    const credentials = {
      email: "admin@swiftgo.com",
      password: "secure_password_123"
    };

    console.log('🧪 Testing raw fetch to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Raw Response Status:', response.status);
      console.log('Raw Response Headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw Response Body:', responseText);
      
      if (responseText) {
        try {
          const responseJson = JSON.parse(responseText);
          console.log('Parsed Response:', responseJson);
        } catch (e) {
          console.log('Response is not JSON');
        }
      }
      
      return { status: response.status, body: responseText };
    } catch (error) {
      console.error('Raw fetch error:', error);
      throw error;
    }
  },

  // Test CORS preflight
  async testCors() {
    const url = 'http://localhost:5000/api/auth/login/admin';
    
    console.log('🧪 Testing CORS preflight to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3002',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      console.log('CORS Preflight Status:', response.status);
      console.log('CORS Headers:', Object.fromEntries(response.headers.entries()));
      
      return response.status;
    } catch (error) {
      console.error('CORS preflight error:', error);
      throw error;
    }
  },

  // Test using the auth service
  async testAuthService() {
    console.log('🧪 Testing auth service login...');
    
    try {
      const result = await authService.login({
        email: "admin@swiftgo.com",
        password: "secure_password_123",
        rememberMe: false
      });
      
      console.log('Auth service result:', result);
      return result;
    } catch (error) {
      console.error('Auth service error:', error);
      throw error;
    }
  },

  // Check current configuration
  checkConfig() {
    console.log('🔧 Current Configuration:');
    console.log('API Base URL:', import.meta.env.VITE_API_URL);
    console.log('Login Endpoint:', '/api/auth/login/admin');
    console.log('Full Login URL:', `${import.meta.env.VITE_API_URL}/api/auth/login/admin`);
    console.log('Current Origin:', window.location.origin);
  }
};

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).debugApi = debugApi;
  console.log('🔍 Debug API utilities loaded!');
  console.log('Available methods:');
  console.log('- debugApi.testLoginEndpoint()');
  console.log('- debugApi.testCors()');
  console.log('- debugApi.testAuthService()');
  console.log('- debugApi.checkConfig()');
}
