# DRLTAS Testing Guide

**Last Updated**: November 19, 2025
**Version**: 1.0.0 (MVP)

## Overview

This guide provides comprehensive test cases for all features of the Digital Readiness & Legacy-Transfer Audit System (DRLTAS). Use this guide for manual testing, QA validation, and regression testing.

---

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- PostgreSQL database with seed data
- Clean test data (or ability to reset)

### Test Users
```
Regular User:
  Email: test@example.com
  Password: Test123!@#

Admin User:
  Email: admin@example.com
  Password: Admin123!@#
```

---

## 1. Authentication Testing

### 1.1 User Registration

**Test Case**: Successful Registration
- Navigate to `/auth/register`
- Fill in all fields:
  - Email: `newuser@test.com`
  - Password: `Test123!@#`
  - Confirm Password: `Test123!@#`
  - First Name: `John`
  - Last Name: `Doe`
- Click "Register"
- **Expected**: Redirect to dashboard, success message displayed
- **Verify**: User can see dashboard, token stored in localStorage

**Test Case**: Password Validation
- Try passwords: `test` (too short), `password` (no number), `Pass1` (no special char)
- **Expected**: Error messages for each validation rule

**Test Case**: Duplicate Email
- Register with existing email
- **Expected**: Error message "Email already exists"

**Test Case**: Password Mismatch
- Enter different passwords in Password and Confirm Password
- **Expected**: Error message "Passwords do not match"

### 1.2 User Login

**Test Case**: Successful Login
- Navigate to `/auth/login`
- Enter valid credentials
- **Expected**: Redirect to dashboard, welcome message

**Test Case**: Invalid Credentials
- Enter wrong password
- **Expected**: Error message "Invalid credentials"

**Test Case**: Non-existent User
- Enter email that doesn't exist
- **Expected**: Error message "Invalid credentials"

**Test Case**: Session Persistence
- Login successfully
- Refresh browser
- **Expected**: User remains logged in, dashboard loads

### 1.3 Logout

**Test Case**: Logout Functionality
- Click logout button in navigation
- **Expected**: Redirect to login page, token removed from localStorage

---

## 2. Business Profile Testing

### 2.1 Create Business Profile

**Test Case**: Complete Profile Creation
- Navigate to `/business-profile/create`
- Fill in all required fields:
  - Business Name: `ABC Manufacturing`
  - Industry: `MANUFACTURING`
  - Business Size: `MEDIUM`
  - Growth Stage: `ESTABLISHED`
  - Optional: Revenue, Employees, etc.
- Click "Create Profile"
- **Expected**: Redirect to profile list, success message, profile appears in list

**Test Case**: Required Field Validation
- Try to submit with empty required fields
- **Expected**: Validation errors for each required field

**Test Case**: Industry Dropdown
- Click Industry dropdown
- **Expected**: All 15 industries listed (Technology, Retail, Manufacturing, etc.)

### 2.2 Edit Business Profile

**Test Case**: Update Profile
- Navigate to existing profile
- Click "Edit"
- Change Business Name to `XYZ Corp`
- Click "Save"
- **Expected**: Profile updated, success message, changes reflected

### 2.3 Delete Business Profile

**Test Case**: Delete Profile
- Navigate to profile
- Click "Delete"
- Confirm deletion
- **Expected**: Profile removed from list, success message

**Test Case**: Cancel Delete
- Click "Delete"
- Cancel confirmation
- **Expected**: Profile NOT deleted, remains in list

### 2.4 View Business Profile

**Test Case**: Profile Details
- Click on a profile
- **Expected**: All profile details displayed correctly
- **Verify**: Name, industry, size, growth stage, optional fields

---

## 3. Assessment Testing

### 3.1 Create Assessment

**Test Case**: Start New Assessment
- Navigate to `/assessment/new`
- Select a business profile
- Click "Start Assessment"
- **Expected**: Redirect to assessment page, first module loads

**Test Case**: No Business Profile
- Try to start assessment without creating business profile first
- **Expected**: Appropriate message/redirect to create profile

### 3.2 Assessment Flow

**Test Case**: Module Navigation
- Complete questions in Module 1
- Click "Next Module"
- **Expected**: Progress to Module 2, progress indicator updates

**Test Case**: Previous Module
- Navigate to Module 2
- Click "Previous Module"
- **Expected**: Return to Module 1, previous answers preserved

**Test Case**: Answer YES/NO Question
- Select "Yes" for a YES_NO question
- **Expected**: Selection highlighted, answer saved

**Test Case**: Answer SCALE Question
- Move slider to value (e.g., 7)
- **Expected**: Value displayed, answer saved

