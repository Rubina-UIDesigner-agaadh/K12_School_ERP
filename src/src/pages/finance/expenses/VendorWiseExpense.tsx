import React, { useMemo, useState, Fragment } from 'react';
// src/features/expenses/components/VendorWiseExpense.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Building2,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Users,
  FileText,
  Download,
  Wallet,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Activity,
  BarChart3,
  PieChart,
  Percent,
  RefreshCw,
  X,
  Eye,
  TrendingDown,
  MinusCircle,
  FileSpreadsheet,
  Printer,
  Share2,
  Info,
  Target,
  Zap,
  Star,
  Award,
  ShoppingCart,
  Package,
  Receipt,
  ArrowDownRight } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// --- Enhanced Types ---
interface VendorData {
  id: string;
  vendorName: string;
  category: string;
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  lastPayment: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  transactionCount?: number;
  averageInvoiceAmount?: number;
  firstTransactionDate?: string;
  lastInvoiceDate?: string;
  rating?: number;
  gstNumber?: string;
  panNumber?: string;
  creditPeriod?: number;
  discountReceived?: number;
  status?: 'Active' | 'On Hold' | 'Suspended';
  paymentHistory?: {
    month: string;
    amount: number;
  }[];
}
interface FilterState {
  searchQuery: string;
  category: string;
  status: string;
  paymentStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
// --- Enhanced Mock Data with Complete Information ---
const VENDOR_DATA: VendorData[] = [
{
  id: 'v1',
  vendorName: 'Global Electricity Corporation Ltd.',
  category: 'Utilities',
  totalBilled: 450000,
  totalPaid: 450000,
  totalPending: 0,
  lastPayment: '2024-03-28',
  contactPerson: 'Mr. Rajesh Kumar',
  email: 'billing@globalelec.com',
  phone: '+91-98765-43210',
  address: 'Sector 45, Industrial Area, New Delhi',
  paymentTerms: 'Net 30',
  transactionCount: 12,
  averageInvoiceAmount: 37500,
  firstTransactionDate: '2023-04-01',
  lastInvoiceDate: '2024-03-25',
  rating: 5,
  gstNumber: '07AAAAA1234A1Z5',
  panNumber: 'AAAAA1234A',
  creditPeriod: 30,
  discountReceived: 0,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 38000
  },
  {
    month: 'Feb',
    amount: 36500
  },
  {
    month: 'Mar',
    amount: 37500
  }]

},
{
  id: 'v2',
  vendorName: 'Modern Stationery Hub Pvt. Ltd.',
  category: 'Supplies',
  totalBilled: 185000,
  totalPaid: 145000,
  totalPending: 40000,
  lastPayment: '2024-03-18',
  contactPerson: 'Ms. Priya Sharma',
  email: 'sales@modernstationery.com',
  phone: '+91-98765-11111',
  address: 'Nehru Place, New Delhi',
  paymentTerms: 'Net 15',
  transactionCount: 24,
  averageInvoiceAmount: 7708,
  firstTransactionDate: '2023-01-15',
  lastInvoiceDate: '2024-03-20',
  rating: 4,
  gstNumber: '07BBBBB5678B2Z5',
  panNumber: 'BBBBB5678B',
  creditPeriod: 15,
  discountReceived: 5500,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 15000
  },
  {
    month: 'Feb',
    amount: 18000
  },
  {
    month: 'Mar',
    amount: 12000
  }]

},
{
  id: 'v3',
  vendorName: 'Apex Maintenance & Services Co.',
  category: 'Maintenance',
  totalBilled: 320000,
  totalPaid: 160000,
  totalPending: 160000,
  lastPayment: '2024-02-28',
  contactPerson: 'Mr. Amit Verma',
  email: 'operations@apexmaintenance.com',
  phone: '+91-98765-22222',
  address: 'Connaught Place, New Delhi',
  paymentTerms: 'Net 45',
  transactionCount: 8,
  averageInvoiceAmount: 40000,
  firstTransactionDate: '2023-06-01',
  lastInvoiceDate: '2024-03-15',
  rating: 3,
  gstNumber: '07CCCCC9012C3Z5',
  panNumber: 'CCCCC9012C',
  creditPeriod: 45,
  discountReceived: 0,
  status: 'On Hold',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 40000
  },
  {
    month: 'Feb',
    amount: 40000
  },
  {
    month: 'Mar',
    amount: 80000
  }]

},
{
  id: 'v4',
  vendorName: 'Bounty Events & Catering Services',
  category: 'Events',
  totalBilled: 510000,
  totalPaid: 480000,
  totalPending: 30000,
  lastPayment: '2024-03-25',
  contactPerson: 'Ms. Neha Singh',
  email: 'events@bountycatering.com',
  phone: '+91-98765-33333',
  address: 'Saket, New Delhi',
  paymentTerms: 'Net 7',
  transactionCount: 15,
  averageInvoiceAmount: 34000,
  firstTransactionDate: '2023-02-01',
  lastInvoiceDate: '2024-03-22',
  rating: 5,
  gstNumber: '07DDDDD3456D4Z5',
  panNumber: 'DDDDD3456D',
  creditPeriod: 7,
  discountReceived: 15000,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 50000
  },
  {
    month: 'Feb',
    amount: 45000
  },
  {
    month: 'Mar',
    amount: 55000
  }]

},
{
  id: 'v5',
  vendorName: 'Secure Guards & Security Agency',
  category: 'Security',
  totalBilled: 285000,
  totalPaid: 285000,
  totalPending: 0,
  lastPayment: '2024-03-30',
  contactPerson: 'Mr. Vikram Singh',
  email: 'admin@secureguards.com',
  phone: '+91-98765-44444',
  address: 'Rohini, New Delhi',
  paymentTerms: 'Net 30',
  transactionCount: 12,
  averageInvoiceAmount: 23750,
  firstTransactionDate: '2023-01-01',
  lastInvoiceDate: '2024-03-28',
  rating: 5,
  gstNumber: '07EEEEE6789E5Z5',
  panNumber: 'EEEEE6789E',
  creditPeriod: 30,
  discountReceived: 0,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 23750
  },
  {
    month: 'Feb',
    amount: 23750
  },
  {
    month: 'Mar',
    amount: 23750
  }]

},
{
  id: 'v6',
  vendorName: 'TechPro IT Solutions & Services',
  category: 'IT Services',
  totalBilled: 680000,
  totalPaid: 620000,
  totalPending: 60000,
  lastPayment: '2024-03-20',
  contactPerson: 'Mr. Rahul Mehta',
  email: 'support@techproit.com',
  phone: '+91-98765-55555',
  address: 'Cyber City, Gurugram',
  paymentTerms: 'Net 30',
  transactionCount: 18,
  averageInvoiceAmount: 37778,
  firstTransactionDate: '2023-03-01',
  lastInvoiceDate: '2024-03-18',
  rating: 4,
  gstNumber: '07FFFFF1122F6Z5',
  panNumber: 'FFFFF1122F',
  creditPeriod: 30,
  discountReceived: 20000,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 55000
  },
  {
    month: 'Feb',
    amount: 60000
  },
  {
    month: 'Mar',
    amount: 65000
  }]

},
{
  id: 'v7',
  vendorName: 'Fresh Foods & Canteen Supplies',
  category: 'Food & Beverage',
  totalBilled: 225000,
  totalPaid: 195000,
  totalPending: 30000,
  lastPayment: '2024-03-15',
  contactPerson: 'Ms. Anjali Gupta',
  email: 'orders@freshfoods.com',
  phone: '+91-98765-66666',
  address: 'Lajpat Nagar, New Delhi',
  paymentTerms: 'Net 15',
  transactionCount: 36,
  averageInvoiceAmount: 6250,
  firstTransactionDate: '2023-01-01',
  lastInvoiceDate: '2024-03-25',
  rating: 4,
  gstNumber: '07GGGGG4455G7Z5',
  panNumber: 'GGGGG4455G',
  creditPeriod: 15,
  discountReceived: 8000,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 18000
  },
  {
    month: 'Feb',
    amount: 19000
  },
  {
    month: 'Mar',
    amount: 20000
  }]

},
{
  id: 'v8',
  vendorName: 'Premium Office Furniture Co.',
  category: 'Furniture',
  totalBilled: 450000,
  totalPaid: 300000,
  totalPending: 150000,
  lastPayment: '2024-03-10',
  contactPerson: 'Mr. Suresh Reddy',
  email: 'sales@premiumfurniture.com',
  phone: '+91-98765-77777',
  address: 'Okhla Industrial Area, New Delhi',
  paymentTerms: 'Net 60',
  transactionCount: 5,
  averageInvoiceAmount: 90000,
  firstTransactionDate: '2023-09-01',
  lastInvoiceDate: '2024-02-28',
  rating: 3,
  gstNumber: '07HHHHH7788H8Z5',
  panNumber: 'HHHHH7788H',
  creditPeriod: 60,
  discountReceived: 12000,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 0
  },
  {
    month: 'Feb',
    amount: 150000
  },
  {
    month: 'Mar',
    amount: 150000
  }]

},
{
  id: 'v9',
  vendorName: 'Express Transport & Logistics',
  category: 'Transportation',
  totalBilled: 165000,
  totalPaid: 165000,
  totalPending: 0,
  lastPayment: '2024-03-27',
  contactPerson: 'Mr. Arun Kumar',
  email: 'dispatch@expresstransport.com',
  phone: '+91-98765-88888',
  address: 'Ghaziabad, UP',
  paymentTerms: 'Net 15',
  transactionCount: 28,
  averageInvoiceAmount: 5893,
  firstTransactionDate: '2023-02-01',
  lastInvoiceDate: '2024-03-26',
  rating: 5,
  gstNumber: '09IIIII9988I9Z5',
  panNumber: 'IIIII9988I',
  creditPeriod: 15,
  discountReceived: 3000,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 13000
  },
  {
    month: 'Feb',
    amount: 14000
  },
  {
    month: 'Mar',
    amount: 13500
  }]

},
{
  id: 'v10',
  vendorName: 'Eco Cleaning Solutions Ltd.',
  category: 'Cleaning Services',
  totalBilled: 180000,
  totalPaid: 150000,
  totalPending: 30000,
  lastPayment: '2024-03-12',
  contactPerson: 'Ms. Sunita Rao',
  email: 'admin@ecocleaning.com',
  phone: '+91-98765-99999',
  address: 'Dwarka, New Delhi',
  paymentTerms: 'Net 30',
  transactionCount: 12,
  averageInvoiceAmount: 15000,
  firstTransactionDate: '2023-04-01',
  lastInvoiceDate: '2024-03-20',
  rating: 4,
  gstNumber: '07JJJJJ1122J0Z5',
  panNumber: 'JJJJJ1122J',
  creditPeriod: 30,
  discountReceived: 0,
  status: 'Active',
  paymentHistory: [
  {
    month: 'Jan',
    amount: 15000
  },
  {
    month: 'Feb',
    amount: 15000
  },
  {
    month: 'Mar',
    amount: 15000
  }]

}];

