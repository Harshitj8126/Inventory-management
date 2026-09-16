/* ============================================================
   Dashboard.jsx — Main Dashboard Page
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, formatDisplayName } from '../../context/AuthContext';
import { inventoryData, getStockStatus } from '../../services/inventoryService';
import './Dashboard.css';

/* ── Get first name from user object ── */
const getFirstName = (user) => {
  const name = formatDisplayName(user?.name || user?.email);
  return name.split(' ')[0];
};

/* ── Get greeting based on hour ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/* ── SVG Icons ── */
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconStack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 17 22 12" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconXCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="db-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconSparkle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4z" />
  </svg>
);

/* ── Mock Recent Activity ── */
const RECENT_ACTIVITY = [
  { id: 1, action: 'Stock In',   product: 'Laptop (LP-001)',          qty: '+20 units', warehouse: 'Delhi Warehouse',  time: '2 hours ago',   color: 'act--green' },
  { id: 2, action: 'Stock Out',  product: 'Wireless Mouse (MS-002)',  qty: '-5 units',  warehouse: 'Delhi Warehouse',  time: '4 hours ago',   color: 'act--orange' },
  { id: 3, action: 'Transfer',   product: 'Office Chair (CH-004)',    qty: '3 units',   warehouse: 'Mumbai → Noida',   time: 'Yesterday',     color: 'act--blue' },
  { id: 4, action: 'Adjustment', product: 'A4 Paper Ream (AP-008)',   qty: '-2 units',  warehouse: 'Delhi Warehouse',  time: 'Yesterday',     color: 'act--red' },
  { id: 5, action: 'Stock In',   product: 'USB-C Hub (UH-007)',       qty: '+15 units', warehouse: 'Mumbai Warehouse', time: '2 days ago',    color: 'act--green' },
];

