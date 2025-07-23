import React, { useState } from 'react';
import { 
  Download, 
  Database, 
  FileText, 
  Filter,
  Search,
  RefreshCw,
  Eye,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { mockTransactions, mockFraudCases } from '../data/mockData';
import { Transaction, FraudCase } from '../types';

const DatasetManager: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'transactions' | 'fraudCases'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Generate additional Indian transaction data
  const generateIndianTransactionData = (): Transaction[] => {
    const indianNames = [
      'Aarav Sharma', 'Vivaan Gupta', 'Aditya Kumar', 'Vihaan Singh', 'Arjun Patel',
      'Sai Reddy', 'Reyansh Agarwal', 'Ayaan Khan', 'Krishna Iyer', 'Ishaan Joshi',
      'Ananya Nair', 'Diya Mehta', 'Aadhya Bansal', 'Kavya Malhotra', 'Arya Verma',
      'Myra Chopra', 'Anika Sinha', 'Navya Tiwari', 'Kiara Saxena', 'Saanvi Rao',
      'Ravi Krishnan', 'Suresh Iyer', 'Meera Bansal', 'Karthik Reddy', 'Deepika Nair',
      'Rohit Agarwal', 'Priya Sharma', 'Vikram Gupta', 'Anita Patel', 'Rajesh Kumar'
    ];

    const indianCities = [
      'Mumbai, INDIA', 'Delhi, INDIA', 'Bangalore, INDIA', 'Chennai, INDIA', 
      'Pune, INDIA', 'Hyderabad, INDIA', 'Kolkata, INDIA', 'Kochi, INDIA',
      'Ahmedabad, INDIA', 'Jaipur, INDIA', 'Lucknow, INDIA', 'Surat, INDIA',
      'Kanpur, INDIA', 'Nagpur, INDIA', 'Indore, INDIA', 'Bhopal, INDIA',
      'Coimbatore, INDIA', 'Visakhapatnam, INDIA', 'Vadodara, INDIA', 'Nashik, INDIA'
    ];

    const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'PayPal', 'Google Pay', 'PhonePe', 'Paytm'];
    const statuses: ('approved' | 'flagged' | 'rejected' | 'pending')[] = ['approved', 'flagged', 'rejected', 'pending'];

    const additionalTransactions: Transaction[] = [];

    for (let i = 11; i <= 100; i++) {
      const name = indianNames[Math.floor(Math.random() * indianNames.length)];
      const email = `${name.toLowerCase().replace(' ', '.')}@${Math.random() > 0.9 ? 'temp-mail.org' : 'gmail.com'}`;
      const amount = Math.random() * 5000 + 50;
      const riskScore = Math.floor(Math.random() * 100);
      const status = riskScore > 80 ? 'rejected' : riskScore > 60 ? 'flagged' : riskScore > 30 ? 'pending' : 'approved';

      additionalTransactions.push({
        id: `txn_${String(i).padStart(3, '0')}`,
        orderId: `ORD-2024-${String(i).padStart(3, '0')}`,
        customerEmail: email,
        customerName: name,
        amount: Math.round(amount * 100) / 100,
        currency: 'USD',
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        deviceFingerprint: `fp_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
        riskScore: riskScore,
        location: indianCities[Math.floor(Math.random() * indianCities.length)],
        merchantId: `merchant_${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`
      });
    }

    return [...mockTransactions, ...additionalTransactions];
  };

  const allTransactions = generateIndianTransactionData();
  const allFraudCases = mockFraudCases;

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredFraudCases = allFraudCases.filter(fraudCase => {
    const matchesSearch = 
      fraudCase.fraudType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.investigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || fraudCase.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (activeDataset === 'transactions') {
      exportToCSV(filteredTransactions, 'fraud_detection_transactions');
    } else {
      exportToCSV(filteredFraudCases, 'fraud_detection_cases');
    }
  };

  const getDatasetStats = () => {
    if (activeDataset === 'transactions') {
      const total = allTransactions.length;
      const approved = allTransactions.filter(t => t.status === 'approved').length;
      const flagged = allTransactions.filter(t => t.status === 'flagged').length;
      const rejected = allTransactions.filter(t => t.status === 'rejected').length;
      const totalAmount = allTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        total,
        approved,
        flagged,
        rejected,
        totalAmount: totalAmount.toFixed(2)
      };
    } else {
      const total = allFraudCases.length;
      const open = allFraudCases.filter(c => c.status === 'open').length;
      const investigating = allFraudCases.filter(c => c.status === 'investigating').length;
      const resolved = allFraudCases.filter(c => c.status === 'resolved').length;
      
      return {
        total,
        open,
        investigating,
        resolved
      };
    }
  };

  const stats = getDatasetStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dataset Management</h1>
          <p className="text-slate-400">View, analyze, and export fraud detection datasets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Selector */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Database className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Select Dataset</h2>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveDataset('transactions')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeDataset === 'transactions'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Transactions Dataset</span>
          </button>
          <button
            onClick={() => setActiveDataset('fraudCases')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeDataset === 'fraudCases'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Fraud Cases Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeDataset === 'transactions' ? (
          <>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-slate-400 text-sm">Total Transactions</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                  <p className="text-slate-400 text-sm">Approved</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-400">{stats.flagged}</p>
                  <p className="text-slate-400 text-sm">Flagged</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/20">
                  <Eye className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">${stats.totalAmount}</p>
                  <p className="text-slate-400 text-sm">Total Amount</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-slate-400 text-sm">Total Cases</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-400">{stats.open}</p>
                  <p className="text-slate-400 text-sm">Open Cases</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/20">
                  <Eye className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{stats.investigating}</p>
                  <p className="text-slate-400 text-sm">Investigating</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Search className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                  <p className="text-slate-400 text-sm">Resolved</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeDataset}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {activeDataset === 'transactions' ? (
              <>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </>
            ) : (
              <>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </>
            )}
          </select>

          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Advanced Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white">
            {activeDataset === 'transactions' ? 'Transactions Data' : 'Fraud Cases Data'}
          </h3>
          <p className="text-slate-400 text-sm">
            Showing {activeDataset === 'transactions' ? filteredTransactions.length : filteredFraudCases.length} records
          </p>
        </div>
        
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="bg-slate-700/50 sticky top-0">
              <tr>
                {activeDataset === 'transactions' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Risk Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Case ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Fraud Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Risk Level</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Investigator</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Created</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {activeDataset === 'transactions' ? (
                filteredTransactions.slice(0, 50).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{transaction.customerName}</div>
                        <div className="text-sm text-slate-400">{transaction.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${transaction.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{transaction.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        transaction.riskScore >= 70 ? 'text-red-400' :
                        transaction.riskScore >= 30 ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {transaction.riskScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        transaction.status === 'flagged' ? 'bg-orange-500/20 text-orange-400' :
                        transaction.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                filteredFraudCases.map((fraudCase) => (
                  <tr key={fraudCase.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">{fraudCase.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{fraudCase.fraudType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fraudCase.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                        fraudCase.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        fraudCase.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {fraudCase.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{fraudCase.investigator}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fraudCase.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                        fraudCase.status === 'investigating' ? 'bg-blue-500/20 text-blue-400' :
                        fraudCase.status === 'open' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {fraudCase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(fraudCase.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Information */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Download className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Export Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Available Formats</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• CSV (Comma Separated Values)</li>
              <li>• Excel compatible format</li>
              <li>• UTF-8 encoded for Indian names</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Dataset Features</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• 100+ Indian customer records</li>
              <li>• Real fraud detection patterns</li>
              <li>• Multiple Indian cities and locations</li>
              <li>• Comprehensive risk scoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetManager;