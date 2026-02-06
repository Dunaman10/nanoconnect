import { Link } from 'react-router-dom';

const About = () => {
  const team = [
    {
      name: 'Ahmad Rizky',
      role: 'CEO & Founder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
      bio: 'Mantan marketer di startup unicorn. Passionate membantu UMKM naik kelas.',
    },
    {
      name: 'Siti Nurhaliza',
      role: 'COO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
      bio: 'Expert di bidang operasional dan customer success.',
    },
    {
      name: 'Budi Hartono',
      role: 'CTO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budih',
      bio: 'Full-stack developer dengan pengalaman 10+ tahun.',
    },
    {
      name: 'Dewi Anggraini',
      role: 'Head of Creator Success',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewia',
      bio: 'Membantu ribuan creator berkembang dan sukses.',
    },
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Kepercayaan',
      description: 'Membangun kepercayaan antara UMKM dan creator melalui sistem yang transparan.',
    },
    {
      icon: '💡',
      title: 'Inovasi',
      description: 'Terus berinovasi untuk memberikan solusi terbaik bagi pengguna.',
    },
    {
      icon: '🌱',
      title: 'Pertumbuhan',
      description: 'Mendukung pertumbuhan UMKM dan nano creator Indonesia.',
    },
    {
      icon: '❤️',
      title: 'Komunitas',
      description: 'Membangun komunitas yang saling mendukung dan berbagi.',
    },
  ];

  const milestones = [
    { year: '2024', title: 'NanoConnect Didirikan', desc: 'Bermula dari ide sederhana untuk membantu UMKM' },
    { year: '2024', title: '1000 Creator Bergabung', desc: 'Milestone pertama dalam 3 bulan' },
    { year: '2025', title: '10K+ Kampanye Sukses', desc: 'Membuktikan model bisnis yang tepat' },
    { year: '2026', title: 'Ekspansi Nasional', desc: 'Hadir di 34 provinsi Indonesia' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tentang <span className="gradient-text">NanoConnect</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Misi kami adalah mendemokratisasi influencer marketing agar terjangkau untuk semua UMKM Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Cerita <span className="gradient-text">Kami</span>
              </h2>
              <p className="text-white/70 mb-4">
                NanoConnect lahir dari pengalaman langsung melihat betapa sulitnya UMKM mendapatkan akses ke influencer marketing. 
                Biaya mahal dan proses yang rumit membuat banyak usaha kecil tertinggal dalam persaingan digital.
              </p>
              <p className="text-white/70 mb-4">
                Kami percaya bahwa nano creator (1K-20K followers) adalah solusi yang tepat. Mereka memiliki engagement rate 
                tinggi, audiens yang loyal, dan biaya yang sangat terjangkau untuk UMKM.
              </p>
              <p className="text-white/70">
                Dengan NanoConnect, kami menciptakan ekosistem yang menguntungkan semua pihak: UMKM mendapat promosi efektif, 
                nano creator mendapat penghasilan, dan konsumen mendapat rekomendasi autentik.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🚀</div>
                  <p className="text-2xl font-bold gradient-text">Empowering UMKM</p>
                  <p className="text-white/60">Since 2024</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-500/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nilai-Nilai <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Prinsip yang menjadi fondasi setiap keputusan dan tindakan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center hover:border-primary-500/50 transition-all">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perjalanan <span className="gradient-text">Kami</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gradient-to-b from-primary-500 to-accent-500" />
                )}
                {/* Dot */}
                <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                {/* Content */}
                <div className="card p-6">
                  <span className="text-sm text-primary-400 font-medium">{milestone.year}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">{milestone.title}</h3>
                  <p className="text-white/60 mt-2">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tim <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Orang-orang hebat di balik NanoConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center group hover:border-primary-500/50 transition-all">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/20 group-hover:border-primary-500 transition-colors"
                />
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-primary-400 text-sm mb-3">{member.role}</p>
                <p className="text-white/60 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bergabung Bersama Kami
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Jadilah bagian dari revolusi influencer marketing untuk UMKM Indonesia
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
              Daftar Sekarang
            </Link>
            <Link to="/influencers" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Lihat Influencer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
