interface SalesTrendsProps {
  className?: string;
}

export default function SalesTrends({ className }: SalesTrendsProps) {
  return (
    <div className={`admin-card ${className || ''}`}>
      <h2 className="text-lg font-semibold mb-4">Sales Trends</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-2xl font-bold">₹12,500</p>
          <p className="text-xs text-green-500">+12% from yesterday</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold">₹78,350</p>
          <p className="text-xs text-green-500">+8% from last week</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold">₹254,890</p>
          <p className="text-xs text-green-500">+15% from last month</p>
        </div>
      </div>
      
      <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Sales chart would be displayed here</p>
      </div>
    </div>
  );
}
