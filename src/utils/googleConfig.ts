// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: `${window.location.origin}/auth/google/callback`,
  SCOPES: ['profile', 'email']
};

// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  LIBRARIES: ['places'],
  REGION: 'GH', // Ghana
  LANGUAGE: 'en'
};