**Test Case**: Answer MULTIPLE_CHOICE Question
- Select one option
- **Expected**: Option selected, other options deselected, answer saved

**Test Case**: Answer TEXT Question
- Type answer in text area
- **Expected**: Text saved, can edit

**Test Case**: Auto-Save
- Answer a question
- Wait 2 seconds
- Refresh browser
- **Expected**: Answer still present, not lost

### 3.3 Assessment Progress

**Test Case**: Progress Bar
- Answer 25% of questions
- **Expected**: Progress bar shows approximately 25%

**Test Case**: Module Completion
- Complete all questions in a module
- **Expected**: Module marked as complete in sidebar

**Test Case**: Resume Assessment
- Start assessment
- Answer some questions
- Navigate away (to dashboard)
- Come back to assessment
- **Expected**: Progress preserved, can continue from where left off

### 3.4 Assessment Submission

**Test Case**: Submit Complete Assessment
- Complete all 10 modules (answer all questions)
- Click "Submit Assessment"
- Confirm submission
- **Expected**:
  - Redirect to results page
  - Scores calculated
  - Risks generated
  - Recommendations generated
  - Success message displayed

**Test Case**: Submit Incomplete Assessment
- Try to submit with unanswered questions
- **Expected**: Warning message, submission prevented OR allowed with warning

**Test Case**: Submission Confirmation
- Click "Submit Assessment"
- Click "Cancel" on confirmation
- **Expected**: Submission cancelled, remain on assessment page

---

## 4. Scoring & Results Testing

### 4.1 Score Calculation

**Test Case**: Overall Score Display
- View completed assessment results
- **Expected**: Overall score (0-100) displayed prominently

**Test Case**: Digital vs Legacy Scores
- **Expected**: Both Digital and Legacy scores displayed
- **Verify**: Scores make sense based on answers

**Test Case**: Module Scores
- Navigate to "Module Scores" tab
- **Expected**: All 10 modules show individual scores
- **Verify**: Progress bars match score values

**Test Case**: Score Color Coding
- Check score colors:
  - 80-100: Green
  - 60-79: Blue
  - 40-59: Yellow
  - 0-39: Red
- **Expected**: Colors match score ranges

### 4.2 Risk Analysis

**Test Case**: Risk Flags Display
- Navigate to "Risk Analysis" tab
- **Expected**: Risks displayed with severity badges

**Test Case**: Risk Severity Count
- **Expected**: Summary cards show count by severity (Critical/High/Medium/Low)

**Test Case**: Risk Details
- Click on a risk card
- **Expected**: Title, description, impact, and mitigation displayed

**Test Case**: No Risks (High Score)
- For assessment with all high scores (80+)
- **Expected**: "No Risks Detected" message with positive icon

**Test Case**: Critical Risks (Low Scores)
- For assessment with scores < 30 in modules
- **Expected**: CRITICAL risks flagged with red badges

### 4.3 Recommendations

**Test Case**: Recommendations Display
- Navigate to "Recommendations" tab
- **Expected**: Recommendations grouped by priority (Immediate/Short/Medium/Long-term)

**Test Case**: Recommendation Details
- Click "Show More Details" on a recommendation
- **Expected**:
  - Expected Impact displayed
  - Valuation Impact shown
  - Implementation Steps listed (numbered)
  - Resources with links shown

**Test Case**: Recommendation Priority
- **Expected**: Immediate recommendations (red badges) listed first
- **Verify**: Priorities make sense (low scores → immediate, high scores → long-term)

**Test Case**: Cost & Timeframe
- **Expected**: Each recommendation shows estimated cost and timeframe
- **Verify**: Estimates are reasonable

**Test Case**: Expand/Collapse
- Click "Show More Details"
- **Expected**: Details expand
- Click "Show Less"
- **Expected**: Details collapse

---

## 5. PDF Report Testing

### 5.1 PDF Generation

**Test Case**: Download PDF
- On results page, click "Download PDF Report"
- **Expected**:
  - Button shows "Generating PDF..." with spinner
  - PDF downloads to browser's download folder
  - Success toast message appears
  - Filename: `Digital-Readiness-Assessment-{id}.pdf`

**Test Case**: PDF Content - Cover Page
- Open downloaded PDF
- **Expected**:
  - Business name displayed
  - Overall score (large, prominent)
  - Score label (Excellent/Good/Fair/Needs Improvement)
  - Completion date
  - DRLTAS branding

**Test Case**: PDF Content - Executive Summary
- Navigate to page 2
- **Expected**:
  - Business profile details
  - Overall assessment summary
  - Key findings
  - Strategic guidance based on score

