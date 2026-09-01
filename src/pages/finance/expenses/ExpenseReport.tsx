import React, { useCallback, useMemo, useState, Component } from 'react';
// File: src/pages/finance/reports/ExpenseReport.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Building2,
  CreditCard,
  Receipt,
  Calculator,
  Printer,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Share2,
  Mail,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle,
  Info,
  BarChart3,
  PieChart,
  DollarSign,
  Percent,
  Tag,
  User,
  Clock,
  MapPin,
  Hash,
  ExternalLink,
  Settings,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  FileCheck,
  Archive,
  Bookmark,
  Star,
  Flag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileWarning,
  Sparkles,
  Target,
  Wallet } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// --- Types ---
interface ExpenseRecord {
  id: string;
  voucherNo: string;
  date: string;
  vendor: string;
  vendorGSTIN?: string;
  vendorCategory?: string;
  head: string;
  category: string;
  description: string;
  baseAmount: number;
  gstRate: number;
  taxAmount: number;
  totalAmount: number;
  paidVia: string;
  paymentMode: 'cash' | 'online' | 'cheque' | 'upi' | 'card';
  chequeNo?: string;
  transactionId?: string;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  approvedBy: string;
  approvedDate: string;
  department: string;
  project?: string;
  invoiceNo?: string;
  hasReceipt: boolean;
  tags: string[];
  budgetCode?: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  nextDueDate?: string;
}
interface ReportSummary {
  totalRecords: number;
  totalExpenditure: number;
  totalTax: number;
  totalBase: number;
  paidAmount: number;
  pendingAmount: number;
  averageExpense: number;
  highestExpense: number;
  lowestExpense: number;
  mostUsedHead: string;
  mostUsedVendor: string;
}
interface FilterState {
  fromDate: string;
  toDate: string;
  expenseHead: string;
  vendor: string;
  paymentMode: string;
  status: string;
  department: string;
  minAmount: string;
  maxAmount: string;
  searchQuery: string;
  hasReceipt: string;
  tags: string[];
}
interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeSummary: boolean;
  pageOrientation: 'portrait' | 'landscape';
}
// --- Mock Data ---
const INITIAL_DATA: ExpenseRecord[] = [
{
  id: '1',
  voucherNo: 'VCH-2024-501',
  date: '2024-03-10',
  vendor: 'Global Electricity Corporation Ltd',
  vendorGSTIN: '29ABCDE1234F1Z5',
  vendorCategory: 'Utility Provider',
  head: 'Electricity',
  category: 'Utilities',
  description: 'Monthly electricity bill for March 2024 - Main Building',
  baseAmount: 12500,
  gstRate: 18,
  taxAmount: 2250,
  totalAmount: 14750,
  paidVia: 'HDFC Bank - Online Transfer',
  paymentMode: 'online',
  transactionId: 'UTR2024031012345',
  status: 'paid',
  approvedBy: 'Finance Head',
  approvedDate: '2024-03-10',
  department: 'Administration',
  invoiceNo: 'EB-MAR-2024',
  hasReceipt: true,
  tags: ['Utility', 'Recurring', 'GST'],
  budgetCode: 'BDG-UTL-2024',
  isRecurring: true,
  frequency: 'monthly',
  nextDueDate: '2024-04-10'
},
{
  id: '2',
  voucherNo: 'VCH-2024-502',
  date: '2024-03-12',
  vendor: 'Modern Stationery Hub Pvt Ltd',
  vendorGSTIN: '29FGHIJ5678K1L9',
  vendorCategory: 'Supplier',
  head: 'Office Supplies',
  category: 'Stationery',
  description: 'Office stationery bulk purchase - pens, paper, folders',
  baseAmount: 4500,
  gstRate: 18,
  taxAmount: 810,
  totalAmount: 5310,
  paidVia: 'Petty Cash - Admin Office',
  paymentMode: 'cash',
  status: 'paid',
  approvedBy: 'Admin Manager',
  approvedDate: '2024-03-12',
  department: 'Administration',
  invoiceNo: 'INV-MSH-8901',
  hasReceipt: true,
  tags: ['Stationery', 'GST', 'Approved'],
  budgetCode: 'BDG-ADM-2024',
  isRecurring: false
},
{
  id: '3',
  voucherNo: 'VCH-2024-503',
  date: '2024-03-15',
  vendor: 'Apex Maintenance Services',
  vendorCategory: 'Service Provider',
  head: 'Maintenance',
  category: 'Building Maintenance',
  description: 'Annual maintenance contract - HVAC systems servicing',
  baseAmount: 8000,
  gstRate: 0,
  taxAmount: 0,
  totalAmount: 8000,
  paidVia: 'Cheque - State Bank of India',
  paymentMode: 'cheque',
  chequeNo: 'CHQ-890123',
  status: 'pending',
  approvedBy: 'Principal',
  approvedDate: '2024-03-15',
  department: 'Facilities',
  invoiceNo: 'SRV-2024-315',
  hasReceipt: true,
  tags: ['Maintenance', 'AMC', 'Pending'],
  budgetCode: 'BDG-FAC-2024',
  isRecurring: true,
  frequency: 'yearly',
  nextDueDate: '2025-03-15'
},
{
  id: '4',
  voucherNo: 'VCH-2024-504',
  date: '2024-03-18',
  vendor: 'Bounty Catering & Events',
  vendorGSTIN: '29MNOPQ9012R3S4',
  vendorCategory: 'Caterer',
  head: 'Events',
  category: 'Functions & Events',
  description: 'Annual day celebration - catering for 500 people',
  baseAmount: 15000,
  gstRate: 18,
  taxAmount: 2700,
  totalAmount: 17700,
  paidVia: 'HDFC Bank - NEFT',
  paymentMode: 'online',
  transactionId: 'NEFT2024031812345',
  status: 'paid',
  approvedBy: 'Event Committee Head',
  approvedDate: '2024-03-18',
  department: 'Events',
  project: 'Annual Day 2024',
  invoiceNo: 'CAT-2024-318',
  hasReceipt: true,
  tags: ['Event', 'Catering', 'GST', 'Annual Day'],
  budgetCode: 'BDG-EVT-2024',
  isRecurring: false
},
{
  id: '5',
  voucherNo: 'VCH-2024-505',
  date: '2024-03-20',
  vendor: 'Tech Solutions Pvt Ltd',
  vendorGSTIN: '29TUVWX3456Y7Z8',
  vendorCategory: 'IT Services',
  head: 'IT Maintenance',
  category: 'Technology',
  description:
  'Computer lab maintenance - software updates and hardware repairs',
  baseAmount: 18000,
  gstRate: 18,
  taxAmount: 3240,
  totalAmount: 21240,
  paidVia: 'HDFC Bank - UPI',
  paymentMode: 'upi',
  transactionId: 'UPI2024032067890',
  status: 'paid',
  approvedBy: 'IT Head',
  approvedDate: '2024-03-20',
  department: 'IT Department',
  invoiceNo: 'TECH-SRV-320',
  hasReceipt: true,
  tags: ['IT', 'Maintenance', 'GST', 'Technology'],
  budgetCode: 'BDG-IT-2024',
  isRecurring: true,
  frequency: 'quarterly',
  nextDueDate: '2024-06-20'
},
{
  id: '6',
  voucherNo: 'VCH-2024-506',
  date: '2024-03-22',
  vendor: 'Municipal Water Board',
  vendorCategory: 'Government Utility',
  head: 'Water Bill',
  category: 'Utilities',
  description: 'Quarterly water charges - Q1 2024',
  baseAmount: 3500,
  gstRate: 0,
  taxAmount: 0,
  totalAmount: 3500,
  paidVia: 'HDFC Bank - Online',
  paymentMode: 'online',
  transactionId: 'WTR2024032212345',
  status: 'paid',
  approvedBy: 'Finance Head',
  approvedDate: '2024-03-22',
  department: 'Administration',
  invoiceNo: 'WB-Q1-2024',
  hasReceipt: true,
  tags: ['Utility', 'Water', 'Quarterly'],
  budgetCode: 'BDG-UTL-2024',
  isRecurring: true,
  frequency: 'quarterly',
  nextDueDate: '2024-06-22'
},
{
  id: '7',
  voucherNo: 'VCH-2024-507',
  date: '2024-03-25',
  vendor: 'Sports Equipment Warehouse',
  vendorGSTIN: '29SPORT1234X5Y6',
  vendorCategory: 'Supplier',
  head: 'Sports Equipment',
  category: 'Sports',
  description:
  'Cricket equipment - bats, balls, pads for inter-school tournament',
  baseAmount: 12000,
  gstRate: 18,
  taxAmount: 2160,
  totalAmount: 14160,
  paidVia: 'Petty Cash - Sports Department',
  paymentMode: 'cash',
  status: 'paid',
  approvedBy: 'Sports Coordinator',
  approvedDate: '2024-03-25',
  department: 'Physical Education',
  invoiceNo: 'SPT-EQ-325',
  hasReceipt: true,
  tags: ['Sports', 'Equipment', 'Tournament', 'GST'],
  budgetCode: 'BDG-SPT-2024',
  isRecurring: false
},
{
  id: '8',
  voucherNo: 'VCH-2024-508',
  date: '2024-03-28',
  vendor: 'Quick Transport Services',
  vendorGSTIN: '29TRANS7890A1B2',
  vendorCategory: 'Transport',
  head: 'Transportation',
  category: 'Logistics',
  description: 'Student field trip transportation - Science exhibition',
  baseAmount: 8500,
  gstRate: 5,
  taxAmount: 425,
  totalAmount: 8925,
  paidVia: 'HDFC Bank - Debit Card',
  paymentMode: 'card',
  transactionId: 'CARD2024032845678',
  status: 'paid',
  approvedBy: 'Vice Principal',
  approvedDate: '2024-03-28',
  department: 'Academic',
  project: 'Science Exhibition Trip',
  invoiceNo: 'TRN-2024-328',
  hasReceipt: true,
  tags: ['Transport', 'Field Trip', 'GST', 'Academic'],
  budgetCode: 'BDG-ACA-2024',
  isRecurring: false
}];

