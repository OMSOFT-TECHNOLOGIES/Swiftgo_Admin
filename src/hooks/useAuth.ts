import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { LoginCredentials, SignupData, Admin, ApiError, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
    loading: true,
    error: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const { isAuthenticated, user, token } = authService.initializeAuth();
        console.log('useAuth: Initial auth check:', { isAuthenticated, user, token: token ? 'present' : 'missing' });
        setAuthState({
          isAuthenticated,
          admin: user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('useAuth: Auth initialization failed:', error);
        setAuthState({
          isAuthenticated: false,
          admin: null,
          token: null,
          loading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };

    initAuth();

    // Also listen for storage changes to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'swiftgo_admin_token' || e.key === 'swiftgo_admin_user') {
        console.log('useAuth: Storage changed, re-initializing auth');
        initAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      console.log('useAuth: Processing login response:', response);
      
      // Handle both admin and user properties for compatibility
      const userData = response.admin || (response as any).user;
      console.log('useAuth: Extracted user data:', userData);
      
      const newAuthState = {
        isAuthenticated: true,
        admin: userData,
        token: response.token,
        loading: false,
        error: null
      };
      
      console.log('useAuth: Setting new auth state:', newAuthState);
      
      // Use functional update to ensure React detects the change
      setAuthState(prev => {
        console.log('useAuth: Previous state in setter:', prev);
        console.log('useAuth: New state in setter:', newAuthState);
        return newAuthState;
      });
      
      // Immediately trigger a manual event to force App component re-render
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: true, user: userData }
      }));
      
      // Force a re-check of auth state from storage to ensure consistency
      setTimeout(() => {
        const { isAuthenticated: storageAuth, user: storageUser, token: storageToken } = authService.initializeAuth();
        console.log('useAuth: Re-checking auth from storage:', { storageAuth, storageUser, storageToken });
        if (storageAuth && storageUser) {
          setAuthState(prev => {
            console.log('useAuth: Previous state:', prev);
            const updatedState = {
              isAuthenticated: storageAuth,
              admin: storageUser,
              token: storageToken,
              loading: false,
              error: null
            };
            console.log('useAuth: Updated state:', updatedState);
            return updatedState;
          });
          
          // Trigger another event after storage verification
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { isAuthenticated: storageAuth, user: storageUser }
          }));
        }
      }, 100);
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Login failed. Please try again.'
      }));
      throw error;
    }
  }, []);

  // Signup function
  const signup = useCallback(async (signupData: SignupData): Promise<void> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.signup(signupData);
      console.log('useAuth: Processing signup response:', response);
      
      // Handle both admin and user properties for compatibility
      const userData = response.admin || (response as any).user;
      console.log('useAuth: Extracted user data from signup:', userData);
      
      const newAuthState = {
        isAuthenticated: true,
        admin: userData,
        token: response.token,
        loading: false,
        error: null
      };
      
      console.log('useAuth: Setting new auth state after signup:', newAuthState);
      
      // Use functional update to ensure React detects the change
      setAuthState(prev => {
        console.log('useAuth: Previous state in signup setter:', prev);
        console.log('useAuth: New state in signup setter:', newAuthState);
        return newAuthState;
      });
      
      // Immediately trigger a manual event to force App component re-render
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isAuthenticated: true, user: userData }
      }));
      
      // Force a re-check of auth state from storage to ensure consistency
      setTimeout(() => {
        const { isAuthenticated: storageAuth, user: storageUser, token: storageToken } = authService.initializeAuth();
        console.log('useAuth: Re-checking auth from storage after signup:', { storageAuth, storageUser, storageToken });
        if (storageAuth && storageUser) {
          setAuthState(prev => {
            console.log('useAuth: Previous state after signup storage check:', prev);
            const updatedState = {
              isAuthenticated: storageAuth,
              admin: storageUser,
              token: storageToken,
              loading: false,
              error: null
            };
            console.log('useAuth: Updated state after signup storage check:', updatedState);
            return updatedState;
          });
          
          // Trigger another event after storage verification
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { isAuthenticated: storageAuth, user: storageUser }
          }));
        }
      }, 100);
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Account creation failed. Please try again.'
      }));
      throw error;
    }
  }, []);

  // Google OAuth authentication
  const googleAuth = useCallback(async (): Promise<void> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      await authService.googleAuth();
      // With redirect approach, user will be redirected to Google
      // App component should handle the callback on return
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Google authentication failed. Please try again.'
      }));
      throw error;
    }
  }, []);

  // Handle Google OAuth callback (called on app initialization)
  const handleGoogleAuthCallback = useCallback(async (): Promise<boolean> => {
    if (!authService.isGoogleAuthCallback()) {
      return false;
    }

    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.handleGoogleAuthCallback();
      if (response) {
        console.log('useAuth: Google OAuth callback successful:', response);
        
        const userData = response.admin || (response as any).user;
        setAuthState({
          isAuthenticated: true,
          admin: userData,
          token: response.token,
          loading: false,
          error: null
        });
        
        // Trigger event for App component
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true, user: userData }
        }));
        
        return true;
      }
      
      setAuthState((prev: AuthState) => ({ ...prev, loading: false }));
      return false;
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Google authentication failed. Please try again.'
      }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true }));

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: null
      });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        setAuthState((prev: AuthState) => ({
          ...prev,
          token: newToken,
          error: null
        }));
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        token: null,
        loading: false,
        error: 'Session expired. Please login again.'
      });
    }
  }, []);

  // Get current user function
  const getCurrentUser = useCallback(async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setAuthState((prev: AuthState) => ({
          ...prev,
          admin: user,
          error: null
        }));
      }
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        error: apiError.message || 'Failed to fetch user profile'
      }));
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState((prev: AuthState) => ({ ...prev, error: null }));
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string): Promise<{ message: string }> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.forgotPassword(email);
      setAuthState((prev: AuthState) => ({ ...prev, loading: false }));
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to send password reset email. Please try again.'
      }));
      throw error;
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (token: string, password: string): Promise<{ message: string }> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.resetPassword(token, password);
      setAuthState((prev: AuthState) => ({ ...prev, loading: false }));
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Failed to reset password. Please try again.'
      }));
      throw error;
    }
  }, []);

  return {
    ...authState,
    login,
    signup,
    googleAuth,
    handleGoogleAuthCallback,
    logout,
    refreshToken,
    getCurrentUser,
    clearError,
    forgotPassword,
    resetPassword
  };
};
