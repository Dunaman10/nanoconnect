-- ============================================
-- NANOCONNECT DATABASE SCHEMA
-- Platform: Supabase / PostgreSQL
-- Generated: 2026-02-02
-- Description: Influencer Marketing Marketplace
-- ============================================

-- Enable UUID extension (Supabase biasanya sudah aktif)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- User type enum
CREATE TYPE user_type AS ENUM ('sme', 'influencer', 'admin');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');

-- Social platform enum
CREATE TYPE social_platform AS ENUM ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'other');

-- ============================================
-- TABLE: users
-- Menyimpan data semua pengguna (SME, Influencer, Admin)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    user_type user_type NOT NULL DEFAULT 'sme',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian cepat
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- TABLE: influencers
-- Menyimpan profil detail influencer
-- ============================================
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(100),
    social_platform social_platform NOT NULL DEFAULT 'instagram',
    username VARCHAR(100) NOT NULL,
    followers_count INTEGER DEFAULT 0 CHECK (followers_count >= 0),
    engagement_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (engagement_rate >= 0 AND engagement_rate <= 100),
    niche VARCHAR(100),
    sub_niche VARCHAR(100),
    price_per_post DECIMAL(15,2) DEFAULT 0.00 CHECK (price_per_post >= 0),
    price_per_story DECIMAL(15,2) DEFAULT 0.00 CHECK (price_per_story >= 0),
    price_per_video DECIMAL(15,2) DEFAULT 0.00 CHECK (price_per_video >= 0),
    portfolio_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    response_time_hours INTEGER DEFAULT 24 CHECK (response_time_hours > 0),
    total_orders INTEGER DEFAULT 0 CHECK (total_orders >= 0),
    average_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian dan filter
CREATE INDEX idx_influencers_user_id ON influencers(user_id);
CREATE INDEX idx_influencers_niche ON influencers(niche);
CREATE INDEX idx_influencers_social_platform ON influencers(social_platform);
CREATE INDEX idx_influencers_followers_count ON influencers(followers_count);
CREATE INDEX idx_influencers_price_per_post ON influencers(price_per_post);
CREATE INDEX idx_influencers_is_available ON influencers(is_available);
CREATE INDEX idx_influencers_average_rating ON influencers(average_rating);

-- ============================================
-- TABLE: orders
-- Menyimpan pesanan/transaksi antara SME dan Influencer
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) NOT NULL UNIQUE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE RESTRICT,
    sme_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_status order_status NOT NULL DEFAULT 'pending',
    description TEXT,
    content_type VARCHAR(50), -- 'post', 'story', 'video', 'bundle'
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(15,2) NOT NULL CHECK (total_price >= 0),
    platform_fee DECIMAL(15,2) DEFAULT 0.00 CHECK (platform_fee >= 0),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint untuk validasi tanggal
    CONSTRAINT chk_order_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Index untuk pencarian dan filter
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_influencer_id ON orders(influencer_id);
CREATE INDEX idx_orders_sme_id ON orders(sme_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================
-- TABLE: reviews
-- Menyimpan ulasan/rating dari SME untuk Influencer
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_influencer_id ON reviews(influencer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_public ON reviews(is_public);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk setiap tabel
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at
    BEFORE UPDATE ON influencers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Update influencer average rating
-- ============================================
CREATE OR REPLACE FUNCTION update_influencer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE influencers
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE influencer_id = NEW.influencer_id AND is_public = TRUE
        ),
        total_orders = (
            SELECT COUNT(*) 
            FROM orders 
            WHERE influencer_id = NEW.influencer_id AND order_status = 'completed'
        )
    WHERE id = NEW.influencer_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_after_review
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_influencer_rating();

-- ============================================
-- FUNCTION: Generate order number
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- ============================================
-- ROW LEVEL SECURITY (RLS) untuk Supabase
-- ============================================

-- Enable RLS pada semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users bisa lihat profile sendiri dan public profiles
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id OR is_active = TRUE);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Public bisa lihat influencer yang available
CREATE POLICY "Anyone can view available influencers" ON influencers
    FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Influencer can update own profile" ON influencers
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Orders hanya bisa dilihat oleh pihak terkait
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() = sme_id OR 
        auth.uid() IN (SELECT user_id FROM influencers WHERE id = orders.influencer_id)
    );

