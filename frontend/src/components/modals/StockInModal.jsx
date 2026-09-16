/* ============================================================
   StockInModal.jsx — Add Stock Modal
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState } from 'react';
import Modal from './Modal';

const IconArrowDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

/**
 * StockInModal
 *
 * Form to add stock units to an inventory item.
 * On confirm, calls onConfirm(item, { quantity, reference, supplier, notes }).
 *
 * Props:
 *   item       {object}   — inventory record
 *   onClose    {function}
 *   onConfirm  {function} — (item, formData) => void
 */
const StockInModal = ({ item, onClose, onConfirm }) => {
  const [quantity,  setQuantity]  = useState('');
  const [reference, setReference] = useState('');
  const [supplier,  setSupplier]  = useState('');
  const [notes,     setNotes]     = useState('');
  const [errors,    setErrors]    = useState({});

  if (!item) return null;

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const qty = parseInt(quantity, 10);
    if (!quantity.trim()) {
      errs.quantity = 'Quantity is required.';
    } else if (isNaN(qty) || qty < 1) {
      errs.quantity = 'Quantity must be at least 1.';
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
      quantity:  parseInt(quantity, 10),
      reference: reference.trim(),
      supplier:  supplier.trim(),
      notes:     notes.trim(),
    });
  };

  const isValid = quantity !== '' && parseInt(quantity, 10) >= 1;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Stock In"
      subtitle={`Add units to ${item.productName} · ${item.warehouse}`}
      icon={<IconArrowDown />}
      iconClass="modal-header-icon--green"
      size="sm"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="stock-in-form"
            className="modal-btn modal-btn--green"
            disabled={!isValid}
            aria-label="Confirm stock in"
          >
            + Add Stock
          </button>
        </>
      }
    >
      <form id="stock-in-form" className="mf-form" onSubmit={handleSubmit} noValidate>

        {/* Current stock info */}
        <div className="view-info-grid" style={{ marginBottom: 0 }}>
          <div className="view-info-item">
            <span className="view-info-label">Current Available</span>
            <span className="view-info-value view-info-value--green">{item.availableQuantity} units</span>
          </div>
          <div className="view-info-item">
            <span className="view-info-label">SKU</span>
            <span className="view-info-value">{item.sku}</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="mf-group">
          <label htmlFor="si-quantity" className="mf-label">
            Quantity to Add <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <input
            id="si-quantity"
            type="number"
            min="1"
            step="1"
            className={`mf-input${errors.quantity ? ' mf-error' : ''}`}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setErrors({}); }}
            placeholder="Enter quantity"
            aria-describedby={errors.quantity ? 'si-qty-error' : undefined}
            aria-required="true"
            autoFocus
          />
          {errors.quantity && (
            <span id="si-qty-error" className="mf-error-msg" role="alert">⚠ {errors.quantity}</span>
          )}
          {quantity && parseInt(quantity, 10) >= 1 && (
            <span className="mf-qty-info">
              New available will be: <strong>{item.availableQuantity + parseInt(quantity, 10)} units</strong>
            </span>
          )}
        </div>

        {/* PO / Reference Number */}
        <div className="mf-group">
          <label htmlFor="si-reference" className="mf-label">PO / Reference Number</label>
          <input
            id="si-reference"
            type="text"
            className="mf-input"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. PO-2024-001 (optional)"
          />
        </div>

        {/* Supplier */}
        <div className="mf-group">
          <label htmlFor="si-supplier" className="mf-label">Supplier</label>
          <input
            id="si-supplier"
            type="text"
            className="mf-input"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Supplier name (optional)"
          />
        </div>

        {/* Notes */}
        <div className="mf-group">
          <label htmlFor="si-notes" className="mf-label">Notes</label>
          <textarea
            id="si-notes"
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

export default StockInModal;
