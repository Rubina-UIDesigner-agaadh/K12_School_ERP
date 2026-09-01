import React, {
  useMemo,
  useState,
  Suspense,
  createElement,
  Component } from
'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  ArrowUpDown,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Building2,
  ChevronDown,
  GraduationCap } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// Types
interface Transaction {
  id: number;
  date: string;
  voucherNo: string;
  voucherType: 'Receipt' | 'Payment' | 'Journal' | 'Contra';
  accountDebited: string;
  accountCredited: string;
  debitAmount: number;
  creditAmount: number;
  narration: string;
  enteredBy: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  referenceNo?: string;
  chequeNo?: string;
  bankName?: string;
  branch: string;
}
interface BranchInfo {
  id: string;
  name: string;
  code: string;
}
// Constants
const BATCHES = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];
const BRANCHES: BranchInfo[] = [
{
  id: 'cse',
  name: 'Computer Science',
  code: 'CSE'
},
{
  id: 'ece',
  name: 'Electronics & Comm',
  code: 'ECE'
},
{
  id: 'me',
  name: 'Mechanical Eng',
  code: 'ME'
},
{
  id: 'ce',
  name: 'Civil Engineering',
  code: 'CE'
},
{
  id: 'ee',
  name: 'Electrical Eng',
  code: 'EE'
}];

const VOUCHER_TYPES = [
{
  value: 'all',
  label: 'All Types'
},
{
  value: 'Receipt',
  label: 'Receipt'
},
{
  value: 'Payment',
  label: 'Payment'
},
{
  value: 'Journal',
  label: 'Journal'
},
{
  value: 'Contra',
  label: 'Contra'
}];

const USERS = [
{
  value: 'all',
  label: 'All Users'
},
{
  value: 'Admin',
  label: 'Admin'
},
{
  value: 'Accountant',
  label: 'Accountant'
},
{
  value: 'Cashier',
  label: 'Cashier'
},
{
  value: 'Principal',
  label: 'Principal'
},
{
  value: 'Librarian',
  label: 'Librarian'
},
{
  value: 'Transport Incharge',
  label: 'Transport Incharge'
},
{
  value: 'Hostel Warden',
  label: 'Hostel Warden'
}];

const STATUSES = [
{
  value: 'all',
  label: 'All Status'
},
{
  value: 'Approved',
  label: 'Approved'
},
{
  value: 'Pending',
  label: 'Pending'
},
{
  value: 'Rejected',
  label: 'Rejected'
}];

