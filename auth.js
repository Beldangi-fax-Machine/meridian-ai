// Meridian AI - Authentication Utilities

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication utilities
export class AuthManager {
    // Check if user is logged in
    static isLoggedIn() {
        const user = localStorage.getItem('meridian_user');
        return user !== null;
    }

    // Get current user
    static getCurrentUser() {
        const user = localStorage.getItem('meridian_user');
        return user ? JSON.parse(user) : null;
    }

    // Sign out user
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear local storage
            localStorage.removeItem('meridian_user');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Check authentication status on page load
    static async checkAuth() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session) {
                // User is authenticated, store in localStorage
                localStorage.setItem('meridian_user', JSON.stringify(session.user));
                return session.user;
            } else {
                // No active session, clear localStorage
                localStorage.removeItem('meridian_user');
                return null;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            return null;
        }
    }

    // Listen for auth state changes
    static onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                localStorage.setItem('meridian_user', JSON.stringify(session.user));
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('meridian_user');
            }
            
            if (callback) callback(event, session);
        });
    }
}

// Auto-check auth on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.checkAuth();
}); 