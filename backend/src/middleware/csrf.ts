import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000,
  },
});

export function attachCsrfToken(req: Request, res: Response, next: NextFunction): void {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (res.locals.csrfToken) {
      res.setHeader('X-CSRF-Token', res.locals.csrfToken);
    }
    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      return originalJson({ ...body, csrfToken: res.locals.csrfToken });
    }
    return originalJson(body);
  };
  next();
}

export function validateCsrfToken(req: Request, res: Response, next: NextFunction): void {
  csrfProtection(req, res, (err: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        code: 'CSRF_TOKEN_INVALID',
        message: 'Invalid or missing CSRF token',
      });
    }
    next();
  });
}

export function extractCsrfToken(req: Request): string | null {
  const headerToken = req.headers['x-csrf-token'] as string;
  if (headerToken) return headerToken;
  if (req.body && req.body.csrfToken) return req.body.csrfToken;
  if (req.query && req.query.csrfToken) return req.query.csrfToken as string;
  return null;
}
