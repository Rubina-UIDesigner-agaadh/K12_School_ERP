import React, { useCallback, useMemo, useState } from 'react';
// File: src/pages/finance/reports/BankReconciliation.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  CheckCircle,
  Download,
  Save,
  Plus,
  X,
  Check,
  FileText,
  Printer,
  AlertCircle,
  Upload,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Calendar,
  Building,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Clock,
  Ban,
  AlertTriangle,
  DollarSign,
  Link,
  FileSpreadsheet,
  History,
  Settings,
  Layers,
  List,
  Grid } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface BankEntry {
  id: number;
  date: string;
  particulars: string;
  referenceNo: string;
  chequeNo: string;
  debit: number;
  credit: number;
  bankDate: string;
  branch: string;
  batch: string;
  status: 'pending' | 'reconciled' | 'unpresented' | 'mismatch' | 'disputed';
  entryType: 'cheque' | 'transfer' | 'deposit' | 'charge' | 'interest' | 'other';
  remarks: string;
  matchedWith?: number;
  createdBy: string;
  createdAt: string;
}
interface BankAccount {
  id: string;
  name: string;
  accountNo: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  currentBalance: number;
  reconcileBalance: number;
}
const BRANCHES = [
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

const BATCHES = [
{
  value: 'all',
  label: 'All Batches'
},
{
  value: '2024-25',
  label: 'Batch 2024-25'
},
{
  value: '2023-24',
  label: 'Batch 2023-24'
},
{
  value: '2022-23',
  label: 'Batch 2022-23'
}];

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bgColor: string;
    icon: React.ReactNode;
  }> =
{
  pending: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: <Clock className="w-3 h-3" />
  },
  reconciled: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: <CheckCircle className="w-3 h-3" />
  },
  unpresented: {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: <Ban className="w-3 h-3" />
  },
  mismatch: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: <AlertTriangle className="w-3 h-3" />
  },
  disputed: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: <AlertCircle className="w-3 h-3" />
  }
};
const ENTRY_ICONS: Record<string, React.ReactNode> = {
  cheque: <FileText className="w-4 h-4 text-blue-500" />,
  transfer: <ArrowUpRight className="w-4 h-4 text-green-500" />,
  deposit: <ArrowDownRight className="w-4 h-4 text-green-500" />,
  charge: <CreditCard className="w-4 h-4 text-red-500" />,
  interest: <DollarSign className="w-4 h-4 text-green-500" />,
  other: <Layers className="w-4 h-4 text-gray-500" />
};
const generateEntries = (): BankEntry[] => {
  const branches = ['main', 'north', 'south', 'east'];
  const batches = ['2024-25', '2023-24', '2022-23'];
  const statuses: BankEntry['status'][] = [
  'pending',
  'reconciled',
  'unpresented',
  'mismatch',
  'disputed'];

  const types: BankEntry['entryType'][] = [
  'cheque',
  'transfer',
  'deposit',
  'charge',
  'interest',
  'other'];

  const particulars = [
  'Cheque Issued - ABC Corp',
  'Payment Received - XYZ Ltd',
  'Bank Charges',
  'Interest Credited',
  'Direct Deposit',
  'RTGS Transfer',
  'Salary Payment',
  'Cash Deposit'];

  return Array.from(
    {
      length: 40
    },
    (_, i) => ({
      id: i + 1,
      date: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      referenceNo: `REF-${String(i + 1).padStart(3, '0')}`,
      chequeNo:
      Math.random() > 0.5 ?
      `CHQ-${Math.floor(Math.random() * 900000) + 100000}` :
      '',
      debit: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) + 1000 : 0,
      credit:
      Math.random() > 0.5 ? Math.floor(Math.random() * 50000) + 1000 : 0,
      bankDate:
      Math.random() > 0.3 ?
      `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` :
      '',
      branch: branches[Math.floor(Math.random() * branches.length)],
      batch: batches[Math.floor(Math.random() * batches.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      entryType: types[Math.floor(Math.random() * types.length)],
      remarks: '',
      createdBy: ['Admin', 'Accountant', 'System'][
      Math.floor(Math.random() * 3)],

      createdAt: new Date().toLocaleString()
    })
  );
};
export function BankReconciliation() {
  const [entries, setEntries] = useState<BankEntry[]>(generateEntries);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bankStatementBalance, setBankStatementBalance] = useState('495000');
  const [filters, setFilters] = useState({
    bankAccount: 'hdfc',
    fromDate: '2024-03-01',
    toDate: '2024-03-31',
    status: 'all',
    entryType: 'all',
    searchTerm: '',
    referenceNo: '',
    chequeNo: '',
    minAmount: '',
    maxAmount: '',
    transactionType: 'all'
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [modals, setModals] = useState({
    add: false,
    import: false,
    view: false,
    edit: false,
    delete: false,
    match: false,
    history: false,
    settings: false
  });
  const [selectedEntry, setSelectedEntry] = useState<BankEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    date: '',
    particulars: '',
    referenceNo: '',
    chequeNo: '',
    debit: '',
    credit: '',
    bankDate: '',
    entryType: 'other',
    remarks: ''
  });
  const bankAccounts: BankAccount[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank - Current',
    accountNo: '1001234567890',
    bankName: 'HDFC Bank',
    branch: 'MG Road Branch',
    ifscCode: 'HDFC0001234',
    currentBalance: 500000,
    reconcileBalance: 487500
  },
  {
    id: 'sbi',
    name: 'SBI Bank - Savings',
    accountNo: '2002345678901',
    bankName: 'State Bank of India',
    branch: 'Main Branch',
    ifscCode: 'SBIN0002345',
    currentBalance: 250000,
    reconcileBalance: 248500
  },
  {
    id: 'icici',
    name: 'ICICI Bank - Current',
    accountNo: '3003456789012',
    bankName: 'ICICI Bank',
    branch: 'City Branch',
    ifscCode: 'ICIC0003456',
    currentBalance: 350000,
    reconcileBalance: 345000
  }];

  const getActiveBranches = () =>
  selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;
  const getBranchName = (id: string) =>
  BRANCHES.find((b) => b.id === id)?.name || id;
  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
  const formatDate = (dateStr: string) =>
  dateStr ?
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) :
  '-';
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const branchMatch =
      selectedBranches.includes('all') ||
      selectedBranches.includes(entry.branch);
      const batchMatch =
      selectedBatch === 'all' || entry.batch === selectedBatch;
      if (!branchMatch || !batchMatch) return false;
      if (
      appliedFilters.status !== 'all' &&
      entry.status !== appliedFilters.status)

      return false;
      if (
      appliedFilters.entryType !== 'all' &&
      entry.entryType !== appliedFilters.entryType)

      return false;
      if (
      appliedFilters.searchTerm &&
      !entry.particulars.
      toLowerCase().
      includes(appliedFilters.searchTerm.toLowerCase()) &&
      !entry.referenceNo.
      toLowerCase().
      includes(appliedFilters.searchTerm.toLowerCase()))

      return false;
      if (
      appliedFilters.referenceNo &&
      !entry.referenceNo.
      toLowerCase().
      includes(appliedFilters.referenceNo.toLowerCase()))

      return false;
      if (
      appliedFilters.chequeNo &&
      !entry.chequeNo.
      toLowerCase().
      includes(appliedFilters.chequeNo.toLowerCase()))

      return false;
      if (appliedFilters.fromDate && entry.date < appliedFilters.fromDate)
      return false;
      if (appliedFilters.toDate && entry.date > appliedFilters.toDate)
      return false;
      if (
      appliedFilters.minAmount &&
      (entry.debit || entry.credit) < parseFloat(appliedFilters.minAmount))

      return false;
      if (
      appliedFilters.maxAmount &&
      (entry.debit || entry.credit) > parseFloat(appliedFilters.maxAmount))

      return false;
      if (appliedFilters.transactionType === 'debit' && !entry.debit)
      return false;
      if (appliedFilters.transactionType === 'credit' && !entry.credit)
      return false;
      return true;
    });
  }, [entries, appliedFilters, selectedBranches, selectedBatch]);
  const summary = useMemo(() => {
    const selectedAccount = bankAccounts.find(
      (a) => a.id === appliedFilters.bankAccount
    );
    const erpBalance = selectedAccount?.currentBalance || 0;
    const bankBalance = parseFloat(bankStatementBalance) || 0;
    const calc = (
    filter: (e: BankEntry) => boolean,
    field: 'debit' | 'credit') =>
    filteredEntries.filter(filter).reduce((sum, e) => sum + e[field], 0);
    return {
      erpBalance,
      bankStatementBalance: bankBalance,
      reconciledBalance: selectedAccount?.reconcileBalance || 0,
      difference: erpBalance - bankBalance,
      unpresentedCheques: calc(
        (e) => e.status === 'unpresented' && e.debit > 0,
        'debit'
      ),
      depositsInTransit: calc(
        (e) => e.status === 'pending' && e.credit > 0,
        'credit'
      ),
      bankChargesNotRecorded: calc(
        (e) => e.entryType === 'charge' && e.status === 'pending',
        'debit'
      ),
      interestNotRecorded: calc(
        (e) => e.entryType === 'interest' && e.status === 'pending',
        'credit'
      ),
      pendingCount: filteredEntries.filter((e) => e.status === 'pending').
      length,
      reconciledCount: filteredEntries.filter((e) => e.status === 'reconciled').
      length,
      unpresentedCount: filteredEntries.filter(
        (e) => e.status === 'unpresented'
      ).length,
      mismatchCount: filteredEntries.filter((e) => e.status === 'mismatch').
      length,
      disputedCount: filteredEntries.filter((e) => e.status === 'disputed').
      length
    };
  }, [
  filteredEntries,
  bankAccounts,
  appliedFilters.bankAccount,
  bankStatementBalance]
  );
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') setSelectedBranches(['all']);else
    {
      const newSelection = selectedBranches.includes('all') ?
      [branchId] :
      selectedBranches.includes(branchId) ?
      selectedBranches.filter((b) => b !== branchId) :
      [...selectedBranches, branchId];
      setSelectedBranches(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };
  const handleFilterChange = (key: string, value: string) =>
  setFilters((prev) => ({
    ...prev,
    [key]: value
  }));
  const handleApplyFilters = () => setAppliedFilters(filters);
  const handleResetFilters = () => {
    const reset = {
      ...filters,
      status: 'all',
      entryType: 'all',
      searchTerm: '',
      referenceNo: '',
      chequeNo: '',
      minAmount: '',
      maxAmount: '',
      transactionType: 'all'
    };
    setFilters(reset);
    setAppliedFilters(reset);
  };
  const handleToggleEntry = (id: number) =>
  setSelectedEntries((prev) =>
  prev.includes(id) ?
  prev.filter((entryId) => entryId !== id) :
  [...prev, id]
  );
  const handleSelectAll = (checked: boolean) =>
  setSelectedEntries(checked ? filteredEntries.map((item) => item.id) : []);
  const updateEntryStatus = useCallback(
    (id: number, status: BankEntry['status'], bankDate?: string) => {
      setEntries((prev) =>
      prev.map((entry) =>
      entry.id === id ?
      {
        ...entry,
        status,
        bankDate: bankDate || entry.bankDate
      } :
      entry
      )
      );
    },
    []
  );
  const handleBulkAction = (status: BankEntry['status']) => {
    setEntries((prev) =>
    prev.map((entry) =>
    selectedEntries.includes(entry.id) ?
    {
      ...entry,
      status,
      bankDate:
      status === 'reconciled' ?
      new Date().toISOString().split('T')[0] :
      entry.bankDate
    } :
    entry
    )
    );
    setSelectedEntries([]);
  };
  const handleAddEntry = () => {
    const newId = Math.max(...entries.map((e) => e.id)) + 1;
    setEntries((prev) => [
    ...prev,
    {
      id: newId,
      date: newEntry.date,
      particulars: newEntry.particulars,
      referenceNo:
      newEntry.referenceNo || `REF-${String(newId).padStart(3, '0')}`,
      chequeNo: newEntry.chequeNo,
      debit: parseFloat(newEntry.debit) || 0,
      credit: parseFloat(newEntry.credit) || 0,
      bankDate: newEntry.bankDate,
      branch: getActiveBranches()[0],
      batch: selectedBatch === 'all' ? '2024-25' : selectedBatch,
      status: 'pending',
      entryType: newEntry.entryType as BankEntry['entryType'],
      remarks: newEntry.remarks,
      createdBy: 'User',
      createdAt: new Date().toLocaleString()
    }]
    );
    setModals({
      ...modals,
      add: false
    });
    setNewEntry({
      date: '',
      particulars: '',
      referenceNo: '',
      chequeNo: '',
      debit: '',
      credit: '',
      bankDate: '',
      entryType: 'other',
      remarks: ''
    });
  };
  const handleDeleteEntry = () => {
    if (selectedEntry) {
      setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
      setModals({
        ...modals,
        delete: false
      });
      setSelectedEntry(null);
    }
  };
  const handleSaveEdit = () => {
    if (selectedEntry) {
      setEntries((prev) =>
      prev.map((e) => e.id === selectedEntry.id ? selectedEntry : e)
      );
      setModals({
        ...modals,
        edit: false
      });
      setSelectedEntry(null);
    }
  };
  const getBranchEntries = (branch: string) =>
  filteredEntries.filter((e) => e.branch === branch);
  const getBranchSummary = (branch: string) => {
    const branchEntries = getBranchEntries(branch);
    return {
      total: branchEntries.length,
      reconciled: branchEntries.filter((e) => e.status === 'reconciled').length,
      pending: branchEntries.filter((e) => e.status === 'pending').length,
      totalDebit: branchEntries.reduce((sum, e) => sum + e.debit, 0),
      totalCredit: branchEntries.reduce((sum, e) => sum + e.credit, 0)
    };
  };
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="w-4 h-4 rounded cursor-pointer"
      checked={
      selectedEntries.length === filteredEntries.length &&
      filteredEntries.length > 0
      }
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: BankEntry) =>
    <input
      type="checkbox"
      className="w-4 h-4 rounded cursor-pointer"
      checked={selectedEntries.includes(row.id)}
      onChange={() => handleToggleEntry(row.id)} />


  },
  {
    key: 'date',
    header: 'Date',
    render: (row: BankEntry) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.date)}</span>
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: BankEntry) =>
    <div className="flex items-center gap-2">
          {ENTRY_ICONS[row.entryType]}
          <span className="text-xs text-gray-500 capitalize">
            {row.entryType}
          </span>
        </div>

  },
  {
    key: 'particulars',
    header: 'Particulars',
    render: (row: BankEntry) =>
    <div className="max-w-xs">
          <p className="font-medium text-gray-900">{row.particulars}</p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>Ref: {row.referenceNo}</span>
            {row.chequeNo && <span>• Chq: {row.chequeNo}</span>}
          </div>
        </div>

  },
  {
    key: 'debit',
    header: 'Debit (₹)',
    render: (row: BankEntry) =>
    <div className="text-right">
          {row.debit > 0 ?
      <span className="font-medium text-red-600">
              {formatCurrency(row.debit)}
            </span> :

      <span className="text-gray-400">-</span>
      }
        </div>

  },
  {
    key: 'credit',
    header: 'Credit (₹)',
    render: (row: BankEntry) =>
    <div className="text-right">
          {row.credit > 0 ?
      <span className="font-medium text-green-600">
              {formatCurrency(row.credit)}
            </span> :

      <span className="text-gray-400">-</span>
      }
        </div>

  },
  {
    key: 'bankDate',
    header: 'Bank Date',
    render: (row: BankEntry) =>
    <Input
      type="date"
      className="h-8 text-xs w-32"
      value={row.bankDate}
      onChange={(e) =>
      setEntries((prev) =>
      prev.map((entry) =>
      entry.id === row.id ?
      {
        ...entry,
        bankDate: e.target.value
      } :
      entry
      )
      )
      } />


  },
  {
    key: 'status',
    header: 'Status',
    render: (row: BankEntry) => {
      const config = STATUS_CONFIG[row.status];
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>

            {config.icon}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: BankEntry) =>
    <div className="flex gap-1">
          {[
      {
        icon: Eye,
        onClick: () => {
          setSelectedEntry(row);
          setModals({
            ...modals,
            view: true
          });
        },
        title: 'View'
      },
      {
        icon: Edit,
        onClick: () => {
          setSelectedEntry(row);
          setModals({
            ...modals,
            edit: true
          });
        },
        title: 'Edit'
      },
      ...(row.status !== 'reconciled' ?
      [
      {
        icon: Check,
        onClick: () =>
        updateEntryStatus(
          row.id,
          'reconciled',
          new Date().toISOString().split('T')[0]
        ),
        title: 'Reconcile',
        className: 'text-green-600'
      }] :

      []),
      ...(row.status !== 'unpresented' ?
      [
      {
        icon: Ban,
        onClick: () => updateEntryStatus(row.id, 'unpresented'),
        title: 'Unpresented',
        className: 'text-red-600'
      }] :

      []),
      ...(row.status !== 'pending' ?
      [
      {
        icon: Clock,
        onClick: () => updateEntryStatus(row.id, 'pending'),
        title: 'Pending',
        className: 'text-orange-600'
      }] :

      []),
      {
        icon: Trash2,
        onClick: () => {
          setSelectedEntry(row);
          setModals({
            ...modals,
            delete: true
          });
        },
        title: 'Delete',
        className: 'text-red-600'
      }].
      map(({ icon: Icon, onClick, title, className }) =>
      <Button
        key={title}
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${className || ''}`}
        title={title}
        onClick={onClick}>

              <Icon className="w-3 h-3" />
            </Button>
      )}
        </div>

  }];

  const Modal = ({
    show,
    onClose,
    title,
    children,
    size = 'md'






  }: {show: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: string;}) =>
  show ?
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card
      className={`p-6 w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </Card>
      </div> :
  null;
  const SummaryCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass
  }: any) =>
  <Card className={`p-4 ${colorClass.bg} ${colorClass.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colorClass.text}`}>{title}</p>
          <p className={`text-2xl font-bold ${colorClass.value}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          <p className={`text-xs ${colorClass.subtitle} mt-1`}>{subtitle}</p>
        </div>
        <div
        className={`w-10 h-10 ${colorClass.iconBg} rounded-full flex items-center justify-center`}>

          <Icon className={`w-5 h-5 ${colorClass.icon}`} />
        </div>
      </div>
    </Card>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bank Reconciliation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Reconcile bank statement with system ledger entries
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
          {
            icon: History,
            text: 'History',
            onClick: () =>
            setModals({
              ...modals,
              history: true
            })
          },
          {
            icon: Settings,
            text: 'Settings',
            onClick: () =>
            setModals({
              ...modals,
              settings: true
            })
          },
          {
            icon: Printer,
            text: 'Print',
            onClick: () => window.print()
          },
          {
            icon: FileSpreadsheet,
            text: 'Excel',
            onClick: () => alert('Exported to Excel!')
          },
          {
            icon: Download,
            text: 'PDF',
            onClick: () => alert('Exported to PDF!')
          }].
          map(({ icon: Icon, text, onClick }) =>
          <Button key={text} variant="outline" onClick={onClick}>
              <Icon className="w-4 h-4 mr-2" />
              {text}
            </Button>
          )}
          <Button variant="primary" onClick={() => alert('Saved!')}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Branch & Batch Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Bank Account"
              value={filters.bankAccount}
              onChange={(value) => handleFilterChange('bankAccount', value)}
              options={bankAccounts.map((acc) => ({
                value: acc.id,
                label: `${acc.name} - ${acc.accountNo}`
              }))} />

            <Select
              label="Batch"
              value={selectedBatch}
              onChange={setSelectedBatch}
              options={BATCHES} />

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  label="Bank Statement Balance (₹)"
                  value={bankStatementBalance}
                  onChange={(e) => setBankStatementBalance(e.target.value)} />

              </div>
              <Button
                variant="outline"
                onClick={() =>
                setModals({
                  ...modals,
                  import: true
                })
                }>

                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Building className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Branches:</span>
            {BRANCHES.map((branch) =>
            <button
              key={branch.id}
              onClick={() => handleBranchToggle(branch.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>

                {branch.name}
                {selectedBranches.includes(branch.id) &&
              branch.id !== 'all' &&
              <X
                className="w-3 h-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBranchToggle(branch.id);
                }} />

              }
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="ERP Ledger Balance"
          value={summary.erpBalance}
          subtitle="As per books"
          icon={Building}
          colorClass={{
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            value: 'text-blue-900',
            subtitle: 'text-blue-600',
            iconBg: 'bg-blue-200',
            icon: 'text-blue-700'
          }} />

        <SummaryCard
          title="Bank Statement Balance"
          value={summary.bankStatementBalance}
          subtitle="As per bank"
          icon={CreditCard}
          colorClass={{
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            value: 'text-purple-900',
            subtitle: 'text-purple-600',
            iconBg: 'bg-purple-200',
            icon: 'text-purple-700'
          }} />

        <SummaryCard
          title="Reconciled Balance"
          value={summary.reconciledBalance}
          subtitle={`${summary.reconciledCount} entries matched`}
          icon={CheckCircle}
          colorClass={{
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            value: 'text-green-900',
            subtitle: 'text-green-600',
            iconBg: 'bg-green-200',
            icon: 'text-green-700'
          }} />

        <SummaryCard
          title="Difference"
          value={Math.abs(summary.difference)}
          subtitle={`${summary.pendingCount} pending entries`}
          icon={AlertCircle}
          colorClass={{
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-700',
            value: 'text-orange-900',
            subtitle: 'text-orange-600',
            iconBg: 'bg-orange-200',
            icon: 'text-orange-700'
          }} />

        <SummaryCard
          title="Issues"
          value={summary.mismatchCount + summary.disputedCount}
          subtitle={`${summary.mismatchCount} mismatch, ${summary.disputedCount} disputed`}
          icon={AlertTriangle}
          colorClass={{
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            value: 'text-red-900',
            subtitle: 'text-red-600',
            iconBg: 'bg-red-200',
            icon: 'text-red-700'
          }} />

      </div>

      {/* Filters */}
      <Card className="p-0 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Search & Filters</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
              label="Search"
              placeholder="Search particulars, reference..."
              value={filters.searchTerm}
              onChange={(e) =>
              handleFilterChange('searchTerm', e.target.value)
              }
              icon={<Search className="w-4 h-4 text-gray-400" />} />

              <Input
              label="Reference No"
              placeholder="Search reference..."
              value={filters.referenceNo}
              onChange={(e) =>
              handleFilterChange('referenceNo', e.target.value)
              } />

              <Input
              label="Cheque No"
              placeholder="Search cheque..."
              value={filters.chequeNo}
              onChange={(e) => handleFilterChange('chequeNo', e.target.value)} />

              <Select
              label="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'pending',
                label: 'Pending'
              },
              {
                value: 'reconciled',
                label: 'Reconciled'
              },
              {
                value: 'unpresented',
                label: 'Unpresented'
              },
              {
                value: 'mismatch',
                label: 'Mismatch'
              },
              {
                value: 'disputed',
                label: 'Disputed'
              }]
              } />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              label="Entry Type"
              value={filters.entryType}
              onChange={(value) => handleFilterChange('entryType', value)}
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'cheque',
                label: 'Cheque'
              },
              {
                value: 'transfer',
                label: 'Transfer'
              },
              {
                value: 'deposit',
                label: 'Deposit'
              },
              {
                value: 'charge',
                label: 'Bank Charge'
              },
              {
                value: 'interest',
                label: 'Interest'
              },
              {
                value: 'other',
                label: 'Other'
              }]
              } />

              <Select
              label="Transaction Type"
              value={filters.transactionType}
              onChange={(value) =>
              handleFilterChange('transactionType', value)
              }
              options={[
              {
                value: 'all',
                label: 'All'
              },
              {
                value: 'debit',
                label: 'Debit Only'
              },
              {
                value: 'credit',
                label: 'Credit Only'
              }]
              } />

              <div className="grid grid-cols-2 gap-2">
                <Input
                type="number"
                label="Min Amount"
                placeholder="₹0"
                value={filters.minAmount}
                onChange={(e) =>
                handleFilterChange('minAmount', e.target.value)
                } />

                <Input
                type="number"
                label="Max Amount"
                placeholder="₹∞"
                value={filters.maxAmount}
                onChange={(e) =>
                handleFilterChange('maxAmount', e.target.value)
                } />

              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {filteredEntries.length} of {entries.length} entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="primary" onClick={handleApplyFilters}>
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
            setModals({
              ...modals,
              add: true
            })
            }>

            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('reconciled')}
            disabled={selectedEntries.length === 0}>

            <Check className="w-4 h-4 mr-2" />
            Reconcile Selected ({selectedEntries.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('unpresented')}
            disabled={selectedEntries.length === 0}
            className="text-red-600 border-red-300 hover:bg-red-50">

            <Ban className="w-4 h-4 mr-2" />
            Mark Unpresented
          </Button>
          <Button
            variant="outline"
            onClick={() =>
            setModals({
              ...modals,
              match: true
            })
            }>

            <Link className="w-4 h-4 mr-2" />
            Auto Match
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}>

            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}>

            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {[
        {
          status: 'pending',
          icon: Clock,
          color: 'orange'
        },
        {
          status: 'reconciled',
          icon: CheckCircle,
          color: 'green'
        },
        {
          status: 'unpresented',
          icon: Ban,
          color: 'red'
        },
        {
          status: 'mismatch',
          icon: AlertTriangle,
          color: 'purple'
        },
        {
          status: 'disputed',
          icon: AlertCircle,
          color: 'yellow'
        }].
        map(({ status, icon: Icon, color }) =>
        <span
          key={status}
          className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-medium`}>

            <Icon className="w-3 h-3 inline mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}:{' '}
            {summary[`${status}Count` as keyof typeof summary]}
          </span>
        )}
      </div>

      {/* Branch-wise Data Tables */}
      {getActiveBranches().map((branch) => {
        const branchSummary = getBranchSummary(branch);
        const branchEntries = getBranchEntries(branch);
        return (
          <Card key={branch} className="p-0 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getBranchName(branch)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {branchSummary.total} entries • {branchSummary.reconciled}{' '}
                    reconciled • {branchSummary.pending} pending
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-red-600 font-medium">
                  Debit: {formatCurrency(branchSummary.totalDebit)}
                </span>
                <span className="text-green-600 font-medium">
                  Credit: {formatCurrency(branchSummary.totalCredit)}
                </span>
                <span
                  className={`font-bold ${branchSummary.totalCredit - branchSummary.totalDebit >= 0 ? 'text-green-700' : 'text-red-700'}`}>

                  Net:{' '}
                  {formatCurrency(
                    branchSummary.totalCredit - branchSummary.totalDebit
                  )}
                </span>
              </div>
            </div>
            {branchEntries.length > 0 ?
            <Table columns={columns} data={branchEntries} /> :

            <div className="p-8 text-center text-gray-500">
                No entries found for this branch
              </div>
            }
          </Card>);

      })}

      {/* Reconciliation Summary */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Reconciliation Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Book Balance Adjustment
            </h4>
            {[
            {
              label: 'ERP Ledger Balance:',
              value: summary.erpBalance,
              color: ''
            },
            {
              label: 'Less: Unpresented Cheques:',
              value: summary.unpresentedCheques,
              color: 'text-red-600',
              prefix: '(',
              suffix: ')'
            },
            {
              label: 'Add: Deposits in Transit:',
              value: summary.depositsInTransit,
              color: 'text-green-600'
            },
            {
              label: 'Less: Bank Charges (Not Recorded):',
              value: summary.bankChargesNotRecorded,
              color: 'text-red-600',
              prefix: '(',
              suffix: ')'
            },
            {
              label: 'Add: Interest (Not Recorded):',
              value: summary.interestNotRecorded,
              color: 'text-green-600'
            }].
            map(({ label, value, color, prefix = '', suffix = '' }) =>
            <div key={label} className={`flex justify-between ${color}`}>
                <span>{label}</span>
                <span className="font-semibold">
                  {prefix}
                  {formatCurrency(value)}
                  {suffix}
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Adjusted Book Balance:</span>
              <span>
                {formatCurrency(
                  summary.erpBalance -
                  summary.unpresentedCheques +
                  summary.depositsInTransit -
                  summary.bankChargesNotRecorded +
                  summary.interestNotRecorded
                )}
              </span>
            </div>
          </div>
          <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Bank Statement
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Statement Balance:</span>
              <span className="font-semibold">
                {formatCurrency(summary.bankStatementBalance)}
              </span>
            </div>
            <div className="border-t pt-4 mt-8">
              <div className="flex justify-between items-center">
                <span className="font-bold">Reconciliation Status:</span>
                {Math.abs(summary.difference) < 100 ?
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Balanced
                  </span> :

                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Difference: {formatCurrency(Math.abs(summary.difference))}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal
        show={modals.add}
        onClose={() =>
        setModals({
          ...modals,
          add: false
        })
        }
        title="Add New Entry">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={newEntry.date}
              onChange={(e) =>
              setNewEntry({
                ...newEntry,
                date: e.target.value
              })
              } />

            <Select
              label="Entry Type *"
              value={newEntry.entryType}
              onChange={(value) =>
              setNewEntry({
                ...newEntry,
                entryType: value
              })
              }
              options={[
              {
                value: 'cheque',
                label: 'Cheque'
              },
              {
                value: 'transfer',
                label: 'Transfer'
              },
              {
                value: 'deposit',
                label: 'Deposit'
              },
              {
                value: 'charge',
                label: 'Bank Charge'
              },
              {
                value: 'interest',
                label: 'Interest'
              },
              {
                value: 'other',
                label: 'Other'
              }]
              } />

          </div>
          <Input
            label="Particulars *"
            placeholder="Enter description"
            value={newEntry.particulars}
            onChange={(e) =>
            setNewEntry({
              ...newEntry,
              particulars: e.target.value
            })
            } />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reference No"
              placeholder="Auto-generated if empty"
              value={newEntry.referenceNo}
              onChange={(e) =>
              setNewEntry({
                ...newEntry,
                referenceNo: e.target.value
              })
              } />

            <Input
              label="Cheque No"
              placeholder="If applicable"
              value={newEntry.chequeNo}
              onChange={(e) =>
              setNewEntry({
                ...newEntry,
                chequeNo: e.target.value
              })
              } />

          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Debit Amount (₹)"
              type="number"
              placeholder="0.00"
              value={newEntry.debit}
              onChange={(e) =>
              setNewEntry({
                ...newEntry,
                debit: e.target.value,
                credit: ''
              })
              } />

            <Input
              label="Credit Amount (₹)"
              type="number"
              placeholder="0.00"
              value={newEntry.credit}
              onChange={(e) =>
              setNewEntry({
                ...newEntry,
                credit: e.target.value,
                debit: ''
              })
              } />

          </div>
          <Input
            label="Bank Date"
            type="date"
            value={newEntry.bankDate}
            onChange={(e) =>
            setNewEntry({
              ...newEntry,
              bankDate: e.target.value
            })
            } />

          <Input
            label="Remarks"
            placeholder="Additional notes..."
            value={newEntry.remarks}
            onChange={(e) =>
            setNewEntry({
              ...newEntry,
              remarks: e.target.value
            })
            } />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                add: false
              })
              }>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddEntry}
              disabled={!newEntry.date || !newEntry.particulars}>

              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        show={modals.view}
        onClose={() =>
        setModals({
          ...modals,
          view: false
        })
        }
        title="Entry Details">

        {selectedEntry &&
        <div className="space-y-4">
            {[
          [
          'Date',
          formatDate(selectedEntry.date),
          'Status',
          <Badge
            key="s"
            variant={
            selectedEntry.status === 'reconciled' ?
            'success' :
            'warning'
            }>

                  {selectedEntry.status}
                </Badge>],

          ['Particulars', selectedEntry.particulars],
          [
          'Reference No',
          selectedEntry.referenceNo,
          'Cheque No',
          selectedEntry.chequeNo || '-'],

          [
          'Debit',
          selectedEntry.debit > 0 ?
          <span key="d" className="font-medium text-red-600">
                    {formatCurrency(selectedEntry.debit)}
                  </span> :

          '-',

          'Credit',
          selectedEntry.credit > 0 ?
          <span key="c" className="font-medium text-green-600">
                    {formatCurrency(selectedEntry.credit)}
                  </span> :

          '-'],


          [
          'Bank Date',
          formatDate(selectedEntry.bankDate),
          'Entry Type',
          selectedEntry.entryType],

          [
          'Branch',
          getBranchName(selectedEntry.branch),
          'Batch',
          selectedEntry.batch],

          ['Remarks', selectedEntry.remarks || '-'],
          [
          'Created By',
          selectedEntry.createdBy,
          'Created At',
          selectedEntry.createdAt]].

          map((row, i) =>
          <div
            key={i}
            className={`grid ${row.length === 2 ? 'grid-cols-1' : 'grid-cols-2'} gap-4 ${i === 7 ? 'pt-4 border-t' : ''}`}>

                {Array.from(
              {
                length: row.length / 2
              },
              (_, j) =>
              <div key={j}>
                      <p className="text-sm text-gray-500">{row[j * 2]}</p>
                      <p className="font-medium">{row[j * 2 + 1]}</p>
                    </div>

            )}
              </div>
          )}
            <Button
            variant="outline"
            className="w-full"
            onClick={() =>
            setModals({
              ...modals,
              view: false
            })
            }>

              Close
            </Button>
          </div>
        }
      </Modal>

      <Modal
        show={modals.edit}
        onClose={() =>
        setModals({
          ...modals,
          edit: false
        })
        }
        title="Edit Entry">

        {selectedEntry &&
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Date"
              type="date"
              value={selectedEntry.date}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                date: e.target.value
              })
              } />

              <Select
              label="Entry Type"
              value={selectedEntry.entryType}
              onChange={(value) =>
              setSelectedEntry({
                ...selectedEntry,
                entryType: value as BankEntry['entryType']
              })
              }
              options={[
              {
                value: 'cheque',
                label: 'Cheque'
              },
              {
                value: 'transfer',
                label: 'Transfer'
              },
              {
                value: 'deposit',
                label: 'Deposit'
              },
              {
                value: 'charge',
                label: 'Bank Charge'
              },
              {
                value: 'interest',
                label: 'Interest'
              },
              {
                value: 'other',
                label: 'Other'
              }]
              } />

            </div>
            <Input
            label="Particulars"
            value={selectedEntry.particulars}
            onChange={(e) =>
            setSelectedEntry({
              ...selectedEntry,
              particulars: e.target.value
            })
            } />

            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Reference No"
              value={selectedEntry.referenceNo}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                referenceNo: e.target.value
              })
              } />

              <Input
              label="Cheque No"
              value={selectedEntry.chequeNo}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                chequeNo: e.target.value
              })
              } />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Debit Amount"
              type="number"
              value={selectedEntry.debit.toString()}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                debit: parseFloat(e.target.value) || 0
              })
              } />

              <Input
              label="Credit Amount"
              type="number"
              value={selectedEntry.credit.toString()}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                credit: parseFloat(e.target.value) || 0
              })
              } />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Bank Date"
              type="date"
              value={selectedEntry.bankDate}
              onChange={(e) =>
              setSelectedEntry({
                ...selectedEntry,
                bankDate: e.target.value
              })
              } />

              <Select
              label="Status"
              value={selectedEntry.status}
              onChange={(value) =>
              setSelectedEntry({
                ...selectedEntry,
                status: value as BankEntry['status']
              })
              }
              options={[
              {
                value: 'pending',
                label: 'Pending'
              },
              {
                value: 'reconciled',
                label: 'Reconciled'
              },
              {
                value: 'unpresented',
                label: 'Unpresented'
              },
              {
                value: 'mismatch',
                label: 'Mismatch'
              },
              {
                value: 'disputed',
                label: 'Disputed'
              }]
              } />

            </div>
            <Input
            label="Remarks"
            value={selectedEntry.remarks}
            onChange={(e) =>
            setSelectedEntry({
              ...selectedEntry,
              remarks: e.target.value
            })
            } />

            <div className="flex gap-3 pt-4">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                edit: false
              })
              }>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="flex-1"
              onClick={handleSaveEdit}>

                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        }
      </Modal>

      <Modal
        show={modals.delete}
        onClose={() =>
        setModals({
          ...modals,
          delete: false
        })
        }
        title="">

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Entry?</h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete entry "{selectedEntry?.particulars}
            "? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                delete: false
              })
              }>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDeleteEntry}>

              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        show={modals.import}
        onClose={() =>
        setModals({
          ...modals,
          import: false
        })
        }
        title="Import Bank Statement">

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your file here, or
            </p>
            <Button variant="outline">Browse Files</Button>
            <p className="text-xs text-gray-500 mt-2">
              Supports: CSV, XLSX, OFX, QIF
            </p>
          </div>
          <Select
            label="Bank Format"
            options={[
            {
              value: 'hdfc',
              label: 'HDFC Bank'
            },
            {
              value: 'sbi',
              label: 'SBI Bank'
            },
            {
              value: 'icici',
              label: 'ICICI Bank'
            },
            {
              value: 'axis',
              label: 'Axis Bank'
            },
            {
              value: 'generic',
              label: 'Generic CSV'
            }]
            } />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                import: false
              })
              }>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setModals({
                  ...modals,
                  import: false
                });
                alert('Imported!');
              }}>

              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        show={modals.match}
        onClose={() =>
        setModals({
          ...modals,
          match: false
        })
        }
        title="Auto Match Entries">

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Auto matching will compare ERP entries with bank statement entries
              based on:
            </p>
            <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
              <li>Amount matching</li>
              <li>Date proximity (±3 days)</li>
              <li>Reference/Cheque number</li>
            </ul>
          </div>
          <Select
            label="Matching Tolerance"
            options={[
            {
              value: 'exact',
              label: 'Exact Match Only'
            },
            {
              value: 'flexible',
              label: 'Flexible (±3 days)'
            },
            {
              value: 'loose',
              label: 'Loose (±7 days)'
            }]
            } />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                match: false
              })
              }>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setModals({
                  ...modals,
                  match: false
                });
                alert('Auto matching completed!');
              }}>

              <Link className="w-4 h-4 mr-2" />
              Start Matching
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        show={modals.history}
        onClose={() =>
        setModals({
          ...modals,
          history: false
        })
        }
        title="Reconciliation History"
        size="lg">

        <div className="space-y-4">
          {[
          {
            date: '2024-03-28',
            user: 'Admin',
            entries: 45,
            status: 'Completed'
          },
          {
            date: '2024-02-28',
            user: 'Accountant',
            entries: 52,
            status: 'Completed'
          },
          {
            date: '2024-01-31',
            user: 'Admin',
            entries: 38,
            status: 'Completed'
          }].
          map((record, i) =>
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">

              <div>
                <p className="font-medium">{record.date}</p>
                <p className="text-sm text-gray-500">By: {record.user}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{record.entries} entries</p>
                <Badge variant="success">{record.status}</Badge>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() =>
          setModals({
            ...modals,
            history: false
          })
          }>

          Close
        </Button>
      </Modal>

      <Modal
        show={modals.settings}
        onClose={() =>
        setModals({
          ...modals,
          settings: false
        })
        }
        title="Reconciliation Settings">

        <div className="space-y-4">
          <Select
            label="Default Bank Account"
            options={bankAccounts.map((acc) => ({
              value: acc.id,
              label: acc.name
            }))} />

          <Select
            label="Auto-match Tolerance"
            options={[
            {
              value: '0',
              label: 'Same Day Only'
            },
            {
              value: '3',
              label: '±3 Days'
            },
            {
              value: '7',
              label: '±7 Days'
            }]
            } />

          {['Auto-save entries', 'Show notifications'].map((label) =>
          <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
              setModals({
                ...modals,
                settings: false
              })
              }>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setModals({
                  ...modals,
                  settings: false
                });
                alert('Settings saved!');
              }}>

              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}