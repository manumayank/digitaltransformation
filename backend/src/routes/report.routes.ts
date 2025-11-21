import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const reportController = new ReportController();

// All report routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/reports/assessment/:id/pdf
 * @desc    Generate and download PDF report for an assessment
 * @access  Private
 */
router.get('/assessment/:id/pdf', (req, res, next) =>
  reportController.generatePDF(req, res, next)
);

export default router;
