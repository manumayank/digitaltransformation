import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  CreateBusinessProfileInput,
  UpdateBusinessProfileInput,
} from '../validators/business-profile.validator';

const prisma = new PrismaClient();

export class BusinessProfileController {
  /**
   * Create a new business profile
   * POST /api/v1/business-profiles
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const data: CreateBusinessProfileInput = req.body;

      // Create business profile
      const profile = await prisma.businessProfile.create({
        data: {
          ...data,
          userId,
        },
      });

      res.status(201).json({
        message: 'Business profile created successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all business profiles for the current user
   * GET /api/v1/business-profiles
   */
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const profiles = await prisma.businessProfile.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              assessments: true,
            },
          },
        },
      });

      res.status(200).json({
        data: profiles,
        total: profiles.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single business profile by ID
   * GET /api/v1/business-profiles/:id
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const profile = await prisma.businessProfile.findFirst({
        where: {
          id,
          userId, // Ensure user can only access their own profiles
        },
        include: {
          assessments: {
            orderBy: { createdAt: 'desc' },
            take: 5, // Get last 5 assessments
            select: {
              id: true,
              status: true,
              overallScore: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              assessments: true,
            },
          },
        },
      });

      if (!profile) {
        res.status(404).json({ message: 'Business profile not found' });
        return;
      }

      res.status(200).json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a business profile
   * PUT /api/v1/business-profiles/:id
   */
  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const data: UpdateBusinessProfileInput = req.body;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if profile exists and belongs to user
      const existingProfile = await prisma.businessProfile.findFirst({
        where: { id, userId },
      });

      if (!existingProfile) {
        res.status(404).json({ message: 'Business profile not found' });
        return;
      }

      // Update profile
      const profile = await prisma.businessProfile.update({
        where: { id },
        data,
      });

      res.status(200).json({
        message: 'Business profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a business profile
   * DELETE /api/v1/business-profiles/:id
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if profile exists and belongs to user
      const existingProfile = await prisma.businessProfile.findFirst({
        where: { id, userId },
        include: {
          _count: {
            select: {
              assessments: true,
            },
          },
        },
      });

      if (!existingProfile) {
        res.status(404).json({ message: 'Business profile not found' });
        return;
      }

      // Check if profile has assessments
      if (existingProfile._count.assessments > 0) {
        res.status(400).json({
          message:
            'Cannot delete business profile with existing assessments. Please delete assessments first.',
          assessmentCount: existingProfile._count.assessments,
        });
        return;
      }

      // Delete profile
      await prisma.businessProfile.delete({
        where: { id },
      });

      res.status(200).json({
        message: 'Business profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get business profile statistics
   * GET /api/v1/business-profiles/:id/stats
   */
  async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if profile exists and belongs to user
      const profile = await prisma.businessProfile.findFirst({
        where: { id, userId },
        include: {
          assessments: {
            select: {
              id: true,
              status: true,
              overallScore: true,
              digitalScore: true,
              legacyScore: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!profile) {
        res.status(404).json({ message: 'Business profile not found' });
        return;
      }

      // Calculate statistics
      const completedAssessments = profile.assessments.filter(
        (a) => a.status === 'COMPLETED'
      );

      const avgOverallScore =
        completedAssessments.length > 0
          ? completedAssessments.reduce(
              (sum, a) => sum + (a.overallScore || 0),
              0
            ) / completedAssessments.length
          : 0;

      const avgDigitalScore =
        completedAssessments.length > 0
          ? completedAssessments.reduce(
              (sum, a) => sum + (a.digitalScore || 0),
              0
            ) / completedAssessments.length
          : 0;

      const avgLegacyScore =
        completedAssessments.length > 0
          ? completedAssessments.reduce(
              (sum, a) => sum + (a.legacyScore || 0),
              0
            ) / completedAssessments.length
          : 0;

      const stats = {
        totalAssessments: profile.assessments.length,
        completedAssessments: completedAssessments.length,
        inProgressAssessments: profile.assessments.filter(
          (a) => a.status === 'IN_PROGRESS' || a.status === 'DRAFT'
        ).length,
        averageScores: {
          overall: Math.round(avgOverallScore * 10) / 10,
          digital: Math.round(avgDigitalScore * 10) / 10,
          legacy: Math.round(avgLegacyScore * 10) / 10,
        },
        latestAssessment: profile.assessments[0] || null,
      };

      res.status(200).json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}
