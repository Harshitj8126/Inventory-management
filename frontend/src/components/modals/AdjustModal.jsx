/* ============================================================
   AdjustModal.jsx — Inventory Adjustment Modal
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState } from 'react';
import Modal from './Modal';

const IconAdjust = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const ADJUSTMENT_REASONS = [
  { value: '',               label: 'Select reason...' },
  { value: 'Stock Count',    label: 'Physical Stock Count' },
  { value: 'Damage Found',   label: 'Damage Found on Inspection' },
  { value: 'Recovery',       label: 'Damaged Items Recovered' },
  { value: 'System Error',   label: 'Correct System Error' },
  { value: 'Write Off',      label: 'Write Off / Scrapping' },
  { value: 'Other',          label: 'Other' },
];

/**
 * AdjustModal
 *
 * Allows direct edit of Available, Reserved, and Damaged quantities.
 * Total is auto-calculated. Reason is required.
 * On confirm, calls onConfirm(item, { availableQuantity, reservedQuantity, damagedQuantity, reason, notes }).
 */
const AdjustModal = ({ item, onClose, onConfirm }) => {
  const [available, setAvailable] = useState(String(item?.availableQuantity ?? 0));
  const [reserved,  setReserved]  = useState(String(item?.reservedQuantity  ?? 0));
  const [damaged,   setDamaged]   = useState(String(item?.damagedQuantity   ?? 0));
  const [reason,    setReason]    = useState('');
  const [notes,     setNotes]     = useState('');
  const [errors,    setErrors]    = useState({});

  if (!item) return null;

  /* ── Parse helpers ── */
  const avail = parseInt(available, 10);
  const res   = parseInt(reserved,  10);
  const dmg   = parseInt(damaged,   10);

  const allValid = !isNaN(avail) && avail >= 0
               && !isNaN(res)   && res   >= 0
               && !isNaN(dmg)   && dmg   >= 0;

  const newTotal = allValid ? avail + res + dmg : '—';

  /* ── Validate ── */
  const validate = () => {
    const errs = {};
    if (isNaN(avail) || avail < 0) errs.available = 'Must be 0 or more.';
    if (isNaN(res)   || res   < 0) errs.reserved  = 'Must be 0 or more.';
    if (isNaN(dmg)   || dmg   < 0) errs.damaged   = 'Must be 0 or more.';
    if (!reason)                    errs.reason    = 'Please select a reason.';
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
      availableQuantity: avail,
      reservedQuantity:  res,
      damagedQuantity:   dmg,
      reason,
      notes: notes.trim(),
    });
  };

  const isFormValid = allValid && reason !== '';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Adjust Stock"
      subtitle={`Manually correct quantities for ${item.productName}`}
      icon={<IconAdjust />}
      iconClass="modal-header-icon--violet"
      size="md"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="adjust-form"
            className="modal-btn modal-btn--violet"
            disabled={!isFormValid}
            aria-label="Save stock adjustment"
          >
            Save Adjustment
          </button>
        </>
      }
    >
      <form id="adjust-form" className="mf-form" onSubmit={handleSubmit} noValidate>

        {/* Current values reference */}
        <div className="view-info-grid" style={{ marginBottom: 0 }}>
          <div className="view-info-item">
            <span className="view-info-label">Current Total</span>
            <span className="view-info-value">{item.totalQuantity} units</span>
          </div>
          <div className="view-info-item">
            <span className="view-info-label">Warehouse</span>
            <span className="view-info-value">{item.warehouse}</span>
          </div>
        </div>

        {/* Quantity fields */}
        <div className="mf-row">
          {/* Available */}
          <div className="mf-group">
            <label htmlFor="adj-available" className="mf-label">
              Available Qty <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <input
              id="adj-available"
              type="number"
              min="0"
              step="1"
              className={`mf-input${errors.available ? ' mf-error' : ''}`}
              value={available}
              onChange={(e) => { setAvailable(e.target.value); setErrors((p) => ({ ...p, available: '' })); }}
              placeholder="0"
              aria-required="true"
              autoFocus
            />
            {errors.available && (
              <span className="mf-error-msg" role="alert">⚠ {errors.available}</span>
            )}
            <span className="mf-hint">Was: {item.availableQuantity}</span>
          </div>

          {/* Reserved */}
          <div className="mf-group">
            <label htmlFor="adj-reserved" className="mf-label">
              Reserved Qty <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <input
              id="adj-reserved"
              type="number"
              min="0"
              step="1"
              className={`mf-input${errors.reserved ? ' mf-error' : ''}`}
              value={reserved}
              onChange={(e) => { setReserved(e.target.value); setErrors((p) => ({ ...p, reserved: '' })); }}
              placeholder="0"
              aria-required="true"
            />
            {errors.reserved && (
              <span className="mf-error-msg" role="alert">⚠ {errors.reserved}</span>
            )}
            <span className="mf-hint">Was: {item.reservedQuantity}</span>
          </div>
        </div>

        <div className="mf-row">
          {/* Damaged */}
          <div className="mf-group">
            <label htmlFor="adj-damaged" className="mf-label">
              Damaged Qty <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <input
              id="adj-damaged"
              type="number"
              min="0"
              step="1"
              className={`mf-input${errors.damaged ? ' mf-error' : ''}`}
              value={damaged}
              onChange={(e) => { setDamaged(e.target.value); setErrors((p) => ({ ...p, damaged: '' })); }}
              placeholder="0"
              aria-required="true"
            />
            {errors.damaged && (
              <span className="mf-error-msg" role="alert">⚠ {errors.damaged}</span>
            )}
            <span className="mf-hint">Was: {item.damagedQuantity}</span>
          </div>

          {/* New Total Preview */}
          <div className="mf-group">
            <span className="mf-label">New Total (auto)</span>
            <div className="adjust-total-preview" aria-live="polite" aria-atomic="true">
              <span className="adjust-total-label">Total =</span>
              <span className="adjust-total-value">{newTotal} {typeof newTotal === 'number' ? 'units' : ''}</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mf-group">
          <label htmlFor="adj-reason" className="mf-label">
            Reason for Adjustment <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <select
            id="adj-reason"
            className={`mf-select${errors.reason ? ' mf-error' : ''}`}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setErrors((p) => ({ ...p, reason: '' })); }}
            aria-required="true"
          >
            {ADJUSTMENT_REASONS.map((r) => (
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
          <label htmlFor="adj-notes" className="mf-label">Notes</label>
          <textarea
            id="adj-notes"
            className="mf-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the reason for adjustment in detail (optional)"
            rows={2}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AdjustModal;
