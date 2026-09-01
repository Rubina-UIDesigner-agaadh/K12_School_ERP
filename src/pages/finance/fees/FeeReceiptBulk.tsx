import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  Search,
  Save,
  Printer,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Check,
  Info,
  AlertTriangle,
  IndianRupee,
  History,
  Receipt,
  Percent,
  Award,
  Bus,
  Home,
  Users,
  FileText,
  Settings,
  Target,
  CheckSquare,
  CreditCard,
  Wallet,
  Banknote,
  ArrowUpRight,
  Package,
  CircleDollarSign,
  BadgePercent,
  Upload,
  FileSpreadsheet,
  Link,
  Link2,
  Unlink,
  RefreshCw,
  XCircle,
  FileWarning,
  Filter,
  Trash2,
  Edit,
  MoreVertical,
  Building,
  Globe,
  Database,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  CheckCheck,
  AlertOctagon,
  FileX,
  ListChecks,
  ClipboardList } from
'lucide-react';
// ============================================
// TYPE DEFINITIONS
// ============================================
interface Student {
  id: string;
  grNo: string;
  suId: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  feeCategory: string;
  status: 'active' | 'inactive';
  hasTransport: boolean;
  hasHostel: boolean;
  hasScholarship: boolean;
  scholarshipPercentage?: number;
  hasConcession: boolean;
  concessionPercentage?: number;
}
interface FeeItem {
  id: string;
  feeHeadId: string;
  feeHeadName: string;
  term: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}
interface StudentPaymentEntry {
  id: string;
  student: Student;
  fees: FeeItem[];
  totalDueAmount: number;
  isSelected: boolean;
  isExpanded: boolean;
  payingAmount: number;
  paymentMode: string;
  referenceNo: string;
  chequeDate?: string;
  bankName?: string;
  remarks: string;
  feeBreakdown: {
    feeHeadId: string;
    feeHeadName: string;
    dueAmount: number;
    payingAmount: number;
  }[];
  hasValidationError: boolean;
  validationMessage?: string;
}
interface PaymentMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  requiresReference: boolean;
  requiresChequeDetails: boolean;
}
interface BulkReceiptBatch {
  id: string;
  batchNo: string;
  date: string;
  academicYear: string;
  class: string;
  section: string;
  feeHead: string;
  term: string;
  totalStudents: number;
  totalAmount: number;
  receiptRange: string;
  status: 'completed' | 'partial' | 'failed';
  createdBy: string;
  createdAt: string;
  remarks?: string;
  source: 'manual' | 'excel' | 'gateway';
}
interface ExcelUploadRow {
  id: string;
  rowNumber: number;
  studentId: string;
  grNo: string;
  studentName: string;
  amount: number;
  paymentMode: string;
  referenceNo: string;
  paymentDate: string;
  remarks: string;
  matchStatus: 'matched' | 'unmatched' | 'partial' | 'multiple';
  matchedStudent?: Student;
  suggestedMatches?: Student[];
  errors: string[];
  isSelected: boolean;
  isProcessed: boolean;
}
interface GatewaySettlement {
  id: string;
  transactionId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  fee: number;
  tax: number;
  netAmount: number;
  status: 'captured' | 'refunded' | 'failed' | 'pending';
  paymentMethod: string;
  email: string;
  phone: string;
  settlementDate: string;
  matchStatus: 'matched' | 'unmatched' | 'partial';
  matchedStudent?: Student;
  suggestedMatches?: Student[];
  isSelected: boolean;
  isProcessed: boolean;
  remarks?: string;
}
interface ErrorLogEntry {
  id: string;
  timestamp: string;
  type: 'excel_upload' | 'gateway_import' | 'processing' | 'validation';
  source: string;
  rowNumber?: number;
  studentId?: string;
  studentName?: string;
  errorCode: string;
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
  details?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}
interface PaymentGateway {
  id: string;
  name: string;
  icon: React.ReactNode;
  fileFormat: string;
  fields: string[];
}
// ============================================
// MOCK DATA
// ============================================
const paymentModes: PaymentMode[] = [
{
  id: 'cash',
  name: 'Cash',
  icon: <Banknote className="w-4 h-4" />,
  requiresReference: false,
  requiresChequeDetails: false
},
{
  id: 'cheque',
  name: 'Cheque',
  icon: <FileText className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: true
},
{
  id: 'dd',
  name: 'Demand Draft',
  icon: <FileText className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: true
},
{
  id: 'online',
  name: 'Online Transfer (NEFT/RTGS/IMPS)',
  icon: <ArrowUpRight className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: false
},
{
  id: 'upi',
  name: 'UPI',
  icon: <Wallet className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: false
},
{
  id: 'card',
  name: 'Debit/Credit Card',
  icon: <CreditCard className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: false
},
{
  id: 'wallet',
  name: 'Digital Wallet',
  icon: <Wallet className="w-4 h-4" />,
  requiresReference: true,
  requiresChequeDetails: false
}];

const paymentGateways: PaymentGateway[] = [
{
  id: 'razorpay',
  name: 'Razorpay',
  icon: <Zap className="w-4 h-4" />,
  fileFormat: 'CSV/Excel',
  fields: ['payment_id', 'order_id', 'amount', 'status', 'email', 'contact']
},
{
  id: 'payu',
  name: 'PayU',
  icon: <Globe className="w-4 h-4" />,
  fileFormat: 'CSV',
  fields: ['mihpayid', 'txnid', 'amount', 'status', 'email', 'phone']
},
{
  id: 'ccavenue',
  name: 'CCAvenue',
  icon: <Building className="w-4 h-4" />,
  fileFormat: 'CSV',
  fields: [
  'order_id',
  'tracking_id',
  'amount',
  'order_status',
  'billing_email']

},
{
  id: 'paytm',
  name: 'Paytm',
  icon: <Wallet className="w-4 h-4" />,
  fileFormat: 'CSV',
  fields: ['ORDERID', 'TXNID', 'TXNAMOUNT', 'STATUS', 'EMAIL']
},
{
  id: 'hdfc',
  name: 'HDFC Payment Gateway',
  icon: <Building className="w-4 h-4" />,
  fileFormat: 'Excel',
  fields: ['TxnRefNo', 'OrderId', 'Amount', 'TxnStatus', 'CustomerEmail']
},
{
  id: 'icici',
  name: 'ICICI PaySeal',
  icon: <Building className="w-4 h-4" />,
  fileFormat: 'CSV',
  fields: ['ReferenceNo', 'MerchantRefNo', 'Amount', 'ResponseCode', 'Email']
}];

const getMockStudentPayments = (): StudentPaymentEntry[] => [
{
  id: '1',
  student: {
    id: '1',
    grNo: 'GR2024001',
    suId: 'SU12345678',
    rollNo: '01',
    firstName: 'Rahul',
    lastName: 'Sharma',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Amit Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'amit.sharma@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: true,
    scholarshipPercentage: 10,
    hasConcession: false
  },
  fees: [
  {
    id: 'f1',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    term: 'Term 2',
    totalAmount: 25000,
    discountAmount: 2500,
    paidAmount: 0,
    balanceAmount: 22500,
    dueDate: '2024-10-15',
    status: 'unpaid'
  },
  {
    id: 'f2',
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    term: 'Term 2',
    totalAmount: 4000,
    discountAmount: 400,
    paidAmount: 0,
    balanceAmount: 3600,
    dueDate: '2024-10-15',
    status: 'unpaid'
  }],

  totalDueAmount: 26100,
  isSelected: true,
  isExpanded: false,
  payingAmount: 26100,
  paymentMode: 'cash',
  referenceNo: '',
  remarks: '',
  feeBreakdown: [
  {
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    dueAmount: 22500,
    payingAmount: 22500
  },
  {
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    dueAmount: 3600,
    payingAmount: 3600
  }],

  hasValidationError: false
},
{
  id: '2',
  student: {
    id: '2',
    grNo: 'GR2024002',
    suId: 'SU12345679',
    rollNo: '02',
    firstName: 'Priya',
    lastName: 'Patel',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Female',
    parentName: 'Rajesh Patel',
    parentPhone: '+91 98765 43211',
    parentEmail: 'rajesh.patel@email.com',
    feeCategory: 'OBC',
    status: 'active',
    hasTransport: false,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: true,
    concessionPercentage: 15
  },
  fees: [
  {
    id: 'f3',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    term: 'Term 2',
    totalAmount: 25000,
    discountAmount: 3750,
    paidAmount: 0,
    balanceAmount: 21250,
    dueDate: '2024-10-15',
    status: 'unpaid'
  },
  {
    id: 'f4',
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    term: 'Term 2',
    totalAmount: 4000,
    discountAmount: 600,
    paidAmount: 0,
    balanceAmount: 3400,
    dueDate: '2024-10-15',
    status: 'unpaid'
  }],

  totalDueAmount: 24650,
  isSelected: true,
  isExpanded: false,
  payingAmount: 24650,
  paymentMode: 'cheque',
  referenceNo: 'CHQ-789456',
  chequeDate: '2024-10-10',
  bankName: 'State Bank of India',
  remarks: '',
  feeBreakdown: [
  {
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    dueAmount: 21250,
    payingAmount: 21250
  },
  {
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    dueAmount: 3400,
    payingAmount: 3400
  }],

  hasValidationError: false
},
{
  id: '3',
  student: {
    id: '3',
    grNo: 'GR2024003',
    suId: 'SU12345680',
    rollNo: '03',
    firstName: 'Amit',
    lastName: 'Kumar',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Suresh Kumar',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.kumar@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: false
  },
  fees: [
  {
    id: 'f5',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    term: 'Term 2',
    totalAmount: 25000,
    discountAmount: 0,
    paidAmount: 10000,
    balanceAmount: 15000,
    dueDate: '2024-10-15',
    status: 'partial'
  },
  {
    id: 'f6',
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    term: 'Term 2',
    totalAmount: 4000,
    discountAmount: 0,
    paidAmount: 0,
    balanceAmount: 4000,
    dueDate: '2024-10-15',
    status: 'unpaid'
  },
  {
    id: 'f7',
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    term: 'Term 2',
    totalAmount: 6000,
    discountAmount: 0,
    paidAmount: 0,
    balanceAmount: 6000,
    dueDate: '2024-10-15',
    status: 'unpaid'
  }],

  totalDueAmount: 25000,
  isSelected: true,
  isExpanded: false,
  payingAmount: 25000,
  paymentMode: 'online',
  referenceNo: 'TXN123456789',
  remarks: 'Online payment received',
  feeBreakdown: [
  {
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    dueAmount: 15000,
    payingAmount: 15000
  },
  {
    feeHeadId: 'lab',
    feeHeadName: 'Lab Fee',
    dueAmount: 4000,
    payingAmount: 4000
  },
  {
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    dueAmount: 6000,
    payingAmount: 6000
  }],

  hasValidationError: false
},
{
  id: '4',
  student: {
    id: '4',
    grNo: 'GR2024004',
    suId: 'SU12345681',
    rollNo: '04',
    firstName: 'Sneha',
    lastName: 'Gupta',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Female',
    parentName: 'Vinod Gupta',
    parentPhone: '+91 98765 43213',
    parentEmail: 'vinod.gupta@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: false,
    hasHostel: true,
    hasScholarship: true,
    scholarshipPercentage: 25,
    hasConcession: false
  },
  fees: [
  {
    id: 'f8',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    term: 'Term 2',
    totalAmount: 25000,
    discountAmount: 6250,
    paidAmount: 0,
    balanceAmount: 18750,
    dueDate: '2024-10-15',
    status: 'unpaid'
  },
  {
    id: 'f9',
    feeHeadId: 'hostel',
    feeHeadName: 'Hostel Fee',
    term: 'Term 2',
    totalAmount: 15000,
    discountAmount: 3750,
    paidAmount: 0,
    balanceAmount: 11250,
    dueDate: '2024-10-15',
    status: 'unpaid'
  }],

  totalDueAmount: 30000,
  isSelected: false,
  isExpanded: false,
  payingAmount: 30000,
  paymentMode: 'cash',
  referenceNo: '',
  remarks: '',
  feeBreakdown: [
  {
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    dueAmount: 18750,
    payingAmount: 18750
  },
  {
    feeHeadId: 'hostel',
    feeHeadName: 'Hostel Fee',
    dueAmount: 11250,
    payingAmount: 11250
  }],

  hasValidationError: false
},
{
  id: '5',
  student: {
    id: '5',
    grNo: 'GR2024005',
    suId: 'SU12345682',
    rollNo: '05',
    firstName: 'Vikram',
    lastName: 'Singh',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Harbhajan Singh',
    parentPhone: '+91 98765 43214',
    parentEmail: 'harbhajan.singh@email.com',
    feeCategory: 'Staff Ward',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: true,
    concessionPercentage: 50
  },
  fees: [
  {
    id: 'f10',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    term: 'Term 2',
    totalAmount: 25000,
    discountAmount: 12500,
    paidAmount: 0,
    balanceAmount: 12500,
    dueDate: '2024-10-15',
    status: 'unpaid'
  },
  {
    id: 'f11',
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    term: 'Term 2',
    totalAmount: 6000,
    discountAmount: 3000,
    paidAmount: 0,
    balanceAmount: 3000,
    dueDate: '2024-10-15',
    status: 'unpaid'
  }],

  totalDueAmount: 15500,
  isSelected: true,
  isExpanded: false,
  payingAmount: 15500,
  paymentMode: 'upi',
  referenceNo: 'UPI/456789/2024',
  remarks: 'Staff ward - 50% concession',
  feeBreakdown: [
  {
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    dueAmount: 12500,
    payingAmount: 12500
  },
  {
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    dueAmount: 3000,
    payingAmount: 3000
  }],

  hasValidationError: false
}];

