/* ============================================================
   Purchasing.jsx — Purchasing Module Placeholder
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import ComingSoon from '../ComingSoon';

const IconPurchasing = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const FEATURES = [
  'Purchase order creation and approval workflow',
  'Multi-vendor quote comparison',
  'PO status tracking (Draft → Approved → Sent → Received)',
  'Budget allocation and spend analytics',
  'Auto-reorder triggers from low stock alerts',
];

const Purchasing = () => (
  <ComingSoon
    title="Purchasing"
    description="Streamline your procurement process with purchase order management, vendor quote comparisons, and automated reorder workflows."
    features={FEATURES}
    icon={<IconPurchasing />}
    colorClass="cs-icon-ring--violet"
  />
);

export default Purchasing;
