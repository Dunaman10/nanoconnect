const Privacy = () => {
  const sections = [
    {
      title: '1. Pendahuluan',
      content: `
        <p>NanoConnect ("kami", "kita", atau "platform") berkomitmen untuk melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.</p>
        <p class="mt-4">Dengan menggunakan NanoConnect, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.</p>
      `,
    },
    {
      title: '2. Informasi yang Kami Kumpulkan',
      content: `
        <p class="font-semibold text-white mb-2">Informasi yang Anda Berikan:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Nama lengkap dan username</li>
          <li>Alamat email dan nomor telepon</li>
          <li>Foto profil dan informasi bio</li>
          <li>Informasi pembayaran dan rekening bank</li>
          <li>Akun media sosial yang terhubung</li>
          <li>Konten yang Anda unggah ke platform</li>
        </ul>
        <p class="font-semibold text-white mb-2">Informasi yang Dikumpulkan Otomatis:</p>
        <ul class="list-disc list-inside space-y-2">
          <li>Alamat IP dan informasi perangkat</li>
          <li>Data lokasi (jika diizinkan)</li>
          <li>Aktivitas penggunaan dan log access</li>
          <li>Cookies dan teknologi pelacakan lainnya</li>
        </ul>
      `,
    },
    {
      title: '3. Penggunaan Informasi',
      content: `
        <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Menyediakan dan meningkatkan layanan platform</li>
          <li>Memproses transaksi dan pembayaran</li>
          <li>Menghubungkan UMKM dengan creator yang sesuai</li>
          <li>Mengirimkan notifikasi dan update layanan</li>
          <li>Mengirimkan informasi promosi (dengan persetujuan)</li>
          <li>Mencegah penipuan dan aktivitas ilegal</li>
          <li>Mematuhi kewajiban hukum</li>
        </ul>
      `,
    },
    {
      title: '4. Berbagi Informasi',
      content: `
        <p>Kami dapat membagikan informasi Anda dengan:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li><strong>Pengguna Lain:</strong> Profil publik Anda dapat dilihat oleh pengguna lain sesuai pengaturan privasi</li>
          <li><strong>Mitra Pembayaran:</strong> Untuk memproses transaksi</li>
          <li><strong>Penyedia Layanan:</strong> Yang membantu operasional platform (hosting, analytics, dll)</li>
          <li><strong>Otoritas Hukum:</strong> Jika diwajibkan oleh hukum atau untuk melindungi hak kami</li>
        </ul>
        <p class="mt-4">Kami <strong>tidak</strong> menjual informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.</p>
      `,
    },
    {
      title: '5. Penyimpanan dan Keamanan Data',
      content: `
        <ul class="list-disc list-inside space-y-2">
          <li>Data disimpan di server yang aman dengan enkripsi SSL/TLS</li>
          <li>Akses ke data dibatasi hanya untuk karyawan yang memerlukan</li>
          <li>Kami melakukan audit keamanan secara berkala</li>
          <li>Password disimpan dalam bentuk hash terenkripsi</li>
          <li>Backup data dilakukan secara rutin</li>
          <li>Data akan disimpan selama akun Anda aktif atau sesuai kebutuhan hukum</li>
        </ul>
      `,
    },
    {
      title: '6. Cookies dan Teknologi Pelacakan',
      content: `
        <p>Kami menggunakan cookies dan teknologi serupa untuk:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Menyimpan preferensi login Anda</li>
          <li>Menganalisis penggunaan platform</li>
          <li>Personalisasi pengalaman pengguna</li>
          <li>Menampilkan iklan yang relevan</li>
        </ul>
        <p class="mt-4">Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi dengan baik.</p>
      `,
    },
    {
      title: '7. Hak Anda',
      content: `
        <p>Anda memiliki hak untuk:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami simpan</li>
          <li><strong>Koreksi:</strong> Memperbarui informasi yang tidak akurat</li>
          <li><strong>Penghapusan:</strong> Meminta penghapusan akun dan data (dengan batasan tertentu)</li>
          <li><strong>Pembatasan:</strong> Membatasi pemrosesan data tertentu</li>
          <li><strong>Portabilitas:</strong> Mendapatkan data dalam format yang dapat dibaca mesin</li>
          <li><strong>Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu</li>
        </ul>
        <p class="mt-4">Untuk menggunakan hak-hak ini, hubungi kami di privacy@nanoconnect.id</p>
      `,
    },
    {
      title: '8. Privasi Anak-Anak',
      content: `
        <p>NanoConnect tidak ditujukan untuk anak-anak di bawah 18 tahun. Kami tidak dengan sengaja mengumpulkan informasi dari anak-anak. Jika Anda mengetahui bahwa anak telah memberikan informasi pribadi kepada kami, harap hubungi kami untuk penghapusan.</p>
      `,
    },
    {
      title: '9. Transfer Data Internasional',
      content: `
        <p>Data Anda mungkin ditransfer dan disimpan di server yang berlokasi di luar Indonesia. Kami memastikan bahwa transfer data dilakukan dengan perlindungan yang memadai sesuai dengan peraturan yang berlaku.</p>
      `,
    },
    {
      title: '10. Perubahan Kebijakan',
      content: `
        <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi di platform. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.</p>
      `,
    },
    {
      title: '11. Hubungi Kami',
      content: `
        <p>Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi:</p>
        <div class="mt-4 p-4 bg-white/5 rounded-xl">
          <p><strong>NanoConnect - Tim Privasi</strong></p>
          <p>Email: privacy@nanoconnect.id</p>
          <p>Telepon: 0812-3456-7890</p>
          <p>Alamat: Jakarta, Indonesia</p>
        </div>
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
              Kebijakan <span className="gradient-text">Privasi</span>
            </h1>
            <p className="text-white/60">
              Terakhir diperbarui: 2 Februari 2026
            </p>
          </div>

          {/* Quick Summary */}
          <div className="card p-6 md:p-8 mb-8 border-primary-500/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Ringkasan Singkat
            </h2>
            <ul className="text-white/70 space-y-2">
              <li>✅ Kami mengumpulkan data untuk menyediakan layanan yang lebih baik</li>
              <li>✅ Data Anda tidak dijual kepada pihak ketiga</li>
              <li>✅ Anda dapat menghapus akun dan data kapan saja</li>
              <li>✅ Keamanan data adalah prioritas kami</li>
            </ul>
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
              Kami menghargai kepercayaan Anda. Jika ada pertanyaan, hubungi{' '}
              <a href="mailto:privacy@nanoconnect.id" className="text-primary-400 hover:underline">
                privacy@nanoconnect.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
