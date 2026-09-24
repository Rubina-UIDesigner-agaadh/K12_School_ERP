import React, { useMemo, useState } from 'react';
// GeneralLedger.tsx - General Ledger with Branch & Batch Selection

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Printer,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FileText,
  Users,
  Briefcase,
  UserCheck,
  Package,
  Building,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  FileSpreadsheet,
  RefreshCw,
  X,
  Check,
  Info,
  Link,
  ExternalLink,
  MoreVertical,
  BookOpen,
  DollarSign,
  TrendingDown,
  Wallet,
  Receipt,
  CircleDollarSign,
  ArrowLeftRight,
  Settings,
  HelpCircle,
  ChevronLeft,
  MapPin } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// Types
type LedgerType = 'all' | 'accounts' | 'student' | 'vendor' | 'staff' | 'assets';
type VoucherType =
'all' |
'Fee' |
'Expense' |
'Journal' |
'Payment' |
'Receipt' |
'Invoice' |
'Salary' |
'Depreciation' |
'Transfer';
type TransactionStatus = 'all' | 'posted' | 'pending' | 'cancelled' | 'reversed';
interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: LedgerType;
  group: string;
  subGroup: string;
  openingBalance: number;
  openingBalanceType: 'Dr' | 'Cr';
  currentBalance: number;
  currentBalanceType: 'Dr' | 'Cr';
  isActive: boolean;
  branch: string;
  linkedParty?: {
    id: string;
    name: string;
    type: 'student' | 'vendor' | 'staff';
    code: string;
  };
}
interface LedgerEntry {
  id: number;
  date: string;
  voucherNo: string;
  voucherType: VoucherType;
  accountHead: string;
  accountCode: string;
  particulars: string;
  narration: string;
  referenceNo: string;
  debit: number;
  credit: number;
  runningBalance: number;
  balanceType: 'Dr' | 'Cr';
  status: TransactionStatus;
  createdBy: string;
  createdAt: string;
  ledgerType: LedgerType;
  partyName?: string;
  partyCode?: string;
  partyType?: 'student' | 'vendor' | 'staff';
  className?: string;
  section?: string;
  department?: string;
  assetCategory?: string;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  isEditable: boolean;
  linkedVouchers?: string[];
  attachments?: number;
  tags?: string[];
  branch: string;
  batch: string;
}
interface FilterState {
  ledgerAccount: string;
  fromDate: string;
  toDate: string;
  voucherNo: string;
  voucherType: VoucherType;
  transactionStatus: TransactionStatus;
  transactionType: 'all' | 'debit' | 'credit';
  minAmount: string;
  maxAmount: string;
  partyType: 'all' | 'student' | 'staff' | 'vendor';
  partySearch: string;
  referenceNo: string;
  chequeNo: string;
}
const initialFilters: FilterState = {
  ledgerAccount: '',
  fromDate: '',
  toDate: '',
  voucherNo: '',
  voucherType: 'all',
  transactionStatus: 'all',
  transactionType: 'all',
  minAmount: '',
  maxAmount: '',
  partyType: 'all',
  partySearch: '',
  referenceNo: '',
  chequeNo: ''
};
// Branch & Batch Options
const branchOptions = [
{
  value: 'main-campus',
  label: 'Main Campus - Ahmedabad',
  color: 'bg-blue-500'
},
{
  value: 'satellite',
  label: 'Satellite Branch - Ahmedabad',
  color: 'bg-green-500'
},
{
  value: 'gandhinagar',
  label: 'Gandhinagar Branch',
  color: 'bg-purple-500'
},
{
  value: 'vadodara',
  label: 'Vadodara Branch',
  color: 'bg-orange-500'
},
{
  value: 'surat',
  label: 'Surat Branch',
  color: 'bg-pink-500'
},
{
  value: 'rajkot',
  label: 'Rajkot Branch',
  color: 'bg-cyan-500'
}];

const batchOptions = [
{
  value: '',
  label: 'All Batches'
},
{
  value: 'morning',
  label: 'Morning (7:00 AM - 12:00 PM)'
},
{
  value: 'afternoon',
  label: 'Afternoon (12:00 PM - 5:00 PM)'
},
{
  value: 'evening',
  label: 'Evening (5:00 PM - 8:00 PM)'
},
{
  value: 'full-day',
  label: 'Full Day'
}];

const ledgerTypes = [
{
  id: 'all' as LedgerType,
  label: 'All Ledgers',
  icon: Building,
  color: 'gray'
},
{
  id: 'accounts' as LedgerType,
  label: 'Accounts',
  icon: FileText,
  color: 'blue'
},
{
  id: 'student' as LedgerType,
  label: 'Student',
  icon: Users,
  color: 'green'
},
{
  id: 'vendor' as LedgerType,
  label: 'Vendor',
  icon: Briefcase,
  color: 'purple'
},
{
  id: 'staff' as LedgerType,
  label: 'Staff',
  icon: UserCheck,
  color: 'orange'
},
{
  id: 'assets' as LedgerType,
  label: 'Assets',
  icon: Package,
  color: 'cyan'
}];

const voucherTypes: {
  value: VoucherType;
  label: string;
}[] = [
{
  value: 'all',
  label: 'All Voucher Types'
},
{
  value: 'Fee',
  label: 'Fee Receipt'
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
  value: 'Expense',
  label: 'Expense'
},
{
  value: 'Journal',
  label: 'Journal'
},
{
  value: 'Invoice',
  label: 'Invoice'
},
{
  value: 'Salary',
  label: 'Salary'
},
{
  value: 'Transfer',
  label: 'Transfer'
},
{
  value: 'Depreciation',
  label: 'Depreciation'
}];

const transactionStatuses: {
  value: TransactionStatus;
  label: string;
}[] = [
{
  value: 'all',
  label: 'All Status'
},
{
  value: 'posted',
  label: 'Posted'
},
{
  value: 'pending',
  label: 'Pending'
},
{
  value: 'cancelled',
  label: 'Cancelled'
},
{
  value: 'reversed',
  label: 'Reversed'
}];

