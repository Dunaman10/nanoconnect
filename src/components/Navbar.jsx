import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Influencers', path: '/influencers' },
    { name: 'Rekomendasi AI', path: '/ai-recommendation' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold gradient-text">NanoConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 hover:text-primary-400 ${
                  isActive(link.path) ? 'text-primary-400' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xs">
                        {userProfile?.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {userProfile?.name || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive(link.path) ? 'text-primary-400' : 'text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center space-x-3 py-2 text-white/80 hover:text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
                        {userProfile?.avatar_url ? (
                          <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-xs">
                            {userProfile?.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </span>
                        )}
                    </div>
                    <span>{userProfile?.name || user.email?.split('@')[0]}</span>
                  </Link>
                  <button 
                    onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 text-white/60"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-white/80" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary inline-block text-center w-full" onClick={() => setIsOpen(false)}>
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
