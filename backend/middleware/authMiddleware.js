import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get JWT_SECRET at runtime (not module load time)
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is missing from environment variables');
    // Use a fallback for development (not recommended for production)
    return process.env.NODE_ENV === 'production' ? null : 'fallback-secret-key-change-in-production';
  }
  return secret;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const JWT_SECRET = getJWTSecret();
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is missing - cannot verify token');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};