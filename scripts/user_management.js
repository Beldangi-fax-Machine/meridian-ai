// User Management Functions for Meridian AI
// Handles user data operations with the users table

class UserManager {
    constructor(supabase) {
        this.supabase = supabase;
    }

    // Get current user from Supabase auth and fetch user data
    async getCurrentUser() {
        try {
            const { data: { user }, error: authError } = await this.supabase.auth.getUser();
            
            if (authError || !user) {
                throw new Error('User not authenticated');
            }

            // Fetch user data from our users table
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('*')
                .eq('auth_uuid', user.id)
                .single();

            if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw userError;
            }

            // If user doesn't exist in our table, create them
            if (!userData) {
                return await this.createUser(user);
            }

            return userData;
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }

    // Create a new user in our users table
    async createUser(authUser) {
        try {
            const userData = {
                auth_uuid: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
                username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
                avatar_url: authUser.user_metadata?.avatar_url,
                is_verified: authUser.email_confirmed_at ? true : false,
                last_login: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('users')
                .insert(userData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Update user information
    async updateUser(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Update user's last login time
    async updateLastLogin(authUuid) {
        try {
            const { error } = await this.supabase
                .from('users')
                .update({
                    last_login: new Date().toISOString()
                })
                .eq('auth_uuid', authUuid);

            if (error) {
                console.error('Error updating last login:', error);
            }
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    // Get user by username
    async getUserByUsername(username) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by username:', error);
            throw error;
        }
    }

    // Check if username is available
    async isUsernameAvailable(username) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            if (error && error.code === 'PGRST116') {
                return true; // Username is available
            }

            return false; // Username is taken
        } catch (error) {
            console.error('Error checking username availability:', error);
            return false;
        }
    }

    // Update user preferences
    async updatePreferences(userId, preferences) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    preferences: preferences,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select('preferences')
                .single();

            if (error) {
                throw error;
            }

            return data.preferences;
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }

    // Get user preferences
    async getPreferences(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('preferences')
                .eq('id', userId)
                .single();

            if (error) {
                throw error;
            }

            return data.preferences || {};
        } catch (error) {
            console.error('Error getting preferences:', error);
            return {};
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
} else {
    window.UserManager = UserManager;
} 