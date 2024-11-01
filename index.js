import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Router from './routes/route.js'; // Keep the upload import only in the route file
import Connection from './database/db.js';
import upload from './utils/upload.js'; // If this is a separate upload configuration, keep it here

dotenv.config();
const app = express();

app.use(morgan('dev'));

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://blog-fe-dcjv.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Remove this if you don't need a separate upload endpoint in your main app
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

app.use('/api', Router);

app.get('/', (req, res) => res.send('Welcome to the API!'));

const PORT = 8000;

const startServer = async () => {
  try {
    await Connection();
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  } catch (error) {
    console.error('Failed to start the server:', error.message);
  }
};

startServer();