# DRLTAS Feature Tickets & Prioritization

## Overview

This document outlines all feature tickets for the DRLTAS MVP, organized by priority and dependencies. Each ticket includes acceptance criteria, estimated effort, and dependencies.

## Priority Levels

- **P0 (Critical)**: Must-have for MVP, blocking other features
- **P1 (High)**: Essential for MVP, core functionality
- **P2 (Medium)**: Important for MVP, enhances user experience
- **P3 (Low)**: Nice-to-have, can be deferred to V2

## Effort Estimation

- **XS**: 1-2 hours
- **S**: 2-4 hours (0.5 day)
- **M**: 1-2 days
- **L**: 3-5 days
- **XL**: 1-2 weeks

---

## PHASE 1: Foundation & Authentication (Week 1)

### 🔴 P0-001: User Authentication System
**Priority**: P0
**Effort**: L (3-5 days)
**Dependencies**: None

**Description**: Implement complete user authentication system with JWT tokens.

**Tasks**:
- [ ] Create user registration endpoint with validation
- [ ] Implement login endpoint with password verification
- [ ] Build JWT token generation and validation
- [ ] Implement refresh token mechanism
- [ ] Create password hashing with bcrypt
- [ ] Add email validation
- [ ] Build logout functionality

**Acceptance Criteria**:
- Users can register with email/password
- Users can login and receive JWT tokens
- Tokens expire after 7 days
- Refresh tokens work for 30 days
- Password must meet complexity requirements
- All passwords are hashed
- Invalid credentials return proper errors

**Files**:
- `backend/src/controllers/auth.controller.ts`
- `backend/src/services/auth.service.ts`
- Update: `backend/src/routes/auth.routes.ts`

---

### 🔴 P0-002: Frontend Authentication Flow
**Priority**: P0
**Effort**: M (1-2 days)
**Dependencies**: P0-001

**Description**: Build frontend authentication pages and flows.

**Tasks**:
- [ ] Create registration page with form validation
- [ ] Create login page
- [ ] Implement authentication state management (Zustand)
- [ ] Add protected route middleware
- [ ] Build token storage and refresh logic
- [ ] Create logout functionality
- [ ] Add password strength indicator
- [ ] Handle authentication errors

**Acceptance Criteria**:
- Registration form validates all fields
- Login redirects to dashboard on success
- Protected routes redirect to login
- Tokens auto-refresh before expiry
- Error messages display clearly
- Logout clears all tokens

**Files**:
- `frontend/app/(auth)/register/page.tsx`
- `frontend/app/(auth)/login/page.tsx`
- `frontend/lib/stores/auth.store.ts`
- `frontend/middleware.ts`

---

### 🟡 P1-003: User Profile Management
**Priority**: P1
**Effort**: M (1-2 days)
**Dependencies**: P0-001

**Description**: Allow users to view and update their profile information.

**Tasks**:
- [ ] Create get profile endpoint
- [ ] Create update profile endpoint
- [ ] Create change password endpoint
- [ ] Build profile page UI
- [ ] Add profile form with validation
- [ ] Implement password change flow

**Acceptance Criteria**:
- Users can view their profile
- Users can update name, phone
- Users can change password
- Old password required for change
- Form validation works
- Success/error messages display

**Files**:
- `backend/src/controllers/user.controller.ts`
- `frontend/app/(dashboard)/profile/page.tsx`

---

## PHASE 2: Business Profile & Core Data (Week 1-2)

### 🔴 P0-004: Business Profile Creation
**Priority**: P0
**Effort**: L (3-5 days)
**Dependencies**: P0-001

**Description**: Implement business profile creation and management.

**Tasks**:
- [ ] Create business profile endpoints (CRUD)
- [ ] Build business profile form UI
- [ ] Add industry dropdown with all options
- [ ] Add business size selector
- [ ] Add growth stage selector
- [ ] Implement form validation
- [ ] Store business profile in database
- [ ] Link profile to user account

**Acceptance Criteria**:
- Users can create business profile
- All fields validate properly
- Industry, size, stage are required
- Optional fields work correctly
- Profile saves successfully
- Users can edit their profile
- Profile links to assessments

