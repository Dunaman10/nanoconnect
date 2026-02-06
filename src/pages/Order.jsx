import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// API URL for Node Function (using Vite proxy)
const API_URL = '/api/order';

const Order = () => {
  const { influencerId } = useParams();
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [influencer, setInfluencer] = useState(null);
  const [loadingInfluencer, setLoadingInfluencer] = useState(true);
  const [formData, setFormData] = useState({
    service: '',
    description: '',
    startDate: '',
    endDate: '',
    notes: '',
    paymentMethod: '',
  });

  // Fetch influencer data from Supabase
  useEffect(() => {
    const fetchInfluencer = async () => {
      if (!influencerId) return;
      
      try {
        setLoadingInfluencer(true);
        const { data, error } = await supabase
          .from('influencers')
          .select(`
            id,
            username,
            social_platform,
            price_per_post,
            price_per_story,
            price_per_video,
            average_rating,
            user:users (
              name,
              avatar_url
            )
          `)
          .eq('id', influencerId)
          .single();

        if (error) {
          console.error('Error fetching influencer:', error);
          setError('Influencer tidak ditemukan');
        } else {
          setInfluencer({
            id: data.id,
            name: data.user?.name || 'Unknown',
            username: `@${data.username}`,
            avatar: data.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
            rating: data.average_rating || 0,
            pricePerPost: data.price_per_post || 2500000,
            pricePerStory: data.price_per_story || 1000000,
            pricePerVideo: data.price_per_video || 5000000,
          });
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Gagal memuat data influencer');
      } finally {
        setLoadingInfluencer(false);
      }
    };

    fetchInfluencer();
  }, [influencerId]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
        // Optional: you could auto-redirect here, but showing a UI block is better UX so they know why
        // navigate('/login', { state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  // Services based on influencer pricing
  const services = influencer ? [
    { id: 'post', name: 'Feed Post', price: influencer.pricePerPost, description: '1 posting di feed Instagram', contentType: 'post' },
    { id: 'story', name: 'Story Series', price: influencer.pricePerStory, description: '3-5 story Instagram', contentType: 'story' },
    { id: 'video', name: 'Reels/Video', price: influencer.pricePerVideo, description: 'Video 30-60 detik', contentType: 'video' },
    { id: 'bundle', name: 'Bundle Package', price: influencer.pricePerPost + influencer.pricePerStory + influencer.pricePerVideo, description: 'Feed + Story + Reels', contentType: 'bundle' },
  ] : [];

  const paymentMethods = [
    { id: 'bank', name: 'Transfer Bank', icon: '🏦', desc: 'BCA, Mandiri, BNI, BRI' },
    { id: 'ewallet', name: 'E-Wallet', icon: '📱', desc: 'GoPay, OVO, DANA, ShopeePay' },
    { id: 'qris', name: 'QRIS', icon: '📲', desc: 'Scan QR untuk bayar' },
  ];

  const selectedService = services.find(s => s.id === formData.service);
  const platformFee = selectedService ? selectedService.price * 0.1 : 0;
  const total = selectedService ? selectedService.price + platformFee : 0;

  const handleSubmitOrder = async () => {
    if (!user || !influencer || !selectedService) return;
    
    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        influencer_id: influencer.id,
        sme_id: user.id,
        order_status: 'pending',
        description: formData.description,
        content_type: selectedService.contentType,
        quantity: 1,
        unit_price: selectedService.price,
        total_price: total,
        platform_fee: platformFee,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        notes: formData.notes || null,
      };

      // Send to Node Function API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat order');
      }

      const data = await response.json();
      
      console.log('Order created successfully:', data);
      // data is an array from Supabase insert, get the first item
      const createdOrder = Array.isArray(data) ? data[0] : data;
      setCreatedOrderId(createdOrder.order_number || createdOrder.id);
      setStep(4); // Go to success step
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan saat membuat order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      // Submit order on step 3
      handleSubmitOrder();
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading || loadingInfluencer) {
    return (
      <div className="min-h-screen pt-20 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white/60">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 bg-slate-900 flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Diperlukan</h2>
          <p className="text-white/60 mb-8">
            Anda harus login terlebih dahulu untuk melakukan pemesanan layanan influencer.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/login" state={{ from: location }} className="btn-primary">
              Login Sekarang
            </Link>
            <Link to="/register" className="btn-secondary">
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen pt-20 bg-slate-900 flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Influencer Tidak Ditemukan</h2>
          <p className="text-white/60 mb-8">
            {error || 'Influencer yang Anda cari tidak ditemukan atau tidak tersedia.'}
          </p>
          <Link to="/influencers" className="btn-primary">
            Cari Influencer Lain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Order Layanan
            </h1>
            <p className="text-white/60">
              Pesan layanan dari {influencer.name}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step > s ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 4 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded ${step > s ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-8">
                {/* Step 1: Select Service */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Pilih Layanan</h2>
                    <div className="space-y-4">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.service === service.id
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={service.id}
                            checked={formData.service === service.id}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="hidden"
                          />
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-white">{service.name}</h3>
                              <p className="text-sm text-white/60">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold gradient-text">{formatPrice(service.price)}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Brief */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Detail Brief</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/80 mb-2">Deskripsi Campaign *</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Jelaskan produk/layanan yang ingin dipromosikan..."
                          rows={4}
                          className="input-field resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 mb-2">Tanggal Mulai *</label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 mb-2">Tanggal Selesai *</label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Catatan Tambahan</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Preferensi gaya konten, hashtag, dll..."
                          rows={3}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Metode Pembayaran</h2>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            className="hidden"
                          />
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl">{method.icon}</span>
                            <div>
                              <h3 className="font-semibold text-white">{method.name}</h3>
                              <p className="text-sm text-white/60">{method.desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-yellow-200">
                          Pembayaran menggunakan sistem escrow. Dana akan disimpan dan baru dikirim ke creator setelah order selesai.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div>
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Order Berhasil!</h2>
                      <p className="text-white/60 mb-6">
                        Order Anda telah dikirim ke {influencer.name}
                      </p>
                      <p className="text-white/80 mb-8">
                        Order ID: <span className="font-mono text-primary-400">{createdOrderId}</span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={`/chat/${influencer.id}`} className="btn-primary">
                          Chat Creator
                        </Link>
                        <Link to="/orders" className="btn-secondary">
                          Lihat Semua Order
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {step < 4 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button
                        onClick={handleBack}
                        disabled={step === 1 || submitting}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kembali
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={(step === 1 && !formData.service) || submitting}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting && (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        )}
                        {step === 3 ? (submitting ? 'Memproses...' : 'Bayar Sekarang') : 'Lanjutkan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-semibold text-white mb-4">Ringkasan Order</h3>
                
                {/* Creator Info */}
                <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                  <img src={influencer.avatar} alt={influencer.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-medium text-white">{influencer.name}</p>
                    <div className="flex items-center text-sm text-yellow-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {influencer.rating}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {selectedService && (
                  <div className="py-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">{selectedService.name}</span>
                      <span className="text-white">{formatPrice(selectedService.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Platform Fee (10%)</span>
                      <span className="text-white">{formatPrice(platformFee)}</span>
                    </div>
                    <hr className="border-white/10" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-bold gradient-text text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                {!selectedService && (
                  <p className="text-white/50 text-sm py-4">Pilih layanan untuk melihat harga</p>
                )}

                {/* Guarantee */}
                <div className="mt-4 p-4 bg-accent-500/10 rounded-xl">
                  <div className="flex items-center space-x-2 text-accent-400 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>100% Money Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
