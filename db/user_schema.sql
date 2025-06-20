-- User Schema for Meridian AI
-- This table stores user information connected to Supabase auth UUID

-- Create USER table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uuid UUID UNIQUE NOT NULL, -- Supabase auth user UUID
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    company VARCHAR(255),
    job_title VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_uuid ON users(auth_uuid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample user data (optional)
INSERT INTO users (auth_uuid, email, full_name, username, bio, company, job_title, is_verified) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@meridianai.com', 'Admin User', 'admin', 'System Administrator', 'Meridian AI', 'Admin', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'demo@meridianai.com', 'Demo User', 'demo', 'Demo account for testing', 'Meridian AI', 'Demo User', true)
ON CONFLICT (auth_uuid) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
-- GRANT USAGE ON SEQUENCE users_id_seq TO authenticated; 