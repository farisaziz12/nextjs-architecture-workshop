/**
 * Utility for sending errors to Sentry
 */
import * as Sentry from '@sentry/nextjs';

/**
 * Reports an error to Sentry
 * @param error The error object
 * @param errorTag A PascalCase identifier to categorize the error
 */
// TODO: Update the errorTag parameter to use a template literal type that enforces 'Error' suffix
export const reportError = (error: Error): void => {
  console.group(`🔴 Error reported to Sentry: ${error.name}`);
  console.error(error);
  console.groupEnd();

  Sentry.captureException(error, {
    level: 'error',
  });
  
  // TODO: Create a new error with the error tag as the name and the original error as the cause
  // TODO: Update Sentry implementation to use the new tagged error
};