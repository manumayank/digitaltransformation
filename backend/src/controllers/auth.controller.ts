import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';
import type { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.validator';

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      // Log user IP and user agent for security
      logger.info('User login', {
        email,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(
    req: Request<{}, {}, RefreshTokenInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const refreshToken = req.body.refreshToken;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await authService.logout(userId, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { prisma } = await import('../config/database');
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
