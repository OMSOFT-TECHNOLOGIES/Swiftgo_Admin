// Test script for the login implementation
// This can be run in the browser console to test the API service

import { authService } from './src/services/auth.js';
import { apiService } from './src/services/api.js';

// Test login with the specified credentials
async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    
    const credentials = {
      email: "admin@swiftgo.com",
      password: "secure_password_123",
      rememberMe: true
    };

    const response = await authService.login(credentials);
    
    console.log('Login successful!', response);
    console.log('Token stored:', authService.getToken());
    console.log('User data:', authService.getUser());
    console.log('Is authenticated:', authService.isAuthenticated());
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Test logout
async function testLogout() {
  try {
    console.log('Testing logout...');
    
    await authService.logout();
    
    console.log('Logout successful!');
    console.log('Token after logout:', authService.getToken());
    console.log('User data after logout:', authService.getUser());
    console.log('Is authenticated after logout:', authService.isAuthenticated());
    
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

// Test API configuration
function testApiConfig() {
  console.log('API Configuration:');
  console.log('Base URL:', import.meta.env.VITE_API_URL || 'https://api.swiftgo.com');
  console.log('Login endpoint:', '/api/auth/login/admin');
}

// Export functions for browser console testing
window.testSwiftGoAuth = {
  testLogin,
  testLogout,
  testApiConfig,
  authService,
  apiService
};

console.log('SwiftGo Auth Test Functions loaded!');
console.log('Available functions: testLogin(), testLogout(), testApiConfig()');
console.log('Access via: window.testSwiftGoAuth.testLogin()');
