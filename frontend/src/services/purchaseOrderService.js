/* ============================================================
   purchaseOrderService.js — Purchase Order & Request API Layer
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Integrates with:
     GET  /api/v1/purchase-orders/
     POST /api/v1/purchase-orders/
     POST /api/v1/purchase-orders/{id}/approve/
     POST /api/v1/purchase-requests/
     POST /api/v1/purchase-requests/{id}/approve/
   ============================================================ */

import api from './apiClient';

/**
 * Normalize a purchase order from API format to UI format.
 */
const normalizePO = (po) => ({
  id: po.id || po.po_number || `PO-${po.id}`,
  vendor: po.vendor_name || po.vendor || 'Unknown Vendor',
  vendorId: po.vendor_id || po.vendorId || '',
  date: po.order_date || po.date || po.created_at || '',
  deliveryDate: po.expected_date || po.delivery_date || po.deliveryDate || '',
  items: po.items_count || (Array.isArray(po.items) ? po.items.length : po.items) || 0,
  amount: po.total_amount || po.amount || po.grand_total || 0,
  status: po.status || 'Draft',
  warehouse: po.warehouse_name || po.warehouse || '',
  createdBy: po.created_by_name || po.created_by || po.createdBy || '',
});

/**
 * Fetch all purchase orders from the API.
 * Falls back to mock data on failure.
 */
export const fetchPurchaseOrders = async () => {
  try {
    const result = await api.get('/purchase-orders/');
    if (result.success && Array.isArray(result.data)) {
      return result.data.map(normalizePO);
    }
    return [];
  } catch (error) {
    console.warn('Failed to fetch purchase orders from API:', error);
    throw error;
  }
};

/**
 * Create a new purchase order.
 * 
 * @param {object} data — { vendor_id, warehouse_id, order_date, expected_date, terms, items: [...] }
 */
export const createPurchaseOrder = async (data) => {
  try {
    const result = await api.post('/purchase-orders/', {
      vendor_id: data.vendorId || data.vendor_id,
      warehouse_id: data.warehouseId || data.warehouse_id,
      order_date: data.orderDate || data.order_date || new Date().toISOString().slice(0, 10),
      expected_date: data.deliveryDate || data.expected_date || null,
      terms: data.terms || null,
      header_discount: data.discount || '0.00',
      header_tax: data.tax || '0.00',
      charges: data.charges || '0.00',
      items: data.items || [],
    });
    return result.data ? normalizePO(result.data) : result;
  } catch (error) {
    console.error('Failed to create purchase order:', error);
    throw error;
  }
};

/**
 * Approve a purchase order.
 * 
 * @param {number|string} id — Purchase order ID
 */
export const approvePurchaseOrder = async (id) => {
  try {
    const result = await api.post(`/purchase-orders/${id}/approve/`);
    return result;
  } catch (error) {
    console.error(`Failed to approve purchase order #${id}:`, error);
    throw error;
  }
};

/**
 * Create a purchase request.
 * 
 * @param {object} data — { required_date, reason, items: [...] }
 */
export const createPurchaseRequest = async (data) => {
  try {
    const result = await api.post('/purchase-requests/', {
      required_date: data.requiredDate || data.required_date || null,
      reason: data.reason || null,
      items: data.items || [],
    });
    return result;
  } catch (error) {
    console.error('Failed to create purchase request:', error);
    throw error;
  }
};

/**
 * Approve a purchase request.
 * 
 * @param {number|string} id — Request ID
 */
export const approvePurchaseRequest = async (id) => {
  try {
    const result = await api.post(`/purchase-requests/${id}/approve/`);
    return result;
  } catch (error) {
    console.error(`Failed to approve purchase request #${id}:`, error);
    throw error;
  }
};
