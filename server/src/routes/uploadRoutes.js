import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage, uploadVideo } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/image', protect, uploadImage, uploadController.uploadImage);
router.post('/video', protect, uploadVideo, uploadController.uploadVideo);

export default router;
