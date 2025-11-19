// ============================================
// USER TYPES
// ============================================

export enum UserRole {
  USER = 'USER',
  CONSULTANT = 'CONSULTANT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// ============================================
// BUSINESS PROFILE TYPES
// ============================================

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
  MICRO = 'MICRO',           // 1-10 employees
  SMALL = 'SMALL',           // 11-50 employees
  MEDIUM = 'MEDIUM',         // 51-250 employees
  LARGE = 'LARGE',           // 251+ employees
}

export enum GrowthStage {
  STARTUP = 'STARTUP',
  EARLY_GROWTH = 'EARLY_GROWTH',
  ESTABLISHED = 'ESTABLISHED',
  MATURE = 'MATURE',
  EXIT_READY = 'EXIT_READY',
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  industry: Industry;
  businessSize: BusinessSize;
  growthStage: GrowthStage;
  annualRevenue?: number;
  numberOfEmployees?: number;
  numberOfLocations?: number;
  yearEstablished?: number;
  exitTimeline?: string;
  description?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// MODULE TYPES
// ============================================

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

export interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string;
  weight: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// QUESTION TYPES
// ============================================

export enum QuestionType {
  YES_NO = 'YES_NO',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SCALE = 'SCALE',
  TEXT = 'TEXT',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export interface QuestionOption {
  id: string;
  label: string;
  value?: string | number;
}

export interface ConditionalLogic {
  showIf?: {
    questionId: string;
    answer: any;
  };
  hideIf?: {
    questionId: string;
    answer: any;
  };
}

export interface Question {
  id: string;
  moduleId: string;
  questionText: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  scaleMin?: number;
  scaleMax?: number;
  weight: number;
  orderIndex: number;
  isRequired: boolean;
  isActive: boolean;
  conditionalLogic?: ConditionalLogic;
  applicableIndustry: string[];
  applicableSize: string[];
  helpText?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ASSESSMENT TYPES
// ============================================

export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
}

export interface Assessment {
  id: string;
  userId: string;
  businessProfileId: string;
  status: AssessmentStatus;
  startedAt: Date;
  submittedAt?: Date;
  completedAt?: Date;
  digitalScore?: number;
  legacyScore?: number;
  overallScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  assessmentId: string;
  questionId: string;
  answer: any;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SCORING TYPES
// ============================================

export interface ModuleScore {
  id: string;
  assessmentId: string;
  moduleId: string;
  score: number;
  maxScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// RISK FLAG TYPES
// ============================================

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
  mitigation?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// RECOMMENDATION TYPES
// ============================================

export enum RecommendationPriority {
  IMMEDIATE = 'IMMEDIATE',          // 0-30 days
  SHORT_TERM = 'SHORT_TERM',        // 30-90 days
  MEDIUM_TERM = 'MEDIUM_TERM',      // 90-180 days
  LONG_TERM = 'LONG_TERM',          // 180+ days
}

export interface Recommendation {
  id: string;
  assessmentId: string;
  moduleId: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  estimatedCost?: string;
  estimatedTimeframe?: string;
  expectedImpact: string;
  valuationImpact?: string;
  implementationSteps?: string[];
  resources?: any;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REPORT TYPES
// ============================================

export enum ReportStatus {
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Report {
  id: string;
  assessmentId: string;
  reportData: any;
  pdfUrl?: string;
  reportStatus: ReportStatus;
  generatedAt: Date;
  downloadCount: number;
  lastDownloadAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportData {
  assessment: Assessment;
  businessProfile: BusinessProfile;
  moduleScores: ModuleScore[];
  riskFlags: RiskFlag[];
  recommendations: Recommendation[];
  summary: {
    digitalScore: number;
    legacyScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    criticalActions: string[];
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  SUBMIT = 'SUBMIT',
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
