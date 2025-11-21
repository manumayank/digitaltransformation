import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AssessmentController } from '../controllers/assessment.controller';
import {
  createAssessmentSchema,
  getAssessmentByIdSchema,
  saveResponsesSchema,
  submitAssessmentSchema,
  deleteAssessmentSchema,
} from '../validators/assessment.validator';

const router = Router();
const assessmentController = new AssessmentController();

// All assessment routes require authentication
router.use(authenticate);

// Create a new assessment
router.post(
  '/',
  validate(createAssessmentSchema),
  assessmentController.create.bind(assessmentController)
);

// Get all assessments for current user
router.get('/', assessmentController.getAll.bind(assessmentController));

// Get a single assessment by ID
router.get(
  '/:id',
  validate(getAssessmentByIdSchema),
  assessmentController.getById.bind(assessmentController)
);

// Save responses for an assessment
router.put(
  '/:id/responses',
  validate(saveResponsesSchema),
  assessmentController.saveResponses.bind(assessmentController)
);

// Submit an assessment
router.post(
  '/:id/submit',
  validate(submitAssessmentSchema),
  assessmentController.submit.bind(assessmentController)
);

// Delete an assessment
router.delete(
  '/:id',
  validate(deleteAssessmentSchema),
  assessmentController.delete.bind(assessmentController)
);

export default router;
