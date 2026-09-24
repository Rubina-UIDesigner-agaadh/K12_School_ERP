import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Filter,
  Search,
  Printer,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Receipt,
  Users,
  Clock,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  File,
  ChevronDown,
  X,
  Plus,
  Settings,
  Copy,
  Share2,
  Mail,
  Trash2,
  Edit,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  Globe,
  Building,
  GraduationCap,
  BookOpen,
  Layers,
  FolderOpen,
  Star,
  Bookmark,
  Play,
  Zap } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// Types
interface Report {
  id: string;
  reportNo: string;
  name: string;
  type: string;
  category: string;
  dateRange: {
    from: string;
    to: string;
  };
  generatedOn: string;
  generatedBy: string;
  status: 'Completed' | 'Processing' | 'Failed' | 'Scheduled';
  format: string;
  size: string;
  totalRecords: number;
  totalAmount: number;
  downloads: number;
  isFavorite: boolean;
}
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  popularity: number;
  lastUsed: string | null;
  fields: string[];
  filters: string[];
  isCustom: boolean;
  isPremium: boolean;
}
interface ImportRecord {
  id: string;
  date: string;
  time: string;
  file: string;
  source: string;
  total: number;
  success: number;
  failed: number;
  status: 'Completed' | 'Processing' | 'Failed' | 'Pending';
  importedBy: string;
  errors: {
    row: number;
    message: string;
    field: string;
  }[];
}
export function ChargeReceiptReport() {
  // State Management
  const [activeTab, setActiveTab] = useState<
    'reports' | 'templates' | 'import' | 'scheduled'>(
    'reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
  useState<ReportTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importSource, setImportSource] = useState('bank');
  const [isImporting, setIsImporting] = useState(false);
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  // Report Generation Form
  const [reportForm, setReportForm] = useState({
    template: '',
    name: '',
    dateFrom: '',
    dateTo: '',
    class: 'all',
    section: 'all',
    chargeType: 'all',
    paymentMode: 'all',
    status: 'all',
    format: 'pdf',
    schedule: 'now',
    scheduleTime: '',
    scheduleFrequency: 'once',
    emailRecipients: ''
  });
  // Mock Data - Generated Reports
  const generatedReports: Report[] = [
  {
    id: 'RPT001',
    reportNo: 'CHRG-RPT-2024-0125',
    name: 'Daily Charge Collection Report',
    type: 'Collection',
    category: 'Daily',
    dateRange: {
      from: '2024-03-15',
      to: '2024-03-15'
    },
    generatedOn: '2024-03-15 18:30',
    generatedBy: 'Mr. Rajesh Kumar',
    status: 'Completed',
    format: 'PDF',
    size: '245 KB',
    totalRecords: 48,
    totalAmount: 125000,
    downloads: 5,
    isFavorite: true
  },
  {
    id: 'RPT002',
    reportNo: 'CHRG-RPT-2024-0124',
    name: 'Weekly Charge Summary',
    type: 'Summary',
    category: 'Weekly',
    dateRange: {
      from: '2024-03-08',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 17:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'Excel',
    size: '1.2 MB',
    totalRecords: 256,
    totalAmount: 875000,
    downloads: 12,
    isFavorite: false
  },
  {
    id: 'RPT003',
    reportNo: 'CHRG-RPT-2024-0123',
    name: 'Pending Charges by Class',
    type: 'Pending',
    category: 'Analysis',
    dateRange: {
      from: '2024-01-01',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 15:45',
    generatedBy: 'Ms. Priya Singh',
    status: 'Completed',
    format: 'PDF',
    size: '520 KB',
    totalRecords: 189,
    totalAmount: 456000,
    downloads: 8,
    isFavorite: true
  },
  {
    id: 'RPT004',
    reportNo: 'CHRG-RPT-2024-0122',
    name: 'Payment Mode Analysis',
    type: 'Analysis',
    category: 'Monthly',
    dateRange: {
      from: '2024-03-01',
      to: '2024-03-14'
    },
    generatedOn: '2024-03-14 14:30',
    generatedBy: 'Mr. Amit Shah',
    status: 'Completed',
    format: 'PDF',
    size: '380 KB',
    totalRecords: 312,
    totalAmount: 1250000,
    downloads: 3,
    isFavorite: false
  },
  {
    id: 'RPT005',
    reportNo: 'CHRG-RPT-2024-0121',
    name: 'Overdue Charges Report',
    type: 'Overdue',
    category: 'Daily',
    dateRange: {
      from: '2024-03-13',
      to: '2024-03-13'
    },
    generatedOn: '2024-03-13 18:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'PDF',
    size: '198 KB',
    totalRecords: 67,
    totalAmount: 234500,
    downloads: 15,
    isFavorite: false
  },
  {
    id: 'RPT006',
    reportNo: 'CHRG-RPT-2024-0120',
    name: 'Fine Collection Report',
    type: 'Fine',
    category: 'Weekly',
    dateRange: {
      from: '2024-03-01',
      to: '2024-03-13'
    },
    generatedOn: '2024-03-13 16:30',
    generatedBy: 'Mr. Rajesh Kumar',
    status: 'Completed',
    format: 'Excel',
    size: '456 KB',
    totalRecords: 89,
    totalAmount: 45600,
    downloads: 6,
    isFavorite: false
  },
  {
    id: 'RPT007',
    reportNo: 'CHRG-RPT-2024-0119',
    name: 'Category-wise Collection',
    type: 'Collection',
    category: 'Monthly',
    dateRange: {
      from: '2024-02-01',
      to: '2024-02-29'
    },
    generatedOn: '2024-03-01 10:00',
    generatedBy: 'System',
    status: 'Completed',
    format: 'PDF',
    size: '890 KB',
    totalRecords: 567,
    totalAmount: 2345000,
    downloads: 25,
    isFavorite: true
  },
  {
    id: 'RPT008',
    reportNo: 'CHRG-RPT-2024-0118',
    name: 'Student-wise Charge Statement',
    type: 'Statement',
    category: 'Custom',
    dateRange: {
      from: '2024-01-01',
      to: '2024-03-12'
    },
    generatedOn: '2024-03-12 14:15',
    generatedBy: 'Ms. Priya Singh',
    status: 'Processing',
    format: 'PDF',
    size: '-',
    totalRecords: 0,
    totalAmount: 0,
    downloads: 0,
    isFavorite: false
  }];

  // Mock Data - Report Templates
  const reportTemplates: ReportTemplate[] = [
  {
    id: 'TPL001',
    name: 'Daily Collection Summary',
    description:
    'Summary of all charges collected on a specific date with payment mode breakdown',
    category: 'Collection',
    icon: <Receipt className="w-6 h-6" />,
    popularity: 95,
    lastUsed: '2024-03-15',
    fields: [
    'Receipt No',
    'Student Name',
    'Class',
    'Charge Type',
    'Amount',
    'Payment Mode',
    'Time'],

    filters: ['Date', 'Payment Mode', 'Class'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL002',
    name: 'Pending Charges Report',
    description:
    'List of all pending charges with student details and overdue days',
    category: 'Pending',
    icon: <Clock className="w-6 h-6" />,
    popularity: 88,
    lastUsed: '2024-03-14',
    fields: [
    'Student Name',
    'Admission No',
    'Class',
    'Charge Head',
    'Amount',
    'Due Date',
    'Days Overdue'],

    filters: ['Class', 'Section', 'Charge Type', 'Days Overdue'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL003',
    name: 'Overdue Charges Analysis',
    description: 'Detailed analysis of overdue charges with aging brackets',
    category: 'Analysis',
    icon: <AlertTriangle className="w-6 h-6" />,
    popularity: 82,
    lastUsed: '2024-03-13',
    fields: [
    'Student Name',
    'Class',
    'Charge',
    'Amount',
    'Due Date',
    'Aging Bracket',
    'Contact'],

    filters: ['Class', 'Aging Bracket', 'Amount Range'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL004',
    name: 'Payment Mode Analysis',
    description: 'Analysis of collections by payment mode with trends',
    category: 'Analysis',
    icon: <PieChart className="w-6 h-6" />,
    popularity: 75,
    lastUsed: '2024-03-12',
    fields: [
    'Payment Mode',
    'Transaction Count',
    'Total Amount',
    'Percentage',
    'Trend'],

    filters: ['Date Range', 'Payment Mode'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL005',
    name: 'Class-wise Collection Report',
    description: 'Collection summary grouped by class and section',
    category: 'Collection',
    icon: <GraduationCap className="w-6 h-6" />,
    popularity: 90,
    lastUsed: '2024-03-15',
    fields: [
    'Class',
    'Section',
    'Total Students',
    'Collected',
    'Pending',
    'Collection %'],

    filters: ['Date Range', 'Class', 'Section'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL006',
    name: 'Fine Collection Report',
    description: 'Report of all fines collected with fine type breakdown',
    category: 'Fine',
    icon: <AlertCircle className="w-6 h-6" />,
    popularity: 70,
    lastUsed: '2024-03-10',
    fields: [
    'Student Name',
    'Class',
    'Fine Type',
    'Original Charge',
    'Fine Amount',
    'Paid Date'],

    filters: ['Date Range', 'Fine Type', 'Class'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL007',
    name: 'Charge Type Summary',
    description: 'Summary of collections by charge type/head',
    category: 'Summary',
    icon: <Layers className="w-6 h-6" />,
    popularity: 85,
    lastUsed: '2024-03-14',
    fields: [
    'Charge Type',
    'Charge Head',
    'Count',
    'Total Amount',
    'Collected',
    'Pending'],

    filters: ['Date Range', 'Charge Type'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL008',
    name: 'Discount & Waiver Report',
    description: 'Report of all discounts and waivers given on charges',
    category: 'Discount',
    icon: <TrendingDown className="w-6 h-6" />,
    popularity: 65,
    lastUsed: '2024-03-08',
    fields: [
    'Student Name',
    'Class',
    'Charge',
    'Original Amount',
    'Discount',
    'Approved By'],

    filters: ['Date Range', 'Discount Type', 'Approved By'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL009',
    name: 'Monthly Comparison Report',
    description: 'Month-over-month comparison of charge collections',
    category: 'Analysis',
    icon: <BarChart3 className="w-6 h-6" />,
    popularity: 78,
    lastUsed: '2024-03-01',
    fields: [
    'Month',
    'Charges Created',
    'Amount',
    'Collected',
    'Pending',
    'Growth %'],

    filters: ['Year', 'Charge Type'],
    isCustom: false,
    isPremium: true
  },
  {
    id: 'TPL010',
    name: 'Student Charge Statement',
    description: 'Individual student charge statement with payment history',
    category: 'Statement',
    icon: <FileText className="w-6 h-6" />,
    popularity: 92,
    lastUsed: '2024-03-15',
    fields: [
    'Date',
    'Charge Head',
    'Debit',
    'Credit',
    'Balance',
    'Receipt No'],

    filters: ['Student', 'Date Range'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL011',
    name: 'Receipt Register',
    description: 'Detailed register of all receipts generated',
    category: 'Register',
    icon: <BookOpen className="w-6 h-6" />,
    popularity: 88,
    lastUsed: '2024-03-15',
    fields: [
    'Receipt No',
    'Date',
    'Student',
    'Amount',
    'Mode',
    'Received By'],

    filters: ['Date Range', 'Payment Mode', 'Received By'],
    isCustom: false,
    isPremium: false
  },
  {
    id: 'TPL012',
    name: 'Cashier Collection Report',
    description: 'Collection summary by cashier/staff member',
    category: 'Collection',
    icon: <Users className="w-6 h-6" />,
    popularity: 72,
    lastUsed: '2024-03-14',
    fields: [
    'Cashier Name',
    'Receipt Count',
    'Cash',
    'Cheque',
    'Online',
    'Total'],

    filters: ['Date', 'Cashier'],
    isCustom: false,
    isPremium: false
  }];

  // Mock Data - Import History
  const importHistory: ImportRecord[] = [
  {
    id: 'IMP001',
    date: '2024-03-14',
    time: '15:30',
    file: 'bank_statement_mar14.csv',
    source: 'Bank Statement',
    total: 150,
    success: 148,
    failed: 2,
    status: 'Completed',
    importedBy: 'Mr. Rajesh Kumar',
    errors: [
    {
      row: 45,
      message: 'Unknown Payer ID "GR9999"',
      field: 'Payer ID'
    },
    {
      row: 89,
      message: 'Duplicate Reference "REF-12345"',
      field: 'Reference'
    }]

  },
  {
    id: 'IMP002',
    date: '2024-03-10',
    time: '11:45',
    file: 'pos_report_mar10.xlsx',
    source: 'POS Terminal',
    total: 45,
    success: 45,
    failed: 0,
    status: 'Completed',
    importedBy: 'Ms. Priya Singh',
    errors: []
  },
  {
    id: 'IMP003',
    date: '2024-03-05',
    time: '09:20',
    file: 'gateway_report_mar05.csv',
    source: 'Payment Gateway',
    total: 89,
    success: 87,
    failed: 2,
    status: 'Completed',
    importedBy: 'System',
    errors: [
    {
      row: 23,
      message: 'Invalid amount format',
      field: 'Amount'
    },
    {
      row: 56,
      message: 'Missing payment date',
      field: 'Date'
    }]

  },
  {
    id: 'IMP004',
    date: '2024-03-01',
    time: '16:00',
    file: 'upi_transactions_feb.xlsx',
    source: 'UPI Report',
    total: 234,
    success: 234,
    failed: 0,
    status: 'Completed',
    importedBy: 'Mr. Amit Shah',
    errors: []
  }];

  // Statistics
  const stats = useMemo(() => {
    const totalReports = generatedReports.length;
    const completedReports = generatedReports.filter(
      (r) => r.status === 'Completed'
    ).length;
    const totalAmount = generatedReports.
    filter((r) => r.status === 'Completed').
    reduce((sum, r) => sum + r.totalAmount, 0);
    const totalRecords = generatedReports.
    filter((r) => r.status === 'Completed').
    reduce((sum, r) => sum + r.totalRecords, 0);
    const totalDownloads = generatedReports.reduce(
      (sum, r) => sum + r.downloads,
      0
    );
    return {
      totalReports,
      completedReports,
      totalAmount,
      totalRecords,
      totalDownloads
    };
  }, []);
  // Filter reports
  const filteredReports = useMemo(() => {
    return generatedReports.filter((report) => {
      const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === 'all' || report.type === filters.type;
      const matchesCategory =
      filters.category === 'all' || report.category === filters.category;
      const matchesStatus =
      filters.status === 'all' || report.status === filters.status;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [searchTerm, filters]);
  // Filter templates
  const filteredTemplates = useMemo(() => {
    return reportTemplates.filter(
      (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedTemplate) return;
    // Simulate report generation
    alert(
      `Generating report: ${reportForm.name || selectedTemplate.name}\nFormat: ${reportForm.format.toUpperCase()}\nDate Range: ${reportForm.dateFrom} to ${reportForm.dateTo}`
    );
    setShowGenerateModal(false);
    setSelectedTemplate(null);
    setReportForm({
      template: '',
      name: '',
      dateFrom: '',
      dateTo: '',
      class: 'all',
      section: 'all',
      chargeType: 'all',
      paymentMode: 'all',
      status: 'all',
      format: 'pdf',
      schedule: 'now',
      scheduleTime: '',
      scheduleFrequency: 'once',
      emailRecipients: ''
    });
  };
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };
  // Handle import
  const handleImport = () => {
    if (!uploadedFile) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setUploadedFile(null);
      alert('Import completed successfully!');
    }, 2000);
  };
  // Download template
  const downloadImportTemplate = () => {
    alert('Downloading import template...');
  };
  // Export report
  const exportReport = (report: Report, format: string) => {
    alert(`Downloading ${report.name} as ${format.toUpperCase()}`);
  };
  // Toggle favorite
  const toggleFavorite = (reportId: string) => {
    // Would update state in real app
    alert('Toggled favorite status');
  };
  // Delete report
  const deleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      alert('Report deleted');
    }
  };
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">{status}</Badge>;
      case 'Processing':
        return <Badge variant="warning">{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger">{status}</Badge>;
      case 'Scheduled':
        return <Badge variant="info">{status}</Badge>;
      case 'Pending':
        return <Badge variant="default">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  // Report table columns
  const reportColumns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={
      selectedReports.length === filteredReports.length &&
      filteredReports.length > 0
      }
      onChange={(e) =>
      setSelectedReports(
        e.target.checked ? filteredReports.map((r) => r.id) : []
      )
      } />,


    render: (row: Report) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedReports.includes(row.id)}
      onChange={() =>
      setSelectedReports((prev) =>
      prev.includes(row.id) ?
      prev.filter((id) => id !== row.id) :
      [...prev, row.id]
      )
      } />


  },
  {
    key: 'report',
    header: 'Report Details',
    render: (row: Report) =>
    <div className="flex items-start gap-3">
          <button onClick={() => toggleFavorite(row.id)}>
            <Star
          className={`w-4 h-4 ${row.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />

          </button>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.reportNo}</div>
          </div>
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: Report) =>
    <div>
          <Badge variant="default">{row.type}</Badge>
          <div className="text-xs text-gray-500 mt-1">{row.category}</div>
        </div>

  },
  {
    key: 'dateRange',
    header: 'Date Range',
    render: (row: Report) =>
    <div className="text-sm">
          <div>{new Date(row.dateRange.from).toLocaleDateString('en-IN')}</div>
          <div className="text-xs text-gray-500">
            to {new Date(row.dateRange.to).toLocaleDateString('en-IN')}
          </div>
        </div>

  },
  {
    key: 'stats',
    header: 'Statistics',
    render: (row: Report) =>
    <div className="text-sm">
          <div className="font-medium">{row.totalRecords} records</div>
          <div className="text-green-600">
            ₹{row.totalAmount.toLocaleString()}
          </div>
        </div>

  },
  {
    key: 'generated',
    header: 'Generated',
    render: (row: Report) =>
    <div className="text-sm">
          <div>{row.generatedOn}</div>
          <div className="text-xs text-gray-500">by {row.generatedBy}</div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Report) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          <div className="text-xs text-gray-500">
            {row.format} • {row.size}
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Report) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="Preview"
        onClick={() => {
          setSelectedReport(row);
          setShowPreviewModal(true);
        }}
        disabled={row.status !== 'Completed'}>

            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Download"
        onClick={() => exportReport(row, row.format.toLowerCase())}
        disabled={row.status !== 'Completed'}>

            <Download className="w-4 h-4 text-green-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Print"
        disabled={row.status !== 'Completed'}>

            <Printer className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => deleteReport(row.id)}>

            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];

  // Import table columns
  const importColumns = [
  {
    key: 'date',
    header: 'Date & Time',
    render: (row: ImportRecord) =>
    <div className="text-sm">
          <div>{new Date(row.date).toLocaleDateString('en-IN')}</div>
          <div className="text-xs text-gray-500">{row.time}</div>
        </div>

  },
  {
    key: 'file',
    header: 'File Details',
    render: (row: ImportRecord) =>
    <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            {row.file}
          </div>
          <div className="text-xs text-gray-500">{row.source}</div>
        </div>

  },
  {
    key: 'stats',
    header: 'Records',
    render: (row: ImportRecord) =>
    <div className="text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">
              {row.success} Success
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-red-600 font-medium">
              {row.failed} Failed
            </span>
          </div>
          <div className="text-xs text-gray-500">Total: {row.total}</div>
        </div>

  },
  {
    key: 'importedBy',
    header: 'Imported By',
    render: (row: ImportRecord) =>
    <span className="text-sm">{row.importedBy}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ImportRecord) => getStatusBadge(row.status)
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ImportRecord) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="View Log">
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          {row.failed > 0 &&
      <Button variant="ghost" size="sm" title="View Errors">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </Button>
      }
          <Button variant="ghost" size="sm" title="Download Original">
            <Download className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Charge Receipt Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate, manage, and export charge collection reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('templates')}>
            <FileText className="w-4 h-4 mr-2" />
            Use Template
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Reports</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalReports}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.completedReports}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Total Records
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.totalRecords.toLocaleString()}
              </p>
            </div>
            <Layers className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{(stats.totalAmount / 100000).toFixed(1)}L
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-600 font-medium">Downloads</p>
              <p className="text-2xl font-bold text-pink-900">
                {stats.totalDownloads}
              </p>
            </div>
            <Download className="w-8 h-8 text-pink-500" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
        {
          id: 'reports',
          label: 'Generated Reports',
          icon: FileText
        },
        {
          id: 'templates',
          label: 'Report Templates',
          icon: FolderOpen
        },
        {
          id: 'import',
          label: 'Import Receipts',
          icon: Upload
        },
        {
          id: 'scheduled',
          label: 'Scheduled Reports',
          icon: Clock
        }].
        map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab.id as any)}>

              <Icon className="w-4 h-4" />
              {tab.label}
            </button>);

        })}
      </div>

      {/* Generated Reports Tab */}
      {activeTab === 'reports' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search reports by name or report number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'Collection',
                  label: 'Collection'
                },
                {
                  value: 'Pending',
                  label: 'Pending'
                },
                {
                  value: 'Analysis',
                  label: 'Analysis'
                },
                {
                  value: 'Fine',
                  label: 'Fine'
                },
                {
                  value: 'Summary',
                  label: 'Summary'
                },
                {
                  value: 'Statement',
                  label: 'Statement'
                }]
                }
                value={filters.type}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value
                })
                } />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'Daily',
                  label: 'Daily'
                },
                {
                  value: 'Weekly',
                  label: 'Weekly'
                },
                {
                  value: 'Monthly',
                  label: 'Monthly'
                },
                {
                  value: 'Custom',
                  label: 'Custom'
                }]
                }
                value={filters.category}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value
                })
                } />

                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'Completed',
                  label: 'Completed'
                },
                {
                  value: 'Processing',
                  label: 'Processing'
                },
                {
                  value: 'Failed',
                  label: 'Failed'
                }]
                }
                value={filters.status}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value
                })
                } />

                <Button
                variant="outline"
                onClick={() =>
                setFilters({
                  type: 'all',
                  category: 'all',
                  status: 'all',
                  dateFrom: '',
                  dateTo: ''
                })
                }>

                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedReports.length > 0 &&
        <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800 font-medium">
                  {selectedReports.length} report(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                className="bg-white text-red-600 border-red-200">

                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
        }

          {/* Reports Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={reportColumns} data={filteredReports} />
            </div>
          </Card>
        </div>
      }

      {/* Report Templates Tab */}
      {activeTab === 'templates' &&
      <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Template
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) =>
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'}`}
            onClick={() => setSelectedTemplate(template)}>

                <div className="flex items-start gap-4">
                  <div
                className={`p-3 rounded-xl ${template.category === 'Collection' ? 'bg-green-100 text-green-600' : template.category === 'Pending' ? 'bg-orange-100 text-orange-600' : template.category === 'Analysis' ? 'bg-purple-100 text-purple-600' : template.category === 'Fine' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>

                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        {template.name}
                      </h3>
                      {template.isPremium &&
                  <Badge variant="warning" className="text-xs">
                          Premium
                        </Badge>
                  }
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {template.popularity}% popular
                      </span>
                      {template.lastUsed &&
                  <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Used {template.lastUsed}
                        </span>
                  }
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.fields.slice(0, 4).map((field, index) =>
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">

                        {field}
                      </span>
                )}
                    {template.fields.length > 4 &&
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{template.fields.length - 4} more
                      </span>
                }
                  </div>
                  <div className="flex gap-2">
                    <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    setShowGenerateModal(true);
                  }}>

                      <Play className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Preview: ${template.name}`);
                  }}>

                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
          )}
          </div>
        </div>
      }

      {/* Import Tab */}
      {activeTab === 'import' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Form */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Import Receipts</h3>
            <div className="space-y-4">
              <Select
              label="Import Source"
              options={[
              {
                value: 'bank',
                label: 'Bank Statement (CSV)'
              },
              {
                value: 'pos',
                label: 'POS Terminal Report (Excel)'
              },
              {
                value: 'gateway',
                label: 'Payment Gateway Report'
              },
              {
                value: 'upi',
                label: 'UPI Transactions'
              },
              {
                value: 'custom',
                label: 'Custom Format'
              }]
              }
              value={importSource}
              onChange={(e) => setImportSource(e.target.value)} />


              <div
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-colors cursor-pointer ${uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>

                <input
                type="file"
                className="hidden"
                id="file-upload"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload} />

                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploadedFile ?
                <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-green-700">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setUploadedFile(null);
                    }}>

                        <X className="w-4 h-4" />
                      </Button>
                    </div> :

                <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CSV, XLS, XLSX supported
                      </p>
                    </>
                }
                </label>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">
                  Required Columns:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Reference No (Unique)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Payer ID (GR No /
                    Admission No)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Amount
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Payment Date
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                variant="outline"
                className="flex-1"
                onClick={downloadImportTemplate}>

                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <Button
              variant="primary"
              className="w-full"
              disabled={!uploadedFile || isImporting}
              onClick={handleImport}>

                {isImporting ?
              <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </> :

              <>
                    <Zap className="w-4 h-4 mr-2" />
                    Validate & Import
                  </>
              }
              </Button>
            </div>
          </Card>

          {/* Import History & Errors */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-900">Import History</h3>
              </div>
              <div className="overflow-x-auto">
                <Table columns={importColumns} data={importHistory} />
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4">
                Recent Import Errors
              </h3>
              <div className="space-y-3">
                {importHistory.
              filter((i) => i.errors.length > 0).
              flatMap((i) =>
              i.errors.map((error, index) =>
              <div
                key={`${i.id}-${index}`}
                className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">

                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">
                            Row {error.row}: {error.message}
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            File: {i.file} • Field: {error.field}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
              )
              )}
                {importHistory.every((i) => i.errors.length === 0) &&
              <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No recent errors</p>
                  </div>
              }
              </div>
            </Card>
          </div>
        </div>
      }

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' &&
      <Card className="p-8 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Scheduled Reports
          </h3>
          <p className="text-gray-500 mb-4">
            Set up automated reports to be generated and emailed on a schedule
          </p>
          <Button variant="primary" onClick={() => setShowGenerateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Report
          </Button>
        </Card>
      }

      {/* Generate Report Modal */}
      {showGenerateModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Generate Report
                  </h2>
                  {selectedTemplate &&
                <p className="text-sm text-gray-500">
                      Using template: {selectedTemplate.name}
                    </p>
                }
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedTemplate(null);
                }}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Selection */}
              {!selectedTemplate &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Template
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {reportTemplates.slice(0, 6).map((template) =>
                <button
                  key={template.id}
                  className={`p-3 border rounded-lg text-left transition-all ${reportForm.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() =>
                  setReportForm({
                    ...reportForm,
                    template: template.id
                  })
                  }>

                        <div className="font-medium text-sm">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.category}
                        </div>
                      </button>
                )}
                  </div>
                </div>
            }

              {/* Report Name */}
              <Input
              label="Report Name (Optional)"
              placeholder="Custom report name..."
              value={reportForm.name}
              onChange={(e) =>
              setReportForm({
                ...reportForm,
                name: e.target.value
              })
              } />


              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="From Date"
                type="date"
                value={reportForm.dateFrom}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  dateFrom: e.target.value
                })
                } />

                <Input
                label="To Date"
                type="date"
                value={reportForm.dateTo}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  dateTo: e.target.value
                })
                } />

              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select
                label="Class"
                options={[
                {
                  value: 'all',
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
                }
                value={reportForm.class}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  class: e.target.value
                })
                } />

                <Select
                label="Section"
                options={[
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
                }]
                }
                value={reportForm.section}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  section: e.target.value
                })
                } />

                <Select
                label="Charge Type"
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'Fine',
                  label: 'Fine'
                },
                {
                  value: 'Event',
                  label: 'Event'
                },
                {
                  value: 'Exam',
                  label: 'Exam'
                },
                {
                  value: 'Material',
                  label: 'Material'
                }]
                }
                value={reportForm.chargeType}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  chargeType: e.target.value
                })
                } />

                <Select
                label="Payment Mode"
                options={[
                {
                  value: 'all',
                  label: 'All Modes'
                },
                {
                  value: 'cash',
                  label: 'Cash'
                },
                {
                  value: 'cheque',
                  label: 'Cheque'
                },
                {
                  value: 'online',
                  label: 'Online'
                },
                {
                  value: 'card',
                  label: 'Card'
                }]
                }
                value={reportForm.paymentMode}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  paymentMode: e.target.value
                })
                } />

              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <div className="flex gap-3">
                  {[
                {
                  value: 'pdf',
                  label: 'PDF',
                  icon: <File className="w-5 h-5" />
                },
                {
                  value: 'excel',
                  label: 'Excel',
                  icon: <FileSpreadsheet className="w-5 h-5" />
                },
                {
                  value: 'csv',
                  label: 'CSV',
                  icon: <FileText className="w-5 h-5" />
                }].
                map((format) =>
                <button
                  key={format.value}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${reportForm.format === format.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() =>
                  setReportForm({
                    ...reportForm,
                    format: format.value
                  })
                  }>

                      {format.icon}
                      {format.label}
                    </button>
                )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generation Schedule
                </label>
                <div className="flex gap-3">
                  {[
                {
                  value: 'now',
                  label: 'Generate Now'
                },
                {
                  value: 'later',
                  label: 'Schedule Later'
                },
                {
                  value: 'recurring',
                  label: 'Recurring'
                }].
                map((option) =>
                <button
                  key={option.value}
                  className={`px-4 py-2 border rounded-lg transition-all ${reportForm.schedule === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() =>
                  setReportForm({
                    ...reportForm,
                    schedule: option.value
                  })
                  }>

                      {option.label}
                    </button>
                )}
                </div>
              </div>

              {/* Schedule Options */}
              {reportForm.schedule !== 'now' &&
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                label="Schedule Date & Time"
                type="datetime-local"
                value={reportForm.scheduleTime}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  scheduleTime: e.target.value
                })
                } />

                  {reportForm.schedule === 'recurring' &&
              <Select
                label="Frequency"
                options={[
                {
                  value: 'daily',
                  label: 'Daily'
                },
                {
                  value: 'weekly',
                  label: 'Weekly'
                },
                {
                  value: 'monthly',
                  label: 'Monthly'
                }]
                }
                value={reportForm.scheduleFrequency}
                onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  scheduleFrequency: e.target.value
                })
                } />

              }
                </div>
            }

              {/* Email Recipients */}
              <Input
              label="Email Recipients (Optional)"
              placeholder="Enter email addresses separated by comma..."
              value={reportForm.emailRecipients}
              onChange={(e) =>
              setReportForm({
                ...reportForm,
                emailRecipients: e.target.value
              })
              } />

            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
              variant="outline"
              onClick={() => {
                setShowGenerateModal(false);
                setSelectedTemplate(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleGenerateReport}>
                <Zap className="w-4 h-4 mr-2" />
                {reportForm.schedule === 'now' ?
              'Generate Report' :
              'Schedule Report'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Report Preview Modal */}
      {showPreviewModal && selectedReport &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReport.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedReport.reportNo}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                variant="outline"
                onClick={() => exportReport(selectedReport, 'pdf')}>

                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                variant="ghost"
                onClick={() => setShowPreviewModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Report Preview Content */}
              <div className="bg-gray-50 border rounded-lg p-8 min-h-[400px]">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Delhi Public School</h2>
                  <p className="text-gray-600">{selectedReport.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Period:{' '}
                    {new Date(selectedReport.dateRange.from).toLocaleDateString(
                    'en-IN'
                  )}{' '}
                    -{' '}
                    {new Date(selectedReport.dateRange.to).toLocaleDateString(
                    'en-IN'
                  )}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-2xl font-bold">
                      {selectedReport.totalRecords}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{selectedReport.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Generated On</p>
                    <p className="text-lg font-medium">
                      {selectedReport.generatedOn}
                    </p>
                  </div>
                </div>

                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p>Full report preview would be displayed here</p>
                  <p className="text-sm">
                    Download the report to view complete details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Report Generation Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>
                Use templates for quick report generation with predefined
                formats
              </li>
              <li>
                Schedule recurring reports to automate daily/weekly/monthly
                reports
              </li>
              <li>
                Import bank statements and POS reports for automatic
                reconciliation
              </li>
              <li>
                Export reports in PDF for printing or Excel for further analysis
              </li>
              <li>Star your frequently used reports for quick access</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}