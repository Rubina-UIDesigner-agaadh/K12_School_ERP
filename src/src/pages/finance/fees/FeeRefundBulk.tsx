import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  IndianRupee,
  AlertCircle,
  Clock,
  CreditCard,
  Building2,
  Receipt,
  ArrowRight,
  Printer,
  Send,
  MessageSquare,
  History,
  RefreshCw,
  X,
  Check,
  Info,
  AlertTriangle,
  Banknote,
  Wallet,
  Hash,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Upload,
  Trash2,
  Edit } from
'lucide-react';

interface RefundRequest {
  id: string;
  requestNo: string;
  requestDate: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  class: string;
  section: string;
  rollNo: string;
  contactNo: string;
  email: string;
  originalReceiptNo: string;
  originalReceiptDate: string;
  originalAmount: number;
  originalPaymentMode: string;
  originalTransactionRef: string;
  refundAmount: number;
  refundReason: string;
  refundCategory: 'double-payment' | 'excess-fee' | 'withdrawal' | 'fee-revision' | 'other';
  refundMode: 'cash' | 'cheque' | 'bank-transfer' | 'original-mode';
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  accountHolderName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  processedBy?: string;
  processedDate?: string;
  rejectionReason?: string;
  remarks?: string;
  attachments?: string[];
  feeHeads: {name: string;amount: number;}[];
}

interface RefundHistory {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  remarks?: string;
}

