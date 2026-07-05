import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingState } from '../ui/States';

export function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingState message="Loading your account..." />;

  if (!user) return <Navigate to="/onboarding" replace />;

  if (!profile?.onboardingComplete) return <Navigate to="/onboarding" replace />;

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingState message="Loading..." />;

  if (user && profile?.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