const getMockExcelUploads = (): ExcelUploadRow[] => [
{
  id: '1',
  rowNumber: 2,
  studentId: 'SU12345678',
  grNo: 'GR2024001',
  studentName: 'Rahul Sharma',
  amount: 26100,
  paymentMode: 'Cash',
  referenceNo: '',
  paymentDate: '2024-10-15',
  remarks: 'Full payment',
  matchStatus: 'matched',
  matchedStudent: {
    id: '1',
    grNo: 'GR2024001',
    suId: 'SU12345678',
    rollNo: '01',
    firstName: 'Rahul',
    lastName: 'Sharma',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Amit Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'amit.sharma@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: true,
    scholarshipPercentage: 10,
    hasConcession: false
  },
  errors: [],
  isSelected: true,
  isProcessed: false
},
{
  id: '2',
  rowNumber: 3,
  studentId: 'SU12345679',
  grNo: 'GR2024002',
  studentName: 'Priya Patel',
  amount: 24650,
  paymentMode: 'Cheque',
  referenceNo: 'CHQ-123456',
  paymentDate: '2024-10-15',
  remarks: '',
  matchStatus: 'matched',
  matchedStudent: {
    id: '2',
    grNo: 'GR2024002',
    suId: 'SU12345679',
    rollNo: '02',
    firstName: 'Priya',
    lastName: 'Patel',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Female',
    parentName: 'Rajesh Patel',
    parentPhone: '+91 98765 43211',
    parentEmail: 'rajesh.patel@email.com',
    feeCategory: 'OBC',
    status: 'active',
    hasTransport: false,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: true,
    concessionPercentage: 15
  },
  errors: [],
  isSelected: true,
  isProcessed: false
},
{
  id: '3',
  rowNumber: 4,
  studentId: '',
  grNo: 'GR2024099',
  studentName: 'Unknown Student',
  amount: 15000,
  paymentMode: 'Cash',
  referenceNo: '',
  paymentDate: '2024-10-15',
  remarks: '',
  matchStatus: 'unmatched',
  errors: ['Student not found with GR No: GR2024099'],
  isSelected: false,
  isProcessed: false
},
{
  id: '4',
  rowNumber: 5,
  studentId: 'SU12345680',
  grNo: '',
  studentName: 'Amit Kumar',
  amount: -5000,
  paymentMode: 'Online',
  referenceNo: 'TXN789',
  paymentDate: '2024-10-15',
  remarks: '',
  matchStatus: 'matched',
  matchedStudent: {
    id: '3',
    grNo: 'GR2024003',
    suId: 'SU12345680',
    rollNo: '03',
    firstName: 'Amit',
    lastName: 'Kumar',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Suresh Kumar',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.kumar@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: false
  },
  errors: ['Invalid amount: Amount cannot be negative'],
  isSelected: false,
  isProcessed: false
},
{
  id: '5',
  rowNumber: 6,
  studentId: '',
  grNo: '',
  studentName: 'Raj Kumar',
  amount: 20000,
  paymentMode: 'UPI',
  referenceNo: 'UPI/999',
  paymentDate: '2024-10-15',
  remarks: '',
  matchStatus: 'multiple',
  suggestedMatches: [
  {
    id: '3',
    grNo: 'GR2024003',
    suId: 'SU12345680',
    rollNo: '03',
    firstName: 'Amit',
    lastName: 'Kumar',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Suresh Kumar',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.kumar@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: false
  },
  {
    id: '7',
    grNo: 'GR2024007',
    suId: 'SU12345684',
    rollNo: '07',
    firstName: 'Karan',
    lastName: 'Malhotra',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Ashok Malhotra',
    parentPhone: '+91 98765 43216',
    parentEmail: 'ashok.malhotra@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: false
  }],

  errors: ['Multiple students found matching name "Raj Kumar"'],
  isSelected: false,
  isProcessed: false
}];

const getMockGatewaySettlements = (): GatewaySettlement[] => [
{
  id: '1',
  transactionId: 'pay_OcT123456789',
  orderId: 'order_FEE2024001',
  paymentId: 'pay_OcT123456789',
  amount: 26100,
  fee: 523,
  tax: 94,
  netAmount: 25483,
  status: 'captured',
  paymentMethod: 'UPI',
  email: 'amit.sharma@email.com',
  phone: '+91 98765 43210',
  settlementDate: '2024-10-15',
  matchStatus: 'matched',
  matchedStudent: {
    id: '1',
    grNo: 'GR2024001',
    suId: 'SU12345678',
    rollNo: '01',
    firstName: 'Rahul',
    lastName: 'Sharma',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Amit Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'amit.sharma@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: true,
    scholarshipPercentage: 10,
    hasConcession: false
  },
  isSelected: true,
  isProcessed: false
},
{
  id: '2',
  transactionId: 'pay_OcT234567890',
  orderId: 'order_FEE2024002',
  paymentId: 'pay_OcT234567890',
  amount: 24650,
  fee: 494,
  tax: 89,
  netAmount: 24067,
  status: 'captured',
  paymentMethod: 'Card',
  email: 'rajesh.patel@email.com',
  phone: '+91 98765 43211',
  settlementDate: '2024-10-15',
  matchStatus: 'matched',
  matchedStudent: {
    id: '2',
    grNo: 'GR2024002',
    suId: 'SU12345679',
    rollNo: '02',
    firstName: 'Priya',
    lastName: 'Patel',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Female',
    parentName: 'Rajesh Patel',
    parentPhone: '+91 98765 43211',
    parentEmail: 'rajesh.patel@email.com',
    feeCategory: 'OBC',
    status: 'active',
    hasTransport: false,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: true,
    concessionPercentage: 15
  },
  isSelected: true,
  isProcessed: false
},
{
  id: '3',
  transactionId: 'pay_OcT345678901',
  orderId: 'order_FEE2024003',
  paymentId: 'pay_OcT345678901',
  amount: 15000,
  fee: 300,
  tax: 54,
  netAmount: 14646,
  status: 'captured',
  paymentMethod: 'NetBanking',
  email: 'unknown@email.com',
  phone: '+91 99999 99999',
  settlementDate: '2024-10-15',
  matchStatus: 'unmatched',
  isSelected: false,
  isProcessed: false,
  remarks: 'Email/Phone not matched with any student'
},
{
  id: '4',
  transactionId: 'pay_OcT456789012',
  orderId: 'order_FEE2024004',
  paymentId: 'pay_OcT456789012',
  amount: 30000,
  fee: 600,
  tax: 108,
  netAmount: 29292,
  status: 'refunded',
  paymentMethod: 'UPI',
  email: 'vinod.gupta@email.com',
  phone: '+91 98765 43213',
  settlementDate: '2024-10-14',
  matchStatus: 'matched',
  matchedStudent: {
    id: '4',
    grNo: 'GR2024004',
    suId: 'SU12345681',
    rollNo: '04',
    firstName: 'Sneha',
    lastName: 'Gupta',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Female',
    parentName: 'Vinod Gupta',
    parentPhone: '+91 98765 43213',
    parentEmail: 'vinod.gupta@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: false,
    hasHostel: true,
    hasScholarship: true,
    scholarshipPercentage: 25,
    hasConcession: false
  },
  isSelected: false,
  isProcessed: false,
  remarks: 'Refunded - Do not process'
},
{
  id: '5',
  transactionId: 'pay_OcT567890123',
  orderId: 'order_FEE2024005',
  paymentId: 'pay_OcT567890123',
  amount: 25000,
  fee: 500,
  tax: 90,
  netAmount: 24410,
  status: 'captured',
  paymentMethod: 'Wallet',
  email: 'parent@email.com',
  phone: '+91 98765 43212',
  settlementDate: '2024-10-15',
  matchStatus: 'partial',
  suggestedMatches: [
  {
    id: '3',
    grNo: 'GR2024003',
    suId: 'SU12345680',
    rollNo: '03',
    firstName: 'Amit',
    lastName: 'Kumar',
    class: '10',
    section: 'A',
    department: 'Science',
    gender: 'Male',
    parentName: 'Suresh Kumar',
    parentPhone: '+91 98765 43212',
    parentEmail: 'suresh.kumar@email.com',
    feeCategory: 'General',
    status: 'active',
    hasTransport: true,
    hasHostel: false,
    hasScholarship: false,
    hasConcession: false
  }],

  isSelected: false,
  isProcessed: false,
  remarks: 'Phone matched but email different'
}];

