/* ============================================================
   Modal.jsx — Base Modal Shell
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useEffect } from 'react';
import './Modal.css';

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Modal
 *
 * Base modal shell. Handles:
 *  - backdrop with blur
 *  - Escape key to close
 *  - Body scroll lock
 *  - Stop propagation so clicking card doesn't close
 *
 * Props:
 *   isOpen      {boolean}
 *   onClose     {function}
 *   title       {string}
 *   subtitle    {string}   optional
 *   icon        {ReactNode} optional — rendered in colored ring
 *   iconClass   {string}   optional — CSS class for icon ring color
 *   size        {string}   'sm' | 'md' | 'lg'
 *   footer      {ReactNode} optional — rendered in modal footer
 *   children    {ReactNode} — modal body content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconClass = 'modal-header-icon--slate',
  size = 'md',
  footer,
  children,
}) => {
  /* ── Lock body scroll & handle Escape ── */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`modal-card modal-card--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header-left">
            {icon && (
              <div className={`modal-header-icon ${iconClass}`} aria-hidden="true">
                {icon}
              </div>
            )}
            <div className="modal-header-text">
              <h2 className="modal-title">{title}</h2>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IconClose />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="modal-body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
