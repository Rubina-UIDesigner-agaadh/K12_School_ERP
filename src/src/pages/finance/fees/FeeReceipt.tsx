import React, { useMemo, useState, Fragment } from 'react';
import {
  Search,
  Printer,
  Download,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Receipt,
  Phone,
  Mail,
  Bus,
  Home,
  Award,
  Percent,
  History,
  Check,
  Info,
  Building,
  GraduationCap,
  Hash,
  IdCard,
  AlertTriangle,
  Banknote,
  BadgePercent,
  Timer,
  MessageSquare,
  Send,
  XCircle,
  RefreshCw,
  BookOpen,
  Wallet,
  Save,
  Edit3,
  Lock,
  Unlock } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// ============================================
// TYPE DEFINITIONS
// ============================================
interface FeeHead {
  id: string;
  name: string;
  amount: number;
  discountAmount: number;
  netAmount: number;
}
interface Installment {
  id: string;
  installmentNo: number;
  installmentName: string;
  dueDate: string;
  feeHeads: FeeHead[];
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  fineAmount: number;
  finePaid: number;
  fineBalance: number;
  totalDue: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  paidDate?: string;
  daysOverdue: number;
}
interface ReceiptHistory {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  fineAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMode: string;
  referenceNo?: string;
  installments: {
    installmentName: string;
    feeAmount: number;
    fineAmount: number;
    discountAmount: number;
  }[];
  status: 'completed' | 'cancelled' | 'refunded';
  generatedBy: string;
  remarks?: string;
  cancelledBy?: string;
  cancelledDate?: string;
  cancelReason?: string;
  smsSent: boolean;
  emailSent: boolean;
  ledgerPosted: boolean;
}
interface StudentData {
  id: string;
  admissionNo: string;
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
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  academicYear: string;
  hasTransport: boolean;
  transportRoute?: string;
  hasHostel: boolean;
  hasConcession: boolean;
  concessionType?: string;
  concessionPercentage?: number;
  hasScholarship: boolean;
  scholarshipName?: string;
  scholarshipAmount?: number;
  feeCategory: string;
  installments: Installment[];
  receiptHistory: ReceiptHistory[];
}
interface SearchFilters {
  searchType: 'admissionNo' | 'name' | 'class' | 'mobile';
  searchValue: string;
  admissionNo: string;
  studentName: string;
  class: string;
  section: string;
  mobileNo: string;
  academicYear: string;
}
interface PaymentEntry {
  installmentId: string;
  feeAmount: number;
  fineAmount: number;
  discountAmount: number;
  discountReason: string;
  totalAmount: number;
}
// ============================================
// MOCK DATA
// ============================================
const getMockStudentData = (): StudentData => {
  const today = new Date();
  const calculateDaysOverdue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const diff = Math.floor(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };
  const calculateFine = (
  dueDate: string,
  amount: number,
  gracePeriod: number = 7)
  : number => {
    const daysOverdue = calculateDaysOverdue(dueDate);
    if (daysOverdue <= gracePeriod) return 0;
    const effectiveDays = daysOverdue - gracePeriod;
    const finePerDay = 50;
    const maxFine = amount * 0.1;
    return Math.min(effectiveDays * finePerDay, maxFine);
  };
  const installments: Installment[] = [
  {
    id: 'inst-1',
    installmentNo: 1,
    installmentName: 'Term 1 (Apr - Jun 2024)',
    dueDate: '2024-04-15',
    feeHeads: [
    {
      id: 'fh1',
      name: 'Tuition Fee',
      amount: 25000,
      discountAmount: 3750,
      netAmount: 21250
    },
    {
      id: 'fh2',
      name: 'Development Fee',
      amount: 5000,
      discountAmount: 750,
      netAmount: 4250
    },
    {
      id: 'fh3',
      name: 'Computer Lab Fee',
      amount: 2500,
      discountAmount: 375,
      netAmount: 2125
    },
    {
      id: 'fh4',
      name: 'Science Lab Fee',
      amount: 2000,
      discountAmount: 300,
      netAmount: 1700
    },
    {
      id: 'fh5',
      name: 'Library Fee',
      amount: 1000,
      discountAmount: 0,
      netAmount: 1000
    }],

    totalAmount: 35500,
    totalDiscount: 5175,
    netAmount: 30325,
    paidAmount: 30325,
    balanceAmount: 0,
    fineAmount: 0,
    finePaid: 0,
    fineBalance: 0,
    totalDue: 0,
    status: 'paid',
    paidDate: '2024-04-10',
    daysOverdue: 0
  },
  {
    id: 'inst-2',
    installmentNo: 2,
    installmentName: 'Term 2 (Jul - Sep 2024)',
    dueDate: '2024-07-15',
    feeHeads: [
    {
      id: 'fh6',
      name: 'Tuition Fee',
      amount: 25000,
      discountAmount: 3750,
      netAmount: 21250
    },
    {
      id: 'fh7',
      name: 'Development Fee',
      amount: 5000,
      discountAmount: 750,
      netAmount: 4250
    },
    {
      id: 'fh8',
      name: 'Computer Lab Fee',
      amount: 2500,
      discountAmount: 375,
      netAmount: 2125
    },
    {
      id: 'fh9',
      name: 'Science Lab Fee',
      amount: 2000,
      discountAmount: 300,
      netAmount: 1700
    },
    {
      id: 'fh10',
      name: 'Examination Fee',
      amount: 1500,
      discountAmount: 0,
      netAmount: 1500
    }],

    totalAmount: 36000,
    totalDiscount: 5175,
    netAmount: 30825,
    paidAmount: 15000,
    balanceAmount: 15825,
    fineAmount: calculateFine('2024-07-15', 15825),
    finePaid: 0,
    fineBalance: calculateFine('2024-07-15', 15825),
    totalDue: 15825 + calculateFine('2024-07-15', 15825),
    status: 'partial',
    paidDate: '2024-07-20',
    daysOverdue: calculateDaysOverdue('2024-07-15')
  },
  {
    id: 'inst-3',
    installmentNo: 3,
    installmentName: 'Term 3 (Oct - Dec 2024)',
    dueDate: '2024-10-15',
    feeHeads: [
    {
      id: 'fh11',
      name: 'Tuition Fee',
      amount: 25000,
      discountAmount: 3750,
      netAmount: 21250
    },
    {
      id: 'fh12',
      name: 'Development Fee',
      amount: 5000,
      discountAmount: 750,
      netAmount: 4250
    },
    {
      id: 'fh13',
      name: 'Computer Lab Fee',
      amount: 2500,
      discountAmount: 375,
      netAmount: 2125
    },
    {
      id: 'fh14',
      name: 'Science Lab Fee',
      amount: 2000,
      discountAmount: 300,
      netAmount: 1700
    },
    {
      id: 'fh15',
      name: 'Sports Fee',
      amount: 2000,
      discountAmount: 0,
      netAmount: 2000
    }],

    totalAmount: 36500,
    totalDiscount: 5175,
    netAmount: 31325,
    paidAmount: 0,
    balanceAmount: 31325,
    fineAmount: 0,
    finePaid: 0,
    fineBalance: 0,
    totalDue: 31325,
    status: 'unpaid',
    daysOverdue: 0
  },
  {
    id: 'inst-4',
    installmentNo: 4,
    installmentName: 'Term 4 (Jan - Mar 2025)',
    dueDate: '2025-01-15',
    feeHeads: [
    {
      id: 'fh16',
      name: 'Tuition Fee',
      amount: 25000,
      discountAmount: 3750,
      netAmount: 21250
    },
    {
      id: 'fh17',
      name: 'Development Fee',
      amount: 5000,
      discountAmount: 750,
      netAmount: 4250
    },
    {
      id: 'fh18',
      name: 'Computer Lab Fee',
      amount: 2500,
      discountAmount: 375,
      netAmount: 2125
    },
    {
      id: 'fh19',
      name: 'Science Lab Fee',
      amount: 2000,
      discountAmount: 300,
      netAmount: 1700
    },
    {
      id: 'fh20',
      name: 'Annual Day Fee',
      amount: 1500,
      discountAmount: 0,
      netAmount: 1500
    },
    {
      id: 'fh21',
      name: 'Examination Fee',
      amount: 2000,
      discountAmount: 0,
      netAmount: 2000
    }],

    totalAmount: 38000,
    totalDiscount: 5175,
    netAmount: 32825,
    paidAmount: 0,
    balanceAmount: 32825,
    fineAmount: 0,
    finePaid: 0,
    fineBalance: 0,
    totalDue: 32825,
    status: 'unpaid',
    daysOverdue: 0
  },
  {
    id: 'inst-transport-1',
    installmentNo: 5,
    installmentName: 'Transport Fee - H1 (Apr - Sep 2024)',
    dueDate: '2024-04-30',
    feeHeads: [
    {
      id: 'fh22',
      name: 'Transport Fee (6 Months)',
      amount: 18000,
      discountAmount: 0,
      netAmount: 18000
    }],

    totalAmount: 18000,
    totalDiscount: 0,
    netAmount: 18000,
    paidAmount: 18000,
    balanceAmount: 0,
    fineAmount: 0,
    finePaid: 0,
    fineBalance: 0,
    totalDue: 0,
    status: 'paid',
    paidDate: '2024-04-25',
    daysOverdue: 0
  },
  {
    id: 'inst-transport-2',
    installmentNo: 6,
    installmentName: 'Transport Fee - H2 (Oct - Mar 2025)',
    dueDate: '2024-10-31',
    feeHeads: [
    {
      id: 'fh23',
      name: 'Transport Fee (6 Months)',
      amount: 18000,
      discountAmount: 0,
      netAmount: 18000
    }],

    totalAmount: 18000,
    totalDiscount: 0,
    netAmount: 18000,
    paidAmount: 0,
    balanceAmount: 18000,
    fineAmount: 0,
    finePaid: 0,
    fineBalance: 0,
    totalDue: 18000,
    status: 'unpaid',
    daysOverdue: 0
  }];

  return {
    id: '1',
    admissionNo: 'ADM2024001',
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
    address: '123, Green Park, Sector 22, New Delhi - 110001',
    parentName: 'Mr. Amit Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'amit.sharma@email.com',
    academicYear: '2024-25',
    hasTransport: true,
    transportRoute: 'Route 5 - Sector 22 to School',
    hasHostel: false,
    hasConcession: true,
    concessionType: 'Staff Ward Concession',
    concessionPercentage: 15,
    hasScholarship: true,
    scholarshipName: 'Merit Scholarship',
    scholarshipAmount: 5000,
    feeCategory: 'General',
    installments,
    receiptHistory: [
    {
      id: 'rcpt1',
      receiptNo: 'RCP2024/001234',
      date: '2024-04-10',
      amount: 68875,
      fineAmount: 0,
      discountAmount: 0,
      totalAmount: 68875,
      paymentMode: 'Online Transfer',
      referenceNo: 'TXN123456789',
      installments: [
      {
        installmentName: 'Term 1 (Apr - Jun 2024)',
        feeAmount: 30325,
        fineAmount: 0,
        discountAmount: 0
      },
      {
        installmentName: 'Transport Fee - H1',
        feeAmount: 18000,
        fineAmount: 0,
        discountAmount: 0
      }],

      status: 'completed',
      generatedBy: 'Admin User',
      remarks: 'Term 1 + Transport H1 payment',
      smsSent: true,
      emailSent: true,
      ledgerPosted: true
    },
    {
      id: 'rcpt2',
      receiptNo: 'RCP2024/002456',
      date: '2024-07-20',
      amount: 15000,
      fineAmount: 0,
      discountAmount: 0,
      totalAmount: 15000,
      paymentMode: 'UPI',
      referenceNo: 'UPI/789456123',
      installments: [
      {
        installmentName: 'Term 2 - Partial',
        feeAmount: 15000,
        fineAmount: 0,
        discountAmount: 0
      }],

      status: 'completed',
      generatedBy: 'Fee Counter 1',
      remarks: 'Partial payment for Term 2',
      smsSent: true,
      emailSent: false,
      ledgerPosted: true
    }]

  };
};
// ============================================
// COMPONENT OPTIONS
// ============================================
const classOptions = [
{
  value: '',
  label: 'Select Class'
},
{
  value: 'nursery',
  label: 'Nursery'
},
{
  value: 'lkg',
  label: 'LKG'
},
{
  value: 'ukg',
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
}];

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

