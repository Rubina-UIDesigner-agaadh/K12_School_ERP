import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileCheck,
  XCircle,
  Play,
  X,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit3,
  Clock,
  Calendar,
  IndianRupee,
  User,
  Hash,
  CreditCard,
  FileText,
  AlertTriangle,
  Info,
  Filter,
  Search,
  Settings,
  History,
  CheckSquare,
  Square,
  MoreVertical,
  ArrowUpDown,
  FileUp,
  Folder,
  Paperclip,
  Loader2,
  Ban,
  RotateCcw,
  Save,
  Send,
  Archive,
  ExternalLink } from
'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

type ValidationStatus = 'valid' | 'error' | 'warning' | 'pending';
type PaymentMode = 'Cash' | 'Online' | 'Cheque' | 'DD' | 'Card' | 'UPI' | 'NEFT' | 'RTGS';
type ImportStatus = 'idle' | 'uploading' | 'validating' | 'processing' | 'completed' | 'failed';

interface ImportRecord {
  id: number;
  rowNumber: number;
  admissionNumber: string;
  studentName: string;
  className: string;
  section: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  transactionId: string;
  feeHead: string;
  remarks: string;
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  isSelected: boolean;
}

interface ImportSummary {
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  warningRecords: number;
  totalAmount: number;
  validAmount: number;
}

interface ImportHistoryItem {
  id: string;
  fileName: string;
  uploadDate: string;
  totalRecords: number;
  processedRecords: number;
  status: 'completed' | 'partial' | 'failed';
  uploadedBy: string;
}

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  required: boolean;
  mapped: boolean;
}

// ============================================
// CUSTOM COMPONENTS
// ============================================

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    outline: 'bg-white text-gray-600 border-gray-300'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>

      {children}
    </span>);

}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
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
    inline-flex items-center justify-center rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  };

  const sizeStyles = {
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
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>);

}

// Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}

function Checkbox({ checked, onChange, label, disabled = false, indeterminate = false }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`
          w-4 h-4 rounded border-2 flex items-center justify-center transition-all
          ${checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}>

        {checked && <CheckSquare className="w-3 h-3 text-white" />}
        {indeterminate && !checked && <div className="w-2 h-0.5 bg-white" />}
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>);

}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

function ProgressBar({ value, max, variant = 'default', showLabel = true, size = 'md' }: ProgressBarProps) {
  const percentage = Math.round(value / max * 100);

  const variantStyles = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    danger: 'bg-red-600'
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5'
  };

  return (
    <div className="w-full">
      {showLabel &&
      <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{value} of {max}</span>
          <span>{percentage}%</span>
        </div>
      }
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }} />

      </div>
    </div>);

}

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
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
        className={`
            absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap
            ${positionStyles[position]}
          `}>

          {content}
        </div>
      }
    </div>);

}

// Status Indicator Component
function StatusIndicator({ status }: {status: ValidationStatus;}) {
  const config = {
    valid: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Valid' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Error' },
    warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Warning' },
    pending: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Pending' }
  };

  const { icon: Icon, color, bg, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bg}`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs ${color}`}>{label}</span>
    </div>);

}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, variant, subtitle }: StatCardProps) {
  const variantStyles = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} rounded-xl p-4 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs ${styles.text} mb-1`}>{title}</p>
          <p className="text-2xl text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${styles.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>);

}

// ============================================
// FILE UPLOAD COMPONENT
// ============================================

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
}

