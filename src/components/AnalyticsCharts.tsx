import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400, visitors: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398, visitors: 2210 },
  { name: 'Mar', sales: 2000, revenue: 9800, visitors: 2290 },
  { name: 'Apr', sales: 2780, revenue: 3908, visitors: 2000 },
  { name: 'May', sales: 1890, revenue: 4800, visitors: 2181 },
  { name: 'Jun', sales: 2390, revenue: 3800, visitors: 2500 },
];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-4">Sales vs Visitors</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" />
              <Line type="monotone" dataKey="visitors" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}