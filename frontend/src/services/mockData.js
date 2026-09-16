/* ============================================================
   mockData.js — Shared Mock Data for All Modules
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

/* ══════════════════════════════════════════
   VENDORS
══════════════════════════════════════════ */
export const vendorsData = [
  { id: 'V001', name: 'TechSupply India Pvt. Ltd.',  category: 'Electronics',      contact: 'Raj Sharma',     email: 'raj@techsupply.in',     phone: '+91 98100 12345', city: 'Delhi',     rating: 4.8, status: 'Active',   totalOrders: 48, totalSpend: 1248000, lastOrder: '2026-09-10', paymentTerms: 'Net 30' },
  { id: 'V002', name: 'OfficeWare Solutions',         category: 'Office Supplies',  contact: 'Priya Mehta',    email: 'priya@officeware.com',  phone: '+91 87654 98765', city: 'Mumbai',    rating: 4.5, status: 'Active',   totalOrders: 32, totalSpend: 345000,  lastOrder: '2026-09-08', paymentTerms: 'Net 15' },
  { id: 'V003', name: 'Furniture World Co.',          category: 'Furniture',         contact: 'Amit Joshi',     email: 'amit@furnitureworld.in', phone: '+91 70001 23456', city: 'Bangalore', rating: 4.2, status: 'Active',   totalOrders: 21, totalSpend: 892000,  lastOrder: '2026-08-25', paymentTerms: 'Net 45' },
  { id: 'V004', name: 'AccessoryHub',                 category: 'Accessories',       contact: 'Sunita Rao',     email: 'sunita@accessoryhub.com',phone: '+91 99887 65432', city: 'Hyderabad', rating: 3.9, status: 'Active',   totalOrders: 67, totalSpend: 234000,  lastOrder: '2026-09-12', paymentTerms: 'Net 30' },
  { id: 'V005', name: 'PrintTech Supplies',           category: 'Electronics',       contact: 'Vikram Singh',   email: 'vikram@printtech.co.in', phone: '+91 88776 54321', city: 'Pune',      rating: 4.0, status: 'Inactive', totalOrders: 14, totalSpend: 178000,  lastOrder: '2026-07-15', paymentTerms: 'Net 30' },
  { id: 'V006', name: 'GlobalPaper Ltd.',             category: 'Office Supplies',   contact: 'Neha Gupta',     email: 'neha@globalpaper.com',   phone: '+91 76543 21098', city: 'Chennai',   rating: 4.6, status: 'Active',   totalOrders: 88, totalSpend: 567000,  lastOrder: '2026-09-14', paymentTerms: 'Net 7' },
  { id: 'V007', name: 'SmartTech Distributors',       category: 'Electronics',       contact: 'Rohit Kumar',    email: 'rohit@smarttech.in',     phone: '+91 91234 56789', city: 'Delhi',     rating: 4.7, status: 'Active',   totalOrders: 29, totalSpend: 2100000, lastOrder: '2026-09-11', paymentTerms: 'Net 30' },
  { id: 'V008', name: 'Comfort Seating Co.',          category: 'Furniture',         contact: 'Meena Patel',    email: 'meena@comfortseating.in',phone: '+91 82345 67890', city: 'Ahmedabad', rating: 3.7, status: 'Active',   totalOrders: 17, totalSpend: 432000,  lastOrder: '2026-08-30', paymentTerms: 'Net 45' },
];

/* ══════════════════════════════════════════
   PURCHASE ORDERS
══════════════════════════════════════════ */
export const purchaseOrdersData = [
  { id: 'PO-2026-001', vendor: 'TechSupply India Pvt. Ltd.', vendorId: 'V001', date: '2026-09-10', deliveryDate: '2026-09-20', items: 3, amount: 124500, status: 'Delivered',  warehouse: 'Delhi Warehouse',   createdBy: 'Harshit J.' },
  { id: 'PO-2026-002', vendor: 'OfficeWare Solutions',        vendorId: 'V002', date: '2026-09-08', deliveryDate: '2026-09-18', items: 5, amount:  34200, status: 'In Transit', warehouse: 'Mumbai Warehouse',  createdBy: 'Harshit J.' },
  { id: 'PO-2026-003', vendor: 'GlobalPaper Ltd.',            vendorId: 'V006', date: '2026-09-12', deliveryDate: '2026-09-16', items: 2, amount:  12800, status: 'Pending',    warehouse: 'Delhi Warehouse',   createdBy: 'Harshit J.' },
  { id: 'PO-2026-004', vendor: 'AccessoryHub',                vendorId: 'V004', date: '2026-09-05', deliveryDate: '2026-09-14', items: 4, amount:  18750, status: 'Delivered',  warehouse: 'Noida Warehouse',   createdBy: 'Harshit J.' },
  { id: 'PO-2026-005', vendor: 'SmartTech Distributors',      vendorId: 'V007', date: '2026-09-11', deliveryDate: '2026-09-22', items: 2, amount: 210000, status: 'Approved',   warehouse: 'Delhi Warehouse',   createdBy: 'Harshit J.' },
  { id: 'PO-2026-006', vendor: 'Furniture World Co.',         vendorId: 'V003', date: '2026-08-28', deliveryDate: '2026-09-10', items: 6, amount:  89000, status: 'Delivered',  warehouse: 'Mumbai Warehouse',  createdBy: 'Harshit J.' },
  { id: 'PO-2026-007', vendor: 'TechSupply India Pvt. Ltd.',  vendorId: 'V001', date: '2026-09-14', deliveryDate: '2026-09-25', items: 1, amount:  67000, status: 'Draft',      warehouse: 'Delhi Warehouse',   createdBy: 'Harshit J.' },
  { id: 'PO-2026-008', vendor: 'Comfort Seating Co.',         vendorId: 'V008', date: '2026-08-30', deliveryDate: '2026-09-12', items: 8, amount:  43200, status: 'Delivered',  warehouse: 'Noida Warehouse',   createdBy: 'Harshit J.' },
];

