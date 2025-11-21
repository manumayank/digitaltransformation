import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ModuleCategory } from '@shared/types';

const prisma = new PrismaClient();

// Simple in-memory cache for modules (they rarely change)
let modulesCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export class ModuleController {
  /**
   * Get all active modules
   * GET /api/v1/modules
   */
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check cache
      const now = Date.now();
      if (modulesCache && now - cacheTimestamp < CACHE_DURATION) {
        res.status(200).json({
          data: modulesCache,
          total: modulesCache.length,
          cached: true,
        });
        return;
      }

      // Fetch from database
      const modules = await prisma.module.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      // Update cache
      modulesCache = modules;
      cacheTimestamp = now;

      res.status(200).json({
        data: modules,
        total: modules.length,
        cached: false,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single module by ID
   * GET /api/v1/modules/:id
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const module = await prisma.module.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      if (!module) {
        res.status(404).json({ message: 'Module not found' });
        return;
      }

      if (!module.isActive) {
        res.status(404).json({ message: 'Module not available' });
        return;
      }

      res.status(200).json({ data: module });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a module by category
   * GET /api/v1/modules/category/:category
   */
  async getByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { category } = req.params;

      // Validate category enum
      if (!Object.values(ModuleCategory).includes(category as ModuleCategory)) {
        res.status(400).json({
          message: 'Invalid module category',
          validCategories: Object.values(ModuleCategory),
        });
        return;
      }

      const module = await prisma.module.findFirst({
        where: {
          category: category as ModuleCategory,
          isActive: true,
        },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      if (!module) {
        res.status(404).json({ message: 'Module not found for this category' });
        return;
      }

      res.status(200).json({ data: module });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get questions for a specific module
   * GET /api/v1/modules/:id/questions
   */
  async getQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { industry, size } = req.query;

      // Check if module exists and is active
      const module = await prisma.module.findUnique({
        where: { id },
      });

      if (!module || !module.isActive) {
        res.status(404).json({ message: 'Module not found' });
        return;
      }

      // Build where clause for filtering questions
      const whereClause: any = {
        moduleId: id,
        isActive: true,
      };

      // Filter by industry if provided
      if (industry && typeof industry === 'string') {
        whereClause.OR = [
          { applicableIndustry: { isEmpty: true } },
          { applicableIndustry: { has: industry } },
        ];
      }

      // Filter by size if provided
      if (size && typeof size === 'string') {
        whereClause.applicableSize = whereClause.applicableSize || {};
        whereClause.AND = [
          ...(whereClause.AND || []),
          {
            OR: [
              { applicableSize: { isEmpty: true } },
              { applicableSize: { has: size } },
            ],
          },
        ];
      }

      const questions = await prisma.question.findMany({
        where: whereClause,
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          questionText: true,
          questionType: true,
          options: true,
          scaleMin: true,
          scaleMax: true,
          weight: true,
          orderIndex: true,
          isRequired: true,
          conditionalLogic: true,
          applicableIndustry: true,
          applicableSize: true,
          helpText: true,
        },
      });

      res.status(200).json({
        data: questions,
        total: questions.length,
        moduleId: id,
        moduleName: module.name,
        filters: {
          industry: industry || null,
          size: size || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear the modules cache (admin only - for future use)
   */
  clearCache(): void {
    modulesCache = null;
    cacheTimestamp = 0;
  }
}
