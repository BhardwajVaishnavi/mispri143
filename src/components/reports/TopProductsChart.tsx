'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TopProductsChartProps {
  dateRange: { from: Date | null; to: Date | null };
  storeId: string;
  isLoading: boolean;
}

interface ProductData {
  name: string;
  value: number;
  category: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function TopProductsChart({ dateRange, storeId, isLoading }: TopProductsChartProps) {
  const [data, setData] = useState<ProductData[]>([]);

  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For this example, we'll use mock data
    const mockData: ProductData[] = [
      { name: 'Red Roses', value: 12500, category: 'Flowers' },
      { name: 'Chocolate Cake', value: 8700, category: 'Cakes' },
      { name: 'Gift Basket', value: 6800, category: 'Gifts' },
      { name: 'Birthday Card', value: 4500, category: 'Cards' },
      { name: 'White Lilies', value: 3800, category: 'Flowers' },
      { name: 'Other Products', value: 9200, category: 'Other' },
    ];
    
    setData(mockData);
  }, [dateRange, storeId]);

  const formatTooltip = (value: number, name: string, props: any) => {
    return [`₹${value.toLocaleString()}`, name];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Top Products by Sales</h4>
        <div className="grid grid-cols-2 gap-4">
          {data.slice(0, 4).map((product, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">₹{product.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
