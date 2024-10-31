import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import upload from './utils/upload.js';
import Router from './routes/route.js';
import Connection from './database/db.js';
import Post from './model/post.js';
import postController from './controller/post-controller.js'; // Correctly import postController

dotenv.config();
const app = express();

// Use middleware for logging
app.use(morgan('dev'));

// CORS configuration
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

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

// Get single post by ID
app.get('/api/post/:id', async (req, res) => {
  const { id } = req.params; 
  console.log('Received ID:', id); 

  try {
      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ isSuccess: true, data: post });
  } catch (error) {
      console.error('Error fetching post:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Use postController for API routes
app.use('/api', Router); // Make sure to use the router with the correct path

// Test route
app.get('/', (req, res) => res.send('Welcome to the API!'));

// Connect to the database
Connection();

// Dummy posts route for testing
app.get('/api/posts', (req, res) => {
  res.status(200).json({ message: 'Posts retrieved' });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
