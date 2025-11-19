import apiClient from './client';

// Enums matching backend
export enum Industry {
  TECHNOLOGY = 'TECHNOLOGY',
  RETAIL = 'RETAIL',
  MANUFACTURING = 'MANUFACTURING',
  HEALTHCARE = 'HEALTHCARE',
  FINANCE = 'FINANCE',
  REAL_ESTATE = 'REAL_ESTATE',
  HOSPITALITY = 'HOSPITALITY',
  EDUCATION = 'EDUCATION',
  CONSTRUCTION = 'CONSTRUCTION',
  PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
  FOOD_AND_BEVERAGE = 'FOOD_AND_BEVERAGE',
  TRANSPORTATION = 'TRANSPORTATION',
  AGRICULTURE = 'AGRICULTURE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

export enum BusinessSize {
  MICRO = 'MICRO', // 1-10 employees
  SMALL = 'SMALL', // 11-50 employees
  MEDIUM = 'MEDIUM', // 51-250 employees
  LARGE = 'LARGE', // 251+ employees
}

export enum GrowthStage {
  STARTUP = 'STARTUP',
  EARLY_GROWTH = 'EARLY_GROWTH',
  ESTABLISHED = 'ESTABLISHED',
  MATURE = 'MATURE',
  EXIT_READY = 'EXIT_READY',
}

export type ExitTimeline =
  | '1-2 years'
  | '3-5 years'
  | '5-10 years'
  | '10+ years'
  | 'Not planning to exit';

// Types
export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  industry: Industry;
  businessSize: BusinessSize;
  growthStage: GrowthStage;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  numberOfLocations?: number | null;
  yearEstablished?: number | null;
  exitTimeline?: ExitTimeline | null;
  description?: string | null;
  website?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assessments: number;
  };
}

export interface BusinessProfileWithAssessments extends BusinessProfile {
  assessments: Array<{
    id: string;
    status: string;
    overallScore: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface BusinessProfileStats {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  averageScores: {
    overall: number;
    digital: number;
    legacy: number;
  };
  latestAssessment: {
    id: string;
    status: string;
    overallScore: number | null;
    digitalScore: number | null;
    legacyScore: number | null;
    createdAt: string;
  } | null;
}

export interface CreateBusinessProfileInput {
  businessName: string;
  industry: Industry;
  businessSize: BusinessSize;
  growthStage: GrowthStage;
  annualRevenue?: number;
  numberOfEmployees?: number;
  numberOfLocations?: number;
  yearEstablished?: number;
  exitTimeline?: ExitTimeline;
  description?: string;
  website?: string;
}

export interface UpdateBusinessProfileInput {
  businessName?: string;
  industry?: Industry;
  businessSize?: BusinessSize;
  growthStage?: GrowthStage;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  numberOfLocations?: number | null;
  yearEstablished?: number | null;
  exitTimeline?: ExitTimeline | null;
  description?: string | null;
  website?: string | null;
}

// API Client
export const businessProfileAPI = {
  /**
   * Create a new business profile
   */
  create: async (
    data: CreateBusinessProfileInput
  ): Promise<BusinessProfile> => {
    const response = await apiClient.post('/business-profiles', data);
    return response.data.data;
  },

  /**
   * Get all business profiles for current user
   */
  getAll: async (): Promise<BusinessProfile[]> => {
    const response = await apiClient.get('/business-profiles');
    return response.data.data;
  },

  /**
   * Get a single business profile by ID
   */
  getById: async (id: string): Promise<BusinessProfileWithAssessments> => {
    const response = await apiClient.get(`/business-profiles/${id}`);
    return response.data.data;
  },

  /**
   * Update a business profile
   */
  update: async (
    id: string,
    data: UpdateBusinessProfileInput
  ): Promise<BusinessProfile> => {
    const response = await apiClient.put(`/business-profiles/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a business profile
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/business-profiles/${id}`);
  },

  /**
   * Get business profile statistics
   */
  getStats: async (id: string): Promise<BusinessProfileStats> => {
    const response = await apiClient.get(`/business-profiles/${id}/stats`);
    return response.data.data;
  },
};

// Helper functions for display
export const getIndustryLabel = (industry: Industry): string => {
  const labels: Record<Industry, string> = {
    [Industry.TECHNOLOGY]: 'Technology',
    [Industry.RETAIL]: 'Retail',
    [Industry.MANUFACTURING]: 'Manufacturing',
    [Industry.HEALTHCARE]: 'Healthcare',
    [Industry.FINANCE]: 'Finance',
    [Industry.REAL_ESTATE]: 'Real Estate',
    [Industry.HOSPITALITY]: 'Hospitality',
    [Industry.EDUCATION]: 'Education',
    [Industry.CONSTRUCTION]: 'Construction',
    [Industry.PROFESSIONAL_SERVICES]: 'Professional Services',
    [Industry.FOOD_AND_BEVERAGE]: 'Food & Beverage',
    [Industry.TRANSPORTATION]: 'Transportation',
    [Industry.AGRICULTURE]: 'Agriculture',
    [Industry.ENTERTAINMENT]: 'Entertainment',
    [Industry.OTHER]: 'Other',
  };
  return labels[industry];
};

export const getBusinessSizeLabel = (size: BusinessSize): string => {
  const labels: Record<BusinessSize, string> = {
    [BusinessSize.MICRO]: 'Micro (1-10 employees)',
    [BusinessSize.SMALL]: 'Small (11-50 employees)',
    [BusinessSize.MEDIUM]: 'Medium (51-250 employees)',
    [BusinessSize.LARGE]: 'Large (251+ employees)',
  };
  return labels[size];
};

export const getGrowthStageLabel = (stage: GrowthStage): string => {
  const labels: Record<GrowthStage, string> = {
    [GrowthStage.STARTUP]: 'Startup',
    [GrowthStage.EARLY_GROWTH]: 'Early Growth',
    [GrowthStage.ESTABLISHED]: 'Established',
    [GrowthStage.MATURE]: 'Mature',
    [GrowthStage.EXIT_READY]: 'Exit Ready',
  };
  return labels[stage];
};
