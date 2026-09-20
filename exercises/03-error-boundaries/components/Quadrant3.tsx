import React, { useState, useEffect } from 'react';

const Quadrant3: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    }
    
    // When countdown reaches 0, throw an error
    if (isRunning && countdown === 0) {
      throw new Error('Quadrant 3 error: Timer reached zero');
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCountdown(10);
  };

  // Calculate the percentage for the progress ring
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - countdown / 5);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-purple-800 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 bg-purple-700 text-white rounded-full mr-2 text-sm">3</span>
          Timer Error
        </h3>
        <p className="mt-2 text-purple-700 text-sm">
          Start the countdown timer. When it reaches zero, an error will occur.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#e9d5ff" 
              strokeWidth="8"
            />
            {/* Progress circle */}
            {isRunning && (
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#9333ea" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            )}
          </svg>
          
          {/* Countdown number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${isRunning ? 'text-purple-700' : 'text-purple-500'}`}>
              {countdown}
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          {isRunning ? (
            <p className={`text-sm ${countdown <= 3 ? 'text-red-500 font-bold' : 'text-purple-600'}`}>
              {countdown <= 3 ? 'Warning: Error imminent!' : 'Countdown in progress...'}
            </p>
          ) : (
            <p className="text-sm text-purple-600">
              Press start to begin the countdown
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Countdown
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Timer
          </button>
        )}
      </div>
    </div>
  );
};

export default Quadrant3; 