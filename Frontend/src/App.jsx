
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PGListings from './pages/PGListings';
import PGDetails from './pages/PGDetails';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<PGListings />} />
          <Route path="/pg-listings" element={<PGListings />} />
          <Route path="/pg/:id" element={<PGDetails />} />
          <Route path="/pg-details/:id" element={<PGDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;