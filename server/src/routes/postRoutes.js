import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import * as likeController from '../controllers/likeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, '../../uploads');

const router = Router();

const postMediaUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    const handler = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const dest = file.mimetype.startsWith('video/')
            ? path.join(uploadsRoot, 'videos')
            : path.join(uploadsRoot, 'images');
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
          cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = [
          'image/jpeg', 'image/jpg', 'image/png',
          'video/mp4', 'video/quicktime', 'video/webm',
        ];
        cb(null, allowed.includes(file.mimetype));
      },
    }).single('media');

    handler(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  } else {
    next();
  }
};

router.get('/', optionalAuth, postController.getAllPosts);
router.get('/:id', optionalAuth, postController.getPost);
router.post('/', protect, postMediaUpload, postController.createPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', protect, commentController.addComment);
router.post('/:id/like', protect, likeController.likePost);
router.delete('/:id/like', protect, likeController.unlikePost);
router.get('/:id/likes', likeController.getLikes);

export default router;
