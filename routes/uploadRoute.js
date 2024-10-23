import express from 'express';
import multer from 'multer';
import Image from '../models/Image.js'; // Your image model

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Change to your upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const newImage = new Image({
            name: req.file.originalname,
            path: req.file.path,
        });
        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully', data: newImage });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});

export default router;
