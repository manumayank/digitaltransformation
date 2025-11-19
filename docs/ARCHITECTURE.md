# DRLTAS Architecture Documentation

## System Overview

The Digital Readiness & Legacy-Transfer Audit System (DRLTAS) is built as a modern monorepo application with a clear separation between frontend, backend, and shared components.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
│  - React 18 + Next.js 14 (App Router)                  │
│  - TypeScript + Tailwind CSS                            │
│  - State Management (Zustand)                           │
│  - Form Handling (React Hook Form + Zod)                │
└─────────────────┬───────────────────────────────────────┘
                  │ REST API (HTTP/HTTPS)
┌─────────────────▼───────────────────────────────────────┐
│                  Backend (Node.js + Express)             │
│  - TypeScript + Express.js                              │
│  - JWT Authentication                                    │
│  - Business Logic & Controllers                         │
│  - PDF Generation (PDFKit)                              │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼───────┐
│   PostgreSQL   │  │     Redis    │
│   (Database)   │  │    (Cache)   │
└────────────────┘  └──────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcrypt, express-rate-limit
- **Validation**: Zod + express-validator
- **PDF Generation**: PDFKit
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Shared
- **Common Types**: TypeScript interfaces/enums
- **Constants**: Shared configuration values
- **Utilities**: Reusable helper functions

## Directory Structure

```
digitaltransformation/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seed data
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Utility functions
│   │   │   ├── errors.ts
│   │   │   └── logger.ts
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/                # Auth routes group
│   │   ├── (dashboard)/           # Protected routes group
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── ui/                    # Reusable UI components
│   │   └── features/              # Feature-specific components
│   ├── lib/                       # Utilities
│   │   ├── api-client.ts          # API client
│   │   └── utils.ts               # Helper functions
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.ts
├── shared/
│   ├── types.ts                   # Shared TypeScript types
│   ├── constants.ts               # Shared constants
│   ├── index.ts                   # Package entry point
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md            # This file
│   └── API.md                     # API documentation
├── package.json                   # Root package.json
├── docker-compose.yml             # Docker services
└── README.md                      # Project README
```

## Core Components

### 1. Database Layer (Prisma + PostgreSQL)

The database schema is defined in `backend/prisma/schema.prisma` and includes:

- **Users & Authentication**: User accounts, roles, refresh tokens
- **Business Profiles**: Company information, industry, size
- **Modules**: 10 assessment modules with weights
- **Questions**: Adaptive questionnaire with conditional logic
- **Assessments**: User assessment instances
- **Responses**: User answers to questions
- **Scoring**: Module scores and overall scores
- **Risk Flags**: Identified risks and mitigation strategies
- **Recommendations**: Actionable improvement suggestions
- **Reports**: Generated PDF reports and metadata
- **Industry Templates**: Industry-specific configurations
- **Audit Logs**: System activity tracking

### 2. Backend API Layer

**Architecture Pattern**: MVC (Model-View-Controller)

#### Key Components:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic
3. **Middleware**: Authentication, validation, error handling
4. **Routes**: Define API endpoints

#### API Structure:

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── /assessments
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   └── POST   /:id/submit
├── /modules
│   ├── GET /
│   ├── GET /:id
│   └── GET /:id/questions
├── /reports
│   ├── GET /:assessmentId
│   └── GET /:assessmentId/download
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   └── PUT /password
└── /admin
    ├── /users
    ├── /assessments
    ├── /modules
    └── /questions
```

### 3. Frontend Layer

**Architecture Pattern**: Feature-based structure with Next.js App Router

#### Key Features:

1. **Route Groups**:
   - `(auth)`: Login, register, password reset
   - `(dashboard)`: Protected assessment interface
   - `(public)`: Landing pages

2. **Component Structure**:
   - `components/ui`: Reusable UI primitives (Button, Input, Card, etc.)
   - `components/features`: Feature-specific components
   - `components/layouts`: Layout components

3. **State Management**:
   - Global state: Zustand stores
   - Form state: React Hook Form
   - Server state: React Query (future enhancement)

4. **Authentication Flow**:
   - JWT token stored in httpOnly cookies
   - Automatic token refresh
   - Protected route middleware

### 4. Shared Package

Contains TypeScript types, enums, constants, and utilities shared between frontend and backend.

Benefits:
- Single source of truth for types
- Type safety across the stack
- Reduced code duplication

## Data Flow

### Assessment Flow:

```
1. User Registration/Login
   ↓
