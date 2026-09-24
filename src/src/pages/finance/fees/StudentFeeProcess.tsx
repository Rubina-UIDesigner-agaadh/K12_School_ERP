import React, { useMemo, useState } from 'react';
import {
  Search,
  Settings,
  FileText,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  Download,
  Printer,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  X,
  Check,
  Info,
  AlertTriangle,
  IndianRupee,
  History,
  Receipt,
  Percent,
  Award,
  Building,
  GraduationCap,
  Bus,
  Home,
  Utensils,
  BookOpen,
  Hash,
  IdCard,
  MapPin,
  RotateCcw,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Save,
  Lock,
  Unlock,
  FileSpreadsheet,
  Bell,
  Users } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// ============================================
// TYPE DEFINITIONS
// ============================================
interface Student {
  id: string;
  grNo: string;
  suId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  admissionDate: string;
  academicYear: string;
  feeCategory: string;
  photoUrl?: string;
  hasTransport: boolean;
  hasHostel: boolean;
  transportRoute?: string;
  hostelBlock?: string;
}
interface FeeHead {
  id: string;
  name: string;
  description: string;
  category:
  'tuition' |
  'transport' |
  'hostel' |
  'lab' |
  'activity' |
  'exam' |
  'other';
  isOptional: boolean;
  frequency: 'annual' | 'term' | 'monthly';
}
interface FeeStructureItem {
  id: string;
  feeHeadId: string;
  feeHead: FeeHead;
  term1Amount: number;
  term2Amount: number;
  term3Amount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  isCustomized: boolean;
  originalAmount?: number;
  customizationReason?: string;
}
interface Discount {
  id: string;
  type: 'percentage' | 'fixed';
  name: string;
  description: string;
  category:
  'sibling' |
  'staff-ward' |
  'merit' |
  'financial' |
  'early-bird' |
  'scholarship' |
  'special' |
  'other';
  value: number;
  maxAmount?: number;
  applicableFeeHeads: string[] | 'all';
  appliedAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'expired' | 'pending';
  approvedBy?: string;
  approvalDate?: string;
  remarks?: string;
}
interface Adjustment {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  description: string;
  feeHeadId?: string;
  feeHeadName?: string;
  effectiveDate: string;
  createdBy: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  remarks?: string;
  referenceNo: string;
}
interface LedgerEntry {
  id: string;
  date: string;
  type:
  'demand' |
  'payment' |
  'discount' |
  'adjustment' |
  'refund' |
  'carry-forward';
  description: string;
  referenceNo?: string;
  debit: number;
  credit: number;
  balance: number;
  feeHead?: string;
  term?: string;
  paymentMode?: string;
  createdBy: string;
}
interface TermSummary {
  term: string;
  totalDemand: number;
  totalDiscount: number;
  totalPaid: number;
  totalBalance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}
type TabType = 'structure' | 'discounts' | 'adjustments' | 'ledger';
// ============================================
// MOCK DATA
// ============================================
const mockFeeHeads: FeeHead[] = [
{
  id: 'tuition',
  name: 'Tuition Fee',
  description: 'Academic tuition charges',
  category: 'tuition',
  isOptional: false,
  frequency: 'term'
},
{
  id: 'admission',
  name: 'Admission Fee',
  description: 'One-time admission charges',
  category: 'other',
  isOptional: false,
  frequency: 'annual'
},
{
  id: 'development',
  name: 'Development Fee',
  description: 'Infrastructure development charges',
  category: 'other',
  isOptional: false,
  frequency: 'annual'
},
{
  id: 'lab-science',
  name: 'Science Lab Fee',
  description: 'Physics, Chemistry, Biology lab charges',
  category: 'lab',
  isOptional: false,
  frequency: 'term'
},
{
  id: 'lab-computer',
  name: 'Computer Lab Fee',
  description: 'Computer education charges',
  category: 'lab',
  isOptional: false,
  frequency: 'term'
},
{
  id: 'library',
  name: 'Library Fee',
  description: 'Library and reading room charges',
  category: 'other',
  isOptional: false,
  frequency: 'annual'
},
{
  id: 'sports',
  name: 'Sports Fee',
  description: 'Sports activities and equipment',
  category: 'activity',
  isOptional: false,
  frequency: 'term'
},
{
  id: 'exam',
  name: 'Examination Fee',
  description: 'Term examination charges',
  category: 'exam',
  isOptional: false,
  frequency: 'term'
},
{
  id: 'transport',
  name: 'Transport Fee',
  description: 'School bus charges',
  category: 'transport',
  isOptional: true,
  frequency: 'term'
},
{
  id: 'activity',
  name: 'Activity Fee',
  description: 'Co-curricular activities',
  category: 'activity',
  isOptional: true,
  frequency: 'term'
}];

