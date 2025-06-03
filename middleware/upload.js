import multer from 'multer';
import path from 'path';
import fs from 'fs';

// pastikan folder uploads ada
const uploadDir = 'public/upload/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // nama file unik
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/jpg'
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only JPEG/PNG files allowed');
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  },
});

export default upload;
