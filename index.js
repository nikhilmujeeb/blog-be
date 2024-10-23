import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://blog-fe-dcjv.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
}));

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const newImage = {
            name: req.file.originalname,
            path: req.file.path,
        };
        res.status(200).json({ isSuccess: true, data: newImage });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: error.message });
    }
});

app.use('/', Router);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.post('/login', async (req, res) => {
    console.log('Received body:', req.body); 
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: 'Error while logging in the user' });
    }
});

const PORT = 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
