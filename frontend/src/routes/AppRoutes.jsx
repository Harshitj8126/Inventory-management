/* ============================================================
   AppRoutes.jsx — Central Routing Configuration
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Route structure:
     /               → redirects to /login
     /login          → Login page (public, no layout)

     Protected (require auth → rendered inside MainLayout):
       /dashboard      → Dashboard
       /inventory      → Inventory List
       /vendors        → Vendors (placeholder)
       /purchasing     → Purchasing (placeholder)
       /receiving      → Receiving (placeholder)
       /reports        → Reports (placeholder)
       /administration → Administration (placeholder)

     *               → catch-all, redirects to /login
   ============================================================ */

import { Routes, Route, Navigate } from 'react-router-dom';

/* ── Public ── */
import Login from '../pages/auth/Login';

/* ── Layout & Auth Guard ── */
import MainLayout    from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

/* ── Protected Pages ── */
import Dashboard      from '../pages/dashboard/Dashboard';
import InventoryList  from '../pages/inventory/InventoryList';
import Vendors        from '../pages/vendors/Vendors';
import Purchasing     from '../pages/purchasing/Purchasing';
import Receiving      from '../pages/receiving/Receiving';
import Reports        from '../pages/reports/Reports';
import Administration from '../pages/administration/Administration';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Redirect root to /login ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Public: Login (no app shell) ── */}
      <Route path="/login" element={<Login />} />

      {/* ════════════════════════════════════════════════════
          PROTECTED ROUTES
          ProtectedRoute checks auth; on fail → /login
          MainLayout provides sidebar + topbar shell
      ════════════════════════════════════════════════════ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Overview */}
          <Route path="/dashboard"      element={<Dashboard />} />

          {/* Operations */}
          <Route path="/inventory"      element={<InventoryList />} />
          <Route path="/vendors"        element={<Vendors />} />
          <Route path="/purchasing"     element={<Purchasing />} />
          <Route path="/receiving"      element={<Receiving />} />

          {/* Insights */}
          <Route path="/reports"        element={<Reports />} />

          {/* System */}
          <Route path="/administration" element={<Administration />} />

        </Route>
      </Route>

      {/* ── Catch-all: redirect unknown routes to /login ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
