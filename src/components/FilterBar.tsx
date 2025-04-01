import { useState } from 'react';
import { 
  FunnelIcon, 
  CalendarIcon, 
  ArrowsUpDownIcon 
} from '@heroicons/react/24/outline';

export default function FilterBar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <option>Sort by: Latest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Amount</option>
          </select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <option>Status: All</option>
              <option>Completed</option>
              <option>Processing</option>
              <option>Pending</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <option>Category: All</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <option>Price Range: All</option>
              <option>$0 - $50</option>
              <option>$51 - $100</option>
              <option>$101+</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}