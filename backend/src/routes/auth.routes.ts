import { Router } from 'express';
// Import controllers when created
// import { register, login, refreshToken, logout } from '../controllers/auth.controller';

const router = Router();

// POST /api/v1/auth/register
// router.post('/register', register);

// POST /api/v1/auth/login
// router.post('/login', login);

// POST /api/v1/auth/refresh
// router.post('/refresh', refreshToken);

// POST /api/v1/auth/logout
// router.post('/logout', logout);

// Placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - Coming soon' });
});

export default router;
