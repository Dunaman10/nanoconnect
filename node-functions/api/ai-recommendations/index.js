import { createClient } from '@supabase/supabase-js'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

// Membuat object Supabase
const supabase = createClient(
  'https://gpjprlcpdizkqcutfwvi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwanBybGNwZGl6a3FjdXRmd3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAyNzgzNCwiZXhwIjoyMDg1NjAzODM0fQ.ZRuuQeCPlrHJi4klulxNy4cuQrfgvw21dlH7UQWAeJ8'
)

export async function onRequestPost(context) {
  try {
    const requestData = await context.request.json()
    
    const {
      niche,
      size,
      budget,
      target,
      campaign_type,
      location
    } = requestData

    // Validate required fields
    if (!niche || !campaign_type || !target) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: niche, campaign_type, target' }),
        { status: 400, headers }
      )
    }

    // Fetch influencers from database
    const { data: influencers, error: fetchError } = await supabase
      .from('influencers')
      .select(`
        id,
        username,
        social_platform,
        followers_count,
        engagement_rate,
        average_rating,
        niche,
        bio,
        price_per_post,
        user:users (
          name,
          avatar_url
        )
      `)
      .limit(5)

    if (fetchError) {
      console.error('Error fetching influencers:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch influencers: ' + fetchError.message }),
        { status: 500, headers }
      )
    }

    // Generate recommendations based on simple scoring
    const recommendations = influencers.map((inf, index) => {
      // Calculate simple match score
      let score = 80
      
      // Bonus for niche match
      if (inf.niche && niche && inf.niche.toLowerCase().includes(niche.toLowerCase())) {
        score += 10
      }
      
      // Bonus for engagement
      if (inf.engagement_rate > 5) {
        score += 5
      }
      
      // Small random variance
      score += Math.floor(Math.random() * 5)
      score = Math.min(score, 99)

      return {
        influencer_id: inf.id,
        name: inf.user?.name || inf.username || 'Unknown',
        followers_count: formatFollowerCount(inf.followers_count),
        bio: inf.bio || `Influencer ${inf.niche || niche} dengan ${formatFollowerCount(inf.followers_count)} followers`,
        score: score,
        reasoning: `Cocok untuk kampanye ${campaign_type} dengan target audience ${target}. Engagement rate: ${inf.engagement_rate || 0}%`
      }
    })

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score)

    return new Response(
      JSON.stringify({ 
        recommendations,
        query: requestData
      }),
      { status: 200, headers }
    )

  } catch (error) {
    console.error('Error processing recommendation:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { status: 500, headers }
    )
  }
}

// Helper function to format follower count
function formatFollowerCount(count) {
  if (!count) return '0'
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  return count.toString()
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers })
}
