/**
 * Utility for sending errors to Sentry
 */
import * as Sentry from '@sentry/nextjs';
/**
 * Reports an error to Sentry
 * @param error The error object
 * @param errorTag A PascalCase identifier to categorize the error
 */
export const reportError = (error: Error, errorTag: `${string}Error`): void => {
  console.group(`🔴 Error reported to Sentry: ${errorTag}`);
  console.error(error);
  console.groupEnd();
  
  // Create a new error with the error tag as the name and the original error as the cause
  const taggedError = new Error(error.message, { cause: error });
  taggedError.name = errorTag;
  
  // Use real Sentry implementation
  Sentry.captureException(taggedError, {
    level: 'error',
  });
};