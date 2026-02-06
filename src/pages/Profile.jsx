import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar_url: '',
    role: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        avatar_url: userProfile.avatar_url || '',
        role: userProfile.user_type || 'sme' // Matching schema column name
      });
    } else if (user?.user_metadata) {
      setFormData({
        name: user.user_metadata.full_name || '',
        phone: '',
        avatar_url: '',
        role: user.user_metadata.user_type || 'sme'
      });
    }
  }, [userProfile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updates = {
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
        // role/user_type is typically not editable by the user after registration
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('users')
        .upsert(updates); // Upsert handles insert if not exists (though trigger usually handles insert)

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      refreshProfile();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Gagal memperbarui profil: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      <div className="container-custom section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Edit Profil</h1>
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex items-center space-x-6 mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden border-2 border-white/10 group-hover:border-primary-500 transition-colors">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20 group-hover:text-primary-500/50">
                      {formData.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs text-white">Ubah</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white">{formData.name || 'User'}</h2>
                <p className="text-white/60">{user?.email}</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-semibold capitalize">
                  {formData.role === 'sme' ? 'Bisnis / SME' : 'Content Creator'}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field w-full opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-white/40 mt-1">Email tidak dapat diubah</p>
              </div>

              <div>
                <label className="block text-white/80 mb-2">No. Handphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field w-full"
                  placeholder="081234567890"
                />
              </div>
              
               <div>
                <label className="block text-white/80 mb-2">Avatar URL (Link Gambar)</label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="input-field w-full"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-white/40 mt-1">Sementara: Masukkan link gambar langsung. Upload file akan segera hadir.</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                 <button
                  type="submit" 
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
