import { useState, useEffect } from 'react';
import InfluencerCard from '../components/InfluencerCard';
import { supabase } from '../lib/supabase';

const Influencers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const { data, error } = await supabase
      .from('influencers')
      .select('*, users!user_id (name, avatar_url, is_verified, is_active)')
      .eq('users.is_active', true)
      .eq('is_available', true)
      .order('average_rating', { ascending: false })
      ;

      if (error) {
        console.error('Error fetching influencers:', error);
      }
      
      const mappedData = (data || []).map(item => ({
        id: item.id,
        name: item.users?.name || item.name || item.username,
        username: item.username,
        avatar: item.users?.avatar_url || item.avatar_url,
        platform: item.social_platform || item.platform,
        followers: item.followers_count || item.followers,
        engagementRate: item.engagement_rate || item.engagementRate,
        niche: item.niche,
        priceRange: item.price_per_post ? `Rp ${(item.price_per_post/1000).toFixed(0)}K` : item.priceRange,
        rating: item.average_rating || item.rating,
        isVerified: item.users?.is_verified || item.is_verified
      }));
      
      setInfluencers(mappedData);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    }
  };

  const platforms = [
    { value: 'all', label: 'Semua Platform' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const niches = [
    { value: 'all', label: 'Semua Niche' },
    { value: 'Beauty & Lifestyle', label: 'Beauty & Lifestyle' },
    { value: 'Food & Culinary', label: 'Food & Culinary' },
    { value: 'Travel & Adventure', label: 'Travel & Adventure' },
    { value: 'Tech & Gadget', label: 'Tech & Gadget' },
    { value: 'Fashion & Style', label: 'Fashion & Style' },
    { value: 'Health & Fitness', label: 'Health & Fitness' },
    { value: 'Parenting', label: 'Parenting' },
    { value: 'Gaming', label: 'Gaming' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Semua Harga' },
    { value: 'low', label: 'Di bawah Rp 30K' },
    { value: 'medium', label: 'Rp 30K - 50K' },
    { value: 'high', label: 'Di atas Rp 50K' },
  ];

  // Filter influencers
  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch = 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.niche.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === 'all' || influencer.platform === selectedPlatform;
    const matchesNiche = selectedNiche === 'all' || influencer.niche === selectedNiche;
    
    // Price range filtering (simplified)
    let matchesPrice = true;
    if (priceRange === 'low') {
      matchesPrice = influencer.priceRange.includes('20K') || influencer.priceRange.includes('25K');
    } else if (priceRange === 'medium') {
      matchesPrice = influencer.priceRange.includes('30K') || influencer.priceRange.includes('35K');
    } else if (priceRange === 'high') {
      matchesPrice = influencer.priceRange.includes('50K') || influencer.priceRange.includes('40K');
    }

    return matchesSearch && matchesPlatform && matchesNiche && matchesPrice;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Temukan <span className="gradient-text">Nano Creator</span> Terbaik
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Filter dan temukan influencer yang tepat untuk kampanye bisnis Anda
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Cari creator berdasarkan nama, username, atau niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 py-4 text-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          {/* Filters */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Platform Filter */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="input-field"
              >
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value} className="bg-slate-800">
                    {platform.label}
                  </option>
                ))}
              </select>

              {/* Niche Filter */}
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="input-field"
              >
                {niches.map((niche) => (
                  <option key={niche.value} value={niche.value} className="bg-slate-800">
                    {niche.label}
                  </option>
                ))}
              </select>

              {/* Price Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="input-field"
              >
                {priceRanges.map((price) => (
                  <option key={price.value} value={price.value} className="bg-slate-800">
                    {price.label}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPlatform('all');
                  setSelectedNiche('all');
                  setPriceRange('all');
                }}
                className="btn-secondary whitespace-nowrap"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-white/60">
              Menampilkan <span className="text-white font-semibold">{filteredInfluencers.length}</span> creator
            </p>
            <select className="input-field w-auto">
              <option value="popular" className="bg-slate-800">Paling Populer</option>
              <option value="rating" className="bg-slate-800">Rating Tertinggi</option>
              <option value="followers" className="bg-slate-800">Followers Terbanyak</option>
              <option value="price-low" className="bg-slate-800">Harga Terendah</option>
            </select>
          </div>

          {/* Results Grid */}
          {filteredInfluencers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInfluencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Tidak Ada Hasil</h3>
              <p className="text-white/60">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}

          {/* Load More */}
          {filteredInfluencers.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-secondary">
                Muat Lebih Banyak
                <svg className="inline-block w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Influencers;
