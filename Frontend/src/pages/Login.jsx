import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoginForm from '../components/Forms/LoginForm';

function Login() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Content */}
            <div className="hidden lg:block">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl xl:text-5xl font-bold text-gradient mb-6">
                  Welcome Back!
                </h1>
                <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Sign in to continue your search for the perfect PG accommodation.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Advanced Search</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Find PGs with personalized filters</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Save Favorites</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Bookmark your preferred PGs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Direct Contact</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Connect with PG owners instantly</p>
                    </div>
                  </div>
                </div>
                
                <div className="card mt-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>500+</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Verified PGs</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>98%</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Satisfaction Rate</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>24/7</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Login;
