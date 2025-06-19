// Meridian AI - Populate Status Data
// Run this script to populate your Supabase database with sample status data

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function populateStatusData() {
    console.log('Starting to populate status data...');

    try {
        // 1. Insert system status data
        const systemStatusData = [
            { service_name: 'AI Core Engine', status: 'operational', response_time: 85 },
            { service_name: 'API Gateway', status: 'operational', response_time: 45 },
            { service_name: 'Database', status: 'operational', response_time: 120 },
            { service_name: 'User Dashboard', status: 'operational', response_time: 65 },
            { service_name: 'Analytics Engine', status: 'operational', response_time: 95 },
            { service_name: 'Security Services', status: 'operational', response_time: 55 }
        ];

        console.log('Inserting system status data...');
        const { data: statusData, error: statusError } = await supabase
            .from('system_status')
            .upsert(systemStatusData, { onConflict: 'service_name' });

        if (statusError) {
            console.error('Error inserting system status:', statusError);
        } else {
            console.log('System status data inserted successfully:', statusData);
        }

        // 2. Insert incidents data
        const incidentsData = [
            {
                title: 'Scheduled Maintenance Completed',
                description: 'Routine system maintenance has been completed successfully. All services are now operating normally.',
                severity: 'low',
                status: 'resolved',
                affected_services: ['All Services']
            },
            {
                title: 'Performance Optimization',
                description: 'Database performance optimizations have been implemented, resulting in improved response times.',
                severity: 'low',
                status: 'resolved',
                affected_services: ['Database']
            },
            {
                title: 'Security Update Deployed',
                description: 'Latest security patches have been applied to all systems. No service interruption occurred.',
                severity: 'low',
                status: 'resolved',
                affected_services: ['Security Services']
            }
        ];

        console.log('Inserting incidents data...');
        const { data: incidentsDataResult, error: incidentsError } = await supabase
            .from('incidents')
            .upsert(incidentsData);

        if (incidentsError) {
            console.error('Error inserting incidents:', incidentsError);
        } else {
            console.log('Incidents data inserted successfully:', incidentsDataResult);
        }

        // 3. Insert uptime stats data
        const uptimeStatsData = [
            { service_name: 'AI Core Engine', uptime_percentage: 99.9, total_checks: 1000, successful_checks: 999 },
            { service_name: 'API Gateway', uptime_percentage: 99.8, total_checks: 1000, successful_checks: 998 },
            { service_name: 'Database', uptime_percentage: 99.9, total_checks: 1000, successful_checks: 999 },
            { service_name: 'User Dashboard', uptime_percentage: 99.7, total_checks: 1000, successful_checks: 997 },
            { service_name: 'Analytics Engine', uptime_percentage: 99.6, total_checks: 1000, successful_checks: 996 },
            { service_name: 'Security Services', uptime_percentage: 99.9, total_checks: 1000, successful_checks: 999 }
        ];

        console.log('Inserting uptime stats data...');
        const { data: uptimeData, error: uptimeError } = await supabase
            .from('uptime_stats')
            .upsert(uptimeStatsData, { onConflict: 'service_name' });

        if (uptimeError) {
            console.error('Error inserting uptime stats:', uptimeError);
        } else {
            console.log('Uptime stats data inserted successfully:', uptimeData);
        }

        console.log('✅ All data populated successfully!');
        console.log('Refresh your status page to see the updated data.');

    } catch (error) {
        console.error('Error populating data:', error);
    }
}

// Function to check current data
async function checkCurrentData() {
    console.log('Checking current data in database...');

    try {
        // Check system status
        const { data: statusData, error: statusError } = await supabase
            .from('system_status')
            .select('*');

        if (statusError) {
            console.error('Error fetching system status:', statusError);
        } else {
            console.log('Current system status data:', statusData);
        }

        // Check incidents
        const { data: incidentsData, error: incidentsError } = await supabase
            .from('incidents')
            .select('*');

        if (incidentsError) {
            console.error('Error fetching incidents:', incidentsError);
        } else {
            console.log('Current incidents data:', incidentsData);
        }

        // Check uptime stats
        const { data: uptimeData, error: uptimeError } = await supabase
            .from('uptime_stats')
            .select('*');

        if (uptimeError) {
            console.error('Error fetching uptime stats:', uptimeError);
        } else {
            console.log('Current uptime stats data:', uptimeData);
        }

    } catch (error) {
        console.error('Error checking data:', error);
    }
}

// Export functions for use in browser console
window.populateStatusData = populateStatusData;
window.checkCurrentData = checkCurrentData;

console.log('Status data utilities loaded!');
console.log('Run populateStatusData() to populate the database');
console.log('Run checkCurrentData() to check current data'); 