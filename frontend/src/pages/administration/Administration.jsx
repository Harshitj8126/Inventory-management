/* ============================================================
   Administration.jsx — Administration Module Placeholder
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import ComingSoon from '../ComingSoon';

const IconAdmin = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FEATURES = [
  'User management with role-based access control',
  'Warehouse and location configuration',
  'Product and category management',
  'System settings and preferences',
  'Audit logs and activity tracking',
];

const Administration = () => (
  <ComingSoon
    title="Administration"
    description="Configure users, roles, warehouses, and system-wide settings. Control who has access to what and keep a complete audit trail."
    features={FEATURES}
    icon={<IconAdmin />}
    colorClass="cs-icon-ring--indigo"
  />
);

export default Administration;
