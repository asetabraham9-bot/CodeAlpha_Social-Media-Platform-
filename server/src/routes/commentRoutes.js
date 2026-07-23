import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.put('/:id', protect, commentController.updateComment);
router.delete('/:id', protect, commentController.deleteComment);

export default router;
