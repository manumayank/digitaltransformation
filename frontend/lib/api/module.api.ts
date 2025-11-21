import { apiClient } from '../api-client';

// Enums matching backend
export enum ModuleCategory {
  DIGITAL_PRESENCE = 'DIGITAL_PRESENCE',
  PROCESS_ORGANIZATION = 'PROCESS_ORGANIZATION',
  CRM_ERP_SYSTEMS = 'CRM_ERP_SYSTEMS',
  FINANCIAL_SYSTEMS = 'FINANCIAL_SYSTEMS',
  TECH_INFRASTRUCTURE = 'TECH_INFRASTRUCTURE',
  DATA_SECURITY = 'DATA_SECURITY',
  PEOPLE_TRAINING = 'PEOPLE_TRAINING',
  CUSTOMER_EXPERIENCE = 'CUSTOMER_EXPERIENCE',
  SCALABILITY = 'SCALABILITY',
  SUCCESSION_READINESS = 'SUCCESSION_READINESS',
}

export enum QuestionType {
  YES_NO = 'YES_NO',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SCALE = 'SCALE',
  TEXT = 'TEXT',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

// Types
export interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string;
  weight: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
  };
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: any; // JSON - array for MULTIPLE_CHOICE
  scaleMin?: number | null;
  scaleMax?: number | null;
  weight: number;
  orderIndex: number;
  isRequired: boolean;
  conditionalLogic?: any; // JSON - conditional display rules
  applicableIndustry: string[];
  applicableSize: string[];
  helpText?: string | null;
}

export interface ModuleWithQuestionsResponse {
  data: Question[];
  total: number;
  moduleId: string;
  moduleName: string;
  filters: {
    industry: string | null;
    size: string | null;
  };
}

export interface GetModulesResponse {
  data: Module[];
  total: number;
  cached?: boolean;
}

// API Client
export const moduleAPI = {
  /**
   * Get all active modules
   */
  getAll: async (): Promise<Module[]> => {
    const response = await apiClient.get<GetModulesResponse>('/modules');
    return response.data.data;
  },

  /**
   * Get a single module by ID
   */
  getById: async (id: string): Promise<Module> => {
    const response = await apiClient.get(`/modules/${id}`);
    return response.data.data;
  },

  /**
   * Get a module by category
   */
  getByCategory: async (category: ModuleCategory): Promise<Module> => {
    const response = await apiClient.get(`/modules/category/${category}`);
    return response.data.data;
  },

  /**
   * Get questions for a specific module
   * @param id Module ID
   * @param filters Optional filters (industry, size)
   */
  getQuestions: async (
    id: string,
    filters?: { industry?: string; size?: string }
  ): Promise<ModuleWithQuestionsResponse> => {
    const params = new URLSearchParams();
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.size) params.append('size', filters.size);

    const queryString = params.toString();
    const url = `/modules/${id}/questions${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ModuleWithQuestionsResponse>(url);
    return response.data;
  },
};

// Helper functions for display
export const getModuleCategoryLabel = (category: ModuleCategory): string => {
  const labels: Record<ModuleCategory, string> = {
    [ModuleCategory.DIGITAL_PRESENCE]: 'Digital Presence',
    [ModuleCategory.PROCESS_ORGANIZATION]: 'Process Organization',
    [ModuleCategory.CRM_ERP_SYSTEMS]: 'CRM & ERP Systems',
    [ModuleCategory.FINANCIAL_SYSTEMS]: 'Financial Systems',
    [ModuleCategory.TECH_INFRASTRUCTURE]: 'Tech Infrastructure',
    [ModuleCategory.DATA_SECURITY]: 'Data Security',
    [ModuleCategory.PEOPLE_TRAINING]: 'People & Training',
    [ModuleCategory.CUSTOMER_EXPERIENCE]: 'Customer Experience',
    [ModuleCategory.SCALABILITY]: 'Scalability',
    [ModuleCategory.SUCCESSION_READINESS]: 'Succession Readiness',
  };
  return labels[category];
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  const labels: Record<QuestionType, string> = {
    [QuestionType.YES_NO]: 'Yes/No',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.SCALE]: 'Scale',
    [QuestionType.TEXT]: 'Text',
    [QuestionType.FILE_UPLOAD]: 'File Upload',
  };
  return labels[type];
};

// Helper to get module icon based on category
export const getModuleIcon = (category: ModuleCategory): string => {
  const icons: Record<ModuleCategory, string> = {
    [ModuleCategory.DIGITAL_PRESENCE]: '🌐',
    [ModuleCategory.PROCESS_ORGANIZATION]: '📊',
    [ModuleCategory.CRM_ERP_SYSTEMS]: '🔄',
    [ModuleCategory.FINANCIAL_SYSTEMS]: '💰',
    [ModuleCategory.TECH_INFRASTRUCTURE]: '🖥️',
    [ModuleCategory.DATA_SECURITY]: '🔒',
    [ModuleCategory.PEOPLE_TRAINING]: '👥',
    [ModuleCategory.CUSTOMER_EXPERIENCE]: '🤝',
    [ModuleCategory.SCALABILITY]: '📈',
    [ModuleCategory.SUCCESSION_READINESS]: '🔑',
  };
  return icons[category];
};

// Helper to get module color based on category
export const getModuleColor = (category: ModuleCategory): string => {
  const colors: Record<ModuleCategory, string> = {
    [ModuleCategory.DIGITAL_PRESENCE]: 'bg-blue-100 text-blue-800',
    [ModuleCategory.PROCESS_ORGANIZATION]: 'bg-purple-100 text-purple-800',
    [ModuleCategory.CRM_ERP_SYSTEMS]: 'bg-indigo-100 text-indigo-800',
    [ModuleCategory.FINANCIAL_SYSTEMS]: 'bg-green-100 text-green-800',
    [ModuleCategory.TECH_INFRASTRUCTURE]: 'bg-gray-100 text-gray-800',
    [ModuleCategory.DATA_SECURITY]: 'bg-red-100 text-red-800',
    [ModuleCategory.PEOPLE_TRAINING]: 'bg-yellow-100 text-yellow-800',
    [ModuleCategory.CUSTOMER_EXPERIENCE]: 'bg-pink-100 text-pink-800',
    [ModuleCategory.SCALABILITY]: 'bg-teal-100 text-teal-800',
    [ModuleCategory.SUCCESSION_READINESS]: 'bg-orange-100 text-orange-800',
  };
  return colors[category];
};
