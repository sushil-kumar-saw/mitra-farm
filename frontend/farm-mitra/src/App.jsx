import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepages from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorBoundary from "./components/ErrorBoundary";
import FarmerDashboard from "./Pages/FarmerDashboard";
import BuyerDashboard from "./Pages/BuyerDashboard";
import CommunityDiscussion from "./Pages/CommunityDiscussion"; // <-- Import here
import ListAgriWaste from "./Pages/List";
import BuyerAnalytics from "./Pages/BuyerAnalytics";
import FarmMitraLearningHub from "./Pages/Learning";
import ESGReportsDashboard from "./Pages/Egs";

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Homepages />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/community" element={<CommunityDiscussion />} />  {/* <-- New route */}
         <Route path="/list" element={< ListAgriWaste/>} />
         <Route path="/chatbot" element={<FarmMitraLearningHub/>} />
         <Route path="/Esg" element={<ESGReportsDashboard/>} />
          <Route path="/" element={<BuyerAnalytics/>} />
         
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
