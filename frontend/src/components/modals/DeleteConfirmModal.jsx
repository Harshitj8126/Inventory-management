/* ============================================================
   DeleteConfirmModal.jsx — Confirm Product Deletion
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import Modal from './Modal';

const IconTrash = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/**
 * DeleteConfirmModal
 *
 * Displays a destructive-action confirmation dialog before deleting a product.
 *
 * Props:
 *   item      {object}   — inventory record to delete
 *   onClose   {function}
 *   onConfirm {function} — (item) => void  called on "Delete" click
 */
const DeleteConfirmModal = ({ item, onClose, onConfirm }) => {
  if (!item) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Delete Product"
      subtitle="This action cannot be undone"
      icon={<IconTrash />}
      iconClass="modal-header-icon--red"
      size="sm"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn modal-btn--danger"
            onClick={() => onConfirm(item)}
            aria-label={`Confirm deletion of ${item.productName}`}
          >
            <IconTrash />
            Delete Product
          </button>
        </>
      }
    >
      {/* Warning Banner */}
      <div className="del-warn-banner" role="alert">
        <span className="del-warn-icon" aria-hidden="true">⚠️</span>
        <p className="del-warn-text">
          You are about to permanently delete this product from inventory.
          All stock quantities at this warehouse will be removed.
        </p>
      </div>

      {/* Product Summary */}
      <div className="del-product-card">
        <div className="del-product-row">
          <span className="del-product-label">Product</span>
          <span className="del-product-value">{item.productName}</span>
        </div>
        <div className="del-product-row">
          <span className="del-product-label">SKU</span>
          <code className="del-product-sku">{item.sku}</code>
        </div>
        <div className="del-product-row">
          <span className="del-product-label">Category</span>
          <span className="del-product-value">{item.category}</span>
        </div>
        <div className="del-product-row">
          <span className="del-product-label">Warehouse</span>
          <span className="del-product-value">{item.warehouse}</span>
        </div>
        <div className="del-product-row del-product-row--last">
          <span className="del-product-label">Total Stock</span>
          <span className="del-product-value del-product-stock">
            {item.totalQuantity} units
          </span>
        </div>
      </div>

      <p className="del-confirm-text">
        Are you sure you want to delete <strong>{item.productName}</strong>?
      </p>
    </Modal>
  );
};

export default DeleteConfirmModal;
