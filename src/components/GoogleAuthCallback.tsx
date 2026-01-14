import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { API_CONFIG } from '../utils/apiConfig';

export function GoogleAuthCallback() {
  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          // Handle OAuth error
          console.error('Google OAuth error:', error);
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: `Google authentication failed: ${error}`
            }, window.location.origin);
          }
          window.close();
          return;
        }
        
        if (code) {
          // Handle successful OAuth callback
          console.log('Google OAuth code received:', code);
          
          // Send the code to the backend to exchange for tokens
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE_CALLBACK}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Google OAuth successful:', data);
            
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                response: data
              }, window.location.origin);
            }
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
            console.error('Google OAuth callback error:', errorData);
            
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: errorData.message || 'Authentication failed'
              }, window.location.origin);
            }
          }
        } else {
          // No code or error - something went wrong
          console.error('No OAuth code received');
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: 'No authentication code received'
            }, window.location.origin);
          }
        }
        
        window.close();
      } catch (error) {
        console.error('Google OAuth callback processing error:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Failed to process authentication'
          }, window.location.origin);
        }
        window.close();
      }
    };
    
    handleGoogleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h2 className="text-lg font-semibold">Processing Google Authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}