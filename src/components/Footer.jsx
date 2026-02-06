import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Cara Kerja', path: '/about' },
      { name: 'Cari Influencer', path: '/influencers' },
      { name: 'Harga Layanan', path: '/pricing' },
      { name: 'FAQ', path: '/faq' },
    ],
    legal: [
      { name: 'Syarat & Ketentuan', path: '/terms' },
      { name: 'Kebijakan Privasi', path: '/privacy' },
    ],
    social: [
      { name: 'Instagram', url: 'https://instagram.com/nanoconnect' },
      { name: 'Twitter', url: 'https://twitter.com/nanoconnect' },
      { name: 'LinkedIn', url: 'https://linkedin.com/company/nanoconnect' },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">NanoConnect</span>
            </Link>
            <p className="text-white/60 mb-6">
              Platform penghubung Nano Creator dengan UMKM untuk iklan yang terjangkau dan efektif.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/60 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/60 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@nanoconnect.id</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            © {currentYear} NanoConnect. All rights reserved.
          </p>
          <p className="text-white/40 text-sm mt-4 md:mt-0">
            Made with ❤️ in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
