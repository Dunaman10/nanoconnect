import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

const supabase = createClient(
  'https://gpjprlcpdizkqcutfwvi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwanBybGNwZGl6a3FjdXRmd3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAyNzgzNCwiZXhwIjoyMDg1NjAzODM0fQ.ZRuuQeCPlrHJi4klulxNy4cuQrfgvw21dlH7UQWAeJ8'
)

// Deprecated - use /api/ai-recommendations instead
export async function onRequestPost(context) {
  return new Response(
    JSON.stringify({ error: 'This endpoint is deprecated. Please use /api/ai-recommendations instead.' }),
    { status: 301, headers }
  )
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers })
}
