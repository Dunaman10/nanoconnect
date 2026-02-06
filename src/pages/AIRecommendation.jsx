import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// API URL for Node Function
const API_URL = 'http://localhost:8088/api/ai-recommendations';

const AIRecommendation = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  
  // Form state - 6 fields sesuai payload
  const [formData, setFormData] = useState({
    niche: '',
    size: '',
    budget: '',
    target: '',
    campaign_type: '',
    location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetRecommendations = async () => {
    // Validate required fields
    if (!formData.niche || !formData.target || !formData.campaign_type) {
      setError('Mohon lengkapi field yang wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare payload sesuai format yang diminta
      const payload = {
        niche: formData.niche,
        size: formData.size,
        budget: formData.budget,
        target: formData.target,
        campaign_type: formData.campaign_type,
        location: formData.location,
      };

      // Send to Node Function API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mendapatkan rekomendasi');
      }

      const data = await response.json();
      // Set recommendations dari response
      setRecommendations(data.recommendations || data);
      
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses rekomendasi');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
    setError(null);
  };

  // Dropdown options
  const nicheOptions = [
    { value: '', label: 'Pilih niche bisnis' },
    { value: 'Fashion', label: 'Fashion & Apparel' },
    { value: 'Beauty', label: 'Beauty & Skincare' },
    { value: 'Food', label: 'Food & Beverage' },
    { value: 'Tech', label: 'Technology & Gadgets' },
    { value: 'Health', label: 'Health & Fitness' },
    { value: 'Travel', label: 'Travel & Tourism' },
    { value: 'Education', label: 'Education & Courses' },
    { value: 'Finance', label: 'Finance & Investment' },
    { value: 'Entertainment', label: 'Entertainment & Gaming' },
    { value: 'Home', label: 'Home & Living' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Other', label: 'Lainnya' },
  ];

  const sizeOptions = [
    { value: '', label: 'Pilih ukuran perusahaan' },
    { value: 'dibawah 10 orang', label: 'Mikro (< 10 orang)' },
    { value: '10-50 orang', label: 'Kecil (10-50 orang)' },
    { value: '50-200 orang', label: 'Menengah (50-200 orang)' },
    { value: 'diatas 200 orang', label: 'Besar (> 200 orang)' },
  ];

  const budgetOptions = [
    { value: '', label: 'Pilih range budget' },
    { value: '1000000', label: 'Rp 1.000.000' },
    { value: '2500000', label: 'Rp 2.500.000' },
    { value: '5000000', label: 'Rp 5.000.000' },
    { value: '10000000', label: 'Rp 10.000.000' },
    { value: '25000000', label: 'Rp 25.000.000' },
    { value: '50000000', label: 'Rp 50.000.000' },
  ];

  const targetOptions = [
    { value: '', label: 'Pilih target audience' },
    { value: 'Gen Z', label: 'Gen Z (18-25 tahun)' },
    { value: 'Millennial', label: 'Millennial (26-40 tahun)' },
    { value: 'Gen X', label: 'Gen X (41-55 tahun)' },
    { value: 'Semua Usia', label: 'Semua Usia' },
    { value: 'Wanita', label: 'Wanita' },
    { value: 'Pria', label: 'Pria' },
    { value: 'Keluarga', label: 'Keluarga' },
  ];

  const campaignTypeOptions = [
    { value: '', label: 'Pilih tipe kampanye' },
    { value: 'Free', label: 'Free / Barter' },
    { value: 'Paid', label: 'Paid Campaign' },
    { value: 'Affiliate', label: 'Affiliate / Commission' },
    { value: 'Review', label: 'Product Review' },
    { value: 'Sponsored', label: 'Sponsored Post' },
    { value: 'Giveaway', label: 'Giveaway / Contest' },
  ];

  const locationOptions = [
    { value: '', label: 'Pilih lokasi target' },
    { value: 'Jakarta', label: 'Jakarta' },
    { value: 'Bandung', label: 'Bandung' },
    { value: 'Surabaya', label: 'Surabaya' },
    { value: 'Yogyakarta', label: 'Yogyakarta' },
    { value: 'Bali', label: 'Bali' },
    { value: 'Medan', label: 'Medan' },
    { value: 'Makassar', label: 'Makassar' },
    { value: 'Semarang', label: 'Semarang' },
    { value: 'Nasional', label: 'Nasional (Seluruh Indonesia)' },
  ];

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-20 bg-slate-900">
        <div className="container-custom section-padding">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Login Diperlukan</h2>
            <p className="text-white/60 mb-8">
              Silakan login terlebih dahulu untuk menggunakan fitur rekomendasi AI.
            </p>
            <Link to="/login" className="btn-primary">
              Login Sekarang
            </Link>
          </div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-6">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rekomendasi AI
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Biarkan AI kami membantu Anda menemukan influencer yang paling cocok untuk bisnis Anda berdasarkan profil dan kebutuhan kampanye.
            </p>
          </div>

          {/* Form Section */}
          {!recommendations ? (
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-2">
                Profil Kampanye Anda
              </h2>
              <p className="text-white/60 mb-6 text-sm">
                Lengkapi informasi berikut untuk mendapatkan rekomendasi yang akurat
              </p>
              
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Niche */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Niche Bisnis <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="niche"
                    value={formData.niche}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {nicheOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Size */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Ukuran Perusahaan
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Target */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Target Audience <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {targetOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Location */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Lokasi Target
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {locationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Campaign Type */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Tipe Kampanye <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="campaign_type"
                    value={formData.campaign_type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {campaignTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Budget */}
                <div>
                  <label className="block text-white/80 mb-2 font-medium text-sm">
                    Budget Kampanye
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {budgetOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    AI sedang menganalisis...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Dapatkan Rekomendasi AI
                  </>
                )}
              </button>

              {/* Features */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-medium text-white mb-1">Smart Matching</h4>
                    <p className="text-sm text-white/60">AI mencocokkan influencer dengan profil bisnis Anda</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-medium text-white mb-1">Data-Driven</h4>
                    <p className="text-sm text-white/60">Analisis berdasarkan performa real influencer</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-medium text-white mb-1">Instan</h4>
                    <p className="text-sm text-white/60">Hasil rekomendasi dalam hitungan detik</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Rekomendasi untuk Anda
                  </h2>
                  <p className="text-white/60 text-sm mt-1">
                    Berdasarkan profil kampanye yang Anda berikan
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="btn-secondary text-sm"
                >
                  ← Cari Lagi
                </button>
              </div>

              {/* Show recommendations or empty state */}
              {recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((influencer, index) => (
                    <div key={influencer.influencer_id || index} className="card p-6 hover:border-primary-500/50 transition-colors">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar & Basic Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                            {influencer.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{influencer.name}</h3>
                            <p className="text-white/60 text-sm">ID: {influencer.influencer_id}</p>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 rounded-xl">
                            <p className="text-white font-bold text-lg">{influencer.score}</p>
                            <p className="text-white/80 text-xs">Match Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Followers Count */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-white/60 text-sm mb-1">Followers</p>
                          <p className="text-white font-semibold text-lg">{influencer.followers_count}</p>
                        </div>
                        
                        {/* Bio */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-white/60 text-sm mb-1">Bio</p>
                          <p className="text-white text-sm line-clamp-2">{influencer.bio || '-'}</p>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl border border-primary-500/20">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🤖</span>
                          <div>
                            <p className="text-white/60 text-xs mb-1">AI Reasoning</p>
                            <p className="text-sm text-white/80">{influencer.reasoning}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4">
                        <Link
                          to={`/influencer/${influencer.influencer_id}`}
                          className="btn-primary text-sm w-full text-center block"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Rekomendasi</h3>
                  <p className="text-white/60 mb-6">
                    Belum ada influencer yang cocok dengan kriteria Anda. Coba ubah kriteria pencarian.
                  </p>
                  <button onClick={handleReset} className="btn-primary">
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Tips */}
              <div className="mt-8 p-6 bg-white/5 rounded-xl">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💡</span> Tips Memilih Influencer
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Perhatikan skor matching dari AI untuk kesesuaian terbaik</li>
                  <li>• Cek bio influencer untuk memastikan relevansi dengan brand Anda</li>
                  <li>• Lihat detail profil untuk informasi lebih lengkap</li>
                  <li>• Mulai dengan campaign kecil untuk uji coba</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