function FileUpload({ onFileSelect, isUploading, acceptedFormats, maxSizeMB }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !acceptedFormats.includes(`.${extension}`)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return false;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 text-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
          id="file-upload-input" />


        {isUploading ?
        <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-700">Processing file...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait while we validate your data</p>
          </div> :
        selectedFile ?
        <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <Button
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="mt-3 text-red-600 hover:bg-red-50">

              <X className="w-4 h-4 mr-1" />
              Remove File
            </Button>
          </div> :

        <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <UploadCloud className={`w-7 h-7 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-gray-700 mb-1">
              {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              or click to browse from your computer
            </p>
            <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}>

              <Folder className="w-4 h-4 mr-2" />
              Select File
            </Button>
          </div>
        }
      </div>

      {error &&
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      }

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Paperclip className="w-3 h-3" />
          Formats: {acceptedFormats.join(', ')}
        </span>
        <span className="flex items-center gap-1">
          <FileUp className="w-3 h-3" />
          Max size: {maxSizeMB}MB
        </span>
      </div>
    </div>);

}

// ============================================
// IMPORT TABLE COMPONENT
// ============================================

interface ImportTableProps {
  data: ImportRecord[];
  onSelectRecord: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDeleteRecord: (id: number) => void;
  onEditRecord: (record: ImportRecord) => void;
  selectedCount: number;
}

function ImportTable({
  data,
  onSelectRecord,
  onSelectAll,
  onDeleteRecord,
  onEditRecord,
  selectedCount
}: ImportTableProps) {
  const [sortField, setSortField] = useState<string>('rowNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<ValidationStatus | 'all'>('all');

  const allSelected = data.length > 0 && data.every((r) => r.isSelected);
  const someSelected = data.some((r) => r.isSelected) && !allSelected;

  const filteredData = useMemo(() => {
    let result = [...data];

    if (filterStatus !== 'all') {
      result = result.filter((r) => r.status === filterStatus);
    }

    result.sort((a, b) => {
      const aValue = a[sortField as keyof ImportRecord];
      const bValue = b[sortField as keyof ImportRecord];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ?
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [data, filterStatus, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: {field: string;children: React.ReactNode;}) =>
  <button
    onClick={() => handleSort(field)}
    className="flex items-center gap-1 hover:text-gray-900 transition-colors">

      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`} />
    </button>;


  return (
    <div className="space-y-3">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ValidationStatus | 'all')}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="all">All Records</option>
              <option value="valid">Valid Only</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
            </select>
          </div>
          {selectedCount > 0 &&
          <span className="text-sm text-blue-600">
              {selectedCount} record{selectedCount > 1 ? 's' : ''} selected
            </span>
          }
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Re-validate
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={onSelectAll} />

                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="rowNumber">#</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="admissionNumber">Admission No.</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="studentName">Student</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Class</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="amount">Amount</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="date">Date</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Mode</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Fee Head</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) =>
              <tr
                key={record.id}
                className={`
                    border-b border-gray-100 transition-colors
                    ${record.status === 'error' ? 'bg-red-50/50' : ''}
                    ${record.status === 'warning' ? 'bg-amber-50/50' : ''}
                    ${record.isSelected ? 'bg-blue-50/50' : ''}
                    hover:bg-gray-50
                  `}>

                  <td className="px-4 py-3">
                    <Checkbox
                    checked={record.isSelected}
                    onChange={(checked) => onSelectRecord(record.id, checked)} />

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {record.rowNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.errors.some((e) => e.includes('Student')) ? 'text-red-600' : 'text-gray-900'}`}>
                      {record.admissionNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm ${record.errors.some((e) => e.includes('Student')) ? 'text-red-600' : 'text-gray-900'}`}>
                        {record.studentName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.className} - {record.section}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.errors.some((e) => e.includes('Amount')) ? 'text-red-600' : 'text-gray-900'}`}>
                      ₹{record.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.errors.some((e) => e.includes('date')) ? 'text-red-600 underline decoration-wavy' : 'text-gray-600'}`}>
                      {record.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" size="sm">{record.paymentMode}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.feeHead}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <StatusIndicator status={record.status} />
                      {record.errors.length > 0 &&
                    <div className="space-y-0.5">
                          {record.errors.map((error, idx) =>
                      <p key={idx} className="text-xs text-red-600 flex items-center gap-1">
                              <XCircle className="w-3 h-3 flex-shrink-0" />
                              {error}
                            </p>
                      )}
                        </div>
                    }
                      {record.warnings.length > 0 &&
                    <div className="space-y-0.5">
                          {record.warnings.map((warning, idx) =>
                      <p key={idx} className="text-xs text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                              {warning}
                            </p>
                      )}
                        </div>
                    }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tooltip content="Edit Record">
                        <button
                        onClick={() => onEditRecord(record)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                          <Edit3 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Record">
                        <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 &&
        <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No records match your filter criteria</p>
          </div>
        }
      </div>
    </div>);

}

