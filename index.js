import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer'; 
import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

const app = express();

app.use(cors());
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

const PORT = 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
