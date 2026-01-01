import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { LoginCredentials, Admin, ApiError, AuthState } from '../types/auth';

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
        setAuthState({
          isAuthenticated,
          admin: user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
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
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      
      setAuthState({
        isAuthenticated: true,
        admin: response.admin,
        token: response.token,
        loading: false,
        error: null
      });
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

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    clearError
  };
};
