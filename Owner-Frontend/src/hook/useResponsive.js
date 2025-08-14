import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for window dimensions
 * @returns {Object} - Window width and height
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    // Add event listener without throttling for immediate responsiveness
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

/**
 * Custom hook for responsive breakpoints matching Tailwind CSS
 * @returns {Object} - Boolean values for different screen sizes
 */
function useBreakpoint() {
  const { width } = useWindowSize();

  const breakpoints = useMemo(() => {
    // Ensure width is a valid number
    const currentWidth = width || 1024;
    
    return {
      // Tailwind CSS breakpoints
      isMobile: currentWidth < 640,      // < sm (640px)
      isSm: currentWidth >= 640,         // sm: 640px
      isMd: currentWidth >= 768,         // md: 768px  
      isLg: currentWidth >= 1024,        // lg: 1024px
      isXl: currentWidth >= 1280,        // xl: 1280px
      is2Xl: currentWidth >= 1536,       // 2xl: 1536px
      
      // Legacy aliases for backward compatibility
      isTablet: currentWidth >= 640 && currentWidth < 1024,
      isDesktop: currentWidth >= 1024,
      isLarge: currentWidth >= 1280,
      isXLarge: currentWidth >= 1536,
    };
  }, [width]);

  return breakpoints;
}

export { useWindowSize, useBreakpoint };
