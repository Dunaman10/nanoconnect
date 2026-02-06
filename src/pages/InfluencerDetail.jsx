import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { db } from '../lib/supabase';

const InfluencerDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample influencer data (fallback/structure)
  const sampleInfluencer = {
    id: 1,
    name: 'Rina Wijaya',
    username: '@rinawijaya_',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rina',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
    platform: 'instagram',
    followers: 15000,
    following: 850,
    posts: 342,
    engagementRate: 4.5,
    niche: 'Beauty & Lifestyle',
    subNiche: 'Skincare',
    bio: 'Beauty & Lifestyle Content Creator 💄✨ Sharing skincare tips and makeup tutorials! Kolaborasi? DM or email 📩',
    location: 'Jakarta, Indonesia',
    responseTime: '< 2 jam',
    completedOrders: 45,
    rating: 4.9,
    reviewCount: 38,
    isVerified: true,
    isAvailable: true,
    joinedDate: 'Januari 2024',
    languages: ['Indonesia', 'English'],
    socialLinks: {
      instagram: 'https://instagram.com/rinawijaya_',
      tiktok: 'https://tiktok.com/@rinawijaya_',
      youtube: null,
    },
  };

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        setLoading(true);
        // If id is a number (sample data uses "1"), use sample
        // valid UUIDs are strings and will return true for isNaN
        if (!isNaN(id)) {
             setInfluencer(sampleInfluencer);
             setLoading(false);
             return;
        }

        const { data, error } = await db.getInfluencer(id);
        
        if (error) {
            console.error('Error fetching influencer:', error);
            // Fallback to sample for demo purposes
            setInfluencer(sampleInfluencer);
        } else if (data) {
            // Map/Merge fetched data with sample struct to ensure safely
            const mappedInfluencer = {
                ...sampleInfluencer,
                ...data,
                name: data.user?.name || data.name || sampleInfluencer.name,
                avatar: data.user?.avatar_url || data.avatar || sampleInfluencer.avatar,
                id: data.id,
                // Ensure critical fields exist
                influencer_id: data.id 
            };
            setInfluencer(mappedInfluencer);
        } else {
            setInfluencer(sampleInfluencer);
        }
      } catch (err) {
        console.error(err);
        setInfluencer(sampleInfluencer);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-900">
              <div className="text-white text-xl">Loading...</div>
          </div>
      );
  }

  if (!influencer) return null;

  const services = [
    {
      id: 1,
      name: 'Feed Post',
      description: 'Posting di feed Instagram dengan caption menarik',
      icon: 'content',
      priceRange: 'Rp 25K - 35K',
      features: ['1 Feed Post', 'Caption Custom', 'Revisi 2x'],
      popular: true,
    },
    {
      id: 2,
      name: 'Story Series',
      description: '3-5 story dengan swipe up link',
      icon: 'story',
      priceRange: 'Rp 15K - 25K',
      features: ['3-5 Story', 'Swipe Up Link', 'Highlight Option'],
      popular: false,
    },
    {
      id: 3,
      name: 'Reels/Video',
      description: 'Video pendek dengan editing profesional',
      icon: 'story',
      priceRange: 'Rp 50K - 75K',
      features: ['30-60s Video', 'Professional Edit', 'Background Music'],
      popular: false,
    },
  ];

  const portfolio = [
    { id: 1, image: 'https://picsum.photos/400/400?random=1', type: 'Feed' },
    { id: 2, image: 'https://picsum.photos/400/400?random=2', type: 'Reels' },
    { id: 3, image: 'https://picsum.photos/400/400?random=3', type: 'Feed' },
    { id: 4, image: 'https://picsum.photos/400/400?random=4', type: 'Story' },
    { id: 5, image: 'https://picsum.photos/400/400?random=5', type: 'Feed' },
    { id: 6, image: 'https://picsum.photos/400/400?random=6', type: 'Reels' },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Toko Skincare Glow',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=toko1',
      rating: 5,
      date: '2 minggu lalu',
      content: 'Rina sangat profesional dan komunikatif. Konten yang dihasilkan sesuai brief dan hasilnya memuaskan!',
      service: 'Feed Post',
    },
    {
      id: 2,
      name: 'Beauty Shop Jakarta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beauty',
      rating: 5,
      date: '1 bulan lalu',
      content: 'Engagement dari post Rina luar biasa! Penjualan produk kami meningkat setelah kolaborasi.',
      service: 'Reels/Video',
    },
    {
      id: 3,
      name: 'Mama Kosmetik',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mama',
      rating: 4,
      date: '2 bulan lalu',
      content: 'Hasil bagus, response time cepat. Akan order lagi untuk campaign berikutnya.',
      service: 'Story Series',
    },
  ];

  const tabs = [
    { id: 'about', label: 'Tentang' },
    { id: 'services', label: 'Layanan' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: `Ulasan (${influencer.reviewCount})` },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={influencer.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="container-custom px-4 -mt-20 relative z-10">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 mx-auto md:mx-0"
                />
                {influencer.isVerified && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{influencer.name}</h1>
                  <p className="text-white/60">{influencer.username}</p>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2 mt-4 md:mt-0">
                  {influencer.isAvailable ? (
                    <span className="inline-flex items-center px-3 py-1 bg-accent-500/20 text-accent-400 text-sm rounded-full">
                      <span className="w-2 h-2 bg-accent-400 rounded-full mr-2 animate-pulse" />
                      Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                      Tidak Tersedia
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold gradient-text">{(influencer.followers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-white/60">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold gradient-text">{influencer.engagementRate}%</p>
                  <p className="text-xs text-white/60">Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold gradient-text">{influencer.completedOrders}</p>
                  <p className="text-xs text-white/60">Orders</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {influencer.rating}
                  </p>
                  <p className="text-xs text-white/60">Rating</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-xl md:text-2xl font-bold gradient-text">{influencer.responseTime}</p>
                  <p className="text-xs text-white/60">Response</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full">{influencer.niche}</span>
                <span className="px-3 py-1 bg-white/5 text-white/70 text-sm rounded-full">{influencer.subNiche}</span>
                <span className="px-3 py-1 bg-white/5 text-white/70 text-sm rounded-full capitalize">{influencer.platform}</span>
                <span className="px-3 py-1 bg-white/5 text-white/70 text-sm rounded-full">📍 {influencer.location}</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/chat/${influencer.id}`} className="btn-primary flex-1 text-center">
                  <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat Sekarang
                </Link>
                <Link to={`/order/${influencer.id}`} className="btn-secondary flex-1 text-center">
                  Order Langsung
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="container-custom px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Bio</h3>
                <p className="text-white/70">{influencer.bio}</p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Informasi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">Bergabung</p>
                    <p className="text-white">{influencer.joinedDate}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Bahasa</p>
                    <p className="text-white">{influencer.languages.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Lokasi</p>
                    <p className="text-white">{influencer.location}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Response Time</p>
                    <p className="text-white">{influencer.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Social Media</h3>
                <div className="space-y-3">
                  {influencer.socialLinks.instagram && (
                    <a href={influencer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-white/70 hover:text-primary-400 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span>Instagram</span>
                    </a>
                  )}
                  {influencer.socialLinks.tiktok && (
                    <a href={influencer.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-white/70 hover:text-primary-400 transition-colors">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                        </svg>
                      </div>
                      <span>TikTok</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-2xl overflow-hidden">
                <img src={item.image} alt={`Portfolio ${item.id}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-start space-x-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{review.name}</h4>
                        <p className="text-sm text-white/50">{review.date} • {review.service}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/70">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerDetail;
