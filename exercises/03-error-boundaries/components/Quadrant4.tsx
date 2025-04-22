import React, { useState } from 'react';

const Quadrant4: React.FC = () => {
  const [counter, setCounter] = useState(0);

  const handleIncrement = () => {
    setCounter(prevCount => prevCount + 1);
  };

  const handleDecrement = () => {
    setCounter(prevCount => prevCount - 1);
  };

  const triggerError = () => {
    // This will throw an error when the button is clicked
    throw new Error('Quadrant 4 error: Test error button clicked');
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-amber-800 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 bg-amber-700 text-white rounded-full mr-2 text-sm">4</span>
          Control Panel
        </h3>
        <p className="mt-2 text-amber-700 text-sm">
          This quadrant demonstrates manual error triggering.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Decorative rings */}
          <div className="absolute -inset-4 rounded-full bg-amber-200 opacity-20 animate-pulse"></div>
          <div className="absolute -inset-2 rounded-full bg-amber-300 opacity-20"></div>
          
          {/* Counter value */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md">
            <span className="text-4xl font-bold text-white">{counter}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDecrement}
            className="py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-sm flex items-center justify-center"
            aria-label="Decrement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleIncrement}
            className="py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-sm flex items-center justify-center"
            aria-label="Increment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={triggerError}
          className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
        >
          Test Error
        </button>
      </div>
    </div>
  );
};

export default Quadrant4; 