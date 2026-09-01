import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  Fragment } from
'react';
import {
  Search,
  Printer,
  Mail,
  Eye,
  Plus,
  Download,
  Filter,
  RotateCcw,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Settings,
  Send,
  Copy,
  Calendar,
  IndianRupee,
  Building,
  Percent,
  Hash,
  Users,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  Info,
  AlertTriangle,
  MailCheck,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  ArrowRight,
  MoreVertical,
  ExternalLink,
  Bell,
  XCircle,
  History,
  Link,
  Unlink,
  FileWarning,
  Bookmark,
  Share2,
  Layers,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Award,
  Star,
  Archive,
  Paperclip,
  Image,
  MessageSquare,
  Phone,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  BookOpen,
  ListChecks,
  ClipboardCheck,
  Banknote,
  Wallet,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Table,
  LayoutGrid,
  ListFilter,
  Sparkles,
  BadgePercent,
  Tags,
  Package,
  ShoppingCart,
  Calculator,
  Scale,
  FileCheck,
  FilePlus,
  FileX,
  FileMinus,
  Undo2,
  RotateCw } from
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
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  feeCategory: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  admissionDate: string;
  hasTransport: boolean;
  hasHostel: boolean;
  hasScholarship: boolean;
  scholarshipPercentage?: number;
  hasConcession: boolean;
  concessionPercentage?: number;
  outstandingBalance: number;
}
interface FeeHead {
  id: string;
  name: string;
  code: string;
  category:
  'tuition' |
  'transport' |
  'hostel' |
  'lab' |
  'activity' |
  'exam' |
  'other';
  gstApplicable: boolean;
  gstRate: number;
  hsnCode: string;
  sacCode: string;
}
interface FeeInstallment {
  id: string;
  name: string;
  feeHeadId: string;
  feeHeadName: string;
  feeHeadCode: string;
  originalAmount: number;
  discountAmount: number;
  concessionAmount: number;
  scholarshipAmount: number;
  netAmount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGSTAmount: number;
  finalAmount: number;
  dueDate: string;
  term: string;
  academicYear: string;
  isSelected?: boolean;
  isPaid: boolean;
  paidAmount: number;
  pendingAmount: number;
}
interface GSTConfig {
  enabled: boolean;
  gstNumber: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo?: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  useIGST: boolean;
  defaultHsnCode: string;
  defaultSacCode: string;
  placeOfSupply: string;
  stateCode: string;
  panNumber: string;
  tanNumber: string;
  reverseCharge: boolean;
  composition: boolean;
}
interface InvoiceItem {
  id: string;
  slNo: number;
  feeHeadId: string;
  feeHeadName: string;
  feeHeadCode: string;
  hsnSacCode: string;
  description: string;
  term: string;
  quantity: number;
  rate: number;
  grossAmount: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGST: number;
  netAmount: number;
}
interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceType: 'regular' | 'proforma' | 'credit_note' | 'debit_note';
  invoiceDate: string;
  dueDate: string;
  academicYear: string;
  term: string;
  // Student Details
  student: Student;
  // Billing Details
  billedTo: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    gstin?: string;
  };
  // Items
  items: InvoiceItem[];
  // Summary
  totalQuantity: number;
  grossTotal: number;
  totalDiscount: number;
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalGST: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  // Payment
  status:
  'draft' |
  'pending' |
  'paid' |
  'partial' |
  'overdue' |
  'cancelled' |
  'refunded';
  paidAmount: number;
  balanceAmount: number;
  paymentDueDate: string;
  // Late Fee
  lateFeeApplicable: boolean;
  lateFeeAmount: number;
  lateFeeRate: number;
  daysOverdue: number;
  // Linked Documents
  linkedReceipts: string[];
  linkedCreditNotes: string[];
  parentInvoiceId?: string;
  // GST Details
  gstApplicable: boolean;
  reverseCharge: boolean;
  placeOfSupply: string;
  // Metadata
  generatedBy: string;
  generatedAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  // Communication
  emailSentAt?: string;
  emailSentTo?: string;
  smsSentAt?: string;
  remindersSent: number;
  lastReminderAt?: string;
  // Printing
  printedAt?: string;
  printCount: number;
  // Notes
  termsAndConditions: string;
  notes: string;
  internalNotes: string;
  // Attachments
  attachments: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  // Audit Trail
  auditTrail: {
    id: string;
    action: string;
    performedBy: string;
    performedAt: string;
    details: string;
    oldValue?: string;
    newValue?: string;
  }[];
}
interface InvoiceNumberConfig {
  prefix: string;
  suffix: string;
  startNumber: number;
  currentNumber: number;
  padLength: number;
  includeYear: boolean;
  includeMonth: boolean;
  includeAcademicYear: boolean;
  separator: string;
  resetFrequency: 'yearly' | 'monthly' | 'academic_year' | 'never';
  yearFormat: '2024' | '24' | '2024-25' | '24-25';
  preview: string;
  lastResetDate: string;
  lastInvoiceNo: string;
}
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  type: 'invoice' | 'reminder' | 'overdue' | 'receipt' | 'credit_note';
  variables: string[];
}
interface PrintTemplate {
  id: string;
  name: string;
  paperSize: 'A4' | 'A5' | 'Letter' | 'Custom';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  showLogo: boolean;
  showQRCode: boolean;
  showBarcode: boolean;
  showTerms: boolean;
  showBankDetails: boolean;
  headerHTML: string;
  footerHTML: string;
  isDefault: boolean;
}
interface InvoiceSummaryStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  draftCount: number;
  pendingCount: number;
  paidCount: number;
  partialCount: number;
  overdueCount: number;
  cancelledCount: number;
  thisMonthTotal: number;
  lastMonthTotal: number;
  monthlyGrowth: number;
  avgInvoiceAmount: number;
  avgPaymentTime: number;
  collectionRate: number;
  gstCollected: number;
  lateFeeCollected: number;
}
// ============================================
// MOCK DATA
// ============================================
const mockFeeHeads: FeeHead[] = [
{
  id: 'tuition',
  name: 'Tuition Fee',
  code: 'TUI',
  category: 'tuition',
  gstApplicable: false,
  gstRate: 0,
  hsnCode: '999293',
  sacCode: '999293'
},
{
  id: 'lab',
  name: 'Lab Fee',
  code: 'LAB',
  category: 'lab',
  gstApplicable: true,
  gstRate: 18,
  hsnCode: '999293',
  sacCode: '999293'
},
{
  id: 'activity',
  name: 'Activity Fee',
  code: 'ACT',
  category: 'activity',
  gstApplicable: true,
  gstRate: 18,
  hsnCode: '999293',
  sacCode: '999293'
},
{
  id: 'transport',
  name: 'Transport Fee',
  code: 'TRN',
  category: 'transport',
  gstApplicable: true,
  gstRate: 5,
  hsnCode: '996411',
  sacCode: '996411'
},
{
  id: 'hostel',
  name: 'Hostel Fee',
  code: 'HOS',
  category: 'hostel',
  gstApplicable: true,
  gstRate: 12,
  hsnCode: '996311',
  sacCode: '996311'
},
{
  id: 'exam',
  name: 'Examination Fee',
  code: 'EXM',
  category: 'exam',
  gstApplicable: false,
  gstRate: 0,
  hsnCode: '999293',
  sacCode: '999293'
},
{
  id: 'library',
  name: 'Library Fee',
  code: 'LIB',
  category: 'other',
  gstApplicable: false,
  gstRate: 0,
  hsnCode: '999293',
  sacCode: '999293'
},
{
  id: 'sports',
  name: 'Sports Fee',
  code: 'SPT',
  category: 'activity',
  gstApplicable: true,
  gstRate: 18,
  hsnCode: '999293',
  sacCode: '999293'
}];

const mockStudents: Student[] = [
{
  id: '1',
  grNo: 'GR2024001',
  suId: 'SU12345678',
  rollNo: '01',
  firstName: 'Rahul',
  lastName: 'Sharma',
  class: '10',
  section: 'A',
  department: 'Science',
  parentName: 'Amit Sharma',
  parentEmail: 'amit.sharma@email.com',
  parentPhone: '+91 98765 43210',
  feeCategory: 'General',
  address: '123 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  admissionDate: '2022-04-01',
  hasTransport: true,
  hasHostel: false,
  hasScholarship: true,
  scholarshipPercentage: 10,
  hasConcession: false,
  outstandingBalance: 32000
},
{
  id: '2',
  grNo: 'GR2024002',
  suId: 'SU12345679',
  rollNo: '02',
  firstName: 'Priya',
  lastName: 'Patel',
  class: '10',
  section: 'A',
  department: 'Science',
  parentName: 'Rajesh Patel',
  parentEmail: 'rajesh.patel@email.com',
  parentPhone: '+91 98765 43211',
  feeCategory: 'OBC',
  address: '456 Park Avenue',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400002',
  admissionDate: '2022-04-01',
  hasTransport: false,
  hasHostel: false,
  hasScholarship: false,
  hasConcession: true,
  concessionPercentage: 15,
  outstandingBalance: 0
},
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
  parentName: 'Suresh Kumar',
  parentEmail: 'suresh.kumar@email.com',
  parentPhone: '+91 98765 43212',
  feeCategory: 'General',
  address: '789 Lake Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400003',
  admissionDate: '2022-04-01',
  hasTransport: true,
  hasHostel: false,
  hasScholarship: false,
  hasConcession: false,
  outstandingBalance: 21420
},
{
  id: '4',
  grNo: 'GR2024004',
  suId: 'SU12345681',
  rollNo: '04',
  firstName: 'Sneha',
  lastName: 'Gupta',
  class: '10',
  section: 'A',
  department: 'Science',
  parentName: 'Vinod Gupta',
  parentEmail: 'vinod.gupta@email.com',
  parentPhone: '+91 98765 43213',
  feeCategory: 'General',
  address: '321 Hill View',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400004',
  admissionDate: '2022-04-01',
  hasTransport: false,
  hasHostel: true,
  hasScholarship: true,
  scholarshipPercentage: 25,
  hasConcession: false,
  outstandingBalance: 25000
},
{
  id: '5',
  grNo: 'GR2024005',
  suId: 'SU12345682',
  rollNo: '05',
  firstName: 'Vikram',
  lastName: 'Singh',
  class: '9',
  section: 'B',
  department: 'Commerce',
  parentName: 'Harbhajan Singh',
  parentEmail: 'harbhajan.singh@email.com',
  parentPhone: '+91 98765 43214',
  feeCategory: 'Staff Ward',
  address: '654 Garden Lane',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400005',
  admissionDate: '2023-04-01',
  hasTransport: true,
  hasHostel: false,
  hasScholarship: false,
  hasConcession: true,
  concessionPercentage: 50,
  outstandingBalance: 0
}];

const mockInstallments: FeeInstallment[] = [
{
  id: '1',
  name: 'Term 1 - Tuition Fee',
  feeHeadId: 'tuition',
  feeHeadName: 'Tuition Fee',
  feeHeadCode: 'TUI',
  originalAmount: 25000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 25000,
  gstRate: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalGSTAmount: 0,
  finalAmount: 25000,
  dueDate: '2024-04-15',
  term: 'Term 1',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 25000
},
{
  id: '2',
  name: 'Term 1 - Lab Fee',
  feeHeadId: 'lab',
  feeHeadName: 'Lab Fee',
  feeHeadCode: 'LAB',
  originalAmount: 4000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 4000,
  gstRate: 18,
  cgstAmount: 360,
  sgstAmount: 360,
  igstAmount: 0,
  totalGSTAmount: 720,
  finalAmount: 4720,
  dueDate: '2024-04-15',
  term: 'Term 1',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 4720
},
{
  id: '3',
  name: 'Term 1 - Activity Fee',
  feeHeadId: 'activity',
  feeHeadName: 'Activity Fee',
  feeHeadCode: 'ACT',
  originalAmount: 3000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 3000,
  gstRate: 18,
  cgstAmount: 270,
  sgstAmount: 270,
  igstAmount: 0,
  totalGSTAmount: 540,
  finalAmount: 3540,
  dueDate: '2024-04-15',
  term: 'Term 1',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 3540
},
{
  id: '4',
  name: 'Term 2 - Tuition Fee',
  feeHeadId: 'tuition',
  feeHeadName: 'Tuition Fee',
  feeHeadCode: 'TUI',
  originalAmount: 25000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 25000,
  gstRate: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalGSTAmount: 0,
  finalAmount: 25000,
  dueDate: '2024-10-15',
  term: 'Term 2',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 25000
},
{
  id: '5',
  name: 'Term 2 - Lab Fee',
  feeHeadId: 'lab',
  feeHeadName: 'Lab Fee',
  feeHeadCode: 'LAB',
  originalAmount: 4000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 4000,
  gstRate: 18,
  cgstAmount: 360,
  sgstAmount: 360,
  igstAmount: 0,
  totalGSTAmount: 720,
  finalAmount: 4720,
  dueDate: '2024-10-15',
  term: 'Term 2',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 4720
},
{
  id: '6',
  name: 'Annual - Exam Fee',
  feeHeadId: 'exam',
  feeHeadName: 'Examination Fee',
  feeHeadCode: 'EXM',
  originalAmount: 2500,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 2500,
  gstRate: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalGSTAmount: 0,
  finalAmount: 2500,
  dueDate: '2024-12-15',
  term: 'Annual',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 2500
},
{
  id: '7',
  name: 'Transport Fee - Q1',
  feeHeadId: 'transport',
  feeHeadName: 'Transport Fee',
  feeHeadCode: 'TRN',
  originalAmount: 6000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 6000,
  gstRate: 5,
  cgstAmount: 150,
  sgstAmount: 150,
  igstAmount: 0,
  totalGSTAmount: 300,
  finalAmount: 6300,
  dueDate: '2024-04-15',
  term: 'Q1',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 6300
},
{
  id: '8',
  name: 'Transport Fee - Q2',
  feeHeadId: 'transport',
  feeHeadName: 'Transport Fee',
  feeHeadCode: 'TRN',
  originalAmount: 6000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 6000,
  gstRate: 5,
  cgstAmount: 150,
  sgstAmount: 150,
  igstAmount: 0,
  totalGSTAmount: 300,
  finalAmount: 6300,
  dueDate: '2024-07-15',
  term: 'Q2',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 6300
},
{
  id: '9',
  name: 'Library Fee - Annual',
  feeHeadId: 'library',
  feeHeadName: 'Library Fee',
  feeHeadCode: 'LIB',
  originalAmount: 1500,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 1500,
  gstRate: 0,
  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  totalGSTAmount: 0,
  finalAmount: 1500,
  dueDate: '2024-04-15',
  term: 'Annual',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 1500
},
{
  id: '10',
  name: 'Sports Fee - Annual',
  feeHeadId: 'sports',
  feeHeadName: 'Sports Fee',
  feeHeadCode: 'SPT',
  originalAmount: 2000,
  discountAmount: 0,
  concessionAmount: 0,
  scholarshipAmount: 0,
  netAmount: 2000,
  gstRate: 18,
  cgstAmount: 180,
  sgstAmount: 180,
  igstAmount: 0,
  totalGSTAmount: 360,
  finalAmount: 2360,
  dueDate: '2024-04-15',
  term: 'Annual',
  academicYear: '2024-25',
  isPaid: false,
  paidAmount: 0,
  pendingAmount: 2360
}];

