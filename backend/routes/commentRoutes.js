import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addComment, getCommentsByGame } from '../controllers/commentController.js';

const router = express.Router();

router.post('/:gameId', protect, addComment);
router.get('/:gameId', getCommentsByGame);

export default router;
