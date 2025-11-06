import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Farmer from "../models/Farmer.js";
import Buyer from "../models/Buyer.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!['farmer', 'buyer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    if (role === "farmer") {
      await Farmer.create({ userId: newUser._id });
    } else if (role === "buyer") {
      await Buyer.create({ userId: newUser._id });
    }

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!role || (role !== 'farmer' && role !== 'buyer')) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    let roleExists = false;
    if (role === 'farmer') {
      roleExists = await Farmer.findOne({ userId: user._id });
    } else if (role === 'buyer') {
      roleExists = await Buyer.findOne({ userId: user._id });
    }

    if (!roleExists) {
      return res.status(400).json({ success: false, message: 'Role does not match user' });
    }

    // Get JWT_SECRET inside function (runtime)
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Check if user has farmer or buyer profile
    const farmer = await Farmer.findOne({ userId: user._id });
    const buyer = await Buyer.findOne({ userId: user._id });
    
    const role = farmer ? 'farmer' : buyer ? 'buyer' : null;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 0 // Expire immediately
    });

    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
