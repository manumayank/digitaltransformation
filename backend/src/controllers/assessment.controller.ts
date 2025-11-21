import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScoringService } from '../services/scoring.service';
import { RiskAnalysisService } from '../services/risk-analysis.service';
import { RecommendationService } from '../services/recommendation.service';

const prisma = new PrismaClient();
const scoringService = new ScoringService();
const riskAnalysisService = new RiskAnalysisService();
const recommendationService = new RecommendationService();

export class AssessmentController {
  /**
   * Create a new assessment
   * POST /api/v1/assessments
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { businessProfileId } = req.body;

      // Verify business profile exists and belongs to user
      const businessProfile = await prisma.businessProfile.findFirst({
        where: {
          id: businessProfileId,
          userId,
        },
      });

      if (!businessProfile) {
        res.status(404).json({ message: 'Business profile not found' });
        return;
      }

      // Create assessment
      const assessment = await prisma.assessment.create({
        data: {
          userId,
          businessProfileId,
          status: 'IN_PROGRESS',
        },
        include: {
          businessProfile: {
            select: {
              id: true,
              businessName: true,
              industry: true,
              businessSize: true,
            },
          },
        },
      });

      res.status(201).json({
        message: 'Assessment created successfully',
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all assessments for the current user
   * GET /api/v1/assessments
   */
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const assessments = await prisma.assessment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          businessProfile: {
            select: {
              id: true,
              businessName: true,
              industry: true,
              businessSize: true,
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });

      res.status(200).json({
        data: assessments,
        total: assessments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single assessment by ID
   * GET /api/v1/assessments/:id
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const assessment = await prisma.assessment.findFirst({
        where: {
          id,
          userId, // Ensure user can only access their own assessments
        },
        include: {
          businessProfile: {
            select: {
              id: true,
              businessName: true,
              industry: true,
              businessSize: true,
              growthStage: true,
            },
          },
          responses: {
            orderBy: { createdAt: 'asc' },
            select: {
              id: true,
              questionId: true,
              answer: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          moduleScores: {
            include: {
              module: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
            orderBy: {
              module: {
                orderIndex: 'asc',
              },
            },
          },
          riskFlags: {
            orderBy: [
              { riskLevel: 'desc' },
              { createdAt: 'asc' },
            ],
          },
          recommendations: {
            include: {
              module: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
            orderBy: [
              { priority: 'asc' },
              { createdAt: 'asc' },
            ],
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });

      if (!assessment) {
        res.status(404).json({ message: 'Assessment not found' });
        return;
      }

      res.status(200).json({ data: assessment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save responses for an assessment
   * PUT /api/v1/assessments/:id/responses
   */
  async saveResponses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { responses } = req.body;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if assessment exists and belongs to user
      const assessment = await prisma.assessment.findFirst({
        where: { id, userId },
      });

      if (!assessment) {
        res.status(404).json({ message: 'Assessment not found' });
        return;
      }

      // Cannot save responses to submitted assessment
      if (assessment.status === 'SUBMITTED' || assessment.status === 'COMPLETED') {
        res.status(400).json({
          message: 'Cannot save responses to a submitted assessment',
        });
        return;
      }

      // Upsert all responses
      const upsertPromises = responses.map((response: any) =>
        prisma.response.upsert({
          where: {
            assessmentId_questionId: {
              assessmentId: id,
              questionId: response.questionId,
            },
          },
          update: {
            answer: response.answer,
          },
          create: {
            assessmentId: id,
            questionId: response.questionId,
            answer: response.answer,
          },
        })
      );

      await Promise.all(upsertPromises);

      // Update assessment timestamp
      await prisma.assessment.update({
        where: { id },
        data: { updatedAt: new Date() },
      });

      res.status(200).json({
        message: 'Responses saved successfully',
        savedCount: responses.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit an assessment
   * POST /api/v1/assessments/:id/submit
   */
  async submit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if assessment exists and belongs to user
      const assessment = await prisma.assessment.findFirst({
        where: { id, userId },
        include: {
          responses: true,
        },
      });

      if (!assessment) {
        res.status(404).json({ message: 'Assessment not found' });
        return;
      }

      // Check if already submitted
      if (assessment.status === 'SUBMITTED' || assessment.status === 'COMPLETED') {
        res.status(400).json({
          message: 'Assessment has already been submitted',
        });
        return;
      }

      // Update assessment status
      const updatedAssessment = await prisma.assessment.update({
        where: { id },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
        include: {
          businessProfile: {
            select: {
              businessName: true,
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });

      // Trigger scoring engine
      await scoringService.scoreAssessment(id);

      // Generate risk flags based on scores
      await riskAnalysisService.generateRiskFlags(id);

      // Generate recommendations based on scores
      await recommendationService.generateRecommendations(id);

      // Fetch updated assessment with scores, risks, and recommendations
      const scoredAssessment = await prisma.assessment.findUnique({
        where: { id },
        include: {
          businessProfile: {
            select: {
              businessName: true,
            },
          },
          moduleScores: {
            include: {
              module: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
            orderBy: {
              module: {
                orderIndex: 'asc',
              },
            },
          },
          riskFlags: {
            orderBy: [
              { riskLevel: 'desc' },
              { createdAt: 'asc' },
            ],
          },
          recommendations: {
            include: {
              module: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
            orderBy: [
              { priority: 'asc' },
              { createdAt: 'asc' },
            ],
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });

      res.status(200).json({
        message: 'Assessment submitted, scored, and analyzed successfully',
        data: scoredAssessment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an assessment
   * DELETE /api/v1/assessments/:id
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if assessment exists and belongs to user
      const assessment = await prisma.assessment.findFirst({
        where: { id, userId },
      });

      if (!assessment) {
        res.status(404).json({ message: 'Assessment not found' });
        return;
      }

      // Delete assessment (will cascade delete responses)
      await prisma.assessment.delete({
        where: { id },
      });

      res.status(200).json({
        message: 'Assessment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
