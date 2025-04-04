import React from "react";
import { FiFolder, FiFile } from "react-icons/fi";

const FolderViewShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Shimmer */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Shimmer */}
            <div className="lg:col-span-1 space-y-6">
              {/* Storage Stats Shimmer */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access Shimmer */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-full h-10 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Shimmer */}
            <div className="lg:col-span-3">
              {/* Search and View Toggle Shimmer */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="w-full sm:w-96 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Files and Folders Grid Shimmer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="ml-4">
                          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity Shimmer */}
              <div className="mt-8 bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-32 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderViewShimmer;
