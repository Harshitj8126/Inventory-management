/* ============================================================
   productsApi.js — Live Products API Service
   Target Endpoint: https://inventory-vendor-management-system.onrender.com/api/v1/products/
   ============================================================ */

export const PRODUCTS_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL ||
  'https://inventory-vendor-management-system.onrender.com/api/v1/products/';

/**
 * Helper function to map API payload fields to internal UI state schema
 */
export const normalizeProduct = (item) => {
  const avail = item.available_quantity ?? item.quantity ?? 25;
  const res = item.reserved_quantity ?? 4;
  const dmg = item.damaged_quantity ?? 1;
  const total = item.total_quantity ?? (avail + res + dmg);
  const reorder = item.reorder_level ?? 10;

  return {
    id: item.id,
    productName: item.name || item.productName || 'Unnamed Product',
    sku: item.sku || `SKU-${item.id}`,
    category: item.category_name || item.category || 'Electronics',
    warehouse: item.warehouse || 'Delhi Warehouse',
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
    const response = await fetch(PRODUCTS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      return result.data.map((item) => normalizeProduct(item));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch live products from API:', error);
    throw error;
  }
};

/**
 * Create a new product via the live API.
 */
export const createProduct = async (productPayload) => {
  try {
    const apiBody = {
      name: productPayload.productName || productPayload.name,
      sku: productPayload.sku,
      category_id: 1, // Default category ID for API
      reorder_level: parseInt(productPayload.reorderLevel || productPayload.reorder_level || 10, 10),
      status: true,
    };

    const response = await fetch(PRODUCTS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error! status: ${response.status}`);
    }

    const result = await response.json();
    const createdItem = result.data || result;
    return normalizeProduct({
      ...createdItem,
      warehouse: productPayload.warehouse || 'Delhi Warehouse',
      available_quantity: productPayload.availableQuantity ?? 25,
      reserved_quantity: productPayload.reservedQuantity ?? 4,
      damaged_quantity: productPayload.damagedQuantity ?? 1,
    });
  } catch (error) {
    console.error('Failed to create product via API:', error);
    throw error;
  }
};

/**
 * Update an existing product via the live API.
 */
export const updateProduct = async (id, productPayload) => {
  try {
    const url = `${PRODUCTS_API_URL.replace(/\/$/, '')}/${id}/`;
    const apiBody = {
      name: productPayload.productName || productPayload.name,
      sku: productPayload.sku,
      category_id: 1,
      reorder_level: parseInt(productPayload.reorderLevel || productPayload.reorder_level || 10, 10),
      status: true,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error! status: ${response.status}`);
    }

    const result = await response.json();
    return normalizeProduct(result.data || result);
  } catch (error) {
    console.error(`Failed to update product #${id} via API:`, error);
    throw error;
  }
};

/**
 * Delete a product via the live API.
 */
export const deleteProduct = async (id) => {
  try {
    const url = `${PRODUCTS_API_URL.replace(/\/$/, '')}/${id}/`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API delete error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete product #${id} via API:`, error);
    throw error;
  }
};
