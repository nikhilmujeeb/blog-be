// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import Router from './routes/route.js';
import Connection from './database/db.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
      origin: 'https://blog-fe-dcjv.onrender.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, 
    })
  );
  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const newImage = { name: req.file.originalname, path: req.file.path };
    res.status(200).json({ isSuccess: true, data: newImage });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

app.use('/api', Router);
app.get('/', (req, res) => res.send('Welcome to the API!'));

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ isSuccess: false, msg: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ isSuccess: false, msg: 'Invalid password' });
        }

        const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            isSuccess: true,
            data: {
                accessToken,
                name: user.name,
                username: user.username,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ isSuccess: false, msg: 'Internal server error', error: error.message });
    }
});

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB;

Connection(process.env.DB_USERNAME, process.env.DB_PASSWORD, DB_URL);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
