import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '../utils/errorReporting';

// TODO: Add an errorTag prop to the ErrorBoundaryProps interface and use template literal type to ensure 'Error' suffix
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to contain errors within a specific part of the UI
 * Use this to wrap individual quadrants to prevent the entire app from crashing
 */
class QuadrantErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: Report the error to Sentry with the errorTag
    reportError(error);

    console.log('Component stack:', errorInfo.componentStack);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error);
        }
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50 bg-opacity-90 text-red-800">
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 border border-red-100">
            <div className="mb-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold mt-2">Component Error</h3>
              <p className="text-sm text-red-600 mt-1">{error.name}</p>
            </div>
            
            <div className="bg-red-50 p-3 rounded-md mb-4 font-mono text-sm overflow-hidden">
              {error.message}
            </div>
            
            <button
              onClick={this.resetError}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default QuadrantErrorBoundary; 