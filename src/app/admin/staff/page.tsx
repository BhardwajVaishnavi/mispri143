'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PlusIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import StaffFormModal from '@/components/admin/staff/StaffFormModal';
import RoleAssignmentModal from '@/components/admin/staff/RoleAssignmentModal';
import PermissionsModal from '@/components/admin/staff/PermissionsModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  stores: {
    store: {
      id: string;
      name: string;
    };
    role: string;
  }[];
  permissions: string[];
}

export default function StaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      
      // For demo purposes, set mock data if API fails
      setUsers([
        {
          id: '1',
          name: 'John Admin',
          email: 'admin@example.com',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          createdAt: '2023-01-01T00:00:00Z',
          stores: [],
          permissions: ['ALL']
        },
        {
          id: '2',
          name: 'Jane Manager',
          email: 'manager@example.com',
          role: 'MANAGER',
          status: 'ACTIVE',
          createdAt: '2023-01-02T00:00:00Z',
          stores: [
            { store: { id: '1', name: 'Main Store' }, role: 'MANAGER' }
          ],
          permissions: ['VIEW_ORDERS', 'MANAGE_INVENTORY', 'VIEW_CUSTOMERS']
        },
        {
          id: '3',
          name: 'Bob Staff',
          email: 'staff@example.com',
          role: 'STAFF',
          status: 'ACTIVE',
          createdAt: '2023-01-03T00:00:00Z',
          stores: [
            { store: { id: '2', name: 'Downtown Branch' }, role: 'STAFF' }
          ],
          permissions: ['VIEW_ORDERS', 'VIEW_INVENTORY']
        },
        {
          id: '4',
          name: 'Alice Cashier',
          email: 'cashier@example.com',
          role: 'CASHIER',
          status: 'ACTIVE',
          createdAt: '2023-01-04T00:00:00Z',
          stores: [
            { store: { id: '2', name: 'Downtown Branch' }, role: 'CASHIER' }
          ],
          permissions: ['PROCESS_ORDERS']
        },
        {
          id: '5',
          name: 'Inactive User',
          email: 'inactive@example.com',
          role: 'STAFF',
          status: 'INACTIVE',
          createdAt: '2023-01-05T00:00:00Z',
          stores: [],
          permissions: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateRole = async (data: { role: string }) => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      toast.success('User role updated successfully');
      setIsRoleModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleUpdatePermissions = async (data: { permissions: string[] }) => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user permissions');
      }

      toast.success('User permissions updated successfully');
      setIsPermissionsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user permissions:', error);
      toast.error('Failed to update user permissions');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      toast.success(`User ${newStatus.toLowerCase()}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Filter users based on active tab and search query
  const filteredUsers = users.filter(user => {
    // Filter by tab
    if (activeTab !== 'all' && user.role !== activeTab.toUpperCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'STAFF':
        return 'bg-green-100 text-green-800';
      case 'CASHIER':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <UserIcon className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-semibold">
                {users.filter(user => user.role === 'SUPER_ADMIN' || user.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-4">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Staff</p>
              <p className="text-2xl font-semibold">
                {users.filter(user => user.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 mr-4">
              <UserIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive Staff</p>
              <p className="text-2xl font-semibold">
                {users.filter(user => user.status === 'INACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="super_admin">Super Admins</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="cashier">Cashiers</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={fetchUsers}>
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Stores
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.stores.length > 0 ? (
                          <div className="space-y-1">
                            {user.stores.map((storeAssignment) => (
                              <div key={storeAssignment.store.id}>
                                {storeAssignment.store.name} ({storeAssignment.role})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No stores assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsRoleModalOpen(true);
                          }}
                        >
                          Change Role
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsPermissionsModalOpen(true);
                          }}
                        >
                          Permissions
                        </Button>
                        <Button 
                          size="sm"
                          variant={user.status === 'ACTIVE' ? 'destructive' : 'default'}
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StaffFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {selectedUser && (
        <>
          <RoleAssignmentModal
            isOpen={isRoleModalOpen}
            onClose={() => {
              setIsRoleModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateRole}
            user={selectedUser}
          />
          
          <PermissionsModal
            isOpen={isPermissionsModalOpen}
            onClose={() => {
              setIsPermissionsModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdatePermissions}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
