import React from 'react';

// Simplified PublicRoute - just render children without auth check
// This ensures login/register pages always show
const PublicRoute = ({ children }) => {
  return <>{children}</>;
};

export default PublicRoute;

