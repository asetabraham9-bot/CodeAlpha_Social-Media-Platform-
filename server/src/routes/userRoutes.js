import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as followController from '../controllers/followController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id', optionalAuth, userController.getUser);
router.get('/:id/posts', userController.getUserPosts);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.post('/:id/follow', protect, followController.followUser);
router.delete('/:id/follow', protect, followController.unfollowUser);

export default router;
