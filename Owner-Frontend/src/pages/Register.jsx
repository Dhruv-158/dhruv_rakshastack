import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RegisterForm from '../components/forms/RegisterForm';
import { useApp } from '../context/AppContext';

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

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
                  Join as Owner!
                </h1>
                <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Start your journey as a PG owner and manage your properties with ease.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Quick Setup</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Get started in just a few minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Fast Management</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Efficient tools for property management</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Secure Platform</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>Your data is protected and secure</p>
                    </div>
                  </div>
                </div>
                
                <div className="card mt-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Free</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>To Start</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>24/7</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Support</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>Easy</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Setup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Register Form */}
            <div className="w-full">
              <RegisterForm onSuccess={handleRegisterSuccess} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Register;
