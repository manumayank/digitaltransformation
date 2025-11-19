import { z } from 'zod';

// Module category enum matching Prisma schema
export const ModuleCategoryEnum = z.enum([
  'DIGITAL_PRESENCE',
  'PROCESS_ORGANIZATION',
  'CRM_ERP_SYSTEMS',
  'FINANCIAL_SYSTEMS',
  'TECH_INFRASTRUCTURE',
  'DATA_SECURITY',
  'PEOPLE_TRAINING',
  'CUSTOMER_EXPERIENCE',
  'SCALABILITY',
  'SUCCESSION_READINESS',
]);

// Get module by ID validation schema
export const getModuleByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid module ID'),
  }),
});

// Get module by category validation schema
export const getModuleByCategorySchema = z.object({
  params: z.object({
    category: ModuleCategoryEnum,
  }),
});

// Get questions for module validation schema
export const getModuleQuestionsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid module ID'),
  }),
  query: z.object({
    industry: z.string().optional(),
    size: z.string().optional(),
  }),
});
