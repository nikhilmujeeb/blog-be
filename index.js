import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import upload from './utils/upload.js';
import Router from './routes/route.js';
import Connection from './database/db.js';

dotenv.config();
const app = express();

app.use(morgan('dev')); // Logging middleware

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://blog-fe-dcjv.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parsers for handling JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

// API Routes
app.use('/api', Router);

// Welcome Route
app.get('/', (req, res) => res.send('Welcome to the API!'));

// Connect to Database
Connection();

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
