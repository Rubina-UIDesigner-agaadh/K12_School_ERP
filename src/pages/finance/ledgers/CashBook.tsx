import React, { useCallback, useMemo, useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Printer,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  X,
  AlertCircle,
  Info,
  ExternalLink,
  Wallet,
  Banknote,
  Coins,
  CircleDollarSign,
  Calculator,
  ClipboardCheck,
  PiggyBank,
  ShieldCheck,
  History,
  HelpCircle,
  Save,
  Plus,
  Minus,
  User,
  Building,
  GraduationCap,
  Users,
  Tag,
  Hash,
  IndianRupee,
  Landmark,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  Check } from
'lucide-react';
// --- Constants ---
const BRANCHES = [
{
  id: 'main',
  name: 'Main Campus',
  color: '#3b82f6'
},
{
  id: 'north',
  name: 'North Branch',
  color: '#10b981'
},
{
  id: 'south',
  name: 'South Branch',
  color: '#f59e0b'
},
{
  id: 'east',
  name: 'East Branch',
  color: '#8b5cf6'
}];

// --- Types ---
type TransactionType = 'all' | 'receipt' | 'payment';
type TransactionStatus = 'posted' | 'pending' | 'verified' | 'cancelled';
type VoucherType =
'all' |
'Fee Receipt' |
'Cash Receipt' |
'Cash Payment' |
'Petty Cash' |
'Expense' |
'Refund' |
'Advance';
type PartyType = 'student' | 'vendor' | 'staff' | 'other';
interface CashTransaction {
  id: number;
  date: string;
  voucherNo: string;
  voucherType: VoucherType;
  particulars: string;
  narration: string;
  referenceNo: string;
  receipt: number;
  payment: number;
  runningBalance: number;
  status: TransactionStatus;
  createdBy: string;
  createdAt: string;
  partyName?: string;
  partyCode?: string;
  partyType?: PartyType;
  ledgerAccount: string;
  ledgerCode: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  tags?: string[];
  attachments?: number;
  branchId: string;
}
interface CashDenomination {
  denomination: number;
  label: string;
  count: number;
  total: number;
}
interface FilterState {
  fromDate: string;
  toDate: string;
  voucherNo: string;
  voucherType: VoucherType;
  transactionType: TransactionType;
  status: 'all' | TransactionStatus;
  partySearch: string;
  minAmount: string;
  maxAmount: string;
  verificationStatus: 'all' | 'verified' | 'unverified';
}
interface NewTransactionForm {
  transactionType: 'receipt' | 'payment';
  voucherType: Exclude<VoucherType, 'all'>;
  date: string;
  voucherNo: string;
  autoGenerateVoucher: boolean;
  partyType: PartyType | '';
  partyName: string;
  partyCode: string;
  searchParty: string;
  particulars: string;
  narration: string;
  amount: string;
  referenceNo: string;
  ledgerAccount: string;
  ledgerCode: string;
  tags: string[];
  newTag: string;
  attachments: File[];
  remarks: string;
  branchId: string;
}
interface PartyOption {
  id: string;
  name: string;
  code: string;
  type: PartyType;
  details?: string;
}
const initialFilters: FilterState = {
  fromDate: '',
  toDate: '',
  voucherNo: '',
  voucherType: 'all',
  transactionType: 'all',
  status: 'all',
  partySearch: '',
  minAmount: '',
  maxAmount: '',
  verificationStatus: 'all'
};
const defaultDenominations: CashDenomination[] = [
{
  denomination: 2000,
  label: '₹2000',
  count: 0,
  total: 0
},
{
  denomination: 500,
  label: '₹500',
  count: 0,
  total: 0
},
{
  denomination: 200,
  label: '₹200',
  count: 0,
  total: 0
},
{
  denomination: 100,
  label: '₹100',
  count: 0,
  total: 0
},
{
  denomination: 50,
  label: '₹50',
  count: 0,
  total: 0
},
{
  denomination: 20,
  label: '₹20',
  count: 0,
  total: 0
},
{
  denomination: 10,
  label: '₹10',
  count: 0,
  total: 0
},
{
  denomination: 5,
  label: '₹5',
  count: 0,
  total: 0
},
{
  denomination: 2,
  label: '₹2',
  count: 0,
  total: 0
},
{
  denomination: 1,
  label: '₹1',
  count: 0,
  total: 0
}];

