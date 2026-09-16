/* ============================================================
   ViewItemModal.jsx — View Full Inventory Item Details
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import Modal from './Modal';
import StatusBadge from '../common/StatusBadge';

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * ViewItemModal
 *
 * Displays full read-only details for an inventory record.
 *
 * Props:
 *   item    {object}   — inventory record
 *   onClose {function} — close handler
 */
const ViewItemModal = ({ item, onClose }) => {
  if (!item) return null;

  const total = item.totalQuantity || 0;

  /* ── Stock bar widths (as percentages of total) ── */
  const availablePct = total > 0 ? (item.availableQuantity / total) * 100 : 0;
  const reservedPct  = total > 0 ? (item.reservedQuantity  / total) * 100 : 0;
  const damagedPct   = total > 0 ? (item.damagedQuantity   / total) * 100 : 0;

  /* ── Stock status colour class ── */
  const valueClass = {
    'In Stock':     'view-info-value--green',
    'Low Stock':    'view-info-value--amber',
    'Out of Stock': 'view-info-value--red',
  }[item.stockStatus] || '';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Inventory Details"
      subtitle={`${item.productName} · ${item.sku}`}
      icon={<IconEye />}
      iconClass="modal-header-icon--slate"
      size="md"
      footer={
        <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
          Close
        </button>
      }
    >
      {/* ── Top Info Grid ── */}
      <div className="view-info-grid">
        <div className="view-info-item">
          <span className="view-info-label">Product Name</span>
          <span className="view-info-value">{item.productName}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">SKU</span>
          <span className="view-info-value">{item.sku}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Category</span>
          <span className="view-info-value">{item.category}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Warehouse</span>
          <span className="view-info-value">{item.warehouse}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Reorder Level</span>
          <span className="view-info-value">{item.reorderLevel} units</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Stock Status</span>
          <StatusBadge status={item.stockStatus} />
        </div>
      </div>

      {/* ── Stock Breakdown Bar ── */}
      <div className="view-stock-bar-wrapper">
        <div className="view-stock-bar-labels">
          <span>Stock breakdown (total: {total} units)</span>
          <span className={`view-info-value ${valueClass}`}>{item.stockStatus}</span>
        </div>

        <div className="view-stock-bar-track" aria-label="Stock breakdown bar">
          <div
            className="view-stock-bar-available"
            style={{ width: `${availablePct}%` }}
            title={`Available: ${item.availableQuantity}`}
          />
          <div
            className="view-stock-bar-reserved"
            style={{ width: `${reservedPct}%` }}
            title={`Reserved: ${item.reservedQuantity}`}
          />
          <div
            className="view-stock-bar-damaged"
            style={{ width: `${damagedPct}%` }}
            title={`Damaged: ${item.damagedQuantity}`}
          />
        </div>

        <div className="view-stock-bar-legend">
          <span className="view-legend-item">
            <span className="view-legend-dot view-legend-dot--green" aria-hidden="true" />
            Available ({item.availableQuantity})
          </span>
          <span className="view-legend-item">
            <span className="view-legend-dot view-legend-dot--blue" aria-hidden="true" />
            Reserved ({item.reservedQuantity})
          </span>
          <span className="view-legend-item">
            <span className="view-legend-dot view-legend-dot--red" aria-hidden="true" />
            Damaged ({item.damagedQuantity})
          </span>
        </div>
      </div>

      {/* ── Quantity Details Grid ── */}
      <div className="view-divider" aria-hidden="true" />

      <div className="view-info-grid">
        <div className="view-info-item">
          <span className="view-info-label">Total Quantity</span>
          <span className="view-info-value">{item.totalQuantity}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Available</span>
          <span className="view-info-value view-info-value--green">{item.availableQuantity}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Reserved</span>
          <span className="view-info-value">{item.reservedQuantity}</span>
        </div>
        <div className="view-info-item">
          <span className="view-info-label">Damaged</span>
          <span className={`view-info-value ${item.damagedQuantity > 0 ? 'view-info-value--red' : ''}`}>
            {item.damagedQuantity}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ViewItemModal;
