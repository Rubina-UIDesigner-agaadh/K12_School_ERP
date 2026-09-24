import React, { useState, Fragment } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Receipt,
  XCircle,
  Eye,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react'
// --- Types ---
interface PaymentHistory {
  id: string
  date: string
  receiptNo: string
  amount: number
  mode: string
  status: 'Completed' | 'Cancelled' | 'Pending'
}
interface StudentReceipt {
  id: string
  regNo: string
  firstName: string
  lastName: string
  feeStructure: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  amount: number
  discountAmount: number
  finalAmount: number
  paidAmount: number
  status: 'Paid' | 'Partial' | 'Unpaid'
  paymentHistory: PaymentHistory[]
}
// --- Mock Data ---
const MOCK_RECEIPTS: StudentReceipt[] = [
  {
    id: '1',
    regNo: 'REG-2024-001',
    firstName: 'Aarav',
    lastName: 'Patel',
    feeStructure: 'Regular',
    centre: 'Main Campus',
    class: '10',
    division: 'A',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discountAmount: 0,
    finalAmount: 25000,
    paidAmount: 25000,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'ph1',
        date: '2024-04-15',
        receiptNo: 'RCP-2024-001',
        amount: 25000,
        mode: 'Online',
        status: 'Completed',
      },
    ],
  },
  {
    id: '2',
    regNo: 'REG-2024-002',
    firstName: 'Isha',
    lastName: 'Sharma',
    feeStructure: 'Staff Ward',
    centre: 'North Campus',
    class: '9',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discountAmount: 12500,
    finalAmount: 12500,
    paidAmount: 12500,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'ph2',
        date: '2024-04-10',
        receiptNo: 'RCP-2024-002',
        amount: 12500,
        mode: 'Cheque',
        status: 'Completed',
      },
    ],
  },
  {
    id: '3',
    regNo: 'REG-2024-003',
    firstName: 'Rohan',
    lastName: 'Verma',
    feeStructure: 'Regular',
    centre: 'Main Campus',
    class: '11',
    division: 'Science',
    term: 'Term 2',
    year: '2024-2025',
    amount: 30000,
    discountAmount: 0,
    finalAmount: 30000,
    paidAmount: 15000,
    status: 'Partial',
    paymentHistory: [
      {
        id: 'ph3',
        date: '2024-08-05',
        receiptNo: 'RCP-2024-089',
        amount: 15000,
        mode: 'UPI',
        status: 'Completed',
      },
    ],
  },
  {
    id: '4',
    regNo: 'REG-2024-004',
    firstName: 'Meera',
    lastName: 'Singh',
    feeStructure: 'RTE',
    centre: 'South Campus',
    class: '8',
    division: 'A',
    term: 'Annual',
    year: '2024-2025',
    amount: 20000,
    discountAmount: 20000,
    finalAmount: 0,
    paidAmount: 0,
    status: 'Paid',
    paymentHistory: [],
  },
  {
    id: '5',
    regNo: 'REG-2024-005',
    firstName: 'Arjun',
    lastName: 'Reddy',
    feeStructure: 'Regular',
    centre: 'Main Campus',
    class: '12',
    division: 'Commerce',
    term: 'Term 1',
    year: '2024-2025',
    amount: 32000,
    discountAmount: 2000,
    finalAmount: 30000,
    paidAmount: 0,
    status: 'Unpaid',
    paymentHistory: [
      {
        id: 'ph4',
        date: '2024-04-20',
        receiptNo: 'RCP-2024-105',
        amount: 30000,
        mode: 'Cheque',
        status: 'Cancelled',
      },
    ],
  },
  {
    id: '6',
    regNo: 'REG-2024-006',
    firstName: 'Zara',
    lastName: 'Khan',
    feeStructure: 'Regular',
    centre: 'North Campus',
    class: '10',
    division: 'C',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discountAmount: 0,
    finalAmount: 25000,
    paidAmount: 10000,
    status: 'Partial',
    paymentHistory: [
      {
        id: 'ph5',
        date: '2024-04-12',
        receiptNo: 'RCP-2024-045',
        amount: 10000,
        mode: 'Cash',
        status: 'Completed',
      },
    ],
  },
  {
    id: '7',
    regNo: 'REG-2024-007',
    firstName: 'David',
    lastName: 'Thomas',
    feeStructure: 'Scholarship',
    centre: 'Main Campus',
    class: '9',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 25000,
    discountAmount: 5000,
    finalAmount: 20000,
    paidAmount: 20000,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'ph6',
        date: '2024-08-10',
        receiptNo: 'RCP-2024-112',
        amount: 10000,
        mode: 'Online',
        status: 'Completed',
      },
      {
        id: 'ph7',
        date: '2024-09-01',
        receiptNo: 'RCP-2024-156',
        amount: 10000,
        mode: 'UPI',
        status: 'Completed',
      },
    ],
  },
  {
    id: '8',
    regNo: 'REG-2024-008',
    firstName: 'Ananya',
    lastName: 'Joshi',
    feeStructure: 'Regular',
    centre: 'South Campus',
    class: '7',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 22000,
    discountAmount: 0,
    finalAmount: 22000,
    paidAmount: 22000,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'ph8',
        date: '2024-04-05',
        receiptNo: 'RCP-2024-010',
        amount: 22000,
        mode: 'Card',
        status: 'Completed',
      },
    ],
  },
]
// --- Filter Options ---
const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023']
const MASTER_FRANCHISES = ['All', 'Main Franchise', 'North Franchise']
const CENTRES = ['All', 'Main Campus', 'North Campus', 'South Campus']
const CLASSES = ['All', '7', '8', '9', '10', '11', '12']
const DIVISIONS = ['All', 'A', 'B', 'C', 'Science', 'Commerce']
const GENDERS = ['All', 'Male', 'Female', 'Other']
const ACTIVE_STATUS = ['All', 'Active', 'Inactive']
const BATCHES = ['All', 'Morning', 'Afternoon', 'Evening']
const TERMS = ['All', 'Term 1', 'Term 2', 'Term 3', 'Annual']
export function FeeReceiptList() {
  // --- State ---
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: 'All',
    centre: 'All',
    class: 'All',
    division: 'All',
    gender: 'All',
    active: 'Active',
    search: '',
    batch: 'All',
    term: 'All',
  })
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  // --- Handlers ---
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleReset = () => {
    setFilters({
      academicYear: '2024-2025',
      masterFranchise: 'All',
      centre: 'All',
      class: 'All',
      division: 'All',
      gender: 'All',
      active: 'Active',
      search: '',
      batch: 'All',
      term: 'All',
    })
  }
  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id)
  }
  // --- Filter Logic ---
  const filteredReceipts = MOCK_RECEIPTS.filter((receipt) => {
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const nameMatch = `${receipt.firstName} ${receipt.lastName}`
        .toLowerCase()
        .includes(query)
      const regMatch = receipt.regNo.toLowerCase().includes(query)
      if (!nameMatch && !regMatch) return false
    }
    if (filters.academicYear !== 'All' && receipt.year !== filters.academicYear)
      return false
    if (filters.centre !== 'All' && receipt.centre !== filters.centre)
      return false
    if (filters.class !== 'All' && receipt.class !== filters.class) return false
    if (filters.division !== 'All' && receipt.division !== filters.division)
      return false
    if (filters.term !== 'All' && receipt.term !== filters.term) return false
    return true
  })
  // --- Helpers ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paid</Badge>
      case 'Partial':
        return <Badge variant="warning">Partial</Badge>
      case 'Unpaid':
        return <Badge variant="danger">Unpaid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  const getPaymentModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'cash':
        return <Banknote className="w-4 h-4 text-green-600" />
      case 'online':
      case 'upi':
        return <Smartphone className="w-4 h-4 text-blue-600" />
      case 'card':
        return <CreditCard className="w-4 h-4 text-purple-600" />
      default:
        return <Receipt className="w-4 h-4 text-gray-600" />
    }
  }
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Fee Receipt & Discount List
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage student fee receipts and applied discounts
        </p>
      </div>

      {/* Filters Card */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Academic Year"
            options={ACADEMIC_YEARS.map((y) => ({
              value: y,
              label: y,
            }))}
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          />
          <Select
            label="Master Franchise"
            options={MASTER_FRANCHISES.map((f) => ({
              value: f,
              label: f,
            }))}
            value={filters.masterFranchise}
            onChange={(e) =>
              handleFilterChange('masterFranchise', e.target.value)
            }
          />
          <Select
            label="Centre"
            options={CENTRES.map((c) => ({
              value: c,
              label: c,
            }))}
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
          />
          <Select
            label="Class"
            options={CLASSES.map((c) => ({
              value: c,
              label: c === 'All' ? 'All Classes' : `Class ${c}`,
            }))}
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
          />
          <Select
            label="Division"
            options={DIVISIONS.map((d) => ({
              value: d,
              label: d === 'All' ? 'All Divisions' : d,
            }))}
            value={filters.division}
            onChange={(e) => handleFilterChange('division', e.target.value)}
          />
          <Select
            label="Gender"
            options={GENDERS.map((g) => ({
              value: g,
              label: g,
            }))}
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          />
          <Select
            label="Active Status"
            options={ACTIVE_STATUS.map((s) => ({
              value: s,
              label: s,
            }))}
            value={filters.active}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          />
          <Select
            label="Batch"
            options={BATCHES.map((b) => ({
              value: b,
              label: b,
            }))}
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
          />
          <Select
            label="Term"
            options={TERMS.map((t) => ({
              value: t,
              label: t,
            }))}
            value={filters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
          />
          <div className="lg:col-span-3">
            <Input
              label="Search Student"
              placeholder="Search by Name or Reg No..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Reg No</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Fee Structure</th>
                <th className="px-4 py-3">Centre</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Final Amount</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReceipts.map((receipt) => (
                <Fragment key={receipt.id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedRowId === receipt.id ? 'bg-blue-50/30' : 'bg-white'}`}
                    onClick={() => toggleRow(receipt.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {receipt.regNo}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {receipt.firstName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {receipt.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {receipt.feeStructure}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {receipt.centre}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {receipt.class}-{receipt.division}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{receipt.term}</td>
                    <td className="px-4 py-3 text-gray-600">{receipt.year}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      ₹{receipt.discountAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{receipt.finalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-blue-600">
                      ₹{receipt.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusBadge(receipt.status)}
                        {expandedRowId === receipt.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Panel */}
                  {expandedRowId === receipt.id && (
                    <tr>
                      <td colSpan={13} className="p-0 border-b border-gray-200">
                        <div className="bg-blue-50/30 p-6 shadow-inner">
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {receipt.firstName} {receipt.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Class {receipt.class}-{receipt.division} | Reg
                                  No: {receipt.regNo}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  Total Paid
                                </p>
                                <p className="text-xl font-bold text-blue-600">
                                  ₹{receipt.paidAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Receipt className="w-4 h-4" /> Payment History
                            </h4>

                            {receipt.paymentHistory.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <Receipt className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>No payments recorded for this term.</p>
                              </div>
                            ) : (
                              <div className="relative pl-4 border-l-2 border-blue-100 space-y-6">
                                {receipt.paymentHistory.map((payment, idx) => (
                                  <div key={payment.id} className="relative">
                                    {/* Timeline dot */}
                                    <div
                                      className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${payment.status === 'Completed' ? 'bg-green-500' : payment.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                    ></div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                      <div className="flex items-start gap-4">
                                        <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                          <div className="text-center">
                                            <div className="text-xs text-gray-500 uppercase font-semibold">
                                              {new Date(
                                                payment.date,
                                              ).toLocaleDateString('en-US', {
                                                month: 'short',
                                              })}
                                            </div>
                                            <div className="text-lg font-bold text-gray-900 leading-none">
                                              {new Date(payment.date).getDate()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {new Date(
                                                payment.date,
                                              ).getFullYear()}
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">
                                              {payment.receiptNo}
                                            </span>
                                            <Badge
                                              variant={
                                                payment.status === 'Completed'
                                                  ? 'success'
                                                  : payment.status ===
                                                      'Cancelled'
                                                    ? 'danger'
                                                    : 'warning'
                                              }
                                              size="xs"
                                            >
                                              {payment.status}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                              {getPaymentModeIcon(payment.mode)}
                                              {payment.mode}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col sm:items-end gap-3">
                                        <div className="text-lg font-bold text-gray-900">
                                          ₹{payment.amount.toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={
                                              <Eye className="w-3 h-3" />
                                            }
                                          >
                                            View Receipt
                                          </Button>
                                          {payment.status === 'Completed' && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                              leftIcon={
                                                <XCircle className="w-3 h-3" />
                                              }
                                            >
                                              Cancel
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}

              {filteredReceipts.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No receipts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
