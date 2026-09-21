/* ============================================================
   Dashboard.jsx — Main Dashboard Page
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, formatDisplayName } from '../../context/AuthContext';
import { getInventory, getStockStatus, getTransactions } from '../../services/inventoryService';
import KpiCard from '../../components/common/KpiCard';
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

/* ── Fallback Recent Activity (used when API returns nothing) ── */
const FALLBACK_ACTIVITY = [
  { id: 1, action: 'Stock In',   product: 'Laptop (LP-001)',          qty: '+20 units', warehouse: 'Delhi Warehouse',  time: '2 hours ago',   color: 'act--green' },
  { id: 2, action: 'Stock Out',  product: 'Wireless Mouse (MS-002)',  qty: '-5 units',  warehouse: 'Delhi Warehouse',  time: '4 hours ago',   color: 'act--orange' },
  { id: 3, action: 'Transfer',   product: 'Office Chair (CH-004)',    qty: '3 units',   warehouse: 'Mumbai → Noida',   time: 'Yesterday',     color: 'act--blue' },
  { id: 4, action: 'Adjustment', product: 'A4 Paper Ream (AP-008)',   qty: '-2 units',  warehouse: 'Delhi Warehouse',  time: 'Yesterday',     color: 'act--red' },
  { id: 5, action: 'Stock In',   product: 'USB-C Hub (UH-007)',       qty: '+15 units', warehouse: 'Mumbai Warehouse', time: '2 days ago',    color: 'act--green' },
];

/**
 * Normalize API transaction into dashboard activity format.
 */
const normalizeTransaction = (tx, index) => {
  const typeMap = {
    'STOCK_IN': { action: 'Stock In', color: 'act--green', prefix: '+' },
    'STOCK_OUT': { action: 'Stock Out', color: 'act--orange', prefix: '-' },
    'TRANSFER': { action: 'Transfer', color: 'act--blue', prefix: '' },
    'ADJUSTMENT': { action: 'Adjustment', color: 'act--red', prefix: '' },
  };

  const info = typeMap[tx.type] || typeMap[tx.transaction_type] || { action: tx.type || 'Activity', color: 'act--blue', prefix: '' };

  const timeDiff = tx.created_at ? getTimeAgo(tx.created_at) : 'Recently';

  return {
    id: tx.id || index + 1,
    action: info.action,
    product: tx.product_name || tx.product || `Product #${tx.product_id || ''}`,
    qty: `${info.prefix}${tx.quantity || 0} units`,
    warehouse: tx.warehouse_name || tx.warehouse || '',
    time: timeDiff,
    color: info.color,
  };
};

/**
 * Simple time-ago formatter.
 */
const getTimeAgo = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/* ══════════════════════════════════════════
   Dashboard Component
══════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const firstName = getFirstName(user);
  const greeting  = getGreeting();

  /* ── Live inventory data ── */
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState(FALLBACK_ACTIVITY);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Fetch data on mount ── */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch inventory
        const items = await getInventory();
        const withStatus = items.map((item) => ({
          ...item,
          stockStatus: getStockStatus(item),
        }));
        setInventoryItems(withStatus);

        // Fetch recent transactions
        try {
          const transactions = await getTransactions();
          if (Array.isArray(transactions) && transactions.length > 0) {
            setRecentActivity(transactions.slice(0, 5).map(normalizeTransaction));
          }
        } catch {
          // Keep fallback activity
        }
      } catch (error) {
        console.warn('Dashboard data load failed, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  /* ── Compute KPIs from live inventory data ── */
  const stats = useMemo(() => {
    return {
      totalProducts:  inventoryItems.length,
      totalStock:     inventoryItems.reduce((sum, i) => sum + (i.totalQuantity || 0), 0),
      lowStock:       inventoryItems.filter((i) => i.stockStatus === 'Low Stock').length,
      outOfStock:     inventoryItems.filter((i) => i.stockStatus === 'Out of Stock').length,
    };
  }, [inventoryItems]);

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
        <KpiCard
          icon={<IconBox />}
          badge="Active SKUs"
          value={isLoading ? '...' : stats.totalProducts}
          label="Total Catalog Products"
          trend="Across 3 active warehouses"
        />

        <KpiCard
          icon={<IconStack />}
          badge="In Stock"
          value={isLoading ? '...' : stats.totalStock.toLocaleString()}
          label="Total Stock Units"
          trend="All locations combined"
        />

        <KpiCard
          icon={<IconAlertTriangle />}
          badge="Warning"
          value={isLoading ? '...' : stats.lowStock}
          label="Low Stock Items"
          trend="Requires reorder attention"
        />

        <KpiCard
          icon={<IconXCircle />}
          badge="Critical"
          value={isLoading ? '...' : stats.outOfStock}
          label="Out of Stock"
          trend="Immediate action needed"
        />
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
            {recentActivity.map((item) => (
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