**Files**:
- `backend/src/controllers/business-profile.controller.ts`
- `backend/src/services/business-profile.service.ts`
- `backend/src/routes/business-profile.routes.ts`
- `frontend/app/(dashboard)/business-profile/create/page.tsx`
- `frontend/app/(dashboard)/business-profile/edit/[id]/page.tsx`

---

### 🔴 P0-005: Module Data Management
**Priority**: P0
**Effort**: S (2-4 hours)
**Dependencies**: Database seeded

**Description**: Create endpoints to retrieve module information.

**Tasks**:
- [ ] Create get all modules endpoint
- [ ] Create get module by ID endpoint
- [ ] Create get module by category endpoint
- [ ] Add caching for module data
- [ ] Implement error handling

**Acceptance Criteria**:
- All 10 modules can be retrieved
- Modules return with correct weights
- Modules ordered by orderIndex
- Only active modules shown
- Responses are cached

**Files**:
- `backend/src/controllers/module.controller.ts`
- `backend/src/services/module.service.ts`
- Update: `backend/src/routes/module.routes.ts`

---

## PHASE 3: Questionnaire System (Week 2-3)

### 🔴 P0-006: Question Management System
**Priority**: P0
**Effort**: XL (1-2 weeks)
**Dependencies**: P0-005

**Description**: Build complete questionnaire system with adaptive logic.

**Tasks**:
- [ ] Create questions for all 10 modules (content creation)
- [ ] Build question CRUD endpoints
- [ ] Implement conditional logic engine
- [ ] Create get questions by module endpoint
- [ ] Filter questions by industry/size
- [ ] Build question validation logic
- [ ] Add question weighting system

**Acceptance Criteria**:
- All 10 modules have questions
- Questions filter by business profile
- Conditional logic works correctly
- Question types (Yes/No, Multiple Choice, Scale) supported
- Questions have proper weights
- Help text displays correctly

**Files**:
- `backend/src/controllers/question.controller.ts`
- `backend/src/services/question.service.ts`
- `backend/prisma/seeds/questions.ts` (new)
- Update: `backend/src/routes/module.routes.ts`

---

### 🔴 P0-007: Frontend Question Components
**Priority**: P0
**Effort**: L (3-5 days)
**Dependencies**: P0-006

**Description**: Build reusable question components for all question types.

**Tasks**:
- [ ] Create Yes/No question component
- [ ] Create Multiple Choice question component
- [ ] Create Scale (1-5) question component
- [ ] Create Text input question component
- [ ] Build question container/wrapper
- [ ] Add progress indicator
- [ ] Implement help text tooltip
- [ ] Add validation feedback

**Acceptance Criteria**:
- All question types render correctly
- Components are reusable
- Validation works for all types
- Help text displays on hover/click
- Progress shows % complete
- Answers save on change

**Files**:
- `frontend/components/questions/YesNoQuestion.tsx`
- `frontend/components/questions/MultipleChoiceQuestion.tsx`
- `frontend/components/questions/ScaleQuestion.tsx`
- `frontend/components/questions/TextQuestion.tsx`
- `frontend/components/questions/QuestionWrapper.tsx`

---

### 🟡 P1-008: Assessment Wizard UI
**Priority**: P1
**Effort**: L (3-5 days)
**Dependencies**: P0-007

**Description**: Build multi-step wizard for assessment completion.

**Tasks**:
- [ ] Create wizard layout with navigation
- [ ] Build module navigation sidebar
- [ ] Implement auto-save functionality
- [ ] Add progress tracking per module
- [ ] Build "Save & Continue Later" feature
- [ ] Add confirmation before submission
- [ ] Implement conditional question display
- [ ] Handle wizard state management

**Acceptance Criteria**:
- Users can navigate between modules
- Progress saves automatically
- Users can exit and resume
- Questions adapt based on answers
- Submit button only shows when complete
- Confirmation modal works
- State persists on page refresh

