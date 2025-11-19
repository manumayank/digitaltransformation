import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export class ScoringService {
  /**
   * Calculate score for a single question response
   */
  private calculateQuestionScore(
    questionType: QuestionType,
    answer: any,
    scaleMin?: number | null,
    scaleMax?: number | null
  ): number {
    switch (questionType) {
      case 'YES_NO':
        // Yes = 100, No = 0
        return answer === true ? 100 : 0;

      case 'MULTIPLE_CHOICE':
        // For now, we'll score based on the answer value
        // In a real system, each option could have a defined score
        // For simplicity: if answer exists = 100, else 0
        return answer ? 100 : 0;

      case 'SCALE':
        // Normalize scale to 0-100
        const min = scaleMin ?? 0;
        const max = scaleMax ?? 10;
        const normalizedScore = ((answer - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, normalizedScore));

      case 'TEXT':
        // Text questions: if answered = 100, else 0
        // In a real system, this could use NLP or manual scoring
        return answer && answer.length > 0 ? 100 : 0;

      case 'FILE_UPLOAD':
        // File uploaded = 100, else 0
        return answer && answer.name ? 100 : 0;

      default:
        return 0;
    }
  }

  /**
   * Calculate score for a single module
   */
  async calculateModuleScore(
    assessmentId: string,
    moduleId: string
  ): Promise<number> {
    // Get all questions for this module
    const questions = await prisma.question.findMany({
      where: {
        moduleId,
        isActive: true,
      },
      select: {
        id: true,
        questionType: true,
        weight: true,
        scaleMin: true,
        scaleMax: true,
      },
    });

    if (questions.length === 0) {
      return 0;
    }

    // Get all responses for these questions in this assessment
    const responses = await prisma.response.findMany({
      where: {
        assessmentId,
        questionId: {
          in: questions.map((q) => q.id),
        },
      },
      select: {
        questionId: true,
        answer: true,
      },
    });

    // Create a map of responses
    const responseMap = new Map(
      responses.map((r) => [r.questionId, r.answer])
    );

    // Calculate weighted score
    let totalWeightedScore = 0;
    let totalWeight = 0;

    questions.forEach((question) => {
      const answer = responseMap.get(question.id);
      if (answer !== undefined) {
        const questionScore = this.calculateQuestionScore(
          question.questionType,
          answer,
          question.scaleMin,
          question.scaleMax
        );
        totalWeightedScore += questionScore * question.weight;
        totalWeight += question.weight;
      }
    });

    // Normalize to 0-100
    const moduleScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    return Math.round(moduleScore * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate scores for all modules in an assessment
   */
  async calculateAllModuleScores(assessmentId: string): Promise<void> {
    // Get all modules
    const modules = await prisma.module.findMany({
      where: { isActive: true },
      select: {
        id: true,
        weight: true,
      },
    });

    // Calculate and store score for each module
    for (const module of modules) {
      const score = await this.calculateModuleScore(assessmentId, module.id);

      // Upsert module score
      await prisma.moduleScore.upsert({
        where: {
          assessmentId_moduleId: {
            assessmentId,
            moduleId: module.id,
          },
        },
        update: {
          score,
          maxScore: 100,
        },
        create: {
          assessmentId,
          moduleId: module.id,
          score,
          maxScore: 100,
        },
      });
    }
  }

  /**
   * Calculate overall assessment scores
   */
  async calculateOverallScores(assessmentId: string): Promise<{
    digitalScore: number;
    legacyScore: number;
    overallScore: number;
  }> {
    // Get all module scores for this assessment
    const moduleScores = await prisma.moduleScore.findMany({
      where: { assessmentId },
      include: {
        module: {
          select: {
            category: true,
            weight: true,
          },
        },
      },
    });

    if (moduleScores.length === 0) {
      return { digitalScore: 0, legacyScore: 0, overallScore: 0 };
    }

    // Define which modules contribute to digital vs legacy readiness
    const digitalModules = [
      'DIGITAL_PRESENCE',
      'CRM_ERP_SYSTEMS',
      'FINANCIAL_SYSTEMS',
      'TECH_INFRASTRUCTURE',
      'DATA_SECURITY',
    ];

    const legacyModules = [
      'PROCESS_ORGANIZATION',
      'PEOPLE_TRAINING',
      'CUSTOMER_EXPERIENCE',
      'SCALABILITY',
      'SUCCESSION_READINESS',
    ];

    // Calculate weighted scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    let digitalWeightedScore = 0;
    let digitalWeight = 0;

    let legacyWeightedScore = 0;
    let legacyWeight = 0;

    moduleScores.forEach((ms) => {
      const weight = ms.module.weight;
      const score = ms.score;

      // Overall score
      totalWeightedScore += score * weight;
      totalWeight += weight;

      // Digital score
      if (digitalModules.includes(ms.module.category)) {
        digitalWeightedScore += score * weight;
        digitalWeight += weight;
      }

      // Legacy score
      if (legacyModules.includes(ms.module.category)) {
        legacyWeightedScore += score * weight;
        legacyWeight += weight;
      }
    });

    const overallScore =
      totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const digitalScore =
      digitalWeight > 0 ? digitalWeightedScore / digitalWeight : 0;
    const legacyScore =
      legacyWeight > 0 ? legacyWeightedScore / legacyWeight : 0;

    return {
      digitalScore: Math.round(digitalScore * 100) / 100,
      legacyScore: Math.round(legacyScore * 100) / 100,
      overallScore: Math.round(overallScore * 100) / 100,
    };
  }

  /**
   * Score an entire assessment
   */
  async scoreAssessment(assessmentId: string): Promise<void> {
    try {
      // Calculate module scores
      await this.calculateAllModuleScores(assessmentId);

      // Calculate overall scores
      const scores = await this.calculateOverallScores(assessmentId);

      // Update assessment with scores
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          digitalScore: scores.digitalScore,
          legacyScore: scores.legacyScore,
          overallScore: scores.overallScore,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error scoring assessment:', error);
      throw error;
    }
  }
}
