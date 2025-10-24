import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/resumeController';

// ✅ Use memory storage to get buffer
const storage = multer.memoryStorage();

// File filter to only allow PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

const router = express.Router();

router.post('/parse', upload.single('file'), parseResume);

export default router;