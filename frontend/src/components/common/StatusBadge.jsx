/* ============================================================
   StatusBadge.jsx — Reusable Stock Status Badge
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

/**
 * StatusBadge
 *
 * Renders a color-coded pill badge based on stock status string.
 *
 * Props:
 *   status {string} — 'In Stock' | 'Low Stock' | 'Out of Stock'
 */
const StatusBadge = ({ status }) => {
  /* Map status string to a CSS modifier class */
  const statusClassMap = {
    'In Stock': 'status-badge--in-stock',
    'Low Stock': 'status-badge--low-stock',
    'Out of Stock': 'status-badge--out-of-stock',
  };

  const modifierClass = statusClassMap[status] || 'status-badge--unknown';

  /* Accessible dot indicator */
  const dotClassMap = {
    'In Stock': 'status-dot--in-stock',
    'Low Stock': 'status-dot--low-stock',
    'Out of Stock': 'status-dot--out-of-stock',
  };

  const dotClass = dotClassMap[status] || 'status-dot--unknown';

  return (
    <span
      className={`status-badge ${modifierClass}`}
      role="status"
      aria-label={`Stock status: ${status}`}
    >
      <span className={`status-dot ${dotClass}`} aria-hidden="true" />
      {status}
    </span>
  );
};

export default StatusBadge;
