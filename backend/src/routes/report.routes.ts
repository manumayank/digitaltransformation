import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/v1/reports/:assessmentId - Get report for assessment
// GET /api/v1/reports/:assessmentId/download - Download PDF report

router.get('/', (req, res) => {
  res.json({ message: 'Report routes - Coming soon' });
});

export default router;
