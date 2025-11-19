import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const reportController = new ReportController();

// All report routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/reports/assessment/:id/pdf
 * @desc    Generate and download PDF report for an assessment
 * @access  Private
 */
router.get('/assessment/:id/pdf', (req, res, next) =>
  reportController.generatePDF(req, res, next)
);

export default router;
