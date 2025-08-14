
function RegisterForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <div className="card-header text-center">
          <h2 className="card-title text-gradient text-3xl">
            Create Account
          </h2>
          <p className="card-description">
            Join us to find your perfect PG
          </p>
        </div>
        
        <form className="space-y-6">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              className="input"
            />
          </div>
          
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              className="input"
            />
          </div>
          
          <div className="form-group">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              required 
              className="input"
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="input"
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              required 
              className="input"
            />
          </div>
          
          <div className="flex items-start">
            <input 
              type="checkbox" 
              id="terms"
              required
              className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              I agree to the{' '}
              <a href="#" className="nav-link font-semibold">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="nav-link font-semibold">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full"
          >
            Create Account
          </button>
          
          <div className="text-center pt-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <a href="#" className="nav-link font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
