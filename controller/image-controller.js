import multer from 'multer';
import mongoose from 'mongoose';
import cloudinary from '../utils/cloudinaryConfig.js'; // Cloudinary configuration
import ImageKit from 'imagekit'; // Make sure to install this if not already
import grid from 'gridfs-stream';

const url = 'https://blog-be-3tvt.onrender.com';
let gfs, gridfsBucket;
const conn = mongoose.connection;

// Set up GridFS bucket
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'fs' });
    gfs = grid(conn.db, mongoose.mongo);
});

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT 
});

// Upload image to ImageKit and optionally to Cloudinary or GridFS
export const uploadImage = (request, response) => {
    upload.single('file')(request, response, (err) => {
        if (err) {
            return response.status(500).json({ msg: err.message });
        }

        if (!request.file) {
            return response.status(404).json("File not found");
        }

        const fileBuffer = request.file.buffer;
        const fileName = `${Date.now()}-${request.file.originalname}`;

        // Upload to ImageKit
        imageKit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: "your_folder_name", // Optional
        }, (error, result) => {
            if (error) {
                return response.status(500).json({ msg: error.message });
            }

            response.status(200).json({ 
                isSuccess: true, 
                url: result.url // URL of the uploaded image
            });
        });
    });
};

// Get image from GridFS
export const getImage = async (request, response) => {
    try {
        const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(request.params.filename) });
        if (!file) {
            return response.status(404).json({ msg: 'File not found' });
        }

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
};