const paymentModeOptions = [
{
  value: 'cash',
  label: 'Cash'
},
{
  value: 'upi',
  label: 'UPI'
},
{
  value: 'card',
  label: 'Debit/Credit Card'
},
{
  value: 'cheque',
  label: 'Cheque'
},
{
  value: 'neft',
  label: 'NEFT/RTGS/IMPS'
},
{
  value: 'dd',
  label: 'Demand Draft'
}];

const searchTypeOptions = [
{
  value: 'admissionNo',
  label: 'Admission No'
},
{
  value: 'name',
  label: 'Student Name'
},
{
  value: 'class',
  label: 'Class'
},
{
  value: 'mobile',
  label: 'Mobile Number'
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
}> = ({ children, className = '', title, subtitle, action }) =>
<div
  className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>

    {(title || action) &&
  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          {title &&
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      }
          {subtitle &&
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      }
        </div>
        {action}
      </div>
  }
    {children}
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
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
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
  'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1';
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
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm'
  };
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}>

      {loading &&
      <svg
        className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5"
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
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  error?: string;
  className?: string;
}> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon,
  disabled,
  required,
  min,
  max,
  error,
  className = ''
}) =>
<div className={className}>
    {label &&
  <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
  }
    <div className="relative">
      {leftIcon &&
    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
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
      className={`w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${leftIcon ? 'pl-8' : ''}`} />

    </div>
    {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
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
  <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
  }
    <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 bg-white">

      {options.map((opt) =>
    <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
    )}
    </select>
  </div>;

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'xs' | 'sm';
}> = ({ children, variant = 'gray', size = 'sm' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-700'
  };
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium ${variants[variant]} ${sizes[size]}`}>

      {children}
    </span>);

};
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>

          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>);

};
// ============================================
// MAIN COMPONENT
// ============================================
export function FeeReceipt() {
  // Search States
  const [searchType, setSearchType] = useState<
    'admissionNo' | 'name' | 'class' | 'mobile'>(
    'admissionNo');
  const [searchValue, setSearchValue] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [isSearching, setIsSearching] = useState(false);
  const [studentFound, setStudentFound] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  // Payment States
  const [selectedInstallments, setSelectedInstallments] = useState<Set<string>>(
    new Set()
  );
  const [paymentAmounts, setPaymentAmounts] = useState<
    Record<
      string,
      {
        feeAmount: number;
        fineAmount: number;
        discountAmount: number;
        discountReason: string;
      }>>(

    {});
  const [paymentMode, setPaymentMode] = useState('cash');
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [referenceNo, setReferenceNo] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [bankName, setBankName] = useState('');
  const [narration, setNarration] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  // Discount States
  const [showDiscountEntry, setShowDiscountEntry] = useState(false);
  const [hasDiscountPermission, setHasDiscountPermission] = useState(true); // Would come from user permissions
  // Communication States
  const [sendSMS, setSendSMS] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  // Modal States
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [showReceiptSuccess, setShowReceiptSuccess] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'payment' | 'history'>('payment');
  const [expandedInstallment, setExpandedInstallment] = useState<string | null>(
    null
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingReceipt, setCancellingReceipt] =
  useState<ReceiptHistory | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  // Auto Receipt Number
  const autoReceiptNo = useMemo(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `RCP${year}/${random}`;
  }, [showReceiptPreview]);
  // Computed Values
  const unpaidInstallments = useMemo(
    () =>
    selectedStudent?.installments.filter((i) => i.status !== 'paid') || [],
    [selectedStudent]
  );
  const totalDue = useMemo(
    () => unpaidInstallments.reduce((sum, i) => sum + i.balanceAmount, 0),
    [unpaidInstallments]
  );
  const totalPaid = useMemo(
    () =>
    selectedStudent?.installments.reduce((sum, i) => sum + i.paidAmount, 0) ||
    0,
    [selectedStudent]
  );
  const totalBalance = useMemo(
    () =>
    selectedStudent?.installments.reduce(
      (sum, i) => sum + i.balanceAmount,
      0
    ) || 0,
    [selectedStudent]
  );
  const totalFine = useMemo(
    () => unpaidInstallments.reduce((sum, i) => sum + i.fineBalance, 0),
    [unpaidInstallments]
  );
  const selectedFeeTotal = useMemo(
    () =>
    Array.from(selectedInstallments).reduce(
      (sum, id) => sum + (paymentAmounts[id]?.feeAmount || 0),
      0
    ),
    [selectedInstallments, paymentAmounts]
  );
  const selectedFineTotal = useMemo(
    () =>
    Array.from(selectedInstallments).reduce(
      (sum, id) => sum + (paymentAmounts[id]?.fineAmount || 0),
      0
    ),
    [selectedInstallments, paymentAmounts]
  );
  const selectedDiscountTotal = useMemo(
    () =>
    Array.from(selectedInstallments).reduce(
      (sum, id) => sum + (paymentAmounts[id]?.discountAmount || 0),
      0
    ),
    [selectedInstallments, paymentAmounts]
  );
  const grandTotal = useMemo(
    () => selectedFeeTotal + selectedFineTotal - selectedDiscountTotal,
    [selectedFeeTotal, selectedFineTotal, selectedDiscountTotal]
  );
  // Handlers
  const handleSearch = async () => {
    if (!searchValue && searchType !== 'class') return;
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockData = getMockStudentData();
    setSelectedStudent(mockData);
    setStudentFound(true);
    setIsSearching(false);
    resetPaymentForm();
  };
  const resetPaymentForm = () => {
    setSelectedInstallments(new Set());
    setPaymentAmounts({});
    setPaymentMode('cash');
    setReceiptDate(new Date().toISOString().split('T')[0]);
    setReferenceNo('');
    setChequeNo('');
    setChequeDate('');
    setBankName('');
    setNarration('');
    setReceivedBy('');
    setSendSMS(true);
    setSendEmail(true);
  };
  const handleResetAll = () => {
    setSearchValue('');
    setSearchClass('');
    setSearchSection('');
    setStudentFound(false);
    setSelectedStudent(null);
    resetPaymentForm();
    setActiveTab('payment');
  };
  const handleInstallmentSelect = (
  installment: Installment,
  checked: boolean) =>
  {
    if (installment.status === 'paid') return;
    const newSelected = new Set(selectedInstallments);
    if (checked) {
      newSelected.add(installment.id);
      setPaymentAmounts((prev) => ({
        ...prev,
        [installment.id]: {
          feeAmount: installment.balanceAmount,
          fineAmount: installment.fineBalance,
          discountAmount: 0,
          discountReason: ''
        }
      }));
    } else {
      newSelected.delete(installment.id);
      setPaymentAmounts((prev) => {
        const updated = {
          ...prev
        };
        delete updated[installment.id];
        return updated;
      });
    }
    setSelectedInstallments(newSelected);
  };
  const handleAmountChange = (
  installmentId: string,
  field: 'feeAmount' | 'fineAmount' | 'discountAmount',
  value: number) =>
  {
    const installment = selectedStudent?.installments.find(
      (i) => i.id === installmentId
    );
    if (!installment) return;
    let validValue = Math.max(0, value);
    if (field === 'feeAmount') {
      validValue = Math.min(validValue, installment.balanceAmount);
    } else if (field === 'fineAmount') {
      validValue = Math.min(validValue, installment.fineBalance);
    } else if (field === 'discountAmount') {
      const maxDiscount =
      (paymentAmounts[installmentId]?.feeAmount || 0) + (
      paymentAmounts[installmentId]?.fineAmount || 0);
      validValue = Math.min(validValue, maxDiscount);
    }
    setPaymentAmounts((prev) => ({
      ...prev,
      [installmentId]: {
        ...prev[installmentId],
        [field]: validValue
      }
    }));
  };
  const handleDiscountReasonChange = (
  installmentId: string,
  reason: string) =>
  {
    setPaymentAmounts((prev) => ({
      ...prev,
      [installmentId]: {
        ...prev[installmentId],
        discountReason: reason
      }
    }));
  };
  const handlePayFull = (installmentId: string) => {
    const installment = selectedStudent?.installments.find(
      (i) => i.id === installmentId
    );
    if (installment) {
      setPaymentAmounts((prev) => ({
        ...prev,
        [installmentId]: {
          ...prev[installmentId],
          feeAmount: installment.balanceAmount,
          fineAmount: installment.fineBalance
        }
      }));
    }
  };
  const handleSelectAllUnpaid = () => {
    const ids = unpaidInstallments.map((i) => i.id);
    setSelectedInstallments(new Set(ids));
    const amounts: Record<string, any> = {};
    unpaidInstallments.forEach((i) => {
      amounts[i.id] = {
        feeAmount: i.balanceAmount,
        fineAmount: i.fineBalance,
        discountAmount: 0,
        discountReason: ''
      };
    });
    setPaymentAmounts(amounts);
  };
  const handleDeselectAll = () => {
    setSelectedInstallments(new Set());
    setPaymentAmounts({});
  };
  const validatePayment = (): boolean => {
    if (selectedInstallments.size === 0) {
      alert('Please select at least one installment');
      return false;
    }
    if (grandTotal <= 0) {
      alert('Total amount must be greater than zero');
      return false;
    }
    if (paymentMode !== 'cash' && !referenceNo) {
      alert('Reference number is required for non-cash payments');
      return false;
    }
    if (paymentMode === 'cheque' && (!chequeNo || !chequeDate || !bankName)) {
      alert('Cheque details are required');
      return false;
    }
    // Validate discount has permission
    if (selectedDiscountTotal > 0 && !hasDiscountPermission) {
      alert('You do not have permission to apply discounts');
      return false;
    }
    return true;
  };
  const handleGenerateReceipt = async () => {
    if (!validatePayment()) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const receipt = {
      receiptNo: autoReceiptNo,
      date: receiptDate,
      student: {
        name: `${selectedStudent?.firstName} ${selectedStudent?.middleName} ${selectedStudent?.lastName}`.trim(),
        admissionNo: selectedStudent?.admissionNo,
        class: `${selectedStudent?.class}-${selectedStudent?.section}`,
        parentName: selectedStudent?.parentName,
        phone: selectedStudent?.parentPhone,
        email: selectedStudent?.parentEmail
      },
      installments: Array.from(selectedInstallments).map((id) => {
        const inst = selectedStudent?.installments.find((i) => i.id === id);
        const payment = paymentAmounts[id];
        return {
          installmentName: inst?.installmentName || '',
          feeAmount: payment?.feeAmount || 0,
          fineAmount: payment?.fineAmount || 0,
          discountAmount: payment?.discountAmount || 0,
          discountReason: payment?.discountReason || ''
        };
      }),
      totalFeeAmount: selectedFeeTotal,
      totalFineAmount: selectedFineTotal,
      totalDiscountAmount: selectedDiscountTotal,
      grandTotal,
      paymentMode,
      referenceNo: paymentMode !== 'cash' ? referenceNo : undefined,
      chequeDetails:
      paymentMode === 'cheque' ?
      {
        chequeNo,
        chequeDate,
        bankName
      } :
      undefined,
      narration,
      receivedBy: receivedBy || 'Admin',
      sendSMS,
      sendEmail,
      ledgerPosted: true
    };
    setGeneratedReceipt(receipt);
    setShowReceiptPreview(true);
    setIsGenerating(false);
  };
  const handleConfirmReceipt = async () => {
    setShowReceiptPreview(false);
    // Simulate auto ledger posting and communication
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowReceiptSuccess(true);
  };
  const handleCancelReceipt = (receipt: ReceiptHistory) => {
    setCancellingReceipt(receipt);
    setCancelReason('');
    setShowCancelModal(true);
  };
  const confirmCancelReceipt = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    // Simulate cancellation
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowCancelModal(false);
    setCancellingReceipt(null);
    alert('Receipt cancelled successfully. Ledger entries have been reversed.');
  };
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          variant: 'success' as const,
          label: 'Paid'
        };
      case 'partial':
        return {
          variant: 'warning' as const,
          label: 'Partial'
        };
      case 'overdue':
        return {
          variant: 'danger' as const,
          label: 'Overdue'
        };
      default:
        return {
          variant: 'gray' as const,
          label: 'Unpaid'
        };
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Fee Receipt
          </h1>
          <p className="text-xs text-gray-500">
            Generate fee payment receipts with auto ledger posting
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetAll}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <ReportFilters />

      {/* Student Search Section */}
      <Card
        title="Student Search"
        subtitle="Search by Admission No, Name, Class, or Mobile">

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Select
              label="Search By"
              options={searchTypeOptions}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)} />


            {searchType === 'class' ?
            <>
                <Select
                label="Class"
                options={classOptions}
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)} />

                <Select
                label="Section"
                options={sectionOptions}
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)} />

              </> :

            <div className="md:col-span-2">
                <Input
                label={
                searchType === 'admissionNo' ?
                'Admission Number' :
                searchType === 'name' ?
                'Student Name' :
                'Mobile Number'
                }
                placeholder={
                searchType === 'admissionNo' ?
                'e.g., ADM2024001' :
                searchType === 'name' ?
                'Enter student name' :
                'Enter mobile number'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                leftIcon={
                searchType === 'mobile' ?
                <Phone className="w-3.5 h-3.5" /> :

                <Search className="w-3.5 h-3.5" />

                } />

              </div>
            }

            <Select
              label="Academic Year"
              options={academicYearOptions}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)} />


            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                onClick={handleSearch}
                loading={isSearching}
                className="flex-1">

                <Search className="w-3.5 h-3.5 mr-1" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Student Found */}
      {studentFound && selectedStudent &&
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Panel - Student Info & Summary */}
          <div className="space-y-4">
            {/* Student Info */}
            <Card>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                    {selectedStudent.firstName[0]}
                    {selectedStudent.lastName[0]}
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-sm">
                      {selectedStudent.firstName} {selectedStudent.middleName}{' '}
                      {selectedStudent.lastName}
                    </h3>
                    <p className="text-blue-100 text-xs">
                      Class {selectedStudent.class}-{selectedStudent.section} |
                      Roll: {selectedStudent.rollNo}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Admission No:</span>
                  <span className="font-medium">
                    {selectedStudent.admissionNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Parent:</span>
                  <span className="font-medium">
                    {selectedStudent.parentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">
                    {selectedStudent.parentPhone}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-2 border-t">
                  {selectedStudent.hasTransport &&
                <Badge variant="info" size="xs">
                      Transport
                    </Badge>
                }
                  {selectedStudent.hasConcession &&
                <Badge variant="success" size="xs">
                      {selectedStudent.concessionPercentage}% Concession
                    </Badge>
                }
                  {selectedStudent.hasScholarship &&
                <Badge variant="warning" size="xs">
                      Scholarship
                    </Badge>
                }
                </div>
              </div>
            </Card>

            {/* Fee Summary Table */}
            <Card title="Fee Summary">
              <div className="p-0">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">Total Due</td>
                      <td className="px-3 py-2 text-right font-semibold text-red-600">
                        {formatCurrency(totalDue + totalFine)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">Total Paid</td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">
                        {formatCurrency(totalPaid)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">Balance</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {formatCurrency(totalBalance)}
                      </td>
                    </tr>
                    {totalFine > 0 &&
                  <tr className="bg-amber-50">
                        <td className="px-3 py-2 text-amber-700">Late Fine</td>
                        <td className="px-3 py-2 text-right font-semibold text-amber-700">
                          {formatCurrency(totalFine)}
                        </td>
                      </tr>
                  }
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Selected Payment Summary */}
            {selectedInstallments.size > 0 &&
          <Card className="bg-blue-50 border-blue-200">
                <div className="p-3">
                  <h4 className="text-xs font-semibold text-blue-800 mb-2">
                    Payment Summary
                  </h4>
                  <table className="w-full text-xs">
                    <tbody className="space-y-1">
                      <tr>
                        <td className="text-blue-700">Fee Amount</td>
                        <td className="text-right font-medium">
                          {formatCurrency(selectedFeeTotal)}
                        </td>
                      </tr>
                      {selectedFineTotal > 0 &&
                  <tr>
                          <td className="text-blue-700">Fine Amount</td>
                          <td className="text-right font-medium">
                            {formatCurrency(selectedFineTotal)}
                          </td>
                        </tr>
                  }
                      {selectedDiscountTotal > 0 &&
                  <tr>
                          <td className="text-green-700">Discount</td>
                          <td className="text-right font-medium text-green-700">
                            -{formatCurrency(selectedDiscountTotal)}
                          </td>
                        </tr>
                  }
                      <tr className="border-t border-blue-200">
                        <td className="text-blue-900 font-semibold pt-1">
                          Grand Total
                        </td>
                        <td className="text-right font-bold text-blue-900 text-sm pt-1">
                          {formatCurrency(grandTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
          }
          </div>

          {/* Right Panel - Installments & Payment */}
          <div className="lg:col-span-3 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
              <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'payment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                Make Payment ({unpaidInstallments.length})
              </button>
              <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                <History className="w-3.5 h-3.5 inline mr-1" />
                Receipt History ({selectedStudent.receiptHistory.length})
              </button>
            </div>

            {activeTab === 'payment' &&
          <>
                {/* Payment Details */}
                <Card title="Payment Details">
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Input
                    label="Receipt Date"
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    required />

                      <Select
                    label="Payment Mode"
                    options={paymentModeOptions}
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    required />

                      {paymentMode !== 'cash' &&
                  <Input
                    label="Reference No"
                    placeholder="Transaction/UTR No"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    required />

                  }
                      <Input
                    label="Received By"
                    placeholder="Staff name"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)} />

                    </div>

                    {paymentMode === 'cheque' &&
                <div className="grid grid-cols-3 gap-3 mt-3 p-3 bg-gray-50 rounded-md">
                        <Input
                    label="Cheque No"
                    placeholder="Cheque number"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    required />

                        <Input
                    label="Cheque Date"
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    required />

                        <Input
                    label="Bank Name"
                    placeholder="Bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required />

                      </div>
                }

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Narration / Remarks
                      </label>
                      <textarea
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="Enter any remarks or narration..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={2} />

                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                      type="checkbox"
                      checked={sendSMS}
                      onChange={(e) => setSendSMS(e.target.checked)}
                      className="w-3.5 h-3.5 rounded" />

                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                        Send SMS
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-3.5 h-3.5 rounded" />

                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        Send Email
                      </label>
                      {hasDiscountPermission &&
                  <label className="flex items-center gap-2 text-xs cursor-pointer ml-auto">
                          <input
                      type="checkbox"
                      checked={showDiscountEntry}
                      onChange={(e) =>
                      setShowDiscountEntry(e.target.checked)
                      }
                      className="w-3.5 h-3.5 rounded" />

                          <BadgePercent className="w-3.5 h-3.5 text-gray-500" />
                          Apply Discount
                        </label>
                  }
                    </div>
                  </div>
                </Card>

                {/* Installment Selection Table */}
                <Card
              title="Select Installments"
              subtitle="Partial payment allowed - enter custom amounts"
              action={
              <div className="flex gap-1">
                      <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleDeselectAll}>

                        Clear
                      </Button>
                      <Button
                  variant="secondary"
                  size="xs"
                  onClick={handleSelectAllUnpaid}>

                        Select All
                      </Button>
                    </div>
              }>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left w-8">
                            <input
                          type="checkbox"
                          checked={
                          selectedInstallments.size ===
                          unpaidInstallments.length &&
                          unpaidInstallments.length > 0
                          }
                          onChange={(e) =>
                          e.target.checked ?
                          handleSelectAllUnpaid() :
                          handleDeselectAll()
                          }
                          className="w-3.5 h-3.5 rounded" />

                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Installment
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-600">
                            Due Date
                          </th>
                          <th className="px-3 py-2 text-right font-semibold text-gray-600">
                            Net Amount
                          </th>
                          <th className="px-3 py-2 text-right font-semibold text-gray-600">
                            Paid
                          </th>
                          <th className="px-3 py-2 text-right font-semibold text-gray-600">
                            Balance
                          </th>
                          <th className="px-3 py-2 text-right font-semibold text-gray-600">
                            Fine
                          </th>
                          <th className="px-3 py-2 text-center font-semibold text-gray-600">
                            Status
                          </th>
                          <th className="px-3 py-2 text-right font-semibold text-gray-600">
                            Paying
                          </th>
                          <th className="px-3 py-2 text-center w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedStudent.installments.map((inst) => {
                      const isSelected = selectedInstallments.has(inst.id);
                      const isPaid = inst.status === 'paid';
                      const statusConfig = getStatusConfig(inst.status);
                      const isExpanded = expandedInstallment === inst.id;
                      return (
                        <Fragment key={inst.id}>
                              <tr
                            className={`${isSelected ? 'bg-blue-50' : isPaid ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}>

                                <td className="px-3 py-2">
                                  <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                handleInstallmentSelect(
                                  inst,
                                  e.target.checked
                                )
                                }
                                disabled={isPaid}
                                className="w-3.5 h-3.5 rounded disabled:opacity-40" />

                                </td>
                                <td className="px-3 py-2">
                                  <div className="font-medium text-gray-900">
                                    {inst.installmentName}
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    {inst.feeHeads.length} fee heads
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div>
                                    {new Date(inst.dueDate).toLocaleDateString(
                                  'en-IN',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  }
                                )}
                                  </div>
                                  {inst.daysOverdue > 0 &&
                              <div className="text-[10px] text-red-600">
                                      {inst.daysOverdue} days overdue
                                    </div>
                              }
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  {formatCurrency(inst.netAmount)}
                                </td>
                                <td className="px-3 py-2 text-right text-green-600">
                                  {formatCurrency(inst.paidAmount)}
                                </td>
                                <td className="px-3 py-2 text-right font-semibold text-red-600">
                                  {formatCurrency(inst.balanceAmount)}
                                </td>
                                <td className="px-3 py-2 text-right text-amber-600">
                                  {inst.fineBalance > 0 ?
                              formatCurrency(inst.fineBalance) :
                              '-'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <Badge
                                variant={statusConfig.variant}
                                size="xs">

                                    {statusConfig.label}
                                  </Badge>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {isSelected &&
                              <span className="font-semibold text-blue-600">
                                      {formatCurrency(
                                  (paymentAmounts[inst.id]?.feeAmount ||
                                  0) + (
                                  paymentAmounts[inst.id]?.
                                  fineAmount || 0) - (
                                  paymentAmounts[inst.id]?.
                                  discountAmount || 0)
                                )}
                                    </span>
                              }
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {!isPaid &&
                              <button
                                onClick={() =>
                                setExpandedInstallment(
                                  isExpanded ? null : inst.id
                                )
                                }
                                className="p-1 hover:bg-gray-200 rounded">

                                      {isExpanded ?
                                <ChevronUp className="w-3.5 h-3.5" /> :

                                <ChevronDown className="w-3.5 h-3.5" />
                                }
                                    </button>
                              }
                                </td>
                              </tr>

                              {/* Expanded Row - Fee Breakdown & Payment Entry */}
                              {isExpanded && !isPaid &&
                          <tr>
                                  <td
                              colSpan={10}
                              className="px-3 py-3 bg-gray-50">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Fee Breakdown */}
                                      <div>
                                        <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                          Fee Breakdown
                                        </h5>
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="text-gray-500">
                                              <th className="text-left py-1">
                                                Fee Head
                                              </th>
                                              <th className="text-right py-1">
                                                Amount
                                              </th>
                                              <th className="text-right py-1">
                                                Discount
                                              </th>
                                              <th className="text-right py-1">
                                                Net
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {inst.feeHeads.map((fh) =>
                                      <tr key={fh.id}>
                                                <td className="py-1">
                                                  {fh.name}
                                                </td>
                                                <td className="py-1 text-right">
                                                  {formatCurrency(fh.amount)}
                                                </td>
                                                <td className="py-1 text-right text-green-600">
                                                  {fh.discountAmount > 0 ?
                                          `-${formatCurrency(fh.discountAmount)}` :
                                          '-'}
                                                </td>
                                                <td className="py-1 text-right font-medium">
                                                  {formatCurrency(fh.netAmount)}
                                                </td>
                                              </tr>
                                      )}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Payment Entry */}
                                      {isSelected &&
                                <div className="bg-blue-50 rounded-md p-3">
                                          <h5 className="text-xs font-semibold text-blue-800 mb-2">
                                            Payment Entry (Partial Allowed)
                                          </h5>
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <label className="text-xs text-gray-600 w-20">
                                                Fee Amount
                                              </label>
                                              <input
                                        type="number"
                                        value={
                                        paymentAmounts[inst.id]?.
                                        feeAmount || 0
                                        }
                                        onChange={(e) =>
                                        handleAmountChange(
                                          inst.id,
                                          'feeAmount',
                                          parseFloat(
                                            e.target.value
                                          ) || 0
                                        )
                                        }
                                        min={0}
                                        max={inst.balanceAmount}
                                        className="flex-1 px-2 py-1 text-xs border rounded" />

                                              <span className="text-[10px] text-gray-500">
                                                /{' '}
                                                {formatCurrency(
                                          inst.balanceAmount
                                        )}
                                              </span>
                                              <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() =>
                                        handlePayFull(inst.id)
                                        }>

                                                Full
                                              </Button>
                                            </div>
                                            {inst.fineBalance > 0 &&
                                    <div className="flex items-center gap-2">
                                                <label className="text-xs text-gray-600 w-20">
                                                  Fine Amount
                                                </label>
                                                <input
                                        type="number"
                                        value={
                                        paymentAmounts[inst.id]?.
                                        fineAmount || 0
                                        }
                                        onChange={(e) =>
                                        handleAmountChange(
                                          inst.id,
                                          'fineAmount',
                                          parseFloat(
                                            e.target.value
                                          ) || 0
                                        )
                                        }
                                        min={0}
                                        max={inst.fineBalance}
                                        className="flex-1 px-2 py-1 text-xs border rounded" />

                                                <span className="text-[10px] text-gray-500">
                                                  /{' '}
                                                  {formatCurrency(
                                          inst.fineBalance
                                        )}
                                                </span>
                                              </div>
                                    }
                                            {showDiscountEntry &&
                                    hasDiscountPermission &&
                                    <>
                                                  <div className="flex items-center gap-2">
                                                    <label className="text-xs text-gray-600 w-20">
                                                      Discount
                                                    </label>
                                                    <input
                                          type="number"
                                          value={
                                          paymentAmounts[inst.id]?.
                                          discountAmount || 0
                                          }
                                          onChange={(e) =>
                                          handleAmountChange(
                                            inst.id,
                                            'discountAmount',
                                            parseFloat(
                                              e.target.value
                                            ) || 0
                                          )
                                          }
                                          min={0}
                                          className="flex-1 px-2 py-1 text-xs border rounded" />

                                                  </div>
                                                  {(paymentAmounts[inst.id]?.
                                      discountAmount || 0) >
                                      0 &&
                                      <div className="flex items-center gap-2">
                                                      <label className="text-xs text-gray-600 w-20">
                                                        Reason
                                                      </label>
                                                      <input
                                          type="text"
                                          value={
                                          paymentAmounts[
                                          inst.id]?.
                                          discountReason ||
                                          ''
                                          }
                                          onChange={(e) =>
                                          handleDiscountReasonChange(
                                            inst.id,
                                            e.target.value
                                          )
                                          }
                                          placeholder="Discount reason (required)"
                                          className="flex-1 px-2 py-1 text-xs border rounded" />

                                                    </div>
                                      }
                                                </>
                                    }
                                          </div>
                                        </div>
                                }
                                    </div>
                                  </td>
                                </tr>
                          }
                            </Fragment>);

                    })}
                      </tbody>
                    </table>
                  </div>

                  {/* Generate Receipt Button */}
                  <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      {selectedInstallments.size > 0 &&
                  <>
                          <span className="font-medium">
                            {selectedInstallments.size} installment(s) selected
                          </span>
                          <span className="mx-2">•</span>
                          <span className="font-semibold text-blue-600">
                            Total: {formatCurrency(grandTotal)}
                          </span>
                        </>
                  }
                    </div>
                    <div className="flex gap-2">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPaymentForm}>

                        <X className="w-3.5 h-3.5 mr-1" />
                        Cancel
                      </Button>
                      <Button
                    variant="success"
                    size="sm"
                    onClick={handleGenerateReceipt}
                    disabled={selectedInstallments.size === 0}
                    loading={isGenerating}>

                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        Generate Receipt
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
          }

            {activeTab === 'history' &&
          <Card
            title="Receipt History"
            subtitle="View, print, or cancel receipts">

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Receipt No
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Installments
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Mode
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedStudent.receiptHistory.map((receipt) =>
                  <tr
                    key={receipt.id}
                    className={
                    receipt.status === 'cancelled' ?
                    'bg-red-50/50' :
                    'hover:bg-gray-50'
                    }>

                          <td className="px-3 py-2">
                            <div className="font-medium text-blue-600">
                              {receipt.receiptNo}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {new Date(receipt.date).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {receipt.installments.map((inst, idx) =>
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">

                                  {inst.installmentName.substring(0, 15)}...
                                </span>
                        )}
                            </div>
                          </td>
                          <td className="px-3 py-2">{receipt.paymentMode}</td>
                          <td className="px-3 py-2 text-right font-semibold">
                            <span
                        className={
                        receipt.status === 'cancelled' ?
                        'line-through text-gray-400' :
                        ''
                        }>

                              {formatCurrency(receipt.totalAmount)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Badge
                        variant={
                        receipt.status === 'completed' ?
                        'success' :
                        'danger'
                        }
                        size="xs">

                              {receipt.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="View">

                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Print">

                                <Printer className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Download">

                                <Download className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              {receipt.status === 'completed' &&
                        <button
                          className="p-1 hover:bg-red-100 rounded"
                          title="Cancel Receipt"
                          onClick={() => handleCancelReceipt(receipt)}>

                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                </button>
                        }
                            </div>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
              </Card>
          }
          </div>
        </div>
      }

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        title="Receipt Preview"
        size="lg">

        {generatedReceipt &&
        <div className="p-4">
            <div className="border rounded-lg p-6 bg-white">
              {/* Header */}
              <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  ABC International School
                </h2>
                <p className="text-xs text-gray-500">
                  123 Education Street, Knowledge City - 123456
                </p>
                <div className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  FEE RECEIPT
                </div>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p>
                    <span className="text-gray-500">Receipt No:</span>{' '}
                    <strong className="text-blue-600">
                      {generatedReceipt.receiptNo}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Date:</span>{' '}
                    <strong>
                      {new Date(generatedReceipt.date).toLocaleDateString(
                      'en-IN'
                    )}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Payment Mode:</span>{' '}
                    <strong>
                      {
                    paymentModeOptions.find((p) => p.value === paymentMode)?.
                    label
                    }
                    </strong>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-gray-500">Student:</span>{' '}
                    <strong>{generatedReceipt.student.name}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Admission No:</span>{' '}
                    <strong>{generatedReceipt.student.admissionNo}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Class:</span>{' '}
                    <strong>{generatedReceipt.student.class}</strong>
                  </p>
                </div>
              </div>

              {/* Fee Table */}
              <table className="w-full text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left border">Installment</th>
                    <th className="px-3 py-2 text-right border">Fee</th>
                    <th className="px-3 py-2 text-right border">Fine</th>
                    <th className="px-3 py-2 text-right border">Discount</th>
                    <th className="px-3 py-2 text-right border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedReceipt.installments.map(
                  (inst: any, idx: number) =>
                  <tr key={idx}>
                        <td className="px-3 py-2 border">
                          {inst.installmentName}
                        </td>
                        <td className="px-3 py-2 text-right border">
                          {formatCurrency(inst.feeAmount)}
                        </td>
                        <td className="px-3 py-2 text-right border">
                          {inst.fineAmount > 0 ?
                      formatCurrency(inst.fineAmount) :
                      '-'}
                        </td>
                        <td className="px-3 py-2 text-right border text-green-600">
                          {inst.discountAmount > 0 ?
                      `-${formatCurrency(inst.discountAmount)}` :
                      '-'}
                        </td>
                        <td className="px-3 py-2 text-right border font-medium">
                          {formatCurrency(
                        inst.feeAmount +
                        inst.fineAmount -
                        inst.discountAmount
                      )}
                        </td>
                      </tr>

                )}
                </tbody>
                <tfoot className="bg-green-50">
                  <tr>
                    <td className="px-3 py-3 border font-bold">Total</td>
                    <td className="px-3 py-3 text-right border">
                      {formatCurrency(generatedReceipt.totalFeeAmount)}
                    </td>
                    <td className="px-3 py-3 text-right border">
                      {generatedReceipt.totalFineAmount > 0 ?
                    formatCurrency(generatedReceipt.totalFineAmount) :
                    '-'}
                    </td>
                    <td className="px-3 py-3 text-right border text-green-600">
                      {generatedReceipt.totalDiscountAmount > 0 ?
                    `-${formatCurrency(generatedReceipt.totalDiscountAmount)}` :
                    '-'}
                    </td>
                    <td className="px-3 py-3 text-right border font-bold text-green-700 text-lg">
                      {formatCurrency(generatedReceipt.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Amount in Words */}
              <div className="p-3 bg-gray-50 rounded text-sm mb-4">
                <span className="text-gray-500">Amount in Words: </span>
                <strong>
                  Rupees {numberToWords(generatedReceipt.grandTotal)} Only
                </strong>
              </div>

              {generatedReceipt.narration &&
            <div className="text-sm mb-4">
                  <span className="text-gray-500">Narration: </span>
                  <span className="italic">{generatedReceipt.narration}</span>
                </div>
            }

              {/* Footer */}
              <div className="flex justify-between items-end pt-4 border-t text-xs text-gray-500">
                <div>
                  <p>
                    Auto Ledger Posted:{' '}
                    <CheckCircle className="w-3 h-3 inline text-green-500" />
                  </p>
                  <p>
                    SMS:{' '}
                    {generatedReceipt.sendSMS ?
                  <CheckCircle className="w-3 h-3 inline text-green-500" /> :

                  <X className="w-3 h-3 inline text-gray-400" />
                  }
                  </p>
                  <p>
                    Email:{' '}
                    {generatedReceipt.sendEmail ?
                  <CheckCircle className="w-3 h-3 inline text-green-500" /> :

                  <X className="w-3 h-3 inline text-gray-400" />
                  }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-gray-300 pt-1">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-4 pt-4 border-t">
              <Button
              variant="outline"
              onClick={() => setShowReceiptPreview(false)}>

                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmReceipt}>
                <Check className="w-3.5 h-3.5 mr-1" />
                Confirm & Save
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showReceiptSuccess}
        onClose={() => {
          setShowReceiptSuccess(false);
          resetPaymentForm();
        }}
        title="Receipt Generated!"
        size="sm">

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Receipt No:{' '}
            <strong className="text-blue-600">
              {generatedReceipt?.receiptNo}
            </strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Amount:{' '}
            <strong className="text-green-600">
              {formatCurrency(generatedReceipt?.grandTotal || 0)}
            </strong>
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Downloading...')}>

              <Download className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>
            <Button variant="primary" size="sm" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => {
              setShowReceiptSuccess(false);
              resetPaymentForm();
            }}>

            Close
          </Button>
        </div>
      </Modal>

      {/* Cancel Receipt Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Receipt"
        size="sm">

        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                Warning: This action will reverse all ledger entries
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Receipt: <strong>{cancellingReceipt?.receiptNo}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Amount:{' '}
            <strong>
              {formatCurrency(cancellingReceipt?.totalAmount || 0)}
            </strong>
          </p>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cancellation Reason *
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3} />

          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelModal(false)}>

              Close
            </Button>
            <Button variant="danger" size="sm" onClick={confirmCancelReceipt}>
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}
// Utility
function numberToWords(num: number): string {
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

  if (num === 0) return 'Zero';
  const convert = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' + (
      n % 100 ? ' ' + convert(n % 100) : ''));

  };
  if (num >= 10000000)
  return (
    convert(Math.floor(num / 10000000)) +
    ' Crore ' +
    numberToWords(num % 10000000));

  if (num >= 100000)
  return (
    convert(Math.floor(num / 100000)) + ' Lakh ' + numberToWords(num % 100000));

  if (num >= 1000)
  return convert(Math.floor(num / 1000)) + ' Thousand ' + convert(num % 1000);
  return convert(num);
}
export default FeeReceipt;