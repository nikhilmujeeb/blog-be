import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
  url: process.env.DB, 
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpg", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      return `${Date.now()}-blog-${file.originalname}`;
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
