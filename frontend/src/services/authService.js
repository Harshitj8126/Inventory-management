import { supabase } from './supabaseClient';

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Set standard local storage values for backward compatibility with the app
    if (data.session) {
      localStorage.setItem('accessToken', data.session.access_token);
      localStorage.setItem('refreshToken', data.session.refresh_token);
      
      const user = {
        email: data.user.email,
        id: data.user.id,
      };
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } else {
      throw new Error("Login failed. No session established.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const clearAuthToken = async () => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Supabase signout error:", err);
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('refresh_token');
};

export const registerUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data.user };
  } catch (error) {
    throw new Error(error.message);
  }
};