const sampleParties: PartyOption[] = [
{
  id: 'STU-10A-001',
  name: 'Rahul Sharma',
  code: 'STU-10A-001',
  type: 'student',
  details: 'Class 10-A'
},
{
  id: 'STU-09B-002',
  name: 'Priya Patel',
  code: 'STU-09B-002',
  type: 'student',
  details: 'Class 9-B'
},
{
  id: 'VEN-LOCAL-001',
  name: 'Local Stationery Shop',
  code: 'VEN-LOCAL-001',
  type: 'vendor',
  details: 'Stationery Supplier'
},
{
  id: 'EMP-001',
  name: 'Rajesh Verma',
  code: 'EMP-001',
  type: 'staff',
  details: 'Teacher - Mathematics'
}];

const ledgerAccounts = [
{
  code: 'ACC-1001',
  name: 'Cash in Hand',
  type: 'asset'
},
{
  code: 'ACC-2001',
  name: 'Tuition Fee Income',
  type: 'income'
},
{
  code: 'ACC-3001',
  name: 'Stationery Expense',
  type: 'expense'
},
{
  code: 'ACC-4001',
  name: 'Staff Advance',
  type: 'asset'
}];

// Generate branch-wise transactions
const generateTransactions = (): CashTransaction[] => {
  const baseTransactions = [
  {
    id: 1,
    date: '2024-04-01',
    voucherNo: 'OB-001',
    voucherType: 'all' as VoucherType,
    particulars: 'Opening Balance',
    narration: 'Opening cash balance',
    referenceNo: 'OB-2024',
    receipt: 50000,
    payment: 0,
    status: 'posted' as TransactionStatus,
    createdBy: 'System',
    isVerified: true,
    tags: ['Opening']
  },
  {
    id: 2,
    date: '2024-04-02',
    voucherNo: 'CR-001',
    voucherType: 'Fee Receipt' as VoucherType,
    particulars: 'Fee Collection - Student',
    narration: 'Tuition fee Q1',
    referenceNo: 'FEE-001',
    receipt: 25000,
    payment: 0,
    status: 'posted' as TransactionStatus,
    createdBy: 'Fee Counter',
    isVerified: true,
    partyName: 'Rahul Sharma',
    partyCode: 'STU-001',
    partyType: 'student' as PartyType,
    tags: ['Fee']
  },
  {
    id: 3,
    date: '2024-04-03',
    voucherNo: 'CP-001',
    voucherType: 'Cash Payment' as VoucherType,
    particulars: 'Stationery Purchase',
    narration: 'Office supplies',
    referenceNo: 'PUR-001',
    receipt: 0,
    payment: 5500,
    status: 'posted' as TransactionStatus,
    createdBy: 'Admin',
    isVerified: true,
    partyName: 'Stationery Shop',
    partyCode: 'VEN-001',
    partyType: 'vendor' as PartyType,
    tags: ['Expense']
  },
  {
    id: 4,
    date: '2024-04-04',
    voucherNo: 'CR-002',
    voucherType: 'Cash Receipt' as VoucherType,
    particulars: 'Library Fine',
    narration: 'Late return fine',
    referenceNo: 'LIB-001',
    receipt: 1200,
    payment: 0,
    status: 'posted' as TransactionStatus,
    createdBy: 'Library',
    isVerified: true,
    tags: ['Fine']
  },
  {
    id: 5,
    date: '2024-04-05',
    voucherNo: 'CP-002',
    voucherType: 'Petty Cash' as VoucherType,
    particulars: 'Tea & Refreshments',
    narration: 'Staff refreshments',
    referenceNo: 'PC-001',
    receipt: 0,
    payment: 850,
    status: 'pending' as TransactionStatus,
    createdBy: 'Admin',
    isVerified: false,
    tags: ['Petty Cash']
  }];

  const allTransactions: CashTransaction[] = [];
  BRANCHES.forEach((branch, bi) => {
    baseTransactions.forEach((t, ti) => {
      const multiplier = 1 + bi * 0.2;
      allTransactions.push({
        ...t,
        id: bi * 100 + t.id,
        voucherNo: `${branch.id.toUpperCase().slice(0, 2)}-${t.voucherNo}`,
        receipt: Math.round(t.receipt * multiplier),
        payment: Math.round(t.payment * multiplier),
        runningBalance: 0,
        createdAt: `${t.date} 10:00:00`,
        ledgerAccount: 'Cash in Hand',
        ledgerCode: 'ACC-1001',
        branchId: branch.id,
        attachments: ti % 2 === 0 ? 1 : 0
      });
    });
  });
  return allTransactions;
};
// --- Components ---
const BranchBadge = ({ branchId }: {branchId: string;}) => {
  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${branch.color}15`,
        color: branch.color
      }}>

      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: branch.color
        }} />

      {branch.name}
    </span>);

};
// --- Main Component ---
export function CashBook() {
  const [selectedBranches] = useState<string[]>(['main']);
  const [selectedBatch] = useState('2024-25');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
  useState<FilterState>(initialFilters);
  const [selectedTransaction, setSelectedTransaction] =
  useState<CashTransaction | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [denominations, setDenominations] =
  useState<CashDenomination[]>(defaultDenominations);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [cashTransactions] = useState<CashTransaction[]>(generateTransactions());
  const [transactionForm, setTransactionForm] = useState<NewTransactionForm>({
    transactionType: 'receipt',
    voucherType: 'Cash Receipt',
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    autoGenerateVoucher: true,
    partyType: '',
    partyName: '',
    partyCode: '',
    searchParty: '',
    particulars: '',
    narration: '',
    amount: '',
    referenceNo: '',
    ledgerAccount: 'Cash in Hand',
    ledgerCode: 'ACC-1001',
    tags: [],
    newTag: '',
    attachments: [],
    remarks: '',
    branchId: 'main'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPartySearch, setShowPartySearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeBranches = useMemo(
    () => BRANCHES.filter((b) => selectedBranches.includes(b.id)),
    [selectedBranches]
  );
  const filteredData = useMemo(() => {
    let data = cashTransactions.filter((t) =>
    selectedBranches.includes(t.branchId)
    );
    if (appliedFilters.fromDate)
    data = data.filter((t) => t.date >= appliedFilters.fromDate);
    if (appliedFilters.toDate)
    data = data.filter((t) => t.date <= appliedFilters.toDate);
    if (appliedFilters.voucherNo)
    data = data.filter((t) =>
    t.voucherNo.
    toLowerCase().
    includes(appliedFilters.voucherNo.toLowerCase())
    );
    if (appliedFilters.voucherType !== 'all')
    data = data.filter((t) => t.voucherType === appliedFilters.voucherType);
    if (appliedFilters.transactionType === 'receipt')
    data = data.filter((t) => t.receipt > 0);
    if (appliedFilters.transactionType === 'payment')
    data = data.filter((t) => t.payment > 0);
    if (appliedFilters.status !== 'all')
    data = data.filter((t) => t.status === appliedFilters.status);
    if (appliedFilters.partySearch)
    data = data.filter(
      (t) =>
      t.partyName?.
      toLowerCase().
      includes(appliedFilters.partySearch.toLowerCase()) ||
      t.particulars.
      toLowerCase().
      includes(appliedFilters.partySearch.toLowerCase())
    );
    if (appliedFilters.verificationStatus === 'verified')
    data = data.filter((t) => t.isVerified);
    if (appliedFilters.verificationStatus === 'unverified')
    data = data.filter((t) => !t.isVerified);
    let balance = 50000;
    return data.map((t) => {
      balance = balance + t.receipt - t.payment;
      return {
        ...t,
        runningBalance: balance
      };
    });
  }, [appliedFilters, cashTransactions, selectedBranches]);
  const branchSummaries = useMemo(() => {
    return selectedBranches.map((branchId) => {
      const branch = BRANCHES.find((b) => b.id === branchId)!;
      const branchData = filteredData.filter((t) => t.branchId === branchId);
      const openingBalance = 50000;
      const totalReceipts = branchData.reduce((s, t) => s + t.receipt, 0);
      const totalPayments = branchData.reduce((s, t) => s + t.payment, 0);
      return {
        ...branch,
        openingBalance,
        totalReceipts,
        totalPayments,
        closingBalance: openingBalance + totalReceipts - totalPayments,
        transactionCount: branchData.length,
        receiptCount: branchData.filter((t) => t.receipt > 0).length,
        paymentCount: branchData.filter((t) => t.payment > 0).length,
        pendingVerification: branchData.filter((t) => !t.isVerified).length
      };
    });
  }, [filteredData, selectedBranches]);
  const totalSummary = useMemo(
    () => ({
      openingBalance: branchSummaries.reduce((s, b) => s + b.openingBalance, 0),
      totalReceipts: branchSummaries.reduce((s, b) => s + b.totalReceipts, 0),
      totalPayments: branchSummaries.reduce((s, b) => s + b.totalPayments, 0),
      closingBalance: branchSummaries.reduce((s, b) => s + b.closingBalance, 0),
      transactionCount: filteredData.length,
      pendingVerification: filteredData.filter((t) => !t.isVerified).length
    }),
    [branchSummaries, filteredData]
  );
  const physicalCashTotal = useMemo(
    () => denominations.reduce((s, d) => s + d.count * d.denomination, 0),
    [denominations]
  );
  const handleFilterChange = (key: keyof FilterState, value: string) =>
  setFilters((prev) => ({
    ...prev,
    [key]: value
  }));
  const handleApplyFilters = () => setAppliedFilters(filters);
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };
  const handleViewTransaction = (t: CashTransaction) => {
    setSelectedTransaction(t);
    setShowViewModal(true);
  };
  const handleDenominationChange = (i: number, count: number) =>
  setDenominations((prev) => {
    const u = [...prev];
    u[i] = {
      ...u[i],
      count,
      total: count * u[i].denomination
    };
    return u;
  });
  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
  const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formatDateTime = (d: string) =>
  new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const getStatusBadge = (status: TransactionStatus) => {
    const variants: Record<
      TransactionStatus,
      'success' | 'warning' | 'danger' | 'primary'> =
    {
      posted: 'success',
      pending: 'warning',
      verified: 'primary',
      cancelled: 'danger'
    };
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>);

  };
  const getVoucherTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Fee Receipt': <ArrowDownRight className="w-4 h-4 text-green-500" />,
      'Cash Receipt': <ArrowDownRight className="w-4 h-4 text-green-500" />,
      'Cash Payment': <ArrowUpRight className="w-4 h-4 text-red-500" />,
      'Petty Cash': <Coins className="w-4 h-4 text-amber-500" />,
      Expense: <Wallet className="w-4 h-4 text-red-500" />,
      Refund: <ArrowUpRight className="w-4 h-4 text-orange-500" />,
      Advance: <Banknote className="w-4 h-4 text-blue-500" />
    };
    return icons[type] || <FileText className="w-4 h-4 text-gray-500" />;
  };
  const voucherTypes = [
  {
    value: 'all',
    label: 'All Types'
  },
  {
    value: 'Fee Receipt',
    label: 'Fee Receipt'
  },
  {
    value: 'Cash Receipt',
    label: 'Cash Receipt'
  },
  {
    value: 'Cash Payment',
    label: 'Cash Payment'
  },
  {
    value: 'Petty Cash',
    label: 'Petty Cash'
  },
  {
    value: 'Expense',
    label: 'Expense'
  },
  {
    value: 'Refund',
    label: 'Refund'
  },
  {
    value: 'Advance',
    label: 'Advance'
  }];

  const columns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: CashTransaction) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{formatDate(row.date)}</span>
        </div>

  },
  {
    key: 'voucher',
    header: 'Voucher',
    render: (row: CashTransaction) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getVoucherTypeIcon(row.voucherType)}
            <button
          onClick={() => handleViewTransaction(row)}
          className="font-mono text-sm font-medium text-blue-600 hover:underline">

              {row.voucherNo}
            </button>
          </div>
          <Badge
        variant={row.receipt > 0 ? 'success' : 'danger'}
        className="text-xs">

            {row.voucherType}
          </Badge>
        </div>

  },
  ...(selectedBranches.length > 1 ?
  [
  {
    key: 'branch',
    header: 'Branch',
    render: (row: CashTransaction) =>
    <BranchBadge branchId={row.branchId} />

  }] :

  []),
  {
    key: 'particulars',
    header: 'Particulars',
    render: (row: CashTransaction) =>
    <div className="max-w-md">
          <p className="font-medium text-gray-900 text-sm">{row.particulars}</p>
          <p className="text-xs text-gray-500 truncate">{row.narration}</p>
          {row.partyName &&
      <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-blue-600">{row.partyName}</span>
            </div>
      }
          <div className="flex items-center gap-2 mt-1">
            {row.isVerified ?
        <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span> :

        <span className="flex items-center gap-1 text-xs text-amber-600">
                <Clock className="w-3 h-3" />
                Pending
              </span>
        }
          </div>
        </div>

  },
  {
    key: 'receipt',
    header: 'Receipt (₹)',
    render: (row: CashTransaction) =>
    <div className="text-right">
          {row.receipt > 0 ?
      <div className="flex items-center justify-end gap-1">
              <ArrowDownRight className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-green-600">
                {formatCurrency(row.receipt)}
              </span>
            </div> :

      <span className="text-gray-300">—</span>
      }
        </div>

  },
  {
    key: 'payment',
    header: 'Payment (₹)',
    render: (row: CashTransaction) =>
    <div className="text-right">
          {row.payment > 0 ?
      <div className="flex items-center justify-end gap-1">
              <ArrowUpRight className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-600">
                {formatCurrency(row.payment)}
              </span>
            </div> :

      <span className="text-gray-300">—</span>
      }
        </div>

  },
  {
    key: 'balance',
    header: 'Balance (₹)',
    render: (row: CashTransaction) =>
    <div className="text-right">
          <span className="font-bold text-gray-900">
            {formatCurrency(row.runningBalance)}
          </span>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CashTransaction) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleViewTransaction(row)}>

            <Eye className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink className="w-4 h-4 text-blue-500" />
          </Button>
        </div>

  }];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Banknote className="w-7 h-7 text-green-600" />
            Cash Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daily cash receipts and payments register
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddTransactionModal(true)}>

            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVerificationModal(true)}>

            <ClipboardCheck className="w-4 h-4 mr-2" />
            Verify Cash
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}>

            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {selectedBranches.length > 0 &&
      <div className="flex items-center gap-2 flex-wrap p-3 bg-white rounded-lg border print:hidden">
          <span className="text-xs font-medium text-gray-500">Active:</span>
          {activeBranches.map((b) =>
        <BranchBadge key={b.id} branchId={b.id} />
        )}
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs font-medium text-gray-600">
            Batch: {selectedBatch}
          </span>
        </div>
      }

      {selectedBranches.length === 0 ?
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Building className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-semibold text-yellow-800">No Branch Selected</h3>
          <p className="text-sm text-yellow-600">
            Please select at least one branch to view cash book
          </p>
        </div> :

      <>
          {/* Branch-wise Summary Cards */}
          {selectedBranches.length > 1 &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branchSummaries.map((b) =>
          <Card
            key={b.id}
            className="p-4"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: b.color
            }}>

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">
                      {b.name}
                    </span>
                    <span
                className="text-xl font-bold"
                style={{
                  color: b.color
                }}>

                      {formatCurrency(b.closingBalance)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Opening</span>
                      <span className="font-medium">
                        {formatCurrency(b.openingBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Receipts</span>
                      <span className="font-medium text-green-600">
                        +{formatCurrency(b.totalReceipts)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payments</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(b.totalPayments)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pending</span>
                      <span className="font-medium text-amber-600">
                        {b.pendingVerification}
                      </span>
                    </div>
                  </div>
                </Card>
          )}
            </div>
        }

          {/* Total Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 uppercase font-medium">
                    Opening Balance
                  </p>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {formatCurrency(totalSummary.openingBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 uppercase font-medium">
                    Total Receipts
                  </p>
                  <p className="text-xl font-bold text-green-900 mt-1">
                    {formatCurrency(totalSummary.totalReceipts)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 uppercase font-medium">
                    Total Payments
                  </p>
                  <p className="text-xl font-bold text-red-900 mt-1">
                    {formatCurrency(totalSummary.totalPayments)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 uppercase font-medium">
                    Closing Balance
                  </p>
                  <p className="text-xl font-bold text-purple-900 mt-1">
                    {formatCurrency(totalSummary.closingBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-600 uppercase font-medium">
                    Verification
                  </p>
                  {totalSummary.pendingVerification > 0 ?
                <p className="text-xl font-bold text-amber-900 mt-1">
                      {totalSummary.pendingVerification} Pending
                    </p> :

                <p className="text-lg font-bold text-green-600 mt-1">
                      All Verified
                    </p>
                }
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="overflow-hidden print:hidden">
            <div
            className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-gray-700">Filters</h3>
                {(appliedFilters.fromDate ||
              appliedFilters.voucherType !== 'all') &&
              <Badge variant="primary" className="ml-2">
                    Active
                  </Badge>
              }
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <Input
                type="date"
                label="From Date"
                value={filters.fromDate}
                onChange={(e) =>
                handleFilterChange('fromDate', e.target.value)
                } />

                  <Input
                type="date"
                label="To Date"
                value={filters.toDate}
                onChange={(e) =>
                handleFilterChange('toDate', e.target.value)
                } />

                  <Input
                label="Voucher No"
                placeholder="Search..."
                value={filters.voucherNo}
                onChange={(e) =>
                handleFilterChange('voucherNo', e.target.value)
                }
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

                  <Select
                label="Voucher Type"
                value={filters.voucherType}
                onChange={(v) =>
                handleFilterChange('voucherType', v as VoucherType)
                }
                options={voucherTypes} />

                  <Select
                label="Type"
                value={filters.transactionType}
                onChange={(v) =>
                handleFilterChange(
                  'transactionType',
                  v as TransactionType
                )
                }
                options={[
                {
                  value: 'all',
                  label: 'All'
                },
                {
                  value: 'receipt',
                  label: 'Receipts'
                },
                {
                  value: 'payment',
                  label: 'Payments'
                }]
                } />

                  <Select
                label="Verification"
                value={filters.verificationStatus}
                onChange={(v) =>
                handleFilterChange('verificationStatus', v)
                }
                options={[
                {
                  value: 'all',
                  label: 'All'
                },
                {
                  value: 'verified',
                  label: 'Verified'
                },
                {
                  value: 'unverified',
                  label: 'Unverified'
                }]
                } />

                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Found{' '}
                    <span className="font-semibold">{filteredData.length}</span>{' '}
                    transactions
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetFilters}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="primary" onClick={handleApplyFilters}>
                      <Search className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
          }
          </Card>

          {/* Cash Book Table */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3 bg-blue-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-900">
                  Opening Cash Balance
                </span>
              </div>
              <span className="font-bold text-blue-900">
                {formatCurrency(totalSummary.openingBalance)}
              </span>
            </div>
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-gray-500" />
                Cash Transactions
                <Badge variant="default">{filteredData.length}</Badge>
              </h3>
            </div>
            {filteredData.length > 0 ?
          <>
                <Table columns={columns} data={filteredData} />
                <div className="border-t-2 border-gray-400 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Period:</span>{' '}
                      {appliedFilters.fromDate || 'Start'} to{' '}
                      {appliedFilters.toDate || 'Present'}
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase">
                          Total Receipts
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(totalSummary.totalReceipts)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase">
                          Total Payments
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(totalSummary.totalPayments)}
                        </p>
                      </div>
                      <div className="text-right border-l-2 border-purple-300 pl-6">
                        <p className="text-xs text-purple-600 uppercase font-medium">
                          Closing Cash Balance
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatCurrency(totalSummary.closingBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </> :

          <div className="p-12 text-center">
                <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
          }
          </Card>

          {/* Cash Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Cash Summary
              </h3>
              <Badge
              variant={
              totalSummary.pendingVerification > 0 ? 'warning' : 'success'
              }>

                {totalSummary.pendingVerification > 0 ?
              'Verification Pending' :
              'All Verified'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                  Cash Flow Statement
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Opening Balance</span>
                    <span className="font-semibold text-blue-700">
                      {formatCurrency(totalSummary.openingBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-green-500" />
                      Add: Total Receipts
                    </span>
                    <span className="font-semibold text-green-700">
                      {formatCurrency(totalSummary.totalReceipts)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700 flex items-center gap-1">
                      <Minus className="w-4 h-4 text-red-500" />
                      Less: Total Payments
                    </span>
                    <span className="font-semibold text-red-700">
                      ({formatCurrency(totalSummary.totalPayments)})
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-3 bg-purple-100 rounded-lg border-2 border-purple-300">
                    <span className="font-semibold text-purple-900">
                      Closing Cash Balance
                    </span>
                    <span className="text-xl font-bold text-purple-900">
                      {formatCurrency(totalSummary.closingBalance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                  Transaction Summary
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {totalSummary.transactionCount}
                    </p>
                    <p className="text-xs text-gray-500">Total Transactions</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {totalSummary.pendingVerification}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pending Verification
                    </p>
                  </div>
                </div>
                {selectedBranches.length > 1 &&
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Branch-wise Balances
                    </p>
                    <div className="space-y-1">
                      {branchSummaries.map((b) =>
                  <div
                    key={b.id}
                    className="flex justify-between text-sm">

                          <span className="flex items-center gap-1">
                            <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: b.color
                        }} />

                            {b.name}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(b.closingBalance)}
                          </span>
                        </div>
                  )}
                    </div>
                  </div>
              }
              </div>
            </div>
          </Card>
        </>
      }

      {/* View Transaction Modal */}
      {showViewModal && selectedTransaction &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Transaction Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.voucherNo}
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowViewModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDate(selectedTransaction.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Branch</p>
                    <BranchBadge branchId={selectedTransaction.branchId} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Voucher Type</p>
                    <Badge
                    variant={
                    selectedTransaction.receipt > 0 ? 'success' : 'danger'
                    }>

                      {selectedTransaction.voucherType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Particulars</p>
                  <p className="font-medium text-gray-900">
                    {selectedTransaction.particulars}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTransaction.narration}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-xs text-green-600">Receipt</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {selectedTransaction.receipt > 0 ?
                    formatCurrency(selectedTransaction.receipt) :
                    '—'}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                    <p className="text-xs text-red-600">Payment</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {selectedTransaction.payment > 0 ?
                    formatCurrency(selectedTransaction.payment) :
                    '—'}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700">Running Balance</span>
                    <span className="text-xl font-bold text-purple-900">
                      {formatCurrency(selectedTransaction.runningBalance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowViewModal(false)}>

                  Close
                </Button>
                <Button variant="primary" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View in Ledger
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Cash Verification Modal */}
      {showVerificationModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ClipboardCheck className="w-6 h-6 text-purple-600" />
                    Cash Verification
                  </h2>
                  <p className="text-sm text-gray-500">
                    Count and verify physical cash
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVerificationModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                {selectedBranches.length > 1 &&
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Verification for Branches:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeBranches.map((b) =>
                  <BranchBadge key={b.id} branchId={b.id} />
                  )}
                    </div>
                  </div>
              }
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">
                    System Balance (All Selected Branches)
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(totalSummary.closingBalance)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Enter Cash Denominations
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {denominations.map((d, i) =>
                  <div
                    key={d.denomination}
                    className="p-3 bg-gray-50 rounded-lg">

                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {d.label}
                        </p>
                        <Input
                      type="number"
                      min="0"
                      value={d.count.toString()}
                      onChange={(e) =>
                      handleDenominationChange(
                        i,
                        parseInt(e.target.value) || 0
                      )
                      }
                      className="text-center" />

                        <p className="text-xs text-gray-500 text-center mt-1">
                          = {formatCurrency(d.count * d.denomination)}
                        </p>
                      </div>
                  )}
                  </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">System</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(totalSummary.closingBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Physical</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(physicalCashTotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Difference</p>
                      <p
                      className={`text-lg font-bold ${physicalCashTotal - totalSummary.closingBalance === 0 ? 'text-green-600' : physicalCashTotal - totalSummary.closingBalance > 0 ? 'text-blue-600' : 'text-red-600'}`}>

                        {formatCurrency(
                        physicalCashTotal - totalSummary.closingBalance
                      )}
                      </p>
                    </div>
                  </div>
                </div>
                {physicalCashTotal !== totalSummary.closingBalance &&
              <div
                className={`p-4 rounded-lg border ${physicalCashTotal > totalSummary.closingBalance ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>

                    <div className="flex items-start gap-3">
                      <AlertTriangle
                    className={`w-5 h-5 ${physicalCashTotal > totalSummary.closingBalance ? 'text-blue-600' : 'text-red-600'}`} />

                      <div>
                        <p
                      className={`font-medium ${physicalCashTotal > totalSummary.closingBalance ? 'text-blue-900' : 'text-red-900'}`}>

                          {physicalCashTotal > totalSummary.closingBalance ?
                      'Cash Excess' :
                      'Cash Shortage'}{' '}
                          Detected
                        </p>
                      </div>
                    </div>
                  </div>
              }
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                  value={verificationRemarks}
                  onChange={(e) => setVerificationRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter any observations..." />

                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowVerificationModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowVerificationModal(false);
                  alert('Verification saved!');
                }}>

                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Export Cash Book
                </h2>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Exporting {filteredData.length} transactions
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Branches: {activeBranches.map((b) => b.name).join(', ')}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Select Format
                  </p>
                  <button
                  onClick={() => {
                    setShowExportModal(false);
                    alert('Exported to PDF!');
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">

                    <FileText className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium">PDF Document</p>
                      <p className="text-xs text-gray-500">
                        Print-ready format
                      </p>
                    </div>
                  </button>
                  <button
                  onClick={() => {
                    setShowExportModal(false);
                    alert('Exported to Excel!');
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">

                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Excel Spreadsheet</p>
                      <p className="text-xs text-gray-500">For data analysis</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Add Transaction Modal */}
      {showAddTransactionModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CircleDollarSign className="w-6 h-6 text-green-600" />
                    Add Cash Transaction
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Record a new cash receipt or payment
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddTransactionModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                onClick={() =>
                setTransactionForm((p) => ({
                  ...p,
                  transactionType: 'receipt',
                  voucherType: 'Cash Receipt'
                }))
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${transactionForm.transactionType === 'receipt' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200'}`}>

                  <ArrowDownRight className="w-5 h-5" />
                  <span className="font-medium">Cash Receipt</span>
                </button>
                <button
                onClick={() =>
                setTransactionForm((p) => ({
                  ...p,
                  transactionType: 'payment',
                  voucherType: 'Cash Payment'
                }))
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${transactionForm.transactionType === 'payment' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-200'}`}>

                  <ArrowUpRight className="w-5 h-5" />
                  <span className="font-medium">Cash Payment</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <Select
                    value={transactionForm.branchId}
                    onChange={(v) =>
                    setTransactionForm((p) => ({
                      ...p,
                      branchId: v
                    }))
                    }
                    options={BRANCHES.map((b) => ({
                      value: b.id,
                      label: b.name
                    }))} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) =>
                    setTransactionForm((p) => ({
                      ...p,
                      date: e.target.value
                    }))
                    }
                    error={formErrors.date} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voucher Type
                    </label>
                    <Select
                    value={transactionForm.voucherType}
                    onChange={(v) =>
                    setTransactionForm((p) => ({
                      ...p,
                      voucherType: v as any
                    }))
                    }
                    options={
                    transactionForm.transactionType === 'receipt' ?
                    [
                    {
                      value: 'Fee Receipt',
                      label: 'Fee Receipt'
                    },
                    {
                      value: 'Cash Receipt',
                      label: 'Cash Receipt'
                    }] :

                    [
                    {
                      value: 'Cash Payment',
                      label: 'Cash Payment'
                    },
                    {
                      value: 'Petty Cash',
                      label: 'Petty Cash'
                    },
                    {
                      value: 'Expense',
                      label: 'Expense'
                    }]

                    } />

                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) =>
                    setTransactionForm((p) => ({
                      ...p,
                      amount: e.target.value
                    }))
                    }
                    className={`w-full pl-10 pr-4 py-3 text-2xl font-bold border rounded-lg ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} ${transactionForm.transactionType === 'receipt' ? 'text-green-600' : 'text-red-600'}`}
                    placeholder="0.00"
                    min="0" />

                  </div>
                  {formErrors.amount &&
                <p className="text-red-500 text-xs mt-1">
                      {formErrors.amount}
                    </p>
                }
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Particulars <span className="text-red-500">*</span>
                  </label>
                  <Input
                  value={transactionForm.particulars}
                  onChange={(e) =>
                  setTransactionForm((p) => ({
                    ...p,
                    particulars: e.target.value
                  }))
                  }
                  placeholder="Brief description..."
                  error={formErrors.particulars} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Narration
                  </label>
                  <textarea
                  value={transactionForm.narration}
                  onChange={(e) =>
                  setTransactionForm((p) => ({
                    ...p,
                    narration: e.target.value
                  }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Additional details..." />

                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50">
              {transactionForm.amount &&
            parseFloat(transactionForm.amount) > 0 &&
            <div
              className={`mb-4 p-4 rounded-lg ${transactionForm.transactionType === 'receipt' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {transactionForm.transactionType === 'receipt' ?
                  <ArrowDownRight className="w-5 h-5 text-green-600" /> :

                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                  }
                        <span
                    className={`font-medium ${transactionForm.transactionType === 'receipt' ? 'text-green-700' : 'text-red-700'}`}>

                          {transactionForm.transactionType === 'receipt' ?
                    'Cash Receipt' :
                    'Cash Payment'}
                        </span>
                      </div>
                      <span
                  className={`text-2xl font-bold ${transactionForm.transactionType === 'receipt' ? 'text-green-700' : 'text-red-700'}`}>

                        {formatCurrency(parseFloat(transactionForm.amount))}
                      </span>
                    </div>
                  </div>
            }
              <div className="flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddTransactionModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  if (
                  !transactionForm.particulars ||
                  !transactionForm.amount)
                  {
                    setFormErrors({
                      particulars: !transactionForm.particulars ?
                      'Required' :
                      '',
                      amount: !transactionForm.amount ? 'Required' : ''
                    });
                    return;
                  }
                  setShowAddTransactionModal(false);
                  alert('Transaction saved!');
                }}
                disabled={isSubmitting}>

                  <Save className="w-4 h-4 mr-2" />
                  Save Transaction
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Help Section */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 print:hidden">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">
              Cash Book Guidelines
            </h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>
                • Select branches to view combined or individual cash book
              </li>
              <li>
                • Running balance auto-calculates: Opening + Receipts - Payments
              </li>
              <li>
                • Perform daily cash verification using the "Verify Cash" button
              </li>
              <li>• Export branch-wise reports in PDF or Excel format</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}
export default CashBook;