// Multi-Select Dropdown Component
const MultiSelectDropdown: React.FC<{
  options: {
    value: string;
    label: string;
  }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  icon?: React.ReactNode;
}> = ({ options, selected, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = selected.length === options.length;
  const toggleAll = () =>
  onChange(allSelected ? [] : options.map((o) => o.value));
  const toggleOption = (value: string) =>
  onChange(
    selected.includes(value) ?
    selected.filter((s) => s !== value) :
    [...selected, value]
  );
  const displayText =
  selected.length === 0 ?
  placeholder :
  selected.length === options.length ?
  'All Branches' :
  `${selected.length} Selected`;
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg bg-white min-w-[180px] hover:border-blue-400 transition-colors">

        <span className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-700">{displayText}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

      </button>
      {isOpen &&
      <>
          <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)} />

          <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2 border-b">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="font-medium text-sm">Select All</span>
              </label>
            </div>
            <div className="p-2">
              {options.map((opt) =>
            <label
              key={opt.value}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">

                  <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
                className="w-4 h-4 text-blue-600 rounded" />

                  <span className="text-sm">{opt.label}</span>
                </label>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};
// Helper Functions
const formatDate = (value: string) =>
new Date(value).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const formatMoney = (value: number) => value.toLocaleString('en-IN');
const getVoucherStyle = (type: string) =>
({
  Receipt: 'bg-green-100 text-green-800',
  Payment: 'bg-red-100 text-red-800',
  Journal: 'bg-blue-100 text-blue-800',
  Contra: 'bg-purple-100 text-purple-800'
})[type] || 'bg-gray-100 text-gray-800';
const getStatusStyle = (status: string) =>
({
  Approved: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800'
})[status] || 'bg-gray-100 text-gray-800';
const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
// Mock Data with Branch
const generateTransactions = (): Transaction[] => {
  const branches = ['CSE', 'ECE', 'ME', 'CE', 'EE'];
  const baseData: Omit<Transaction, 'branch'>[] = [
  {
    id: 1,
    date: '2024-01-01',
    voucherNo: 'RCP-001',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Opening Balance',
    debitAmount: 100000,
    creditAmount: 100000,
    narration: 'Opening cash balance for new financial year',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'OB-2024-001'
  },
  {
    id: 2,
    date: '2024-01-01',
    voucherNo: 'RCP-002',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Opening Balance',
    debitAmount: 500000,
    creditAmount: 500000,
    narration: 'Opening bank balance - SBI Main Account',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'OB-2024-002',
    bankName: 'State Bank of India'
  },
  {
    id: 3,
    date: '2024-01-02',
    voucherNo: 'RCP-003',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 10',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Tuition fee Q3 - Rahul Kumar (STU001) Class 10-A',
    enteredBy: 'Cashier',
    status: 'Approved',
    referenceNo: 'FEE-2024-001'
  },
  {
    id: 4,
    date: '2024-01-02',
    voucherNo: 'RCP-004',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Tuition Fee - Class 12',
    debitAmount: 18000,
    creditAmount: 18000,
    narration: 'Tuition fee Q3 - Priya Sharma (STU002) Class 12-Science',
    enteredBy: 'Cashier',
    status: 'Approved',
    referenceNo: 'FEE-2024-002',
    chequeNo: 'CHQ-445567',
    bankName: 'HDFC Bank'
  },
  {
    id: 5,
    date: '2024-01-02',
    voucherNo: 'RCP-005',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Transport Fee',
    debitAmount: 5000,
    creditAmount: 5000,
    narration: 'Transport fee - January 2024 - Amit Singh (STU003)',
    enteredBy: 'Transport Incharge',
    status: 'Approved',
    referenceNo: 'TRN-2024-001'
  },
  {
    id: 6,
    date: '2024-01-03',
    voucherNo: 'PAY-001',
    voucherType: 'Payment',
    accountDebited: 'Salary Expense - Teaching Staff',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 250000,
    creditAmount: 250000,
    narration: 'Salary payment December 2023 - Teaching Staff (15 teachers)',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'SAL-DEC-2023',
    chequeNo: 'CHQ-100234'
  },
  {
    id: 7,
    date: '2024-01-03',
    voucherNo: 'PAY-002',
    voucherType: 'Payment',
    accountDebited: 'Salary Expense - Non-Teaching Staff',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 85000,
    creditAmount: 85000,
    narration: 'Salary payment December 2023 - Non-Teaching Staff',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'SAL-NTS-DEC-2023',
    chequeNo: 'CHQ-100235'
  },
  {
    id: 8,
    date: '2024-01-03',
    voucherNo: 'PAY-003',
    voucherType: 'Payment',
    accountDebited: 'Electricity Expense',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 45000,
    creditAmount: 45000,
    narration: 'Electricity bill payment - December 2023 - MSEB',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'ELEC-DEC-2023'
  },
  {
    id: 9,
    date: '2024-01-04',
    voucherNo: 'RCP-006',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Admission Fee',
    debitAmount: 25000,
    creditAmount: 25000,
    narration: 'New admission fee - Sneha Patel (STU004) Class 6-A',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'ADM-2024-001'
  },
  {
    id: 10,
    date: '2024-01-04',
    voucherNo: 'RCP-007',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Library Fee',
    debitAmount: 2000,
    creditAmount: 2000,
    narration: 'Annual library fee - Sneha Patel (STU004)',
    enteredBy: 'Librarian',
    status: 'Approved',
    referenceNo: 'LIB-2024-001'
  },
  {
    id: 11,
    date: '2024-01-04',
    voucherNo: 'PAY-004',
    voucherType: 'Payment',
    accountDebited: 'Stationery Expense',
    accountCredited: 'Cash Account',
    debitAmount: 5500,
    creditAmount: 5500,
    narration: 'Office stationery purchase - Ravi Stationery Store',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'STN-2024-001'
  },
  {
    id: 12,
    date: '2024-01-05',
    voucherNo: 'CNT-001',
    voucherType: 'Contra',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Cash Account',
    debitAmount: 50000,
    creditAmount: 50000,
    narration: 'Cash deposited to SBI bank account',
    enteredBy: 'Cashier',
    status: 'Approved',
    referenceNo: 'DEP-2024-001'
  },
  {
    id: 13,
    date: '2024-01-05',
    voucherNo: 'RCP-008',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 8',
    debitAmount: 12000,
    creditAmount: 12000,
    narration: 'Tuition fee Q3 - Vikram Desai (STU005) Class 8-B',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 14,
    date: '2024-01-08',
    voucherNo: 'RCP-009',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - HDFC',
    accountCredited: 'Tuition Fee - Class 11',
    debitAmount: 16500,
    creditAmount: 16500,
    narration: 'Tuition fee Q3 - Ananya Reddy (STU006) Class 11-Commerce',
    enteredBy: 'Cashier',
    status: 'Approved',
    chequeNo: 'CHQ-778899',
    bankName: 'ICICI Bank'
  },
  {
    id: 15,
    date: '2024-01-08',
    voucherNo: 'RCP-010',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Exam Fee',
    debitAmount: 3500,
    creditAmount: 3500,
    narration: 'Board exam fee - Class 10 - Multiple students',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'EXAM-2024-001'
  },
  {
    id: 16,
    date: '2024-01-08',
    voucherNo: 'PAY-005',
    voucherType: 'Payment',
    accountDebited: 'Water Expense',
    accountCredited: 'Cash Account',
    debitAmount: 8500,
    creditAmount: 8500,
    narration: 'Water tanker charges - December 2023',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 17,
    date: '2024-01-09',
    voucherNo: 'JRN-001',
    voucherType: 'Journal',
    accountDebited: 'Depreciation Expense',
    accountCredited: 'Accumulated Depreciation - Furniture',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Monthly depreciation on school furniture - January 2024',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'DEP-FUR-JAN-24'
  },
  {
    id: 18,
    date: '2024-01-09',
    voucherNo: 'JRN-002',
    voucherType: 'Journal',
    accountDebited: 'Depreciation Expense',
    accountCredited: 'Accumulated Depreciation - Computers',
    debitAmount: 12000,
    creditAmount: 12000,
    narration: 'Monthly depreciation on computer lab equipment',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'DEP-COMP-JAN-24'
  },
  {
    id: 19,
    date: '2024-01-09',
    voucherNo: 'JRN-003',
    voucherType: 'Journal',
    accountDebited: 'Bad Debts',
    accountCredited: 'Fee Receivables',
    debitAmount: 8000,
    creditAmount: 8000,
    narration: 'Write off - Old pending fees of left student',
    enteredBy: 'Accountant',
    status: 'Pending',
    referenceNo: 'BD-2024-001'
  },
  {
    id: 20,
    date: '2024-01-10',
    voucherNo: 'RCP-011',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 9',
    debitAmount: 13500,
    creditAmount: 13500,
    narration: 'Tuition fee Q3 - Meera Joshi (STU007) Class 9-A',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 21,
    date: '2024-01-10',
    voucherNo: 'RCP-012',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Sports Fee',
    debitAmount: 3000,
    creditAmount: 3000,
    narration: 'Annual sports fee - Meera Joshi (STU007)',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 22,
    date: '2024-01-10',
    voucherNo: 'RCP-013',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Tuition Fee - Class 7',
    debitAmount: 11000,
    creditAmount: 11000,
    narration: 'Tuition fee Q3 - Arjun Nair (STU008) Class 7-C',
    enteredBy: 'Cashier',
    status: 'Approved',
    chequeNo: 'CHQ-223344'
  },
  {
    id: 23,
    date: '2024-01-11',
    voucherNo: 'PAY-006',
    voucherType: 'Payment',
    accountDebited: 'Printing & Publishing',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 35000,
    creditAmount: 35000,
    narration: 'Annual magazine printing charges',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'PRT-2024-001'
  },
  {
    id: 24,
    date: '2024-01-11',
    voucherNo: 'PAY-007',
    voucherType: 'Payment',
    accountDebited: 'Lab Equipment Expense',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 75000,
    creditAmount: 75000,
    narration: 'Science lab equipment purchase',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'LAB-2024-001'
  },
  {
    id: 25,
    date: '2024-01-11',
    voucherNo: 'PAY-008',
    voucherType: 'Payment',
    accountDebited: 'Internet Expense',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Quarterly internet charges - Jio Fiber',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 26,
    date: '2024-01-12',
    voucherNo: 'PAY-009',
    voucherType: 'Payment',
    accountDebited: 'Tea & Refreshment',
    accountCredited: 'Petty Cash',
    debitAmount: 1500,
    creditAmount: 1500,
    narration: 'Staff room tea & snacks - Week 2',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 27,
    date: '2024-01-12',
    voucherNo: 'PAY-010',
    voucherType: 'Payment',
    accountDebited: 'Cleaning Supplies',
    accountCredited: 'Petty Cash',
    debitAmount: 2500,
    creditAmount: 2500,
    narration: 'Cleaning materials - Phenyl, detergent, brooms',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 28,
    date: '2024-01-12',
    voucherNo: 'CNT-002',
    voucherType: 'Contra',
    accountDebited: 'Petty Cash',
    accountCredited: 'Cash Account',
    debitAmount: 10000,
    creditAmount: 10000,
    narration: 'Petty cash replenishment',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 29,
    date: '2024-01-15',
    voucherNo: 'RCP-014',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 10',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Tuition fee Q3 - Kavya Menon (STU009) Class 10-B',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 30,
    date: '2024-01-15',
    voucherNo: 'RCP-015',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Computer Lab Fee',
    debitAmount: 2500,
    creditAmount: 2500,
    narration: 'Computer lab fee - Kavya Menon (STU009)',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 31,
    date: '2024-01-15',
    voucherNo: 'RCP-016',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - HDFC',
    accountCredited: 'Donation Received',
    debitAmount: 100000,
    creditAmount: 100000,
    narration: 'Donation from Alumni Association for library',
    enteredBy: 'Principal',
    status: 'Approved',
    referenceNo: 'DON-2024-001'
  },
  {
    id: 32,
    date: '2024-01-15',
    voucherNo: 'PAY-011',
    voucherType: 'Payment',
    accountDebited: 'Building Maintenance',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 45000,
    creditAmount: 45000,
    narration: 'Classroom painting and whitewashing - Block A',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 33,
    date: '2024-01-15',
    voucherNo: 'JRN-004',
    voucherType: 'Journal',
    accountDebited: 'Prepaid Insurance',
    accountCredited: 'Insurance Expense',
    debitAmount: 5000,
    creditAmount: 5000,
    narration: 'Monthly insurance expense recognition',
    enteredBy: 'Accountant',
    status: 'Pending'
  },
  {
    id: 34,
    date: '2024-01-16',
    voucherNo: 'RCP-017',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Late Fee',
    debitAmount: 1500,
    creditAmount: 1500,
    narration: 'Late fee charges - Multiple students',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 35,
    date: '2024-01-16',
    voucherNo: 'PAY-012',
    voucherType: 'Payment',
    accountDebited: 'Security Services',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 25000,
    creditAmount: 25000,
    narration: 'Security guard services - January 2024',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 36,
    date: '2024-01-17',
    voucherNo: 'RCP-018',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Annual Day Contribution',
    debitAmount: 50000,
    creditAmount: 50000,
    narration: 'Annual day event contribution from parents',
    enteredBy: 'Admin',
    status: 'Approved',
    referenceNo: 'EVT-2024-001'
  },
  {
    id: 37,
    date: '2024-01-17',
    voucherNo: 'PAY-013',
    voucherType: 'Payment',
    accountDebited: 'Event Expense - Annual Day',
    accountCredited: 'Cash Account',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Stage decoration advance - Annual Day 2024',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 38,
    date: '2024-01-18',
    voucherNo: 'PAY-014',
    voucherType: 'Payment',
    accountDebited: 'Vehicle Fuel Expense',
    accountCredited: 'Cash Account',
    debitAmount: 25000,
    creditAmount: 25000,
    narration: 'Diesel for school buses - January 2024',
    enteredBy: 'Transport Incharge',
    status: 'Approved'
  },
  {
    id: 39,
    date: '2024-01-18',
    voucherNo: 'PAY-015',
    voucherType: 'Payment',
    accountDebited: 'Vehicle Maintenance',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 18000,
    creditAmount: 18000,
    narration: 'Bus servicing - Vehicle No. MH-12-AB-1234',
    enteredBy: 'Transport Incharge',
    status: 'Approved'
  },
  {
    id: 40,
    date: '2024-01-18',
    voucherNo: 'RCP-019',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Transport Fee',
    debitAmount: 35000,
    creditAmount: 35000,
    narration: 'Transport fee collection - January 2024',
    enteredBy: 'Transport Incharge',
    status: 'Approved'
  },
  {
    id: 41,
    date: '2024-01-19',
    voucherNo: 'CNT-003',
    voucherType: 'Contra',
    accountDebited: 'Bank Account - HDFC',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 200000,
    creditAmount: 200000,
    narration: 'Inter-bank transfer for operational expenses',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'IBT-2024-001'
  },
  {
    id: 42,
    date: '2024-01-19',
    voucherNo: 'RCP-020',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Government Grant',
    debitAmount: 500000,
    creditAmount: 500000,
    narration: 'State government education grant Q3',
    enteredBy: 'Principal',
    status: 'Approved',
    referenceNo: 'GRANT-2024-001'
  },
  {
    id: 43,
    date: '2024-01-22',
    voucherNo: 'RCP-021',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 12',
    debitAmount: 18000,
    creditAmount: 18000,
    narration: 'Tuition fee Q3 - Rohan Kapoor (STU010)',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 44,
    date: '2024-01-22',
    voucherNo: 'RCP-022',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Hostel Fee',
    debitAmount: 25000,
    creditAmount: 25000,
    narration: 'Hostel fee Q3 - Rohan Kapoor (STU010)',
    enteredBy: 'Hostel Warden',
    status: 'Approved'
  },
  {
    id: 45,
    date: '2024-01-22',
    voucherNo: 'PAY-016',
    voucherType: 'Payment',
    accountDebited: 'Hostel Mess Expense',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 85000,
    creditAmount: 85000,
    narration: 'Hostel mess provisions - January 2024',
    enteredBy: 'Hostel Warden',
    status: 'Approved'
  },
  {
    id: 46,
    date: '2024-01-23',
    voucherNo: 'PAY-017',
    voucherType: 'Payment',
    accountDebited: 'Staff Welfare',
    accountCredited: 'Cash Account',
    debitAmount: 12000,
    creditAmount: 12000,
    narration: 'Staff picnic expense - Pending approval',
    enteredBy: 'Admin',
    status: 'Pending'
  },
  {
    id: 47,
    date: '2024-01-23',
    voucherNo: 'JRN-005',
    voucherType: 'Journal',
    accountDebited: 'Suspense Account',
    accountCredited: 'Miscellaneous Income',
    debitAmount: 5000,
    creditAmount: 5000,
    narration: 'Unidentified bank credit - Under investigation',
    enteredBy: 'Accountant',
    status: 'Pending',
    referenceNo: 'SUS-2024-001'
  },
  {
    id: 48,
    date: '2024-01-23',
    voucherNo: 'PAY-018',
    voucherType: 'Payment',
    accountDebited: 'Entertainment Expense',
    accountCredited: 'Cash Account',
    debitAmount: 8000,
    creditAmount: 8000,
    narration: 'Movie tickets for staff - Rejected',
    enteredBy: 'Admin',
    status: 'Rejected'
  },
  {
    id: 49,
    date: '2024-01-24',
    voucherNo: 'RCP-023',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Fine Collection',
    debitAmount: 2500,
    creditAmount: 2500,
    narration: 'Library book late return fine',
    enteredBy: 'Librarian',
    status: 'Approved'
  },
  {
    id: 50,
    date: '2024-01-24',
    voucherNo: 'PAY-019',
    voucherType: 'Payment',
    accountDebited: 'Books & Periodicals',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 45000,
    creditAmount: 45000,
    narration: 'New library books purchase',
    enteredBy: 'Librarian',
    status: 'Approved',
    referenceNo: 'LIB-PUR-2024-001'
  },
  {
    id: 51,
    date: '2024-01-25',
    voucherNo: 'PAY-020',
    voucherType: 'Payment',
    accountDebited: 'Cultural Event Expense',
    accountCredited: 'Cash Account',
    debitAmount: 8500,
    creditAmount: 8500,
    narration: 'Republic Day celebration expenses',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 52,
    date: '2024-01-25',
    voucherNo: 'RCP-024',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Uniform Fee',
    debitAmount: 15000,
    creditAmount: 15000,
    narration: 'Uniform charges - New admissions',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 53,
    date: '2024-01-26',
    voucherNo: 'JRN-006',
    voucherType: 'Journal',
    accountDebited: 'Interest Accrued',
    accountCredited: 'Interest Income - FD',
    debitAmount: 25000,
    creditAmount: 25000,
    narration: 'Accrued interest on fixed deposit',
    enteredBy: 'Accountant',
    status: 'Approved',
    referenceNo: 'INT-FD-JAN-24'
  },
  {
    id: 54,
    date: '2024-01-29',
    voucherNo: 'RCP-025',
    voucherType: 'Receipt',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Tuition Fee - Class 11',
    debitAmount: 16500,
    creditAmount: 16500,
    narration: 'Tuition fee Q3 - Ishaan Malhotra (STU011)',
    enteredBy: 'Cashier',
    status: 'Approved',
    chequeNo: 'CHQ-556677'
  },
  {
    id: 55,
    date: '2024-01-29',
    voucherNo: 'PAY-021',
    voucherType: 'Payment',
    accountDebited: 'Telephone Expense',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 5500,
    creditAmount: 5500,
    narration: 'Telephone bill - January 2024',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 56,
    date: '2024-01-29',
    voucherNo: 'CNT-004',
    voucherType: 'Contra',
    accountDebited: 'Cash Account',
    accountCredited: 'Bank Account - SBI',
    debitAmount: 100000,
    creditAmount: 100000,
    narration: 'Cash withdrawal for salary and petty expenses',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 57,
    date: '2024-01-30',
    voucherNo: 'RCP-026',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Tuition Fee - Class 6',
    debitAmount: 10000,
    creditAmount: 10000,
    narration: 'Tuition fee Q3 - Aisha Khan (STU012)',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 58,
    date: '2024-01-30',
    voucherNo: 'RCP-027',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Activity Fee',
    debitAmount: 4000,
    creditAmount: 4000,
    narration: 'Extra-curricular activity fee - Dance class',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 59,
    date: '2024-01-30',
    voucherNo: 'PAY-022',
    voucherType: 'Payment',
    accountDebited: 'Gardening Expense',
    accountCredited: 'Cash Account',
    debitAmount: 3500,
    creditAmount: 3500,
    narration: 'Garden maintenance - Plants and fertilizers',
    enteredBy: 'Admin',
    status: 'Approved'
  },
  {
    id: 60,
    date: '2024-01-31',
    voucherNo: 'JRN-007',
    voucherType: 'Journal',
    accountDebited: 'Salary Payable',
    accountCredited: 'Salary Expense - Teaching Staff',
    debitAmount: 275000,
    creditAmount: 275000,
    narration: 'Salary provision for January 2024 - Teaching Staff',
    enteredBy: 'Accountant',
    status: 'Approved'
  },
  {
    id: 61,
    date: '2024-01-31',
    voucherNo: 'JRN-008',
    voucherType: 'Journal',
    accountDebited: 'Salary Payable',
    accountCredited: 'Salary Expense - Non-Teaching Staff',
    debitAmount: 90000,
    creditAmount: 90000,
    narration: 'Salary provision for January 2024 - Non-Teaching',
    enteredBy: 'Accountant',
    status: 'Approved'
  },
  {
    id: 62,
    date: '2024-01-31',
    voucherNo: 'JRN-009',
    voucherType: 'Journal',
    accountDebited: 'TDS Payable',
    accountCredited: 'Salary Payable',
    debitAmount: 35000,
    creditAmount: 35000,
    narration: 'TDS deduction from staff salaries',
    enteredBy: 'Accountant',
    status: 'Approved'
  },
  {
    id: 63,
    date: '2024-01-31',
    voucherNo: 'JRN-010',
    voucherType: 'Journal',
    accountDebited: 'PF Contribution - Employer',
    accountCredited: 'PF Payable',
    debitAmount: 45000,
    creditAmount: 45000,
    narration: 'Employer PF contribution - January 2024',
    enteredBy: 'Accountant',
    status: 'Pending'
  },
  {
    id: 64,
    date: '2024-01-31',
    voucherNo: 'CNT-005',
    voucherType: 'Contra',
    accountDebited: 'Bank Account - SBI',
    accountCredited: 'Cash Account',
    debitAmount: 75000,
    creditAmount: 75000,
    narration: 'Month end cash deposit to bank',
    enteredBy: 'Cashier',
    status: 'Approved'
  },
  {
    id: 65,
    date: '2024-01-31',
    voucherNo: 'RCP-028',
    voucherType: 'Receipt',
    accountDebited: 'Cash Account',
    accountCredited: 'Miscellaneous Income',
    debitAmount: 5500,
    creditAmount: 5500,
    narration: 'Canteen rent - January 2024',
    enteredBy: 'Admin',
    status: 'Approved'
  }];

  return baseData.map((t, i) => ({
    ...t,
    branch: branches[i % branches.length]
  }));
};
export function DayBookReport() {
  // States
  const [selectedBatch, setSelectedBatch] = useState('2024-2025');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    BRANCHES.map((b) => b.code)
  );
  const [dateFilterType, setDateFilterType] = useState<'single' | 'range'>(
    'range'
  );
  const [singleDate, setSingleDate] = useState('2024-01-15');
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-01-31');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('all');
  const [searchVoucher, setSearchVoucher] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [enteredByFilter, setEnteredByFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Transaction | null>(
    null
  );
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [groupByBranch, setGroupByBranch] = useState(true);
  const allTransactions = useMemo(() => generateTransactions(), []);
  // Filtering
  const filteredTransactions = useMemo(() => {
    const min = minAmount ? Number(minAmount) : null;
    const max = maxAmount ? Number(maxAmount) : null;
    return allTransactions.filter((t) => {
      if (!selectedBranches.includes(t.branch)) return false;
      if (
      dateFilterType === 'single' ?
      t.date !== singleDate :
      t.date < fromDate || t.date > toDate)

      return false;
      if (voucherTypeFilter !== 'all' && t.voucherType !== voucherTypeFilter)
      return false;
      if (
      searchVoucher &&
      !t.voucherNo.toLowerCase().includes(searchVoucher.toLowerCase()))

      return false;
      if (enteredByFilter !== 'all' && t.enteredBy !== enteredByFilter)
      return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (min !== null && t.debitAmount < min) return false;
      if (max !== null && t.debitAmount > max) return false;
      return true;
    });
  }, [
  allTransactions,
  selectedBranches,
  dateFilterType,
  singleDate,
  fromDate,
  toDate,
  voucherTypeFilter,
  searchVoucher,
  enteredByFilter,
  statusFilter,
  minAmount,
  maxAmount]
  );
  // Summary calculations
  const summary = useMemo(() => {
    const calc = (txns: Transaction[]) => ({
      count: txns.length,
      debit: txns.reduce((s, t) => s + t.debitAmount, 0),
      credit: txns.reduce((s, t) => s + t.creditAmount, 0),
      receipt: txns.filter((t) => t.voucherType === 'Receipt').length,
      payment: txns.filter((t) => t.voucherType === 'Payment').length,
      journal: txns.filter((t) => t.voucherType === 'Journal').length,
      contra: txns.filter((t) => t.voucherType === 'Contra').length,
      approved: txns.filter((t) => t.status === 'Approved').length,
      pending: txns.filter((t) => t.status === 'Pending').length,
      rejected: txns.filter((t) => t.status === 'Rejected').length
    });
    const total = calc(filteredTransactions);
    const byBranch = BRANCHES.filter((b) =>
    selectedBranches.includes(b.code)
    ).map((b) => ({
      ...b,
      ...calc(filteredTransactions.filter((t) => t.branch === b.code))
    }));
    return {
      ...total,
      isBalanced: total.debit === total.credit,
      byBranch
    };
  }, [filteredTransactions, selectedBranches]);
  const resetFilters = () => {
    setDateFilterType('range');
    setSingleDate('2024-01-15');
    setFromDate('2024-01-01');
    setToDate('2024-01-31');
    setVoucherTypeFilter('all');
    setSearchVoucher('');
    setEnteredByFilter('all');
    setStatusFilter('all');
    setMinAmount('');
    setMaxAmount('');
    setSelectedBranches(BRANCHES.map((b) => b.code));
  };
  const handleExport = () => {
    const headers = [
    'Date',
    'Branch',
    'Voucher No',
    'Type',
    'Account Debited',
    'Account Credited',
    'Debit',
    'Credit',
    'Narration',
    'Entered By',
    'Status'];

    const csvData = filteredTransactions.map((t) => [
    t.date,
    t.branch,
    t.voucherNo,
    t.voucherType,
    escapeCsv(t.accountDebited),
    escapeCsv(t.accountCredited),
    t.debitAmount,
    t.creditAmount,
    escapeCsv(t.narration),
    escapeCsv(t.enteredBy),
    t.status]
    );
    const blob = new Blob(
      [[headers.join(','), ...csvData.map((r) => r.join(','))].join('\n')],
      {
        type: 'text/csv'
      }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `day-book-${selectedBatch}-${dateFilterType === 'single' ? singleDate : `${fromDate}-to-${toDate}`}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const dateLabel =
  dateFilterType === 'single' ?
  new Date(singleDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) :
  `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Day Book Report
            </h1>
            <p className="text-sm text-gray-500">
              Master daily transaction log with branch-wise analysis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Batch & Branch Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="border-0 text-sm focus:ring-0">

              {BATCHES.map((b) =>
              <option key={b} value={b}>
                  {b}
                </option>
              )}
            </select>
          </div>
          <MultiSelectDropdown
            options={BRANCHES.map((b) => ({
              value: b.code,
              label: b.name
            }))}
            selected={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="Select Branches"
            icon={<Building2 className="w-4 h-4 text-gray-500" />} />

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Group by Branch:</span>
            <button
              onClick={() => setGroupByBranch(!groupByBranch)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${groupByBranch ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>

              {groupByBranch ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        {/* Active Selection Display */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-sm text-gray-500">Showing:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {selectedBatch}
          </span>
          {selectedBranches.length === BRANCHES.length ?
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              All Branches
            </span> :

          selectedBranches.map((b) =>
          <span
            key={b}
            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">

                {b}
              </span>
          )
          }
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}>

              {showFilters ? 'Hide' : 'Show'} Advanced
            </Button>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Type
            </label>
            <div className="flex gap-2">
              {(['single', 'range'] as const).map((type) =>
              <button
                key={type}
                onClick={() => setDateFilterType(type)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${dateFilterType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>

                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )}
            </div>
          </div>
          {dateFilterType === 'single' ?
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)} />

            </div> :

          <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)} />

              </div>
            </>
          }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={voucherTypeFilter}
              onChange={(e) => setVoucherTypeFilter(e.target.value)}>

              {VOUCHER_TYPES.map((t) =>
              <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Voucher No"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchVoucher}
                onChange={(e) => setSearchVoucher(e.target.value)} />

            </div>
          </div>
        </div>
        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entered By
              </label>
              <select
              className="w-full px-3 py-2 border rounded-lg"
              value={enteredByFilter}
              onChange={(e) => setEnteredByFilter(e.target.value)}>

                {USERS.map((u) =>
              <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
              className="w-full px-3 py-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>

                {STATUSES.map((s) =>
              <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Amount
              </label>
              <input
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border rounded-lg"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Amount
              </label>
              <input
              type="number"
              placeholder="No limit"
              className="w-full px-3 py-2 border rounded-lg"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)} />

            </div>
          </div>
        }
        {/* Active Filters Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
          voucherTypeFilter !== 'all' && {
            label: `Type: ${voucherTypeFilter}`,
            clear: () => setVoucherTypeFilter('all')
          },
          enteredByFilter !== 'all' && {
            label: `User: ${enteredByFilter}`,
            clear: () => setEnteredByFilter('all')
          },
          statusFilter !== 'all' && {
            label: `Status: ${statusFilter}`,
            clear: () => setStatusFilter('all')
          },
          searchVoucher && {
            label: `Search: ${searchVoucher}`,
            clear: () => setSearchVoucher('')
          }].

          filter(Boolean).
          map(
            (f, i) =>
            f &&
            <span
              key={i}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">

                    {f.label}
                    <button onClick={f.clear} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </span>

          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
        {
          label: 'Total Transactions',
          value: summary.count,
          icon: ArrowUpDown,
          color: 'blue',
          extra:
          <div className="flex gap-2 mt-1 text-xs">
                <span className="text-green-600">R:{summary.receipt}</span>
                <span className="text-red-600">P:{summary.payment}</span>
                <span className="text-blue-600">J:{summary.journal}</span>
                <span className="text-purple-600">C:{summary.contra}</span>
              </div>

        },
        {
          label: 'Total Debit',
          value: `₹${formatMoney(summary.debit)}`,
          icon: TrendingDown,
          color: 'red'
        },
        {
          label: 'Total Credit',
          value: `₹${formatMoney(summary.credit)}`,
          icon: TrendingUp,
          color: 'green'
        },
        {
          label: 'Balance',
          value: summary.isBalanced ? 'Balanced' : 'Unbalanced',
          icon: summary.isBalanced ? CheckCircle : AlertTriangle,
          color: summary.isBalanced ? 'green' : 'red'
        },
        {
          label: 'Status',
          icon: FileText,
          color: 'gray',
          extra:
          <div className="flex gap-2 mt-2 text-sm">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">
                  ✓{summary.approved}
                </span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                  ⏳{summary.pending}
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded">
                  ✗{summary.rejected}
                </span>
              </div>

        }].
        map((card, i) =>
        <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                {card.value &&
              <p className={`text-2xl font-bold text-${card.color}-600`}>
                    {card.value}
                  </p>
              }
                {card.extra}
              </div>
              <div className={`p-3 bg-${card.color}-100 rounded-full`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Branch-wise Summary */}
      {groupByBranch && summary.byBranch.length > 0 &&
      <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Branch-wise Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {summary.byBranch.map((branch) =>
          <div
            key={branch.id}
            className="p-4 border rounded-xl hover:shadow-md hover:border-blue-200 transition-all">

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {branch.code}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {branch.code}
                    </p>
                    <p className="text-xs text-gray-500">
                      {branch.count} transactions
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Debit:</span>
                    <span className="font-medium text-red-600">
                      ₹{formatMoney(branch.debit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credit:</span>
                    <span className="font-medium text-green-600">
                      ₹{formatMoney(branch.credit)}
                    </span>
                  </div>
                  <div className="flex gap-1 pt-2 border-t text-xs">
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                      R:{branch.receipt}
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                      P:{branch.payment}
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                      J:{branch.journal}
                    </span>
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                      C:{branch.contra}
                    </span>
                  </div>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Transaction Table */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Transactions{' '}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredTransactions.length} records)
            </span>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {dateLabel}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                'Date',
                'Branch',
                'Voucher No',
                'Type',
                'Account Debited',
                'Account Credited',
                'Debit (₹)',
                'Credit (₹)',
                'Narration',
                'Status',
                'Actions'].
                map((h) =>
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase ${h.includes('₹') ? 'text-right' : 'text-left'}`}>

                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ?
              <tr>
                  <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-gray-500">

                    No transactions found
                  </td>
                </tr> :

              filteredTransactions.map((t) =>
              <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                        {t.branch}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                    onClick={() => {
                      setSelectedVoucher(t);
                      setShowVoucherModal(true);
                    }}
                    className="text-blue-600 hover:underline font-medium">

                        {t.voucherNo}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getVoucherStyle(t.voucherType)}`}>

                        {t.voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {t.accountDebited}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {t.accountCredited}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                      {formatMoney(t.debitAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                      {formatMoney(t.creditAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span
                    className="truncate max-w-[200px] block"
                    title={t.narration}>

                        {t.narration.length > 35 ?
                    `${t.narration.substring(0, 35)}...` :
                    t.narration}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(t.status)}`}>

                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedVoucher(t);
                      setShowVoucherModal(true);
                    }}>

                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t flex flex-wrap justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {filteredTransactions.length} of {allTransactions.length}{' '}
            transactions
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Debit</p>
              <p className="text-lg font-bold text-red-600">
                ₹{formatMoney(summary.debit)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Credit</p>
              <p className="text-lg font-bold text-green-600">
                ₹{formatMoney(summary.credit)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Difference</p>
              <p
                className={`text-lg font-bold ${summary.isBalanced ? 'text-green-600' : 'text-red-600'}`}>

                ₹{formatMoney(Math.abs(summary.debit - summary.credit))}
                {summary.isBalanced && ' ✓'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Voucher Modal */}
      {showVoucherModal && selectedVoucher &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Voucher - {selectedVoucher.voucherNo}
              </h2>
              <button
              onClick={() => setShowVoucherModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
              {
                label: 'Voucher No',
                value: selectedVoucher.voucherNo
              },
              {
                label: 'Branch',
                value: selectedVoucher.branch
              },
              {
                label: 'Date',
                value: formatDate(selectedVoucher.date)
              },
              {
                label: 'Type',
                value:
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getVoucherStyle(selectedVoucher.voucherType)}`}>

                        {selectedVoucher.voucherType}
                      </span>

              },
              {
                label: 'Status',
                value:
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(selectedVoucher.status)}`}>

                        {selectedVoucher.status}
                      </span>

              }].
              map((item, i) =>
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">
                      {item.label}
                    </p>
                    <p className="font-semibold mt-1">{item.value}</p>
                  </div>
              )}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Account Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-bold text-lg">
                        Dr.
                      </span>
                      <span className="font-medium">
                        {selectedVoucher.accountDebited}
                      </span>
                    </div>
                    <span className="font-bold text-red-600 text-lg">
                      ₹{formatMoney(selectedVoucher.debitAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        Cr.
                      </span>
                      <span className="font-medium">
                        {selectedVoucher.accountCredited}
                      </span>
                    </div>
                    <span className="font-bold text-green-600 text-lg">
                      ₹{formatMoney(selectedVoucher.creditAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-gray-900 text-white px-6 py-3 rounded-lg">
                  <span className="text-gray-300 text-sm">Amount: </span>
                  <span className="text-2xl font-bold">
                    ₹{formatMoney(selectedVoucher.debitAmount)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Narration</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border">
                  {selectedVoucher.narration}
                </p>
              </div>

              {(selectedVoucher.referenceNo ||
            selectedVoucher.chequeNo ||
            selectedVoucher.bankName) &&
            <div className="grid grid-cols-3 gap-4">
                  {selectedVoucher.referenceNo &&
              <div>
                      <p className="text-sm text-gray-500">Reference No</p>
                      <p className="font-medium">
                        {selectedVoucher.referenceNo}
                      </p>
                    </div>
              }
                  {selectedVoucher.chequeNo &&
              <div>
                      <p className="text-sm text-gray-500">Cheque No</p>
                      <p className="font-medium">{selectedVoucher.chequeNo}</p>
                    </div>
              }
                  {selectedVoucher.bankName &&
              <div>
                      <p className="text-sm text-gray-500">Bank</p>
                      <p className="font-medium">{selectedVoucher.bankName}</p>
                    </div>
              }
                </div>
            }

              <div className="flex justify-between text-sm text-gray-500 pt-4 border-t">
                <div>
                  <span className="text-gray-400">Entered By: </span>
                  <span className="font-medium text-gray-700">
                    {selectedVoucher.enteredBy}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Date: </span>
                  <span className="font-medium text-gray-700">
                    {formatDate(selectedVoucher.date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 sticky bottom-0">
              <Button
              variant="outline"
              onClick={() => setShowVoucherModal(false)}>

                Close
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
export default DayBookReport;