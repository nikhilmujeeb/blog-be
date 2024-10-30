import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import upload from './utils/upload.js';
import Router from './routes/route.js';
import Connection from './database/db.js';
import Post from './models/Post.js'; // Import the Post model

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

// Fetch post by ID
app.get('/api/post/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  console.log('Received ID:', id); // Log the ID to ensure it is received correctly
  try {
      const post = await Post.findById(id); // Find the post by ID
      if (!post) return res.status(404).send('Post not found');
      res.json({ isSuccess: true, data: post });
  } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).send('Server error');
  }
});

app.use('/api', Router);

app.get('/', (req, res) => res.send('Welcome to the API!'));

Connection();

app.get('/api/posts', (req, res) => {
  res.status(200).json({ message: 'Posts retrieved' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
