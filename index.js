import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import Router from './routes/route.js';
import Connection from './database/db.js';

dotenv.config();  // Load environment variables

const app = express();

app.use(cors({
  origin: 'https://blog-fe-dcjv.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use API routes
app.use('/api', Router);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

app.get("/", (req, res) => res.send("Welcome to the API!"));

// Use the connection with environment variables
const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB;

Connection(process.env.DB_USERNAME, process.env.DB_PASSWORD, DB_URL);

// Start the server
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
