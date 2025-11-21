import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export class UserController {
  /**
   * Get current user profile
   * GET /api/v1/users/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError('User ID not found');
      }

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
        throw new NotFoundError('User not found');
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
   * Update user profile
   * PUT /api/v1/users/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, phone } = req.body;

      if (!userId) {
        throw new BadRequestError('User ID not found');
      }

      // Build update data object
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
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

      logger.info(`User profile updated: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   * PUT /api/v1/users/password
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new BadRequestError('User ID not found');
      }

      if (!currentPassword || !newPassword) {
        throw new BadRequestError('Current password and new password are required');
      }

      // Use auth service to change password
      await authService.changePassword(userId, currentPassword, newPassword);

      logger.info(`Password changed for user: ${req.user?.email}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   * DELETE /api/v1/users/account
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { password } = req.body;

      if (!userId) {
        throw new BadRequestError('User ID not found');
      }

      if (!password) {
        throw new BadRequestError('Password is required to delete account');
      }

      // Verify password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid password');
      }

      // Instead of deleting, deactivate the account
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      // Delete all refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      logger.info(`User account deactivated: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics
   * GET /api/v1/users/stats
   */
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError('User ID not found');
      }

      // Get user statistics
      const [totalAssessments, completedAssessments, businessProfiles] = await Promise.all([
        prisma.assessment.count({
          where: { userId },
        }),
        prisma.assessment.count({
          where: { userId, status: 'COMPLETED' },
        }),
        prisma.businessProfile.count({
          where: { userId },
        }),
      ]);

      // Get latest assessment with scores
      const latestAssessment = await prisma.assessment.findFirst({
        where: { userId, status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          digitalScore: true,
          legacyScore: true,
          overallScore: true,
          completedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          totalAssessments,
          completedAssessments,
          inProgressAssessments: totalAssessments - completedAssessments,
          businessProfiles,
          latestAssessment,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
