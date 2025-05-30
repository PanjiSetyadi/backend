import express from 'express';
import { getUser } from '../controllers/user-controller.js';
import { verifyToken } from '../middleware/verify-token.js';

const router = express.Router();

// GET /api/v1/user/me
router.get('/me', verifyToken, getUser);

export default router;