**Files**:
- `frontend/app/(dashboard)/assessment/[id]/page.tsx`
- `frontend/components/assessment/AssessmentWizard.tsx`
- `frontend/components/assessment/ModuleSidebar.tsx`
- `frontend/lib/stores/assessment.store.ts`

---

## PHASE 4: Assessment & Responses (Week 3)

### 🔴 P0-009: Assessment Management Backend
**Priority**: P0
**Effort**: L (3-5 days)
**Dependencies**: P0-004

**Description**: Implement assessment creation and response handling.

**Tasks**:
- [ ] Create assessment creation endpoint
- [ ] Build response submission endpoint
- [ ] Implement auto-save responses
- [ ] Create get assessment endpoint
- [ ] Build assessment list endpoint
- [ ] Add assessment status transitions
- [ ] Validate responses against questions
- [ ] Handle assessment completion

**Acceptance Criteria**:
- Users can create new assessment
- Responses save individually or in batch
- Assessment status updates correctly
- Users can retrieve their assessments
- Response validation works
- Completed assessments can't be edited

**Files**:
- `backend/src/controllers/assessment.controller.ts`
- `backend/src/services/assessment.service.ts`
- Update: `backend/src/routes/assessment.routes.ts`

---

### 🟡 P1-010: Assessment Dashboard
**Priority**: P1
**Effort**: M (1-2 days)
**Dependencies**: P0-009

**Description**: Build user dashboard showing all assessments.

**Tasks**:
- [ ] Create dashboard layout
- [ ] Display assessment list
- [ ] Show assessment status badges
- [ ] Add "New Assessment" button
- [ ] Display scores (if completed)
- [ ] Add filters (status, date)
- [ ] Implement pagination
- [ ] Add assessment actions (view, continue, delete)

**Acceptance Criteria**:
- All user assessments display
- Status shows clearly
- Scores display for completed ones
- Users can start new assessment
- Users can continue in-progress
- Users can view completed
- Pagination works correctly

**Files**:
- `frontend/app/(dashboard)/page.tsx`
- `frontend/components/dashboard/AssessmentList.tsx`
- `frontend/components/dashboard/AssessmentCard.tsx`

---

## PHASE 5: Scoring Engine (Week 4)

### 🔴 P0-011: Scoring Algorithm Implementation
**Priority**: P0
**Effort**: XL (1-2 weeks)
**Dependencies**: P0-009

**Description**: Build core scoring engine that calculates all scores.

**Tasks**:
- [ ] Design scoring algorithm logic
- [ ] Implement module score calculation
- [ ] Calculate Digital Readiness Score (weighted)
- [ ] Calculate Legacy Transfer Score (weighted)
- [ ] Calculate Overall Score
- [ ] Store module scores
- [ ] Store overall scores
- [ ] Handle missing responses
- [ ] Add scoring validation
- [ ] Implement score recalculation

**Acceptance Criteria**:
- Module scores calculate correctly (0-100)
- Weights apply properly per PRD
- Digital Score aggregates correctly
- Legacy Score aggregates correctly
- Overall Score is average of both
- Scores store in database
- Missing answers handled gracefully
- Scores can be recalculated

**Files**:
- `backend/src/services/scoring.service.ts`
- `backend/src/utils/scoring-algorithms.ts`
- `backend/src/controllers/scoring.controller.ts`

---

### 🟡 P1-012: Risk Flag Generation
**Priority**: P1
**Effort**: L (3-5 days)
**Dependencies**: P0-011

**Description**: Automatically generate risk flags based on responses.

**Tasks**:
- [ ] Define risk detection rules
- [ ] Implement risk flag generator
- [ ] Categorize risks by severity
- [ ] Create risk descriptions
- [ ] Add impact explanations
- [ ] Generate mitigation suggestions
- [ ] Store risk flags
- [ ] Link risks to modules

**Acceptance Criteria**:
- Risks generate based on answers
- Severity levels (Low/Medium/High/Critical) work
- Each risk has clear description
- Impact is explained
- Mitigation suggestions provided
- Risks link to specific modules

**Files**:
- `backend/src/services/risk-analysis.service.ts`
- `backend/src/utils/risk-rules.ts`

