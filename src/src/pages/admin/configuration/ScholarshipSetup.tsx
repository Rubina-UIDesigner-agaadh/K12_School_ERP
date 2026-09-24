// pages/admin/settings/ScholarshipSetup.tsx
// Scholarship and concession configuration system
// Manages scholarship schemes, eligibility, disbursement, documents, funding sources, and renewal rules

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Save, RotateCcw, Award, Settings, Users, FileText,
  DollarSign, Plus, Edit, Trash2, Eye, Building, RefreshCw } from
'lucide-react';

// Mock scholarship schemes
const MOCK_SCHOLARSHIPS = [
{ id: 1, name: 'Merit Scholarship', code: 'MERIT2024', year: '2024-25', classes: 'Class 9-12', status: 'Active', source: 'Institution', amount: '50%', renewal: 'Auto' },
{ id: 2, name: 'SC/ST Scholarship', code: 'SCST2024', year: '2024-25', classes: 'All Classes', status: 'Active', source: 'Government', amount: '₹25,000', renewal: 'Manual' },
{ id: 3, name: 'Sports Quota', code: 'SPORT2024', year: '2024-25', classes: 'Class 6-12', status: 'Active', source: 'Private', amount: '75%', renewal: 'Performance' }];


export function ScholarshipSetup() {
  const [activeSection, setActiveSection] = useState('schemes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', year: '2024-25', classes: '', status: 'Active',
    source: 'Institution', amountType: 'percentage', amount: '',
    autoRenewal: true, performanceBased: false, approvalRequired: true
  });

  const sections = [
  { id: 'schemes', label: 'Scholarship Schemes', icon: Award },
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'eligibility', label: 'Eligibility Rules', icon: Users },
  { id: 'disbursement', label: 'Disbursement', icon: DollarSign },
  { id: 'documents', label: 'Documents & Audit', icon: FileText }];


  const columns = [
  { key: 'code', header: 'Code', render: (r: any) => <span className="font-mono text-xs text-gray-600">{r.code}</span> },
  { key: 'name', header: 'Scheme Name', render: (r: any) => <span className="font-medium text-gray-900">{r.name}</span> },
  { key: 'source', header: 'Source', render: (r: any) => <Badge variant={r.source === 'Government' ? 'info' : r.source === 'Private' ? 'warning' : 'secondary'}>{r.source}</Badge> },
  { key: 'amount', header: 'Amount', render: (r: any) => <span className="text-sm font-semibold text-green-700">{r.amount}</span> },
  { key: 'classes', header: 'Applicable Classes', render: (r: any) => <span className="text-xs text-gray-600">{r.classes}</span> },
  { key: 'renewal', header: 'Renewal', render: (r: any) => <Badge variant="secondary" size="xs"><RefreshCw className="w-3 h-3 mr-1" />{r.renewal}</Badge> },
  { key: 'status', header: 'Status', render: (r: any) => <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>{r.status}</Badge> },
  {
    key: 'actions', header: 'Actions',
    render: (r: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" title="View"><Eye className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" title="Edit"><Edit className="w-3 h-3" /></Button>
          <Button variant="ghost" size="xs" title="Delete"><Trash2 className="w-3 h-3 text-red-500" /></Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarship Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Configure scholarship schemes, eligibility, disbursement, and renewal rules</p>
        </div>
        <div className="flex gap-2">
          {activeSection === 'schemes' &&
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />Add Scholarship
            </Button>
          }
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />Restore Defaults
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />Save Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
        { label: 'Active Schemes', value: MOCK_SCHOLARSHIPS.filter((s) => s.status === 'Active').length, color: 'green', icon: <Award className="w-5 h-5" /> },
        { label: 'Government', value: MOCK_SCHOLARSHIPS.filter((s) => s.source === 'Government').length, color: 'blue', icon: <Building className="w-5 h-5" /> },
        { label: 'Auto Renewal', value: MOCK_SCHOLARSHIPS.filter((s) => s.renewal === 'Auto').length, color: 'purple', icon: <RefreshCw className="w-5 h-5" /> },
        { label: 'Total Schemes', value: MOCK_SCHOLARSHIPS.length, color: 'gray', icon: <Award className="w-5 h-5" /> }].
        map((stat) =>
        <Card key={stat.label} className={`p-4 bg-${stat.color}-50 border-${stat.color}-200`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {sections.map((s) =>
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === s.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'}`}>

              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION 1: Scholarship Master */}
          {activeSection === 'schemes' &&
          <Card noPadding>
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Scholarship Schemes Master
                </h3>
                <p className="text-xs text-gray-600 mt-1">Manage all scholarship schemes with funding sources and renewal rules</p>
              </div>
              <Table columns={columns} data={MOCK_SCHOLARSHIPS} />
            </Card>
          }

          {/* General Settings */}
          {activeSection === 'general' &&
          <>
              <Card title="General Scholarship Settings" icon={<Settings className="w-5 h-5 text-gray-500" />}>
                <div className="space-y-4">
                  <Toggle label="Enable Scholarship Module" defaultChecked />
                  <Toggle label="Allow Multiple Scholarships per Student" />
                  <Select label="Scholarship Application Mode" options={[
                { value: 'admin', label: 'Admin Assigns Only' },
                { value: 'online', label: 'Online Application by Student' },
                { value: 'both', label: 'Both' }]
                } defaultValue="admin" />
                  <Input label="Scholarship Reference Number Format" defaultValue="SCH-{YEAR}-{0000}" />
                  <Toggle label="Enable Scholarship Renewal (Annual)" defaultChecked />
                  <Select label="Renewal Basis" options={[
                { value: 'auto', label: 'Auto-renew if criteria met' },
                { value: 'manual', label: 'Manual Renewal Required' }]
                } defaultValue="manual" />
                </div>
              </Card>

              <Card title="Concession Settings" icon={<DollarSign className="w-5 h-5 text-green-500" />}>
                <div className="space-y-4">
                  <Select label="Concession Application Method" options={[
                { value: 'percentage', label: 'Percentage Discount' },
                { value: 'fixed', label: 'Fixed Amount' },
                { value: 'both', label: 'Both (configurable per scheme)' }]
                } defaultValue="both" />
                  <Toggle label="Allow Concession on Specific Fee Heads Only" defaultChecked />
                  <Toggle label="Cap Total Concession at Fee Amount" defaultChecked />
                  <Input label="Maximum Concession Percentage (%)" type="number" defaultValue="100" />
                </div>
              </Card>
            </>
          }

          {/* Eligibility Rules */}
          {activeSection === 'eligibility' &&
          <Card title="Eligibility Criteria Configuration" icon={<Users className="w-5 h-5 text-purple-500" />}>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">Academic Performance Criteria</p>
                  <div className="mt-2 space-y-2">
                    <Toggle label="Enable Academic Performance Criteria" defaultChecked />
                    <Input label="Minimum Marks Required (%)" type="number" defaultValue="60" size="sm" />
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-900">Income-Based Criteria</p>
                  <div className="mt-2 space-y-2">
                    <Toggle label="Enable Income-Based Criteria" defaultChecked />
                    <Input label="Maximum Annual Family Income (₹)" type="number" defaultValue="300000" size="sm" />
                  </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-orange-900">Category & Attendance</p>
                  <div className="mt-2 space-y-2">
                    <Toggle label="Enable Category-Based Eligibility (SC/ST/OBC)" defaultChecked />
                    <Toggle label="Enable Attendance-Based Eligibility" />
                    <Input label="Minimum Attendance Required (%)" type="number" defaultValue="75" size="sm" />
                  </div>
                </div>

                <Toggle label="Allow Manual Override of Eligibility" />
                <Select label="Eligibility Verification By" options={[
              { value: 'admin', label: 'Admin Only' },
              { value: 'principal', label: 'Principal' },
              { value: 'committee', label: 'Scholarship Committee' }]
              } defaultValue="admin" />
              </div>
            </Card>
          }

          {/* Disbursement */}
          {activeSection === 'disbursement' &&
          <Card title="Disbursement Configuration" icon={<DollarSign className="w-5 h-5 text-teal-500" />}>
              <div className="space-y-4">
                <Select label="Disbursement Mode" options={[
              { value: 'fee_waiver', label: 'Fee Waiver (Deduct from Fee)' },
              { value: 'direct', label: 'Direct Bank Transfer' },
              { value: 'cheque', label: 'Cheque Payment' },
              { value: 'both', label: 'Configurable per Scheme' }]
              } defaultValue="fee_waiver" />
                <Select label="Disbursement Frequency" options={[
              { value: 'annual', label: 'Annual (Lump Sum)' },
              { value: 'term', label: 'Per Term' },
              { value: 'monthly', label: 'Monthly' }]
              } defaultValue="annual" />
                <Toggle label="Require Approval Before Disbursement" defaultChecked />
                <Select label="Disbursement Approver" options={[
              { value: 'principal', label: 'Principal' },
              { value: 'finance_head', label: 'Finance Head' },
              { value: 'admin', label: 'System Admin' }]
              } defaultValue="principal" />
                <Toggle label="Generate Disbursement Receipt" defaultChecked />
                <Toggle label="Notify Student/Parent on Disbursement" defaultChecked />
              </div>
            </Card>
          }

          {/* Documents & Audit */}
          {activeSection === 'documents' &&
          <Card title="Document Requirements & Audit" icon={<FileText className="w-5 h-5 text-indigo-500" />}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Required Documents</p>
                  <Toggle label="Require Income Certificate" defaultChecked />
                  <Toggle label="Require Caste Certificate (for category-based)" defaultChecked />
                  <Toggle label="Require Previous Year Marksheet" defaultChecked />
                  <Toggle label="Require Bank Account Details" />
                </div>
                <Select label="Document Verification Mode" options={[
              { value: 'upload', label: 'Upload & Admin Verify' },
              { value: 'physical', label: 'Physical Submission' },
              { value: 'both', label: 'Both Options' }]
              } defaultValue="upload" />
                <Input label="Document Validity Period (Years)" type="number" defaultValue="1" />
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Audit & Retention</p>
                  <Toggle label="Enable Full Audit Trail" defaultChecked />
                  <Input label="Scholarship Record Retention (Years)" type="number" defaultValue="10" />
                </div>
              </div>
            </Card>
          }
        </div>
      </div>

      {/* Add/Edit Scholarship Modal */}
      {showAddModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />Add New Scholarship Scheme
            </h2>

            <div className="space-y-6">
              {/* SECTION 1: Scholarship Master */}
              <Card title="Basic Information" noPadding>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Scholarship Name *" placeholder="e.g., Merit Scholarship" />
                    <Input label="Code *" placeholder="e.g., MERIT2024" />
                  </div>
                  <Select label="Academic Year *" options={[
                { value: '2024-25', label: '2024-2025' },
                { value: '2023-24', label: '2023-2024' }]
                } defaultValue="2024-25" />
                  <Select label="Applicable Classes *" options={[
                { value: 'all', label: 'All Classes' },
                { value: '9-12', label: 'Class 9-12' },
                { value: 'custom', label: 'Custom Selection' }]
                } />
                  <Select label="Status" options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }]
                } defaultValue="active" />
                </div>
              </Card>

              {/* SECTION 2: Funding Source */}
              <Card title="Funding Source" noPadding>
                <div className="p-4 space-y-3">
                  <Select label="Source Type *" options={[
                { value: 'government', label: 'Government' },
                { value: 'private', label: 'Private Sponsor' },
                { value: 'institution', label: 'Institution Funded' }]
                } />
                  <Input label="Sponsor Name (Optional)" placeholder="e.g., ABC Foundation" />
                </div>
              </Card>

              {/* SECTION 3: Amount Definition */}
              <Card title="Amount Definition" noPadding>
                <div className="p-4 space-y-3">
                  <Select label="Amount Type *" options={[
                { value: 'percentage', label: 'Percentage Discount' },
                { value: 'fixed', label: 'Fixed Amount' },
                { value: 'component', label: 'Component-Specific' }]
                } />
                  <Input label="Amount/Percentage *" type="number" placeholder="e.g., 50 or 25000" />
                  <Toggle label="Apply to Specific Fee Components" />
                </div>
              </Card>

              {/* SECTION 4: Renewal Rules */}
              <Card title="Renewal Rules" noPadding>
                <div className="p-4 space-y-3">
                  <Toggle label="Auto Renewal Enabled" defaultChecked />
                  <Toggle label="Performance-Based Renewal" />
                  <Toggle label="Manual Approval Required" defaultChecked />
                  <Input label="Minimum % for Renewal" type="number" defaultValue="60" />
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary">Save Scholarship</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}