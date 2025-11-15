import express from 'express';
import {
  updateFeedbackStatus,
  deleteAnyFeedback,
  getStats,
  getUsers
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.put('/feedback/:id/status', updateFeedbackStatus);
router.delete('/feedback/:id', deleteAnyFeedback);
router.get('/stats', getStats);
router.get('/users', getUsers);

export default router;

