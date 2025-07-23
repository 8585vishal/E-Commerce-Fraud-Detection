import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Zap,
  TrendingUp,
  Eye
} from 'lucide-react';
import { detectFraud, FraudAnalysis } from '../utils/fraudDetection';
import { Transaction } from '../types';

interface FraudDetectionPanelProps {
  onTransactionAnalyzed?: (analysis: FraudAnalysis) => void;
}

const FraudDetectionPanel: React.FC<FraudDetectionPanelProps> = ({ onTransactionAnalyzed }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mockTransaction, setMockTransaction] = useState<Partial<Transaction>>({
    customerEmail: '',
    customerName: '',
    amount: 0,
    location: '',
    ipAddress: '',
    deviceFingerprint: '',
    paymentMethod: 'Credit Card'
  });

  const handleQuickAnalysis = async () => {
    if (!transactionId && !paymentId) {
      alert('Please enter either Transaction ID or Payment ID');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock transaction for analysis
    const transactionToAnalyze = {
      id: transactionId || paymentId,
      orderId: `ORD-${Date.now()}`,
      ...mockTransaction,
      timestamp: new Date().toISOString()
    };

    const fraudAnalysis = detectFraud(transactionToAnalyze);
    setAnalysis(fraudAnalysis);
    setIsAnalyzing(false);

    if (onTransactionAnalyzed) {
      onTransactionAnalyzed(fraudAnalysis);
    }
  };

  const handleDetailedAnalysis = () => {
    if (!mockTransaction.customerEmail || !mockTransaction.amount) {
      alert('Please fill in customer email and amount for detailed analysis');
      return;
    }

    const transactionToAnalyze = {
      id: transactionId || `txn_${Date.now()}`,
      orderId: `ORD-${Date.now()}`,
      ...mockTransaction,
      timestamp: new Date().toISOString()
    };

    const fraudAnalysis = detectFraud(transactionToAnalyze);
    setAnalysis(fraudAnalysis);

    if (onTransactionAnalyzed) {
      onTransactionAnalyzed(fraudAnalysis);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getIndicatorColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Analysis Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Quick Fraud Detection</h2>
            <p className="text-slate-400 text-sm">Analyze existing transactions by ID</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="txn_001"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && (transactionId || paymentId)) {
                  handleQuickAnalysis();
                }
              }}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Payment ID
            </label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="pay_123456"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && (transactionId || paymentId)) {
                  handleQuickAnalysis();
                }
              }}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleQuickAnalysis}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Detailed Fraud Analysis</h2>
            <p className="text-slate-400 text-sm">Analyze custom transaction data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Customer Email
            </label>
            <input
              type="email"
              value={mockTransaction.customerEmail}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, customerEmail: e.target.value }))}
              placeholder="customer@example.com"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={mockTransaction.customerName}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Rajesh Kumar"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              value={mockTransaction.amount}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="299.99"
              step="0.01"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={mockTransaction.location}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Mumbai, INDIA"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={mockTransaction.ipAddress}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, ipAddress: e.target.value }))}
              placeholder="192.168.1.100"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Payment Method
            </label>
            <select
              value={mockTransaction.paymentMethod}
              onChange={(e) => setMockTransaction(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Google Pay">Google Pay</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleDetailedAnalysis}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200"
        >
          <Shield className="h-5 w-5" />
          <span>Run Detailed Analysis</span>
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${analysis.isFraud ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              {analysis.isFraud ? (
                <XCircle className="h-6 w-6 text-red-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Fraud Analysis Results</h2>
              <p className="text-slate-400 text-sm">Comprehensive risk assessment completed</p>
            </div>
          </div>

          {/* Risk Score and Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{analysis.riskScore}%</div>
              <p className="text-slate-400">Risk Score</p>
            </div>
            <div className="text-center">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getRiskColor(analysis.riskLevel)}`}>
                {analysis.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">{analysis.confidence}%</div>
              <p className="text-slate-400">Confidence</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-4 rounded-lg border mb-6 ${
            analysis.isFraud 
              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
              : 'bg-green-500/10 border-green-500/30 text-green-300'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Recommendation</span>
            </div>
            <p>{analysis.recommendation}</p>
          </div>

          {/* Fraud Indicators */}
          {analysis.indicators.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Detected Risk Indicators</h3>
              <div className="space-y-3">
                {analysis.indicators.map((indicator, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-slate-700/30 rounded-lg"
                  >
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${getIndicatorColor(indicator.severity)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white">{indicator.type}</h4>
                        <span className={`text-sm font-medium ${getIndicatorColor(indicator.severity)}`}>
                          +{indicator.score} points
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{indicator.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.indicators.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-green-400 text-lg font-medium">No fraud indicators detected</p>
              <p className="text-slate-400">This transaction appears to be legitimate</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FraudDetectionPanel;