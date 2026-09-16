/* ============================================================
   TransferModal.jsx — Transfer Stock Between Warehouses
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState } from 'react';
import Modal from './Modal';

const IconTransfer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

/* All known warehouses */
const ALL_WAREHOUSES = [
  'Delhi Warehouse',
  'Noida Warehouse',
  'Mumbai Warehouse',
];

/**
 * TransferModal
 *
 * Form to transfer stock from the item's warehouse to another.
 * On confirm, calls onConfirm(item, { toWarehouse, quantity, notes }).
 */
const TransferModal = ({ item, onClose, onConfirm }) => {
  /* Default to first warehouse that is NOT the source */
  const otherWarehouses = ALL_WAREHOUSES.filter((w) => w !== item?.warehouse);

  const [toWarehouse, setToWarehouse] = useState(otherWarehouses[0] || '');
  const [quantity,    setQuantity]    = useState('');
  const [notes,       setNotes]       = useState('');
  const [errors,      setErrors]      = useState({});

  if (!item) return null;

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const qty = parseInt(quantity, 10);

    if (!quantity.trim()) {
      errs.quantity = 'Quantity is required.';
    } else if (isNaN(qty) || qty < 1) {
      errs.quantity = 'Quantity must be at least 1.';
    } else if (qty > item.availableQuantity) {
      errs.quantity = `Cannot exceed available stock (${item.availableQuantity} units).`;
    }

    if (!toWarehouse) {
      errs.toWarehouse = 'Please select a destination warehouse.';
    }

    return errs;
  };

  /* ── Submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onConfirm(item, {
      toWarehouse,
      quantity: parseInt(quantity, 10),
      notes: notes.trim(),
    });
  };

  const qty = parseInt(quantity, 10);
  const isValid =
    !isNaN(qty) && qty >= 1 && qty <= item.availableQuantity && toWarehouse !== '';

  /* ── Zero stock guard ── */
  if (item.availableQuantity === 0) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Transfer Stock"
        subtitle={`${item.productName} · ${item.warehouse}`}
        icon={<IconTransfer />}
        iconClass="modal-header-icon--blue"
        size="sm"
        footer={
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Close
          </button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: '#b91c1c', fontWeight: 600, marginBottom: 8 }}>
            No available stock to transfer
          </p>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            This item has 0 available units. Add stock first before transferring.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Transfer Stock"
      subtitle={`Move units of ${item.productName} to another warehouse`}
      icon={<IconTransfer />}
      iconClass="modal-header-icon--blue"
      size="sm"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="transfer-form"
            className="modal-btn modal-btn--primary"
            disabled={!isValid}
            aria-label="Confirm transfer"
          >
            Transfer →
          </button>
        </>
      }
    >
      <form id="transfer-form" className="mf-form" onSubmit={handleSubmit} noValidate>

        {/* From / To row */}
        <div className="mf-row">
          {/* From Warehouse (read-only) */}
          <div className="mf-group">
            <label className="mf-label">From Warehouse</label>
            <div className="mf-readonly">🏭 {item.warehouse}</div>
          </div>

          {/* To Warehouse */}
          <div className="mf-group">
            <label htmlFor="tf-to" className="mf-label">
              To Warehouse <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <select
              id="tf-to"
              className={`mf-select${errors.toWarehouse ? ' mf-error' : ''}`}
              value={toWarehouse}
              onChange={(e) => { setToWarehouse(e.target.value); setErrors((p) => ({ ...p, toWarehouse: '' })); }}
              aria-required="true"
            >
              {otherWarehouses.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            {errors.toWarehouse && (
              <span className="mf-error-msg" role="alert">⚠ {errors.toWarehouse}</span>
            )}
          </div>
        </div>

        {/* Available stock info */}
        <div className="view-info-grid" style={{ marginBottom: 0 }}>
          <div className="view-info-item">
            <span className="view-info-label">Available to Transfer</span>
            <span className="view-info-value view-info-value--green">{item.availableQuantity} units</span>
          </div>
          <div className="view-info-item">
            <span className="view-info-label">SKU</span>
            <span className="view-info-value">{item.sku}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="mf-group">
          <label htmlFor="tf-quantity" className="mf-label">
            Quantity to Transfer <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <input
            id="tf-quantity"
            type="number"
            min="1"
            max={item.availableQuantity}
            step="1"
            className={`mf-input${errors.quantity ? ' mf-error' : ''}`}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: '' })); }}
            placeholder={`Max ${item.availableQuantity} units`}
            aria-describedby={errors.quantity ? 'tf-qty-error' : 'tf-qty-hint'}
            aria-required="true"
            autoFocus
          />
          {errors.quantity ? (
            <span id="tf-qty-error" className="mf-error-msg" role="alert">⚠ {errors.quantity}</span>
          ) : (
            !isNaN(qty) && qty >= 1 && qty <= item.availableQuantity && (
              <span id="tf-qty-hint" className="mf-qty-info">
                Remaining at {item.warehouse}: <strong>{item.availableQuantity - qty} units</strong>
              </span>
            )
          )}
        </div>

        {/* Notes */}
        <div className="mf-group">
          <label htmlFor="tf-notes" className="mf-label">Notes</label>
          <textarea
            id="tf-notes"
            className="mf-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Transfer reason or instructions (optional)"
            rows={2}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;
