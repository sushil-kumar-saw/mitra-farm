import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is missing');
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