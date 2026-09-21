/* ============================================================
   Purchasing.jsx — Purchase Orders Page with Full Interactivity
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { purchaseOrdersData as initialPOs } from '../../services/mockData';
import { fetchPurchaseOrders, createPurchaseOrder, approvePurchaseOrder } from '../../services/purchaseOrderService';
import Modal from '../../components/modals/Modal';
import KpiCard from '../../components/common/KpiCard';
import './Purchasing.css';

/* ── Icons ── */
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const statusClass = (s) => {
  const map = { 'Delivered': 'delivered', 'In Transit': 'in-transit', 'Pending': 'pending', 'Approved': 'approved', 'Draft': 'draft' };
  return `po-status po-status--${map[s] || 'draft'}`;
};

const Purchasing = () => {
  const [poList, setPoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  /* ── Load POs from API, fallback to mock ── */
  useEffect(() => {
    const loadPOs = async () => {
      setIsLoading(true);
      try {
        const apiPOs = await fetchPurchaseOrders();
        if (Array.isArray(apiPOs) && apiPOs.length > 0) {
          setPoList(apiPOs);
        } else {
          setPoList(initialPOs);
        }
      } catch {
        setPoList(initialPOs);
      } finally {
        setIsLoading(false);
      }
    };
    loadPOs();
  }, []);

  /* Modals */
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  /* New PO Form */
  const [newPO, setNewPO] = useState({
    vendor: 'Apex Industrial Supplies',
    deliveryDate: '2026-09-30',
    items: 50,
    amount: 150000,
    warehouse: 'Main Warehouse - Mumbai',
    status: 'Pending',
  });

  const filtered = useMemo(() => poList.filter(po => {
    const matchSearch = po.id.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase()) ||
      po.warehouse.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || po.status === filterStatus;
    return matchSearch && matchStatus;
  }), [poList, search, filterStatus]);

  const stats = useMemo(() => ({
    total:      poList.length,
    pending:    poList.filter(p => ['Pending','Draft'].includes(p.status)).length,
    delivered:  poList.filter(p => p.status === 'Delivered').length,
    totalValue: poList.reduce((s, p) => s + Number(p.amount || 0), 0),
  }), [poList]);

  const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
  const formatCurrencyShort = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`;

  const handleCreatePOSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `PO-2026-00${poList.length + 1}`,
      vendor: newPO.vendor,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: newPO.deliveryDate,
      items: Number(newPO.items),
      amount: Number(newPO.amount),
      warehouse: newPO.warehouse,
      status: newPO.status,
    };
    setPoList([created, ...poList]);
    setIsNewPOOpen(false);

    // Fire API call in background
    try {
      await createPurchaseOrder({
        vendor_id: 1,
        warehouse_id: 1,
        order_date: created.date,
        expected_date: created.deliveryDate,
        items: [{ product_id: 1, quantity: created.items, unit_price: Math.round(created.amount / created.items) }],
      });
    } catch (error) {
      console.warn('Create PO API failed (local update preserved):', error.message);
    }
  };

  const handleUpdatePOStatus = async (id, newStatus) => {
    setPoList(poList.map(po => po.id === id ? { ...po, status: newStatus } : po));
    if (selectedPO && selectedPO.id === id) {
      setSelectedPO({ ...selectedPO, status: newStatus });
    }

    // If approving, call the approve API
    if (newStatus === 'Approved') {
      try {
        await approvePurchaseOrder(id);
      } catch (error) {
        console.warn('Approve PO API failed (local update preserved):', error.message);
      }
    }
  };

  return (
    <div className="po-page">

      {/* ── Header ── */}
      <div className="po-header">
        <div className="po-header-text">
          <div className="po-icon-wrap" aria-hidden="true"><IconCart /></div>
          <h1 className="po-page-title">Purchase Orders</h1>
          <p className="po-page-subtitle">Track and manage all vendor purchase orders</p>
        </div>
        <div className="po-header-actions">
          <button
            type="button"
            className="po-btn-new"
            onClick={() => setIsNewPOOpen(true)}
            aria-label="Create new purchase order"
          >
            <IconPlus /> New Order
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="po-stat-grid" role="list" aria-label="Purchase order statistics">
        <KpiCard icon={<IconCart />} value={stats.total} label="Total Orders" />
        <KpiCard icon={<IconClock />} value={stats.pending} label="Pending / Draft" />
        <KpiCard icon={<IconCheck />} value={stats.delivered} label="Delivered" />
        <KpiCard icon={<IconCart />} value={formatCurrencyShort(stats.totalValue)} label="Total Value" />
      </div>

      {/* ── Filter Bar ── */}
      <div className="po-filter-bar" role="search" aria-label="Filter orders">
        <div className="po-search-wrap">
          <span className="po-search-icon"><IconSearch /></span>
          <input
            type="search"
            className="po-search-input"
            placeholder="Search by PO ID, vendor, warehouse…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search purchase orders"
          />
        </div>
        <select
          className="po-filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          {['All','Delivered','In Transit','Approved','Pending','Draft'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="po-table-card">
        <div className="po-table-header">
          <span className="po-table-title">
            Purchase Orders
            <span className="po-table-count" aria-label={`${filtered.length} orders`}>{filtered.length}</span>
          </span>
        </div>
        <div className="po-scroll">
          <table className="po-table" aria-label="Purchase orders table">
            <thead>
              <tr>
                <th scope="col">PO ID</th>
                <th scope="col">Vendor</th>
                <th scope="col">Date</th>
                <th scope="col">Delivery Date</th>
                <th scope="col">Items</th>
                <th scope="col">Amount</th>
                <th scope="col">Warehouse</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id}>
                  <td><span className="po-id">{po.id}</span></td>
                  <td><span className="po-vendor-name">{po.vendor}</span></td>
                  <td>{po.date}</td>
                  <td>{po.deliveryDate}</td>
                  <td>{po.items}</td>
                  <td><span className="po-amount">{formatCurrency(po.amount)}</span></td>
                  <td>{po.warehouse}</td>
                  <td><span className={statusClass(po.status)}>{po.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className="po-action-btn po-action-btn--view"
                      onClick={() => setSelectedPO(po)}
                      aria-label={`View ${po.id}`}
                    >
                      <IconEye /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No purchase orders match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Create New PO ── */}
      <Modal
        isOpen={isNewPOOpen}
        onClose={() => setIsNewPOOpen(false)}
        title="Create Purchase Order"
        subtitle="Issue a new PO to vendor"
        icon={<IconCart />}
        iconClass="modal-header-icon--amber"
        size="md"
        footer={
          <div className="modal-actions-right">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setIsNewPOOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="new-po-form" className="btn-modal btn-modal-primary" style={{ background: '#d97706' }}>
              Create Order
            </button>
          </div>
        }
      >
        <form id="new-po-form" onSubmit={handleCreatePOSubmit} className="modal-form-grid">
          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="po-vendor">Vendor *</label>
            <input
              id="po-vendor"
              type="text"
              required
              className="modal-input"
              value={newPO.vendor}
              onChange={e => setNewPO({ ...newPO, vendor: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="po-delivery">Expected Delivery Date *</label>
            <input
              id="po-delivery"
              type="date"
              required
              className="modal-input"
              value={newPO.deliveryDate}
              onChange={e => setNewPO({ ...newPO, deliveryDate: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="po-wh">Destination Warehouse</label>
            <select
              id="po-wh"
              className="modal-select"
              value={newPO.warehouse}
              onChange={e => setNewPO({ ...newPO, warehouse: e.target.value })}
            >
              <option>Main Warehouse - Mumbai</option>
              <option>North Hub - Delhi NCR</option>
              <option>South Logistics Hub - Bengaluru</option>
              <option>Western Fulfillment Center - Surat</option>
            </select>
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="po-items">Total Quantity / Items *</label>
            <input
              id="po-items"
              type="number"
              min="1"
              required
              className="modal-input"
              value={newPO.items}
              onChange={e => setNewPO({ ...newPO, items: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="po-amount">Order Total Amount (₹) *</label>
            <input
              id="po-amount"
              type="number"
              min="0"
              required
              className="modal-input"
              value={newPO.amount}
              onChange={e => setNewPO({ ...newPO, amount: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="po-status">Initial Status</label>
            <select
              id="po-status"
              className="modal-select"
              value={newPO.status}
              onChange={e => setNewPO({ ...newPO, status: e.target.value })}
            >
              <option>Draft</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>In Transit</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: View PO Details ── */}
      {selectedPO && (
        <Modal
          isOpen={!!selectedPO}
          onClose={() => setSelectedPO(null)}
          title={`Purchase Order: ${selectedPO.id}`}
          subtitle={`Vendor: ${selectedPO.vendor}`}
          icon={<IconCart />}
          iconClass="modal-header-icon--amber"
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedPO.status !== 'Delivered' && (
                  <button
                    type="button"
                    className="btn-modal btn-modal-primary"
                    style={{ background: '#16a34a' }}
                    onClick={() => handleUpdatePOStatus(selectedPO.id, 'Delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}
                {selectedPO.status === 'Pending' && (
                  <button
                    type="button"
                    className="btn-modal btn-modal-primary"
                    style={{ background: '#2563eb' }}
                    onClick={() => handleUpdatePOStatus(selectedPO.id, 'Approved')}
                  >
                    Approve PO
                  </button>
                )}
              </div>
              <button
                type="button"
                className="btn-modal btn-modal-secondary"
                onClick={() => setSelectedPO(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.875rem' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Status</span>
              <span className={statusClass(selectedPO.status)}>{selectedPO.status}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Order Amount</span>
              <strong style={{ color: '#d97706', fontSize: '1.05rem' }}>{formatCurrency(selectedPO.amount)}</strong>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date Issued</span>
              <span>{selectedPO.date}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Expected Delivery</span>
              <span>{selectedPO.deliveryDate}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Items / Quantity</span>
              <span>{selectedPO.items} units</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Destination Warehouse</span>
              <span>{selectedPO.warehouse}</span>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Purchasing;
