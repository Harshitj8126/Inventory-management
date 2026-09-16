/* ============================================================
   MainLayout.jsx — App Shell: Sidebar + TopBar + Outlet
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, formatDisplayName } from '../context/AuthContext';
import './MainLayout.css';

/* ══════════════════════════════════════════
   SVG Icon Components
══════════════════════════════════════════ */
const IconWarehouse = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconGrid = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconBox = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconUsers = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconShoppingCart = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconTruck = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconBarChart = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconSettings = () => (
  <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="sidebar-nav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ══════════════════════════════════════════
   Navigation Config
══════════════════════════════════════════ */
const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { path: '/dashboard',      label: 'Dashboard',       icon: IconGrid,        ready: true  },
    ],
  },
  {
    section: 'Operations',
    items: [
      { path: '/inventory',      label: 'Inventory',       icon: IconBox,         ready: true  },
      { path: '/vendors',        label: 'Vendors',         icon: IconUsers,       ready: true  },
      { path: '/purchasing',     label: 'Purchasing',      icon: IconShoppingCart, ready: true },
      { path: '/receiving',      label: 'Receiving',       icon: IconTruck,       ready: true  },
    ],
  },
  {
    section: 'Insights',
    items: [
      { path: '/reports',        label: 'Reports',         icon: IconBarChart,    ready: true  },
    ],
  },
  {
    section: 'System',
    items: [
      { path: '/administration', label: 'Administration',  icon: IconSettings,    ready: true  },
    ],
  },
];

/* ── Map path → page title for topbar breadcrumb ── */
const PAGE_TITLES = {
  '/dashboard':      'Dashboard Overview',
  '/inventory':      'Stock Inventory',
  '/vendors':        'Vendor Directory',
  '/purchasing':     'Purchase Orders',
  '/receiving':      'Inbound Receiving',
  '/reports':        'Analytics & Reports',
  '/administration': 'System Administration',
};

/* ── Helper: Get user display name ── */
const getUserDisplayName = (user) => {
  if (user?.name) return formatDisplayName(user.name);
  if (user?.email) return formatDisplayName(user.email);
  return 'User';
};

/* ── Helper: Get initials from name ── */
const getInitials = (nameStr = '') => {
  if (!nameStr) return 'U';
  const parts = nameStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

/* ══════════════════════════════════════════
   MainLayout Component
══════════════════════════════════════════ */
const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* Close sidebar on Escape key */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Handle logout */
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard Overview';
  const userName = getUserDisplayName(user);
  const initials = getInitials(userName);

  return (
    <div className="app-shell">

      {/* ── Mobile Overlay ── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        id="main-sidebar"
        aria-label="Main sidebar navigation"
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true" style={{ background: '#ffffff', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.jpg" alt="Codlix Logo" style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Codlix</span>
            <span className="sidebar-brand-tagline">Enterprise Inventory</span>
          </div>
          <div className="sidebar-brand-badge" aria-hidden="true">
            v2.4
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Module navigation">
          {NAV_ITEMS.map(({ section, items }) => (
            <div key={section} className="sidebar-section">
              <span className="sidebar-section-label">{section}</span>
              {items.map(({ path, label, icon: Icon, ready }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `sidebar-nav-item${isActive ? ' active' : ''}`
                  }
                  aria-label={label}
                  aria-current={location.pathname === path ? 'page' : undefined}
                >
                  <div className="sidebar-icon-wrapper" aria-hidden="true">
                    <Icon />
                  </div>
                  <span className="sidebar-nav-text">{label}</span>
                  {ready ? (
                    <IconChevronRight />
                  ) : (
                    <span className="sidebar-nav-badge" aria-label="Coming soon">
                      Soon
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>


        {/* Footer: User + Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user" aria-label={`Logged in as ${userName}`}>
            <div className="sidebar-user-avatar" aria-hidden="true">
              {initials}
              <span className="sidebar-user-status" title="Active Online" />
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-email">{userName}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Log out and return to login page"
          >
            <IconLogout />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════
          TOP BAR
      ══════════════════════════════════ */}
      <header className="topbar" role="banner">
        <div className="topbar-left">
          {/* Hamburger — visible on tablet/mobile */}
          <button
            type="button"
            className="topbar-hamburger"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="main-sidebar"
          >
            {sidebarOpen ? <IconX /> : <IconMenu />}
          </button>

          {/* Breadcrumb */}
          <div className="topbar-breadcrumb" aria-label="Breadcrumb">
            <span className="topbar-page-title" aria-current="page">
              {currentTitle}
            </span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topbar-system-status">
            <span className="status-dot" />
            <span className="status-text">Live Sync</span>
          </div>

          {/* User chip */}
          <div className="topbar-user-chip" aria-label={`Logged in as ${userName}`}>
            <div className="topbar-avatar" aria-hidden="true">
              {initials}
            </div>
            <span className="topbar-username">{userName}</span>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════ */}
      <main className="main-content" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;

