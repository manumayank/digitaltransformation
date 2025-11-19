import apiClient from './client';

// Types
export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
}

export interface ModuleScore {
  id: string;
  assessmentId: string;
  moduleId: string;
  score: number;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  module?: {
    name: string;
    category: string;
  };
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface RiskFlag {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  category: string;
  impact: string;
  mitigation: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum RecommendationPriority {
  IMMEDIATE = 'IMMEDIATE',
  SHORT_TERM = 'SHORT_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
  LONG_TERM = 'LONG_TERM',
}

export interface Recommendation {
  id: string;
  assessmentId: string;
  moduleId: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  estimatedCost: string | null;
  estimatedTimeframe: string | null;
  expectedImpact: string;
  valuationImpact: string | null;
  implementationSteps: string[] | null;
  resources: Array<{ title: string; url?: string; description: string }> | null;
  createdAt: string;
  updatedAt: string;
  module?: {
    name: string;
    category: string;
  };
}

export interface Assessment {
  id: string;
  userId: string;
  businessProfileId: string;
  status: AssessmentStatus;
  startedAt: string;
  submittedAt?: string | null;
  completedAt?: string | null;
  digitalScore?: number | null;
  legacyScore?: number | null;
  overallScore?: number | null;
  createdAt: string;
  updatedAt: string;
  businessProfile?: {
    id: string;
    businessName: string;
    industry: string;
    businessSize: string;
    growthStage?: string;
  };
  responses?: Response[];
  moduleScores?: ModuleScore[];
  riskFlags?: RiskFlag[];
  recommendations?: Recommendation[];
  _count?: {
    responses: number;
  };
}

export interface Response {
  id: string;
  assessmentId: string;
  questionId: string;
  answer: any; // Can be boolean, string, number, object
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentInput {
  businessProfileId: string;
}

export interface SaveResponsesInput {
  responses: Array<{
    questionId: string;
    answer: any;
  }>;
}

// API Client
export const assessmentAPI = {
  /**
   * Create a new assessment
   */
  create: async (data: CreateAssessmentInput): Promise<Assessment> => {
    const response = await apiClient.post('/assessments', data);
    return response.data.data;
  },

  /**
   * Get all assessments for current user
   */
  getAll: async (): Promise<Assessment[]> => {
    const response = await apiClient.get('/assessments');
    return response.data.data;
  },

  /**
   * Get a single assessment by ID
   */
  getById: async (id: string): Promise<Assessment> => {
    const response = await apiClient.get(`/assessments/${id}`);
    return response.data.data;
  },

  /**
   * Save responses for an assessment
   */
  saveResponses: async (
    id: string,
    data: SaveResponsesInput
  ): Promise<void> => {
    await apiClient.put(`/assessments/${id}/responses`, data);
  },

  /**
   * Submit an assessment
   */
  submit: async (id: string): Promise<Assessment> => {
    const response = await apiClient.post(`/assessments/${id}/submit`);
    return response.data.data;
  },

  /**
   * Delete an assessment
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assessments/${id}`);
  },
};

// Helper functions
export const getAssessmentStatusLabel = (status: AssessmentStatus): string => {
  const labels: Record<AssessmentStatus, string> = {
    [AssessmentStatus.DRAFT]: 'Draft',
    [AssessmentStatus.IN_PROGRESS]: 'In Progress',
    [AssessmentStatus.SUBMITTED]: 'Submitted',
    [AssessmentStatus.COMPLETED]: 'Completed',
  };
  return labels[status];
};

export const getAssessmentStatusColor = (status: AssessmentStatus): string => {
  const colors: Record<AssessmentStatus, string> = {
    [AssessmentStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [AssessmentStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [AssessmentStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
    [AssessmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
  };
  return colors[status];
};

export const getRiskLevelLabel = (level: RiskLevel): string => {
  const labels: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'Low Risk',
    [RiskLevel.MEDIUM]: 'Medium Risk',
    [RiskLevel.HIGH]: 'High Risk',
    [RiskLevel.CRITICAL]: 'Critical Risk',
  };
  return labels[level];
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
    [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [RiskLevel.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
    [RiskLevel.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[level];
};

export const getRecommendationPriorityLabel = (priority: RecommendationPriority): string => {
  const labels: Record<RecommendationPriority, string> = {
    [RecommendationPriority.IMMEDIATE]: 'Immediate (0-30 days)',
    [RecommendationPriority.SHORT_TERM]: 'Short Term (30-90 days)',
    [RecommendationPriority.MEDIUM_TERM]: 'Medium Term (90-180 days)',
    [RecommendationPriority.LONG_TERM]: 'Long Term (180+ days)',
  };
  return labels[priority];
};

export const getRecommendationPriorityColor = (priority: RecommendationPriority): string => {
  const colors: Record<RecommendationPriority, string> = {
    [RecommendationPriority.IMMEDIATE]: 'bg-red-100 text-red-800 border-red-200',
    [RecommendationPriority.SHORT_TERM]: 'bg-orange-100 text-orange-800 border-orange-200',
    [RecommendationPriority.MEDIUM_TERM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [RecommendationPriority.LONG_TERM]: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[priority];
};
