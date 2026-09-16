/**
 * authService.js
 * 
 * This service handles all authentication-related API calls.
 * 
 * BACKEND INTEGRATION POINT:
 * When the Django REST Framework backend is ready, replace the
 * placeholder below with the actual API call.
 * 
 * Expected endpoint:
 *   POST /api/v1/auth/login/
 * 
 * Expected request body:
 *   { "email": "user@example.com", "password": "securepassword" }
 * 
 * Expected response:
 *   { "token": "jwt_token_here", "user": { ... } }
 */

// Base API URL — update this when the Django backend is running
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Local User Database Helper
 * Uses localStorage to store registered users so signup & login credentials persist locally.
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
 * loginUser - Authenticates the user with credential verification.
 * If email exists, verifies password. If new email, registers and logs in seamlessly.
 * 
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise} - Resolves with user data on success, rejects on incorrect password
 */
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getStoredUsers();
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        if (existingUser.password === password) {
          resolve({ success: true, user: { name: existingUser.name, email: existingUser.email } });
        } else {
          reject(new Error('Incorrect password. Please check your password and try again.'));
        }
      } else {
        // First time signing in with this email — register user automatically
        const displayName = normalizedEmail.split('@')[0];
        const newUser = {
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          email: normalizedEmail,
          password: password,
        };
        users.push(newUser);
        saveUsers(users);
        resolve({ success: true, user: { name: newUser.name, email: newUser.email } });
      }
    }, 600);
  });
};


/**
 * registerUser - Registers a new user or updates existing profile with the name entered during Sign Up.
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} - Resolves with user data on success
 */
export const registerUser = async (name, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getStoredUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

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
      resolve({ success: true, user: { name: targetUser.name, email: targetUser.email } });
    }, 600);
  });
};



