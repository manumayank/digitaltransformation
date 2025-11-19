import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/v1/users/profile - Get current user profile
// PUT /api/v1/users/profile - Update user profile
// PUT /api/v1/users/password - Change password

router.get('/', (req, res) => {
  res.json({ message: 'User routes - Coming soon' });
});

export default router;
