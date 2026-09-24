/* ============================================================
   productsApi.js — Supabase Products API Service
   ============================================================ */

import { supabase } from './supabaseClient';

export const normalizeProduct = (item) => {
  const avail = item.available_qty ?? item.available_quantity ?? item.quantity ?? 0;
  const res = item.reserved_qty ?? item.reserved_quantity ?? 0;
  const dmg = item.damaged_qty ?? item.damaged_quantity ?? 0;
  const total = item.total_qty ?? item.total_quantity ?? (avail + res + dmg);
  const reorder = item.reorder_level ?? 10;

  return {
    id: item.id,
    productName: item.name || item.productName || 'Unnamed Product',
    sku: item.sku || `SKU-${item.id}`,
    category: item.categories?.name || item.category_name || item.category || 'Uncategorized',
    warehouse: item.warehouses?.name || item.warehouse_name || item.warehouse || 'Main Warehouse',
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

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name),
        warehouses (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('Failed to fetch live products from Supabase:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name),
        warehouses (name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Failed to fetch product #${id}:`, error);
    throw error;
  }
};

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

    const { data, error } = await supabase
      .from('products')
      .insert([apiBody])
      .select(`
        *,
        categories (name),
        warehouses (name)
      `)
      .single();

    if (error) throw error;
    
    return normalizeProduct(data);
  } catch (error) {
    console.error('Failed to create product via Supabase:', error);
    throw error;
  }
};

export const updateProduct = async (id, productPayload) => {
  try {
    const apiBody = {};
    
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

    const { data, error } = await supabase
      .from('products')
      .update(apiBody)
      .eq('id', id)
      .select(`
        *,
        categories (name),
        warehouses (name)
      `)
      .single();

    if (error) throw error;
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Failed to update product #${id} via Supabase:`, error);
    throw error;
  }
};

export const deactivateProduct = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ status: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Failed to deactivate product #${id} via Supabase:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  return deactivateProduct(id);
};
