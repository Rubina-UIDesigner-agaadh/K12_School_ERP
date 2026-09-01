import React, { useMemo, useState } from 'react';
// File: src/pages/finance/reports/LedgerAuditTrail.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  User,
  Activity,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  RefreshCw,
  Calendar,
  Monitor,
  History,
  Database,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
  X } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
const branches = [
{
  id: 'all',
  name: 'All Branches'
},
{
  id: 'main',
  name: 'Main Campus'
},
{
  id: 'north',
  name: 'North Branch'
},
{
  id: 'south',
  name: 'South Branch'
},
{
  id: 'east',
  name: 'East Branch'
}];

const batches = [
{
  value: 'all',
  label: 'All Batches'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
}];

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  module: string;
  action:
  'Create' |
  'Edit' |
  'Delete' |
  'View' |
  'Print' |
  'Export' |
  'Approve' |
  'Reject';
  description: string;
  recordId: string;
  recordType: string;
  branch: string;
  batch: string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  status: 'Success' | 'Failed';
}
const auditLogData: AuditLogEntry[] = [
{
  id: 'AUD-001',
  timestamp: '2024-03-20 14:32:15',
  userId: 'USR-001',
  userName: 'Rajesh Kumar',
  userRole: 'Administrator',
  module: 'Fee Collection',
  action: 'Create',
  description: 'Created new fee receipt RCP-2024-0125',
  recordId: 'RCP-2024-0125',
  recordType: 'Receipt',
  branch: 'main',
  batch: '2024-25',
  oldValue: null,
  newValue: {
    studentId: 'STU-001',
    studentName: 'Rahul Sharma',
    amount: 15000,
    feeType: 'Tuition Fee',
    paymentMode: 'Cash'
  },
  ipAddress: '192.168.1.105',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789456',
  status: 'Success'
},
{
  id: 'AUD-002',
  timestamp: '2024-03-20 14:15:42',
  userId: 'USR-002',
  userName: 'Priya Sharma',
  userRole: 'Accountant',
  module: 'Journal Entry',
  action: 'Edit',
  description: 'Modified journal entry JV-2024-0089',
  recordId: 'JV-2024-0089',
  recordType: 'Journal Voucher',
  branch: 'north',
  batch: '2024-25',
  oldValue: {
    debitAccount: 'Office Expenses',
    creditAccount: 'Cash in Hand',
    amount: 5000,
    narration: 'Office supplies purchased'
  },
  newValue: {
    debitAccount: 'Office Expenses',
    creditAccount: 'Cash in Hand',
    amount: 5500,
    narration: 'Office supplies and stationery purchased'
  },
  ipAddress: '192.168.1.110',
  userAgent: 'Firefox 123.0 / Windows 11',
  sessionId: 'SES-789457',
  status: 'Success'
},
{
  id: 'AUD-003',
  timestamp: '2024-03-20 13:45:30',
  userId: 'USR-001',
  userName: 'Rajesh Kumar',
  userRole: 'Administrator',
  module: 'Ledger Master',
  action: 'Delete',
  description: 'Deleted ledger account ACC-TEMP-001',
  recordId: 'ACC-TEMP-001',
  recordType: 'Ledger Account',
  branch: 'south',
  batch: '2024-25',
  oldValue: {
    accountName: 'Temporary Account',
    accountGroup: 'Expenses',
    openingBalance: 0,
    status: 'Active'
  },
  newValue: null,
  ipAddress: '192.168.1.105',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789456',
  status: 'Success'
},
{
  id: 'AUD-004',
  timestamp: '2024-03-20 12:30:18',
  userId: 'USR-003',
  userName: 'Amit Verma',
  userRole: 'Accounts Manager',
  module: 'Payment Voucher',
  action: 'Approve',
  description: 'Approved payment voucher PV-2024-0056',
  recordId: 'PV-2024-0056',
  recordType: 'Payment Voucher',
  branch: 'main',
  batch: '2024-25',
  oldValue: {
    status: 'Pending Approval',
    approvedBy: null,
    approvedDate: null
  },
  newValue: {
    status: 'Approved',
    approvedBy: 'Amit Verma',
    approvedDate: '2024-03-20'
  },
  ipAddress: '192.168.1.115',
  userAgent: 'Edge 122.0 / Windows 10',
  sessionId: 'SES-789458',
  status: 'Success'
},
{
  id: 'AUD-005',
  timestamp: '2024-03-20 11:22:45',
  userId: 'USR-002',
  userName: 'Priya Sharma',
  userRole: 'Accountant',
  module: 'Fee Collection',
  action: 'Create',
  description: 'Created new fee receipt RCP-2024-0124',
  recordId: 'RCP-2024-0124',
  recordType: 'Receipt',
  branch: 'east',
  batch: '2024-25',
  oldValue: null,
  newValue: {
    studentId: 'STU-045',
    studentName: 'Priya Patel',
    amount: 25000,
    feeType: 'Annual Fee',
    paymentMode: 'Online'
  },
  ipAddress: '192.168.1.110',
  userAgent: 'Firefox 123.0 / Windows 11',
  sessionId: 'SES-789457',
  status: 'Success'
},
{
  id: 'AUD-006',
  timestamp: '2024-03-20 10:15:33',
  userId: 'USR-001',
  userName: 'Rajesh Kumar',
  userRole: 'Administrator',
  module: 'Reports',
  action: 'Export',
  description: 'Exported Trial Balance report for March 2024',
  recordId: 'RPT-TB-202403',
  recordType: 'Report',
  branch: 'main',
  batch: '2024-25',
  oldValue: null,
  newValue: {
    reportType: 'Trial Balance',
    period: 'March 2024',
    format: 'PDF'
  },
  ipAddress: '192.168.1.105',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789456',
  status: 'Success'
},
{
  id: 'AUD-007',
  timestamp: '2024-03-20 09:45:12',
  userId: 'USR-004',
  userName: 'Suresh Patel',
  userRole: 'Data Entry',
  module: 'Fee Structure',
  action: 'Edit',
  description: 'Attempted to modify fee structure - Access Denied',
  recordId: 'FEE-STR-2024',
  recordType: 'Fee Structure',
  branch: 'north',
  batch: '2024-25',
  oldValue: null,
  newValue: null,
  ipAddress: '192.168.1.120',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789459',
  status: 'Failed'
},
{
  id: 'AUD-008',
  timestamp: '2024-03-19 16:30:22',
  userId: 'USR-002',
  userName: 'Priya Sharma',
  userRole: 'Accountant',
  module: 'Bank Reconciliation',
  action: 'Create',
  description: 'Created bank reconciliation for HDFC Account - Feb 2024',
  recordId: 'BNK-REC-202402',
  recordType: 'Bank Reconciliation',
  branch: 'south',
  batch: '2023-24',
  oldValue: null,
  newValue: {
    bankAccount: 'HDFC Bank - Current A/c',
    month: 'February 2024',
    bankBalance: 450000,
    bookBalance: 445000,
    difference: 5000
  },
  ipAddress: '192.168.1.110',
  userAgent: 'Firefox 123.0 / Windows 11',
  sessionId: 'SES-789460',
  status: 'Success'
},
{
  id: 'AUD-009',
  timestamp: '2024-03-19 15:12:45',
  userId: 'USR-003',
  userName: 'Amit Verma',
  userRole: 'Accounts Manager',
  module: 'Payment Voucher',
  action: 'Reject',
  description:
  'Rejected payment voucher PV-2024-0055 - Insufficient documentation',
  recordId: 'PV-2024-0055',
  recordType: 'Payment Voucher',
  branch: 'main',
  batch: '2024-25',
  oldValue: {
    status: 'Pending Approval',
    rejectedBy: null,
    rejectionReason: null
  },
  newValue: {
    status: 'Rejected',
    rejectedBy: 'Amit Verma',
    rejectionReason: 'Insufficient documentation'
  },
  ipAddress: '192.168.1.115',
  userAgent: 'Edge 122.0 / Windows 10',
  sessionId: 'SES-789461',
  status: 'Success'
},
{
  id: 'AUD-010',
  timestamp: '2024-03-19 14:25:18',
  userId: 'USR-001',
  userName: 'Rajesh Kumar',
  userRole: 'Administrator',
  module: 'User Management',
  action: 'Edit',
  description: 'Updated user permissions for Priya Sharma',
  recordId: 'USR-002',
  recordType: 'User Account',
  branch: 'east',
  batch: '2024-25',
  oldValue: {
    permissions: ['fee_collection', 'journal_entry'],
    status: 'Active'
  },
  newValue: {
    permissions: ['fee_collection', 'journal_entry', 'bank_reconciliation'],
    status: 'Active'
  },
  ipAddress: '192.168.1.105',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789462',
  status: 'Success'
},
{
  id: 'AUD-011',
  timestamp: '2024-03-19 11:45:30',
  userId: 'USR-002',
  userName: 'Priya Sharma',
  userRole: 'Accountant',
  module: 'Contra Entry',
  action: 'Create',
  description: 'Created contra entry CE-2024-0012',
  recordId: 'CE-2024-0012',
  recordType: 'Contra Voucher',
  branch: 'north',
  batch: '2023-24',
  oldValue: null,
  newValue: {
    fromAccount: 'Cash in Hand',
    toAccount: 'HDFC Bank',
    amount: 50000,
    narration: 'Cash deposited to bank'
  },
  ipAddress: '192.168.1.110',
  userAgent: 'Firefox 123.0 / Windows 11',
  sessionId: 'SES-789463',
  status: 'Success'
},
{
  id: 'AUD-012',
  timestamp: '2024-03-19 10:30:15',
  userId: 'USR-001',
  userName: 'Rajesh Kumar',
  userRole: 'Administrator',
  module: 'Reports',
  action: 'Print',
  description: 'Printed Balance Sheet as on 31-Mar-2024',
  recordId: 'RPT-BS-20240331',
  recordType: 'Report',
  branch: 'south',
  batch: '2024-25',
  oldValue: null,
  newValue: {
    reportType: 'Balance Sheet',
    asOnDate: '2024-03-31',
    copies: 2
  },
  ipAddress: '192.168.1.105',
  userAgent: 'Chrome 122.0 / Windows 10',
  sessionId: 'SES-789464',
  status: 'Success'
}];

