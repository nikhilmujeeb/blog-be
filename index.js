import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer'; // Import multer

// Components
import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination folder for uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Set the file name as original
    },
});

const upload = multer({ storage });

// Add a route for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // You can access the uploaded file using req.file
        // Here, you can save the file info to your MongoDB
        const newImage = {
            name: req.file.originalname,
            path: req.file.path, // Save the path to the image
        };

        // Save the image information to the database here
        // Assuming you have an Image model, save it
        // await Image.create(newImage); // Example of saving to MongoDB

        res.status(200).json({ isSuccess: true, data: newImage });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: error.message });
    }
});

// Route for your main API
app.use('/', Router);

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

const PORT = 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