// Sample Data
const ledgerAccounts: LedgerAccount[] = [
{
  id: 'ACC-001',
  code: 'ACC-1001',
  name: 'Cash in Hand',
  type: 'accounts',
  group: 'Current Assets',
  subGroup: 'Cash & Bank',
  openingBalance: 50000,
  openingBalanceType: 'Dr',
  currentBalance: 175000,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'main-campus'
},
{
  id: 'ACC-002',
  code: 'ACC-1002',
  name: 'Bank Account - SBI',
  type: 'accounts',
  group: 'Current Assets',
  subGroup: 'Cash & Bank',
  openingBalance: 250000,
  openingBalanceType: 'Dr',
  currentBalance: 485000,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'satellite'
},
{
  id: 'ACC-003',
  code: 'ACC-1003',
  name: 'Bank Account - HDFC',
  type: 'accounts',
  group: 'Current Assets',
  subGroup: 'Cash & Bank',
  openingBalance: 150000,
  openingBalanceType: 'Dr',
  currentBalance: 320000,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'gandhinagar'
},
{
  id: 'ACC-004',
  code: 'ACC-2001',
  name: 'Tuition Fee Income',
  type: 'accounts',
  group: 'Income',
  subGroup: 'Fee Income',
  openingBalance: 0,
  openingBalanceType: 'Cr',
  currentBalance: 2500000,
  currentBalanceType: 'Cr',
  isActive: true,
  branch: 'main-campus'
},
{
  id: 'ACC-005',
  code: 'ACC-3001',
  name: 'Salary Expense',
  type: 'accounts',
  group: 'Expenses',
  subGroup: 'Staff Expenses',
  openingBalance: 0,
  openingBalanceType: 'Dr',
  currentBalance: 850000,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'vadodara'
},
{
  id: 'STU-001',
  code: 'STU-10A-001',
  name: 'Rahul Sharma',
  type: 'student',
  group: 'Student Receivables',
  subGroup: 'Class 10-A',
  openingBalance: 5000,
  openingBalanceType: 'Dr',
  currentBalance: 0,
  currentBalanceType: 'Cr',
  isActive: true,
  branch: 'main-campus',
  linkedParty: {
    id: 'STU-001',
    name: 'Rahul Sharma',
    type: 'student',
    code: 'STU-10A-001'
  }
},
{
  id: 'STU-002',
  code: 'STU-09B-002',
  name: 'Priya Patel',
  type: 'student',
  group: 'Student Receivables',
  subGroup: 'Class 9-B',
  openingBalance: 0,
  openingBalanceType: 'Cr',
  currentBalance: 3500,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'satellite',
  linkedParty: {
    id: 'STU-002',
    name: 'Priya Patel',
    type: 'student',
    code: 'STU-09B-002'
  }
},
{
  id: 'VEN-001',
  code: 'VEN-2001',
  name: 'ABC Furniture Co.',
  type: 'vendor',
  group: 'Accounts Payable',
  subGroup: 'Suppliers',
  openingBalance: 25000,
  openingBalanceType: 'Cr',
  currentBalance: 75000,
  currentBalanceType: 'Cr',
  isActive: true,
  branch: 'gandhinagar',
  linkedParty: {
    id: 'VEN-001',
    name: 'ABC Furniture Co.',
    type: 'vendor',
    code: 'VEN-2001'
  }
},
{
  id: 'VEN-002',
  code: 'VEN-2002',
  name: 'XYZ Stationery',
  type: 'vendor',
  group: 'Accounts Payable',
  subGroup: 'Suppliers',
  openingBalance: 0,
  openingBalanceType: 'Cr',
  currentBalance: 15000,
  currentBalanceType: 'Cr',
  isActive: true,
  branch: 'surat',
  linkedParty: {
    id: 'VEN-002',
    name: 'XYZ Stationery',
    type: 'vendor',
    code: 'VEN-2002'
  }
},
{
  id: 'EMP-001',
  code: 'EMP-3001',
  name: 'Rajesh Verma',
  type: 'staff',
  group: 'Staff Payable',
  subGroup: 'Teaching Staff',
  openingBalance: 0,
  openingBalanceType: 'Cr',
  currentBalance: 0,
  currentBalanceType: 'Cr',
  isActive: true,
  branch: 'rajkot',
  linkedParty: {
    id: 'EMP-001',
    name: 'Rajesh Verma',
    type: 'staff',
    code: 'EMP-3001'
  }
},
{
  id: 'AST-001',
  code: 'AST-4001',
  name: 'Computer Equipment',
  type: 'assets',
  group: 'Fixed Assets',
  subGroup: 'Electronics',
  openingBalance: 500000,
  openingBalanceType: 'Dr',
  currentBalance: 850000,
  currentBalanceType: 'Dr',
  isActive: true,
  branch: 'main-campus'
}];