**Test Case**: PDF Content - Scores
- **Expected**:
  - Overall score with progress bar
  - Digital score with progress bar
  - Legacy score with progress bar
  - Score interpretation guide

**Test Case**: PDF Content - Module Breakdown
- **Expected**:
  - All 10 modules listed
  - Each with score and progress bar
  - Module categories labeled

**Test Case**: PDF Content - Risks
- **Expected**:
  - All risks from web view present
  - Severity levels shown
  - Impact and mitigation included
  - Color-coded text

**Test Case**: PDF Content - Recommendations
- **Expected**:
  - All recommendations present
  - Prioritized correctly
  - Cost and timeframe included
  - Impact and implementation steps present

**Test Case**: PDF Content - Action Plan
- **Expected**:
  - 30-day priorities listed
  - 60-90 day priorities listed
  - Next steps provided

**Test Case**: PDF Multi-Page
- For assessment with many risks/recommendations
- **Expected**:
  - Content flows across multiple pages
  - No content cut off
  - Page breaks logical

**Test Case**: Download While Generating
- Click "Download PDF Report"
- Immediately click again
- **Expected**: Button disabled, second click has no effect

**Test Case**: PDF for Incomplete Assessment
- Try to download PDF for incomplete/non-scored assessment
- **Expected**: Error message, no PDF generated

---

## 6. Dashboard Testing

### 6.1 Assessment List

**Test Case**: View All Assessments
- Navigate to dashboard
- **Expected**: All user's assessments displayed as cards

**Test Case**: Assessment Card Content
- For each assessment card, verify:
  - Business name
  - Status badge (Draft/In Progress/Submitted/Completed)
  - Scores (if completed)
  - Start date
  - Completion date (if completed)
  - Response count

**Test Case**: Status Filter
- Select "Completed" filter
- **Expected**: Only completed assessments shown
- Try other filters (Draft, In Progress, etc.)
- **Expected**: Filtered correctly

**Test Case**: Sort by Date
- Select "Sort by Date"
- **Expected**: Assessments ordered newest first

**Test Case**: Sort by Score
- Select "Sort by Score"
- **Expected**: Assessments ordered highest score first
- **Verify**: Assessments without scores appear last

**Test Case**: Stats Overview
- **Expected**: Stats cards show:
  - Total assessments count
  - Completed count
  - In progress count
  - Average score (calculated correctly)

### 6.2 Assessment Actions

**Test Case**: Continue Assessment
- Click "Continue" on in-progress assessment
- **Expected**: Navigate to assessment, loads at current progress

**Test Case**: View Results
- Click "View Results" on completed assessment
- **Expected**: Navigate to results page with all scores/risks/recommendations

**Test Case**: Delete Assessment
- Click "Delete" on an assessment
- **Expected**: Confirmation dialog appears

**Test Case**: Confirm Delete
- Click "Delete" and confirm
- **Expected**: Assessment removed from list, success toast

**Test Case**: Cancel Delete
- Click "Delete" and cancel
- **Expected**: Assessment NOT deleted, remains in list

**Test Case**: Start New Assessment
- Click "New Assessment" button
- **Expected**: Navigate to business profile selection

### 6.3 Empty States

**Test Case**: No Assessments
- For new user with no assessments
- **Expected**:
  - Empty state message
  - "Create your first assessment" guidance
  - Button to start new assessment

**Test Case**: No Filtered Results
- Apply filter that returns no results
- **Expected**: "No assessments found" message with suggestion to change filter

---

## 7. User Profile Testing

### 7.1 View Profile

**Test Case**: Access Profile
- Click username in navigation
- Navigate to `/profile`
- **Expected**: Profile page loads with user details

**Test Case**: Display User Info
- **Expected**: Shows email, first name, last name, phone (if set)

### 7.2 Update Profile

**Test Case**: Update Name
- Change first name and last name
- Click "Save"
- **Expected**: Profile updated, success message, name updates in nav

**Test Case**: Update Phone
- Add/change phone number
- Click "Save"
- **Expected**: Phone number updated, success message

**Test Case**: Email Display
- **Expected**: Email field is read-only (cannot be changed)

### 7.3 Change Password

**Test Case**: Successful Password Change
- Enter current password
- Enter new password: `NewPass123!@#`
- Confirm new password
- Click "Change Password"
- **Expected**: Password updated, success message

**Test Case**: Incorrect Current Password
- Enter wrong current password
- **Expected**: Error message "Current password is incorrect"

**Test Case**: New Password Validation
- Enter weak new password
- **Expected**: Validation error messages

**Test Case**: Password Mismatch
- Enter different passwords for new and confirm
- **Expected**: Error message "Passwords do not match"

