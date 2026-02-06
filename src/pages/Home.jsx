import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [stats, setStats] = useState([
    { label: 'Nano Creators', value: '0', loading: true },
    { label: 'UMKM Terdaftar', value: '0', loading: true },
    { label: 'Kampanye Sukses', value: '0', loading: true },
    { label: 'Rata-rata ROI', value: '300%', loading: false },
  ]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Fallback testimonials if none in database
  const fallbackTestimonials = [
    {
      name: 'Rina Handayani',
      role: 'Owner Toko Kue Mama',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rina',
      content: 'Dengan budget Rp 50K saja, penjualan kue saya meningkat 3x lipat! Nano creator sangat memahami audiens lokal.',
      rating: 5,
    },
    {
      name: 'Budi Santoso',
      role: 'Founder Warung Kopi Pak Budi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
      content: 'Proses mudah, creator responsif, dan hasilnya memuaskan. NanoConnect jadi pilihan utama untuk promosi UMKM saya.',
      rating: 5,
    },
    {
      name: 'Dewi Lestari',
      role: 'Owner Batik Dewi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewi',
      content: 'Senang banget bisa kerja sama dengan nano creator yang memahami produk lokal. Engagement rate-nya tinggi!',
      rating: 5,
    },
  ];

  // Format number with K+ suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K+';
    }
    return num.toString() + '+';
  };

  // Fetch stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch nano creators count (users with user_type = 'influencer')
        const { count: creatorsCount, error: creatorsError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'influencer');

        // Fetch UMKM count (users with user_type = 'sme')
        const { count: umkmCount, error: umkmError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'sme');

        setStats([
          { 
            label: 'Nano Creators', 
            value: creatorsError ? '0' : formatNumber(creatorsCount || 0), 
            loading: false 
          },
          { 
            label: 'UMKM Terdaftar', 
            value: umkmError ? '0' : formatNumber(umkmCount || 0), 
            loading: false 
          },
          { label: 'Kampanye Sukses', value: '25K+', loading: false },
          { label: 'Rata-rata ROI', value: '300%', loading: false },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer:users!reviews_reviewer_id_fkey (
              name,
              avatar_url,
              business_name
            )
          `)
          .eq('is_public', true)
          .order('rating', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching testimonials:', error);
          // Use fallback testimonials if error
          setTestimonials(fallbackTestimonials);
        } else if (data && data.length > 0) {
          setTestimonials(data.map(review => ({
            name: review.reviewer?.name || 'Anonymous',
            role: review.reviewer?.business_name || 'UMKM Owner',
            avatar: review.reviewer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.name || 'user'}`,
            content: review.comment,
            rating: review.rating || 5,
          })));
        } else {
          // Use fallback if no testimonials
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'Algoritma cerdas mencocokkan UMKM dengan influencer yang tepat berdasarkan niche dan budget.',
    },
    {
      icon: '💬',
      title: 'Chat Langsung',
      description: 'Berkomunikasi langsung dengan nano creator untuk diskusi detail kampanye.',
    },
    {
      icon: '🔒',
      title: 'Pembayaran Aman',
      description: 'Sistem escrow menjamin transaksi aman untuk kedua belah pihak.',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Pantau performa kampanye secara real-time dengan dashboard lengkap.',
    },
    {
      icon: '⭐',
      title: 'Review & Rating',
      description: 'Sistem transparansi untuk memastikan kualitas layanan terjaga.',
    },
    {
      icon: '🚀',
      title: 'Hasil Cepat',
      description: 'Proses cepat dari pemesanan hingga konten live di media sosial.',
    },
  ];

  const services = [
    {
      id: 1,
      name: 'UGC Content Creation',
      description: 'Konten autentik yang dibuat oleh creator untuk brand Anda.',
      icon: 'content',
      priceRange: 'Rp 10K - 50K',
      features: ['Foto/Video Original', 'Revisi 2x', 'Full Rights'],
      popular: false,
    },
    {
      id: 2,
      name: 'Product Review',
      description: 'Review jujur dan detail tentang produk atau layanan Anda.',
      icon: 'review',
      priceRange: 'Rp 20K - 100K',
      features: ['Review Mendalam', 'Posting di Feed', 'Insight Report'],
      popular: true,
    },
    {
      id: 3,
      name: 'Story Takeover',
      description: 'Creator mengambil alih story Anda selama 24 jam.',
      icon: 'story',
      priceRange: 'Rp 5K - 25K',
      features: ['Min. 5 Story', 'Interactive Q&A', 'Swipe Up Link'],
      popular: false,
    },
    {
      id: 4,
      name: 'Event Coverage',
      description: 'Liputan langsung event atau launching produk.',
      icon: 'event',
      priceRange: 'Rp 50K - 200K',
      features: ['Live Coverage', 'Recap Video', 'Multi-platform'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/50 to-slate-900" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/80">Platform #1 Nano Influencer Indonesia</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Hubungkan UMKM dengan{' '}
              <span className="gradient-text">Nano Creator</span>
            </h1>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Promosikan bisnis Anda dengan nano influencer (1K-20K followers) yang terjangkau, autentik, dan efektif untuk menjangkau audiens lokal.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/influencers" className="btn-primary text-lg px-8 py-4">
                Cari Influencer
                <svg className="inline-block w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/register?type=influencer" className="btn-secondary text-lg px-8 py-4">
                Daftar Jadi Creator
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  {stat.loading ? (
                    <div className="animate-pulse">
                      <div className="h-10 bg-white/20 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-24"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Mengapa <span className="gradient-text">NanoConnect</span>?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Platform all-in-one untuk menghubungkan UMKM dengan nano creator yang tepat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:border-primary-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Layanan <span className="gradient-text">Terjangkau</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Berbagai pilihan layanan dengan harga yang ramah UMKM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Cara <span className="gradient-text">Kerja</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Hanya 4 langkah mudah untuk memulai kampanye Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Cari Creator', desc: 'Filter berdasarkan niche, platform, dan budget' },
              { step: '02', title: 'Diskusi Brief', desc: 'Chat langsung untuk diskusi detail kampanye' },
              { step: '03', title: 'Bayar Aman', desc: 'Pembayaran melalui sistem escrow' },
              { step: '04', title: 'Konten Live', desc: 'Creator publish, Anda pantau hasilnya' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card p-6 text-center">
                  <div className="text-5xl font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Apa Kata <span className="gradient-text">Mereka</span>?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Testimoni dari UMKM yang sudah merasakan manfaat NanoConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="flex space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-white/20 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-white/20 rounded w-full"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              testimonials.map((testimonial, index) => (
                <div key={index} className="card p-6">
                  {/* Stars */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-white/80 mb-6 italic">"{testimonial.content}"</p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Siap Memulai Kampanye Anda?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10">
            Bergabung dengan ribuan UMKM yang sudah sukses meningkatkan penjualan bersama NanoConnect
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
              Daftar Gratis Sekarang
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
