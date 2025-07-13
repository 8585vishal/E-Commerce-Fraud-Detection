import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Shield,
  User,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'investigator' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

const UserManager: React.FC = () => {
  const [users] = useState<SystemUser[]>([
    {
      id: 'user_001',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'admin',
      department: 'Security',
      status: 'active',
      lastLogin: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['manage_users', 'view_all_cases', 'approve_transactions', 'system_settings']
    },
    {
      id: 'user_002',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@company.com',
      role: 'investigator',
      department: 'Fraud Detection',
      status: 'active',
      lastLogin: '2024-01-15T13:45:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      permissions: ['investigate_cases', 'view_transactions', 'create_cases']
    },
    {
      id: 'user_003',
      name: 'Emily Watson',
      email: 'emily.watson@company.com',
      role: 'analyst',
      department: 'Risk Management',
      status: 'active',
      lastLogin: '2024-01-15T12:20:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      permissions: ['view_analytics', 'view_transactions', 'generate_reports']
    },
    {
      id: 'user_004',
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'viewer',
      department: 'Compliance',
      status: 'inactive',
      lastLogin: '2024-01-10T09:15:00Z',
      createdAt: '2024-01-04T00:00:00Z',
      permissions: ['view_dashboard', 'view_reports']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'investigator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'analyst': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    investigators: users.filter(u => u.role === 'investigator').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage system users and their permissions</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: userStats.total, color: 'blue', icon: User },
          { label: 'Active Users', value: userStats.active, color: 'green', icon: Shield },
          { label: 'Administrators', value: userStats.admins, color: 'red', icon: Lock },
          { label: 'Investigators', value: userStats.investigators, color: 'purple', icon: Eye }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="investigator">Investigator</option>
            <option value="analyst">Analyst</option>
            <option value="viewer">Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <button className="bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            Export Users
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-slate-400 text-sm">{user.department}</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button className="text-blue-400 hover:text-blue-300 transition-colors p-1">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-green-400 hover:text-green-300 transition-colors p-1">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-400 hover:text-red-300 transition-colors p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(user.status)}`}>
                  {user.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <p className="text-slate-400 text-xs mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 3).map((permission, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                  {user.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                      +{user.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManager;