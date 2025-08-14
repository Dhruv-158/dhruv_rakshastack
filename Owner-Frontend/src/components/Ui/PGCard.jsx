
import React from 'react';
import { Link } from 'react-router-dom';

function PGCard({ pg }) {
  const {
    id,
    name,
    price,
    image,
    location,
    gender,
    amenities = [],
    rating = 4.5,
    reviews = 23,
    available = true
  } = pg;

  return (
    <div className="card">
      {/* Enhanced Image Container */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-56 object-cover hover:scale-110 transition-all duration-500" 
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          <span className={`badge ${available ? 'badge-success' : 'badge-error'}`}>
            {available ? '✨ Available' : '🔒 Full'}
          </span>
          <span className="badge badge-info">
            {gender === 'Both' ? '👥 Co-living' : gender === 'Male' ? '👨 Male Only' : '👩 Female Only'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="badge badge-warning">
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            ₹{price?.toLocaleString()}/mo
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="card-header">
          <h3 className="card-title text-gradient">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="card-description flex items-center gap-2">
              <span className="text-lg">📍</span>
              {location}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                {rating}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ({reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Beautiful Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="badge"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="badge badge-info">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link to={`/pg-details/${id}`} className="btn-primary w-full text-center no-underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PGCard;
