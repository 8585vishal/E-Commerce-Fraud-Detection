export interface Transaction {
  id: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  ipAddress: string;
  deviceFingerprint: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'flagged' | 'rejected';
  riskScore: number;
  location: string;
  merchantId: string;
}

export interface FraudCase {
  id: string;
  transactionId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fraudType: string;
  description: string;
  investigator: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export interface DashboardStats {
  totalTransactions: number;
  flaggedTransactions: number;
  fraudRate: number;
  totalAmount: number;
  averageRiskScore: number;
  activeInvestigations: number;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  threshold: number;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  actions: string[];
}