'use client';

import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

interface SecuritySettings {
  passwordExpiration: number;
  twoFactorAuth: boolean;
  loginAttempts: number;
  sessionTimeout: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationSound: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
}

interface DisplaySettings {
  darkMode: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number;
  includeAttachments: boolean;
}

const SettingsPanel: React.FC = () => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [security, setSecurity] = useState<SecuritySettings>({
    passwordExpiration: 90,
    twoFactorAuth: true,
    loginAttempts: 3,
    sessionTimeout: 30
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true,
    digestFrequency: 'daily'
  });

  const [display, setDisplay] = useState<DisplaySettings>({
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const [backup, setBackup] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    includeAttachments: true
  });

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    showToast('Settings saved successfully', 'success');
  };

  const handleResetSettings = () => {
    setIsResetDialogOpen(false);
    // Reset all settings to defaults
    setSecurity({
      passwordExpiration: 90,
      twoFactorAuth: true,
      loginAttempts: 3,
      sessionTimeout: 30
    });
    setNotifications({
      emailNotifications: true,
      pushNotifications: true,
      notificationSound: true,
      digestFrequency: 'daily'
    });
    setDisplay({
      darkMode: false,
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    });
    setBackup({
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      includeAttachments: true
    });

    showToast('Settings reset to defaults', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    const toastDiv = document.createElement('div');
    toastDiv.className = `fixed bottom-4 right-4 p-4 rounded-md ${
      type === 'success' ? 'bg-green-500' :
      type === 'info' ? 'bg-blue-500' : 'bg-red-500'
    } text-white`;
    toastDiv.textContent = message;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const tabs = ['Security', 'Notifications', 'Display', 'Backup'];

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsResetDialogOpen(true)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" />
              Reset All
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Security Tab */}
            {activeTab === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password Expiration (days)
                  </label>
                  <input
                    type="number"
                    value={security.passwordExpiration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setSecurity(prev => ({ ...prev, passwordExpiration: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min={30}
                    max={365}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={security.twoFactorAuth}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setSecurity(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                {/* Add other security settings similarly */}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                {/* Add other notification settings similarly */}
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Dark Mode
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={display.darkMode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setDisplay(prev => ({ ...prev, darkMode: e.target.checked }))}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                {/* Add other display settings similarly */}
              </div>
            )}

            {/* Backup Tab */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto Backup
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={backup.autoBackup}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setBackup(prev => ({ ...prev, autoBackup: e.target.checked }))}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                {/* Add other backup settings similarly */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Reset Settings</h3>
            <p className="text-gray-500 mb-6">
              Are you sure? This will reset all settings to their default values.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsResetDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;

