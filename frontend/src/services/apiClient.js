/* ============================================================
   apiClient.js — Centralized API Client with JWT Auth
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   All API calls go through this client. It:
     - Reads the base URL from VITE_API_BASE_URL
     - Attaches JWT Bearer token from sessionStorage
     - Handles JSON serialization/deserialization
     - Provides get/post/patch/delete helpers
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://inventory-vendor-management-system.onrender.com/api/v1';

/**
 * Get the stored JWT access token.
 */
const getToken = () => sessionStorage.getItem('auth_token');

/**
 * Build headers for API requests.
 * Always sets Accept and Content-Type to JSON.
 * Attaches Authorization header if a token is available.
 */
const buildHeaders = (extraHeaders = {}) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Core fetch wrapper.
 * Handles JSON parsing and error extraction.
 *
 * @param {string} endpoint — relative path like '/products/' (leading slash required)
 * @param {object} options  — { method, body, headers }
 * @returns {Promise<object>} — parsed JSON response
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: options.method || 'GET',
    headers: buildHeaders(options.headers),
  };

  if (options.body !== undefined) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  /* ── Handle no-content responses (e.g. 204 on delete) ── */
  if (response.status === 204) {
    return { success: true };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data.message ||
      data.detail ||
      data.error ||
      (data.errors && typeof data.errors === 'object'
        ? Object.values(data.errors).flat().join('. ')
        : null) ||
      `API error: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

/* ══════════════════════════════════════════
   Convenience Methods
══════════════════════════════════════════ */

const api = {
  /**
   * GET request
   * @param {string} endpoint — e.g. '/products/'
   */
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  /**
   * POST request
   * @param {string} endpoint
   * @param {object} body — will be JSON-stringified
   */
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),

  /**
   * PATCH request
   * @param {string} endpoint
   * @param {object} body
   */
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),

  /**
   * PUT request
   * @param {string} endpoint
   * @param {object} body
   */
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),

  /**
   * DELETE request
   * @param {string} endpoint
   */
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
