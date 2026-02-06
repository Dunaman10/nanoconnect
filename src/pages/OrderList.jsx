import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const OrderList = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, userProfile]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          order_status,
          description,
          content_type,
          quantity,
          unit_price,
          total_price,
          platform_fee,
          start_date,
          end_date,
          notes,
          created_at,
          completed_at,
          cancelled_at,
          cancellation_reason,
          influencer:influencers (
            id,
            username,
            social_platform,
            user:users (
              name,
              avatar_url
            )
          ),
          sme:users!orders_sme_id_fkey (
            id,
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Filter orders by logged-in user
      if (userProfile?.user_type === 'influencer') {
        // Get influencer's orders
        const { data: influencerData } = await supabase
          .from('influencers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (influencerData) {
          query = query.eq('influencer_id', influencerData.id);
        } else {
          // User is influencer but has no influencer profile yet
          setOrders([]);
          setLoading(false);
          return;
        }
      } else {
        // SME orders - filter by sme_id
        query = query.eq('sme_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching orders:', fetchError);
        setError('Gagal memuat data order');
      } else {
        // Transform data to match UI expectations
        const transformedOrders = (data || []).map(order => ({
          id: order.id,
          orderId: order.order_number,
          status: mapOrderStatus(order.order_status),
          service: formatContentType(order.content_type),
          description: order.description,
          quantity: order.quantity,
          unitPrice: order.unit_price,
          amount: order.total_price,
          platformFee: order.platform_fee,
          date: formatDate(order.created_at),
          startDate: order.start_date,
          endDate: order.end_date,
          notes: order.notes,
          completedAt: order.completed_at,
          cancelledAt: order.cancelled_at,
          cancellationReason: order.cancellation_reason,
          influencerName: order.influencer?.user?.name || 'Unknown',
          influencerAvatar: order.influencer?.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.influencer?.username || 'default'}`,
          influencerUsername: order.influencer?.username,
          influencerPlatform: order.influencer?.social_platform,
          smeName: order.sme?.name || 'Unknown',
          smeAvatar: order.sme?.avatar_url
        }));
        
        setOrders(transformedOrders);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const mapOrderStatus = (status) => {
    const statusMap = {
      'pending': 'pending',
      'accepted': 'active',
      'in_progress': 'active',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'disputed': 'disputed'
    };
    return statusMap[status] || status;
  };

  const formatContentType = (type) => {
    const typeMap = {
      'post': 'Feed Post',
      'story': 'Story Series',
      'video': 'Reels/Video',
      'bundle': 'Bundle Package'
    };
    return typeMap[type] || type || 'Custom Service';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'pending', label: 'Menunggu' },
    { id: 'active', label: 'Aktif' },
    { id: 'completed', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'active': return 'bg-blue-500/10 text-blue-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'disputed': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-white/10 text-white/50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'active': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      case 'disputed': return 'Dispute';
      default: return status;
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-20 bg-slate-900">
        <div className="container-custom section-padding">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-4">Login Diperlukan</h2>
            <p className="text-white/60 mb-8">
              Silakan login terlebih dahulu untuk melihat daftar order Anda.
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Daftar Order</h1>
              <p className="text-white/60 mt-1">
                {userProfile?.user_type === 'influencer' 
                  ? 'Order yang masuk untuk Anda' 
                  : 'Semua order campaign Anda'}
              </p>
            </div>
            {userProfile?.user_type !== 'influencer' && (
              <Link to="/influencers" className="btn-secondary text-sm">
                Buat Order Baru
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {tab.label}
                {tab.id !== 'all' && (
                  <span className="ml-2 text-xs opacity-60">
                    ({orders.filter(o => o.status === tab.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-white/60">Memuat data order...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">{error}</h3>
              <button 
                onClick={fetchOrders}
                className="btn-primary mt-4"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="card p-6 hover:border-primary-500/50 transition-colors">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={order.influencerAvatar} 
                          alt="Avatar" 
                          className="w-12 h-12 rounded-full bg-slate-700" 
                        />
                        <div>
                          <h3 className="font-semibold text-white">{order.service}</h3>
                          <p className="text-sm text-white/60">
                            {order.influencerName} • {order.orderId}
                          </p>
                          {order.description && (
                            <p className="text-xs text-white/40 mt-1 line-clamp-1">
                              {order.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status & Date */}
                      <div className="flex flex-col md:items-end gap-2 text-left md:text-right w-full md:w-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <p className="text-sm text-white/40">{order.date}</p>
                        {order.startDate && order.endDate && (
                          <p className="text-xs text-white/30">
                            {formatDate(order.startDate)} - {formatDate(order.endDate)}
                          </p>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:border-l md:border-white/10 md:pl-6">
                        <div>
                          <p className="font-bold text-white">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                          </p>
                          {order.quantity > 1 && (
                            <p className="text-xs text-white/40">{order.quantity}x item</p>
                          )}
                        </div>
                        <Link 
                          to={`/order/${order.id}/detail`}
                          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                        >
                          Detail →
                        </Link>
                      </div>
                    </div>

                    {/* Cancellation Reason */}
                    {order.status === 'cancelled' && order.cancellationReason && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-red-400/80">
                          <span className="font-medium">Alasan pembatalan:</span> {order.cancellationReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Belum ada order</h3>
                  <p className="text-white/60 mb-6">
                    {activeTab === 'all' 
                      ? 'Anda belum memiliki order apapun.' 
                      : `Tidak ada order dengan status "${tabs.find(t => t.id === activeTab)?.label}".`}
                  </p>
                  {userProfile?.user_type !== 'influencer' && (
                    <Link to="/influencers" className="btn-primary">
                      Cari Influencer
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order Stats */}
          {!loading && !error && orders.length > 0 && (
            <div className="mt-8 p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                  <p className="text-xs text-white/60">Total Order</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {orders.filter(o => o.status === 'completed').length}
                  </p>
                  <p className="text-xs text-white/60">Selesai</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {orders.filter(o => o.status === 'active').length}
                  </p>
                  <p className="text-xs text-white/60">Aktif</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-400">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR', 
                      minimumFractionDigits: 0,
                      notation: 'compact'
                    }).format(orders.reduce((sum, o) => sum + (o.amount || 0), 0))}
                  </p>
                  <p className="text-xs text-white/60">Total Nilai</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
