import multer from 'multer';
import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'https://blog-be-3tvt.onrender.com';

let gfs, gridfsBucket;
const conn = mongoose.connection;

// Set up GridFS bucket
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
});

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

// Upload image function
export const uploadImage = (request, response) => {
    upload.single('file')(request, response, (err) => {
        if (err) {
            return response.status(500).json({ msg: err.message });
        }

        if (!request.file) 
            return response.status(404).json("File not found");

        const writeStream = gridfsBucket.openUploadStream(request.file.originalname);
        writeStream.end(request.file.buffer);

        writeStream.on('finish', () => {
            const imageUrl = `${url}/file/${writeStream.id}`; // Updated to use unique stream ID
            response.status(200).json({ isSuccess: true, url: imageUrl });
        });

        writeStream.on('error', (error) => {
            response.status(500).json({ msg: error.message });
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