export function FeeRefundBulk() {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selection States
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);

  // Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showNewRefundModal, setShowNewRefundModal] = useState(false);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);

  // Selected Refund
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  // Form States
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingRemarks, setProcessingRemarks] = useState('');
  const [refundTransactionRef, setRefundTransactionRef] = useState('');
  const [refundDate, setRefundDate] = useState(new Date().toISOString().split('T')[0]);

  // New Refund Form States
  const [newRefundStudentId, setNewRefundStudentId] = useState('');
  const [newRefundReceiptNo, setNewRefundReceiptNo] = useState('');
  const [newRefundAmount, setNewRefundAmount] = useState('');
  const [newRefundReason, setNewRefundReason] = useState('');
  const [newRefundCategory, setNewRefundCategory] = useState('');
  const [newRefundMode, setNewRefundMode] = useState('original-mode');
  const [newRefundRemarks, setNewRefundRemarks] = useState('');

  // Mock Data
  const refunds: RefundRequest[] = [
  {
    id: '1',
    requestNo: 'REF-2024-001',
    requestDate: '2024-03-15',
    studentId: 'STU-2024-045',
    studentName: 'Vikram Singh',
    fatherName: 'Rajendra Singh',
    class: '10',
    section: 'A',
    rollNo: '25',
    contactNo: '+91 98765 43210',
    email: 'rajendra.singh@email.com',
    originalReceiptNo: 'RCP-2024-005',
    originalReceiptDate: '2024-03-10',
    originalAmount: 25000,
    originalPaymentMode: 'Online Transfer',
    originalTransactionRef: 'TXN123456789',
    refundAmount: 5000,
    refundReason: 'Double payment made by mistake through online banking',
    refundCategory: 'double-payment',
    refundMode: 'bank-transfer',
    bankName: 'HDFC Bank',
    accountNo: 'XXXX XXXX 4567',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Rajendra Singh',
    status: 'pending',
    requestedBy: 'Accounts Clerk',
    remarks: 'Parent reported duplicate transaction',
    feeHeads: [
    { name: 'Tuition Fee', amount: 5000 }]

  },
  {
    id: '2',
    requestNo: 'REF-2024-002',
    requestDate: '2024-03-14',
    studentId: 'STU-2024-078',
    studentName: 'Anjali Gupta',
    fatherName: 'Suresh Gupta',
    class: '9',
    section: 'B',
    rollNo: '18',
    contactNo: '+91 98765 43211',
    email: 'suresh.gupta@email.com',
    originalReceiptNo: 'RCP-2024-012',
    originalReceiptDate: '2024-03-08',
    originalAmount: 15000,
    originalPaymentMode: 'Cheque',
    originalTransactionRef: 'CHQ-887766',
    refundAmount: 2500,
    refundReason: 'Excess fee collected due to wrong fee structure applied',
    refundCategory: 'excess-fee',
    refundMode: 'cheque',
    status: 'approved',
    requestedBy: 'Fee Admin',
    approvedBy: 'Principal',
    approvalDate: '2024-03-15',
    remarks: 'Wrong fee category was applied initially',
    feeHeads: [
    { name: 'Lab Fee', amount: 1500 },
    { name: 'Activity Fee', amount: 1000 }]

  },
  {
    id: '3',
    requestNo: 'REF-2024-003',
    requestDate: '2024-03-12',
    studentId: 'STU-2024-032',
    studentName: 'Rahul Sharma',
    fatherName: 'Amit Sharma',
    class: '11',
    section: 'C',
    rollNo: '12',
    contactNo: '+91 98765 43212',
    email: 'amit.sharma@email.com',
    originalReceiptNo: 'RCP-2024-008',
    originalReceiptDate: '2024-03-05',
    originalAmount: 50000,
    originalPaymentMode: 'Online Transfer',
    originalTransactionRef: 'TXN987654321',
    refundAmount: 45000,
    refundReason: 'Student withdrawal from school - TC applied',
    refundCategory: 'withdrawal',
    refundMode: 'bank-transfer',
    bankName: 'SBI',
    accountNo: 'XXXX XXXX 8901',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Amit Sharma',
    status: 'processing',
    requestedBy: 'Admission Office',
    approvedBy: 'Director',
    approvalDate: '2024-03-14',
    remarks: 'TC issued on 2024-03-13',
    feeHeads: [
    { name: 'Tuition Fee (Remaining)', amount: 30000 },
    { name: 'Transport Fee (Remaining)', amount: 10000 },
    { name: 'Annual Charges (Pro-rata)', amount: 5000 }]

  },
  {
    id: '4',
    requestNo: 'REF-2024-004',
    requestDate: '2024-03-10',
    studentId: 'STU-2024-089',
    studentName: 'Priya Patel',
    fatherName: 'Kiran Patel',
    class: '8',
    section: 'A',
    rollNo: '07',
    contactNo: '+91 98765 43213',
    email: 'kiran.patel@email.com',
    originalReceiptNo: 'RCP-2024-003',
    originalReceiptDate: '2024-03-01',
    originalAmount: 18000,
    originalPaymentMode: 'Cash',
    originalTransactionRef: 'CASH-001234',
    refundAmount: 3000,
    refundReason: 'Fee revision - reduced transport fee due to route change',
    refundCategory: 'fee-revision',
    refundMode: 'cash',
    status: 'completed',
    requestedBy: 'Transport Admin',
    approvedBy: 'Accounts Head',
    approvalDate: '2024-03-11',
    processedBy: 'Cashier',
    processedDate: '2024-03-12',
    remarks: 'Route changed from 10km to 5km zone',
    feeHeads: [
    { name: 'Transport Fee Difference', amount: 3000 }]

  },
  {
    id: '5',
    requestNo: 'REF-2024-005',
    requestDate: '2024-03-08',
    studentId: 'STU-2024-056',
    studentName: 'Arjun Reddy',
    fatherName: 'Venkat Reddy',
    class: '12',
    section: 'B',
    rollNo: '22',
    contactNo: '+91 98765 43214',
    email: 'venkat.reddy@email.com',
    originalReceiptNo: 'RCP-2024-001',
    originalReceiptDate: '2024-02-28',
    originalAmount: 35000,
    originalPaymentMode: 'Online Transfer',
    originalTransactionRef: 'TXN456789123',
    refundAmount: 8000,
    refundReason: 'Scholarship applied after fee payment',
    refundCategory: 'other',
    refundMode: 'bank-transfer',
    bankName: 'ICICI Bank',
    accountNo: 'XXXX XXXX 2345',
    ifscCode: 'ICIC0001234',
    accountHolderName: 'Venkat Reddy',
    status: 'rejected',
    requestedBy: 'Scholarship Cell',
    rejectionReason: 'Scholarship not applicable for this academic year',
    remarks: 'Scholarship criteria not met',
    feeHeads: [
    { name: 'Scholarship Refund', amount: 8000 }]

  },
  {
    id: '6',
    requestNo: 'REF-2024-006',
    requestDate: '2024-03-16',
    studentId: 'STU-2024-023',
    studentName: 'Sneha Verma',
    fatherName: 'Prakash Verma',
    class: '7',
    section: 'C',
    rollNo: '15',
    contactNo: '+91 98765 43215',
    email: 'prakash.verma@email.com',
    originalReceiptNo: 'RCP-2024-018',
    originalReceiptDate: '2024-03-14',
    originalAmount: 12000,
    originalPaymentMode: 'UPI',
    originalTransactionRef: 'UPI123456789',
    refundAmount: 12000,
    refundReason: 'Complete duplicate payment - same amount paid twice on same day',
    refundCategory: 'double-payment',
    refundMode: 'original-mode',
    status: 'pending',
    requestedBy: 'Parent Request',
    remarks: 'UPI payment was processed twice',
    feeHeads: [
    { name: 'Term 2 Fee (Duplicate)', amount: 12000 }]

  }];


  const refundHistory: RefundHistory[] = [
  { id: '1', action: 'Request Created', performedBy: 'Accounts Clerk', performedAt: '2024-03-15 10:30 AM' },
  { id: '2', action: 'Documents Verified', performedBy: 'Accounts Officer', performedAt: '2024-03-15 02:15 PM' },
  { id: '3', action: 'Approved', performedBy: 'Principal', performedAt: '2024-03-16 11:00 AM', remarks: 'Approved for refund' },
  { id: '4', action: 'Payment Processed', performedBy: 'Cashier', performedAt: '2024-03-17 03:30 PM', remarks: 'NEFT Transfer initiated' }];


  // Handlers
  const handleSelectRefund = (refundId: string) => {
    setSelectedRefunds((prev) =>
    prev.includes(refundId) ?
    prev.filter((id) => id !== refundId) :
    [...prev, refundId]
    );
  };

  const handleSelectAll = () => {
    const pendingRefunds = filteredRefunds.filter((r) => r.status === 'pending' || r.status === 'approved');
    if (selectedRefunds.length === pendingRefunds.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(pendingRefunds.map((r) => r.id));
    }
  };

  const handleViewDetails = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setShowDetailModal(true);
  };

  const handleApprove = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setApprovalRemarks('');
    setShowApproveModal(true);
  };

  const handleReject = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleProcess = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setProcessingRemarks('');
    setRefundTransactionRef('');
    setRefundDate(new Date().toISOString().split('T')[0]);
    setShowProcessModal(true);
  };

  const handleConfirmApproval = () => {
    console.log('Approving refund:', selectedRefund?.id, approvalRemarks);
    setShowApproveModal(false);
    setSelectedRefund(null);
  };

  const handleConfirmRejection = () => {
    console.log('Rejecting refund:', selectedRefund?.id, rejectionReason);
    setShowRejectModal(false);
    setSelectedRefund(null);
  };

  const handleConfirmProcessing = () => {
    console.log('Processing refund:', selectedRefund?.id, refundTransactionRef);
    setShowProcessModal(false);
    setSelectedRefund(null);
  };

  const handleBulkApprove = () => {
    console.log('Bulk approving:', selectedRefunds);
    setShowBulkApproveModal(false);
    setSelectedRefunds([]);
  };

  const handleCreateRefund = () => {
    console.log('Creating new refund request');
    setShowNewRefundModal(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setFromDate('');
    setToDate('');
    setClassFilter('all');
  };

  // Filter Logic
  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
    refund.requestNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.originalReceiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || refund.refundCategory === categoryFilter;
    const matchesClass = classFilter === 'all' || refund.class === classFilter;

    const matchesDateRange =
    (!fromDate || refund.requestDate >= fromDate) && (
    !toDate || refund.requestDate <= toDate);

    return matchesSearch && matchesStatus && matchesCategory && matchesClass && matchesDateRange;
  });

  const getStatusBadge = (status: RefundRequest['status']) => {
    const config = {
      pending: { variant: 'warning' as const, icon: <Clock className="w-3 h-3" />, label: 'Pending Approval' },
      approved: { variant: 'info' as const, icon: <CheckCircle className="w-3 h-3" />, label: 'Approved' },
      rejected: { variant: 'danger' as const, icon: <XCircle className="w-3 h-3" />, label: 'Rejected' },
      processing: { variant: 'info' as const, icon: <RefreshCw className="w-3 h-3 animate-spin" />, label: 'Processing' },
      completed: { variant: 'success' as const, icon: <CheckCircle className="w-3 h-3" />, label: 'Completed' },
      cancelled: { variant: 'default' as const, icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' }
    };
    const { variant, icon, label } = config[status];
    return (
      <Badge variant={variant}>
        {icon}
        <span className="ml-1">{label}</span>
      </Badge>);

  };

  const getCategoryBadge = (category: RefundRequest['refundCategory']) => {
    const config = {
      'double-payment': { color: 'bg-red-100 text-red-700', label: 'Double Payment' },
      'excess-fee': { color: 'bg-orange-100 text-orange-700', label: 'Excess Fee' },
      'withdrawal': { color: 'bg-purple-100 text-purple-700', label: 'Withdrawal' },
      'fee-revision': { color: 'bg-blue-100 text-blue-700', label: 'Fee Revision' },
      'other': { color: 'bg-gray-100 text-gray-700', label: 'Other' }
    };
    const { color, label } = config[category];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>);

  };

  const pendingCount = refunds.filter((r) => r.status === 'pending').length;
  const approvedCount = refunds.filter((r) => r.status === 'approved').length;
  const processingCount = refunds.filter((r) => r.status === 'processing').length;
  const completedCount = refunds.filter((r) => r.status === 'completed').length;
  const totalPendingAmount = refunds.
  filter((r) => r.status === 'pending' || r.status === 'approved').
  reduce((sum, r) => sum + r.refundAmount, 0);

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={
      selectedRefunds.length > 0 &&
      selectedRefunds.length === filteredRefunds.filter((r) => r.status === 'pending' || r.status === 'approved').length
      }
      onChange={handleSelectAll}
      className="rounded border-gray-300" />,


    render: (row: RefundRequest) =>
    row.status === 'pending' || row.status === 'approved' ?
    <input
      type="checkbox"
      checked={selectedRefunds.includes(row.id)}
      onChange={() => handleSelectRefund(row.id)}
      className="rounded border-gray-300" /> :

    null

  },
  {
    key: 'request',
    header: 'Request Details',
    render: (row: RefundRequest) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{row.requestNo}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(row.requestDate).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="mt-1">
            {getCategoryBadge(row.refundCategory)}
          </div>
        </div>

  },
  {
    key: 'student',
    header: 'Student Information',
    render: (row: RefundRequest) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{row.studentName}</span>
          </div>
          <div className="text-xs text-gray-600">
            Class {row.class}-{row.section} • Roll No: {row.rollNo}
          </div>
          <div className="text-xs text-gray-500">
            ID: {row.studentId}
          </div>
        </div>

  },
  {
    key: 'original',
    header: 'Original Payment',
    render: (row: RefundRequest) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{row.originalReceiptNo}</span>
          </div>
          <div className="text-xs text-gray-600">
            {row.originalPaymentMode}
          </div>
          <div className="text-sm font-medium text-gray-700">
            ₹{row.originalAmount.toLocaleString('en-IN')}
          </div>
        </div>

  },
  {
    key: 'refund',
    header: 'Refund Amount',
    render: (row: RefundRequest) =>
    <div className="space-y-1">
          <div className="flex items-center gap-1 text-lg font-bold text-red-600">
            <IndianRupee className="w-4 h-4" />
            <span>{row.refundAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xs text-gray-500">
            {row.feeHeads.length} fee head(s)
          </div>
          <div className="text-xs text-gray-600 capitalize">
            Via {row.refundMode.replace('-', ' ')}
          </div>
        </div>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: RefundRequest) =>
    <div className="max-w-xs">
          <p className="text-sm text-gray-700 line-clamp-2">{row.refundReason}</p>
          {row.remarks &&
      <p className="text-xs text-gray-500 mt-1 italic">Note: {row.remarks}</p>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: RefundRequest) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          {row.approvedBy &&
      <div className="text-xs text-gray-500 mt-1">
              By: {row.approvedBy}
            </div>
      }
          {row.processedDate &&
      <div className="text-xs text-green-600">
              {new Date(row.processedDate).toLocaleDateString('en-IN')}
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: RefundRequest) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => handleViewDetails(row)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        title="View Details">

            <Eye className="w-4 h-4 text-blue-600" />
          </button>

          {row.status === 'pending' &&
      <>
              <button
          onClick={() => handleApprove(row)}
          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
          title="Approve">

                <CheckCircle className="w-4 h-4 text-green-600" />
              </button>
              <button
          onClick={() => handleReject(row)}
          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          title="Reject">

                <XCircle className="w-4 h-4 text-red-600" />
              </button>
            </>
      }

          {row.status === 'approved' &&
      <button
        onClick={() => handleProcess(row)}
        className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
        title="Process Refund">

              <Banknote className="w-4 h-4 text-blue-600" />
            </button>
      }

          {row.status === 'completed' &&
      <button
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        title="Print Voucher">

              <Printer className="w-4 h-4 text-gray-600" />
            </button>
      }
        </div>

  }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <RotateCcw className="w-6 h-6 text-red-600" />
            </div>
            Fee Refund Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Process, approve, and track fee refund requests
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-yellow-600">{pendingCount}</span> Pending
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-blue-600">{approvedCount}</span> Approved
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-purple-600">{processingCount}</span> Processing
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-green-600">{completedCount}</span> Completed
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              Pending Amount: <span className="font-bold text-red-600">₹{totalPendingAmount.toLocaleString('en-IN')}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedRefunds.length > 0 &&
          <Button
            variant="primary"
            onClick={() => setShowBulkApproveModal(true)}
            className="bg-green-600 hover:bg-green-700">

              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Selected ({selectedRefunds.length})
            </Button>
          }
          <Button variant="outline" onClick={() => setShowNewRefundModal(true)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Refund Request
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Refund Requests
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

            {showAdvancedFilters ?
            <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Filters
              </> :

            <>
                <ChevronDown className="w-4 h-4 mr-1" />
                More Filters
              </>
            }
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by Request No, Student Name, Receipt No, or Student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'cancelled', label: 'Cancelled' }]
            } />

          <Select
            label="Refund Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Categories' },
            { value: 'double-payment', label: 'Double Payment' },
            { value: 'excess-fee', label: 'Excess Fee' },
            { value: 'withdrawal', label: 'Withdrawal' },
            { value: 'fee-revision', label: 'Fee Revision' },
            { value: 'other', label: 'Other' }]
            } />

        </div>

        {showAdvancedFilters &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <Input
            type="date"
            label="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)} />

            <Input
            type="date"
            label="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)} />

            <Select
            label="Class"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Classes' },
            ...Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              label: `Class ${i + 1}`
            }))]
            } />

            <div className="flex items-end">
              <Button variant="outline" onClick={handleClearFilters} className="w-full">
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        }

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 text-sm">
          <span className="text-gray-600">
            Showing <span className="font-semibold">{filteredRefunds.length}</span> of{' '}
            <span className="font-semibold">{refunds.length}</span> refund requests
          </span>
          {selectedRefunds.length > 0 &&
          <span className="text-blue-600 font-medium">
              {selectedRefunds.length} request(s) selected
            </span>
          }
        </div>
      </Card>

      {/* Refunds Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredRefunds} />
        </div>

        {filteredRefunds.length === 0 &&
        <div className="text-center py-12">
            <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Refund Requests Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        }
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Refund Categories</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-600">Double Payment - Duplicate payment received</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm text-gray-600">Excess Fee - More than required amount paid</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-sm text-gray-600">Withdrawal - Student left school</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-sm text-gray-600">Fee Revision - Fee structure changed</span>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedRefund &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Refund Request Details</h2>
                  <p className="text-sm text-gray-500">{selectedRefund.requestNo}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedRefund.status)}
                  <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg">

                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
                {/* Student & Request Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Name:</span>
                        <span className="font-medium text-blue-900">{selectedRefund.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Father's Name:</span>
                        <span className="font-medium text-blue-900">{selectedRefund.fatherName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Student ID:</span>
                        <span className="font-medium text-blue-900">{selectedRefund.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Class:</span>
                        <span className="font-medium text-blue-900">
                          {selectedRefund.class}-{selectedRefund.section} (Roll: {selectedRefund.rollNo})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Contact:</span>
                        <span className="font-medium text-blue-900">{selectedRefund.contactNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Email:</span>
                        <span className="font-medium text-blue-900">{selectedRefund.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Request Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request No:</span>
                        <span className="font-medium text-gray-900">{selectedRefund.requestNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedRefund.requestDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        {getCategoryBadge(selectedRefund.refundCategory)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested By:</span>
                        <span className="font-medium text-gray-900">{selectedRefund.requestedBy}</span>
                      </div>
                      {selectedRefund.approvedBy &&
                    <div className="flex justify-between">
                          <span className="text-gray-600">Approved By:</span>
                          <span className="font-medium text-gray-900">{selectedRefund.approvedBy}</span>
                        </div>
                    }
                    </div>
                  </div>
                </div>

                {/* Original Payment & Refund Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Original Payment
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Receipt No:</span>
                        <span className="font-medium text-green-900">{selectedRefund.originalReceiptNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Receipt Date:</span>
                        <span className="font-medium text-green-900">
                          {new Date(selectedRefund.originalReceiptDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Payment Mode:</span>
                        <span className="font-medium text-green-900">{selectedRefund.originalPaymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Transaction Ref:</span>
                        <span className="font-mono font-medium text-green-900">{selectedRefund.originalTransactionRef}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-green-200">
                        <span className="text-green-700 font-semibold">Total Amount:</span>
                        <span className="font-bold text-green-900">₹{selectedRefund.originalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Refund Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700">Refund Mode:</span>
                        <span className="font-medium text-red-900 capitalize">
                          {selectedRefund.refundMode.replace('-', ' ')}
                        </span>
                      </div>
                      {selectedRefund.bankName &&
                    <>
                          <div className="flex justify-between">
                            <span className="text-red-700">Bank:</span>
                            <span className="font-medium text-red-900">{selectedRefund.bankName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">Account:</span>
                            <span className="font-mono font-medium text-red-900">{selectedRefund.accountNo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700">IFSC:</span>
                            <span className="font-mono font-medium text-red-900">{selectedRefund.ifscCode}</span>
                          </div>
                        </>
                    }
                      <div className="flex justify-between pt-2 border-t border-red-200">
                        <span className="text-red-700 font-semibold">Refund Amount:</span>
                        <span className="font-bold text-red-900 text-lg">₹{selectedRefund.refundAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Heads */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Fee Head Breakdown</h3>
                  <div className="space-y-2">
                    {selectedRefund.feeHeads.map((feeHead, index) =>
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-gray-700">{feeHead.name}</span>
                        <span className="font-medium text-gray-900">₹{feeHead.amount.toLocaleString('en-IN')}</span>
                      </div>
                  )}
                    <div className="flex justify-between items-center p-2 bg-red-100 rounded-lg">
                      <span className="font-semibold text-red-700">Total Refund</span>
                      <span className="font-bold text-red-700">₹{selectedRefund.refundAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Refund Reason
                  </h3>
                  <p className="text-sm text-yellow-800">{selectedRefund.refundReason}</p>
                  {selectedRefund.remarks &&
                <p className="text-xs text-yellow-700 mt-2 italic">Note: {selectedRefund.remarks}</p>
                }
                </div>

                {/* Rejection Reason if rejected */}
                {selectedRefund.status === 'rejected' && selectedRefund.rejectionReason &&
              <div className="bg-red-100 rounded-xl p-4 border border-red-200">
                    <h3 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Rejection Reason
                    </h3>
                    <p className="text-sm text-red-800">{selectedRefund.rejectionReason}</p>
                  </div>
              }

                {/* Timeline */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Processing Timeline
                  </h3>
                  <div className="space-y-4">
                    {refundHistory.map((item, index) =>
                  <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                      index === refundHistory.length - 1 ? 'bg-blue-500' : 'bg-green-500'}`
                      }></div>
                          {index < refundHistory.length - 1 &&
                      <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                      }
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{item.action}</p>
                              <p className="text-xs text-gray-500">By {item.performedBy}</p>
                            </div>
                            <span className="text-xs text-gray-500">{item.performedAt}</span>
                          </div>
                          {item.remarks &&
                      <p className="text-xs text-gray-600 mt-1 italic">"{item.remarks}"</p>
                      }
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {selectedRefund.status === 'completed' &&
                <Button variant="outline">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Voucher
                    </Button>
                }
                  {selectedRefund.status === 'pending' &&
                <>
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => {
                    setShowDetailModal(false);
                    handleReject(selectedRefund);
                  }}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={() => {
                    setShowDetailModal(false);
                    handleApprove(selectedRefund);
                  }}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                }
                  {selectedRefund.status === 'approved' &&
                <Button variant="primary" onClick={() => {
                  setShowDetailModal(false);
                  handleProcess(selectedRefund);
                }}>
                      <Banknote className="w-4 h-4 mr-2" />
                      Process Refund
                    </Button>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Approve Modal */}
      {showApproveModal && selectedRefund &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowApproveModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Approve Refund Request
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-green-700">Request No:</span>
                    <span className="font-semibold text-green-900">{selectedRefund.requestNo}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-700">Student:</span>
                    <span className="font-medium text-green-900">{selectedRefund.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Refund Amount:</span>
                    <span className="font-bold text-green-900 text-lg">₹{selectedRefund.refundAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Remarks (Optional)
                  </label>
                  <textarea
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="Add any remarks for approval..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />

                </div>

                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Once approved, this request will be sent for payment processing.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleConfirmApproval}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Approval
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Reject Modal */}
      {showRejectModal && selectedRefund &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowRejectModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Reject Refund Request
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-red-700">Request No:</span>
                    <span className="font-semibold text-red-900">{selectedRefund.requestNo}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-700">Student:</span>
                    <span className="font-medium text-red-900">{selectedRefund.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Refund Amount:</span>
                    <span className="font-bold text-red-900 text-lg">₹{selectedRefund.refundAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <Select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  options={[
                  { value: '', label: 'Select Reason' },
                  { value: 'invalid-request', label: 'Invalid Request' },
                  { value: 'documents-missing', label: 'Required Documents Missing' },
                  { value: 'policy-violation', label: 'Policy Violation' },
                  { value: 'already-refunded', label: 'Already Refunded' },
                  { value: 'incorrect-amount', label: 'Incorrect Amount' },
                  { value: 'not-eligible', label: 'Not Eligible for Refund' },
                  { value: 'other', label: 'Other' }]
                  } />

                </div>

                {rejectionReason === 'other' &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specify Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                  placeholder="Enter rejection reason..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20" />

                  </div>
              }

                <div className="bg-yellow-50 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    This action cannot be undone. The requester will be notified of the rejection.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmRejection}
                disabled={!rejectionReason}>

                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Process Modal */}
      {showProcessModal && selectedRefund &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowProcessModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Banknote className="w-6 h-6 text-blue-600" />
                  Process Refund Payment
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700 block">Request No:</span>
                      <span className="font-semibold text-blue-900">{selectedRefund.requestNo}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 block">Student:</span>
                      <span className="font-medium text-blue-900">{selectedRefund.studentName}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 block">Refund Mode:</span>
                      <span className="font-medium text-blue-900 capitalize">{selectedRefund.refundMode.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 block">Refund Amount:</span>
                      <span className="font-bold text-blue-900 text-lg">₹{selectedRefund.refundAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {selectedRefund.bankName &&
              <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 block">Bank:</span>
                        <span className="font-medium">{selectedRefund.bankName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Account:</span>
                        <span className="font-mono font-medium">{selectedRefund.accountNo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">IFSC:</span>
                        <span className="font-mono font-medium">{selectedRefund.ifscCode}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Account Holder:</span>
                        <span className="font-medium">{selectedRefund.accountHolderName}</span>
                      </div>
                    </div>
                  </div>
              }

                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Refund Date"
                  type="date"
                  value={refundDate}
                  onChange={(e) => setRefundDate(e.target.value)}
                  required />

                  <Input
                  label="Transaction Reference"
                  placeholder="Enter transaction ref"
                  value={refundTransactionRef}
                  onChange={(e) => setRefundTransactionRef(e.target.value)}
                  required />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Remarks
                  </label>
                  <textarea
                  value={processingRemarks}
                  onChange={(e) => setProcessingRemarks(e.target.value)}
                  placeholder="Add any processing notes..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-700">
                    After processing, a refund voucher will be generated and the student account will be updated.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowProcessModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleConfirmProcessing}
                disabled={!refundTransactionRef || !refundDate}>

                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Refund
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Bulk Approve Modal */}
      {showBulkApproveModal &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowBulkApproveModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Bulk Approve Refunds
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    You are about to approve {selectedRefunds.length} refund request(s).
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Total Amount: ₹
                    {refunds.
                  filter((r) => selectedRefunds.includes(r.id)).
                  reduce((sum, r) => sum + r.refundAmount, 0).
                  toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Remarks (Optional)
                  </label>
                  <textarea
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="Add remarks for all selected requests..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />

                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowBulkApproveModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleBulkApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve All
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* New Refund Request Modal */}
      {showNewRefundModal &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowNewRefundModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                  Create New Refund Request
                </h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to create a refund request</p>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
                {/* Student & Receipt Lookup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                  label="Student ID / GR Number"
                  placeholder="Enter Student ID"
                  value={newRefundStudentId}
                  onChange={(e) => setNewRefundStudentId(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required />

                  <Input
                  label="Original Receipt Number"
                  placeholder="Enter Receipt No"
                  value={newRefundReceiptNo}
                  onChange={(e) => setNewRefundReceiptNo(e.target.value)}
                  leftIcon={<Receipt className="w-4 h-4" />}
                  required />

                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Fetch Details
                  </Button>
                </div>

                {/* Refund Details */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Refund Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                    label="Refund Category"
                    value={newRefundCategory}
                    onChange={(e) => setNewRefundCategory(e.target.value)}
                    options={[
                    { value: '', label: 'Select Category' },
                    { value: 'double-payment', label: 'Double Payment' },
                    { value: 'excess-fee', label: 'Excess Fee' },
                    { value: 'withdrawal', label: 'Withdrawal' },
                    { value: 'fee-revision', label: 'Fee Revision' },
                    { value: 'other', label: 'Other' }]
                    }
                    required />

                    <Input
                    label="Refund Amount"
                    type="number"
                    placeholder="Enter amount"
                    value={newRefundAmount}
                    onChange={(e) => setNewRefundAmount(e.target.value)}
                    leftIcon={<IndianRupee className="w-4 h-4" />}
                    required />

                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Refund <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    value={newRefundReason}
                    onChange={(e) => setNewRefundReason(e.target.value)}
                    placeholder="Explain the reason for this refund request..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>

                  <div className="mt-4">
                    <Select
                    label="Refund Mode"
                    value={newRefundMode}
                    onChange={(e) => setNewRefundMode(e.target.value)}
                    options={[
                    { value: 'original-mode', label: 'Same as Original Payment' },
                    { value: 'bank-transfer', label: 'Bank Transfer / NEFT' },
                    { value: 'cheque', label: 'Cheque' },
                    { value: 'cash', label: 'Cash' }]
                    } />

                  </div>

                  {newRefundMode === 'bank-transfer' &&
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                      <h4 className="font-medium text-gray-700">Bank Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Bank Name" placeholder="Enter bank name" required />
                        <Input label="Account Number" placeholder="Enter account number" required />
                        <Input label="IFSC Code" placeholder="Enter IFSC" required />
                        <Input label="Account Holder Name" placeholder="Enter name" required />
                      </div>
                    </div>
                }

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Remarks
                    </label>
                    <textarea
                    value={newRefundRemarks}
                    onChange={(e) => setNewRefundRemarks(e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag & drop files here or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, JPG, PNG up to 5MB each
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewRefundModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateRefund}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}