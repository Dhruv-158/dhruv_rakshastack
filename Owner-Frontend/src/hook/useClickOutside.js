import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling clicks outside of a component
 * @param {Function} handler - Function to call when clicking outside
 * @returns {Object} - Ref to attach to the component
 */
function useClickOutside(handler) {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
