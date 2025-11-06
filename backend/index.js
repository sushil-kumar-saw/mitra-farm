import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import listingsRoutes from "./routes/listings.js";
import statsRoutes from "./routes/stats.js";

const app = express();

// Your environment check log here (optional)
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI ? 'exists' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing'
});

// ... rest of your setup (CORS, middleware, routes, etc.)

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/stats', statsRoutes);

// error middleware...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
