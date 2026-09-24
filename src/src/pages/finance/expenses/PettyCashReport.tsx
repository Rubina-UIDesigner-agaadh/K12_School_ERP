import React, { useCallback, useMemo, useState, Fragment } from 'react';
// File: src/pages/finance/reports/PettyCashReport.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  BookOpen,
  Download,
  Printer,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Search,
  Filter,
  Calendar,
  MoreHorizontal,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Eye,
  X,
  Info,
  RefreshCw,
  FileText,
  User,
  Clock,
  Hash,
  ArrowLeftRight,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  Building2,
  Shield,
  Lock,
  Unlock,
  Star,
  Flag,
  Tag,
  FileSpreadsheet,
  Mail,
  Share2,
  Settings,
  Layers,
  Zap,
  Database,
  History,
  Sparkles,
  AlertTriangle,
  XCircle } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// --- Types ---
interface Transaction {
  id: number;
  date: string;
  desc: string;
  description: string;
  category: string;
  in: number;
  out: number;
  ref: string;
  balance: number;
  recordedBy: string;
  recordedAt: string;
  location: string;
  paymentMode: 'cash' | 'bank' | 'return' | 'transfer';
  status: 'verified' | 'pending' | 'flagged';
  receiptUrl?: string;
  tags: string[];
  approvedBy?: string;
  notes?: string;
}
interface LocationData {
  label: string;
  value: string;
  code: string;
  custodian: string;
  openingBalance: number;
  currentBalance: number;
  lastReconciled: string;
  status: 'active' | 'low' | 'inactive';
  limit: number;
}
interface SummaryStats {
  totalIn: number;
  totalOut: number;
  currentBalance: number;
  openingBalance: number;
  transactionCount: number;
  verifiedCount: number;
  pendingCount: number;
  flaggedCount: number;
  avgTransactionSize: number;
  largestIn: number;
  largestOut: number;
  lastTransaction: string;
}
interface FilterState {
  dateFrom: string;
  dateTo: string;
  category: string;
  status: string;
  minAmount: string;
  maxAmount: string;
  searchQuery: string;
  transactionType: 'all' | 'in' | 'out';
}
// --- Mock Data ---
const LOCATIONS: LocationData[] = [
{
  label: 'Main Safe (Admin Block)',
  value: 'main_safe',
  code: 'MS-001',
  custodian: 'Ms. Anjali Sharma',
  openingBalance: 50000,
  currentBalance: 21550,
  lastReconciled: '2024-03-25',
  status: 'active',
  limit: 100000
},
{
  label: 'Reception Petty Cash Desk',
  value: 'reception',
  code: 'RC-002',
  custodian: 'Mr. Rajesh Kumar',
  openingBalance: 10000,
  currentBalance: 4500,
  lastReconciled: '2024-03-24',
  status: 'low',
  limit: 20000
},
{
  label: 'Sports Department Box',
  value: 'sports_dept',
  code: 'SP-003',
  custodian: 'Coach Rohan',
  openingBalance: 5000,
  currentBalance: 3200,
  lastReconciled: '2024-03-20',
  status: 'active',
  limit: 10000
},
{
  label: 'IT Lab Petty Cash',
  value: 'it_lab',
  code: 'IT-004',
  custodian: 'Mr. David Wilson',
  openingBalance: 8000,
  currentBalance: 5800,
  lastReconciled: '2024-03-22',
  status: 'active',
  limit: 15000
},
{
  label: 'Library Cash Box',
  value: 'library',
  code: 'LB-005',
  custodian: 'Ms. Priya Menon',
  openingBalance: 3000,
  currentBalance: 850,
  lastReconciled: '2024-03-18',
  status: 'low',
  limit: 5000
}];

const CATEGORIES = [
{
  value: 'all',
  label: 'All Categories'
},
{
  value: 'replenishment',
  label: 'Replenishment'
},
{
  value: 'expense',
  label: 'Expense Payment'
},
{
  value: 'return',
  label: 'Cash Return'
},
{
  value: 'opening',
  label: 'Opening Balance'
},
{
  value: 'transfer',
  label: 'Transfer'
},
{
  value: 'advance',
  label: 'Advance Issue'
}];