---

### 🟡 P1-013: Recommendation Engine
**Priority**: P1
**Effort**: L (3-5 days)
**Dependencies**: P0-011

**Description**: Generate personalized recommendations based on scores.

**Tasks**:
- [ ] Define recommendation templates
- [ ] Build recommendation generator
- [ ] Prioritize recommendations (Immediate/Short/Medium/Long)
- [ ] Add implementation steps
- [ ] Include cost estimates
- [ ] Add timeframe estimates
- [ ] Link to valuation impact
- [ ] Store recommendations

**Acceptance Criteria**:
- Recommendations generate per module
- Priority levels assigned correctly
- Implementation steps are actionable
- Cost/timeframe estimates included
- Valuation impact explained
- Recommendations stored properly

**Files**:
- `backend/src/services/recommendation.service.ts`
- `backend/src/utils/recommendation-templates.ts`

---

## PHASE 6: Results & Reporting (Week 4-5)

### 🔴 P0-014: Results Dashboard UI
**Priority**: P0
**Effort**: L (3-5 days)
**Dependencies**: P0-011

**Description**: Build comprehensive results dashboard with visualizations.

**Tasks**:
- [ ] Create results page layout
- [ ] Display overall scores (Digital/Legacy/Overall)
- [ ] Build module scorecard component
- [ ] Create radar chart for modules
- [ ] Add bar chart for module comparison
- [ ] Display risk flags section
- [ ] Show recommendations section
- [ ] Add download report button

**Acceptance Criteria**:
- All scores display prominently
- Charts render correctly
- Module breakdown is clear
- Risk flags show with severity
- Recommendations organized by priority
- UI is responsive
- Data loads efficiently

**Files**:
- `frontend/app/(dashboard)/assessment/[id]/results/page.tsx`
- `frontend/components/results/ScoreOverview.tsx`
- `frontend/components/results/ModuleScorecard.tsx`
- `frontend/components/results/RadarChart.tsx`
- `frontend/components/results/RiskFlags.tsx`
- `frontend/components/results/Recommendations.tsx`

---

### 🟡 P1-015: PDF Report Generation
**Priority**: P1
**Effort**: XL (1-2 weeks)
**Dependencies**: P0-014

**Description**: Generate professional PDF reports using PDFKit.

**Tasks**:
- [ ] Design PDF report template
- [ ] Implement PDF generation service
- [ ] Add executive summary section
- [ ] Include overall scores with visuals
- [ ] Add module-by-module breakdown
- [ ] Include risk flags section
- [ ] Add recommendations section
- [ ] Include 30-60-90 day roadmap
- [ ] Add valuation impact section
- [ ] Store PDF metadata
- [ ] Create download endpoint

**Acceptance Criteria**:
- PDF generates successfully
- Report is professionally formatted
- All sections included per PRD
- Charts/graphs render in PDF
- File downloads correctly
- PDF stored/referenced in database
- Generation is reasonably fast (<30s)

**Files**:
- `backend/src/services/pdf-generator.service.ts`
- `backend/src/utils/pdf-templates.ts`
- `backend/src/controllers/report.controller.ts`
- Update: `backend/src/routes/report.routes.ts`

---

## PHASE 7: Admin Panel (Week 5-6)

### 🟢 P2-016: Admin Dashboard
**Priority**: P2
**Effort**: M (1-2 days)
**Dependencies**: P0-001

**Description**: Build admin dashboard for system overview.

**Tasks**:
- [ ] Create admin layout
- [ ] Display system statistics
- [ ] Show total users count
- [ ] Show total assessments count
- [ ] Display completion rate
- [ ] Add charts for trends
- [ ] Implement date range filter

**Acceptance Criteria**:
- Admin can view system stats
- Statistics are accurate
- Charts display correctly
- Filters work
- Only admins can access

**Files**:
- `frontend/app/(admin)/dashboard/page.tsx`
- `backend/src/controllers/admin.controller.ts`

---

### 🟢 P2-017: User Management Admin
**Priority**: P2
**Effort**: M (1-2 days)
**Dependencies**: P2-016

