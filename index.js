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

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://blog-fe-dcjv.onrender.com'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all needed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Include headers used in requests
    credentials: true, // Allow credentials if needed
  })
);

app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Respond with no content for OPTIONS request
  }
  next();
});


app.use('/api', Router);

app.get('/', (req, res) => res.send('Welcome to the API!'));

Connection();

app.get('/api/posts', (req, res) => {
  res.status(200).json({ message: 'Posts retrieved' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
