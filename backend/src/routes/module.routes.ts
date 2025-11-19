import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';
import { validate } from '../middleware/validate';
import {
  getModuleByIdSchema,
  getModuleByCategorySchema,
  getModuleQuestionsSchema,
} from '../validators/module.validator';

const router = Router();
const moduleController = new ModuleController();

// Public routes to get module information
// Note: These routes are public (no auth required) as they provide reference data

// Get all modules
router.get('/', moduleController.getAll.bind(moduleController));

// Get module by category (must be before /:id to avoid matching category as UUID)
router.get(
  '/category/:category',
  validate(getModuleByCategorySchema),
  moduleController.getByCategory.bind(moduleController)
);

// Get questions for a specific module
router.get(
  '/:id/questions',
  validate(getModuleQuestionsSchema),
  moduleController.getQuestions.bind(moduleController)
);

// Get specific module by ID
router.get(
  '/:id',
  validate(getModuleByIdSchema),
  moduleController.getById.bind(moduleController)
);

export default router;
