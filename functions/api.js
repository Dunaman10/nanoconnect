// NanoConnect API - Hello World Edge Function
// This is a sample edge function for the NanoConnect platform

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'NanoConnect API is running',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (url.pathname === '/api/hello') {
      const name = url.searchParams.get('name') || 'World';
      return new Response(
        JSON.stringify({
          message: `Hello, ${name}! Welcome to NanoConnect 🚀`,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // 404 for unknown API routes
    return new Response(
      JSON.stringify({
        error: 'Not Found',
        message: 'The requested API endpoint does not exist',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  },
};
