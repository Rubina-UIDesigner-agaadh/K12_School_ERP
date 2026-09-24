import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit, Trash2, Search, RefreshCw, X, Link } from 'lucide-react';
const MOCK_MAPPINGS = [
{
  id: 'SAM001',
  scheme: 'Merit Scholarship - Grade A',
  glAccount: '3001',
  glAccountName: 'Scholarship Expense - Merit',
  fundAccount: 'Internal Fund',
  costCenter: 'ACAD-001',
  disbursementMode: 'Fee Waiver',
  status: 'Active'
},
{
  id: 'SAM002',
  scheme: 'Need-Based Financial Aid',
  glAccount: '3002',
  glAccountName: 'Scholarship Expense - Need',
  fundAccount: 'Internal Fund',
  costCenter: 'ACAD-001',
  disbursementMode: 'Fee Waiver',
  status: 'Active'
},
{
  id: 'SAM003',
  scheme: 'SC/ST Government Scholarship',
  glAccount: '3003',
  glAccountName: 'Govt Scholarship Receivable',
  fundAccount: 'Government Grant A/C',
  costCenter: 'GOVT-001',
  disbursementMode: 'Direct Transfer',
  status: 'Active'
},
{
  id: 'SAM004',
  scheme: 'Sports Excellence Award',
  glAccount: '3004',
  glAccountName: 'Sports Scholarship Expense',
  fundAccount: 'Sports Fund',
  costCenter: 'SPORT-001',
  disbursementMode: 'Fee Waiver',
  status: 'Active'
},
{
  id: 'SAM005',
  scheme: 'Staff Ward Concession',
  glAccount: '3005',
  glAccountName: 'Staff Concession Expense',
  fundAccount: 'Internal Fund',
  costCenter: 'HR-001',
  disbursementMode: 'Fee Waiver',
  status: 'Active'
}];

const SCHEMES = [
'Merit Scholarship - Grade A',
'Need-Based Financial Aid',
'SC/ST Government Scholarship',
'Sports Excellence Award',
'Staff Ward Concession'];

const GL_ACCOUNTS = [
'3001 - Scholarship Expense - Merit',
'3002 - Scholarship Expense - Need',
'3003 - Govt Scholarship Receivable',
'3004 - Sports Scholarship Expense',
'3005 - Staff Concession Expense'];

const DISBURSEMENT_MODES = [
'Fee Waiver',
'Direct Bank Transfer',
'Cheque',
'Cash'];

export function ScholarshipAccountMapping() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMapping, setEditMapping] = useState<any>(null);
  const [form, setForm] = useState({
    scheme: '',
    glAccount: '',
    fundAccount: '',
    costCenter: '',
    disbursementMode: 'Fee Waiver'
  });
  const openAdd = () => {
    setEditMapping(null);
    setForm({
      scheme: '',
      glAccount: '',
      fundAccount: '',
      costCenter: '',
      disbursementMode: 'Fee Waiver'
    });
    setShowModal(true);
  };
  const openEdit = (m: any) => {
    setEditMapping(m);
    setForm({
      scheme: m.scheme,
      glAccount: m.glAccount,
      fundAccount: m.fundAccount,
      costCenter: m.costCenter,
      disbursementMode: m.disbursementMode
    });
    setShowModal(true);
  };
  const filtered = MOCK_MAPPINGS.filter(
    (m) =>
    !search ||
    m.scheme.toLowerCase().includes(search.toLowerCase()) ||
    m.glAccount.includes(search)
  );
  const columns = [
  {
    key: 'scheme',
    header: 'Scholarship Scheme',
    render: (r: any) =>
    <span className="font-medium text-gray-900">{r.scheme}</span>

  },
  {
    key: 'glAccount',
    header: 'GL Account',
    render: (r: any) =>
    <div>
          <p className="font-mono text-sm font-semibold text-blue-700">
            {r.glAccount}
          </p>
          <p className="text-xs text-gray-500">{r.glAccountName}</p>
        </div>

  },
  {
    key: 'fundAccount',
    header: 'Fund Account',
    render: (r: any) =>
    <span className="text-sm text-gray-700">{r.fundAccount}</span>

  },
  {
    key: 'costCenter',
    header: 'Cost Center',
    render: (r: any) =>
    <span className="font-mono text-sm text-gray-600">{r.costCenter}</span>

  },
  {
    key: 'disbursementMode',
    header: 'Disbursement Mode',
    render: (r: any) => <Badge variant="info">{r.disbursementMode}</Badge>
  },
  {
    key: 'status',
    header: 'Status',
    render: (r: any) =>
    <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>
          {r.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (r: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => openEdit(r)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarship Account Mapping
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Map scholarship schemes to GL accounts, fund accounts, and
            disbursement modes
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Link className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Each scholarship scheme must be mapped to a GL account for proper
          financial reporting. The fund account determines the source of funds
          for disbursement.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by scheme or GL account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Button variant="outline" onClick={() => setSearch('')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} mappings
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMapping ? 'Edit Mapping' : 'Add Account Mapping'}
              </h2>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <Select
              label="Scholarship Scheme *"
              options={SCHEMES.map((s) => ({
                value: s,
                label: s
              }))}
              value={form.scheme}
              onChange={(v) =>
              setForm({
                ...form,
                scheme: v
              })
              } />

              <Select
              label="GL Account *"
              options={GL_ACCOUNTS.map((g) => ({
                value: g.split(' - ')[0],
                label: g
              }))}
              value={form.glAccount}
              onChange={(v) =>
              setForm({
                ...form,
                glAccount: v
              })
              } />

              <Input
              label="Fund Account *"
              value={form.fundAccount}
              onChange={(e) =>
              setForm({
                ...form,
                fundAccount: e.target.value
              })
              }
              placeholder="e.g., Internal Fund, Government Grant A/C" />

              <Input
              label="Cost Center"
              value={form.costCenter}
              onChange={(e) =>
              setForm({
                ...form,
                costCenter: e.target.value
              })
              }
              placeholder="e.g., ACAD-001" />

              <Select
              label="Disbursement Mode *"
              options={DISBURSEMENT_MODES.map((d) => ({
                value: d,
                label: d
              }))}
              value={form.disbursementMode}
              onChange={(v) =>
              setForm({
                ...form,
                disbursementMode: v
              })
              } />

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editMapping ? 'Update' : 'Add Mapping'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}