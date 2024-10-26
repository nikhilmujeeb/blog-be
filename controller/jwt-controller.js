import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            console.error('JWT Verification Error:', error); 
            return res.status(403).json({ msg: 'Invalid token' });
        }

        req.user = user; 
        next();
    });
};

export const createNewToken = async (req, res) => {
    const authHeader = req.body.token || ''; // Ensure token exists to avoid errors
    const refreshToken = authHeader.split(' ')[1] || authHeader; // Handle both cases

    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token is missing' });
    }

    try {
        const tokenDoc = await Token.findOne({ token: refreshToken });

        if (!tokenDoc) {
            return res.status(404).json({ msg: 'Refresh token is not valid' });
        }

        jwt.verify(tokenDoc.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
            if (error) {
                console.error('Refresh Token Error:', error); // Log error
                return res.status(403).json({ msg: 'Invalid refresh token' });
            }

            const newAccessToken = jwt.sign(
                { userId: user.userId }, // Ensure the user ID is correctly passed
                process.env.ACCESS_SECRET_KEY,
                { expiresIn: '15m' }
            );

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Database Error:', error); // Handle any DB errors
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};