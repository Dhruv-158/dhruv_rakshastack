import React from 'react';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--color-card-bg)', 
      borderTop: '1px solid var(--color-border)',
      marginTop: 'auto'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-gradient">
                PG Finder
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }} className="mb-4 max-w-md">
              Find your perfect paying guest accommodation with ease. Browse through verified listings and connect with trusted PG owners.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="nav-link">Home</a></li>
              <li><a href="/pg-listings" className="nav-link">Browse PGs</a></li>
              <li><a href="/login" className="nav-link">Sign In</a></li>
              <li><a href="/register" className="nav-link">Sign Up</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Contact Us</h3>
            <div className="space-y-2">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="block">📧 info@pgfinder.com</span>
              </p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="block">📞 +91-9876543210</span>
              </p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="block">📍 Ahmedabad, Gujarat</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="divider"></div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
            &copy; 2025 PG Finder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="nav-link text-sm">Privacy Policy</a>
            <a href="#" className="nav-link text-sm">Terms of Service</a>
            <a href="#" className="nav-link text-sm">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;