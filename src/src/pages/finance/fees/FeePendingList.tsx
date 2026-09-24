import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Filter,
  Bell,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  AlertTriangle,
  AlertCircle,
  Send,
  MessageSquare,
  Eye,
  Printer,
  History,
  TrendingUp,
  Users,
  Receipt,
  Banknote,
  Hash,
  Building,
  GraduationCap,
  CheckCircle,
  XCircle } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface FeeHead {
  name: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
}
interface PaymentHistory {
  receiptNo: string;
  date: string;
  amount: number;
  mode: string;
  installment: string;
}
interface PendingFeeData {
  id: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  grNo: string;
  class: string;
  section: string;
  rollNo: string;
  category: string;
  admissionDate: string;
  parentContact: string;
  parentEmail: string;
  address: string;
  installment: string;
  feeStructure: string;
  feeHeads: FeeHead[];
  totalFee: number;
  totalPaid: number;
  totalPending: number;
  totalDiscount: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  dueDate: string;
  daysOverdue: number;
  remindersSent: number;
  lastReminderDate: string;
  paymentHistory: PaymentHistory[];
  status: 'Overdue' | 'Due Soon' | 'Partially Paid' | 'Unpaid';
  priority: 'High' | 'Medium' | 'Low';
  remarks: string;
}
export function FeePendingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PendingFeeData | null>(
    null
  );
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderType, setReminderType] = useState<'sms' | 'email' | 'both'>(
    'sms'
  );
  // Filter states
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterInstallment, setFilterInstallment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterOverdueDays, setFilterOverdueDays] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  // Mock Pending Fee Data
  const pendingData: PendingFeeData[] = [
  {
    id: '1',
    studentName: 'Vikram Singh',
    fatherName: 'Harpreet Singh',
    motherName: 'Gurpreet Kaur',
    grNo: 'GR005',
    class: '8',
    section: 'C',
    rollNo: '18',
    category: 'General',
    admissionDate: '2021-04-01',
    parentContact: '9876543210',
    parentEmail: 'harpreet.singh@email.com',
    address: '456, Sector 15, Chandigarh - 160015',
    installment: 'Term 2 (Aug-Nov)',
    feeStructure: 'Regular',
    feeHeads: [
    {
      name: 'Tuition Fee',
      totalAmount: 15000,
      paidAmount: 5000,
      pendingAmount: 10000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Development Fee',
      totalAmount: 3000,
      paidAmount: 1000,
      pendingAmount: 2000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Computer Fee',
      totalAmount: 2000,
      paidAmount: 1000,
      pendingAmount: 1000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Library Fee',
      totalAmount: 1500,
      paidAmount: 500,
      pendingAmount: 1000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Laboratory Fee',
      totalAmount: 2000,
      paidAmount: 500,
      pendingAmount: 1500,
      dueDate: '2024-02-15'
    },
    {
      name: 'Sports Fee',
      totalAmount: 1000,
      paidAmount: 500,
      pendingAmount: 500,
      dueDate: '2024-02-15'
    },
    {
      name: 'Transport Fee',
      totalAmount: 10500,
      paidAmount: 1500,
      pendingAmount: 9000,
      dueDate: '2024-02-15'
    }],

    totalFee: 35000,
    totalPaid: 10000,
    totalPending: 25000,
    totalDiscount: 0,
    lastPaymentDate: '2024-01-15',
    lastPaymentAmount: 10000,
    dueDate: '2024-02-15',
    daysOverdue: 45,
    remindersSent: 3,
    lastReminderDate: '2024-03-20',
    paymentHistory: [
    {
      receiptNo: 'RCP-2024-015',
      date: '2024-01-15',
      amount: 10000,
      mode: 'Cash',
      installment: 'Term 2'
    },
    {
      receiptNo: 'RCP-2023-089',
      date: '2023-08-10',
      amount: 35000,
      mode: 'Online',
      installment: 'Term 1'
    }],

    status: 'Overdue',
    priority: 'High',
    remarks: 'Parent requested extension due to financial difficulties'
  },
  {
    id: '2',
    studentName: 'Ananya Gupta',
    fatherName: 'Rajiv Gupta',
    motherName: 'Sunita Gupta',
    grNo: 'GR012',
    class: '7',
    section: 'B',
    rollNo: '08',
    category: 'General',
    admissionDate: '2022-04-01',
    parentContact: '9876543211',
    parentEmail: 'rajiv.gupta@email.com',
    address: '789, Model Town, Delhi - 110009',
    installment: 'Term 2 (Aug-Nov)',
    feeStructure: 'Regular',
    feeHeads: [
    {
      name: 'Tuition Fee',
      totalAmount: 12000,
      paidAmount: 0,
      pendingAmount: 12000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Development Fee',
      totalAmount: 2500,
      paidAmount: 0,
      pendingAmount: 2500,
      dueDate: '2024-02-15'
    },
    {
      name: 'Computer Fee',
      totalAmount: 1500,
      paidAmount: 0,
      pendingAmount: 1500,
      dueDate: '2024-02-15'
    },
    {
      name: 'Library Fee',
      totalAmount: 1000,
      paidAmount: 0,
      pendingAmount: 1000,
      dueDate: '2024-02-15'
    },
    {
      name: 'Laboratory Fee',
      totalAmount: 1500,
      paidAmount: 0,
      pendingAmount: 1500,
      dueDate: '2024-02-15'
    },
    {
      name: 'Sports Fee',
      totalAmount: 800,
      paidAmount: 0,
      pendingAmount: 800,
      dueDate: '2024-02-15'
    }],

    totalFee: 19300,
    totalPaid: 0,
    totalPending: 19300,
    totalDiscount: 0,
    lastPaymentDate: '2023-08-05',
    lastPaymentAmount: 19300,
    dueDate: '2024-02-15',
    daysOverdue: 45,
    remindersSent: 5,
    lastReminderDate: '2024-03-25',
    paymentHistory: [
    {
      receiptNo: 'RCP-2023-056',
      date: '2023-08-05',
      amount: 19300,
      mode: 'Cheque',
      installment: 'Term 1'
    }],

    status: 'Unpaid',
    priority: 'High',
    remarks: 'No response to reminders. Need to escalate.'
  },
  // ... (other students - truncated for brevity)
  {
    id: '3',
    studentName: 'Arjun Patel',
    fatherName: 'Mehul Patel',
    motherName: 'Priya Patel',
    grNo: 'GR008',
    class: '10',
    section: 'A',
    rollNo: '22',
    category: 'OBC',
    admissionDate: '2019-04-01',
    parentContact: '9876543212',
    parentEmail: 'mehul.patel@email.com',
    address: '123, Satellite Area, Ahmedabad - 380015',
    installment: 'Term 2 (Aug-Nov)',
    feeStructure: 'Regular',
    feeHeads: [
    {
      name: 'Tuition Fee',
      totalAmount: 15000,
      paidAmount: 10000,
      pendingAmount: 5000,
      dueDate: '2024-03-15'
    },
    {
      name: 'Development Fee',
      totalAmount: 3000,
      paidAmount: 2000,
      pendingAmount: 1000,
      dueDate: '2024-03-15'
    },
    {
      name: 'Computer Fee',
      totalAmount: 2000,
      paidAmount: 1500,
      pendingAmount: 500,
      dueDate: '2024-03-15'
    },
    {
      name: 'Laboratory Fee',
      totalAmount: 2000,
      paidAmount: 1500,
      pendingAmount: 500,
      dueDate: '2024-03-15'
    }],

    totalFee: 22000,
    totalPaid: 15000,
    totalPending: 7000,
    totalDiscount: 1000,
    lastPaymentDate: '2024-02-20',
    lastPaymentAmount: 15000,
    dueDate: '2024-03-15',
    daysOverdue: 15,
    remindersSent: 1,
    lastReminderDate: '2024-03-18',
    paymentHistory: [
    {
      receiptNo: 'RCP-2024-045',
      date: '2024-02-20',
      amount: 15000,
      mode: 'Online',
      installment: 'Term 2'
    },
    {
      receiptNo: 'RCP-2023-112',
      date: '2023-08-15',
      amount: 21000,
      mode: 'UPI',
      installment: 'Term 1'
    }],

    status: 'Partially Paid',
    priority: 'Medium',
    remarks: 'Promised to pay by month end'
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    fatherName: 'Krishna Reddy',
    motherName: 'Lakshmi Reddy',
    grNo: 'GR015',
    class: '9',
    section: 'A',
    rollNo: '12',
    category: 'General',
    admissionDate: '2020-04-01',
    parentContact: '9876543213',
    parentEmail: 'krishna.reddy@email.com',
    address: '567, Banjara Hills, Hyderabad - 500034',
    installment: 'Term 3 (Dec-Mar)',
    feeStructure: 'Regular',
    feeHeads: [
    {
      name: 'Tuition Fee',
      totalAmount: 15000,
      paidAmount: 0,
      pendingAmount: 15000,
      dueDate: '2024-04-10'
    },
    {
      name: 'Development Fee',
      totalAmount: 3000,
      paidAmount: 0,
      pendingAmount: 3000,
      dueDate: '2024-04-10'
    },
    {
      name: 'Computer Fee',
      totalAmount: 2000,
      paidAmount: 0,
      pendingAmount: 2000,
      dueDate: '2024-04-10'
    },
    {
      name: 'Library Fee',
      totalAmount: 1500,
      paidAmount: 0,
      pendingAmount: 1500,
      dueDate: '2024-04-10'
    },
    {
      name: 'Laboratory Fee',
      totalAmount: 2000,
      paidAmount: 0,
      pendingAmount: 2000,
      dueDate: '2024-04-10'
    },
    {
      name: 'Sports Fee',
      totalAmount: 1000,
      paidAmount: 0,
      pendingAmount: 1000,
      dueDate: '2024-04-10'
    }],

    totalFee: 24500,
    totalPaid: 0,
    totalPending: 24500,
    totalDiscount: 0,
    lastPaymentDate: '2023-12-10',
    lastPaymentAmount: 24500,
    dueDate: '2024-04-10',
    daysOverdue: 0,
    remindersSent: 0,
    lastReminderDate: '',
    paymentHistory: [
    {
      receiptNo: 'RCP-2023-198',
      date: '2023-12-10',
      amount: 24500,
      mode: 'Card',
      installment: 'Term 2'
    },
    {
      receiptNo: 'RCP-2023-089',
      date: '2023-08-05',
      amount: 24500,
      mode: 'Online',
      installment: 'Term 1'
    }],

    status: 'Due Soon',
    priority: 'Low',
    remarks: ''
  }
  // ... add remaining students if needed
  ];
  // Filter students
  const filteredStudents = pendingData.filter((student) => {
    const matchesSearch =
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentContact.includes(searchTerm);
    const matchesClass = filterClass ? student.class === filterClass : true;
    const matchesSection = filterSection ?
    student.section === filterSection :
    true;
    const matchesInstallment = filterInstallment ?
    student.installment.
    toLowerCase().
    includes(filterInstallment.toLowerCase()) :
    true;
    const matchesStatus = filterStatus ? student.status === filterStatus : true;
    const matchesPriority = filterPriority ?
    student.priority === filterPriority :
    true;
    const matchesOverdue = filterOverdueDays ?
    student.daysOverdue >= parseInt(filterOverdueDays) :
    true;
    const matchesMinAmount = filterMinAmount ?
    student.totalPending >= parseInt(filterMinAmount) :
    true;
    const matchesMaxAmount = filterMaxAmount ?
    student.totalPending <= parseInt(filterMaxAmount) :
    true;
    return (
      matchesSearch &&
      matchesClass &&
      matchesSection &&
      matchesInstallment &&
      matchesStatus &&
      matchesPriority &&
      matchesOverdue &&
      matchesMinAmount &&
      matchesMaxAmount);

  });
  // Handlers
  const handleViewStudent = (student: PendingFeeData) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };
  const handleSendReminder = (student: PendingFeeData) => {
    setSelectedStudent(student);
    setSelectedStudents([student.id]);
    setReminderMessage(getDefaultReminderMessage(student));
    setShowReminderModal(true);
  };
  const handleBulkReminder = () => {
    if (selectedStudents.length === 0) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
    setReminderMessage(getDefaultBulkReminderMessage());
    setShowReminderModal(true);
  };
  const toggleStudentSelection = (id: string) => {
    setSelectedStudents((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };
  const getDefaultReminderMessage = (student: PendingFeeData) => {
    return `Dear ${student.fatherName},\n\nThis is a reminder regarding the pending fee of ₹${student.totalPending.toLocaleString()} for your ward ${student.studentName} (Class ${student.class}-${student.section}, GR No: ${student.grNo}).\n\nThe fee was due on ${student.dueDate}. Please arrange for the payment at the earliest.\n\nRegards,\nABC International School`;
  };
  const getDefaultBulkReminderMessage = () => {
    return `Dear Parent,\n\nThis is a reminder regarding the pending fee for your ward. Please clear the outstanding dues at the earliest to avoid any inconvenience.\n\nFor any queries, please contact the accounts department.\n\nRegards,\nABC International School`;
  };
  const getStatusVariant = (
  status: string)
  : 'danger' | 'warning' | 'info' | 'secondary' => {
    switch (status) {
      case 'Overdue':
        return 'danger';
      case 'Unpaid':
        return 'danger';
      case 'Partially Paid':
        return 'warning';
      case 'Due Soon':
        return 'info';
      default:
        return 'secondary';
    }
  };
  const getPriorityVariant = (
  priority: string)
  : 'danger' | 'warning' | 'success' => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'warning';
    }
  };
  const resetFilters = () => {
    setFilterClass('');
    setFilterSection('');
    setFilterInstallment('');
    setFilterStatus('');
    setFilterPriority('');
    setFilterOverdueDays('');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setSearchTerm('');
  };
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={
      selectedStudents.length === filteredStudents.length &&
      filteredStudents.length > 0
      }
      onChange={selectAllStudents}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />,


    render: (row: PendingFeeData) =>
    <input
      type="checkbox"
      checked={selectedStudents.includes(row.id)}
      onChange={() => toggleStudentSelection(row.id)}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />


  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: PendingFeeData) =>
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
    key: 'contact',
    header: 'Parent Contact',
    render: (row: PendingFeeData) =>
    <div>
          <div className="text-sm text-gray-900">{row.fatherName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3" />
            {row.parentContact}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[150px]">
            <Mail className="w-3 h-3" />
            {row.parentEmail}
          </div>
        </div>

  },
  {
    key: 'installment',
    header: 'Installment',
    render: (row: PendingFeeData) =>
    <div>
          <div className="text-sm font-medium text-gray-700">
            {row.installment}
          </div>
          <div className="text-xs text-gray-500">{row.feeStructure}</div>
          <div className="text-xs text-gray-500 mt-1">
            {row.feeHeads.length} fee heads
          </div>
        </div>

  },
  {
    key: 'pending',
    header: 'Pending Amount',
    render: (row: PendingFeeData) =>
    <div>
          <div className="font-bold text-red-600 text-lg">
            ₹{row.totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            Due: {row.dueDate}
          </div>
          {row.daysOverdue > 0 &&
      <div className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {row.daysOverdue} days overdue
            </div>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: PendingFeeData) =>
    <div className="space-y-1">
          <Badge variant={getStatusVariant(row.status)}>
            {row.status === 'Overdue' &&
        <AlertTriangle className="w-3 h-3 mr-1" />
        }
            {row.status === 'Unpaid' && <XCircle className="w-3 h-3 mr-1" />}
            {row.status === 'Partially Paid' &&
        <Clock className="w-3 h-3 mr-1" />
        }
            {row.status === 'Due Soon' &&
        <AlertCircle className="w-3 h-3 mr-1" />
        }
            {row.status}
          </Badge>
          <Badge variant={getPriorityVariant(row.priority)} className="block">
            {row.priority} Priority
          </Badge>
          {row.remindersSent > 0 &&
      <div className="text-xs text-gray-500">
              {row.remindersSent} reminders sent
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: PendingFeeData) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewStudent(row)}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSendReminder(row)}>

            <Bell className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Pending List</h1>
          <p className="text-sm text-gray-500">
            Track and manage unpaid and partially paid student fees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button
            variant="primary"
            onClick={handleBulkReminder}
            disabled={selectedStudents.length === 0}>

            <Bell className="w-4 h-4 mr-2" />
            Send Reminders ({selectedStudents.length})
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Info Banner */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">
              Pending Fee Management
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              This list shows all students with pending fee payments. You can
              send individual or bulk reminders, view detailed fee breakdowns,
              and track payment status.
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Student Name, GR No, Parent Name, Contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>
          <Select
            options={[
            {
              value: '2024-2025',
              label: '2024-2025'
            },
            {
              value: '2023-2024',
              label: '2023-2024'
            }]
            }
            placeholder="Academic Year" />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}>

            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
            {showFilters ?
            <ChevronUp className="w-4 h-4 ml-2" /> :

            <ChevronDown className="w-4 h-4 ml-2" />
            }
          </Button>
        </div>

        {/* Extended Filters */}
        {showFilters &&
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
            <Select
            label="Class"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
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
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
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
            }]
            } />

            <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
            {
              value: '',
              label: 'All Status'
            },
            {
              value: 'Overdue',
              label: 'Overdue'
            },
            {
              value: 'Unpaid',
              label: 'Unpaid'
            },
            {
              value: 'Partially Paid',
              label: 'Partially Paid'
            },
            {
              value: 'Due Soon',
              label: 'Due Soon'
            }]
            } />

            <Select
            label="Priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
            {
              value: '',
              label: 'All Priorities'
            },
            {
              value: 'High',
              label: 'High Priority'
            },
            {
              value: 'Medium',
              label: 'Medium Priority'
            },
            {
              value: 'Low',
              label: 'Low Priority'
            }]
            } />

            <Input
            label="Min Amount"
            type="number"
            placeholder="₹0"
            value={filterMinAmount}
            onChange={(e) => setFilterMinAmount(e.target.value)} />

            <div className="flex items-end gap-2">
              <Button variant="primary" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Apply
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        }

        {/* Selected Count */}
        {selectedStudents.length > 0 &&
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {selectedStudents.length} students selected
              </span>
            </div>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStudents([])}>

              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        }

        <Table columns={columns} data={filteredStudents} />
      </Card>

      {/* View Student Modal (Centered) */}
      {showViewModal && selectedStudent &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.studentName} - Fee Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    GR No: {selectedStudent.grNo}
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowViewModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Status & Amount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-red-50 border-red-200 text-center">
                  <p className="text-sm text-red-700">Total Pending</p>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{selectedStudent.totalPending.toLocaleString()}
                  </p>
                </Card>
                <Card className="p-4 bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedStudent.dueDate}
                  </p>
                </Card>
                <Card className="p-4 bg-amber-50 text-center">
                  <p className="text-sm text-amber-700">Overdue Days</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {selectedStudent.daysOverdue}
                  </p>
                </Card>
              </div>

              {/* Fee Breakdown */}
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Fee Head Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Fee Head</th>
                        <th className="text-right py-2">Total</th>
                        <th className="text-right py-2">Paid</th>
                        <th className="text-right py-2">Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.feeHeads.map((head, i) =>
                    <tr key={i} className="border-b">
                          <td className="py-3">{head.name}</td>
                          <td className="text-right">
                            ₹{head.totalAmount.toLocaleString()}
                          </td>
                          <td className="text-right text-green-600">
                            ₹{head.paidAmount.toLocaleString()}
                          </td>
                          <td className="text-right text-red-600 font-medium">
                            ₹{head.pendingAmount.toLocaleString()}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Statement
                </Button>
                <Button
                variant="primary"
                onClick={() => handleSendReminder(selectedStudent)}>

                  <Bell className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Reminder Modal (Centered) */}
      {showReminderModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Send Payment Reminder</h3>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReminderModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reminder Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                      type="radio"
                      name="type"
                      value="sms"
                      checked={reminderType === 'sms'}
                      onChange={() => setReminderType('sms')}
                      className="text-blue-600" />

                      <MessageSquare className="w-4 h-4" /> SMS
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                      type="radio"
                      name="type"
                      value="email"
                      checked={reminderType === 'email'}
                      onChange={() => setReminderType('email')}
                      className="text-blue-600" />

                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                      type="radio"
                      name="type"
                      value="both"
                      checked={reminderType === 'both'}
                      onChange={() => setReminderType('both')}
                      className="text-blue-600" />

                      <Send className="w-4 h-4" /> Both
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />

                </div>

                <div className="flex justify-end gap-3">
                  <Button
                  variant="outline"
                  onClick={() => setShowReminderModal(false)}>

                    Cancel
                  </Button>
                  <Button variant="primary">
                    <Send className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
    </div>);

}