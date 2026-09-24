import React, {
  useEffect,
  useMemo,
  useState,
  Fragment,
  createElement,
  Component } from
'react';
import { FeeDefaulterList } from './FeeDefaulterList';
import { FeeDiscountExemptionReport } from './FeeDiscountExemptionReport';
import { FeeComplianceReporting } from './FeeHeadwiseCollectionSummary';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Download,
  Calendar,
  Printer,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  PieChart,
  BarChart3,
  DollarSign,
  UserCheck,
  Clock,
  Activity,
  FilterX,
  X,
  Trophy,
  Target,
  Crosshair,
  User,
  Building,
  BookOpen,
  Bus,
  Calculator,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Banknote,
  Smartphone,
  GraduationCap } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// Types
interface AcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}
interface MonthlyCollection {
  id: string;
  month: string;
  monthIndex: number;
  year: number;
  fullDate: string;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  cash: number;
  cheque: number;
  online: number;
  upi: number;
  bankTransfer: number;
  totalCollected: number;
  totalPending: number;
  totalDue: number;
  receiptsGenerated: number;
  concessionGiven: number;
  waivedOff: number;
  refunds: number;
  netCollection: number;
  collectionRate: number;
  targetAmount: number;
  achievement: number;
  previousMonthCollection: number;
  growthRate: number;
}
interface ClassWiseCollection {
  id: string;
  className: string;
  section: string;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  totalDue: number;
  collected: number;
  pending: number;
  collectionRate: number;
  averagePerStudent: number;
}
interface FeeHeadCollection {
  id: string;
  feeHead: string;
  icon: any;
  totalDue: number;
  collected: number;
  pending: number;
  concession: number;
  waiver: number;
  collectionRate: number;
  studentsCount: number;
}
interface StudentPayment {
  id: string;
  admissionNo: string;
  studentName: string;
  className: string;
  section: string;
  fatherName: string;
  mobile: string;
  totalFee: number;
  paid: number;
  pending: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  paymentMode: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
}
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
// Academic Years Data
const academicYears: AcademicYear[] = [
{
  id: '2024-25',
  label: '2024-2025',
  startDate: '2024-04-01',
  endDate: '2025-03-31'
},
{
  id: '2023-24',
  label: '2023-2024',
  startDate: '2023-04-01',
  endDate: '2024-03-31'
},
{
  id: '2022-23',
  label: '2022-2023',
  startDate: '2022-04-01',
  endDate: '2023-03-31'
},
{
  id: '2021-22',
  label: '2021-2022',
  startDate: '2021-04-01',
  endDate: '2022-03-31'
}];

// Month names for academic year (April to March)
const academicMonths = [
{
  name: 'April',
  index: 3
},
{
  name: 'May',
  index: 4
},
{
  name: 'June',
  index: 5
},
{
  name: 'July',
  index: 6
},
{
  name: 'August',
  index: 7
},
{
  name: 'September',
  index: 8
},
{
  name: 'October',
  index: 9
},
{
  name: 'November',
  index: 10
},
{
  name: 'December',
  index: 11
},
{
  name: 'January',
  index: 0
},
{
  name: 'February',
  index: 1
},
{
  name: 'March',
  index: 2
}];

// Classes
const classes = [
'Nursery',
'LKG',
'UKG',
'Class 1',
'Class 2',
'Class 3',
'Class 4',
'Class 5',
'Class 6',
'Class 7',
'Class 8',
'Class 9',
'Class 10',
'Class 11',
'Class 12'];

const sections = ['A', 'B', 'C', 'D'];
// Fee Heads
const feeHeads = [
{
  name: 'Tuition Fee',
  icon: BookOpen
},
{
  name: 'Transport Fee',
  icon: Bus
},
{
  name: 'Exam Fee',
  icon: Calculator
},
{
  name: 'Library Fee',
  icon: BookOpen
},
{
  name: 'Lab Fee',
  icon: Activity
},
{
  name: 'Sports Fee',
  icon: Trophy
},
{
  name: 'Development Fee',
  icon: Building
},
{
  name: 'Annual Charges',
  icon: Calendar
},
{
  name: 'Admission Fee',
  icon: GraduationCap
},
{
  name: 'Miscellaneous',
  icon: Wallet
}];