**Description**: Allow admins to manage users.

**Tasks**:
- [ ] Create user list view
- [ ] Add user search/filter
- [ ] Enable user activation/deactivation
- [ ] Allow role changes
- [ ] Add user details view
- [ ] Implement pagination

**Acceptance Criteria**:
- Admins can view all users
- Search and filters work
- Users can be activated/deactivated
- Roles can be changed
- Actions log to audit trail

**Files**:
- `frontend/app/(admin)/users/page.tsx`
- `backend/src/controllers/admin/user-management.controller.ts`

---

### 🟢 P2-018: Question Management Admin
**Priority**: P2
**Effort**: L (3-5 days)
**Dependencies**: P0-006

**Description**: Allow admins to manage questions and modules.

**Tasks**:
- [ ] Create question list view
- [ ] Add question creation form
- [ ] Enable question editing
- [ ] Allow question activation/deactivation
- [ ] Add conditional logic builder
- [ ] Implement question reordering
- [ ] Add bulk operations

**Acceptance Criteria**:
- Admins can view all questions
- Questions can be created/edited
- Conditional logic can be set
- Questions can be reordered
- Bulk actions work
- Changes reflect immediately

**Files**:
- `frontend/app/(admin)/questions/page.tsx`
- `frontend/components/admin/QuestionEditor.tsx`
- `backend/src/controllers/admin/question-management.controller.ts`

---

## PHASE 8: Polish & Enhancement (Week 6)

### 🟢 P2-019: Email Notifications
**Priority**: P2
**Effort**: M (1-2 days)
**Dependencies**: P0-001

**Description**: Send email notifications for key events.

**Tasks**:
- [ ] Set up email service (SMTP)
- [ ] Create email templates
- [ ] Send welcome email on registration
- [ ] Send assessment completion email
- [ ] Send report ready notification
- [ ] Implement email queue

**Acceptance Criteria**:
- Emails send successfully
- Templates render correctly
- Emails are branded
- Unsubscribe link works
- Queue handles failures

**Files**:
- `backend/src/services/email.service.ts`
- `backend/src/templates/emails/`

---

### 🟢 P2-020: Assessment History & Comparison
**Priority**: P2
**Effort**: M (1-2 days)
**Dependencies**: P0-011

**Description**: Allow users to compare multiple assessments over time.

**Tasks**:
- [ ] Create comparison view
- [ ] Display score trends
- [ ] Show improvement areas
- [ ] Add timeline visualization
- [ ] Enable selecting assessments to compare

**Acceptance Criteria**:
- Users can view assessment history
- Multiple assessments can be compared
- Trends display clearly
- Improvements highlighted
- Charts show progress over time

**Files**:
- `frontend/app/(dashboard)/assessments/compare/page.tsx`
- `frontend/components/comparison/ComparisonChart.tsx`

---

### 🔵 P3-021: Export to CSV/Excel
**Priority**: P3
**Effort**: S (2-4 hours)
**Dependencies**: P0-011

**Description**: Allow exporting assessment data to CSV/Excel.

**Tasks**:
- [ ] Create CSV export endpoint
- [ ] Format data for export
- [ ] Add download button
- [ ] Include all relevant fields

**Acceptance Criteria**:
- Users can export assessment data
- CSV includes all key information
- File downloads correctly
- Data is formatted properly

**Files**:
- `backend/src/services/export.service.ts`
- `backend/src/controllers/export.controller.ts`

---

### 🔵 P3-022: Industry Benchmarking
**Priority**: P3
**Effort**: L (3-5 days)
**Dependencies**: P0-011

**Description**: Show how user scores compare to industry averages.

**Tasks**:
- [ ] Calculate industry benchmarks
- [ ] Store benchmark data
- [ ] Display comparison in results
- [ ] Add percentile rankings
- [ ] Show industry-specific insights

**Acceptance Criteria**:
- Industry averages calculated
- User score compared to average
- Percentile displayed
- Insights are relevant
- Data updates periodically

**Files**:
- `backend/src/services/benchmark.service.ts`
- `frontend/components/results/BenchmarkComparison.tsx`

