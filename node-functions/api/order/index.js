import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function onRequestPost(context) {
  const supabaseUrl = 'https://gpjprlcpdizkqcutfwvi.supabase.co'
  const supabaseKey = context.env.SUPABASE_SERVICE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  const orderData = await context.request.json()
  
  if(!orderData.influencer_id || !orderData.sme_id || !orderData.description) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers })
  }

  const {data, error} = await supabase
  .from('orders')
  .insert([orderData])
  .select();

  if(error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers })
  }

  return new Response(JSON.stringify(data), { status: 201, headers })
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers })
}