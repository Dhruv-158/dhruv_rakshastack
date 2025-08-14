import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useApp } from '../context/AppContext';

function Bookings() {
  const { bookings } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusClasses = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-orange-100 text-orange-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Bookings Management</h1>
          
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Bookings</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'active').length}
              </p>
              <p className="text-gray-600">Active Bookings</p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {bookings.filter(b => b.paymentStatus === 'pending').length}
              </p>
              <p className="text-gray-600">Pending Payments</p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ₹{bookings.filter(b => b.status === 'active').reduce((sum, b) => sum + b.rent, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Monthly Revenue</p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Tenant Details</th>
                  <th className="text-left py-3 px-4 font-semibold">Property</th>
                  <th className="text-left py-3 px-4 font-semibold">Room</th>
                  <th className="text-left py-3 px-4 font-semibold">Rent</th>
                  <th className="text-left py-3 px-4 font-semibold">Check-in</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.tenantName}</p>
                        <p className="text-sm text-gray-600">{booking.tenantPhone}</p>
                        <p className="text-sm text-gray-600">{booking.tenantEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{booking.pgName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{booking.roomNumber}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">₹{booking.rent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">+ ₹{booking.deposit.toLocaleString()} deposit</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      {booking.checkOut && (
                        <p className="text-sm text-gray-600">
                          Out: {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-4">
                      {getPaymentBadge(booking.paymentStatus)}
                      <p className="text-sm text-gray-600">
                        Last: {new Date(booking.lastPayment).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </button>
                        {booking.status === 'active' && (
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No bookings found for the selected filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Bookings;
