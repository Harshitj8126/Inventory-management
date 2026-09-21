/* ============================================================
   inventoryService.js — Inventory Data & API Layer
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Integrates with the live backend API:
     GET  /api/v1/inventory/           — List inventory
     GET  /api/v1/inventory/transactions/  — List stock transactions
     POST /api/v1/inventory/transactions/  — Create stock-in / stock-out
     POST /api/v1/inventory/transfers/     — Transfer between warehouses
     POST /api/v1/inventory/adjustments/   — Adjust stock levels
   Falls back to mock data when API is unreachable.
   ============================================================ */

import api from './apiClient';
import { fetchProducts } from './productsApi';

/* ── Mock Inventory Data (fallback) ── */
export const inventoryData = [
  {
    id: 1,
    productName: 'Laptop',
    sku: 'LP-001',
    category: 'Electronics',
    warehouse: 'Delhi Warehouse',
    totalQuantity: 50,
    availableQuantity: 45,
    reservedQuantity: 4,
    damagedQuantity: 1,
    reorderLevel: 10,
  },
  {
    id: 2,
    productName: 'Wireless Mouse',
    sku: 'MS-002',
    category: 'Accessories',
    warehouse: 'Delhi Warehouse',
    totalQuantity: 12,
    availableQuantity: 8,
    reservedQuantity: 4,
    damagedQuantity: 0,
    reorderLevel: 10,
  },
  {
    id: 3,
    productName: 'Mechanical Keyboard',
    sku: 'KB-003',
    category: 'Accessories',
    warehouse: 'Noida Warehouse',
    totalQuantity: 0,
    availableQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 0,
    reorderLevel: 5,
  },
  {
    id: 4,
    productName: 'Office Chair',
    sku: 'CH-004',
    category: 'Furniture',
    warehouse: 'Mumbai Warehouse',
    totalQuantity: 30,
    availableQuantity: 25,
    reservedQuantity: 3,
    damagedQuantity: 2,
    reorderLevel: 8,
  },
  {
    id: 5,
    productName: 'Printer',
    sku: 'PR-005',
    category: 'Electronics',
    warehouse: 'Delhi Warehouse',
    totalQuantity: 14,
    availableQuantity: 6,
    reservedQuantity: 6,
    damagedQuantity: 2,
    reorderLevel: 8,
  },
  {
    id: 6,
    productName: 'Standing Desk',
    sku: 'SD-006',
    category: 'Furniture',
    warehouse: 'Noida Warehouse',
    totalQuantity: 20,
    availableQuantity: 18,
    reservedQuantity: 2,
    damagedQuantity: 0,
    reorderLevel: 5,
  },
  {
    id: 7,
    productName: 'USB-C Hub',
    sku: 'UH-007',
    category: 'Accessories',
    warehouse: 'Mumbai Warehouse',
    totalQuantity: 35,
    availableQuantity: 30,
    reservedQuantity: 5,
    damagedQuantity: 0,
    reorderLevel: 10,
  },
  {
    id: 8,
    productName: 'A4 Paper Ream',
    sku: 'AP-008',
    category: 'Office Supplies',
    warehouse: 'Delhi Warehouse',
    totalQuantity: 200,
    availableQuantity: 180,
    reservedQuantity: 15,
    damagedQuantity: 5,
    reorderLevel: 50,
  },
  {
    id: 9,
    productName: 'Stapler',
    sku: 'ST-009',
    category: 'Office Supplies',
    warehouse: 'Noida Warehouse',
    totalQuantity: 4,
    availableQuantity: 3,
    reservedQuantity: 1,
    damagedQuantity: 0,
    reorderLevel: 5,
  },
  {
    id: 10,
    productName: 'Monitor 27"',
    sku: 'MN-010',
    category: 'Electronics',
    warehouse: 'Mumbai Warehouse',
    totalQuantity: 0,
    availableQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 0,
    reorderLevel: 3,
  },
];

/* ── Stock Status Calculator ──
   Rules:
     Out of Stock : availableQuantity === 0
     Low Stock    : availableQuantity > 0 AND availableQuantity <= reorderLevel
     In Stock     : availableQuantity > reorderLevel
──────────────────────────────── */
export const getStockStatus = (item) => {
  const { availableQuantity, reorderLevel } = item;

  if (availableQuantity === 0) {
    return 'Out of Stock';
  }
  if (availableQuantity > 0 && availableQuantity <= reorderLevel) {
    return 'Low Stock';
  }
  return 'In Stock';
};

/**
 * Normalize an inventory item from the API format to the UI format.
 */
