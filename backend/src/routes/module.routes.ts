import { Router } from 'express';

const router = Router();

// Public routes to get module information
// GET /api/v1/modules - Get all modules
// GET /api/v1/modules/:id - Get specific module
// GET /api/v1/modules/:id/questions - Get questions for module

router.get('/', (req, res) => {
  res.json({ message: 'Module routes - Coming soon' });
});

export default router;
