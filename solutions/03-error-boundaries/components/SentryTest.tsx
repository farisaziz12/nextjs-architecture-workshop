import React, { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

interface SentryTestProps {
  triggerError?: boolean;
}

const SentryTest: React.FC<SentryTestProps> = ({ triggerError = false }) => {
  const [errorTriggered, setErrorTriggered] = useState(false);

  const throwError = () => {
    try {
      // Simulate an error
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      // Capture the error with Sentry
      Sentry.captureException(error);
      setErrorTriggered(true);
      
      // If triggerError is true, throw the error to be caught by error boundary
      if (triggerError) {
        throw error;
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sentry Integration Test</h2>
      <p className="mb-4">
        This component demonstrates integration with Sentry for error tracking.
      </p>
      
      <button
        onClick={throwError}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {triggerError ? "Trigger Error (Error Boundary)" : "Log Error to Sentry"}
      </button>
      
      {errorTriggered && !triggerError && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Error has been captured and sent to Sentry. Check your Sentry dashboard.
        </div>
      )}
    </div>
  );
};

export default SentryTest; 