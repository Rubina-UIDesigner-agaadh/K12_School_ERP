import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  CheckCircle,
  XCircle,
  Search,
  Download,
  Filter,
  Eye,
  Calendar,
  Building2,
  Hash,
  User,
  IndianRupee,
  Clock,
  AlertCircle,
  FileText } from
'lucide-react';

interface Cheque {
  id: string;
  receiptNo: string;
  receiptDate: string;
  studentId: string;
  studentName: string;
  class: string;
  rollNo: string;
  bank: string;
  branch: string;
  chequeNo: string;
  chequeDate: string;
  depositDate: string;
  amount: number;
  status: 'Pending' | 'Cleared' | 'Bounced';
  feeType: string;
  remarks?: string;
  clearanceDate?: string;
  bounceReason?: string;
}

export function ReceiptChequeClear() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCheques, setSelectedCheques] = useState<string[]>([]);

  const cheques: Cheque[] = [
  {
    id: '1',
    receiptNo: 'RCP-2024-101',
    receiptDate: '2024-03-08',
    studentId: 'STU-2024-001',
    studentName: 'Rahul Sharma',
    class: 'Class 10-A',
    rollNo: '25',
    bank: 'HDFC Bank',
    branch: 'Connaught Place',
    chequeNo: 'CHQ-889945',
    chequeDate: '2024-03-08',
    depositDate: '2024-03-09',
    amount: 25000,
    status: 'Pending',
    feeType: 'Term Fee',
    remarks: 'Regular payment'
  },
  {
    id: '2',
    receiptNo: 'RCP-2024-105',
    receiptDate: '2024-03-10',
    studentId: 'STU-2024-045',
    studentName: 'Priya Patel',
    class: 'Class 9-B',
    rollNo: '18',
    bank: 'State Bank of India',
    branch: 'Karol Bagh',
    chequeNo: 'CHQ-112233',
    chequeDate: '2024-03-10',
    depositDate: '2024-03-11',
    amount: 15000,
    status: 'Pending',
    feeType: 'Tuition Fee'
  },
  {
    id: '3',
    receiptNo: 'RCP-2024-098',
    receiptDate: '2024-03-05',
    studentId: 'STU-2024-032',
    studentName: 'Amit Kumar',
    class: 'Class 11-C',
    rollNo: '12',
    bank: 'ICICI Bank',
    branch: 'Rajouri Garden',
    chequeNo: 'CHQ-556677',
    chequeDate: '2024-03-05',
    depositDate: '2024-03-06',
    amount: 30000,
    status: 'Pending',
    feeType: 'Annual Fee',
    remarks: 'Full year payment'
  },
  {
    id: '4',
    receiptNo: 'RCP-2024-087',
    receiptDate: '2024-03-01',
    studentId: 'STU-2024-021',
    studentName: 'Sneha Gupta',
    class: 'Class 8-A',
    rollNo: '07',
    bank: 'Axis Bank',
    branch: 'Pitampura',
    chequeNo: 'CHQ-998877',
    chequeDate: '2024-03-01',
    depositDate: '2024-03-02',
    amount: 18000,
    status: 'Cleared',
    feeType: 'Term Fee',
    clearanceDate: '2024-03-15'
  },
  {
    id: '5',
    receiptNo: 'RCP-2024-092',
    receiptDate: '2024-03-03',
    studentId: 'STU-2024-067',
    studentName: 'Rohan Verma',
    class: 'Class 12-B',
    rollNo: '22',
    bank: 'Punjab National Bank',
    branch: 'Rohini',
    chequeNo: 'CHQ-445566',
    chequeDate: '2024-03-03',
    depositDate: '2024-03-04',
    amount: 22000,
    status: 'Bounced',
    feeType: 'Exam Fee',
    bounceReason: 'Insufficient funds',
    clearanceDate: '2024-03-14'
  },
  {
    id: '6',
    receiptNo: 'RCP-2024-110',
    receiptDate: '2024-03-12',
    studentId: 'STU-2024-089',
    studentName: 'Kavya Singh',
    class: 'Class 10-C',
    rollNo: '15',
    bank: 'HDFC Bank',
    branch: 'Dwarka',
    chequeNo: 'CHQ-778899',
    chequeDate: '2024-03-12',
    depositDate: '2024-03-13',
    amount: 20000,
    status: 'Pending',
    feeType: 'Term Fee'
  }];


  const getStatusBadge = (status: Cheque['status']) => {
    const variants = {
      Pending: 'warning',
      Cleared: 'success',
      Bounced: 'danger'
    };
    return (
      <Badge variant={variants[status] as any}>
        {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'Cleared' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'Bounced' && <AlertCircle className="w-3 h-3 mr-1" />}
        {status}
      </Badge>);

  };

  const handleClearCheque = (chequeId: string) => {
    console.log('Clearing cheque:', chequeId);
    // Add modal for clearance confirmation with date
  };

  const handleBounceCheque = (chequeId: string) => {
    console.log('Bouncing cheque:', chequeId);
    // Add modal for bounce reason
  };

  const handleViewDetails = (cheque: Cheque) => {
    console.log('Viewing details:', cheque);
    // Add modal for full details
  };

  const handleBulkClear = () => {
    console.log('Bulk clearing:', selectedCheques);
  };

  const handleSelectCheque = (chequeId: string) => {
    setSelectedCheques((prev) =>
    prev.includes(chequeId) ?
    prev.filter((id) => id !== chequeId) :
    [...prev, chequeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCheques.length === filteredCheques.length) {
      setSelectedCheques([]);
    } else {
      setSelectedCheques(filteredCheques.map((c) => c.id));
    }
  };

  const filteredCheques = cheques.filter((cheque) => {
    const matchesSearch =
    cheque.chequeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cheque.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cheque.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cheque.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
    statusFilter === 'all' ||
    cheque.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesBank =
    bankFilter === 'all' || cheque.bank === bankFilter;

    const matchesDateRange =
    (!fromDate || cheque.depositDate >= fromDate) && (
    !toDate || cheque.depositDate <= toDate);

    return matchesSearch && matchesStatus && matchesBank && matchesDateRange;
  });

  const banks = Array.from(new Set(cheques.map((c) => c.bank)));

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={
      selectedCheques.length === filteredCheques.length &&
      filteredCheques.length > 0
      }
      onChange={handleSelectAll}
      className="rounded border-gray-300" />,


    render: (row: Cheque) =>
    <input
      type="checkbox"
      checked={selectedCheques.includes(row.id)}
      onChange={() => handleSelectCheque(row.id)}
      className="rounded border-gray-300" />


  },
  {
    key: 'receipt',
    header: 'Receipt Information',
    render: (row: Cheque) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{row.receiptNo}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(row.receiptDate).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="text-xs text-gray-600">{row.feeType}</div>
        </div>

  },
  {
    key: 'student',
    header: 'Student Details',
    render: (row: Cheque) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{row.studentName}</span>
          </div>
          <div className="text-xs text-gray-600">{row.class}</div>
          <div className="text-xs text-gray-500">
            Roll No: {row.rollNo} • ID: {row.studentId}
          </div>
        </div>

  },
  {
    key: 'bank',
    header: 'Bank Details',
    render: (row: Cheque) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{row.bank}</span>
          </div>
          <div className="text-xs text-gray-600">{row.branch}</div>
        </div>

  },
  {
    key: 'cheque',
    header: 'Cheque Information',
    render: (row: Cheque) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="font-mono font-semibold text-gray-900">
              {row.chequeNo}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Date: {new Date(row.chequeDate).toLocaleDateString('en-IN')}
          </div>
          <div className="text-xs text-gray-500">
            Deposited: {new Date(row.depositDate).toLocaleDateString('en-IN')}
          </div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: Cheque) =>
    <div className="flex items-center gap-1 font-bold text-gray-900">
          <IndianRupee className="w-4 h-4" />
          <span>{row.amount.toLocaleString('en-IN')}</span>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Cheque) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          {row.clearanceDate &&
      <div className="text-xs text-gray-500">
              {new Date(row.clearanceDate).toLocaleDateString('en-IN')}
            </div>
      }
          {row.bounceReason &&
      <div className="text-xs text-red-600">{row.bounceReason}</div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Cheque) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewDetails(row)}
        title="View Details"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">

            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'Pending' &&
      <>
              <Button
          variant="ghost"
          size="sm"
          onClick={() => handleClearCheque(row.id)}
          title="Mark as Cleared"
          className="text-green-600 hover:text-green-700 hover:bg-green-50">

                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
          variant="ghost"
          size="sm"
          onClick={() => handleBounceCheque(row.id)}
          title="Mark as Bounced"
          className="text-red-600 hover:text-red-700 hover:bg-red-50">

                <XCircle className="w-4 h-4" />
              </Button>
            </>
      }
        </div>

  }];


  const pendingCount = cheques.filter((c) => c.status === 'Pending').length;
  const clearedCount = cheques.filter((c) => c.status === 'Cleared').length;
  const bouncedCount = cheques.filter((c) => c.status === 'Bounced').length;
  const totalPendingAmount = cheques.
  filter((c) => c.status === 'Pending').
  reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cheque Clearance Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and update the status of cheque payments received from students
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-gray-600">
              <span className="font-semibold text-orange-600">{pendingCount}</span> Pending
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              <span className="font-semibold text-green-600">{clearedCount}</span> Cleared
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              <span className="font-semibold text-red-600">{bouncedCount}</span> Bounced
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              Pending Amount:{' '}
              <span className="font-semibold text-gray-900">
                ₹{totalPendingAmount.toLocaleString('en-IN')}
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedCheques.length > 0 &&
          <Button
            variant="primary"
            onClick={handleBulkClear}
            className="bg-green-600 hover:bg-green-700">

              <CheckCircle className="w-4 h-4 mr-2" />
              Clear Selected ({selectedCheques.length})
            </Button>
          }
          <Button variant="outline" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Cheques
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}>

              {showFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by Cheque No, Receipt No, Student Name or Bank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

            </div>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'cleared', label: 'Cleared' },
              { value: 'bounced', label: 'Bounced' }]
              } />

            <Select
              label="Bank"
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              options={[
              { value: 'all', label: 'All Banks' },
              ...banks.map((bank) => ({ value: bank, label: bank }))]
              } />

          </div>

          {showFilters &&
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <Input
              type="date"
              label="Deposit From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} />

              <Input
              type="date"
              label="Deposit To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} />

              <Select
              label="Fee Type"
              options={[
              { value: 'all', label: 'All Fee Types' },
              { value: 'term', label: 'Term Fee' },
              { value: 'tuition', label: 'Tuition Fee' },
              { value: 'annual', label: 'Annual Fee' },
              { value: 'exam', label: 'Exam Fee' }]
              } />

              <div className="flex items-end">
                <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFromDate('');
                  setToDate('');
                  setStatusFilter('all');
                  setBankFilter('all');
                }}
                className="w-full">

                  Clear All Filters
                </Button>
              </div>
            </div>
          }

          <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
            <span>
              Showing <span className="font-semibold">{filteredCheques.length}</span>{' '}
              of <span className="font-semibold">{cheques.length}</span> cheques
            </span>
            {selectedCheques.length > 0 &&
            <span className="text-blue-600 font-medium">
                {selectedCheques.length} cheque(s) selected
              </span>
            }
          </div>
        </div>
      </Card>

      {/* Cheques Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredCheques} />
        </div>
        
        {filteredCheques.length === 0 &&
        <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Cheques Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        }
      </Card>

      {/* Summary Footer */}
      <Card className="p-4 bg-gray-50 border-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Total Cheques</div>
            <div className="text-2xl font-bold text-gray-900">{cheques.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Pending Clearance</div>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Successfully Cleared</div>
            <div className="text-2xl font-bold text-green-600">{clearedCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Bounced Cheques</div>
            <div className="text-2xl font-bold text-red-600">{bouncedCount}</div>
          </div>
        </div>
      </Card>
    </div>);

}