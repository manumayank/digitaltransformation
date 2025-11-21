import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Application } from 'express';
import { logger } from '../utils/logger';

export function initializeSentry(app: Application): void {
  const isDev = process.env.NODE_ENV === 'development';
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    logger.warn('SENTRY_DSN not configured. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
        new ProfilingIntegration(),
      ],
      tracesSampleRate: isDev ? 1.0 : 0.1,
      profilesSampleRate: isDev ? 1.0 : 0.1,
      beforeSend(event) {
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
          delete event.request.headers['X-CSRF-Token'];
        }
        return event;
      },
      ignoreTransactions: ['/health', '/api-docs'],
    });
    logger.info('Sentry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry:', error);
  }
}

export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler();
}

export function captureException(error: Error, context?: Record<string, any>): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.captureException(error, { contexts: { custom: context } });
}

export function setSentryUser(userId: string, email?: string): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.setUser({ id: userId, email });
}

export function clearSentryUser(): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.setUser(null);
}

export function setSentryTag(key: string, value: string): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.setTag(key, value);
}

export function setSentryContext(key: string, context: Record<string, any>): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.setContext(key, context);
}

export default Sentry;