const ledgerData: LedgerEntry[] = [
{
  id: 1,
  date: '2024-04-01',
  voucherNo: 'JV-001',
  voucherType: 'Journal',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Opening Balance B/F',
  narration: 'Opening balance brought forward',
  referenceNo: 'OB-2024-001',
  debit: 50000,
  credit: 0,
  runningBalance: 50000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'System',
  createdAt: '2024-04-01 00:00:00',
  ledgerType: 'accounts',
  isEditable: false,
  tags: ['Opening Balance'],
  branch: 'main-campus',
  batch: 'morning'
},
{
  id: 2,
  date: '2024-04-02',
  voucherNo: 'RCP-001',
  voucherType: 'Receipt',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Fee Collection - Rahul Sharma',
  narration: 'Tuition fee received for Q1 2024',
  referenceNo: 'FEE-2024-001',
  debit: 25000,
  credit: 0,
  runningBalance: 75000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Fee Counter',
  createdAt: '2024-04-02 10:30:00',
  ledgerType: 'accounts',
  partyName: 'Rahul Sharma',
  partyCode: 'STU-10A-001',
  partyType: 'student',
  className: '10',
  section: 'A',
  isEditable: true,
  linkedVouchers: ['STU-RCP-001'],
  attachments: 1,
  tags: ['Fee', 'Tuition'],
  branch: 'main-campus',
  batch: 'morning'
},
{
  id: 3,
  date: '2024-04-03',
  voucherNo: 'RCP-002',
  voucherType: 'Receipt',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Fee Collection - Multiple Students',
  narration: 'Bulk fee collection',
  referenceNo: 'FEE-2024-002',
  debit: 125000,
  credit: 0,
  runningBalance: 200000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Fee Counter',
  createdAt: '2024-04-03 11:45:00',
  ledgerType: 'accounts',
  isEditable: true,
  attachments: 5,
  tags: ['Fee', 'Bulk'],
  branch: 'satellite',
  batch: 'afternoon'
},
{
  id: 4,
  date: '2024-04-05',
  voucherNo: 'PMT-001',
  voucherType: 'Payment',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Salary Payment - March 2024',
  narration: 'Staff salary disbursement',
  referenceNo: 'SAL-2024-003',
  debit: 0,
  credit: 85000,
  runningBalance: 115000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Accountant',
  createdAt: '2024-04-05 14:20:00',
  ledgerType: 'accounts',
  chequeNo: 'CHQ-123456',
  chequeDate: '2024-04-05',
  bankName: 'SBI',
  isEditable: true,
  linkedVouchers: ['STF-SAL-001'],
  tags: ['Salary', 'Staff'],
  branch: 'gandhinagar',
  batch: 'morning'
},
{
  id: 5,
  date: '2024-04-07',
  voucherNo: 'PMT-002',
  voucherType: 'Expense',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Office Supplies Purchase',
  narration: 'Stationery and supplies',
  referenceNo: 'PUR-2024-001',
  debit: 0,
  credit: 5000,
  runningBalance: 110000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Accountant',
  createdAt: '2024-04-07 09:15:00',
  ledgerType: 'accounts',
  partyName: 'XYZ Stationery',
  partyCode: 'VEN-2002',
  partyType: 'vendor',
  isEditable: true,
  linkedVouchers: ['VEN-INV-001'],
  tags: ['Expense'],
  branch: 'vadodara',
  batch: 'afternoon'
},
{
  id: 6,
  date: '2024-04-08',
  voucherNo: 'JV-002',
  voucherType: 'Transfer',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Cash Deposit to Bank',
  narration: 'Cash deposited to SBI',
  referenceNo: 'TRF-2024-001',
  debit: 0,
  credit: 75000,
  runningBalance: 35000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Accountant',
  createdAt: '2024-04-08 16:30:00',
  ledgerType: 'accounts',
  bankName: 'SBI',
  isEditable: true,
  tags: ['Transfer'],
  branch: 'surat',
  batch: 'evening'
},
{
  id: 7,
  date: '2024-04-10',
  voucherNo: 'RCP-003',
  voucherType: 'Receipt',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Transport Fee Collection',
  narration: 'Transport fee for April',
  referenceNo: 'TRN-2024-001',
  debit: 45000,
  credit: 0,
  runningBalance: 80000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Fee Counter',
  createdAt: '2024-04-10 10:00:00',
  ledgerType: 'accounts',
  isEditable: true,
  tags: ['Fee', 'Transport'],
  branch: 'rajkot',
  batch: 'full-day'
},
{
  id: 8,
  date: '2024-04-12',
  voucherNo: 'PMT-003',
  voucherType: 'Payment',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Electricity Bill Payment',
  narration: 'Electricity bill for March',
  referenceNo: 'UTL-2024-001',
  debit: 0,
  credit: 28000,
  runningBalance: 52000,
  balanceType: 'Dr',
  status: 'pending',
  createdBy: 'Admin',
  createdAt: '2024-04-12 11:30:00',
  ledgerType: 'accounts',
  isEditable: true,
  tags: ['Expense', 'Utility'],
  branch: 'main-campus',
  batch: 'morning'
},
{
  id: 9,
  date: '2024-04-15',
  voucherNo: 'RCP-004',
  voucherType: 'Fee',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Admission Fee - New Students',
  narration: 'Admission fee for April',
  referenceNo: 'ADM-2024-001',
  debit: 150000,
  credit: 0,
  runningBalance: 202000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Admission Desk',
  createdAt: '2024-04-15 09:45:00',
  ledgerType: 'accounts',
  isEditable: true,
  attachments: 10,
  tags: ['Fee', 'Admission'],
  branch: 'satellite',
  batch: 'afternoon'
},
{
  id: 10,
  date: '2024-04-18',
  voucherNo: 'PMT-004',
  voucherType: 'Payment',
  accountHead: 'Cash in Hand',
  accountCode: 'ACC-1001',
  particulars: 'Vendor Payment - Furniture',
  narration: 'Partial payment to ABC Furniture',
  referenceNo: 'VEN-PMT-001',
  debit: 0,
  credit: 50000,
  runningBalance: 152000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'Accountant',
  createdAt: '2024-04-18 14:00:00',
  ledgerType: 'accounts',
  partyName: 'ABC Furniture Co.',
  partyCode: 'VEN-2001',
  partyType: 'vendor',
  chequeNo: 'CHQ-123457',
  chequeDate: '2024-04-18',
  bankName: 'HDFC',
  isEditable: true,
  linkedVouchers: ['VEN-PMT-001'],
  tags: ['Payment', 'Vendor'],
  branch: 'gandhinagar',
  batch: 'morning'
},
{
  id: 11,
  date: '2024-04-01',
  voucherNo: 'STU-OB-001',
  voucherType: 'Journal',
  accountHead: 'Rahul Sharma',
  accountCode: 'STU-10A-001',
  particulars: 'Opening Balance B/F',
  narration: 'Outstanding fee balance',
  referenceNo: 'STU-OB-2024',
  debit: 5000,
  credit: 0,
  runningBalance: 5000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'System',
  createdAt: '2024-04-01 00:00:00',
  ledgerType: 'student',
  partyName: 'Rahul Sharma',
  partyCode: 'STU-10A-001',
  partyType: 'student',
  className: '10',
  section: 'A',
  isEditable: false,
  tags: ['Opening Balance'],
  branch: 'main-campus',
  batch: 'morning'
},
{
  id: 12,
  date: '2024-04-02',
  voucherNo: 'STU-RCP-001',
  voucherType: 'Receipt',
  accountHead: 'Rahul Sharma',
  accountCode: 'STU-10A-001',
  particulars: 'Tuition Fee - Q1 2024',
  narration: 'Fee payment via cash',
  referenceNo: 'FEE-2024-001',
  debit: 0,
  credit: 25000,
  runningBalance: 20000,
  balanceType: 'Cr',
  status: 'posted',
  createdBy: 'Fee Counter',
  createdAt: '2024-04-02 10:30:00',
  ledgerType: 'student',
  partyName: 'Rahul Sharma',
  partyCode: 'STU-10A-001',
  partyType: 'student',
  className: '10',
  section: 'A',
  isEditable: true,
  attachments: 1,
  tags: ['Fee', 'Tuition'],
  branch: 'main-campus',
  batch: 'morning'
},
{
  id: 13,
  date: '2024-04-01',
  voucherNo: 'VEN-OB-001',
  voucherType: 'Journal',
  accountHead: 'ABC Furniture Co.',
  accountCode: 'VEN-2001',
  particulars: 'Opening Balance B/F',
  narration: 'Outstanding payable',
  referenceNo: 'VEN-OB-2024',
  debit: 0,
  credit: 25000,
  runningBalance: 25000,
  balanceType: 'Cr',
  status: 'posted',
  createdBy: 'System',
  createdAt: '2024-04-01 00:00:00',
  ledgerType: 'vendor',
  partyName: 'ABC Furniture Co.',
  partyCode: 'VEN-2001',
  partyType: 'vendor',
  isEditable: false,
  tags: ['Opening Balance'],
  branch: 'gandhinagar',
  batch: 'afternoon'
},
{
  id: 14,
  date: '2024-04-10',
  voucherNo: 'VEN-INV-001',
  voucherType: 'Invoice',
  accountHead: 'ABC Furniture Co.',
  accountCode: 'VEN-2001',
  particulars: 'Classroom Furniture Purchase',
  narration: 'Purchase of desks and chairs',
  referenceNo: 'PO-2024-001',
  debit: 0,
  credit: 75000,
  runningBalance: 100000,
  balanceType: 'Cr',
  status: 'posted',
  createdBy: 'Purchase Dept',
  createdAt: '2024-04-10 11:00:00',
  ledgerType: 'vendor',
  partyName: 'ABC Furniture Co.',
  partyCode: 'VEN-2001',
  partyType: 'vendor',
  isEditable: true,
  attachments: 2,
  tags: ['Purchase'],
  branch: 'vadodara',
  batch: 'morning'
},
{
  id: 15,
  date: '2024-04-01',
  voucherNo: 'STF-SAL-001',
  voucherType: 'Salary',
  accountHead: 'Rajesh Verma',
  accountCode: 'EMP-3001',
  particulars: 'Salary - March 2024',
  narration: 'Monthly salary',
  referenceNo: 'SAL-2024-001',
  debit: 0,
  credit: 45000,
  runningBalance: 45000,
  balanceType: 'Cr',
  status: 'posted',
  createdBy: 'HR Dept',
  createdAt: '2024-04-01 09:00:00',
  ledgerType: 'staff',
  partyName: 'Rajesh Verma',
  partyCode: 'EMP-3001',
  partyType: 'staff',
  department: 'Teaching',
  isEditable: true,
  tags: ['Salary'],
  branch: 'surat',
  batch: 'full-day'
},
{
  id: 16,
  date: '2024-04-01',
  voucherNo: 'AST-OB-001',
  voucherType: 'Journal',
  accountHead: 'Computer Equipment',
  accountCode: 'AST-4001',
  particulars: 'Opening Balance B/F',
  narration: 'Asset value brought forward',
  referenceNo: 'AST-OB-2024',
  debit: 500000,
  credit: 0,
  runningBalance: 500000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'System',
  createdAt: '2024-04-01 00:00:00',
  ledgerType: 'assets',
  assetCategory: 'Electronics',
  isEditable: false,
  tags: ['Opening Balance'],
  branch: 'rajkot',
  batch: 'morning'
},
{
  id: 17,
  date: '2024-04-12',
  voucherNo: 'AST-PUR-001',
  voucherType: 'Invoice',
  accountHead: 'Computer Equipment',
  accountCode: 'AST-4001',
  particulars: 'Desktop Computers Purchase',
  narration: 'Purchase of 10 desktop computers',
  referenceNo: 'PO-AST-2024-001',
  debit: 350000,
  credit: 0,
  runningBalance: 850000,
  balanceType: 'Dr',
  status: 'posted',
  createdBy: 'IT Dept',
  createdAt: '2024-04-12 10:00:00',
  ledgerType: 'assets',
  partyName: 'Tech Solutions Ltd.',
  partyCode: 'VEN-3001',
  partyType: 'vendor',
  assetCategory: 'Electronics',
  isEditable: true,
  attachments: 3,
  tags: ['Purchase', 'Computer'],
  branch: 'main-campus',
  batch: 'afternoon'
}];

