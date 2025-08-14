import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Static PG data for different IDs
const staticPGData = {
  1: {
    id: 1,
    name: 'Sunrise PG',
  price: 5000,
  images: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  ],
  location: 'Maninagar, Ahmedabad',
  gender: 'Male',
  type: 'Single Occupancy',
  rating: 4.5,
  reviews: 127,
  verified: true,
  amenities: [
    { name: 'Wi-Fi', icon: '📶', available: true },
    { name: 'AC', icon: '❄️', available: true },
    { name: 'Parking', icon: '🚗', available: true },
    { name: 'Food', icon: '🍽️', available: true },
    { name: 'Laundry', icon: '👕', available: true },
    { name: 'Security', icon: '🔒', available: true },
    { name: 'Gym', icon: '💪', available: false },
    { name: 'Swimming Pool', icon: '🏊', available: false }
  ],
  description: 'Experience comfortable living at Sunrise PG, located in the heart of Maninagar. Our fully furnished rooms offer modern amenities and a homely atmosphere perfect for students and working professionals.',
  fullDescription: 'Sunrise PG is strategically located in Maninagar, one of Ahmedabad\'s prime residential areas with excellent connectivity to major IT hubs, educational institutions, and commercial centers. The property features spacious rooms with attached bathrooms, 24/7 power backup, high-speed internet, and wholesome meals. Safety and security are our top priorities with CCTV surveillance and secure entry systems.',
  contact: '9876543210',
  owner: {
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@sunrisepg.com',
    verified: true
  },
  rules: [
    'No smoking inside the premises',
    'Visitors allowed till 9 PM',
    'Maintain cleanliness in common areas',
    'No loud music after 10 PM',
    'Monthly rent to be paid by 5th of every month'
  ],
  nearbyPlaces: [
    { name: 'Metro Station', distance: '0.5 km', type: 'transport' },
    { name: 'Bus Stop', distance: '0.2 km', type: 'transport' },
    { name: 'Shopping Mall', distance: '1.2 km', type: 'shopping' },
    { name: 'Hospital', distance: '0.8 km', type: 'healthcare' },
    { name: 'Bank', distance: '0.3 km', type: 'finance' },
    { name: 'Restaurant', distance: '0.1 km', type: 'food' }
  ]
  },
  2: {
    id: 2,
    name: 'Elite Stay',
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    location: 'Satellite, Ahmedabad',
    gender: 'Female',
    type: 'Double Occupancy',
    rating: 4.8,
    reviews: 95,
    verified: true,
    amenities: [
      { name: 'Wi-Fi', icon: '📶', available: true },
      { name: 'AC', icon: '❄️', available: true },
      { name: 'Parking', icon: '🚗', available: false },
      { name: 'Food', icon: '🍽️', available: true },
      { name: 'Laundry', icon: '👕', available: true },
      { name: 'Security', icon: '🔒', available: true },
      { name: 'Gym', icon: '💪', available: true },
      { name: 'Swimming Pool', icon: '🏊', available: false }
    ],
    description: 'Experience premium living at Elite Stay, located in Satellite. Perfect for female students and professionals.',
    fullDescription: 'Elite Stay offers luxurious accommodation with modern amenities and excellent connectivity.',
    contact: '9876543211',
    owner: {
      name: 'Priya Sharma',
      phone: '9876543211',
      email: 'priya@elitestay.com',
      verified: true
    },
    rules: [
      'No smoking inside the premises',
      'Visitors allowed till 9 PM',
      'Maintain cleanliness in common areas',
      'No loud music after 10 PM',
      'Monthly rent to be paid by 5th of every month'
    ],
    nearbyPlaces: [
      { name: 'Metro Station', distance: '0.8 km', type: 'transport' },
      { name: 'Bus Stop', distance: '0.3 km', type: 'transport' },
      { name: 'Shopping Mall', distance: '0.5 km', type: 'shopping' },
      { name: 'Hospital', distance: '1.0 km', type: 'healthcare' },
      { name: 'Bank', distance: '0.2 km', type: 'finance' },
      { name: 'Restaurant', distance: '0.1 km', type: 'food' }
    ]
  }
};

function PGDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get PG data based on URL parameter, fallback to first PG if not found
  const pg = staticPGData[id] || staticPGData[1];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
            <span>›</span>
            <a href="/listings" className="hover:text-blue-600 dark:hover:text-blue-400">PG Listings</a>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{pg.name}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={pg.images[selectedImage]}
                    alt={`${pg.name} - Image ${selectedImage + 1}`}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  {pg.verified && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {pg.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-lg ${
                        selectedImage === index 
                          ? 'ring-2 ring-blue-500' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'location', label: 'Location' },
                    { id: 'rules', label: 'Rules' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{pg.fullDescription}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pg.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-xl ${
                            amenity.available
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          <span className="text-2xl">{amenity.icon}</span>
                          <span className="font-medium">{amenity.name}</span>
                          {!amenity.available && (
                            <span className="text-xs">(Not Available)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nearby Places</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pg.nearbyPlaces.map((place, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 text-sm">📍</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">{place.name}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PG Rules & Regulations</h3>
                    <ul className="space-y-3">
                      {pg.rules.map((rule, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-600 dark:text-gray-300">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pg.name}</h1>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(pg.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          {pg.rating} ({pg.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {pg.location}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">₹{pg.price.toLocaleString()}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{pg.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{pg.gender}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Contact Owner
                    </button>
                    
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      WhatsApp
                    </button>
                  </div>

                  {/* Owner Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {pg.owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                          {pg.owner.name}
                          {pg.owner.verified && (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Property Owner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">{pg.owner.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">{pg.owner.email}</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-colors">
                  Call Now
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default PGDetails;
