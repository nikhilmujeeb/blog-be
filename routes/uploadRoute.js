import express from 'express';
import upload from '../utils/upload.js';
import Image from '../model/Image.js';

const router = express.Router();

// Route to upload an image
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