const EXPENSE_HEADS = [
{
  value: 'all',
  label: 'All Expense Heads'
},
{
  value: 'electricity',
  label: 'Electricity'
},
{
  value: 'maintenance',
  label: 'Maintenance'
},
{
  value: 'supplies',
  label: 'Office Supplies'
},
{
  value: 'events',
  label: 'Events & Functions'
},
{
  value: 'it',
  label: 'IT Maintenance'
},
{
  value: 'water',
  label: 'Water Bill'
},
{
  value: 'sports',
  label: 'Sports Equipment'
},
{
  value: 'transport',
  label: 'Transportation'
}];

const VENDORS = [
{
  value: 'all',
  label: 'All Vendors'
},
{
  value: 'global_elec',
  label: 'Global Electricity Corporation'
},
{
  value: 'modern_stat',
  label: 'Modern Stationery Hub'
},
{
  value: 'apex_maint',
  label: 'Apex Maintenance Services'
},
{
  value: 'bounty_cat',
  label: 'Bounty Catering & Events'
},
{
  value: 'tech_sol',
  label: 'Tech Solutions Pvt Ltd'
}];

const DEPARTMENTS = [
{
  value: 'all',
  label: 'All Departments'
},
{
  value: 'admin',
  label: 'Administration'
},
{
  value: 'facilities',
  label: 'Facilities'
},
{
  value: 'events',
  label: 'Events'
},
{
  value: 'it',
  label: 'IT Department'
},
{
  value: 'sports',
  label: 'Physical Education'
},
{
  value: 'academic',
  label: 'Academic'
}];

