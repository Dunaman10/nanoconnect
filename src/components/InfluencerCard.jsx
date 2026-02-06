import { Link } from 'react-router-dom';

const InfluencerCard = ({ influencer }) => {
  const {
    id,
    name,
    username,
    avatar,
    platform,
    followers,
    engagementRate,
    niche,
    priceRange,
    rating,
    isVerified,
  } = influencer;

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const platformIcons = {
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  };

  return (
    <Link 
      to={`/influencer/${id}`}
      className="card card-hover p-6 block group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20 group-hover:border-primary-500 transition-colors"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
              {name}
            </h3>
            <div className="flex items-center space-x-2 text-white/60">
              {platformIcons[platform]}
              <span className="text-sm">{username}</span>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-yellow-500">{rating}</span>
        </div>
      </div>

      {/* Niche Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full">
          {niche}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold gradient-text">{formatFollowers(followers)}</p>
          <p className="text-xs text-white/60">Followers</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold gradient-text">{engagementRate}%</p>
          <p className="text-xs text-white/60">Engagement</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <p className="text-xs text-white/60">Mulai dari</p>
          <p className="font-semibold text-accent-400">{priceRange}</p>
        </div>
        <div className="btn-primary text-sm py-2 px-4 group-hover:scale-105">
          Lihat Profil
        </div>
      </div>
    </Link>
  );
};

export default InfluencerCard;
