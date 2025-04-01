export default function TopProducts() {
  const products = [
    { name: 'Product A', sales: 245, revenue: '$12,450' },
    { name: 'Product B', sales: 190, revenue: '$9,500' },
    { name: 'Product C', sales: 150, revenue: '$7,500' },
    { name: 'Product D', sales: 120, revenue: '$6,000' },
  ];

  return (
    <div className="admin-card">
      <h2 className="text-lg font-semibold mb-4">Top Products</h2>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {index + 1}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.sales} sales</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">{product.revenue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}