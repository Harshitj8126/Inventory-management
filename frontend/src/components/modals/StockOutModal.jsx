/* ============================================================
   StockOutModal.jsx — Remove Stock Modal
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState } from 'react';
import Modal from './Modal';

const IconArrowUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const REASONS = [
  { value: '',        label: 'Select a reason...' },
  { value: 'Sale',    label: 'Sale / Dispatch' },
  { value: 'Damage',  label: 'Damage / Loss' },
  { value: 'Return',  label: 'Returned to Supplier' },
  { value: 'Expiry',  label: 'Expired / Obsolete' },
  { value: 'Consume', label: 'Internal Consumption' },
  { value: 'Other',   label: 'Other' },
];

/**
 * StockOutModal
 *
 * Form to remove stock from an inventory item.
 * Validates that quantity does not exceed availableQuantity.
 * On confirm, calls onConfirm(item, { quantity, reason, notes }).
 */
const StockOutModal = ({ item, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState('');
  const [reason,   setReason]   = useState('');
  const [notes,    setNotes]    = useState('');
  const [errors,   setErrors]   = useState({});

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

    if (!reason) {
      errs.reason = 'Please select a reason.';
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
      quantity: parseInt(quantity, 10),
      reason,
      notes: notes.trim(),
    });
  };

  const qty = parseInt(quantity, 10);
  const isValid = !isNaN(qty) && qty >= 1 && qty <= item.availableQuantity && reason !== '';

  /* ── Cannot do stock-out if nothing available ── */
  if (item.availableQuantity === 0) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Stock Out"
        subtitle={`${item.productName} · ${item.warehouse}`}
        icon={<IconArrowUp />}
        iconClass="modal-header-icon--orange"
        size="sm"
        footer={
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Close
          </button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: '#b91c1c', fontWeight: 600, marginBottom: 8 }}>
            No available stock
          </p>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            This item has 0 available units. Stock-out is not possible.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Stock Out"
      subtitle={`Remove units from ${item.productName} · ${item.warehouse}`}
      icon={<IconArrowUp />}
      iconClass="modal-header-icon--orange"
      size="sm"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="stock-out-form"
            className="modal-btn modal-btn--orange"
            disabled={!isValid}
            aria-label="Confirm stock out"
          >
            − Remove Stock
          </button>
        </>
      }
    >
      <form id="stock-out-form" className="mf-form" onSubmit={handleSubmit} noValidate>

        {/* Current stock info */}
        <div className="view-info-grid" style={{ marginBottom: 0 }}>
          <div className="view-info-item">
            <span className="view-info-label">Available Stock</span>
            <span className="view-info-value view-info-value--green">{item.availableQuantity} units</span>
          </div>
          <div className="view-info-item">
            <span className="view-info-label">SKU</span>
            <span className="view-info-value">{item.sku}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="mf-group">
          <label htmlFor="so-quantity" className="mf-label">
            Quantity to Remove <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <input
            id="so-quantity"
            type="number"
            min="1"
            max={item.availableQuantity}
            step="1"
            className={`mf-input${errors.quantity ? ' mf-error' : ''}`}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: '' })); }}
            placeholder={`Max ${item.availableQuantity} units`}
            aria-describedby={errors.quantity ? 'so-qty-error' : 'so-qty-hint'}
            aria-required="true"
            autoFocus
          />
          {errors.quantity ? (
            <span id="so-qty-error" className="mf-error-msg" role="alert">⚠ {errors.quantity}</span>
          ) : (
            <span id="so-qty-hint" className="mf-qty-info">
              Max allowed: <strong>{item.availableQuantity} units</strong>
              {!isNaN(qty) && qty >= 1 && qty <= item.availableQuantity && (
                <> · Remaining after: <strong>{item.availableQuantity - qty} units</strong></>
              )}
            </span>
          )}
        </div>

        {/* Reason */}
        <div className="mf-group">
          <label htmlFor="so-reason" className="mf-label">
            Reason <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <select
            id="so-reason"
            className={`mf-select${errors.reason ? ' mf-error' : ''}`}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: '' })); }}
            aria-required="true"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value} disabled={r.value === ''}>
                {r.label}
              </option>
            ))}
          </select>
          {errors.reason && (
            <span className="mf-error-msg" role="alert">⚠ {errors.reason}</span>
          )}
        </div>

        {/* Notes */}
        <div className="mf-group">
          <label htmlFor="so-notes" className="mf-label">Notes</label>
          <textarea
            id="so-notes"
            className="mf-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (optional)"
            rows={2}
          />
        </div>
      </form>
    </Modal>
  );
};

export default StockOutModal;
