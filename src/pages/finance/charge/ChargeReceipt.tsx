import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  User,
  Plus,
  Printer,
  Download,
  Eye,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  Receipt,
  History,
  Filter,
  RefreshCw,
  Check,
  AlertCircle,
  Hash,
  ChevronDown,
  ChevronRight,
  Wallet,
  Banknote,
  CreditCard,
  Smartphone,
  Globe,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  MoreVertical,
  ArrowLeft,
  Share2,
  Copy,
  GraduationCap,
  Users,
  IndianRupee,
  FileCheck,
  Loader2,
  ChevronUp,
  SlidersHorizontal,
  UserCheck,
  BookOpen,
  Award,
  Info } from
'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

type PaymentMode = 'cash' | 'cheque' | 'online' | 'upi' | 'card' | 'neft';
type ChargeStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived';
type ReceiptStatus = 'completed' | 'cancelled' | 'pending';

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  section: string;
  rollNumber: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  photo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  totalDue: number;
  totalPaid: number;
  lastPaymentDate: string | null;
  status: 'active' | 'inactive';
  pendingChargesCount: number;
}

interface Charge {
  id: string;
  chargeHead: string;
  description: string;
  category: string;
  dueDate: string;
  originalAmount: number;
  fineAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  status: ChargeStatus;
  createdDate: string;
  createdBy: string;
  isAdHoc: boolean;
}

interface ChargeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  date: string;
  time: string;
  charges: {
    chargeHead: string;
    amount: number;
    fine: number;
    discount: number;
    total: number;
  }[];
  subTotal: number;
  totalFine: number;
  totalDiscount: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  bankName?: string;
  transactionRef?: string;
  chequeNo?: string;
  chequeDate?: string;
  remarks: string;
  receivedBy: string;
  status: ReceiptStatus;
}

interface SearchFilters {
  searchTerm: string;
  class: string;
  section: string;
  status: string;
  hasDues: string;
}

// ============================================
// CUSTOM COMPONENTS
// ============================================

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm'
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>);

}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      }
      <div className="relative">
        {leftIcon &&
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        }
        <input
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props} />

        {rightIcon &&
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        }
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>);

}

// Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = ''
}: SelectProps) {
  return (
    <div className={className}>
      {label &&
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      }
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">

        <option value="">{placeholder}</option>
        {options.map((opt) =>
        <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )}
      </select>
    </div>);

}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}>

      {children}
    </span>);

}

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function Card({ children, className = '', padding = 'none' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}>

      {children}
    </div>);

}

// Tab Component
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
              ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
            `}>

            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined &&
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
              isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`
              }>

                {tab.count}
              </span>
            }
          </button>);

      })}
    </div>);

}

// Status Badge
function StatusBadge({ status }: {status: ChargeStatus | ReceiptStatus | string;}) {
  const config: Record<string, {variant: BadgeProps['variant'];label: string;}> = {
    pending: { variant: 'warning', label: 'Pending' },
    partial: { variant: 'info', label: 'Partial' },
    paid: { variant: 'success', label: 'Paid' },
    overdue: { variant: 'danger', label: 'Overdue' },
    waived: { variant: 'purple', label: 'Waived' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' }
  };

  const { variant, label } = config[status] || { variant: 'default', label: status };

  return <Badge variant={variant}>{label}</Badge>;
}

// Empty State
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
      {action &&
      <Button variant="primary" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      }
    </div>);

}

// Payment Mode Icon
function PaymentModeIcon({ mode }: {mode: string;}) {
  const icons: Record<string, React.ElementType> = {
    cash: Banknote,
    cheque: FileText,
    online: Globe,
    upi: Smartphone,
    card: CreditCard,
    neft: Building2
  };
  const Icon = icons[mode] || Wallet;
  return <Icon className="w-4 h-4" />;
}

// ============================================
// STUDENT CARD COMPONENT
// ============================================

interface StudentCardProps {
  student: Student;
  isSelected: boolean;
  onView: () => void;
}

