import React, { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import {
  Search,
  User,
  Printer,
  Eye,
  Receipt,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Download,
  ArrowLeft,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Student {
  id: string
  regNo: string
  name: string
  class: string
  division: string
  rollNo: number
  fatherName: string
  gender: string
  status: 'Active' | 'Inactive'
  totalFee: number
  paidAmount: number
  balance: number
  contact: string
}

interface FeeReceipt {
  id: string
  studentId: string
  receiptNo: string
  date: string
  feeHead: string
  term: string
  amount: number
  discount: number
  netAmount: number
  paidAmount: number
  balance: number
  paymentMode: string
  status: 'Paid' | 'Unpaid' | 'Pending' | 'Partial'
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_STUDENTS: Student[] = [
  {
    id: 'STU001',
    regNo: 'REG-2024-001',
    name: 'Rahul Sharma',
    class: '10',
    division: 'A',
    rollNo: 15,
    fatherName: 'Amit Sharma',
    gender: 'Male',
    status: 'Active',
    totalFee: 93000,
    paidAmount: 49000,
    balance: 44000,
    contact: '9876543210',
  },
  {
    id: 'STU002',
    regNo: 'REG-2024-002',
    name: 'Priya Patel',
    class: '10',
    division: 'A',
    rollNo: 12,
    fatherName: 'Rajesh Patel',
    gender: 'Female',
    status: 'Active',
    totalFee: 93000,
    paidAmount: 93000,
    balance: 0,
    contact: '9876543211',
  },
  {
    id: 'STU003',
    regNo: 'REG-2024-003',
    name: 'Arjun Singh',
    class: '10',
    division: 'B',
    rollNo: 3,
    fatherName: 'Vikram Singh',
    gender: 'Male',
    status: 'Active',
    totalFee: 75000,
    paidAmount: 25000,
    balance: 50000,
    contact: '9876543212',
  },
  {
    id: 'STU004',
    regNo: 'REG-2024-004',
    name: 'Sneha Reddy',
    class: '9',
    division: 'A',
    rollNo: 22,
    fatherName: 'Suresh Reddy',
    gender: 'Female',
    status: 'Active',
    totalFee: 85000,
    paidAmount: 60000,
    balance: 25000,
    contact: '9876543213',
  },
  {
    id: 'STU005',
    regNo: 'REG-2024-005',
    name: 'Mohammed Irfan',
    class: '9',
    division: 'B',
    rollNo: 8,
    fatherName: 'Ahmed Khan',
    gender: 'Male',
    status: 'Active',
    totalFee: 85000,
    paidAmount: 85000,
    balance: 0,
    contact: '9876543214',
  },
  {
    id: 'STU006',
    regNo: 'REG-2024-006',
    name: 'Ananya Gupta',
    class: '8',
    division: 'A',
    rollNo: 5,
    fatherName: 'Sanjay Gupta',
    gender: 'Female',
    status: 'Inactive',
    totalFee: 70000,
    paidAmount: 35000,
    balance: 35000,
    contact: '9876543215',
  },
  {
    id: 'STU007',
    regNo: 'REG-2024-007',
    name: 'Karthik Nair',
    class: '8',
    division: 'B',
    rollNo: 18,
    fatherName: 'Ramesh Nair',
    gender: 'Male',
    status: 'Active',
    totalFee: 70000,
    paidAmount: 0,
    balance: 70000,
    contact: '9876543216',
  },
  {
    id: 'STU008',
    regNo: 'REG-2024-008',
    name: 'Divya Joshi',
    class: '10',
    division: 'A',
    rollNo: 9,
    fatherName: 'Prakash Joshi',
    gender: 'Female',
    status: 'Active',
    totalFee: 93000,
    paidAmount: 68000,
    balance: 25000,
    contact: '9876543217',
  },
]

const MOCK_RECEIPTS: FeeReceipt[] = [
  // Rahul Sharma
  {
    id: '1',
    studentId: 'STU001',
    receiptNo: 'RCP-2024-001',
    date: '2024-04-05',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '2',
    studentId: 'STU001',
    receiptNo: 'RCP-2024-002',
    date: '2024-04-05',
    feeHead: 'Transport Fee',
    term: 'Term 1',
    amount: 10000,
    discount: 1000,
    netAmount: 9000,
    paidAmount: 9000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '3',
    studentId: 'STU001',
    receiptNo: 'RCP-2024-089',
    date: '2024-07-10',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 15000,
    balance: 10000,
    paymentMode: 'Cash',
    status: 'Partial',
  },
  {
    id: '4',
    studentId: 'STU001',
    receiptNo: 'RCP-2024-090',
    date: '2024-07-10',
    feeHead: 'Transport Fee',
    term: 'Term 2',
    amount: 10000,
    discount: 1000,
    netAmount: 9000,
    paidAmount: 0,
    balance: 9000,
    paymentMode: '-',
    status: 'Unpaid',
  },
  {
    id: '5',
    studentId: 'STU001',
    receiptNo: 'RCP-2024-150',
    date: '2024-10-05',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 0,
    balance: 25000,
    paymentMode: '-',
    status: 'Pending',
  },
  // Priya Patel
  {
    id: '6',
    studentId: 'STU002',
    receiptNo: 'RCP-2024-010',
    date: '2024-04-03',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '7',
    studentId: 'STU002',
    receiptNo: 'RCP-2024-011',
    date: '2024-04-03',
    feeHead: 'Transport Fee',
    term: 'Term 1',
    amount: 10000,
    discount: 1000,
    netAmount: 9000,
    paidAmount: 9000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '8',
    studentId: 'STU002',
    receiptNo: 'RCP-2024-080',
    date: '2024-07-05',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Cheque',
    status: 'Paid',
  },
  {
    id: '9',
    studentId: 'STU002',
    receiptNo: 'RCP-2024-081',
    date: '2024-07-05',
    feeHead: 'Transport Fee',
    term: 'Term 2',
    amount: 10000,
    discount: 1000,
    netAmount: 9000,
    paidAmount: 9000,
    balance: 0,
    paymentMode: 'Cheque',
    status: 'Paid',
  },
  {
    id: '10',
    studentId: 'STU002',
    receiptNo: 'RCP-2024-140',
    date: '2024-10-02',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  // Arjun Singh
  {
    id: '11',
    studentId: 'STU003',
    receiptNo: 'RCP-2024-020',
    date: '2024-04-08',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Cash',
    status: 'Paid',
  },
  {
    id: '12',
    studentId: 'STU003',
    receiptNo: 'RCP-2024-095',
    date: '2024-07-15',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 0,
    balance: 25000,
    paymentMode: '-',
    status: 'Unpaid',
  },
  {
    id: '13',
    studentId: 'STU003',
    receiptNo: 'RCP-2024-160',
    date: '2024-10-10',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 0,
    balance: 25000,
    paymentMode: '-',
    status: 'Pending',
  },
  // Sneha Reddy
  {
    id: '14',
    studentId: 'STU004',
    receiptNo: 'RCP-2024-030',
    date: '2024-04-10',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 25000,
    discount: 2000,
    netAmount: 23000,
    paidAmount: 23000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '15',
    studentId: 'STU004',
    receiptNo: 'RCP-2024-031',
    date: '2024-04-10',
    feeHead: 'Lab Fee',
    term: 'Term 1',
    amount: 8000,
    discount: 0,
    netAmount: 8000,
    paidAmount: 8000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '16',
    studentId: 'STU004',
    receiptNo: 'RCP-2024-100',
    date: '2024-07-12',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 25000,
    discount: 2000,
    netAmount: 23000,
    paidAmount: 23000,
    balance: 0,
    paymentMode: 'Cash',
    status: 'Paid',
  },
  {
    id: '17',
    studentId: 'STU004',
    receiptNo: 'RCP-2024-101',
    date: '2024-07-12',
    feeHead: 'Lab Fee',
    term: 'Term 2',
    amount: 8000,
    discount: 0,
    netAmount: 8000,
    paidAmount: 6000,
    balance: 2000,
    paymentMode: 'Cash',
    status: 'Partial',
  },
  {
    id: '18',
    studentId: 'STU004',
    receiptNo: 'RCP-2024-170',
    date: '2024-10-08',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 25000,
    discount: 2000,
    netAmount: 23000,
    paidAmount: 0,
    balance: 23000,
    paymentMode: '-',
    status: 'Pending',
  },
  // Karthik Nair - all unpaid
  {
    id: '19',
    studentId: 'STU007',
    receiptNo: 'RCP-2024-045',
    date: '2024-04-15',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 22000,
    discount: 0,
    netAmount: 22000,
    paidAmount: 0,
    balance: 22000,
    paymentMode: '-',
    status: 'Unpaid',
  },
  {
    id: '20',
    studentId: 'STU007',
    receiptNo: 'RCP-2024-046',
    date: '2024-04-15',
    feeHead: 'Activity Fee',
    term: 'Term 1',
    amount: 5000,
    discount: 0,
    netAmount: 5000,
    paidAmount: 0,
    balance: 5000,
    paymentMode: '-',
    status: 'Unpaid',
  },
  {
    id: '21',
    studentId: 'STU007',
    receiptNo: 'RCP-2024-110',
    date: '2024-07-15',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 22000,
    discount: 0,
    netAmount: 22000,
    paidAmount: 0,
    balance: 22000,
    paymentMode: '-',
    status: 'Unpaid',
  },
  {
    id: '22',
    studentId: 'STU007',
    receiptNo: 'RCP-2024-180',
    date: '2024-10-15',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 21000,
    discount: 0,
    netAmount: 21000,
    paidAmount: 0,
    balance: 21000,
    paymentMode: '-',
    status: 'Pending',
  },
  // Divya Joshi
  {
    id: '23',
    studentId: 'STU008',
    receiptNo: 'RCP-2024-050',
    date: '2024-04-06',
    feeHead: 'Tuition Fee',
    term: 'Term 1',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '24',
    studentId: 'STU008',
    receiptNo: 'RCP-2024-051',
    date: '2024-04-06',
    feeHead: 'Transport Fee',
    term: 'Term 1',
    amount: 9000,
    discount: 0,
    netAmount: 9000,
    paidAmount: 9000,
    balance: 0,
    paymentMode: 'Online',
    status: 'Paid',
  },
  {
    id: '25',
    studentId: 'STU008',
    receiptNo: 'RCP-2024-105',
    date: '2024-07-08',
    feeHead: 'Tuition Fee',
    term: 'Term 2',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 25000,
    balance: 0,
    paymentMode: 'Cheque',
    status: 'Paid',
  },
  {
    id: '26',
    studentId: 'STU008',
    receiptNo: 'RCP-2024-106',
    date: '2024-07-08',
    feeHead: 'Transport Fee',
    term: 'Term 2',
    amount: 9000,
    discount: 0,
    netAmount: 9000,
    paidAmount: 9000,
    balance: 0,
    paymentMode: 'Cheque',
    status: 'Paid',
  },
  {
    id: '27',
    studentId: 'STU008',
    receiptNo: 'RCP-2024-175',
    date: '2024-10-06',
    feeHead: 'Tuition Fee',
    term: 'Term 3',
    amount: 25000,
    discount: 0,
    netAmount: 25000,
    paidAmount: 0,
    balance: 25000,
    paymentMode: '-',
    status: 'Pending',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function StudentFeeProcess() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: '',
    centre: '',
    class: '',
    division: '',
    gender: '',
    active: 'Active',
    batch: '',
    term: '',
  })

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // ── Filter students ────────────────────────────────────────────────────────

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch =
      searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.contact.includes(searchQuery)

    const matchesClass = filters.class === '' || student.class === filters.class
    const matchesDivision =
      filters.division === '' || student.division === filters.division
    const matchesGender =
      filters.gender === '' || student.gender === filters.gender
    const matchesActive =
      filters.active === 'All' || student.status === filters.active

    return (
      matchesSearch &&
      matchesClass &&
      matchesDivision &&
      matchesGender &&
      matchesActive
    )
  })

  // ── Filter receipts for selected student ───────────────────────────────────

  const studentReceipts = selectedStudent
    ? MOCK_RECEIPTS.filter((r) => r.studentId === selectedStudent.id)
    : []

  const filteredReceipts = studentReceipts.filter((r) => {
    if (activeTab === 'all') return true
    if (activeTab === 'paid') return r.status === 'Paid'
    if (activeTab === 'unpaid') return r.status === 'Unpaid'
    if (activeTab === 'partial') return r.status === 'Partial'
    if (activeTab === 'pending') return r.status === 'Pending'
    return true
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Unpaid':
        return (
          <Badge variant="danger">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Pending':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      case 'Partial':
        return (
          <Badge variant="info">
            <RefreshCw className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStudentStatusBadge = (student: Student) => {
    if (student.balance === 0) {
      return <Badge variant="success">Fully Paid</Badge>
    } else if (student.paidAmount === 0) {
      return <Badge variant="danger">Unpaid</Badge>
    } else {
      return <Badge variant="warning">Partial</Badge>
    }
  }

  // ── Count receipts by status ───────────────────────────────────────────────

  const paidCount = studentReceipts.filter((r) => r.status === 'Paid').length
  const unpaidCount = studentReceipts.filter(
    (r) => r.status === 'Unpaid'
  ).length
  const partialCount = studentReceipts.filter(
    (r) => r.status === 'Partial'
  ).length
  const pendingCount = studentReceipts.filter(
    (r) => r.status === 'Pending'
  ).length

  // ── Student list columns ──────────────────────────────────────────────────

  const studentColumns = [
    {
      key: 'regNo',
      header: 'Reg No',
      render: (row: Student) => (
        <span className="font-medium text-blue-600">{row.regNo}</span>
      ),
    },
    {
      key: 'name',
      header: 'Student Name',
      render: (row: Student) => (
        <div>
          <span className="font-semibold text-gray-900">{row.name}</span>
          <div className="text-xs text-gray-500">S/o {row.fatherName}</div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (row: Student) => (
        <span className="text-gray-700">
          {row.class}-{row.division}
        </span>
      ),
    },
    {
      key: 'rollNo',
      header: 'Roll No',
      render: (row: Student) => (
        <span className="text-gray-600">{row.rollNo}</span>
      ),
    },
    {
      key: 'totalFee',
      header: 'Total Fee',
      render: (row: Student) => (
        <span className="font-medium">₹{row.totalFee.toLocaleString()}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid',
      render: (row: Student) => (
        <span className="font-medium text-green-600">
          ₹{row.paidAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (row: Student) => (
        <span
          className={`font-medium ${row.balance > 0 ? 'text-red-600' : 'text-gray-600'}`}
        >
          ₹{row.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'feeStatus',
      header: 'Fee Status',
      render: (row: Student) => getStudentStatusBadge(row),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Student) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Student) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedStudent(row)
            setActiveTab('all')
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Fees
        </Button>
      ),
    },
  ]

  // ── Fee receipt columns ───────────────────────────────────────────────────

  const receiptColumns = [
    {
      key: 'receiptNo',
      header: 'Receipt No',
      render: (row: FeeReceipt) => (
        <span className="font-medium text-blue-600">{row.receiptNo}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row: FeeReceipt) => (
        <span className="text-gray-600">{row.date}</span>
      ),
    },
    {
      key: 'feeHead',
      header: 'Fee Head',
      render: (row: FeeReceipt) => (
        <span className="font-medium text-gray-900">{row.feeHead}</span>
      ),
    },
    {
      key: 'term',
      header: 'Term',
      render: (row: FeeReceipt) => (
        <span className="text-gray-600">{row.term}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: FeeReceipt) => <span>₹{row.amount.toLocaleString()}</span>,
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (row: FeeReceipt) => (
        <span className="text-green-600">₹{row.discount.toLocaleString()}</span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Amount',
      render: (row: FeeReceipt) => (
        <span className="font-medium">₹{row.netAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      render: (row: FeeReceipt) => (
        <span className="font-medium text-blue-600">
          ₹{row.paidAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (row: FeeReceipt) => (
        <span
          className={`font-medium ${row.balance > 0 ? 'text-red-600' : 'text-gray-900'}`}
        >
          ₹{row.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Mode',
      render: (row: FeeReceipt) => (
        <span className="text-gray-600">{row.paymentMode}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: FeeReceipt) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" title="View Receipt">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Print Receipt">
            <Printer className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ]

  // ── Tab items ─────────────────────────────────────────────────────────────

  const tabItems = [
    { id: 'all', label: `All Receipts (${studentReceipts.length})` },
    { id: 'paid', label: `Paid (${paidCount})` },
    { id: 'unpaid', label: `Unpaid (${unpaidCount})` },
    { id: 'partial', label: `Partial (${partialCount})` },
    { id: 'pending', label: `Pending (${pendingCount})` },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Student Detail View
  // ═══════════════════════════════════════════════════════════════════════════

  if (selectedStudent) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedStudent(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Fee Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View all fee receipts for {selectedStudent.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" /> Print All
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="p-6 bg-white border-l-4 border-l-blue-500">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedStudent.name}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Badge variant="secondary">{selectedStudent.regNo}</Badge>
                </span>
                <span className="flex items-center gap-1">
                  Class: {selectedStudent.class}-{selectedStudent.division}
                </span>
                <span className="flex items-center gap-1">
                  Roll No: {selectedStudent.rollNo}
                </span>
                <span className="flex items-center gap-1">
                  Father: {selectedStudent.fatherName}
                </span>
                <span className="flex items-center gap-1">
                  Contact: {selectedStudent.contact}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant={
                  selectedStudent.status === 'Active' ? 'success' : 'danger'
                }
                className="text-sm px-3 py-1"
              >
                {selectedStudent.status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tabs & Table */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-0">
            <Table columns={receiptColumns} data={filteredReceipts} />
            {filteredReceipts.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No receipts found for &ldquo;
                  {tabItems.find((t) => t.id === activeTab)?.label}&rdquo;
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try selecting a different tab to view receipts.
                </p>
              </div>
            )}
          </div>

          {/* Table footer with totals for filtered view */}
          {filteredReceipts.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <span className="text-gray-500">Total Records:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    {filteredReceipts.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Net Amount:</span>{' '}
                  <span className="font-semibold text-gray-900">
                    ₹
                    {filteredReceipts
                      .reduce((sum, r) => sum + r.netAmount, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Paid:</span>{' '}
                  <span className="font-semibold text-green-600">
                    ₹
                    {filteredReceipts
                      .reduce((sum, r) => sum + r.paidAmount, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Balance:</span>{' '}
                  <span className="font-semibold text-red-600">
                    ₹
                    {filteredReceipts
                      .reduce((sum, r) => sum + r.balance, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Student List View
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Student Fee Process
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Search and select a student to view their fee details
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select
            label="Academic Year"
            options={[
              { value: '2024-2025', label: '2024-2025' },
              { value: '2023-2024', label: '2023-2024' },
            ]}
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          />
          <Select
            label="Master Franchise"
            options={[
              { value: '', label: 'All' },
              { value: 'main', label: 'Main Campus' },
            ]}
            value={filters.masterFranchise}
            onChange={(e) =>
              handleFilterChange('masterFranchise', e.target.value)
            }
          />
          <Select
            label="Centre"
            options={[
              { value: '', label: 'All' },
              { value: 'main', label: 'Main Centre' },
            ]}
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
          />
          <Select
            label="Class"
            options={[
              { value: '', label: 'All' },
              { value: '8', label: 'Class 8' },
              { value: '9', label: 'Class 9' },
              { value: '10', label: 'Class 10' },
            ]}
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
          />
          <Select
            label="Division"
            options={[
              { value: '', label: 'All' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
            ]}
            value={filters.division}
            onChange={(e) => handleFilterChange('division', e.target.value)}
          />
          <Select
            label="Gender"
            options={[
              { value: '', label: 'All' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          />
          <Select
            label="Active Status"
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'All', label: 'All' },
            ]}
            value={filters.active}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          />
          <Select
            label="Batch"
            options={[
              { value: '', label: 'All' },
              { value: 'Morning', label: 'Morning' },
              { value: 'Afternoon', label: 'Afternoon' },
            ]}
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
          />
          <Select
            label="Term"
            options={[
              { value: '', label: 'All' },
              { value: 'Term 1', label: 'Term 1' },
              { value: 'Term 2', label: 'Term 2' },
              { value: 'Term 3', label: 'Term 3' },
              { value: 'Annual', label: 'Annual' },
            ]}
            value={filters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
          />
          <Input
            label="Search Student"
            placeholder="Name, Reg No, or Contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </Card>

      {/* Student List Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Student List
            <Badge variant="secondary" className="ml-2">
              {filteredStudents.length} students
            </Badge>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click &ldquo;View Fees&rdquo; to see detailed fee information for a
            student
          </p>
        </div>
        <div className="p-0">
          <Table columns={studentColumns} data={filteredStudents} />
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No students found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting the filters or search query.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}