// Generate Monthly Collection Data
const generateMonthlyCollectionData = (
academicYear: AcademicYear)
: MonthlyCollection[] => {
  const startYear = parseInt(academicYear.id.split('-')[0]);
  let previousCollection = 0;
  return academicMonths.map((month, idx) => {
    const year = month.index < 3 ? startYear + 1 : startYear;
    const totalStudents = Math.floor(Math.random() * 200) + 800;
    const paidStudents = Math.floor(Math.random() * (totalStudents - 50)) + 50;
    const pendingStudents = totalStudents - paidStudents;
    const cash = Math.floor(Math.random() * 500000) + 200000;
    const cheque = Math.floor(Math.random() * 400000) + 150000;
    const online = Math.floor(Math.random() * 600000) + 300000;
    const upi = Math.floor(Math.random() * 300000) + 100000;
    const bankTransfer = Math.floor(Math.random() * 200000) + 50000;
    const totalCollected = cash + cheque + online + upi + bankTransfer;
    const totalDue = Math.floor(totalCollected * 1.3);
    const totalPending = totalDue - totalCollected;
    const concessionGiven = Math.floor(totalCollected * 0.05);
    const waivedOff = Math.floor(totalCollected * 0.02);
    const refunds = Math.floor(Math.random() * 10000) + 1000;
    const netCollection = totalCollected - refunds;
    const targetAmount = Math.floor(totalDue * 0.9);
    const achievement = totalCollected / targetAmount * 100;
    const growthRate =
    previousCollection > 0 ?
    (totalCollected - previousCollection) / previousCollection * 100 :
    0;
    previousCollection = totalCollected;
    return {
      id: `${year}-${month.index}`,
      month: month.name,
      monthIndex: month.index,
      year,
      fullDate: `${month.name} ${year}`,
      totalStudents,
      paidStudents,
      pendingStudents,
      cash,
      cheque,
      online,
      upi,
      bankTransfer,
      totalCollected,
      totalPending,
      totalDue,
      receiptsGenerated: paidStudents + Math.floor(Math.random() * 50),
      concessionGiven,
      waivedOff,
      refunds,
      netCollection,
      collectionRate: totalCollected / totalDue * 100,
      targetAmount,
      achievement,
      previousMonthCollection: previousCollection,
      growthRate
    };
  });
};
// Generate Class-wise Collection Data
const generateClassWiseData = (
academicYear: string,
month: string)
: ClassWiseCollection[] => {
  const data: ClassWiseCollection[] = [];
  classes.forEach((cls, clsIdx) => {
    sections.slice(0, Math.floor(Math.random() * 3) + 2).forEach((section) => {
      const totalStudents = Math.floor(Math.random() * 40) + 25;
      const paidStudents = Math.floor(Math.random() * (totalStudents - 5)) + 5;
      const pendingStudents = totalStudents - paidStudents;
      const totalDue = Math.floor(Math.random() * 300000) + 100000;
      const collected = Math.floor(totalDue * (0.5 + Math.random() * 0.45));
      const pending = totalDue - collected;
      data.push({
        id: `${clsIdx}-${section}`,
        className: cls,
        section,
        totalStudents,
        paidStudents,
        pendingStudents,
        totalDue,
        collected,
        pending,
        collectionRate: collected / totalDue * 100,
        averagePerStudent: Math.round(collected / paidStudents)
      });
    });
  });
  return data;
};
// Generate Fee Head Collection Data
const generateFeeHeadData = (
academicYear: string,
month: string)
: FeeHeadCollection[] => {
  return feeHeads.map((head, idx) => {
    const totalDue = Math.floor(Math.random() * 1000000) + 200000;
    const collected = Math.floor(totalDue * (0.6 + Math.random() * 0.35));
    const pending = totalDue - collected;
    const concession = Math.floor(collected * 0.08);
    const waiver = Math.floor(collected * 0.03);
    return {
      id: String(idx + 1),
      feeHead: head.name,
      icon: head.icon,
      totalDue,
      collected,
      pending,
      concession,
      waiver,
      collectionRate: collected / totalDue * 100,
      studentsCount: Math.floor(Math.random() * 500) + 200
    };
  });
};
// Generate Student Payment Data
const generateStudentPayments = (
academicYear: string,
month: string,
className: string)
: StudentPayment[] => {
  const studentNames = [
  'Aarav Sharma',
  'Vivaan Patel',
  'Aditya Singh',
  'Vihaan Kumar',
  'Arjun Gupta',
  'Reyansh Verma',
  'Muhammad Ali',
  'Sai Krishna',
  'Arnav Joshi',
  'Dhruv Reddy',
  'Priya Sharma',
  'Ananya Patel',
  'Kavya Singh',
  'Isha Kumar',
  'Riya Gupta',
  'Sneha Verma',
  'Pooja Ali',
  'Divya Krishna',
  'Neha Joshi',
  'Sana Reddy'];

  const paymentModes = ['Cash', 'Cheque', 'Online', 'UPI', 'Bank Transfer'];
  const statuses: ('Paid' | 'Partial' | 'Pending' | 'Overdue')[] = [
  'Paid',
  'Partial',
  'Pending',
  'Overdue'];

  return studentNames.map((name, idx) => {
    const totalFee = Math.floor(Math.random() * 50000) + 20000;
    const statusIdx = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIdx];
    let paid = 0;
    switch (status) {
      case 'Paid':
        paid = totalFee;
        break;
      case 'Partial':
        paid = Math.floor(totalFee * (0.3 + Math.random() * 0.5));
        break;
      case 'Pending':
      case 'Overdue':
        paid = 0;
        break;
    }
    return {
      id: String(idx + 1),
      admissionNo: `ADM${2024}${String(idx + 1).padStart(4, '0')}`,
      studentName: name,
      className:
      className === 'all' ?
      classes[Math.floor(Math.random() * classes.length)] :
      className,
      section: sections[Math.floor(Math.random() * sections.length)],
      fatherName: `Mr. ${name.split(' ')[1]}`,
      mobile: `98${Math.floor(Math.random() * 100000000).
      toString().
      padStart(8, '0')}`,
      totalFee,
      paid,
      pending: totalFee - paid,
      lastPaymentDate:
      paid > 0 ?
      new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toLocaleDateString('en-IN') :
      '-',
      lastPaymentAmount:
      paid > 0 ? Math.floor(paid * (0.5 + Math.random() * 0.5)) : 0,
      paymentMode:
      paid > 0 ?
      paymentModes[Math.floor(Math.random() * paymentModes.length)] :
      '-',
      status
    };
  });
};
// Export Functions
const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    return false;
  }
  const processedData = data.map((row) => {
    const newRow: any = {};
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value !== 'function' && typeof value !== 'object') {
        newRow[key] = value;
      }
    });
    return newRow;
  });
  const headers = Object.keys(processedData[0]).join(',');
  const rows = processedData.map((row) =>
  Object.values(row).
  map((val) =>
  typeof val === 'string' && val.includes(',') ? `"${val}"` : val
  ).
  join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  return true;
};
const exportToExcel = (data: any[], filename: string) => {
  // In production, use xlsx library
  alert(
    `Exporting ${data.length} rows to Excel format...\n\nIn production, this would use 'xlsx' library.`
  );
  return true;
};
const exportToPDF = (data: any[], filename: string, title: string) => {
  // In production, use jsPDF library
  alert(
    `Generating PDF: ${title}\n${data.length} records\n\nIn production, this would use 'jsPDF' library.`
  );
  return true;
};
// Main Component
export function FeeCollectionReports() {
  // State
  const [selectedAcademicYear, setSelectedAcademicYear] =
  useState<string>('2024-25');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [reportType, setReportType] = useState<
    'summary' | 'monthly' | 'classwise' | 'headwise' | 'students'>(
    'summary');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<string>('all');
  const [paymentMode, setPaymentMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [monthlyData, setMonthlyData] = useState<MonthlyCollection[]>([]);
  const [classWiseData, setClassWiseData] = useState<ClassWiseCollection[]>([]);
  const [feeHeadData, setFeeHeadData] = useState<FeeHeadCollection[]>([]);
  const [studentData, setStudentData] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  // Get current academic year
  const currentAcademicYear = useMemo(
    () => academicYears.find((ay) => ay.id === selectedAcademicYear),
    [selectedAcademicYear]
  );
  // Load initial data
  useEffect(() => {
    loadData();
  }, [selectedAcademicYear]);
  // Load data based on selections
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const academicYear = academicYears.find(
        (ay) => ay.id === selectedAcademicYear
      );
      if (academicYear) {
        setMonthlyData(generateMonthlyCollectionData(academicYear));
        setClassWiseData(
          generateClassWiseData(selectedAcademicYear, selectedMonth)
        );
        setFeeHeadData(generateFeeHeadData(selectedAcademicYear, selectedMonth));
        setStudentData(
          generateStudentPayments(
            selectedAcademicYear,
            selectedMonth,
            selectedClass
          )
        );
      }
      setLoading(false);
      addNotification('Report data loaded successfully!', 'success');
    }, 800);
  };
  // Notification handler
  const addNotification = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning') =>
  {
    const id = Date.now().toString();
    setNotifications((prev) => [
    ...prev,
    {
      id,
      message,
      type
    }]
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (monthlyData.length === 0) return null;
    const filteredData =
    selectedMonth === 'all' ?
    monthlyData :
    monthlyData.filter((m) => m.month === selectedMonth);
    const totalCollected = filteredData.reduce(
      (sum, m) => sum + m.totalCollected,
      0
    );
    const totalPending = filteredData.reduce(
      (sum, m) => sum + m.totalPending,
      0
    );
    const totalDue = filteredData.reduce((sum, m) => sum + m.totalDue, 0);
    const totalCash = filteredData.reduce((sum, m) => sum + m.cash, 0);
    const totalCheque = filteredData.reduce((sum, m) => sum + m.cheque, 0);
    const totalOnline = filteredData.reduce((sum, m) => sum + m.online, 0);
    const totalUPI = filteredData.reduce((sum, m) => sum + m.upi, 0);
    const totalBankTransfer = filteredData.reduce(
      (sum, m) => sum + m.bankTransfer,
      0
    );
    const totalReceipts = filteredData.reduce(
      (sum, m) => sum + m.receiptsGenerated,
      0
    );
    const totalConcession = filteredData.reduce(
      (sum, m) => sum + m.concessionGiven,
      0
    );
    const totalWaiver = filteredData.reduce((sum, m) => sum + m.waivedOff, 0);
    const avgCollectionRate =
    filteredData.reduce((sum, m) => sum + m.collectionRate, 0) /
    filteredData.length;
    return {
      totalCollected,
      totalPending,
      totalDue,
      totalCash,
      totalCheque,
      totalOnline,
      totalUPI,
      totalBankTransfer,
      totalReceipts,
      totalConcession,
      totalWaiver,
      avgCollectionRate,
      collectionRate: totalCollected / totalDue * 100
    };
  }, [monthlyData, selectedMonth]);
  // Handle export
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    let data: any[] = [];
    let filename = `fee-collection-${selectedAcademicYear}`;
    let title = 'Fee Collection Report';
    switch (reportType) {
      case 'summary':
      case 'monthly':
        data = monthlyData;
        filename += '-monthly';
        title = `Monthly Fee Collection Report - ${currentAcademicYear?.label}`;
        break;
      case 'classwise':
        data = classWiseData;
        filename += '-classwise';
        title = `Class-wise Fee Collection Report - ${currentAcademicYear?.label}`;
        break;
      case 'headwise':
        data = feeHeadData;
        filename += '-headwise';
        title = `Fee Head-wise Collection Report - ${currentAcademicYear?.label}`;
        break;
      case 'students':
        data = studentData;
        filename += '-students';
        title = `Student Payment Report - ${currentAcademicYear?.label}`;
        break;
    }
    if (data.length === 0) {
      addNotification('No data to export!', 'error');
      return;
    }
    let success = false;
    switch (format) {
      case 'csv':
        success = exportToCSV(data, filename);
        break;
      case 'excel':
        success = exportToExcel(data, filename);
        break;
      case 'pdf':
        success = exportToPDF(data, filename, title);
        break;
    }
    if (success) {
      addNotification(
        `Exported as ${format.toUpperCase()} successfully!`,
        'success'
      );
    }
  };
  // Handle print
  const handlePrint = () => {
    window.print();
    addNotification('Print dialog opened!', 'info');
  };
  // Handle row click
  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  // Render notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };
  // Get status badge variant
  const getStatusVariant = (
  status: string)
  : 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Pending':
        return 'info';
      case 'Overdue':
        return 'error';
      default:
        return 'info';
    }
  };
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) =>
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-lg text-white min-w-[320px] animate-slide-in ${notification.type === 'success' ? 'bg-green-600' : notification.type === 'error' ? 'bg-red-600' : notification.type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`}>

            {getNotificationIcon(notification.type)}
            <span className="font-medium flex-1">{notification.message}</span>
            <button
            onClick={() =>
            setNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id)
            )
            }
            className="text-white/80 hover:text-white transition-colors">

              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              Fee Collection Reports
            </h1>
            <p className="text-gray-500 mt-2">
              Comprehensive fee collection analysis for Academic Year{' '}
              {currentAcademicYear?.label}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Report Filters
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select
            label="Academic Year"
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            options={academicYears.map((ay) => ({
              value: ay.id,
              label: ay.label
            }))} />

          <Select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={[
            {
              value: 'all',
              label: 'All Months'
            },
            ...academicMonths.map((m) => ({
              value: m.name,
              label: m.name
            }))]
            } />

          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            options={[
            {
              value: 'summary',
              label: 'Summary Report'
            },
            {
              value: 'monthly',
              label: 'Monthly Breakdown'
            },
            {
              value: 'classwise',
              label: 'Class-wise Report'
            },
            {
              value: 'headwise',
              label: 'Fee Head-wise Report'
            },
            {
              value: 'students',
              label: 'Student Payments'
            }]
            } />

          <Select
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
            {
              value: 'all',
              label: 'All Classes'
            },
            ...classes.map((c) => ({
              value: c,
              label: c
            }))]
            } />

          <Select
            label="Payment Mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
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
              value: 'upi',
              label: 'UPI'
            },
            {
              value: 'bank',
              label: 'Bank Transfer'
            }]
            } />

        </div>
        <div className="mt-4 flex gap-3">
          <Button variant="primary" onClick={loadData} disabled={loading}>
            {loading ?
            <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </> :

            <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </>
            }
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMonth('all');
              setSelectedClass('all');
              setPaymentMode('all');
              setSearchTerm('');
              addNotification('Filters reset!', 'info');
            }}>

            <FilterX className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Summary Statistics */}
      {summaryStats &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  ₹{summaryStats.totalCollected.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>{summaryStats.collectionRate.toFixed(1)}% collected</span>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  ₹{summaryStats.totalPending.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-orange-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {(100 - summaryStats.collectionRate).toFixed(1)}% pending
              </span>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {summaryStats.totalReceipts.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Generated this period</span>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cash Collection</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  ₹{summaryStats.totalCash.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Banknote className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-purple-600">
              <span>
                {(
              summaryStats.totalCash / summaryStats.totalCollected *
              100).
              toFixed(1)}
                % of total
              </span>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online + UPI</p>
                <p className="text-2xl font-bold text-cyan-700 mt-1">
                  ₹
                  {(
                summaryStats.totalOnline + summaryStats.totalUPI).
                toLocaleString()}
                </p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-xl">
                <Smartphone className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-cyan-600">
              <span>
                {(
              (summaryStats.totalOnline + summaryStats.totalUPI) /
              summaryStats.totalCollected *
              100).
              toFixed(1)}
                % digital
              </span>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concession Given</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  ₹{summaryStats.totalConcession.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-indigo-600">
              <span>Waiver: ₹{summaryStats.totalWaiver.toLocaleString()}</span>
            </div>
          </Card>
        </div>
      }

      {/* Monthly Collection Table */}
      {(reportType === 'summary' || reportType === 'monthly') &&
      monthlyData.length > 0 &&
      <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Monthly Fee Collection
                    </h2>
                    <p className="text-sm text-gray-500">
                      Academic Year {currentAcademicYear?.label}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                placeholder="Search months..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Total Due
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Cash
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Cheque
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Online
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      UPI
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Total Collected
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Pending
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                      Collection %
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlyData.
              filter(
                (m) =>
                selectedMonth === 'all' || m.month === selectedMonth
              ).
              filter(
                (m) =>
                m.month.
                toLowerCase().
                includes(searchTerm.toLowerCase()) ||
                m.fullDate.
                toLowerCase().
                includes(searchTerm.toLowerCase())
              ).
              map((month, index) =>
              <Fragment key={month.id}>
                        <tr
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${expandedMonth === month.id ? 'bg-blue-50' : ''}`}
                  onClick={() =>
                  setExpandedMonth(
                    expandedMonth === month.id ? null : month.id
                  )
                  }>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {expandedMonth === month.id ?
                      <ChevronDown className="w-4 h-4 text-gray-400" /> :

                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                              <span className="font-medium text-gray-900">
                                {month.fullDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            ₹{month.totalDue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700">
                            ₹{month.cash.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700">
                            ₹{month.cheque.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700">
                            ₹{month.online.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700">
                            ₹{month.upi.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-700">
                            ₹{month.totalCollected.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-orange-600">
                            ₹{month.totalPending.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge
                      variant={
                      month.collectionRate >= 90 ?
                      'success' :
                      month.collectionRate >= 70 ?
                      'warning' :
                      'error'
                      }>

                              {month.collectionRate.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(month);
                      }}>

                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                        {expandedMonth === month.id &&
                <tr className="bg-gray-50">
                            <td colSpan={10} className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Total Students
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {month.totalStudents}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Paid Students
                                  </p>
                                  <p className="text-lg font-bold text-green-600">
                                    {month.paidStudents}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Pending Students
                                  </p>
                                  <p className="text-lg font-bold text-orange-600">
                                    {month.pendingStudents}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Receipts Generated
                                  </p>
                                  <p className="text-lg font-bold text-blue-600">
                                    {month.receiptsGenerated}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Concession
                                  </p>
                                  <p className="text-lg font-bold text-purple-600">
                                    ₹{month.concessionGiven.toLocaleString()}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 uppercase">
                                    Growth Rate
                                  </p>
                                  <p
                          className={`text-lg font-bold ${month.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                                    {month.growthRate >= 0 ? '+' : ''}
                                    {month.growthRate.toFixed(1)}%
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                }
                      </Fragment>
              )}
                </tbody>
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr>
                    <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.totalDue, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.cash, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.cheque, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.online, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.upi, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-700">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.totalCollected, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-orange-600">
                      ₹
                      {monthlyData.
                  reduce((s, m) => s + m.totalPending, 0).
                  toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="info">
                        {summaryStats ?
                    summaryStats.collectionRate.toFixed(1) :
                    0}
                        %
                      </Badge>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
      }

      {/* Class-wise Collection Table */}
      {reportType === 'classwise' && classWiseData.length > 0 &&
      <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Class-wise Fee Collection
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedMonth === 'all' ? 'All Months' : selectedMonth} -
                  Academic Year {currentAcademicYear?.label}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
            columns={[
            {
              key: 'className',
              header: 'Class',
              render: (row: ClassWiseCollection) =>
              <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {row.className}
                      </span>
                      <Badge variant="info">{row.section}</Badge>
                    </div>

            },
            {
              key: 'totalStudents',
              header: 'Total Students',
              render: (row: ClassWiseCollection) =>
              <span className="text-gray-700">{row.totalStudents}</span>

            },
            {
              key: 'paidStudents',
              header: 'Paid',
              render: (row: ClassWiseCollection) =>
              <Badge variant="success">{row.paidStudents}</Badge>

            },
            {
              key: 'pendingStudents',
              header: 'Pending',
              render: (row: ClassWiseCollection) =>
              <Badge variant="error">{row.pendingStudents}</Badge>

            },
            {
              key: 'totalDue',
              header: 'Total Due',
              render: (row: ClassWiseCollection) =>
              <span className="text-gray-600">
                      ₹{row.totalDue.toLocaleString()}
                    </span>

            },
            {
              key: 'collected',
              header: 'Collected',
              render: (row: ClassWiseCollection) =>
              <span className="font-bold text-green-700">
                      ₹{row.collected.toLocaleString()}
                    </span>

            },
            {
              key: 'pending',
              header: 'Outstanding',
              render: (row: ClassWiseCollection) =>
              <span className="text-orange-600">
                      ₹{row.pending.toLocaleString()}
                    </span>

            },
            {
              key: 'collectionRate',
              header: 'Collection %',
              render: (row: ClassWiseCollection) =>
              <Badge
                variant={
                row.collectionRate >= 90 ?
                'success' :
                row.collectionRate >= 70 ?
                'warning' :
                'error'
                }>

                      {row.collectionRate.toFixed(1)}%
                    </Badge>

            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row: ClassWiseCollection) =>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRowClick(row)}>

                      <Eye className="w-4 h-4" />
                    </Button>

            }]
            }
            data={classWiseData.filter(
              (c) => selectedClass === 'all' || c.className === selectedClass
            )} />

          </div>
        </Card>
      }

      {/* Fee Head-wise Collection Table */}
      {reportType === 'headwise' && feeHeadData.length > 0 &&
      <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fee Head-wise Collection
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedMonth === 'all' ? 'All Months' : selectedMonth} -
                  Academic Year {currentAcademicYear?.label}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
            columns={[
            {
              key: 'feeHead',
              header: 'Fee Head',
              render: (row: FeeHeadCollection) =>
              <div className="flex items-center gap-3">
                      {createElement(row.icon, {
                  className: 'w-5 h-5 text-gray-500'
                })}
                      <span className="font-medium text-gray-900">
                        {row.feeHead}
                      </span>
                    </div>

            },
            {
              key: 'studentsCount',
              header: 'Students',
              render: (row: FeeHeadCollection) =>
              <span className="text-gray-700">{row.studentsCount}</span>

            },
            {
              key: 'totalDue',
              header: 'Total Due',
              render: (row: FeeHeadCollection) =>
              <span className="text-gray-600">
                      ₹{row.totalDue.toLocaleString()}
                    </span>

            },
            {
              key: 'collected',
              header: 'Collected',
              render: (row: FeeHeadCollection) =>
              <span className="font-bold text-green-700">
                      ₹{row.collected.toLocaleString()}
                    </span>

            },
            {
              key: 'pending',
              header: 'Pending',
              render: (row: FeeHeadCollection) =>
              <span className="text-orange-600">
                      ₹{row.pending.toLocaleString()}
                    </span>

            },
            {
              key: 'concession',
              header: 'Concession',
              render: (row: FeeHeadCollection) =>
              <span className="text-purple-600">
                      ₹{row.concession.toLocaleString()}
                    </span>

            },
            {
              key: 'waiver',
              header: 'Waiver',
              render: (row: FeeHeadCollection) =>
              <span className="text-red-600">
                      ₹{row.waiver.toLocaleString()}
                    </span>

            },
            {
              key: 'collectionRate',
              header: 'Collection %',
              render: (row: FeeHeadCollection) =>
              <Badge
                variant={
                row.collectionRate >= 90 ?
                'success' :
                row.collectionRate >= 70 ?
                'warning' :
                'error'
                }>

                      {row.collectionRate.toFixed(1)}%
                    </Badge>

            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row: FeeHeadCollection) =>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRowClick(row)}>

                      <Eye className="w-4 h-4" />
                    </Button>

            }]
            }
            data={feeHeadData} />

          </div>
        </Card>
      }

      {/* Student Payments Table */}
      {reportType === 'students' && studentData.length > 0 &&
      <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Student Payment Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedClass === 'all' ? 'All Classes' : selectedClass} -
                    Academic Year {currentAcademicYear?.label}
                  </p>
                </div>
              </div>
              <Select
              label=""
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'Paid',
                label: 'Paid'
              },
              {
                value: 'Partial',
                label: 'Partial'
              },
              {
                value: 'Pending',
                label: 'Pending'
              },
              {
                value: 'Overdue',
                label: 'Overdue'
              }]
              } />

            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
            columns={[
            {
              key: 'admissionNo',
              header: 'Adm. No.',
              render: (row: StudentPayment) =>
              <span className="font-mono text-sm text-gray-600">
                      {row.admissionNo}
                    </span>

            },
            {
              key: 'studentName',
              header: 'Student Name',
              render: (row: StudentPayment) =>
              <div>
                      <p className="font-medium text-gray-900">
                        {row.studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        F/o {row.fatherName}
                      </p>
                    </div>

            },
            {
              key: 'className',
              header: 'Class',
              render: (row: StudentPayment) =>
              <Badge variant="info">
                      {row.className} - {row.section}
                    </Badge>

            },
            {
              key: 'totalFee',
              header: 'Total Fee',
              render: (row: StudentPayment) =>
              <span className="text-gray-600">
                      ₹{row.totalFee.toLocaleString()}
                    </span>

            },
            {
              key: 'paid',
              header: 'Paid',
              render: (row: StudentPayment) =>
              <span className="font-bold text-green-700">
                      ₹{row.paid.toLocaleString()}
                    </span>

            },
            {
              key: 'pending',
              header: 'Pending',
              render: (row: StudentPayment) =>
              <span className="text-orange-600">
                      ₹{row.pending.toLocaleString()}
                    </span>

            },
            {
              key: 'lastPaymentDate',
              header: 'Last Payment',
              render: (row: StudentPayment) =>
              <div className="text-sm">
                      <p className="text-gray-700">{row.lastPaymentDate}</p>
                      {row.lastPaymentAmount > 0 &&
                <p className="text-xs text-gray-500">
                          ₹{row.lastPaymentAmount.toLocaleString()}
                        </p>
                }
                    </div>

            },
            {
              key: 'paymentMode',
              header: 'Mode',
              render: (row: StudentPayment) =>
              <span className="text-gray-600 text-sm">
                      {row.paymentMode}
                    </span>

            },
            {
              key: 'status',
              header: 'Status',
              render: (row: StudentPayment) =>
              <Badge variant={getStatusVariant(row.status)}>
                      {row.status}
                    </Badge>

            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row: StudentPayment) =>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRowClick(row)}>

                      <Eye className="w-4 h-4" />
                    </Button>

            }]
            }
            data={studentData.filter(
              (s) => paymentStatus === 'all' || s.status === paymentStatus
            )} />

          </div>
        </Card>
      }

      {/* Payment Mode Distribution Chart Card */}
      {summaryStats &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-600" />
              Payment Mode Distribution
            </h3>
            <div className="space-y-4">
              {[
            {
              label: 'Cash',
              value: summaryStats.totalCash,
              color: 'bg-green-500'
            },
            {
              label: 'Cheque',
              value: summaryStats.totalCheque,
              color: 'bg-blue-500'
            },
            {
              label: 'Online',
              value: summaryStats.totalOnline,
              color: 'bg-purple-500'
            },
            {
              label: 'UPI',
              value: summaryStats.totalUPI,
              color: 'bg-cyan-500'
            },
            {
              label: 'Bank Transfer',
              value: summaryStats.totalBankTransfer,
              color: 'bg-indigo-500'
            }].
            map((mode) =>
            <div key={mode.label} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded ${mode.color}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {mode.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        ₹{mode.value.toLocaleString()} (
                        {(
                    mode.value / summaryStats.totalCollected *
                    100).
                    toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                    className={`h-full ${mode.color} rounded-full transition-all duration-500`}
                    style={{
                      width: `${mode.value / summaryStats.totalCollected * 100}%`
                    }}>
                  </div>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Monthly Trend
            </h3>
            <div className="flex items-end gap-2 h-48">
              {monthlyData.slice(0, 6).map((month, idx) => {
              const maxCollection = Math.max(
                ...monthlyData.map((m) => m.totalCollected)
              );
              const height = month.totalCollected / maxCollection * 100;
              return (
                <div
                  key={month.id}
                  className="flex-1 flex flex-col items-center">

                    <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
                    style={{
                      height: `${height}%`
                    }}
                    title={`₹${month.totalCollected.toLocaleString()}`}>
                  </div>
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                      {month.month.slice(0, 3)}
                    </span>
                  </div>);

            })}
            </div>
          </Card>
        </div>
      }

      {/* Detail Modal */}
      {isModalOpen && selectedRow &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Detailed View</h2>
              <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">

                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(selectedRow).
              filter(
                ([key, value]) =>
                typeof value !== 'function' && typeof value !== 'object'
              ).
              map(([key, value]) =>
              <Card key={key} className="p-4 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {key.
                  replace(/([A-Z])/g, ' $1').
                  replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {typeof value === 'number' &&
                  key.toLowerCase().includes('amount') ||
                  key.toLowerCase().includes('fee') ||
                  key.toLowerCase().includes('cash') ||
                  key.toLowerCase().includes('cheque') ||
                  key.toLowerCase().includes('online') ||
                  key.toLowerCase().includes('collected') ||
                  key.toLowerCase().includes('pending') ||
                  key.toLowerCase().includes('due') ?
                  `₹${(value as number).toLocaleString()}` :
                  String(value)}
                      </p>
                    </Card>
              )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Empty State */}
      {monthlyData.length === 0 && !loading &&
      <Card className="p-12 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Report Data
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Select an academic year and click "Refresh Data" to load fee
            collection reports.
          </p>
          <Button variant="primary" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Load Report Data
          </Button>
        </Card>
      }

      {/* Loading State */}
      {loading &&
      <Card className="p-12 text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Report Data...
          </h3>
          <p className="text-gray-500">
            Please wait while we fetch the fee collection data.
          </p>
        </Card>
      }
    </div>);

}

// ============================================
// Combined Fee Reports page - merges every Report Criteria screen
// into a single tabbed page.
// ============================================
export function FeeReportsPage() {
  const [activeReport, setActiveReport] = useState('collection');
  const reports = [
  { id: 'collection', label: 'Fee Collection Reports' },
  { id: 'defaulter', label: 'Fee Defaulter List' },
  { id: 'discount', label: 'Fee Discount & Exemption' },
  { id: 'headwise', label: 'Fee Headwise Summary' }];

  return (
    <div className="space-y-4">
      <Card className="p-2">
        <div className="flex flex-wrap gap-2">
          {reports.map((r) =>
          <Button
            key={r.id}
            variant={activeReport === r.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveReport(r.id)}>

              {r.label}
            </Button>
          )}
        </div>
      </Card>
      {activeReport === 'collection' && <FeeCollectionReports />}
      {activeReport === 'defaulter' && <FeeDefaulterList />}
      {activeReport === 'discount' && <FeeDiscountExemptionReport />}
      {activeReport === 'headwise' && <FeeComplianceReporting />}
    </div>);

}
