import { Router } from 'express';
import authRoutes from './auth.routes';
import assessmentRoutes from './assessment.routes';
import moduleRoutes from './module.routes';
import reportRoutes from './report.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import businessProfileRoutes from './business-profile.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/modules', moduleRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/business-profiles', businessProfileRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'DRLTAS API',
    version: '1.0.0',
    description: 'Digital Readiness & Legacy-Transfer Audit System',
    endpoints: {
      auth: '/auth',
      assessments: '/assessments',
      modules: '/modules',
      reports: '/reports',
      users: '/users',
      admin: '/admin',
      businessProfiles: '/business-profiles',
    },
  });
});

export default router;
