# 🔧 SwiftGo Admin Login Troubleshooting Guide

## 400 Bad Request Error - Common Solutions

### 1. **Check Your Backend API**

First, verify your backend server is running correctly:

```bash
# Check if your API server is running on localhost:5000
curl -X POST http://localhost:5000/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@swiftgo.com","password":"secure_password_123"}'
```

### 2. **CORS Configuration**

The most common cause of 400 errors in development is CORS. Your backend needs to allow requests from `http://localhost:3002`.

**Express.js Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
```

**Django Example:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3002",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

### 3. **Backend Validation**

Ensure your backend expects the correct request format:

**Expected Request:**
```json
POST /api/auth/login/admin
Content-Type: application/json

{
  "email": "admin@swiftgo.com",
  "password": "secure_password_123"
}
```

**Expected Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@swiftgo.com",
    "type": "admin",
    "name": "Admin Name"
  },
  "message": "Admin login successful"
}
```

**Expected Response (Error):**
```json
{
  "message": "Invalid credentials",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password is required"]
  }
}
```

### 4. **Debug Using Browser Console**

Open your browser's Developer Tools (F12) and try these commands:

```javascript
// Check current configuration
debugApi.checkConfig()

// Test raw API call
await debugApi.testLoginEndpoint()

// Test CORS preflight
await debugApi.testCors()

// Test using auth service
await debugApi.testAuthService()
```

### 5. **Common Backend Issues**

#### **Missing Route Handler**
```javascript
// Make sure you have this route in your backend
app.post('/api/auth/login/admin', (req, res) => {
  const { email, password } = req.body;
  
  // Your authentication logic here
  
  res.json({
    token: "your_jwt_token",
    admin: {
      id: 1,
      email: email,
      type: "admin",
      name: "Admin Name"
    },
    message: "Admin login successful"
  });
});
```

#### **Request Body Parsing**
```javascript
// Express.js - Make sure you have body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

#### **Validation Middleware**
```javascript
// Example validation that might cause 400 errors
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      errors: { email: ["Email field is required"] }
    });
  }
  
  if (!password) {
    return res.status(400).json({
      message: "Password is required", 
      errors: { password: ["Password field is required"] }
    });
  }
  
  next();
};
```

### 6. **Network Debugging**

#### **Check Network Tab**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Look for the POST request to `/api/auth/login/admin`
5. Check:
   - Request headers
   - Request payload
   - Response status
   - Response headers
   - Response body

#### **Common Network Issues**
- **Status 0**: Network error, server not reachable
- **Status 404**: Endpoint not found, check route
- **Status 405**: Method not allowed, check HTTP method
- **Status 500**: Server error, check backend logs

### 7. **Environment Configuration**

Verify your `.env` file is correct:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SwiftGo Admin
VITE_APP_VERSION=1.0.0
```

**Important:** Restart your Vite dev server after changing `.env`:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 8. **Testing with Postman/Insomnia**

Test your API directly with an API client:

```
POST http://localhost:5000/api/auth/login/admin
Content-Type: application/json

{
  "email": "admin@swiftgo.com",
  "password": "secure_password_123"
}
```

### 9. **Backend Logging**

Add logging to your backend to see what's being received:

```javascript
app.post('/api/auth/login/admin', (req, res) => {
  console.log('📥 Login request received:');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Method:', req.method);
  
  // Your login logic here
});
```

### 10. **Quick Backend Test Server**

If you don't have a backend yet, here's a simple test server:

```javascript
// test-server.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));

app.use(express.json());

app.post('/api/auth/login/admin', (req, res) => {
  console.log('Login request:', req.body);
  
  const { email, password } = req.body;
  
  if (email === 'admin@swiftgo.com' && password === 'secure_password_123') {
    res.json({
      token: 'test_jwt_token_12345',
      admin: {
        id: 1,
        email: email,
        type: 'admin',
        name: 'Test Admin'
      },
      message: 'Admin login successful'
    });
  } else {
    res.status(400).json({
      message: 'Invalid credentials'
    });
  }
});

app.listen(5000, () => {
  console.log('Test server running on http://localhost:5000');
});
```

Run with: `node test-server.js`

## Next Steps

1. **Start with CORS** - This is the most common issue
2. **Check backend logs** - See what error is actually happening
3. **Test with API client** - Verify your backend works independently
4. **Use browser console debugging** - Use the provided debug functions
5. **Check network tab** - See the actual request/response

The frontend is working correctly - the issue is likely with the backend API configuration or CORS setup.
