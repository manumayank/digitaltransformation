import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { userController } from '../controllers/user.controller';
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../validators/user.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users/profile - Get current user profile
router.get('/profile', userController.getProfile.bind(userController));

// PUT /api/v1/users/profile - Update user profile
router.put(
  '/profile',
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

// PUT /api/v1/users/password - Change password
router.put(
  '/password',
  validate(changePasswordSchema),
  userController.changePassword.bind(userController)
);

// GET /api/v1/users/stats - Get user statistics
router.get('/stats', userController.getStats.bind(userController));

// DELETE /api/v1/users/account - Delete/deactivate account
router.delete(
  '/account',
  validate(deleteAccountSchema),
  userController.deleteAccount.bind(userController)
);

export default router;
