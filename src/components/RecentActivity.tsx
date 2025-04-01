interface RecentActivityProps {
  className?: string;
}

export default function RecentActivity({ className }: RecentActivityProps) {
  const activities = [
    { id: '1', user: 'John Doe', action: 'Created a new order', time: '2 hours ago' },
    { id: '2', user: 'Jane Smith', action: 'Updated product inventory', time: '3 hours ago' },
    { id: '3', user: 'Admin User', action: 'Added a new product', time: '5 hours ago' },
    { id: '4', user: 'Support Team', action: 'Resolved customer issue', time: '1 day ago' },
  ];

  return (
    <div className={`admin-card ${className || ''}`}>
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {activity.user.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{activity.user}</p>
              <p className="text-sm text-gray-500">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
