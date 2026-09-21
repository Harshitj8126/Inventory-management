import { useState, useRef, useEffect } from 'react';
import StatusBadge from '../common/StatusBadge';

/* ── SVG Icons for Action Buttons & Dropdown ── */
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconArrowDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const IconArrowUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const IconEmpty = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Action Dropdown Menu Component ── */
const ActionDropdown = ({ item, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (type) => {
    setIsOpen(false);
    onAction(type, item);
  };

  return (
    <div className="inv-dropdown-wrap" ref={dropdownRef}>
      <button
        type="button"
        className={`inv-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Actions menu for ${item.productName}`}
        title="Actions"
      >
        <span>Actions</span>
        <IconChevronDown />
      </button>

      {isOpen && (
        <div className="inv-dropdown-menu" role="menu">
          <button
            type="button"
            className="inv-dropdown-item"
            onClick={() => handleSelect('view')}
            role="menuitem"
          >
            <IconEye />
            <span>View</span>
          </button>

          <button
            type="button"
            className="inv-dropdown-item inv-dropdown-item--in"
            onClick={() => handleSelect('stock-in')}
            role="menuitem"
          >
            <IconArrowDown />
            <span>Stock In</span>
          </button>

          <button
            type="button"
            className="inv-dropdown-item inv-dropdown-item--out"
            onClick={() => handleSelect('stock-out')}
            role="menuitem"
          >
            <IconArrowUp />
            <span>Stock Out</span>
          </button>

          <div className="inv-dropdown-divider" role="separator" />

          <button
            type="button"
            className="inv-dropdown-item inv-dropdown-item--danger"
            onClick={() => handleSelect('delete')}
            role="menuitem"
          >
            <IconTrash />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   InventoryTable Component
══════════════════════════════════════════ */

/**
 * InventoryTable
 *
 * Renders a full data table for inventory records.
 * Handles empty state when no records match filters.
 *
 * Props:
 *   items    {Array}    — filtered array of inventory objects with stockStatus attached
 *   onAction {function} — (type, item) => void  called by action buttons
 */
const InventoryTable = ({ items, onAction }) => {
  /* ── Empty State ── */
  if (!items || items.length === 0) {
    return (
      <div className="inv-table-empty" role="status" aria-live="polite">
        <IconEmpty />
        <p className="inv-table-empty-title">No inventory records found.</p>
        <p className="inv-table-empty-sub">
          Try adjusting your search terms or filter selections.
        </p>
      </div>
    );
  }

  return (
    <div className="inv-table-scroll-wrapper">
      <table className="inv-table" aria-label="Inventory records">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">SKU</th>
            <th scope="col">Category</th>
            <th scope="col" className="inv-th-num">Total</th>
            <th scope="col" className="inv-th-num">Available</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="inv-table-row">
              <td className="inv-td-product">
                <span className="inv-product-name">{item.productName}</span>
              </td>
              <td>
                <code className="inv-sku">{item.sku}</code>
              </td>
              <td>
                <span className="inv-category-tag">{item.category}</span>
              </td>
              <td className="inv-td-num">{item.totalQuantity.toLocaleString()}</td>
              <td className="inv-td-num inv-td-available">{item.availableQuantity.toLocaleString()}</td>
              <td>
                <StatusBadge status={item.stockStatus} />
              </td>
              <td className="inv-td-actions">
                <ActionDropdown item={item} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
