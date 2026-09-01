import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { ReportFilters } from '../../../components/ReportFilters';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  XCircle,
  FileText,
  Calendar,
  X,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Clock,
  Receipt,
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  GraduationCap,
  Banknote,
  Wallet,
  Smartphone,
  CheckCheck,
  Ban,
  History,
  Percent,
  Tag,
  TrendingDown,
  Gift,
  Users,
  Award } from
'lucide-react';
// --- Types ---
interface ReceiptData {
  id: string;
  receiptNo: string;
  receiptType: 'regular' | 'discount';
  date: string;
  time: string;
  studentName: string;
  fatherName: string;
  grNo: string;
  class: string;
  section: string;
  rollNo: string;
  category?: string;
  installment: string;
  feeHeads: {
    name: string;
    amount?: number;
    originalAmount?: number;
    discountAmount?: number;
    netAmount?: number;
  }[];
  totalAmount: number;
  discount: number;
  fine: number;
  netAmount: number;
  paidAmount: number;
  discountType?: string;
  discountCategory?: string;
  discountPercentage?: number;
  discountReason?: string;
  discountApprovedBy?: string;
  discountApprovedDate?: string;
  mode: string;
  transactionId: string;
  chequeNo: string;
  chequeDate?: string;
  bankName: string;
  status: 'Active' | 'Cancelled' | 'Pending' | 'Uncleared';
  paymentReceived: boolean;
  paymentReceivedDate?: string;
  collectedBy: string;
  remarks: string;
  cancelReason?: string;
  cancelledBy?: string;
  cancelledDate?: string;
  entryType: 'manual' | 'system';
  originalPaymentDate: string;
}
// --- Mock Data ---
const allReceipts: ReceiptData[] = [
// Regular Receipts
{
  id: '1',
  receiptNo: 'RCP-2024-001',
  receiptType: 'regular',
  date: '2024-03-15',
  time: '10:30 AM',
  studentName: 'Rahul Sharma',
  fatherName: 'Rajesh Sharma',
  grNo: 'GR001',
  class: '10',
  section: 'A',
  rollNo: '15',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    amount: 15000
  },
  {
    name: 'Development Fee',
    amount: 3000
  },
  {
    name: 'Computer Fee',
    amount: 2000
  },
  {
    name: 'Library Fee',
    amount: 1500
  },
  {
    name: 'Laboratory Fee',
    amount: 2000
  },
  {
    name: 'Sports Fee',
    amount: 1000
  },
  {
    name: 'Activity Fee',
    amount: 500
  }],

  totalAmount: 25000,
  discount: 0,
  fine: 0,
  netAmount: 25000,
  paidAmount: 25000,
  mode: 'Online',
  transactionId: 'TXN123456789',
  chequeNo: '',
  chequeDate: '',
  bankName: 'HDFC Bank',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-15',
  collectedBy: 'Admin',
  remarks: 'Term 1 fee payment - Online transfer confirmed',
  entryType: 'manual',
  originalPaymentDate: '2024-03-14'
},
{
  id: '2',
  receiptNo: 'RCP-2024-002',
  receiptType: 'regular',
  date: '2024-03-15',
  time: '11:15 AM',
  studentName: 'Priya Patel',
  fatherName: 'Amit Patel',
  grNo: 'GR002',
  class: '9',
  section: 'B',
  rollNo: '08',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    amount: 15000
  },
  {
    name: 'Development Fee',
    amount: 3000
  },
  {
    name: 'Computer Fee',
    amount: 2000
  },
  {
    name: 'Library Fee',
    amount: 1500
  },
  {
    name: 'Laboratory Fee',
    amount: 2000
  },
  {
    name: 'Sports Fee',
    amount: 1000
  }],

  totalAmount: 25500,
  discount: 500,
  fine: 0,
  netAmount: 25000,
  paidAmount: 25000,
  mode: 'Cash',
  transactionId: '',
  chequeNo: '',
  chequeDate: '',
  bankName: '',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-15',
  collectedBy: 'Accountant',
  remarks: 'OBC category discount applied - Cash received',
  entryType: 'manual',
  originalPaymentDate: '2024-03-15'
},
{
  id: '3',
  receiptNo: 'RCP-2024-003',
  receiptType: 'regular',
  date: '2024-03-14',
  time: '02:45 PM',
  studentName: 'Amit Kumar',
  fatherName: 'Suresh Kumar',
  grNo: 'GR003',
  class: '10',
  section: 'A',
  rollNo: '22',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    amount: 15000
  },
  {
    name: 'Development Fee',
    amount: 3000
  },
  {
    name: 'Computer Fee',
    amount: 2000
  },
  {
    name: 'Library Fee',
    amount: 1500
  },
  {
    name: 'Laboratory Fee',
    amount: 2000
  },
  {
    name: 'Sports Fee',
    amount: 1000
  },
  {
    name: 'Activity Fee',
    amount: 500
  }],

  totalAmount: 25000,
  discount: 0,
  fine: 500,
  netAmount: 25500,
  paidAmount: 25500,
  mode: 'Cheque',
  transactionId: '',
  chequeNo: 'CHQ789012',
  chequeDate: '2024-03-14',
  bankName: 'SBI',
  status: 'Cancelled',
  paymentReceived: false,
  collectedBy: 'Admin',
  remarks: 'Late fee applied - Cheque submitted',
  cancelReason: 'Cheque bounced - insufficient funds',
  cancelledBy: 'Admin',
  cancelledDate: '2024-03-16',
  entryType: 'manual',
  originalPaymentDate: '2024-03-14'
},
{
  id: '4',
  receiptNo: 'RCP-2024-004',
  receiptType: 'regular',
  date: '2024-03-16',
  time: '09:00 AM',
  studentName: 'Sneha Gupta',
  fatherName: 'Vikram Gupta',
  grNo: 'GR004',
  class: '8',
  section: 'C',
  rollNo: '05',
  installment: 'Term 2 (Aug-Nov)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    amount: 12000
  },
  {
    name: 'Development Fee',
    amount: 2500
  },
  {
    name: 'Computer Fee',
    amount: 1500
  },
  {
    name: 'Library Fee',
    amount: 1000
  }],

  totalAmount: 17000,
  discount: 1000,
  fine: 0,
  netAmount: 16000,
  paidAmount: 16000,
  mode: 'UPI',
  transactionId: 'UPI987654321',
  chequeNo: '',
  chequeDate: '',
  bankName: 'Paytm',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-16',
  collectedBy: 'Accountant',
  remarks: 'Sibling discount applied - UPI payment confirmed',
  entryType: 'manual',
  originalPaymentDate: '2024-03-16'
},
{
  id: '5',
  receiptNo: 'RCP-2024-005',
  receiptType: 'regular',
  date: '2024-03-16',
  time: '03:30 PM',
  studentName: 'Rahul Sharma',
  fatherName: 'Rajesh Sharma',
  grNo: 'GR001',
  class: '10',
  section: 'A',
  rollNo: '15',
  installment: 'Term 2 (Aug-Nov)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    amount: 15000
  },
  {
    name: 'Development Fee',
    amount: 3000
  },
  {
    name: 'Computer Fee',
    amount: 2000
  }],

  totalAmount: 20000,
  discount: 0,
  fine: 0,
  netAmount: 20000,
  paidAmount: 10000,
  mode: 'Card',
  transactionId: 'CARD456789123',
  chequeNo: '',
  chequeDate: '',
  bankName: 'ICICI Bank',
  status: 'Pending',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-16',
  collectedBy: 'Admin',
  remarks: 'Partial payment received - Balance pending',
  entryType: 'manual',
  originalPaymentDate: '2024-03-16'
},
// Discount Receipts
{
  id: '6',
  receiptNo: 'RCP-2024-006',
  receiptType: 'discount',
  date: '2024-03-20',
  time: '10:30 AM',
  studentName: 'Rahul Sharma',
  fatherName: 'Rajesh Sharma',
  grNo: 'GR001',
  class: '10',
  section: 'A',
  rollNo: '15',
  category: 'General',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 15000,
    discountAmount: 2500,
    netAmount: 12500
  },
  {
    name: 'Development Fee',
    originalAmount: 3000,
    discountAmount: 500,
    netAmount: 2500
  },
  {
    name: 'Computer Fee',
    originalAmount: 2000,
    discountAmount: 500,
    netAmount: 1500
  }],

  totalAmount: 25000,
  discount: 4500,
  discountPercentage: 18,
  fine: 0,
  netAmount: 20500,
  paidAmount: 20500,
  discountType: 'Sibling Discount',
  discountCategory: 'Family',
  discountReason: 'Younger sibling of Priya Sharma (GR-2019-045)',
  discountApprovedBy: 'Principal',
  discountApprovedDate: '2024-03-15',
  mode: 'Online',
  transactionId: 'TXN123456789',
  chequeNo: '',
  bankName: 'HDFC Bank',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-20',
  collectedBy: 'Admin',
  remarks: 'Sibling discount as per school policy - 18% on total fee',
  entryType: 'system',
  originalPaymentDate: '2024-03-20'
},
{
  id: '7',
  receiptNo: 'RCP-2024-008',
  receiptType: 'discount',
  date: '2024-03-22',
  time: '11:15 AM',
  studentName: 'Amit Kumar',
  fatherName: 'Suresh Kumar',
  grNo: 'GR003',
  class: '8',
  section: 'C',
  rollNo: '22',
  category: 'SC',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 12000,
    discountAmount: 1200,
    netAmount: 10800
  },
  {
    name: 'Development Fee',
    originalAmount: 2500,
    discountAmount: 250,
    netAmount: 2250
  }],

  totalAmount: 17000,
  discount: 1700,
  discountPercentage: 10,
  fine: 0,
  netAmount: 15300,
  paidAmount: 15300,
  discountType: 'Early Bird Discount',
  discountCategory: 'Promotional',
  discountReason: 'Fee paid before due date',
  discountApprovedBy: 'Accountant',
  discountApprovedDate: '2024-03-22',
  mode: 'Cash',
  transactionId: '',
  chequeNo: '',
  bankName: '',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-22',
  collectedBy: 'Accountant',
  remarks: 'Early bird discount - 10%',
  entryType: 'system',
  originalPaymentDate: '2024-03-22'
},
{
  id: '8',
  receiptNo: 'RCP-2024-012',
  receiptType: 'discount',
  date: '2024-03-25',
  time: '02:30 PM',
  studentName: 'Priya Patel',
  fatherName: 'Amit Patel',
  grNo: 'GR002',
  class: '9',
  section: 'B',
  rollNo: '08',
  category: 'OBC',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 15000,
    discountAmount: 7500,
    netAmount: 7500
  }],

  totalAmount: 23500,
  discount: 11750,
  discountPercentage: 50,
  fine: 0,
  netAmount: 11750,
  paidAmount: 11750,
  discountType: 'Merit Scholarship',
  discountCategory: 'Academic',
  discountReason: 'School topper - 98.5%',
  discountApprovedBy: 'Principal',
  discountApprovedDate: '2024-03-20',
  mode: 'UPI',
  transactionId: 'UPI987654321',
  chequeNo: '',
  bankName: 'PhonePe',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-25',
  collectedBy: 'Admin',
  remarks: 'Merit scholarship - 50% discount',
  entryType: 'system',
  originalPaymentDate: '2024-03-25'
},
{
  id: '9',
  receiptNo: 'RCP-2024-015',
  receiptType: 'discount',
  date: '2024-03-26',
  time: '09:45 AM',
  studentName: 'Sneha Gupta',
  fatherName: 'Vikram Gupta',
  grNo: 'GR004',
  class: '8',
  section: 'C',
  rollNo: '05',
  category: 'General',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 12000,
    discountAmount: 3000,
    netAmount: 9000
  }],

  totalAmount: 17000,
  discount: 4250,
  discountPercentage: 25,
  fine: 0,
  netAmount: 12750,
  paidAmount: 12750,
  discountType: 'Staff Ward Discount',
  discountCategory: 'Staff',
  discountReason: 'Father is teaching staff',
  discountApprovedBy: 'Director',
  discountApprovedDate: '2024-03-24',
  mode: 'Cheque',
  transactionId: '',
  chequeNo: 'CHQ456789',
  bankName: 'SBI',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-26',
  collectedBy: 'Accountant',
  remarks: 'Staff ward discount - 25%',
  entryType: 'system',
  originalPaymentDate: '2024-03-26'
},
{
  id: '10',
  receiptNo: 'RCP-2024-022',
  receiptType: 'discount',
  date: '2024-03-28',
  time: '03:15 PM',
  studentName: 'Anjali Verma',
  fatherName: 'Ramesh Verma',
  grNo: 'GR010',
  class: '6',
  section: 'B',
  rollNo: '18',
  category: 'EWS',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 8000,
    discountAmount: 6000,
    netAmount: 2000
  }],

  totalAmount: 11300,
  discount: 8475,
  discountPercentage: 75,
  fine: 0,
  netAmount: 2825,
  paidAmount: 2825,
  discountType: 'EWS Concession',
  discountCategory: 'Government',
  discountReason: 'Economically Weaker Section',
  discountApprovedBy: 'Director',
  discountApprovedDate: '2024-03-26',
  mode: 'Cash',
  transactionId: '',
  chequeNo: '',
  bankName: '',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-28',
  collectedBy: 'Accountant',
  remarks: 'EWS concession - 75%',
  entryType: 'system',
  originalPaymentDate: '2024-03-28'
},
{
  id: '11',
  receiptNo: 'RCP-2024-025',
  receiptType: 'discount',
  date: '2024-03-29',
  time: '10:00 AM',
  studentName: 'Karan Mehta',
  fatherName: 'Sunil Mehta',
  grNo: 'GR012',
  class: '11',
  section: 'A',
  rollNo: '03',
  category: 'General',
  installment: 'Term 1 (Apr-Jul)',
  feeHeads: [
  {
    name: 'Tuition Fee',
    originalAmount: 18000,
    discountAmount: 5400,
    netAmount: 12600
  }],

  totalAmount: 29500,
  discount: 8850,
  discountPercentage: 30,
  fine: 0,
  netAmount: 20650,
  paidAmount: 20650,
  discountType: 'Sports Achievement',
  discountCategory: 'Achievement',
  discountReason: 'State level cricket champion',
  discountApprovedBy: 'Principal',
  discountApprovedDate: '2024-03-27',
  mode: 'Online',
  transactionId: 'TXN567890123',
  chequeNo: '',
  bankName: 'Axis Bank',
  status: 'Active',
  paymentReceived: true,
  paymentReceivedDate: '2024-03-29',
  collectedBy: 'Admin',
  remarks: 'Sports achievement discount - 30%',
  entryType: 'system',
  originalPaymentDate: '2024-03-29'
}];