const getMockStudent = (): Student => ({
  id: '1',
  grNo: 'GR2024001',
  suId: 'SU12345678',
  firstName: 'Rahul',
  middleName: 'Kumar',
  lastName: 'Sharma',
  class: '10',
  section: 'A',
  department: 'Science',
  rollNo: '15',
  dateOfBirth: '2009-05-15',
  gender: 'Male',
  bloodGroup: 'B+',
  address: '123, Green Park, Sector 22, New Delhi - 110001',
  parentName: 'Mr. Amit Sharma',
  parentPhone: '+91 98765 43210',
  parentEmail: 'amit.sharma@email.com',
  admissionDate: '2020-04-01',
  academicYear: '2024-25',
  feeCategory: 'General',
  hasTransport: true,
  hasHostel: false,
  transportRoute: 'Route 2 - Sector 22 (5-10 km)'
});
const getMockFeeStructure = (): FeeStructureItem[] => [
{
  id: 'fs1',
  feeHeadId: 'tuition',
  feeHead: mockFeeHeads.find((f) => f.id === 'tuition')!,
  term1Amount: 25000,
  term2Amount: 25000,
  term3Amount: 0,
  totalAmount: 50000,
  paidAmount: 25000,
  balanceAmount: 25000,
  dueDate: '2024-07-15',
  status: 'partial',
  isCustomized: false
},
{
  id: 'fs2',
  feeHeadId: 'development',
  feeHead: mockFeeHeads.find((f) => f.id === 'development')!,
  term1Amount: 10000,
  term2Amount: 0,
  term3Amount: 0,
  totalAmount: 10000,
  paidAmount: 10000,
  balanceAmount: 0,
  dueDate: '2024-04-30',
  status: 'paid',
  isCustomized: false
},
{
  id: 'fs3',
  feeHeadId: 'lab-science',
  feeHead: mockFeeHeads.find((f) => f.id === 'lab-science')!,
  term1Amount: 4000,
  term2Amount: 4000,
  term3Amount: 0,
  totalAmount: 8000,
  paidAmount: 4000,
  balanceAmount: 4000,
  dueDate: '2024-07-15',
  status: 'partial',
  isCustomized: true,
  originalAmount: 10000,
  customizationReason: 'Concession applied for merit student'
},
{
  id: 'fs4',
  feeHeadId: 'lab-computer',
  feeHead: mockFeeHeads.find((f) => f.id === 'lab-computer')!,
  term1Amount: 2500,
  term2Amount: 2500,
  term3Amount: 0,
  totalAmount: 5000,
  paidAmount: 2500,
  balanceAmount: 2500,
  dueDate: '2024-07-15',
  status: 'partial',
  isCustomized: false
},
{
  id: 'fs5',
  feeHeadId: 'library',
  feeHead: mockFeeHeads.find((f) => f.id === 'library')!,
  term1Amount: 2000,
  term2Amount: 0,
  term3Amount: 0,
  totalAmount: 2000,
  paidAmount: 2000,
  balanceAmount: 0,
  dueDate: '2024-04-30',
  status: 'paid',
  isCustomized: false
},
{
  id: 'fs6',
  feeHeadId: 'sports',
  feeHead: mockFeeHeads.find((f) => f.id === 'sports')!,
  term1Amount: 2000,
  term2Amount: 2000,
  term3Amount: 0,
  totalAmount: 4000,
  paidAmount: 2000,
  balanceAmount: 2000,
  dueDate: '2024-07-15',
  status: 'partial',
  isCustomized: false
},
{
  id: 'fs7',
  feeHeadId: 'exam',
  feeHead: mockFeeHeads.find((f) => f.id === 'exam')!,
  term1Amount: 1500,
  term2Amount: 1500,
  term3Amount: 0,
  totalAmount: 3000,
  paidAmount: 1500,
  balanceAmount: 1500,
  dueDate: '2024-08-01',
  status: 'partial',
  isCustomized: false
},
{
  id: 'fs8',
  feeHeadId: 'transport',
  feeHead: mockFeeHeads.find((f) => f.id === 'transport')!,
  term1Amount: 6000,
  term2Amount: 6000,
  term3Amount: 0,
  totalAmount: 12000,
  paidAmount: 6000,
  balanceAmount: 6000,
  dueDate: '2024-07-15',
  status: 'partial',
  isCustomized: false
}];

const getMockDiscounts = (): Discount[] => [
{
  id: 'disc1',
  type: 'percentage',
  name: 'Merit Scholarship',
  description: 'Academic excellence scholarship for top performers',
  category: 'merit',
  value: 10,
  applicableFeeHeads: ['tuition'],
  appliedAmount: 5000,
  effectiveFrom: '2024-04-01',
  effectiveTo: '2025-03-31',
  status: 'active',
  approvedBy: 'Principal',
  approvalDate: '2024-03-15',
  remarks: 'Awarded for securing 95%+ in previous year'
},
{
  id: 'disc2',
  type: 'fixed',
  name: 'Sibling Discount',
  description: 'Discount for students with siblings in the school',
  category: 'sibling',
  value: 3000,
  applicableFeeHeads: 'all',
  appliedAmount: 3000,
  effectiveFrom: '2024-04-01',
  status: 'active',
  approvedBy: 'Accounts Head',
  approvalDate: '2024-03-20',
  remarks: 'Elder sibling: Priya Sharma (Class 12-A)'
}];

const getMockAdjustments = (): Adjustment[] => [
{
  id: 'adj1',
  type: 'credit',
  amount: 2000,
  reason: 'Fee Waiver',
  description: 'Partial lab fee waiver approved by management',
  feeHeadId: 'lab-science',
  feeHeadName: 'Science Lab Fee',
  effectiveDate: '2024-04-10',
  createdBy: 'Accounts Officer',
  createdAt: '2024-04-10 10:30 AM',
  status: 'approved',
  approvedBy: 'Principal',
  approvalDate: '2024-04-11',
  referenceNo: 'ADJ2024/001',
  remarks: 'Merit student fee reduction'
},
{
  id: 'adj2',
  type: 'debit',
  amount: 500,
  reason: 'Late Payment Penalty',
  description: 'Late fee penalty for Term 1 delayed payment',
  effectiveDate: '2024-06-05',
  createdBy: 'System',
  createdAt: '2024-06-05 00:00 AM',
  status: 'approved',
  referenceNo: 'ADJ2024/002',
  remarks: 'Auto-generated: Payment received 20 days after due date'
}];

const getMockLedger = (): LedgerEntry[] => [
{
  id: 'led1',
  date: '2024-04-01',
  type: 'demand',
  description: 'Fee Demand Generated - Term 1 (2024-25)',
  debit: 53000,
  credit: 0,
  balance: 53000,
  term: 'Term 1',
  createdBy: 'System'
},
{
  id: 'led2',
  date: '2024-04-05',
  type: 'discount',
  description: 'Merit Scholarship Applied (10% on Tuition)',
  referenceNo: 'DISC/2024/001',
  debit: 0,
  credit: 2500,
  balance: 50500,
  feeHead: 'Tuition Fee',
  createdBy: 'Admin'
},
{
  id: 'led3',
  date: '2024-04-05',
  type: 'discount',
  description: 'Sibling Discount Applied',
  referenceNo: 'DISC/2024/002',
  debit: 0,
  credit: 1500,
  balance: 49000,
  createdBy: 'Admin'
},
{
  id: 'led4',
  date: '2024-04-10',
  type: 'adjustment',
  description: 'Lab Fee Waiver - Credit Adjustment',
  referenceNo: 'ADJ2024/001',
  debit: 0,
  credit: 2000,
  balance: 47000,
  feeHead: 'Science Lab Fee',
  createdBy: 'Accounts Officer'
},
{
  id: 'led5',
  date: '2024-04-15',
  type: 'payment',
  description: 'Fee Payment Received',
  referenceNo: 'RCP2024/001234',
  debit: 0,
  credit: 35000,
  balance: 12000,
  paymentMode: 'Online Transfer',
  createdBy: 'Cashier'
},
{
  id: 'led6',
  date: '2024-05-20',
  type: 'payment',
  description: 'Fee Payment Received',
  referenceNo: 'RCP2024/002567',
  debit: 0,
  credit: 12000,
  balance: 0,
  paymentMode: 'Cheque',
  createdBy: 'Cashier'
},
{
  id: 'led7',
  date: '2024-06-05',
  type: 'adjustment',
  description: 'Late Payment Penalty',
  referenceNo: 'ADJ2024/002',
  debit: 500,
  credit: 0,
  balance: 500,
  createdBy: 'System'
},
{
  id: 'led8',
  date: '2024-07-01',
  type: 'demand',
  description: 'Fee Demand Generated - Term 2 (2024-25)',
  debit: 41000,
  credit: 0,
  balance: 41500,
  term: 'Term 2',
  createdBy: 'System'
},
{
  id: 'led9',
  date: '2024-07-01',
  type: 'discount',
  description: 'Merit Scholarship Applied (10% on Tuition)',
  referenceNo: 'DISC/2024/003',
  debit: 0,
  credit: 2500,
  balance: 39000,
  feeHead: 'Tuition Fee',
  createdBy: 'Admin'
},
{
  id: 'led10',
  date: '2024-07-01',
  type: 'discount',
  description: 'Sibling Discount Applied',
  referenceNo: 'DISC/2024/004',
  debit: 0,
  credit: 1500,
  balance: 37500,
  createdBy: 'Admin'
}];

