-- User Profile Schema for Meridian AI
-- This table stores user profile information connected to Supabase auth UUID
-- Based on the editable fields in the profile page

-- Create USER_PROFILES table
CREATE TABLE IF NOT EXISTS user_profiles (
    -- Primary key using auth UUID
    auth_uuid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Personal Information (from profile page)
    full_name VARCHAR(255),
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    job_title VARCHAR(255),
    
    -- Bio and Description
    bio TEXT,
    
    -- Contact Information
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    
    -- Profile Media
    avatar_url TEXT,
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (auth_uuid, email, full_name, username, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create trigger to update profile when user metadata changes
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        email = NEW.email,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        username = COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        avatar_url = NEW.raw_user_meta_data->>'avatar_url',
        updated_at = NOW()
    WHERE auth_uuid = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_update();

-- Create function to update last login
CREATE OR REPLACE FUNCTION update_last_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE user_profiles 
    SET last_login = NOW(), updated_at = NOW()
    WHERE auth_uuid = user_uuid;
END;
$$ language 'plpgsql';

-- Create function to get user profile with auth data
CREATE OR REPLACE FUNCTION get_user_profile_with_auth(user_uuid UUID)
RETURNS TABLE (
    auth_uuid UUID,
    email VARCHAR,
    full_name VARCHAR,
    username VARCHAR,
    company VARCHAR,
    job_title VARCHAR,
    bio TEXT,
    phone VARCHAR,
    location VARCHAR,
    website VARCHAR,
    avatar_url TEXT,
    is_active BOOLEAN,
    is_verified BOOLEAN,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.auth_uuid,
        up.email,
        up.full_name,
        up.username,
        up.company,
        up.job_title,
        up.bio,
        up.phone,
        up.location,
        up.website,
        up.avatar_url,
        up.is_active,
        up.is_verified,
        up.last_login,
        up.created_at,
        up.updated_at,
        au.email_confirmed_at,
        au.last_sign_in_at
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.auth_uuid = au.id
    WHERE up.auth_uuid = user_uuid;
END;
$$ language 'plpgsql';

-- Insert sample data (optional - for testing)
INSERT INTO user_profiles (auth_uuid, email, full_name, username, company, job_title, bio, phone, location, website, is_verified) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@meridianai.com', 'Admin User', 'admin', 'Meridian AI', 'System Administrator', 'Lead administrator for Meridian AI platform', '+1-555-123-4567', 'San Francisco, CA', 'https://meridianai.com', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'demo@meridianai.com', 'Demo User', 'demo', 'Meridian AI', 'Demo Account', 'Demo account for testing the platform features', '+1-555-987-6543', 'New York, NY', 'https://demo.meridianai.com', true)
ON CONFLICT (auth_uuid) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
-- GRANT EXECUTE ON FUNCTION update_last_login(UUID) TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_user_profile_with_auth(UUID) TO authenticated;

-- Create RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = auth_uuid);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = auth_uuid);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = auth_uuid);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = auth_uuid); 