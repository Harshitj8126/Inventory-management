/* ============================================================
   AddProductModal.jsx — Add New Inventory Item with Dynamic Categories
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState, useCallback } from 'react';
import { getCategories, addCategory } from '../../services/categoryService';
import Modal from './Modal';

const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ── Auto-suggest SKU from product name ── */
const suggestSku = (name) => {
  if (!name.trim()) return '';
  const parts = name.trim().split(/\s+/).slice(0, 3);
  const prefix = parts.map((w) => w.slice(0, 2).toUpperCase()).join('');
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${num}`;
};

/**
 * AddProductModal
 */
const AddProductModal = ({ existingSkus = [], onClose, onConfirm }) => {
  const [categoriesList, setCategoriesList] = useState(getCategories());
  const [productName, setProductName] = useState('');
  const [sku,         setSku]         = useState('');
  const [category,    setCategory]    = useState(categoriesList[0] || 'Electronics');
  const [customCat,   setCustomCat]   = useState('');
  const [available,   setAvailable]   = useState('0');
  const [errors,      setErrors]      = useState({});
  const [skuTouched,  setSkuTouched]  = useState(false);

  /* ── Auto-fill SKU ── */
  const handleProductNameChange = (e) => {
    const val = e.target.value;
    setProductName(val);
    if (!skuTouched) {
      setSku(suggestSku(val));
    }
    setErrors((p) => ({ ...p, productName: '' }));
  };

  const handleSkuChange = (e) => {
    setSku(e.target.value.toUpperCase());
    setSkuTouched(true);
    setErrors((p) => ({ ...p, sku: '' }));
  };

  /* ── Parse quantity ── */
  const avail = parseInt(available, 10);
  const qtyValid = !isNaN(avail) && avail >= 0;

  /* ── Validation ── */
  const validate = useCallback(() => {
    const errs = {};
    if (!productName.trim())  errs.productName = 'Product name is required.';
    if (!sku.trim())          errs.sku = 'SKU is required.';
    else if (existingSkus.map((s) => s.toLowerCase()).includes(sku.trim().toLowerCase())) {
      errs.sku = `SKU "${sku}" already exists.`;
    }
    if (category === 'ADD_CUSTOM' && !customCat.trim()) {
      errs.customCat = 'Custom category name is required.';
    }
    if (isNaN(avail) || avail < 0)  errs.available = 'Must be 0 or more.';
    return errs;
  }, [productName, sku, category, customCat, avail, existingSkus]);

  /* ── Submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    let finalCategory = category;
    if (category === 'ADD_CUSTOM' && customCat.trim()) {
      finalCategory = customCat.trim();
      addCategory(finalCategory);
    }

    onConfirm({
      productName:       productName.trim(),
      sku:               sku.trim().toUpperCase(),
      category:          finalCategory,
      availableQuantity: avail,
      reservedQuantity:  0,
      damagedQuantity:   0,
      totalQuantity:     avail,
      reorderLevel:      10,
    });
  };

  const isFormValid =
    productName.trim() !== '' &&
    sku.trim() !== '' &&
    (category !== 'ADD_CUSTOM' || customCat.trim() !== '') &&
    qtyValid;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add New Product"
      subtitle="Create a new inventory record"
      icon={<IconPlus />}
      iconClass="modal-header-icon--violet"
      size="lg"
      footer={
        <>
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="modal-btn modal-btn--purple"
            disabled={!isFormValid}
            aria-label="Save new product"
          >
            <IconPlus />
            Add Product
          </button>
        </>
      }
    >
      <form id="add-product-form" className="mf-form" onSubmit={handleSubmit} noValidate>

        {/* ── Product Name ── */}
        <div className="mf-group">
          <label htmlFor="ap-name" className="mf-label">
            Product Name <span className="mf-required" aria-hidden="true">*</span>
          </label>
          <input
            id="ap-name"
            type="text"
            className={`mf-input${errors.productName ? ' mf-error' : ''}`}
            value={productName}
            onChange={handleProductNameChange}
            placeholder="e.g. Wireless Keyboard"
            aria-required="true"
            autoFocus
          />
          {errors.productName && (
            <span className="mf-error-msg" role="alert">⚠ {errors.productName}</span>
          )}
        </div>

        {/* ── SKU | Category ── */}
        <div className="mf-row">
          <div className="mf-group">
            <label htmlFor="ap-sku" className="mf-label">
              SKU <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <input
              id="ap-sku"
              type="text"
              className={`mf-input${errors.sku ? ' mf-error' : ''}`}
              value={sku}
              onChange={handleSkuChange}
              placeholder="e.g. WK-001"
            />
            {errors.sku ? (
              <span className="mf-error-msg" role="alert">⚠ {errors.sku}</span>
            ) : (
              <span className="mf-hint">Auto-suggested · click to override</span>
            )}
          </div>

          <div className="mf-group">
            <label htmlFor="ap-category" className="mf-label">
              Category / Type <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <select
              id="ap-category"
              className="mf-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="ADD_CUSTOM">+ Add Custom Category...</option>
            </select>
          </div>
        </div>

        {category === 'ADD_CUSTOM' && (
          <div className="mf-group">
            <label htmlFor="ap-custom-cat" className="mf-label">
              Type Custom Category Name <span className="mf-required" aria-hidden="true">*</span>
            </label>
            <input
              id="ap-custom-cat"
              type="text"
              className={`mf-input${errors.customCat ? ' mf-error' : ''}`}
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
              placeholder="e.g. Automotive, Medical Equipment..."
            />
            {errors.customCat && (
              <span className="mf-error-msg" role="alert">⚠ {errors.customCat}</span>
            )}
          </div>
        )}

        {/* ── Initial Quantity ── */}
        <div className="mf-group">
          <label htmlFor="ap-avail" className="mf-label">Available / Total Quantity</label>
          <input
            id="ap-avail"
            type="number"
            min="0"
            step="1"
            className={`mf-input${errors.available ? ' mf-error' : ''}`}
            value={available}
            onChange={(e) => { setAvailable(e.target.value); setErrors((p) => ({ ...p, available: '' })); }}
          />
        </div>

      </form>
    </Modal>
  );
};

export default AddProductModal;
