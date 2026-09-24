// src/pages/support-admin/modules/ModuleActivation.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { BuildingIcon, ShieldCheckIcon, HistoryIcon, X, Calendar, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  activationDate: string;
  expiryDate: string;
  users: string;
  description?: string;
  features?: string[];
}

interface HistoryItem {
  id: string;
  date: string;
  module: string;
  action: string;
  user: string;
  details?: string;
}

const initialModulesData: Module[] = [
{
  id: '1',
  name: 'Student Management',
  status: 'Active',
  activationDate: '01-Apr-2023',
  expiryDate: '31-Mar-2026',
  users: 'Unlimited',
  description: 'Comprehensive student information and enrollment management',
  features: ['Admission Management', 'Student Profiles', 'Attendance Tracking', 'Bulk Operations']
},
{
  id: '2',
  name: 'Finance & Fees',
  status: 'Active',
  activationDate: '01-Apr-2023',
  expiryDate: '31-Mar-2026',
  users: '5',
  description: 'Complete financial management and fee collection system',
  features: ['Fee Collection', 'Invoice Generation', 'Payment Tracking', 'Financial Reports']
},
{
  id: '3',
  name: 'HR & Payroll',
  status: 'Active',
  activationDate: '01-Apr-2023',
  expiryDate: '31-Mar-2026',
  users: '3',
  description: 'Human resource and payroll management',
  features: ['Employee Records', 'Payroll Processing', 'Leave Management', 'Performance Reviews']
},
{
  id: '4',
  name: 'Assessment & Exam',
  status: 'Active',
  activationDate: '01-Jun-2023',
  expiryDate: '31-Mar-2026',
  users: 'Unlimited',
  description: 'Examination and assessment management system',
  features: ['Exam Scheduling', 'Grade Management', 'Report Cards', 'Analytics']
},
{
  id: '5',
  name: 'Library Management',
  status: 'Inactive',
  activationDate: '-',
  expiryDate: '-',
  users: '-',
  description: 'Library resource and circulation management',
  features: ['Book Catalog', 'Issue/Return', 'Fine Management', 'Digital Library']
},
{
  id: '6',
  name: 'Transport Management',
  status: 'Active',
  activationDate: '01-Apr-2023',
  expiryDate: '31-Mar-2026',
  users: '2',
  description: 'School transportation and route management',
  features: ['Route Planning', 'Vehicle Tracking', 'Driver Management', 'Fee Integration']
},
{
  id: '7',
  name: 'Hostel Management',
  status: 'Inactive',
  activationDate: '-',
  expiryDate: '-',
  users: '-',
  description: 'Hostel accommodation and mess management',
  features: ['Room Allocation', 'Mess Management', 'Visitor Tracking', 'Hostel Fees']
},
{
  id: '8',
  name: 'Online Exam',
  status: 'Active',
  activationDate: '01-Jan-2024',
  expiryDate: '31-Mar-2025',
  users: '500',
  description: 'Online examination and assessment platform',
  features: ['Online Tests', 'Auto-Grading', 'Question Bank', 'Proctoring']
},
{
  id: '9',
  name: 'Alumni Portal',
  status: 'Inactive',
  activationDate: '-',
  expiryDate: '-',
  users: '-',
  description: 'Alumni network and engagement platform',
  features: ['Alumni Directory', 'Events', 'Job Board', 'Donations']
},
{
  id: '10',
  name: 'Parent Portal',
  status: 'Active',
  activationDate: '01-Apr-2023',
  expiryDate: '31-Mar-2026',
  users: 'Unlimited',
  description: 'Parent communication and engagement portal',
  features: ['Student Progress', 'Fee Payment', 'Announcements', 'Parent-Teacher Communication']
}];


const initialHistoryData: HistoryItem[] = [
{
  id: '1',
  date: '01-Jan-2024',
  module: 'Online Exam',
  action: 'Activated',
  user: 'Support Admin',
  details: 'Licensed for 500 concurrent users until 31-Mar-2025'
},
{
  id: '2',
  date: '01-Jun-2023',
  module: 'Assessment & Exam',
  action: 'Activated',
  user: 'Support Admin',
  details: 'Unlimited users license activated'
},
{
  id: '3',
  date: '01-Apr-2023',
  module: 'Core Bundle',
  action: 'Initial Setup',
  user: 'System',
  details: 'Enterprise plan activated with core modules'
}];