function StudentCard({ student, isSelected, onView }: StudentCardProps) {
  return (
    <div
      className={`
        p-4 border rounded-xl transition-all cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}
      `}
      onClick={onView}>

      <div className="flex items-start gap-4">
        <img
          src={student.photo}
          alt={student.name}
          className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-gray-900 truncate">{student.name}</h3>
              <p className="text-sm text-gray-500">
                {student.admissionNo} • Class {student.class}-{student.section}
              </p>
            </div>
            <StatusBadge status={student.status} />
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Phone className="w-3.5 h-3.5" />
              <span>{student.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <User className="w-3.5 h-3.5" />
              <span>{student.fatherName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {student.totalDue > 0 ?
              <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    Due: ₹{student.totalDue.toLocaleString()}
                  </span>
                </div> :

              <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">No Dues</span>
                </div>
              }
              {student.pendingChargesCount > 0 &&
              <Badge variant="warning" size="sm">
                  {student.pendingChargesCount} Pending Charges
                </Badge>
              }
            </div>
            <Button variant="primary" size="sm" onClick={(e) => {e.stopPropagation();onView();}}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </div>);

}

// ============================================
// CHARGE ROW COMPONENT
// ============================================

interface ChargeRowProps {
  charge: Charge;
  isSelected: boolean;
  discount: number;
  onSelect: (selected: boolean) => void;
  onDiscountChange: (discount: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function ChargeRow({
  charge,
  isSelected,
  discount,
  onSelect,
  onDiscountChange,
  onEdit,
  onDelete
}: ChargeRowProps) {
  const total = charge.originalAmount + charge.fineAmount - discount;

  return (
    <tr className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-gray-900">{charge.chargeHead}</p>
          <p className="text-xs text-gray-500 mt-0.5">{charge.description}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="default" size="sm">{charge.category}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(charge.dueDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        ₹{charge.originalAmount.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right">
        {charge.fineAmount > 0 ?
        <span className="text-red-600">+₹{charge.fineAmount.toLocaleString()}</span> :

        <span className="text-gray-400">-</span>
        }
      </td>
      <td className="px-4 py-3">
        {isSelected ?
        <Input
          type="number"
          value={discount || ''}
          onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-20 text-right text-sm" /> :


        <span className="text-gray-400">-</span>
        }
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        ₹{total.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={charge.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {charge.isAdHoc &&
          <>
              <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">

                <Edit3 className="w-4 h-4" />
              </button>
              <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">

                <Trash2 className="w-4 h-4" />
              </button>
            </>
          }
        </div>
      </td>
    </tr>);

}

// ============================================
// RECEIPT CARD COMPONENT
// ============================================

interface ReceiptCardProps {
  receipt: ChargeReceipt;
  onView: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

function ReceiptCard({ receipt, onView, onPrint, onDownload }: ReceiptCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-900">{receipt.receiptNo}</p>
            <p className="text-xs text-gray-500">
              {new Date(receipt.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}{' '}
              at {receipt.time}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg text-blue-600">₹{receipt.grandTotal.toLocaleString()}</p>
          <StatusBadge status={receipt.status} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PaymentModeIcon mode={receipt.paymentMode} />
            <span className="capitalize">{receipt.paymentMode}</span>
            {receipt.transactionRef &&
            <span className="text-gray-400">• Ref: {receipt.transactionRef}</span>
            }
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="xs" onClick={onView}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="xs" onClick={onPrint}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="xs" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {receipt.charges.slice(0, 3).map((charge, idx) =>
          <Badge key={idx} variant="default" size="sm">
              {charge.chargeHead}
            </Badge>
          )}
          {receipt.charges.length > 3 &&
          <Badge variant="default" size="sm">
              +{receipt.charges.length - 3} more
            </Badge>
          }
        </div>
      </div>
    </div>);

}

// ============================================
// PAYMENT MODAL COMPONENT
// ============================================

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  selectedCharges: Charge[];
  discounts: Record<string, number>;
  onPaymentComplete: (receipt: ChargeReceipt) => void;
}

function PaymentModal({
  isOpen,
  onClose,
  student,
  selectedCharges,
  discounts,
  onPaymentComplete
}: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [paymentForm, setPaymentForm] = useState({
    receiptDate: new Date().toISOString().split('T')[0],
    paymentMode: 'cash' as PaymentMode,
    bankName: '',
    transactionRef: '',
    chequeNo: '',
    chequeDate: '',
    remarks: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<ChargeReceipt | null>(null);

  const calculations = useMemo(() => {
    const subTotal = selectedCharges.reduce((sum, c) => sum + c.originalAmount, 0);
    const totalFine = selectedCharges.reduce((sum, c) => sum + c.fineAmount, 0);
    const totalDiscount = selectedCharges.reduce((sum, c) => sum + (discounts[c.id] || 0), 0);
    const grandTotal = subTotal + totalFine - totalDiscount;

    return { subTotal, totalFine, totalDiscount, grandTotal };
  }, [selectedCharges, discounts]);

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const receipt: ChargeReceipt = {
      id: `RCP-${Date.now()}`,
      receiptNo: `CHRG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
      studentId: student.id,
      date: paymentForm.receiptDate,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      charges: selectedCharges.map((c) => ({
        chargeHead: c.chargeHead,
        amount: c.originalAmount,
        fine: c.fineAmount,
        discount: discounts[c.id] || 0,
        total: c.originalAmount + c.fineAmount - (discounts[c.id] || 0)
      })),
      subTotal: calculations.subTotal,
      totalFine: calculations.totalFine,
      totalDiscount: calculations.totalDiscount,
      grandTotal: calculations.grandTotal,
      paymentMode: paymentForm.paymentMode,
      bankName: paymentForm.bankName,
      transactionRef: paymentForm.transactionRef,
      chequeNo: paymentForm.chequeNo,
      chequeDate: paymentForm.chequeDate,
      remarks: paymentForm.remarks,
      receivedBy: 'Mr. Rajesh Kumar',
      status: 'completed'
    };

    setGeneratedReceipt(receipt);
    setIsProcessing(false);
    setStep('success');
    onPaymentComplete(receipt);
  };

  const resetAndClose = () => {
    setStep('details');
    setPaymentForm({
      receiptDate: new Date().toISOString().split('T')[0],
      paymentMode: 'cash',
      bankName: '',
      transactionRef: '',
      chequeNo: '',
      chequeDate: '',
      remarks: ''
    });
    setGeneratedReceipt(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={resetAndClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl text-gray-900">
              {step === 'details' && 'Payment Details'}
              {step === 'review' && 'Review Payment'}
              {step === 'success' && 'Payment Successful'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{student.name} • {student.admissionNo}</p>
          </div>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 'details' &&
          <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                <h3 className="text-sm text-gray-500 uppercase mb-4">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  {selectedCharges.map((charge) =>
                <div key={charge.id} className="flex justify-between">
                      <span className="text-gray-600 truncate max-w-[250px]">{charge.chargeHead}</span>
                      <span>₹{(charge.originalAmount + charge.fineAmount - (discounts[charge.id] || 0)).toLocaleString()}</span>
                    </div>
                )}
                  <div className="border-t border-blue-200 my-3" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{calculations.subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fine</span>
                    <span className="text-red-600">+₹{calculations.totalFine.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{calculations.totalDiscount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-blue-200 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">Total Payable</span>
                    <span className="text-2xl text-blue-600">₹{calculations.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Receipt Date"
                type="date"
                value={paymentForm.receiptDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, receiptDate: e.target.value })} />

                <Select
                label="Payment Mode"
                options={[
                { value: 'cash', label: 'Cash' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'online', label: 'Online / NEFT / RTGS' },
                { value: 'upi', label: 'UPI' },
                { value: 'card', label: 'Debit / Credit Card' }]
                }
                value={paymentForm.paymentMode}
                onChange={(value) => setPaymentForm({ ...paymentForm, paymentMode: value as PaymentMode })} />

              </div>

              {/* Conditional Fields */}
              {paymentForm.paymentMode === 'cheque' &&
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                label="Cheque Number"
                value={paymentForm.chequeNo}
                onChange={(e) => setPaymentForm({ ...paymentForm, chequeNo: e.target.value })}
                placeholder="Enter cheque number" />

                  <Input
                label="Cheque Date"
                type="date"
                value={paymentForm.chequeDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, chequeDate: e.target.value })} />

                  <Input
                label="Bank Name"
                value={paymentForm.bankName}
                onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank" />

                </div>
            }

              {(paymentForm.paymentMode === 'online' || paymentForm.paymentMode === 'upi' || paymentForm.paymentMode === 'card') &&
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                label="Transaction Reference"
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                placeholder="Enter transaction ID" />

                  <Input
                label="Bank Name"
                value={paymentForm.bankName}
                onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank" />

                </div>
            }

              <Input
              label="Remarks (Optional)"
              value={paymentForm.remarks}
              onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
              placeholder="Enter any remarks for this payment..." />

            </div>
          }

          {step === 'review' &&
          <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img src={student.photo} alt={student.name} className="w-16 h-16 rounded-xl" />
                <div>
                  <p className="text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.admissionNo}</p>
                  <p className="text-sm text-gray-500">Class {student.class}-{student.section}</p>
                </div>
              </div>

              {/* Charges Table */}
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-3">Charges Breakdown</h4>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Charge</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                      <th className="px-3 py-2 text-right">Fine</th>
                      <th className="px-3 py-2 text-right">Discount</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCharges.map((charge) =>
                  <tr key={charge.id} className="border-b">
                        <td className="px-3 py-2">{charge.chargeHead}</td>
                        <td className="px-3 py-2 text-right">₹{charge.originalAmount.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-red-600">
                          {charge.fineAmount > 0 ? `₹${charge.fineAmount}` : '-'}
                        </td>
                        <td className="px-3 py-2 text-right text-green-600">
                          {discounts[charge.id] ? `₹${discounts[charge.id]}` : '-'}
                        </td>
                        <td className="px-3 py-2 text-right">
                          ₹{(charge.originalAmount + charge.fineAmount - (discounts[charge.id] || 0)).toLocaleString()}
                        </td>
                      </tr>
                  )}
                  </tbody>
                  <tfoot className="bg-blue-50">
                    <tr>
                      <td colSpan={4} className="px-3 py-3">Grand Total</td>
                      <td className="px-3 py-3 text-right text-xl text-blue-600">
                        ₹{calculations.grandTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
                <div>
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="ml-2 capitalize">{paymentForm.paymentMode}</span>
                </div>
                <div>
                  <span className="text-gray-500">Receipt Date:</span>
                  <span className="ml-2">{new Date(paymentForm.receiptDate).toLocaleDateString('en-IN')}</span>
                </div>
                {paymentForm.transactionRef &&
              <div>
                    <span className="text-gray-500">Transaction Ref:</span>
                    <span className="ml-2">{paymentForm.transactionRef}</span>
                  </div>
              }
                {paymentForm.chequeNo &&
              <div>
                    <span className="text-gray-500">Cheque No:</span>
                    <span className="ml-2">{paymentForm.chequeNo}</span>
                  </div>
              }
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="mb-1">Please verify all details before confirming.</p>
                  <p>Once confirmed, a receipt will be generated and the payment will be recorded.</p>
                </div>
              </div>
            </div>
          }

          {step === 'success' && generatedReceipt &&
          <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-500">Receipt has been generated successfully</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-lg text-green-700">{generatedReceipt.receiptNo}</span>
                  <button
                  onClick={() => navigator.clipboard.writeText(generatedReceipt.receiptNo)}
                  className="p-1 hover:bg-gray-100 rounded">

                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Receipt Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg">Delhi Public School</h4>
                      <p className="text-sm text-blue-100">Charge Payment Receipt</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-100">Receipt No.</p>
                      <p className="">{generatedReceipt.receiptNo}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Student</p>
                      <p className="text-gray-900">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="text-gray-900">
                        {new Date(generatedReceipt.date).toLocaleDateString('en-IN')} at {generatedReceipt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700">Amount Paid</span>
                    <span className="text-2xl text-green-700">₹{generatedReceipt.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          {step === 'details' &&
          <>
              <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
              <Button variant="primary" onClick={() => setStep('review')}>
                Review Payment
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          }
          {step === 'review' &&
          <>
              <Button variant="outline" onClick={() => setStep('details')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button variant="success" onClick={handleProcessPayment} loading={isProcessing}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Payment
              </Button>
            </>
          }
          {step === 'success' &&
          <>
              <div />
              <Button variant="primary" onClick={resetAndClose}>
                <Plus className="w-4 h-4 mr-2" />
                New Payment
              </Button>
            </>
          }
        </div>
      </div>
    </div>);

}

// ============================================
// MAIN COMPONENT
// ============================================

export function ChargeReceipt() {
  // State
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    class: '',
    section: '',
    status: '',
    hasDues: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'charges' | 'history'>('charges');
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
  const [chargeDiscounts, setChargeDiscounts] = useState<Record<string, number>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock Data
  const studentsData: Student[] = [
  {
    id: 'STU001',
    name: 'Rahul Amit Sharma',
    admissionNo: 'ADM-2024-001',
    class: '10',
    section: 'A',
    rollNumber: '15',
    fatherName: 'Amit Sharma',
    motherName: 'Priya Sharma',
    phone: '9876543210',
    email: 'amit.sharma@email.com',
    address: '123, Green Valley, Sector 15, Mumbai - 400001',
    photo: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=3b82f6&color=fff&size=200',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    bloodGroup: 'B+',
    totalDue: 2600,
    totalPaid: 45000,
    lastPaymentDate: '2024-02-15',
    status: 'active',
    pendingChargesCount: 5
  },
  {
    id: 'STU002',
    name: 'Priya Patel',
    admissionNo: 'ADM-2024-002',
    class: '9',
    section: 'B',
    rollNumber: '08',
    fatherName: 'Raj Patel',
    motherName: 'Meena Patel',
    phone: '9876543211',
    email: 'raj.patel@email.com',
    address: '456, Blue Heights, Sector 22, Mumbai - 400002',
    photo: 'https://ui-avatars.com/api/?name=Priya+Patel&background=8b5cf6&color=fff&size=200',
    dateOfBirth: '2009-08-20',
    gender: 'Female',
    bloodGroup: 'A+',
    totalDue: 1500,
    totalPaid: 38000,
    lastPaymentDate: '2024-03-01',
    status: 'active',
    pendingChargesCount: 3
  },
  {
    id: 'STU003',
    name: 'Amit Kumar Singh',
    admissionNo: 'ADM-2024-005',
    class: '10',
    section: 'A',
    rollNumber: '12',
    fatherName: 'Vijay Kumar',
    motherName: 'Sunita Kumar',
    phone: '9876543212',
    email: 'vijay.kumar@email.com',
    address: '789, Rose Garden, Sector 18, Mumbai - 400003',
    photo: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10b981&color=fff&size=200',
    dateOfBirth: '2008-03-10',
    gender: 'Male',
    bloodGroup: 'O+',
    totalDue: 3200,
    totalPaid: 52000,
    lastPaymentDate: '2024-01-20',
    status: 'active',
    pendingChargesCount: 4
  },
  {
    id: 'STU004',
    name: 'Sneha Reddy',
    admissionNo: 'ADM-2024-008',
    class: '8',
    section: 'C',
    rollNumber: '05',
    fatherName: 'Krishna Reddy',
    motherName: 'Lakshmi Reddy',
    phone: '9876543213',
    email: 'krishna.reddy@email.com',
    address: '321, Lake View, Sector 25, Mumbai - 400004',
    photo: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff&size=200',
    dateOfBirth: '2010-11-25',
    gender: 'Female',
    bloodGroup: 'AB+',
    totalDue: 0,
    totalPaid: 42000,
    lastPaymentDate: '2024-03-10',
    status: 'active',
    pendingChargesCount: 0
  }];


  const [pendingCharges, setPendingCharges] = useState<Charge[]>([
  {
    id: 'CHG001',
    chargeHead: 'Library Fine (Overdue Books)',
    description: 'Fine for late return of library books - 15 days overdue',
    category: 'Library',
    dueDate: '2024-03-01',
    originalAmount: 250,
    fineAmount: 50,
    discount: 0,
    paidAmount: 0,
    dueAmount: 300,
    status: 'overdue',
    createdDate: '2024-02-15',
    createdBy: 'Librarian',
    isAdHoc: false
  },
  {
    id: 'CHG002',
    chargeHead: 'Laboratory Breakage - Chemistry',
    description: 'Broken test tubes and beakers during practical',
    category: 'Lab',
    dueDate: '2024-03-10',
    originalAmount: 500,
    fineAmount: 0,
    discount: 0,
    paidAmount: 0,
    dueAmount: 500,
    status: 'pending',
    createdDate: '2024-03-05',
    createdBy: 'Lab Incharge',
    isAdHoc: false
  },
  {
    id: 'CHG003',
    chargeHead: 'Annual Sports Kit Fee',
    description: 'Sports uniform and equipment for annual sports day',
    category: 'Sports',
    dueDate: '2024-02-15',
    originalAmount: 1200,
    fineAmount: 100,
    discount: 0,
    paidAmount: 0,
    dueAmount: 1300,
    status: 'overdue',
    createdDate: '2024-02-01',
    createdBy: 'Sports Dept',
    isAdHoc: false
  },
  {
    id: 'CHG004',
    chargeHead: 'Science Olympiad Registration',
    description: 'Registration fee for National Science Olympiad 2024',
    category: 'Competition',
    dueDate: '2024-03-20',
    originalAmount: 350,
    fineAmount: 0,
    discount: 0,
    paidAmount: 0,
    dueAmount: 350,
    status: 'pending',
    createdDate: '2024-03-10',
    createdBy: 'Academic Dept',
    isAdHoc: false
  },
  {
    id: 'CHG005',
    chargeHead: 'ID Card Replacement',
    description: 'Replacement of lost student ID card',
    category: 'Administrative',
    dueDate: '2024-03-15',
    originalAmount: 150,
    fineAmount: 0,
    discount: 0,
    paidAmount: 0,
    dueAmount: 150,
    status: 'pending',
    createdDate: '2024-03-12',
    createdBy: 'Admin Office',
    isAdHoc: false
  }]
  );

  const [receiptHistory, setReceiptHistory] = useState<ChargeReceipt[]>([
  {
    id: 'RCP001',
    receiptNo: 'CHRG-2024-00125',
    studentId: 'STU001',
    date: '2024-02-15',
    time: '10:30 AM',
    charges: [
    { chargeHead: 'Late Fee Fine', amount: 200, fine: 0, discount: 0, total: 200 },
    { chargeHead: 'Activity Fee', amount: 500, fine: 0, discount: 50, total: 450 }],

    subTotal: 700,
    totalFine: 0,
    totalDiscount: 50,
    grandTotal: 650,
    paymentMode: 'cash',
    remarks: 'Payment received for pending charges',
    receivedBy: 'Mr. Rajesh Kumar',
    status: 'completed'
  },
  {
    id: 'RCP002',
    receiptNo: 'CHRG-2024-00098',
    studentId: 'STU001',
    date: '2024-01-20',
    time: '02:15 PM',
    charges: [
    { chargeHead: 'Bus Fine', amount: 100, fine: 25, discount: 0, total: 125 }],

    subTotal: 100,
    totalFine: 25,
    totalDiscount: 0,
    grandTotal: 125,
    paymentMode: 'online',
    transactionRef: 'TXN123456789',
    bankName: 'HDFC Bank',
    remarks: 'Online payment for bus fine',
    receivedBy: 'System',
    status: 'completed'
  },
  {
    id: 'RCP003',
    receiptNo: 'CHRG-2024-00076',
    studentId: 'STU001',
    date: '2023-12-10',
    time: '11:45 AM',
    charges: [
    { chargeHead: 'Book Damage Fine', amount: 300, fine: 0, discount: 0, total: 300 }],

    subTotal: 300,
    totalFine: 0,
    totalDiscount: 0,
    grandTotal: 300,
    paymentMode: 'cash',
    remarks: 'Fine for damaged library book',
    receivedBy: 'Ms. Priya Singh',
    status: 'completed'
  }]
  );

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!filters.searchTerm && !filters.class && !filters.section && !filters.status && !filters.hasDues) {
      return [];
    }

    return studentsData.filter((student) => {
      const matchesSearch =
      !filters.searchTerm ||
      student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      student.phone.includes(filters.searchTerm) ||
      student.fatherName.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesClass = !filters.class || student.class === filters.class;
      const matchesSection = !filters.section || student.section === filters.section;
      const matchesStatus = !filters.status || student.status === filters.status;
      const matchesDues =
      !filters.hasDues ||
      filters.hasDues === 'yes' && student.totalDue > 0 ||
      filters.hasDues === 'no' && student.totalDue === 0;

      return matchesSearch && matchesClass && matchesSection && matchesStatus && matchesDues;
    });
  }, [filters]);

  // Selected charges
  const selectedCharges = useMemo(() => {
    return pendingCharges.filter((c) => selectedChargeIds.includes(c.id));
  }, [selectedChargeIds, pendingCharges]);

  // Calculations
  const calculations = useMemo(() => {
    const subTotal = selectedCharges.reduce((sum, c) => sum + c.originalAmount, 0);
    const totalFine = selectedCharges.reduce((sum, c) => sum + c.fineAmount, 0);
    const totalDiscount = selectedCharges.reduce((sum, c) => sum + (chargeDiscounts[c.id] || 0), 0);
    const grandTotal = subTotal + totalFine - totalDiscount;

    return { subTotal, totalFine, totalDiscount, grandTotal };
  }, [selectedCharges, chargeDiscounts]);

  // Handlers
  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedChargeIds([]);
    setChargeDiscounts({});
    setActiveTab('charges');
  };

  const handleCloseStudentDetail = () => {
    setSelectedStudent(null);
    setSelectedChargeIds([]);
    setChargeDiscounts({});
  };

  const handleAddAdHocCharge = () => {
    const newCharge: Charge = {
      id: `ADHOC-${Date.now()}`,
      chargeHead: 'New Ad-hoc Charge',
      description: 'Manually added charge',
      category: 'Miscellaneous',
      dueDate: new Date().toISOString().split('T')[0],
      originalAmount: 0,
      fineAmount: 0,
      discount: 0,
      paidAmount: 0,
      dueAmount: 0,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Accountant',
      isAdHoc: true
    };
    setPendingCharges([newCharge, ...pendingCharges]);
  };

  const handleDeleteCharge = (chargeId: string) => {
    setPendingCharges(pendingCharges.filter((c) => c.id !== chargeId));
    setSelectedChargeIds(selectedChargeIds.filter((id) => id !== chargeId));
  };

  const handlePaymentComplete = (receipt: ChargeReceipt) => {
    setReceiptHistory([receipt, ...receiptHistory]);
    // Remove paid charges
    setPendingCharges(pendingCharges.filter((c) => !selectedChargeIds.includes(c.id)));
    setSelectedChargeIds([]);
    setChargeDiscounts({});
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      class: '',
      section: '',
      status: '',
      hasDues: ''
    });
  };

  // Class and Section options
  const classOptions = [
  { value: '1', label: 'Class 1' },
  { value: '2', label: 'Class 2' },
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' }];


  const sectionOptions = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' }];


  const tabs: Tab[] = [
  { id: 'charges', label: 'Pending Charges', icon: FileText, count: pendingCharges.length },
  { id: 'history', label: 'Receipt History', icon: History, count: receiptHistory.length }];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Charge Receipt Collection</h1>
              <p className="text-sm text-gray-500 mt-1">
                Search students and collect ad-hoc fees, fines, and pending charges
              </p>
            </div>
            <Badge variant="info" size="md">
              <Calendar className="w-4 h-4 mr-1" />
              Session: 2023-24
            </Badge>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, admission number, phone, or father's name..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  leftIcon={<Search className="w-5 h-5" />}
                  rightIcon={
                  filters.searchTerm ?
                  <button onClick={() => setFilters({ ...filters, searchTerm: '' })}>
                        <X className="w-4 h-4" />
                      </button> :
                  undefined
                  }
                  className="text-base py-3" />

              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 border-blue-300' : ''}>

                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {(filters.class || filters.section || filters.status || filters.hasDues) &&
                <Badge variant="info" size="sm" className="ml-2">
                    {[filters.class, filters.section, filters.status, filters.hasDues].filter(Boolean).length}
                  </Badge>
                }
              </Button>
              <Button variant="primary" onClick={handleSearch} loading={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters &&
          <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                label="Class"
                options={classOptions}
                value={filters.class}
                onChange={(value) => setFilters({ ...filters, class: value })}
                placeholder="All Classes" />

                <Select
                label="Section"
                options={sectionOptions}
                value={filters.section}
                onChange={(value) => setFilters({ ...filters, section: value })}
                placeholder="All Sections" />

                <Select
                label="Status"
                options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }]
                }
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                placeholder="All Status" />

                <Select
                label="Has Dues"
                options={[
                { value: 'yes', label: 'With Dues' },
                { value: 'no', label: 'No Dues' }]
                }
                value={filters.hasDues}
                onChange={(value) => setFilters({ ...filters, hasDues: value })}
                placeholder="All" />

              </div>
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              </div>
            </div>
          }

          {/* Quick Stats */}
          <div className="p-4 grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl text-blue-600">{studentsData.length}</p>
              <p className="text-xs text-blue-600">Total Students</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl text-red-600">
                {studentsData.filter((s) => s.totalDue > 0).length}
              </p>
              <p className="text-xs text-red-600">With Dues</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl text-amber-600">
                {studentsData.reduce((sum, s) => sum + s.pendingChargesCount, 0)}
              </p>
              <p className="text-xs text-amber-600">Pending Charges</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl text-green-600">
                ₹{studentsData.reduce((sum, s) => sum + s.totalDue, 0).toLocaleString()}
              </p>
              <p className="text-xs text-green-600">Total Dues</p>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Student List */}
          <div className={`${selectedStudent ? 'col-span-5' : 'col-span-12'} space-y-4`}>
            {filteredStudents.length > 0 ?
            <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Found <span className="text-gray-900">{filteredStudents.length}</span> student(s)
                  </p>
                </div>
                <div className="space-y-3">
                  {filteredStudents.map((student) =>
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudent?.id === student.id}
                  onView={() => handleSelectStudent(student)} />

                )}
                </div>
              </> :
            filters.searchTerm || filters.class || filters.section || filters.status || filters.hasDues ?
            <Card padding="lg">
                <EmptyState
                icon={Search}
                title="No Students Found"
                description="Try adjusting your search criteria or filters to find students."
                action={{ label: 'Clear Filters', onClick: handleClearFilters }} />

              </Card> :

            <Card padding="lg">
                <EmptyState
                icon={Users}
                title="Search for Students"
                description="Enter a student's name, admission number, phone number, or father's name to get started." />

              </Card>
            }
          </div>

          {/* Student Detail Panel */}
          {selectedStudent &&
          <div className="col-span-7">
              <Card>
                {/* Student Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                      src={selectedStudent.photo}
                      alt={selectedStudent.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md" />

                      <div>
                        <h2 className="text-xl text-gray-900">{selectedStudent.name}</h2>
                        <p className="text-sm text-gray-500">
                          {selectedStudent.admissionNo} • Class {selectedStudent.class}-{selectedStudent.section} • Roll #{selectedStudent.rollNumber}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {selectedStudent.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {selectedStudent.fatherName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        {selectedStudent.totalDue > 0 ?
                      <div>
                            <p className="text-xs text-gray-500">Total Due</p>
                            <p className="text-xl text-red-600">₹{selectedStudent.totalDue.toLocaleString()}</p>
                          </div> :

                      <Badge variant="success" size="md">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            No Dues
                          </Badge>
                      }
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCloseStudentDetail}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="p-4 border-b border-gray-100">
                  <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onChange={(tabId) => setActiveTab(tabId as 'charges' | 'history')} />

                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'charges' &&
                <div className="space-y-4">
                      {/* Actions Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedChargeIds.length > 0 &&
                      <Badge variant="info">
                              {selectedChargeIds.length} selected • ₹{calculations.grandTotal.toLocaleString()}
                            </Badge>
                      }
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handleAddAdHocCharge}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Charge
                          </Button>
                          <Button
                        variant="primary"
                        size="sm"
                        disabled={selectedChargeIds.length === 0}
                        onClick={() => setShowPaymentModal(true)}>

                            <IndianRupee className="w-4 h-4 mr-1" />
                            Collect Payment
                          </Button>
                        </div>
                      </div>

                      {/* Charges Table */}
                      {pendingCharges.length > 0 ?
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left">
                                    <input
                                type="checkbox"
                                checked={selectedChargeIds.length === pendingCharges.length && pendingCharges.length > 0}
                                onChange={(e) =>
                                setSelectedChargeIds(e.target.checked ? pendingCharges.map((c) => c.id) : [])
                                }
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                                  </th>
                                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Charge</th>
                                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Category</th>
                                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Due Date</th>
                                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Amount</th>
                                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Fine</th>
                                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Discount</th>
                                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Total</th>
                                  <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase">Status</th>
                                  <th className="px-4 py-3"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {pendingCharges.map((charge) =>
                          <ChargeRow
                            key={charge.id}
                            charge={charge}
                            isSelected={selectedChargeIds.includes(charge.id)}
                            discount={chargeDiscounts[charge.id] || 0}
                            onSelect={(selected) =>
                            setSelectedChargeIds(
                              selected ?
                              [...selectedChargeIds, charge.id] :
                              selectedChargeIds.filter((id) => id !== charge.id)
                            )
                            }
                            onDiscountChange={(discount) =>
                            setChargeDiscounts({ ...chargeDiscounts, [charge.id]: discount })
                            }
                            onDelete={() => handleDeleteCharge(charge.id)} />

                          )}
                              </tbody>
                            </table>
                          </div>

                          {/* Summary Footer */}
                          {selectedChargeIds.length > 0 &&
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 text-sm">
                                  <div>
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="ml-2 text-gray-900">₹{calculations.subTotal.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Fine:</span>
                                    <span className="ml-2 text-red-600">+₹{calculations.totalFine.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="ml-2 text-green-600">-₹{calculations.totalDiscount.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-gray-600 text-sm mr-2">Grand Total:</span>
                                  <span className="text-2xl text-blue-600">₹{calculations.grandTotal.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                    }
                        </div> :

                  <EmptyState
                    icon={CheckCircle2}
                    title="No Pending Charges"
                    description="This student has no pending charges to collect."
                    action={{ label: 'Add Ad-hoc Charge', onClick: handleAddAdHocCharge }} />

                  }
                    </div>
                }

                  {activeTab === 'history' &&
                <div className="space-y-4">
                      {receiptHistory.filter((r) => r.studentId === selectedStudent.id).length > 0 ?
                  <div className="grid gap-4">
                          {receiptHistory.
                    filter((r) => r.studentId === selectedStudent.id).
                    map((receipt) =>
                    <ReceiptCard
                      key={receipt.id}
                      receipt={receipt}
                      onView={() => console.log('View receipt:', receipt.id)}
                      onPrint={() => window.print()}
                      onDownload={() => console.log('Download receipt:', receipt.id)} />

                    )}
                        </div> :

                  <EmptyState
                    icon={Receipt}
                    title="No Receipt History"
                    description="No charge receipts have been generated for this student yet." />

                  }
                    </div>
                }
                </div>
              </Card>
            </div>
          }
        </div>

        {/* Help Section */}
        <Card className="mt-6" padding="md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Quick Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search by student name, admission number, phone, or father's name</li>
                <li>• Use filters to narrow down results by class, section, or dues status</li>
                <li>• Select multiple charges and apply discounts before collecting payment</li>
                <li>• Add ad-hoc charges for miscellaneous fees not in the system</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      {selectedStudent &&
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        student={selectedStudent}
        selectedCharges={selectedCharges}
        discounts={chargeDiscounts}
        onPaymentComplete={handlePaymentComplete} />

      }
    </div>);

}

export default ChargeReceipt;