const RAW_TRANSACTIONS: Omit<Transaction, 'balance'>[] = [
{
  id: 1,
  date: '2024-03-01',
  desc: 'Opening Balance - March 2024',
  description: 'Opening balance carried forward from February',
  category: 'opening',
  in: 10000,
  out: 0,
  ref: 'OB-MAR-001',
  recordedBy: 'System',
  recordedAt: '2024-03-01 09:00 AM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  tags: ['Opening', 'System Generated'],
  approvedBy: 'Finance Head'
},
{
  id: 2,
  date: '2024-03-05',
  desc: 'Cash Issued to Coach Rohan',
  description: 'Petty cash advance for sports equipment purchase',
  category: 'advance',
  in: 0,
  out: 500,
  ref: 'PC-ADV-101',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-05 11:30 AM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Sports', 'Advance', 'Staff'],
  approvedBy: 'Admin Manager',
  notes: 'To purchase cricket equipment for inter-school tournament'
},
{
  id: 3,
  date: '2024-03-08',
  desc: 'Stationery Purchase - Office Depot',
  description: 'Office supplies - pens, notebooks, folders for admin office',
  category: 'expense',
  in: 0,
  out: 1250,
  ref: 'PC-EXP-102',
  recordedBy: 'Mr. Rajesh Kumar',
  recordedAt: '2024-03-08 02:15 PM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Stationery', 'Office', 'Verified'],
  approvedBy: 'Admin Manager'
},
{
  id: 4,
  date: '2024-03-10',
  desc: 'Replenishment from Bank',
  description: 'Cash withdrawal from HDFC Bank account via cheque #4421',
  category: 'replenishment',
  in: 15000,
  out: 0,
  ref: 'BANK-RPL-099',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-10 10:45 AM',
  location: 'main_safe',
  paymentMode: 'bank',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Bank', 'Replenishment', 'Cheque'],
  approvedBy: 'Finance Head',
  notes: 'Cheque #4421 cleared on 2024-03-11'
},
{
  id: 5,
  date: '2024-03-12',
  desc: 'Unused Cash Returned by Mr. David',
  description: 'Return of unused advance amount for IT equipment',
  category: 'return',
  in: 300,
  out: 0,
  ref: 'RET-ADV-004',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-12 04:30 PM',
  location: 'main_safe',
  paymentMode: 'return',
  status: 'verified',
  tags: ['Return', 'IT Department', 'Staff'],
  approvedBy: 'Admin Manager'
},
{
  id: 6,
  date: '2024-03-15',
  desc: 'Electric Repair Services',
  description:
  'Emergency electrical repair in Class 8A - junction box replacement',
  category: 'expense',
  in: 0,
  out: 2200,
  ref: 'PC-EXP-103',
  recordedBy: 'Mr. Rajesh Kumar',
  recordedAt: '2024-03-15 05:45 PM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Maintenance', 'Emergency', 'Electrical'],
  approvedBy: 'Facilities Manager',
  notes: 'Vendor: Quick Fix Electricals, Bill #EL-890'
},
{
  id: 7,
  date: '2024-03-18',
  desc: 'Refreshments for Parent Meeting',
  description:
  'Tea, snacks and water bottles for quarterly parent-teacher meeting',
  category: 'expense',
  in: 0,
  out: 850,
  ref: 'PC-EXP-104',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-18 09:20 AM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Refreshments', 'Event', 'Meeting'],
  approvedBy: 'Principal'
},
{
  id: 8,
  date: '2024-03-20',
  desc: 'Transport Advance - Field Trip',
  description: 'Transport advance for Grade 10 science exhibition field trip',
  category: 'advance',
  in: 0,
  out: 3500,
  ref: 'PC-ADV-105',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-20 01:15 PM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'pending',
  tags: ['Transport', 'Field Trip', 'Academic'],
  approvedBy: 'Vice Principal',
  notes: 'To be settled by 2024-03-25 with receipts'
},
{
  id: 9,
  date: '2024-03-22',
  desc: 'Cleaning Supplies Purchase',
  description: 'Floor cleaner, sanitizer, and cleaning equipment',
  category: 'expense',
  in: 0,
  out: 680,
  ref: 'PC-EXP-106',
  recordedBy: 'Mr. Rajesh Kumar',
  recordedAt: '2024-03-22 03:40 PM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'verified',
  receiptUrl: '#',
  tags: ['Cleaning', 'Supplies', 'Maintenance'],
  approvedBy: 'Facilities Manager'
},
{
  id: 10,
  date: '2024-03-24',
  desc: 'Printer Cartridge - Urgent Purchase',
  description: 'HP ink cartridge for admin office printer',
  category: 'expense',
  in: 0,
  out: 1200,
  ref: 'PC-EXP-107',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-24 11:00 AM',
  location: 'main_safe',
  paymentMode: 'cash',
  status: 'flagged',
  receiptUrl: '#',
  tags: ['IT', 'Stationery', 'Urgent'],
  notes: 'Receipt quality poor - needs verification'
},
{
  id: 11,
  date: '2024-03-25',
  desc: 'Cash Transfer to Reception Desk',
  description: 'Internal transfer to replenish reception petty cash',
  category: 'transfer',
  in: 0,
  out: 2000,
  ref: 'TRF-INT-008',
  recordedBy: 'Ms. Anjali Sharma',
  recordedAt: '2024-03-25 09:30 AM',
  location: 'main_safe',
  paymentMode: 'transfer',
  status: 'verified',
  tags: ['Transfer', 'Internal', 'Reception'],
  approvedBy: 'Finance Head'
}];

