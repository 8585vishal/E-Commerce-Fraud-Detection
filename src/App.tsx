import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import FraudCaseManager from './components/FraudCaseManager';
import UserManager from './components/UserManager';
import Settings from './components/Settings';
import FraudDetectionPanel from './components/FraudDetectionPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fraud-detection':
        return <FraudDetectionPanel />;
      case 'transactions':
        return <TransactionManager />;
      case 'fraud-cases':
        return <FraudCaseManager />;
      case 'users':
        return <UserManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;