import React from 'react';
import { FiSearch, FiBell, FiMoon, FiSun } from 'react-icons/fi';

const AdminHeader = () => {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md 
                           leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <FiSun className="h-6 w-6 text-gray-400" />
              ) : (
                <FiMoon className="h-6 w-6 text-gray-400" />
              )}
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
              <FiBell className="h-6 w-6 text-gray-400" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;



