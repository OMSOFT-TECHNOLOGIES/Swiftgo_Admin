# Google OAuth Implementation Guide

## Overview
The Google OAuth integration allows users to sign in using their Google accounts instead of creating new credentials. This provides a smoother user experience and leverages Google's robust authentication system.

## Implementation Details

### Frontend Components

#### 1. **API Configuration** (`src/utils/apiConfig.ts`)
- `GOOGLE_AUTH: '/api/auth/google'` - Initiates OAuth flow
- `GOOGLE_CALLBACK: '/api/auth/google/callback'` - Handles OAuth response

#### 2. **Authentication Service** (`src/services/auth.ts`)
- `googleAuth()` - Opens popup for Google OAuth
- `redirectToGoogleAuth()` - Fallback for blocked popups

#### 3. **API Service** (`src/services/api.ts`)
- `getGoogleAuthUrl()` - Returns Google OAuth URL
- `handleGoogleCallback()` - Processes OAuth callback

#### 4. **Login Component** (`src/components/Login.tsx`)
- Google sign-in button integrated
- Error handling for OAuth failures
- Loading states during authentication

### Authentication Flow

```
1. User clicks "Continue with Google"
2. Frontend redirects to /api/auth/google
3. Backend redirects to Google OAuth
4. User authorizes app on Google
5. Google redirects back to frontend with auth code
6. Frontend detects OAuth callback and sends code to backend
7. Backend exchanges code for tokens and returns JWT + user data
8. Frontend stores authentication data
9. User redirected to dashboard
```

### Backend Requirements

#### Passport.js Configuration
```javascript
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/`  // Redirect back to frontend
}, async (accessToken, refreshToken, profile, done) => {
  // Handle user creation/login logic
}));
```

#### Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### Required Routes
```javascript
// Initiate OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Return JWT token and user data
    res.json({
      token: generateJWT(req.user),
      admin: req.user, // or user: req.user for non-admin
      message: 'Google authentication successful'
    });
  }
);
```

### Frontend Usage

#### In Components
```typescript
const { googleAuth, loading, error } = useAuth();

const handleGoogleSignIn = async () => {
  try {
    await googleAuth();
    // User will be redirected after successful auth
  } catch (error) {
    console.error('Google auth failed:', error);
  }
};
```

#### Environment Setup
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Update with your actual credentials
VITE_GOOGLE_CLIENT_ID=your-actual-client-id
VITE_GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

### Security Considerations

1. **HTTPS Required**: Google OAuth requires HTTPS in production
2. **Domain Whitelist**: Configure authorized domains in Google Console
3. **Token Security**: JWT tokens stored securely in localStorage/sessionStorage
4. **CORS Configuration**: Ensure backend allows frontend origin

### Testing

Run the test script to verify integration:
```bash
node test-google-auth.js
```

### Troubleshooting

#### Common Issues
1. **Popup Blocked**: System falls back to redirect method
2. **Invalid Credentials**: Check Google Console configuration
3. **CORS Errors**: Verify backend CORS settings
4. **Redirect Mismatch**: Ensure callback URLs match Google Console

#### Debug Mode
Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'swiftgo:auth');
```

## Google Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Configure authorized domains and callback URLs

### Callback URLs to Configure:
- Development: `http://localhost:3000/auth/google/callback`
- Production: `https://yourdomain.com/auth/google/callback`

## Status
✅ Frontend implementation complete
✅ Backend integration points defined
⏳ Backend Passport.js configuration needed
⏳ Google Console setup required