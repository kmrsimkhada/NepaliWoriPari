import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article className="business-card">
      <div className="business-card-header">
        <span className="business-category-icon">{business.category_icon}</span>
        <div className="business-card-meta">
          <span className="business-category-tag">{business.category_name}</span>
          <span className="business-location">
            📍 {business.city}, {business.state}
            {business.distance_km !== undefined && (
              <span className="business-distance"> • {business.distance_km.toFixed(1)} km away</span>
            )}
          </span>
        </div>
      </div>
      <h3 className="business-name">{business.name}</h3>
      {business.description && (
        <p className="business-description">{business.description}</p>
      )}
      <div className="business-contact">
        {business.phone && (
          <a href={`tel:${business.phone}`} className="business-phone" aria-label={`Call ${business.name}`}>
            📞 {business.phone}
          </a>
        )}
        {business.email && (
          <a href={`mailto:${business.email}`} className="business-email" aria-label={`Email ${business.name}`}>
            ✉️ {business.email}
          </a>
        )}
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="business-website"
            aria-label={`Visit ${business.name} website`}
          >
            🌐 Website
          </a>
        )}
      </div>
      {business.is_featured && <span className="featured-badge">⭐ Featured</span>}
    </article>
  );
}
