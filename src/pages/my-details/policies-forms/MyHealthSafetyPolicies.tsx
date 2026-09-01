import React from 'react';
import {
  ShieldAlert,
  Flame,
  Bus,
  Beaker,
  Activity,
  Download,
  Eye } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
export function MyHealthSafetyPolicies() {
  const policies = [
  {
    id: 1,
    title: 'Campus Safety Guidelines',
    icon: <ShieldAlert className="w-6 h-6 text-blue-600" />,
    description: 'General safety rules for movement within campus premises.',
    critical: true,
    locations: 'All Campus Areas'
  },
  {
    id: 2,
    title: 'Emergency Evacuation Plan',
    icon: <Flame className="w-6 h-6 text-red-600" />,
    description: 'Fire drill procedures and assembly points.',
    critical: true,
    locations: 'All Buildings'
  },
  {
    id: 3,
    title: 'Transport Safety Rules',
    icon: <Bus className="w-6 h-6 text-yellow-600" />,
    description: 'Guidelines for students using school transport.',
    critical: false,
    locations: 'School Buses'
  },
  {
    id: 4,
    title: 'Laboratory Safety Manual',
    icon: <Beaker className="w-6 h-6 text-purple-600" />,
    description: 'Mandatory precautions for Science Labs.',
    critical: true,
    locations: 'Science Labs'
  },
  {
    id: 5,
    title: 'Sports & Playground Safety',
    icon: <Activity className="w-6 h-6 text-green-600" />,
    description: 'Rules for using sports equipment and grounds.',
    critical: false,
    locations: 'Playground, Gym'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health & Safety</h1>
          <p className="text-sm text-gray-500">
            Critical safety protocols and emergency procedures.
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Download Safety Posters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) =>
        <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                {policy.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">
                    {policy.title}
                  </h3>
                  {policy.critical && <Badge variant="danger">Critical</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  {policy.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="font-medium">Applicable:</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {policy.locations}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-2" /> View Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>);

}