// ============================================
// OPTIONS
// ============================================
const academicYearOptions = [
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
}];

const discountCategoryOptions = [
{
  value: 'sibling',
  label: 'Sibling Discount'
},
{
  value: 'staff-ward',
  label: 'Staff Ward'
},
{
  value: 'merit',
  label: 'Merit Scholarship'
},
{
  value: 'financial',
  label: 'Financial Aid'
},
{
  value: 'early-bird',
  label: 'Early Bird Discount'
},
{
  value: 'scholarship',
  label: 'External Scholarship'
},
{
  value: 'special',
  label: 'Special Discount'
},
{
  value: 'other',
  label: 'Other'
}];

const adjustmentReasonOptions = [
{
  value: 'fee-waiver',
  label: 'Fee Waiver'
},
{
  value: 'correction',
  label: 'Correction/Error Fix'
},
{
  value: 'penalty',
  label: 'Late Payment Penalty'
},
{
  value: 'refund',
  label: 'Refund Adjustment'
},
{
  value: 'carry-forward',
  label: 'Carry Forward'
},
{
  value: 'write-off',
  label: 'Write Off'
},
{
  value: 'other',
  label: 'Other'
}];

// ============================================
// FEE CATEGORY ICON
// ============================================
const FeeCategoryIcon: React.FC<{
  category: string;
  className?: string;
}> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'tuition':
      return <GraduationCap className={className} />;
    case 'transport':
      return <Bus className={className} />;
    case 'hostel':
      return <Home className={className} />;
    case 'lab':
      return <BookOpen className={className} />;
    case 'activity':
      return <Award className={className} />;
    case 'exam':
      return <FileText className={className} />;
    default:
      return <IndianRupee className={className} />;
  }
};
// ============================================
// MAIN COMPONENT
// ============================================
export function StudentFeeProcess() {
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [isSearching, setIsSearching] = useState(false);
  // Student Data
  const [student, setStudent] = useState<Student | null>(null);
  const [feeStructure, setFeeStructure] = useState<FeeStructureItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  // Tab State - Changed to controlled state
  const [activeTab, setActiveTab] = useState<TabType>('structure');
  // Modal States
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [showAddAdjustmentModal, setShowAddAdjustmentModal] = useState(false);
  const [showLedgerDetailModal, setShowLedgerDetailModal] = useState(false);
  const [selectedLedgerEntry, setSelectedLedgerEntry] =
  useState<LedgerEntry | null>(null);
  const [editingFeeItem, setEditingFeeItem] = useState<FeeStructureItem | null>(
    null
  );
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  // Form States for Add Discount
  const [newDiscountType, setNewDiscountType] = useState<
    'percentage' | 'fixed'>(
    'percentage');
  const [newDiscountCategory, setNewDiscountCategory] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState('');
  const [newDiscountName, setNewDiscountName] = useState('');
  const [newDiscountDescription, setNewDiscountDescription] = useState('');
  const [newDiscountEffectiveFrom, setNewDiscountEffectiveFrom] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newDiscountEffectiveTo, setNewDiscountEffectiveTo] = useState('');
  const [newDiscountRemarks, setNewDiscountRemarks] = useState('');
  const [newDiscountFeeHeads, setNewDiscountFeeHeads] = useState<string[]>([]);
  // Form States for Add Adjustment
  const [newAdjustmentType, setNewAdjustmentType] = useState<
    'credit' | 'debit'>(
    'credit');
  const [newAdjustmentReason, setNewAdjustmentReason] = useState('');
  const [newAdjustmentAmount, setNewAdjustmentAmount] = useState('');
  const [newAdjustmentDescription, setNewAdjustmentDescription] = useState('');
  const [newAdjustmentFeeHead, setNewAdjustmentFeeHead] = useState('');
  const [newAdjustmentRemarks, setNewAdjustmentRemarks] = useState('');
  const [newAdjustmentEffectiveDate, setNewAdjustmentEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  // Customize Fee Form States
  const [customTerm1Amount, setCustomTerm1Amount] = useState('');
  const [customTerm2Amount, setCustomTerm2Amount] = useState('');
  const [customizationReason, setCustomizationReason] = useState('');
  // Computed Values
  const totals = useMemo(() => {
    const totalDemand = feeStructure.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const totalDiscount = discounts.
    filter((d) => d.status === 'active').
    reduce((sum, d) => sum + d.appliedAmount, 0);
    const totalAdjustmentCredit = adjustments.
    filter((a) => a.type === 'credit' && a.status === 'approved').
    reduce((sum, a) => sum + a.amount, 0);
    const totalAdjustmentDebit = adjustments.
    filter((a) => a.type === 'debit' && a.status === 'approved').
    reduce((sum, a) => sum + a.amount, 0);
    const totalPaid = feeStructure.reduce(
      (sum, item) => sum + item.paidAmount,
      0
    );
    const netPayable =
    totalDemand - totalDiscount - totalAdjustmentCredit + totalAdjustmentDebit;
    const currentBalance = netPayable - totalPaid;
    return {
      totalDemand,
      totalDiscount,
      totalAdjustmentCredit,
      totalAdjustmentDebit,
      totalPaid,
      netPayable,
      currentBalance
    };
  }, [feeStructure, discounts, adjustments]);
  const termSummaries: TermSummary[] = useMemo(() => {
    const term1Total = feeStructure.reduce(
      (sum, item) => sum + item.term1Amount,
      0
    );
    const term2Total = feeStructure.reduce(
      (sum, item) => sum + item.term2Amount,
      0
    );
    const term1Paid = feeStructure.
    filter((f) => f.status === 'paid' || f.status === 'partial').
    reduce(
      (sum, item) => sum + Math.min(item.paidAmount, item.term1Amount),
      0
    );
    const term2Paid = feeStructure.
    filter((f) => f.status === 'paid').
    reduce((sum, item) => sum + item.term2Amount, 0);
    return [
    {
      term: 'Term 1 (Apr - Sep)',
      totalDemand: term1Total,
      totalDiscount: Math.floor(totals.totalDiscount / 2),
      totalPaid: term1Paid,
      totalBalance:
      term1Total - Math.floor(totals.totalDiscount / 2) - term1Paid,
      dueDate: '2024-04-30',
      status:
      term1Paid >= term1Total - Math.floor(totals.totalDiscount / 2) ?
      'paid' :
      'partial'
    },
    {
      term: 'Term 2 (Oct - Mar)',
      totalDemand: term2Total,
      totalDiscount: Math.ceil(totals.totalDiscount / 2),
      totalPaid: term2Paid,
      totalBalance:
      term2Total - Math.ceil(totals.totalDiscount / 2) - term2Paid,
      dueDate: '2024-10-31',
      status:
      term2Paid >= term2Total - Math.ceil(totals.totalDiscount / 2) ?
      'paid' :
      'unpaid'
    }];

  }, [feeStructure, totals]);
  // Handlers
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search term');
      return;
    }
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStudent(getMockStudent());
    setFeeStructure(getMockFeeStructure());
    setDiscounts(getMockDiscounts());
    setAdjustments(getMockAdjustments());
    setLedger(getMockLedger());
    setIsSearching(false);
    setActiveTab('structure');
  };
  const handleReset = () => {
    setSearchQuery('');
    setStudent(null);
    setFeeStructure([]);
    setDiscounts([]);
    setAdjustments([]);
    setLedger([]);
    setActiveTab('structure');
  };
  const handleTabChange = (tab: TabType) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };
  const handleCustomizeFee = (item: FeeStructureItem) => {
    setEditingFeeItem(item);
    setCustomTerm1Amount(item.term1Amount.toString());
    setCustomTerm2Amount(item.term2Amount.toString());
    setCustomizationReason(item.customizationReason || '');
    setShowCustomizeModal(true);
  };
  const handleSaveCustomization = () => {
    if (!editingFeeItem) return;
    setFeeStructure((prev) =>
    prev.map((item) => {
      if (item.id === editingFeeItem.id) {
        const newTerm1 = parseFloat(customTerm1Amount) || item.term1Amount;
        const newTerm2 = parseFloat(customTerm2Amount) || item.term2Amount;
        return {
          ...item,
          term1Amount: newTerm1,
          term2Amount: newTerm2,
          totalAmount: newTerm1 + newTerm2,
          balanceAmount: newTerm1 + newTerm2 - item.paidAmount,
          isCustomized: true,
          originalAmount: item.totalAmount,
          customizationReason: customizationReason
        };
      }
      return item;
    })
    );
    setShowCustomizeModal(false);
    setEditingFeeItem(null);
    setCustomTerm1Amount('');
    setCustomTerm2Amount('');
    setCustomizationReason('');
  };
  const handleAddDiscount = () => {
    setNewDiscountType('percentage');
    setNewDiscountCategory('');
    setNewDiscountValue('');
    setNewDiscountName('');
    setNewDiscountDescription('');
    setNewDiscountEffectiveFrom(new Date().toISOString().split('T')[0]);
    setNewDiscountEffectiveTo('');
    setNewDiscountRemarks('');
    setNewDiscountFeeHeads([]);
    setEditingDiscount(null);
    setShowAddDiscountModal(true);
  };
  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setNewDiscountType(discount.type);
    setNewDiscountCategory(discount.category);
    setNewDiscountValue(discount.value.toString());
    setNewDiscountName(discount.name);
    setNewDiscountDescription(discount.description);
    setNewDiscountEffectiveFrom(discount.effectiveFrom);
    setNewDiscountEffectiveTo(discount.effectiveTo || '');
    setNewDiscountRemarks(discount.remarks || '');
    setShowAddDiscountModal(true);
  };
  const handleSaveDiscount = () => {
    if (!newDiscountCategory || !newDiscountValue || !newDiscountName) {
      alert('Please fill all required fields');
      return;
    }
    const discountValue = parseFloat(newDiscountValue);
    const appliedAmount =
    newDiscountType === 'percentage' ?
    totals.totalDemand * discountValue / 100 :
    discountValue;
    const newDiscount: Discount = {
      id: editingDiscount?.id || `disc${Date.now()}`,
      type: newDiscountType,
      name: newDiscountName,
      description: newDiscountDescription,
      category: newDiscountCategory as Discount['category'],
      value: discountValue,
      applicableFeeHeads:
      newDiscountFeeHeads.length > 0 ? newDiscountFeeHeads : 'all',
      appliedAmount: appliedAmount,
      effectiveFrom: newDiscountEffectiveFrom,
      effectiveTo: newDiscountEffectiveTo || undefined,
      status: 'active',
      approvedBy: 'Pending Approval',
      remarks: newDiscountRemarks
    };
    if (editingDiscount) {
      setDiscounts((prev) =>
      prev.map((d) => d.id === editingDiscount.id ? newDiscount : d)
      );
    } else {
      setDiscounts((prev) => [...prev, newDiscount]);
    }
    setShowAddDiscountModal(false);
  };
  const handleDeleteDiscount = (discountId: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
    }
  };
  const handleAddAdjustment = () => {
    setNewAdjustmentType('credit');
    setNewAdjustmentReason('');
    setNewAdjustmentAmount('');
    setNewAdjustmentDescription('');
    setNewAdjustmentFeeHead('');
    setNewAdjustmentRemarks('');
    setNewAdjustmentEffectiveDate(new Date().toISOString().split('T')[0]);
    setShowAddAdjustmentModal(true);
  };
  const handleSaveAdjustment = () => {
    if (
    !newAdjustmentReason ||
    !newAdjustmentAmount ||
    !newAdjustmentDescription)
    {
      alert('Please fill all required fields');
      return;
    }
    const feeHead = mockFeeHeads.find((f) => f.id === newAdjustmentFeeHead);
    const newAdjustment: Adjustment = {
      id: `adj${Date.now()}`,
      type: newAdjustmentType,
      amount: parseFloat(newAdjustmentAmount),
      reason:
      adjustmentReasonOptions.find((r) => r.value === newAdjustmentReason)?.
      label || newAdjustmentReason,
      description: newAdjustmentDescription,
      feeHeadId: newAdjustmentFeeHead || undefined,
      feeHeadName: feeHead?.name,
      effectiveDate: newAdjustmentEffectiveDate,
      createdBy: 'Current User',
      createdAt: new Date().toLocaleString(),
      status: 'pending',
      referenceNo: `ADJ${new Date().getFullYear()}/${String(adjustments.length + 1).padStart(3, '0')}`,
      remarks: newAdjustmentRemarks
    };
    setAdjustments((prev) => [...prev, newAdjustment]);
    setShowAddAdjustmentModal(false);
  };
  const handleViewLedgerDetail = (entry: LedgerEntry) => {
    setSelectedLedgerEntry(entry);
    setShowLedgerDetailModal(true);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Paid
          </span>);

      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Partial
          </span>);

      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3" />
            Unpaid
          </span>);

      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>);

      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>);

      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>);

      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>);

      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            Expired
          </span>);

      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>);

    }
  };
  const getLedgerTypeIcon = (type: string) => {
    switch (type) {
      case 'demand':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'payment':
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'discount':
        return <Percent className="w-4 h-4 text-blue-500" />;
      case 'adjustment':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };
  const getDiscountCategoryIcon = (category: string) => {
    switch (category) {
      case 'merit':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'sibling':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'staff-ward':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'scholarship':
        return <GraduationCap className="w-5 h-5 text-green-600" />;
      default:
        return <Percent className="w-5 h-5 text-gray-600" />;
    }
  };
  // Tabs Configuration
  const tabsConfig = [
  {
    id: 'structure' as TabType,
    label: 'Fee Structure',
    icon: <IndianRupee className="w-4 h-4" />
  },
  {
    id: 'discounts' as TabType,
    label: 'Discounts & Concessions',
    icon: <Percent className="w-4 h-4" />,
    count: discounts.filter((d) => d.status === 'active').length
  },
  {
    id: 'adjustments' as TabType,
    label: 'Adjustments',
    icon: <Settings className="w-4 h-4" />,
    count: adjustments.length
  },
  {
    id: 'ledger' as TabType,
    label: 'Fee Ledger',
    icon: <History className="w-4 h-4" />
  }];

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
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            Student Fee Process
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage individual student fee structure, discounts, and adjustments
          </p>
        </div>
        {student &&
        <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Print Statement
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleReset}>

              <RotateCcw className="w-4 h-4 mr-2" />
              New Search
            </button>
          </div>
        }
      </div>

      <ReportFilters />

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Student Search
          </h3>
          <p className="text-sm text-gray-500">
            Search by GR Number, SU ID, or Student Name
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter GR No, SU ID, or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">

              {academicYearOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">

              {isSearching ?
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4\"
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

                </svg> :

              <Search className="w-4 h-4 mr-2" />
              }
              Search Student
            </button>
          </div>
        </div>
      </div>

      {/* Student Found */}
      {student &&
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Panel - Student Profile */}
          <div className="space-y-6">
            {/* Student Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-bold">
                      {student.firstName} {student.middleName}{' '}
                      {student.lastName}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Class {student.class}-{student.section} •{' '}
                      {student.department}
                    </p>
                    <p className="text-blue-200 text-xs mt-0.5">
                      Roll No: {student.rollNo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 block">GR No</span>
                    <span className="font-semibold text-gray-900">
                      {student.grNo}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 block">SU ID</span>
                    <span className="font-semibold text-gray-900">
                      {student.suId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.parentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{student.parentPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-xs">
                    {student.parentEmail}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {student.feeCategory}
                  </span>
                  {student.hasTransport &&
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Bus className="w-3 h-3" />
                      Transport
                    </span>
                }
                </div>
              </div>
            </div>

            {/* Fee Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Fee Summary
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedAcademicYear}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Demand</span>
                  <span className="font-semibold">
                    ₹{totals.totalDemand.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-green-600">
                  <span>Discounts</span>
                  <span className="font-semibold">
                    -₹{totals.totalDiscount.toLocaleString()}
                  </span>
                </div>
                {totals.totalAdjustmentCredit > 0 &&
              <div className="flex justify-between items-center py-2 border-b border-gray-100 text-green-600">
                    <span>Credits</span>
                    <span className="font-semibold">
                      -₹{totals.totalAdjustmentCredit.toLocaleString()}
                    </span>
                  </div>
              }
                {totals.totalAdjustmentDebit > 0 &&
              <div className="flex justify-between items-center py-2 border-b border-gray-100 text-red-600">
                    <span>Debits/Penalties</span>
                    <span className="font-semibold">
                      +₹{totals.totalAdjustmentDebit.toLocaleString()}
                    </span>
                  </div>
              }
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Net Payable</span>
                  <span className="font-bold">
                    ₹{totals.netPayable.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-blue-600">
                  <span>Total Paid</span>
                  <span className="font-semibold">
                    ₹{totals.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div
                className={`flex justify-between items-center py-3 px-3 rounded-lg ${totals.currentBalance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>

                  <span
                  className={`font-semibold ${totals.currentBalance > 0 ? 'text-red-700' : 'text-green-700'}`}>

                    Current Balance
                  </span>
                  <span
                  className={`text-xl font-bold ${totals.currentBalance > 0 ? 'text-red-700' : 'text-green-700'}`}>

                    ₹{Math.abs(totals.currentBalance).toLocaleString()}
                    {totals.currentBalance < 0 && ' (Advance)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Term Wise Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Term-wise Summary
              </h3>
              <div className="space-y-3">
                {termSummaries.map((term, index) =>
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {term.term}
                      </span>
                      {getStatusBadge(term.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Demand:</span>
                        <span className="ml-1 font-medium">
                          ₹{term.totalDemand.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <span className="ml-1 font-medium text-green-600">
                          -₹{term.totalDiscount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Paid:</span>
                        <span className="ml-1 font-medium text-blue-600">
                          ₹{term.totalPaid.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Balance:</span>
                        <span
                      className={`ml-1 font-medium ${term.totalBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>

                          ₹{term.totalBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Due: {new Date(term.dueDate).toLocaleDateString()}
                    </div>
                  </div>
              )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full inline-flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Receipt className="w-4 h-4 mr-2" />
                  Collect Fee
                </button>
                <button className="w-full inline-flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Reminder
                </button>
                <button className="w-full inline-flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Generate Demand
                </button>
                <button className="w-full inline-flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Print Fee Card
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Tabs */}
          <div className="xl:col-span-3 space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 border-b border-gray-200">
                <nav className="flex gap-6 overflow-x-auto" aria-label="Tabs">
                  {tabsConfig.map((tab) =>
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

                      {tab.icon}
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 &&
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

                          {tab.count}
                        </span>
                  }
                    </button>
                )}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {/* Fee Structure Tab */}
            {activeTab === 'structure' &&
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Fee Structure Assignment
                    </h3>
                    <p className="text-sm text-gray-500">
                      Academic Year: {selectedAcademicYear}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Copy className="w-4 h-4 mr-2" />
                      Apply Standard
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Lock className="w-4 h-4 mr-2" />
                      Lock Structure
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left font-semibold text-gray-600">
                          Fee Head
                        </th>
                        <th className="px-4 py-4 text-right font-semibold text-gray-600">
                          Term 1
                        </th>
                        <th className="px-4 py-4 text-right font-semibold text-gray-600">
                          Term 2
                        </th>
                        <th className="px-4 py-4 text-right font-semibold text-gray-600">
                          Total
                        </th>
                        <th className="px-4 py-4 text-right font-semibold text-gray-600">
                          Paid
                        </th>
                        <th className="px-4 py-4 text-right font-semibold text-gray-600">
                          Balance
                        </th>
                        <th className="px-4 py-4 text-center font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-4 py-4 text-center font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {feeStructure.map((item) =>
                  <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <FeeCategoryIcon
                            category={item.feeHead.category} />

                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.feeHead.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.feeHead.description}
                                </p>
                                {item.isCustomized &&
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                    Customized
                                  </span>
                          }
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-medium">
                            ₹{item.term1Amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-right font-medium">
                            {item.term2Amount > 0 ?
                      `₹${item.term2Amount.toLocaleString()}` :
                      '-'}
                          </td>
                          <td className="px-4 py-4 text-right font-bold">
                            ₹{item.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-right text-green-600 font-medium">
                            ₹{item.paidAmount.toLocaleString()}
                          </td>
                          <td
                      className={`px-4 py-4 text-right font-medium ${item.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>

                            ₹{item.balanceAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center gap-1">
                              <button
                          onClick={() => handleCustomizeFee(item)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Customize">

                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details">

                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                  )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          Grand Total
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          ₹
                          {feeStructure.
                      reduce((sum, item) => sum + item.term1Amount, 0).
                      toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          ₹
                          {feeStructure.
                      reduce((sum, item) => sum + item.term2Amount, 0).
                      toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-lg">
                          ₹{totals.totalDemand.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-green-600">
                          ₹{totals.totalPaid.toLocaleString()}
                        </td>
                        <td
                      className={`px-4 py-4 text-right font-bold ${totals.totalDemand - totals.totalPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>

                          ₹
                          {(
                      totals.totalDemand - totals.totalPaid).
                      toLocaleString()}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Optional fees can be added or removed based on student
                      enrollment
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Optional Fee
                    </button>
                  </div>
                </div>
              </div>
          }

            {/* Discounts Tab */}
            {activeTab === 'discounts' &&
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Discounts & Concessions
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage student discounts and scholarships
                    </p>
                  </div>
                  <button
                onClick={handleAddDiscount}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                    <Plus className="w-4 h-4 mr-2" />
                    Add Discount
                  </button>
                </div>

                {discounts.length > 0 ?
            <div className="space-y-4">
                    {discounts.map((discount) =>
              <div
                key={discount.id}
                className={`p-4 rounded-xl border-2 ${discount.status === 'active' ? 'border-green-200 bg-green-50/50' : discount.status === 'pending' ? 'border-yellow-200 bg-yellow-50/50' : 'border-gray-200 bg-gray-50/50'}`}>

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                      className={`p-2 rounded-lg ${discount.category === 'merit' ? 'bg-yellow-100' : discount.category === 'sibling' ? 'bg-blue-100' : discount.category === 'staff-ward' ? 'bg-purple-100' : 'bg-gray-100'}`}>

                              {getDiscountCategoryIcon(discount.category)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {discount.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {discount.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(discount.status)}
                            <div className="flex gap-1">
                              <button
                        onClick={() => handleEditDiscount(discount)}
                        className="p-1.5 hover:bg-white/50 rounded-lg"
                        title="Edit">

                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                        onClick={() =>
                        handleDeleteDiscount(discount.id)
                        }
                        className="p-1.5 hover:bg-white/50 rounded-lg"
                        title="Delete">

                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">Type</span>
                            <span className="font-medium capitalize">
                              {discount.type === 'percentage' ?
                      `${discount.value}%` :
                      `₹${discount.value.toLocaleString()}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">
                              Applied Amount
                            </span>
                            <span className="font-bold text-green-600">
                              ₹{discount.appliedAmount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">
                              Effective From
                            </span>
                            <span className="font-medium">
                              {new Date(
                        discount.effectiveFrom
                      ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">
                              Approved By
                            </span>
                            <span className="font-medium">
                              {discount.approvedBy || '-'}
                            </span>
                          </div>
                        </div>

                        {discount.remarks &&
                <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600 italic">
                              "{discount.remarks}"
                            </p>
                          </div>
                }
                      </div>
              )}

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          Total Active Discounts
                        </span>
                        <span className="text-2xl font-bold text-green-700">
                          ₹{totals.totalDiscount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div> :

            <div className="text-center py-12">
                    <Percent className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Discounts Applied
                    </h3>
                    <p className="text-gray-500 mb-4">
                      This student has no active discounts or concessions
                    </p>
                    <button
                onClick={handleAddDiscount}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                      <Plus className="w-4 h-4 mr-2" />
                      Add Discount
                    </button>
                  </div>
            }
              </div>
          }

            {/* Adjustments Tab */}
            {activeTab === 'adjustments' &&
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Special Adjustments
                    </h3>
                    <p className="text-sm text-gray-500">
                      Credit/Debit adjustments and manual entries
                    </p>
                  </div>
                  <button
                onClick={handleAddAdjustment}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                    <Plus className="w-4 h-4 mr-2" />
                    Add Adjustment
                  </button>
                </div>

                {adjustments.length > 0 ?
            <div className="space-y-4">
                    {adjustments.map((adjustment) =>
              <div
                key={adjustment.id}
                className={`p-4 rounded-xl border-2 ${adjustment.type === 'credit' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                      className={`p-2 rounded-lg ${adjustment.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>

                              {adjustment.type === 'credit' ?
                      <ArrowDownRight className="w-5 h-5 text-green-600" /> :

                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                      }
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {adjustment.reason}
                                </h4>
                                <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${adjustment.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

                                  {adjustment.type === 'credit' ?
                          'Credit' :
                          'Debit'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {adjustment.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(adjustment.status)}
                            <span
                      className={`text-xl font-bold ${adjustment.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>

                              {adjustment.type === 'credit' ? '-' : '+'}₹
                              {adjustment.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">
                              Reference No
                            </span>
                            <span className="font-medium">
                              {adjustment.referenceNo}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">
                              Effective Date
                            </span>
                            <span className="font-medium">
                              {new Date(
                        adjustment.effectiveDate
                      ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">
                              Created By
                            </span>
                            <span className="font-medium">
                              {adjustment.createdBy}
                            </span>
                          </div>
                          {adjustment.feeHeadName &&
                  <div>
                              <span className="text-gray-500 block">
                                Fee Head
                              </span>
                              <span className="font-medium">
                                {adjustment.feeHeadName}
                              </span>
                            </div>
                  }
                        </div>

                        {adjustment.remarks &&
                <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600 italic">
                              "{adjustment.remarks}"
                            </p>
                          </div>
                }
                      </div>
              )}

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <span className="text-gray-500 text-sm block">
                            Total Credits
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ₹{totals.totalAdjustmentCredit.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm block">
                            Total Debits
                          </span>
                          <span className="text-xl font-bold text-red-600">
                            ₹{totals.totalAdjustmentDebit.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm block">
                            Net Adjustment
                          </span>
                          <span
                      className={`text-xl font-bold ${totals.totalAdjustmentCredit - totals.totalAdjustmentDebit >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                            ₹
                            {Math.abs(
                        totals.totalAdjustmentCredit -
                        totals.totalAdjustmentDebit
                      ).toLocaleString()}
                            {totals.totalAdjustmentCredit -
                      totals.totalAdjustmentDebit >=
                      0 ?
                      ' (Credit)' :
                      ' (Debit)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div> :

            <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Adjustments
                    </h3>
                    <p className="text-gray-500 mb-4">
                      No manual adjustments have been made for this student
                    </p>
                    <button
                onClick={handleAddAdjustment}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                      <Plus className="w-4 h-4 mr-2" />
                      Add Adjustment
                    </button>
                  </div>
            }
              </div>
          }

            {/* Ledger Tab */}
            {activeTab === 'ledger' &&
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Fee Ledger
                    </h3>
                    <p className="text-sm text-gray-500">
                      Complete transaction history
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Ledger
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">
                          Reference
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">
                          Debit (₹)
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">
                          Credit (₹)
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">
                          Balance (₹)
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ledger.map((entry) =>
                  <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getLedgerTypeIcon(entry.type)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {entry.description}
                                </p>
                                {entry.paymentMode &&
                          <p className="text-xs text-gray-500">
                                    {entry.paymentMode}
                                  </p>
                          }
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                            {entry.referenceNo || '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {entry.debit > 0 ?
                      <span className="text-red-600 font-medium">
                                {entry.debit.toLocaleString()}
                              </span> :

                      '-'
                      }
                          </td>
                          <td className="px-4 py-3 text-right">
                            {entry.credit > 0 ?
                      <span className="text-green-600 font-medium">
                                {entry.credit.toLocaleString()}
                              </span> :

                      '-'
                      }
                          </td>
                          <td
                      className={`px-4 py-3 text-right font-bold ${entry.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>

                            {entry.balance.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                        onClick={() => handleViewLedgerDetail(entry)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="View Details">

                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Opening Balance
                      </span>
                      <span className="font-bold text-gray-900">₹0</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Total Debit
                      </span>
                      <span className="font-bold text-red-600">
                        ₹
                        {ledger.
                    reduce((sum, e) => sum + e.debit, 0).
                    toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Total Credit
                      </span>
                      <span className="font-bold text-green-600">
                        ₹
                        {ledger.
                    reduce((sum, e) => sum + e.credit, 0).
                    toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Closing Balance
                      </span>
                      <span
                    className={`font-bold ${ledger[ledger.length - 1]?.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>

                        ₹
                        {(
                    ledger[ledger.length - 1]?.balance || 0).
                    toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          }
          </div>
        </div>
      }

      {/* Empty State when no student */}
      {!student && !isSearching &&
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center"
        style={{
          minHeight: '400px'
        }}>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search for a Student
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a GR Number, SU ID, or student name in the search box above
              to view and manage their fee details.
            </p>
          </div>
        </div>
      }

      {/* Add Discount Modal */}
      {showAddDiscountModal &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddDiscountModal(false)} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Apply discount or concession to student fee
                  </p>
                </div>
                <button
                onClick={() => setShowAddDiscountModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Name <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  placeholder="e.g., Merit Scholarship"
                  value={newDiscountName}
                  onChange={(e) => setNewDiscountName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={newDiscountCategory}
                    onChange={(e) => setNewDiscountCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">

                      <option value="">Select Category</option>
                      {discountCategoryOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                    )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <div className="flex gap-2">
                      <button
                      type="button"
                      onClick={() => setNewDiscountType('percentage')}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${newDiscountType === 'percentage' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                        Percentage
                      </button>
                      <button
                      type="button"
                      onClick={() => setNewDiscountType('fixed')}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${newDiscountType === 'fixed' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                        Fixed (₹)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newDiscountType === 'percentage' ?
                  'Discount Percentage' :
                  'Discount Amount'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="number"
                  placeholder={
                  newDiscountType === 'percentage' ?
                  'e.g., 10' :
                  'e.g., 5000'
                  }
                  value={newDiscountValue}
                  onChange={(e) => setNewDiscountValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                  type="text"
                  placeholder="Brief description of the discount"
                  value={newDiscountDescription}
                  onChange={(e) => setNewDiscountDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective From <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="date"
                    value={newDiscountEffectiveFrom}
                    onChange={(e) =>
                    setNewDiscountEffectiveFrom(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective To
                    </label>
                    <input
                    type="date"
                    value={newDiscountEffectiveTo}
                    onChange={(e) =>
                    setNewDiscountEffectiveTo(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                  value={newDiscountRemarks}
                  onChange={(e) => setNewDiscountRemarks(e.target.value)}
                  placeholder="Add any remarks or justification..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                {newDiscountValue &&
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <Info className="w-4 h-4" />
                      <span>
                        Estimated discount amount: ₹
                        {newDiscountType === 'percentage' ?
                    Math.round(
                      totals.totalDemand *
                      parseFloat(newDiscountValue || '0') /
                      100
                    ).toLocaleString() :
                    parseFloat(
                      newDiscountValue || '0'
                    ).toLocaleString()}
                      </span>
                    </div>
                  </div>
              }
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                onClick={() => setShowAddDiscountModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">

                  Cancel
                </button>
                <button
                onClick={handleSaveDiscount}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                  <Save className="w-4 h-4 mr-2" />
                  {editingDiscount ? 'Update Discount' : 'Save Discount'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Add Adjustment Modal */}
      {showAddAdjustmentModal &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddAdjustmentModal(false)} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Adjustment
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a credit or debit adjustment
                  </p>
                </div>
                <button
                onClick={() => setShowAddAdjustmentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Type
                  </label>
                  <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={() => setNewAdjustmentType('credit')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${newAdjustmentType === 'credit' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                      <ArrowDownRight className="w-5 h-5" />
                      Credit
                    </button>
                    <button
                    type="button"
                    onClick={() => setNewAdjustmentType('debit')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${newAdjustmentType === 'debit' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                      <ArrowUpRight className="w-5 h-5" />
                      Debit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={newAdjustmentReason}
                    onChange={(e) => setNewAdjustmentReason(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">

                      <option value="">Select Reason</option>
                      {adjustmentReasonOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                    )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="number"
                    placeholder="Enter amount"
                    value={newAdjustmentAmount}
                    onChange={(e) => setNewAdjustmentAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  placeholder="Brief description of the adjustment"
                  value={newAdjustmentDescription}
                  onChange={(e) =>
                  setNewAdjustmentDescription(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <input
                    type="date"
                    value={newAdjustmentEffectiveDate}
                    onChange={(e) =>
                    setNewAdjustmentEffectiveDate(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apply to Fee Head
                    </label>
                    <select
                    value={newAdjustmentFeeHead}
                    onChange={(e) => setNewAdjustmentFeeHead(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">

                      <option value="">All Fee Heads</option>
                      {mockFeeHeads.map((f) =>
                    <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                    )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                  value={newAdjustmentRemarks}
                  onChange={(e) => setNewAdjustmentRemarks(e.target.value)}
                  placeholder="Additional notes or remarks..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div
                className={`p-3 rounded-lg ${newAdjustmentType === 'credit' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>

                  <div className="flex items-center gap-2">
                    <Info
                    className={`w-4 h-4 ${newAdjustmentType === 'credit' ? 'text-green-600' : 'text-red-600'}`} />

                    <span
                    className={`text-sm ${newAdjustmentType === 'credit' ? 'text-green-700' : 'text-red-700'}`}>

                      {newAdjustmentType === 'credit' ?
                    "This will reduce the student's outstanding balance" :
                    "This will increase the student's outstanding balance"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                onClick={() => setShowAddAdjustmentModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">

                  Cancel
                </button>
                <button
                onClick={handleSaveAdjustment}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white ${newAdjustmentType === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>

                  <Save className="w-4 h-4 mr-2" />
                  Save Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Customize Fee Modal */}
      {showCustomizeModal && editingFeeItem &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCustomizeModal(false)} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Customize Fee Structure
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingFeeItem.feeHead.name}
                  </p>
                </div>
                <button
                onClick={() => setShowCustomizeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Standard Amount
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Term 1</span>
                      <span className="font-semibold">
                        ₹{editingFeeItem.term1Amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Term 2</span>
                      <span className="font-semibold">
                        ₹{editingFeeItem.term2Amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total</span>
                      <span className="font-bold">
                        ₹{editingFeeItem.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Term 1 Amount
                    </label>
                    <input
                    type="number"
                    placeholder="Enter amount"
                    value={customTerm1Amount}
                    onChange={(e) => setCustomTerm1Amount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Term 2 Amount
                    </label>
                    <input
                    type="number"
                    placeholder="Enter amount"
                    value={customTerm2Amount}
                    onChange={(e) => setCustomTerm2Amount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                  </div>
                </div>

                {(customTerm1Amount || customTerm2Amount) &&
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-700">
                      New Total: ₹
                      {(
                  (parseFloat(customTerm1Amount) ||
                  editingFeeItem.term1Amount) + (
                  parseFloat(customTerm2Amount) ||
                  editingFeeItem.term2Amount)).
                  toLocaleString()}
                    </div>
                  </div>
              }

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Customization
                  </label>
                  <textarea
                  value={customizationReason}
                  onChange={(e) => setCustomizationReason(e.target.value)}
                  placeholder="Explain why this fee is being customized..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">Customization Notice</p>
                      <p>
                        Custom fee structures require approval and will be
                        tracked in the system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">

                  Cancel
                </button>
                <button
                onClick={handleSaveCustomization}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">

                  <Save className="w-4 h-4 mr-2" />
                  Save Customization
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Ledger Detail Modal */}
      {showLedgerDetailModal && selectedLedgerEntry &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLedgerDetailModal(false)} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-gray-900">
                  Transaction Details
                </h2>
                <button
                onClick={() => setShowLedgerDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div
                  className={`p-3 rounded-full ${selectedLedgerEntry.type === 'payment' ? 'bg-green-100' : selectedLedgerEntry.type === 'demand' ? 'bg-red-100' : selectedLedgerEntry.type === 'discount' ? 'bg-blue-100' : 'bg-gray-100'}`}>

                    {getLedgerTypeIcon(selectedLedgerEntry.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedLedgerEntry.description}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedLedgerEntry.date).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }
                    )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">
                      Reference No
                    </span>
                    <span className="font-mono font-medium">
                      {selectedLedgerEntry.referenceNo || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 block">Type</span>
                    <span className="font-medium capitalize">
                      {selectedLedgerEntry.type}
                    </span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-600 block">Debit</span>
                    <span className="font-bold text-red-700">
                      {selectedLedgerEntry.debit > 0 ?
                    `₹${selectedLedgerEntry.debit.toLocaleString()}` :
                    '-'}
                    </span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-600 block">Credit</span>
                    <span className="font-bold text-green-700">
                      {selectedLedgerEntry.credit > 0 ?
                    `₹${selectedLedgerEntry.credit.toLocaleString()}` :
                    '-'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Running Balance</span>
                    <span
                    className={`text-xl font-bold ${selectedLedgerEntry.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>

                      ₹{selectedLedgerEntry.balance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Created by: {selectedLedgerEntry.createdBy}</p>
                  {selectedLedgerEntry.paymentMode &&
                <p>Payment Mode: {selectedLedgerEntry.paymentMode}</p>
                }
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                onClick={() => setShowLedgerDetailModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">

                  Close
                </button>
                {selectedLedgerEntry.type === 'payment' &&
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                  </button>
              }
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}
export default StudentFeeProcess;