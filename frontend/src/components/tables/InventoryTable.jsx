/* ============================================================
   InventoryTable.jsx — Reusable Inventory Data Table
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import StatusBadge from '../common/StatusBadge';

/* ── SVG Icons for Action Buttons ── */
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

const IconTransfer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const IconAdjust = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
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


/* ── Action Buttons Row ── */
const ActionButtons = ({ item, onAction }) => {
  return (
    <div className="inv-action-group" role="group" aria-label={`Actions for ${item.productName}`}>
      <button
        type="button"
        className="inv-action-btn inv-action-btn--view"
        onClick={() => onAction('view', item)}
        aria-label={`View ${item.productName}`}
        title="View"
      >
        <IconEye />
        <span>View</span>
      </button>

      <button
        type="button"
        className="inv-action-btn inv-action-btn--stock-in"
        onClick={() => onAction('stock-in', item)}
        aria-label={`Stock In for ${item.productName}`}
        title="Stock In"
      >
        <IconArrowDown />
        <span>In</span>
      </button>

      <button
        type="button"
        className="inv-action-btn inv-action-btn--stock-out"
        onClick={() => onAction('stock-out', item)}
        aria-label={`Stock Out for ${item.productName}`}
        title="Stock Out"
      >
        <IconArrowUp />
        <span>Out</span>
      </button>

      <button
        type="button"
        className="inv-action-btn inv-action-btn--transfer"
        onClick={() => onAction('transfer', item)}
        aria-label={`Transfer ${item.productName}`}
        title="Transfer"
      >
        <IconTransfer />
        <span>Transfer</span>
      </button>

      <button
        type="button"
        className="inv-action-btn inv-action-btn--adjust"
        onClick={() => onAction('adjust', item)}
        aria-label={`Adjust ${item.productName}`}
        title="Adjust"
      >
        <IconAdjust />
        <span>Adjust</span>
      </button>

      <button
        type="button"
        className="inv-action-btn inv-action-btn--delete"
        onClick={() => onAction('delete', item)}
        aria-label={`Delete ${item.productName}`}
        title="Delete"
      >
        <IconTrash />
        <span>Delete</span>
      </button>
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
            <th scope="col">Warehouse</th>
            <th scope="col" className="inv-th-num">Total</th>
            <th scope="col" className="inv-th-num">Available</th>
            <th scope="col" className="inv-th-num">Reserved</th>
            <th scope="col" className="inv-th-num">Damaged</th>
            <th scope="col" className="inv-th-num">Reorder Lvl</th>
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
              <td className="inv-td-warehouse">
                <span className="inv-warehouse-icon" aria-hidden="true">🏭</span>
                {item.warehouse}
              </td>
              <td className="inv-td-num">{item.totalQuantity.toLocaleString()}</td>
              <td className="inv-td-num inv-td-available">{item.availableQuantity.toLocaleString()}</td>
              <td className="inv-td-num">{item.reservedQuantity.toLocaleString()}</td>
              <td className="inv-td-num inv-td-damaged">{item.damagedQuantity.toLocaleString()}</td>
              <td className="inv-td-num">{item.reorderLevel.toLocaleString()}</td>
              <td>
                <StatusBadge status={item.stockStatus} />
              </td>
              <td className="inv-td-actions">
                <ActionButtons item={item} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
