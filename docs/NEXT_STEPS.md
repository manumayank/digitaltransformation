# DRLTAS - Immediate Next Steps

## 🚀 Getting Started

You now have a complete project structure and feature roadmap. Here's what to do next:

---

## Step 1: Set Up Development Environment (30 minutes)

### 1.1 Install Dependencies

```bash
# Install all workspace dependencies
npm run install:all
```

### 1.2 Configure Environment Variables

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://drltas:drltas_dev_password@localhost:5432/drltas_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-this-to-a-secure-random-string-in-production
JWT_REFRESH_SECRET=change-this-to-another-secure-random-string
CORS_ORIGIN=http://localhost:3000
```

### 1.3 Start Infrastructure

```bash
# Start PostgreSQL, Redis, and pgAdmin
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 1.4 Initialize Database

```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with modules and admin user
npx prisma db seed
```

### 1.5 Verify Setup

```bash
# In one terminal - Start backend
cd backend
npm run dev

# In another terminal - Start frontend
cd frontend
npm run dev
```

**Test**:
- Backend: http://localhost:3001/health (should return "ok")
- Frontend: http://localhost:3000 (should show landing page)
- pgAdmin: http://localhost:5050 (admin@drltas.local / admin)

---

## Step 2: Start with P0-001 (User Authentication Backend)

### Priority: CRITICAL
### Estimated Effort: 3-5 days
### Files to Create: 5

This is the foundation for everything else. Here's the implementation order:

### 2.1 Create Validation Schemas (1 hour)

**File**: `backend/src/validators/auth.validator.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
```

### 2.2 Create Auth Service (3-4 hours)

**File**: `backend/src/services/auth.service.ts`

**Key Functions**:
- `register(data)` - Create new user, hash password
- `login(email, password)` - Verify credentials, generate tokens
- `refreshToken(refreshToken)` - Generate new access token
- `logout(userId)` - Invalidate refresh token
- `hashPassword(password)` - Hash with bcrypt
- `verifyPassword(password, hash)` - Compare passwords
- `generateTokens(userId)` - Create JWT access + refresh tokens

### 2.3 Create Auth Controller (2-3 hours)

**File**: `backend/src/controllers/auth.controller.ts`

**Endpoints**:
- `POST /auth/register` - Handle registration
- `POST /auth/login` - Handle login
- `POST /auth/refresh` - Handle token refresh
- `POST /auth/logout` - Handle logout

### 2.4 Wire Up Routes (30 minutes)

**File**: `backend/src/routes/auth.routes.ts` (already exists, update it)

Connect controllers to routes with validation middleware.

### 2.5 Test with Postman/Thunder Client (1-2 hours)

Create test requests:
1. Register new user
2. Login with credentials
3. Access protected endpoint
4. Refresh token
5. Logout

---

## Step 3: Build P0-002 (Frontend Authentication)

### Priority: CRITICAL (Blocked by P0-001)
### Estimated Effort: 1-2 days
### Files to Create: 8

### 3.1 Create Auth Store (1 hour)

**File**: `frontend/lib/stores/auth.store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Implementation
      },
      // ... other methods
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 3.2 Create Auth API Client (1 hour)

**File**: `frontend/lib/api/auth.api.ts`

```typescript
import { apiClient } from '../api-client';

