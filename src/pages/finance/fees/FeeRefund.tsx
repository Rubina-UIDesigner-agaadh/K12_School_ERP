import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Search, RotateCcw, X, Filter, FileText, Download } from 'lucide-react';

interface Receipt {
  id: number;
  no: string;
  date: string;
  amount: number;
  head: string;
  paidAmount: number;
  refundable: number;
  selected: boolean;
  refundAmount: number;
}

interface Student {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  admissionNo: string;
  fatherName: string;
  contactNo: string;
  totalPaid: number;
  totalRefunded: number;
}

export function FeeRefund() {
  // State Management
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [refundDate, setRefundDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMode, setPaymentMode] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [reason, setReason] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  // Mock Students Data
  const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    rollNo: '101',
    class: '10',
    section: 'A',
    admissionNo: 'ADM2024001',
    fatherName: 'Rajesh Sharma',
    contactNo: '9876543210',
    totalPaid: 50000,
    totalRefunded: 0
  },
  {
    id: 2,
    name: 'Priya Singh',
    rollNo: '102',
    class: '10',
    section: 'A',
    admissionNo: 'ADM2024002',
    fatherName: 'Amit Singh',
    contactNo: '9876543211',
    totalPaid: 45000,
    totalRefunded: 5000
  },
  {
    id: 3,
    name: 'Amit Kumar',
    rollNo: '103',
    class: '9',
    section: 'B',
    admissionNo: 'ADM2024003',
    fatherName: 'Suresh Kumar',
    contactNo: '9876543212',
    totalPaid: 40000,
    totalRefunded: 0
  },
  {
    id: 4,
    name: 'Sneha Patel',
    rollNo: '104',
    class: '11',
    section: 'A',
    admissionNo: 'ADM2024004',
    fatherName: 'Mahesh Patel',
    contactNo: '9876543213',
    totalPaid: 55000,
    totalRefunded: 10000
  }];


  // Mock Receipts Data
  const mockReceipts: Receipt[] = [
  {
    id: 1,
    no: 'RCP-2024-001',
    date: '2024-01-15',
    amount: 25000,
    head: 'Tuition Fee - Term 1',
    paidAmount: 25000,
    refundable: 25000,
    selected: false,
    refundAmount: 0
  },
  {
    id: 2,
    no: 'RCP-2024-002',
    date: '2024-02-10',
    amount: 15000,
    head: 'Tuition Fee - Term 2',
    paidAmount: 15000,
    refundable: 15000,
    selected: false,
    refundAmount: 0
  },
  {
    id: 3,
    no: 'RCP-2024-003',
    date: '2024-02-15',
    amount: 5000,
    head: 'Transport Fee',
    paidAmount: 5000,
    refundable: 5000,
    selected: false,
    refundAmount: 0
  },
  {
    id: 4,
    no: 'RCP-2024-004',
    date: '2024-03-01',
    amount: 3000,
    head: 'Library Fee',
    paidAmount: 3000,
    refundable: 3000,
    selected: false,
    refundAmount: 0
  },
  {
    id: 5,
    no: 'RCP-2024-005',
    date: '2024-03-05',
    amount: 2000,
    head: 'Sports Fee',
    paidAmount: 2000,
    refundable: 2000,
    selected: false,
    refundAmount: 0
  }];


  // Search Students
  const handleSearch = () => {
    let filtered = mockStudents;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.contactNo.includes(searchTerm)
      );
    }

    if (classFilter) {
      filtered = filtered.filter((student) => student.class === classFilter);
    }

    if (sectionFilter) {
      filtered = filtered.filter((student) => student.section === sectionFilter);
    }

    setSearchResults(filtered);
  };

  // Select Student
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setReceipts(mockReceipts.map((r) => ({ ...r, selected: false, refundAmount: 0 })));
    setSearchResults([]);
    setSearchTerm('');
  };

  // Clear Student Selection
  const handleClearStudent = () => {
    setSelectedStudent(null);
    setReceipts([]);
    setSearchResults([]);
    setSearchTerm('');
    resetRefundForm();
  };

  // Toggle Receipt Selection
  const handleToggleReceipt = (id: number) => {
    setReceipts((prev) =>
    prev.map((receipt) =>
    receipt.id === id ?
    { ...receipt, selected: !receipt.selected } :
    receipt
    )
    );
  };

  // Select All Receipts
  const handleSelectAll = () => {
    const allSelected = receipts.every((r) => r.selected);
    setReceipts((prev) =>
    prev.map((receipt) => ({ ...receipt, selected: !allSelected }))
    );
  };

  // Update Refund Amount
  const handleRefundAmountChange = (id: number, value: string) => {
    const amount = parseFloat(value) || 0;
    setReceipts((prev) =>
    prev.map((receipt) =>
    receipt.id === id ?
    {
      ...receipt,
      refundAmount: Math.min(amount, receipt.refundable)
    } :
    receipt
    )
    );
  };

  // Calculate Total Refund
  const calculateTotalRefund = () => {
    return receipts.
    filter((r) => r.selected).
    reduce((sum, receipt) => sum + receipt.refundAmount, 0);
  };

  // Reset Refund Form
  const resetRefundForm = () => {
    setRefundDate(new Date().toISOString().split('T')[0]);
    setPaymentMode('');
    setReferenceNo('');
    setReason('');
  };

  // Process Refund
  const handleProcessRefund = () => {
    const totalRefund = calculateTotalRefund();

    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    if (totalRefund === 0) {
      alert('Please enter refund amounts');
      return;
    }

    if (!paymentMode) {
      alert('Please select payment mode');
      return;
    }

    if (!reason) {
      alert('Please enter reason for refund');
      return;
    }

    const selectedReceipts = receipts.filter((r) => r.selected && r.refundAmount > 0);

    const refundData = {
      student: selectedStudent,
      receipts: selectedReceipts,
      totalRefund,
      refundDate,
      paymentMode,
      referenceNo,
      reason,
      processedAt: new Date().toISOString()
    };

    console.log('Processing Refund:', refundData);
    alert(`Refund of ₹${totalRefund.toFixed(2)} processed successfully!`);

    // Reset form
    handleClearStudent();
  };

  // Table Columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      onChange={handleSelectAll}
      checked={receipts.length > 0 && receipts.every((r) => r.selected)} />,


    render: (row: Receipt) =>
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={row.selected}
      onChange={() => handleToggleReceipt(row.id)} />


  },
  {
    key: 'no',
    header: 'Receipt No',
    render: (row: Receipt) =>
    <span className="font-medium text-gray-900">{row.no}</span>

  },
  {
    key: 'date',
    header: 'Date',
    render: (row: Receipt) =>
    <span className="text-gray-600">
          {new Date(row.date).toLocaleDateString('en-IN')}
        </span>

  },
  {
    key: 'head',
    header: 'Fee Head',
    render: (row: Receipt) =>
    <span className="text-gray-700">{row.head}</span>

  },
  {
    key: 'paidAmount',
    header: 'Paid Amount',
    render: (row: Receipt) =>
    <span className="font-medium text-gray-900">
          ₹{row.paidAmount.toLocaleString('en-IN')}
        </span>

  },
  {
    key: 'refundable',
    header: 'Refundable',
    render: (row: Receipt) =>
    <span className="font-medium text-green-600">
          ₹{row.refundable.toLocaleString('en-IN')}
        </span>

  },
  {
    key: 'refund',
    header: 'Refund Amount',
    render: (row: Receipt) =>
    <Input
      type="number"
      className="w-32"
      placeholder="0.00"
      value={row.refundAmount || ''}
      onChange={(e) => handleRefundAmountChange(row.id, e.target.value)}
      disabled={!row.selected}
      min="0"
      max={row.refundable}
      step="0.01" />


  }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Refund Processing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Search students and process fee refunds with detailed tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Refund History
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Student & Receipt Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Search Card */}
          <Card title="Student Search">
            <div className="space-y-4">
              {/* Search Bar with Filters */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search by Name, Roll No, Admission No, or Contact..."
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />

                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}>

                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button onClick={handleSearch}>Search</Button>
              </div>

              {/* Advanced Filters */}
              {showFilters &&
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Select
                  label="Class"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  options={[
                  { value: '', label: 'All Classes' },
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
                  { value: '12', label: 'Class 12' }]
                  } />

                  <Select
                  label="Section"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  options={[
                  { value: '', label: 'All Sections' },
                  { value: 'A', label: 'Section A' },
                  { value: 'B', label: 'Section B' },
                  { value: 'C', label: 'Section C' },
                  { value: 'D', label: 'Section D' }]
                  } />

                </div>
              }

              {/* Search Results */}
              {searchResults.length > 0 &&
              <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                  {searchResults.map((student) =>
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.name}
                          </p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>Class: {student.class}-{student.section}</span>
                            <span>Roll: {student.rollNo}</span>
                            <span>Adm: {student.admissionNo}</span>
                          </div>
                          <div className="flex gap-4 mt-1 text-sm text-gray-500">
                            <span>Father: {student.fatherName}</span>
                            <span>Contact: {student.contactNo}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            Paid: ₹{student.totalPaid.toLocaleString('en-IN')}
                          </p>
                          {student.totalRefunded > 0 &&
                      <p className="text-sm text-red-600">
                              Refunded: ₹{student.totalRefunded.toLocaleString('en-IN')}
                            </p>
                      }
                        </div>
                      </div>
                    </div>
                )}
                </div>
              }

              {/* No Results */}
              {searchResults.length === 0 && searchTerm &&
              <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No students found matching your search criteria</p>
                </div>
              }
            </div>
          </Card>

          {/* Selected Student & Receipts */}
          {selectedStudent &&
          <Card title="Student Details & Fee Receipts">
              {/* Selected Student Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-blue-900">
                        {selectedStudent.name}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {selectedStudent.class}-{selectedStudent.section}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <div className="text-sm">
                        <span className="text-blue-700 font-medium">Roll No:</span>
                        <span className="text-blue-900 ml-2">{selectedStudent.rollNo}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-700 font-medium">Admission No:</span>
                        <span className="text-blue-900 ml-2">{selectedStudent.admissionNo}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-700 font-medium">Father's Name:</span>
                        <span className="text-blue-900 ml-2">{selectedStudent.fatherName}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-700 font-medium">Contact:</span>
                        <span className="text-blue-900 ml-2">{selectedStudent.contactNo}</span>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-3 pt-3 border-t border-blue-200">
                      <div>
                        <p className="text-xs text-blue-700">Total Paid</p>
                        <p className="text-lg font-bold text-green-700">
                          ₹{selectedStudent.totalPaid.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Already Refunded</p>
                        <p className="text-lg font-bold text-red-600">
                          ₹{selectedStudent.totalRefunded.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Available for Refund</p>
                        <p className="text-lg font-bold text-blue-900">
                          ₹{(selectedStudent.totalPaid - selectedStudent.totalRefunded).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearStudent}>

                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Receipts Table */}
              {receipts.length > 0 ?
            <div>
                  <div className="mb-3 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Select receipts to process refund
                    </p>
                    <p className="text-sm text-gray-500">
                      {receipts.filter((r) => r.selected).length} of {receipts.length} selected
                    </p>
                  </div>
                  <Table columns={columns} data={receipts} />
                </div> :

            <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No fee receipts found for this student</p>
                </div>
            }
            </Card>
          }
        </div>

        {/* Right Section - Refund Details */}
        <div>
          <Card title="Refund Processing">
            <div className="space-y-5">
              {/* Refund Date */}
              <div>
                <Input
                  label="Refund Date"
                  type="date"
                  value={refundDate}
                  onChange={(e) => setRefundDate(e.target.value)}
                  required />

              </div>

              {/* Payment Mode */}
              <div>
                <Select
                  label="Payment Mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  required
                  options={[
                  { value: '', label: 'Select Payment Mode' },
                  { value: 'cash', label: 'Cash' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'dd', label: 'Demand Draft' },
                  { value: 'neft', label: 'NEFT' },
                  { value: 'rtgs', label: 'RTGS' },
                  { value: 'imps', label: 'IMPS' },
                  { value: 'upi', label: 'UPI' }]
                  } />

              </div>

              {/* Reference Number */}
              {paymentMode && paymentMode !== 'cash' &&
              <div>
                  <Input
                  label={
                  paymentMode === 'cheque' ?
                  'Cheque Number' :
                  paymentMode === 'dd' ?
                  'DD Number' :
                  paymentMode === 'upi' ?
                  'UPI Transaction ID' :
                  'Transaction Reference Number'
                  }
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder={`Enter ${paymentMode.toUpperCase()} reference`}
                  required />

                </div>
              }

              {/* Bank Details for Electronic Transfers */}
              {['neft', 'rtgs', 'imps'].includes(paymentMode) &&
              <>
                  <div>
                    <Input
                    label="Bank Name"
                    placeholder="Enter bank name" />

                  </div>
                  <div>
                    <Input
                    label="Account Number"
                    placeholder="Enter account number" />

                  </div>
                </>
              }

              {/* Reason for Refund */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter detailed reason for refund..."
                  required />

              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Any additional information..." />

              </div>

              {/* Summary Section */}
              <div className="pt-5 border-t border-gray-200">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selected Receipts:</span>
                    <span className="font-medium text-gray-900">
                      {receipts.filter((r) => r.selected).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Refundable Amount:</span>
                    <span className="font-medium text-gray-900">
                      ₹
                      {receipts.
                      filter((r) => r.selected).
                      reduce((sum, r) => sum + r.refundable, 0).
                      toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total Refund:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{calculateTotalRefund().toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>

                {/* Process Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleProcessRefund}
                  disabled={!selectedStudent || calculateTotalRefund() === 0}>

                  <RotateCcw className="w-4 h-4 mr-2" />
                  Process Refund
                </Button>

                {/* Help Text */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  Please verify all details before processing the refund
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          {selectedStudent &&
          <Card title="Quick Stats" className="mt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">Total Paid</span>
                  <span className="font-bold text-green-900">
                    ₹{selectedStudent.totalPaid.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-700">Prev. Refunded</span>
                  <span className="font-bold text-red-900">
                    ₹{selectedStudent.totalRefunded.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">Current Refund</span>
                  <span className="font-bold text-blue-900">
                    ₹{calculateTotalRefund().toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <span className="text-sm text-gray-700 font-medium">Net Balance</span>
                  <span className="font-bold text-gray-900">
                    ₹
                    {(
                  selectedStudent.totalPaid -
                  selectedStudent.totalRefunded -
                  calculateTotalRefund()).
                  toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}