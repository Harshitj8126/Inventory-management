/* ============================================================
   ComingSoon.jsx — Shared Placeholder Page Component
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { Link } from 'react-router-dom';
import './ComingSoon.css';

/**
 * ComingSoon
 *
 * Reusable placeholder rendered for modules not yet built.
 *
 * Props:
 *   title       {string}   — Module name
 *   description {string}   — Short description of what the module will do
 *   features    {string[]} — Bullet list of upcoming features
 *   icon        {ReactNode} — SVG icon element
 *   colorClass  {string}   — CSS modifier for icon ring color (e.g. 'cs-icon-ring--teal')
 */
const ComingSoon = ({ title, description, features = [], icon, colorClass = 'cs-icon-ring--blue' }) => {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-card" role="main">

        {/* Icon Ring */}
        <div className={`cs-icon-ring ${colorClass}`} aria-hidden="true">
          {icon}
        </div>

        {/* Badge */}
        <div className="cs-badge" role="status">
          <span className="cs-badge-dot" aria-hidden="true" />
          Coming Soon
        </div>

        {/* Title & Description */}
        <h1 className="cs-title">{title}</h1>
        <p className="cs-description">{description}</p>

        {/* Upcoming Features */}
        {features.length > 0 && (
          <>
            <span className="cs-features-label">Planned Features</span>
            <ul className="cs-features" aria-label="Planned features">
              {features.map((feat) => (
                <li key={feat} className="cs-feature-item">
                  <span className="cs-feature-dot" aria-hidden="true" />
                  {feat}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="cs-divider" aria-hidden="true" />

        {/* Back to Dashboard */}
        <Link to="/dashboard" className="cs-back-btn" aria-label="Go back to dashboard">
          ← Back to Dashboard
        </Link>

      </div>
    </div>
  );
};

export default ComingSoon;
