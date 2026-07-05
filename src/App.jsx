import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import { FirebaseSetupNotice } from './components/FirebaseSetupNotice';
import { isFirebaseConfigured } from './config/firebase';
import Onboarding from './pages/Onboarding';
import Wizard from './pages/Wizard';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Learn from './pages/Learn';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

export default function App() {
  if (!isFirebaseConfigured) {
    return <FirebaseSetupNotice />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route
            path="/onboarding"
            element={
              <PublicOnlyRoute>
                <Onboarding />
              </PublicOnlyRoute>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/wizard"
            element={<ProtectedRoute><Wizard /></ProtectedRoute>}
          />
          <Route
            path="/check-in"
            element={<ProtectedRoute><CheckIn /></ProtectedRoute>}
          />
          <Route
            path="/learn"
            element={<ProtectedRoute><Learn /></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><Settings /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
