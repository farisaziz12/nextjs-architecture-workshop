import React, { useState } from 'react';

const Quadrant2: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  // This will trigger a rendering error when the input value is 'crash'
  const renderContent = () => {
    if (inputValue.toLowerCase() === 'crash') {
      // This is an invalid operation that will cause a rendering error
      return <div>{Object.create(null).nonExistentProperty.access}</div>;
    }
    
    return (
      <div className="text-green-700 text-center">
        <p className="font-medium mb-1">Current input:</p>
        <div className="bg-green-100 py-2 px-3 rounded-md inline-block min-w-[100px]">
          {inputValue ? (
            <span className="font-mono">{inputValue}</span>
          ) : (
            <span className="text-green-400 italic">(empty)</span>
          )}
        </div>
        
        {inputValue.toLowerCase() === 'cras' && (
          <div className="mt-3 text-orange-500 text-sm bg-orange-50 p-2 rounded-md border border-orange-100">
            <span className="font-bold">Hint:</span> One more letter and something interesting might happen...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-800 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 bg-green-700 text-white rounded-full mr-2 text-sm">2</span>
          Input Error
        </h3>
        <p className="mt-2 text-green-700 text-sm">
          Type &quot;crash&quot; in the input below to trigger a rendering error.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-2 w-full">
          <div className="relative max-w-sm mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
              className="bg-white text-black w-full p-2 pl-10 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
          </div>
        </div>
        
        <div className="mt-6 w-full">
          {renderContent()}
        </div>
      </div>
      
      <div className="mt-auto pt-4 text-xs text-center text-green-600">
        Try typing different words and see what happens!
      </div>
    </div>
  );
};

export default Quadrant2; 