import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  toggleUpvote
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createFeedback)
  .get(getFeedbacks);

router.route('/:id')
  .get(getFeedback)
  .put(protect, updateFeedback)
  .delete(protect, deleteFeedback);

router.post('/:id/upvote', protect, toggleUpvote);

export default router;