const normalizeInventoryItem = (item) => {
  const avail = item.available_qty ?? item.available_quantity ?? item.availableQuantity ?? 0;
  const res = item.reserved_qty ?? item.reserved_quantity ?? item.reservedQuantity ?? 0;
  const dmg = item.damaged_qty ?? item.damaged_quantity ?? item.damagedQuantity ?? 0;
  const total = item.total_qty ?? item.total_quantity ?? item.totalQuantity ?? (avail + res + dmg);
  const reorder = item.reorder_level ?? item.reorderLevel ?? 10;

  return {
    id: item.id || item.product_id,
    productName: item.product_name || item.name || item.productName || 'Unnamed Product',
    sku: item.sku || `SKU-${item.id}`,
    category: item.category_name || item.category || 'Uncategorized',
    warehouse: item.warehouse_name || item.warehouse || 'Delhi Warehouse',
    warehouseId: item.warehouse_id || item.warehouseId || null,
    totalQuantity: total,
    availableQuantity: avail,
    reservedQuantity: res,
    damagedQuantity: dmg,
    reorderLevel: reorder,
    status: item.status !== undefined ? item.status : true,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  };
};

/* ── Live API & Mock Integration ──
   Fetches live items from the inventory endpoint first,
   falls back to products endpoint, then to mock data.
──────────────────────────────────────────────────────────── */
export const getInventory = async () => {
  // ── Try inventory endpoint first ──
  try {
    const result = await api.get('/inventory/');
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return result.data.map(normalizeInventoryItem);
    }
  } catch (error) {
    console.warn('Inventory API failed, trying products API:', error.message);
  }

  // ── Fallback: Try products endpoint ──
  try {
    const apiProducts = await fetchProducts();
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      // Merge live API products with baseline inventory items to present full product suite
      const apiSkus = new Set(apiProducts.map((p) => p.sku));
      const filteredMock = inventoryData.filter((m) => !apiSkus.has(m.sku));
      return [...apiProducts, ...filteredMock];
    }
  } catch (error) {
    console.warn('Products API also failed, falling back to local inventory data:', error.message);
  }

  return Promise.resolve(inventoryData);
};

/* ══════════════════════════════════════════
   STOCK TRANSACTIONS (Stock In / Stock Out)
══════════════════════════════════════════ */

/**
 * Create a stock-in transaction.
 * POST /api/v1/inventory/transactions/
 * 
 * @param {number} productId
 * @param {number} warehouseId
 * @param {number} quantity
 * @param {string} reason — optional
 */
export const stockIn = async (productId, warehouseId, quantity, reason = '') => {
  try {
    const result = await api.post('/inventory/transactions/', {
      product_id: productId,
      warehouse_id: warehouseId || 1,
      type: 'STOCK_IN',
      quantity: quantity,
      reason: reason || null,
    });
    return result;
  } catch (error) {
    console.error('Stock-in API call failed:', error);
    throw error;
  }
};

/**
 * Create a stock-out transaction.
 * POST /api/v1/inventory/transactions/
 * 
 * @param {number} productId
 * @param {number} warehouseId
 * @param {number} quantity
 * @param {string} reason — optional
 */
export const stockOut = async (productId, warehouseId, quantity, reason = '') => {
  try {
    const result = await api.post('/inventory/transactions/', {
      product_id: productId,
      warehouse_id: warehouseId || 1,
      type: 'STOCK_OUT',
      quantity: quantity,
      reason: reason || null,
    });
    return result;
  } catch (error) {
    console.error('Stock-out API call failed:', error);
    throw error;
  }
};

/**
 * Fetch stock transaction history.
 * GET /api/v1/inventory/transactions/
 */
export const getTransactions = async () => {
  try {
    const result = await api.get('/inventory/transactions/');
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.warn('Failed to fetch transactions:', error);
    return [];
  }
};

/* ══════════════════════════════════════════
   STOCK TRANSFERS
══════════════════════════════════════════ */

/**
 * Transfer stock between warehouses.
 * POST /api/v1/inventory/transfers/
 * 
 * @param {number} fromWarehouseId
 * @param {number} toWarehouseId
 * @param {Array}  items — [{ product_id, quantity }]
 * @param {string} reason — optional
 */
export const transferStock = async (fromWarehouseId, toWarehouseId, items, reason = '') => {
  try {
    const result = await api.post('/inventory/transfers/', {
      from_warehouse_id: fromWarehouseId || 1,
      to_warehouse_id: toWarehouseId || 2,
      items: items,
      reason: reason || null,
    });
    return result;
  } catch (error) {
    console.error('Transfer API call failed:', error);
    throw error;
  }
};

/* ══════════════════════════════════════════
   STOCK ADJUSTMENTS
══════════════════════════════════════════ */

/**
 * Adjust stock levels for a product.
 * POST /api/v1/inventory/adjustments/
 * 
 * @param {number} productId
 * @param {number} warehouseId
 * @param {number} newQuantity
 * @param {string} reason — required by API
 */
export const adjustStock = async (productId, warehouseId, newQuantity, reason) => {
  try {
    const result = await api.post('/inventory/adjustments/', {
      product_id: productId,
      warehouse_id: warehouseId || 1,
      new_quantity: newQuantity,
      reason: reason,
    });
    return result;
  } catch (error) {
    console.error('Adjust API call failed:', error);
    throw error;
  }
};

/* ── Derive unique filter options from data ── */
export const getWarehouses = () => {
  const unique = [...new Set(inventoryData.map((item) => item.warehouse))];
  return unique.sort();
};

import { getCategories } from './categoryService';
export { getCategories };
