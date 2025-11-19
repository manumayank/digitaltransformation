import { z } from 'zod';

// Enums matching Prisma schema
export const IndustryEnum = z.enum([
  'TECHNOLOGY',
  'RETAIL',
  'MANUFACTURING',
  'HEALTHCARE',
  'FINANCE',
  'REAL_ESTATE',
  'HOSPITALITY',
  'EDUCATION',
  'CONSTRUCTION',
  'PROFESSIONAL_SERVICES',
  'FOOD_AND_BEVERAGE',
  'TRANSPORTATION',
  'AGRICULTURE',
  'ENTERTAINMENT',
  'OTHER',
]);

export const BusinessSizeEnum = z.enum([
  'MICRO',    // 1-10 employees
  'SMALL',    // 11-50 employees
  'MEDIUM',   // 51-250 employees
  'LARGE',    // 251+ employees
]);

export const GrowthStageEnum = z.enum([
  'STARTUP',
  'EARLY_GROWTH',
  'ESTABLISHED',
  'MATURE',
  'EXIT_READY',
]);

export const ExitTimelineEnum = z.enum([
  '1-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
  'Not planning to exit',
]);

// Create business profile validation schema
export const createBusinessProfileSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, 'Business name is required').max(200),
    industry: IndustryEnum,
    businessSize: BusinessSizeEnum,
    growthStage: GrowthStageEnum,
    annualRevenue: z.number().positive().optional(),
    numberOfEmployees: z.number().int().positive().optional(),
    numberOfLocations: z.number().int().positive().optional(),
    yearEstablished: z
      .number()
      .int()
      .min(1800, 'Year must be after 1800')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .optional(),
    exitTimeline: ExitTimelineEnum.optional(),
    description: z.string().max(2000).optional(),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  }),
});

// Update business profile validation schema
export const updateBusinessProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid profile ID'),
  }),
  body: z.object({
    businessName: z.string().min(1).max(200).optional(),
    industry: IndustryEnum.optional(),
    businessSize: BusinessSizeEnum.optional(),
    growthStage: GrowthStageEnum.optional(),
    annualRevenue: z.number().positive().optional().nullable(),
    numberOfEmployees: z.number().int().positive().optional().nullable(),
    numberOfLocations: z.number().int().positive().optional().nullable(),
    yearEstablished: z
      .number()
      .int()
      .min(1800)
      .max(new Date().getFullYear())
      .optional()
      .nullable(),
    exitTimeline: ExitTimelineEnum.optional().nullable(),
    description: z.string().max(2000).optional().nullable(),
    website: z.string().url().optional().or(z.literal('')).nullable(),
  }),
});

// Get business profile by ID validation schema
export const getBusinessProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid profile ID'),
  }),
});

// Delete business profile validation schema
export const deleteBusinessProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid profile ID'),
  }),
});

// Types for use in controllers/services
export type CreateBusinessProfileInput = z.infer<
  typeof createBusinessProfileSchema.shape.body
>;
export type UpdateBusinessProfileInput = z.infer<
  typeof updateBusinessProfileSchema.shape.body
>;
