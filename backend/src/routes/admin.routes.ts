import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// User management
// GET /api/v1/admin/users - Get all users
// GET /api/v1/admin/users/:id - Get user by ID
// PUT /api/v1/admin/users/:id - Update user
// DELETE /api/v1/admin/users/:id - Delete user

// Assessment management
// GET /api/v1/admin/assessments - Get all assessments
// GET /api/v1/admin/assessments/stats - Get assessment statistics

// Module and question management
// POST /api/v1/admin/modules - Create module
// PUT /api/v1/admin/modules/:id - Update module
// DELETE /api/v1/admin/modules/:id - Delete module
// POST /api/v1/admin/questions - Create question
// PUT /api/v1/admin/questions/:id - Update question
// DELETE /api/v1/admin/questions/:id - Delete question

router.get('/', (req, res) => {
  res.json({ message: 'Admin routes - Coming soon' });
});

export default router;