-- Policy: Reviews public bisa dilihat semua, private hanya pemilik
CREATE POLICY "Anyone can view public reviews" ON reviews
    FOR SELECT USING (is_public = TRUE OR auth.uid() = reviewer_id);

-- ============================================
-- SAMPLE DATA (Max 5 records per table)
-- ============================================

-- Sample Users (5 users: 1 admin, 2 SME, 2 influencers)
INSERT INTO users (id, name, email, password, phone, avatar_url, user_type, is_verified, is_active) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Admin NanoConnect', 'admin@nanoconnect.id', '$2b$10$hashedpassword1', '+6281234567890', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin', TRUE, TRUE),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Toko Kopi Nusantara', 'tokokopi@email.com', '$2b$10$hashedpassword2', '+6281234567891', 'https://api.dicebear.com/7.x/avataaars/svg?seed=kopi', 'sme', TRUE, TRUE),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Beauty Shop Jakarta', 'beautyshop@email.com', '$2b$10$hashedpassword3', '+6281234567892', 'https://api.dicebear.com/7.x/avataaars/svg?seed=beauty', 'sme', TRUE, TRUE),
('d4e5f6a7-b8c9-0123-def1-234567890123', 'Rina Wijaya', 'rina.influencer@email.com', '$2b$10$hashedpassword4', '+6281234567893', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rina', 'influencer', TRUE, TRUE),
('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Budi Santoso', 'budi.content@email.com', '$2b$10$hashedpassword5', '+6281234567894', 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi', 'influencer', TRUE, TRUE);

-- Sample Influencers (2 influencers, 1 profile per user)
INSERT INTO influencers (id, user_id, bio, location, social_platform, username, followers_count, engagement_rate, niche, sub_niche, price_per_post, price_per_story, price_per_video, portfolio_url, is_available, response_time_hours) VALUES
('f1a2b3c4-d5e6-7890-1234-567890abcdef', 'd4e5f6a7-b8c9-0123-def1-234567890123', 'Beauty & Lifestyle Content Creator 💄✨ Sharing skincare tips and makeup tutorials!', 'Jakarta, Indonesia', 'instagram', '@rinawijaya_', 150000, 4.50, 'Beauty & Lifestyle', 'Skincare', 2500000.00, 1000000.00, 5000000.00, 'https://portfolio.rina.id', TRUE, 12),
('f2b3c4d5-e6f7-8901-2345-678901bcdef0', 'e5f6a7b8-c9d0-1234-ef12-345678901234', 'Food & Travel Vlogger 🍜✈️ Exploring hidden gems across Indonesia!', 'Bandung, Indonesia', 'youtube', 'BudiSantosoVlog', 85000, 6.20, 'Food & Travel', 'Culinary Review', 3000000.00, 800000.00, 7500000.00, 'https://youtube.com/budisantoso', TRUE, 24);

-- Sample Orders (5 orders dengan berbagai status)
INSERT INTO orders (id, order_number, influencer_id, sme_id, order_status, description, content_type, quantity, unit_price, total_price, platform_fee, start_date, end_date, notes) VALUES
('01234567-89ab-cdef-0123-456789abcdef', 'ORD-20260201-0001', 'f1a2b3c4-d5e6-7890-1234-567890abcdef', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'completed', 'Promosi produk kopi arabica premium', 'post', 2, 2500000.00, 5000000.00, 500000.00, '2026-01-15', '2026-01-20', 'Include product placement dan honest review'),
('12345678-9abc-def0-1234-56789abcdef0', 'ORD-20260201-0002', 'f2b3c4d5-e6f7-8901-2345-678901bcdef0', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'in_progress', 'Video review cafe visit', 'video', 1, 7500000.00, 7500000.00, 750000.00, '2026-02-01', '2026-02-10', 'Full cafe experience dengan review menu'),
('23456789-abcd-ef01-2345-6789abcdef01', 'ORD-20260201-0003', 'f1a2b3c4-d5e6-7890-1234-567890abcdef', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'pending', 'TikTok challenge skincare routine', 'video', 3, 3000000.00, 9000000.00, 900000.00, '2026-02-05', '2026-02-15', 'Trending challenge dengan produk skincare baru'),
('3456789a-bcde-f012-3456-789abcdef012', 'ORD-20260201-0004', 'f1a2b3c4-d5e6-7890-1234-567890abcdef', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'accepted', 'Instagram story series makeup tutorial', 'story', 5, 1000000.00, 5000000.00, 500000.00, '2026-02-03', '2026-02-07', 'Daily makeup tips dengan produk sponsor'),
('456789ab-cdef-0123-4567-89abcdef0123', 'ORD-20260201-0005', 'f2b3c4d5-e6f7-8901-2345-678901bcdef0', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'cancelled', 'Review perjalanan ke destinasi wisata', 'video', 1, 7500000.00, 7500000.00, 0.00, NULL, NULL, NULL);

-- Update cancelled order
UPDATE orders SET cancelled_at = NOW(), cancellation_reason = 'Perubahan budget marketing dari klien' WHERE id = '456789ab-cdef-0123-4567-89abcdef0123';

-- Update completed order
UPDATE orders SET completed_at = '2026-01-20 18:30:00+07' WHERE id = '01234567-89ab-cdef-0123-456789abcdef';

-- Sample Reviews (1 review untuk order yang completed - karena 1 order hanya bisa punya 1 review)
INSERT INTO reviews (id, order_id, reviewer_id, influencer_id, rating, comment, is_public, is_verified) VALUES
('56789abc-def0-1234-5678-9abcdef01234', '01234567-89ab-cdef-0123-456789abcdef', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'f1a2b3c4-d5e6-7890-1234-567890abcdef', 5, 'Rina sangat profesional! Kontennya berkualitas tinggi dan engagement dari followersnya sangat bagus. Penjualan kopi kami meningkat 30% setelah campaign ini. Highly recommended! 🌟', TRUE, TRUE);

-- ============================================
-- VIEWS untuk reporting (opsional)
-- ============================================

-- View: Influencer dengan statistik lengkap
CREATE VIEW v_influencer_stats AS
SELECT 
    i.id,
    u.name,
    u.email,
    u.avatar_url,
    i.social_platform,
    i.username,
    i.followers_count,
    i.engagement_rate,
    i.niche,
    i.price_per_post,
    i.average_rating,
    i.total_orders,
    i.is_available,
    i.location
FROM influencers i
JOIN users u ON i.user_id = u.id
WHERE u.is_active = TRUE AND i.is_available = TRUE;

-- View: Order summary
CREATE VIEW v_order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.order_status,
    o.total_price,
    o.created_at,
    sme.name as sme_name,
    inf_user.name as influencer_name,
    i.username as influencer_username,
    i.social_platform
FROM orders o
JOIN users sme ON o.sme_id = sme.id
JOIN influencers i ON o.influencer_id = i.id
JOIN users inf_user ON i.user_id = inf_user.id;

-- ============================================
-- COMMENTS untuk dokumentasi
-- ============================================
COMMENT ON TABLE users IS 'Tabel utama menyimpan semua pengguna sistem (SME, Influencer, Admin)';
COMMENT ON TABLE influencers IS 'Profil detail influencer dengan statistik dan pricing';
COMMENT ON TABLE orders IS 'Transaksi/pesanan antara SME dan Influencer';
COMMENT ON TABLE reviews IS 'Ulasan dan rating dari SME untuk Influencer setelah order selesai';

COMMENT ON COLUMN influencers.engagement_rate IS 'Persentase engagement (0-100%)';
COMMENT ON COLUMN influencers.response_time_hours IS 'Rata-rata waktu respon dalam jam';
COMMENT ON COLUMN orders.platform_fee IS 'Biaya platform/komisi dari transaksi';
