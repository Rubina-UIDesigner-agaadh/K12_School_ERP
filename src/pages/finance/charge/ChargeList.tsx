import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Download,
  Plus,
  Send,
  Calendar,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  FileText,
  Printer,
  RefreshCw,
  MoreVertical,
  Phone,
  Receipt,
  TrendingUp,
  Users,
  CreditCard,
  FileSpreadsheet,
  ChevronDown,
  History,
  Bell,
  DollarSign,
  AlertCircle,
  ArrowUpDown,
  SlidersHorizontal } from
'lucide-react';

interface Charge {
  id: string;
  studentId: string;
  studentName: string;
  admNo: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  chargeName: string;
  chargeDescription: string;
  type: 'Fine' | 'Event' | 'Exam' | 'Material' | 'Transport' | 'Activity' | 'Other';
  category: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  createdDate: string;
  lastPaymentDate: string | null;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue' | 'Waived';
  priority: 'High' | 'Medium' | 'Low';
  remindersSent: number;
  lastReminderDate: string | null;
  notes: string;
  createdBy: string;
  paymentHistory: {
    date: string;
    amount: number;
    method: string;
    receiptNo: string;
  }[];
}

export function ChargeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter States
  const [filters, setFilters] = useState({
    class: 'all',
    section: 'all',
    status: 'all',
    type: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    daysOverdue: 'all',
    reminderStatus: 'all'
  });

  // Comprehensive Mock Data
  const CHARGES_DATA: Charge[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    admNo: 'ADM-2024-001',
    class: '10',
    section: 'A',
    rollNumber: '15',
    parentName: 'Suresh Sharma',
    parentPhone: '9876543210',
    parentEmail: 'suresh.sharma@email.com',
    chargeName: 'Lab Damage Fine',
    chargeDescription: 'Chemistry lab equipment damage - Test tube rack',
    type: 'Fine',
    category: 'Disciplinary',
    amount: 500,
    paidAmount: 0,
    dueAmount: 500,
    dueDate: '2024-03-20',
    createdDate: '2024-03-10',
    lastPaymentDate: null,
    status: 'Overdue',
    priority: 'High',
    remindersSent: 2,
    lastReminderDate: '2024-03-18',
    notes: 'Student broke test tube rack during practicals',
    createdBy: 'Lab Incharge',
    paymentHistory: []
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    admNo: 'ADM-2024-002',
    class: '9',
    section: 'B',
    rollNumber: '08',
    parentName: 'Raj Patel',
    parentPhone: '9876543211',
    parentEmail: 'raj.patel@email.com',
    chargeName: 'Library Book Lost',
    chargeDescription: 'Lost library book - Advanced Mathematics',
    type: 'Fine',
    category: 'Library',
    amount: 350,
    paidAmount: 350,
    dueAmount: 0,
    dueDate: '2024-03-18',
    createdDate: '2024-03-05',
    lastPaymentDate: '2024-03-15',
    status: 'Paid',
    priority: 'Medium',
    remindersSent: 1,
    lastReminderDate: '2024-03-12',
    notes: 'Book: Advanced Mathematics by R.D. Sharma',
    createdBy: 'Librarian',
    paymentHistory: [
    {
      date: '2024-03-15',
      amount: 350,
      method: 'Cash',
      receiptNo: 'RCP-2024-0125'
    }]

  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Amit Kumar',
    admNo: 'ADM-2024-005',
    class: '10',
    section: 'A',
    rollNumber: '12',
    parentName: 'Vijay Kumar',
    parentPhone: '9876543212',
    parentEmail: 'vijay.kumar@email.com',
    chargeName: 'Annual Picnic Contribution',
    chargeDescription: 'School annual picnic to Imagica Theme Park',
    type: 'Event',
    category: 'Co-curricular',
    amount: 1500,
    paidAmount: 500,
    dueAmount: 1000,
    dueDate: '2024-04-01',
    createdDate: '2024-03-01',
    lastPaymentDate: '2024-03-10',
    status: 'Partial',
    priority: 'Medium',
    remindersSent: 1,
    lastReminderDate: '2024-03-25',
    notes: 'Includes transport, entry, and lunch',
    createdBy: 'Class Teacher',
    paymentHistory: [
    {
      date: '2024-03-10',
      amount: 500,
      method: 'Online',
      receiptNo: 'RCP-2024-0098'
    }]

  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'Sneha Gupta',
    admNo: 'ADM-2024-008',
    class: '8',
    section: 'C',
    rollNumber: '22',
    parentName: 'Rakesh Gupta',
    parentPhone: '9876543213',
    parentEmail: 'rakesh.gupta@email.com',
    chargeName: 'Science Olympiad Exam Fee',
    chargeDescription: 'National Science Olympiad 2024 Registration',
    type: 'Exam',
    category: 'Competition',
    amount: 250,
    paidAmount: 0,
    dueAmount: 250,
    dueDate: '2024-03-25',
    createdDate: '2024-03-15',
    lastPaymentDate: null,
    status: 'Unpaid',
    priority: 'High',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'Last date to register is March 25',
    createdBy: 'Science Dept',
    paymentHistory: []
  },
  {
    id: '5',
    studentId: 'STU005',
    studentName: 'Vikram Singh',
    admNo: 'ADM-2024-012',
    class: '10',
    section: 'B',
    rollNumber: '30',
    parentName: 'Mahendra Singh',
    parentPhone: '9876543214',
    parentEmail: 'mahendra.singh@email.com',
    chargeName: 'Uniform Replacement',
    chargeDescription: 'Winter uniform blazer replacement',
    type: 'Material',
    category: 'Uniform',
    amount: 1200,
    paidAmount: 0,
    dueAmount: 1200,
    dueDate: '2024-03-15',
    createdDate: '2024-03-01',
    lastPaymentDate: null,
    status: 'Overdue',
    priority: 'High',
    remindersSent: 3,
    lastReminderDate: '2024-03-20',
    notes: 'Size: 38, Color: Navy Blue',
    createdBy: 'Store Incharge',
    paymentHistory: []
  },
  {
    id: '6',
    studentId: 'STU006',
    studentName: 'Ananya Iyer',
    admNo: 'ADM-2024-015',
    class: '9',
    section: 'A',
    rollNumber: '05',
    parentName: 'Subramaniam Iyer',
    parentPhone: '9876543215',
    parentEmail: 'subramaniam.iyer@email.com',
    chargeName: 'Art Supplies',
    chargeDescription: 'Canvas, paints, and brushes for art project',
    type: 'Material',
    category: 'Academic',
    amount: 800,
    paidAmount: 800,
    dueAmount: 0,
    dueDate: '2024-03-20',
    createdDate: '2024-03-08',
    lastPaymentDate: '2024-03-18',
    status: 'Paid',
    priority: 'Low',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'For annual art exhibition project',
    createdBy: 'Art Teacher',
    paymentHistory: [
    {
      date: '2024-03-18',
      amount: 800,
      method: 'Card',
      receiptNo: 'RCP-2024-0156'
    }]

  },
  {
    id: '7',
    studentId: 'STU007',
    studentName: 'Rohan Mehta',
    admNo: 'ADM-2024-018',
    class: '11',
    section: 'A',
    rollNumber: '11',
    parentName: 'Kiran Mehta',
    parentPhone: '9876543216',
    parentEmail: 'kiran.mehta@email.com',
    chargeName: 'Sports Day Participation',
    chargeDescription: 'Annual sports day registration and kit',
    type: 'Activity',
    category: 'Sports',
    amount: 600,
    paidAmount: 0,
    dueAmount: 600,
    dueDate: '2024-04-05',
    createdDate: '2024-03-20',
    lastPaymentDate: null,
    status: 'Unpaid',
    priority: 'Medium',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'Includes sports kit and refreshments',
    createdBy: 'Sports Dept',
    paymentHistory: []
  },
  {
    id: '8',
    studentId: 'STU008',
    studentName: 'Kavya Reddy',
    admNo: 'ADM-2024-022',
    class: '8',
    section: 'A',
    rollNumber: '18',
    parentName: 'Venkat Reddy',
    parentPhone: '9876543217',
    parentEmail: 'venkat.reddy@email.com',
    chargeName: 'Late Fine',
    chargeDescription: 'Late submission of project work',
    type: 'Fine',
    category: 'Disciplinary',
    amount: 100,
    paidAmount: 0,
    dueAmount: 100,
    dueDate: '2024-03-22',
    createdDate: '2024-03-18',
    lastPaymentDate: null,
    status: 'Unpaid',
    priority: 'Low',
    remindersSent: 1,
    lastReminderDate: '2024-03-21',
    notes: 'History project submitted 3 days late',
    createdBy: 'Class Teacher',
    paymentHistory: []
  },
  {
    id: '9',
    studentId: 'STU009',
    studentName: 'Ishaan Joshi',
    admNo: 'ADM-2024-025',
    class: '7',
    section: 'B',
    rollNumber: '25',
    parentName: 'Prakash Joshi',
    parentPhone: '9876543218',
    parentEmail: 'prakash.joshi@email.com',
    chargeName: 'School Bus Damage',
    chargeDescription: 'Seat cover damage in school bus',
    type: 'Fine',
    category: 'Transport',
    amount: 750,
    paidAmount: 750,
    dueAmount: 0,
    dueDate: '2024-03-10',
    createdDate: '2024-03-01',
    lastPaymentDate: '2024-03-08',
    status: 'Paid',
    priority: 'Medium',
    remindersSent: 1,
    lastReminderDate: '2024-03-05',
    notes: 'Bus No. 12, Seat No. 15',
    createdBy: 'Transport Dept',
    paymentHistory: [
    {
      date: '2024-03-08',
      amount: 750,
      method: 'Cash',
      receiptNo: 'RCP-2024-0089'
    }]

  },
  {
    id: '10',
    studentId: 'STU010',
    studentName: 'Diya Sharma',
    admNo: 'ADM-2024-028',
    class: '10',
    section: 'C',
    rollNumber: '08',
    parentName: 'Anil Sharma',
    parentPhone: '9876543219',
    parentEmail: 'anil.sharma@email.com',
    chargeName: 'Music Concert Fee',
    chargeDescription: 'Annual music concert participation and costume',
    type: 'Activity',
    category: 'Cultural',
    amount: 1000,
    paidAmount: 500,
    dueAmount: 500,
    dueDate: '2024-04-10',
    createdDate: '2024-03-15',
    lastPaymentDate: '2024-03-20',
    status: 'Partial',
    priority: 'Medium',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'Includes costume rental and makeup',
    createdBy: 'Music Dept',
    paymentHistory: [
    {
      date: '2024-03-20',
      amount: 500,
      method: 'Online',
      receiptNo: 'RCP-2024-0178'
    }]

  },
  {
    id: '11',
    studentId: 'STU011',
    studentName: 'Arjun Nair',
    admNo: 'ADM-2024-032',
    class: '12',
    section: 'A',
    rollNumber: '02',
    parentName: 'Krishnan Nair',
    parentPhone: '9876543220',
    parentEmail: 'krishnan.nair@email.com',
    chargeName: 'Board Exam Additional Copy Fee',
    chargeDescription: 'Additional answer booklet charges for board exam',
    type: 'Exam',
    category: 'Academic',
    amount: 200,
    paidAmount: 0,
    dueAmount: 200,
    dueDate: '2024-03-28',
    createdDate: '2024-03-22',
    lastPaymentDate: null,
    status: 'Unpaid',
    priority: 'High',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'Used 3 additional copies in Physics exam',
    createdBy: 'Exam Cell',
    paymentHistory: []
  },
  {
    id: '12',
    studentId: 'STU012',
    studentName: 'Meera Kapoor',
    admNo: 'ADM-2024-035',
    class: '6',
    section: 'A',
    rollNumber: '14',
    parentName: 'Rohit Kapoor',
    parentPhone: '9876543221',
    parentEmail: 'rohit.kapoor@email.com',
    chargeName: 'ID Card Replacement',
    chargeDescription: 'Lost ID card replacement charge',
    type: 'Other',
    category: 'Administrative',
    amount: 150,
    paidAmount: 0,
    dueAmount: 150,
    dueDate: '2024-03-30',
    createdDate: '2024-03-25',
    lastPaymentDate: null,
    status: 'Unpaid',
    priority: 'Low',
    remindersSent: 0,
    lastReminderDate: null,
    notes: 'Second time ID card lost this year',
    createdBy: 'Admin Office',
    paymentHistory: []
  }];


  // Calculate statistics
  const stats = useMemo(() => {
    const totalCharges = CHARGES_DATA.length;
    const totalAmount = CHARGES_DATA.reduce((sum, c) => sum + c.amount, 0);
    const totalCollected = CHARGES_DATA.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalPending = CHARGES_DATA.reduce((sum, c) => sum + c.dueAmount, 0);
    const paidCount = CHARGES_DATA.filter((c) => c.status === 'Paid').length;
    const unpaidCount = CHARGES_DATA.filter((c) => c.status === 'Unpaid').length;
    const partialCount = CHARGES_DATA.filter((c) => c.status === 'Partial').length;
    const overdueCount = CHARGES_DATA.filter((c) => c.status === 'Overdue').length;
    const highPriorityCount = CHARGES_DATA.filter((c) => c.priority === 'High' && c.status !== 'Paid').length;

    return {
      totalCharges,
      totalAmount,
      totalCollected,
      totalPending,
      paidCount,
      unpaidCount,
      partialCount,
      overdueCount,
      highPriorityCount,
      collectionRate: (totalCollected / totalAmount * 100).toFixed(1)
    };
  }, []);

  // Filter Logic
  const filteredData = useMemo(() => {
    return CHARGES_DATA.filter((item) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
      item.studentName.toLowerCase().includes(searchLower) ||
      item.admNo.toLowerCase().includes(searchLower) ||
      item.chargeName.toLowerCase().includes(searchLower) ||
      item.parentName.toLowerCase().includes(searchLower) ||
      item.parentPhone.includes(searchTerm) ||
      item.studentId.toLowerCase().includes(searchLower);

      // Class filter
      const matchesClass = filters.class === 'all' || item.class === filters.class;

      // Section filter
      const matchesSection = filters.section === 'all' || item.section === filters.section;

      // Status filter
      const matchesStatus = filters.status === 'all' || item.status === filters.status;

      // Type filter
      const matchesType = filters.type === 'all' || item.type === filters.type;

      // Priority filter
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateFrom) {
        matchesDateRange = matchesDateRange && item.dueDate >= filters.dateFrom;
      }
      if (filters.dateTo) {
        matchesDateRange = matchesDateRange && item.dueDate <= filters.dateTo;
      }

      // Amount range filter
      let matchesAmountRange = true;
      if (filters.amountMin) {
        matchesAmountRange = matchesAmountRange && item.amount >= parseFloat(filters.amountMin);
      }
      if (filters.amountMax) {
        matchesAmountRange = matchesAmountRange && item.amount <= parseFloat(filters.amountMax);
      }

      // Days overdue filter
      let matchesDaysOverdue = true;
      if (filters.daysOverdue !== 'all') {
        const today = new Date();
        const dueDate = new Date(item.dueDate);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (filters.daysOverdue === '7') matchesDaysOverdue = daysOverdue > 0 && daysOverdue <= 7;else
        if (filters.daysOverdue === '15') matchesDaysOverdue = daysOverdue > 7 && daysOverdue <= 15;else
        if (filters.daysOverdue === '30') matchesDaysOverdue = daysOverdue > 15 && daysOverdue <= 30;else
        if (filters.daysOverdue === '30+') matchesDaysOverdue = daysOverdue > 30;
      }

      // Reminder status filter
      let matchesReminderStatus = true;
      if (filters.reminderStatus === 'sent') {
        matchesReminderStatus = item.remindersSent > 0;
      } else if (filters.reminderStatus === 'not_sent') {
        matchesReminderStatus = item.remindersSent === 0;
      }

      return (
        matchesSearch &&
        matchesClass &&
        matchesSection &&
        matchesStatus &&
        matchesType &&
        matchesPriority &&
        matchesDateRange &&
        matchesAmountRange &&
        matchesDaysOverdue &&
        matchesReminderStatus);

    });
  }, [searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'studentName':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'dueAmount':
          comparison = a.dueAmount - b.dueAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortOrder]);

  // Bulk Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
    'Student ID',
    'Admission No',
    'Student Name',
    'Class',
    'Section',
    'Roll No',
    'Parent Name',
    'Parent Phone',
    'Parent Email',
    'Charge Name',
    'Type',
    'Category',
    'Amount',
    'Paid Amount',
    'Due Amount',
    'Due Date',
    'Status',
    'Priority',
    'Created Date',
    'Created By',
    'Notes'];


    const dataToExport =
    selectedIds.length > 0 ?
    sortedData.filter((d) => selectedIds.includes(d.id)) :
    sortedData;

    const csvContent = [
    headers.join(','),
    ...dataToExport.map((d) =>
    [
    d.studentId,
    d.admNo,
    `"${d.studentName}"`,
    d.class,
    d.section,
    d.rollNumber,
    `"${d.parentName}"`,
    d.parentPhone,
    d.parentEmail,
    `"${d.chargeName}"`,
    d.type,
    d.category,
    d.amount,
    d.paidAmount,
    d.dueAmount,
    d.dueDate,
    d.status,
    d.priority,
    d.createdDate,
    `"${d.createdBy}"`,
    `"${d.notes}"`].
    join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student_charges_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    alert('Excel export would be implemented with xlsx library');
  };

  const exportToPDF = () => {
    alert('PDF export would be implemented with jsPDF library');
  };

  const handlePrint = () => {
    window.print();
  };

  // Bulk actions
  const sendBulkSMS = () => {
    const count = selectedIds.length;
    alert(`Sending SMS reminders to ${count} parent(s)`);
  };

  const sendBulkEmail = () => {
    const count = selectedIds.length;
    alert(`Sending email reminders to ${count} parent(s)`);
  };

  const sendBulkWhatsApp = () => {
    const count = selectedIds.length;
    alert(`Sending WhatsApp reminders to ${count} parent(s)`);
  };

  const deleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} charge(s)?`)) {
      alert('Charges deleted successfully');
      setSelectedIds([]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      class: 'all',
      section: 'all',
      status: 'all',
      type: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      daysOverdue: 'all',
      reminderStatus: 'all'
    });
    setSearchTerm('');
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Calculate days overdue
  const getDaysOverdue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Get status badge variant
  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = getDaysOverdue(dueDate) > 0 && status !== 'Paid';

    if (status === 'Paid') return { variant: 'success' as const, icon: <CheckCircle className="w-3 h-3" /> };
    if (status === 'Overdue' || isOverdue) return { variant: 'danger' as const, icon: <AlertTriangle className="w-3 h-3" /> };
    if (status === 'Partial') return { variant: 'warning' as const, icon: <Clock className="w-3 h-3" /> };
    if (status === 'Waived') return { variant: 'info' as const, icon: <CheckCircle className="w-3 h-3" /> };
    return { variant: 'default' as const, icon: <Clock className="w-3 h-3" /> };
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="danger">{priority}</Badge>;
      case 'Medium':
        return <Badge variant="warning">{priority}</Badge>;
      case 'Low':
        return <Badge variant="info">{priority}</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  // View charge details
  const viewChargeDetails = (charge: Charge) => {
    setSelectedCharge(charge);
    setShowDetailModal(true);
  };

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      onChange={handleSelectAll}
      checked={selectedIds.length === sortedData.length && sortedData.length > 0} />,


    render: (row: Charge) =>
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={selectedIds.includes(row.id)}
      onChange={() => handleSelectRow(row.id)} />


  },
  {
    key: 'student',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('studentName')}>

          Student Details
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: Charge) =>
    <div>
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">
            {row.admNo} | Class {row.class}-{row.section}
          </div>
          <div className="text-xs text-gray-400">Roll: {row.rollNumber}</div>
        </div>

  },
  {
    key: 'parent',
    header: 'Parent Info',
    render: (row: Charge) =>
    <div className="text-sm">
          <div className="font-medium text-gray-700">{row.parentName}</div>
          <div className="text-xs text-blue-600">{row.parentPhone}</div>
        </div>

  },
  {
    key: 'charge',
    header: 'Charge Details',
    render: (row: Charge) =>
    <div>
          <div className="text-sm font-medium text-gray-900">{row.chargeName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Badge variant="default" className="text-xs">
              {row.type}
            </Badge>
            <span>• {row.category}</span>
          </div>
        </div>

  },
  {
    key: 'amount',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('amount')}>

          Amount
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: Charge) =>
    <div className="text-sm">
          <div className="font-bold text-gray-900">₹{row.amount.toLocaleString()}</div>
          {row.paidAmount > 0 &&
      <div className="text-xs text-green-600">
              Paid: ₹{row.paidAmount.toLocaleString()}
            </div>
      }
          {row.dueAmount > 0 &&
      <div className="text-xs text-red-600 font-medium">
              Due: ₹{row.dueAmount.toLocaleString()}
            </div>
      }
        </div>

  },
  {
    key: 'dueDate',
    header:
    <button
      className="flex items-center gap-1 hover:text-blue-600"
      onClick={() => handleSort('dueDate')}>

          Due Date
          <ArrowUpDown className="w-3 h-3" />
        </button>,

    render: (row: Charge) => {
      const daysOverdue = getDaysOverdue(row.dueDate);
      return (
        <div className="text-sm">
            <div className="text-gray-600">
              {new Date(row.dueDate).toLocaleDateString('en-IN')}
            </div>
            {daysOverdue > 0 && row.status !== 'Paid' &&
          <div className="text-xs text-red-600 font-medium">
                {daysOverdue} days overdue
              </div>
          }
          </div>);

    }
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Charge) => {
      const { variant, icon } = getStatusBadge(row.status, row.dueDate);
      return (
        <div className="space-y-1">
            <Badge variant={variant} className="flex items-center gap-1 w-fit">
              {icon}
              {row.status}
            </Badge>
            {getPriorityBadge(row.priority)}
          </div>);

    }
  },
  {
    key: 'reminders',
    header: 'Reminders',
    render: (row: Charge) =>
    <div className="text-sm text-center">
          <div
        className={`font-medium ${
        row.remindersSent > 0 ? 'text-blue-600' : 'text-gray-400'}`
        }>

            {row.remindersSent}
          </div>
          <div className="text-xs text-gray-400">sent</div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Charge) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => viewChargeDetails(row)}>

            <Eye className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit Charge">
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Send Reminder">
            <Bell className="w-4 h-4 text-orange-500" />
          </Button>
          <Button variant="ghost" size="sm" title="Collect Payment">
            <CreditCard className="w-4 h-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Delete Charge">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Charge Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, manage, and track all individual charges assigned to students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}>

              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-2">
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToCSV();
                    setShowExportMenu(false);
                  }}>

                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToExcel();
                    setShowExportMenu(false);
                  }}>

                    <FileSpreadsheet className="w-4 h-4" />
                    Export as Excel
                  </button>
                  <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    exportToPDF();
                    setShowExportMenu(false);
                  }}>

                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                </div>
              </div>
            }
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Charge
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Charges</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalCharges}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-purple-900">
                ₹{stats.totalAmount.toLocaleString()}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Collected</p>
              <p className="text-2xl font-bold text-green-900">
                ₹{stats.totalCollected.toLocaleString()}
              </p>
              <p className="text-xs text-green-500">{stats.collectionRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-red-900">
                ₹{stats.totalPending.toLocaleString()}
              </p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-orange-900">{stats.overdueCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">High Priority</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.highPriorityCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="success" className="px-3 py-1.5 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          Paid: {stats.paidCount}
        </Badge>
        <Badge variant="danger" className="px-3 py-1.5 text-sm">
          <X className="w-4 h-4 mr-1" />
          Unpaid: {stats.unpaidCount}
        </Badge>
        <Badge variant="warning" className="px-3 py-1.5 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Partial: {stats.partialCount}
        </Badge>
        <Badge variant="info" className="px-3 py-1.5 text-sm">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Overdue: {stats.overdueCount}
        </Badge>
      </div>

      <Card className="p-0 border-gray-200">
        {/* Search and Quick Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by student name, admission no, charge name, parent name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 border-blue-300' : ''}>

                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced Filters
                {Object.values(filters).filter((f) => f !== 'all' && f !== '').length > 0 &&
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {Object.values(filters).filter((f) => f !== 'all' && f !== '').length}
                  </span>
                }
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section */}
        {showFilters &&
        <div className="p-4 bg-blue-50 border-b border-blue-100 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Select
              label="Class"
              options={[
              { value: 'all', label: 'All Classes' },
              { value: '6', label: 'Class 6' },
              { value: '7', label: 'Class 7' },
              { value: '8', label: 'Class 8' },
              { value: '9', label: 'Class 9' },
              { value: '10', label: 'Class 10' },
              { value: '11', label: 'Class 11' },
              { value: '12', label: 'Class 12' }]
              }
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })} />


              <Select
              label="Section"
              options={[
              { value: 'all', label: 'All Sections' },
              { value: 'A', label: 'Section A' },
              { value: 'B', label: 'Section B' },
              { value: 'C', label: 'Section C' }]
              }
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })} />


              <Select
              label="Payment Status"
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partial', label: 'Partial' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Waived', label: 'Waived' }]
              }
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })} />


              <Select
              label="Charge Type"
              options={[
              { value: 'all', label: 'All Types' },
              { value: 'Fine', label: 'Fine' },
              { value: 'Event', label: 'Event' },
              { value: 'Exam', label: 'Exam' },
              { value: 'Material', label: 'Material' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Activity', label: 'Activity' },
              { value: 'Other', label: 'Other' }]
              }
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })} />


              <Select
              label="Priority"
              options={[
              { value: 'all', label: 'All Priority' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' }]
              }
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })} />


              <Select
              label="Days Overdue"
              options={[
              { value: 'all', label: 'All' },
              { value: '7', label: '1-7 Days' },
              { value: '15', label: '8-15 Days' },
              { value: '30', label: '16-30 Days' },
              { value: '30+', label: '30+ Days' }]
              }
              value={filters.daysOverdue}
              onChange={(e) => setFilters({ ...filters, daysOverdue: e.target.value })} />


              <Input
              label="Due Date From"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />


              <Input
              label="Due Date To"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />


              <Input
              label="Min Amount (₹)"
              type="number"
              placeholder="0"
              value={filters.amountMin}
              onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })} />


              <Input
              label="Max Amount (₹)"
              type="number"
              placeholder="Any"
              value={filters.amountMax}
              onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })} />


              <Select
              label="Reminder Status"
              options={[
              { value: 'all', label: 'All' },
              { value: 'sent', label: 'Reminder Sent' },
              { value: 'not_sent', label: 'No Reminder' }]
              }
              value={filters.reminderStatus}
              onChange={(e) => setFilters({ ...filters, reminderStatus: e.target.value })} />

            </div>
          </div>
        }

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 &&
        <div className="bg-blue-50 p-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 animate-in fade-in slide-in-from-top-2">
            <div className="text-sm text-blue-800 font-medium flex items-center gap-2">
              <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {selectedIds.length}
              </span>
              Charges Selected
              <span className="text-blue-600">
                (Total Due: ₹
                {sortedData.
              filter((d) => selectedIds.includes(d.id)).
              reduce((sum, d) => sum + d.dueAmount, 0).
              toLocaleString()}
                )
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
              size="sm"
              variant="outline"
              className="bg-white hover:bg-green-50 text-green-700 border-green-200"
              onClick={sendBulkWhatsApp}>

                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
              size="sm"
              variant="outline"
              className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200"
              onClick={sendBulkSMS}>

                <Send className="w-4 h-4 mr-2" />
                SMS
              </Button>
              <Button
              size="sm"
              variant="outline"
              className="bg-white hover:bg-purple-50 text-purple-700 border-purple-200"
              onClick={sendBulkEmail}>

                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
              size="sm"
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-700 border-red-200"
              onClick={deleteSelected}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}>

                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        }

        {/* Results Summary */}
        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing <strong>{sortedData.length}</strong> of{' '}
            <strong>{CHARGES_DATA.length}</strong> charges
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field);
                setSortOrder(order as 'asc' | 'desc');
              }}>

              <option value="dueDate-asc">Due Date (Oldest)</option>
              <option value="dueDate-desc">Due Date (Newest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="studentName-asc">Student Name (A-Z)</option>
              <option value="studentName-desc">Student Name (Z-A)</option>
              <option value="dueAmount-desc">Due Amount (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <Table columns={columns} data={sortedData} />
        </div>

        {/* No Results */}
        {sortedData.length === 0 &&
        <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No charges found</h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        }
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedCharge &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Charge Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedCharge.chargeName}
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Student Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-500">Name:</span>{' '}
                      <strong>{selectedCharge.studentName}</strong>
                    </p>
                    <p>
                      <span className="text-gray-500">Admission No:</span>{' '}
                      {selectedCharge.admNo}
                    </p>
                    <p>
                      <span className="text-gray-500">Class:</span>{' '}
                      {selectedCharge.class}-{selectedCharge.section}
                    </p>
                    <p>
                      <span className="text-gray-500">Roll No:</span>{' '}
                      {selectedCharge.rollNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Parent Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-500">Name:</span>{' '}
                      <strong>{selectedCharge.parentName}</strong>
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span>{' '}
                      <a
                      href={`tel:${selectedCharge.parentPhone}`}
                      className="text-blue-600">

                        {selectedCharge.parentPhone}
                      </a>
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span>{' '}
                      <a
                      href={`mailto:${selectedCharge.parentEmail}`}
                      className="text-blue-600">

                        {selectedCharge.parentEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Charge Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Charge Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Charge Name</p>
                    <p className="font-medium">{selectedCharge.chargeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <Badge variant="default">{selectedCharge.type}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Category</p>
                    <p>{selectedCharge.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="text-sm">{selectedCharge.chargeDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Created By</p>
                    <p>{selectedCharge.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Created Date</p>
                    <p>
                      {new Date(selectedCharge.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{selectedCharge.amount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{selectedCharge.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Due Amount</p>
                  <p className="text-2xl font-bold text-red-900">
                    ₹{selectedCharge.dueAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  {(() => {
                  const { variant, icon } = getStatusBadge(
                    selectedCharge.status,
                    selectedCharge.dueDate
                  );
                  return (
                    <Badge variant={variant} className="flex items-center gap-1">
                        {icon}
                        {selectedCharge.status}
                      </Badge>);

                })()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Priority</p>
                  {getPriorityBadge(selectedCharge.priority)}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Due Date</p>
                  <p className="font-medium">
                    {new Date(selectedCharge.dueDate).toLocaleDateString()}
                    {getDaysOverdue(selectedCharge.dueDate) > 0 &&
                  selectedCharge.status !== 'Paid' &&
                  <span className="text-red-600 text-sm ml-2">
                          ({getDaysOverdue(selectedCharge.dueDate)} days overdue)
                        </span>
                  }
                  </p>
                </div>
              </div>

              {/* Payment History */}
              {selectedCharge.paymentHistory.length > 0 &&
            <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Payment History
                  </h3>
                  <div className="space-y-2">
                    {selectedCharge.paymentHistory.map((payment, index) =>
                <div
                  key={index}
                  className="flex justify-between items-center bg-green-50 p-3 rounded">

                        <div>
                          <p className="font-medium text-green-900">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600">
                            {payment.method} • Receipt: {payment.receiptNo}
                          </p>
                        </div>
                        <p className="text-sm text-green-700">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Reminder Info */}
              <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">
                    Reminders Sent: {selectedCharge.remindersSent}
                  </p>
                  {selectedCharge.lastReminderDate &&
                <p className="text-xs text-orange-600">
                      Last reminder:{' '}
                      {new Date(selectedCharge.lastReminderDate).toLocaleDateString()}
                    </p>
                }
                </div>
                {selectedCharge.status !== 'Paid' &&
              <Button size="sm" variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
              }
              </div>

              {/* Notes */}
              {selectedCharge.notes &&
            <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedCharge.notes}
                  </p>
                </div>
            }
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              {selectedCharge.status !== 'Paid' &&
            <>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="primary">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Collect Payment
                  </Button>
                </>
            }
            </div>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Quick Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Use advanced filters to narrow down specific charges</li>
              <li>Select multiple charges to send bulk reminders via SMS, Email, or WhatsApp</li>
              <li>Click on a charge to view complete details and payment history</li>
              <li>Export data to CSV, Excel, or PDF for reporting</li>
              <li>High priority charges with overdue status require immediate attention</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}