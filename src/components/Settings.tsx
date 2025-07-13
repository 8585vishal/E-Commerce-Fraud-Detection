import React, { useState } from 'react';
import { 
  Save,
  Bell,
  Shield,
  Database,
  Mail,
  Sliders,
  Key,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppSettings {
  notifications: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    criticalAlertsOnly: boolean;
    fraudThreshold: number;
  };
  security: {
    sessionTimeout: number;
    requireMFA: boolean;
    passwordExpiry: number;
    loginAttempts: number;
  };
  detection: {
    autoBlockThreshold: number;
    riskScoreModel: string;
    velocityChecking: boolean;
    deviceFingerprinting: boolean;
  };
  integration: {
    apiEndpoint: string;
    webhookUrl: string;
    dataRetention: number;
    backupFrequency: string;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', {
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      criticalAlertsOnly: false,
      fraudThreshold: 80
    },
    security: {
      sessionTimeout: 30,
      requireMFA: true,
      passwordExpiry: 90,
      loginAttempts: 3
    },
    detection: {
      autoBlockThreshold: 95,
      riskScoreModel: 'advanced',
      velocityChecking: true,
      deviceFingerprinting: true
    },
    integration: {
      apiEndpoint: 'https://api.fraudguard.com/v1',
      webhookUrl: 'https://your-app.com/webhooks/fraud',
      dataRetention: 365,
      backupFrequency: 'daily'
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (section: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Settings are already saved to localStorage via useLocalStorage
    setUnsavedChanges(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'detection', label: 'Detection', icon: Sliders },
    { id: 'integration', label: 'Integration', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-slate-400">Configure fraud detection and system preferences</p>
        </div>
        {unsavedChanges && (
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
          >
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Alerts</h3>
                      <p className="text-slate-400 text-sm">Receive email notifications for fraud alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <p className="text-slate-400 text-sm">Real-time browser notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Critical Alerts Only</h3>
                      <p className="text-slate-400 text-sm">Only receive notifications for critical fraud cases</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.criticalAlertsOnly}
                        onChange={(e) => handleSettingChange('notifications', 'criticalAlertsOnly', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Fraud Threshold for Alerts
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.notifications.fraudThreshold}
                      onChange={(e) => handleSettingChange('notifications', 'fraudThreshold', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>0%</span>
                      <span className="text-white font-medium">{settings.notifications.fraudThreshold}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Security Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Require Multi-Factor Authentication</h3>
                      <p className="text-slate-400 text-sm">Force MFA for all users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requireMFA}
                        onChange={(e) => handleSettingChange('security', 'requireMFA', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Detection Tab */}
            {activeTab === 'detection' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Sliders className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Fraud Detection Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Auto-Block Threshold
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="100"
                      value={settings.detection.autoBlockThreshold}
                      onChange={(e) => handleSettingChange('detection', 'autoBlockThreshold', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-slate-400 mt-1">
                      <span>80%</span>
                      <span className="text-white font-medium">{settings.detection.autoBlockThreshold}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Risk Score Model
                    </label>
                    <select
                      value={settings.detection.riskScoreModel}
                      onChange={(e) => handleSettingChange('detection', 'riskScoreModel', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="basic">Basic Model</option>
                      <option value="advanced">Advanced Model</option>
                      <option value="ml-enhanced">ML Enhanced</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Velocity Checking</h3>
                        <p className="text-slate-400 text-sm">Monitor transaction frequency</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.detection.velocityChecking}
                          onChange={(e) => handleSettingChange('detection', 'velocityChecking', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Device Fingerprinting</h3>
                        <p className="text-slate-400 text-sm">Track device characteristics</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.detection.deviceFingerprinting}
                          onChange={(e) => handleSettingChange('detection', 'deviceFingerprinting', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Tab */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Integration Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      API Endpoint
                    </label>
                    <input
                      type="url"
                      value={settings.integration.apiEndpoint}
                      onChange={(e) => handleSettingChange('integration', 'apiEndpoint', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={settings.integration.webhookUrl}
                      onChange={(e) => handleSettingChange('integration', 'webhookUrl', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Data Retention (days)
                      </label>
                      <input
                        type="number"
                        value={settings.integration.dataRetention}
                        onChange={(e) => handleSettingChange('integration', 'dataRetention', parseInt(e.target.value))}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.integration.backupFrequency}
                        onChange={(e) => handleSettingChange('integration', 'backupFrequency', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Key className="h-5 w-5 text-blue-400" />
                      <h3 className="text-white font-medium">API Configuration</h3>
                    </div>
                    <div className="space-y-3">
                      <button className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                        <span>Regenerate API Key</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>Test Connection</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;