export function ExpenseReport(): JSX.Element {
  // --- State ---
  const [reportData] = useState<ExpenseRecord[]>(INITIAL_DATA);
  const [filters, setFilters] = useState<FilterState>({
    fromDate: '',
    toDate: '',
    expenseHead: 'all',
    vendor: 'all',
    paymentMode: 'all',
    status: 'all',
    department: 'all',
    minAmount: '',
    maxAmount: '',
    searchQuery: '',
    hasReceipt: 'all',
    tags: []
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeSummary: true,
    pageOrientation: 'landscape'
  });
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [viewingRecord, setViewingRecord] = useState<ExpenseRecord | null>(null);
  const [showSummaryPanel, setShowSummaryPanel] = useState<boolean>(true);
  const [chartView, setChartView] = useState<'pie' | 'bar' | 'line'>('pie');
  const [groupBy, setGroupBy] = useState<
    'head' | 'vendor' | 'department' | 'month'>(
    'head');
  // --- Filtered Data ---
  const filteredData = useMemo(() => {
    let data = [...reportData];
    // Date range filter
    if (filters.fromDate) {
      data = data.filter((item) => item.date >= filters.fromDate);
    }
    if (filters.toDate) {
      data = data.filter((item) => item.date <= filters.toDate);
    }
    // Expense head filter
    if (filters.expenseHead !== 'all') {
      data = data.filter((item) =>
      item.head.toLowerCase().includes(filters.expenseHead.toLowerCase())
      );
    }
    // Vendor filter
    if (filters.vendor !== 'all') {
      data = data.filter((item) =>
      item.vendor.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }
    // Payment mode filter
    if (filters.paymentMode !== 'all') {
      data = data.filter((item) => item.paymentMode === filters.paymentMode);
    }
    // Status filter
    if (filters.status !== 'all') {
      data = data.filter((item) => item.status === filters.status);
    }
    // Department filter
    if (filters.department !== 'all') {
      data = data.filter((item) =>
      item.department.
      toLowerCase().
      includes(filters.department.toLowerCase())
      );
    }
    // Amount range filter
    if (filters.minAmount) {
      data = data.filter(
        (item) => item.totalAmount >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      data = data.filter(
        (item) => item.totalAmount <= parseFloat(filters.maxAmount)
      );
    }
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
        item.voucherNo.toLowerCase().includes(query) ||
        item.vendor.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.invoiceNo?.toLowerCase().includes(query)
      );
    }
    // Receipt filter
    if (filters.hasReceipt === 'yes') {
      data = data.filter((item) => item.hasReceipt);
    } else if (filters.hasReceipt === 'no') {
      data = data.filter((item) => !item.hasReceipt);
    }
    // Sort data
    data.sort((a, b) => {
      let compareValue = 0;
      switch (sortColumn) {
        case 'date':
          compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          compareValue = a.totalAmount - b.totalAmount;
          break;
        case 'vendor':
          compareValue = a.vendor.localeCompare(b.vendor);
          break;
        case 'voucher':
          compareValue = a.voucherNo.localeCompare(b.voucherNo);
          break;
        default:
          compareValue = 0;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    return data;
  }, [reportData, filters, sortColumn, sortOrder]);
  // --- Summary Calculations ---
  const summary: ReportSummary = useMemo(() => {
    const totalRecords = filteredData.length;
    const totalExpenditure = filteredData.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const totalTax = filteredData.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalBase = totalExpenditure - totalTax;
    const paidAmount = filteredData.
    filter((item) => item.status === 'paid').
    reduce((sum, item) => sum + item.totalAmount, 0);
    const pendingAmount = filteredData.
    filter((item) => item.status === 'pending').
    reduce((sum, item) => sum + item.totalAmount, 0);
    const averageExpense =
    totalRecords > 0 ? totalExpenditure / totalRecords : 0;
    const amounts = filteredData.map((item) => item.totalAmount);
    const highestExpense = amounts.length > 0 ? Math.max(...amounts) : 0;
    const lowestExpense = amounts.length > 0 ? Math.min(...amounts) : 0;
    // Most used head
    const headCounts: Record<string, number> = {};
    filteredData.forEach((item) => {
      headCounts[item.head] = (headCounts[item.head] || 0) + 1;
    });
    const mostUsedHead = Object.keys(headCounts).reduce(
      (a, b) => headCounts[a] > headCounts[b] ? a : b,
      ''
    );
    // Most used vendor
    const vendorCounts: Record<string, number> = {};
    filteredData.forEach((item) => {
      vendorCounts[item.vendor] = (vendorCounts[item.vendor] || 0) + 1;
    });
    const mostUsedVendor = Object.keys(vendorCounts).reduce(
      (a, b) => vendorCounts[a] > vendorCounts[b] ? a : b,
      ''
    );
    return {
      totalRecords,
      totalExpenditure,
      totalTax,
      totalBase,
      paidAmount,
      pendingAmount,
      averageExpense,
      highestExpense,
      lowestExpense,
      mostUsedHead,
      mostUsedVendor
    };
  }, [filteredData]);
  // --- Handlers ---
  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortOrder('desc');
      }
    },
    [sortColumn]
  );
  const handleSelectRecord = useCallback((id: string) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  const handleSelectAll = useCallback(() => {
    if (selectedRecords.size === filteredData.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredData.map((item) => item.id)));
    }
  }, [filteredData, selectedRecords.size]);
  const resetFilters = useCallback(() => {
    setFilters({
      fromDate: '',
      toDate: '',
      expenseHead: 'all',
      vendor: 'all',
      paymentMode: 'all',
      status: 'all',
      department: 'all',
      minAmount: '',
      maxAmount: '',
      searchQuery: '',
      hasReceipt: 'all',
      tags: []
    });
  }, []);
  const handleExport = useCallback((format: 'pdf' | 'excel' | 'csv') => {
    setExportOptions((prev) => ({
      ...prev,
      format
    }));
    setShowExportDialog(true);
  }, []);
  const confirmExport = useCallback(() => {
    // Export logic here
    console.log('Exporting with options:', exportOptions);
    setShowExportDialog(false);
  }, [exportOptions]);
  // --- Table Columns ---
  const columns = useMemo(
    () => [
    {
      key: 'select',
      header:
      <input
        type="checkbox"
        checked={
        selectedRecords.size === filteredData.length &&
        filteredData.length > 0
        }
        onChange={handleSelectAll}
        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />,


      render: (row: ExpenseRecord) =>
      <input
        type="checkbox"
        checked={selectedRecords.has(row.id)}
        onChange={() => handleSelectRecord(row.id)}
        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />


    },
    {
      key: 'voucher',
      header:
      <button
        onClick={() => handleSort('voucher')}
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors">

            Voucher No
            {sortColumn === 'voucher' && (
        sortOrder === 'asc' ?
        <ChevronUp className="w-3 h-3" /> :

        <ChevronDown className="w-3 h-3" />)
        }
          </button>,

      render: (row: ExpenseRecord) =>
      <div className="space-y-1">
            <button
          onClick={() => setViewingRecord(row)}
          className="font-mono font-bold text-indigo-700 hover:text-indigo-900 hover:underline">

              {row.voucherNo}
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <Calendar className="w-3 h-3" />
              <span className="font-bold uppercase">{row.date}</span>
            </div>
            {row.invoiceNo &&
        <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <Hash className="w-2.5 h-2.5" />
                <span>{row.invoiceNo}</span>
              </div>
        }
          </div>

    },
    {
      key: 'vendor',
      header:
      <button
        onClick={() => handleSort('vendor')}
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors">

            Vendor Details
            {sortColumn === 'vendor' && (
        sortOrder === 'asc' ?
        <ChevronUp className="w-3 h-3" /> :

        <ChevronDown className="w-3 h-3" />)
        }
          </button>,

      render: (row: ExpenseRecord) =>
      <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-900">
                {row.vendor}
              </span>
            </div>
            {row.vendorGSTIN &&
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <FileCheck className="w-3 h-3" />
                <span className="font-mono">GSTIN: {row.vendorGSTIN}</span>
              </div>
        }
            {row.vendorCategory &&
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">
                {row.vendorCategory}
              </Badge>
        }
          </div>

    },
    {
      key: 'details',
      header: 'Expense Details',
      render: (row: ExpenseRecord) =>
      <div className="space-y-2 max-w-xs">
            <div className="flex items-center gap-2">
              <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-700 font-semibold text-xs">

                <Tag className="w-3 h-3 mr-1" />
                {row.head}
              </Badge>
              <span className="text-[9px] text-gray-400 uppercase">
                {row.category}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {row.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {row.tags.slice(0, 3).map((tag, index) =>
          <span
            key={index}
            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[8px] font-medium">

                  {tag}
                </span>
          )}
              {row.tags.length > 3 &&
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[8px] font-medium">
                  +{row.tags.length - 3}
                </span>
          }
            </div>
          </div>

    },
    {
      key: 'amounts',
      header:
      <button
        onClick={() => handleSort('amount')}
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors">

            Amounts
            {sortColumn === 'amount' && (
        sortOrder === 'asc' ?
        <ChevronUp className="w-3 h-3" /> :

        <ChevronDown className="w-3 h-3" />)
        }
          </button>,

      render: (row: ExpenseRecord) =>
      <div className="text-right space-y-1">
            <div className="text-sm font-black text-gray-900">
              ₹{row.totalAmount.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-500 space-y-0.5">
              <div className="flex justify-end items-center gap-1">
                <span>Base:</span>
                <span className="font-mono">
                  ₹{row.baseAmount.toLocaleString()}
                </span>
              </div>
              {row.taxAmount > 0 &&
          <div className="flex justify-end items-center gap-1">
                  <Percent className="w-2.5 h-2.5" />
                  <span>Tax ({row.gstRate}%):</span>
                  <span className="font-mono text-orange-600">
                    ₹{row.taxAmount.toLocaleString()}
                  </span>
                </div>
          }
            </div>
          </div>

    },
    {
      key: 'payment',
      header: 'Payment Info',
      render: (row: ExpenseRecord) =>
      <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">
                {row.paidVia}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
            variant="secondary"
            className={`text-[9px] px-2 py-0.5 ${row.paymentMode === 'online' ? 'bg-blue-100 text-blue-700' : row.paymentMode === 'cash' ? 'bg-green-100 text-green-700' : row.paymentMode === 'cheque' ? 'bg-purple-100 text-purple-700' : row.paymentMode === 'upi' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>

                {row.paymentMode.toUpperCase()}
              </Badge>
              {row.hasReceipt &&
          <Receipt className="w-3.5 h-3.5 text-green-500" />
          }
            </div>
            {(row.transactionId || row.chequeNo) &&
        <div className="text-[9px] text-gray-400 font-mono">
                {row.transactionId || row.chequeNo}
              </div>
        }
          </div>

    },
    {
      key: 'department',
      header: 'Department & Status',
      render: (row: ExpenseRecord) =>
      <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Layers className="w-3 h-3 text-gray-400" />
              <span>{row.department}</span>
            </div>
            {row.project &&
        <div className="text-[10px] text-gray-500">
                Project: {row.project}
              </div>
        }
            <Badge
          variant={
          row.status === 'paid' ?
          'success' :
          row.status === 'pending' ?
          'warning' :
          row.status === 'cancelled' ?
          'danger' :
          'secondary'
          }
          className="text-[9px]">

              {row.status.toUpperCase()}
            </Badge>
            {row.isRecurring &&
        <div className="flex items-center gap-1 text-[9px] text-purple-600">
                <RefreshCw className="w-2.5 h-2.5" />
                <span>{row.frequency}</span>
              </div>
        }
          </div>

    },
    {
      key: 'actions',
      header: '',
      render: (row: ExpenseRecord) =>
      <div className="flex items-center gap-1">
            <button
          onClick={() => setViewingRecord(row)}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
          title="View Details">

              <Eye className="w-4 h-4 text-indigo-600" />
            </button>
            <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="More Options">

              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

    }],

    [
    filteredData,
    selectedRecords,
    sortColumn,
    sortOrder,
    handleSort,
    handleSelectAll,
    handleSelectRecord]

  );
  // --- Get Status Badge ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success" className="text-xs">
            Paid
          </Badge>);

      case 'pending':
        return (
          <Badge variant="warning" className="text-xs">
            Pending
          </Badge>);

      case 'cancelled':
        return (
          <Badge variant="danger" className="text-xs">
            Cancelled
          </Badge>);

      case 'refunded':
        return (
          <Badge variant="secondary" className="text-xs">
            Refunded
          </Badge>);

      default:
        return null;
    }
  };
  return (
    <div className="space-y-6 max-w-[1800px] mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Receipt className="w-8 h-8 text-indigo-600" />
            </div>
            Detailed Expense Report
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Auditor's Ledger View
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
            onClick={() => handleExport('pdf')}>

            <FileText className="w-4 h-4 mr-2" />
            PDF Export
          </Button>
          <Button
            variant="outline"
            className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
            onClick={() => handleExport('excel')}>

            <Download className="w-4 h-4 mr-2" />
            Excel Export
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            CSV Export
          </Button>
          <Button variant="primary">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Summary Stats Cards */}
      {showSummaryPanel &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">
                  Total Expenditure
                </p>
                <p className="text-3xl font-black text-indigo-900 mt-2">
                  ₹{summary.totalExpenditure.toLocaleString()}
                </p>
                <p className="text-xs text-indigo-500 mt-1">
                  {summary.totalRecords} transactions
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-bold uppercase tracking-wide">
                  Paid Amount
                </p>
                <p className="text-3xl font-black text-green-900 mt-2">
                  ₹{summary.paidAmount.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {(
                summary.paidAmount / summary.totalExpenditure *
                100).
                toFixed(1)}
                  % of total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">
                  Pending Amount
                </p>
                <p className="text-3xl font-black text-orange-900 mt-2">
                  ₹{summary.pendingAmount.toLocaleString()}
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  Awaiting clearance
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">
                  Total Tax
                </p>
                <p className="text-3xl font-black text-purple-900 mt-2">
                  ₹{summary.totalTax.toLocaleString()}
                </p>
                <p className="text-xs text-purple-500 mt-1">GST component</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Percent className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Additional Insights */}
      {showSummaryPanel &&
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Average Expense
                </p>
                <p className="text-lg font-black text-gray-900">
                  ₹
                  {summary.averageExpense.toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Highest Expense
                </p>
                <p className="text-lg font-black text-gray-900">
                  ₹{summary.highestExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Lowest Expense
                </p>
                <p className="text-lg font-black text-gray-900">
                  ₹{summary.lowestExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Advanced Filter Panel */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Filter className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Report Filters
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

                {showAdvancedFilters ?
                <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Advanced
                  </> :

                <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Advanced
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

        <div className="p-6">
          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> From Date
              </label>
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  fromDate: e.target.value
                }))
                } />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3" /> To Date
              </label>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  toDate: e.target.value
                }))
                } />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Expense Head
              </label>
              <Select
                options={EXPENSE_HEADS}
                placeholder="All Heads"
                value={filters.expenseHead}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  expenseHead: e.target.value
                }))
                } />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Vendor
              </label>
              <Select
                options={VENDORS}
                placeholder="All Vendors"
                value={filters.vendor}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  vendor: e.target.value
                }))
                } />

            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Department
              </label>
              <Select
                options={DEPARTMENTS}
                placeholder="All Departments"
                value={filters.department}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  department: e.target.value
                }))
                } />

            </div>
          </div>

          {/* Secondary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by voucher, vendor, description, invoice..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                value={filters.searchQuery}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: e.target.value
                }))
                } />

            </div>
            <div>
              <Select
                options={[
                {
                  label: 'All Payment Modes',
                  value: 'all'
                },
                {
                  label: 'Cash',
                  value: 'cash'
                },
                {
                  label: 'Online',
                  value: 'online'
                },
                {
                  label: 'Cheque',
                  value: 'cheque'
                },
                {
                  label: 'UPI',
                  value: 'upi'
                },
                {
                  label: 'Card',
                  value: 'card'
                }]
                }
                placeholder="Payment Mode"
                value={filters.paymentMode}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentMode: e.target.value
                }))
                } />

            </div>
            <div>
              <Select
                options={[
                {
                  label: 'All Status',
                  value: 'all'
                },
                {
                  label: 'Paid',
                  value: 'paid'
                },
                {
                  label: 'Pending',
                  value: 'pending'
                },
                {
                  label: 'Cancelled',
                  value: 'cancelled'
                },
                {
                  label: 'Refunded',
                  value: 'refunded'
                }]
                }
                placeholder="Status"
                value={filters.status}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
                } />

            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-xl border animate-in fade-in">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Min Amount
                </label>
                <Input
                type="number"
                placeholder="₹ 0"
                value={filters.minAmount}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minAmount: e.target.value
                }))
                } />

              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Max Amount
                </label>
                <Input
                type="number"
                placeholder="₹ 999999"
                value={filters.maxAmount}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxAmount: e.target.value
                }))
                } />

              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Has Receipt
                </label>
                <Select
                options={[
                {
                  label: 'All Records',
                  value: 'all'
                },
                {
                  label: 'With Receipt',
                  value: 'yes'
                },
                {
                  label: 'Without Receipt',
                  value: 'no'
                }]
                }
                placeholder="Receipt Status"
                value={filters.hasReceipt}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  hasReceipt: e.target.value
                }))
                } />

              </div>
            </div>
          }

          {/* Filter Summary */}
          {(filters.fromDate ||
          filters.toDate ||
          filters.expenseHead !== 'all' ||
          filters.searchQuery) &&
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Info className="w-4 h-4" />
                <span>
                  Filters active - Showing {filteredData.length} of{' '}
                  {reportData.length} records
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

      {/* Bulk Actions */}
      {selectedRecords.size > 0 &&
      <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {selectedRecords.size} record(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRecords(new Set())}>

                Clear Selection
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Selected
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-1" />
                Email Report
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Main Data Table */}
      <Card className="overflow-hidden border-none shadow-2xl">
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredData} />
        </div>

        {/* Enhanced Auditor's Summary Footer */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Total Expenditure */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Calculator className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Total Expenditure
                </h4>
                <p className="text-4xl font-black text-white tracking-tighter">
                  ₹{summary.totalExpenditure.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {summary.totalRecords} transactions
                </p>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="grid grid-cols-2 gap-6 border-l border-white/10 pl-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Tax Component
                </p>
                <p className="text-2xl font-black text-purple-300">
                  ₹{summary.totalTax.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(
                  summary.totalTax / summary.totalExpenditure *
                  100).
                  toFixed(1)}
                  % of total
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Base Amount
                </p>
                <p className="text-2xl font-black text-blue-300">
                  ₹{summary.totalBase.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Before tax</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 border-l border-white/10 pl-8">
              <div>
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-2">
                  Paid
                </p>
                <p className="text-2xl font-black text-green-300">
                  ₹{summary.paidAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-2">
                  Pending
                </p>
                <p className="text-2xl font-black text-orange-300">
                  ₹{summary.pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">
                Most Used Head
              </p>
              <p className="text-sm font-bold text-white">
                {summary.mostUsedHead}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">
                Top Vendor
              </p>
              <p className="text-sm font-bold text-white">
                {summary.mostUsedVendor}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">
                Avg Transaction
              </p>
              <p className="text-sm font-bold text-white">
                ₹
                {summary.averageExpense.toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase mb-1">
                Completion Rate
              </p>
              <p className="text-sm font-bold text-white">
                {(
                summary.paidAmount / summary.totalExpenditure *
                100).
                toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meta Footer */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            Showing {filteredData.length} of {reportData.length} records
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-xs">Reconciled</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
              <span className="text-xs">Pending</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Archive className="w-4 h-4 mr-1" />
            Archive Report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 font-bold">

            View Detailed Ledger
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl border-none">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-600" />
                  Export Options
                </h2>
                <button
                onClick={() => setShowExportDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['pdf', 'excel', 'csv'].map((format) =>
                <button
                  key={format}
                  onClick={() =>
                  setExportOptions((prev) => ({
                    ...prev,
                    format: format as any
                  }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${exportOptions.format === format ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>

                      <span className="text-sm font-bold uppercase">
                        {format}
                      </span>
                    </button>
                )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">
                  Include
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeCharts: e.target.checked
                    }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                    <span className="text-sm text-gray-700">
                      Include charts and graphs
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={exportOptions.includeSummary}
                    onChange={(e) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeSummary: e.target.checked
                    }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                    <span className="text-sm text-gray-700">
                      Include summary statistics
                    </span>
                  </label>
                </div>
              </div>

              {exportOptions.format === 'pdf' &&
            <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['portrait', 'landscape'].map((orientation) =>
                <button
                  key={orientation}
                  onClick={() =>
                  setExportOptions((prev) => ({
                    ...prev,
                    pageOrientation: orientation as any
                  }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${exportOptions.pageOrientation === orientation ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>

                        <span className="text-sm font-bold capitalize">
                          {orientation}
                        </span>
                      </button>
                )}
                  </div>
                </div>
            }
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={confirmExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Detail View Modal */}
      {viewingRecord &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-4xl shadow-2xl border-none my-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Expense Details</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Voucher #{viewingRecord.voucherNo}
                    </p>
                  </div>
                </div>
                <button
                onClick={() => setViewingRecord(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Vendor Information
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <p className="font-bold text-gray-900">
                        {viewingRecord.vendor}
                      </p>
                      {viewingRecord.vendorGSTIN &&
                    <p className="text-xs text-gray-600 font-mono">
                          GSTIN: {viewingRecord.vendorGSTIN}
                        </p>
                    }
                      {viewingRecord.vendorCategory &&
                    <Badge variant="secondary" className="text-xs">
                          {viewingRecord.vendorCategory}
                        </Badge>
                    }
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Department & Project
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {viewingRecord.department}
                      </p>
                      {viewingRecord.project &&
                    <p className="text-xs text-gray-600">
                          Project: {viewingRecord.project}
                        </p>
                    }
                      {viewingRecord.budgetCode &&
                    <p className="text-xs text-gray-500 font-mono">
                          Budget: {viewingRecord.budgetCode}
                        </p>
                    }
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Amount Breakdown
                    </h3>
                    <div className="p-4 bg-indigo-50 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
                        <span className="text-sm text-gray-600">
                          Base Amount:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{viewingRecord.baseAmount.toLocaleString()}
                        </span>
                      </div>
                      {viewingRecord.taxAmount > 0 &&
                    <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
                          <span className="text-sm text-gray-600">
                            GST ({viewingRecord.gstRate}%):
                          </span>
                          <span className="text-lg font-bold text-orange-600">
                            ₹{viewingRecord.taxAmount.toLocaleString()}
                          </span>
                        </div>
                    }
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-indigo-900">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-black text-indigo-900">
                          ₹{viewingRecord.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Payment Information
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mode:</span>
                        <Badge variant="secondary">
                          {viewingRecord.paymentMode.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Via:</span>
                        <p className="font-medium mt-1">
                          {viewingRecord.paidVia}
                        </p>
                      </div>
                      {(viewingRecord.transactionId ||
                    viewingRecord.chequeNo) &&
                    <div className="text-xs text-gray-500 font-mono pt-2 border-t">
                          {viewingRecord.transactionId ||
                      viewingRecord.chequeNo}
                        </div>
                    }
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Description
                </h3>
                <p className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 leading-relaxed">
                  {viewingRecord.description}
                </p>
              </div>

              {/* Tags & Metadata */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingRecord.tags.map((tag, index) =>
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs">

                        {tag}
                      </Badge>
                  )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Status & Approvals
                  </h3>
                  <div className="space-y-2">
                    {getStatusBadge(viewingRecord.status)}
                    <div className="text-xs text-gray-600">
                      <p>
                        Approved by:{' '}
                        <span className="font-medium">
                          {viewingRecord.approvedBy}
                        </span>
                      </p>
                      <p>Date: {viewingRecord.approvedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Info */}
              {viewingRecord.isRecurring &&
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-bold text-purple-900">
                        Recurring Expense
                      </p>
                      <p className="text-sm text-purple-700">
                        Frequency: {viewingRecord.frequency} • Next due:{' '}
                        {viewingRecord.nextDueDate}
                      </p>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
              </div>
              <Button variant="primary" onClick={() => setViewingRecord(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}