/* ============================================================
   inventoryService.js — Inventory Data & API Layer
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Currently uses mock data.
   Future: Replace getInventory() body with an Axios call to:
     GET /api/v1/inventory/
   ============================================================ */

/* ── Mock Inventory Data ── */
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

import { fetchProducts } from './productsApi';

/* ── Live API & Mock Integration ──
   Fetches live items from https://inventory-vendor-management-system.onrender.com/api/v1/products/
──────────────────────────────────────────────────────────── */
export const getInventory = async () => {
  try {
    const apiProducts = await fetchProducts();
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      // Merge live API products with baseline inventory items to present full product suite
      const apiSkus = new Set(apiProducts.map((p) => p.sku));
      const filteredMock = inventoryData.filter((m) => !apiSkus.has(m.sku));
      return [...apiProducts, ...filteredMock];
    }
  } catch (error) {
    console.warn('API fetch failed, falling back to local inventory data:', error);
  }
  return Promise.resolve(inventoryData);
};

/* ── Derive unique filter options from data ── */
export const getWarehouses = () => {
  const unique = [...new Set(inventoryData.map((item) => item.warehouse))];
  return unique.sort();
};

export const getCategories = () => {
  const unique = [...new Set(inventoryData.map((item) => item.category))];
  return unique.sort();
};
