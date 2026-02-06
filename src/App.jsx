import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Influencers from './pages/Influencers';
import InfluencerDetail from './pages/InfluencerDetail';
import Chat from './pages/Chat';
import Order from './pages/Order';
import OrderList from './pages/OrderList';
import AIRecommendation from './pages/AIRecommendation';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900 text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/influencers" element={<Influencers />} />
              <Route path="/influencer/:id" element={<InfluencerDetail />} />
              <Route path="/chat/:influencerId" element={<Chat />} />
              <Route path="/order/:influencerId" element={<Order />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/ai-recommendation" element={<AIRecommendation />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
