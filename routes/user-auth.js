import express from 'express';
import { getUser } from '../controllers/user-controller.js';
import { verifyToken } from '../middleware/verify-token.js';
import { updateProfile } from '../controllers/user-controller.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET /api/v1/user/me
router.get('/me', verifyToken, getUser);

router.put('/me', verifyToken, upload.single('profileImage'), updateProfile);

export default router;
