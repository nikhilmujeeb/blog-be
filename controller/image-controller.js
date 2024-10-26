import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'mongodb+srv://nikhilmujeeb:bUckAIS7RWIGAy7R@blog-db.w2ayo.mongodb.net/';

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

export const uploadImage = (request, response) => {
    if (!request.file) 
        return response.status(404).json({ msg: "File not found" });
    
    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);    
}

export const getImage = async (request, response) => {
    try {
        const file = await gfs.files.findOne({ filename: request.params.filename });
        if (!file) return response.status(404).json({ msg: 'File not found' }); // Check if file exists

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.on('error', () => {
            response.status(500).json({ msg: 'Error reading file' });
        });
        readStream.pipe(response);
    } catch (error) {
        response.status(500).json({ msg: 'Error retrieving image', error });
    }
}
