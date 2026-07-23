import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/users', adminController.getUsers);
router.get('/posts', adminController.getPosts);
router.delete('/posts/:id', adminController.deletePost);
router.delete('/comments/:id', adminController.deleteComment);

export default router;
