/* ============================================================
   productsApi.js — Live Products API Service
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Integrates with:
     GET   /api/v1/products/              — List products
     POST  /api/v1/products/              — Create product
     GET   /api/v1/products/{id}/         — Get product detail
     PATCH /api/v1/products/{id}/         — Edit product
     PATCH /api/v1/products/{id}/deactivate/ — Soft-delete product
   ============================================================ */

import api from './apiClient';

/**
 * Helper function to map API payload fields to internal UI state schema
 */
export const normalizeProduct = (item) => {
  const avail = item.available_qty ?? item.available_quantity ?? item.quantity ?? 25;
  const res = item.reserved_qty ?? item.reserved_quantity ?? 4;
  const dmg = item.damaged_qty ?? item.damaged_quantity ?? 1;
  const total = item.total_qty ?? item.total_quantity ?? (avail + res + dmg);
  const reorder = item.reorder_level ?? 10;

  return {
    id: item.id,
    productName: item.name || item.productName || 'Unnamed Product',
    sku: item.sku || `SKU-${item.id}`,
    category: item.category_name || item.category || 'Electronics',
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

/**
 * Fetch products from the live backend API.
 * Returns array of normalized product items.
 */
export const fetchProducts = async () => {
  try {
    const result = await api.get('/products/');

    if (result && result.success && Array.isArray(result.data)) {
      return result.data.map((item) => normalizeProduct(item));
    }
    // Some API responses may have data directly as array
    if (Array.isArray(result.data)) {
      return result.data.map((item) => normalizeProduct(item));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch live products from API:', error);
    throw error;
  }
};

/**
 * Get a single product by ID.
 * GET /api/v1/products/{id}/
 */
export const fetchProductById = async (id) => {
  try {
    const result = await api.get(`/products/${id}/`);
    const item = result.data || result;
    return normalizeProduct(item);
  } catch (error) {
    console.error(`Failed to fetch product #${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product via the live API.
 * POST /api/v1/products/
 */
export const createProduct = async (productPayload) => {
  try {
    const apiBody = {
      name: productPayload.productName || productPayload.name,
      sku: productPayload.sku,
      category_id: productPayload.categoryId || productPayload.category_id || 1,
      warehouse_id: productPayload.warehouseId || productPayload.warehouse_id || 1,
      reorder_level: parseInt(productPayload.reorderLevel || productPayload.reorder_level || 10, 10),
      available_qty: parseInt(productPayload.availableQuantity || productPayload.available_qty || 0, 10),
      reserved_qty: parseInt(productPayload.reservedQuantity || productPayload.reserved_qty || 0, 10),
      damaged_qty: parseInt(productPayload.damagedQuantity || productPayload.damaged_qty || 0, 10),
      status: true,
    };

    const result = await api.post('/products/', apiBody);
    const createdItem = result.data || result;
    return normalizeProduct({
      ...createdItem,
      warehouse: productPayload.warehouse || 'Delhi Warehouse',
      available_qty: productPayload.availableQuantity ?? 0,
      reserved_qty: productPayload.reservedQuantity ?? 0,
      damaged_qty: productPayload.damagedQuantity ?? 0,
    });
  } catch (error) {
    console.error('Failed to create product via API:', error);
    throw error;
  }
};

/**
 * Update an existing product via the live API.
 * PATCH /api/v1/products/{id}/
 */
export const updateProduct = async (id, productPayload) => {
  try {
    const apiBody = {};
    
    // Only send fields that were provided
    if (productPayload.productName || productPayload.name) {
      apiBody.name = productPayload.productName || productPayload.name;
    }
    if (productPayload.categoryId || productPayload.category_id) {
      apiBody.category_id = productPayload.categoryId || productPayload.category_id;
    }
    if (productPayload.reorderLevel || productPayload.reorder_level) {
      apiBody.reorder_level = parseInt(productPayload.reorderLevel || productPayload.reorder_level, 10);
    }
    if (productPayload.status !== undefined) {
      apiBody.status = productPayload.status;
    }

    const result = await api.patch(`/products/${id}/`, apiBody);
    return normalizeProduct(result.data || result);
  } catch (error) {
    console.error(`Failed to update product #${id} via API:`, error);
    throw error;
  }
};

/**
 * Deactivate (soft-delete) a product via the live API.
 * PATCH /api/v1/products/{id}/deactivate/
 */
export const deactivateProduct = async (id) => {
  try {
    const result = await api.patch(`/products/${id}/deactivate/`);
    return result;
  } catch (error) {
    console.error(`Failed to deactivate product #${id} via API:`, error);
    throw error;
  }
};

/**
 * Delete a product — uses deactivate endpoint (soft-delete).
 * Kept for backward compatibility with existing code.
 */
export const deleteProduct = async (id) => {
  return deactivateProduct(id);
};
