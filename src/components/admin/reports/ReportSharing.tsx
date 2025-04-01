'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Users, Link } from 'lucide-react';

interface SharingSettings {
  public: boolean;
  users: Array<{ id: string; email: string; role: 'viewer' | 'editor' }>;
  link: string | null;
}

export const ReportSharing = ({ reportId }: { reportId: string }) => {
  const [settings, setSettings] = useState<SharingSettings>({
    public: false,
    users: [],
    link: null,
  });

  const [email, setEmail] = useState('');

  const handleShare = async (email: string) => {
    try {
      const response = await fetch('/api/reports/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, email }),
      });
      
      if (!response.ok) throw new Error('Failed to share report');
      
      const data = await response.json();
      setSettings(prev => ({
        ...prev,
        users: [...prev.users, data.user],
      }));
      setEmail('');
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  const generateShareLink = async () => {
    try {
      const response = await fetch('/api/reports/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });
      
      if (!response.ok) throw new Error('Failed to generate link');
      
      const { link } = await response.json();
      setSettings(prev => ({ ...prev, link }));
    } catch (error) {
      console.error('Error generating link:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Share Report</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={() => handleShare(email)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>Shared with {settings.users.length} users</span>
          </div>
          <Button variant="outline" onClick={generateShareLink}>
            <Link className="w-4 h-4 mr-2" />
            Generate Link
          </Button>
        </div>

        {settings.link && (
          <div className="mt-4">
            <Input
              readOnly
              value={settings.link}
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Shared With</h3>
          <div className="space-y-2">
            {settings.users.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <span>{user.email}</span>
                <span className="text-sm text-gray-500">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};