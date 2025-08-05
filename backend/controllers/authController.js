import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validators/authValidation.js';

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '3d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000
  });
};

export const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ username, email, password });
  generateToken(res, user._id, user.role);

  res.status(201).json({ message: 'Registration successful', user: { id: user._id, username, email, role: user.role } });
};

export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  generateToken(res, user._id, user.role);

  res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email, role: user.role } });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.status(200).json(user);
};