const users = [
{
  value: 'all',
  label: 'All Users'
},
{
  value: 'USR-001',
  label: 'Rajesh Kumar'
},
{
  value: 'USR-002',
  label: 'Priya Sharma'
},
{
  value: 'USR-003',
  label: 'Amit Verma'
},
{
  value: 'USR-004',
  label: 'Suresh Patel'
}];

const modules = [
{
  value: 'all',
  label: 'All Modules'
},
{
  value: 'Fee Collection',
  label: 'Fee Collection'
},
{
  value: 'Journal Entry',
  label: 'Journal Entry'
},
{
  value: 'Payment Voucher',
  label: 'Payment Voucher'
},
{
  value: 'Receipt Voucher',
  label: 'Receipt Voucher'
},
{
  value: 'Contra Entry',
  label: 'Contra Entry'
},
{
  value: 'Ledger Master',
  label: 'Ledger Master'
},
{
  value: 'Bank Reconciliation',
  label: 'Bank Reconciliation'
},
{
  value: 'Reports',
  label: 'Reports'
},
{
  value: 'User Management',
  label: 'User Management'
},
{
  value: 'Fee Structure',
  label: 'Fee Structure'
}];

const actionTypes = [
{
  value: 'all',
  label: 'All Actions'
},
{
  value: 'Create',
  label: 'Create'
},
{
  value: 'Edit',
  label: 'Edit'
},
{
  value: 'Delete',
  label: 'Delete'
},
{
  value: 'View',
  label: 'View'
},
{
  value: 'Print',
  label: 'Print'
},
{
  value: 'Export',
  label: 'Export'
},
{
  value: 'Approve',
  label: 'Approve'
},
{
  value: 'Reject',
  label: 'Reject'
}];