// ============================================
// COLUMN MAPPING COMPONENT
// ============================================

interface ColumnMappingProps {
  mappings: ColumnMapping[];
  onUpdateMapping: (index: number, sourceColumn: string) => void;
  sourceColumns: string[];
}

function ColumnMappingPanel({ mappings, onUpdateMapping, sourceColumns }: ColumnMappingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">Column Mapping</h3>
        <Badge variant={mappings.every((m) => m.mapped) ? 'success' : 'warning'}>
          {mappings.filter((m) => m.mapped).length} / {mappings.length} Mapped
        </Badge>
      </div>

      <div className="space-y-3">
        {mappings.map((mapping, index) =>
        <div key={mapping.targetField} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{mapping.targetField}</span>
                {mapping.required &&
              <span className="text-xs text-red-500">*</span>
              }
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <select
              value={mapping.sourceColumn}
              onChange={(e) => onUpdateMapping(index, e.target.value)}
              className={`
                  w-full text-sm border rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${mapping.mapped ? 'border-green-300 bg-green-50' : 'border-gray-200'}
                  ${mapping.required && !mapping.mapped ? 'border-red-300 bg-red-50' : ''}
                `}>

                <option value="">-- Select Column --</option>
                {sourceColumns.map((col) =>
              <option key={col} value={col}>{col}</option>
              )}
              </select>
            </div>
            {mapping.mapped &&
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          }
          </div>
        )}
      </div>
    </div>);

}

// ============================================
// IMPORT HISTORY COMPONENT
// ============================================

function ImportHistory({ history }: {history: ImportHistoryItem[];}) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    partial: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-gray-900 flex items-center gap-2">
        <History className="w-4 h-4" />
        Recent Imports
      </h3>

      {history.length === 0 ?
      <div className="py-8 text-center text-gray-500">
          <Archive className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No import history</p>
        </div> :

      <div className="space-y-2">
          {history.map((item) => {
          const { icon: Icon, color, bg } = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{item.fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{item.uploadDate}</span>
                    <span>•</span>
                    <span>{item.processedRecords}/{item.totalRecords} records</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>);

        })}
        </div>
      }
    </div>);

}

// ============================================
// MAIN COMPONENT
// ============================================

