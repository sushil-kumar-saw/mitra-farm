import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepages from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import FarmerDashboard from "./Pages/FarmerDashboard";
import BuyerDashboard from "./Pages/BuyerDashboard";
import CommunityDiscussion from "./Pages/CommunityDiscussion";
import ListAgriWaste from "./Pages/List";
import BuyerAnalytics from "./Pages/BuyerAnalytics";
import FarmMitraLearningHub from "./Pages/Learning";
import ESGReportsDashboard from "./Pages/Egs";

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/" element={<Homepages />} />
        <Route 
          path="/auth/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/farmer" 
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/buyer" 
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <CommunityDiscussion />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/list" 
          element={
            <ProtectedRoute>
              <ListAgriWaste />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <FarmMitraLearningHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Esg" 
          element={
            <ProtectedRoute>
              <ESGReportsDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <BuyerAnalytics />
            </ProtectedRoute>
          } 
        />
         
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
