import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-900 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <p className="text-white/60 text-center mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