/* ══════════════════════════════════════════
   Dashboard Component
══════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const firstName = getFirstName(user);
  const greeting  = getGreeting();

  /* ── Compute KPIs from live inventory data ── */
  const stats = useMemo(() => {
    const withStatus = inventoryData.map((item) => ({
      ...item,
      stockStatus: getStockStatus(item),
    }));

    return {
      totalProducts:  withStatus.length,
      totalStock:     withStatus.reduce((sum, i) => sum + i.totalQuantity, 0),
      lowStock:       withStatus.filter((i) => i.stockStatus === 'Low Stock').length,
      outOfStock:     withStatus.filter((i) => i.stockStatus === 'Out of Stock').length,
    };
  }, []);

  return (
    <div className="db-page">

      {/* ── 3D Ambient Mesh Banner ── */}
      <section className="db-greeting" aria-label="Greeting banner">
        {/* Glow ambient backdrops */}
        <div className="db-greeting-glow db-glow-1" aria-hidden="true" />
        <div className="db-greeting-glow db-glow-2" aria-hidden="true" />

        <div className="db-greeting-content">
          <div className="db-greeting-badge">
            <IconSparkle />
            <span>Enterprise Inventory System</span>
          </div>
          <h1 className="db-greeting-title">
            {greeting}, {firstName}! <span className="wave-hand">👋</span>
          </h1>
          <p className="db-greeting-sub">
            Here&apos;s your live inventory overview for today,{' '}
            <strong className="db-date-highlight">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </strong>.
          </p>
        </div>

        <Link to="/inventory" className="db-view-inventory-btn" aria-label="Go to full inventory">
          <span>View Inventory</span>
          <IconArrowRight />
        </Link>
      </section>

      {/* ── 3D Elevated KPI Cards Grid ── */}
      <section className="db-kpi-grid" aria-label="Key performance indicators">

        {/* Total Products */}
        <div className="db-kpi-card db-kpi-card--blue">
          <div className="db-kpi-card-header">
            <div className="db-kpi-icon db-kpi-icon--blue" aria-hidden="true">
              <IconBox />
            </div>
            <span className="db-kpi-badge db-kpi-badge--blue">Active SKUs</span>
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-value">{stats.totalProducts}</span>
            <span className="db-kpi-label">Total Catalog Products</span>
          </div>
          <div className="db-kpi-trend db-kpi-trend--neutral">
            <span className="trend-dot trend-dot--blue" />
            Across 3 active warehouses
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="db-kpi-card db-kpi-card--teal">
          <div className="db-kpi-card-header">
            <div className="db-kpi-icon db-kpi-icon--teal" aria-hidden="true">
              <IconStack />
            </div>
            <span className="db-kpi-badge db-kpi-badge--teal">In Stock</span>
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-value">{stats.totalStock.toLocaleString()}</span>
            <span className="db-kpi-label">Total Stock Units</span>
          </div>
          <div className="db-kpi-trend db-kpi-trend--neutral">
            <span className="trend-dot trend-dot--teal" />
            All locations combined
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="db-kpi-card db-kpi-card--amber">
          <div className="db-kpi-card-header">
            <div className="db-kpi-icon db-kpi-icon--amber" aria-hidden="true">
              <IconAlertTriangle />
            </div>
            <span className="db-kpi-badge db-kpi-badge--amber">Warning</span>
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-value db-kpi-value--amber">{stats.lowStock}</span>
            <span className="db-kpi-label">Low Stock Items</span>
          </div>
          <div className="db-kpi-trend db-kpi-trend--warn">
            <span className="trend-dot trend-dot--amber" />
            Requires reorder attention
          </div>
        </div>

        {/* Out of Stock */}
        <div className="db-kpi-card db-kpi-card--red">
          <div className="db-kpi-card-header">
            <div className="db-kpi-icon db-kpi-icon--red" aria-hidden="true">
              <IconXCircle />
            </div>
            <span className="db-kpi-badge db-kpi-badge--red">Critical</span>
          </div>
          <div className="db-kpi-body">
            <span className="db-kpi-value db-kpi-value--red">{stats.outOfStock}</span>
            <span className="db-kpi-label">Out of Stock</span>
          </div>
          <div className="db-kpi-trend db-kpi-trend--danger">
            <span className="trend-dot trend-dot--red" />
            Immediate action needed
          </div>
        </div>

      </section>

      {/* ── Bottom Row: Activity + Quick Access ── */}
      <div className="db-bottom-row">

        {/* Recent Activity Panel */}
        <section className="db-activity-card" aria-label="Recent stock activity">
          <div className="db-section-header">
            <div className="db-section-header-title">
              <h2 className="db-section-title">Recent Stock Activity</h2>
              <p className="db-section-sub">Audit trail of latest stock movements</p>
            </div>
            <span className="db-section-badge">Live Stream</span>
          </div>

          <ul className="db-activity-list" aria-label="Recent inventory activity">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.id} className="db-activity-item">
                <span className={`db-activity-tag ${item.color}`}>{item.action}</span>
                <div className="db-activity-info">
                  <span className="db-activity-product">{item.product}</span>
                  <span className="db-activity-detail">{item.warehouse} · {item.time}</span>
                </div>
                <span className="db-activity-qty">{item.qty}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Access Panel */}
        <section className="db-quickactions-card" aria-label="Quick navigation">
          <div className="db-section-header">
            <div className="db-section-header-title">
              <h2 className="db-section-title">Quick Access</h2>
              <p className="db-section-sub">Frequently used administrative actions</p>
            </div>
          </div>

          <div className="db-quickactions-list">

            <Link to="/inventory" className="db-qa-item">
              <div className="db-qa-icon db-qa-icon--blue" aria-hidden="true">
                <IconBox />
              </div>
              <div className="db-qa-text">
                <span className="db-qa-title">Inventory Control</span>
                <span className="db-qa-sub">Manage stock levels & SKU tracking</span>
              </div>
              <IconArrowRight />
            </Link>

            <Link to="/vendors" className="db-qa-item">
              <div className="db-qa-icon db-qa-icon--teal" aria-hidden="true">
                <IconUsers />
              </div>
              <div className="db-qa-text">
                <span className="db-qa-title">Vendor Directory</span>
                <span className="db-qa-sub">Supplier profiles & contacts</span>
              </div>
              <IconArrowRight />
            </Link>

            <Link to="/purchasing" className="db-qa-item">
              <div className="db-qa-icon db-qa-icon--violet" aria-hidden="true">
                <IconCart />
              </div>
              <div className="db-qa-text">
                <span className="db-qa-title">Purchasing Orders</span>
                <span className="db-qa-sub">Procurement & PO creation</span>
              </div>
              <IconArrowRight />
            </Link>

          </div>

          {/* Low stock alert banner */}
          {stats.lowStock > 0 && (
            <div className="db-alert-banner" role="alert">
              <span className="db-alert-icon" aria-hidden="true">⚡</span>
              <div className="db-alert-text">
                <strong>{stats.lowStock} item{stats.lowStock > 1 ? 's' : ''} low on stock</strong>
                <span> — inspect levels and restock items.</span>
              </div>
              <Link to="/inventory?status=Low+Stock" className="db-alert-link">
                Review →
              </Link>
            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default Dashboard;




