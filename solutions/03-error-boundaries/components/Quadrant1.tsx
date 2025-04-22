import React, { useState } from 'react';

const Quadrant1: React.FC = () => {
  const [count, setCount] = useState(0);

  // Throw error directly in the render cycle when count reaches 3
  if (count === 3) {
    throw new Error('Quadrant 1 error: Button clicked 3 times');
  }

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-800 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-700 text-white rounded-full mr-2 text-sm">1</span>
          Button Error
        </h3>
        <p className="mt-2 text-blue-700 text-sm">
          Click the button 3 times to trigger an error in this quadrant.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-6 relative">
          <span className="text-4xl font-bold text-blue-700">{count}</span>
          <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Count
          </div>
        </div>
        
        <div className="text-sm text-blue-600 mb-4 text-center">
          {count === 0 ? (
            <p>Click the button to increase the counter</p>
          ) : count === 1 ? (
            <p>Keep going! Two more clicks to trigger the error</p>
          ) : count === 2 ? (
            <p>One more click will cause an error!</p>
          ) : null}
        </div>
      </div>
      
      <button
        onClick={handleClick}
        className="mt-auto w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center font-medium"
      >
        {count === 0 ? (
          "Start Clicking"
        ) : (
          <>Click me {3 - count} more time{count === 2 ? '' : 's'}</>
        )}
      </button>
    </div>
  );
};

export default Quadrant1; 