import { useState, useEffect } from 'react';
import { AuthState, SignUpData, SignInData } from '../types/auth';
import { AuthService } from '../services/authService';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser().then(({ data: { user } }) => {
      setAuthState(prev => ({
        ...prev,
        user: user as any,
        loading: false,
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setAuthState(prev => ({
        ...prev,
        user: user as any,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signUp(data);
      // User will be set via onAuthStateChange
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signIn(data);
      // User will be set via onAuthStateChange
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signInWithGoogle();
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signOut();
      // User will be cleared via onAuthStateChange
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.resetPassword(email);
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      return false;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError,
    isAuthenticated: !!authState.user,
  };
}