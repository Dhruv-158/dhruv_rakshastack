
import React from 'react';
import useForm from '../../hook/useForm';

function LoginForm() {
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false
  };

  const validate = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(initialValues, validate);

  const onSubmit = (formData) => {
    console.log('Login data:', formData);
    // Add login logic here
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <div className="card-header text-center">
          <h2 className="card-title text-gradient text-3xl">
            Welcome Back
          </h2>
          <p className="card-description">
            Sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${
                touched.email && errors.email 
                  ? 'border-red-500' 
                  : ''
              }`}
            />
            {touched.email && errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${
                touched.password && errors.password 
                  ? 'border-red-500' 
                  : ''
              }`}
            />
            {touched.password && errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Remember me</span>
            </label>
            <a href="#" className="nav-link text-sm">
              Forgot password?
            </a>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="spinner mr-2"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="text-center pt-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <a href="#" className="nav-link font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
