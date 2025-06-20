// Example usage of UserManager in your pages
// Include this after loading user_management.js

// Example: How to use UserManager in home.html or profile.html

// Initialize UserManager
const userManager = new UserManager(supabase);

// Example: Get current user data
async function loadUserData() {
    try {
        const user = await userManager.getCurrentUser();
        console.log('Current user:', user);
        
        // Update UI with user data
        document.getElementById('userName').textContent = user.full_name || 'User';
        document.getElementById('userEmail').textContent = user.email;
        
        // Update last login
        await userManager.updateLastLogin(user.auth_uuid);
        
        return user;
    } catch (error) {
        console.error('Error loading user data:', error);
        // Handle error (redirect to login, show fallback, etc.)
    }
}

// Example: Update user profile
async function updateProfile(userId, profileData) {
    try {
        const updatedUser = await userManager.updateUser(userId, {
            full_name: profileData.fullName,
            bio: profileData.bio,
            company: profileData.company,
            job_title: profileData.jobTitle,
            location: profileData.location,
            website: profileData.website
        });
        
        console.log('Profile updated:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

// Example: Check username availability
async function checkUsername(username) {
    const isAvailable = await userManager.isUsernameAvailable(username);
    if (isAvailable) {
        console.log(`Username "${username}" is available`);
    } else {
        console.log(`Username "${username}" is taken`);
    }
    return isAvailable;
}

// Example: Update user preferences
async function updateUserPreferences(userId, preferences) {
    try {
        const updatedPrefs = await userManager.updatePreferences(userId, {
            theme: 'dark',
            notifications: true,
            language: 'en',
            timezone: 'UTC'
        });
        
        console.log('Preferences updated:', updatedPrefs);
        return updatedPrefs;
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
}

// Example: Get user by email (for admin functions)
async function getUserByEmail(email) {
    try {
        const user = await userManager.getUserByEmail(email);
        console.log('User found:', user);
        return user;
    } catch (error) {
        console.error('User not found:', error);
        return null;
    }
}

// Example: Integration with existing home.html
// Add this to your home.html script section:

/*
// Replace the existing updateUserInfo function with this:
async function updateUserInfo() {
    try {
        const user = await userManager.getCurrentUser();
        
        const name = user.full_name || user.email?.split('@')[0] || 'User';
        const email = user.email || 'user@example.com';
        
        userName.textContent = name;
        userEmail.textContent = email;
        
        // Store user data in localStorage for faster access
        localStorage.setItem('meridian_user', JSON.stringify(user));
        
        // Update last login
        await userManager.updateLastLogin(user.auth_uuid);
        
    } catch (error) {
        console.error('Error updating user info:', error);
        // Use fallback data
        userName.textContent = 'User';
        userEmail.textContent = 'user@example.com';
    }
}
*/ 