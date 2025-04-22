import { useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

const FatalErrorPage: NextPage = () => {
  useEffect(() => {
    // This will throw an error when the component mounts
    // We'll add a small delay so users can see the page first
    const timer = setTimeout(() => {
      throw new Error('This is a fatal application error to test the global error boundary');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50"></div>
          <div className="relative z-10 w-full h-full rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-red-700 mb-2">Global Error Test</h1>
        
        <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-100 mt-4">
          <p className="text-red-800 mb-2">This page will automatically generate a global error in:</p>
          <div className="text-2xl font-mono font-bold text-red-600 animate-pulse">
            Loading error...
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          This demonstrates how the application&apos;s global error boundary catches and handles fatal errors.
        </p>
        
        <Link href="/" className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm">
          Return to Safety
        </Link>
      </div>
    </div>
  );
};

export default FatalErrorPage; 