2. Create Business Profile
   ↓
3. Start New Assessment
   ↓
4. Answer Questions (with adaptive logic)
   ↓
5. Submit Assessment
   ↓
6. Backend Scoring Engine Calculates:
   - Module Scores
   - Digital Readiness Score
   - Legacy Transfer Score
   - Overall Score
   ↓
7. Generate Recommendations & Risk Flags
   ↓
8. Create PDF Report
   ↓
9. Display Dashboard & Download Report
```

## Security Features

1. **Authentication & Authorization**:
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Refresh token rotation

2. **Data Protection**:
   - Password hashing with bcrypt
   - HTTPS enforcement
   - CSRF protection
   - Rate limiting

3. **API Security**:
   - Helmet.js for HTTP headers
   - Input validation (Zod)
   - SQL injection prevention (Prisma)
   - XSS protection

4. **Audit Logging**:
   - All critical actions logged
   - IP tracking
   - User agent tracking

## Scalability Considerations

### Current Architecture (MVP):
- Single server deployment
- PostgreSQL with connection pooling
- Redis for caching

### Future Enhancements:
1. **Horizontal Scaling**:
   - Load balancer (Nginx)
   - Multiple backend instances
   - Session store in Redis

2. **Database Optimization**:
   - Read replicas
   - Database connection pooling
   - Query optimization

3. **Caching Strategy**:
   - Redis caching layer
   - CDN for static assets
   - API response caching

4. **Microservices** (V2):
   - Separate scoring engine
   - Dedicated PDF generation service
   - Background job processing (Bull queue)

## Performance Optimization

1. **Frontend**:
   - Code splitting (Next.js automatic)
   - Image optimization
   - Lazy loading components
   - Bundle size optimization

2. **Backend**:
   - Database query optimization
   - Redis caching
   - Response compression (gzip)
   - Connection pooling

3. **Database**:
   - Proper indexing
   - Query optimization
   - Efficient schema design

## Monitoring & Logging

1. **Application Logs**:
   - Winston logger (backend)
   - Different log levels (error, warn, info, debug)
   - Separate error logs

2. **Audit Logs**:
   - User actions tracked
   - Database changes logged
   - Security events monitored

3. **Future Monitoring** (V2):
   - Application Performance Monitoring (APM)
   - Error tracking (Sentry)
   - Analytics (Mixpanel/Google Analytics)

## Development Workflow

1. **Local Development**:
   ```bash
   # Start infrastructure
   docker-compose up -d

   # Install dependencies
   npm run install:all

   # Run migrations
   npm run db:migrate

   # Seed database
   npm run db:seed

   # Start dev servers
   npm run dev
   ```

2. **Code Quality**:
   - TypeScript for type safety
   - ESLint for linting
   - Prettier for formatting
   - Git hooks (future)

3. **Testing** (Future):
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

## Deployment Architecture (Future)

```
┌──────────────┐
│   CloudFlare │  CDN + DDoS Protection
└──────┬───────┘
       │
┌──────▼───────┐
│     Nginx    │  Reverse Proxy + Load Balancer
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│ App1│ │ App2│  Node.js Instances
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
┌──────▼───────┐
│  PostgreSQL  │  Primary + Replica
└──────────────┘
       │
┌──────▼───────┐
│    Redis     │  Cache + Session Store
└──────────────┘
```

## Conclusion

This architecture provides a solid foundation for the MVP while allowing for future scalability and enhancements. The clear separation of concerns, type safety, and modern technology stack ensure maintainability and developer productivity.
