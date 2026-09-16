/* ============================================================
   Receiving.jsx — Receiving Module Placeholder
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import ComingSoon from '../ComingSoon';

const IconReceiving = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const FEATURES = [
  'Goods receipt against purchase orders',
  'Barcode / QR code scanning support',
  'Partial receipts and backorder management',
  'Quality inspection and damage reporting',
  'Automatic stock update on receipt confirmation',
];

const Receiving = () => (
  <ComingSoon
    title="Receiving"
    description="Record and verify incoming goods against purchase orders, inspect quality, and automatically update inventory levels upon confirmation."
    features={FEATURES}
    icon={<IconReceiving />}
    colorClass="cs-icon-ring--orange"
  />
);

export default Receiving;