export function PettyCashReport(): JSX.Element {
  // --- State ---
  const [selectedLocation, setSelectedLocation] = useState<string>('main_safe');
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    category: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    searchQuery: '',
    transactionType: 'all'
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] =
  useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  // --- Get Current Location Data ---
  const currentLocationData = useMemo(() => {
    return LOCATIONS.find((loc) => loc.value === selectedLocation);
  }, [selectedLocation]);
  // --- Calculate Running Balance & Filter Data ---
  const reportData = useMemo(() => {
    let balance = currentLocationData?.openingBalance || 0;
    // Filter transactions
    let filtered = RAW_TRANSACTIONS.filter(
      (tx) => tx.location === selectedLocation
    );
    // Apply filters
    if (filters.dateFrom) {
      filtered = filtered.filter((tx) => tx.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((tx) => tx.date <= filters.dateTo);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter((tx) => tx.category === filters.category);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter((tx) => tx.status === filters.status);
    }
    if (filters.minAmount) {
      filtered = filtered.filter((tx) => {
        const amount = tx.in > 0 ? tx.in : tx.out;
        return amount >= parseFloat(filters.minAmount);
      });
    }
    if (filters.maxAmount) {
      filtered = filtered.filter((tx) => {
        const amount = tx.in > 0 ? tx.in : tx.out;
        return amount <= parseFloat(filters.maxAmount);
      });
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
        tx.desc.toLowerCase().includes(query) ||
        tx.description.toLowerCase().includes(query) ||
        tx.ref.toLowerCase().includes(query) ||
        tx.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    if (filters.transactionType !== 'all') {
      if (filters.transactionType === 'in') {
        filtered = filtered.filter((tx) => tx.in > 0);
      } else {
        filtered = filtered.filter((tx) => tx.out > 0);
      }
    }
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const aAmount = a.in > 0 ? a.in : a.out;
        const bAmount = b.in > 0 ? b.in : b.out;
        return sortOrder === 'asc' ? aAmount - bAmount : bAmount - aAmount;
      }
    });
    // Calculate running balance
    return filtered.map((tx) => {
      balance = balance + tx.in - tx.out;
      return {
        ...tx,
        balance
      };
    });
  }, [selectedLocation, filters, sortBy, sortOrder, currentLocationData]);
  // --- Summary Statistics ---
  const summary: SummaryStats = useMemo(() => {
    const totalIn = reportData.reduce((sum, tx) => sum + tx.in, 0);
    const totalOut = reportData.reduce((sum, tx) => sum + tx.out, 0);
    const currentBalance =
    reportData[reportData.length - 1]?.balance ||
    currentLocationData?.openingBalance ||
    0;
    const openingBalance = currentLocationData?.openingBalance || 0;
    const transactionCount = reportData.length;
    const verifiedCount = reportData.filter(
      (tx) => tx.status === 'verified'
    ).length;
    const pendingCount = reportData.filter(
      (tx) => tx.status === 'pending'
    ).length;
    const flaggedCount = reportData.filter(
      (tx) => tx.status === 'flagged'
    ).length;
    const amounts = reportData.map((tx) => tx.in > 0 ? tx.in : tx.out);
    const avgTransactionSize =
    amounts.length > 0 ?
    amounts.reduce((a, b) => a + b, 0) / amounts.length :
    0;
    const largestIn = Math.max(...reportData.map((tx) => tx.in), 0);
    const largestOut = Math.max(...reportData.map((tx) => tx.out), 0);
    const lastTransaction =
    reportData.length > 0 ? reportData[reportData.length - 1].date : 'N/A';
    return {
      totalIn,
      totalOut,
      currentBalance,
      openingBalance,
      transactionCount,
      verifiedCount,
      pendingCount,
      flaggedCount,
      avgTransactionSize,
      largestIn,
      largestOut,
      lastTransaction
    };
  }, [reportData, currentLocationData]);
  // --- Handlers ---
  const handleSort = useCallback(
    (column: 'date' | 'amount') => {
      if (sortBy === column) {
        setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(column);
        setSortOrder('asc');
      }
    },
    [sortBy]
  );
  const toggleRowExpand = useCallback((id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  const handleTransactionClick = useCallback((tx: Transaction) => {
    setSelectedTransaction(tx);
    setShowTransactionDetail(true);
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      category: 'all',
      status: 'all',
      minAmount: '',
      maxAmount: '',
      searchQuery: '',
      transactionType: 'all'
    });
  }, []);
  // --- Get Status Badge ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="success" className="text-[9px]">
            Verified
          </Badge>);

      case 'pending':
        return (
          <Badge variant="warning" className="text-[9px]">
            Pending
          </Badge>);

      case 'flagged':
        return (
          <Badge variant="danger" className="text-[9px]">
            Flagged
          </Badge>);

      default:
        return null;
    }
  };
  // --- Get Category Icon ---
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'replenishment':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-blue-500" />;
      case 'expense':
        return <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />;
      case 'return':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-green-500" />;
      case 'transfer':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-purple-500" />;
      case 'opening':
        return <Layers className="w-3.5 h-3.5 text-gray-500" />;
      case 'advance':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-gray-400" />;
    }
  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            Petty Cash Audit Trail
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Detailed ledger of cash movements across physical locations with
            real-time reconciliation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'}`}>

              <FileText className="w-4 h-4 mr-1 inline" />
              Table
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'timeline' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'}`}>

              <Activity className="w-4 h-4 mr-1 inline" />
              Timeline
            </button>
          </div>
          <Button variant="outline" className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="bg-white">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setShowExportOptions(!showExportOptions)}>

              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            {showExportOptions &&
            <Card className="absolute right-0 mt-2 p-2 shadow-xl z-10 min-w-[180px]">
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  Export as PDF
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-500" />
                  Export as Excel
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-500" />
                  Export as CSV
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Report
                </button>
              </Card>
            }
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Location Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase">
                Current Location
              </p>
              <p className="text-lg font-black text-emerald-900 mt-1">
                {currentLocationData?.label}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Custodian: {currentLocationData?.custodian}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">
                Opening Balance
              </p>
              <p className="text-2xl font-black text-blue-900 mt-1">
                ₹{summary.openingBalance.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">As of March 1, 2024</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-bold uppercase">
                Total Transactions
              </p>
              <p className="text-2xl font-black text-purple-900 mt-1">
                {summary.transactionCount}
              </p>
              <div className="flex gap-2 mt-1">
                <Badge variant="success" className="text-[8px]">
                  {summary.verifiedCount} Verified
                </Badge>
                {summary.flaggedCount > 0 &&
                <Badge variant="danger" className="text-[8px]">
                    {summary.flaggedCount} Flagged
                  </Badge>
                }
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-bold uppercase">
                Last Reconciled
              </p>
              <p className="text-lg font-black text-amber-900 mt-1">
                {currentLocationData?.lastReconciled}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Code: {currentLocationData?.code}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Filters */}
      <Card className="overflow-hidden shadow-lg">
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Filter className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Report Filters & Controls
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}>

                {showFilters ?
                <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Filters
                  </> :

                <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Filters
                  </>
                }
              </Button>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Cash Box Location
              </label>
              <Select
                value={selectedLocation}
                options={LOCATIONS.map((loc) => ({
                  value: loc.value,
                  label: loc.label
                }))}
                onChange={(e) => setSelectedLocation(e.target.value)} />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> From Date
              </label>
              <Input
                type="date"
                className="bg-white"
                value={filters.dateFrom}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateFrom: e.target.value
                }))
                } />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> To Date
              </label>
              <Input
                type="date"
                className="bg-white"
                value={filters.dateTo}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateTo: e.target.value
                }))
                } />

            </div>
            <div className="flex items-end">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Search className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters &&
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t animate-in fade-in">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Category
                </label>
                <Select
                options={CATEGORIES}
                value={filters.category}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value
                }))
                } />

              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Status
                </label>
                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'verified',
                  label: 'Verified'
                },
                {
                  value: 'pending',
                  label: 'Pending'
                },
                {
                  value: 'flagged',
                  label: 'Flagged'
                }]
                }
                value={filters.status}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
                } />

              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Transaction Type
                </label>
                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'in',
                  label: 'Cash In Only'
                },
                {
                  value: 'out',
                  label: 'Cash Out Only'
                }]
                }
                value={filters.transactionType}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  transactionType: e.target.value as any
                }))
                } />

              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Search
                </label>
                <Input
                placeholder="Search transactions..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                value={filters.searchQuery}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: e.target.value
                }))
                } />

              </div>
            </div>
          }

          {/* Filter Summary */}
          {(filters.dateFrom ||
          filters.dateTo ||
          filters.category !== 'all' ||
          filters.searchQuery) &&
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Info className="w-4 h-4" />
                <span>
                  Filters active - Showing {reportData.length} transaction(s)
                </span>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-blue-600">

                Clear All
              </Button>
            </div>
          }
        </div>
      </Card>

      {/* Summary Highlight Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Cash In
              </p>
              <h3 className="text-3xl font-black text-blue-600 mt-2">
                ₹{summary.totalIn.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {reportData.filter((tx) => tx.in > 0).length} transaction(s)
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <ArrowDownLeft className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Cash Out
              </p>
              <h3 className="text-3xl font-black text-orange-600 mt-2">
                ₹{summary.totalOut.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {reportData.filter((tx) => tx.out > 0).length} transaction(s)
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <ArrowUpRight className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-600 to-green-600 shadow-xl text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                Current Balance
              </p>
              <h3 className="text-3xl font-black mt-2">
                ₹{summary.currentBalance.toLocaleString()}
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                As of {summary.lastTransaction}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Avg Transaction
              </p>
              <h3 className="text-3xl font-black text-purple-600 mt-2">
                ₹
                {summary.avgTransactionSize.toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}
              </h3>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  High: ₹
                  {Math.max(
                    summary.largestIn,
                    summary.largestOut
                  ).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Grid / Timeline */}
      <Card className="overflow-hidden shadow-2xl">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Transaction Ledger
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === 'date' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

              Sort by Date
              {sortBy === 'date' && (
              sortOrder === 'asc' ?
              <ChevronUp className="w-3 h-3 inline ml-1" /> :

              <ChevronDown className="w-3 h-3 inline ml-1" />)
              }
            </button>
            <button
              onClick={() => handleSort('amount')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === 'amount' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>

              Sort by Amount
              {sortBy === 'amount' && (
              sortOrder === 'asc' ?
              <ChevronUp className="w-3 h-3 inline ml-1" /> :

              <ChevronDown className="w-3 h-3 inline ml-1" />)
              }
            </button>
            <Badge variant="secondary" className="text-xs">
              {reportData.length} Records
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600" />

                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-left">
                  Date
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-left">
                  Transaction Details
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-center">
                  Category
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Cash In (+)
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Cash Out (-)
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Running Balance
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-center">
                  Status
                </th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {reportData.map((tx) =>
              <Fragment key={tx.id}>
                  <tr
                  className={`hover:bg-emerald-50/30 transition-all group ${expandedRows.has(tx.id) ? 'bg-emerald-50/50' : ''}`}>

                    <td className="p-4">
                      <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600" />

                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                        onClick={() => toggleRowExpand(tx.id)}
                        className="p-1 hover:bg-gray-100 rounded">

                          {expandedRows.has(tx.id) ?
                        <ChevronDown className="w-4 h-4 text-gray-400" /> :

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                        </button>
                        <div>
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(tx.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                          </span>
                          <p className="text-[9px] text-gray-400">
                            {tx.recordedAt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                      onClick={() => handleTransactionClick(tx)}
                      className="text-left hover:text-emerald-600">

                        <p className="text-sm font-bold text-gray-900">
                          {tx.desc}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[9px] text-gray-400 font-mono">
                            Ref: {tx.ref}
                          </p>
                          {tx.receiptUrl &&
                        <Receipt className="w-3 h-3 text-green-500" />
                        }
                        </div>
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getCategoryIcon(tx.category)}
                        <span className="text-xs capitalize">
                          {tx.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {tx.in > 0 ?
                    <div className="space-y-0.5">
                          <span className="text-base font-black text-blue-600">
                            + ₹{tx.in.toLocaleString()}
                          </span>
                          <p className="text-[9px] text-blue-500 uppercase">
                            {tx.paymentMode}
                          </p>
                        </div> :

                    <span className="text-gray-300 text-sm">—</span>
                    }
                    </td>
                    <td className="p-4 text-right">
                      {tx.out > 0 ?
                    <div className="space-y-0.5">
                          <span className="text-base font-black text-orange-600">
                            - ₹{tx.out.toLocaleString()}
                          </span>
                          <p className="text-[9px] text-orange-500 uppercase">
                            {tx.paymentMode}
                          </p>
                        </div> :

                    <span className="text-gray-300 text-sm">—</span>
                    }
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                        ₹{tx.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="p-4">
                      <button
                      onClick={() => handleTransactionClick(tx)}
                      className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">

                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRows.has(tx.id) &&
                <tr className="bg-gray-50">
                      <td colSpan={9} className="px-8 py-4">
                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Recorded By
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-400" />
                              <p className="text-sm font-medium text-gray-900">
                                {tx.recordedBy}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Approved By
                            </p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <p className="text-sm font-medium text-gray-900">
                                {tx.approvedBy || 'Pending'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {tx.tags.map((tag, index) =>
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-[8px]">

                                  {tag}
                                </Badge>
                          )}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Additional Notes
                            </p>
                            <p className="text-xs text-gray-600 italic">
                              {tx.notes || 'No additional notes'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-gray-900 text-white">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                Closing Balance
              </p>
              <p className="text-4xl font-black text-emerald-400">
                ₹{summary.currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                Net Movement
              </p>
              <p className="text-4xl font-black text-white">
                {summary.totalIn - summary.totalOut >= 0 ? '+' : '-'}₹
                {Math.abs(summary.totalIn - summary.totalOut).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                Verification Status
              </p>
              <p className="text-4xl font-black text-blue-400">
                {(
                summary.verifiedCount / summary.transactionCount *
                100).
                toFixed(0)}
                %
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-medium text-gray-400">
            <span>Report Generated: {new Date().toLocaleString('en-IN')}</span>
            <div className="flex gap-8">
              <span>Audit Verified: _____________</span>
              <span>Custodian Signature: _____________</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Insights & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Info className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-2">
                Accounting Note
              </h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                This report reflects only physical cash transactions within the{' '}
                <strong>{currentLocationData?.label}</strong>. For bank-to-bank
                scholarship transfers, please refer to the{' '}
                <strong>Scholarship Activities Report</strong>. All amounts are
                in INR and reconciled daily.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Quick Insights</h3>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Current utilization:{' '}
                    {(
                    summary.currentBalance / (
                    currentLocationData?.limit || 1) *
                    100).
                    toFixed(1)}
                    % of limit
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Last transaction: {summary.lastTransaction}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {summary.pendingCount} transaction(s) awaiting verification
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Detail Modal */}
      {showTransactionDetail && selectedTransaction &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-3xl shadow-2xl border-none my-8">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Receipt className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Transaction Details</h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      Reference: {selectedTransaction.ref}
                    </p>
                  </div>
                </div>
                <button
                onClick={() => setShowTransactionDetail(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Transaction Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-xs text-blue-600 font-bold uppercase">
                    Amount In
                  </p>
                  <p className="text-2xl font-black text-blue-900 mt-1">
                    {selectedTransaction.in > 0 ?
                  `+₹${selectedTransaction.in.toLocaleString()}` :
                  '—'}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <p className="text-xs text-orange-600 font-bold uppercase">
                    Amount Out
                  </p>
                  <p className="text-2xl font-black text-orange-900 mt-1">
                    {selectedTransaction.out > 0 ?
                  `-₹${selectedTransaction.out.toLocaleString()}` :
                  '—'}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <p className="text-xs text-emerald-600 font-bold uppercase">
                    Balance After
                  </p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    ₹{selectedTransaction.balance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Category & Mode
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {selectedTransaction.category}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {selectedTransaction.paymentMode}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTransaction.tags.map((tag, index) =>
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs">

                          {tag}
                        </Badge>
                    )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recorded By:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.recordedBy}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recorded At:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.recordedAt}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Approved By:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.approvedBy || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                  </div>

                  {selectedTransaction.notes &&
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="text-xs font-bold text-amber-900 uppercase mb-2">
                        Additional Notes
                      </h4>
                      <p className="text-sm text-amber-700 italic">
                        {selectedTransaction.notes}
                      </p>
                    </div>
                }
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex gap-2">
                {selectedTransaction.receiptUrl &&
              <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Receipt
                  </Button>
              }
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <Button
              variant="primary"
              onClick={() => setShowTransactionDetail(false)}>

                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}