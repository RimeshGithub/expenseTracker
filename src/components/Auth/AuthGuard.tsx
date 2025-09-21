import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../Loading/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // This will be handled by the main App component
  }

  return <>{children}</>;
}