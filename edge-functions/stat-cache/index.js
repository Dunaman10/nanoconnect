export async function onRequestGet({ request, params, env }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // Get cached stats from KV namespace
    const cachedStats = await stats.get('statistik');
    
    if (cachedStats) {
      return new Response(cachedStats, { headers });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'No cached stats found. Please call POST to refresh the cache.',
      cached: false
    }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500, 
      headers 
    });
  }
}

export async function onRequestPost({ request, params, env }) {
  const SUPABASE_URL = 'https://gpjprlcpdizkqcutfwvi.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwanBybGNwZGl6a3FjdXRmd3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAyNzgzNCwiZXhwIjoyMDg1NjAzODM0fQ.ZRuuQeCPlrHJi4klulxNy4cuQrfgvw21dlH7UQWAeJ8';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    // Fetch total influencers (users with user_type = 'influencer')
    const influencersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users?user_type=eq.influencer&select=id`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );

    // Fetch total UMKM (users with user_type = 'sme')
    const umkmResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users?user_type=eq.sme&select=id`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      }
    );

    // Get count from response headers
    const influencersCount = parseInt(influencersResponse.headers.get('content-range')?.split('/')[1] || '0');
    const umkmCount = parseInt(umkmResponse.headers.get('content-range')?.split('/')[1] || '0');

    // Prepare stats object
    const statsData = {
      total_influencers: influencersCount,
      total_umkm: umkmCount,
      total_campaigns: 25000, // Dummy data
      average_roi: 300, // Dummy data (percentage)
      updated_at: new Date().toISOString()
    };

    // Save to cache (KV namespace)
    await stats.put('statistik', JSON.stringify(statsData));

    return new Response(JSON.stringify({
      success: true,
      message: 'Stats cache updated successfully',
      data: statsData
    }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { 
      status: 500, 
      headers 
    });
  }
}