---

## MVP Scope Summary

### Must-Have (P0) - 11 tickets
1. User Authentication System (Backend)
2. Frontend Authentication Flow
3. Business Profile Creation
4. Module Data Management
5. Question Management System
6. Frontend Question Components
7. Assessment Management Backend
8. Scoring Algorithm Implementation
9. Results Dashboard UI
10. PDF Report Generation (if time allows)

### Should-Have (P1) - 6 tickets
1. User Profile Management
2. Assessment Wizard UI
3. Assessment Dashboard
4. Risk Flag Generation
5. Recommendation Engine
6. PDF Report Generation (moved here if not P0)

### Nice-to-Have (P2) - 5 tickets
1. Admin Dashboard
2. User Management Admin
3. Question Management Admin
4. Email Notifications
5. Assessment History & Comparison

### Post-MVP (P3) - 2 tickets
1. Export to CSV/Excel
2. Industry Benchmarking

---

## Sprint Planning

### Sprint 1 (Week 1): Foundation
- P0-001: User Authentication System
- P0-002: Frontend Authentication Flow
- P1-003: User Profile Management

### Sprint 2 (Week 1-2): Core Data
- P0-004: Business Profile Creation
- P0-005: Module Data Management
- P0-006: Question Management System (start)

### Sprint 3 (Week 2-3): Questionnaire
- P0-006: Question Management System (complete)
- P0-007: Frontend Question Components
- P1-008: Assessment Wizard UI

### Sprint 4 (Week 3): Assessment Flow
- P0-009: Assessment Management Backend
- P1-010: Assessment Dashboard

### Sprint 5 (Week 4): Scoring
- P0-011: Scoring Algorithm Implementation
- P1-012: Risk Flag Generation
- P1-013: Recommendation Engine

### Sprint 6 (Week 4-5): Results & Reports
- P0-014: Results Dashboard UI
- P1-015: PDF Report Generation

### Sprint 7 (Week 5-6): Admin & Polish
- P2-016: Admin Dashboard
- P2-017: User Management Admin
- P2-018: Question Management Admin
- P2-019: Email Notifications

---

## Dependencies Graph

```
P0-001 (Auth Backend)
  ├─> P0-002 (Auth Frontend)
  ├─> P1-003 (Profile)
  ├─> P0-004 (Business Profile)
  └─> P2-016 (Admin)

P0-004 (Business Profile)
  └─> P0-009 (Assessment)

Database Seed
  └─> P0-005 (Modules)
       └─> P0-006 (Questions)
            └─> P0-007 (Question Components)
                 └─> P1-008 (Wizard)

P0-009 (Assessment)
  ├─> P1-010 (Dashboard)
  └─> P0-011 (Scoring)
       ├─> P1-012 (Risk Flags)
       ├─> P1-013 (Recommendations)
       ├─> P0-014 (Results UI)
       │    └─> P1-015 (PDF)
       └─> P3-022 (Benchmarking)

P0-001 (Auth)
  └─> P2-019 (Email)
```

---

## Effort Summary

**Total Estimated Effort**: ~60-75 days (12-15 weeks for single developer)

**By Priority**:
- P0 (Critical): ~35-45 days
- P1 (High): ~15-20 days
- P2 (Medium): ~10-12 days
- P3 (Low): ~5-8 days

**Recommended Team Size for 6-week MVP**: 2-3 developers

---

## Success Metrics

### MVP Launch Criteria
- [ ] Users can register and login
- [ ] Users can create business profile
- [ ] Users can complete assessment (all 10 modules)
- [ ] System calculates scores correctly
- [ ] Results dashboard displays all data
- [ ] PDF report generates successfully
- [ ] Admin can manage users and questions
- [ ] System is secure and stable

### Quality Gates
- [ ] All P0 tickets completed
- [ ] At least 80% of P1 tickets completed
- [ ] Core user flow tested end-to-end
- [ ] No critical bugs
- [ ] Performance acceptable (<3s page loads)
- [ ] Mobile responsive
- [ ] Documentation complete
