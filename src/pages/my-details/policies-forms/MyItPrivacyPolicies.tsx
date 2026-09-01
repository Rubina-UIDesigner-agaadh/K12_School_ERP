import React from 'react';
import {
  Lock,
  Wifi,
  Database,
  Cookie,
  CheckCircle,
  FileText } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
export function MyItPrivacyPolicies() {
  const policies = [
  {
    id: 1,
    title: 'Acceptable Use Policy (AUP)',
    icon: <Wifi className="w-6 h-6 text-blue-500" />,
    description:
    'Rules regarding the use of school internet, computers, and digital resources.',
    version: 'v2.0',
    date: 'Jan 2024',
    status: 'Consented'
  },
  {
    id: 2,
    title: 'Data Privacy Statement',
    icon: <Database className="w-6 h-6 text-purple-500" />,
    description:
    'How we collect, store, and use your personal data in compliance with laws.',
    version: 'v1.2',
    date: 'Mar 2024',
    status: 'Pending'
  },
  {
    id: 3,
    title: 'Password & Account Security',
    icon: <Lock className="w-6 h-6 text-red-500" />,
    description:
    'Guidelines for creating strong passwords and securing your account.',
    version: 'v1.0',
    date: 'Jan 2023',
    status: 'View Only'
  },
  {
    id: 4,
    title: 'Cookie Policy',
    icon: <Cookie className="w-6 h-6 text-orange-500" />,
    description: 'Information about cookies used on the school portal.',
    version: 'v1.1',
    date: 'Feb 2024',
    status: 'View Only'
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IT & Data Privacy</h1>
        <p className="text-sm text-gray-500">
          Policies regarding technology usage and data protection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {policies.map((policy) =>
        <Card key={policy.id}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-gray-50 rounded-full border border-gray-100">
                {policy.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {policy.title}
                  </h3>
                  <Badge variant="outline">{policy.version}</Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {policy.description}
                </p>
                <p className="text-xs text-gray-400">
                  Last Updated: {policy.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 min-w-[150px]">
                {policy.status === 'Consented' ?
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" /> Consented
                  </div> :
              policy.status === 'Pending' ?
              <Button variant="primary" size="sm" className="w-full">
                    Review & Consent
                  </Button> :

              <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" /> View
                  </Button>
              }
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>);

}