export function ChargeReceiptImport() {
  // State
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importData, setImportData] = useState<ImportRecord[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [showHelp, setShowHelp] = useState(false);

  // Column mappings
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([
  { sourceColumn: '', targetField: 'Admission Number', required: true, mapped: false },
  { sourceColumn: '', targetField: 'Amount', required: true, mapped: false },
  { sourceColumn: '', targetField: 'Payment Date', required: true, mapped: false },
  { sourceColumn: '', targetField: 'Payment Mode', required: true, mapped: false },
  { sourceColumn: '', targetField: 'Transaction ID', required: false, mapped: false },
  { sourceColumn: '', targetField: 'Fee Head', required: false, mapped: false },
  { sourceColumn: '', targetField: 'Remarks', required: false, mapped: false }]
  );

  const sourceColumns = ['AdmNo', 'StudentName', 'Amount', 'Date', 'PaymentMode', 'TransID', 'FeeHead', 'Notes'];

  // Import history
  const importHistory: ImportHistoryItem[] = [
  {
    id: '1',
    fileName: 'march_receipts_2024.csv',
    uploadDate: '20 Mar 2024, 10:30 AM',
    totalRecords: 150,
    processedRecords: 150,
    status: 'completed',
    uploadedBy: 'Admin'
  },
  {
    id: '2',
    fileName: 'february_payments.xlsx',
    uploadDate: '15 Feb 2024, 02:15 PM',
    totalRecords: 85,
    processedRecords: 82,
    status: 'partial',
    uploadedBy: 'Accountant'
  },
  {
    id: '3',
    fileName: 'late_fees_jan.csv',
    uploadDate: '05 Jan 2024, 09:45 AM',
    totalRecords: 25,
    processedRecords: 0,
    status: 'failed',
    uploadedBy: 'Admin'
  }];


  // Calculate summary
  const summary: ImportSummary = useMemo(() => {
    const validRecords = importData.filter((r) => r.status === 'valid');
    const errorRecords = importData.filter((r) => r.status === 'error');
    const warningRecords = importData.filter((r) => r.status === 'warning');

    return {
      totalRecords: importData.length,
      validRecords: validRecords.length,
      errorRecords: errorRecords.length,
      warningRecords: warningRecords.length,
      totalAmount: importData.reduce((sum, r) => sum + (r.amount > 0 ? r.amount : 0), 0),
      validAmount: validRecords.reduce((sum, r) => sum + r.amount, 0)
    };
  }, [importData]);

  const selectedCount = importData.filter((r) => r.isSelected).length;

  // Handlers
  const handleFileSelect = (file: File) => {
    setImportStatus('uploading');

    // Simulate file processing
    setTimeout(() => {
      setImportStatus('validating');

      setTimeout(() => {
        // Mock data representing validation results
        const mockData: ImportRecord[] = [
        {
          id: 1,
          rowNumber: 2,
          admissionNumber: 'ADM-001',
          studentName: 'Rahul Sharma',
          className: 'Class 10',
          section: 'A',
          amount: 5000,
          date: '2024-03-20',
          paymentMode: 'Cash',
          transactionId: '-',
          feeHead: 'Tuition Fee',
          remarks: '',
          status: 'valid',
          errors: [],
          warnings: [],
          isSelected: true
        },
        {
          id: 2,
          rowNumber: 3,
          admissionNumber: 'ADM-999',
          studentName: 'Unknown Student',
          className: '-',
          section: '-',
          amount: 1200,
          date: '2024-03-21',
          paymentMode: 'Online',
          transactionId: 'TXN123456',
          feeHead: 'Exam Fee',
          remarks: '',
          status: 'error',
          errors: ['Student not found in database'],
          warnings: [],
          isSelected: false
        },
        {
          id: 3,
          rowNumber: 4,
          admissionNumber: 'ADM-005',
          studentName: 'Ananya Gupta',
          className: 'Class 8',
          section: 'B',
          amount: 2500,
          date: '2024/03/22',
          paymentMode: 'Cheque',
          transactionId: 'CHQ445789',
          feeHead: 'Lab Fee',
          remarks: 'March payment',
          status: 'error',
          errors: ['Invalid date format. Expected: YYYY-MM-DD'],
          warnings: [],
          isSelected: false
        },
        {
          id: 4,
          rowNumber: 5,
          admissionNumber: 'ADM-012',
          studentName: 'Vikram Singh',
          className: 'Class 12',
          section: 'A',
          amount: 3000,
          date: '2024-03-22',
          paymentMode: 'Cash',
          transactionId: '-',
          feeHead: 'Tuition Fee',
          remarks: '',
          status: 'valid',
          errors: [],
          warnings: [],
          isSelected: true
        },
        {
          id: 5,
          rowNumber: 6,
          admissionNumber: 'ADM-015',
          studentName: 'Priya Das',
          className: 'Class 9',
          section: 'C',
          amount: -500,
          date: '2024-03-23',
          paymentMode: 'Online',
          transactionId: 'TXN778899',
          feeHead: 'Sports Fee',
          remarks: '',
          status: 'error',
          errors: ['Amount cannot be negative'],
          warnings: [],
          isSelected: false
        },
        {
          id: 6,
          rowNumber: 7,
          admissionNumber: 'ADM-022',
          studentName: 'Amit Kumar',
          className: 'Class 7',
          section: 'A',
          amount: 1500,
          date: '2024-03-24',
          paymentMode: 'UPI',
          transactionId: 'UPI123456',
          feeHead: 'Transport Fee',
          remarks: '',
          status: 'warning',
          errors: [],
          warnings: ['Duplicate transaction ID detected'],
          isSelected: true
        },
        {
          id: 7,
          rowNumber: 8,
          admissionNumber: 'ADM-028',
          studentName: 'Sneha Reddy',
          className: 'Class 11',
          section: 'B',
          amount: 4500,
          date: '2024-03-25',
          paymentMode: 'NEFT',
          transactionId: 'NEFT789012',
          feeHead: 'Tuition Fee',
          remarks: 'Quarterly payment',
          status: 'valid',
          errors: [],
          warnings: [],
          isSelected: true
        }];


        setImportData(mockData);
        setImportStatus('idle');
        setActiveTab('preview');
      }, 1000);
    }, 1500);
  };

  const handleSelectRecord = (id: number, selected: boolean) => {
    setImportData((prev) =>
    prev.map((r) => r.id === id ? { ...r, isSelected: selected } : r)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setImportData((prev) =>
    prev.map((r) => r.status === 'valid' || r.status === 'warning' ? { ...r, isSelected: selected } : r)
    );
  };

  const handleDeleteRecord = (id: number) => {
    setImportData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditRecord = (record: ImportRecord) => {
    console.log('Edit record:', record);
    // Implement edit functionality
  };

  const handleUpdateMapping = (index: number, sourceColumn: string) => {
    setColumnMappings((prev) =>
    prev.map((m, i) =>
    i === index ?
    { ...m, sourceColumn, mapped: sourceColumn !== '' } :
    m
    )
    );
  };

  const handleProcessReceipts = () => {
    const validRecords = importData.filter((r) => r.isSelected && (r.status === 'valid' || r.status === 'warning'));
    const totalToProcess = validRecords.length;

    setImportStatus('processing');
    setProcessingProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setImportStatus('completed');
          }, 500);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const handleClearAll = () => {
    setImportData([]);
    setImportStatus('idle');
    setActiveTab('upload');
    setProcessingProgress(0);
  };

  const handleDownloadErrorLog = () => {
    const errorRecords = importData.filter((r) => r.status === 'error');
    console.log('Download error log:', errorRecords);
    // Implement download functionality
  };

  // Expected columns for help section
  const expectedColumns = [
  { name: 'AdmNo', description: 'Student admission number', required: true },
  { name: 'Amount', description: 'Payment amount (positive number)', required: true },
  { name: 'Date', description: 'Payment date (YYYY-MM-DD)', required: true },
  { name: 'PaymentMode', description: 'Cash, Online, Cheque, UPI, etc.', required: true },
  { name: 'TransactionID', description: 'Reference number for online payments', required: false },
  { name: 'FeeHead', description: 'Fee category (Tuition, Transport, etc.)', required: false },
  { name: 'Remarks', description: 'Additional notes', required: false }];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Charge Receipt Import</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Bulk process payments and ad-hoc charges via CSV or Excel
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowHelp(!showHelp)}>

              <HelpCircle className="w-4 h-4 mr-2" />
              Help Guide
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>

        {/* Help Panel */}
        {showHelp &&
        <Card className="mb-6 overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-900">Import Guide</h3>
              </div>
              <button
              onClick={() => setShowHelp(false)}
              className="p-1 hover:bg-blue-100 rounded-lg transition-colors">

                <X className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Expected Columns
                  </h4>
                  <div className="space-y-2">
                    {expectedColumns.map((col) =>
                  <div
                    key={col.name}
                    className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">

                        <div className={`w-2 h-2 rounded-full mt-1.5 ${col.required ? 'bg-red-500' : 'bg-gray-300'}`} />
                        <div>
                          <span className="text-sm text-gray-900">{col.name}</span>
                          <p className="text-xs text-gray-500">{col.description}</p>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    Important Notes
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Use the provided template for best results
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Date format must be YYYY-MM-DD
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Amount must be a positive number
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Admission numbers must match existing records
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      Maximum file size: 5MB
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      Maximum records per file: 1000
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        }

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
            {/* File Upload Card */}
            <Card padding="lg">
              <FileUpload
                onFileSelect={handleFileSelect}
                isUploading={importStatus === 'uploading' || importStatus === 'validating'}
                acceptedFormats={['.csv', '.xlsx', '.xls']}
                maxSizeMB={5} />

            </Card>

            {/* Expected Columns Card */}
            <Card padding="md">
              <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Required Format
              </h4>
              <div className="space-y-2">
                {expectedColumns.slice(0, 5).map((col) =>
                <div
                  key={col.name}
                  className="flex items-center justify-between py-1.5">

                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm text-gray-700">{col.name}</span>
                    </div>
                    {col.required &&
                  <span className="text-xs text-red-500">Required</span>
                  }
                  </div>
                )}
              </div>
            </Card>

            {/* Import History Card */}
            <Card padding="md">
              <ImportHistory history={importHistory} />
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {importData.length > 0 ?
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                  title="Total Records"
                  value={summary.totalRecords}
                  icon={FileText}
                  variant="blue" />

                  <StatCard
                  title="Valid Records"
                  value={summary.validRecords}
                  icon={CheckCircle2}
                  variant="green" />

                  <StatCard
                  title="Errors"
                  value={summary.errorRecords}
                  icon={XCircle}
                  variant="red" />

                  <StatCard
                  title="Valid Amount"
                  value={`₹${summary.validAmount.toLocaleString()}`}
                  icon={IndianRupee}
                  variant="purple" />

                </div>

                {/* Processing Status */}
                {importStatus === 'processing' &&
              <Card padding="lg">
                    <div className="flex items-center gap-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">
                          Processing Receipts...
                        </h3>
                        <ProgressBar
                      value={Math.round(processingProgress)}
                      max={100}
                      variant="default" />

                      </div>
                    </div>
                  </Card>
              }

                {/* Completed Status */}
                {importStatus === 'completed' &&
              <Card className="bg-green-50 border-green-200" padding="lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-green-900">
                            Import Completed Successfully
                          </h3>
                          <p className="text-sm text-green-700 mt-1">
                            {summary.validRecords} receipts have been processed and saved.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClearAll}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Import
                        </Button>
                        <Button variant="primary">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Receipts
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* Data Table */}
                {importStatus !== 'processing' && importStatus !== 'completed' &&
              <Card>
                    {/* Table Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{summary.validRecords} Valid</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{summary.warningRecords} Warnings</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>{summary.errorRecords} Errors</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleClearAll}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>

                    {/* Table Content */}
                    <div className="p-5">
                      <ImportTable
                    data={importData}
                    onSelectRecord={handleSelectRecord}
                    onSelectAll={handleSelectAll}
                    onDeleteRecord={handleDeleteRecord}
                    onEditRecord={handleEditRecord}
                    selectedCount={selectedCount} />

                    </div>

                    {/* Table Footer */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-xs text-gray-500 italic">
                        * Only valid and warning records with selection will be processed.
                        Error records will be skipped.
                      </p>
                      <div className="flex items-center gap-3">
                        {summary.errorRecords > 0 &&
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadErrorLog}
                      className="text-red-600 border-red-200 hover:bg-red-50">

                            <Download className="w-4 h-4 mr-2" />
                            Download Error Log
                          </Button>
                    }
                        <Button
                      variant="primary"
                      disabled={selectedCount === 0}
                      onClick={handleProcessReceipts}>

                          <Play className="w-4 h-4 mr-2" />
                          Process {selectedCount} Receipt{selectedCount !== 1 ? 's' : ''}
                        </Button>
                      </div>
                    </div>
                  </Card>
              }
              </div> : (

            /* Empty State */
            <Card className="h-full min-h-[500px] flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileCheck className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">
                    No Data to Preview
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Upload a CSV or Excel file to see validation results here.
                    The system will automatically validate all records and highlight any issues.
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Student Verification
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Date Validation
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Amount Check
                      </span>
                    </div>
                  </div>
                </div>
              </Card>)
            }
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg mb-1">Bulk Import Tips</h3>
                <p className="text-sm text-blue-100">
                  Use our Excel template for error-free imports. Download and fill in your data.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20">

                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <FileText className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

export default ChargeReceiptImport;