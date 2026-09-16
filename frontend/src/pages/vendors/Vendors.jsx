/* ============================================================
   Vendors.jsx — Vendors Module Placeholder
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import ComingSoon from '../ComingSoon';

const IconVendors = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FEATURES = [
  'Vendor directory with contact details and ratings',
  'Vendor performance tracking and scorecards',
  'Blacklist & approval workflow',
  'Vendor-wise purchase history',
  'Document management (agreements, certificates)',
];

const Vendors = () => (
  <ComingSoon
    title="Vendor Management"
    description="Manage your supplier relationships, track vendor performance, and maintain a complete vendor directory from one central location."
    features={FEATURES}
    icon={<IconVendors />}
    colorClass="cs-icon-ring--teal"
  />
);

export default Vendors;