export function ModuleActivation() {
  const [modulesData, setModulesData] = useState<Module[]>(initialModulesData);
  const [historyData, setHistoryData] = useState<HistoryItem[]>(initialHistoryData);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Activation/Extension Form State
  const [activationForm, setActivationForm] = useState({
    activationDate: '',
    expiryDate: '',
    users: '',
    autoRenewal: false,
    notifyAdmin: true
  });

  const handleActivateModule = (module: Module) => {
    setSelectedModule(module);
    setActivationForm({
      activationDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      users: '',
      autoRenewal: false,
      notifyAdmin: true
    });
    setShowActivationModal(true);
  };

  const handleExtendModule = (module: Module) => {
    setSelectedModule(module);
    setActivationForm({
      activationDate: module.activationDate,
      expiryDate: module.expiryDate,
      users: module.users,
      autoRenewal: false,
      notifyAdmin: true
    });
    setShowExtendModal(true);
  };

  const handleDeactivateModule = (module: Module) => {
    setSelectedModule(module);
    setShowDeactivateModal(true);
  };

  const confirmActivation = () => {
    if (!selectedModule) return;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const updatedModules = modulesData.map((module) => {
      if (module.id === selectedModule.id) {
        return {
          ...module,
          status: 'Active' as const,
          activationDate: formatDate(activationForm.activationDate),
          expiryDate: formatDate(activationForm.expiryDate),
          users: activationForm.users
        };
      }
      return module;
    });

    setModulesData(updatedModules);

    const newHistoryItem: HistoryItem = {
      id: (historyData.length + 1).toString(),
      date: formatDate(activationForm.activationDate),
      module: selectedModule.name,
      action: 'Activated',
      user: 'Support Admin',
      details: `Licensed for ${activationForm.users} users until ${formatDate(activationForm.expiryDate)}`
    };

    setHistoryData([newHistoryItem, ...historyData]);
    setShowActivationModal(false);
    setSelectedModule(null);
  };

  const confirmExtension = () => {
    if (!selectedModule) return;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const updatedModules = modulesData.map((module) => {
      if (module.id === selectedModule.id) {
        return {
          ...module,
          expiryDate: formatDate(activationForm.expiryDate),
          users: activationForm.users
        };
      }
      return module;
    });

    setModulesData(updatedModules);

    const newHistoryItem: HistoryItem = {
      id: (historyData.length + 1).toString(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      module: selectedModule.name,
      action: 'Extended',
      user: 'Support Admin',
      details: `License extended until ${formatDate(activationForm.expiryDate)}, users updated to ${activationForm.users}`
    };

    setHistoryData([newHistoryItem, ...historyData]);
    setShowExtendModal(false);
    setSelectedModule(null);
  };

  const confirmDeactivation = () => {
    if (!selectedModule) return;

    const updatedModules = modulesData.map((module) => {
      if (module.id === selectedModule.id) {
        return {
          ...module,
          status: 'Inactive' as const,
          activationDate: '-',
          expiryDate: '-',
          users: '-'
        };
      }
      return module;
    });

    setModulesData(updatedModules);

    const newHistoryItem: HistoryItem = {
      id: (historyData.length + 1).toString(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      module: selectedModule.name,
      action: 'Deactivated',
      user: 'Support Admin',
      details: 'Module access revoked'
    };

    setHistoryData([newHistoryItem, ...historyData]);
    setShowDeactivateModal(false);
    setSelectedModule(null);
  };

  const columns = [
  {
    key: 'name',
    header: 'Module Name',
    render: (row: Module) =>
    <div>
          <span className="font-medium block">{row.name}</span>
          {row.description &&
      <span className="text-xs text-gray-500">{row.description}</span>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Module) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
          {row.status}
        </Badge>

  },
  {
    key: 'activationDate',
    header: 'Activation Date'
  },
  {
    key: 'expiryDate',
    header: 'Expiry Date',
    render: (row: Module) => {
      if (row.expiryDate === '-') return '-';

      const expiryDate = new Date(row.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      const isExpired = daysUntilExpiry < 0;

      return (
        <div className="flex items-center gap-2">
            <span>{row.expiryDate}</span>
            {isExpiringSoon &&
          <AlertCircle className="w-4 h-4 text-yellow-500" title="Expiring soon" />
          }
            {isExpired &&
          <XCircle className="w-4 h-4 text-red-500" title="Expired" />
          }
          </div>);

    }
  },
  {
    key: 'users',
    header: 'Licensed Users'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Module) =>
    <div className="flex gap-2">
          {row.status === 'Active' ?
      <>
              <Button
          variant="outline"
          size="sm"
          onClick={() => handleExtendModule(row)}>

                Extend/Manage
              </Button>
              <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeactivateModule(row)}>

                Deactivate
              </Button>
            </> :

      <Button
        variant="primary"
        size="sm"
        onClick={() => handleActivateModule(row)}>

              Activate
            </Button>
      }
        </div>

  }];


  const historyColumns = [
  {
    key: 'date',
    header: 'Date'
  },
  {
    key: 'module',
    header: 'Module'
  },
  {
    key: 'action',
    header: 'Action',
    render: (row: HistoryItem) =>
    <Badge
      variant={
      row.action === 'Activated' ? 'success' :
      row.action === 'Deactivated' ? 'secondary' :
      'default'
      }>

          {row.action}
        </Badge>

  },
  {
    key: 'user',
    header: 'Performed By'
  }];


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Module Activation
          </h1>
          <p className="text-sm text-gray-500">
            Manage licensed modules and features for the institute
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-center gap-6 p-2">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <BuildingIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Delhi Public School, Ahmedabad
            </h2>
            <div className="flex gap-6 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="font-semibold">Client Code:</span> DPS-AHM-001
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">Plan:</span>
                <Badge
                  variant="success"
                  className="bg-green-100 text-green-800">

                  Enterprise
                </Badge>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">Valid Until:</span> 31-Mar-2026
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Licensed Modules"
          className="lg:col-span-2"
          headerAction={<ShieldCheckIcon className="w-5 h-5 text-gray-400" />}>

          <Table columns={columns} data={modulesData} />
        </Card>

        <Card
          title="Activation History"
          headerAction={<HistoryIcon className="w-5 h-5 text-gray-400" />}>

          <div className="space-y-3">
            {historyData.map((item) =>
            <div key={item.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{item.module}</span>
                  <Badge
                  variant={
                  item.action === 'Activated' ? 'success' :
                  item.action === 'Deactivated' ? 'secondary' :
                  'default'
                  }
                  className="text-xs">

                    {item.action}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {item.date} • {item.user}
                </div>
                {item.details &&
              <div className="text-xs text-gray-600 mt-1">{item.details}</div>
              }
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Activation Modal */}
      {showActivationModal && selectedModule &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Activate Module</h3>
              <button
              onClick={() => setShowActivationModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Module Name</label>
                <input
                type="text"
                value={selectedModule.name}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-50" />

              </div>

              {selectedModule.features &&
            <div>
                  <label className="block text-sm font-medium mb-1">Features Included</label>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedModule.features.map((feature, index) =>
                <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                )}
                  </ul>
                </div>
            }

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Activation Date
                </label>
                <input
                type="date"
                value={activationForm.activationDate}
                onChange={(e) => setActivationForm({ ...activationForm, activationDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Expiry Date
                </label>
                <input
                type="date"
                value={activationForm.expiryDate}
                onChange={(e) => setActivationForm({ ...activationForm, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Licensed Users
                </label>
                <input
                type="text"
                value={activationForm.users}
                onChange={(e) => setActivationForm({ ...activationForm, users: e.target.value })}
                placeholder="e.g., 100 or Unlimited"
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={activationForm.autoRenewal}
                  onChange={(e) => setActivationForm({ ...activationForm, autoRenewal: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Enable auto-renewal</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={activationForm.notifyAdmin}
                  onChange={(e) => setActivationForm({ ...activationForm, notifyAdmin: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Notify institute admin</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowActivationModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={confirmActivation}
                disabled={!activationForm.activationDate || !activationForm.expiryDate || !activationForm.users}>

                  Activate Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Extend/Manage Modal */}
      {showExtendModal && selectedModule &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Extend/Manage Module</h3>
              <button
              onClick={() => setShowExtendModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Module Name</label>
                <input
                type="text"
                value={selectedModule.name}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-50" />

              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <Badge variant="success">{selectedModule.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activation Date:</span>
                    <span className="font-medium">{selectedModule.activationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Expiry:</span>
                    <span className="font-medium">{selectedModule.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Users:</span>
                    <span className="font-medium">{selectedModule.users}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  New Expiry Date
                </label>
                <input
                type="date"
                value={activationForm.expiryDate}
                onChange={(e) => setActivationForm({ ...activationForm, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Licensed Users
                </label>
                <input
                type="text"
                value={activationForm.users}
                onChange={(e) => setActivationForm({ ...activationForm, users: e.target.value })}
                placeholder="e.g., 100 or Unlimited"
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={activationForm.autoRenewal}
                  onChange={(e) => setActivationForm({ ...activationForm, autoRenewal: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Enable auto-renewal</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={activationForm.notifyAdmin}
                  onChange={(e) => setActivationForm({ ...activationForm, notifyAdmin: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Notify institute admin</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExtendModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={confirmExtension}>

                  Update Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && selectedModule &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">Deactivate Module</h3>
              <button
              onClick={() => setShowDeactivateModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Warning: This action will deactivate the module
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Users will immediately lose access to <strong>{selectedModule.name}</strong> and all its features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Module:</span>
                    <span className="font-medium">{selectedModule.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <Badge variant="success">{selectedModule.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Since:</span>
                    <span className="font-medium">{selectedModule.activationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Users:</span>
                    <span className="font-medium">{selectedModule.users}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Are you sure you want to deactivate this module? This action can be reversed by reactivating the module later.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeactivateModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={confirmDeactivation}>

                  Deactivate Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}