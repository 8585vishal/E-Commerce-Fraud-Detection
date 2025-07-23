import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  Search,
  RefreshCw,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TransactionModal from './TransactionModal';
import { detectFraud } from '../utils/fraudDetection';

const TransactionManager: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage('transactions', mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showFraudAnalysis, setShowFraudAnalysis] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    const matchesRisk = 
      riskFilter === 'all' ||
      (riskFilter === 'low' && transaction.riskScore < 30) ||
      (riskFilter === 'medium' && transaction.riskScore >= 30 && transaction.riskScore < 70) ||
      (riskFilter === 'high' && transaction.riskScore >= 70);

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleCreate = () => {
    setSelectedTransaction(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSave = (transaction: Transaction) => {
    if (modalMode === 'create') {
      const newTransaction = {
        ...transaction,
        id: `txn_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      setTransactions([...transactions, newTransaction]);
    } else if (modalMode === 'edit') {
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? transaction : t
      ));
    }
    setIsModalOpen(false);
  };

  const handleFraudCheck = (transaction: Transaction) => {
    const analysis = detectFraud(transaction);
    
    // Update transaction with new risk score and status
    const updatedTransaction = {
      ...transaction,
      riskScore: analysis.riskScore,
      status: analysis.isFraud ? 'flagged' as const : 
              analysis.riskLevel === 'high' ? 'pending' as const : 'approved' as const
    };
    
    setTransactions(transactions.map(t => 
      t.id === transaction.id ? updatedTransaction : t
    ));
    
    setShowFraudAnalysis(transaction.id);
    
    // Show analysis results
    alert(`Fraud Analysis Complete!\n\nRisk Score: ${analysis.riskScore}%\nRisk Level: ${analysis.riskLevel.toUpperCase()}\nFraud Detected: ${analysis.isFraud ? 'YES' : 'NO'}\n\nRecommendation: ${analysis.recommendation}`);
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

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Management</h1>
          <p className="text-slate-400">Monitor and manage all e-commerce transactions</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk (0-29)</option>
            <option value="medium">Medium Risk (30-69)</option>
            <option value="high">High Risk (70+)</option>
          </select>

          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{transaction.orderId}</div>
                      <div className="text-sm text-slate-400">{transaction.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{transaction.customerName}</div>
                      <div className="text-sm text-slate-400">{transaction.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      ${transaction.amount.toFixed(2)} {transaction.currency}
                    </div>
                    <div className="text-sm text-slate-400">{transaction.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                      {transaction.riskScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(transaction)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFraudCheck(transaction)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="Run Fraud Detection"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Fraud Analysis Results */}
      {showFraudAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFraudAnalysis(null)}></div>
          
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Fraud Analysis Results</h2>
              <button
                onClick={() => setShowFraudAnalysis(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const transaction = transactions.find(t => t.id === showFraudAnalysis);
              if (!transaction) return null;
              
              const analysis = detectFraud(transaction);
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{analysis.riskScore}%</div>
                      <div className="text-slate-400">Risk Score</div>
                    </div>
                    <div>
                      <div className={`px-3 py-1 rounded text-sm font-medium ${
                        analysis.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                        analysis.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        analysis.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {analysis.riskLevel.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{analysis.confidence}%</div>
                      <div className="text-slate-400">Confidence</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    analysis.isFraud ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'
                  }`}>
                    <div className={`font-medium mb-2 ${analysis.isFraud ? 'text-red-400' : 'text-green-400'}`}>
                      {analysis.isFraud ? '⚠️ FRAUD DETECTED' : '✅ TRANSACTION APPROVED'}
                    </div>
                    <p className={analysis.isFraud ? 'text-red-300' : 'text-green-300'}>
                      {analysis.recommendation}
                    </p>
                  </div>
                  
                  {analysis.indicators.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Risk Indicators</h3>
                      <div className="space-y-3">
                        {analysis.indicators.map((indicator, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                            <AlertTriangle className={`h-4 w-4 mt-1 ${
                              indicator.severity === 'critical' ? 'text-red-400' :
                              indicator.severity === 'high' ? 'text-orange-400' :
                              indicator.severity === 'medium' ? 'text-yellow-400' :
                              'text-green-400'
                            }`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-white text-sm">{indicator.type}</h4>
                                <span className="text-xs text-slate-400">+{indicator.score}</span>
                              </div>
                              <p className="text-slate-400 text-xs mt-1">{indicator.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        transaction={selectedTransaction}
        mode={modalMode}
      />
    </div>
  );
};

export default TransactionManager;