const getMockErrorLogs = (): ErrorLogEntry[] => [
{
  id: '1',
  timestamp: '2024-10-15 10:30:45',
  type: 'excel_upload',
  source: 'BulkPayment_Oct2024.xlsx',
  rowNumber: 4,
  studentId: 'GR2024099',
  studentName: 'Unknown Student',
  errorCode: 'STUDENT_NOT_FOUND',
  errorMessage: 'Student not found with provided GR Number',
  severity: 'error',
  details:
  'GR Number "GR2024099" does not exist in the system. Please verify the GR Number.',
  isResolved: false
},
{
  id: '2',
  timestamp: '2024-10-15 10:30:45',
  type: 'excel_upload',
  source: 'BulkPayment_Oct2024.xlsx',
  rowNumber: 5,
  studentId: 'SU12345680',
  studentName: 'Amit Kumar',
  errorCode: 'INVALID_AMOUNT',
  errorMessage: 'Amount cannot be negative',
  severity: 'error',
  details:
  'Row contains negative amount (-5000). All payment amounts must be positive.',
  isResolved: false
},
{
  id: '3',
  timestamp: '2024-10-15 10:30:45',
  type: 'excel_upload',
  source: 'BulkPayment_Oct2024.xlsx',
  rowNumber: 6,
  studentId: '',
  studentName: 'Raj Kumar',
  errorCode: 'MULTIPLE_MATCHES',
  errorMessage: 'Multiple students found matching the provided name',
  severity: 'warning',
  details: '2 students found with similar name. Manual selection required.',
  isResolved: false
},
{
  id: '4',
  timestamp: '2024-10-15 11:15:22',
  type: 'gateway_import',
  source: 'Razorpay Settlement - Oct 2024',
  studentId: '',
  errorCode: 'NO_MATCH',
  errorMessage: 'Transaction could not be matched with any student',
  severity: 'warning',
  details:
  'Payment ID: pay_OcT345678901, Email: unknown@email.com, Phone: +91 99999 99999',
  isResolved: false
},
{
  id: '5',
  timestamp: '2024-10-14 15:45:00',
  type: 'processing',
  source: 'Batch Processing',
  studentId: 'SU12345681',
  studentName: 'Sneha Gupta',
  errorCode: 'PAYMENT_REFUNDED',
  errorMessage: 'Payment has been refunded',
  severity: 'info',
  details:
  'Transaction pay_OcT456789012 was refunded. Skipped during processing.',
  isResolved: true,
  resolvedAt: '2024-10-14 16:00:00',
  resolvedBy: 'Admin User',
  resolution: 'Marked as acknowledged - Payment was intentionally refunded'
},
{
  id: '6',
  timestamp: '2024-10-13 09:20:00',
  type: 'validation',
  source: 'Manual Entry',
  studentId: 'SU12345682',
  studentName: 'Vikram Singh',
  errorCode: 'AMOUNT_EXCEEDS_DUE',
  errorMessage: 'Payment amount exceeds due amount',
  severity: 'warning',
  details: 'Attempted to record ₹20,000 but due amount is only ₹15,500',
  isResolved: true,
  resolvedAt: '2024-10-13 09:25:00',
  resolvedBy: 'Accounts Officer',
  resolution: 'Corrected amount to ₹15,500'
}];

const mockBatchHistory: BulkReceiptBatch[] = [
{
  id: '1',
  batchNo: 'BULK/2024/001',
  date: '2024-10-05',
  academicYear: '2024-25',
  class: '10',
  section: 'A',
  feeHead: 'All Fees',
  term: 'Term 1',
  totalStudents: 35,
  totalAmount: 875000,
  receiptRange: 'RCP2024/001 - RCP2024/035',
  status: 'completed',
  createdBy: 'Admin User',
  createdAt: '2024-10-05 10:30 AM',
  remarks: 'Term 1 bulk collection',
  source: 'manual'
},
{
  id: '2',
  batchNo: 'BULK/2024/002',
  date: '2024-10-08',
  academicYear: '2024-25',
  class: '10',
  section: 'B',
  feeHead: 'Tuition Fee',
  term: 'Term 1',
  totalStudents: 28,
  totalAmount: 700000,
  receiptRange: 'RCP2024/036 - RCP2024/063',
  status: 'completed',
  createdBy: 'Accounts Officer',
  createdAt: '2024-10-08 02:15 PM',
  source: 'excel'
},
{
  id: '3',
  batchNo: 'BULK/2024/003',
  date: '2024-10-10',
  academicYear: '2024-25',
  class: '9',
  section: 'All',
  feeHead: 'Transport Fee',
  term: 'Term 1',
  totalStudents: 45,
  totalAmount: 270000,
  receiptRange: 'RCP2024/064 - RCP2024/108',
  status: 'completed',
  createdBy: 'Transport Coordinator',
  createdAt: '2024-10-10 11:00 AM',
  remarks: 'Transport fee collection for Class 9',
  source: 'gateway'
},
{
  id: '4',
  batchNo: 'BULK/2024/004',
  date: '2024-10-12',
  academicYear: '2024-25',
  class: '8',
  section: 'All',
  feeHead: 'All Fees',
  term: 'Term 2',
  totalStudents: 52,
  totalAmount: 520000,
  receiptRange: 'RCP2024/109 - RCP2024/160',
  status: 'partial',
  createdBy: 'Admin User',
  createdAt: '2024-10-12 03:30 PM',
  remarks: '48 successful, 4 failed',
  source: 'excel'
}];

// ============================================
// OPTIONS
// ============================================
const academicYearOptions = [
{
  value: '2024-25',
  label: '2024-25 (Current)'
},
{
  value: '2023-24',
  label: '2023-24'
}];

const classOptions = [
{
  value: '',
  label: 'Select Class'
},
...Array.from(
  {
    length: 12
  },
  (_, i) => ({
    value: String(i + 1),
    label: `Class ${i + 1}`
  })
)];

const sectionOptions = [
{
  value: '',
  label: 'Select Section'
},
{
  value: 'all',
  label: 'All Sections'
},
{
  value: 'A',
  label: 'Section A'
},
{
  value: 'B',
  label: 'Section B'
},
{
  value: 'C',
  label: 'Section C'
},
{
  value: 'D',
  label: 'Section D'
}];

const feeHeadOptions = [
{
  value: '',
  label: 'All Fee Heads'
},
{
  value: 'tuition',
  label: 'Tuition Fee'
},
{
  value: 'lab',
  label: 'Lab Fee'
},
{
  value: 'transport',
  label: 'Transport Fee'
},
{
  value: 'hostel',
  label: 'Hostel Fee'
},
{
  value: 'exam',
  label: 'Examination Fee'
},
{
  value: 'activity',
  label: 'Activity Fee'
}];

const termOptions = [
{
  value: '',
  label: 'All Terms'
},
{
  value: 'term1',
  label: 'Term 1'
},
{
  value: 'term2',
  label: 'Term 2'
},
{
  value: 'annual',
  label: 'Annual'
}];

const filterOptions = [
{
  value: 'all',
  label: 'All Students'
},
{
  value: 'with-due',
  label: 'Students with Due'
},
{
  value: 'overdue',
  label: 'Overdue Only'
},
{
  value: 'partial',
  label: 'Partial Paid'
}];

const sortOptions = [
{
  value: 'roll',
  label: 'Roll Number'
},
{
  value: 'name',
  label: 'Name'
},
{
  value: 'amount-asc',
  label: 'Amount (Low to High)'
},
{
  value: 'amount-desc',
  label: 'Amount (High to Low)'
}];

// ============================================
// HELPER COMPONENTS
// ============================================
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}> = ({ children, className = '', title, subtitle, action, noPadding }) =>
<div
  className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>

    {(title || action) &&
  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          {title &&
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      }
          {subtitle &&
      <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      }
        </div>
        {action}
      </div>
  }
    <div className={noPadding ? '' : 'p-6'}>{children}</div>
  </div>;

