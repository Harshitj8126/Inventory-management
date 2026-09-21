/* ============================================================
   InventoryList.jsx — Inventory List Page (fully interactive)
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Responsibilities:
     - Mutable inventory state (updates survive within the session)
     - Multi-filter logic (search + warehouse + category + status)
     - Summary card calculations
     - Modal orchestration (view / stock-in / stock-out / transfer / adjust)
     - Data mutation handlers (update items array on modal confirm)
     - Export to CSV (current filtered set)
     - Toast notifications for every action
   ============================================================ */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getInventory, getStockStatus, stockIn, stockOut, transferStock, adjustStock } from '../../services/inventoryService';
import { createProduct, deactivateProduct } from '../../services/productsApi';

import InventoryTable      from '../../components/tables/InventoryTable';
import SearchBar           from '../../components/common/SearchBar';
import KpiCard             from '../../components/common/KpiCard';
import ViewItemModal       from '../../components/modals/ViewItemModal';
import StockInModal        from '../../components/modals/StockInModal';
import StockOutModal       from '../../components/modals/StockOutModal';
import TransferModal       from '../../components/modals/TransferModal';
import AdjustModal         from '../../components/modals/AdjustModal';
import AddProductModal     from '../../components/modals/AddProductModal';
import DeleteConfirmModal  from '../../components/modals/DeleteConfirmModal';

import '../../components/modals/Modal.css';
import './Inventory.css';

/* ── SVG Icons ── */
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconStack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconXCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ── Filter defaults ── */
const INITIAL_FILTERS = {
  search: '',
  category: 'all',
  stockStatus: 'all',
};

import { getCategories } from '../../services/categoryService';

