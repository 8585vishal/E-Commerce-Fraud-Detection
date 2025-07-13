import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { FraudCase } from '../types';
import { mockFraudCases } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FraudCaseModal from './FraudCaseModal';

const FraudCaseManager: React.FC = () => {
  const [fraudCases, setFraudCases] = useLocalStorage('fraudCases', mockFraudCases);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredCases = fraudCases.filter((fraudCase) => {
    const matchesSearch = 
      fraudCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.fraudType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.investigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fraudCase.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || fraudCase.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleCreate = () => {
    setSelectedCase(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (fraudCase: FraudCase) => {
    setSelectedCase(fraudCase);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (fraudCase: FraudCase) => {
    setSelectedCase(fraudCase);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fraud case?')) {
      setFraudCases(fraudCases.filter(c => c.id !== id));
    }
  };

  const handleSave = (fraudCase: FraudCase) => {
    if (modalMode === 'create') {
      const newCase = {
        ...fraudCase,
        id: `case_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFraudCases([...fraudCases, newCase]);
    } else if (modalMode === 'edit') {
      setFraudCases(fraudCases.map(c => 
        c.id === fraudCase.id ? { ...fraudCase, updatedAt: new Date().toISOString() } : c
      ));
    }
    setIsModalOpen(false);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'investigating': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'open': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return CheckCircle;
      case 'investigating': return Clock;
      case 'open': return AlertTriangle;
      case 'closed': return XCircle;
      default: return Clock;
    }
  };

  const caseStats = {
    total: fraudCases.length,
    open: fraudCases.filter(c => c.status === 'open').length,
    investigating: fraudCases.filter(c => c.status === 'investigating').length,
    resolved: fraudCases.filter(c => c.status === 'resolved').length,
    closed: fraudCases.filter(c => c.status === 'closed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fraud Case Management</h1>
          <p className="text-slate-400">Investigate and manage fraud cases efficiently</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>New Case</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Cases', value: caseStats.total, color: 'blue', icon: AlertTriangle },
          { label: 'Open', value: caseStats.open, color: 'orange', icon: AlertTriangle },
          { label: 'Investigating', value: caseStats.investigating, color: 'blue', icon: Clock },
          { label: 'Resolved', value: caseStats.resolved, color: 'green', icon: CheckCircle },
          { label: 'Closed', value: caseStats.closed, color: 'slate', icon: XCircle }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-400`} />
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
              placeholder="Search cases..."
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
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button className="flex items-center space-x-2 bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCases.map((fraudCase) => {
          const StatusIcon = getStatusIcon(fraudCase.status);
          return (
            <div
              key={fraudCase.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(fraudCase.riskLevel)}`}>
                    {fraudCase.riskLevel.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(fraudCase.status)} flex items-center space-x-1`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{fraudCase.status}</span>
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleView(fraudCase)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(fraudCase)}
                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fraudCase.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{fraudCase.fraudType}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{fraudCase.description}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-white font-mono">{fraudCase.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Investigator:</span>
                  <span className="text-white">{fraudCase.investigator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white">{new Date(fraudCase.createdAt).toLocaleDateString()}</span>
                </div>
                {fraudCase.resolution && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-xs font-medium">Resolution:</p>
                    <p className="text-green-300 text-sm">{fraudCase.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No fraud cases found matching your criteria.</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Create your first fraud case
          </button>
        </div>
      )}

      {/* Fraud Case Modal */}
      <FraudCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        fraudCase={selectedCase}
        mode={modalMode}
      />
    </div>
  );
};

export default FraudCaseManager;