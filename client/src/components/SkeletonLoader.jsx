import React from 'react';

// Skeleton component for loading states
export const ListingSkeleton = () => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-64 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Skeleton for listing grid
export const ListingGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ListingSkeleton key={index} />
    ))}
  </div>
);

// Skeleton for detailed listing page
export const ListingDetailSkeleton = () => (
  <div className="max-w-screen-xl mx-auto p-4 animate-pulse">
    <div className="flex flex-col md:flex-row gap-20 mt-16">
      {/* Image skeleton */}
      <div className="w-full md:w-[500px]">
        <div className="h-[500px] bg-gray-300 rounded-md"></div>
      </div>
      
      {/* Details skeleton */}
      <div className="flex-1 md:ml-24 mt-4 md:mt-10">
        <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded mb-6 w-4/6"></div>
        
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        
        <div className="mt-8">
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Loading button component
export const LoadingButton = ({ loading, children, className, ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 ${className}`}
    disabled={loading}
    {...props}
  >
    {loading && (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
    )}
    {children}
  </button>
);

export default {
  ListingSkeleton,
  ListingGridSkeleton,
  ListingDetailSkeleton,
  LoadingButton
};