export const authAPI = {
  register: async (data: RegisterRequest) => {
    return apiClient.post('/auth/register', data);
  },
  login: async (data: LoginRequest) => {
    return apiClient.post('/auth/login', data);
  },
  // ... other methods
};
```

### 3.3 Create Form Components (2-3 hours)

**Files**:
- `frontend/components/ui/Input.tsx`
- `frontend/components/ui/Button.tsx`
- `frontend/components/ui/FormField.tsx`

### 3.4 Build Registration Page (2-3 hours)

**File**: `frontend/app/(auth)/register/page.tsx`

Features:
- Email + password fields
- Optional first/last name
- Password strength indicator
- Form validation with Zod
- Error handling
- Success redirect

### 3.5 Build Login Page (1-2 hours)

**File**: `frontend/app/(auth)/login/page.tsx`

Features:
- Email + password fields
- Remember me (optional)
- Error handling
- Success redirect to dashboard

### 3.6 Create Protected Route Middleware (1 hour)

**File**: `frontend/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('drltas_token')?.value;

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}
```

---

## Step 4: Quick Wins for Momentum

After completing auth (P0-001 & P0-002), tackle these smaller tickets:

### P0-005: Module Data Management (0.5 day)
**Why**: Easy backend work, provides data for frontend
**Files**: 2-3 files
**Impact**: Enables module displays

### P1-003: User Profile Management (1-2 days)
**Why**: Simple CRUD operations, good practice
**Files**: 4-5 files
**Impact**: Users can manage their info

---

## Step 5: The Big Ones (Week 2-3)

### P0-006: Question Management System (10 days)
This is the biggest ticket. Break it down:

1. **Day 1-2**: Design question schema and logic
2. **Day 3-4**: Create 20 questions for 2 modules (test)
3. **Day 5-6**: Build question CRUD endpoints
4. **Day 7-8**: Implement conditional logic engine
5. **Day 9**: Create remaining 80+ questions
6. **Day 10**: Testing and refinement

**Pro Tip**: Work with domain experts for question content!

---

## Development Best Practices

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/P0-001-auth-backend

# Make changes and commit frequently
git add .
git commit -m "feat(auth): implement user registration endpoint"

# Push when done
git push -u origin feature/P0-001-auth-backend
```

### Commit Message Format
```
feat(module): description     # New feature
fix(module): description      # Bug fix
docs(module): description     # Documentation
refactor(module): description # Code refactoring
test(module): description     # Tests
chore(module): description    # Build/config changes
```

### Testing Strategy
1. **Manual Testing**: Use Postman/Thunder Client for APIs
2. **Console Testing**: Test frontend flows manually
3. **Unit Tests**: Write tests for critical logic (later)

### Code Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] No console.logs left in code
- [ ] Error handling implemented
- [ ] Input validation present
- [ ] No hardcoded values
- [ ] Comments for complex logic
- [ ] No secrets in code

---

## Common Issues & Solutions

### Issue: Prisma Client Not Generating
**Solution**:
```bash
cd backend
npx prisma generate
```

### Issue: Port Already in Use
**Solution**:
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
PORT=3002
```

### Issue: Database Connection Failed
**Solution**:
```bash
# Check Docker containers
docker-compose ps

# Restart containers
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: CORS Errors
**Solution**: Check `CORS_ORIGIN` in backend `.env` matches frontend URL

### Issue: JWT Token Invalid
**Solution**: Make sure `JWT_SECRET` is set in `.env` and both services restarted

---

## Recommended Development Order (First 2 Weeks)

### Week 1
**Day 1-2**: Environment setup + P0-001 (Auth Backend)
**Day 3-4**: P0-002 (Auth Frontend)
**Day 5**: P1-003 (User Profile) + P0-005 (Modules)

### Week 2
**Day 1-3**: P0-004 (Business Profile)
**Day 4-5**: P0-006 (Questions - Start)

---

## Resources & Documentation

### Backend
- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Frontend
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

### Database
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Commands](https://redis.io/commands/)

---

## Success Criteria for Week 1

By end of Week 1, you should have:
- ✅ Development environment running
- ✅ Database seeded with modules
- ✅ User registration working (backend + frontend)
- ✅ User login working (backend + frontend)
- ✅ Protected routes implemented
- ✅ Basic user profile management
- ✅ Module data API working

**Milestone**: A user can register, login, and see their profile!

---

## Questions or Stuck?

If you get stuck:
1. Check the docs in `/docs` folder
2. Review the PRD for requirements
3. Look at the schema in `backend/prisma/schema.prisma`
4. Check API documentation in `docs/API.md`

---

## Ready to Start?

### Your immediate TODO:
1. ✅ Run `npm run install:all`
2. ✅ Start Docker services
3. ✅ Run migrations and seed
4. ✅ Start dev servers
5. 🎯 Begin P0-001: User Authentication Backend

**Good luck! 🚀**
