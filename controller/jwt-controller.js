import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ msg: 'Token is missing' });

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) return res.status(403).json({ msg: 'Session expired. Please log in again.' });
        req.user = user;
        next();
    });
};

export const createNewToken = async (req, res) => {
    const refreshToken = req.body.token || req.headers.authorization?.split(' ')[1];

    if (!refreshToken) return res.status(401).json({ msg: 'Refresh token is missing' });

    try {
        const tokenDoc = await Token.findOne({ token: refreshToken });

        if (!tokenDoc) return res.status(404).json({ msg: 'Refresh token not valid' });

        jwt.verify(tokenDoc.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
            if (error) return res.status(403).json({ msg: 'Invalid refresh token' });

            const newAccessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_SECRET_KEY, {
                expiresIn: '15m',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};
