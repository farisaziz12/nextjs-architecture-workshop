interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-md mb-4 aspect-square"></div>
              
              <div className="h-5 bg-gray-200 rounded w-4/5 mb-4"></div>
              <div className="h-7 bg-gray-200 rounded w-2/5 mb-4"></div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="h-4 bg-gray-200 rounded w-10 mr-2"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                  ))}
                </div>
              </div>
              
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}