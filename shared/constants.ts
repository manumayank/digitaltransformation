import { ModuleCategory } from './types';

// ============================================
// MODULE WEIGHTS (as per PRD)
// ============================================

export const MODULE_WEIGHTS: Record<ModuleCategory, number> = {
  [ModuleCategory.DIGITAL_PRESENCE]: 10,
  [ModuleCategory.PROCESS_ORGANIZATION]: 20,
  [ModuleCategory.CRM_ERP_SYSTEMS]: 15,
  [ModuleCategory.FINANCIAL_SYSTEMS]: 10,
  [ModuleCategory.TECH_INFRASTRUCTURE]: 10,
  [ModuleCategory.DATA_SECURITY]: 10,
  [ModuleCategory.PEOPLE_TRAINING]: 10,
  [ModuleCategory.CUSTOMER_EXPERIENCE]: 5,
  [ModuleCategory.SCALABILITY]: 5,
  [ModuleCategory.SUCCESSION_READINESS]: 15,
};

// ============================================
// MODULE NAMES
// ============================================

export const MODULE_NAMES: Record<ModuleCategory, string> = {
  [ModuleCategory.DIGITAL_PRESENCE]: 'Digital Presence & Visibility',
  [ModuleCategory.PROCESS_ORGANIZATION]: 'Internal Process Organization',
  [ModuleCategory.CRM_ERP_SYSTEMS]: 'CRM / ERP / Core Systems',
  [ModuleCategory.FINANCIAL_SYSTEMS]: 'Financial Systems & Reporting',
  [ModuleCategory.TECH_INFRASTRUCTURE]: 'Technology Stack & Infrastructure',
  [ModuleCategory.DATA_SECURITY]: 'Data Security & Compliance',
  [ModuleCategory.PEOPLE_TRAINING]: 'People, Roles & Training',
  [ModuleCategory.CUSTOMER_EXPERIENCE]: 'Customer Experience Maturity',
  [ModuleCategory.SCALABILITY]: 'Business Scalability & Repeatability',
  [ModuleCategory.SUCCESSION_READINESS]: 'Succession & Exit Readiness',
};

// ============================================
// SCORE THRESHOLDS
// ============================================

export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0,
} as const;

export const SCORE_LABELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Needs Improvement',
  POOR: 'Critical',
} as const;

// ============================================
// RISK LEVEL LABELS
// ============================================

export const RISK_LEVEL_LABELS = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical Risk',
} as const;

// ============================================
// BUSINESS SIZE LABELS
// ============================================

export const BUSINESS_SIZE_LABELS = {
  MICRO: '1-10 employees',
  SMALL: '11-50 employees',
  MEDIUM: '51-250 employees',
  LARGE: '251+ employees',
} as const;

// ============================================
// GROWTH STAGE LABELS
// ============================================

export const GROWTH_STAGE_LABELS = {
  STARTUP: 'Startup',
  EARLY_GROWTH: 'Early Growth',
  ESTABLISHED: 'Established',
  MATURE: 'Mature',
  EXIT_READY: 'Exit Ready',
} as const;

// ============================================
// INDUSTRY LABELS
// ============================================

export const INDUSTRY_LABELS = {
  TECHNOLOGY: 'Technology',
  RETAIL: 'Retail',
  MANUFACTURING: 'Manufacturing',
  HEALTHCARE: 'Healthcare',
  FINANCE: 'Finance',
  REAL_ESTATE: 'Real Estate',
  HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education',
  CONSTRUCTION: 'Construction',
  PROFESSIONAL_SERVICES: 'Professional Services',
  FOOD_AND_BEVERAGE: 'Food & Beverage',
  TRANSPORTATION: 'Transportation',
  AGRICULTURE: 'Agriculture',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
} as const;

// ============================================
// RECOMMENDATION PRIORITY LABELS
// ============================================

export const RECOMMENDATION_PRIORITY_LABELS = {
  IMMEDIATE: 'Immediate (0-30 days)',
  SHORT_TERM: 'Short Term (30-90 days)',
  MEDIUM_TERM: 'Medium Term (90-180 days)',
  LONG_TERM: 'Long Term (180+ days)',
} as const;

// ============================================
// ASSESSMENT STATUS LABELS
// ============================================

export const ASSESSMENT_STATUS_LABELS = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  COMPLETED: 'Completed',
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
} as const;

// ============================================
// API PAGINATION
// ============================================

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;
