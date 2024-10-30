import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'mongodb+srv://nikhilmujeeb:bUckAIS7RWIGAy7R@blog-db.w2ayo.mongodb.net/';

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('photos'); 
});

export const uploadImage = (req, res) => {
    if (!req.file) 
        return res.status(404).json({ msg: "File not found" });
    
    const imageUrl = `${url}/file/${req.file.filename}`;
    res.status(200).json(imageUrl);    
}

export const getImage = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) return res.status(404).json({ msg: 'File not found' });

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.on('error', () => {
            res.status(500).json({ msg: 'Error reading file' });
        });
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving image', error });
    }
}
