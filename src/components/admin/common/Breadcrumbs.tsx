import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbsProps {
  pathname: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathname }) => {
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <Link 
            href="/admin"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <HomeIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </li>
        
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          return (
            <li key={path} className="flex items-center">
              <ChevronRightIcon 
                className="h-5 w-5 text-gray-400" 
                aria-hidden="true" 
              />
              <Link
                href={href}
                className={`ml-4 text-sm font-medium ${
                  isLast 
                    ? 'text-gray-700 dark:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};