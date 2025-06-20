// User Management Functions for Meridian AI
// Handles user data operations with the user_profiles table

class UserManager {
    constructor(supabase) {
        this.supabase = supabase;
    }

    // Get current user from Supabase auth and fetch user profile data
    async getCurrentUser() {
        try {
            const { data: { user }, error: authError } = await this.supabase.auth.getUser();
            
            if (authError || !user) {
                throw new Error('User not authenticated');
            }

            // Fetch user profile data from our user_profiles table
            const { data: userProfile, error: profileError } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('auth_uuid', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw profileError;
            }

            // If user profile doesn't exist, create it
            if (!userProfile) {
                return await this.createUserProfile(user);
            }

            // Combine auth user data with profile data
            return {
                ...userProfile,
                id: userProfile.auth_uuid, // For compatibility
                user_metadata: user.user_metadata,
                email_confirmed_at: user.email_confirmed_at,
                last_sign_in_at: user.last_sign_in_at
            };

        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }

    // Create a new user profile in our user_profiles table
    async createUserProfile(authUser) {
        try {
            const profileData = {
                auth_uuid: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
                username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
                avatar_url: authUser.user_metadata?.avatar_url,
                is_verified: authUser.email_confirmed_at ? true : false,
                last_login: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert(profileData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                ...data,
                id: data.auth_uuid, // For compatibility
                user_metadata: authUser.user_metadata,
                email_confirmed_at: authUser.email_confirmed_at,
                last_sign_in_at: authUser.last_sign_in_at
            };

        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    // Update user profile information
    async updateUserProfile(authUuid, updates) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_uuid', authUuid)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Update user's last login time
    async updateLastLogin(authUuid) {
        try {
            const { error } = await this.supabase
                .from('user_profiles')
                .update({
                    last_login: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('auth_uuid', authUuid);

            if (error) {
                console.error('Error updating last login:', error);
            }
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    // Get user profile by email
    async getUserProfileByEmail(email) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user profile by email:', error);
            throw error;
        }
    }

    // Get user profile by username
    async getUserProfileByUsername(username) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user profile by username:', error);
            throw error;
        }
    }

    // Check if username is available
    async isUsernameAvailable(username) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
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

    // Get user profile with auth data using the database function
    async getUserProfileWithAuth(authUuid) {
        try {
            const { data, error } = await this.supabase
                .rpc('get_user_profile_with_auth', { user_uuid: authUuid });

            if (error) {
                throw error;
            }

            return data[0]; // Function returns a table, we want the first row
        } catch (error) {
            console.error('Error getting user profile with auth:', error);
            throw error;
        }
    }

    // Update last login using the database function
    async updateLastLoginFunction(authUuid) {
        try {
            const { error } = await this.supabase
                .rpc('update_last_login', { user_uuid: authUuid });

            if (error) {
                console.error('Error updating last login:', error);
            }
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    // Search users by company or location (for admin functions)
    async searchUsersByCompany(company) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .ilike('company', `%${company}%`);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error searching users by company:', error);
            throw error;
        }
    }

    // Search users by location (for admin functions)
    async searchUsersByLocation(location) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .ilike('location', `%${location}%`);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error searching users by location:', error);
            throw error;
        }
    }

    // Get all active users (for admin functions)
    async getActiveUsers() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting active users:', error);
            throw error;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
} else {
    window.UserManager = UserManager;
} 