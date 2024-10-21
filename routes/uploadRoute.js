import express from 'express';
import multer from 'multer';
import Image from '../model/Image.js'; // Ensure this import is correct

const router = express.Router();

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

// Route for file uploads
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const newImage = {
            name: req.file.originalname,
            path: req.file.path,
        };

        // Save the image information to the database
        const savedImage = await Image.create(newImage);

        res.status(200).json({ isSuccess: true, data: savedImage });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: error.message });
    }
});

export default router;
