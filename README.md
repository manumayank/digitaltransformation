# Digital Readiness & Legacy-Transfer Audit System (DRLTAS)

A comprehensive assessment platform for evaluating business digital maturity, operational organization, and succession readiness.

## Overview

DRLTAS is a multi-module assessment platform that generates:
- Digital Readiness Score (0–100)
- Legacy Transfer Readiness Score (0–100)
- Category Scorecards
- Risk Flags & Recommendations
- Professional PDF Reports
- Actionable Roadmaps

## Architecture

### Monorepo Structure

```
digitaltransformation/
├── backend/          # Node.js + Express API
├── frontend/         # Next.js + React application
├── database/         # Database schema, migrations, seeds
├── shared/           # Shared types, constants, utilities
├── docs/             # Architecture and API documentation
└── scripts/          # Build and deployment scripts
```

### Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL (with Prisma ORM)
- Redis (caching)
- JWT Authentication
- PDFKit (report generation)

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- React Hook Form + Zod

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7
- Nginx (reverse proxy)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd digitaltransformation

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start infrastructure
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development servers
npm run dev
```

### Development

```bash
# Start all services
npm run dev

# Backend only (http://localhost:3001)
npm run dev:backend

# Frontend only (http://localhost:3000)
npm run dev:frontend

# Run tests
npm run test

# Run linting
npm run lint
```

## Project Modules

### Assessment Modules (10 Total)

1. **Digital Presence & Visibility** - Website, SEO, reviews
2. **Internal Process Organization** - SOPs, knowledge management
3. **CRM/ERP/Core Systems** - Data quality, automation
4. **Financial Systems & Reporting** - Accounting, MIS, KPIs
5. **Technology Stack & Infrastructure** - Cloud, backups, security
6. **Data Security & Compliance** - Access control, audit logs
7. **People, Roles & Training** - Role definitions, training
8. **Customer Experience Maturity** - Support systems, SLAs
9. **Business Scalability & Repeatability** - Automation potential
10. **Succession & Exit Readiness** - Transfer ease, documentation

## API Documentation

API documentation is available at:
- Development: http://localhost:3001/api-docs
- Production: [TBD]

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For questions and support, contact: [TBD]
