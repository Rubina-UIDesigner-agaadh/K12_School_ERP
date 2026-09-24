import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Trash2,
  CheckCircle,
  History,
  Filter,
  Download,
  RefreshCw,
  User,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  PrinterIcon,
  Info } from
'lucide-react';

interface Receipt {
  id: string;
  no: string;
  date: string;
  studentName: string;
  rollNo: string;
  classSection: string;
  fatherName: string;
  amount: number;
  mode: string;
  status: 'active' | 'cancelled';
  installment: string;
  createdBy: string;
  createdAt: string;
  feeType?: string;
  transactionId?: string;
}

interface CancelledReceipt extends Receipt {
  cancelDate: string;
  cancelReason: string;
  cancelComments: string;
  cancelledBy: string;
}

export function FeeReceiptCancellation() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    receiptNo: '',
    dateFrom: '',
    dateTo: '',
    student: '',
    mode: '',
    status: 'active',
    minAmount: '',
    maxAmount: '',
    classSection: ''
  });
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBulkCancelModal, setShowBulkCancelModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<Receipt | CancelledReceipt | null>(null);
  const [cancelData, setCancelData] = useState<{
    receiptId: string;
    reason: string;
    comments: string;
    password: string;
  }>({
    receiptId: '',
    reason: '',
    comments: '',
    password: ''
  });

  const [bulkCancelData, setBulkCancelData] = useState({
    reason: '',
    comments: '',
    password: ''
  });

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Sample data
  const [activeReceipts, setActiveReceipts] = useState<Receipt[]>([
  {
    id: '1',
    no: 'RCP-2024-001',
    date: '2024-03-15',
    studentName: 'Rahul Sharma',
    rollNo: 'STU001',
    classSection: '10-A',
    fatherName: 'Rajesh Sharma',
    amount: 25000,
    mode: 'Cash',
    status: 'active',
    installment: 'Term 1',
    createdBy: 'Admin User',
    createdAt: '2024-03-15 10:30 AM',
    feeType: 'Tuition Fee',
    transactionId: 'TXN001'
  },
  {
    id: '2',
    no: 'RCP-2024-002',
    date: '2024-03-20',
    studentName: 'Priya Patel',
    rollNo: 'STU002',
    classSection: '10-B',
    fatherName: 'Suresh Patel',
    amount: 15000,
    mode: 'UPI',
    status: 'active',
    installment: 'Term 1',
    createdBy: 'Finance Clerk',
    createdAt: '2024-03-20 02:15 PM',
    feeType: 'Tuition Fee',
    transactionId: 'UPI123456789'
  },
  {
    id: '3',
    no: 'RCP-2024-003',
    date: '2024-03-25',
    studentName: 'Amit Kumar',
    rollNo: 'STU003',
    classSection: '9-C',
    fatherName: 'Vijay Kumar',
    amount: 30000,
    mode: 'Cheque',
    status: 'active',
    installment: 'Term 2',
    createdBy: 'Admin User',
    createdAt: '2024-03-25 11:45 AM',
    feeType: 'Annual Fee',
    transactionId: 'CHQ789456'
  },
  {
    id: '4',
    no: 'RCP-2024-004',
    date: '2024-04-01',
    studentName: 'Sneha Desai',
    rollNo: 'STU004',
    classSection: '11-A',
    fatherName: 'Ramesh Desai',
    amount: 20000,
    mode: 'Cash',
    status: 'active',
    installment: 'Term 1',
    createdBy: 'Finance Clerk',
    createdAt: '2024-04-01 09:20 AM',
    feeType: 'Tuition Fee',
    transactionId: 'TXN004'
  },
  {
    id: '6',
    no: 'RCP-2024-006',
    date: '2024-04-05',
    studentName: 'Kavya Reddy',
    rollNo: 'STU006',
    classSection: '8-B',
    fatherName: 'Krishna Reddy',
    amount: 12000,
    mode: 'UPI',
    status: 'active',
    installment: 'Term 1',
    createdBy: 'Admin User',
    createdAt: '2024-04-05 01:30 PM',
    feeType: 'Library Fee',
    transactionId: 'UPI987654321'
  }]
  );

  const [cancelledReceipts, setCancelledReceipts] = useState<CancelledReceipt[]>([
  {
    id: '5',
    no: 'RCP-2024-005',
    date: '2024-03-10',
    studentName: 'Rohan Mehta',
    rollNo: 'STU005',
    classSection: '12-A',
    fatherName: 'Prakash Mehta',
    amount: 18000,
    mode: 'UPI',
    status: 'cancelled',
    installment: 'Term 3',
    createdBy: 'Admin User',
    createdAt: '2024-03-10 03:00 PM',
    cancelDate: '2024-03-12',
    cancelReason: 'Wrong Amount',
    cancelComments: 'Amount entered incorrectly, should be 1800 instead of 18000',
    cancelledBy: 'Finance Manager',
    feeType: 'Tuition Fee',
    transactionId: 'UPI111222333'
  }]
  );

  // Filter logic
  const getFilteredReceipts = (receipts: Receipt[]) => {
    return receipts.filter((receipt) => {
      const matchesSearch =
      receipt.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReceiptNo =
      !filters.receiptNo || receipt.no.toLowerCase().includes(filters.receiptNo.toLowerCase());

      const matchesDateFrom = !filters.dateFrom || new Date(receipt.date) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(receipt.date) <= new Date(filters.dateTo);

      const matchesMode = !filters.mode || receipt.mode === filters.mode;

      const matchesMinAmount = !filters.minAmount || receipt.amount >= parseFloat(filters.minAmount);
      const matchesMaxAmount = !filters.maxAmount || receipt.amount <= parseFloat(filters.maxAmount);

      const matchesClass =
      !filters.classSection || receipt.classSection.toLowerCase().includes(filters.classSection.toLowerCase());

      return (
        matchesSearch &&
        matchesReceiptNo &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesMode &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesClass);

    });
  };

  // Sorting logic
  const getSortedReceipts = (receipts: Receipt[]) => {
    if (!sortConfig) return receipts;

    return [...receipts].sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof Receipt];
      let bVal: any = b[sortConfig.key as keyof Receipt];

      if (sortConfig.key === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (sortConfig.key === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredActiveReceipts = getSortedReceipts(getFilteredReceipts(activeReceipts));
  const filteredCancelledReceipts = getSortedReceipts(
    getFilteredReceipts(cancelledReceipts as Receipt[])
  ) as CancelledReceipt[];

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (activeTab === 'active') {
      if (checked) {
        setSelectedReceipts(filteredActiveReceipts.map((r) => r.id));
      } else {
        setSelectedReceipts([]);
      }
    }
  };

  const handleSelectReceipt = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedReceipts([...selectedReceipts, id]);
    } else {
      setSelectedReceipts(selectedReceipts.filter((sid) => sid !== id));
    }
  };

  const handleCancelReceipt = (receiptId: string) => {
    setCancelData({
      receiptId,
      reason: '',
      comments: '',
      password: ''
    });
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!cancelData.reason || !cancelData.password) {
      alert('Please provide a reason and confirm with password');
      return;
    }

    // Simulate password check
    if (cancelData.password !== 'admin123') {
      alert('Invalid password');
      return;
    }

    const receipt = activeReceipts.find((r) => r.id === cancelData.receiptId);
    if (receipt) {
      const cancelledReceipt: CancelledReceipt = {
        ...receipt,
        status: 'cancelled',
        cancelDate: new Date().toISOString().split('T')[0],
        cancelReason: cancelData.reason,
        cancelComments: cancelData.comments,
        cancelledBy: 'Current User'
      };

      setActiveReceipts(activeReceipts.filter((r) => r.id !== receipt.id));
      setCancelledReceipts([cancelledReceipt, ...cancelledReceipts]);
      setSelectedReceipts(selectedReceipts.filter((id) => id !== receipt.id));
      setShowCancelModal(false);
      setCancelData({
        receiptId: '',
        reason: '',
        comments: '',
        password: ''
      });
      alert('Receipt cancelled successfully!');
    }
  };

  const handleBulkCancel = () => {
    if (selectedReceipts.length === 0) return;
    setShowBulkCancelModal(true);
  };

  const confirmBulkCancel = () => {
    if (!bulkCancelData.reason || !bulkCancelData.password) {
      alert('Please provide a reason and confirm with password');
      return;
    }

    if (bulkCancelData.password !== 'admin123') {
      alert('Invalid password');
      return;
    }

    const receiptsToCancel = activeReceipts.filter((r) => selectedReceipts.includes(r.id));
    const newCancelledReceipts = receiptsToCancel.map((receipt) => ({
      ...receipt,
      status: 'cancelled' as const,
      cancelDate: new Date().toISOString().split('T')[0],
      cancelReason: bulkCancelData.reason,
      cancelComments: bulkCancelData.comments,
      cancelledBy: 'Current User'
    }));

    setActiveReceipts(activeReceipts.filter((r) => !selectedReceipts.includes(r.id)));
    setCancelledReceipts([...newCancelledReceipts, ...cancelledReceipts]);
    setSelectedReceipts([]);
    setShowBulkCancelModal(false);
    setBulkCancelData({
      reason: '',
      comments: '',
      password: ''
    });
    alert(`${receiptsToCancel.length} receipt(s) cancelled successfully!`);
  };

  const handleViewReceipt = (receipt: Receipt | CancelledReceipt) => {
    setSelectedReceiptForView(receipt);
    setShowViewModal(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      receiptNo: '',
      dateFrom: '',
      dateTo: '',
      student: '',
      mode: '',
      status: 'active',
      minAmount: '',
      maxAmount: '',
      classSection: ''
    });
    setSortConfig(null);
  };

  const handleExport = () => {
    const data = activeTab === 'active' ? filteredActiveReceipts : filteredCancelledReceipts;
    const csv = [
    Object.keys(data[0] || {}).join(','),
    ...data.map((row) => Object.values(row).join(','))].
    join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${activeTab}-${new Date().toISOString()}.csv`;
    a.click();
  };

  const totalActiveAmount = activeReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalCancelledAmount = cancelledReceipts.reduce((sum, r) => sum + r.amount, 0);
  const selectedAmount = activeReceipts.
  filter((r) => selectedReceipts.includes(r.id)).
  reduce((sum, r) => sum + r.amount, 0);

  const SortableHeader = ({ label, sortKey }: {label: string;sortKey: string;}) =>
  <div
    className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
    onClick={() => handleSort(sortKey)}>

      <span>{label}</span>
      {sortConfig?.key === sortKey &&
    <span>{sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
    }
    </div>;


  const activeColumns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 cursor-pointer"
      onChange={(e) => handleSelectAll(e.target.checked)}
      checked={selectedReceipts.length === filteredActiveReceipts.length && filteredActiveReceipts.length > 0} />,


    render: (row: Receipt) =>
    <input
      type="checkbox"
      className="rounded border-gray-300 cursor-pointer"
      checked={selectedReceipts.includes(row.id)}
      onChange={(e) => handleSelectReceipt(row.id, e.target.checked)} />


  },
  {
    key: 'no',
    header: <SortableHeader label="Receipt No" sortKey="no" />,
    render: (row: Receipt) =>
    <div className="space-y-1">
          <span className="font-semibold text-gray-900 block">{row.no}</span>
          <Badge variant="outline" className="text-xs">
            {row.feeType}
          </Badge>
        </div>

  },
  {
    key: 'date',
    header: <SortableHeader label="Date" sortKey="date" />,
    render: (row: Receipt) =>
    <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {row.date}
        </div>

  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: Receipt) =>
    <div className="space-y-1">
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">
            {row.rollNo} | {row.classSection}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3" />
            {row.fatherName}
          </div>
        </div>

  },
  {
    key: 'amount',
    header: <SortableHeader label="Amount" sortKey="amount" />,
    render: (row: Receipt) =>
    <div>
          <span className="font-bold text-green-600 text-lg">₹{row.amount.toLocaleString()}</span>
          <div className="text-xs text-gray-500 mt-1">{row.installment}</div>
        </div>

  },
  {
    key: 'mode',
    header: 'Payment',
    render: (row: Receipt) =>
    <div className="space-y-1">
          <Badge variant="outline">{row.mode}</Badge>
          {row.transactionId && <div className="text-xs text-gray-500">ID: {row.transactionId}</div>}
        </div>

  },
  {
    key: 'created',
    header: 'Created By',
    render: (row: Receipt) =>
    <div className="text-sm">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {row.createdBy}
          </div>
          <div className="text-xs text-gray-500">{row.createdAt}</div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Receipt) =>
    <div className="flex items-center gap-2">
          <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:bg-blue-50"
        onClick={() => handleViewReceipt(row)}
        title="View Details">

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50"
        onClick={() => handleCancelReceipt(row.id)}
        title="Cancel Receipt">

            <XCircle className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:bg-gray-50"
        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
        title="Toggle Details">

            {expandedRow === row.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

  }];


  const historyColumns = [
  {
    key: 'no',
    header: 'Receipt No',
    render: (row: CancelledReceipt) =>
    <div className="space-y-1">
          <span className="font-semibold text-red-500 line-through">{row.no}</span>
          <Badge variant="destructive" className="text-xs">
            CANCELLED
          </Badge>
        </div>

  },
  {
    key: 'date',
    header: 'Issue Date',
    render: (row: CancelledReceipt) =>
    <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          {row.date}
        </div>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: CancelledReceipt) =>
    <div>
          <div className="font-medium">{row.studentName}</div>
          <div className="text-xs text-gray-500">{row.rollNo} | {row.classSection}</div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: CancelledReceipt) =>
    <span className="font-bold text-red-600 line-through">₹{row.amount.toLocaleString()}</span>

  },
  {
    key: 'cancelDate',
    header: 'Cancelled On',
    render: (row: CancelledReceipt) =>
    <div className="flex items-center gap-2 text-sm">
          <XCircle className="w-4 h-4 text-red-500" />
          {row.cancelDate}
        </div>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: CancelledReceipt) => <Badge variant="destructive">{row.cancelReason}</Badge>
  },
  {
    key: 'comments',
    header: 'Comments',
    render: (row: CancelledReceipt) =>
    <span className="text-sm text-gray-600 max-w-xs truncate block" title={row.cancelComments}>
          {row.cancelComments || 'N/A'}
        </span>

  },
  {
    key: 'cancelledBy',
    header: 'Cancelled By',
    render: (row: CancelledReceipt) =>
    <div className="flex items-center gap-1 text-sm">
          <User className="w-3 h-3" />
          {row.cancelledBy}
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CancelledReceipt) =>
    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:bg-blue-50"
      onClick={() => handleViewReceipt(row)}
      title="View Details">

          <Eye className="w-4 h-4" />
        </Button>

  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            Receipt Cancellation Management
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Cancel erroneous receipts, reverse payment entries, and maintain cancellation history with full audit trail.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Receipts</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{activeReceipts.length}</p>
              <p className="text-xs text-green-600 mt-1">Valid transactions</p>
            </div>
            <CheckCircle className="w-14 h-14 text-green-400 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Cancelled Receipts</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{cancelledReceipts.length}</p>
              <p className="text-xs text-red-600 mt-1">Reversed entries</p>
            </div>
            <XCircle className="w-14 h-14 text-red-400 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Active Amount</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">₹{totalActiveAmount.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">Current collection</p>
            </div>
            <DollarSign className="w-14 h-14 text-blue-400 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Cancelled Amount</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">₹{totalCancelledAmount.toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">Reversed total</p>
            </div>
            <History className="w-14 h-14 text-orange-400 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-lg">Advanced Search & Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
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
        </div>

        {showFilters &&
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                placeholder="Search receipt no, student, roll no..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

              </div>
              <Input
              placeholder="Receipt Number"
              value={filters.receiptNo}
              onChange={(e) => setFilters({ ...filters, receiptNo: e.target.value })} />

              <Input
              type="date"
              label="Date From"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />

              <Input
              type="date"
              label="Date To"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
              label="Payment Mode"
              value={filters.mode}
              onChange={(value) => setFilters({ ...filters, mode: value })}
              options={[
              { value: '', label: 'All Modes' },
              { value: 'Cash', label: 'Cash' },
              { value: 'UPI', label: 'UPI' },
              { value: 'Cheque', label: 'Cheque' },
              { value: 'Card', label: 'Card' },
              { value: 'Online', label: 'Online Transfer' }]
              } />

              <Input
              placeholder="Class/Section"
              value={filters.classSection}
              onChange={(e) => setFilters({ ...filters, classSection: e.target.value })} />

              <Input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })} />

              <Input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })} />

            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Filters
              </Button>
            </div>
          </>
        }
      </Card>

      {/* Tabs */}
      <Card className="p-5 shadow-md">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Active Receipts ({filteredActiveReceipts.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Cancellation History ({filteredCancelledReceipts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {selectedReceipts.length > 0 &&
            <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-yellow-700" />
                    <div>
                      <span className="text-sm font-semibold text-yellow-900">
                        {selectedReceipts.length} receipt(s) selected
                      </span>
                      <span className="text-sm text-yellow-700 ml-2">
                        | Total Amount: ₹{selectedAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedReceipts([])}>
                      <X className="w-4 h-4 mr-1" />
                      Clear Selection
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleBulkCancel}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancel Selected
                    </Button>
                  </div>
                </div>
              </div>
            }

            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <strong className="font-bold">Critical Warning:</strong> Cancelling a receipt will{' '}
                <strong className="underline">permanently reverse the payment entry</strong>, increase the student's due
                balance, and create an irreversible audit trail. This action requires authorization and cannot be undone.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    {activeColumns.map((col) =>
                    <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        {col.header}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveReceipts.length === 0 ?
                  <tr>
                      <td colSpan={activeColumns.length} className="px-4 py-8 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No active receipts found</p>
                      </td>
                    </tr> :

                  filteredActiveReceipts.map((row) =>
                  <React.Fragment key={row.id}>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          {activeColumns.map((col) =>
                      <td key={col.key} className="px-4 py-3">
                              {col.render(row)}
                            </td>
                      )}
                        </tr>
                        {expandedRow === row.id &&
                    <tr className="bg-blue-50 border-b">
                            <td colSpan={activeColumns.length} className="px-4 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-semibold text-gray-700">Transaction ID:</span>
                                  <p className="text-gray-900">{row.transactionId || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Fee Type:</span>
                                  <p className="text-gray-900">{row.feeType}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Installment:</span>
                                  <p className="text-gray-900">{row.installment}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Status:</span>
                                  <Badge variant="outline" className="mt-1">
                                    {row.status.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                          </tr>
                    }
                      </React.Fragment>
                  )
                  }
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    {historyColumns.map((col) =>
                    <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        {col.header}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCancelledReceipts.length === 0 ?
                  <tr>
                      <td colSpan={historyColumns.length} className="px-4 py-8 text-center text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No cancelled receipts found</p>
                      </td>
                    </tr> :

                  filteredCancelledReceipts.map((row) =>
                  <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                        {historyColumns.map((col) =>
                    <td key={col.key} className="px-4 py-3">
                            {col.render(row)}
                          </td>
                    )}
                      </tr>
                  )
                  }
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Single Cancel Modal */}
      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <div className="p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cancel Receipt</h2>
              <p className="text-sm text-gray-500">This action will reverse the payment entry</p>
            </div>
          </div>

          {cancelData &&
          <>
              <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Receipt Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Receipt No:</span>
                    <p className="font-semibold text-gray-900">
                      {activeReceipts.find((r) => r.id === cancelData.receiptId)?.no}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-semibold text-gray-900">
                      {activeReceipts.find((r) => r.id === cancelData.receiptId)?.date}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Student:</span>
                    <p className="font-semibold text-gray-900">
                      {activeReceipts.find((r) => r.id === cancelData.receiptId)?.studentName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-bold text-green-600 text-lg">
                      ₹{activeReceipts.find((r) => r.id === cancelData.receiptId)?.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Mode:</span>
                    <p className="font-semibold text-gray-900">
                      {activeReceipts.find((r) => r.id === cancelData.receiptId)?.mode}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Installment:</span>
                    <p className="font-semibold text-gray-900">
                      {activeReceipts.find((r) => r.id === cancelData.receiptId)?.installment}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Select
                label="Reason for Cancellation *"
                value={cancelData.reason}
                onChange={(value) => setCancelData({ ...cancelData, reason: value })}
                options={[
                { value: '', label: 'Select a reason' },
                { value: 'Wrong Amount', label: 'Wrong Amount Entered' },
                { value: 'Duplicate', label: 'Duplicate Receipt' },
                { value: 'Student Left', label: 'Student Left Institution' },
                { value: 'Refund Requested', label: 'Refund Requested' },
                { value: 'Payment Bounce', label: 'Payment Bounce/Failed' },
                { value: 'Data Entry Error', label: 'Data Entry Error' },
                { value: 'Other', label: 'Other Reason' }]
                } />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed explanation for cancellation..."
                  value={cancelData.comments}
                  onChange={(e) => setCancelData({ ...cancelData, comments: e.target.value })}
                  rows={4} />

                </div>

                <Input
                type="password"
                label="Confirm with Password *"
                placeholder="Enter your password to authorize"
                value={cancelData.password}
                onChange={(e) => setCancelData({ ...cancelData, password: e.target.value })} />

              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-semibold mb-1">Important Notice:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>This action will reverse the payment entry</li>
                      <li>Student's due balance will increase by ₹{activeReceipts.find((r) => r.id === cancelData.receiptId)?.amount?.toLocaleString()}</li>
                      <li>An audit trail will be created</li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Operation
                </Button>
                <Button variant="destructive" onClick={confirmCancel} disabled={!cancelData.reason || !cancelData.password}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Cancellation
                </Button>
              </div>
            </>
          }
        </div>
      </Modal>

      {/* Bulk Cancel Modal */}
      <Modal open={showBulkCancelModal} onClose={() => setShowBulkCancelModal(false)}>
        <div className="p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Cancel Receipts</h2>
              <p className="text-sm text-gray-500">Cancel multiple receipts at once</p>
            </div>
          </div>

          <div className="mb-6 p-5 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3">Selected Receipts ({selectedReceipts.length})</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {activeReceipts.
              filter((r) => selectedReceipts.includes(r.id)).
              map((receipt) =>
              <div key={receipt.id} className="flex justify-between items-center p-3 bg-white rounded border">
                    <div>
                      <p className="font-semibold text-gray-900">{receipt.no}</p>
                      <p className="text-sm text-gray-600">{receipt.studentName}</p>
                    </div>
                    <p className="font-bold text-green-600">₹{receipt.amount.toLocaleString()}</p>
                  </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm font-semibold text-red-900">
                Total Amount to Reverse: ₹{selectedAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <Select
              label="Reason for Cancellation *"
              value={bulkCancelData.reason}
              onChange={(value) => setBulkCancelData({ ...bulkCancelData, reason: value })}
              options={[
              { value: '', label: 'Select a reason' },
              { value: 'Wrong Amount', label: 'Wrong Amount Entered' },
              { value: 'Duplicate', label: 'Duplicate Receipts' },
              { value: 'Bulk Data Error', label: 'Bulk Data Entry Error' },
              { value: 'System Error', label: 'System Error' },
              { value: 'Other', label: 'Other Reason' }]
              } />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide detailed explanation for bulk cancellation..."
                value={bulkCancelData.comments}
                onChange={(e) => setBulkCancelData({ ...bulkCancelData, comments: e.target.value })}
                rows={4} />

            </div>

            <Input
              type="password"
              label="Confirm with Password *"
              placeholder="Enter your password to authorize"
              value={bulkCancelData.password}
              onChange={(e) => setBulkCancelData({ ...bulkCancelData, password: e.target.value })} />

          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <div className="text-sm text-red-700">
                <p className="font-bold mb-2">Critical Action Warning:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All {selectedReceipts.length} selected receipts will be cancelled</li>
                  <li>Total amount of ₹{selectedAmount.toLocaleString()} will be reversed</li>
                  <li>Students' due balances will be updated accordingly</li>
                  <li>Complete audit trail will be maintained</li>
                  <li>This action is IRREVERSIBLE</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowBulkCancelModal(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel Operation
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkCancel}
              disabled={!bulkCancelData.reason || !bulkCancelData.password}>

              <Trash2 className="w-4 h-4 mr-2" />
              Confirm Bulk Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Receipt Modal */}
      <Modal open={showViewModal} onClose={() => setShowViewModal(false)}>
        <div className="p-6 max-w-3xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Receipt Details</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {selectedReceiptForView &&
          <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {selectedReceiptForView.status === 'active' ?
              <Badge variant="outline" className="text-lg px-6 py-2 bg-green-50 text-green-700 border-green-300">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ACTIVE RECEIPT
                  </Badge> :

              <Badge variant="destructive" className="text-lg px-6 py-2">
                    <XCircle className="w-5 h-5 mr-2" />
                    CANCELLED
                  </Badge>
              }
              </div>

              {/* Receipt Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Receipt Number</label>
                    <p className="text-lg font-bold text-gray-900">{selectedReceiptForView.no}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedReceiptForView.date}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount</label>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{selectedReceiptForView.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Mode</label>
                    <p className="text-gray-900">{selectedReceiptForView.mode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                    <p className="text-gray-900 font-mono text-sm">
                      {selectedReceiptForView.transactionId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Installment</label>
                    <p className="text-gray-900">{selectedReceiptForView.installment}</p>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-blue-700">Student Name</label>
                    <p className="font-semibold text-blue-900">{selectedReceiptForView.studentName}</p>
                  </div>
                  <div>
                    <label className="text-blue-700">Roll Number</label>
                    <p className="font-semibold text-blue-900">{selectedReceiptForView.rollNo}</p>
                  </div>
                  <div>
                    <label className="text-blue-700">Class/Section</label>
                    <p className="font-semibold text-blue-900">{selectedReceiptForView.classSection}</p>
                  </div>
                  <div>
                    <label className="text-blue-700">Father's Name</label>
                    <p className="font-semibold text-blue-900">{selectedReceiptForView.fatherName}</p>
                  </div>
                </div>
              </div>

              {/* Creation Details */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Creation Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600">Created By</label>
                    <p className="font-semibold text-gray-900">{selectedReceiptForView.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Created At</label>
                    <p className="font-semibold text-gray-900">{selectedReceiptForView.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Cancellation Details (if cancelled) */}
              {selectedReceiptForView.status === 'cancelled' && 'cancelDate' in selectedReceiptForView &&
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cancellation Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-red-700">Cancelled On</label>
                      <p className="font-semibold text-red-900">{selectedReceiptForView.cancelDate}</p>
                    </div>
                    <div>
                      <label className="text-red-700">Cancelled By</label>
                      <p className="font-semibold text-red-900">{selectedReceiptForView.cancelledBy}</p>
                    </div>
                    <div>
                      <label className="text-red-700">Reason</label>
                      <p className="font-semibold text-red-900">{selectedReceiptForView.cancelReason}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-red-700">Comments</label>
                      <p className="font-semibold text-red-900">{selectedReceiptForView.cancelComments || 'N/A'}</p>
                    </div>
                  </div>
                </div>
            }

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => window.print()}>
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          }
        </div>
      </Modal>
    </div>);

}