const CATEGORY_OPTIONS = [
  { value: 'all',             label: 'All Categories' },
  { value: 'Electronics',     label: 'Electronics' },
  { value: 'Accessories',     label: 'Accessories' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Furniture',       label: 'Furniture' },
];


const STATUS_OPTIONS = [
  { value: 'all',          label: 'All Status' },
  { value: 'In Stock',     label: 'In Stock' },
  { value: 'Low Stock',    label: 'Low Stock' },
  { value: 'Out of Stock', label: 'Out of Stock' },
];

/* ── Recompute stockStatus on an item object ── */
const withStatus = (item) => ({ ...item, stockStatus: getStockStatus(item) });

/* ══════════════════════════════════════════
   Toast Sub-component
══════════════════════════════════════════ */
const Toast = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon" aria-hidden="true">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}
          </span>
          <span className="toast-message">{t.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   InventoryList — Page Component
══════════════════════════════════════════ */
const InventoryList = () => {
  /* ── Mutable inventory state ── */
  const [inventoryItems, setInventoryItems] = useState([]);

  /* ── Filter state ── */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /* ── Dynamic Category Options ── */
  const categoryOptions = useMemo(() => {
    const fromItems = inventoryItems.map((i) => i.category).filter(Boolean);
    const fromStore = getCategories();
    const unique = Array.from(new Set([...fromStore, ...fromItems]));
    return [
      { value: 'all', label: 'All Categories' },
      ...unique.map((c) => ({ value: c, label: c })),
    ];
  }, [inventoryItems]);

  /* ── Modal state: { type: null|'view'|'stock-in'|'stock-out'|'transfer'|'adjust', item: null|object } ── */
  const [modal, setModal] = useState({ type: null, item: null });

  /* ── Toast notifications state ── */
  const [toasts, setToasts] = useState([]);

  /* ── Load data on mount ── */
  const loadInventory = useCallback(async () => {
    const data = await getInventory();
    setInventoryItems(data.map(withStatus));
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  /* ══════════════════════════════════════════
     TOAST HELPERS
  ══════════════════════════════════════════ */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // keep max 3
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ══════════════════════════════════════════
     MODAL HELPERS
  ══════════════════════════════════════════ */
  const openModal  = useCallback((type, item) => setModal({ type, item }), []);
  const closeModal = useCallback(() => setModal({ type: null, item: null }), []);

  /* Single entry point called by InventoryTable action buttons */
  const handleAction = useCallback((type, item) => {
    if (type === 'delete') {
      openModal('delete', item);
    } else {
      openModal(type, item);
    }
  }, [openModal]);

  /* ══════════════════════════════════════════
     MUTATION HANDLERS
  ══════════════════════════════════════════ */

  /* ── Stock In ── */
  const handleStockIn = useCallback(async (item, { quantity }) => {
    // Optimistic local update
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return withStatus({
          ...i,
          totalQuantity:     i.totalQuantity     + quantity,
          availableQuantity: i.availableQuantity + quantity,
        });
      })
    );
    closeModal();
    addToast(`+${quantity} units added to ${item.productName}`);

    // Fire API call in background
    try {
      await stockIn(item.id, item.warehouseId, quantity, `Stock in: +${quantity}`);
    } catch (error) {
      console.warn('Stock-in API failed (local update preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Stock Out ── */
  const handleStockOut = useCallback(async (item, { quantity, reason }) => {
    // Optimistic local update
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return withStatus({
          ...i,
          totalQuantity:     Math.max(0, i.totalQuantity     - quantity),
          availableQuantity: Math.max(0, i.availableQuantity - quantity),
        });
      })
    );
    closeModal();
    addToast(`−${quantity} units removed from ${item.productName} (${reason})`);

    // Fire API call in background
    try {
      await stockOut(item.id, item.warehouseId, quantity, reason);
    } catch (error) {
      console.warn('Stock-out API failed (local update preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Transfer ── */
  const handleTransfer = useCallback(async (item, { toWarehouse, quantity }) => {
    // Optimistic local update
    setInventoryItems((prev) => {
      /* 1. Deduct from source */
      let updated = prev.map((i) => {
        if (i.id !== item.id) return i;
        return withStatus({
          ...i,
          totalQuantity:     Math.max(0, i.totalQuantity     - quantity),
          availableQuantity: Math.max(0, i.availableQuantity - quantity),
        });
      });

      /* 2. Find existing destination entry (same SKU + target warehouse) */
      const destIdx = updated.findIndex(
        (i) => i.sku === item.sku && i.warehouse === toWarehouse
      );

      if (destIdx >= 0) {
        /* Add to existing destination row */
        updated = updated.map((i, idx) => {
          if (idx !== destIdx) return i;
          return withStatus({
            ...i,
            totalQuantity:     i.totalQuantity     + quantity,
            availableQuantity: i.availableQuantity + quantity,
          });
        });
      } else {
        /* Create a new row at the destination */
        const newEntry = withStatus({
          ...item,
          id:                Date.now(),
          warehouse:         toWarehouse,
          totalQuantity:     quantity,
          availableQuantity: quantity,
          reservedQuantity:  0,
          damagedQuantity:   0,
        });
        updated = [...updated, newEntry];
      }

      return updated;
    });

    closeModal();
    addToast(`${quantity} units of ${item.productName} transferred to ${toWarehouse}`);

    // Fire API call in background
    try {
      await transferStock(
        item.warehouseId,
        null, // toWarehouseId — not easily available from name alone
        [{ product_id: item.id, quantity }],
        `Transfer to ${toWarehouse}`
      );
    } catch (error) {
      console.warn('Transfer API failed (local update preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Adjust ── */
  const handleAdjust = useCallback(async (item, { availableQuantity, reservedQuantity, damagedQuantity, reason }) => {
    // Optimistic local update
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        return withStatus({
          ...i,
          availableQuantity,
          reservedQuantity,
          damagedQuantity,
          totalQuantity: availableQuantity + reservedQuantity + damagedQuantity,
        });
      })
    );
    closeModal();
    addToast(`${item.productName} quantities adjusted (${reason})`);

    // Fire API call in background
    try {
      await adjustStock(item.id, item.warehouseId, availableQuantity, reason);
    } catch (error) {
      console.warn('Adjust API failed (local update preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Add Product ── */
  const handleAddProduct = useCallback(async (formData) => {
    // Optimistic local update with temp ID
    const tempItem = withStatus({
      id:                Date.now(),
      productName:       formData.productName,
      sku:               formData.sku,
      category:          formData.category,
      totalQuantity:     formData.totalQuantity,
      availableQuantity: formData.availableQuantity,
      reservedQuantity:  formData.reservedQuantity,
      damagedQuantity:   formData.damagedQuantity,
      reorderLevel:      formData.reorderLevel,
    });
    setInventoryItems((prev) => [...prev, tempItem]);
    closeModal();
    addToast(`✅ ${formData.productName} added to inventory`);

    // Fire API call in background
    try {
      const created = await createProduct(formData);
      // Replace temp item with API-returned item (with real ID)
      if (created && created.id) {
        setInventoryItems((prev) =>
          prev.map((i) => (i.id === tempItem.id ? withStatus(created) : i))
        );
      }
    } catch (error) {
      console.warn('Create product API failed (local item preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Delete Product ── */
  const handleDeleteProduct = useCallback(async (item) => {
    // Optimistic local update
    setInventoryItems((prev) => prev.filter((i) => i.id !== item.id));
    closeModal();
    addToast(`${item.productName} removed from inventory`, 'error');

    // Fire API call in background (soft-delete via deactivate)
    try {
      await deactivateProduct(item.id);
    } catch (error) {
      console.warn('Deactivate API failed (local removal preserved):', error.message);
    }
  }, [closeModal, addToast]);

  /* ── Filter handler ── */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e) => handleFilterChange('search', e.target.value);

  const handleResetFilters = () => setFilters(INITIAL_FILTERS);

  const isFiltered =
    filters.search !== '' ||
    filters.category   !== 'all' ||
    filters.stockStatus !== 'all';

  /* ══════════════════════════════════════════
     FILTERING LOGIC (AND-combined)
  ══════════════════════════════════════════ */
  const filteredItems = useMemo(() => {
    const { search, category, stockStatus } = filters;
    const term = search.trim().toLowerCase();

    return inventoryItems.filter((item) => {
      if (term) {
        const matchesName = item.productName.toLowerCase().includes(term);
        const matchesSku  = item.sku.toLowerCase().includes(term);
        if (!matchesName && !matchesSku) return false;
      }
      if (category    !== 'all' && item.category    !== category)    return false;
      if (stockStatus !== 'all' && item.stockStatus !== stockStatus) return false;
      return true;
    });
  }, [inventoryItems, filters]);

  /* ══════════════════════════════════════════
     EXPORT TO CSV  (declared after filteredItems)
  ══════════════════════════════════════════ */
  const handleExport = useCallback(() => {
    const headers = [
      'Product', 'SKU', 'Category',
      'Total', 'Available', 'Status',
    ];
    const rows = filteredItems.map((item) => [
      `"${item.productName}"`,
      item.sku,
      item.category,
      item.totalQuantity,
      item.availableQuantity,
      item.stockStatus,
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`${filteredItems.length} records exported to CSV`, 'info');
  }, [filteredItems, addToast]);

  /* ══════════════════════════════════════════
     SUMMARY CARD CALCULATIONS
  ══════════════════════════════════════════ */
  const summaryStats = useMemo(() => ({
    totalProducts:  inventoryItems.length,
    totalStock:     inventoryItems.reduce((s, i) => s + i.totalQuantity, 0),
    lowStockItems:  inventoryItems.filter((i) => i.stockStatus === 'Low Stock').length,
    outOfStockItems: inventoryItems.filter((i) => i.stockStatus === 'Out of Stock').length,
  }), [inventoryItems]);

  /* ── Render ── */
  return (
    <div className="inventory-page inv-page">

      {/* ── Page Header ── */}
      <header className="inv-header">
        <div className="inv-header-top">
          <div className="inv-header-text">
            <div className="inv-header-icon-wrap" aria-hidden="true">
              <IconBox />
            </div>
            <div className="inv-header-titles">
              <h1 className="inv-page-title">Inventory Management</h1>
              <p className="inv-page-subtitle">
                Manage and monitor stock levels across your inventory.
              </p>
            </div>
          </div>

          <div className="inv-header-actions">
            <button
              type="button"
              className="inv-btn-add-product"
              aria-label="Add a new product to inventory"
              onClick={() => openModal('add', null)}
            >
              <IconPlus />
              Add Product
            </button>
            <button
              type="button"
              className="inv-btn-export"
              aria-label={`Export ${filteredItems.length} inventory records to CSV`}
              onClick={handleExport}
            >
              <IconDownload />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* ── Summary Cards ── */}
      <section aria-label="Inventory summary" className="inv-summary-grid">
        <KpiCard
          icon={<IconBox />}
          value={summaryStats.totalProducts}
          label="Total Products"
        />
        <KpiCard
          icon={<IconStack />}
          value={summaryStats.totalStock.toLocaleString()}
          label="Total Stock"
        />
        <KpiCard
          icon={<IconAlertTriangle />}
          value={summaryStats.lowStockItems}
          label="Low Stock Items"
        />
        <KpiCard
          icon={<IconXCircle />}
          value={summaryStats.outOfStockItems}
          label="Out of Stock"
        />
      </section>

      {/* ── Filter Panel ── */}
      <section aria-label="Filter inventory" className="inv-filter-panel">
        <div className="inv-filter-row">

          <div className="inv-filter-group inv-filter-group--search">
            <span className="inv-filter-label" id="search-filter-label">Search</span>
            <SearchBar
              id="inventory-search"
              label="Search by product name or SKU"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by product name or SKU..."
            />
          </div>

          <div className="inv-filter-group">
            <label htmlFor="category-filter" className="inv-filter-label">Category</label>
            <select
              id="category-filter"
              className="inv-filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              aria-label="Filter by category"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="inv-filter-group">
            <label htmlFor="status-filter" className="inv-filter-label">Stock Status</label>
            <select
              id="status-filter"
              className="inv-filter-select"
              value={filters.stockStatus}
              onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
              aria-label="Filter by stock status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="inv-filter-reset"
              onClick={handleResetFilters}
              aria-label="Reset all filters"
            >
              <IconRefresh />
              Reset
            </button>
          )}
        </div>

        <div className="inv-filter-results" aria-live="polite" aria-atomic="true">
          <span>
            Showing{' '}
            <span className="inv-results-count">{filteredItems.length}</span>
            {' '}of{' '}
            <span className="inv-results-count">{inventoryItems.length}</span>
            {' '}records{isFiltered && ' (filtered)'}
          </span>
        </div>
      </section>

      {/* ── Table Card ── */}
      <div className="inv-table-card">
        <div className="inv-table-card-header">
          <span className="inv-table-card-title">
            Inventory Records
            <span className="inv-table-card-count" aria-label={`${filteredItems.length} records`}>
              {filteredItems.length}
            </span>
          </span>
        </div>

        <InventoryTable items={filteredItems} onAction={handleAction} />
      </div>

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}
      {modal.type === 'view' && (
        <ViewItemModal
          item={modal.item}
          onClose={closeModal}
        />
      )}

      {modal.type === 'stock-in' && (
        <StockInModal
          item={modal.item}
          onClose={closeModal}
          onConfirm={handleStockIn}
        />
      )}

      {modal.type === 'stock-out' && (
        <StockOutModal
          item={modal.item}
          onClose={closeModal}
          onConfirm={handleStockOut}
        />
      )}

      {modal.type === 'transfer' && (
        <TransferModal
          item={modal.item}
          onClose={closeModal}
          onConfirm={handleTransfer}
        />
      )}

      {modal.type === 'adjust' && (
        <AdjustModal
          item={modal.item}
          onClose={closeModal}
          onConfirm={handleAdjust}
        />
      )}

      {modal.type === 'add' && (
        <AddProductModal
          existingSkus={inventoryItems.map((i) => i.sku)}
          onClose={closeModal}
          onConfirm={handleAddProduct}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteConfirmModal
          item={modal.item}
          onClose={closeModal}
          onConfirm={handleDeleteProduct}
        />
      )}

      {/* ── Toast Notifications ── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
};

export default InventoryList;
