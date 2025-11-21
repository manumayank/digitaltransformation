import express from 'express';
import { BusinessProfileController } from '../controllers/business-profile.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createBusinessProfileSchema,
  updateBusinessProfileSchema,
  getBusinessProfileSchema,
  deleteBusinessProfileSchema,
} from '../validators/business-profile.validator';

const router = express.Router();
const businessProfileController = new BusinessProfileController();

// All routes require authentication
router.use(authenticate);

// Create a new business profile
router.post(
  '/',
  validate(createBusinessProfileSchema),
  businessProfileController.create.bind(businessProfileController)
);

// Get all business profiles for current user
router.get('/', businessProfileController.getAll.bind(businessProfileController));

// Get a single business profile by ID
router.get(
  '/:id',
  validate(getBusinessProfileSchema),
  businessProfileController.getById.bind(businessProfileController)
);

// Update a business profile
router.put(
  '/:id',
  validate(updateBusinessProfileSchema),
  businessProfileController.update.bind(businessProfileController)
);

// Delete a business profile
router.delete(
  '/:id',
  validate(deleteBusinessProfileSchema),
  businessProfileController.delete.bind(businessProfileController)
);

// Get business profile statistics
router.get(
  '/:id/stats',
  validate(getBusinessProfileSchema),
  businessProfileController.getStats.bind(businessProfileController)
);

export default router;
