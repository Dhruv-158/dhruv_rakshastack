import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useApp } from '../context/AppContext';

function Home() {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl xl:text-6xl font-bold text-gradient mb-6">
            Owner Dashboard
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your PG properties, track bookings, and grow your business with our comprehensive owner management platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Login to Dashboard
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Register as Owner
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-4"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
              Everything you need to manage your PG business efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Property Management
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Easily add, edit, and manage all your PG properties from one central dashboard.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Tenant Management
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Track bookings, manage tenant information, and handle check-ins/check-outs efficiently.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Revenue Tracking
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Monitor your earnings, track payments, and get detailed financial insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-xl opacity-90">Registered Owners</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">2000+</h3>
              <p className="text-xl opacity-90">Properties Listed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">10000+</h3>
              <p className="text-xl opacity-90">Happy Tenants</p>
            </div>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  );
}

export default Home;
