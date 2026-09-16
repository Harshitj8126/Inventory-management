/* ============================================================
   Vendors.jsx — Vendor Directory Page with Dynamic Categories
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useMemo } from 'react';
import { vendorsData as initialVendors } from '../../services/mockData';
import { getCategories, addCategory } from '../../services/categoryService';
import Modal from '../../components/modals/Modal';
import './Vendors.css';

/* ── Icons ── */
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M9 12h.01M9 15h.01M15 9h.01M15 12h.01M15 15h.01"/>
  </svg>
);

const getInitials = (name) => name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'V';
const formatCurrency = (n) => `₹${(n / 1000).toFixed(0)}K`;

const Vendors = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [availableCategories, setAvailableCategories] = useState(getCategories());
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  /* Modals State */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  /* Form State */
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'Textiles',
    customCategory: '',
    contact: '',
    email: '',
    phone: '',
    city: '',
    paymentTerms: 'Net 30',
  });

  const categories = useMemo(() => {
    const fromVendors = vendors.map(v => v.category);
    return ['All', ...new Set([...availableCategories, ...fromVendors])];
  }, [vendors, availableCategories]);

  const filtered = useMemo(() => {
    return vendors.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.contact.toLowerCase().includes(search.toLowerCase()) ||
        v.city.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'All' || v.category === filterCat;
      const matchStatus = filterStatus === 'All' || v.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [vendors, search, filterCat, filterStatus]);

  const stats = useMemo(() => ({
    total:      vendors.length,
    active:     vendors.filter(v => v.status === 'Active').length,
    totalSpend: vendors.reduce((s, v) => s + v.totalSpend, 0),
    avgRating:  vendors.length ? (vendors.reduce((s, v) => s + v.rating, 0) / vendors.length).toFixed(1) : '0.0',
  }), [vendors]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.contact) return;

    let finalCat = newVendor.category;
    if (newVendor.category === 'ADD_CUSTOM' && newVendor.customCategory.trim()) {
      finalCat = newVendor.customCategory.trim();
      const updated = addCategory(finalCat);
      setAvailableCategories(updated);
    }

    const created = {
      id: `VND-00${vendors.length + 1}`,
      name: newVendor.name,
      category: finalCat,
      contact: newVendor.contact,
      email: newVendor.email || `${newVendor.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: newVendor.phone || '+91 98765 00000',
      city: newVendor.city || 'Mumbai',
      status: 'Active',
      rating: 5.0,
      totalOrders: 0,
      totalSpend: 0,
      paymentTerms: newVendor.paymentTerms,
      lastOrder: 'Just Now',
    };

    setVendors([created, ...vendors]);
    setIsAddOpen(false);
    setNewVendor({
      name: '',
      category: 'Textiles',
      customCategory: '',
      contact: '',
      email: '',
      phone: '',
      city: '',
      paymentTerms: 'Net 30',
    });
  };

  const handleToggleStatus = (id) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === 'Active' ? 'Inactive' : 'Active';
        if (selectedVendor && selectedVendor.id === id) {
          setSelectedVendor({ ...selectedVendor, status: nextStatus });
        }
        return { ...v, status: nextStatus };
      }
      return v;
    }));
  };

  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    setSelectedVendor(null);
  };

  return (
    <div className="vendors-page">

      {/* ── Header ── */}
      <div className="vnd-header">
        <div className="vnd-header-text">
          <div className="vnd-icon-wrap" aria-hidden="true"><IconUsers /></div>
          <h1 className="vnd-page-title">Vendor Directory</h1>
          <p className="vnd-page-subtitle">Manage suppliers, contacts, and purchasing relationships</p>
        </div>
        <div className="vnd-header-actions">
          <button
            type="button"
            className="vnd-btn-add"
            onClick={() => setIsAddOpen(true)}
            aria-label="Add new vendor"
          >
            <IconPlus /> Add Vendor
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="vnd-summary-grid" role="list" aria-label="Vendor statistics">
        {[
          { icon: <IconUsers />, iconClass: 'vnd-stat-icon--violet', value: stats.total,    label: 'Total Vendors' },
          { icon: <IconBuilding />, iconClass: 'vnd-stat-icon--green', value: stats.active,  label: 'Active Vendors' },
          { icon: <IconStar />, iconClass: 'vnd-stat-icon--amber', value: `₹${(stats.totalSpend/100000).toFixed(1)}L`, label: 'Total Spend' },
          { icon: <IconStar />, iconClass: 'vnd-stat-icon--blue',  value: stats.avgRating, label: 'Avg. Rating' },
        ].map((s, i) => (
          <div key={i} className="vnd-stat-card" role="listitem">
            <div className={`vnd-stat-icon ${s.iconClass}`}>{s.icon}</div>
            <div className="vnd-stat-info">
              <span className="vnd-stat-value">{s.value}</span>
              <span className="vnd-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="vnd-filter-bar" role="search" aria-label="Filter vendors">
        <div className="vnd-search-wrap">
          <span className="vnd-search-icon"><IconSearch /></span>
          <input
            type="search"
            className="vnd-search-input"
            placeholder="Search vendors, contacts, cities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search vendors"
          />
        </div>
        <select
          className="vnd-filter-select"
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          className="vnd-filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* ── Vendor Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="vnd-empty" role="status">
          <IconUsers />
          <p className="vnd-empty-title">No vendors found</p>
          <p className="vnd-empty-sub">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="vnd-grid" role="list" aria-label="Vendor cards">
          {filtered.map(v => (
            <div key={v.id} className="vnd-card" role="listitem" aria-label={`Vendor: ${v.name}`}>

              <div className="vnd-card-top">
                <div className="vnd-card-avatar" aria-hidden="true">{getInitials(v.name)}</div>
                <div className="vnd-card-name-wrap">
                  <div className="vnd-card-name">{v.name}</div>
                  <div className="vnd-card-cat">{v.category} · {v.city}</div>
                </div>
                <span className={`vnd-status-badge vnd-status--${v.status.toLowerCase()}`}>
                  <span className={`vnd-status-dot vnd-status-dot--${v.status.toLowerCase()}`} />
                  {v.status}
                </span>
              </div>

              <div className="vnd-card-divider" aria-hidden="true" />

              <div className="vnd-card-meta">
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Contact</span>
                  <span className="vnd-meta-value">{v.contact}</span>
                </div>
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Phone</span>
                  <span className="vnd-meta-value">{v.phone}</span>
                </div>
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Total Orders</span>
                  <span className="vnd-meta-value">{v.totalOrders}</span>
                </div>
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Total Spend</span>
                  <span className="vnd-meta-value">{formatCurrency(v.totalSpend)}</span>
                </div>
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Payment Terms</span>
                  <span className="vnd-meta-value">{v.paymentTerms}</span>
                </div>
                <div className="vnd-meta-item">
                  <span className="vnd-meta-label">Last Order</span>
                  <span className="vnd-meta-value">{v.lastOrder}</span>
                </div>
              </div>

              <div className="vnd-card-footer">
                <div className="vnd-rating" aria-label={`Rating: ${v.rating} out of 5`}>
                  <IconStar /> <span>{v.rating}</span>
                </div>
                <button
                  type="button"
                  className="vnd-btn-action"
                  onClick={() => setSelectedVendor(v)}
                  aria-label={`View details for ${v.name}`}
                >
                  View Details <IconArrow />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: Add Vendor ── */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Vendor"
        subtitle="Register a new supplier in the system"
        icon={<IconPlus />}
        iconClass="modal-header-icon--violet"
        size="md"
        footer={
          <div className="modal-actions-right">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setIsAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-vendor-form" className="btn-modal btn-modal-primary" style={{ background: '#7c3aed' }}>
              Create Vendor
            </button>
          </div>
        }
      >
        <form id="add-vendor-form" onSubmit={handleAddSubmit} className="modal-form-grid">
          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="vnd-name">Vendor / Company Name *</label>
            <input
              id="vnd-name"
              type="text"
              required
              className="modal-input"
              placeholder="e.g. Apex Industrial Supplies"
              value={newVendor.name}
              onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-cat">Category / Industry Type *</label>
            <select
              id="vnd-cat"
              className="modal-select"
              value={newVendor.category}
              onChange={e => setNewVendor({ ...newVendor, category: e.target.value })}
            >
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="ADD_CUSTOM">+ Add Custom Category...</option>
            </select>
          </div>

          {newVendor.category === 'ADD_CUSTOM' && (
            <div className="modal-form-group modal-col-6">
              <label className="modal-label" htmlFor="vnd-custom-cat">Type New Category Name *</label>
              <input
                id="vnd-custom-cat"
                type="text"
                required
                className="modal-input"
                placeholder="e.g. Heavy Machinery, Automotive..."
                value={newVendor.customCategory}
                onChange={e => setNewVendor({ ...newVendor, customCategory: e.target.value })}
              />
            </div>
          )}

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-contact">Primary Contact Person *</label>
            <input
              id="vnd-contact"
              type="text"
              required
              className="modal-input"
              placeholder="e.g. Rahul Sharma"
              value={newVendor.contact}
              onChange={e => setNewVendor({ ...newVendor, contact: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-email">Email Address</label>
            <input
              id="vnd-email"
              type="email"
              className="modal-input"
              placeholder="rahul@vendor.com"
              value={newVendor.email}
              onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-phone">Phone Number</label>
            <input
              id="vnd-phone"
              type="text"
              className="modal-input"
              placeholder="+91 98765 43210"
              value={newVendor.phone}
              onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-city">City / Hub</label>
            <input
              id="vnd-city"
              type="text"
              className="modal-input"
              placeholder="Mumbai, Surat, etc."
              value={newVendor.city}
              onChange={e => setNewVendor({ ...newVendor, city: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="vnd-terms">Payment Terms</label>
            <select
              id="vnd-terms"
              className="modal-select"
              value={newVendor.paymentTerms}
              onChange={e => setNewVendor({ ...newVendor, paymentTerms: e.target.value })}
            >
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>Advance</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: View Vendor Details ── */}
      {selectedVendor && (
        <Modal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          title={selectedVendor.name}
          subtitle={`Supplier ID: ${selectedVendor.id} · ${selectedVendor.category}`}
          icon={<IconBuilding />}
          iconClass="modal-header-icon--violet"
          size="md"
          footer={
            <div className="modal-actions-between" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-modal btn-modal-danger"
                onClick={() => handleDeleteVendor(selectedVendor.id)}
              >
                Delete Vendor
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-modal btn-modal-secondary"
                  onClick={() => handleToggleStatus(selectedVendor.id)}
                >
                  Set as {selectedVendor.status === 'Active' ? 'Inactive' : 'Active'}
                </button>
                <button
                  type="button"
                  className="btn-modal btn-modal-primary"
                  onClick={() => setSelectedVendor(null)}
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '0.875rem' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Contact Person</span>
              <strong style={{ color: '#0f172a' }}>{selectedVendor.contact}</strong>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Category / Industry</span>
              <strong style={{ color: '#7c3aed' }}>{selectedVendor.category}</strong>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</span>
              <span style={{ color: '#1e293b' }}>{selectedVendor.phone}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</span>
              <span style={{ color: '#1e293b' }}>{selectedVendor.email || 'N/A'}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>City / Location</span>
              <span style={{ color: '#1e293b' }}>{selectedVendor.city}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Terms</span>
              <span style={{ color: '#1e293b' }}>{selectedVendor.paymentTerms}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Total Orders Fulfilled</span>
              <strong style={{ color: '#0f172a' }}>{selectedVendor.totalOrders}</strong>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Total Lifetime Spend</span>
              <strong style={{ color: '#7c3aed' }}>₹{selectedVendor.totalSpend.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Vendors;