/* ══════════════════════════════════════════
   RECEIVING / GRN
══════════════════════════════════════════ */
export const receivingData = [
  { id: 'GRN-001', poId: 'PO-2026-001', vendor: 'TechSupply India Pvt. Ltd.', receivedDate: '2026-09-18', items: 3, received: 3, pending: 0, status: 'Complete',  warehouse: 'Delhi Warehouse',  receivedBy: 'Harshit J.', notes: 'All items in good condition.' },
  { id: 'GRN-002', poId: 'PO-2026-004', vendor: 'AccessoryHub',               receivedDate: '2026-09-13', items: 4, received: 4, pending: 0, status: 'Complete',  warehouse: 'Noida Warehouse',  receivedBy: 'Harshit J.', notes: 'Packaging was slightly damaged but items OK.' },
  { id: 'GRN-003', poId: 'PO-2026-006', vendor: 'Furniture World Co.',         receivedDate: '2026-09-09', items: 6, received: 5, pending: 1, status: 'Partial',   warehouse: 'Mumbai Warehouse', receivedBy: 'Harshit J.', notes: '1 chair backordered – expected next week.' },
  { id: 'GRN-004', poId: 'PO-2026-008', vendor: 'Comfort Seating Co.',         receivedDate: '2026-09-11', items: 8, received: 8, pending: 0, status: 'Complete',  warehouse: 'Noida Warehouse',  receivedBy: 'Harshit J.', notes: '' },
  { id: 'GRN-005', poId: 'PO-2026-002', vendor: 'OfficeWare Solutions',         receivedDate: null,         items: 5, received: 0, pending: 5, status: 'Pending',   warehouse: 'Mumbai Warehouse', receivedBy: '-',          notes: 'Shipment in transit.' },
  { id: 'GRN-006', poId: 'PO-2026-003', vendor: 'GlobalPaper Ltd.',             receivedDate: null,         items: 2, received: 0, pending: 2, status: 'Pending',   warehouse: 'Delhi Warehouse',  receivedBy: '-',          notes: 'Awaiting dispatch confirmation.' },
];

/* ══════════════════════════════════════════
   REPORTS — Monthly trend data
══════════════════════════════════════════ */
export const monthlyStockData = [
  { month: 'Apr', stockIn: 320, stockOut: 180, transfers: 40 },
  { month: 'May', stockIn: 410, stockOut: 230, transfers: 55 },
  { month: 'Jun', stockIn: 290, stockOut: 260, transfers: 30 },
  { month: 'Jul', stockIn: 520, stockOut: 310, transfers: 70 },
  { month: 'Aug', stockIn: 380, stockOut: 290, transfers: 45 },
  { month: 'Sep', stockIn: 215, stockOut: 120, transfers: 25 },
];

export const categorySpendData = [
  { category: 'Electronics',    spend: 3526000, color: '#3b82f6' },
  { category: 'Furniture',      spend: 1324000, color: '#8b5cf6' },
  { category: 'Office Supplies', spend:  912000, color: '#10b981' },
  { category: 'Accessories',    spend:  452000, color: '#f59e0b' },
];

export const topMovingItems = [
  { name: 'A4 Paper Ream',      sku: 'AP-008', movements: 88, trend: '+12%' },
  { name: 'Wireless Mouse',     sku: 'MS-002', movements: 67, trend: '+8%' },
  { name: 'USB-C Hub',          sku: 'UH-007', movements: 54, trend: '+22%' },
  { name: 'Laptop',             sku: 'LP-001', movements: 48, trend: '+5%' },
  { name: 'Office Chair',       sku: 'CH-004', movements: 38, trend: '-3%' },
];

/* ══════════════════════════════════════════
   ADMINISTRATION — Users
══════════════════════════════════════════ */
export const usersData = [
  { id: 'U001', name: 'Harshit Jain',   email: 'harshit@codlix.com',  role: 'Admin',   status: 'Active',   lastLogin: '2026-09-16', warehouses: ['Delhi', 'Noida', 'Mumbai'] },
  { id: 'U002', name: 'Priya Kapoor',   email: 'priya@codlix.com',    role: 'Manager', status: 'Active',   lastLogin: '2026-09-15', warehouses: ['Delhi', 'Noida'] },
  { id: 'U003', name: 'Arjun Singh',    email: 'arjun@codlix.com',    role: 'Staff',   status: 'Active',   lastLogin: '2026-09-14', warehouses: ['Mumbai'] },
  { id: 'U004', name: 'Sneha Reddy',    email: 'sneha@codlix.com',    role: 'Staff',   status: 'Inactive', lastLogin: '2026-08-20', warehouses: ['Noida'] },
  { id: 'U005', name: 'Rahul Verma',    email: 'rahul@codlix.com',    role: 'Viewer',  status: 'Active',   lastLogin: '2026-09-16', warehouses: ['Delhi'] },
];

export const warehousesData = [
  { id: 'WH001', name: 'Delhi Warehouse',  city: 'Delhi',     manager: 'Priya Kapoor', capacity: 5000, used: 3200, status: 'Active' },
  { id: 'WH002', name: 'Noida Warehouse',  city: 'Noida',     manager: 'Arjun Singh',  capacity: 3000, used: 1800, status: 'Active' },
  { id: 'WH003', name: 'Mumbai Warehouse', city: 'Mumbai',    manager: 'Sneha Reddy',  capacity: 4000, used: 2600, status: 'Active' },
];
