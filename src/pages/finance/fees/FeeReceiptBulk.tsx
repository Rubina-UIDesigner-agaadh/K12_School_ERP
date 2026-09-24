import React, { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { Badge } from '../../../components/ui/Badge'
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Receipt,
  Users,
  IndianRupee,
  X,
} from 'lucide-react'
// --- Types ---
interface BulkStudent {
  id: string
  regNo: string
  firstName: string
  lastName: string
  centre: string
  class: string
  division: string
  term: string
  year: string
  amount: number
  discount: number
  finalAmount: number
  payingAmount: number
  paymentMode: string
  gender: string
  active: string
  batch: string
}
// --- Mock Data ---
const MOCK_STUDENTS: BulkStudent[] = [
  {
    id: '1',
    regNo: 'REG-2024-001',
    firstName: 'Aarav',
    lastName: 'Patel',
    centre: 'Main Campus',
    class: '10',
    division: 'A',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discount: 0,
    finalAmount: 25000,
    payingAmount: 25000,
    paymentMode: 'Cash',
    gender: 'Male',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '2',
    regNo: 'REG-2024-002',
    firstName: 'Isha',
    lastName: 'Sharma',
    centre: 'North Campus',
    class: '9',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 22000,
    discount: 2000,
    finalAmount: 20000,
    payingAmount: 20000,
    paymentMode: 'Online',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '3',
    regNo: 'REG-2024-003',
    firstName: 'Rohan',
    lastName: 'Verma',
    centre: 'Main Campus',
    class: '11',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 30000,
    discount: 0,
    finalAmount: 30000,
    payingAmount: 30000,
    paymentMode: 'Cheque',
    gender: 'Male',
    active: 'Active',
    batch: 'Afternoon',
  },
  {
    id: '4',
    regNo: 'REG-2024-004',
    firstName: 'Meera',
    lastName: 'Singh',
    centre: 'South Campus',
    class: '8',
    division: 'C',
    term: 'Term 1',
    year: '2024-2025',
    amount: 18000,
    discount: 0,
    finalAmount: 18000,
    payingAmount: 18000,
    paymentMode: 'UPI',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
  {
    id: '5',
    regNo: 'REG-2024-005',
    firstName: 'Mohammed',
    lastName: 'Khan',
    centre: 'Main Campus',
    class: '10',
    division: 'B',
    term: 'Term 1',
    year: '2024-2025',
    amount: 25000,
    discount: 5000,
    finalAmount: 20000,
    payingAmount: 20000,
    paymentMode: 'Bank Transfer',
    gender: 'Male',
    active: 'Active',
    batch: 'Evening',
  },
  {
    id: '6',
    regNo: 'REG-2024-006',
    firstName: 'Priya',
    lastName: 'Joshi',
    centre: 'North Campus',
    class: '12',
    division: 'A',
    term: 'Term 2',
    year: '2024-2025',
    amount: 35000,
    discount: 0,
    finalAmount: 35000,
    payingAmount: 35000,
    paymentMode: 'Card',
    gender: 'Female',
    active: 'Active',
    batch: 'Morning',
  },
]
const PAYMENT_MODES = [
  'Cash',
  'Cheque',
  'Online',
  'UPI',
  'Card',
  'Bank Transfer',
]
export function FeeReceiptBulk() {
  // --- State ---
  const [students, setStudents] = useState<BulkStudent[]>(MOCK_STUDENTS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  // Filters
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    masterFranchise: '',
    centre: '',
    class: '',
    division: '',
    gender: '',
    active: 'Active',
    search: '',
    batch: '',
    term: '',
  })
  // --- Handlers ---
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleResetFilters = () => {
    setFilters({
      academicYear: '2024-2025',
      masterFranchise: '',
      centre: '',
      class: '',
      division: '',
      gender: '',
      active: 'Active',
      search: '',
      batch: '',
      term: '',
    })
  }
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)))
    }
  }
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }
  const handlePayingAmountChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              payingAmount: numValue,
            }
          : s,
      ),
    )
  }
  const handlePaymentModeChange = (id: string, value: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              paymentMode: value,
            }
          : s,
      ),
    )
  }
  const handleGenerateReceipts = () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one student.')
      return
    }
    alert(`Successfully generated receipts for ${selectedIds.size} students.`)
    setSelectedIds(new Set())
  }
  // --- Filtering ---
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.academicYear && s.year !== filters.academicYear) return false
      if (filters.centre && s.centre !== filters.centre) return false
      if (filters.class && s.class !== filters.class) return false
      if (filters.division && s.division !== filters.division) return false
      if (filters.gender && s.gender !== filters.gender) return false
      if (filters.active && s.active !== filters.active) return false
      if (filters.batch && s.batch !== filters.batch) return false
      if (filters.term && s.term !== filters.term) return false
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase()
        if (
          !fullName.includes(query) &&
          !s.regNo.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      return true
    })
  }, [students, filters])
  // --- Summary Calculations ---
  const selectedStudentsList = students.filter((s) => selectedIds.has(s.id))
  const totalPayingAmount = selectedStudentsList.reduce(
    (sum, s) => sum + s.payingAmount,
    0,
  )
  // --- Table Columns ---
  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={
            selectedIds.size === filteredStudents.length &&
            filteredStudents.length > 0
          }
          onChange={toggleSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (row: BulkStudent) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelect(row.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
    },
    {
      key: 'student',
      header: 'Student Details',
      render: (row: BulkStudent) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-xs text-gray-500">{row.regNo}</div>
        </div>
      ),
    },
    {
      key: 'academic',
      header: 'Academic Info',
      render: (row: BulkStudent) => (
        <div>
          <div className="text-sm text-gray-900">{row.centre}</div>
          <div className="text-xs text-gray-500">
            Class {row.class}-{row.division}
          </div>
        </div>
      ),
    },
    {
      key: 'feeInfo',
      header: 'Fee Info',
      render: (row: BulkStudent) => (
        <div>
          <div className="text-sm text-gray-900">{row.term}</div>
          <div className="text-xs text-gray-500">{row.year}</div>
        </div>
      ),
    },
    {
      key: 'amounts',
      header: 'Amounts',
      render: (row: BulkStudent) => (
        <div className="text-right">
          <div className="text-xs text-gray-500 line-through">
            ₹{row.amount.toLocaleString()}
          </div>
          {row.discount > 0 && (
            <div className="text-xs text-green-600">
              -₹{row.discount.toLocaleString()}
            </div>
          )}
          <div className="font-medium text-gray-900">
            ₹{row.finalAmount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'payingAmount',
      header: 'Paying Amount',
      render: (row: BulkStudent) => (
        <div className="w-32">
          <Input
            type="number"
            value={row.payingAmount}
            onChange={(e) => handlePayingAmountChange(row.id, e.target.value)}
            className="text-right"
          />
        </div>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Payment Mode',
      render: (row: BulkStudent) => (
        <div className="w-48 space-y-2">
          <Select
            options={PAYMENT_MODES.map((m) => ({
              value: m,
              label: m,
            }))}
            value={row.paymentMode}
            onChange={(e) => handlePaymentModeChange(row.id, e.target.value)}
          />
          {row.paymentMode === 'Cheque' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input placeholder="Cheque No" className="text-sm" />
              <Input type="date" className="text-sm" />
              <Input placeholder="Bank Name" className="text-sm" />
            </div>
          )}
          {(row.paymentMode === 'Online' || row.paymentMode === 'UPI') && (
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <Input placeholder="Transaction ID" className="text-sm" />
            </div>
          )}
          {row.paymentMode === 'Card' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input
                placeholder="Card Last 4 Digits"
                maxLength={4}
                className="text-sm"
              />
              <Input placeholder="Transaction ID" className="text-sm" />
            </div>
          )}
          {row.paymentMode === 'Bank Transfer' && (
            <div className="space-y-2 bg-gray-50 p-2 rounded border border-gray-200">
              <Input placeholder="Bank Name" className="text-sm" />
              <Input placeholder="Transaction ID" className="text-sm" />
              <Input type="date" className="text-sm" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: BulkStudent) => (
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>
      ),
    },
  ]
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Bulk Fee Receipt
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate fee receipts for multiple students at once
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Student Name or Reg No..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <Select
            options={[
              {
                value: '2024-2025',
                label: '2024-2025',
              },
              {
                value: '2023-2024',
                label: '2023-2024',
              },
            ]}
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
            {showFilters ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Select
              label="Master Franchise"
              options={[
                {
                  value: '',
                  label: 'All',
                },
                {
                  value: 'MF1',
                  label: 'MF 1',
                },
              ]}
              value={filters.masterFranchise}
              onChange={(e) =>
                handleFilterChange('masterFranchise', e.target.value)
              }
            />
            <Select
              label="Centre"
              options={[
                {
                  value: '',
                  label: 'All Centres',
                },
                {
                  value: 'Main Campus',
                  label: 'Main Campus',
                },
                {
                  value: 'North Campus',
                  label: 'North Campus',
                },
                {
                  value: 'South Campus',
                  label: 'South Campus',
                },
              ]}
              value={filters.centre}
              onChange={(e) => handleFilterChange('centre', e.target.value)}
            />
            <Select
              label="Class"
              options={[
                {
                  value: '',
                  label: 'All Classes',
                },
                {
                  value: '8',
                  label: 'Class 8',
                },
                {
                  value: '9',
                  label: 'Class 9',
                },
                {
                  value: '10',
                  label: 'Class 10',
                },
                {
                  value: '11',
                  label: 'Class 11',
                },
                {
                  value: '12',
                  label: 'Class 12',
                },
              ]}
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            />
            <Select
              label="Division"
              options={[
                {
                  value: '',
                  label: 'All Divisions',
                },
                {
                  value: 'A',
                  label: 'A',
                },
                {
                  value: 'B',
                  label: 'B',
                },
                {
                  value: 'C',
                  label: 'C',
                },
              ]}
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
            />
            <Select
              label="Gender"
              options={[
                {
                  value: '',
                  label: 'All Genders',
                },
                {
                  value: 'Male',
                  label: 'Male',
                },
                {
                  value: 'Female',
                  label: 'Female',
                },
                {
                  value: 'Other',
                  label: 'Other',
                },
              ]}
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            />
            <Select
              label="Active Status"
              options={[
                {
                  value: 'All',
                  label: 'All',
                },
                {
                  value: 'Active',
                  label: 'Active',
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                },
              ]}
              value={filters.active}
              onChange={(e) => handleFilterChange('active', e.target.value)}
            />
            <Select
              label="Batch"
              options={[
                {
                  value: '',
                  label: 'All Batches',
                },
                {
                  value: 'Morning',
                  label: 'Morning',
                },
                {
                  value: 'Afternoon',
                  label: 'Afternoon',
                },
                {
                  value: 'Evening',
                  label: 'Evening',
                },
              ]}
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
            />
            <Select
              label="Term"
              options={[
                {
                  value: '',
                  label: 'All Terms',
                },
                {
                  value: 'Term 1',
                  label: 'Term 1',
                },
                {
                  value: 'Term 2',
                  label: 'Term 2',
                },
                {
                  value: 'Term 3',
                  label: 'Term 3',
                },
                {
                  value: 'Annual',
                  label: 'Annual',
                },
              ]}
              value={filters.term}
              onChange={(e) => handleFilterChange('term', e.target.value)}
            />
            <div className="flex items-end gap-2 lg:col-span-2">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Summary Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              <span className="font-medium text-lg">
                {selectedIds.size} Students Selected
              </span>
            </div>
            <div className="h-8 w-px bg-blue-200"></div>
            <div className="flex items-center gap-2 text-blue-900">
              <span className="text-sm text-blue-700">
                Total Paying Amount:
              </span>
              <span className="font-bold text-xl flex items-center">
                <IndianRupee className="w-5 h-5" />
                {totalPayingAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setSelectedIds(new Set())}>
              <X className="w-4 h-4 mr-2" />
              Clear Selection
            </Button>
            <Button variant="primary" onClick={handleGenerateReceipts}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Generate Bulk Receipts
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Students List</h3>
          <span className="text-sm text-gray-500">
            {filteredStudents.length} records found
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredStudents} />
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search filters.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
