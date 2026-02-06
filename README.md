# 🚀 NanoConnect

Platform penghubung **Nano Creator** (1K-20K followers) dengan **UMKM** untuk iklan yang terjangkau dan efektif.

![NanoConnect Banner](https://via.placeholder.com/1200x400/1e1b4b/ffffff?text=NanoConnect+-+Influencer+Marketing+untuk+UMKM)

## ✨ Features

- **🎯 Smart Matching Engine** - Algoritma cerdas mencocokkan UMKM dengan influencer yang tepat
- **💬 Chat Influencer** - Komunikasi langsung dengan nano creator
- **📦 Order Layanan** - Sistem pemesanan yang mudah dan aman
- **💳 Multiple Payment** - Berbagai metode pembayaran tersedia
- **⭐ Review & Rating** - Sistem transparansi untuk kepuasan bersama
- **📊 Analytics Dashboard** - Pantau performa kampanye secara real-time

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Backend | EdgeOne Functions |
| Icons | Heroicons (SVG) |
| Fonts | Google Fonts (Inter) |

## 💰 Kategori Layanan

| Layanan | Harga |
|---------|-------|
| UGC Content Creation | Rp 10K - 50K |
| Product Review | Rp 20K - 100K |
| Story Takeover | Rp 5K - 25K |
| Event Coverage | Rp 50K - 200K |
| Affiliate Program | Commission-based |

## 📁 Project Structure

```
nanoconnect/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── InfluencerCard.jsx
│   │   └── ServiceCard.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Influencers.jsx
│   │   ├── InfluencerDetail.jsx
│   │   ├── Chat.jsx
│   │   ├── Order.jsx
│   │   ├── Terms.jsx
│   │   └── Privacy.jsx
│   ├── lib/                # Utilities & configs
│   │   └── supabase.js
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── functions/              # EdgeOne serverless functions
│   └── api.js
├── edgeone.json            # EdgeOne deployment config
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
├── nanoconnect_database.sql # Database schema for Supabase
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dunaman10/nanoconnect.git
   cd nanoconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to Supabase Dashboard → SQL Editor
   - Run the `nanoconnect_database.sql` script

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## 🌐 Deployment (EdgeOne)

This project is configured for EdgeOne deployment:

```bash
# Build the project
npm run build

# Deploy to EdgeOne (follow EdgeOne CLI instructions)
edgeone deploy
```

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Landing page dengan hero dan fitur unggulan |
| About | `/about` | Tentang platform dan tim |
| Influencers | `/influencers` | Daftar nano creator dengan filter |
| Influencer Detail | `/influencer/:id` | Profil lengkap, portfolio, dan layanan |
| Chat | `/chat/:id` | Real-time messaging dengan influencer |
| Order | `/order/:id` | Form pemesanan layanan |
| Terms | `/terms` | Syarat dan ketentuan |
| Privacy | `/privacy` | Kebijakan privasi |

## 🎨 Design System

- **Colors**: Gradient primary (Indigo `#6366f1` → Green `#10b981`)
- **Background**: Dark slate (`#0f172a`, `#1e1b4b`)
- **Typography**: Inter font family
- **Components**: Glassmorphism with subtle borders
- **Animations**: Float, pulse, gradient animations
- **Responsive**: Mobile-first approach

## 🔒 Security Features

- ✅ SSL/TLS encryption
- ✅ Secure payment processing (Escrow system)
- ✅ Row Level Security (RLS) in Supabase
- ✅ Input validation
- ✅ CORS protection

## 📧 Contact

- **Email**: hello@nanoconnect.id
- **Phone**: 0812-3456-7890
- **Location**: Jakarta, Indonesia

## 📄 License

© 2026 NanoConnect. All rights reserved.

---

<p align="center">
  Made with ❤️ in Indonesia
</p>
