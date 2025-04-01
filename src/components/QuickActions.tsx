interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    { id: '1', name: 'Add Product', icon: '📦', href: '/admin/products/new' },
    { id: '2', name: 'New Order', icon: '🛒', href: '/admin/orders?new=true' },
    { id: '3', name: 'Manage Inventory', icon: '📋', href: '/admin/inventory' },
    { id: '4', name: 'View Reports', icon: '📊', href: '/admin/reports' },
  ];

  return (
    <div className={`admin-card ${className || ''}`}>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium">{action.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
