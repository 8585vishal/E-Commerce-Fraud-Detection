export interface FraudIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  score: number;
}

export interface FraudAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  isFraud: boolean;
  indicators: FraudIndicator[];
  recommendation: string;
  confidence: number;
}

// Known fraud patterns and blacklists
const FRAUD_PATTERNS = {
  suspiciousEmails: [
    'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 
    'mailinator.com', 'throwaway.email', 'tempmail.net'
  ],
  highRiskCountries: ['Nigeria', 'Romania', 'Ghana', 'Indonesia', 'Philippines'],
  suspiciousIPs: ['203.0.113.1', '198.51.100.1', '192.0.2.1'],
  blacklistedDevices: ['fp_fraud123', 'fp_suspicious456'],
  fraudulentCards: ['4111111111111111', '5555555555554444']
};

// Velocity tracking (in real app, this would be in a database)
const velocityTracker = new Map<string, Array<{ timestamp: number; amount: number }>>();

export function detectFraud(transaction: any): FraudAnalysis {
  const indicators: FraudIndicator[] = [];
  let totalScore = 0;

  // 1. Email Analysis
  const emailDomain = transaction.customerEmail?.split('@')[1]?.toLowerCase();
  if (emailDomain && FRAUD_PATTERNS.suspiciousEmails.some(domain => emailDomain.includes(domain))) {
    const indicator: FraudIndicator = {
      type: 'Suspicious Email Domain',
      severity: 'high',
      description: `Email domain ${emailDomain} is associated with temporary email services`,
      score: 25
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 2. Amount Analysis
  if (transaction.amount > 2000) {
    const indicator: FraudIndicator = {
      type: 'High Transaction Amount',
      severity: transaction.amount > 5000 ? 'critical' : 'high',
      description: `Transaction amount $${transaction.amount} exceeds normal spending patterns`,
      score: transaction.amount > 5000 ? 30 : 20
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 3. Geographic Analysis
  if (transaction.location && FRAUD_PATTERNS.highRiskCountries.some(country => 
    transaction.location.toLowerCase().includes(country.toLowerCase()))) {
    const indicator: FraudIndicator = {
      type: 'High-Risk Geographic Location',
      severity: 'high',
      description: `Transaction originated from high-risk location: ${transaction.location}`,
      score: 25
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 4. IP Address Analysis
  if (transaction.ipAddress && FRAUD_PATTERNS.suspiciousIPs.includes(transaction.ipAddress)) {
    const indicator: FraudIndicator = {
      type: 'Blacklisted IP Address',
      severity: 'critical',
      description: `IP address ${transaction.ipAddress} is on fraud blacklist`,
      score: 35
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 5. Device Fingerprint Analysis
  if (transaction.deviceFingerprint && FRAUD_PATTERNS.blacklistedDevices.includes(transaction.deviceFingerprint)) {
    const indicator: FraudIndicator = {
      type: 'Suspicious Device',
      severity: 'high',
      description: `Device fingerprint ${transaction.deviceFingerprint} has been flagged for fraudulent activity`,
      score: 30
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 6. Velocity Analysis
  const customerKey = transaction.customerEmail || transaction.customerName;
  if (customerKey) {
    const customerTransactions = velocityTracker.get(customerKey) || [];
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentTransactions = customerTransactions.filter(t => now - t.timestamp < oneHour);
    
    if (recentTransactions.length > 3) {
      const indicator: FraudIndicator = {
        type: 'High Transaction Velocity',
        severity: 'high',
        description: `${recentTransactions.length} transactions in the last hour`,
        score: 25
      };
      indicators.push(indicator);
      totalScore += indicator.score;
    }

    // Update velocity tracker
    customerTransactions.push({ timestamp: now, amount: transaction.amount });
    velocityTracker.set(customerKey, customerTransactions.slice(-10)); // Keep last 10 transactions
  }

  // 7. Time-based Analysis
  const transactionTime = new Date(transaction.timestamp || Date.now());
  const hour = transactionTime.getHours();
  if (hour >= 2 && hour <= 5) { // Late night transactions
    const indicator: FraudIndicator = {
      type: 'Unusual Transaction Time',
      severity: 'medium',
      description: `Transaction occurred during unusual hours (${hour}:00)`,
      score: 15
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 8. Payment Method Analysis
  if (transaction.paymentMethod === 'Credit Card' && transaction.amount > 1000) {
    // Check for card testing patterns
    const indicator: FraudIndicator = {
      type: 'High-Value Card Transaction',
      severity: 'medium',
      description: 'High-value credit card transaction requires additional verification',
      score: 10
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // 9. Location Mismatch (if we had historical data)
  if (transaction.location === 'Unknown' || !transaction.location) {
    const indicator: FraudIndicator = {
      type: 'Unknown Location',
      severity: 'medium',
      description: 'Transaction location could not be determined',
      score: 15
    };
    indicators.push(indicator);
    totalScore += indicator.score;
  }

  // Calculate final risk assessment
  const riskScore = Math.min(totalScore, 100);
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  let isFraud = false;
  let recommendation = '';
  let confidence = 0;

  if (riskScore >= 80) {
    riskLevel = 'critical';
    isFraud = true;
    recommendation = 'BLOCK TRANSACTION - High fraud probability detected';
    confidence = 95;
  } else if (riskScore >= 60) {
    riskLevel = 'high';
    isFraud = true;
    recommendation = 'MANUAL REVIEW REQUIRED - Multiple fraud indicators present';
    confidence = 85;
  } else if (riskScore >= 30) {
    riskLevel = 'medium';
    isFraud = false;
    recommendation = 'ADDITIONAL VERIFICATION - Monitor closely';
    confidence = 70;
  } else {
    riskLevel = 'low';
    isFraud = false;
    recommendation = 'APPROVE - Low fraud risk';
    confidence = 60;
  }

  return {
    riskScore,
    riskLevel,
    isFraud,
    indicators,
    recommendation,
    confidence
  };
}

export function analyzeFraudTrends(transactions: any[]): {
  fraudRate: number;
  totalFraudAmount: number;
  commonIndicators: { type: string; count: number }[];
  riskDistribution: { level: string; count: number; percentage: number }[];
} {
  const analyses = transactions.map(t => detectFraud(t));
  const fraudTransactions = analyses.filter(a => a.isFraud);
  
  const fraudRate = (fraudTransactions.length / transactions.length) * 100;
  const totalFraudAmount = fraudTransactions.reduce((sum, analysis, index) => {
    return sum + (transactions[index]?.amount || 0);
  }, 0);

  // Count common indicators
  const indicatorCounts = new Map<string, number>();
  analyses.forEach(analysis => {
    analysis.indicators.forEach(indicator => {
      indicatorCounts.set(indicator.type, (indicatorCounts.get(indicator.type) || 0) + 1);
    });
  });

  const commonIndicators = Array.from(indicatorCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Risk distribution
  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  analyses.forEach(analysis => {
    riskCounts[analysis.riskLevel]++;
  });

  const riskDistribution = Object.entries(riskCounts).map(([level, count]) => ({
    level,
    count,
    percentage: (count / transactions.length) * 100
  }));

  return {
    fraudRate,
    totalFraudAmount,
    commonIndicators,
    riskDistribution
  };
}