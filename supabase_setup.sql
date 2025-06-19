-- Meridian AI - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create system_status table
CREATE TABLE IF NOT EXISTS system_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('operational', 'degraded', 'down')),
    response_time INTEGER,
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'resolved' CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    affected_services TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uptime_stats table
CREATE TABLE IF NOT EXISTS uptime_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    uptime_percentage DECIMAL(5,2) NOT NULL,
    total_checks INTEGER NOT NULL DEFAULT 0,
    successful_checks INTEGER NOT NULL DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_status_service_name ON system_status(service_name);
CREATE INDEX IF NOT EXISTS idx_system_status_last_check ON system_status(last_check);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_started_at ON incidents(started_at);
CREATE INDEX IF NOT EXISTS idx_uptime_stats_service_name ON uptime_stats(service_name);

-- Enable Row Level Security
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (status page is public)
CREATE POLICY "Allow public read access to system_status" ON system_status
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to incidents" ON incidents
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to uptime_stats" ON uptime_stats
    FOR SELECT USING (true);

-- Insert sample data
INSERT INTO system_status (service_name, status, response_time) VALUES
    ('AI Core Engine', 'operational', 85),
    ('API Gateway', 'operational', 45),
    ('Database', 'operational', 120),
    ('User Dashboard', 'operational', 65),
    ('Analytics Engine', 'operational', 95),
    ('Security Services', 'operational', 55)
ON CONFLICT DO NOTHING;

INSERT INTO incidents (title, description, severity, status, affected_services) VALUES
    ('Scheduled Maintenance Completed', 'Routine system maintenance has been completed successfully. All services are now operating normally.', 'low', 'resolved', ARRAY['All Services']),
    ('Performance Optimization', 'Database performance optimizations have been implemented, resulting in improved response times.', 'low', 'resolved', ARRAY['Database']),
    ('Security Update Deployed', 'Latest security patches have been applied to all systems. No service interruption occurred.', 'low', 'resolved', ARRAY['Security Services'])
ON CONFLICT DO NOTHING;

INSERT INTO uptime_stats (service_name, uptime_percentage, total_checks, successful_checks) VALUES
    ('AI Core Engine', 99.9, 1000, 999),
    ('API Gateway', 99.8, 1000, 998),
    ('Database', 99.9, 1000, 999),
    ('User Dashboard', 99.7, 1000, 997),
    ('Analytics Engine', 99.6, 1000, 996),
    ('Security Services', 99.9, 1000, 999)
ON CONFLICT DO NOTHING;

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_system_status_updated_at BEFORE UPDATE ON system_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get current system status
CREATE OR REPLACE FUNCTION get_current_system_status()
RETURNS TABLE (
    service_name VARCHAR(100),
    status VARCHAR(20),
    response_time INTEGER,
    last_check TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT ss.service_name, ss.status, ss.response_time, ss.last_check
    FROM system_status ss
    WHERE ss.last_check >= NOW() - INTERVAL '5 minutes'
    ORDER BY ss.service_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to get recent incidents
CREATE OR REPLACE FUNCTION get_recent_incidents(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    description TEXT,
    severity VARCHAR(20),
    status VARCHAR(20),
    started_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT i.id, i.title, i.description, i.severity, i.status, i.started_at, i.resolved_at
    FROM incidents i
    ORDER BY i.started_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql; 