const getMockInvoices = (): Invoice[] => {
  const baseInvoice: Partial<Invoice> = {
    invoiceType: 'regular',
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    lateFeeApplicable: false,
    lateFeeAmount: 0,
    lateFeeRate: 0,
    daysOverdue: 0,
    linkedReceipts: [],
    linkedCreditNotes: [],
    remindersSent: 0,
    printCount: 0,
    termsAndConditions:
    '1. Fees once paid are non-refundable.\n2. Late payment will attract additional charges.\n3. Cheque bounce will attract ₹500 penalty.',
    notes: '',
    internalNotes: '',
    attachments: [],
    auditTrail: []
  };
  return [
  {
    ...baseInvoice,
    id: '1',
    invoiceNo: 'INV-2024-0001',
    invoiceType: 'regular',
    invoiceDate: '2024-03-01',
    dueDate: '2024-04-15',
    paymentDueDate: '2024-04-15',
    academicYear: '2024-25',
    term: 'Term 1',
    student: mockStudents[0],
    billedTo: {
      name: mockStudents[0].parentName,
      address: mockStudents[0].address,
      city: mockStudents[0].city,
      state: mockStudents[0].state,
      pincode: mockStudents[0].pincode,
      phone: mockStudents[0].parentPhone,
      email: mockStudents[0].parentEmail
    },
    items: [
    {
      id: 'item1',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 1 Tuition Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 25000,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 25000
    },
    {
      id: 'item2',
      slNo: 2,
      feeHeadId: 'lab',
      feeHeadName: 'Lab Fee',
      feeHeadCode: 'LAB',
      hsnSacCode: '999293',
      description: 'Term 1 Lab Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 4000,
      grossAmount: 4000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 4000,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 360,
      sgstRate: 9,
      sgstAmount: 360,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 720,
      netAmount: 4720
    },
    {
      id: 'item3',
      slNo: 3,
      feeHeadId: 'activity',
      feeHeadName: 'Activity Fee',
      feeHeadCode: 'ACT',
      hsnSacCode: '999293',
      description: 'Term 1 Activity Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 3000,
      grossAmount: 3000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 3000,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 270,
      sgstRate: 9,
      sgstAmount: 270,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 540,
      netAmount: 3540
    }],

    totalQuantity: 3,
    grossTotal: 32000,
    totalDiscount: 0,
    taxableTotal: 32000,
    cgstTotal: 630,
    sgstTotal: 630,
    igstTotal: 0,
    totalGST: 1260,
    roundOff: 0,
    grandTotal: 33260,
    amountInWords: 'Thirty Three Thousand Two Hundred Sixty Rupees Only',
    status: 'pending',
    paidAmount: 0,
    balanceAmount: 33260,
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Admin User',
    generatedAt: '2024-03-01 10:30:00',
    auditTrail: [
    {
      id: 'a1',
      action: 'Invoice Created',
      performedBy: 'Admin User',
      performedAt: '2024-03-01 10:30:00',
      details: 'Invoice generated for Term 1 fees'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '2',
    invoiceNo: 'INV-2024-0002',
    invoiceType: 'regular',
    invoiceDate: '2024-03-01',
    dueDate: '2024-04-15',
    paymentDueDate: '2024-04-15',
    academicYear: '2024-25',
    term: 'Term 1',
    student: mockStudents[1],
    billedTo: {
      name: mockStudents[1].parentName,
      address: mockStudents[1].address,
      city: mockStudents[1].city,
      state: mockStudents[1].state,
      pincode: mockStudents[1].pincode,
      phone: mockStudents[1].parentPhone,
      email: mockStudents[1].parentEmail
    },
    items: [
    {
      id: 'item4',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 1 Tuition Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 15,
      discountAmount: 3750,
      taxableAmount: 21250,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 21250
    },
    {
      id: 'item5',
      slNo: 2,
      feeHeadId: 'lab',
      feeHeadName: 'Lab Fee',
      feeHeadCode: 'LAB',
      hsnSacCode: '999293',
      description: 'Term 1 Lab Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 4000,
      grossAmount: 4000,
      discountPercent: 15,
      discountAmount: 600,
      taxableAmount: 3400,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 306,
      sgstRate: 9,
      sgstAmount: 306,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 612,
      netAmount: 4012
    }],

    totalQuantity: 2,
    grossTotal: 29000,
    totalDiscount: 4350,
    taxableTotal: 24650,
    cgstTotal: 306,
    sgstTotal: 306,
    igstTotal: 0,
    totalGST: 612,
    roundOff: 0,
    grandTotal: 25262,
    amountInWords: 'Twenty Five Thousand Two Hundred Sixty Two Rupees Only',
    status: 'paid',
    paidAmount: 25262,
    balanceAmount: 0,
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Admin User',
    generatedAt: '2024-03-01 10:35:00',
    emailSentAt: '2024-03-01 10:40:00',
    emailSentTo: mockStudents[1].parentEmail,
    linkedReceipts: ['RCP-2024-0001'],
    auditTrail: [
    {
      id: 'a2',
      action: 'Invoice Created',
      performedBy: 'Admin User',
      performedAt: '2024-03-01 10:35:00',
      details: 'Invoice generated with 15% OBC concession'
    },
    {
      id: 'a3',
      action: 'Email Sent',
      performedBy: 'System',
      performedAt: '2024-03-01 10:40:00',
      details: `Email sent to ${mockStudents[1].parentEmail}`
    },
    {
      id: 'a4',
      action: 'Payment Received',
      performedBy: 'Cashier',
      performedAt: '2024-03-15 14:20:00',
      details: 'Full payment received via Online Transfer'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '3',
    invoiceNo: 'INV-2024-0003',
    invoiceType: 'regular',
    invoiceDate: '2024-03-02',
    dueDate: '2024-04-15',
    paymentDueDate: '2024-04-15',
    academicYear: '2024-25',
    term: 'Term 1',
    student: mockStudents[2],
    billedTo: {
      name: mockStudents[2].parentName,
      address: mockStudents[2].address,
      city: mockStudents[2].city,
      state: mockStudents[2].state,
      pincode: mockStudents[2].pincode,
      phone: mockStudents[2].parentPhone,
      email: mockStudents[2].parentEmail
    },
    items: [
    {
      id: 'item6',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 1 Tuition Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 25000,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 25000
    },
    {
      id: 'item7',
      slNo: 2,
      feeHeadId: 'transport',
      feeHeadName: 'Transport Fee',
      feeHeadCode: 'TRN',
      hsnSacCode: '996411',
      description: 'Q1 Transport Fee',
      term: 'Q1',
      quantity: 1,
      rate: 6000,
      grossAmount: 6000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 6000,
      gstRate: 5,
      cgstRate: 2.5,
      cgstAmount: 150,
      sgstRate: 2.5,
      sgstAmount: 150,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 300,
      netAmount: 6300
    },
    {
      id: 'item8',
      slNo: 3,
      feeHeadId: 'lab',
      feeHeadName: 'Lab Fee',
      feeHeadCode: 'LAB',
      hsnSacCode: '999293',
      description: 'Term 1 Lab Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 4000,
      grossAmount: 4000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 4000,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 360,
      sgstRate: 9,
      sgstAmount: 360,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 720,
      netAmount: 4720
    },
    {
      id: 'item9',
      slNo: 4,
      feeHeadId: 'activity',
      feeHeadName: 'Activity Fee',
      feeHeadCode: 'ACT',
      hsnSacCode: '999293',
      description: 'Term 1 Activity Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 3000,
      grossAmount: 3000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 3000,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 270,
      sgstRate: 9,
      sgstAmount: 270,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 540,
      netAmount: 3540
    }],

    totalQuantity: 4,
    grossTotal: 38000,
    totalDiscount: 0,
    taxableTotal: 38000,
    cgstTotal: 780,
    sgstTotal: 780,
    igstTotal: 0,
    totalGST: 1560,
    roundOff: 0,
    grandTotal: 39560,
    amountInWords: 'Thirty Nine Thousand Five Hundred Sixty Rupees Only',
    status: 'partial',
    paidAmount: 20000,
    balanceAmount: 19560,
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Accounts Officer',
    generatedAt: '2024-03-02 14:15:00',
    printedAt: '2024-03-02 14:20:00',
    printCount: 1,
    linkedReceipts: ['RCP-2024-0002'],
    auditTrail: [
    {
      id: 'a5',
      action: 'Invoice Created',
      performedBy: 'Accounts Officer',
      performedAt: '2024-03-02 14:15:00',
      details: 'Invoice generated for Term 1 fees with transport'
    },
    {
      id: 'a6',
      action: 'Invoice Printed',
      performedBy: 'Accounts Officer',
      performedAt: '2024-03-02 14:20:00',
      details: 'Invoice printed (1 copy)'
    },
    {
      id: 'a7',
      action: 'Partial Payment',
      performedBy: 'Cashier',
      performedAt: '2024-03-10 11:30:00',
      details: 'Partial payment of ₹20,000 received via Cash'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '4',
    invoiceNo: 'INV-2024-0004',
    invoiceType: 'regular',
    invoiceDate: '2024-02-15',
    dueDate: '2024-03-15',
    paymentDueDate: '2024-03-15',
    academicYear: '2024-25',
    term: 'Term 1',
    student: mockStudents[3],
    billedTo: {
      name: mockStudents[3].parentName,
      address: mockStudents[3].address,
      city: mockStudents[3].city,
      state: mockStudents[3].state,
      pincode: mockStudents[3].pincode,
      phone: mockStudents[3].parentPhone,
      email: mockStudents[3].parentEmail
    },
    items: [
    {
      id: 'item10',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 1 Tuition Fee',
      term: 'Term 1',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 25,
      discountAmount: 6250,
      taxableAmount: 18750,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 18750
    }],

    totalQuantity: 1,
    grossTotal: 25000,
    totalDiscount: 6250,
    taxableTotal: 18750,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    totalGST: 0,
    roundOff: 0,
    grandTotal: 18750,
    amountInWords: 'Eighteen Thousand Seven Hundred Fifty Rupees Only',
    status: 'overdue',
    paidAmount: 0,
    balanceAmount: 18750,
    lateFeeApplicable: true,
    lateFeeRate: 2,
    daysOverdue: 45,
    lateFeeAmount: 375,
    gstApplicable: false,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Admin User',
    generatedAt: '2024-02-15 11:00:00',
    remindersSent: 3,
    lastReminderAt: '2024-04-01 09:00:00',
    notes: 'Follow-up required - Parent requested extension',
    internalNotes:
    'Multiple reminders sent. Parent promised payment by month end.',
    auditTrail: [
    {
      id: 'a8',
      action: 'Invoice Created',
      performedBy: 'Admin User',
      performedAt: '2024-02-15 11:00:00',
      details: 'Invoice generated with 25% scholarship'
    },
    {
      id: 'a9',
      action: 'Reminder Sent',
      performedBy: 'System',
      performedAt: '2024-03-16 09:00:00',
      details: 'First payment reminder sent via email'
    },
    {
      id: 'a10',
      action: 'Reminder Sent',
      performedBy: 'System',
      performedAt: '2024-03-23 09:00:00',
      details: 'Second payment reminder sent via email'
    },
    {
      id: 'a11',
      action: 'Status Changed',
      performedBy: 'System',
      performedAt: '2024-03-16 00:00:00',
      details: 'Status changed from Pending to Overdue',
      oldValue: 'pending',
      newValue: 'overdue'
    },
    {
      id: 'a12',
      action: 'Late Fee Applied',
      performedBy: 'System',
      performedAt: '2024-03-16 00:00:00',
      details: 'Late fee of 2% applied'
    },
    {
      id: 'a13',
      action: 'Reminder Sent',
      performedBy: 'System',
      performedAt: '2024-04-01 09:00:00',
      details: 'Third payment reminder sent via email and SMS'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '5',
    invoiceNo: 'INV-2024-0005',
    invoiceType: 'regular',
    invoiceDate: '2024-03-05',
    dueDate: '2024-04-15',
    paymentDueDate: '2024-04-15',
    academicYear: '2024-25',
    term: 'Term 1',
    student: mockStudents[4],
    billedTo: {
      name: mockStudents[4].parentName,
      address: mockStudents[4].address,
      city: mockStudents[4].city,
      state: mockStudents[4].state,
      pincode: mockStudents[4].pincode,
      phone: mockStudents[4].parentPhone,
      email: mockStudents[4].parentEmail
    },
    items: [
    {
      id: 'item11',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 1 Tuition Fee (Staff Ward - 50% Concession)',
      term: 'Term 1',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 50,
      discountAmount: 12500,
      taxableAmount: 12500,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 12500
    },
    {
      id: 'item12',
      slNo: 2,
      feeHeadId: 'transport',
      feeHeadName: 'Transport Fee',
      feeHeadCode: 'TRN',
      hsnSacCode: '996411',
      description: 'Q1 Transport Fee (Staff Ward - 50% Concession)',
      term: 'Q1',
      quantity: 1,
      rate: 6000,
      grossAmount: 6000,
      discountPercent: 50,
      discountAmount: 3000,
      taxableAmount: 3000,
      gstRate: 5,
      cgstRate: 2.5,
      cgstAmount: 75,
      sgstRate: 2.5,
      sgstAmount: 75,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 150,
      netAmount: 3150
    }],

    totalQuantity: 2,
    grossTotal: 31000,
    totalDiscount: 15500,
    taxableTotal: 15500,
    cgstTotal: 75,
    sgstTotal: 75,
    igstTotal: 0,
    totalGST: 150,
    roundOff: 0,
    grandTotal: 15650,
    amountInWords: 'Fifteen Thousand Six Hundred Fifty Rupees Only',
    status: 'paid',
    paidAmount: 15650,
    balanceAmount: 0,
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Admin User',
    generatedAt: '2024-03-05 09:45:00',
    linkedReceipts: ['RCP-2024-0003'],
    notes: 'Staff ward - 50% concession applied on all fee heads',
    auditTrail: [
    {
      id: 'a14',
      action: 'Invoice Created',
      performedBy: 'Admin User',
      performedAt: '2024-03-05 09:45:00',
      details: 'Invoice generated with Staff Ward 50% concession'
    },
    {
      id: 'a15',
      action: 'Payment Received',
      performedBy: 'Cashier',
      performedAt: '2024-03-08 10:15:00',
      details: 'Full payment received via UPI'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '6',
    invoiceNo: 'INV-2024-0006',
    invoiceType: 'regular',
    invoiceDate: '2024-01-10',
    dueDate: '2024-02-10',
    paymentDueDate: '2024-02-10',
    academicYear: '2024-25',
    term: 'Term 2',
    student: mockStudents[0],
    billedTo: {
      name: mockStudents[0].parentName,
      address: mockStudents[0].address,
      city: mockStudents[0].city,
      state: mockStudents[0].state,
      pincode: mockStudents[0].pincode,
      phone: mockStudents[0].parentPhone,
      email: mockStudents[0].parentEmail
    },
    items: [
    {
      id: 'item13',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 2 Tuition Fee',
      term: 'Term 2',
      quantity: 1,
      rate: 25000,
      grossAmount: 25000,
      discountPercent: 0,
      discountAmount: 0,
      taxableAmount: 25000,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 25000
    }],

    totalQuantity: 1,
    grossTotal: 25000,
    totalDiscount: 0,
    taxableTotal: 25000,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    totalGST: 0,
    roundOff: 0,
    grandTotal: 25000,
    amountInWords: 'Twenty Five Thousand Rupees Only',
    status: 'cancelled',
    paidAmount: 0,
    balanceAmount: 0,
    gstApplicable: false,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Admin User',
    generatedAt: '2024-01-10 15:00:00',
    cancelledBy: 'Admin User',
    cancelledAt: '2024-01-12 11:30:00',
    cancellationReason:
    'Incorrect fee structure applied - Term 2 invoice generated prematurely',
    auditTrail: [
    {
      id: 'a16',
      action: 'Invoice Created',
      performedBy: 'Admin User',
      performedAt: '2024-01-10 15:00:00',
      details: 'Invoice generated for Term 2'
    },
    {
      id: 'a17',
      action: 'Invoice Cancelled',
      performedBy: 'Admin User',
      performedAt: '2024-01-12 11:30:00',
      details: 'Cancelled - Incorrect fee structure applied',
      oldValue: 'pending',
      newValue: 'cancelled'
    }]

  } as Invoice,
  {
    ...baseInvoice,
    id: '7',
    invoiceNo: 'INV-2024-0007',
    invoiceType: 'proforma',
    invoiceDate: '2024-04-01',
    dueDate: '2024-04-30',
    paymentDueDate: '2024-04-30',
    academicYear: '2024-25',
    term: 'Term 2',
    student: mockStudents[0],
    billedTo: {
      name: mockStudents[0].parentName,
      address: mockStudents[0].address,
      city: mockStudents[0].city,
      state: mockStudents[0].state,
      pincode: mockStudents[0].pincode,
      phone: mockStudents[0].parentPhone,
      email: mockStudents[0].parentEmail
    },
    items: [
    {
      id: 'item14',
      slNo: 1,
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      feeHeadCode: 'TUI',
      hsnSacCode: '999293',
      description: 'Term 2 Tuition Fee (Estimated)',
      term: 'Term 2',
      quantity: 1,
      rate: 26000,
      grossAmount: 26000,
      discountPercent: 10,
      discountAmount: 2600,
      taxableAmount: 23400,
      gstRate: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 0,
      netAmount: 23400
    },
    {
      id: 'item15',
      slNo: 2,
      feeHeadId: 'lab',
      feeHeadName: 'Lab Fee',
      feeHeadCode: 'LAB',
      hsnSacCode: '999293',
      description: 'Term 2 Lab Fee (Estimated)',
      term: 'Term 2',
      quantity: 1,
      rate: 4500,
      grossAmount: 4500,
      discountPercent: 10,
      discountAmount: 450,
      taxableAmount: 4050,
      gstRate: 18,
      cgstRate: 9,
      cgstAmount: 365,
      sgstRate: 9,
      sgstAmount: 365,
      igstRate: 0,
      igstAmount: 0,
      totalGST: 729,
      netAmount: 4779
    }],

    totalQuantity: 2,
    grossTotal: 30500,
    totalDiscount: 3050,
    taxableTotal: 27450,
    cgstTotal: 365,
    sgstTotal: 365,
    igstTotal: 0,
    totalGST: 729,
    roundOff: -1,
    grandTotal: 28178,
    amountInWords:
    'Twenty Eight Thousand One Hundred Seventy Eight Rupees Only',
    status: 'draft',
    paidAmount: 0,
    balanceAmount: 28178,
    gstApplicable: true,
    reverseCharge: false,
    placeOfSupply: 'Maharashtra',
    generatedBy: 'Accounts Officer',
    generatedAt: '2024-04-01 10:00:00',
    notes:
    'Proforma invoice for Term 2 - Subject to change based on final fee structure',
    auditTrail: [
    {
      id: 'a18',
      action: 'Proforma Created',
      performedBy: 'Accounts Officer',
      performedAt: '2024-04-01 10:00:00',
      details: 'Proforma invoice generated for Term 2 estimation'
    }]

  } as Invoice];

};
const defaultGSTConfig: GSTConfig = {
  enabled: true,
  gstNumber: '27AABCU9603R1ZM',
  companyName: 'ABC International School',
  companyAddress: '123 Education Lane, Bandra West',
  companyCity: 'Mumbai',
  companyState: 'Maharashtra',
  companyPincode: '400050',
  companyPhone: '+91 22 2600 0000',
  companyEmail: 'accounts@abcschool.edu.in',
  companyWebsite: 'www.abcschool.edu.in',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  useIGST: false,
  defaultHsnCode: '999293',
  defaultSacCode: '999293',
  placeOfSupply: 'Maharashtra',
  stateCode: '27',
  panNumber: 'AABCU9603R',
  tanNumber: 'MUMA12345B',
  reverseCharge: false,
  composition: false
};
const defaultInvoiceNumberConfig: InvoiceNumberConfig = {
  prefix: 'INV',
  suffix: '',
  startNumber: 1,
  currentNumber: 8,
  padLength: 4,
  includeYear: true,
  includeMonth: false,
  includeAcademicYear: false,
  separator: '-',
  resetFrequency: 'yearly',
  yearFormat: '2024',
  preview: 'INV-2024-0008',
  lastResetDate: '2024-01-01',
  lastInvoiceNo: 'INV-2024-0007'
};
const defaultEmailTemplates: EmailTemplate[] = [
{
  id: '1',
  name: 'Invoice Generated',
  subject: 'Fee Invoice {{invoiceNo}} - {{studentName}}',
  body: `Dear {{parentName}},

Please find attached the fee invoice for your ward {{studentName}}.

Invoice Details:
- Invoice No: {{invoiceNo}}
- Invoice Date: {{invoiceDate}}
- Due Date: {{dueDate}}
- Total Amount: ₹{{grandTotal}}

Please ensure timely payment to avoid any late fees.

Payment Methods:
- Online: {{paymentLink}}
- Bank Transfer: Account details attached
- Cash/Cheque: At school accounts office

For any queries, please contact us at {{schoolPhone}} or {{schoolEmail}}.

Regards,
Accounts Department
{{schoolName}}`,
  isDefault: true,
  type: 'invoice',
  variables: [
  'invoiceNo',
  'studentName',
  'parentName',
  'invoiceDate',
  'dueDate',
  'grandTotal',
  'paymentLink',
  'schoolPhone',
  'schoolEmail',
  'schoolName']

},
{
  id: '2',
  name: 'Payment Reminder',
  subject: 'Payment Reminder - Invoice {{invoiceNo}} Due on {{dueDate}}',
  body: `Dear {{parentName}},

This is a friendly reminder that the fee invoice for {{studentName}} is due for payment.

Invoice Details:
- Invoice No: {{invoiceNo}}
- Due Date: {{dueDate}}
- Balance Amount: ₹{{balanceAmount}}

Please make the payment at the earliest to avoid late fees.

Payment Link: {{paymentLink}}

Regards,
Accounts Department
{{schoolName}}`,
  isDefault: true,
  type: 'reminder',
  variables: [
  'invoiceNo',
  'studentName',
  'parentName',
  'dueDate',
  'balanceAmount',
  'paymentLink',
  'schoolName']

},
{
  id: '3',
  name: 'Overdue Notice',
  subject: 'URGENT: Overdue Payment Notice - Invoice {{invoiceNo}}',
  body: `Dear {{parentName}},

This is to inform you that the fee invoice for {{studentName}} is overdue.

Invoice Details:
- Invoice No: {{invoiceNo}}
- Original Due Date: {{dueDate}}
- Days Overdue: {{daysOverdue}}
- Balance Amount: ₹{{balanceAmount}}
- Late Fee Applied: ₹{{lateFeeAmount}}
- Total Due: ₹{{totalDue}}

Please clear the outstanding dues immediately to avoid further action.

Regards,
Accounts Department
{{schoolName}}`,
  isDefault: true,
  type: 'overdue',
  variables: [
  'invoiceNo',
  'studentName',
  'parentName',
  'dueDate',
  'daysOverdue',
  'balanceAmount',
  'lateFeeAmount',
  'totalDue',
  'schoolName']

}];

// ============================================
// OPTIONS
// ============================================
const academicYearOptions = [
{
  value: '',
  label: 'All Years'
},
{
  value: '2024-25',
  label: '2024-25 (Current)'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
}];

const classOptions = [
{
  value: '',
  label: 'All Classes'
},
{
  value: 'Nursery',
  label: 'Nursery'
},
{
  value: 'LKG',
  label: 'LKG'
},
{
  value: 'UKG',
  label: 'UKG'
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
},
{
  value: 'E',
  label: 'Section E'
}];

const statusOptions = [
{
  value: '',
  label: 'All Status'
},
{
  value: 'draft',
  label: 'Draft'
},
{
  value: 'pending',
  label: 'Pending'
},
{
  value: 'paid',
  label: 'Paid'
},
{
  value: 'partial',
  label: 'Partial'
},
{
  value: 'overdue',
  label: 'Overdue'
},
{
  value: 'cancelled',
  label: 'Cancelled'
},
{
  value: 'refunded',
  label: 'Refunded'
}];

const invoiceTypeOptions = [
{
  value: '',
  label: 'All Types'
},
{
  value: 'regular',
  label: 'Regular Invoice'
},
{
  value: 'proforma',
  label: 'Proforma Invoice'
},
{
  value: 'credit_note',
  label: 'Credit Note'
},
{
  value: 'debit_note',
  label: 'Debit Note'
}];

const termOptions = [
{
  value: '',
  label: 'All Terms'
},
{
  value: 'Term 1',
  label: 'Term 1'
},
{
  value: 'Term 2',
  label: 'Term 2'
},
{
  value: 'Term 3',
  label: 'Term 3'
},
{
  value: 'Annual',
  label: 'Annual'
},
{
  value: 'Q1',
  label: 'Q1'
},
{
  value: 'Q2',
  label: 'Q2'
},
{
  value: 'Q3',
  label: 'Q3'
},
{
  value: 'Q4',
  label: 'Q4'
},
{
  value: 'Monthly',
  label: 'Monthly'
}];

const feeHeadOptions = [
{
  value: '',
  label: 'All Fee Heads'
},
...mockFeeHeads.map((fh) => ({
  value: fh.id,
  label: fh.name
}))];

const resetFrequencyOptions = [
{
  value: 'yearly',
  label: 'Reset Every Year (January)'
},
{
  value: 'monthly',
  label: 'Reset Every Month'
},
{
  value: 'academic_year',
  label: 'Reset Every Academic Year (April)'
},
{
  value: 'never',
  label: 'Never Reset (Continuous)'
}];

const yearFormatOptions = [
{
  value: '2024',
  label: 'Full Year (2024)'
},
{
  value: '24',
  label: 'Short Year (24)'
},
{
  value: '2024-25',
  label: 'Academic Year (2024-25)'
},
{
  value: '24-25',
  label: 'Short Academic Year (24-25)'
}];

const dateRangeOptions = [
{
  value: 'today',
  label: 'Today'
},
{
  value: 'yesterday',
  label: 'Yesterday'
},
{
  value: 'this_week',
  label: 'This Week'
},
{
  value: 'last_week',
  label: 'Last Week'
},
{
  value: 'this_month',
  label: 'This Month'
},
{
  value: 'last_month',
  label: 'Last Month'
},
{
  value: 'this_quarter',
  label: 'This Quarter'
},
{
  value: 'last_quarter',
  label: 'Last Quarter'
},
{
  value: 'this_year',
  label: 'This Year'
},
{
  value: 'last_year',
  label: 'Last Year'
},
{
  value: 'custom',
  label: 'Custom Range'
}];

const sortByOptions = [
{
  value: 'date_desc',
  label: 'Date (Newest First)'
},
{
  value: 'date_asc',
  label: 'Date (Oldest First)'
},
{
  value: 'amount_desc',
  label: 'Amount (High to Low)'
},
{
  value: 'amount_asc',
  label: 'Amount (Low to High)'
},
{
  value: 'invoice_no',
  label: 'Invoice Number'
},
{
  value: 'student_name',
  label: 'Student Name'
},
{
  value: 'due_date',
  label: 'Due Date'
},
{
  value: 'status',
  label: 'Status'
}];

const itemsPerPageOptions = [
{
  value: '10',
  label: '10 per page'
},
{
  value: '25',
  label: '25 per page'
},
{
  value: '50',
  label: '50 per page'
},
{
  value: '100',
  label: '100 per page'
}];

const stateOptions = [
{
  value: 'Andhra Pradesh',
  label: 'Andhra Pradesh'
},
{
  value: 'Arunachal Pradesh',
  label: 'Arunachal Pradesh'
},
{
  value: 'Assam',
  label: 'Assam'
},
{
  value: 'Bihar',
  label: 'Bihar'
},
{
  value: 'Chhattisgarh',
  label: 'Chhattisgarh'
},
{
  value: 'Delhi',
  label: 'Delhi'
},
{
  value: 'Goa',
  label: 'Goa'
},
{
  value: 'Gujarat',
  label: 'Gujarat'
},
{
  value: 'Haryana',
  label: 'Haryana'
},
{
  value: 'Himachal Pradesh',
  label: 'Himachal Pradesh'
},
{
  value: 'Jharkhand',
  label: 'Jharkhand'
},
{
  value: 'Karnataka',
  label: 'Karnataka'
},
{
  value: 'Kerala',
  label: 'Kerala'
},
{
  value: 'Madhya Pradesh',
  label: 'Madhya Pradesh'
},
{
  value: 'Maharashtra',
  label: 'Maharashtra'
},
{
  value: 'Manipur',
  label: 'Manipur'
},
{
  value: 'Meghalaya',
  label: 'Meghalaya'
},
{
  value: 'Mizoram',
  label: 'Mizoram'
},
{
  value: 'Nagaland',
  label: 'Nagaland'
},
{
  value: 'Odisha',
  label: 'Odisha'
},
{
  value: 'Punjab',
  label: 'Punjab'
},
{
  value: 'Rajasthan',
  label: 'Rajasthan'
},
{
  value: 'Sikkim',
  label: 'Sikkim'
},
{
  value: 'Tamil Nadu',
  label: 'Tamil Nadu'
},
{
  value: 'Telangana',
  label: 'Telangana'
},
{
  value: 'Tripura',
  label: 'Tripura'
},
{
  value: 'Uttar Pradesh',
  label: 'Uttar Pradesh'
},
{
  value: 'Uttarakhand',
  label: 'Uttarakhand'
},
{
  value: 'West Bengal',
  label: 'West Bengal'
}];

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
const numberToWords = (num: number): string => {
  const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'];

  const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety'];

  if (num === 0) return 'Zero Rupees Only';
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' + (
      n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : ''));

  };
  const convert = (n: number): string => {
    if (n < 1000) return convertLessThanThousand(n);
    if (n < 100000)
    return (
      convertLessThanThousand(Math.floor(n / 1000)) +
      ' Thousand' + (
      n % 1000 !== 0 ? ' ' + convertLessThanThousand(n % 1000) : ''));

    if (n < 10000000)
    return (
      convertLessThanThousand(Math.floor(n / 100000)) +
      ' Lakh' + (
      n % 100000 !== 0 ? ' ' + convert(n % 100000) : ''));

    return (
      convertLessThanThousand(Math.floor(n / 10000000)) +
      ' Crore' + (
      n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : ''));

  };
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = convert(rupees) + ' Rupees';
  if (paise > 0) {
    result += ' and ' + convert(paise) + ' Paise';
  }
  result += ' Only';
  return result;
};
const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
const getStatusColor = (
status: string)
: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'purple' => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'partial':
      return 'warning';
    case 'pending':
      return 'info';
    case 'overdue':
      return 'danger';
    case 'cancelled':
      return 'gray';
    case 'draft':
      return 'purple';
    case 'refunded':
      return 'gray';
    default:
      return 'gray';
  }
};
// ============================================
// UI COMPONENTS
// ============================================
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding,
  collapsible,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>

      {(title || action) &&
      <div
        className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${collapsible ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}>

          <div className="flex items-center gap-3">
            {collapsible &&
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />

          }
            <div>
              {title &&
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            }
              {subtitle &&
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            }
            </div>
          </div>
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
        </div>
      }
      {!isCollapsed && <div className={noPadding ? '' : 'p-6'}>{children}</div>}
    </div>);

};
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
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  title
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
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500'
  };
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      type={type}
      title={title}
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
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  error,
  helperText,
  disabled,
  required,
  className = '',
  min,
  max,
  step
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
      step={step}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          disabled:bg-gray-50 disabled:text-gray-500
          ${leftIcon ? 'pl-10' : ''} 
          ${rightIcon ? 'pr-10' : ''} 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`} />

      {rightIcon &&
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
    }
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    {helperText && !error &&
  <p className="text-sm text-gray-500 mt-1">{helperText}</p>
  }
  </div>;

const TextArea: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  error,
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
    <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    rows={rows}
    className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
        disabled:bg-gray-50 disabled:text-gray-500 resize-none
        ${error ? 'border-red-500' : ''}`} />

    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>;

const Select: React.FC<{
  label?: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}> = ({
  label,
  options,
  value,
  onChange,
  disabled,
  required,
  className = '',
  placeholder
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



      {placeholder &&
    <option value="" disabled>
          {placeholder}
        </option>
    }
      {options.map((opt) =>
    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
    )}
    </select>
  </div>;

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  dot?: boolean;
}> = ({ children, variant = 'gray', size = 'sm', icon, dot }) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500',
    purple: 'bg-purple-500'
  };
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${variants[variant]} ${sizes[size]}`}>

      {dot &&
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      }
      {icon}
      {children}
    </span>);

};
const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  description?: string;
}> = ({ checked, onChange, disabled, indeterminate, label, description }) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);
  return (
    <label
      className={`inline-flex items-start gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>

      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 
          focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed" />



      {(label || description) &&
      <div>
          {label &&
        <span className="text-sm font-medium text-gray-700">{label}</span>
        }
          {description &&
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        }
        </div>
      }
    </label>);

};
const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, label, description, disabled, size = 'md' }) => {
  const sizes = {
    sm: {
      track: 'h-5 w-9',
      thumb: 'h-3.5 w-3.5',
      translate: 'translate-x-4'
    },
    md: {
      track: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: 'translate-x-6'
    }
  };
  return (
    <label
      className={`inline-flex items-start gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex ${sizes[size].track} items-center rounded-full transition-colors
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'cursor-not-allowed' : ''}`}>

        <span
          className={`inline-block ${sizes[size].thumb} transform rounded-full bg-white shadow transition-transform
            ${checked ? sizes[size].translate : 'translate-x-1'}`} />

      </button>
      {(label || description) &&
      <div>
          {label &&
        <span className="text-sm font-medium text-gray-700">{label}</span>
        }
          {description &&
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        }
        </div>
      }
    </label>);

};
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  footer?: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'lg',
  showClose = true,
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
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
            {showClose &&
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            }
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
          {footer &&
          <div className="px-6 py-4 border-t border-gray-200 shrink-0 bg-gray-50">
              {footer}
            </div>
          }
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
    badge?: string;
  }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}> = ({ tabs, activeTab, onChange, variant = 'underline' }) => {
  const variants = {
    underline: {
      container: 'border-b border-gray-200',
      tab: (active: boolean) =>
      `py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`,
      count: (active: boolean) =>
      `px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`
    },
    pills: {
      container: 'flex gap-2 p-1 bg-gray-100 rounded-lg',
      tab: (active: boolean) =>
      `px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
      count: (active: boolean) =>
      `px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`
    },
    default: {
      container: 'flex gap-1',
      tab: (active: boolean) =>
      `px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`,
      count: (active: boolean) =>
      `px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`
    }
  };
  const style = variants[variant];
  return (
    <div className={style.container}>
      <nav
        className={variant === 'underline' ? 'flex gap-6 overflow-x-auto' : ''}
        aria-label="Tabs">

        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={style.tab(activeTab === tab.id)}>

            {tab.icon}
            {tab.label}
            {tab.count !== undefined &&
          <span className={style.count(activeTab === tab.id)}>
                {tab.count}
              </span>
          }
            {tab.badge &&
          <Badge variant="danger" size="xs">
                {tab.badge}
              </Badge>
          }
          </button>
        )}
      </nav>
    </div>);

};
const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>

      {children}
      {isVisible &&
      <div
        className={`absolute ${positions[position]} z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg whitespace-nowrap`}>

          {content}
          <div
          className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : 'right-full top-1/2 -translate-y-1/2 -mr-1'}`} />

        </div>
      }
    </div>);

};
const Dropdown: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}> = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen &&
      <div
        className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-2 z-50 min-w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2`}>

          {children}
        </div>
      }
    </div>);

};
const DropdownItem: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}> = ({ children, icon, onClick, variant = 'default', disabled }) =>
<button
  onClick={onClick}
  disabled={disabled}
  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors
      ${variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>

    {icon && <span className="text-gray-400">{icon}</span>}
    {children}
  </button>;

const DropdownDivider: React.FC = () =>
<div className="border-t border-gray-100 my-1" />;

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) =>
<div className="text-center py-12 px-6">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
    {action}
  </div>;

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
  onClick?: () => void;
}> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-100',
  trend,
  onClick
}) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  onClick={onClick}>

    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      {trend &&
    <div
      className={`flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>

          {trend.value >= 0 ?
      <TrendingUp className="w-3 h-3" /> :

      <TrendingDown className="w-3 h-3" />
      }
          {Math.abs(trend.value)}%
        </div>
    }
    </div>
    <div className="mt-3">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>;

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="rounded-lg border border-gray-300 text-sm py-1 px-2">

          {itemsPerPageOptions.map((opt) =>
          <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}>

          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}>

          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1 mx-2">
          {Array.from(
            {
              length: Math.min(5, totalPages)
            },
            (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}>

                  {pageNum}
                </Button>);

            }
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>

          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}>

          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>);

};
const ProgressBar: React.FC<{
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'amber' | 'red';
  showLabel?: boolean;
}> = ({ value, max = 100, size = 'md', color = 'blue', showLabel }) => {
  const percentage = Math.min(value / max * 100, 100);
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600'
  };
  return (
    <div className="w-full">
      <div
        className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>

        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{
            width: `${percentage}%`
          }} />

      </div>
      {showLabel &&
      <p className="text-xs text-gray-500 mt-1 text-right">
          {percentage.toFixed(0)}%
        </p>
      }
    </div>);

};
// ============================================
// MAIN COMPONENT
// ============================================
export function FeeInvoice() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  // Tab State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'invoices' | 'generate' | 'bulk' | 'settings'>(
    'dashboard');
  const [settingsTab, setSettingsTab] = useState<
    'invoice_number' | 'gst' | 'templates' | 'late_fee' | 'bank'>(
    'invoice_number');
  // Invoice List States
  const [invoices, setInvoices] = useState<Invoice[]>(getMockInvoices());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('2024-25');
  const [filterInvoiceType, setFilterInvoiceType] = useState('');
  const [filterFeeHead, setFilterFeeHead] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('this_month');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  // Generate Invoice States
  const [generateStep, setGenerateStep] = useState<
    'student' | 'fees' | 'preview' | 'confirm'>(
    'student');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedInstallments, setSelectedInstallments] = useState<string[]>([]);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceRemarks, setInvoiceRemarks] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [applyGST, setApplyGST] = useState(true);
  const [applyLateFee, setApplyLateFee] = useState(false);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [customDiscountType, setCustomDiscountType] = useState<
    'percent' | 'amount'>(
    'percent');
  const [invoiceType, setInvoiceType] = useState<'regular' | 'proforma'>(
    'regular'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  // Bulk Generate States
  const [bulkClass, setBulkClass] = useState('');
  const [bulkSection, setBulkSection] = useState('');
  const [bulkTerm, setBulkTerm] = useState('');
  const [bulkFeeHeads, setBulkFeeHeads] = useState<string[]>([]);
  const [bulkStudents, setBulkStudents] = useState<Student[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  // Settings States
  const [gstConfig, setGstConfig] = useState<GSTConfig>(defaultGSTConfig);
  const [invoiceNumberConfig, setInvoiceNumberConfig] =
  useState<InvoiceNumberConfig>(defaultInvoiceNumberConfig);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(
    defaultEmailTemplates
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [lateFeeConfig, setLateFeeConfig] = useState({
    enabled: true,
    type: 'percentage' as 'percentage' | 'fixed',
    rate: 2,
    fixedAmount: 500,
    gracePeriodDays: 7,
    maxLateFee: 1000,
    applyPerMonth: true
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: 'State Bank of India',
    accountName: 'ABC International School',
    accountNumber: '1234567890123',
    ifscCode: 'SBIN0001234',
    branchName: 'Bandra West Branch',
    upiId: 'abcschool@sbi',
    qrCodeUrl: ''
  });
  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [bulkActionType, setBulkActionType] = useState<
    'print' | 'email' | 'download' | 'reminder'>(
    'print');
  // Email States
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('1');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');
  // Cancel States
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  // ============================================
  // COMPUTED VALUES
  // ============================================
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery) return [];
    const query = studentSearchQuery.toLowerCase();
    return mockStudents.
    filter(
      (s) =>
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.grNo.toLowerCase().includes(query) ||
      s.suId.toLowerCase().includes(query) ||
      s.parentName.toLowerCase().includes(query)
    ).
    slice(0, 10);
  }, [studentSearchQuery]);
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
        inv.invoiceNo.toLowerCase().includes(query) ||
        inv.student.firstName.toLowerCase().includes(query) ||
        inv.student.lastName.toLowerCase().includes(query) ||
        inv.student.grNo.toLowerCase().includes(query) ||
        inv.student.parentName.toLowerCase().includes(query)
      );
    }
    // Class filter
    if (filterClass) {
      result = result.filter((inv) => inv.student.class === filterClass);
    }
    // Section filter
    if (filterSection) {
      result = result.filter((inv) => inv.student.section === filterSection);
    }
    // Status filter
    if (filterStatus) {
      result = result.filter((inv) => inv.status === filterStatus);
    }
    // Term filter
    if (filterTerm) {
      result = result.filter((inv) => inv.term === filterTerm);
    }
    // Academic year filter
    if (filterAcademicYear) {
      result = result.filter((inv) => inv.academicYear === filterAcademicYear);
    }
    // Invoice type filter
    if (filterInvoiceType) {
      result = result.filter((inv) => inv.invoiceType === filterInvoiceType);
    }
    // Fee head filter
    if (filterFeeHead) {
      result = result.filter((inv) =>
      inv.items.some((item) => item.feeHeadId === filterFeeHead)
      );
    }
    // Date range filter
    if (filterDateFrom) {
      result = result.filter(
        (inv) => new Date(inv.invoiceDate) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      result = result.filter(
        (inv) => new Date(inv.invoiceDate) <= new Date(filterDateTo)
      );
    }
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return (
            new Date(b.invoiceDate).getTime() -
            new Date(a.invoiceDate).getTime());

        case 'date_asc':
          return (
            new Date(a.invoiceDate).getTime() -
            new Date(b.invoiceDate).getTime());

        case 'amount_desc':
          return b.grandTotal - a.grandTotal;
        case 'amount_asc':
          return a.grandTotal - b.grandTotal;
        case 'invoice_no':
          return a.invoiceNo.localeCompare(b.invoiceNo);
        case 'student_name':
          return `${a.student.firstName} ${a.student.lastName}`.localeCompare(
            `${b.student.firstName} ${b.student.lastName}`
          );
        case 'due_date':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return result;
  }, [
  invoices,
  searchQuery,
  filterClass,
  filterSection,
  filterStatus,
  filterTerm,
  filterAcademicYear,
  filterInvoiceType,
  filterFeeHead,
  filterDateFrom,
  filterDateTo,
  sortBy]
  );
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredInvoices.slice(start, end);
  }, [filteredInvoices, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const invoiceStats = useMemo<InvoiceSummaryStats>(() => {
    const draft = invoices.filter((inv) => inv.status === 'draft');
    const pending = invoices.filter((inv) => inv.status === 'pending');
    const paid = invoices.filter((inv) => inv.status === 'paid');
    const partial = invoices.filter((inv) => inv.status === 'partial');
    const overdue = invoices.filter((inv) => inv.status === 'overdue');
    const cancelled = invoices.filter((inv) => inv.status === 'cancelled');
    const totalAmount = invoices.reduce(
      (sum, inv) => inv.status !== 'cancelled' ? sum + inv.grandTotal : sum,
      0
    );
    const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingAmount = invoices.reduce(
      (sum, inv) =>
      inv.status !== 'cancelled' && inv.status !== 'paid' ?
      sum + inv.balanceAmount :
      sum,
      0
    );
    const overdueAmount = overdue.reduce(
      (sum, inv) => sum + inv.balanceAmount,
      0
    );
    const gstCollected = invoices.reduce((sum, inv) => sum + inv.totalGST, 0);
    const lateFeeCollected = invoices.reduce(
      (sum, inv) => sum + inv.lateFeeAmount,
      0
    );
    const collectionRate =
    totalAmount > 0 ? paidAmount / totalAmount * 100 : 0;
    return {
      totalInvoices: invoices.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      draftCount: draft.length,
      pendingCount: pending.length,
      paidCount: paid.length,
      partialCount: partial.length,
      overdueCount: overdue.length,
      cancelledCount: cancelled.length,
      thisMonthTotal: totalAmount * 0.3,
      lastMonthTotal: totalAmount * 0.25,
      monthlyGrowth: 20,
      avgInvoiceAmount:
      totalAmount / invoices.filter((i) => i.status !== 'cancelled').length,
      avgPaymentTime: 12,
      collectionRate,
      gstCollected,
      lateFeeCollected
    };
  }, [invoices]);
  const selectedInstallmentsData = useMemo(() => {
    return mockInstallments.filter((inst) =>
    selectedInstallments.includes(inst.id)
    );
  }, [selectedInstallments]);
  const invoicePreview = useMemo(() => {
    if (!selectedStudent || selectedInstallments.length === 0) return null;
    let subtotal = selectedInstallmentsData.reduce(
      (sum, inst) => sum + inst.netAmount,
      0
    );
    let totalDiscount = 0;
    // Apply custom discount
    if (customDiscount > 0) {
      if (customDiscountType === 'percent') {
        totalDiscount = subtotal * customDiscount / 100;
      } else {
        totalDiscount = customDiscount;
      }
      subtotal -= totalDiscount;
    }
    // Calculate GST
    let cgstTotal = 0,
      sgstTotal = 0,
      igstTotal = 0;
    if (applyGST && gstConfig.enabled) {
      selectedInstallmentsData.forEach((inst) => {
        if (inst.gstRate > 0) {
          const taxableAmount =
          inst.netAmount - (
          customDiscountType === 'percent' ?
          inst.netAmount * customDiscount / 100 :
          customDiscount / selectedInstallmentsData.length);
          if (gstConfig.useIGST) {
            igstTotal += taxableAmount * gstConfig.igstRate / 100;
          } else {
            cgstTotal += taxableAmount * gstConfig.cgstRate / 100;
            sgstTotal += taxableAmount * gstConfig.sgstRate / 100;
          }
        }
      });
    }
    const totalGST = cgstTotal + sgstTotal + igstTotal;
    const grandTotal = subtotal + totalGST;
    const roundOff = Math.round(grandTotal) - grandTotal;
    return {
      subtotal,
      totalDiscount,
      cgstTotal,
      sgstTotal,
      igstTotal,
      totalGST,
      grandTotal: Math.round(grandTotal),
      roundOff,
      amountInWords: numberToWords(Math.round(grandTotal))
    };
  }, [
  selectedStudent,
  selectedInstallmentsData,
  applyGST,
  gstConfig,
  customDiscount,
  customDiscountType]
  );
  // Update invoice number preview when config changes
  useEffect(() => {
    const config = invoiceNumberConfig;
    let number = '';
    if (config.prefix) number += config.prefix + config.separator;
    if (config.includeYear) {
      switch (config.yearFormat) {
        case '2024':
          number += new Date().getFullYear() + config.separator;
          break;
        case '24':
          number +=
          String(new Date().getFullYear()).slice(-2) + config.separator;
          break;
        case '2024-25':
          const year = new Date().getFullYear();
          number += `${year}-${String(year + 1).slice(-2)}` + config.separator;
          break;
        case '24-25':
          const yr = new Date().getFullYear();
          number +=
          `${String(yr).slice(-2)}-${String(yr + 1).slice(-2)}` +
          config.separator;
          break;
      }
    }
    if (config.includeMonth) {
      number +=
      String(new Date().getMonth() + 1).padStart(2, '0') + config.separator;
    }
    number += String(config.currentNumber).padStart(config.padLength, '0');
    if (config.suffix) number += config.separator + config.suffix;
    setInvoiceNumberConfig((prev) => ({
      ...prev,
      preview: number
    }));
  }, [
  invoiceNumberConfig.prefix,
  invoiceNumberConfig.suffix,
  invoiceNumberConfig.currentNumber,
  invoiceNumberConfig.padLength,
  invoiceNumberConfig.includeYear,
  invoiceNumberConfig.includeMonth,
  invoiceNumberConfig.separator,
  invoiceNumberConfig.yearFormat]
  );
  // ============================================
  // HANDLERS
  // ============================================
  // Selection handlers
  const handleSelectAllInvoices = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(paginatedInvoices.map((inv) => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };
  const handleSelectInvoice = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices((prev) => [...prev, id]);
    } else {
      setSelectedInvoices((prev) => prev.filter((invId) => invId !== id));
    }
  };
  // View handlers
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };
  const handlePrintInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintPreview(true);
  };
  const handleEmailInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const template =
    emailTemplates.find((t) => t.type === 'invoice' && t.isDefault) ||
    emailTemplates[0];
    setSelectedEmailTemplate(template.id);
    // Replace variables
    let subject = template.subject;
    let body = template.body;
    const variables: Record<string, string> = {
      invoiceNo: invoice.invoiceNo,
      studentName: `${invoice.student.firstName} ${invoice.student.lastName}`,
      parentName: invoice.student.parentName,
      invoiceDate: formatDate(invoice.invoiceDate),
      dueDate: formatDate(invoice.dueDate),
      grandTotal: formatNumber(invoice.grandTotal),
      balanceAmount: formatNumber(invoice.balanceAmount),
      paymentLink: 'https://pay.abcschool.edu.in/' + invoice.invoiceNo,
      schoolPhone: gstConfig.companyPhone,
      schoolEmail: gstConfig.companyEmail,
      schoolName: gstConfig.companyName
    };
    Object.entries(variables).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    setEmailSubject(subject);
    setEmailBody(body);
    setShowEmailModal(true);
  };
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSendingEmail(false);
    setShowEmailModal(false);
    if (selectedInvoice) {
      setInvoices((prev) =>
      prev.map((inv) =>
      inv.id === selectedInvoice.id ?
      {
        ...inv,
        emailSentAt: new Date().toISOString(),
        emailSentTo: selectedInvoice.billedTo.email,
        auditTrail: [
        ...inv.auditTrail,
        {
          id: `a${Date.now()}`,
          action: 'Email Sent',
          performedBy: 'Current User',
          performedAt: new Date().toISOString(),
          details: `Invoice emailed to ${selectedInvoice.billedTo.email}`
        }]

      } :
      inv
      )
      );
    }
    alert('Email sent successfully!');
  };
  const handleCancelInvoice = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }
    setIsCancelling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsCancelling(false);
    if (selectedInvoice) {
      setInvoices((prev) =>
      prev.map((inv) =>
      inv.id === selectedInvoice.id ?
      {
        ...inv,
        status: 'cancelled' as const,
        cancelledBy: 'Current User',
        cancelledAt: new Date().toISOString(),
        cancellationReason: cancelReason,
        balanceAmount: 0,
        auditTrail: [
        ...inv.auditTrail,
        {
          id: `a${Date.now()}`,
          action: 'Invoice Cancelled',
          performedBy: 'Current User',
          performedAt: new Date().toISOString(),
          details: `Reason: ${cancelReason}`,
          oldValue: inv.status,
          newValue: 'cancelled'
        }]

      } :
      inv
      )
      );
    }
    setShowCancelModal(false);
    setCancelReason('');
    setSelectedInvoice(null);
    alert('Invoice cancelled successfully!');
  };
  const handleSendReminder = async () => {
    if (!selectedInvoice) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInvoices((prev) =>
    prev.map((inv) =>
    inv.id === selectedInvoice.id ?
    {
      ...inv,
      remindersSent: inv.remindersSent + 1,
      lastReminderAt: new Date().toISOString(),
      auditTrail: [
      ...inv.auditTrail,
      {
        id: `a${Date.now()}`,
        action: 'Reminder Sent',
        performedBy: 'Current User',
        performedAt: new Date().toISOString(),
        details: `Payment reminder #${inv.remindersSent + 1} sent`
      }]

    } :
    inv
    )
    );
    setShowReminderModal(false);
    alert('Reminder sent successfully!');
  };
  const handleBulkAction = (
  type: 'print' | 'email' | 'download' | 'reminder') =>
  {
    setBulkActionType(type);
    setShowBulkActionModal(true);
  };
  const handleExecuteBulkAction = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowBulkActionModal(false);
    setSelectedInvoices([]);
    alert(
      `${bulkActionType === 'print' ? 'Printed' : bulkActionType === 'email' ? 'Emailed' : bulkActionType === 'download' ? 'Downloaded' : 'Reminders sent for'} ${selectedInvoices.length} invoices successfully!`
    );
  };
  // Student selection handlers
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentSearchQuery('');
    setSelectedInstallments([]);
    setGenerateStep('fees');
  };
  const handleToggleInstallment = (id: string) => {
    setSelectedInstallments((prev) =>
    prev.includes(id) ?
    prev.filter((instId) => instId !== id) :
    [...prev, id]
    );
  };
  const handleSelectAllInstallments = (checked: boolean) => {
    if (checked) {
      setSelectedInstallments(mockInstallments.map((inst) => inst.id));
    } else {
      setSelectedInstallments([]);
    }
  };
  // Generate invoice handler
  const handleGenerateInvoice = async () => {
    if (
    !selectedStudent ||
    selectedInstallments.length === 0 ||
    !invoicePreview)
    {
      alert('Please select a student and at least one fee');
      return;
    }
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const items: InvoiceItem[] = selectedInstallmentsData.map(
      (inst, index) => ({
        id: `item${Date.now()}_${index}`,
        slNo: index + 1,
        feeHeadId: inst.feeHeadId,
        feeHeadName: inst.feeHeadName,
        feeHeadCode: inst.feeHeadCode,
        hsnSacCode:
        mockFeeHeads.find((fh) => fh.id === inst.feeHeadId)?.hsnCode ||
        '999293',
        description: inst.name,
        term: inst.term,
        quantity: 1,
        rate: inst.originalAmount,
        grossAmount: inst.originalAmount,
        discountPercent: customDiscountType === 'percent' ? customDiscount : 0,
        discountAmount:
        customDiscountType === 'percent' ?
        inst.originalAmount * customDiscount / 100 :
        customDiscount / selectedInstallmentsData.length,
        taxableAmount: inst.netAmount,
        gstRate: inst.gstRate,
        cgstRate: gstConfig.useIGST ? 0 : gstConfig.cgstRate,
        cgstAmount: gstConfig.useIGST ? 0 : inst.cgstAmount,
        sgstRate: gstConfig.useIGST ? 0 : gstConfig.sgstRate,
        sgstAmount: gstConfig.useIGST ? 0 : inst.sgstAmount,
        igstRate: gstConfig.useIGST ? gstConfig.igstRate : 0,
        igstAmount: gstConfig.useIGST ? inst.igstAmount : 0,
        totalGST: inst.totalGSTAmount,
        netAmount: inst.finalAmount
      })
    );
    const newInvoice: Invoice = {
      id: String(Date.now()),
      invoiceNo: invoiceNumberConfig.preview,
      invoiceType,
      invoiceDate,
      dueDate:
      invoiceDueDate || selectedInstallmentsData[0]?.dueDate || invoiceDate,
      paymentDueDate:
      invoiceDueDate || selectedInstallmentsData[0]?.dueDate || invoiceDate,
      academicYear: filterAcademicYear,
      term: selectedInstallmentsData[0]?.term || 'Term 1',
      student: selectedStudent,
      billedTo: {
        name: selectedStudent.parentName,
        address: selectedStudent.address,
        city: selectedStudent.city,
        state: selectedStudent.state,
        pincode: selectedStudent.pincode,
        phone: selectedStudent.parentPhone,
        email: selectedStudent.parentEmail
      },
      items,
      totalQuantity: items.length,
      grossTotal: items.reduce((sum, item) => sum + item.grossAmount, 0),
      totalDiscount: invoicePreview.totalDiscount,
      taxableTotal: invoicePreview.subtotal,
      cgstTotal: invoicePreview.cgstTotal,
      sgstTotal: invoicePreview.sgstTotal,
      igstTotal: invoicePreview.igstTotal,
      totalGST: invoicePreview.totalGST,
      roundOff: invoicePreview.roundOff,
      grandTotal: invoicePreview.grandTotal,
      amountInWords: invoicePreview.amountInWords,
      status: invoiceType === 'proforma' ? 'draft' : 'pending',
      paidAmount: 0,
      balanceAmount: invoicePreview.grandTotal,
      lateFeeApplicable: applyLateFee,
      lateFeeAmount: 0,
      lateFeeRate: lateFeeConfig.rate,
      daysOverdue: 0,
      linkedReceipts: [],
      linkedCreditNotes: [],
      gstApplicable: applyGST && gstConfig.enabled,
      reverseCharge: gstConfig.reverseCharge,
      placeOfSupply: gstConfig.placeOfSupply,
      generatedBy: 'Current User',
      generatedAt: new Date().toISOString(),
      remindersSent: 0,
      printCount: 0,
      termsAndConditions:
      '1. Fees once paid are non-refundable.\n2. Late payment will attract additional charges.\n3. Cheque bounce will attract ₹500 penalty.',
      notes: invoiceNotes,
      internalNotes: invoiceRemarks,
      attachments: [],
      auditTrail: [
      {
        id: `a${Date.now()}`,
        action:
        invoiceType === 'proforma' ? 'Proforma Created' : 'Invoice Created',
        performedBy: 'Current User',
        performedAt: new Date().toISOString(),
        details: `${invoiceType === 'proforma' ? 'Proforma invoice' : 'Invoice'} generated for ${selectedInstallmentsData.length} fee items`
      }]

    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setInvoiceNumberConfig((prev) => ({
      ...prev,
      currentNumber: prev.currentNumber + 1,
      lastInvoiceNo: newInvoice.invoiceNo
    }));
    setIsGenerating(false);
    setSelectedStudent(null);
    setSelectedInstallments([]);
    setInvoiceRemarks('');
    setInvoiceNotes('');
    setApplyGST(true);
    setApplyLateFee(false);
    setCustomDiscount(0);
    setInvoiceType('regular');
    setGenerateStep('student');
    setActiveTab('invoices');
    alert(`Invoice ${newInvoice.invoiceNo} generated successfully!`);
  };
  // Settings handlers
  const handleSaveGSTSettings = async () => {
    setIsSavingSettings(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingSettings(false);
    alert('GST settings saved successfully!');
  };
  const handleSaveInvoiceNumberSettings = async () => {
    setIsSavingSettings(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingSettings(false);
    alert('Invoice number settings saved successfully!');
  };
  const handleSaveLateFeeSettings = async () => {
    setIsSavingSettings(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingSettings(false);
    alert('Late fee settings saved successfully!');
  };
  const handleSaveBankSettings = async () => {
    setIsSavingSettings(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingSettings(false);
    alert('Bank details saved successfully!');
  };
  // Filter handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterClass('');
    setFilterSection('');
    setFilterStatus('');
    setFilterTerm('');
    setFilterInvoiceType('');
    setFilterFeeHead('');
    setFilterDateRange('this_month');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };
  // Reset generate form
  const handleResetGenerate = () => {
    setSelectedStudent(null);
    setStudentSearchQuery('');
    setSelectedInstallments([]);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setInvoiceDueDate('');
    setInvoiceRemarks('');
    setInvoiceNotes('');
    setApplyGST(true);
    setApplyLateFee(false);
    setCustomDiscount(0);
    setInvoiceType('regular');
    setGenerateStep('student');
  };
  // ============================================
  // RENDER HELPERS
  // ============================================
  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      {
        variant: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'purple';
        icon: React.ReactNode;
        label: string;
      }> =
    {
      draft: {
        variant: 'purple',
        icon: <FileText className="w-3 h-3" />,
        label: 'Draft'
      },
      pending: {
        variant: 'info',
        icon: <Clock className="w-3 h-3" />,
        label: 'Pending'
      },
      paid: {
        variant: 'success',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Paid'
      },
      partial: {
        variant: 'warning',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Partial'
      },
      overdue: {
        variant: 'danger',
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Overdue'
      },
      cancelled: {
        variant: 'gray',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Cancelled'
      },
      refunded: {
        variant: 'gray',
        icon: <Undo2 className="w-3 h-3" />,
        label: 'Refunded'
      }
    };
    const c = config[status] || {
      variant: 'gray',
      icon: null,
      label: status
    };
    return (
      <Badge variant={c.variant} icon={c.icon}>
        {c.label}
      </Badge>);

  };
  const getInvoiceTypeBadge = (type: string) => {
    const config: Record<
      string,
      {
        variant: 'info' | 'purple' | 'danger' | 'warning';
        label: string;
      }> =
    {
      regular: {
        variant: 'info',
        label: 'Invoice'
      },
      proforma: {
        variant: 'purple',
        label: 'Proforma'
      },
      credit_note: {
        variant: 'danger',
        label: 'Credit Note'
      },
      debit_note: {
        variant: 'warning',
        label: 'Debit Note'
      }
    };
    const c = config[type] || {
      variant: 'info',
      label: type
    };
    return (
      <Badge variant={c.variant} size="xs">
        {c.label}
      </Badge>);

  };
  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fee Invoices
                </h1>
                <p className="text-sm text-gray-500">
                  Generate, manage, and track fee invoices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedInvoices.length > 0 &&
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">
                    {selectedInvoices.length} selected
                  </span>
                  <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedInvoices([])}>

                    <X className="w-4 h-4" />
                  </Button>
                </div>
              }
              {selectedInvoices.length > 0 ?
              <>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('print')}>

                    <Printer className="w-4 h-4 mr-1" />
                    Print ({selectedInvoices.length})
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('email')}>

                    <Mail className="w-4 h-4 mr-1" />
                    Email ({selectedInvoices.length})
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('download')}>

                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleBulkAction('reminder')}>

                    <Bell className="w-4 h-4 mr-1" />
                    Send Reminders
                  </Button>
                </> :

              <Button
                variant="primary"
                onClick={() => {
                  setActiveTab('generate');
                  handleResetGenerate();
                }}>

                  <FilePlus className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
              }
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <Tabs
              tabs={[
              {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <BarChart3 className="w-4 h-4" />
              },
              {
                id: 'invoices',
                label: 'All Invoices',
                icon: <FileText className="w-4 h-4" />,
                count: filteredInvoices.length
              },
              {
                id: 'generate',
                label: 'Generate Invoice',
                icon: <FilePlus className="w-4 h-4" />
              },
              {
                id: 'bulk',
                label: 'Bulk Generate',
                icon: <Layers className="w-4 h-4" />
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: <Settings className="w-4 h-4" />
              }]
              }
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as any)} />

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* ============================================ */}
        {/* DASHBOARD TAB */}
        {/* ============================================ */}
        {activeTab === 'dashboard' &&
        <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
              title="Total Invoices"
              value={invoiceStats.totalInvoices}
              subtitle={`${invoiceStats.pendingCount} pending · ${invoiceStats.overdueCount} overdue`}
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-100"
              onClick={() => setActiveTab('invoices')} />

              <StatCard
              title="Total Invoiced"
              value={formatCurrency(invoiceStats.totalAmount)}
              subtitle="Across all active invoices"
              icon={<IndianRupee className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-100"
              trend={{
                value: invoiceStats.monthlyGrowth,
                label: 'vs last month'
              }} />

              <StatCard
              title="Amount Collected"
              value={formatCurrency(invoiceStats.paidAmount)}
              subtitle={`${invoiceStats.collectionRate.toFixed(1)}% collection rate`}
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-100" />

              <StatCard
              title="Outstanding"
              value={formatCurrency(invoiceStats.pendingAmount)}
              subtitle={`${formatCurrency(invoiceStats.overdueAmount)} overdue`}
              icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
              iconBg="bg-red-100" />

            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Invoice Status Breakdown">
                <div className="space-y-4">
                  {[
                {
                  label: 'Paid',
                  count: invoiceStats.paidCount,
                  color: 'green',
                  variant: 'success' as const
                },
                {
                  label: 'Pending',
                  count: invoiceStats.pendingCount,
                  color: 'blue',
                  variant: 'info' as const
                },
                {
                  label: 'Partial',
                  count: invoiceStats.partialCount,
                  color: 'amber',
                  variant: 'warning' as const
                },
                {
                  label: 'Overdue',
                  count: invoiceStats.overdueCount,
                  color: 'red',
                  variant: 'danger' as const
                },
                {
                  label: 'Draft',
                  count: invoiceStats.draftCount,
                  color: 'blue',
                  variant: 'purple' as const
                },
                {
                  label: 'Cancelled',
                  count: invoiceStats.cancelledCount,
                  color: 'blue',
                  variant: 'gray' as const
                }].
                map((item) =>
                <div key={item.label} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-600">
                        {item.label}
                      </div>
                      <div className="flex-1">
                        <ProgressBar
                      value={item.count}
                      max={invoiceStats.totalInvoices}
                      color={item.color as any}
                      size="md" />

                      </div>
                      <Badge variant={item.variant} size="sm">
                        {item.count}
                      </Badge>
                    </div>
                )}
                </div>
              </Card>

              <Card title="Collection Summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Total Invoiced
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoiceStats.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Amount Collected
                    </span>
                    <span className="text-sm font-semibold text-green-700">
                      {formatCurrency(invoiceStats.paidAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Outstanding Balance
                    </span>
                    <span className="text-sm font-semibold text-red-700">
                      {formatCurrency(invoiceStats.pendingAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Overdue Amount
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(invoiceStats.overdueAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">GST Collected</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoiceStats.gstCollected)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">
                      Late Fee Collected
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoiceStats.lateFeeCollected)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Collection Rate
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {invoiceStats.collectionRate.toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar
                    value={invoiceStats.collectionRate}
                    max={100}
                    color="green"
                    size="lg" />

                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                onClick={() => {
                  setActiveTab('generate');
                  handleResetGenerate();
                }}
                className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all">

                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FilePlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Generate Invoice
                  </span>
                </button>
                <button
                onClick={() => {
                  setActiveTab('bulk');
                }}
                className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all">

                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Bulk Generate
                  </span>
                </button>
                <button
                onClick={() => {
                  setActiveTab('invoices');
                  setFilterStatus('overdue');
                }}
                className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all">

                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    View Overdue
                  </span>
                </button>
                <button
                onClick={() => setActiveTab('settings')}
                className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all">

                  <div className="p-3 bg-gray-100 rounded-xl">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Settings
                  </span>
                </button>
              </div>
            </Card>
          </>
        }

        {/* ============================================ */}
        {/* INVOICES TAB */}
        {/* ============================================ */}
        {activeTab === 'invoices' &&
        <>
            {/* Search & Filters */}
            <Card>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                placeholder="Search by invoice no, student, parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-72" />

                <Select
                options={statusOptions}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-36" />

                <Select
                options={academicYearOptions}
                value={filterAcademicYear}
                onChange={(e) => setFilterAcademicYear(e.target.value)}
                className="w-40" />

                <Select
                options={termOptions}
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-32" />

                <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}>

                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  {showFilters ? 'Less Filters' : 'More Filters'}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <Select
                  options={sortByOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-48" />

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>

                      <Table className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>

                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>

              {showFilters &&
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <Select
                label="Class"
                options={classOptions}
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)} />

                  <Select
                label="Section"
                options={sectionOptions}
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)} />

                  <Select
                label="Invoice Type"
                options={invoiceTypeOptions}
                value={filterInvoiceType}
                onChange={(e) => setFilterInvoiceType(e.target.value)} />

                  <Select
                label="Fee Head"
                options={feeHeadOptions}
                value={filterFeeHead}
                onChange={(e) => setFilterFeeHead(e.target.value)} />

                  <Input
                label="Date From"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)} />

                  <Input
                label="Date To"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)} />

                </div>
            }
            </Card>

            {/* Invoice Table */}
            {viewMode === 'table' ?
          <Card noPadding>
                {/* Table Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-2 items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1">
                    <Checkbox
                  checked={
                  paginatedInvoices.length > 0 &&
                  paginatedInvoices.every((inv) =>
                  selectedInvoices.includes(inv.id)
                  )
                  }
                  indeterminate={
                  selectedInvoices.length > 0 &&
                  !paginatedInvoices.every((inv) =>
                  selectedInvoices.includes(inv.id)
                  )
                  }
                  onChange={handleSelectAllInvoices} />

                  </div>
                  <div className="col-span-2">Invoice No</div>
                  <div className="col-span-2">Student</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Due Date</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1 text-right">Balance</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {paginatedInvoices.length === 0 ?
            <EmptyState
              icon={<FileText className="w-8 h-8 text-gray-400" />}
              title="No Invoices Found"
              description="No invoices match your current filters. Try adjusting the search or filters."
              action={
              <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
              } /> :


            <div className="divide-y divide-gray-100">
                    {paginatedInvoices.map((invoice) => {
                const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                return (
                  <div
                    key={invoice.id}
                    className={`px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 ${selectedInvoices.includes(invoice.id) ? 'bg-blue-50/50' : ''}`}>

                          <div className="col-span-1">
                            <Checkbox
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(checked) =>
                        handleSelectInvoice(invoice.id, checked)
                        } />

                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <div>
                                <p
                            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleViewInvoice(invoice)}>

                                  {invoice.invoiceNo}
                                </p>
                                <div className="mt-0.5">
                                  {getInvoiceTypeBadge(invoice.invoiceType)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-900">
                              {invoice.student.firstName}{' '}
                              {invoice.student.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Class {invoice.student.class}-
                              {invoice.student.section} | {invoice.student.grNo}
                            </p>
                          </div>
                          <div className="col-span-1">
                            <p className="text-sm text-gray-700">
                              {formatDate(invoice.invoiceDate)}
                            </p>
                          </div>
                          <div className="col-span-1">
                            <p className="text-sm text-gray-700">
                              {formatDate(invoice.dueDate)}
                            </p>
                            {invoice.status !== 'paid' &&
                      invoice.status !== 'cancelled' &&
                      daysUntilDue < 0 &&
                      <p className="text-xs text-red-600">
                                  {Math.abs(daysUntilDue)}d overdue
                                </p>
                      }
                            {invoice.status !== 'paid' &&
                      invoice.status !== 'cancelled' &&
                      daysUntilDue >= 0 &&
                      daysUntilDue <= 7 &&
                      <p className="text-xs text-amber-600">
                                  Due in {daysUntilDue}d
                                </p>
                      }
                          </div>
                          <div className="col-span-1 text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(invoice.grandTotal)}
                            </p>
                            {invoice.totalGST > 0 &&
                      <p className="text-xs text-gray-400">
                                +GST {formatCurrency(invoice.totalGST)}
                              </p>
                      }
                          </div>
                          <div className="col-span-1 text-right">
                            <p
                        className={`text-sm font-semibold ${invoice.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>

                              {formatCurrency(invoice.balanceAmount)}
                            </p>
                            {invoice.lateFeeApplicable &&
                      invoice.lateFeeAmount > 0 &&
                      <p className="text-xs text-red-500">
                                  +{formatCurrency(invoice.lateFeeAmount)} late
                                  fee
                                </p>
                      }
                          </div>
                          <div className="col-span-1">
                            {getStatusBadge(invoice.status)}
                            {invoice.remindersSent > 0 &&
                      <p className="text-xs text-gray-400 mt-0.5">
                                {invoice.remindersSent} reminder
                                {invoice.remindersSent > 1 ? 's' : ''}
                              </p>
                      }
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-1">
                            <Tooltip content="View Invoice">
                              <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">

                                <Eye className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Print">
                              <button
                          onClick={() => handlePrintInvoice(invoice)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                                <Printer className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Email">
                              <button
                          onClick={() => handleEmailInvoice(invoice)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">

                                <Mail className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Dropdown
                        trigger={
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                        }>

                              <DropdownItem
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleViewInvoice(invoice)}>

                                View Details
                              </DropdownItem>
                              <DropdownItem
                          icon={<Printer className="w-4 h-4" />}
                          onClick={() => handlePrintInvoice(invoice)}>

                                Print Invoice
                              </DropdownItem>
                              <DropdownItem
                          icon={<Mail className="w-4 h-4" />}
                          onClick={() => handleEmailInvoice(invoice)}>

                                Send Email
                              </DropdownItem>
                              <DropdownItem
                          icon={<Download className="w-4 h-4" />}>

                                Download PDF
                              </DropdownItem>
                              <DropdownItem icon={<Copy className="w-4 h-4" />}>
                                Duplicate
                              </DropdownItem>
                              {invoice.status !== 'cancelled' &&
                        invoice.status !== 'paid' &&
                        <DropdownItem
                          icon={<XCircle className="w-4 h-4" />}
                          variant="danger"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowCancelModal(true);
                          }}>

                                    Cancel Invoice
                                  </DropdownItem>
                        }
                            </Dropdown>
                          </div>
                        </div>);

              })}
                  </div>
            }

                {/* Pagination */}
                {filteredInvoices.length > 0 &&
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInvoices.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => {
                setItemsPerPage(n);
                setCurrentPage(1);
              }} />

            }
              </Card> /* Grid View */ :

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedInvoices.map((invoice) =>
            <div
              key={invoice.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p
                    className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleViewInvoice(invoice)}>

                          {invoice.invoiceNo}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getInvoiceTypeBadge(invoice.invoiceType)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      <Checkbox
                  checked={selectedInvoices.includes(invoice.id)}
                  onChange={(checked) =>
                  handleSelectInvoice(invoice.id, checked)
                  } />

                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.student.firstName} {invoice.student.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Class {invoice.student.class}-{invoice.student.section}{' '}
                        | {invoice.student.grNo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.student.parentName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Invoice Date</p>
                        <p className="text-sm text-gray-700">
                          {formatDate(invoice.invoiceDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Grand Total</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(invoice.grandTotal)}
                        </p>
                      </div>
                    </div>
                    {invoice.balanceAmount > 0 &&
              <div className="mt-2">
                        <ProgressBar
                  value={invoice.paidAmount}
                  max={invoice.grandTotal}
                  color="green"
                  size="sm"
                  showLabel />

                      </div>
              }
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleViewInvoice(invoice)}>

                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handlePrintInvoice(invoice)}>

                        <Printer className="w-3 h-3 mr-1" />
                        Print
                      </Button>
                      <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleEmailInvoice(invoice)}>

                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
            )}
              </div>
          }
          </>
        }

        {/* ============================================ */}
        {/* GENERATE INVOICE TAB */}
        {/* ============================================ */}
        {activeTab === 'generate' &&
        <>
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {(['student', 'fees', 'preview', 'confirm'] as const).map(
              (step, index) =>
              <Fragment key={step}>
                    <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${generateStep === step ? 'bg-blue-600 text-white' : ['fees', 'preview', 'confirm'].indexOf(generateStep) > index ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>

                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-current">
                        {['fees', 'preview', 'confirm'].indexOf(generateStep) >
                    index ?
                    '✓' :
                    index + 1}
                      </span>
                      {step === 'student' ?
                  'Select Student' :
                  step === 'fees' ?
                  'Select Fees' :
                  step === 'preview' ?
                  'Preview' :
                  'Confirm'}
                    </div>
                    {index < 3 &&
                <ArrowRight className="w-4 h-4 text-gray-400" />
                }
                  </Fragment>

            )}
              <div className="ml-auto">
                <Button variant="ghost" size="sm" onClick={handleResetGenerate}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Step 1: Select Student */}
            {generateStep === 'student' &&
          <Card
            title="Select Student"
            subtitle="Search and select the student to generate invoice for">

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                    label="Search Student"
                    placeholder="Search by name, GR No, SU ID, parent name..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    required />

                      {filteredStudents.length > 0 &&
                  <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto shadow-lg">
                          {filteredStudents.map((student) =>
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3">

                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Class {student.class}-{student.section} | GR:{' '}
                                  {student.grNo} | {student.parentName}
                                </p>
                              </div>
                              {student.outstandingBalance > 0 &&
                      <Badge
                        variant="danger"
                        size="xs"
                        className="ml-auto">

                                  Due:{' '}
                                  {formatCurrency(student.outstandingBalance)}
                                </Badge>
                      }
                            </div>
                    )}
                        </div>
                  }
                      {studentSearchQuery && filteredStudents.length === 0 &&
                  <div className="mt-2 p-4 border border-gray-200 rounded-lg text-center text-sm text-gray-500">
                          No students found matching "{studentSearchQuery}"
                        </div>
                  }
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Type
                          </label>
                          <div className="flex gap-2">
                            {(['regular', 'proforma'] as const).map((type) =>
                        <button
                          key={type}
                          onClick={() => setInvoiceType(type)}
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${invoiceType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>

                                {type === 'regular' ? 'Regular' : 'Proforma'}
                              </button>
                        )}
                          </div>
                        </div>
                        <Input
                      label="Invoice Date"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      required />

                        <Input
                      label="Due Date"
                      type="date"
                      value={invoiceDueDate}
                      onChange={(e) => setInvoiceDueDate(e.target.value)} />

                        <Select
                      label="Academic Year"
                      options={academicYearOptions.filter((o) => o.value)}
                      value={filterAcademicYear}
                      onChange={(e) =>
                      setFilterAcademicYear(e.target.value)
                      } />

                      </div>
                    </div>
                  </div>

                  {!studentSearchQuery &&
              <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Recent Students
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {mockStudents.slice(0, 6).map((student) =>
                  <div
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">

                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Class {student.class}-{student.section} |{' '}
                                {student.grNo}
                              </p>
                            </div>
                            {student.outstandingBalance > 0 &&
                    <Badge variant="danger" size="xs">
                                {formatCurrency(student.outstandingBalance)}
                              </Badge>
                    }
                          </div>
                  )}
                      </div>
                    </div>
              }
                </div>
              </Card>
          }

            {/* Step 2: Select Fees */}
            {generateStep === 'fees' && selectedStudent &&
          <>
                {/* Student Info */}
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                        {selectedStudent.firstName[0]}
                        {selectedStudent.lastName[0]}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Class {selectedStudent.class}-
                          {selectedStudent.section} | GR: {selectedStudent.grNo}{' '}
                          | {selectedStudent.parentName}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="info" size="xs">
                            {selectedStudent.feeCategory}
                          </Badge>
                          {selectedStudent.hasScholarship &&
                      <Badge variant="purple" size="xs">
                              Scholarship{' '}
                              {selectedStudent.scholarshipPercentage}%
                            </Badge>
                      }
                          {selectedStudent.hasConcession &&
                      <Badge variant="warning" size="xs">
                              Concession {selectedStudent.concessionPercentage}%
                            </Badge>
                      }
                        </div>
                      </div>
                    </div>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGenerateStep('student')}>

                      <Edit className="w-4 h-4 mr-1" />
                      Change Student
                    </Button>
                  </div>
                </Card>

                {/* Fee Selection */}
                <Card
              title="Select Fee Items"
              subtitle="Choose the fee installments to include in this invoice"
              action={
              <div className="flex items-center gap-2">
                      <Checkbox
                  checked={
                  selectedInstallments.length ===
                  mockInstallments.length
                  }
                  indeterminate={
                  selectedInstallments.length > 0 &&
                  selectedInstallments.length < mockInstallments.length
                  }
                  onChange={handleSelectAllInstallments}
                  label="Select All" />

                    </div>
              }>

                  <div className="space-y-2">
                    {mockInstallments.map((inst) =>
                <div
                  key={inst.id}
                  onClick={() => handleToggleInstallment(inst.id)}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${selectedInstallments.includes(inst.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>

                        <Checkbox
                    checked={selectedInstallments.includes(inst.id)}
                    onChange={() => handleToggleInstallment(inst.id)} />

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {inst.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {inst.feeHeadCode} | Due: {formatDate(inst.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(inst.finalAmount)}
                          </p>
                          {inst.gstRate > 0 &&
                    <p className="text-xs text-gray-400">
                              +{inst.gstRate}% GST
                            </p>
                    }
                        </div>
                        <Badge variant="info" size="xs">
                          {inst.term}
                        </Badge>
                      </div>
                )}
                  </div>
                </Card>

                {/* Invoice Options */}
                <Card title="Invoice Options">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <Toggle
                    checked={applyGST}
                    onChange={setApplyGST}
                    label="Apply GST"
                    description="Include GST calculations in invoice" />

                      <Toggle
                    checked={applyLateFee}
                    onChange={setApplyLateFee}
                    label="Apply Late Fee"
                    description="Add late fee if applicable" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Discount
                      </label>
                      <div className="flex gap-2">
                        <Input
                      type="number"
                      value={customDiscount}
                      onChange={(e) =>
                      setCustomDiscount(parseFloat(e.target.value) || 0)
                      }
                      min={0}
                      className="flex-1" />

                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                          <button
                        onClick={() => setCustomDiscountType('percent')}
                        className={`px-3 py-2 text-sm font-medium ${customDiscountType === 'percent' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>

                            %
                          </button>
                          <button
                        onClick={() => setCustomDiscountType('amount')}
                        className={`px-3 py-2 text-sm font-medium ${customDiscountType === 'amount' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>

                            ₹
                          </button>
                        </div>
                      </div>
                    </div>
                    <TextArea
                  label="Notes"
                  placeholder="Optional notes for this invoice..."
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  rows={3} />

                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button
                variant="outline"
                onClick={() => setGenerateStep('student')}>

                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                variant="primary"
                onClick={() => setGenerateStep('preview')}
                disabled={selectedInstallments.length === 0}>

                    Preview Invoice
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
          }

            {/* Step 3: Preview */}
            {generateStep === 'preview' &&
          selectedStudent &&
          invoicePreview &&
          <>
                  <Card
              title="Invoice Preview"
              subtitle="Review the invoice before generating">

                    {/* Invoice Header */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold">
                            {gstConfig.companyName}
                          </h2>
                          <p className="text-blue-200 text-sm">
                            {gstConfig.companyAddress}, {gstConfig.companyCity}
                          </p>
                          <p className="text-blue-200 text-sm">
                            GSTIN: {gstConfig.gstNumber} | PAN:{' '}
                            {gstConfig.panNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {invoiceType === 'proforma' ?
                      'PROFORMA INVOICE' :
                      'TAX INVOICE'}
                          </p>
                          <p className="text-blue-200">
                            {invoiceNumberConfig.preview}
                          </p>
                          <p className="text-blue-200 text-sm">
                            Date: {formatDate(invoiceDate)}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-2 gap-6 border-b border-gray-200">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Billed To
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedStudent.parentName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.city}, {selectedStudent.state} -{' '}
                            {selectedStudent.pincode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.parentPhone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedStudent.parentEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Student Details
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedStudent.firstName}{' '}
                            {selectedStudent.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            GR No: {selectedStudent.grNo}
                          </p>
                          <p className="text-sm text-gray-600">
                            Class: {selectedStudent.class}-
                            {selectedStudent.section}
                          </p>
                          <p className="text-sm text-gray-600">
                            Academic Year: {filterAcademicYear}
                          </p>
                          {invoiceDueDate &&
                    <p className="text-sm text-gray-600">
                              Due Date: {formatDate(invoiceDueDate)}
                            </p>
                    }
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="p-6">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                              <th className="text-left py-2 px-3">Sl</th>
                              <th className="text-left py-2 px-3">
                                Description
                              </th>
                              <th className="text-left py-2 px-3">HSN/SAC</th>
                              <th className="text-right py-2 px-3">Rate</th>
                              <th className="text-right py-2 px-3">Discount</th>
                              <th className="text-right py-2 px-3">Taxable</th>
                              {applyGST && gstConfig.enabled &&
                        <>
                                  <th className="text-right py-2 px-3">CGST</th>
                                  <th className="text-right py-2 px-3">SGST</th>
                                </>
                        }
                              <th className="text-right py-2 px-3">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedInstallmentsData.map((inst, index) =>
                      <tr key={inst.id}>
                                <td className="py-2 px-3 text-gray-600">
                                  {index + 1}
                                </td>
                                <td className="py-2 px-3">
                                  <p className="font-medium text-gray-900">
                                    {inst.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {inst.feeHeadCode} | {inst.term}
                                  </p>
                                </td>
                                <td className="py-2 px-3 text-gray-600 font-mono text-xs">
                                  {mockFeeHeads.find(
                            (fh) => fh.id === inst.feeHeadId
                          )?.hsnCode || '999293'}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {formatCurrency(inst.originalAmount)}
                                </td>
                                <td className="py-2 px-3 text-right text-green-600">
                                  {customDiscount > 0 ?
                          customDiscountType === 'percent' ?
                          `${customDiscount}%` :
                          formatCurrency(
                            customDiscount /
                            selectedInstallmentsData.length
                          ) :
                          '-'}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {formatCurrency(inst.netAmount)}
                                </td>
                                {applyGST && gstConfig.enabled &&
                        <>
                                    <td className="py-2 px-3 text-right text-xs">
                                      {inst.cgstAmount > 0 ?
                            `${formatCurrency(inst.cgstAmount)} (${gstConfig.cgstRate}%)` :
                            '-'}
                                    </td>
                                    <td className="py-2 px-3 text-right text-xs">
                                      {inst.sgstAmount > 0 ?
                            `${formatCurrency(inst.sgstAmount)} (${gstConfig.sgstRate}%)` :
                            '-'}
                                    </td>
                                  </>
                        }
                                <td className="py-2 px-3 text-right font-semibold">
                                  {formatCurrency(inst.finalAmount)}
                                </td>
                              </tr>
                      )}
                          </tbody>
                        </table>

                        {/* Summary */}
                        <div className="mt-4 flex justify-end">
                          <div className="w-72 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">
                                {formatCurrency(
                            invoicePreview.subtotal +
                            invoicePreview.totalDiscount
                          )}
                              </span>
                            </div>
                            {invoicePreview.totalDiscount > 0 &&
                      <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>
                                  -
                                  {formatCurrency(invoicePreview.totalDiscount)}
                                </span>
                              </div>
                      }
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Taxable Amount
                              </span>
                              <span className="font-medium">
                                {formatCurrency(invoicePreview.subtotal)}
                              </span>
                            </div>
                            {applyGST && gstConfig.enabled &&
                      <>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>CGST ({gstConfig.cgstRate}%)</span>
                                  <span>
                                    {formatCurrency(invoicePreview.cgstTotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>SGST ({gstConfig.sgstRate}%)</span>
                                  <span>
                                    {formatCurrency(invoicePreview.sgstTotal)}
                                  </span>
                                </div>
                              </>
                      }
                            {invoicePreview.roundOff !== 0 &&
                      <div className="flex justify-between text-sm text-gray-600">
                                <span>Round Off</span>
                                <span>
                                  {invoicePreview.roundOff > 0 ? '+' : ''}
                                  {formatCurrency(invoicePreview.roundOff)}
                                </span>
                              </div>
                      }
                            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                              <span>Grand Total</span>
                              <span className="text-blue-600">
                                {formatCurrency(invoicePreview.grandTotal)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                              {invoicePreview.amountInWords}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                variant="outline"
                onClick={() => setGenerateStep('fees')}>

                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Button
                variant="success"
                onClick={handleGenerateInvoice}
                loading={isGenerating}>

                      <Check className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </>
          }
          </>
        }

        {/* ============================================ */}
        {/* BULK GENERATE TAB */}
        {/* ============================================ */}
        {activeTab === 'bulk' &&
        <Card
          title="Bulk Invoice Generation"
          subtitle="Generate invoices for multiple students at once">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Select
              label="Academic Year"
              options={academicYearOptions.filter((o) => o.value)}
              value={filterAcademicYear}
              onChange={(e) => setFilterAcademicYear(e.target.value)}
              required />

              <Select
              label="Class"
              options={classOptions}
              value={bulkClass}
              onChange={(e) => setBulkClass(e.target.value)}
              required />

              <Select
              label="Section"
              options={sectionOptions}
              value={bulkSection}
              onChange={(e) => setBulkSection(e.target.value)} />

              <Select
              label="Term"
              options={termOptions.filter((o) => o.value)}
              value={bulkTerm}
              onChange={(e) => setBulkTerm(e.target.value)}
              required />

            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Fee Heads to Include
              </p>
              <div className="flex flex-wrap gap-2">
                {mockFeeHeads.map((fh) =>
              <button
                key={fh.id}
                onClick={() =>
                setBulkFeeHeads((prev) =>
                prev.includes(fh.id) ?
                prev.filter((id) => id !== fh.id) :
                [...prev, fh.id]
                )
                }
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${bulkFeeHeads.includes(fh.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>

                    {fh.name}
                  </button>
              )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Bulk Generation Info
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Invoices will be generated for all students in the selected
                    class/section who have pending fees for the selected term
                    and fee heads. Existing invoices for the same period will be
                    skipped.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setBulkClass('');
                setBulkSection('');
                setBulkTerm('');
                setBulkFeeHeads([]);
              }}>

                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
              variant="primary"
              loading={isBulkGenerating}
              disabled={!bulkClass || !bulkTerm || bulkFeeHeads.length === 0}
              onClick={async () => {
                setIsBulkGenerating(true);
                await new Promise((r) => setTimeout(r, 2000));
                setIsBulkGenerating(false);
                alert('Bulk invoices generated successfully!');
              }}>

                <Layers className="w-4 h-4 mr-2" />
                Generate Bulk Invoices
              </Button>
            </div>
          </Card>
        }

        {/* ============================================ */}
        {/* SETTINGS TAB */}
        {/* ============================================ */}
        {activeTab === 'settings' &&
        <>
            <div className="flex gap-4">
              <div className="w-56 shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 space-y-1">
                  {(
                [
                {
                  id: 'invoice_number',
                  label: 'Invoice Numbering',
                  icon: <Hash className="w-4 h-4" />
                },
                {
                  id: 'gst',
                  label: 'GST Configuration',
                  icon: <Building className="w-4 h-4" />
                },
                {
                  id: 'templates',
                  label: 'Email Templates',
                  icon: <Mail className="w-4 h-4" />
                },
                {
                  id: 'late_fee',
                  label: 'Late Fee Rules',
                  icon: <Clock className="w-4 h-4" />
                },
                {
                  id: 'bank',
                  label: 'Bank Details',
                  icon: <Banknote className="w-4 h-4" />
                }] as
                const).
                map((item) =>
                <button
                  key={item.id}
                  onClick={() => setSettingsTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${settingsTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>

                      {item.icon}
                      {item.label}
                    </button>
                )}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {/* Invoice Number Settings */}
                {settingsTab === 'invoice_number' &&
              <Card
                title="Invoice Number Configuration"
                subtitle="Configure how invoice numbers are generated">

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                      label="Prefix"
                      placeholder="e.g. INV"
                      value={invoiceNumberConfig.prefix}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        prefix: e.target.value
                      }))
                      } />

                        <Input
                      label="Separator"
                      placeholder="e.g. -"
                      value={invoiceNumberConfig.separator}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        separator: e.target.value
                      }))
                      } />

                        <Input
                      label="Suffix"
                      placeholder="Optional suffix"
                      value={invoiceNumberConfig.suffix}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        suffix: e.target.value
                      }))
                      } />

                        <Input
                      label="Current Number"
                      type="number"
                      value={invoiceNumberConfig.currentNumber}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        currentNumber: parseInt(e.target.value) || 1
                      }))
                      }
                      min={1} />

                        <Input
                      label="Pad Length"
                      type="number"
                      value={invoiceNumberConfig.padLength}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        padLength: parseInt(e.target.value) || 4
                      }))
                      }
                      min={1}
                      max={10} />

                        <Select
                      label="Year Format"
                      options={yearFormatOptions}
                      value={invoiceNumberConfig.yearFormat}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        yearFormat: e.target.value as any
                      }))
                      } />

                        <Select
                      label="Reset Frequency"
                      options={resetFrequencyOptions}
                      value={invoiceNumberConfig.resetFrequency}
                      onChange={(e) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        resetFrequency: e.target.value as any
                      }))
                      } />

                      </div>
                      <div className="flex items-center gap-6">
                        <Toggle
                      checked={invoiceNumberConfig.includeYear}
                      onChange={(v) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        includeYear: v
                      }))
                      }
                      label="Include Year" />

                        <Toggle
                      checked={invoiceNumberConfig.includeMonth}
                      onChange={(v) =>
                      setInvoiceNumberConfig((prev) => ({
                        ...prev,
                        includeMonth: v
                      }))
                      }
                      label="Include Month" />

                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Preview</p>
                        <p className="text-xl font-bold text-blue-600 font-mono">
                          {invoiceNumberConfig.preview}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last Invoice: {invoiceNumberConfig.lastInvoiceNo}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                      variant="primary"
                      onClick={handleSaveInvoiceNumberSettings}
                      loading={isSavingSettings}>

                          <Check className="w-4 h-4 mr-2" />
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* GST Settings */}
                {settingsTab === 'gst' &&
              <Card
                title="GST Configuration"
                subtitle="Configure GST details for invoice generation">

                    <div className="space-y-4">
                      <Toggle
                    checked={gstConfig.enabled}
                    onChange={(v) =>
                    setGstConfig((prev) => ({
                      ...prev,
                      enabled: v
                    }))
                    }
                    label="Enable GST"
                    description="Apply GST calculations to invoices" />

                      {gstConfig.enabled &&
                  <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                        label="GST Number (GSTIN)"
                        value={gstConfig.gstNumber}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          gstNumber: e.target.value
                        }))
                        }
                        required />

                            <Input
                        label="PAN Number"
                        value={gstConfig.panNumber}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          panNumber: e.target.value
                        }))
                        } />

                            <Input
                        label="Company Name"
                        value={gstConfig.companyName}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyName: e.target.value
                        }))
                        }
                        required />

                            <Input
                        label="Company Email"
                        type="email"
                        value={gstConfig.companyEmail}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyEmail: e.target.value
                        }))
                        } />

                            <Input
                        label="Company Address"
                        value={gstConfig.companyAddress}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyAddress: e.target.value
                        }))
                        } />

                            <Input
                        label="Company City"
                        value={gstConfig.companyCity}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyCity: e.target.value
                        }))
                        } />

                            <Select
                        label="Company State"
                        options={stateOptions}
                        value={gstConfig.companyState}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyState: e.target.value
                        }))
                        } />

                            <Input
                        label="Pincode"
                        value={gstConfig.companyPincode}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          companyPincode: e.target.value
                        }))
                        } />

                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <Input
                        label="CGST Rate (%)"
                        type="number"
                        value={gstConfig.cgstRate}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          cgstRate: parseFloat(e.target.value) || 0
                        }))
                        }
                        min={0}
                        max={50} />

                            <Input
                        label="SGST Rate (%)"
                        type="number"
                        value={gstConfig.sgstRate}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          sgstRate: parseFloat(e.target.value) || 0
                        }))
                        }
                        min={0}
                        max={50} />

                            <Input
                        label="IGST Rate (%)"
                        type="number"
                        value={gstConfig.igstRate}
                        onChange={(e) =>
                        setGstConfig((prev) => ({
                          ...prev,
                          igstRate: parseFloat(e.target.value) || 0
                        }))
                        }
                        min={0}
                        max={50} />

                          </div>
                          <Toggle
                      checked={gstConfig.useIGST}
                      onChange={(v) =>
                      setGstConfig((prev) => ({
                        ...prev,
                        useIGST: v
                      }))
                      }
                      label="Use IGST (Inter-state)"
                      description="Use IGST instead of CGST+SGST for inter-state transactions" />

                        </>
                  }
                      <div className="flex justify-end">
                        <Button
                      variant="primary"
                      onClick={handleSaveGSTSettings}
                      loading={isSavingSettings}>

                          <Check className="w-4 h-4 mr-2" />
                          Save GST Settings
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* Email Templates */}
                {settingsTab === 'templates' &&
              <Card
                title="Email Templates"
                subtitle="Manage email templates for invoice communication">

                    <div className="space-y-4">
                      {emailTemplates.map((template) =>
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4">

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {template.name}
                              </p>
                              <Badge variant="info" size="xs">
                                {template.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            {template.isDefault &&
                      <Badge variant="success" size="xs">
                                Default
                              </Badge>
                      }
                          </div>
                          <Input
                      label="Subject"
                      value={template.subject}
                      onChange={(e) =>
                      setEmailTemplates((prev) =>
                      prev.map((t) =>
                      t.id === template.id ?
                      {
                        ...t,
                        subject: e.target.value
                      } :
                      t
                      )
                      )
                      }
                      className="mb-3" />

                          <TextArea
                      label="Body"
                      value={template.body}
                      onChange={(e) =>
                      setEmailTemplates((prev) =>
                      prev.map((t) =>
                      t.id === template.id ?
                      {
                        ...t,
                        body: e.target.value
                      } :
                      t
                      )
                      )
                      }
                      rows={6} />

                          <div className="mt-2 flex flex-wrap gap-1">
                            {template.variables.map((v) =>
                      <span
                        key={v}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">

                                {'{{' + v + '}}'}
                              </span>
                      )}
                          </div>
                        </div>
                  )}
                      <div className="flex justify-end">
                        <Button
                      variant="primary"
                      onClick={async () => {
                        setIsSavingSettings(true);
                        await new Promise((r) => setTimeout(r, 1000));
                        setIsSavingSettings(false);
                        alert('Templates saved!');
                      }}
                      loading={isSavingSettings}>

                          <Check className="w-4 h-4 mr-2" />
                          Save Templates
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* Late Fee Settings */}
                {settingsTab === 'late_fee' &&
              <Card
                title="Late Fee Configuration"
                subtitle="Configure late fee rules for overdue invoices">

                    <div className="space-y-4">
                      <Toggle
                    checked={lateFeeConfig.enabled}
                    onChange={(v) =>
                    setLateFeeConfig((prev) => ({
                      ...prev,
                      enabled: v
                    }))
                    }
                    label="Enable Late Fee"
                    description="Automatically apply late fees to overdue invoices" />

                      {lateFeeConfig.enabled &&
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Late Fee Type
                            </label>
                            <div className="flex gap-2">
                              {(['percentage', 'fixed'] as const).map(
                          (type) =>
                          <button
                            key={type}
                            onClick={() =>
                            setLateFeeConfig((prev) => ({
                              ...prev,
                              type
                            }))
                            }
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${lateFeeConfig.type === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>

                                    {type === 'percentage' ?
                            'Percentage (%)' :
                            'Fixed Amount (₹)'}
                                  </button>

                        )}
                            </div>
                          </div>
                          {lateFeeConfig.type === 'percentage' ?
                    <Input
                      label="Late Fee Rate (%)"
                      type="number"
                      value={lateFeeConfig.rate}
                      onChange={(e) =>
                      setLateFeeConfig((prev) => ({
                        ...prev,
                        rate: parseFloat(e.target.value) || 0
                      }))
                      }
                      min={0}
                      max={100}
                      step={0.5} /> :


                    <Input
                      label="Fixed Late Fee Amount (₹)"
                      type="number"
                      value={lateFeeConfig.fixedAmount}
                      onChange={(e) =>
                      setLateFeeConfig((prev) => ({
                        ...prev,
                        fixedAmount: parseFloat(e.target.value) || 0
                      }))
                      }
                      min={0} />

                    }
                          <Input
                      label="Grace Period (Days)"
                      type="number"
                      value={lateFeeConfig.gracePeriodDays}
                      onChange={(e) =>
                      setLateFeeConfig((prev) => ({
                        ...prev,
                        gracePeriodDays: parseInt(e.target.value) || 0
                      }))
                      }
                      min={0} />

                          <Input
                      label="Maximum Late Fee (₹)"
                      type="number"
                      value={lateFeeConfig.maxLateFee}
                      onChange={(e) =>
                      setLateFeeConfig((prev) => ({
                        ...prev,
                        maxLateFee: parseFloat(e.target.value) || 0
                      }))
                      }
                      min={0} />

                          <Toggle
                      checked={lateFeeConfig.applyPerMonth}
                      onChange={(v) =>
                      setLateFeeConfig((prev) => ({
                        ...prev,
                        applyPerMonth: v
                      }))
                      }
                      label="Apply Per Month"
                      description="Apply late fee every month the invoice remains unpaid" />

                        </div>
                  }
                      <div className="flex justify-end">
                        <Button
                      variant="primary"
                      onClick={handleSaveLateFeeSettings}
                      loading={isSavingSettings}>

                          <Check className="w-4 h-4 mr-2" />
                          Save Late Fee Settings
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* Bank Details */}
                {settingsTab === 'bank' &&
              <Card
                title="Bank Details"
                subtitle="Bank account details shown on invoices for payment">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                    label="Bank Name"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      bankName: e.target.value
                    }))
                    }
                    required />

                      <Input
                    label="Account Name"
                    value={bankDetails.accountName}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      accountName: e.target.value
                    }))
                    }
                    required />

                      <Input
                    label="Account Number"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      accountNumber: e.target.value
                    }))
                    }
                    required />

                      <Input
                    label="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      ifscCode: e.target.value
                    }))
                    }
                    required />

                      <Input
                    label="Branch Name"
                    value={bankDetails.branchName}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      branchName: e.target.value
                    }))
                    } />

                      <Input
                    label="UPI ID"
                    value={bankDetails.upiId}
                    onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      upiId: e.target.value
                    }))
                    } />

                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                    variant="primary"
                    onClick={handleSaveBankSettings}
                    loading={isSavingSettings}>

                        <Check className="w-4 h-4 mr-2" />
                        Save Bank Details
                      </Button>
                    </div>
                  </Card>
              }
              </div>
            </div>
          </>
        }
      </div>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* View Invoice Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInvoice(null);
        }}
        title={
        selectedInvoice ?
        `Invoice: ${selectedInvoice.invoiceNo}` :
        'Invoice Details'
        }
        subtitle={
        selectedInvoice ?
        `${selectedInvoice.student.firstName} ${selectedInvoice.student.lastName} · ${formatDate(selectedInvoice.invoiceDate)}` :
        ''
        }
        size="full"
        footer={
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {selectedInvoice &&
            selectedInvoice.status !== 'paid' &&
            selectedInvoice.status !== 'cancelled' &&
            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                setShowViewModal(false);
                setShowReminderModal(true);
              }}>

                    <Bell className="w-4 h-4 mr-1" />
                    Send Reminder
                  </Button>
            }
              {selectedInvoice &&
            selectedInvoice.status !== 'cancelled' &&
            selectedInvoice.status !== 'paid' &&
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowViewModal(false);
                setShowCancelModal(true);
              }}>

                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel Invoice
                  </Button>
            }
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedInvoice) handleEmailInvoice(selectedInvoice);
                setShowViewModal(false);
              }}>

                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedInvoice) handlePrintInvoice(selectedInvoice);
                setShowViewModal(false);
              }}>

                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        }>

        {selectedInvoice &&
        <div className="p-6 space-y-6">
            {/* Status Banner */}
            <div
            className={`flex items-center gap-3 p-4 rounded-lg ${selectedInvoice.status === 'paid' ? 'bg-green-50 border border-green-200' : selectedInvoice.status === 'overdue' ? 'bg-red-50 border border-red-200' : selectedInvoice.status === 'cancelled' ? 'bg-gray-50 border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}>

              {getStatusBadge(selectedInvoice.status)}
              <span className="text-sm font-medium text-gray-700">
                {selectedInvoice.status === 'paid' ?
              'This invoice has been fully paid.' :
              selectedInvoice.status === 'partial' ?
              `Partial payment of ${formatCurrency(selectedInvoice.paidAmount)} received. Balance: ${formatCurrency(selectedInvoice.balanceAmount)}` :
              selectedInvoice.status === 'overdue' ?
              `This invoice is overdue by ${selectedInvoice.daysOverdue} days. Late fee: ${formatCurrency(selectedInvoice.lateFeeAmount)}` :
              selectedInvoice.status === 'cancelled' ?
              `Cancelled: ${selectedInvoice.cancellationReason}` :
              `Payment due by ${formatDate(selectedInvoice.dueDate)}`}
              </span>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Billed To
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedInvoice.billedTo.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.billedTo.address}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.billedTo.city},{' '}
                  {selectedInvoice.billedTo.state}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.billedTo.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.billedTo.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Student Details
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedInvoice.student.firstName}{' '}
                  {selectedInvoice.student.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  GR No: {selectedInvoice.student.grNo}
                </p>
                <p className="text-sm text-gray-600">
                  Class {selectedInvoice.student.class}-
                  {selectedInvoice.student.section}
                </p>
                <p className="text-sm text-gray-600">
                  Academic Year: {selectedInvoice.academicYear}
                </p>
                <p className="text-sm text-gray-600">
                  Term: {selectedInvoice.term}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Fee Items
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      <th className="text-left py-2 px-4">Description</th>
                      <th className="text-right py-2 px-4">Rate</th>
                      <th className="text-right py-2 px-4">Discount</th>
                      <th className="text-right py-2 px-4">GST</th>
                      <th className="text-right py-2 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((item) =>
                  <tr key={item.id}>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {item.feeHeadName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description} | {item.term}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600">
                          {item.discountAmount > 0 ?
                      `-${formatCurrency(item.discountAmount)}` :
                      '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {item.totalGST > 0 ?
                      formatCurrency(item.totalGST) :
                      '-'}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(item.netAmount)}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gross Total</span>
                  <span>{formatCurrency(selectedInvoice.grossTotal)}</span>
                </div>
                {selectedInvoice.totalDiscount > 0 &&
              <div className="flex justify-between text-sm text-green-600">
                    <span>Total Discount</span>
                    <span>
                      -{formatCurrency(selectedInvoice.totalDiscount)}
                    </span>
                  </div>
              }
                {selectedInvoice.totalGST > 0 &&
              <div className="flex justify-between text-sm text-gray-600">
                    <span>Total GST</span>
                    <span>{formatCurrency(selectedInvoice.totalGST)}</span>
                  </div>
              }
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                  <span>Grand Total</span>
                  <span className="text-blue-600">
                    {formatCurrency(selectedInvoice.grandTotal)}
                  </span>
                </div>
                {selectedInvoice.paidAmount > 0 &&
              <div className="flex justify-between text-sm text-green-600">
                    <span>Amount Paid</span>
                    <span>-{formatCurrency(selectedInvoice.paidAmount)}</span>
                  </div>
              }
                {selectedInvoice.balanceAmount > 0 &&
              <div className="flex justify-between text-sm font-semibold text-red-600">
                    <span>Balance Due</span>
                    <span>{formatCurrency(selectedInvoice.balanceAmount)}</span>
                  </div>
              }
                <p className="text-xs text-gray-500 italic pt-1">
                  {selectedInvoice.amountInWords}
                </p>
              </div>
            </div>

            {/* Audit Trail */}
            {selectedInvoice.auditTrail.length > 0 &&
          <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Activity Log
                </p>
                <div className="space-y-2">
                  {selectedInvoice.auditTrail.map((entry) =>
              <div
                key={entry.id}
                className="flex items-start gap-3 text-sm">

                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">
                          {entry.action}
                        </span>
                        <span className="text-gray-500">
                          {' '}
                          · {entry.performedBy} ·{' '}
                          {formatDateTime(entry.performedAt)}
                        </span>
                        <p className="text-xs text-gray-500">{entry.details}</p>
                      </div>
                    </div>
              )}
                </div>
              </div>
          }
          </div>
        }
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Send Invoice Email"
        subtitle={
        selectedInvoice ? `To: ${selectedInvoice.billedTo.email}` : ''
        }
        size="lg"
        footer={
        <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={handleSendEmail}
            loading={isSendingEmail}>

              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        }>

        <div className="p-6 space-y-4">
          <Select
            label="Email Template"
            options={emailTemplates.map((t) => ({
              value: t.id,
              label: t.name
            }))}
            value={selectedEmailTemplate}
            onChange={(e) => setSelectedEmailTemplate(e.target.value)} />

          <Input
            label="To"
            value={selectedInvoice?.billedTo.email || ''}
            disabled />

          <Input
            label="CC"
            placeholder="Optional CC emails (comma separated)"
            value={ccEmails}
            onChange={(e) => setCcEmails(e.target.value)} />

          <Input
            label="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            required />

          <TextArea
            label="Body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={10}
            required />

        </div>
      </Modal>

      {/* Cancel Invoice Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelReason('');
        }}
        title="Cancel Invoice"
        subtitle={
        selectedInvoice ? `Invoice: ${selectedInvoice.invoiceNo}` : ''
        }
        size="md"
        footer={
        <div className="flex justify-between">
            <Button
            variant="outline"
            onClick={() => {
              setShowCancelModal(false);
              setCancelReason('');
            }}>

              Back
            </Button>
            <Button
            variant="danger"
            onClick={handleCancelInvoice}
            loading={isCancelling}
            disabled={!cancelReason.trim()}>

              <XCircle className="w-4 h-4 mr-2" />
              Confirm Cancellation
            </Button>
          </div>
        }>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Warning: This action cannot be undone
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Cancelling this invoice will mark it as cancelled and it
                  cannot be reactivated. A credit note can be issued if needed.
                </p>
              </div>
            </div>
          </div>
          <TextArea
            label="Cancellation Reason"
            placeholder="Please provide a reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
            required />

        </div>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Send Payment Reminder"
        subtitle={
        selectedInvoice ?
        `Invoice: ${selectedInvoice.invoiceNo} · Balance: ${formatCurrency(selectedInvoice?.balanceAmount || 0)}` :
        ''
        }
        size="md"
        footer={
        <div className="flex justify-between">
            <Button
            variant="outline"
            onClick={() => setShowReminderModal(false)}>

              Cancel
            </Button>
            <Button variant="warning" onClick={handleSendReminder}>
              <Bell className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        }>

        <div className="p-6 space-y-4">
          {selectedInvoice &&
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                This will send a payment reminder to{' '}
                <strong>{selectedInvoice.billedTo.email}</strong>.
                {selectedInvoice.remindersSent > 0 &&
              ` ${selectedInvoice.remindersSent} reminder(s) already sent.`}
              </p>
            </div>
          }
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Reminder will include:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Invoice number and date</li>
              <li>Outstanding balance amount</li>
              <li>Due date</li>
              <li>Payment link</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Audit Trail Modal */}
      <Modal
        isOpen={showAuditModal}
        onClose={() => {
          setShowAuditModal(false);
          setSelectedInvoice(null);
        }}
        title="Invoice Audit Trail"
        subtitle={
        selectedInvoice ? `Invoice: ${selectedInvoice.invoiceNo}` : ''
        }
        size="lg">

        {selectedInvoice &&
        <div className="p-6">
            <div className="space-y-3">
              {selectedInvoice.auditTrail.map((entry, index) =>
            <div key={entry.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {index + 1}
                    </div>
                    {index < selectedInvoice.auditTrail.length - 1 &&
                <div className="w-0.5 h-6 bg-gray-200 mt-1" />
                }
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {entry.action}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatDateTime(entry.performedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.details}</p>
                    <p className="text-xs text-gray-400">
                      By: {entry.performedBy}
                    </p>
                    {entry.oldValue && entry.newValue &&
                <div className="flex items-center gap-2 mt-1">
                        <Badge variant="danger" size="xs">
                          {entry.oldValue}
                        </Badge>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <Badge variant="success" size="xs">
                          {entry.newValue}
                        </Badge>
                      </div>
                }
                  </div>
                </div>
            )}
            </div>
          </div>
        }
      </Modal>

      {/* Print Preview Modal */}
      <Modal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        title="Print Preview"
        subtitle={
        selectedInvoice ? `Invoice: ${selectedInvoice.invoiceNo}` : ''
        }
        size="full"
        footer={
        <div className="flex justify-end gap-3">
            <Button
            variant="outline"
            onClick={() => setShowPrintPreview(false)}>

              Close
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              window.print();
              setShowPrintPreview(false);
            }}>

              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        }>

        {selectedInvoice &&
        <div className="p-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{gstConfig.companyName}</h2>
                  <p className="text-blue-200 text-sm">
                    {gstConfig.companyAddress}, {gstConfig.companyCity}
                  </p>
                  <p className="text-blue-200 text-sm">
                    GSTIN: {gstConfig.gstNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">TAX INVOICE</p>
                  <p className="text-blue-200">{selectedInvoice.invoiceNo}</p>
                  <p className="text-blue-200 text-sm">
                    Date: {formatDate(selectedInvoice.invoiceDate)}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Billed To
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedInvoice.billedTo.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedInvoice.billedTo.address},{' '}
                      {selectedInvoice.billedTo.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedInvoice.billedTo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Student
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedInvoice.student.firstName}{' '}
                      {selectedInvoice.student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      GR: {selectedInvoice.student.grNo} | Class{' '}
                      {selectedInvoice.student.class}-
                      {selectedInvoice.student.section}
                    </p>
                  </div>
                </div>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                      <th className="text-left py-2 px-3 border border-gray-200">
                        Description
                      </th>
                      <th className="text-right py-2 px-3 border border-gray-200">
                        Amount
                      </th>
                      <th className="text-right py-2 px-3 border border-gray-200">
                        GST
                      </th>
                      <th className="text-right py-2 px-3 border border-gray-200">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) =>
                  <tr key={item.id}>
                        <td className="py-2 px-3 border border-gray-200">
                          {item.feeHeadName} - {item.term}
                        </td>
                        <td className="py-2 px-3 border border-gray-200 text-right">
                          {formatCurrency(item.taxableAmount)}
                        </td>
                        <td className="py-2 px-3 border border-gray-200 text-right">
                          {formatCurrency(item.totalGST)}
                        </td>
                        <td className="py-2 px-3 border border-gray-200 text-right font-semibold">
                          {formatCurrency(item.netAmount)}
                        </td>
                      </tr>
                  )}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-gray-50">
                      <td
                      className="py-2 px-3 border border-gray-200"
                      colSpan={3}>

                        Grand Total
                      </td>
                      <td className="py-2 px-3 border border-gray-200 text-right text-blue-600">
                        {formatCurrency(selectedInvoice.grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-xs text-gray-500 italic mt-3">
                  {selectedInvoice.amountInWords}
                </p>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkActionModal}
        onClose={() => setShowBulkActionModal(false)}
        title={`Bulk ${bulkActionType === 'print' ? 'Print' : bulkActionType === 'email' ? 'Email' : bulkActionType === 'download' ? 'Download' : 'Send Reminders'}`}
        subtitle={`${selectedInvoices.length} invoices selected`}
        size="md"
        footer={
        <div className="flex justify-between">
            <Button
            variant="outline"
            onClick={() => setShowBulkActionModal(false)}>

              Cancel
            </Button>
            <Button variant="primary" onClick={handleExecuteBulkAction}>
              {bulkActionType === 'print' ?
            <Printer className="w-4 h-4 mr-2" /> :
            bulkActionType === 'email' ?
            <Mail className="w-4 h-4 mr-2" /> :
            bulkActionType === 'download' ?
            <Download className="w-4 h-4 mr-2" /> :

            <Bell className="w-4 h-4 mr-2" />
            }
              Confirm
            </Button>
          </div>
        }>

        <div className="p-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              You are about to{' '}
              {bulkActionType === 'print' ?
              'print' :
              bulkActionType === 'email' ?
              'email' :
              bulkActionType === 'download' ?
              'download' :
              'send reminders for'}{' '}
              <strong>{selectedInvoices.length} invoices</strong>. This action
              will process all selected invoices.
            </p>
          </div>
        </div>
      </Modal>
    </div>);

}