// Helper Functions
const formatCurrency = (amount: number) =>
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
}).format(amount);
const formatDate = (dateString: string) =>
new Date(dateString).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const getBranchLabel = (v: string) =>
branchOptions.find((b) => b.value === v)?.label || v;
const getBranchColor = (v: string) =>
branchOptions.find((b) => b.value === v)?.color || 'bg-gray-500';
export function GeneralLedger() {
  // States
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
  useState<FilterState>(initialFilters);
  const [selectedLedgerType, setSelectedLedgerType] =
  useState<LedgerType>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<LedgerAccount | null>(
    null
  );
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [drillDownSource, setDrillDownSource] = useState<string | null>(null);
  // Branch & Batch States
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [collapsedBranches, setCollapsedBranches] = useState<string[]>([]);
  // Branch/Batch Handlers
  const toggleBranch = (v: string) =>
  setSelectedBranches((prev) =>
  prev.includes(v) ? prev.filter((b) => b !== v) : [...prev, v]
  );
  const toggleBranchCollapse = (b: string) =>
  setCollapsedBranches((prev) =>
  prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
  );
  // Get filtered accounts
  const filteredAccounts = useMemo(() => {
    let accounts =
    selectedLedgerType === 'all' ?
    ledgerAccounts :
    ledgerAccounts.filter((acc) => acc.type === selectedLedgerType);
    if (selectedBranches.length > 0)
    accounts = accounts.filter((acc) => selectedBranches.includes(acc.branch));
    return accounts;
  }, [selectedLedgerType, selectedBranches]);
  // Filter data
  const filteredData = useMemo(() => {
    let data = ledgerData;
    if (selectedBranches.length > 0)
    data = data.filter((e) => selectedBranches.includes(e.branch));
    if (selectedBatch) data = data.filter((e) => e.batch === selectedBatch);
    if (selectedLedgerType !== 'all')
    data = data.filter((e) => e.ledgerType === selectedLedgerType);
    if (appliedFilters.ledgerAccount)
    data = data.filter((e) => e.accountCode === appliedFilters.ledgerAccount);
    if (appliedFilters.voucherNo)
    data = data.filter((e) =>
    e.voucherNo.
    toLowerCase().
    includes(appliedFilters.voucherNo.toLowerCase())
    );
    if (appliedFilters.voucherType !== 'all')
    data = data.filter((e) => e.voucherType === appliedFilters.voucherType);
    if (appliedFilters.transactionStatus !== 'all')
    data = data.filter((e) => e.status === appliedFilters.transactionStatus);
    if (appliedFilters.fromDate)
    data = data.filter((e) => e.date >= appliedFilters.fromDate);
    if (appliedFilters.toDate)
    data = data.filter((e) => e.date <= appliedFilters.toDate);
    if (appliedFilters.transactionType === 'debit')
    data = data.filter((e) => e.debit > 0);else
    if (appliedFilters.transactionType === 'credit')
    data = data.filter((e) => e.credit > 0);
    if (appliedFilters.minAmount)
    data = data.filter(
      (e) =>
      e.debit >= parseFloat(appliedFilters.minAmount) ||
      e.credit >= parseFloat(appliedFilters.minAmount)
    );
    if (appliedFilters.maxAmount)
    data = data.filter(
      (e) =>
      e.debit <= parseFloat(appliedFilters.maxAmount) &&
      e.credit <= parseFloat(appliedFilters.maxAmount)
    );
    if (appliedFilters.partyType !== 'all')
    data = data.filter((e) => e.partyType === appliedFilters.partyType);
    if (appliedFilters.partySearch)
    data = data.filter(
      (e) =>
      e.partyName?.
      toLowerCase().
      includes(appliedFilters.partySearch.toLowerCase()) ||
      e.partyCode?.
      toLowerCase().
      includes(appliedFilters.partySearch.toLowerCase())
    );
    if (appliedFilters.referenceNo)
    data = data.filter((e) =>
    e.referenceNo.
    toLowerCase().
    includes(appliedFilters.referenceNo.toLowerCase())
    );
    if (appliedFilters.chequeNo)
    data = data.filter((e) =>
    e.chequeNo?.
    toLowerCase().
    includes(appliedFilters.chequeNo.toLowerCase())
    );
    let balance = 0;
    if (appliedFilters.ledgerAccount) {
      const account = ledgerAccounts.find(
        (acc) => acc.code === appliedFilters.ledgerAccount
      );
      if (account)
      balance =
      account.openingBalanceType === 'Dr' ?
      account.openingBalance :
      -account.openingBalance;
    }
    return data.map((entry) => {
      balance += entry.debit - entry.credit;
      return {
        ...entry,
        runningBalance: Math.abs(balance),
        balanceType: balance >= 0 ? 'Dr' as const : 'Cr' as const
      };
    });
  }, [appliedFilters, selectedLedgerType, selectedBranches, selectedBatch]);
  // Group by Branch
  const groupedByBranch = useMemo(() => {
    const groups: Record<string, LedgerEntry[]> = {};
    filteredData.forEach((e) => {
      if (!groups[e.branch]) groups[e.branch] = [];
      groups[e.branch].push(e);
    });
    return groups;
  }, [filteredData]);
  // Branch Stats
  const branchStats = useMemo(() => {
    const stats: Record<
      string,
      {
        total: number;
        debit: number;
        credit: number;
        pending: number;
      }> =
    {};
    Object.entries(groupedByBranch).forEach(([branch, entries]) => {
      stats[branch] = {
        total: entries.length,
        debit: entries.reduce((sum, e) => sum + e.debit, 0),
        credit: entries.reduce((sum, e) => sum + e.credit, 0),
        pending: entries.filter((e) => e.status === 'pending').length
      };
    });
    return stats;
  }, [groupedByBranch]);
  // Overall Summary
  const summary = useMemo(() => {
    let openingBalance = 0,
      openingBalanceType: 'Dr' | 'Cr' = 'Dr';
    if (appliedFilters.ledgerAccount) {
      const account = ledgerAccounts.find(
        (acc) => acc.code === appliedFilters.ledgerAccount
      );
      if (account) {
        openingBalance = account.openingBalance;
        openingBalanceType = account.openingBalanceType;
      }
    } else openingBalance = 50000;
    const totalDebit = filteredData.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = filteredData.reduce((sum, e) => sum + e.credit, 0);
    const netMovement = totalDebit - totalCredit;
    const closingBalance =
    openingBalanceType === 'Dr' ?
    openingBalance + netMovement :
    -openingBalance + netMovement;
    return {
      openingBalance,
      openingBalanceType,
      totalDebit,
      totalCredit,
      closingBalance: Math.abs(closingBalance),
      closingBalanceType:
      closingBalance >= 0 ? 'Dr' as const : 'Cr' as const,
      transactionCount: filteredData.length,
      pendingCount: filteredData.filter((e) => e.status === 'pending').length
    };
  }, [filteredData, appliedFilters.ledgerAccount]);
  // Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) =>
  setFilters((prev) => ({
    ...prev,
    [key]: value
  }));
  const handleApplyFilters = () => setAppliedFilters(filters);
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedAccount(null);
    setSelectedBranches([]);
    setSelectedBatch('');
  };
  const handleLedgerTypeChange = (type: LedgerType) => {
    setSelectedLedgerType(type);
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedAccount(null);
  };
  const handleAccountSelect = (accountCode: string) => {
    setSelectedAccount(
      ledgerAccounts.find((acc) => acc.code === accountCode) || null
    );
    setFilters((prev) => ({
      ...prev,
      ledgerAccount: accountCode
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      ledgerAccount: accountCode
    }));
  };
  const handleViewEntry = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setShowViewModal(true);
  };
  const getStatusBadge = (status: TransactionStatus) => {
    const variants: Record<
      TransactionStatus,
      'success' | 'warning' | 'danger' | 'default'> =
    {
      all: 'default',
      posted: 'success',
      pending: 'warning',
      cancelled: 'danger',
      reversed: 'default'
    };
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>);

  };
  const getVoucherTypeBadge = (type: string) => {
    const variants: Record<
      string,
      'primary' | 'success' | 'warning' | 'danger' | 'default'> =
    {
      Journal: 'primary',
      Receipt: 'success',
      Payment: 'danger',
      Fee: 'success',
      Expense: 'danger',
      Invoice: 'warning',
      Salary: 'primary',
      Transfer: 'default',
      Depreciation: 'default'
    };
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
  };
  const getVoucherIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      Journal: <BookOpen className="w-4 h-4 text-blue-500" />,
      Receipt: <ArrowDownRight className="w-4 h-4 text-green-500" />,
      Payment: <ArrowUpRight className="w-4 h-4 text-red-500" />,
      Fee: <DollarSign className="w-4 h-4 text-green-500" />,
      Expense: <Wallet className="w-4 h-4 text-red-500" />,
      Invoice: <Receipt className="w-4 h-4 text-amber-500" />,
      Salary: <Users className="w-4 h-4 text-blue-500" />,
      Transfer: <ArrowLeftRight className="w-4 h-4 text-purple-500" />,
      Depreciation: <TrendingDown className="w-4 h-4 text-gray-500" />
    };
    return icons[type] || <FileText className="w-4 h-4 text-gray-500" />;
  };
  // Table Columns
  const columns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: LedgerEntry) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{formatDate(row.date)}</span>
        </div>

  },
  {
    key: 'voucher',
    header: 'Voucher',
    render: (row: LedgerEntry) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getVoucherIcon(row.voucherType)}
            <span className="font-mono text-sm font-medium text-blue-600">
              {row.voucherNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getVoucherTypeBadge(row.voucherType)}
            {getStatusBadge(row.status)}
          </div>
        </div>

  },
  {
    key: 'particulars',
    header: 'Particulars',
    render: (row: LedgerEntry) =>
    <div className="max-w-sm">
          <p className="font-medium text-gray-900 text-sm">{row.particulars}</p>
          <p className="text-xs text-gray-500 truncate">{row.narration}</p>
          {row.partyName &&
      <span className="text-xs text-blue-600">{row.partyName}</span>
      }
          {row.tags && row.tags.length > 0 &&
      <div className="flex flex-wrap gap-1 mt-1">
              {row.tags.slice(0, 2).map((tag, idx) =>
        <span
          key={idx}
          className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">

                  {tag}
                </span>
        )}
            </div>
      }
        </div>

  },
  {
    key: 'reference',
    header: 'Reference',
    render: (row: LedgerEntry) =>
    <div className="text-sm">
          <p className="font-mono text-gray-700">{row.referenceNo}</p>
          {row.chequeNo &&
      <p className="text-xs text-gray-500">Chq: {row.chequeNo}</p>
      }
          {row.linkedVouchers && row.linkedVouchers.length > 0 &&
      <div className="flex items-center gap-1 mt-1">
              <Link className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-500">
                {row.linkedVouchers.length} linked
              </span>
            </div>
      }
        </div>

  },
  {
    key: 'batch',
    header: 'Batch',
    render: (row: LedgerEntry) =>
    <Badge variant="info">
          {row.batch.charAt(0).toUpperCase() +
      row.batch.slice(1).replace('-', ' ')}
        </Badge>

  },
  {
    key: 'debit',
    header: 'Debit (₹)',
    render: (row: LedgerEntry) =>
    <div className="text-right">
          {row.debit > 0 ?
      <span className="font-semibold text-green-600">
              {formatCurrency(row.debit)}
            </span> :

      <span className="text-gray-300">—</span>
      }
        </div>

  },
  {
    key: 'credit',
    header: 'Credit (₹)',
    render: (row: LedgerEntry) =>
    <div className="text-right">
          {row.credit > 0 ?
      <span className="font-semibold text-red-600">
              {formatCurrency(row.credit)}
            </span> :

      <span className="text-gray-300">—</span>
      }
        </div>

  },
  {
    key: 'balance',
    header: 'Balance (₹)',
    render: (row: LedgerEntry) =>
    <div className="text-right">
          <span className="font-semibold text-gray-900">
            {formatCurrency(row.runningBalance)}
          </span>
          <Badge
        variant={row.balanceType === 'Dr' ? 'success' : 'danger'}
        className="ml-2">

            {row.balanceType}
          </Badge>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: LedgerEntry) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleViewEntry(row)}>

            <Eye className="w-4 h-4 text-gray-500" />
          </Button>
          {row.isEditable &&
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="w-4 h-4 text-blue-500" />
            </Button>
      }
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

  }];

  const isFilterActive =
  Object.values(appliedFilters).some((v) => v !== 'all' && v !== '') ||
  selectedBranches.length > 0 ||
  selectedBatch !== '';
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {drillDownSource &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrillDownSource(null)}>

                <ChevronLeft className="w-4 h-4" />
              </Button>
            }
            <h1 className="text-2xl font-bold text-gray-900">General Ledger</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {drillDownSource ?
            `Drill-down from ${drillDownSource}` :
            'View and manage all financial transactions across accounts'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}>

            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Branch & Batch Selection */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Branch & Batch:
            </span>
          </div>

          {/* Multi-select Branch */}
          <div className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white min-w-[200px]">

              <Building className="w-4 h-4 text-gray-400" />
              <span className="flex-1 text-left">
                {selectedBranches.length === 0 ?
                'All Branches' :
                selectedBranches.length === branchOptions.length ?
                'All Branches Selected' :
                `${selectedBranches.length} Branch(es)`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />

            </button>
            {showBranchDropdown &&
            <div className="absolute z-20 w-72 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 border-b flex justify-between">
                  <button
                  onClick={() =>
                  setSelectedBranches(branchOptions.map((b) => b.value))
                  }
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium">

                    Select All
                  </button>
                  <button
                  onClick={() => setSelectedBranches([])}
                  className="text-xs text-gray-500 hover:text-gray-700">

                    Clear All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {branchOptions.map((branch) =>
                <label
                  key={branch.value}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">

                      <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedBranches.includes(branch.value) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>

                        {selectedBranches.includes(branch.value) &&
                    <Check className="w-3 h-3 text-white" />
                    }
                      </div>
                      <span
                    className={`w-3 h-3 rounded-full ${branch.color}`}>
                  </span>
                      <span className="text-sm text-gray-700">
                        {branch.label}
                      </span>
                    </label>
                )}
                </div>
                <div className="p-2 border-t">
                  <button
                  onClick={() => setShowBranchDropdown(false)}
                  className="w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">

                    Done
                  </button>
                </div>
              </div>
            }
          </div>

          {/* Selected Branch Tags */}
          {selectedBranches.length > 0 &&
          <div className="flex flex-wrap gap-1">
              {selectedBranches.slice(0, 3).map((b) =>
            <span
              key={b}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getBranchColor(b)}`}>

                  {getBranchLabel(b).split(' - ')[0]}
                  <button
                onClick={() => toggleBranch(b)}
                className="hover:bg-white/20 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            )}
              {selectedBranches.length > 3 &&
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  +{selectedBranches.length - 3} more
                </span>
            }
            </div>
          }

          {/* Single-select Batch */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">

            {batchOptions.map((b) =>
            <option key={b.value} value={b.value}>
                {b.label}
              </option>
            )}
          </select>

          {isFilterActive &&
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">

              <X className="w-4 h-4" />
              Reset
            </button>
          }
        </div>
      </Card>

      {/* Ledger Type Tabs */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {ledgerTypes.map((type) => {
            const Icon = type.icon;
            const count =
            type.id === 'all' ?
            filteredData.length :
            filteredData.filter((e) => e.ledgerType === type.id).length;
            return (
              <Button
                key={type.id}
                variant={selectedLedgerType === type.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleLedgerTypeChange(type.id)}>

                <Icon className="w-4 h-4 mr-2" />
                {type.label}
                <Badge variant="default" className="ml-2 text-xs">
                  {count}
                </Badge>
              </Button>);

          })}
        </div>
      </Card>

      {/* Branch Overview Cards */}
      {Object.keys(branchStats).length > 0 &&
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(branchStats).map(([branch, stat]) =>
        <Card key={branch} className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span
              className={`w-3 h-3 rounded-full ${getBranchColor(branch)}`}>
            </span>
                <span className="text-xs font-medium text-gray-600 truncate">
                  {getBranchLabel(branch).split(' - ')[0]}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stat.total} entries
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-green-600">
                  ₹{(stat.debit / 1000).toFixed(0)}K Dr
                </span>
                <span className="text-red-600">
                  ₹{(stat.credit / 1000).toFixed(0)}K Cr
                </span>
              </div>
              {stat.pending > 0 &&
          <Badge variant="warning" className="mt-2">
                  {stat.pending} pending
                </Badge>
          }
            </Card>
        )}
        </div>
      }

      {/* Account Selector & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Select Account
            </h3>
            {selectedAccount &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAccountSelect('')}>

                <X className="w-4 h-4" />
              </Button>
            }
          </div>
          <Select
            value={filters.ledgerAccount}
            onChange={(value) => handleAccountSelect(value)}
            options={[
            {
              value: '',
              label: 'All Accounts'
            },
            ...filteredAccounts.map((acc) => ({
              value: acc.code,
              label: `${acc.name} (${acc.code})`
            }))]
            }
            placeholder="Select account..." />

          {selectedAccount &&
          <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Account</span>
                <button
                onClick={() => setShowAccountDetails(true)}
                className="text-xs text-blue-600 hover:underline">

                  View Details
                </button>
              </div>
              <p className="font-medium text-gray-900">
                {selectedAccount.name}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {selectedAccount.code}
              </p>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Group</span>
                  <span className="text-gray-700">{selectedAccount.group}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Branch</span>
                  <span
                  className={`px-2 py-0.5 rounded-full text-xs text-white ${getBranchColor(selectedAccount.branch)}`}>

                    {getBranchLabel(selectedAccount.branch).split(' - ')[0]}
                  </span>
                </div>
              </div>
            </div>
          }
        </Card>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
          {
            label: 'Opening Balance',
            value: summary.openingBalance,
            type: summary.openingBalanceType,
            icon: Wallet,
            color: 'blue'
          },
          {
            label: 'Total Debit',
            value: summary.totalDebit,
            type: null,
            icon: ArrowUpRight,
            color: 'green'
          },
          {
            label: 'Total Credit',
            value: summary.totalCredit,
            type: null,
            icon: ArrowDownRight,
            color: 'red'
          },
          {
            label: 'Closing Balance',
            value: summary.closingBalance,
            type: summary.closingBalanceType,
            icon: CircleDollarSign,
            color: 'purple'
          }].
          map((item, idx) =>
          <Card
            key={idx}
            className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}>

              <div className="flex items-center justify-between">
                <div>
                  <p
                  className={`text-xs text-${item.color}-600 uppercase tracking-wide font-medium`}>

                    {item.label}
                  </p>
                  <p
                  className={`text-xl font-bold text-${item.color}-900 mt-1`}>

                    {formatCurrency(item.value)}
                  </p>
                  {item.type &&
                <Badge
                  variant={item.type === 'Dr' ? 'success' : 'danger'}
                  className="mt-1">

                      {item.type}
                    </Badge>
                }
                </div>
                <div
                className={`w-12 h-12 bg-${item.color}-200 rounded-full flex items-center justify-center`}>

                  <item.icon className={`w-6 h-6 text-${item.color}-700`} />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Advanced Filters</h3>
            {isFilterActive &&
            <Badge variant="primary" className="ml-2">
                Active
              </Badge>
            }
          </div>
          <Button variant="ghost" size="sm">
            {isFilterExpanded ?
            <ChevronUp className="w-4 h-4" /> :

            <ChevronDown className="w-4 h-4" />
            }
          </Button>
        </div>
        {isFilterExpanded &&
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Input
              type="date"
              label="From Date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)} />

              <Input
              type="date"
              label="To Date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)} />

              <Input
              label="Voucher Number"
              placeholder="Search voucher..."
              value={filters.voucherNo}
              onChange={(e) =>
              handleFilterChange('voucherNo', e.target.value)
              }
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              <Select
              label="Voucher Type"
              value={filters.voucherType}
              onChange={(value) =>
              handleFilterChange('voucherType', value as VoucherType)
              }
              options={voucherTypes} />

              <Select
              label="Transaction Status"
              value={filters.transactionStatus}
              onChange={(value) =>
              handleFilterChange(
                'transactionStatus',
                value as TransactionStatus
              )
              }
              options={transactionStatuses} />

              <Select
              label="Transaction Type"
              value={filters.transactionType}
              onChange={(value) =>
              handleFilterChange('transactionType', value)
              }
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'debit',
                label: 'Debit Only'
              },
              {
                value: 'credit',
                label: 'Credit Only'
              }]
              } />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Select
              label="Party Type"
              value={filters.partyType}
              onChange={(value) => handleFilterChange('partyType', value)}
              options={[
              {
                value: 'all',
                label: 'All Parties'
              },
              {
                value: 'student',
                label: 'Student'
              },
              {
                value: 'staff',
                label: 'Staff'
              },
              {
                value: 'vendor',
                label: 'Vendor'
              }]
              } />

              <Input
              label="Party Name / ID"
              placeholder="Search party..."
              value={filters.partySearch}
              onChange={(e) =>
              handleFilterChange('partySearch', e.target.value)
              }
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              <Input
              label="Reference Number"
              placeholder="Search reference..."
              value={filters.referenceNo}
              onChange={(e) =>
              handleFilterChange('referenceNo', e.target.value)
              } />

              <Input
              label="Cheque Number"
              placeholder="Search cheque..."
              value={filters.chequeNo}
              onChange={(e) => handleFilterChange('chequeNo', e.target.value)} />

              <Input
              type="number"
              label="Min Amount (₹)"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) =>
              handleFilterChange('minAmount', e.target.value)
              } />

              <Input
              type="number"
              label="Max Amount (₹)"
              placeholder="∞"
              value={filters.maxAmount}
              onChange={(e) =>
              handleFilterChange('maxAmount', e.target.value)
              } />

            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Found{' '}
                <span className="font-semibold text-gray-700">
                  {filteredData.length}
                </span>{' '}
                entries across{' '}
                <span className="font-semibold text-blue-600">
                  {Object.keys(groupedByBranch).length}
                </span>{' '}
                branch(es)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button variant="primary" onClick={handleApplyFilters}>
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Branch-wise Ledger Tables */}
      {Object.keys(groupedByBranch).length > 0 ?
      Object.entries(groupedByBranch).map(([branch, entries]) =>
      <Card key={branch} className="overflow-hidden">
            <div
          className="p-4 bg-gradient-to-r from-gray-50 to-white border-b cursor-pointer hover:bg-gray-50"
          onClick={() => toggleBranchCollapse(branch)}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}>
              </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getBranchLabel(branch)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entries.length} entries | Debit:{' '}
                      {formatCurrency(branchStats[branch].debit)} | Credit:{' '}
                      {formatCurrency(branchStats[branch].credit)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {branchStats[branch].pending > 0 &&
              <Badge variant="warning">
                      {branchStats[branch].pending} pending
                    </Badge>
              }
                  {collapsedBranches.includes(branch) ?
              <ChevronDown className="w-5 h-5 text-gray-400" /> :

              <ChevronUp className="w-5 h-5 text-gray-400" />
              }
                </div>
              </div>
            </div>
            {!collapsedBranches.includes(branch) &&
        <>
                {(selectedAccount || appliedFilters.ledgerAccount) &&
          <div className="px-4 py-3 bg-blue-50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-900">
                        Opening Balance
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">
                        {formatCurrency(summary.openingBalance)}
                      </span>
                      <Badge
                variant={
                summary.openingBalanceType === 'Dr' ?
                'success' :
                'danger'
                }>

                        {summary.openingBalanceType}
                      </Badge>
                    </div>
                  </div>
          }
                <Table columns={columns} data={entries} />
                <div className="border-t-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                  <div className="flex flex-wrap justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase">
                        Branch Debit
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(branchStats[branch].debit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase">
                        Branch Credit
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(branchStats[branch].credit)}
                      </p>
                    </div>
                    <div className="text-right border-l-2 border-gray-300 pl-6">
                      <p className="text-xs text-gray-500 uppercase">Net</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(
                    Math.abs(
                      branchStats[branch].debit -
                      branchStats[branch].credit
                    )
                  )}
                      </p>
                      <Badge
                  variant={
                  branchStats[branch].debit >=
                  branchStats[branch].credit ?
                  'success' :
                  'danger'
                  }>

                        {branchStats[branch].debit >= branchStats[branch].credit ?
                  'Dr' :
                  'Cr'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
        }
          </Card>
      ) :

      <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No entries found
          </h3>
          <p className="text-gray-500 mb-4">
            Try selecting different branches or adjusting your filters.
          </p>
          <Button variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </Card>
      }

      {/* Overall Summary Footer */}
      {filteredData.length > 0 &&
      <Card className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg">Overall Summary</h3>
              <p className="text-gray-400 text-sm">
                {summary.transactionCount} transactions across{' '}
                {Object.keys(groupedByBranch).length} branches
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">Total Debit</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(summary.totalDebit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">Total Credit</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(summary.totalCredit)}
                </p>
              </div>
              <div className="text-right border-l border-gray-600 pl-8">
                <p className="text-xs text-gray-400 uppercase">
                  Closing Balance
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.closingBalance)}
                  </p>
                  <Badge
                  variant={
                  summary.closingBalanceType === 'Dr' ? 'success' : 'danger'
                  }>

                    {summary.closingBalanceType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* View Entry Modal */}
      {showViewModal && selectedEntry &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Voucher Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedEntry.voucherNo}
                  </p>
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowViewModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDate(selectedEntry.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Voucher Type</p>
                    {getVoucherTypeBadge(selectedEntry.voucherType)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    {getStatusBadge(selectedEntry.status)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Branch</p>
                    <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${getBranchColor(selectedEntry.branch)}`}>

                      {getBranchLabel(selectedEntry.branch).split(' - ')[0]}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Account</p>
                      <p className="font-medium">{selectedEntry.accountHead}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {selectedEntry.accountCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Batch</p>
                      <Badge variant="info">
                        {selectedEntry.batch.charAt(0).toUpperCase() +
                      selectedEntry.batch.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                    {selectedEntry.partyName &&
                  <div>
                        <p className="text-xs text-gray-500">Party</p>
                        <p className="font-medium text-blue-600">
                          {selectedEntry.partyName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedEntry.partyCode}
                        </p>
                      </div>
                  }
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Particulars</p>
                  <p className="font-medium">{selectedEntry.particulars}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEntry.narration}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Debit</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedEntry.debit > 0 ?
                    formatCurrency(selectedEntry.debit) :
                    '—'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Credit</p>
                    <p className="text-xl font-bold text-red-600">
                      {selectedEntry.credit > 0 ?
                    formatCurrency(selectedEntry.credit) :
                    '—'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Running Balance</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedEntry.runningBalance)}
                    </p>
                    <Badge
                    variant={
                    selectedEntry.balanceType === 'Dr' ?
                    'success' :
                    'danger'
                    }>

                      {selectedEntry.balanceType}
                    </Badge>
                  </div>
                </div>
                {selectedEntry.chequeNo &&
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-600 mb-2 font-medium">
                      Payment Details
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Cheque/Ref No</p>
                        <p className="font-mono">{selectedEntry.chequeNo}</p>
                      </div>
                      {selectedEntry.chequeDate &&
                  <div>
                          <p className="text-xs text-gray-500">Cheque Date</p>
                          <p>{formatDate(selectedEntry.chequeDate)}</p>
                        </div>
                  }
                      {selectedEntry.bankName &&
                  <div>
                          <p className="text-xs text-gray-500">Bank</p>
                          <p>{selectedEntry.bankName}</p>
                        </div>
                  }
                    </div>
                  </div>
              }
                <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <span>
                    Created by {selectedEntry.createdBy} on{' '}
                    {selectedEntry.createdAt}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowViewModal(false)}>

                  Close
                </Button>
                {selectedEntry.isEditable &&
              <Button variant="primary" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Entry
                  </Button>
              }
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Export Ledger
                </h2>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Export {filteredData.length} entries across{' '}
                    {Object.keys(groupedByBranch).length} branches
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Period: {appliedFilters.fromDate || 'Start'} to{' '}
                    {appliedFilters.toDate || 'Present'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Select Format
                  </p>
                  <button
                  onClick={() => {
                    alert('Exported to PDF!');
                    setShowExportModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50">

                    <FileText className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium">PDF Document</p>
                      <p className="text-xs text-gray-500">
                        Best for printing and sharing
                      </p>
                    </div>
                  </button>
                  <button
                  onClick={() => {
                    alert('Exported to Excel!');
                    setShowExportModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50">

                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Excel Spreadsheet</p>
                      <p className="text-xs text-gray-500">
                        Best for data analysis
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Account Details Modal */}
      {showAccountDetails && selectedAccount &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Account Details
                </h2>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAccountDetails(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {selectedAccount.name}
                    </p>
                    <p className="text-sm text-gray-500 font-mono">
                      {selectedAccount.code}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Account Group</p>
                    <p className="font-medium">{selectedAccount.group}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sub-Group</p>
                    <p className="font-medium">{selectedAccount.subGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ledger Type</p>
                    <Badge variant="primary" className="mt-1">
                      {selectedAccount.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Branch</p>
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-1 ${getBranchColor(selectedAccount.branch)}`}>

                      {getBranchLabel(selectedAccount.branch).split(' - ')[0]}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Opening Balance</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(selectedAccount.openingBalance)}
                    </p>
                    <Badge
                    variant={
                    selectedAccount.openingBalanceType === 'Dr' ?
                    'success' :
                    'danger'
                    }>

                      {selectedAccount.openingBalanceType}
                    </Badge>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600">Current Balance</p>
                    <p className="text-xl font-bold text-purple-900">
                      {formatCurrency(selectedAccount.currentBalance)}
                    </p>
                    <Badge
                    variant={
                    selectedAccount.currentBalanceType === 'Dr' ?
                    'success' :
                    'danger'
                    }>

                      {selectedAccount.currentBalanceType}
                    </Badge>
                  </div>
                </div>
                {selectedAccount.linkedParty &&
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-600 font-medium mb-2">
                      Linked Party
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedAccount.linkedParty.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAccount.linkedParty.type} •{' '}
                      {selectedAccount.linkedParty.code}
                    </p>
                  </div>
              }
              </div>
              <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => setShowAccountDetails(false)}>

                Close
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Help Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">Quick Tips</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>
                • Select branches from the dropdown to filter data by specific
                locations
              </li>
              <li>
                • Use batch filter to view transactions for specific time slots
              </li>
              <li>• Data is organized branch-wise for easy understanding</li>
              <li>
                • Click on voucher numbers to drill-down and view full details
              </li>
              <li>• Export to PDF for sharing or Excel for further analysis</li>
            </ul>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Guide
          </Button>
        </div>
      </Card>
    </div>);

}