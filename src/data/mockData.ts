import { Transaction, FraudCase, DashboardStats } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    orderId: 'ORD-2024-001',
    customerEmail: 'john.doe@email.com',
    customerName: 'John Doe',
    amount: 299.99,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    ipAddress: '192.168.1.100',
    deviceFingerprint: 'fp_abc123',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'approved',
    riskScore: 25,
    location: 'New York, USA',
    merchantId: 'merchant_001'
  },
  {
    id: 'txn_002',
    orderId: 'ORD-2024-002',
    customerEmail: 'jane.smith@email.com',
    customerName: 'Jane Smith',
    amount: 1599.99,
    currency: 'USD',
    paymentMethod: 'PayPal',
    ipAddress: '10.0.0.1',
    deviceFingerprint: 'fp_def456',
    timestamp: '2024-01-15T11:45:00Z',
    status: 'flagged',
    riskScore: 85,
    location: 'Unknown',
    merchantId: 'merchant_001'
  },
  {
    id: 'txn_003',
    orderId: 'ORD-2024-003',
    customerEmail: 'suspicious@temp.com',
    customerName: 'Bob Johnson',
    amount: 2999.99,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    ipAddress: '203.0.113.1',
    deviceFingerprint: 'fp_ghi789',
    timestamp: '2024-01-15T12:15:00Z',
    status: 'rejected',
    riskScore: 95,
    location: 'Romania',
    merchantId: 'merchant_002'
  },
  {
    id: 'txn_004',
    orderId: 'ORD-2024-004',
    customerEmail: 'regular.customer@email.com',
    customerName: 'Alice Brown',
    amount: 89.99,
    currency: 'USD',
    paymentMethod: 'Debit Card',
    ipAddress: '192.168.1.200',
    deviceFingerprint: 'fp_jkl012',
    timestamp: '2024-01-15T13:20:00Z',
    status: 'approved',
    riskScore: 15,
    location: 'California, USA',
    merchantId: 'merchant_001'
  },
  {
    id: 'txn_005',
    orderId: 'ORD-2024-005',
    customerEmail: 'test.user@domain.com',
    customerName: 'Charlie Wilson',
    amount: 459.50,
    currency: 'USD',
    paymentMethod: 'Apple Pay',
    ipAddress: '172.16.0.1',
    deviceFingerprint: 'fp_mno345',
    timestamp: '2024-01-15T14:10:00Z',
    status: 'pending',
    riskScore: 45,
    location: 'Texas, USA',
    merchantId: 'merchant_003'
  }
];

export const mockFraudCases: FraudCase[] = [
  {
    id: 'case_001',
    transactionId: 'txn_002',
    riskLevel: 'high',
    fraudType: 'Suspicious Location',
    description: 'Transaction from unknown location with high amount',
    investigator: 'Sarah Chen',
    status: 'investigating',
    createdAt: '2024-01-15T11:50:00Z',
    updatedAt: '2024-01-15T12:30:00Z'
  },
  {
    id: 'case_002',
    transactionId: 'txn_003',
    riskLevel: 'critical',
    fraudType: 'High Risk Profile',
    description: 'Multiple fraud indicators detected: suspicious email, high amount, foreign IP',
    investigator: 'Mike Rodriguez',
    status: 'resolved',
    createdAt: '2024-01-15T12:20:00Z',
    updatedAt: '2024-01-15T13:45:00Z',
    resolution: 'Confirmed fraud - blocked customer and reported to authorities'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTransactions: 1247,
  flaggedTransactions: 89,
  fraudRate: 7.14,
  totalAmount: 234567.89,
  averageRiskScore: 34.2,
  activeInvestigations: 12
};