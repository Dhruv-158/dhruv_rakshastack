/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          bg: '#F5F7FA',
          primary: '#3B82F6',
          secondary: '#F59E0B',
          text: '#111827',
          'text-secondary': '#6B7280',
          border: '#E5E7EB',
          success: '#22C55E',
          error: '#EF4444',
        },
        // Dark Mode Colors
        dark: {
          bg: '#121622',
          primary: '#4F46E5',
          secondary: '#FBBF24',
          text: '#E0E7FF',
          'text-secondary': '#9CA3AF',
          border: '#374151',
          success: '#22C55E',
          error: '#EF4444',
        },
        // Custom color palette for direct usage
        custom: {
          // Light mode
          'bg-light': '#F5F7FA',
          'primary-light': '#3B82F6',
          'secondary-light': '#F59E0B',
          'text-light': '#111827',
          'text-secondary-light': '#6B7280',
          'border-light': '#E5E7EB',
          
          // Dark mode
          'bg-dark': '#121622',
          'primary-dark': '#4F46E5',
          'secondary-dark': '#FBBF24',
          'text-dark': '#E0E7FF',
          'text-secondary-dark': '#9CA3AF',
          'border-dark': '#374151',
          
          // Shared colors
          'success': '#22C55E',
          'error': '#EF4444',
        }
      },
      backgroundColor: {
        'app-light': '#F5F7FA',
        'app-dark': '#121622',
      },
      textColor: {
        'app-light': '#111827',
        'app-dark': '#E0E7FF',
        'app-secondary-light': '#6B7280',
        'app-secondary-dark': '#9CA3AF',
      },
      borderColor: {
        'app-light': '#E5E7EB',
        'app-dark': '#374151',
      }
    },
  },
  plugins: [],
}

