import React, { ReactNode } from 'react';
import { 
  Shield, 
  BarChart3, 
  Users, 
  Settings, 
  AlertTriangle,
  CreditCard,
  Search,
  Bell,
  User,
  Zap,
  Database
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'fraud-cases', label: 'Fraud Cases', icon: AlertTriangle },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FraudGuard</h1>
              <p className="text-xs text-slate-400">Pro Detection</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 z-10">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions, cases..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = (e.target as HTMLInputElement).value;
                    if (searchTerm) {
                      alert(`Searching for: "${searchTerm}"\n\nThis would search across all transactions and fraud cases.`);
                    }
                  }
                }}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                alert('🔔 Notifications:\n\n• 3 new high-risk transactions detected\n• 2 fraud cases require investigation\n• 1 system alert: API rate limit approaching');
              }}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>
            
            <div 
              onClick={() => {
                alert('👤 User Profile:\n\nAdmin User\nSecurity Analyst\n\nOptions:\n• View Profile\n• Account Settings\n• Logout');
              }}
              className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Security Analyst</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;