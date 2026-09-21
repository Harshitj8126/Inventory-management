/**
 * authService.js
 * 
 * This service handles all authentication-related API calls.
 * 
 * BACKEND INTEGRATION:
 * Login uses the live Django REST Framework backend at:
 *   POST /api/v1/auth/login/
 * 
 * Expected request body:
 *   { "email": "user@example.com", "password": "securepassword" }
 * 
 * Expected response:
 *   { "success": true, "message": "...", "data": { "access": "...", "refresh": "...", "user": {...} } }
 * 
 * Token refresh uses:
 *   POST /api/v1/auth/refresh/
 */

import api from './apiClient';

// Base API URL — reads from .env, falls back to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Local User Database Helper
 * Uses localStorage to store registered users so signup credentials persist locally.
 * Also acts as a fallback when the API is unreachable.
 */
const DEFAULT_DEMO_USER = {
  name: 'Demo Admin',
  email: 'admin@company.com',
  password: 'Password@123',
};

const getStoredUsers = () => {
  try {
    const data = localStorage.getItem('app_registered_users');
    if (!data) {
      const initialUsers = [DEFAULT_DEMO_USER];
      localStorage.setItem('app_registered_users', JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read stored users:', err);
    return [DEFAULT_DEMO_USER];
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem('app_registered_users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
};

/**
 * storeAuthToken - Stores the JWT access token for authenticated API calls.
 * @param {string} token - The access token from the backend
 */
const storeAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem('auth_token', token);
  }
};

/**
 * storeRefreshToken - Stores the JWT refresh token.
 * @param {string} token - The refresh token from the backend
 */
const storeRefreshToken = (token) => {
  if (token) {
    sessionStorage.setItem('refresh_token', token);
  }
};

/**
 * getAuthToken - Retrieves the stored access token.
 * @returns {string|null} The stored token or null
 */
export const getAuthToken = () => {
  return sessionStorage.getItem('auth_token');
};

/**
 * getRefreshToken - Retrieves the stored refresh token.
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return sessionStorage.getItem('refresh_token');
};

/**
 * clearAuthToken - Removes all stored auth tokens on logout.
 */
export const clearAuthToken = () => {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('refresh_token');
};

/**
 * refreshAccessToken - Refreshes the JWT access token using the refresh token.
 * Calls POST /api/v1/auth/refresh/
 * 
 * @returns {Promise<string>} - The new access token
 */
export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  try {
    const data = await api.post('/auth/refresh/', { refresh });
    const newAccess = data.data?.access || data.access || data.token || '';
    if (newAccess) {
      storeAuthToken(newAccess);
    }
    // If backend also rotates the refresh token
    const newRefresh = data.data?.refresh || data.refresh;
    if (newRefresh) {
      storeRefreshToken(newRefresh);
    }
    return newAccess;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthToken();
    throw error;
  }
};

/**
 * loginUser - Authenticates the user against the live backend API.
 * 
 * Flow:
 * 1. Calls POST /api/v1/auth/login/ with email & password
 * 2. On success: stores the JWT tokens and returns user data
 * 3. On API failure (network error): falls back to local credential check
 * 4. On wrong credentials: throws an error
 * 
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise} - Resolves with { success, user, token } on success
 */
export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  // ── Step 1: Try the live backend API ──
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok && (data.success || data.token || data.data?.access)) {
      // API login successful — store tokens and return user data
      const accessToken = data.data?.access || data.token || data.access || data.data?.token || '';
      const refreshToken = data.data?.refresh || data.refresh || '';
      
      storeAuthToken(accessToken);
      if (refreshToken) {
        storeRefreshToken(refreshToken);
      }

      const user = data.data?.user || data.user || {
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
      };

      // Ensure user name is populated
      if (!user.name) {
        user.name = normalizedEmail.split('@')[0];
        user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
      }

      // Also save to local users for session persistence
      const users = getStoredUsers();
      const existingIndex = users.findIndex(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (existingIndex === -1) {
        users.push({ name: user.name, email: normalizedEmail, password });
        saveUsers(users);
      }

      return {
        success: true,
        user: { name: user.name, email: user.email || normalizedEmail },
        token: accessToken,
      };
    }

    // API returned an error response (wrong credentials, etc.)
    const errorMessage =
      data.message ||
      data.error ||
      data.detail ||
      (data.errors && typeof data.errors === 'object'
        ? Object.values(data.errors).flat().join('. ')
        : null) ||
      'Invalid email or password. Please try again.';

    throw new Error(errorMessage);

  } catch (error) {
    // ── Step 2: If it's a network/fetch failure, fall back to local auth ──
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.warn('Backend API unreachable, falling back to local authentication:', error.message);
      return localLogin(normalizedEmail, password);
    }

    // Re-throw API-level errors (bad credentials, etc.)
    throw error;
  }
};

/**
 * localLogin - Fallback local authentication when the backend is unreachable.
 * @param {string} normalizedEmail - Lowercased, trimmed email
 * @param {string} password - The user's password
 * @returns {Promise} - Resolves with user data on success
 */
const localLogin = (normalizedEmail, password) => {
  const users = getStoredUsers();

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    if (existingUser.password === password) {
      return Promise.resolve({
        success: true,
        user: { name: existingUser.name, email: existingUser.email },
      });
    }
    throw new Error('Incorrect password. Please check your password and try again.');
  }

  // First time signing in with this email locally — register automatically
  const displayName = normalizedEmail.split('@')[0];
  const newUser = {
    name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
    email: normalizedEmail,
    password: password,
  };
  users.push(newUser);
  saveUsers(users);
  return Promise.resolve({
    success: true,
    user: { name: newUser.name, email: newUser.email },
  });
};


/**
 * registerUser - Registers a new user.
 * Currently uses local storage since the backend does not have a /auth/register/ endpoint.
 * When the backend adds signup support, this will be updated to call the API.
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} - Resolves with user data on success
 */
export const registerUser = async (name, email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const users = getStoredUsers();

  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  let targetUser;
  if (existingIndex !== -1) {
    // Update existing user profile with exact name & password from Sign Up form
    users[existingIndex].name = cleanName;
    users[existingIndex].password = password;
    targetUser = users[existingIndex];
  } else {
    // Create new user profile
    targetUser = {
      name: cleanName,
      email: normalizedEmail,
      password: password,
    };
    users.push(targetUser);
  }

  saveUsers(users);
  return { success: true, user: { name: targetUser.name, email: targetUser.email } };
};
