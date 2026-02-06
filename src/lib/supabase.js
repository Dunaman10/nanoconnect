import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper functions for common operations
export const db = {
  // Users
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Influencers
  async getInfluencers(filters = {}) {
    let query = supabase
      .from('v_influencer_stats')
      .select('*');

    if (filters.platform) {
      query = query.eq('social_platform', filters.platform);
    }
    if (filters.niche) {
      query = query.eq('niche', filters.niche);
    }
    if (filters.minFollowers) {
      query = query.gte('followers_count', filters.minFollowers);
    }
    if (filters.maxPrice) {
      query = query.lte('price_per_post', filters.maxPrice);
    }

    const { data, error } = await query.order('average_rating', { ascending: false });
    return { data, error };
  },

  async getInfluencer(influencerId) {
    const { data, error } = await supabase
      .from('influencers')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', influencerId)
      .single();
    return { data, error };
  },

  // Orders
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    return { data, error };
  },

  async getOrders(userId, role = 'sme') {
    let query = supabase
      .from('v_order_summary')
      .select('*');

    if (role === 'sme') {
      query = query.eq('sme_id', userId);
    } else {
      query = query.eq('influencer_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  },

  // Reviews
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    return { data, error };
  },

  async getReviews(influencerId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users(name, avatar_url)
      `)
      .eq('influencer_id', influencerId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

export default supabase;
