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
- **Current Phase:** Enterprise UI/UX Overhaul Complete (Login + Vision Pro Spatial Glass App Shell + Vision Pro Spatial Dashboard + Inventory Management Module).


- **Tech Stack:** React 18, Vite, React Router DOM v6, JavaScript (ES6+), Vanilla CSS (Design System Tokens, WebKit Resets, Modern SaaS Styling), Google Fonts (Inter). No backend/Django integration yet (uses persistent local storage & mock state).

---

## ✅ Completed Features & Modules

### 1. Enterprise Authentication Experience
- **Login Page (`src/pages/auth/Login.jsx` & `Login.css`)**:
  - High-end enterprise split-screen authentication container with left hero panel showcasing Codlix platform features (Real-Time Stock Analytics, Automated Reorder Alerts, Enterprise Security) and right card form.
  - Interactive pill tab switcher between **Sign In** and **Sign Up** modes.
  - Real-time password strength meter & requirement checklist (Sign Up mode).
  - Validation rules for full name, email format, password criteria, and matching confirm password.
  - Top error alert banner for invalid credentials.
  - Full local persistence via `localStorage` and `sessionStorage`.

### 2. Inventory Management Module (Inventory List Page)
- **Inventory List Page (`src/pages/inventory/InventoryList.jsx` & `Inventory.css`)**:
  - **Summary Stats Cards (KPIs)**: Total Products, Total Stock Units, Low Stock Alert Items, and Out of Stock Items with color-accented status icon badges, high-contrast typography, and hover lift effects.
  - **Filter & Search Panel**: Floating card with search bar (product name or SKU), warehouse selector, category selector, stock status selector, reset filters trigger, and live record count badge.
  - **Data Table (`src/components/tables/InventoryTable.jsx`)**: Sticky table head, hover row highlights, category tags, monospace SKU pill tags, warehouse icons, status badges, numeric alignments, and compact action button toolbar (View, In, Out, Transfer, Adjust, Delete).
  - **Interactive Modals (`src/components/modals/`)**: Full product view, stock in, stock out, warehouse transfer, quantity adjustment, add product form, and delete confirmation modal.
  - **CSV Export & Toast Notifications**: Export filtered view to downloadable `.csv` file and global auto-dismissing toast popups for every action.


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
