/* ============================================================
   Reports.jsx — Reports Module Placeholder
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import ComingSoon from '../ComingSoon';

const IconReports = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const FEATURES = [
  'Inventory valuation and stock movement reports',
  'Vendor performance and spend analysis',
  'Purchase order and receiving summaries',
  'Low stock and reorder alerts report',
  'Export to PDF, Excel, and CSV formats',
];

const Reports = () => (
  <ComingSoon
    title="Reports & Analytics"
    description="Gain deep insights into your inventory, procurement, and vendor performance with powerful reports and exportable data analytics."
    features={FEATURES}
    icon={<IconReports />}
    colorClass="cs-icon-ring--rose"
  />
);

export default Reports;
