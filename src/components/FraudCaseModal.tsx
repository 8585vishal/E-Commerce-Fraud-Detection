import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FraudCase } from '../types';

interface FraudCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fraudCase: FraudCase) => void;
  fraudCase: FraudCase | null;
  mode: 'create' | 'edit' | 'view';
}

const FraudCaseModal: React.FC<FraudCaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fraudCase,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<FraudCase>>({
    transactionId: '',
    riskLevel: 'medium',
    fraudType: '',
    description: '',
    investigator: '',
    status: 'open',
    resolution: ''
  });

  useEffect(() => {
    if (fraudCase) {
      setFormData(fraudCase);
    } else {
      setFormData({
        transactionId: '',
        riskLevel: 'medium',
        fraudType: '',
        description: '',
        investigator: '',
        status: 'open',
        resolution: ''
      });
    }
  }, [fraudCase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData as FraudCase);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Create Fraud Case' : mode === 'edit' ? 'Edit Fraud Case' : 'Fraud Case Details';

  const fraudTypes = [
    'Identity Theft',
    'Credit Card Fraud',
    'Account Takeover',
    'Suspicious Location',
    'High Risk Profile',
    'Velocity Fraud',
    'Chargeback Fraud',
    'Triangulation Fraud',
    'Clean Fraud',
    'Friendly Fraud',
    'Synthetic Identity',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId || ''}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="txn_001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Risk Level
              </label>
              <select
                name="riskLevel"
                value={formData.riskLevel || 'medium'}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fraud Type
              </label>
              <select
                name="fraudType"
                value={formData.fraudType || ''}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              >
                <option value="">Select fraud type...</option>
                {fraudTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Investigator
              </label>
              <input
                type="text"
                name="investigator"
                value={formData.investigator || ''}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status || 'open'}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={isReadOnly}
              rows={4}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Describe the fraud case details, indicators, and findings..."
              required
            />
          </div>

          {(formData.status === 'resolved' || formData.status === 'closed') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Resolution
              </label>
              <textarea
                name="resolution"
                value={formData.resolution || ''}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
                placeholder="Describe the resolution, actions taken, and outcome..."
              />
            </div>
          )}

          {isReadOnly && fraudCase && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Created At
                </label>
                <p className="text-white">{new Date(fraudCase.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Last Updated
                </label>
                <p className="text-white">{new Date(fraudCase.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {!isReadOnly && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                {mode === 'create' ? 'Create Case' : 'Save Changes'}
              </button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FraudCaseModal;