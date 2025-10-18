// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useContext(AuthContext);

  // While auth/profile is being validated, show a waiting state.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader mb-2">Loading...</div>
          <div className="text-sm text-gray-500">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // If there's no access token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but user is still not available (shouldn't happen often because loading guards),
  // redirect to login to be safe.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Auth OK
  return children;
}
