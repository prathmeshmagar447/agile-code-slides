
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDashboard from './pages/CompanyDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { BiddingProvider } from './contexts/BiddingContext';
import BiddingSystemRoutes from './components/bidding/BiddingSystemRoutes';

function App() {
  return (
    <AuthProvider>
      <BiddingProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company/*" element={<CompanyDashboard />} />
          <Route path="/consumer/*" element={<ConsumerDashboard />} />
          <Route path="/supplier/*" element={<SupplierDashboard />} />
          <Route path="/bids/*" element={<BiddingSystemRoutes />} />
        </Routes>
      </BiddingProvider>
    </AuthProvider>
  );
}

export default App;
