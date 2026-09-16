/* ============================================================
   categoryService.js — Dynamic Category Management Store
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

const DEFAULT_CATEGORIES = [
  'Electronics',
  'Accessories',
  'Office Supplies',
  'Furniture',
  'Stationery',
  'Networking',
  'Storage',
  'Textiles',
  'Packaging',
  'Logistics',
  'Apparel',
  'Raw Materials',
];

const STORAGE_KEY = 'codlix_inventory_categories';

/**
 * Get all current categories (from localStorage or default)
 */
export const getCategories = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
      }
    }
  } catch (e) {
    console.error('Failed to read categories from storage:', e);
  }
  return DEFAULT_CATEGORIES;
};

/**
 * Add a new custom category dynamically
 */
export const addCategory = (newCat) => {
  if (!newCat || typeof newCat !== 'string') return getCategories();
  const trimmed = newCat.trim();
  if (!trimmed) return getCategories();

  const current = getCategories();
  if (!current.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save category:', e);
    }
    return updated;
  }
  return current;
};