// Filter State Interface
interface FilterState {
  searchTerm: string;
  receiptType: string;
  academicYear: string;
  fromDate: string;
  toDate: string;
  class: string;
  section: string;
  paymentMode: string;
  paymentStatus: string;
  installment: string;
  collectedBy: string;
  receiptNo: string;
  discountType: string;
  discountCategory: string;
  minDiscount: string;
  maxDiscount: string;
}
const initialFilters: FilterState = {
  searchTerm: '',
  receiptType: '',
  academicYear: '2024-2025',
  fromDate: '',
  toDate: '',
  class: '',
  section: '',
  paymentMode: '',
  paymentStatus: '',
  installment: '',
  collectedBy: '',
  receiptNo: '',
  discountType: '',
  discountCategory: '',
  minDiscount: '',
  maxDiscount: ''
};
export function FeeReceiptList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptData[]>([]);
  // --- Helper Functions ---
  const getDiscountTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'sibling discount':
        return <Users className="w-3 h-3 mr-1" />;
      case 'merit scholarship':
        return <Award className="w-3 h-3 mr-1" />;
      case 'staff ward discount':
        return <User className="w-3 h-3 mr-1" />;
      case 'early bird discount':
      case 'annual payment discount':
        return <Gift className="w-3 h-3 mr-1" />;
      case 'defense personnel discount':
      case 'ews concession':
        return <Tag className="w-3 h-3 mr-1" />;
      case 'sports achievement':
        return <Award className="w-3 h-3 mr-1" />;
      default:
        return <Percent className="w-3 h-3 mr-1" />;
    }
  };
  const getDiscountCategoryVariant = (
  category: string)
  : 'success' | 'info' | 'warning' | 'secondary' | 'danger' | 'primary' => {
    switch (category?.toLowerCase()) {
      case 'academic':
        return 'success';
      case 'family':
        return 'info';
      case 'staff':
        return 'warning';
      case 'government':
        return 'primary';
      case 'promotional':
        return 'secondary';
      case 'achievement':
        return 'success';
      default:
        return 'secondary';
    }
  };
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  // --- Search/Filter Logic ---
  const handleSearch = () => {
    let results = [...allReceipts];
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (r) =>
        r.receiptNo.toLowerCase().includes(term) ||
        r.studentName.toLowerCase().includes(term) ||
        r.grNo.toLowerCase().includes(term) ||
        r.fatherName.toLowerCase().includes(term) ||
        r.discountType && r.discountType.toLowerCase().includes(term)
      );
    }
    // Receipt type filter
    if (filters.receiptType) {
      results = results.filter((r) => r.receiptType === filters.receiptType);
    }
    // Receipt number filter
    if (filters.receiptNo) {
      results = results.filter((r) =>
      r.receiptNo.toLowerCase().includes(filters.receiptNo.toLowerCase())
      );
    }
    // Date range filter
    if (filters.fromDate) {
      results = results.filter((r) => r.date >= filters.fromDate);
    }
    if (filters.toDate) {
      results = results.filter((r) => r.date <= filters.toDate);
    }
    // Class filter
    if (filters.class) {
      results = results.filter((r) => r.class === filters.class);
    }
    // Section filter
    if (filters.section) {
      results = results.filter((r) => r.section === filters.section);
    }
    // Payment mode filter
    if (filters.paymentMode) {
      results = results.filter(
        (r) => r.mode.toLowerCase() === filters.paymentMode.toLowerCase()
      );
    }
    // Payment status filter
    if (filters.paymentStatus) {
      switch (filters.paymentStatus) {
        case 'received':
          results = results.filter(
            (r) => r.paymentReceived && r.status === 'Active'
          );
          break;
        case 'uncleared':
          results = results.filter(
            (r) => !r.paymentReceived && r.status !== 'Cancelled'
          );
          break;
        case 'partial':
          results = results.filter((r) => r.status === 'Pending');
          break;
        case 'cancelled':
          results = results.filter((r) => r.status === 'Cancelled');
          break;
      }
    }
    // Installment filter
    if (filters.installment) {
      results = results.filter((r) =>
      r.installment.toLowerCase().includes(filters.installment.toLowerCase())
      );
    }
    // Collected by filter
    if (filters.collectedBy) {
      results = results.filter(
        (r) =>
        r.collectedBy.toLowerCase() === filters.collectedBy.toLowerCase()
      );
    }
    // Discount type filter
    if (filters.discountType) {
      results = results.filter((r) =>
      r.discountType?.
      toLowerCase().
      includes(filters.discountType.toLowerCase())
      );
    }
    // Discount category filter
    if (filters.discountCategory) {
      results = results.filter(
        (r) =>
        r.discountCategory?.toLowerCase() ===
        filters.discountCategory.toLowerCase()
      );
    }
    // Min discount filter
    if (filters.minDiscount) {
      const min = parseFloat(filters.minDiscount);
      results = results.filter((r) => (r.discountPercentage || 0) >= min);
    }
    // Max discount filter
    if (filters.maxDiscount) {
      const max = parseFloat(filters.maxDiscount);
      results = results.filter((r) => (r.discountPercentage || 0) <= max);
    }
    setFilteredReceipts(results);
    setHasSearched(true);
  };
  const handleReset = () => {
    setFilters(initialFilters);
    setHasSearched(false);
    setFilteredReceipts([]);
  };
  // --- Actions ---
  const handleViewReceipt = (receipt: ReceiptData) => {
    setSelectedReceipt(receipt);
    setShowViewPanel(true);
  };
  const handleCancelReceipt = (receipt: ReceiptData) => {
    if (receipt.paymentReceived) return;
    setSelectedReceipt(receipt);
    setShowCancelModal(true);
  };
  const canCancelReceipt = (receipt: ReceiptData) => {
    return !receipt.paymentReceived && receipt.status !== 'Cancelled';
  };
  const handleAddReceipt = () => {
    navigate('/fees/collection');
  };
  // --- Summary Calculations ---
  const displayedReceipts = hasSearched ? filteredReceipts : allReceipts;
  const regularReceipts = displayedReceipts.filter(
    (r) => r.receiptType === 'regular'
  );
  const discountReceipts = displayedReceipts.filter(
    (r) => r.receiptType === 'discount'
  );
  const totalCollection = displayedReceipts.
  filter((r) => r.status === 'Active' && r.paymentReceived).
  reduce((sum, r) => sum + r.paidAmount, 0);
  const totalDiscountAmount = discountReceipts.reduce(
    (sum, r) => sum + r.discount,
    0
  );
  const cancelledCount = displayedReceipts.filter(
    (r) => r.status === 'Cancelled'
  ).length;
  const unclearedCount = displayedReceipts.filter(
    (r) => !r.paymentReceived && r.status !== 'Cancelled'
  ).length;
  const avgDiscountPercentage =
  discountReceipts.length > 0 ?
  Math.round(
    discountReceipts.reduce(
      (sum, r) => sum + (r.discountPercentage || 0),
      0
    ) / discountReceipts.length
  ) :
  0;
  // --- Table Columns ---
  const columns = [
  {
    key: 'receiptNo',
    header: 'Receipt Details',
    render: (row: ReceiptData) =>
    <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400" />
            {row.receiptNo}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {row.date}
            <Clock className="w-3 h-3 ml-2" />
            {row.time}
          </div>
          <div className="mt-1">
            <Badge
          variant={row.receiptType === 'discount' ? 'info' : 'secondary'}
          className="text-xs">

              {row.receiptType === 'discount' ?
          <>
                  <Percent className="w-3 h-3 mr-1" />
                  Discount Receipt
                </> :

          <>
                  <Receipt className="w-3 h-3 mr-1" />
                  Regular Receipt
                </>
          }
            </Badge>
          </div>
        </div>

  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: ReceiptData) =>
    <div>
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">S/o {row.fatherName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded">{row.grNo}</span>
            <span>
              Class {row.class}-{row.section}
            </span>
            <span>Roll #{row.rollNo}</span>
          </div>
        </div>

  },
  {
    key: 'installment',
    header: 'Installment',
    render: (row: ReceiptData) =>
    <div>
          <span className="text-sm font-medium text-gray-700">
            {row.installment}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {row.feeHeads.length} fee heads
          </div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount Details',
    render: (row: ReceiptData) =>
    <div className="text-right">
          <div className="font-semibold text-gray-900">
            ₹{row.paidAmount.toLocaleString()}
          </div>
          {row.receiptType === 'discount' && row.discountPercentage &&
      <div className="text-xs text-green-600 flex items-center justify-end gap-1">
              <TrendingDown className="w-3 h-3" />
              {row.discountPercentage}% OFF (₹{row.discount.toLocaleString()})
            </div>
      }
          {row.receiptType === 'regular' && row.discount > 0 &&
      <div className="text-xs text-green-600">
              Discount: ₹{row.discount.toLocaleString()}
            </div>
      }
          {row.fine > 0 &&
      <div className="text-xs text-red-600">
              Fine: ₹{row.fine.toLocaleString()}
            </div>
      }
          {row.paidAmount < row.netAmount &&
      <div className="text-xs text-orange-600">
              Due: ₹{(row.netAmount - row.paidAmount).toLocaleString()}
            </div>
      }
        </div>

  },
  {
    key: 'discount',
    header: 'Discount Info',
    render: (row: ReceiptData) =>
    <div>
          {row.receiptType === 'discount' && row.discountType ?
      <>
              <Badge
          variant={getDiscountCategoryVariant(row.discountCategory || '')}
          className="mb-1">

                {getDiscountTypeIcon(row.discountType)}
                {row.discountType}
              </Badge>
              <div className="text-xs text-gray-500">
                {row.discountCategory}
              </div>
            </> :

      <span className="text-xs text-gray-400">-</span>
      }
        </div>

  },
  {
    key: 'mode',
    header: 'Payment Mode',
    render: (row: ReceiptData) =>
    <div>
          <Badge variant="secondary" className="mb-1">
            {row.mode === 'Online' && <Smartphone className="w-3 h-3 mr-1" />}
            {row.mode === 'Cash' && <Banknote className="w-3 h-3 mr-1" />}
            {row.mode === 'Cheque' && <FileText className="w-3 h-3 mr-1" />}
            {row.mode === 'UPI' && <Wallet className="w-3 h-3 mr-1" />}
            {row.mode === 'Card' && <CreditCard className="w-3 h-3 mr-1" />}
            {row.mode}
          </Badge>
          {row.transactionId &&
      <div className="text-xs text-gray-500 truncate max-w-[120px]">
              Txn: {row.transactionId}
            </div>
      }
          {row.chequeNo &&
      <div className="text-xs text-gray-500">Chq: {row.chequeNo}</div>
      }
        </div>

  },
  {
    key: 'paymentStatus',
    header: 'Status',
    render: (row: ReceiptData) =>
    <div>
          <Badge
        variant={
        row.status === 'Active' && row.paymentReceived ?
        'success' :
        row.status === 'Uncleared' || !row.paymentReceived ?
        'warning' :
        row.status === 'Pending' ?
        'warning' :
        'danger'
        }>

            {row.status === 'Active' && row.paymentReceived &&
        <CheckCheck className="w-3 h-3 mr-1" />
        }
            {(row.status === 'Uncleared' ||
        !row.paymentReceived && row.status !== 'Cancelled') &&
        <Clock className="w-3 h-3 mr-1" />
        }
            {row.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
            {row.status === 'Cancelled' && <XCircle className="w-3 h-3 mr-1" />}
            {row.status === 'Cancelled' ?
        'Cancelled' :
        row.paymentReceived ?
        row.status === 'Pending' ?
        'Partial Paid' :
        'Received' :
        'Uncleared'}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">
            By: {row.collectedBy}
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ReceiptData) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="View Receipt"
        onClick={() => handleViewReceipt(row)}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Print Receipt">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Download PDF">
            <Download className="w-4 h-4" />
          </Button>
          {canCancelReceipt(row) ?
      <Button
        variant="ghost"
        size="sm"
        title="Cancel Receipt"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => handleCancelReceipt(row)}>

              <XCircle className="w-4 h-4" />
            </Button> :
      row.status !== 'Cancelled' && row.paymentReceived ?
      <Button
        variant="ghost"
        size="sm"
        title="Cannot cancel - Payment already received"
        className="text-gray-300 cursor-not-allowed"
        disabled>

              <Ban className="w-4 h-4" />
            </Button> :
      null}
        </div>

  }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Receipt Management
          </h1>
          <p className="text-sm text-gray-500">
            Search and manage all fee payment receipts including discount
            receipts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            disabled={!hasSearched || filteredReceipts.length === 0}>

            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Search Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Search Receipts
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}>

            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
            {showFilters ?
            <ChevronUp className="w-4 h-4 ml-2" /> :

            <ChevronDown className="w-4 h-4 ml-2" />
            }
          </Button>
        </div>

        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Receipt No, Student Name, GR No, Discount Type..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>

          <Select
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            options={[
            {
              value: '2024-2025',
              label: '2024-2025'
            },
            {
              value: '2023-2024',
              label: '2023-2024'
            },
            {
              value: '2022-2023',
              label: '2022-2023'
            }]
            } />

        </div>

        {/* Extended Filters */}
        {showFilters &&
        <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <Input
              label="From Date"
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)} />

              <Input
              label="To Date"
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)} />

              <Select
              label="Class"
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              options={[
              {
                value: '',
                label: 'All Classes'
              },
              {
                value: '6',
                label: 'Class 6'
              },
              {
                value: '7',
                label: 'Class 7'
              },
              {
                value: '8',
                label: 'Class 8'
              },
              {
                value: '9',
                label: 'Class 9'
              },
              {
                value: '10',
                label: 'Class 10'
              },
              {
                value: '11',
                label: 'Class 11'
              },
              {
                value: '12',
                label: 'Class 12'
              }]
              } />

              <Select
              label="Section"
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              options={[
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
              }]
              } />

              <Select
              label="Payment Mode"
              value={filters.paymentMode}
              onChange={(e) =>
              handleFilterChange('paymentMode', e.target.value)
              }
              options={[
              {
                value: '',
                label: 'All Modes'
              },
              {
                value: 'cash',
                label: 'Cash'
              },
              {
                value: 'online',
                label: 'Online'
              },
              {
                value: 'cheque',
                label: 'Cheque'
              },
              {
                value: 'upi',
                label: 'UPI'
              },
              {
                value: 'card',
                label: 'Card'
              }]
              } />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <Select
              label="Payment Status"
              value={filters.paymentStatus}
              onChange={(e) =>
              handleFilterChange('paymentStatus', e.target.value)
              }
              options={[
              {
                value: '',
                label: 'All Status'
              },
              {
                value: 'received',
                label: 'Received'
              },
              {
                value: 'uncleared',
                label: 'Uncleared'
              },
              {
                value: 'partial',
                label: 'Partial Paid'
              },
              {
                value: 'cancelled',
                label: 'Cancelled'
              }]
              } />

              <Select
              label="Installment"
              value={filters.installment}
              onChange={(e) =>
              handleFilterChange('installment', e.target.value)
              }
              options={[
              {
                value: '',
                label: 'All Installments'
              },
              {
                value: 'term1',
                label: 'Term 1 (Apr-Jul)'
              },
              {
                value: 'term2',
                label: 'Term 2 (Aug-Nov)'
              },
              {
                value: 'term3',
                label: 'Term 3 (Dec-Mar)'
              }]
              } />

              <Select
              label="Collected By"
              value={filters.collectedBy}
              onChange={(e) =>
              handleFilterChange('collectedBy', e.target.value)
              }
              options={[
              {
                value: '',
                label: 'All Staff'
              },
              {
                value: 'admin',
                label: 'Admin'
              },
              {
                value: 'accountant',
                label: 'Accountant'
              }]
              } />

              <Input
              label="Receipt No"
              placeholder="RCP-2024-XXX"
              value={filters.receiptNo}
              onChange={(e) =>
              handleFilterChange('receiptNo', e.target.value)
              } />

              <div></div>
            </div>

            {/* Discount-specific filters */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Discount Receipt Filters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                label="Discount Type"
                value={filters.discountType}
                onChange={(e) =>
                handleFilterChange('discountType', e.target.value)
                }
                options={[
                {
                  value: '',
                  label: 'All Types'
                },
                {
                  value: 'sibling',
                  label: 'Sibling Discount'
                },
                {
                  value: 'merit',
                  label: 'Merit Scholarship'
                },
                {
                  value: 'early bird',
                  label: 'Early Bird'
                },
                {
                  value: 'staff',
                  label: 'Staff Ward'
                },
                {
                  value: 'defense',
                  label: 'Defense Personnel'
                },
                {
                  value: 'ews',
                  label: 'EWS Concession'
                },
                {
                  value: 'sports',
                  label: 'Sports Achievement'
                }]
                } />


                <Input
                label="Min Discount %"
                type="number"
                placeholder="0"
                value={filters.minDiscount}
                onChange={(e) =>
                handleFilterChange('minDiscount', e.target.value)
                } />

                <Input
                label="Max Discount %"
                type="number"
                placeholder="100"
                value={filters.maxDiscount}
                onChange={(e) =>
                handleFilterChange('maxDiscount', e.target.value)
                } />

              </div>
            </div>
          </div>
        }

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            leftIcon={<Search className="h-4 w-4" />}
            onClick={handleSearch}>

            Search Receipts
          </Button>
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={handleReset}>

            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      {hasSearched &&
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredReceipts.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">receipts found</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Collection</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalCollection.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">confirmed payments</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Regular Receipts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {regularReceipts.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">without discount</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Discount Receipts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {discountReceipts.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Avg: {avgDiscountPercentage}% off
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Percent className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Discounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalDiscountAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">amount discounted</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled/Uncleared</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cancelledCount + unclearedCount}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {cancelledCount} cancelled, {unclearedCount} uncleared
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">
              Receipt Management Information
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              This unified view shows both regular and discount receipts. Use
              the filters to narrow down your search. Receipts can only be
              cancelled if payment has not yet been received. Discount receipts
              show special concessions applied to student fees.
            </p>
          </div>
        </div>
      </Card>

      {/* Results */}
      {hasSearched &&
      <Card>
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {filteredReceipts.length} receipts found
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {regularReceipts.length} Regular
                  </Badge>
                  <Badge variant="info">
                    {discountReceipts.length} Discount
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print List
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {filteredReceipts.length > 0 ?
        <>
              <Table columns={columns} data={filteredReceipts} />
              <div className="flex justify-between items-center p-4 border-t border-gray-200 text-sm text-gray-500">
                <span>Showing {filteredReceipts.length} receipts</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </> :

        <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Receipts Found
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                No receipts match your search criteria. Try adjusting your
                filters.
              </p>
            </div>
        }
        </Card>
      }

      {/* Initial State */}
      {!hasSearched &&
      <Card>
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-blue-50 p-4 mb-4">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Search for Receipts
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Use the search filters above to find fee receipts. You can search
              for both regular and discount receipts.
            </p>
          </div>
        </Card>
      }

      {/* View Receipt Panel */}
      {showViewPanel && selectedReceipt &&
      <div className="fixed inset-0 z-50 overflow-hidden">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowViewPanel(false)} />

          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Receipt Details
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedReceipt.receiptNo}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowViewPanel(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  ABC International School
                </h3>
                <p className="text-sm text-gray-500">
                  123, Education Street, City - 400001
                </p>
                <p className="text-sm text-gray-500">
                  Phone: 1234567890 | Email: info@school.com
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge
                  variant={
                  selectedReceipt.receiptType === 'discount' ?
                  'info' :
                  'secondary'
                  }>

                    {selectedReceipt.receiptType === 'discount' ?
                  'Discount Receipt' :
                  'Regular Receipt'}
                  </Badge>
                  <Badge
                  variant={
                  selectedReceipt.status === 'Active' &&
                  selectedReceipt.paymentReceived ?
                  'success' :
                  selectedReceipt.status === 'Cancelled' ?
                  'danger' :
                  'warning'
                  }>

                    {selectedReceipt.status === 'Cancelled' ?
                  'Cancelled' :
                  selectedReceipt.paymentReceived ?
                  selectedReceipt.status === 'Pending' ?
                  'Partial Paid' :
                  'Received' :
                  'Uncleared'}
                  </Badge>
                  {selectedReceipt.discountPercentage &&
                <Badge variant="success">
                      {selectedReceipt.discountPercentage}% Discount
                    </Badge>
                }
                </div>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm text-gray-500">
                    Receipt Number
                  </label>
                  <p className="font-semibold text-gray-900">
                    {selectedReceipt.receiptNo}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Receipt Date</label>
                  <p className="font-semibold text-gray-900">
                    {selectedReceipt.date} at {selectedReceipt.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Original Payment Date
                  </label>
                  <p className="font-semibold text-gray-900">
                    {selectedReceipt.originalPaymentDate}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Entry Type</label>
                  <p className="font-semibold text-gray-900 capitalize">
                    {selectedReceipt.entryType} Entry
                  </p>
                </div>
              </div>

              {/* Payment Status Card */}
              <Card
              className={`p-4 ${selectedReceipt.paymentReceived ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>

                <div className="flex items-center gap-3">
                  {selectedReceipt.paymentReceived ?
                <CheckCheck className="w-6 h-6 text-green-600" /> :

                <Clock className="w-6 h-6 text-yellow-600" />
                }
                  <div>
                    <h4
                    className={`font-semibold ${selectedReceipt.paymentReceived ? 'text-green-900' : 'text-yellow-900'}`}>

                      {selectedReceipt.paymentReceived ?
                    'Payment Received' :
                    'Payment Uncleared'}
                    </h4>
                    <p
                    className={`text-sm ${selectedReceipt.paymentReceived ? 'text-green-700' : 'text-yellow-700'}`}>

                      {selectedReceipt.paymentReceived ?
                    `Payment was confirmed on ${selectedReceipt.paymentReceivedDate}` :
                    'Awaiting payment confirmation from bank'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Student Details */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Student Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Student Name</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Father's Name</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.fatherName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">GR Number</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.grNo}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Class & Section</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.class}-{selectedReceipt.section}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Roll Number</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.rollNo}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Installment</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.installment}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Discount Details (for discount receipts) */}
              {selectedReceipt.receiptType === 'discount' &&
            selectedReceipt.discountType &&
            <Card className="p-4 bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      Discount Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-green-700">Discount Type</label>
                        <p className="font-medium text-green-900">
                          {selectedReceipt.discountType}
                        </p>
                      </div>
                      <div>
                        <label className="text-green-700">
                          Discount Category
                        </label>
                        <p className="font-medium text-green-900">
                          {selectedReceipt.discountCategory}
                        </p>
                      </div>
                      <div>
                        <label className="text-green-700">
                          Discount Percentage
                        </label>
                        <p className="font-bold text-green-900 text-lg">
                          {selectedReceipt.discountPercentage}%
                        </p>
                      </div>
                      <div>
                        <label className="text-green-700">
                          Total Discount Amount
                        </label>
                        <p className="font-bold text-green-900 text-lg">
                          ₹{selectedReceipt.discount.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-green-700">
                          Reason for Discount
                        </label>
                        <p className="font-medium text-green-900">
                          {selectedReceipt.discountReason}
                        </p>
                      </div>
                      <div>
                        <label className="text-green-700">Approved By</label>
                        <p className="font-medium text-green-900">
                          {selectedReceipt.discountApprovedBy}
                        </p>
                      </div>
                      <div>
                        <label className="text-green-700">Approval Date</label>
                        <p className="font-medium text-green-900">
                          {selectedReceipt.discountApprovedDate}
                        </p>
                      </div>
                    </div>
                  </Card>
            }

              {/* Fee Breakdown */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Fee Breakdown
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Fee Head</th>
                      {selectedReceipt.receiptType === 'discount' ?
                    <>
                          <th className="text-right py-2 text-gray-600">
                            Original
                          </th>
                          <th className="text-right py-2 text-gray-600">
                            Discount
                          </th>
                          <th className="text-right py-2 text-gray-600">
                            Net Amount
                          </th>
                        </> :

                    <th className="text-right py-2 text-gray-600">
                          Amount
                        </th>
                    }
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.feeHeads.map((feeHead, index) =>
                  <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-gray-700">{feeHead.name}</td>
                        {selectedReceipt.receiptType === 'discount' ?
                    <>
                            <td className="py-2 text-right text-gray-500">
                              ₹{(feeHead.originalAmount || 0).toLocaleString()}
                            </td>
                            <td className="py-2 text-right text-red-600">
                              {(feeHead.discountAmount || 0) > 0 ?
                        `-₹${(feeHead.discountAmount || 0).toLocaleString()}` :
                        '-'}
                            </td>
                            <td className="py-2 text-right text-gray-900 font-medium">
                              ₹{(feeHead.netAmount || 0).toLocaleString()}
                            </td>
                          </> :

                    <td className="py-2 text-right text-gray-900">
                            ₹{(feeHead.amount || 0).toLocaleString()}
                          </td>
                    }
                      </tr>
                  )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td className="py-2 font-medium text-gray-700">
                        Subtotal
                      </td>
                      <td
                      className="py-2 text-right font-medium text-gray-900"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                        ₹{selectedReceipt.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                    {selectedReceipt.discount > 0 &&
                  <tr className="text-green-600">
                        <td className="py-2">Discount</td>
                        <td
                      className="py-2 text-right"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                          -₹{selectedReceipt.discount.toLocaleString()}
                        </td>
                      </tr>
                  }
                    {selectedReceipt.fine > 0 &&
                  <tr className="text-red-600">
                        <td className="py-2">Late Fee / Fine</td>
                        <td
                      className="py-2 text-right"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                          +₹{selectedReceipt.fine.toLocaleString()}
                        </td>
                      </tr>
                  }
                    <tr className="border-t-2 border-gray-300">
                      <td className="py-2 font-bold text-gray-900">
                        Net Amount
                      </td>
                      <td
                      className="py-2 text-right font-bold text-gray-900"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                        ₹{selectedReceipt.netAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-2 font-bold text-green-700">
                        Amount Paid
                      </td>
                      <td
                      className="py-2 text-right font-bold text-green-700 text-lg"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                        ₹{selectedReceipt.paidAmount.toLocaleString()}
                      </td>
                    </tr>
                    {selectedReceipt.paidAmount < selectedReceipt.netAmount &&
                  <tr className="bg-orange-50">
                        <td className="py-2 font-medium text-orange-700">
                          Balance Due
                        </td>
                        <td
                      className="py-2 text-right font-bold text-orange-700"
                      colSpan={
                      selectedReceipt.receiptType === 'discount' ? 3 : 1
                      }>

                          ₹
                          {(
                      selectedReceipt.netAmount -
                      selectedReceipt.paidAmount).
                      toLocaleString()}
                        </td>
                      </tr>
                  }
                  </tfoot>
                </table>
              </Card>

              {/* Payment Details */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Payment Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Payment Mode</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.mode}
                    </p>
                  </div>
                  {selectedReceipt.transactionId &&
                <div>
                      <label className="text-gray-500">Transaction ID</label>
                      <p className="font-medium text-gray-900">
                        {selectedReceipt.transactionId}
                      </p>
                    </div>
                }
                  {selectedReceipt.chequeNo &&
                <>
                      <div>
                        <label className="text-gray-500">Cheque Number</label>
                        <p className="font-medium text-gray-900">
                          {selectedReceipt.chequeNo}
                        </p>
                      </div>
                      {selectedReceipt.chequeDate &&
                  <div>
                          <label className="text-gray-500">Cheque Date</label>
                          <p className="font-medium text-gray-900">
                            {selectedReceipt.chequeDate}
                          </p>
                        </div>
                  }
                    </>
                }
                  {selectedReceipt.bankName &&
                <div>
                      <label className="text-gray-500">Bank Name</label>
                      <p className="font-medium text-gray-900">
                        {selectedReceipt.bankName}
                      </p>
                    </div>
                }
                  <div>
                    <label className="text-gray-500">Collected By</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.collectedBy}
                    </p>
                  </div>
                </div>
                {selectedReceipt.remarks &&
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm text-gray-500">Remarks</label>
                    <p className="text-gray-700">{selectedReceipt.remarks}</p>
                  </div>
              }
              </Card>

              {/* Cancellation Details */}
              {selectedReceipt.status === 'Cancelled' &&
            selectedReceipt.cancelledBy &&
            <Card className="p-4 bg-red-50 border-red-200">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      Cancellation Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-red-700">Cancelled By</label>
                        <p className="font-medium text-red-900">
                          {selectedReceipt.cancelledBy}
                        </p>
                      </div>
                      <div>
                        <label className="text-red-700">Cancelled On</label>
                        <p className="font-medium text-red-900">
                          {selectedReceipt.cancelledDate}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-red-700">Reason</label>
                        <p className="font-medium text-red-900">
                          {selectedReceipt.cancelReason}
                        </p>
                      </div>
                    </div>
                  </Card>
            }

              {/* Cancel Option for Uncleared */}
              {canCancelReceipt(selectedReceipt) &&
            <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-900">
                          Receipt Can Be Cancelled
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Payment has not been received yet. You can cancel this
                          receipt if needed.
                        </p>
                      </div>
                    </div>
                    <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => {
                    setShowViewPanel(false);
                    handleCancelReceipt(selectedReceipt);
                  }}>

                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Receipt
                    </Button>
                  </div>
                </Card>
            }

              {/* Footer Note */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                <p>
                  This is a computer generated receipt and does not require
                  signature.
                </p>
                <p className="mt-1">
                  For any queries, please contact the accounts department.
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Cancel Receipt Modal */}
      {showCancelModal && selectedReceipt &&
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowCancelModal(false)} />

          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cancel Receipt
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedReceipt.receiptNo}
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="text-gray-500">Student</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Amount</label>
                    <p className="font-medium text-gray-900">
                      ₹{selectedReceipt.paidAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Payment Mode</label>
                    <p className="font-medium text-gray-900">
                      {selectedReceipt.mode}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Payment Status</label>
                    <Badge variant="warning">Uncleared</Badge>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                This receipt can be cancelled because the school has not yet
                received the payment.
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Cancellation{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Cheque bounced, Payment failed, Wrong entry..." />

              </div>

              <div className="p-3 bg-yellow-50 rounded-lg mb-6 text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Warning: This action cannot be undone. The receipt will be
                marked as cancelled.
              </div>

              <div className="flex justify-end gap-3">
                <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}>

                  Keep Receipt
                </Button>
                <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                disabled={!cancelReason.trim()}
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  // Handle cancellation logic here
                }}>

                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}