import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validators/authValidation.js';

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };

  res.cookie('jwt', token, cookieOptions);

  return token;
};

export const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ username, email, password });
  const token = generateToken(res, user._id, user.role);

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
    token,
  });
};

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(res, user._id, user.role);

  res.json({
    message: 'Login successful',
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
    token,
  });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  // req.user.id je postavljeno u protect middleware
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Not authorized' });

  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
};
