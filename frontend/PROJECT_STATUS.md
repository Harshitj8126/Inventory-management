# Project Status & AGENT INSTRUCTIONS

> ⚠️ **CRITICAL INSTRUCTIONS FOR AI AGENTS & DEVELOPERS**
> 1. **Read `README.md` and `PROJECT_STATUS.md` BEFORE making any code changes.**
> 2. **Understand what is already completed and DO NOT rebuild existing features.**
> 3. **Continue ONLY from the current Next Task specified in this file.**
> 4. **Preserve the existing React.js folder structure and coding style (Vanilla CSS, mock services, modular modals, toast notifications).**
> 5. **After finishing any task, update `PROJECT_STATUS.md` with changes, files, routes, pending work, and the next step.**

---

## 📌 Current Project State
- **Project Name:** Codlix Technologies Inventory & Vendor Management System
- **Current Phase:** Phase 1 Complete (Login + Navigation Shell + Dashboard + Inventory List Module with full interactive CRUD modals).
- **Tech Stack:** React 18, Vite, React Router DOM v6, JavaScript (ES6+), Vanilla CSS (Design Tokens, Dark-ready Theme), Google Fonts (Inter). No TypeScript, No backend/Django integration yet (uses local mock state in `inventoryService.js`).

---

## ✅ Completed Features & Modules

### 1. Authentication & Shell Layout
- **Login Page (`src/pages/auth/Login.jsx`)**: Responsive login form with email/password validation and mock auth integration.
- **Auth Context (`src/context/AuthContext.jsx`)**: Context provider managing user authentication state, login, and logout.
- **Main Layout (`src/layouts/MainLayout.jsx`)**: Responsive layout shell containing Sidebar, Top Header, breadcrumb tracking, search bar, notifications, and main content area.
- **Sidebar (`src/layouts/Sidebar.jsx`)**: Navigation supporting routes:
  - `/dashboard` (Dashboard Overview)
  - `/inventory` (Inventory List)
  - `/vendors` (Vendor Management)
  - `/purchasing` (Purchase Orders)
  - `/receiving` (Receiving Orders)
  - `/reports` (Reports & Analytics)
  - `/settings` (Administration / Settings)
- **Dashboard (`src/pages/dashboard/Dashboard.jsx`)**: Overview page displaying KPI stat cards, stock alerts summary, recent stock activity, and quick navigation actions.

### 2. Inventory Management Module (Screen 1: Inventory List Page)
- **Inventory List Page (`src/pages/inventory/InventoryList.jsx`)**:
  - **Summary Stats Bar**: Total SKUs, In Stock items count, Low Stock warning count, Out of Stock alert count, Total Items Quantity.
  - **Multi-Filter & Search Bar**: Real-time search across product name and SKU, warehouse selector, category selector, stock status selector, and reset filters button with dynamic count badge.
  - **Add Product Button**: Header action opening `AddProductModal.jsx` to create new inventory items with instant state update and toast notification.
  - **Export CSV Button**: Header action generating downloadable `.csv` file (`inventory-YYYY-MM-DD.csv`) containing current filtered inventory view.
- **Inventory Table (`src/components/tables/InventoryTable.jsx`)**:
  - Displays Product Name, SKU, Category, Warehouse, Total Qty, Available Qty, Reserved Qty, Damaged Qty, Reorder Level, Status Badge (`In Stock`, `Low Stock`, `Out of Stock`), and Row Action Buttons.
  - Empty state with reset filters button when search returns 0 results.
- **Interactive Modals (`src/components/modals/`)**:
  - `ViewItemModal.jsx`: Full product overview, status breakdown, warehouse placement, reorder alert indicators.
  - `StockInModal.jsx`: Stock receiving modal (increases total & available quantity, updates status badge).
  - `StockOutModal.jsx`: Stock dispatch modal (validates stock availability, decreases stock, updates status badge).
  - `TransferModal.jsx`: Warehouse transfer modal (moves stock between warehouses with validation).
  - `AdjustModal.jsx`: Stock adjustment modal (adjusts available/reserved/damaged quantities with reason code tracking: Audit, Damaged, Return, Expiry).
  - `AddProductModal.jsx`: Modal form for adding new products (includes SKU uniqueness check and automatic status calculation).
  - `DeleteConfirmModal.jsx`: Delete confirmation modal with product preview and warning banner.
- **Toast Notification System (`src/components/common/Toast.jsx`)**: Global auto-dismissing toast popups for all user actions (Stock In/Out, Transfer, Adjust, Add, Delete, Export).

---

## 📁 File Structure Reference
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── SearchBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── forms/
│   │   ├── tables/
│   │   │   └── InventoryTable.jsx
│   │   ├── modals/
│   │   │   ├── Modal.jsx
│   │   │   ├── Modal.css
│   │   │   ├── ViewItemModal.jsx
│   │   │   ├── StockInModal.jsx
│   │   │   ├── StockOutModal.jsx
│   │   │   ├── TransferModal.jsx
│   │   │   ├── AdjustModal.jsx
│   │   │   ├── AddProductModal.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   └── charts/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   └── inventory/
│   │       ├── InventoryList.jsx
│   │       └── Inventory.css
│   └── services/
│       └── inventoryService.js
├── package.json
└── vite.config.js
```

---

## ⏳ Pending Work & Module Roadmap

- [x] **Phase 1: Shell & Inventory List Page (COMPLETED)**
- [ ] **Phase 2: Vendors Management Module (`/vendors`)**
  - Vendor List, Add/Edit Vendor Modal, Vendor Performance & Contact Details.
- [ ] **Phase 3: Purchasing / Purchase Orders Module (`/purchasing`)**
  - Create PO, PO Approval Workflow, PO Status Tracking (Draft, Submitted, Approved, Received).
- [ ] **Phase 4: Goods Receiving Module (`/receiving`)**
  - Receive against PO, Partial Goods Receipt, Inspection & Quality Check.
- [ ] **Phase 5: Stock Counts & Physical Inventory Audits**
  - Stock Count Worksheet, Variance Reporting, Cycle Count Approval.
- [ ] **Phase 6: Reports & Analytics (`/reports`)**
  - Stock Valuation Report, Fast/Slow Moving Items, Reorder Alert Report, Export Capabilities.
- [ ] **Phase 7: Administration & User Roles (`/settings`)**
  - User Management, Role Permissions, Warehouse Setup.

---

## 🎯 NEXT TASK FOR AGENT
> **Task Name:** Phase 2 — Vendor Management Module (`/vendors`)
>
> **Task Details:**
> 1. Create `/src/pages/vendors/VendorList.jsx` and `/src/pages/vendors/Vendors.css`.
> 2. Create mock vendor service in `/src/services/vendorService.js`.
> 3. Implement Vendor Table displaying Vendor Name, Code, Contact Person, Email, Phone, Payment Terms, Status (Active/Inactive), and Actions (View, Edit, Delete).
> 4. Build Add/Edit Vendor modal form.
> 5. Wire route in `App.jsx` to `/vendors`.
>
> **REMINDER FOR AGENT:** When completing this task, update this `PROJECT_STATUS.md` file with the changes made, files modified/added, routes created, pending work, and update the Next Task section.