const Button: React.FC<{
  children: React.ReactNode;
  variant?:
  'primary' |
  'secondary' |
  'outline' |
  'ghost' |
  'danger' |
  'success' |
  'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning:
    'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}>

      {loading &&
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24">

          <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4" />

          <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

        </svg>
      }
      {children}
    </button>);

};
const Input: React.FC<{
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  accept?: string;
}> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon,
  error,
  disabled,
  required,
  className = '',
  min,
  max,
  accept
}) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
  }
    <div className="relative">
      {leftIcon &&
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
    }
      <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
      accept={accept}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          disabled:bg-gray-50 disabled:text-gray-500
          ${leftIcon ? 'pl-10' : ''} 
          ${error ? 'border-red-500' : ''}`} />

    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>;

const Select: React.FC<{
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}> = ({
  label,
  options,
  value,
  onChange,
  disabled,
  required,
  className = ''
}) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
  }
    <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
        disabled:bg-gray-50 disabled:text-gray-500 bg-white">



      {options.map((opt) =>
    <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
    )}
    </select>
  </div>;

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}> = ({ children, variant = 'gray', size = 'sm', icon }) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>

      {icon}
      {children}
    </span>);

};
const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
}> = ({ checked, onChange, disabled, indeterminate }) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="w-5 h-5 rounded border-gray-300 text-blue-600 
        focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" />);




};
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}> = ({ isOpen, onClose, title, subtitle, children, size = 'lg' }) => {
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose} />

        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>

          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {subtitle &&
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              }
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>);

};
const Tabs: React.FC<{
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    count?: number;
  }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onChange }) =>
<div className="border-b border-gray-200">
    <nav className="flex gap-4 overflow-x-auto" aria-label="Tabs">
      {tabs.map((tab) =>
    <button
      key={tab.id}
      onClick={() => onChange(tab.id)}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

          {tab.icon}
          {tab.label}
          {tab.count !== undefined &&
      <span
        className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

              {tab.count}
            </span>
      }
        </button>
    )}
    </nav>
  </div>;

const FileUpload: React.FC<{
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  helperText?: string;
  selectedFile?: File | null;
}> = ({
  onFileSelect,
  accept = '.xlsx,.xls,.csv',
  label,
  helperText,
  selectedFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  return (
    <div>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      }
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden" />

        {selectedFile ?
        <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>

              Change File
            </Button>
          </div> :

        <div className="space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {helperText || 'Excel (.xlsx, .xls) or CSV files'}
            </p>
          </div>
        }
      </div>
    </div>);

};
// ============================================
// MAIN COMPONENT
// ============================================
export function FeeReceiptBulk() {
  // Tab State
  const [activeTab, setActiveTab] = useState<
    'collection' | 'excel' | 'gateway' | 'errors' | 'history'>(
    'collection');
  // Filter States
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedFeeHead, setSelectedFeeHead] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('term2');
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [filterType, setFilterType] = useState('with-due');
  const [sortBy, setSortBy] = useState('roll');
  const [searchQuery, setSearchQuery] = useState('');
  // Student Data
  const [studentPayments, setStudentPayments] = useState<StudentPaymentEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  // Bulk Settings
  const [defaultPaymentMode, setDefaultPaymentMode] = useState('cash');
  const [commonReferencePrefix, setCommonReferencePrefix] = useState('');
  const [commonRemarks, setCommonRemarks] = useState('');
  // Excel Upload States
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelUploadRow[]>([]);
  const [isExcelProcessing, setIsExcelProcessing] = useState(false);
  const [excelUploadStep, setExcelUploadStep] = useState<
    'upload' | 'preview' | 'mapping' | 'review'>(
    'upload');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  // Gateway Import States
  const [selectedGateway, setSelectedGateway] = useState('');
  const [gatewayFile, setGatewayFile] = useState<File | null>(null);
  const [gatewayData, setGatewayData] = useState<GatewaySettlement[]>([]);
  const [isGatewayProcessing, setIsGatewayProcessing] = useState(false);
  const [gatewayImportStep, setGatewayImportStep] = useState<
    'select' | 'upload' | 'review'>(
    'select');
  const [gatewayDateRange, setGatewayDateRange] = useState({
    from: '',
    to: ''
  });
  // Error Log States
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>([]);
  const [errorFilter, setErrorFilter] = useState<
    'all' | 'error' | 'warning' | 'info' | 'resolved' | 'unresolved'>(
    'all');
  const [errorTypeFilter, setErrorTypeFilter] = useState<
    'all' | 'excel_upload' | 'gateway_import' | 'processing' | 'validation'>(
    'all');
  // Modal States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBulkSettingsModal, setShowBulkSettingsModal] = useState(false);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] =
  useState<StudentPaymentEntry | null>(null);
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BulkReceiptBatch | null>(
    null
  );
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedUnmatchedRow, setSelectedUnmatchedRow] = useState<
    ExcelUploadRow | GatewaySettlement | null>(
    null);
  const [showErrorDetailModal, setShowErrorDetailModal] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorLogEntry | null>(null);
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedBatchNo, setGeneratedBatchNo] = useState('');
  const [generatedReceiptRange, setGeneratedReceiptRange] = useState('');
  // Computed Values - Manual Collection
  const selectedStudents = useMemo(
    () => studentPayments.filter((s) => s.isSelected && s.totalDueAmount > 0),
    [studentPayments]
  );
  const totalDueAmount = useMemo(
    () => selectedStudents.reduce((sum, s) => sum + s.totalDueAmount, 0),
    [selectedStudents]
  );
  const totalPayingAmount = useMemo(
    () => selectedStudents.reduce((sum, s) => sum + s.payingAmount, 0),
    [selectedStudents]
  );
  const totalBalanceAfterPayment = useMemo(
    () => totalDueAmount - totalPayingAmount,
    [totalDueAmount, totalPayingAmount]
  );
  const allSelected =
  studentPayments.filter((s) => s.totalDueAmount > 0).length > 0 &&
  studentPayments.
  filter((s) => s.totalDueAmount > 0).
  every((s) => s.isSelected);
  const someSelected = studentPayments.some(
    (s) => s.isSelected && s.totalDueAmount > 0
  );
  const hasValidationErrors = useMemo(
    () => selectedStudents.some((s) => s.hasValidationError),
    [selectedStudents]
  );
  const filteredPayments = useMemo(() => {
    let result = studentPayments;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
        s.student.firstName.toLowerCase().includes(query) ||
        s.student.lastName.toLowerCase().includes(query) ||
        s.student.grNo.toLowerCase().includes(query) ||
        s.student.rollNo.toLowerCase().includes(query)
      );
    }
    return result;
  }, [studentPayments, searchQuery]);
  // Computed Values - Excel Upload
  const excelStats = useMemo(() => {
    const matched = excelData.filter(
      (r) => r.matchStatus === 'matched' && r.errors.length === 0
    );
    const unmatched = excelData.filter((r) => r.matchStatus === 'unmatched');
    const multiple = excelData.filter((r) => r.matchStatus === 'multiple');
    const withErrors = excelData.filter((r) => r.errors.length > 0);
    const selected = excelData.filter(
      (r) =>
      r.isSelected && r.matchStatus === 'matched' && r.errors.length === 0
    );
    const totalAmount = selected.reduce((sum, r) => sum + r.amount, 0);
    return {
      matched,
      unmatched,
      multiple,
      withErrors,
      selected,
      totalAmount,
      total: excelData.length
    };
  }, [excelData]);
  // Computed Values - Gateway Import
  const gatewayStats = useMemo(() => {
    const matched = gatewayData.filter(
      (r) => r.matchStatus === 'matched' && r.status === 'captured'
    );
    const unmatched = gatewayData.filter((r) => r.matchStatus === 'unmatched');
    const partial = gatewayData.filter((r) => r.matchStatus === 'partial');
    const refunded = gatewayData.filter((r) => r.status === 'refunded');
    const selected = gatewayData.filter(
      (r) =>
      r.isSelected && r.matchStatus === 'matched' && r.status === 'captured'
    );
    const totalAmount = selected.reduce((sum, r) => sum + r.amount, 0);
    const totalFees = selected.reduce((sum, r) => sum + r.fee + r.tax, 0);
    const netAmount = selected.reduce((sum, r) => sum + r.netAmount, 0);
    return {
      matched,
      unmatched,
      partial,
      refunded,
      selected,
      totalAmount,
      totalFees,
      netAmount,
      total: gatewayData.length
    };
  }, [gatewayData]);
  // Computed Values - Error Logs
  const filteredErrors = useMemo(() => {
    let result = errorLogs;
    if (errorFilter === 'resolved') {
      result = result.filter((e) => e.isResolved);
    } else if (errorFilter === 'unresolved') {
      result = result.filter((e) => !e.isResolved);
    } else if (errorFilter !== 'all') {
      result = result.filter((e) => e.severity === errorFilter);
    }
    if (errorTypeFilter !== 'all') {
      result = result.filter((e) => e.type === errorTypeFilter);
    }
    return result;
  }, [errorLogs, errorFilter, errorTypeFilter]);
  const errorStats = useMemo(() => {
    const errors = errorLogs.filter((e) => e.severity === 'error');
    const warnings = errorLogs.filter((e) => e.severity === 'warning');
    const info = errorLogs.filter((e) => e.severity === 'info');
    const resolved = errorLogs.filter((e) => e.isResolved);
    const unresolved = errorLogs.filter((e) => !e.isResolved);
    return {
      errors,
      warnings,
      info,
      resolved,
      unresolved,
      total: errorLogs.length
    };
  }, [errorLogs]);
  // Handlers - Manual Collection
  const handleLoadStudents = async () => {
    if (!selectedClass || !selectedSection) {
      alert('Please select class and section');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStudentPayments(getMockStudentPayments());
    setIsLoading(false);
  };
  const handleSelectAll = (checked: boolean) => {
    setStudentPayments((prev) =>
    prev.map((s) => ({
      ...s,
      isSelected: s.totalDueAmount > 0 ? checked : false
    }))
    );
  };
  const handleSelectStudent = (id: string, checked: boolean) => {
    setStudentPayments((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      isSelected: checked
    } :
    s
    )
    );
  };
  const handleExpandStudent = (id: string) => {
    setStudentPayments((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      isExpanded: !s.isExpanded
    } :
    s
    )
    );
  };
  const handleUpdatePayment = (id: string, field: string, value: any) => {
    setStudentPayments((prev) =>
    prev.map((s) => {
      if (s.id !== id) return s;
      const updated = {
        ...s,
        [field]: value
      };
      if (field === 'payingAmount') {
        const payingAmount = parseFloat(value) || 0;
        updated.hasValidationError =
        payingAmount > s.totalDueAmount || payingAmount < 0;
        updated.validationMessage =
        payingAmount > s.totalDueAmount ?
        'Amount exceeds due amount' :
        payingAmount < 0 ?
        'Amount cannot be negative' :
        undefined;
      }
      if (field === 'paymentMode') {
        const mode = paymentModes.find((m) => m.id === value);
        if (mode?.requiresReference && !updated.referenceNo) {
          updated.hasValidationError = true;
          updated.validationMessage =
          'Reference number required for this payment mode';
        }
      }
      return updated;
    })
    );
  };
  const handleSetFullPayment = (id: string) => {
    setStudentPayments((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      payingAmount: s.totalDueAmount,
      hasValidationError: false,
      validationMessage: undefined
    } :
    s
    )
    );
  };
  const handleApplyBulkSettings = () => {
    setStudentPayments((prev) =>
    prev.map((s) => {
      if (!s.isSelected || s.totalDueAmount === 0) return s;
      return {
        ...s,
        paymentMode: defaultPaymentMode,
        referenceNo: commonReferencePrefix ?
        `${commonReferencePrefix}-${s.student.rollNo}` :
        s.referenceNo,
        remarks: commonRemarks || s.remarks
      };
    })
    );
    setShowBulkSettingsModal(false);
  };
  const handleSetAllFullPayment = () => {
    setStudentPayments((prev) =>
    prev.map((s) => ({
      ...s,
      payingAmount: s.isSelected ? s.totalDueAmount : s.payingAmount,
      hasValidationError: false,
      validationMessage: undefined
    }))
    );
  };
  const handleSetPercentagePayment = (percentage: number) => {
    setStudentPayments((prev) =>
    prev.map((s) => ({
      ...s,
      payingAmount: s.isSelected ?
      Math.round(s.totalDueAmount * percentage / 100) :
      s.payingAmount,
      hasValidationError: false,
      validationMessage: undefined
    }))
    );
  };
  const handleViewStudentDetail = (entry: StudentPaymentEntry) => {
    setSelectedStudentDetail(entry);
    setShowStudentDetailModal(true);
  };
  const handlePreviewReceipts = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }
    if (hasValidationErrors) {
      alert('Please fix validation errors before proceeding');
      return;
    }
    setShowPreviewModal(true);
  };
  const handleGenerateReceipts = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGeneratedBatchNo(`BULK/2024/${String(Date.now()).slice(-3)}`);
    setGeneratedReceiptRange(
      `RCP2024/${String(Date.now()).slice(-4)} - RCP2024/${String(parseInt(String(Date.now()).slice(-4)) + selectedStudents.length - 1)}`
    );
    setIsProcessing(false);
    setShowPreviewModal(false);
    setShowSuccessModal(true);
  };
  const handleReset = () => {
    setStudentPayments([]);
    setSearchQuery('');
    setDefaultPaymentMode('cash');
    setCommonReferencePrefix('');
    setCommonRemarks('');
  };
  // Handlers - Excel Upload
  const handleExcelFileSelect = (file: File) => {
    setExcelFile(file);
    setExcelUploadStep('preview');
  };
  const handleProcessExcel = async () => {
    setIsExcelProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExcelData(getMockExcelUploads());
    setErrorLogs((prev) => [
    ...prev,
    ...getMockErrorLogs().filter((e) => e.type === 'excel_upload')]
    );
    setIsExcelProcessing(false);
    setExcelUploadStep('review');
  };
  const handleExcelSelectAll = (checked: boolean) => {
    setExcelData((prev) =>
    prev.map((r) => ({
      ...r,
      isSelected:
      r.matchStatus === 'matched' && r.errors.length === 0 ?
      checked :
      false
    }))
    );
  };
  const handleExcelSelectRow = (id: string, checked: boolean) => {
    setExcelData((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      isSelected: checked
    } :
    r
    )
    );
  };
  const handleManualMatch = (row: ExcelUploadRow, student: Student) => {
    setExcelData((prev) =>
    prev.map((r) =>
    r.id === row.id ?
    {
      ...r,
      matchStatus: 'matched',
      matchedStudent: student,
      errors: r.errors.filter(
        (e) => !e.includes('not found') && !e.includes('Multiple')
      ),
      isSelected:
      r.errors.filter(
        (e) => !e.includes('not found') && !e.includes('Multiple')
      ).length === 0
    } :
    r
    )
    );
    setShowMatchModal(false);
    setSelectedUnmatchedRow(null);
  };
  const handleProcessExcelReceipts = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGeneratedBatchNo(`BULK/2024/EXL${String(Date.now()).slice(-3)}`);
    setGeneratedReceiptRange(
      `RCP2024/${String(Date.now()).slice(-4)} - RCP2024/${String(parseInt(String(Date.now()).slice(-4)) + excelStats.selected.length - 1)}`
    );
    setIsProcessing(false);
    setShowSuccessModal(true);
  };
  const handleResetExcel = () => {
    setExcelFile(null);
    setExcelData([]);
    setExcelUploadStep('upload');
    setColumnMapping({});
  };
  const handleDownloadTemplate = () => {
    // In real implementation, this would download an Excel template
    alert('Downloading Excel template...');
  };
  // Handlers - Gateway Import
  const handleGatewaySelect = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setGatewayImportStep('upload');
  };
  const handleGatewayFileSelect = (file: File) => {
    setGatewayFile(file);
  };
  const handleProcessGateway = async () => {
    setIsGatewayProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGatewayData(getMockGatewaySettlements());
    setErrorLogs((prev) => [
    ...prev,
    ...getMockErrorLogs().filter((e) => e.type === 'gateway_import')]
    );
    setIsGatewayProcessing(false);
    setGatewayImportStep('review');
  };
  const handleGatewaySelectAll = (checked: boolean) => {
    setGatewayData((prev) =>
    prev.map((r) => ({
      ...r,
      isSelected:
      r.matchStatus === 'matched' && r.status === 'captured' ?
      checked :
      false
    }))
    );
  };
  const handleGatewaySelectRow = (id: string, checked: boolean) => {
    setGatewayData((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      isSelected: checked
    } :
    r
    )
    );
  };
  const handleGatewayManualMatch = (
  settlement: GatewaySettlement,
  student: Student) =>
  {
    setGatewayData((prev) =>
    prev.map((r) =>
    r.id === settlement.id ?
    {
      ...r,
      matchStatus: 'matched',
      matchedStudent: student,
      isSelected: r.status === 'captured'
    } :
    r
    )
    );
    setShowMatchModal(false);
    setSelectedUnmatchedRow(null);
  };
  const handleProcessGatewayReceipts = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGeneratedBatchNo(`BULK/2024/GW${String(Date.now()).slice(-3)}`);
    setGeneratedReceiptRange(
      `RCP2024/${String(Date.now()).slice(-4)} - RCP2024/${String(parseInt(String(Date.now()).slice(-4)) + gatewayStats.selected.length - 1)}`
    );
    setIsProcessing(false);
    setShowSuccessModal(true);
  };
  const handleResetGateway = () => {
    setSelectedGateway('');
    setGatewayFile(null);
    setGatewayData([]);
    setGatewayImportStep('select');
    setGatewayDateRange({
      from: '',
      to: ''
    });
  };
  // Handlers - Error Logs
  const handleLoadErrorLogs = () => {
    setErrorLogs(getMockErrorLogs());
  };
  const handleResolveError = (errorId: string, resolution: string) => {
    setErrorLogs((prev) =>
    prev.map((e) =>
    e.id === errorId ?
    {
      ...e,
      isResolved: true,
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Current User',
      resolution
    } :
    e
    )
    );
    setShowErrorDetailModal(false);
    setSelectedError(null);
  };
  const handleExportErrorLog = () => {
    alert('Exporting error log to Excel...');
  };
  const handleRetryFailed = () => {
    alert('Retrying failed records...');
  };
  // Handlers - History
  const handleViewBatchDetail = (batch: BulkReceiptBatch) => {
    setSelectedBatch(batch);
    setShowHistoryDetailModal(true);
  };
  // Helper Functions
  const getPaymentModeIcon = (modeId: string) => {
    const mode = paymentModes.find((m) => m.id === modeId);
    return mode?.icon || <IndianRupee className="w-4 h-4" />;
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>
            Paid
          </Badge>);

      case 'partial':
        return (
          <Badge variant="warning" icon={<Clock className="w-3 h-3" />}>
            Partial
          </Badge>);

      case 'unpaid':
        return (
          <Badge variant="gray" icon={<Clock className="w-3 h-3" />}>
            Unpaid
          </Badge>);

      case 'overdue':
        return (
          <Badge variant="danger" icon={<AlertCircle className="w-3 h-3" />}>
            Overdue
          </Badge>);

      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };
  const getMatchStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return (
          <Badge variant="success" icon={<Link2 className="w-3 h-3" />}>
            Matched
          </Badge>);

      case 'unmatched':
        return (
          <Badge variant="danger" icon={<Unlink className="w-3 h-3" />}>
            Unmatched
          </Badge>);

      case 'partial':
        return (
          <Badge variant="warning" icon={<AlertCircle className="w-3 h-3" />}>
            Partial Match
          </Badge>);

      case 'multiple':
        return (
          <Badge variant="warning" icon={<Users className="w-3 h-3" />}>
            Multiple Matches
          </Badge>);

      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };
  const getGatewayStatusBadge = (status: string) => {
    switch (status) {
      case 'captured':
        return (
          <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>
            Captured
          </Badge>);

      case 'refunded':
        return (
          <Badge variant="danger" icon={<RefreshCw className="w-3 h-3" />}>
            Refunded
          </Badge>);

      case 'failed':
        return (
          <Badge variant="danger" icon={<XCircle className="w-3 h-3" />}>
            Failed
          </Badge>);

      case 'pending':
        return (
          <Badge variant="warning" icon={<Clock className="w-3 h-3" />}>
            Pending
          </Badge>);

      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return (
          <Badge variant="danger" icon={<XCircle className="w-3 h-3" />}>
            Error
          </Badge>);

      case 'warning':
        return (
          <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>
            Warning
          </Badge>);

      case 'info':
        return (
          <Badge variant="info" icon={<Info className="w-3 h-3" />}>
            Info
          </Badge>);

      default:
        return <Badge variant="gray">{severity}</Badge>;
    }
  };
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'manual':
        return (
          <Badge variant="gray" icon={<Users className="w-3 h-3" />}>
            Manual
          </Badge>);

      case 'excel':
        return (
          <Badge variant="info" icon={<FileSpreadsheet className="w-3 h-3" />}>
            Excel
          </Badge>);

      case 'gateway':
        return (
          <Badge variant="purple" icon={<Globe className="w-3 h-3" />}>
            Gateway
          </Badge>);

      default:
        return <Badge variant="gray">{source}</Badge>;
    }
  };
  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            Bulk Fee Receipt
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Record payments for multiple students via manual entry, Excel
            upload, or payment gateway import
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              handleResetExcel();
              handleResetGateway();
            }}>

            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
          {activeTab === 'collection' &&
          <Button
            variant="success"
            size="lg"
            onClick={handlePreviewReceipts}
            disabled={selectedStudents.length === 0 || hasValidationErrors}>

              <Save className="w-4 h-4 mr-2" />
              Generate Receipts ({selectedStudents.length})
            </Button>
          }
          {activeTab === 'excel' && excelUploadStep === 'review' &&
          <Button
            variant="success"
            size="lg"
            onClick={handleProcessExcelReceipts}
            disabled={excelStats.selected.length === 0}>

              <Save className="w-4 h-4 mr-2" />
              Process ({excelStats.selected.length})
            </Button>
          }
          {activeTab === 'gateway' && gatewayImportStep === 'review' &&
          <Button
            variant="success"
            size="lg"
            onClick={handleProcessGatewayReceipts}
            disabled={gatewayStats.selected.length === 0}>

              <Save className="w-4 h-4 mr-2" />
              Process ({gatewayStats.selected.length})
            </Button>
          }
        </div>
      </div>

      {/* Tabs */}
      <Card noPadding>
        <div className="px-6">
          <Tabs
            tabs={[
            {
              id: 'collection',
              label: 'Manual Collection',
              icon: <Receipt className="w-4 h-4" />
            },
            {
              id: 'excel',
              label: 'Excel Upload',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              count:
              excelData.length > 0 ? excelStats.selected.length : undefined
            },
            {
              id: 'gateway',
              label: 'Gateway Import',
              icon: <Globe className="w-4 h-4" />,
              count:
              gatewayData.length > 0 ?
              gatewayStats.selected.length :
              undefined
            },
            {
              id: 'errors',
              label: 'Error Log',
              icon: <AlertOctagon className="w-4 h-4" />,
              count:
              errorStats.unresolved.length > 0 ?
              errorStats.unresolved.length :
              undefined
            },
            {
              id: 'history',
              label: 'Batch History',
              icon: <History className="w-4 h-4" />,
              count: mockBatchHistory.length
            }]
            }
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)} />

        </div>
      </Card>

      {/* ============================================ */}
      {/* MANUAL COLLECTION TAB */}
      {/* ============================================ */}
      {activeTab === 'collection' &&
      <>
          {/* Filters */}
          <Card
          title="Filter & Load Students"
          subtitle="Select class, section, and other filters">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Select
              label="Academic Year"
              options={academicYearOptions}
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)} />

              <Select
              label="Class"
              options={classOptions}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required />

              <Select
              label="Section"
              options={sectionOptions}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required />

              <Select
              label="Fee Head"
              options={feeHeadOptions}
              value={selectedFeeHead}
              onChange={(e) => setSelectedFeeHead(e.target.value)} />

              <Select
              label="Term"
              options={termOptions}
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)} />

              <Input
              label="Receipt Date"
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              required />

            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Input
                placeholder="Search by name, GR No, Roll No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-72" />

                <Select
                options={filterOptions}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)} />

                <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)} />

              </div>
              <Button
              variant="primary"
              onClick={handleLoadStudents}
              loading={isLoading}>

                <Search className="w-4 h-4 mr-2" />
                Load Students
              </Button>
            </div>
          </Card>

          {/* Summary Stats */}
          {studentPayments.length > 0 &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Selected Students</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedStudents.length}{' '}
                      <span className="text-sm font-normal text-gray-400">
                        /{' '}
                        {
                    studentPayments.filter((s) => s.totalDueAmount > 0).
                    length
                    }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Due</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{totalDueAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CircleDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Paying</p>
                    <p className="text-xl font-bold text-green-700">
                      ₹{totalPayingAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Balance After</p>
                    <p className="text-xl font-bold text-red-700">
                      ₹{totalBalanceAfterPayment.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
        }

          {/* Quick Actions */}
          {studentPayments.length > 0 &&
        <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Quick Actions:
                  </span>
                  <Button
                variant="outline"
                size="sm"
                onClick={handleSetAllFullPayment}>

                    <CheckSquare className="w-3.5 h-3.5 mr-1" />
                    Full Payment All
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPercentagePayment(50)}>

                    <Percent className="w-3.5 h-3.5 mr-1" />
                    50% Payment
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPercentagePayment(75)}>

                    <Percent className="w-3.5 h-3.5 mr-1" />
                    75% Payment
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkSettingsModal(true)}>

                    <Settings className="w-3.5 h-3.5 mr-1" />
                    Bulk Payment Mode
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
        }

          {/* Student Payment List */}
          {studentPayments.length > 0 ?
        <Card noPadding>
              {/* Table Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-3 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={handleSelectAll} />

                </div>
                <div className="col-span-3">Student</div>
                <div className="col-span-2 text-right">Due Amount</div>
                <div className="col-span-2 text-right">Paying Amount</div>
                <div className="col-span-2">Payment Mode</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Student Rows */}
              <div className="divide-y divide-gray-100">
                {filteredPayments.map((entry) =>
            <div
              key={entry.id}
              className={`${entry.isSelected ? 'bg-blue-50/30' : ''} ${entry.hasValidationError ? 'bg-red-50/30' : ''}`}>

                    {/* Main Row */}
                    <div className="px-4 py-3 grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-1">
                        <Checkbox
                    checked={entry.isSelected}
                    onChange={(checked) =>
                    handleSelectStudent(entry.id, checked)
                    }
                    disabled={entry.totalDueAmount === 0} />

                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                            {entry.student.firstName[0]}
                            {entry.student.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {entry.student.firstName} {entry.student.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Roll: {entry.student.rollNo} | GR:{' '}
                              {entry.student.grNo}
                            </p>
                            <div className="flex gap-1 mt-0.5">
                              {entry.student.hasScholarship &&
                        <Badge variant="purple" size="sm">
                                  <Award className="w-3 h-3" />
                                  {entry.student.scholarshipPercentage}%
                                </Badge>
                        }
                              {entry.student.hasConcession &&
                        <Badge variant="info" size="sm">
                                  <BadgePercent className="w-3 h-3" />
                                  {entry.student.concessionPercentage}%
                                </Badge>
                        }
                              {entry.student.hasTransport &&
                        <Badge variant="gray" size="sm">
                                  <Bus className="w-3 h-3" />
                                </Badge>
                        }
                              {entry.student.hasHostel &&
                        <Badge variant="gray" size="sm">
                                  <Home className="w-3 h-3" />
                                </Badge>
                        }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{entry.totalDueAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.fees.length} fee head(s)
                        </p>
                      </div>
                      <div className="col-span-2 text-right">
                        {entry.totalDueAmount > 0 ?
                  <div className="flex items-center justify-end gap-1">
                            <input
                      type="number"
                      value={entry.payingAmount}
                      onChange={(e) =>
                      handleUpdatePayment(
                        entry.id,
                        'payingAmount',
                        e.target.value
                      )
                      }
                      min={0}
                      max={entry.totalDueAmount}
                      className={`w-28 text-right rounded-lg border px-3 py-1.5 text-sm font-medium
                                ${entry.hasValidationError ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-300 text-gray-900'}
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                      disabled={!entry.isSelected} />

                            <button
                      onClick={() => handleSetFullPayment(entry.id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Set full amount">

                              <Target className="w-4 h-4" />
                            </button>
                          </div> :

                  <Badge variant="success">
                            <CheckCircle className="w-3 h-3" />
                            No Due
                          </Badge>
                  }
                        {entry.hasValidationError &&
                  <p className="text-xs text-red-600 mt-0.5">
                            {entry.validationMessage}
                          </p>
                  }
                      </div>
                      <div className="col-span-2">
                        {entry.totalDueAmount > 0 &&
                  <select
                    value={entry.paymentMode}
                    onChange={(e) =>
                    handleUpdatePayment(
                      entry.id,
                      'paymentMode',
                      e.target.value
                    )
                    }
                    disabled={!entry.isSelected}
                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50">


                            {paymentModes.map((mode) =>
                    <option key={mode.id} value={mode.id}>
                                {mode.name}
                              </option>
                    )}
                          </select>
                  }
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <button
                    onClick={() => handleExpandStudent(entry.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Expand details">

                          {entry.isExpanded ?
                    <ChevronUp className="w-4 h-4" /> :

                    <ChevronDown className="w-4 h-4" />
                    }
                        </button>
                        <button
                    onClick={() => handleViewStudentDetail(entry)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View details">

                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {entry.isExpanded &&
              <div className="px-4 pb-4 pl-16">
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Fee Breakdown
                          </p>
                          <div className="space-y-1.5">
                            {entry.fees.map((fee) =>
                    <div
                      key={fee.id}
                      className="flex items-center justify-between text-sm">

                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700">
                                    {fee.feeHeadName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({fee.term})
                                  </span>
                                  {getStatusBadge(fee.status)}
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="text-gray-500">
                                    Total: ₹
                                    {fee.totalAmount.toLocaleString('en-IN')}
                                  </span>
                                  {fee.discountAmount > 0 &&
                        <span className="text-green-600">
                                      Disc: -₹
                                      {fee.discountAmount.toLocaleString(
                            'en-IN'
                          )}
                                    </span>
                        }
                                  {fee.paidAmount > 0 &&
                        <span className="text-blue-600">
                                      Paid: ₹
                                      {fee.paidAmount.toLocaleString('en-IN')}
                                    </span>
                        }
                                  <span className="font-semibold text-gray-900">
                                    Bal: ₹
                                    {fee.balanceAmount.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                    )}
                          </div>
                          {/* Reference / Remarks */}
                          {entry.isSelected && entry.totalDueAmount > 0 &&
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
                              <Input
                      label="Reference No"
                      placeholder="Enter reference..."
                      value={entry.referenceNo}
                      onChange={(e) =>
                      handleUpdatePayment(
                        entry.id,
                        'referenceNo',
                        e.target.value
                      )
                      } />

                              {paymentModes.find(
                      (m) => m.id === entry.paymentMode
                    )?.requiresChequeDetails &&
                    <>
                                  <Input
                        label="Cheque/DD Date"
                        type="date"
                        value={entry.chequeDate || ''}
                        onChange={(e) =>
                        handleUpdatePayment(
                          entry.id,
                          'chequeDate',
                          e.target.value
                        )
                        } />

                                  <Input
                        label="Bank Name"
                        placeholder="Enter bank name..."
                        value={entry.bankName || ''}
                        onChange={(e) =>
                        handleUpdatePayment(
                          entry.id,
                          'bankName',
                          e.target.value
                        )
                        } />

                                </>
                    }
                              <Input
                      label="Remarks"
                      placeholder="Optional remarks..."
                      value={entry.remarks}
                      onChange={(e) =>
                      handleUpdatePayment(
                        entry.id,
                        'remarks',
                        e.target.value
                      )
                      } />

                            </div>
                  }
                        </div>
                      </div>
              }
                  </div>
            )}
              </div>
            </Card> :
        !isLoading ?
        <Card>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No Students Loaded
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select class, section, and click "Load Students" to begin bulk
                  fee collection.
                </p>
                <Button variant="primary" onClick={handleLoadStudents}>
                  <Search className="w-4 h-4 mr-2" />
                  Load Students
                </Button>
              </div>
            </Card> :
        null}
        </>
      }

      {/* ============================================ */}
      {/* EXCEL UPLOAD TAB */}
      {/* ============================================ */}
      {activeTab === 'excel' &&
      <>
          {excelUploadStep === 'upload' &&
        <Card
          title="Upload Excel File"
          subtitle="Upload a file containing payment data for multiple students">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <FileUpload
                onFileSelect={handleExcelFileSelect}
                accept=".xlsx,.xls,.csv"
                label="Payment Data File"
                helperText="Supported formats: Excel (.xlsx, .xls) or CSV"
                selectedFile={excelFile} />


                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          File Requirements
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
                          <li>First row should contain column headers</li>
                          <li>
                            Required columns: Student ID or GR Number, Amount
                          </li>
                          <li>
                            Optional columns: Payment Mode, Reference No,
                            Remarks
                          </li>
                          <li>Maximum 500 rows per upload</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Download Template
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Bulk Payment Template
                        </p>
                        <p className="text-xs text-gray-500">
                          Pre-formatted Excel template with sample data
                        </p>
                      </div>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}>

                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Class-wise Student List
                        </p>
                        <p className="text-xs text-gray-500">
                          Export student list with pending fees
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Expected Columns
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left py-1">Column</th>
                            <th className="text-left py-1">Required</th>
                            <th className="text-left py-1">Example</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          <tr>
                            <td className="py-1">Student ID / SU ID</td>
                            <td>
                              <Badge variant="success" size="sm">
                                Yes
                              </Badge>
                            </td>
                            <td>SU12345678</td>
                          </tr>
                          <tr>
                            <td className="py-1">GR Number</td>
                            <td>
                              <Badge variant="warning" size="sm">
                                Alt
                              </Badge>
                            </td>
                            <td>GR2024001</td>
                          </tr>
                          <tr>
                            <td className="py-1">Amount</td>
                            <td>
                              <Badge variant="success" size="sm">
                                Yes
                              </Badge>
                            </td>
                            <td>25000</td>
                          </tr>
                          <tr>
                            <td className="py-1">Payment Mode</td>
                            <td>
                              <Badge variant="gray" size="sm">
                                No
                              </Badge>
                            </td>
                            <td>Cash</td>
                          </tr>
                          <tr>
                            <td className="py-1">Reference No</td>
                            <td>
                              <Badge variant="gray" size="sm">
                                No
                              </Badge>
                            </td>
                            <td>TXN123</td>
                          </tr>
                          <tr>
                            <td className="py-1">Payment Date</td>
                            <td>
                              <Badge variant="gray" size="sm">
                                No
                              </Badge>
                            </td>
                            <td>2024-10-15</td>
                          </tr>
                          <tr>
                            <td className="py-1">Remarks</td>
                            <td>
                              <Badge variant="gray" size="sm">
                                No
                              </Badge>
                            </td>
                            <td>Term 2 fees</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
        }

          {excelUploadStep === 'preview' && excelFile &&
        <Card title="File Preview" subtitle={`File: ${excelFile.name}`}>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">File Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {excelFile.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">File Size</p>
                      <p className="text-sm font-medium text-gray-900">
                        {(excelFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">File Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {excelFile.type || 'Excel'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <Badge variant="success">Ready to Process</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                label="Academic Year"
                options={academicYearOptions}
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                required />

                  <Input
                label="Receipt Date"
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                required />

                </div>

                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={handleResetExcel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                variant="primary"
                onClick={handleProcessExcel}
                loading={isExcelProcessing}>

                    <Upload className="w-4 h-4 mr-2" />
                    Process & Match Students
                  </Button>
                </div>
              </div>
            </Card>
        }

          {excelUploadStep === 'review' && excelData.length > 0 &&
        <>
              {/* Excel Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Rows</p>
                      <p className="text-xl font-bold text-gray-900">
                        {excelStats.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Link2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Matched</p>
                      <p className="text-xl font-bold text-green-700">
                        {excelStats.matched.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Unlink className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unmatched</p>
                      <p className="text-xl font-bold text-red-700">
                        {excelStats.unmatched.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">With Errors</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {excelStats.withErrors.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Selected</p>
                      <p className="text-xl font-bold text-blue-700">
                        {excelStats.selected.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-green-700">
                        ₹{excelStats.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Excel Data Table */}
              <Card
            noPadding
            title="Uploaded Data"
            subtitle="Review and select records to process"
            action={
            <div className="flex gap-2">
                    <Button
                variant="outline"
                size="sm"
                onClick={handleResetExcel}>

                      <RefreshCw className="w-4 h-4 mr-1" />
                      Upload New File
                    </Button>
                  </div>
            }>

                {/* Table Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-2 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">
                    <Checkbox
                  checked={
                  excelStats.matched.length > 0 &&
                  excelStats.selected.length === excelStats.matched.length
                  }
                  indeterminate={
                  excelStats.selected.length > 0 &&
                  excelStats.selected.length < excelStats.matched.length
                  }
                  onChange={handleExcelSelectAll} />

                  </div>
                  <div className="col-span-1">Row</div>
                  <div className="col-span-2">Student ID / GR</div>
                  <div className="col-span-2">Student Name</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1">Mode</div>
                  <div className="col-span-2">Match Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Data Rows */}
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {excelData.map((row) =>
              <div
                key={row.id}
                className={`px-4 py-3 grid grid-cols-12 gap-2 items-center ${row.errors.length > 0 ? 'bg-red-50/50' : row.matchStatus === 'matched' ? 'bg-green-50/30' : 'bg-yellow-50/30'}`}>

                      <div className="col-span-1">
                        <Checkbox
                    checked={row.isSelected}
                    onChange={(checked) =>
                    handleExcelSelectRow(row.id, checked)
                    }
                    disabled={
                    row.matchStatus !== 'matched' ||
                    row.errors.length > 0
                    } />

                      </div>
                      <div className="col-span-1 text-sm text-gray-600">
                        {row.rowNumber}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-900">
                          {row.studentId || row.grNo || '-'}
                        </p>
                        {row.grNo && row.studentId &&
                  <p className="text-xs text-gray-500">
                            GR: {row.grNo}
                          </p>
                  }
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-900">
                          {row.studentName}
                        </p>
                        {row.matchedStudent &&
                  <p className="text-xs text-green-600">
                            → {row.matchedStudent.firstName}{' '}
                            {row.matchedStudent.lastName}
                          </p>
                  }
                      </div>
                      <div className="col-span-1 text-right">
                        <p
                    className={`text-sm font-semibold ${row.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>

                          ₹{Math.abs(row.amount).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs text-gray-600">
                          {row.paymentMode}
                        </p>
                      </div>
                      <div className="col-span-2">
                        {getMatchStatusBadge(row.matchStatus)}
                        {row.errors.length > 0 &&
                  <div className="mt-1">
                            {row.errors.map((error, idx) =>
                    <p key={idx} className="text-xs text-red-600">
                                {error}
                              </p>
                    )}
                          </div>
                  }
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        {(row.matchStatus === 'unmatched' ||
                  row.matchStatus === 'multiple') &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUnmatchedRow(row);
                      setShowMatchModal(true);
                    }}>

                            <Link className="w-3 h-3 mr-1" />
                            Match
                          </Button>
                  }
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
              )}
                </div>
              </Card>
            </>
        }

          {excelUploadStep === 'upload' && excelData.length === 0 &&
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Step 1: Upload
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload Excel/CSV file with payment data
                  </p>
                </div>
              </Card>
              <Card className="text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowLeftRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Step 2: Auto-Match
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    System automatically matches with student records
                  </p>
                </div>
              </Card>
              <Card className="text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Step 3: Process
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Review, resolve errors, and generate receipts
                  </p>
                </div>
              </Card>
            </div>
        }
        </>
      }

      {/* ============================================ */}
      {/* GATEWAY IMPORT TAB */}
      {/* ============================================ */}
      {activeTab === 'gateway' &&
      <>
          {gatewayImportStep === 'select' &&
        <Card
          title="Select Payment Gateway"
          subtitle="Choose the payment gateway to import settlement data from">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentGateways.map((gateway) =>
            <div
              key={gateway.id}
              onClick={() => handleGatewaySelect(gateway.id)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 ${selectedGateway === gateway.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>

                    <div className="flex items-center gap-3 mb-3">
                      <div
                  className={`p-2 rounded-lg ${selectedGateway === gateway.id ? 'bg-blue-100' : 'bg-gray-100'}`}>

                        {gateway.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {gateway.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Format: {gateway.fileFormat}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-medium mb-1">Expected Fields:</p>
                      <p className="truncate">{gateway.fields.join(', ')}</p>
                    </div>
                  </div>
            )}
              </div>
            </Card>
        }

          {gatewayImportStep === 'upload' && selectedGateway &&
        <Card
          title={`Import from ${paymentGateways.find((g) => g.id === selectedGateway)?.name}`}
          subtitle="Upload settlement file or connect via API">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FileUpload
                onFileSelect={handleGatewayFileSelect}
                accept=".csv,.xlsx,.xls"
                label="Settlement File"
                helperText={`Upload ${paymentGateways.find((g) => g.id === selectedGateway)?.fileFormat} file`}
                selectedFile={gatewayFile} />


                  <div className="grid grid-cols-2 gap-4">
                    <Input
                  label="Settlement From Date"
                  type="date"
                  value={gatewayDateRange.from}
                  onChange={(e) =>
                  setGatewayDateRange((prev) => ({
                    ...prev,
                    from: e.target.value
                  }))
                  } />

                    <Input
                  label="Settlement To Date"
                  type="date"
                  value={gatewayDateRange.to}
                  onChange={(e) =>
                  setGatewayDateRange((prev) => ({
                    ...prev,
                    to: e.target.value
                  }))
                  } />

                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">
                          Important Note
                        </p>
                        <ul className="text-xs text-yellow-800 mt-1 space-y-1 list-disc list-inside">
                          <li>
                            Only 'captured' transactions will be processed
                          </li>
                          <li>Refunded transactions will be skipped</li>
                          <li>
                            Matching is done via email/phone linked to student
                            records
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Or Connect via API
                  </h4>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Auto-Sync Enabled
                        </p>
                        <p className="text-xs text-gray-500">
                          Automatically import daily settlements
                        </p>
                      </div>
                      <Badge variant="success">Connected</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Last sync: 2024-10-15 06:00 AM</p>
                      <p>Next sync: 2024-10-16 06:00 AM</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Auto-Matching Rules
                    </h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Match by Order ID (if contains student ID)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Match by Parent Email address
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Match by Parent Phone number
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                        Multiple matches flagged for review
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleResetGateway}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
              variant="primary"
              onClick={handleProcessGateway}
              loading={isGatewayProcessing}
              disabled={!gatewayFile}>

                  <Upload className="w-4 h-4 mr-2" />
                  Import & Match
                </Button>
              </div>
            </Card>
        }

          {gatewayImportStep === 'review' && gatewayData.length > 0 &&
        <>
              {/* Gateway Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {gatewayStats.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Link2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Matched</p>
                      <p className="text-xl font-bold text-green-700">
                        {gatewayStats.matched.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Unlink className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unmatched</p>
                      <p className="text-xl font-bold text-red-700">
                        {gatewayStats.unmatched.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Refunded</p>
                      <p className="text-xl font-bold text-purple-700">
                        {gatewayStats.refunded.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Selected</p>
                      <p className="text-xl font-bold text-blue-700">
                        {gatewayStats.selected.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gross Amount</p>
                      <p className="text-xl font-bold text-green-700">
                        ₹{gatewayStats.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Net (After Fees)</p>
                      <p className="text-xl font-bold text-amber-700">
                        ₹{gatewayStats.netAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gateway Data Table */}
              <Card
            noPadding
            title="Settlement Transactions"
            subtitle="Review and select transactions to process"
            action={
            <div className="flex gap-2">
                    <Button
                variant="outline"
                size="sm"
                onClick={handleResetGateway}>

                      <RefreshCw className="w-4 h-4 mr-1" />
                      Import New File
                    </Button>
                  </div>
            }>

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-2 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">
                    <Checkbox
                  checked={
                  gatewayStats.matched.length > 0 &&
                  gatewayStats.selected.length ===
                  gatewayStats.matched.length
                  }
                  indeterminate={
                  gatewayStats.selected.length > 0 &&
                  gatewayStats.selected.length <
                  gatewayStats.matched.length
                  }
                  onChange={handleGatewaySelectAll} />

                  </div>
                  <div className="col-span-2">Transaction ID</div>
                  <div className="col-span-2">Student</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1">Method</div>
                  <div className="col-span-1">Tx Status</div>
                  <div className="col-span-2">Match Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {gatewayData.map((row) =>
              <div
                key={row.id}
                className={`px-4 py-3 grid grid-cols-12 gap-2 items-center ${row.status === 'refunded' ? 'bg-gray-50/80 opacity-60' : row.matchStatus === 'matched' ? 'bg-green-50/30' : row.matchStatus === 'unmatched' ? 'bg-red-50/30' : 'bg-yellow-50/30'}`}>

                      <div className="col-span-1">
                        <Checkbox
                    checked={row.isSelected}
                    onChange={(checked) =>
                    handleGatewaySelectRow(row.id, checked)
                    }
                    disabled={
                    row.matchStatus !== 'matched' ||
                    row.status !== 'captured'
                    } />

                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-mono text-gray-700 truncate">
                          {row.transactionId}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {row.orderId}
                        </p>
                      </div>
                      <div className="col-span-2">
                        {row.matchedStudent ?
                  <div>
                            <p className="text-sm font-medium text-gray-900">
                              {row.matchedStudent.firstName}{' '}
                              {row.matchedStudent.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {row.matchedStudent.grNo}
                            </p>
                          </div> :

                  <div>
                            <p className="text-xs text-gray-500 truncate">
                              {row.email}
                            </p>
                            <p className="text-xs text-gray-400">{row.phone}</p>
                          </div>
                  }
                      </div>
                      <div className="col-span-1 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{row.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Net: ₹{row.netAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs text-gray-600">
                          {row.paymentMethod}
                        </p>
                      </div>
                      <div className="col-span-1">
                        {getGatewayStatusBadge(row.status)}
                      </div>
                      <div className="col-span-2">
                        {getMatchStatusBadge(row.matchStatus)}
                        {row.remarks &&
                  <p className="text-xs text-gray-500 mt-0.5">
                            {row.remarks}
                          </p>
                  }
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        {(row.matchStatus === 'unmatched' ||
                  row.matchStatus === 'partial') &&
                  row.status === 'captured' &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUnmatchedRow(row);
                      setShowMatchModal(true);
                    }}>

                              <Link className="w-3 h-3 mr-1" />
                              Match
                            </Button>
                  }
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
              )}
                </div>
              </Card>
            </>
        }
        </>
      }

      {/* ============================================ */}
      {/* ERROR LOG TAB */}
      {/* ============================================ */}
      {activeTab === 'errors' &&
      <>
          {/* Error Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileWarning className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Logs</p>
                  <p className="text-xl font-bold text-gray-900">
                    {errorStats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Errors</p>
                  <p className="text-xl font-bold text-red-700">
                    {errorStats.errors.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warnings</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {errorStats.warnings.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-xl font-bold text-green-700">
                    {errorStats.resolved.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertOctagon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unresolved</p>
                  <p className="text-xl font-bold text-orange-700">
                    {errorStats.unresolved.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card
          noPadding
          title="Error & Warning Log"
          subtitle="Review and resolve errors from bulk processing operations"
          action={
          <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRetryFailed}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry Failed
                </Button>
                <Button
              variant="outline"
              size="sm"
              onClick={handleExportErrorLog}>

                  <Download className="w-4 h-4 mr-1" />
                  Export Log
                </Button>
                {errorLogs.length === 0 &&
            <Button
              variant="primary"
              size="sm"
              onClick={handleLoadErrorLogs}>

                    <RefreshCw className="w-4 h-4 mr-1" />
                    Load Logs
                  </Button>
            }
              </div>
          }>

            {/* Filters */}
            <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap gap-3">
              <div className="flex gap-1">
                {(
              [
              'all',
              'error',
              'warning',
              'info',
              'resolved',
              'unresolved'] as
              const).
              map((f) =>
              <button
                key={f}
                onClick={() => setErrorFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${errorFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>

                    {f}
                  </button>
              )}
              </div>
              <div className="flex gap-1">
                {(
              [
              'all',
              'excel_upload',
              'gateway_import',
              'processing',
              'validation'] as
              const).
              map((f) =>
              <button
                key={f}
                onClick={() => setErrorTypeFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${errorTypeFilter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>

                    {f.replace('_', ' ')}
                  </button>
              )}
              </div>
            </div>

            {filteredErrors.length === 0 ?
          <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No Errors Found
                </h3>
                <p className="text-sm text-gray-500">
                  {errorLogs.length === 0 ?
              'Process some bulk operations to see error logs here.' :
              'No errors match the current filter.'}
                </p>
              </div> :

          <div className="divide-y divide-gray-100">
                {filteredErrors.map((log) =>
            <div
              key={log.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${log.isResolved ? 'opacity-60' : ''}`}
              onClick={() => {
                setSelectedError(log);
                setShowErrorDetailModal(true);
              }}>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5">
                          {getSeverityBadge(log.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900">
                              {log.errorMessage}
                            </p>
                            <span className="text-xs font-mono text-gray-400">
                              [{log.errorCode}]
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                            <span>{log.timestamp}</span>
                            <span>Source: {log.source}</span>
                            {log.rowNumber && <span>Row: {log.rowNumber}</span>}
                            {log.studentName &&
                      <span>Student: {log.studentName}</span>
                      }
                          </div>
                          {log.details &&
                    <p className="text-xs text-gray-500 mt-1 truncate">
                              {log.details}
                            </p>
                    }
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getSourceBadge(
                    log.type === 'excel_upload' ?
                    'excel' :
                    log.type === 'gateway_import' ?
                    'gateway' :
                    'manual'
                  )}
                        {log.isResolved ?
                  <Badge
                    variant="success"
                    icon={<CheckCircle className="w-3 h-3" />}>

                            Resolved
                          </Badge> :

                  <Badge
                    variant="danger"
                    icon={<AlertCircle className="w-3 h-3" />}>

                            Open
                          </Badge>
                  }
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
            )}
              </div>
          }
          </Card>
        </>
      }

      {/* ============================================ */}
      {/* BATCH HISTORY TAB */}
      {/* ============================================ */}
      {activeTab === 'history' &&
      <Card
        noPadding
        title="Bulk Receipt Batch History"
        subtitle="View all previously processed bulk receipt batches"
        action={
        <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
        }>

          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-2 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Batch No</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2">Class / Section</div>
            <div className="col-span-2">Fee Head / Term</div>
            <div className="col-span-1 text-right">Students</div>
            <div className="col-span-2 text-right">Total Amount</div>
            <div className="col-span-1">Source</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {mockBatchHistory.map((batch) =>
          <div
            key={batch.id}
            className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50">

                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">
                    {batch.batchNo}
                  </p>
                  <p className="text-xs text-gray-400">{batch.createdBy}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-gray-700">{batch.date}</p>
                  <p className="text-xs text-gray-400">{batch.academicYear}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700">
                    Class {batch.class} - {batch.section}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700">{batch.feeHead}</p>
                  <p className="text-xs text-gray-400">{batch.term}</p>
                </div>
                <div className="col-span-1 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {batch.totalStudents}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{batch.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400">{batch.receiptRange}</p>
                </div>
                <div className="col-span-1">{getSourceBadge(batch.source)}</div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                onClick={() => handleViewBatchDetail(batch)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="View details">

                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Print receipts">

                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Preview Bulk Receipts"
        subtitle={`${selectedStudents.length} students · ₹${totalPayingAmount.toLocaleString('en-IN')} total`}
        size="xl">

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Receipt Generation Summary
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedStudents.length} receipts will be generated for a
                  total of ₹{totalPayingAmount.toLocaleString('en-IN')}.
                  Receipts will be numbered sequentially and can be printed
                  after generation.
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
            {selectedStudents.map((entry) =>
            <div
              key={entry.id}
              className="px-4 py-3 flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {entry.student.firstName[0]}
                    {entry.student.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.student.firstName} {entry.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Roll: {entry.student.rollNo} | GR: {entry.student.grNo}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{entry.payingAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {paymentModes.find((m) => m.id === entry.paymentMode)?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}>

              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleGenerateReceipts}
              loading={isProcessing}>

              <Save className="w-4 h-4 mr-2" />
              Confirm & Generate Receipts
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Receipts Generated Successfully"
        size="md">

        <div className="p-6 space-y-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bulk Receipts Generated!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              All receipts have been successfully generated and saved.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Batch Number</span>
              <span className="font-medium text-gray-900">
                {generatedBatchNo}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Receipt Range</span>
              <span className="font-medium text-gray-900">
                {generatedReceiptRange}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{receiptDate}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowSuccessModal(false)}>

              Close
            </Button>
            <Button variant="primary" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print All Receipts
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Settings Modal */}
      <Modal
        isOpen={showBulkSettingsModal}
        onClose={() => setShowBulkSettingsModal(false)}
        title="Bulk Payment Settings"
        subtitle="Apply payment mode and reference settings to all selected students"
        size="md">

        <div className="p-6 space-y-4">
          <Select
            label="Default Payment Mode"
            options={paymentModes.map((m) => ({
              value: m.id,
              label: m.name
            }))}
            value={defaultPaymentMode}
            onChange={(e) => setDefaultPaymentMode(e.target.value)} />

          <Input
            label="Reference Number Prefix"
            placeholder="e.g. BULK-OCT (will append roll no)"
            value={commonReferencePrefix}
            onChange={(e) => setCommonReferencePrefix(e.target.value)} />

          <Input
            label="Common Remarks"
            placeholder="Optional remarks for all receipts"
            value={commonRemarks}
            onChange={(e) => setCommonRemarks(e.target.value)} />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowBulkSettingsModal(false)}>

              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyBulkSettings}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Apply to Selected
            </Button>
          </div>
        </div>
      </Modal>

      {/* Student Detail Modal */}
      <Modal
        isOpen={showStudentDetailModal}
        onClose={() => setShowStudentDetailModal(false)}
        title="Student Fee Details"
        subtitle={
        selectedStudentDetail ?
        `${selectedStudentDetail.student.firstName} ${selectedStudentDetail.student.lastName}` :
        ''
        }
        size="lg">

        {selectedStudentDetail &&
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500">GR Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedStudentDetail.student.grNo}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">SU ID</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedStudentDetail.student.suId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Class / Section</p>
                <p className="text-sm font-medium text-gray-900">
                  Class {selectedStudentDetail.student.class} -{' '}
                  {selectedStudentDetail.student.section}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fee Category</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedStudentDetail.student.feeCategory}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Parent Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedStudentDetail.student.parentName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Parent Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedStudentDetail.student.parentPhone}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Fee Breakdown
              </h4>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                {selectedStudentDetail.fees.map((fee) =>
              <div
                key={fee.id}
                className="px-4 py-3 flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {fee.feeHeadName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fee.term} · Due: {fee.dueDate}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{fee.balanceAmount.toLocaleString('en-IN')}
                      </p>
                      {fee.discountAmount > 0 &&
                  <p className="text-xs text-green-600">
                          Disc: -₹{fee.discountAmount.toLocaleString('en-IN')}
                        </p>
                  }
                      {getStatusBadge(fee.status)}
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
              variant="outline"
              onClick={() => setShowStudentDetailModal(false)}>

                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Batch History Detail Modal */}
      <Modal
        isOpen={showHistoryDetailModal}
        onClose={() => setShowHistoryDetailModal(false)}
        title="Batch Details"
        subtitle={selectedBatch ? `Batch: ${selectedBatch.batchNo}` : ''}
        size="lg">

        {selectedBatch &&
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500">Batch Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.batchNo}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Academic Year</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.academicYear}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Class / Section</p>
                <p className="text-sm font-medium text-gray-900">
                  Class {selectedBatch.class} - {selectedBatch.section}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fee Head</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.feeHead}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Term</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.term}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.totalStudents}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-sm font-medium text-gray-900">
                  ₹{selectedBatch.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Receipt Range</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.receiptRange}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Source</p>
                {getSourceBadge(selectedBatch.source)}
              </div>
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.createdBy}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedBatch.createdAt}
                </p>
              </div>
            </div>
            {selectedBatch.remarks &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Remarks</p>
                <p className="text-sm text-gray-700">{selectedBatch.remarks}</p>
              </div>
          }
            <div className="flex justify-between pt-2">
              <Button
              variant="outline"
              onClick={() => setShowHistoryDetailModal(false)}>

                Close
              </Button>
              <Button variant="primary">
                <Printer className="w-4 h-4 mr-2" />
                Print Receipts
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Manual Match Modal */}
      <Modal
        isOpen={showMatchModal}
        onClose={() => {
          setShowMatchModal(false);
          setSelectedUnmatchedRow(null);
        }}
        title="Manual Student Match"
        subtitle="Search and select the correct student for this record"
        size="lg">

        <div className="p-6 space-y-4">
          {selectedUnmatchedRow &&
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                Record to Match
              </p>
              {'rowNumber' in selectedUnmatchedRow ?
            <p className="text-sm text-yellow-700">
                  Row {(selectedUnmatchedRow as ExcelUploadRow).rowNumber}:{' '}
                  {(selectedUnmatchedRow as ExcelUploadRow).studentName} — ₹
                  {(
              selectedUnmatchedRow as ExcelUploadRow).
              amount.toLocaleString('en-IN')}
                </p> :

            <p className="text-sm text-yellow-700">
                  Txn:{' '}
                  {(selectedUnmatchedRow as GatewaySettlement).transactionId} —
                  ₹
                  {(
              selectedUnmatchedRow as GatewaySettlement).
              amount.toLocaleString('en-IN')}
                </p>
            }
            </div>
          }

          <Input
            label="Search Student"
            placeholder="Search by name, GR No, or SU ID..."
            leftIcon={<Search className="w-4 h-4" />} />


          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {getMockStudentPayments().map((entry) =>
            <div
              key={entry.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                if (
                selectedUnmatchedRow &&
                'rowNumber' in selectedUnmatchedRow)
                {
                  handleManualMatch(
                    selectedUnmatchedRow as ExcelUploadRow,
                    entry.student
                  );
                } else if (selectedUnmatchedRow) {
                  handleGatewayManualMatch(
                    selectedUnmatchedRow as GatewaySettlement,
                    entry.student
                  );
                }
              }}>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {entry.student.firstName[0]}
                    {entry.student.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.student.firstName} {entry.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      GR: {entry.student.grNo} | Roll: {entry.student.rollNo} |
                      Class {entry.student.class}-{entry.student.section}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link2 className="w-3 h-3 mr-1" />
                  Select
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowMatchModal(false);
                setSelectedUnmatchedRow(null);
              }}>

              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Error Detail Modal */}
      <Modal
        isOpen={showErrorDetailModal}
        onClose={() => {
          setShowErrorDetailModal(false);
          setSelectedError(null);
        }}
        title="Error Details"
        subtitle={selectedError ? selectedError.errorCode : ''}
        size="md">

        {selectedError &&
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              {getSeverityBadge(selectedError.severity)}
              {getSourceBadge(
              selectedError.type === 'excel_upload' ?
              'excel' :
              selectedError.type === 'gateway_import' ?
              'gateway' :
              'manual'
            )}
              {selectedError.isResolved ?
            <Badge
              variant="success"
              icon={<CheckCircle className="w-3 h-3" />}>

                  Resolved
                </Badge> :

            <Badge
              variant="danger"
              icon={<AlertCircle className="w-3 h-3" />}>

                  Open
                </Badge>
            }
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Error Message</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedError.errorMessage}
                </p>
              </div>
              {selectedError.details &&
            <div>
                  <p className="text-xs text-gray-500">Details</p>
                  <p className="text-sm text-gray-700">
                    {selectedError.details}
                  </p>
                </div>
            }
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Timestamp</p>
                  <p className="text-sm text-gray-700">
                    {selectedError.timestamp}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm text-gray-700">
                    {selectedError.source}
                  </p>
                </div>
                {selectedError.studentName &&
              <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="text-sm text-gray-700">
                      {selectedError.studentName}
                    </p>
                  </div>
              }
                {selectedError.rowNumber &&
              <div>
                    <p className="text-xs text-gray-500">Row Number</p>
                    <p className="text-sm text-gray-700">
                      {selectedError.rowNumber}
                    </p>
                  </div>
              }
              </div>
            </div>

            {selectedError.isResolved &&
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-green-800">Resolution</p>
                <p className="text-sm text-green-700">
                  {selectedError.resolution}
                </p>
                <p className="text-xs text-green-600">
                  Resolved by {selectedError.resolvedBy} at{' '}
                  {selectedError.resolvedAt}
                </p>
              </div>
          }

            <div className="flex justify-between pt-2">
              <Button
              variant="outline"
              onClick={() => {
                setShowErrorDetailModal(false);
                setSelectedError(null);
              }}>

                Close
              </Button>
              {!selectedError.isResolved &&
            <Button
              variant="success"
              onClick={() =>
              handleResolveError(
                selectedError.id,
                'Manually resolved by user'
              )
              }>

                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
            }
            </div>
          </div>
        }
      </Modal>
    </div>);

}