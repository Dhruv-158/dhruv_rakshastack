import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ownerData, staticPGs, staticBookings } from '../data/staticData';

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ADD_PG: 'ADD_PG',
  UPDATE_PG: 'UPDATE_PG',
  DELETE_PG: 'DELETE_PG',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  pgs: staticPGs,
  bookings: staticBookings,
  loading: false,
  error: null
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        user: ownerData,
        isAuthenticated: true,
        error: null
      };
    
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    
    case ACTIONS.ADD_PG:
      const newPG = {
        ...action.payload,
        id: Date.now(),
        occupiedRooms: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      return {
        ...state,
        pgs: [...state.pgs, newPG]
      };
    
    case ACTIONS.UPDATE_PG:
      return {
        ...state,
        pgs: state.pgs.map(pg => 
          pg.id === action.payload.id ? { ...pg, ...action.payload } : pg
        )
      };
    
    case ACTIONS.DELETE_PG:
      return {
        ...state,
        pgs: state.pgs.filter(pg => pg.id !== action.payload),
        bookings: state.bookings.filter(booking => booking.pgId !== action.payload)
      };
    
    case ACTIONS.ADD_BOOKING:
      const newBooking = {
        ...action.payload,
        id: Date.now(),
        status: 'active',
        paymentStatus: 'paid',
        lastPayment: new Date().toISOString().split('T')[0]
      };
      return {
        ...state,
        bookings: [...state.bookings, newBooking]
      };
    
    case ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? { ...booking, ...action.payload } : booking
        )
      };
    
    case ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('owner_user');
    const savedPGs = localStorage.getItem('owner_pgs');
    const savedBookings = localStorage.getItem('owner_bookings');

    if (savedUser) {
      dispatch({ type: ACTIONS.LOGIN });
    }
    if (savedPGs) {
      dispatch({ type: 'SET_PGS', payload: JSON.parse(savedPGs) });
    }
    if (savedBookings) {
      dispatch({ type: 'SET_BOOKINGS', payload: JSON.parse(savedBookings) });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('owner_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('owner_user');
    }
  }, [state.user, state.isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('owner_pgs', JSON.stringify(state.pgs));
  }, [state.pgs]);

  useEffect(() => {
    localStorage.setItem('owner_bookings', JSON.stringify(state.bookings));
  }, [state.bookings]);

  // Action creators
  const actions = {
    login: (credentials) => {
      // Simple static login - in real app, this would validate credentials
      if (credentials.email && credentials.password) {
        dispatch({ type: ACTIONS.LOGIN });
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    },
    
    logout: () => {
      dispatch({ type: ACTIONS.LOGOUT });
    },
    
    addPG: (pgData) => {
      dispatch({ type: ACTIONS.ADD_PG, payload: pgData });
    },
    
    updatePG: (pgData) => {
      dispatch({ type: ACTIONS.UPDATE_PG, payload: pgData });
    },
    
    deletePG: (pgId) => {
      dispatch({ type: ACTIONS.DELETE_PG, payload: pgId });
    },
    
    addBooking: (bookingData) => {
      dispatch({ type: ACTIONS.ADD_BOOKING, payload: bookingData });
    },
    
    updateBooking: (bookingData) => {
      dispatch({ type: ACTIONS.UPDATE_BOOKING, payload: bookingData });
    },
    
    updateProfile: (profileData) => {
      dispatch({ type: ACTIONS.UPDATE_PROFILE, payload: profileData });
    }
  };

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { ACTIONS };
