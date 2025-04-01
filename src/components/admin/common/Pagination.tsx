interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <button
        className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                   hover:bg-gray-50 dark:hover:bg-gray-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          className={`px-3 py-1 text-sm rounded-md border 
                     ${currentPage === page 
                       ? 'bg-blue-600 text-white border-blue-600' 
                       : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                     }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                   hover:bg-gray-50 dark:hover:bg-gray-700 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
