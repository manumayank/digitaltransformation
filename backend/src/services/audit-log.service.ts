import { PrismaClient, AuditAction } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface AuditLogData {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

export class AuditLogService {
  async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
      logger.info(`AUDIT: ${data.action} ${data.entityType}`, {
        userId: data.userId,
        entityId: data.entityId,
        details: data.details,
      });
    } catch (error) {
      logger.error('Failed to write audit log', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async logLogin(userId: string, email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({ userId, action: 'LOGIN', entityType: 'User', entityId: userId, ipAddress, userAgent });
  }

  async logLogout(userId: string, email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({ userId, action: 'LOGOUT', entityType: 'User', entityId: userId, ipAddress, userAgent });
  }

  async logAssessmentCreated(userId: string, assessmentId: string, businessName: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'CREATE', entityType: 'Assessment', entityId: assessmentId,
      ipAddress, userAgent, details: `Assessment created for "${businessName}"`
    });
  }

  async logAssessmentSubmitted(userId: string, assessmentId: string, businessName: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'SUBMIT', entityType: 'Assessment', entityId: assessmentId,
      ipAddress, userAgent, details: `Assessment submitted for "${businessName}"`
    });
  }

  async logAssessmentDeleted(userId: string, assessmentId: string, businessName: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'DELETE', entityType: 'Assessment', entityId: assessmentId,
      ipAddress, userAgent, details: `Assessment deleted for "${businessName}"`
    });
  }

  async logResponsesSaved(userId: string, assessmentId: string, responseCount: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'UPDATE', entityType: 'Assessment', entityId: assessmentId,
      ipAddress, userAgent, details: `${responseCount} responses saved`
    });
  }

  async logReportGenerated(userId: string, assessmentId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'CREATE', entityType: 'Report', entityId: assessmentId,
      ipAddress, userAgent, details: 'Report generated'
    });
  }

  async logReportDownloaded(userId: string, assessmentId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId, action: 'EXPORT', entityType: 'Report', entityId: assessmentId,
      ipAddress, userAgent, details: 'Report downloaded'
    });
  }

  async queryLogs(filters: any): Promise<any[]> {
    try {
      const { userId, action, entityType, startDate, endDate, limit = 100, skip = 0 } = filters;
      const where: any = {};
      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (entityType) where.entityType = entityType;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      return await prisma.auditLog.findMany({
        where, orderBy: { createdAt: 'desc' }, take: Math.min(limit, 1000), skip,
      });
    } catch (error) {
      logger.error('Failed to query audit logs', { error });
      return [];
    }
  }

  async getStats(days: number = 7): Promise<any> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const logs = await prisma.auditLog.findMany({
        where: { createdAt: { gte: since } },
        select: { action: true, userId: true },
      });
      const actionsByType: Record<string, number> = {};
      const activeUserIds = new Set<string>();
      logs.forEach((log) => {
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
        if (log.userId) activeUserIds.add(log.userId);
      });
      return { totalActions: logs.length, actionsByType, activeUsers: activeUserIds.size };
    } catch (error) {
      logger.error('Failed to get audit stats', { error });
      return { totalActions: 0, actionsByType: {}, activeUsers: 0 };
    }
  }
}

export const auditLogService = new AuditLogService();