---

## 8. Responsive Design Testing

### 8.1 Mobile View (375px width)

**Test Case**: Navigation Menu
- View on mobile
- **Expected**: Hamburger menu OR responsive nav stack

**Test Case**: Assessment Cards
- **Expected**: Stack vertically, full width

**Test Case**: Assessment Questions
- **Expected**: Questions stack, easy to answer on touch

**Test Case**: Dashboard Stats
- **Expected**: Stack vertically, one per row

**Test Case**: Results Tabs
- **Expected**: Tabs stack or scroll horizontally

### 8.2 Tablet View (768px width)

**Test Case**: Assessment Grid
- **Expected**: 2-column grid for assessment cards

**Test Case**: Module Breakdown
- **Expected**: 2-column grid for module cards

**Test Case**: Navigation
- **Expected**: All links visible, proper spacing

### 8.3 Desktop View (1024px+)

**Test Case**: Full Layout
- **Expected**: All features display optimally
- **Verify**: No horizontal scrolling, proper spacing

---

## 9. Error Handling Testing

### 9.1 Network Errors

**Test Case**: Backend Down
- Stop backend server
- Try to load dashboard
- **Expected**: Error message, graceful handling

**Test Case**: Slow Network
- Throttle network to 3G speed
- Load assessment
- **Expected**: Loading indicators show, no crashes

**Test Case**: Request Timeout
- Simulate timeout
- **Expected**: Error message, retry option

### 9.2 Invalid Data

**Test Case**: Invalid Assessment ID
- Navigate to `/assessment/invalid-id`
- **Expected**: Error message, redirect to dashboard

**Test Case**: Access Other User's Assessment
- Try to access assessment belonging to another user
- **Expected**: 404 or 403 error, redirect to dashboard

**Test Case**: Malformed Input
- Enter special characters or script tags in text fields
- **Expected**: Input sanitized, no XSS vulnerability

### 9.3 Edge Cases

**Test Case**: Very Long Business Name
- Create profile with 200-character business name
- **Expected**: Handled gracefully, truncated if needed in UI

**Test Case**: Special Characters
- Use business name with emojis, accents, special chars
- **Expected**: Stored and displayed correctly

**Test Case**: Browser Back Button
- Complete assessment
- Click browser back
- **Expected**: Navigate back gracefully, no data loss

**Test Case**: Session Expiry
- Wait for token to expire (or manually delete token)
- Try to access protected route
- **Expected**: Redirect to login, appropriate message

---

## 10. Security Testing

### 10.1 Authentication

**Test Case**: Protected Routes
- Access `/dashboard` without logging in
- **Expected**: Redirect to `/auth/login`

**Test Case**: Token Validation
- Manually edit token in localStorage
- Try to access API
- **Expected**: 401 Unauthorized error

**Test Case**: CSRF Protection
- (If implemented) Test CSRF token validation
- **Expected**: Requests without valid CSRF token rejected

### 10.2 Authorization

**Test Case**: User Isolation
- User A creates assessment
- User B logs in
- User B tries to access User A's assessment
- **Expected**: 404 or 403, cannot access

**Test Case**: Admin vs User
- Regular user tries to access admin routes
- **Expected**: 403 Forbidden or redirect

### 10.3 Input Validation

**Test Case**: SQL Injection
- Try SQL injection in text fields (e.g., `'; DROP TABLE users; --`)
- **Expected**: Input sanitized, no SQL executed

**Test Case**: XSS Attack
- Enter `<script>alert('XSS')</script>` in text field
- **Expected**: Script not executed, text escaped

**Test Case**: File Upload (if applicable)
- Upload malicious file (if file upload exists)
- **Expected**: File type validated, malicious files rejected

---

## 11. Performance Testing

### 11.1 Page Load Times

**Test Case**: Dashboard Load
- Measure time to load dashboard
- **Expected**: < 2 seconds on average connection

**Test Case**: Assessment Load
- Load assessment with 70+ questions
- **Expected**: < 3 seconds

**Test Case**: Results Load
- Load results with scores, risks, recommendations
- **Expected**: < 2 seconds

### 11.2 API Response Times

**Test Case**: Assessment Submission
- Submit complete assessment
- Measure time for scoring
- **Expected**: < 2 seconds (includes scoring, risk analysis, recommendations)

**Test Case**: PDF Generation
- Generate PDF
- Measure time
- **Expected**: < 5 seconds for standard report

### 11.3 Database Queries

**Test Case**: Large Dataset
- Create 50 assessments
- Load dashboard
- **Expected**: Loads quickly, pagination if needed