const getActionIcon = (action: string) => {
  const icons: Record<string, React.ReactNode> = {
    Create: <Plus className="w-4 h-4" />,
    Edit: <Edit className="w-4 h-4" />,
    Delete: <Trash2 className="w-4 h-4" />,
    View: <Eye className="w-4 h-4" />,
    Print: <Printer className="w-4 h-4" />,
    Export: <Download className="w-4 h-4" />,
    Approve: <CheckCircle className="w-4 h-4" />,
    Reject: <XCircle className="w-4 h-4" />
  };
  return icons[action] || <Activity className="w-4 h-4" />;
};
const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    Create: 'bg-green-100 text-green-700 border-green-200',
    Edit: 'bg-blue-100 text-blue-700 border-blue-200',
    Delete: 'bg-red-100 text-red-700 border-red-200',
    View: 'bg-gray-100 text-gray-700 border-gray-200',
    Print: 'bg-purple-100 text-purple-700 border-purple-200',
    Export: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Approve: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Reject: 'bg-orange-100 text-orange-700 border-orange-200'
  };
  return colors[action] || 'bg-gray-100 text-gray-700 border-gray-200';
};
export function LedgerAuditTrail() {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'branchwise'>('all');
  const isAdmin = true;
  const currentUserRole = 'Administrator';
  const [filters, setFilters] = useState({
    searchTerm: '',
    fromDate: '2024-01-01',
    toDate: new Date().toISOString().split('T')[0],
    userId: 'all',
    module: 'all',
    actionType: 'all',
    status: 'all'
  });
  const toggleBranch = (branchId: string) => {
    if (branchId === 'all') setSelectedBranches(['all']);else

    setSelectedBranches((prev) => {
      const filtered = prev.filter((b) => b !== 'all');
      return filtered.includes(branchId) ?
      filtered.filter((b) => b !== branchId) :
      [...filtered, branchId];
    });
  };
  const getActiveBranches = () =>
  selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;
  const filteredData = useMemo(() => {
    const activeBranches = getActiveBranches();
    return auditLogData.filter((entry) => {
      const matchesSearch =
      filters.searchTerm === '' ||
      entry.description.
      toLowerCase().
      includes(filters.searchTerm.toLowerCase()) ||
      entry.userName.
      toLowerCase().
      includes(filters.searchTerm.toLowerCase()) ||
      entry.recordId.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesUser =
      filters.userId === 'all' || entry.userId === filters.userId;
      const matchesModule =
      filters.module === 'all' || entry.module === filters.module;
      const matchesAction =
      filters.actionType === 'all' || entry.action === filters.actionType;
      const matchesStatus =
      filters.status === 'all' || entry.status === filters.status;
      const matchesBranch = activeBranches.includes(entry.branch);
      const matchesBatch =
      selectedBatch === 'all' || entry.batch === selectedBatch;
      const entryDate = new Date(entry.timestamp.split(' ')[0]);
      const matchesDate =
      entryDate >= new Date(filters.fromDate) &&
      entryDate <= new Date(filters.toDate);
      return (
        matchesSearch &&
        matchesUser &&
        matchesModule &&
        matchesAction &&
        matchesStatus &&
        matchesDate &&
        matchesBranch &&
        matchesBatch);

    });
  }, [filters, selectedBranches, selectedBatch]);
  const branchGroupedData = useMemo(() => {
    const grouped: Record<string, AuditLogEntry[]> = {};
    getActiveBranches().forEach((b) => {
      grouped[b] = [];
    });
    filteredData.forEach((entry) => {
      if (grouped[entry.branch]) grouped[entry.branch].push(entry);
    });
    return grouped;
  }, [filteredData, selectedBranches]);
  const stats = useMemo(() => {
    const branchStats: Record<
      string,
      {
        total: number;
        creates: number;
        edits: number;
        deletes: number;
        failed: number;
      }> =
    {};
    getActiveBranches().forEach((b) => {
      branchStats[b] = {
        total: 0,
        creates: 0,
        edits: 0,
        deletes: 0,
        failed: 0
      };
    });
    filteredData.forEach((e) => {
      if (branchStats[e.branch]) {
        branchStats[e.branch].total++;
        if (e.action === 'Create') branchStats[e.branch].creates++;
        if (e.action === 'Edit') branchStats[e.branch].edits++;
        if (e.action === 'Delete') branchStats[e.branch].deletes++;
        if (e.status === 'Failed') branchStats[e.branch].failed++;
      }
    });
    return {
      totalLogs: filteredData.length,
      creates: filteredData.filter((e) => e.action === 'Create').length,
      edits: filteredData.filter((e) => e.action === 'Edit').length,
      deletes: filteredData.filter((e) => e.action === 'Delete').length,
      failed: filteredData.filter((e) => e.status === 'Failed').length,
      branchStats
    };
  }, [filteredData, selectedBranches]);
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      fromDate: '2024-01-01',
      toDate: new Date().toISOString().split('T')[0],
      userId: 'all',
      module: 'all',
      actionType: 'all',
      status: 'all'
    });
    setSelectedBranches(['all']);
    setSelectedBatch('all');
    setCurrentPage(1);
  };
  const formatValue = (value: Record<string, any> | null) =>
  value ?
  Object.entries(value).
  map(([k, v]) => `${k}: ${v}`).
  join(', ') :
  '-';
  if (!isAdmin) {
    return (
      <div className="p-6 min-h-full flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You do not have permission to access the Audit Trail.
          </p>
          <Badge variant="danger">Admin Access Required</Badge>
        </Card>
      </div>);

  }
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete log of all financial system activities and changes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Log
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Security Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 flex items-center gap-2">
              Audit Log Security<Badge variant="warning">Admin Only</Badge>
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              Audit logs are <strong>immutable and cannot be deleted</strong>.
              Currently logged in as: <strong>{currentUserRole}</strong>
            </p>
          </div>
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
        </div>
      </Card>

      {/* Branch & Batch Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building className="w-4 h-4 inline mr-1" />
              Branch (Multi-Select)
            </label>
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="w-56 px-3 py-2 border rounded-lg bg-white text-left flex items-center justify-between">

              <span className="truncate">
                {selectedBranches.includes('all') ?
                'All Branches' :
                `${selectedBranches.length} branch(es)`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBranchDropdown &&
            <div className="absolute z-10 w-56 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                {branches.map((branch) =>
              <label
                key={branch.id}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">

                    <input
                  type="checkbox"
                  checked={
                  selectedBranches.includes(branch.id) ||
                  branch.id !== 'all' &&
                  selectedBranches.includes('all')
                  }
                  onChange={() => toggleBranch(branch.id)}
                  className="w-4 h-4 mr-2 rounded" />

                    <span>{branch.name}</span>
                  </label>
              )}
              </div>
            }
            {selectedBranches.length > 0 &&
            !selectedBranches.includes('all') &&
            <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBranches.map((id) =>
              <span
                key={id}
                className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">

                      {branches.find((b) => b.id === id)?.name}
                      <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => toggleBranch(id)} />

                    </span>
              )}
                </div>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Batch
            </label>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              options={batches}
              className="w-36" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Eye className="w-4 h-4 inline mr-1" />
              View Mode
            </label>
            <Select
              value={viewMode}
              onChange={(e) =>
              setViewMode(e.target.value as 'all' | 'branchwise')
              }
              options={[
              {
                value: 'all',
                label: 'All Records'
              },
              {
                value: 'branchwise',
                label: 'Branch-wise'
              }]
              }
              className="w-36" />

          </div>

          <Button variant="primary">
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Branch-wise Summary Cards */}
      {viewMode === 'branchwise' &&
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {getActiveBranches().map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          const bs = stats.branchStats[branchId];
          return (
            <Card
              key={branchId}
              className="p-3 bg-gradient-to-br from-gray-50 to-gray-100">

                <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {branch?.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium">{bs?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Creates:</span>
                    <span className="font-medium text-green-700">
                      {bs?.creates || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Edits:</span>
                    <span className="font-medium text-blue-700">
                      {bs?.edits || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Failed:</span>
                    <span className="font-medium text-red-700">
                      {bs?.failed || 0}
                    </span>
                  </div>
                </div>
              </Card>);

        })}
        </div>
      }

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
        {
          title: 'Total Logs',
          value: stats.totalLogs,
          icon: Database,
          color: 'blue'
        },
        {
          title: 'Creates',
          value: stats.creates,
          icon: Plus,
          color: 'green'
        },
        {
          title: 'Edits',
          value: stats.edits,
          icon: Edit,
          color: 'yellow'
        },
        {
          title: 'Deletes',
          value: stats.deletes,
          icon: Trash2,
          color: 'red'
        },
        {
          title: 'Failed',
          value: stats.failed,
          icon: AlertTriangle,
          color: 'orange'
        }].
        map((item) =>
        <Card
          key={item.title}
          className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}>

            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-${item.color}-700`}>{item.title}</p>
                <p className={`text-2xl font-bold text-${item.color}-900`}>
                  {item.value}
                </p>
              </div>
              <item.icon className={`w-8 h-8 text-${item.color}-500`} />
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card className="p-0 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Search & Filters</h3>
            <Badge variant="default">{filteredData.length} records</Badge>
          </div>
          <Button variant="ghost" size="sm">
            {isFilterExpanded ?
            <ChevronUp className="w-4 h-4" /> :

            <ChevronDown className="w-4 h-4" />
            }
          </Button>
        </div>
        {isFilterExpanded &&
        <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <Input
              placeholder="Search by description, user, or record ID..."
              value={filters.searchTerm}
              onChange={(e) =>
              handleFilterChange('searchTerm', e.target.value)
              }
              className="flex-1" />

              <Button variant="primary">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
              type="date"
              label="From Date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)} />

              <Input
              type="date"
              label="To Date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)} />

              <Select
              label="User"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              options={users} />

              <Select
              label="Module"
              value={filters.module}
              onChange={(e) => handleFilterChange('module', e.target.value)}
              options={modules} />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
              label="Action Type"
              value={filters.actionType}
              onChange={(e) =>
              handleFilterChange('actionType', e.target.value)
              }
              options={actionTypes} />

              <Select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'Success',
                label: 'Success'
              },
              {
                value: 'Failed',
                label: 'Failed'
              }]
              } />

              <div className="md:col-span-2 flex items-end justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Audit Log Table */}
      {viewMode === 'all' ?
      <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Branch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((entry) =>
              <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">
                            {entry.timestamp.split(' ')[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.timestamp.split(' ')[1]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-700">

                        {branches.find((b) => b.id === entry.branch)?.name}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {entry.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.userRole}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                    variant="default"
                    className="bg-gray-100 text-gray-700">

                        {entry.module}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(entry.action)}`}>

                        {getActionIcon(entry.action)}
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 max-w-xs truncate">
                        {entry.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {entry.recordId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {entry.status === 'Success' ?
                  <Badge
                    variant="success"
                    className="flex items-center gap-1 w-fit">

                          <CheckCircle className="w-3 h-3" />
                          Success
                        </Badge> :

                  <Badge
                    variant="danger"
                    className="flex items-center gap-1 w-fit">

                          <XCircle className="w-3 h-3" />
                          Failed
                        </Badge>
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEntry(entry)}>

                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <Select
              value={pageSize.toString()}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              options={[
              {
                value: '10',
                label: '10'
              },
              {
                value: '20',
                label: '20'
              },
              {
                value: '50',
                label: '50'
              }]
              }
              className="w-20" />

              <span>of {filteredData.length} records</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}>

                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}>

                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card> :

      <div className="space-y-4">
          {getActiveBranches().map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          const branchData = branchGroupedData[branchId] || [];
          return (
            <Card key={branchId} className="p-0 overflow-hidden">
                <div className="bg-blue-50 p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {branch?.name}
                  </h3>
                  <Badge variant="default">{branchData.length} records</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Date & Time
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          User
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Module
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Action
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {branchData.slice(0, 5).map((entry) =>
                    <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">
                            {entry.timestamp}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {entry.userName}
                          </td>
                          <td className="px-4 py-2">
                            <Badge variant="default" className="text-xs">
                              {entry.module}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">
                            <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getActionColor(entry.action)}`}>

                              {getActionIcon(entry.action)}
                              {entry.action}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm max-w-xs truncate">
                            {entry.description}
                          </td>
                          <td className="px-4 py-2">
                            {entry.status === 'Success' ?
                        <Badge variant="success" className="text-xs">
                                Success
                              </Badge> :

                        <Badge variant="danger" className="text-xs">
                                Failed
                              </Badge>
                        }
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}>

                              <Eye className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
                {branchData.length > 5 &&
              <div className="p-2 text-center text-sm text-blue-600 cursor-pointer hover:underline">
                    View all {branchData.length} records for {branch?.name}
                  </div>
              }
              </Card>);

        })}
        </div>
      }

      {/* Detail Modal */}
      {selectedEntry &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Audit Log Details
              </h3>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEntry(null)}>

                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Log ID</p>
                  <p className="font-mono text-sm">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Timestamp
                  </p>
                  <p className="text-sm">{selectedEntry.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Branch</p>
                  <Badge
                  variant="default"
                  className="bg-blue-100 text-blue-700">

                    {branches.find((b) => b.id === selectedEntry.branch)?.name}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Batch</p>
                  <p className="text-sm">{selectedEntry.batch}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">User</p>
                  <p className="text-sm font-medium">
                    {selectedEntry.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedEntry.userRole}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Module</p>
                  <p className="text-sm">{selectedEntry.module}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Action</p>
                  <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(selectedEntry.action)}`}>

                    {getActionIcon(selectedEntry.action)}
                    {selectedEntry.action}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                  {selectedEntry.status === 'Success' ?
                <Badge variant="success">Success</Badge> :

                <Badge variant="danger">Failed</Badge>
                }
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Description
                </p>
                <p className="text-sm bg-gray-50 p-3 rounded border">
                  {selectedEntry.description}
                </p>
              </div>
              {selectedEntry.oldValue &&
            <div>
                  <p className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>Old
                    Value
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedEntry.oldValue, null, 2)}
                    </pre>
                  </div>
                </div>
            }
              {selectedEntry.newValue &&
            <div>
                  <p className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    New Value
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedEntry.newValue, null, 2)}
                    </pre>
                  </div>
                </div>
            }
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-xs text-gray-500 uppercase mb-3 flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  Technical Details
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="font-mono">{selectedEntry.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Session ID</p>
                    <p className="font-mono">{selectedEntry.sessionId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">User Agent</p>
                    <p className="font-mono text-xs">
                      {selectedEntry.userAgent}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                <Lock className="w-4 h-4" />
                <span>
                  This audit log entry is immutable and cannot be modified or
                  deleted.
                </span>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Footer */}
      <Card className="p-4 bg-gray-50">
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-600">
          <span>
            <Building className="w-4 h-4 inline mr-1" />
            <b>Branches:</b>{' '}
            {selectedBranches.includes('all') ?
            'All' :
            selectedBranches.
            map((id) => branches.find((b) => b.id === id)?.name).
            join(', ')}
          </span>
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            <b>Batch:</b> {selectedBatch === 'all' ? 'All' : selectedBatch}
          </span>
          <span>
            <Calendar className="w-4 h-4 inline mr-1" />
            <b>Period:</b> {filters.fromDate} to {filters.toDate}
          </span>
          <span>
            <Clock className="w-4 h-4 inline mr-1" />
            <b>Last Refreshed:</b> {new Date().toLocaleString('en-IN')}
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-4 h-4 text-amber-600" />
            Audit logs are protected
          </span>
        </div>
      </Card>
    </div>);

}