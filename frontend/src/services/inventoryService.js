/* ============================================================
   inventoryService.js — Supabase Inventory Data & API Layer
   ============================================================ */

import { supabase } from './supabaseClient';
import { fetchProducts } from './productsApi';

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
 * Fetch inventory directly using productsApi since products and inventory
 * share the same basic schema in this simplified Supabase setup.
 */
export const getInventory = async () => {
  return fetchProducts();
};

export const stockIn = async (productId, warehouseId, quantity, reason = '') => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('available_qty, total_quantity')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const newAvail = (product.available_qty || 0) + quantity;
    const newTotal = (product.total_quantity || 0) + quantity;

    const { error: updateError } = await supabase
      .from('products')
      .update({ available_qty: newAvail, total_quantity: newTotal })
      .eq('id', productId);

    if (updateError) throw updateError;

    const { data: transaction, error: insertError } = await supabase
      .from('inventory_transactions')
      .insert([{
        product_id: productId,
        warehouse_id: warehouseId || 1,
        type: 'STOCK_IN',
        quantity: quantity,
        reason: reason || null,
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return { success: true, data: transaction };
  } catch (error) {
    console.error('Stock-in Supabase call failed:', error);
    throw error;
  }
};

export const stockOut = async (productId, warehouseId, quantity, reason = '') => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('available_qty, total_quantity')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const newAvail = (product.available_qty || 0) - quantity;
    const newTotal = (product.total_quantity || 0) - quantity;

    const { error: updateError } = await supabase
      .from('products')
      .update({ available_qty: newAvail, total_quantity: newTotal })
      .eq('id', productId);

    if (updateError) throw updateError;

    const { data: transaction, error: insertError } = await supabase
      .from('inventory_transactions')
      .insert([{
        product_id: productId,
        warehouse_id: warehouseId || 1,
        type: 'STOCK_OUT',
        quantity: quantity,
        reason: reason || null,
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return { success: true, data: transaction };
  } catch (error) {
    console.error('Stock-out Supabase call failed:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select(`
        *,
        products (name, sku),
        warehouses (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Failed to fetch transactions from Supabase:', error);
    return [];
  }
};

export const transferStock = async (fromWarehouseId, toWarehouseId, items, reason = '') => {
  console.warn("Stock Transfer not fully implemented in direct Supabase version.");
  return { success: true };
};

export const adjustStock = async (productId, warehouseId, newQuantity, reason) => {
  try {
    const { error: updateError } = await supabase
      .from('products')
      .update({ available_qty: newQuantity })
      .eq('id', productId);

    if (updateError) throw updateError;

    const { data: transaction, error: insertError } = await supabase
      .from('inventory_transactions')
      .insert([{
        product_id: productId,
        warehouse_id: warehouseId || 1,
        type: 'ADJUST',
        quantity: newQuantity,
        reason: reason || null,
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return { success: true, data: transaction };
  } catch (error) {
    console.error('Adjust Supabase call failed:', error);
    throw error;
  }
};

export const getWarehouses = async () => {
  const { data } = await supabase.from('warehouses').select('name');
  return data ? data.map(w => w.name).sort() : [];
};

import { getCategories } from './categoryService';
export { getCategories };
