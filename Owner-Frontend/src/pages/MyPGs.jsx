import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function MyPGs() {
  const { pgs, deletePG } = useApp();

  const handleDelete = (pgId) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deletePG(pgId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gradient">My Properties</h1>
        <Link to="/add-pg" className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Property
        </Link>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{pgs.length}</p>
              <p className="text-gray-600">Total Properties</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {pgs.reduce((sum, pg) => sum + pg.occupiedRooms, 0)}
              </p>
              <p className="text-gray-600">Occupied Rooms</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Math.round((pgs.reduce((sum, pg) => sum + pg.occupiedRooms, 0) / 
                  pgs.reduce((sum, pg) => sum + pg.rooms, 0)) * 100) || 0}%
              </p>
              <p className="text-gray-600">Occupancy Rate</p>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {pgs.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first PG property to begin managing your business.</p>
            <Link to="/add-pg" className="btn-primary">
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.map((pg) => (
              <div key={pg.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pg.name}</h3>
                    <p className="text-gray-600 mb-1">{pg.address}</p>
                    <p className="text-gray-600 mb-2">{pg.city}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pg.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{pg.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rent:</span>
                    <span className="font-medium">₹{pg.rent.toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-medium">{pg.occupiedRooms}/{pg.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy:</span>
                    <span className="font-medium">
                      {Math.round((pg.occupiedRooms / pg.rooms) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const amenitiesArray = Array.isArray(pg.amenities) 
                        ? pg.amenities 
                        : (typeof pg.amenities === 'string' ? pg.amenities.split(',').map(a => a.trim()) : []);
                      
                      return amenitiesArray.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ));
                    })()}
                    {(() => {
                      const amenitiesArray = Array.isArray(pg.amenities) 
                        ? pg.amenities 
                        : (typeof pg.amenities === 'string' ? pg.amenities.split(',').map(a => a.trim()) : []);
                      
                      return amenitiesArray.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{amenitiesArray.length - 3} more
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Occupancy</span>
                    <span>{pg.occupiedRooms}/{pg.rooms}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(pg.occupiedRooms / pg.rooms) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link 
                    to={`/edit-pg/${pg.id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(pg.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default MyPGs;