export function VendorWiseExpense() {
  // --- State Management ---
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All Categories',
    status: 'All Status',
    paymentStatus: 'All',
    sortBy: 'totalBilled',
    sortOrder: 'desc'
  });
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());
  // --- Data Processing ---
  const filteredAndSortedVendors = useMemo(() => {
    let filtered = [...VENDOR_DATA];
    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (vendor) =>
        vendor.vendorName.
        toLowerCase().
        includes(filters.searchQuery.toLowerCase()) ||
        vendor.category.
        toLowerCase().
        includes(filters.searchQuery.toLowerCase()) ||
        vendor.contactPerson?.
        toLowerCase().
        includes(filters.searchQuery.toLowerCase())
      );
    }
    // Category filter
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(
        (vendor) => vendor.category === filters.category
      );
    }
    // Status filter
    if (filters.status !== 'All Status') {
      filtered = filtered.filter((vendor) => vendor.status === filters.status);
    }
    // Payment status filter
    if (filters.paymentStatus !== 'All') {
      if (filters.paymentStatus === 'Paid') {
        filtered = filtered.filter((vendor) => vendor.totalPending === 0);
      } else if (filters.paymentStatus === 'Pending') {
        filtered = filtered.filter((vendor) => vendor.totalPending > 0);
      }
    }
    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      switch (filters.sortBy) {
        case 'vendorName':
          aValue = a.vendorName;
          bValue = b.vendorName;
          break;
        case 'totalBilled':
          aValue = a.totalBilled;
          bValue = b.totalBilled;
          break;
        case 'totalPaid':
          aValue = a.totalPaid;
          bValue = b.totalPaid;
          break;
        case 'totalPending':
          aValue = a.totalPending;
          bValue = b.totalPending;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [filters]);
  // --- Aggregate Statistics ---
  const statistics = useMemo(() => {
    const total = filteredAndSortedVendors.reduce(
      (acc, vendor) => {
        acc.billed += vendor.totalBilled;
        acc.paid += vendor.totalPaid;
        acc.pending += vendor.totalPending;
        acc.transactions += vendor.transactionCount || 0;
        acc.discounts += vendor.discountReceived || 0;
        return acc;
      },
      {
        billed: 0,
        paid: 0,
        pending: 0,
        transactions: 0,
        discounts: 0
      }
    );
    const avgSettlementRate =
    total.billed > 0 ? total.paid / total.billed * 100 : 0;
    const vendorsWithPending = filteredAndSortedVendors.filter(
      (v) => v.totalPending > 0
    ).length;
    const fullyPaidVendors = filteredAndSortedVendors.filter(
      (v) => v.totalPending === 0
    ).length;
    const highestPayable = filteredAndSortedVendors.reduce(
      (max, vendor) => vendor.totalPending > max.totalPending ? vendor : max,
      filteredAndSortedVendors[0] || {
        totalPending: 0,
        vendorName: 'N/A'
      }
    );
    const topSpender = filteredAndSortedVendors.reduce(
      (max, vendor) => vendor.totalBilled > max.totalBilled ? vendor : max,
      filteredAndSortedVendors[0] || {
        totalBilled: 0,
        vendorName: 'N/A'
      }
    );
    const avgRating =
    filteredAndSortedVendors.reduce((sum, v) => sum + (v.rating || 0), 0) / (
    filteredAndSortedVendors.length || 1);
    return {
      ...total,
      avgSettlementRate,
      vendorsWithPending,
      fullyPaidVendors,
      highestPayable,
      topSpender,
      avgRating,
      totalVendors: filteredAndSortedVendors.length
    };
  }, [filteredAndSortedVendors]);
  // Get unique categories
  const uniqueCategories = useMemo(
    () => Array.from(new Set(VENDOR_DATA.map((v) => v.category))),
    []
  );
  // --- Event Handlers ---
  const toggleVendorExpansion = (vendorId: string) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };
  const handleSort = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder:
      prev.sortBy === key && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All Categories',
      status: 'All Status',
      paymentStatus: 'All',
      sortBy: 'totalBilled',
      sortOrder: 'desc'
    });
  };
  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };
  const handleSelectAll = () => {
    if (selectedVendors.size === filteredAndSortedVendors.length) {
      setSelectedVendors(new Set());
    } else {
      setSelectedVendors(new Set(filteredAndSortedVendors.map((v) => v.id)));
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="success" className="text-xs">
            Active
          </Badge>);

      case 'On Hold':
        return (
          <Badge variant="warning" className="text-xs">
            On Hold
          </Badge>);

      case 'Suspended':
        return (
          <Badge variant="destructive" className="text-xs">
            Suspended
          </Badge>);

      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>);

    }
  };
  const getRatingStars = (rating: number) => {
    return Array.from(
      {
        length: 5
      },
      (_, i) =>
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />


    );
  };
  const SortIcon = ({ columnKey }: {columnKey: string;}) => {
    if (filters.sortBy !== columnKey) {
      return (
        <ChevronDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />);

    }
    return filters.sortOrder === 'asc' ?
    <ChevronUp className="w-3 h-3 text-indigo-600" /> :

    <ChevronDown className="w-3 h-3 text-indigo-600" />;

  };
  // --- Table Columns Definition ---
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={
      selectedVendors.size === filteredAndSortedVendors.length &&
      filteredAndSortedVendors.length > 0
      }
      onChange={handleSelectAll}
      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />,


    render: (row: VendorData) =>
    <input
      type="checkbox"
      checked={selectedVendors.has(row.id)}
      onChange={() => handleSelectVendor(row.id)}
      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />


  },
  {
    key: 'expand',
    header: '',
    render: (row: VendorData) =>
    <button
      onClick={() => toggleVendorExpansion(row.id)}
      className="p-1 hover:bg-gray-100 rounded transition-colors">

          {expandedVendor === row.id ?
      <ChevronUp className="w-4 h-4 text-indigo-600" /> :

      <ChevronDown className="w-4 h-4 text-gray-400" />
      }
        </button>

  },
  {
    key: 'vendor',
    header:
    <button
      onClick={() => handleSort('vendorName')}
      className="flex items-center gap-2 hover:text-indigo-600 group">

          Vendor Details
          <SortIcon columnKey="vendorName" />
        </button>,

    render: (row: VendorData) =>
    <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border-2 border-indigo-200 relative">
            <Building2 className="w-6 h-6" />
            {row.rating && row.rating >= 4 &&
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
        }
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-900 leading-tight text-sm">
              {row.vendorName}
            </div>
            <div className="flex items-center gap-2">
              <Badge
            variant="secondary"
            className="text-[10px] bg-purple-50 text-purple-700">

                {row.category}
              </Badge>
              {getStatusBadge(row.status || 'Active')}
            </div>
            {row.rating &&
        <div className="flex items-center gap-1">
                {getRatingStars(row.rating)}
              </div>
        }
          </div>
        </div>

  },
  {
    key: 'transactions',
    header: 'Activity',
    render: (row: VendorData) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">
              {row.transactionCount || 0} invoices
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Last:{' '}
              {new Date(row.lastPayment).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
          })}
            </span>
          </div>
        </div>

  },
  {
    key: 'billed',
    header:
    <button
      onClick={() => handleSort('totalBilled')}
      className="flex items-center gap-2 hover:text-indigo-600 group ml-auto">

          Total Billed
          <SortIcon columnKey="totalBilled" />
        </button>,

    render: (row: VendorData) =>
    <div className="text-right space-y-1">
          <span className="text-sm font-black text-gray-900 block">
            ₹{row.totalBilled.toLocaleString('en-IN')}
          </span>
          {row.averageInvoiceAmount &&
      <span className="text-xs text-gray-500">
              Avg: ₹{row.averageInvoiceAmount.toLocaleString('en-IN')}
            </span>
      }
        </div>

  },
  {
    key: 'paid',
    header:
    <button
      onClick={() => handleSort('totalPaid')}
      className="flex items-center gap-2 hover:text-indigo-600 group ml-auto">

          Total Paid
          <SortIcon columnKey="totalPaid" />
        </button>,

    render: (row: VendorData) =>
    <div className="text-right space-y-1">
          <span className="text-sm font-bold text-green-600 block">
            ₹{row.totalPaid.toLocaleString('en-IN')}
          </span>
          {row.discountReceived && row.discountReceived > 0 &&
      <div className="flex items-center justify-end gap-1">
              <Badge variant="success" className="text-[9px]">
                -₹{row.discountReceived.toLocaleString('en-IN')} discount
              </Badge>
            </div>
      }
        </div>

  },
  {
    key: 'pending',
    header:
    <button
      onClick={() => handleSort('totalPending')}
      className="flex items-center gap-2 hover:text-indigo-600 group ml-auto">

          Pending
          <SortIcon columnKey="totalPending" />
        </button>,

    render: (row: VendorData) =>
    <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-2">
            {row.totalPending > 0 ?
        <AlertTriangle className="w-4 h-4 text-red-500" /> :

        <CheckCircle2 className="w-4 h-4 text-green-500" />
        }
            <span
          className={`text-sm font-black ${row.totalPending > 0 ? 'text-red-600' : 'text-gray-300'}`}>

              ₹{row.totalPending.toLocaleString('en-IN')}
            </span>
          </div>
          {row.totalPending > 0 && row.creditPeriod &&
      <div className="flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] text-amber-600 font-semibold">
                {row.creditPeriod} days credit
              </span>
            </div>
      }
        </div>

  },
  {
    key: 'efficiency',
    header: 'Settlement Rate',
    render: (row: VendorData) => {
      const pct = Math.round(row.totalPaid / row.totalBilled * 100);
      return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span
              className={`font-bold ${pct === 100 ? 'text-green-600' : pct >= 80 ? 'text-amber-600' : 'text-red-600'}`}>

                {pct}%
              </span>
              {pct === 100 && <Award className="w-4 h-4 text-green-500" />}
            </div>
            <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
              className={`h-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : pct >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{
                width: `${pct}%`
              }} />

            </div>
          </div>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: VendorData) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        className="text-indigo-600 font-bold text-xs group hover:bg-indigo-50">

            <Eye className="w-3 h-3 mr-1" />
            Ledger
            <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto p-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            Vendor Expense Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Comprehensive vendor payment tracking, settlement analysis, and
            relationship management dashboard
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" /> PDF Report
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Enhanced KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Payable Vendor */}
        <Card className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white border-none shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Badge
                variant="destructive"
                className="bg-red-900 text-white text-xs">

                Urgent
              </Badge>
            </div>
            <p className="text-xs font-bold text-red-200 uppercase tracking-widest mb-2">
              Highest Payable Vendor
            </p>
            <h3 className="text-base font-bold mb-2 line-clamp-1">
              {statistics.highestPayable.vendorName}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black">
                ₹
                {statistics.highestPayable.totalPending.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-red-200">pending</span>
            </div>
          </div>
          <Building2 className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 transform rotate-12 group-hover:scale-110 transition-transform" />
        </Card>

        {/* Top Vendor by Spend */}
        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Award className="w-5 h-5" />
              </div>
              <Badge className="bg-yellow-400 text-yellow-900 text-xs font-bold">
                #1
              </Badge>
            </div>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">
              Top Vendor by Spend
            </p>
            <h3 className="text-base font-bold mb-2 line-clamp-1">
              {statistics.topSpender.vendorName}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black">
                ₹{statistics.topSpender.totalBilled.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-indigo-200">billed</span>
            </div>
          </div>
          <Target className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 transform rotate-12 group-hover:scale-110 transition-transform" />
        </Card>

        {/* Active Vendors */}
        <Card className="p-6 bg-white shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-2xl">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-right">
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Total Active Vendors
          </p>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-4xl font-black text-gray-900">
              {statistics.totalVendors}
            </h3>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold">
                {VENDOR_DATA.filter((v) => v.status === 'Active').length} active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>{statistics.fullyPaidVendors} fully settled</span>
          </div>
        </Card>

        {/* Average Settlement Rate */}
        <Card className="p-6 bg-white shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <Percent className="w-7 h-7 text-indigo-600" />
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-xs">
                Avg Rate
              </Badge>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Overall Settlement Rate
          </p>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-4xl font-black text-gray-900">
              {statistics.avgSettlementRate.toFixed(1)}%
            </h3>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${statistics.avgSettlementRate >= 90 ? 'bg-green-500' : statistics.avgSettlementRate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{
                width: `${statistics.avgSettlementRate}%`
              }} />

          </div>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                Total Billed
              </p>
              <p className="text-xl font-black text-gray-900">
                ₹{(statistics.billed / 100000).toFixed(1)}L
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase mb-1">
                Total Paid
              </p>
              <p className="text-xl font-black text-gray-900">
                ₹{(statistics.paid / 100000).toFixed(1)}L
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-700 uppercase mb-1">
                Pending
              </p>
              <p className="text-xl font-black text-gray-900">
                ₹{(statistics.pending / 100000).toFixed(1)}L
              </p>
            </div>
            <Clock className="w-8 h-8 text-red-300" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase mb-1">
                Avg Rating
              </p>
              <div className="flex items-center gap-1">
                <p className="text-xl font-black text-gray-900">
                  {statistics.avgRating.toFixed(1)}
                </p>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <Award className="w-8 h-8 text-purple-300" />
          </div>
        </Card>
      </div>

      {/* Enhanced Filter Section */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Filters & Search
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gray-600">

              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
              setViewMode(viewMode === 'table' ? 'cards' : 'table')
              }
              className="text-gray-600">

              {viewMode === 'table' ?
              <PieChart className="w-4 h-4 mr-2" /> :

              <BarChart3 className="w-4 h-4 mr-2" />
              }
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
              <Search className="w-3 h-3" />
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Vendor name, category, contact person..."
                value={filters.searchQuery}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  searchQuery: e.target.value
                })
                }
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />

              {filters.searchQuery &&
              <button
                onClick={() =>
                setFilters({
                  ...filters,
                  searchQuery: ''
                })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2">

                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              }
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
              <Package className="w-3 h-3" />
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All Categories">All Categories</option>
              {uniqueCategories.map((cat) =>
              <option key={cat} value={cat}>
                  {cat}
                </option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
              <Activity className="w-3 h-3" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
              <CreditCard className="w-3 h-3" />
              Payment
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) =>
              setFilters({
                ...filters,
                paymentStatus: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All">All Payments</option>
              <option value="Paid">Fully Paid</option>
              <option value="Pending">Has Pending</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.searchQuery ||
        filters.category !== 'All Categories' ||
        filters.status !== 'All Status' ||
        filters.paymentStatus !== 'All') &&
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500">
              Active Filters:
            </span>
            {filters.searchQuery &&
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1">

                Search: "{filters.searchQuery}"
                <X
              className="w-3 h-3 cursor-pointer"
              onClick={() =>
              setFilters({
                ...filters,
                searchQuery: ''
              })
              } />

              </Badge>
          }
            {filters.category !== 'All Categories' &&
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1">

                Category: {filters.category}
                <X
              className="w-3 h-3 cursor-pointer"
              onClick={() =>
              setFilters({
                ...filters,
                category: 'All Categories'
              })
              } />

              </Badge>
          }
            {filters.status !== 'All Status' &&
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1">

                Status: {filters.status}
                <X
              className="w-3 h-3 cursor-pointer"
              onClick={() =>
              setFilters({
                ...filters,
                status: 'All Status'
              })
              } />

              </Badge>
          }
            {filters.paymentStatus !== 'All' &&
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1">

                Payment: {filters.paymentStatus}
                <X
              className="w-3 h-3 cursor-pointer"
              onClick={() =>
              setFilters({
                ...filters,
                paymentStatus: 'All'
              })
              } />

              </Badge>
          }
          </div>
        }
      </Card>

      {/* Main Data Table */}
      {viewMode === 'table' ?
      <Card className="overflow-hidden border-2 border-gray-200 shadow-2xl bg-white">
          <div className="p-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Vendor Payment Analytics
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredAndSortedVendors.length} of{' '}
                  {VENDOR_DATA.length} vendors
                </p>
              </div>
              {selectedVendors.size > 0 &&
            <Badge variant="secondary" className="text-xs">
                  {selectedVendors.size} selected
                </Badge>
            }
            </div>
          </div>

          <div className="overflow-x-auto max-h-[700px]">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                <tr>
                  {columns.map((col, index) =>
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">

                      {typeof col.header === 'function' ?
                  col.header() :
                  col.header}
                    </th>
                )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredAndSortedVendors.map((vendor, index) =>
              <Fragment key={vendor.id}>
                    <tr
                  className={`
                        transition-all hover:bg-indigo-50
                        ${selectedVendors.has(vendor.id) ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}
                        ${expandedVendor === vendor.id ? 'bg-indigo-50' : ''}
                        ${index % 2 === 0 ? 'bg-gray-50/30' : ''}
                      `}>

                      {columns.map((col, colIndex) =>
                  <td key={colIndex} className="px-4 py-4">
                          {col.render(vendor)}
                        </td>
                  )}
                    </tr>

                    {/* Expanded Vendor Details */}
                    {expandedVendor === vendor.id &&
                <tr className="bg-blue-50 border-l-4 border-l-blue-500">
                        <td colSpan={columns.length} className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-5 h-5 text-blue-600" />
                              <h4 className="text-sm font-bold text-blue-900">
                                Detailed Vendor Information
                              </h4>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h5 className="text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  Contact Information
                                </h5>
                                <div className="space-y-2 text-sm">
                                  {vendor.contactPerson &&
                            <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-900">
                                        {vendor.contactPerson}
                                      </span>
                                    </div>
                            }
                                  {vendor.phone &&
                            <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-700">
                                        {vendor.phone}
                                      </span>
                                    </div>
                            }
                                  {vendor.email &&
                            <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-700">
                                        {vendor.email}
                                      </span>
                                    </div>
                            }
                                  {vendor.address &&
                            <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                      <span className="text-gray-700 text-xs">
                                        {vendor.address}
                                      </span>
                                    </div>
                            }
                                </div>
                              </div>

                              {/* Business Details */}
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h5 className="text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  Business Details
                                </h5>
                                <div className="space-y-2 text-sm">
                                  {vendor.gstNumber &&
                            <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        GST:
                                      </span>
                                      <span className="font-mono text-gray-900">
                                        {vendor.gstNumber}
                                      </span>
                                    </div>
                            }
                                  {vendor.panNumber &&
                            <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        PAN:
                                      </span>
                                      <span className="font-mono text-gray-900">
                                        {vendor.panNumber}
                                      </span>
                                    </div>
                            }
                                  {vendor.paymentTerms &&
                            <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Terms:
                                      </span>
                                      <span className="text-gray-900">
                                        {vendor.paymentTerms}
                                      </span>
                                    </div>
                            }
                                  {vendor.creditPeriod &&
                            <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Credit Period:
                                      </span>
                                      <span className="text-gray-900">
                                        {vendor.creditPeriod} days
                                      </span>
                                    </div>
                            }
                                </div>
                              </div>
                            </div>

                            {/* Payment History Chart */}
                            {vendor.paymentHistory &&
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h5 className="text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-2">
                                  <BarChart3 className="w-3 h-3" />
                                  Recent Payment History
                                </h5>
                                <div className="grid grid-cols-3 gap-3">
                                  {vendor.paymentHistory.map((record, i) =>
                          <div
                            key={i}
                            className="text-center p-3 bg-gray-50 rounded-lg">

                                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                        {record.month}
                                      </p>
                                      <p className="text-sm font-bold text-gray-900">
                                        ₹{record.amount.toLocaleString('en-IN')}
                                      </p>
                                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                                        <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${vendor.averageInvoiceAmount ? record.amount / vendor.averageInvoiceAmount * 100 : 0}%`
                                }} />

                                      </div>
                                    </div>
                          )}
                                </div>
                              </div>
                      }

                            {/* Transaction Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                  Total Invoices
                                </p>
                                <p className="text-2xl font-black text-gray-900">
                                  {vendor.transactionCount}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                  Avg Invoice
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  ₹
                                  {vendor.averageInvoiceAmount?.toLocaleString(
                              'en-IN'
                            )}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                  Discount Received
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                  ₹
                                  {vendor.discountReceived?.toLocaleString(
                              'en-IN'
                            ) || 0}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                                  First Transaction
                                </p>
                                <p className="text-xs font-semibold text-gray-900">
                                  {vendor.firstTransactionDate ?
                            new Date(
                              vendor.firstTransactionDate
                            ).toLocaleDateString('en-IN') :
                            'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                }
                  </Fragment>
              )}
              </tbody>

              {/* Footer with Totals */}
              <tfoot className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white sticky bottom-0">
                <tr>
                  <td colSpan={3} className="p-5">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-indigo-300" />
                      <div>
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                          Grand Total ({filteredAndSortedVendors.length}{' '}
                          vendors)
                        </p>
                        <p className="text-2xl font-black">
                          ₹{statistics.billed.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-indigo-300" />
                      <span className="text-sm font-semibold">
                        {statistics.transactions} invoices
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <p className="text-xs text-indigo-300 uppercase mb-1">
                      Total Billed
                    </p>
                    <p className="text-lg font-bold">
                      ₹{statistics.billed.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="p-5 text-right">
                    <p className="text-xs text-green-300 uppercase mb-1">
                      Total Paid
                    </p>
                    <p className="text-lg font-bold text-green-400">
                      ₹{statistics.paid.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="p-5 text-right">
                    <p className="text-xs text-red-300 uppercase mb-1">
                      Total Pending
                    </p>
                    <p className="text-lg font-bold text-red-400">
                      ₹{statistics.pending.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <p className="text-xs text-indigo-300 uppercase">
                        Settlement
                      </p>
                      <p className="text-lg font-bold">
                        {statistics.avgSettlementRate.toFixed(1)}%
                      </p>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            {filteredAndSortedVendors.length === 0 &&
          <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-500 mb-2">
                  No Vendors Found
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  No vendors match your current filter criteria
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
          }
          </div>
        </Card> /* Card View */ :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVendors.map((vendor) => {
          const settlementRate = Math.round(
            vendor.totalPaid / vendor.totalBilled * 100
          );
          return (
            <Card
              key={vendor.id}
              className="p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-indigo-300 group">

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg border-2 border-indigo-300 relative group-hover:scale-110 transition-transform">
                      <Building2 className="w-7 h-7" />
                      {vendor.rating && vendor.rating >= 4 &&
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                    }
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                        {vendor.vendorName}
                      </h4>
                      {vendor.rating &&
                    <div className="flex items-center gap-1">
                          {getRatingStars(vendor.rating)}
                        </div>
                    }
                    </div>
                  </div>
                  {getStatusBadge(vendor.status || 'Active')}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {vendor.category}
                    </Badge>
                    {vendor.transactionCount &&
                  <span className="text-xs text-gray-500">
                        {vendor.transactionCount} invoices
                      </span>
                  }
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Total Billed:
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        ₹{vendor.totalBilled.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total Paid:</span>
                      <span className="text-sm font-bold text-green-600">
                        ₹{vendor.totalPaid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Pending:</span>
                      <span
                      className={`text-sm font-black ${vendor.totalPending > 0 ? 'text-red-600' : 'text-gray-300'}`}>

                        ₹{vendor.totalPending.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-700">
                        Settlement Rate
                      </span>
                      <span
                      className={`text-xs font-bold ${settlementRate === 100 ? 'text-green-600' : settlementRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>

                        {settlementRate}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className={`h-full transition-all duration-500 ${settlementRate === 100 ? 'bg-green-500' : settlementRate >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{
                        width: `${settlementRate}%`
                      }} />

                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs group/btn"
                  onClick={() => toggleVendorExpansion(vendor.id)}>

                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs group/btn bg-indigo-600">

                    Ledger
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>);

        })}
        </div>
      }

      {/* Footer Info */}
      <div className="flex items-center justify-between px-2 py-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Last Updated: {new Date().toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            <span>
              Sorted by {filters.sortBy} ({filters.sortOrder})
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          Showing {filteredAndSortedVendors.length} of {VENDOR_DATA.length}{' '}
          vendors
        </div>
      </div>
    </div>);

}