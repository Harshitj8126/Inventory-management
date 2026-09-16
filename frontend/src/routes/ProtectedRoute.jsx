/* ============================================================
   ProtectedRoute.jsx — Auth Guard for Protected Routes
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   If the user is not authenticated, redirect to /login.
   Otherwise render the children (wrapped in MainLayout).
   ============================================================ */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * Renders <Outlet /> (child routes) when authenticated,
 * or redirects to /login when not.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
