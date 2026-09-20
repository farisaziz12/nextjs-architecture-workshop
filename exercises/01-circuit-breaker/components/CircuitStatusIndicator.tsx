import { CircuitStatus } from '../types';

interface CircuitStatusIndicatorProps {
  status: CircuitStatus;
}

export default function CircuitStatusIndicator({ status }: CircuitStatusIndicatorProps) {
  // 🦉 This component is already implemented for the three known states.
  // You don't need to edit it to finish the exercise — just mount it from `ProductList.tsx` (Task 5).

  if (status === 'closed') {
    return (
      <div className="bg-green-50 text-green-800 flex items-center px-4 py-2 rounded-md mb-6">
        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
        <span>System healthy</span>
      </div>
    );
  }
  
  if (status === 'open') {
    return (
      <div className="bg-red-50 text-red-800 flex items-center px-4 py-2 rounded-md mb-6">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
        <span>System protecting against failures</span>
      </div>
    );
  }
  
  if (status === 'half-open') {
    return (
      <div className="bg-yellow-50 text-yellow-800 flex items-center px-4 py-2 rounded-md mb-6">
        <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
        <span>System recovering</span>
      </div>
    );
  }
  
  return null;
}