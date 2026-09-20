import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '../utils/errorReporting';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary to catch any uncaught errors in the application
 * This should be used in _app.tsx to wrap the entire application
 */
class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report the error
    reportError(error);
    
    console.log('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-red-100">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center">Application Error</h2>
              <div className="mt-2 w-16 h-1 bg-red-500 rounded-full"></div>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              Something went wrong with the application. The error has been reported to our team.
            </p>
            
            {error && (
              <div className="bg-red-50 p-4 rounded-md mb-6 overflow-auto max-h-40 font-mono text-sm text-red-800 border border-red-100">
                <p className="font-medium text-red-700 mb-1">Error Message:</p>
                <p>{error.message}</p>
              </div>
            )}
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default GlobalErrorBoundary; 