import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All assessment routes require authentication
router.use(authenticate);

// Routes will be implemented with controllers
// GET /api/v1/assessments - Get all assessments for user
// POST /api/v1/assessments - Create new assessment
// GET /api/v1/assessments/:id - Get specific assessment
// PUT /api/v1/assessments/:id - Update assessment
// DELETE /api/v1/assessments/:id - Delete assessment
// POST /api/v1/assessments/:id/submit - Submit assessment for scoring

router.get('/', (req, res) => {
  res.json({ message: 'Assessment routes - Coming soon' });
});

export default router;
