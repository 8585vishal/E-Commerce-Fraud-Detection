import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Shield,
  Eye,
  ChevronRight,
  Zap
} from 'lucide-react';
import { mockDashboardStats, mockTransactions, mockFraudCases } from '../data/mockData';
import { analyzeFraudTrends } from '../utils/fraudDetection';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const recentTransactions = mockTransactions.slice(0, 5);
  const recentCases = mockFraudCases;
  const fraudTrends = analyzeFraudTrends(mockTransactions);

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Flagged Transactions',
      value: stats.flaggedTransactions.toString(),
      change: '-2.1%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Fraud Rate',
      value: `${stats.fraudRate.toFixed(2)}%`,
      change: '-0.3%',
      trend: 'down',
      icon: Shield,
      color: 'red'
    },
    {
      title: 'Active Investigations',
      value: stats.activeInvestigations.toString(),
      change: '+5.2%',
      trend: 'up',
      icon: Eye,
      color: 'purple'
    }
  ];

  // Add fraud trends to stats
  const enhancedStatCards = [
    ...statCards,
    {
      title: 'Fraud Detection Rate',
      value: `${fraudTrends.fraudRate.toFixed(1)}%`,
      change: '-1.2%',
      trend: 'down',
      icon: Zap,
      color: 'indigo'
    }
  ];
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'flagged': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
          <p className="text-slate-400">Monitor fraud detection and transaction security in real-time</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Last updated</p>
          <p className="text-white font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {enhancedStatCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fraud Trends Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Fraud Detection Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">
              ${fraudTrends.totalFraudAmount.toLocaleString()}
            </div>
            <p className="text-slate-400">Total Fraud Amount</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-2">
              {fraudTrends.commonIndicators[0]?.count || 0}
            </div>
            <p className="text-slate-400">Most Common Indicator</p>
            <p className="text-xs text-slate-500 mt-1">
              {fraudTrends.commonIndicators[0]?.type || 'None'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {fraudTrends.riskDistribution.find(r => r.level === 'high')?.count || 0}
            </div>
            <p className="text-slate-400">High Risk Transactions</p>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
            <button className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-sm">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-white">{transaction.customerName}</p>
                      <p className="text-sm text-slate-400">{transaction.orderId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right mr-4">
                  <p className="font-medium text-white">${transaction.amount}</p>
                  <p className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                    Risk: {transaction.riskScore}%
                  </p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fraud Cases */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Active Fraud Cases</h2>
            <button className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-sm">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentCases.map((fraudCase) => (
              <div
                key={fraudCase.id}
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      fraudCase.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                      fraudCase.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      fraudCase.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {fraudCase.riskLevel.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">{fraudCase.fraudType}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    fraudCase.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                    fraudCase.status === 'investigating' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {fraudCase.status}
                  </span>
                </div>
                
                <p className="text-white text-sm mb-2">{fraudCase.description}</p>
                <p className="text-slate-400 text-xs">
                  Investigator: {fraudCase.investigator} • {new Date(fraudCase.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Score Distribution */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Risk Score Distribution</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Low Risk (0-25)', count: 892, color: 'green', percentage: 71.5 },
            { label: 'Medium Risk (26-50)', count: 234, color: 'yellow', percentage: 18.8 },
            { label: 'High Risk (51-75)', count: 89, color: 'orange', percentage: 7.1 },
            { label: 'Critical Risk (76-100)', count: 32, color: 'red', percentage: 2.6 }
          ].map((risk, index) => (
            <div key={index} className="text-center">
              <div className={`h-24 bg-${risk.color}-500/20 rounded-lg flex items-end justify-center mb-3`}>
                <div 
                  className={`w-8 bg-${risk.color}-500 rounded-t`}
                  style={{ height: `${risk.percentage}%` }}
                ></div>
              </div>
              <p className="text-white font-medium">{risk.count}</p>
              <p className="text-slate-400 text-sm">{risk.label}</p>
              <p className={`text-${risk.color}-400 text-sm font-medium`}>{risk.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;