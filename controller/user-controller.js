import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';
import User from '../model/user.js';

dotenv.config();

export const signupUser = async (request, response) => {
  try {
    const hashedPassword = await bcryptjs.hash(request.body.password, 10);
    const user = { username: request.body.username, name: request.body.name, password: hashedPassword };

    const newUser = new User(user);
    await newUser.save();

    return response.status(200).json({ msg: 'Signup successful' });
  } catch (error) {
    console.error('Error in signupUser:', error); // Log the error for debugging
    return response.status(500).json({ msg: 'Error while signing up user' });
  }
}

export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'User not found' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Login error:', error); 
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const logoutUser = async (request, response) => {
  const token = request.body.token;
  await Token.deleteOne({ token: token });

  response.status(204).json({ msg: 'Logout successful' });
}
