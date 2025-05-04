
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicBidFeed from './PublicBidFeed';
import CreateRfq from './CreateRfq';
import ViewResponses from './ViewResponses';
import { useAuth } from '../../contexts/AuthContext';

const BiddingSystemRoutes = () => {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PublicBidFeed />} />
      <Route 
        path="/create" 
        element={
          userRole === 'company' 
            ? <CreateRfq /> 
            : <Navigate to="/bids" replace />
        } 
      />
      <Route path="/:id/responses" element={<ViewResponses />} />
    </Routes>
  );
};

export default BiddingSystemRoutes;
