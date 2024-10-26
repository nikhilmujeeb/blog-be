import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';
import User from '../model/user.js';

dotenv.config();

// Signup User
export const signupUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ msg: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ msg: 'Signup successful' });
  } catch (error) {
    console.error('Error in signupUser:', error);
    return res.status(500).json({ msg: 'Error while signing up user' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ msg: 'Invalid credentials' });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    await new Token({ token: refreshToken }).save();

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ msg: 'Token is required' });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
    if (!decoded) return res.status(401).json({ msg: 'Invalid token' });

    const result = await Token.deleteOne({ token });
    if (!result.deletedCount) return res.status(400).json({ msg: 'Invalid token' });

    res.status(204).json({ msg: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ msg: 'Refresh token required' });

    const tokenExists = await Token.findOne({ token: refreshToken });
    if (!tokenExists) return res.status(403).json({ msg: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ msg: 'Invalid refresh token' });

      const newAccessToken = jwt.sign(
        { userId: user.userId },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '15m' }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
