/* ============================================================
   Receiving.jsx — Inbound Receiving / GRN Page with Interactivity
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useMemo } from 'react';
import { receivingData as initialReceiving } from '../../services/mockData';
import Modal from '../../components/modals/Modal';
import './Receiving.css';

const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconPackage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
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
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const statusClass = (s) => {
  const m = { 'Complete': 'complete', 'Partial': 'partial', 'Pending': 'pending' };
  return `recv-status recv-status--${m[s] || 'pending'}`;
};
const fillClass = (s) => {
  const m = { 'Complete': 'recv-fill--complete', 'Partial': 'recv-fill--partial', 'Pending': 'recv-fill--pending' };
  return `recv-progress-bar-fill ${m[s] || 'recv-fill--pending'}`;
};

const Receiving = () => {
  const [receivingList, setReceivingList] = useState(initialReceiving);
  const [filterStatus, setFilterStatus] = useState('All');

  /* Modals */
  const [isNewGRNOpen, setIsNewGRNOpen] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);

  /* Form */
  const [newGRN, setNewGRN] = useState({
    poId: 'PO-2026-003',
    vendor: 'Apex Industrial Supplies',
    warehouse: 'Main Warehouse - Mumbai',
    items: 100,
    received: 100,
    receivedBy: 'Harshit Sharma',
    notes: 'Checked and verified against PO specs.',
  });

  const filtered = useMemo(() =>
    receivingList.filter(g => filterStatus === 'All' || g.status === filterStatus),
    [receivingList, filterStatus]
  );

  const stats = useMemo(() => ({
    total:    receivingList.length,
    complete: receivingList.filter(g => g.status === 'Complete').length,
    partial:  receivingList.filter(g => g.status === 'Partial').length,
    pending:  receivingList.filter(g => g.status === 'Pending').length,
  }), [receivingList]);

  const handleCreateGRN = (e) => {
    e.preventDefault();
    const total = Number(newGRN.items);
    const rec = Number(newGRN.received);
    const pendingCount = Math.max(0, total - rec);
    const status = rec >= total ? 'Complete' : rec > 0 ? 'Partial' : 'Pending';

    const created = {
      id: `GRN-2026-00${receivingList.length + 1}`,
      poId: newGRN.poId,
      vendor: newGRN.vendor,
      warehouse: newGRN.warehouse,
      items: total,
      received: rec,
      pending: pendingCount,
      status: status,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: newGRN.receivedBy,
      notes: newGRN.notes,
    };

    setReceivingList([created, ...receivingList]);
    setIsNewGRNOpen(false);
  };

  const handleMarkComplete = (grnId) => {
    setReceivingList(receivingList.map(g => {
      if (g.id === grnId) {
        const updated = { ...g, received: g.items, pending: 0, status: 'Complete' };
        if (selectedGRN && selectedGRN.id === grnId) setSelectedGRN(updated);
        return updated;
      }
      return g;
    }));
  };

  return (
    <div className="recv-page">

      {/* ── Header ── */}
      <div className="recv-header">
        <div className="recv-header-text">
          <div className="recv-icon-wrap" aria-hidden="true"><IconTruck /></div>
          <h1 className="recv-page-title">Inbound Receiving</h1>
          <p className="recv-page-subtitle">Track goods receipts (GRN) and inbound shipments</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            style={{ height: '40px', padding: '0 32px 0 12px', fontSize: '0.875rem', color: '#1e293b', background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 10px center', border: '1.5px solid #e2e8f0', borderRadius: '8px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
          >
            {['All','Complete','Partial','Pending'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            type="button"
            className="recv-btn-new"
            onClick={() => setIsNewGRNOpen(true)}
            aria-label="Record new receipt"
          >
            <IconPlus /> New Receipt
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="recv-stat-grid" role="list" aria-label="Receiving statistics">
        {[
          { icon: <IconTruck />,   cls: 'recv-stat-icon--teal',  value: stats.total,    label: 'Total GRNs' },
          { icon: <IconCheck />,   cls: 'recv-stat-icon--green', value: stats.complete, label: 'Complete' },
          { icon: <IconPackage />, cls: 'recv-stat-icon--amber', value: stats.partial,  label: 'Partial' },
          { icon: <IconClock />,   cls: 'recv-stat-icon--blue',  value: stats.pending,  label: 'Pending' },
        ].map((s, i) => (
          <div key={i} className="recv-stat-card" role="listitem">
            <div className={`recv-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="recv-stat-info">
              <span className="recv-stat-value">{s.value}</span>
              <span className="recv-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── GRN Cards ── */}
      <div className="recv-grid" role="list" aria-label="Goods receipt notes">
        {filtered.map(g => {
          const pct = g.items > 0 ? Math.round((g.received / g.items) * 100) : 0;
          return (
            <div key={g.id} className="recv-card" role="listitem" aria-label={`GRN: ${g.id}`}>
              <div className="recv-card-top">
                <div>
                  <div className="recv-grn-id">{g.id}</div>
                  <div className="recv-po-ref">PO: {g.poId}</div>
                </div>
                <span className={statusClass(g.status)}>{g.status}</span>
              </div>

              <div className="recv-card-body">
                <div className="recv-vendor-name">{g.vendor}</div>

                <div className="recv-progress-wrap">
                  <div className="recv-progress-labels">
                    <span>{g.received} of {g.items} items received</span>
                    <span style={{ fontWeight: 700, color: g.status === 'Complete' ? '#15803d' : g.status === 'Partial' ? '#d97706' : '#94a3b8' }}>{pct}%</span>
                  </div>
                  <div className="recv-progress-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                    <div className={fillClass(g.status)} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="recv-card-meta">
                  <div className="recv-meta-item">
                    <span className="recv-meta-label">Warehouse</span>
                    <span className="recv-meta-value">{g.warehouse}</span>
                  </div>
                  <div className="recv-meta-item">
                    <span className="recv-meta-label">Received By</span>
                    <span className="recv-meta-value">{g.receivedBy}</span>
                  </div>
                  <div className="recv-meta-item">
                    <span className="recv-meta-label">Date</span>
                    <span className="recv-meta-value">{g.receivedDate || '—'}</span>
                  </div>
                  <div className="recv-meta-item">
                    <span className="recv-meta-label">Pending</span>
                    <span className="recv-meta-value" style={{ color: g.pending > 0 ? '#d97706' : '#15803d' }}>{g.pending} items</span>
                  </div>
                </div>
              </div>

              <div className="recv-card-footer">
                <span className="recv-notes">{g.notes || 'No notes added.'}</span>
                <button
                  type="button"
                  className="recv-btn-action"
                  onClick={() => setSelectedGRN(g)}
                  aria-label={`View GRN ${g.id}`}
                >
                  View <IconArrow />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
            <p style={{ fontWeight: 600, color: '#475569', marginBottom: 6 }}>No receipts found</p>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting your filter</p>
          </div>
        )}
      </div>

      {/* ── MODAL: New Receipt ── */}
      <Modal
        isOpen={isNewGRNOpen}
        onClose={() => setIsNewGRNOpen(false)}
        title="Record Goods Receipt (GRN)"
        subtitle="Log inbound shipment details"
        icon={<IconTruck />}
        iconClass="modal-header-icon--teal"
        size="md"
        footer={
          <div className="modal-actions-right">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setIsNewGRNOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="new-grn-form" className="btn-modal btn-modal-primary" style={{ background: '#0d9488' }}>
              Save Receipt
            </button>
          </div>
        }
      >
        <form id="new-grn-form" onSubmit={handleCreateGRN} className="modal-form-grid">
          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-po">PO Reference ID *</label>
            <input
              id="grn-po"
              type="text"
              required
              className="modal-input"
              value={newGRN.poId}
              onChange={e => setNewGRN({ ...newGRN, poId: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-vendor">Vendor Name *</label>
            <input
              id="grn-vendor"
              type="text"
              required
              className="modal-input"
              value={newGRN.vendor}
              onChange={e => setNewGRN({ ...newGRN, vendor: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-wh">Receiving Warehouse</label>
            <select
              id="grn-wh"
              className="modal-select"
              value={newGRN.warehouse}
              onChange={e => setNewGRN({ ...newGRN, warehouse: e.target.value })}
            >
              <option>Main Warehouse - Mumbai</option>
              <option>North Hub - Delhi NCR</option>
              <option>South Logistics Hub - Bengaluru</option>
            </select>
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-by">Received By *</label>
            <input
              id="grn-by"
              type="text"
              required
              className="modal-input"
              value={newGRN.receivedBy}
              onChange={e => setNewGRN({ ...newGRN, receivedBy: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-items">Expected Items *</label>
            <input
              id="grn-items"
              type="number"
              min="1"
              required
              className="modal-input"
              value={newGRN.items}
              onChange={e => setNewGRN({ ...newGRN, items: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="grn-rec">Actual Received Quantity *</label>
            <input
              id="grn-rec"
              type="number"
              min="0"
              required
              className="modal-input"
              value={newGRN.received}
              onChange={e => setNewGRN({ ...newGRN, received: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="grn-notes">Inspection / Quality Notes</label>
            <textarea
              id="grn-notes"
              className="modal-textarea"
              rows="3"
              placeholder="e.g. Package intact, 2 boxes sealed, quality pass"
              value={newGRN.notes}
              onChange={e => setNewGRN({ ...newGRN, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* ── MODAL: View GRN Details ── */}
      {selectedGRN && (
        <Modal
          isOpen={!!selectedGRN}
          onClose={() => setSelectedGRN(null)}
          title={`GRN Details: ${selectedGRN.id}`}
          subtitle={`PO Reference: ${selectedGRN.poId} · ${selectedGRN.vendor}`}
          icon={<IconTruck />}
          iconClass="modal-header-icon--teal"
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              {selectedGRN.status !== 'Complete' ? (
                <button
                  type="button"
                  className="btn-modal btn-modal-primary"
                  style={{ background: '#0d9488' }}
                  onClick={() => handleMarkComplete(selectedGRN.id)}
                >
                  Mark Receipt Complete
                </button>
              ) : <div />}
              <button
                type="button"
                className="btn-modal btn-modal-secondary"
                onClick={() => setSelectedGRN(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.875rem' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Receipt Status</span>
              <span className={statusClass(selectedGRN.status)}>{selectedGRN.status}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Received Items</span>
              <strong style={{ color: '#0d9488', fontSize: '1rem' }}>{selectedGRN.received} / {selectedGRN.items} units</strong>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Receiving Warehouse</span>
              <span>{selectedGRN.warehouse}</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Received By</span>
              <span>{selectedGRN.receivedBy}</span>
            </div>
            <div style={{ gridColumn: '1/-1', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 4 }}>Inspection Notes</span>
              <p style={{ color: '#334155', margin: 0 }}>{selectedGRN.notes || 'No notes logged.'}</p>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Receiving;