**Test Case**: Concurrent Users
- Simulate 10 users accessing system simultaneously
- **Expected**: No performance degradation, no errors

---

## 12. Browser Compatibility Testing

### 12.1 Chrome (Latest)
- Test all features
- **Expected**: Full functionality

### 12.2 Firefox (Latest)
- Test all features
- **Expected**: Full functionality

### 12.3 Safari (Latest)
- Test all features
- **Expected**: Full functionality, especially auth storage

### 12.4 Edge (Latest)
- Test all features
- **Expected**: Full functionality

### 12.5 Mobile Browsers
- Test on iOS Safari and Android Chrome
- **Expected**: Full functionality, responsive design works

---

## 13. Accessibility Testing

### 13.1 Keyboard Navigation

**Test Case**: Tab Navigation
- Use Tab key to navigate entire site
- **Expected**: All interactive elements reachable, logical order

**Test Case**: Enter to Submit
- Fill form
- Press Enter
- **Expected**: Form submits

**Test Case**: Escape to Close
- Open modal/dialog
- Press Escape
- **Expected**: Modal closes

### 13.2 Screen Reader

**Test Case**: ARIA Labels
- Use screen reader
- **Expected**: All elements properly announced, no "button" without label

**Test Case**: Form Labels
- Navigate forms
- **Expected**: Each input has associated label read by screen reader

**Test Case**: Error Messages
- Trigger validation error
- **Expected**: Error announced by screen reader

### 13.3 Color Contrast

**Test Case**: Text Readability
- Check color contrast ratios
- **Expected**: All text meets WCAG AA standards (4.5:1 for normal text)

**Test Case**: Color-Only Indicators
- **Expected**: Information not conveyed by color alone (also uses text/icons)

---

## 14. Data Integrity Testing

### 14.1 Assessment Data

**Test Case**: Answer Preservation
- Answer questions
- Close browser
- Reopen, resume assessment
- **Expected**: All answers preserved

**Test Case**: Concurrent Editing
- Open assessment in two tabs
- Edit in both
- **Expected**: Last save wins, no data corruption

**Test Case**: Score Consistency
- Submit assessment
- Check scores
- Re-calculate manually
- **Expected**: Scores match expected calculation

### 14.2 Cascade Deletes

**Test Case**: Delete Business Profile
- Create business profile
- Create assessment for profile
- Delete business profile
- **Expected**: Associated assessment also deleted

**Test Case**: Delete Assessment
- Create assessment with responses
- Delete assessment
- **Expected**: All responses also deleted

---

## Regression Testing Checklist

After any code changes, test these critical paths:

- [ ] User can register and login
- [ ] User can create business profile
- [ ] User can start and complete assessment
- [ ] Assessment submits and scores correctly
- [ ] Results page loads with scores, risks, recommendations
- [ ] PDF downloads successfully
- [ ] Dashboard shows all assessments
- [ ] User can continue in-progress assessment
- [ ] Logout works correctly

---

## Bug Report Template

When reporting bugs, include:

```
**Summary**: Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- User Type: Regular User
- Assessment ID: abc123 (if applicable)

**Screenshots**: Attach if applicable

**Console Errors**: Copy any error messages

**Severity**: Critical / High / Medium / Low
```

---

## Test Sign-Off

### Test Execution Summary

| Module | Test Cases | Passed | Failed | Not Tested | Notes |
|--------|-----------|--------|--------|------------|-------|
| Authentication | 12 | - | - | - | |
| Business Profile | 10 | - | - | - | |
| Assessment | 18 | - | - | - | |
| Scoring | 12 | - | - | - | |
| PDF Reports | 15 | - | - | - | |
| Dashboard | 15 | - | - | - | |
| User Profile | 8 | - | - | - | |
| Security | 10 | - | - | - | |
| Performance | 8 | - | - | - | |

**Tested By**: ___________
**Date**: ___________
**Version**: ___________
**Environment**: ___________

**Overall Result**: ☐ Pass ☐ Fail ☐ Pass with Issues

**Notes**:
___________________________________________
___________________________________________
___________________________________________

---

## Automated Testing Recommendations

For future implementation:

### Unit Tests
- Authentication service
- Scoring algorithms
- Risk detection rules
- Recommendation logic

### Integration Tests
- API endpoints
- Database operations
- PDF generation
- Email sending (when implemented)

### E2E Tests (Cypress/Playwright)
- Complete user registration flow
- Complete assessment submission flow
- PDF download flow
- Dashboard interaction flow

### Test Coverage Goals
- Unit Tests: 80% coverage
- Integration Tests: Key API endpoints
- E2E Tests: Critical user paths

---

**End of Testing Guide**
