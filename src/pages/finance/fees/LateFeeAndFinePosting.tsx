import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import {
  Calculator,
  Save,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X } from
'lucide-react';

interface Student {
  id: number;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  fatherName: string;
  phoneNumber: string;
  installmentType: string;
  dueDate: string;
  dueAmount: number;
  daysOverdue: number;
  calculatedFine: number;
  totalAmount: number;
  lastPaymentDate: string;
  status: 'pending' | 'partial' | 'defaulter';
}

export function LateFeeAndFinePosting() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    installment: '',
    daysOverdue: '',
    amountRange: '',
    status: ''
  });

  const [fineConfig, setFineConfig] = useState({
    firstTierDays: 10,
    firstTierAmount: 50,
    secondTierAmount: 100
  });

  const defaulters: Student[] = [
  {
    id: 1,
    rollNo: 'STU001',
    name: 'Rahul Sharma',
    class: '10',
    section: 'A',
    fatherName: 'Rajesh Sharma',
    phoneNumber: '+91 98765 43210',
    installmentType: 'Term 1',
    dueDate: '2024-02-15',
    dueAmount: 25000,
    daysOverdue: 15,
    calculatedFine: 750,
    totalAmount: 25750,
    lastPaymentDate: '2023-11-20',
    status: 'defaulter'
  },
  {
    id: 2,
    rollNo: 'STU002',
    name: 'Priya Patel',
    class: '10',
    section: 'B',
    fatherName: 'Suresh Patel',
    phoneNumber: '+91 98765 43211',
    installmentType: 'Term 1',
    dueDate: '2024-02-15',
    dueAmount: 15000,
    daysOverdue: 10,
    calculatedFine: 500,
    totalAmount: 15500,
    lastPaymentDate: '2023-12-01',
    status: 'defaulter'
  },
  {
    id: 3,
    rollNo: 'STU003',
    name: 'Amit Kumar',
    class: '10',
    section: 'A',
    fatherName: 'Vijay Kumar',
    phoneNumber: '+91 98765 43212',
    installmentType: 'Term 1',
    dueDate: '2024-02-15',
    dueAmount: 30000,
    daysOverdue: 20,
    calculatedFine: 1500,
    totalAmount: 31500,
    lastPaymentDate: '2023-10-15',
    status: 'defaulter'
  },
  {
    id: 4,
    rollNo: 'STU004',
    name: 'Sneha Desai',
    class: '9',
    section: 'C',
    fatherName: 'Ramesh Desai',
    phoneNumber: '+91 98765 43213',
    installmentType: 'Term 1',
    dueDate: '2024-02-15',
    dueAmount: 20000,
    daysOverdue: 7,
    calculatedFine: 350,
    totalAmount: 20350,
    lastPaymentDate: '2024-01-05',
    status: 'pending'
  },
  {
    id: 5,
    rollNo: 'STU005',
    name: 'Rohan Mehta',
    class: '11',
    section: 'A',
    fatherName: 'Prakash Mehta',
    phoneNumber: '+91 98765 43214',
    installmentType: 'Term 2',
    dueDate: '2024-02-15',
    dueAmount: 18000,
    daysOverdue: 12,
    calculatedFine: 700,
    totalAmount: 18700,
    lastPaymentDate: '2023-11-30',
    status: 'defaulter'
  }];


  const calculateFine = (daysOverdue: number): number => {
    if (daysOverdue <= fineConfig.firstTierDays) {
      return daysOverdue * fineConfig.firstTierAmount;
    } else {
      return (
        fineConfig.firstTierDays * fineConfig.firstTierAmount +
        (daysOverdue - fineConfig.firstTierDays) * fineConfig.secondTierAmount);

    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredData.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    }
  };

  const filteredData = defaulters.filter((student) => {
    const matchesSearch =
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phoneNumber.includes(searchTerm);

    const matchesClass = !filters.class || student.class === filters.class;
    const matchesSection =
    !filters.section || student.section === filters.section;
    const matchesInstallment =
    !filters.installment || student.installmentType === filters.installment;
    const matchesStatus = !filters.status || student.status === filters.status;
    const matchesDaysOverdue =
    !filters.daysOverdue ||
    filters.daysOverdue === '0-7' && student.daysOverdue <= 7 ||
    filters.daysOverdue === '8-15' &&
    student.daysOverdue > 7 &&
    student.daysOverdue <= 15 ||
    filters.daysOverdue === '16-30' &&
    student.daysOverdue > 15 &&
    student.daysOverdue <= 30 ||
    filters.daysOverdue === '30+' && student.daysOverdue > 30;

    return (
      matchesSearch &&
      matchesClass &&
      matchesSection &&
      matchesInstallment &&
      matchesStatus &&
      matchesDaysOverdue);

  });

  const totalDueAmount = filteredData.reduce(
    (sum, student) => sum + student.dueAmount,
    0
  );
  const totalFineAmount = filteredData.reduce(
    (sum, student) => sum + student.calculatedFine,
    0
  );
  const totalAmount = filteredData.reduce(
    (sum, student) => sum + student.totalAmount,
    0
  );

  const selectedTotalDue = defaulters.
  filter((s) => selectedStudents.includes(s.id)).
  reduce((sum, student) => sum + student.dueAmount, 0);
  const selectedTotalFine = defaulters.
  filter((s) => selectedStudents.includes(s.id)).
  reduce((sum, student) => sum + student.calculatedFine, 0);
  const selectedTotal = defaulters.
  filter((s) => selectedStudents.includes(s.id)).
  reduce((sum, student) => sum + student.totalAmount, 0);

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      onChange={(e) => handleSelectAll(e.target.checked)}
      checked={
      selectedStudents.length === filteredData.length &&
      filteredData.length > 0
      } />,


    render: (row: Student) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedStudents.includes(row.id)}
      onChange={(e) => handleSelectStudent(row.id, e.target.checked)} />


  },
  {
    key: 'rollNo',
    header: 'Roll No',
    render: (row: Student) =>
    <span className="font-medium text-gray-900">{row.rollNo}</span>

  },
  {
    key: 'name',
    header: 'Student Details',
    render: (row: Student) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.fatherName}</div>
          <div className="text-sm text-gray-500">{row.phoneNumber}</div>
        </div>

  },
  {
    key: 'class',
    header: 'Class/Section',
    render: (row: Student) =>
    <span className="text-gray-900">
          {row.class}-{row.section}
        </span>

  },
  {
    key: 'installment',
    header: 'Installment',
    render: (row: Student) =>
    <div>
          <div className="font-medium text-gray-900">{row.installmentType}</div>
          <div className="text-xs text-gray-500">Due: {row.dueDate}</div>
        </div>

  },
  {
    key: 'dueAmount',
    header: 'Due Amount',
    render: (row: Student) =>
    <span className="font-semibold text-gray-900">
          ₹{row.dueAmount.toLocaleString()}
        </span>

  },
  {
    key: 'daysOverdue',
    header: 'Days Overdue',
    render: (row: Student) =>
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      row.daysOverdue > 15 ?
      'bg-red-100 text-red-800' :
      row.daysOverdue > 7 ?
      'bg-orange-100 text-orange-800' :
      'bg-yellow-100 text-yellow-800'}`
      }>

          {row.daysOverdue} days
        </span>

  },
  {
    key: 'fine',
    header: 'Fine Amount',
    render: (row: Student) =>
    <Input
      className="w-28"
      defaultValue={row.calculatedFine}
      type="number" />


  },
  {
    key: 'total',
    header: 'Total Amount',
    render: (row: Student) =>
    <span className="font-bold text-indigo-600">
          ₹{row.totalAmount.toLocaleString()}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Student) =>
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      row.status === 'defaulter' ?
      'bg-red-100 text-red-800' :
      row.status === 'partial' ?
      'bg-orange-100 text-orange-800' :
      'bg-yellow-100 text-yellow-800'}`
      }>

          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>

  }];


  const handleResetFilters = () => {
    setFilters({
      class: '',
      section: '',
      installment: '',
      daysOverdue: '',
      amountRange: '',
      status: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Late Fee & Fine Posting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Calculate and post late fees for overdue payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Fine Configuration Card */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Fine Calculation Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-indigo-700 font-medium">
                  First Tier Days
                </label>
                <Input
                  type="number"
                  value={fineConfig.firstTierDays}
                  onChange={(e) =>
                  setFineConfig({
                    ...fineConfig,
                    firstTierDays: parseInt(e.target.value)
                  })
                  }
                  className="mt-1" />

              </div>
              <div>
                <label className="text-xs text-indigo-700 font-medium">
                  First Tier Rate (₹/day)
                </label>
                <Input
                  type="number"
                  value={fineConfig.firstTierAmount}
                  onChange={(e) =>
                  setFineConfig({
                    ...fineConfig,
                    firstTierAmount: parseInt(e.target.value)
                  })
                  }
                  className="mt-1" />

              </div>
              <div>
                <label className="text-xs text-indigo-700 font-medium">
                  Second Tier Rate (₹/day)
                </label>
                <Input
                  type="number"
                  value={fineConfig.secondTierAmount}
                  onChange={(e) =>
                  setFineConfig({
                    ...fineConfig,
                    secondTierAmount: parseInt(e.target.value)
                  })
                  }
                  className="mt-1" />

              </div>
            </div>
            <p className="text-sm text-indigo-700 mt-3">
              Current Rule: ₹{fineConfig.firstTierAmount} per day for first{' '}
              {fineConfig.firstTierDays} days, then ₹{fineConfig.secondTierAmount}{' '}
              per day thereafter
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Filter Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Search & Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}>

            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by student name, roll no, father's name, or phone number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
        </div>

        {/* Filters */}
        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select
            label="Class"
            value={filters.class}
            onChange={(e) =>
            setFilters({ ...filters, class: e.target.value })
            }
            options={[
            { value: '', label: 'All Classes' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            } />

            <Select
            label="Section"
            value={filters.section}
            onChange={(e) =>
            setFilters({ ...filters, section: e.target.value })
            }
            options={[
            { value: '', label: 'All Sections' },
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' }]
            } />

            <Select
            label="Installment"
            value={filters.installment}
            onChange={(e) =>
            setFilters({ ...filters, installment: e.target.value })
            }
            options={[
            { value: '', label: 'All Installments' },
            { value: 'Term 1', label: 'Term 1' },
            { value: 'Term 2', label: 'Term 2' },
            { value: 'Term 3', label: 'Term 3' }]
            } />

            <Select
            label="Days Overdue"
            value={filters.daysOverdue}
            onChange={(e) =>
            setFilters({ ...filters, daysOverdue: e.target.value })
            }
            options={[
            { value: '', label: 'All' },
            { value: '0-7', label: '0-7 days' },
            { value: '8-15', label: '8-15 days' },
            { value: '16-30', label: '16-30 days' },
            { value: '30+', label: '30+ days' }]
            } />

            <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
            }
            options={[
            { value: '', label: 'All Status' },
            { value: 'defaulter', label: 'Defaulter' },
            { value: 'pending', label: 'Pending' },
            { value: 'partial', label: 'Partial' }]
            } />

            <div className="flex items-end">
              <Button
              variant="outline"
              className="w-full"
              onClick={handleResetFilters}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Students
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {filteredData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Total Due Amount
              </p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{totalDueAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">
                Total Fine Amount
              </p>
              <p className="text-2xl font-bold text-red-900">
                ₹{totalFineAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Calculator className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Grand Total
              </p>
              <p className="text-2xl font-bold text-indigo-900">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Students Summary */}
      {selectedStudents.length > 0 &&
      <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  {selectedStudents.length} student(s) selected
                </p>
                <p className="text-sm text-green-700">
                  Due: ₹{selectedTotalDue.toLocaleString()} | Fine: ₹
                  {selectedTotalFine.toLocaleString()} | Total: ₹
                  {selectedTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStudents([])}>

              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      }

      {/* Main Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Defaulter List ({filteredData.length})
          </h3>
          <Button variant="outline" size="sm">
            <Calculator className="w-4 h-4 mr-2" />
            Recalculate All Fines
          </Button>
        </div>

        <Table columns={columns} data={filteredData} />

        {filteredData.length === 0 &&
        <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No students found matching your criteria</p>
          </div>
        }
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedStudents.length > 0 ?
            <span>
                Ready to post late fees for {selectedStudents.length} student(s)
              </span> :

            <span>Select students to post late fees</span>
            }
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={selectedStudents.length === 0}>

              Send Notifications
            </Button>
            <Button
              variant="primary"
              disabled={selectedStudents.length === 0}>

              <Save className="w-4 h-4 mr-2" />
              Post Late Fees ({selectedStudents.length})
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}