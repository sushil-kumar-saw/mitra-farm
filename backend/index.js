import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import listingsRoutes from "./routes/listings.js";
import statsRoutes from "./routes/stats.js";
import farmerRoutes from "./routes/farmer.js";
import buyerRoutes from "./routes/buyer.js";

const app = express();

// Your environment check log here (optional)
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI ? 'exists' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing'
});

// ... rest of your setup (CORS, middleware, routes, etc.)

// CORS configuration - allow requests from Vite dev server (default port 5173)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in environment variables');
  console.error('Please create a .env file with MONGO_URI and JWT_SECRET');
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('Please check your MONGO_URI in the .env file');
    });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});
