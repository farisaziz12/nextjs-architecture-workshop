/**
 * Utility for sending errors to Sentry.
 */
import * as Sentry from '@sentry/nextjs';

// 🦆 Task 2a: define the tag type — any string ending in 'Error'.
// type ErrorTag = `${string}Error`;
// 🦉 This template literal type is the compile-time contract. The call site has to
// pass something like "ButtonClickError"; "ButtonClick" won't typecheck.

/**
 * Reports an error to Sentry.
 * @param error The error object
 * @param errorTag A PascalCase identifier ending in 'Error' to categorize the error
 */
// 🦆 Task 2b: change the signature to accept an `errorTag: ErrorTag` second parameter.
export const reportError = (error: Error): void => {
  console.group(`🔴 Error reported to Sentry: ${error.name}`);
  console.error(error);
  console.groupEnd();

  // 🦆 Task 2c: create a tagged Error and forward THAT to Sentry instead of the raw one:
  //   const tagged = new Error(errorTag, { cause: error });
  //   tagged.name = errorTag;
  //   Sentry.captureException(tagged, { level: 'error' });
  // 🦉 Sentry groups events by error.name + stack. Renaming via the tag means all
  // ButtonClickErrors group together — even if the underlying error class differs.
  Sentry.captureException(error, {
    level: 'error',
  });
};