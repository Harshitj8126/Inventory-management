/* ============================================================
   KpiCard.jsx — Shared Reusable KPI Metric Card Component
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import './KpiCard.css';

/**
 * KpiCard
 *
 * Renders a standardized, premium KPI metric card used across all pages.
 *
 * Props:
 *   icon   {ReactNode} — optional SVG icon
 *   value  {string|number} — primary metric value
 *   label  {string} — metric label / subtitle
 *   badge  {string} — optional pill tag badge (e.g., "Active SKUs", "Warning")
 *   trend  {string} — optional trend/context text (e.g., "Across 3 warehouses")
 */
const KpiCard = ({ icon, value, label, badge, trend }) => {
  return (
    <div className="app-kpi-card" role="listitem">
      {(icon || badge) && (
        <div className="app-kpi-header">
          {icon && (
            <div className="app-kpi-icon" aria-hidden="true">
              {icon}
            </div>
          )}
          {badge && <span className="app-kpi-badge">{badge}</span>}
        </div>
      )}

      <div className="app-kpi-body">
        <span className="app-kpi-value">{value}</span>
        <span className="app-kpi-label">{label}</span>
      </div>

      {trend && (
        <div className="app-kpi-trend">
          <span className="app-kpi-trend-dot" aria-hidden="true" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
