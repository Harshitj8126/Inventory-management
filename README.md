# Codlix Technologies — Inventory & Vendor Management System

A modern, high-performance enterprise Inventory and Vendor Management System built with **React.js 18**, **Vite**, and **Vanilla CSS**.

---

## 🛑 MANDATORY RULES FOR AI AGENTS & DEVELOPERS

> **BEFORE WORKING ON THIS REPOSITORY, YOU MUST FOLLOW THESE RULES:**
> 
> 1. **Read `README.md` and `PROJECT_STATUS.md` BEFORE making any code changes.**
> 2. **Understand what is already completed and DO NOT rebuild or refactor existing working features.**
> 3. **Continue ONLY from the current Next Task specified in `PROJECT_STATUS.md`.**
> 4. **Preserve the existing React.js folder structure, design token conventions, and coding style.**
> 5. **After finishing any task, update `PROJECT_STATUS.md` with your changes, files added/modified, routes, pending work, and the next task step.**

---

## ⚡ Quick Start

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the local development server
npm run dev
```

The application runs locally at `http://localhost:5173/`.

---

## 📦 Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router DOM v6
- **Language:** JavaScript (ES6+), JSX
- **Styling:** Modular Vanilla CSS with CSS Custom Properties (Design System tokens)
- **Icons:** SVG inline components
- **State Management:** React Context (`AuthContext.jsx`) & local state with mock services (`inventoryService.js`)

---

## 🚀 Completed Features & Application Flow

### 1. Authentication & System Navigation
- **Login Screen (`/login`)**: Full form validation, demo credential preset, mock auth authentication flow.
- **Main Layout (`MainLayout.jsx`)**: Header with search bar, notifications popup, profile menu, and Sidebar navigation supporting:
  - Dashboard (`/dashboard`)
  - Inventory (`/inventory`)
  - Vendors (`/vendors`)
  - Purchasing (`/purchasing`)
  - Receiving (`/receiving`)
  - Reports (`/reports`)
  - Administration (`/settings`)
- **Dashboard (`/dashboard`)**: Stat widgets, quick actions, stock status breakdown, recent stock activity log.

### 2. Inventory Management Module (Screen 1: Inventory List Page)
- **KPI Summary Cards**: Live counts for Total SKUs, In Stock, Low Stock, Out of Stock, and Total Stock Quantity.
- **Multi-Filter & Real-Time Search**: Search by Product Name/SKU, filter by Warehouse, Category, and Stock Status with filter reset counter.
- **Header Actions**:
  - `Add Product`: Modal form to create products with SKU validation.
  - `Export CSV`: Downloads formatted `.csv` dataset of currently filtered items.
- **Interactive Inventory Table**:
  - Columns: Product Name, SKU, Category, Warehouse, Total Qty, Available Qty, Reserved Qty, Damaged Qty, Reorder Level, Status Badge, Row Actions.
  - **Action Modals**:
    - **View**: Product breakdown & stock levels.
    - **Stock In**: Increase inventory with reference notes.
    - **Stock Out**: Issue stock with availability validation.
    - **Transfer**: Inter-warehouse inventory movement.
    - **Adjust**: Adjust stock with reason tracking (Audit, Damaged, Expiry, Return).
    - **Delete**: Confirmation modal to remove products.
- **Toast System**: Feedback popups on all actions.

---

## 📄 Documentation Files

- [`PROJECT_STATUS.md`](file:///Users/harshit/Desktop/inventory%20management/PROJECT_STATUS.md): **Start here!** Tracks exact progress, completed modules, file map, and next development tasks.
