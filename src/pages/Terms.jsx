const Terms = () => {
  const sections = [
    {
      title: '1. Ketentuan Umum',
      content: `
        <p>Dengan mengakses dan menggunakan platform NanoConnect, Anda menyetujui untuk terikat dengan syarat dan ketentuan berikut. Jika Anda tidak menyetujui salah satu ketentuan, mohon untuk tidak menggunakan layanan kami.</p>
        <p class="mt-4">NanoConnect adalah platform yang menghubungkan pelaku UMKM dengan nano creator (influencer dengan 1.000-20.000 followers) untuk keperluan promosi dan marketing.</p>
      `,
    },
    {
      title: '2. Pendaftaran Akun',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Anda harus berusia minimal 18 tahun atau memiliki izin dari orang tua/wali untuk mendaftar.</li>
          <li>Informasi yang Anda berikan saat pendaftaran harus akurat dan lengkap.</li>
          <li>Anda bertanggung jawab menjaga kerahasiaan password akun Anda.</li>
          <li>Satu orang hanya diperbolehkan memiliki satu akun aktif.</li>
          <li>NanoConnect berhak menolak atau menangguhkan akun yang melanggar ketentuan.</li>
        </ul>
      `,
    },
    {
      title: '3. Layanan Platform',
      content: `
        <p>NanoConnect menyediakan layanan sebagai berikut:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Marketplace untuk menghubungkan UMKM dengan nano creator</li>
          <li>Sistem escrow untuk pembayaran yang aman</li>
          <li>Fitur chat untuk komunikasi antara kedua belah pihak</li>
          <li>Dashboard analytics untuk monitoring campaign</li>
          <li>Sistem review dan rating untuk transparansi</li>
        </ul>
      `,
    },
    {
      title: '4. Kewajiban Pengguna (UMKM)',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Memberikan brief yang jelas dan lengkap kepada creator</li>
          <li>Melakukan pembayaran tepat waktu sesuai kesepakatan</li>
          <li>Memberikan review yang jujur dan konstruktif</li>
          <li>Tidak meminta konten yang melanggar hukum atau melanggar hak cipta</li>
          <li>Menghormati hak kekayaan intelektual creator</li>
        </ul>
      `,
    },
    {
      title: '5. Kewajiban Creator',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Memberikan layanan sesuai dengan paket yang ditawarkan</li>
          <li>Menyelesaikan order dalam waktu yang disepakati</li>
          <li>Membuat konten yang original dan tidak melanggar hak cipta</li>
          <li>Berkomunikasi dengan profesional kepada klien</li>
          <li>Tidak melakukan transaksi di luar platform</li>
        </ul>
      `,
    },
    {
      title: '6. Pembayaran dan Biaya',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Platform fee sebesar 10% dari nilai transaksi dibebankan kepada UMKM</li>
          <li>Pembayaran menggunakan sistem escrow untuk keamanan</li>
          <li>Dana akan dirilis ke creator setelah order diselesaikan dan disetujui</li>
          <li>Refund hanya diberikan sesuai kebijakan yang berlaku</li>
          <li>Withdrawl minimum Rp 50.000 untuk creator</li>
        </ul>
      `,
    },
    {
      title: '7. Pembatalan dan Refund',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Pembatalan order dapat dilakukan sebelum creator memulai pengerjaan</li>
          <li>Jika creator membatalkan, UMKM berhak mendapat refund penuh</li>
          <li>Dispute dapat diajukan dalam 7 hari setelah order selesai</li>
          <li>NanoConnect akan menjadi mediator dalam penyelesaian dispute</li>
          <li>Keputusan akhir dispute bersifat final dan mengikat</li>
        </ul>
      `,
    },
    {
      title: '8. Konten yang Dilarang',
      content: `
        <p>Pengguna dilarang membuat atau meminta konten yang:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Mengandung unsur SARA, kekerasan, atau pornografi</li>
          <li>Melanggar hukum yang berlaku di Indonesia</li>
          <li>Menyebarkan informasi palsu atau hoax</li>
          <li>Melanggar hak kekayaan intelektual pihak lain</li>
          <li>Mempromosikan produk ilegal (narkoba, judi, dll)</li>
        </ul>
      `,
    },
    {
      title: '9. Hak Kekayaan Intelektual',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Creator mempertahankan hak cipta atas konten yang dibuat</li>
          <li>UMKM mendapat lisensi untuk menggunakan konten sesuai kesepakatan</li>
          <li>Logo dan brand NanoConnect adalah milik eksklusif platform</li>
          <li>Pengguna tidak boleh menggunakan trademark platform tanpa izin tertulis</li>
        </ul>
      `,
    },
    {
      title: '10. Batasan Tanggung Jawab',
      content: `
        <p>NanoConnect tidak bertanggung jawab atas:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Kerugian akibat transaksi di luar platform</li>
          <li>Kualitas konten yang dibuat oleh creator</li>
          <li>Kerusakan atau kehilangan data</li>
          <li>Gangguan layanan akibat force majeure</li>
          <li>Tindakan pengguna yang melanggar ketentuan</li>
        </ul>
      `,
    },
    {
      title: '11. Perubahan Ketentuan',
      content: `
        <p>NanoConnect berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan baru.</p>
      `,
    },
    {
      title: '12. Hukum yang Berlaku',
      content: `
        <p>Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Segala perselisihan akan diselesaikan secara musyawarah, dan jika tidak tercapai, akan diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI).</p>
      `,
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Syarat & <span className="gradient-text">Ketentuan</span>
            </h1>
            <p className="text-white/60">
              Terakhir diperbarui: 2 Februari 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="card p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                <div
                  className="text-white/70 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-white/60">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di{' '}
              <a href="mailto:legal@nanoconnect.id" className="text-primary-400 hover:underline">
                legal@nanoconnect.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
