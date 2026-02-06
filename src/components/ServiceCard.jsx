const ServiceCard = ({ service, onSelect }) => {
  const {
    id,
    name,
    description,
    icon,
    priceRange,
    features,
    popular,
  } = service;

  const icons = {
    content: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    review: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    story: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    event: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    affiliate: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  };

  return (
    <div className={`card p-6 relative ${popular ? 'border-primary-500' : ''}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Populer
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center mb-6 text-primary-400">
        {icons[icon] || icons.content}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
      <p className="text-white/60 mb-4">{description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-2xl font-bold gradient-text">{priceRange}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3 text-white/80">
            <svg className="w-5 h-5 text-accent-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button 
        onClick={() => onSelect && onSelect(service)}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          popular 
            ? 'btn-primary' 
            : 'border-2 border-white/20 text-white hover:bg-white/10'
        }`}
      >
        Pilih Layanan
      </button>
    </div>
  );
};

export default ServiceCard;
