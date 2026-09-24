import React, { useMemo, useState, createElement } from 'react';
// File: src/pages/reports/BankBook.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import {
  Download,
  Printer,
  Search,
  Filter,
  RefreshCw,
  Building2,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  GitBranch,
  Plus,
  Users } from
'lucide-react';
// Interfaces
interface BankTransaction {
  id: number;
  date: string;
  bankId: string;
  bankName: string;
  voucherNo: string;
  description: string;
  deposit: number;
  withdrawal: number;
  runningBalance: number;
  chequeNo?: string;
  referenceNo?: string;
  reconciled: boolean;
  branchId: string;
  batchId: string;
}
interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}
interface Branch {
  id: string;
  name: string;
  code: string;
}
interface Batch {
  id: string;
  name: string;
  year: string;
}
export function BankBook() {
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-01-31');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const itemsPerPage = 15;
  // Branch Data
  const branches: Branch[] = [
  {
    id: 'main',
    name: 'Main Campus',
    code: 'MAIN'
  },
  {
    id: 'north',
    name: 'North Campus',
    code: 'NORTH'
  },
  {
    id: 'south',
    name: 'South Campus',
    code: 'SOUTH'
  },
  {
    id: 'east',
    name: 'East Campus',
    code: 'EAST'
  }];

  // Batch Data
  const batches: Batch[] = [
  {
    id: 'all',
    name: 'All Batches',
    year: ''
  },
  {
    id: '2024',
    name: 'Batch 2024',
    year: '2024'
  },
  {
    id: '2023',
    name: 'Batch 2023',
    year: '2023'
  },
  {
    id: '2022',
    name: 'Batch 2022',
    year: '2022'
  },
  {
    id: '2021',
    name: 'Batch 2021',
    year: '2021'
  }];

  // Bank Accounts Data
  const bankAccounts: BankAccount[] = [
  {
    id: 'hdfc-main',
    name: 'HDFC Bank',
    accountNumber: '5020001234567890',
    ifsc: 'HDFC0001234',
    branch: 'Main Branch, Mumbai',
    openingBalance: 500000,
    currentBalance: 625000,
    isActive: true
  },
  {
    id: 'sbi-main',
    name: 'State Bank of India',
    accountNumber: '3520001234567891',
    ifsc: 'SBIN0001234',
    branch: 'Central Branch, Mumbai',
    openingBalance: 350000,
    currentBalance: 415000,
    isActive: true
  },
  {
    id: 'icici-main',
    name: 'ICICI Bank',
    accountNumber: '6020001234567892',
    ifsc: 'ICIC0001234',
    branch: 'Business Branch, Mumbai',
    openingBalance: 200000,
    currentBalance: 245000,
    isActive: true
  },
  {
    id: 'axis-main',
    name: 'Axis Bank',
    accountNumber: '9020001234567893',
    ifsc: 'AXIS0001234',
    branch: 'Corporate Branch, Mumbai',
    openingBalance: 150000,
    currentBalance: 185000,
    isActive: true
  }];

  // Bank Transactions Data with branch and batch
  const [allTransactions, setAllTransactions] = useState<BankTransaction[]>([
  {
    id: 1,
    date: '2024-01-01',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-001',
    description: 'Opening Balance',
    deposit: 0,
    withdrawal: 0,
    runningBalance: 500000,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 2,
    date: '2024-01-02',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-002',
    description: 'Tuition fee collection - STU001',
    deposit: 15000,
    withdrawal: 0,
    runningBalance: 515000,
    chequeNo: 'CHQ-1001',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 3,
    date: '2024-01-03',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'PAY-001',
    description: 'Salary payment - Teaching Staff',
    deposit: 0,
    withdrawal: 250000,
    runningBalance: 265000,
    chequeNo: 'CHQ-1002',
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 4,
    date: '2024-01-04',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-003',
    description: 'Tuition fee - STU002',
    deposit: 18000,
    withdrawal: 0,
    runningBalance: 283000,
    chequeNo: 'CHQ-1003',
    reconciled: true,
    branchId: 'south',
    batchId: '2023'
  },
  {
    id: 5,
    date: '2024-01-05',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'PAY-002',
    description: 'Electricity bill payment',
    deposit: 0,
    withdrawal: 45000,
    runningBalance: 238000,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 6,
    date: '2024-01-08',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-004',
    description: 'Admission fee - STU003',
    deposit: 25000,
    withdrawal: 0,
    runningBalance: 263000,
    chequeNo: 'CHQ-1004',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 7,
    date: '2024-01-10',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-005',
    description: 'Tuition fee - STU004',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 279500,
    chequeNo: 'CHQ-1005',
    reconciled: true,
    branchId: 'north',
    batchId: '2023'
  },
  {
    id: 8,
    date: '2024-01-12',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'PAY-003',
    description: 'Lab equipment purchase',
    deposit: 0,
    withdrawal: 75000,
    runningBalance: 204500,
    chequeNo: 'CHQ-1006',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 9,
    date: '2024-01-15',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-006',
    description: 'Donation received',
    deposit: 100000,
    withdrawal: 0,
    runningBalance: 304500,
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 10,
    date: '2024-01-18',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'PAY-004',
    description: 'Hostel mess provisions',
    deposit: 0,
    withdrawal: 85000,
    runningBalance: 219500,
    chequeNo: 'CHQ-1007',
    reconciled: true,
    branchId: 'east',
    batchId: '2022'
  },
  {
    id: 11,
    date: '2024-01-22',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-007',
    description: 'Tuition fee - STU005',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 236000,
    chequeNo: 'CHQ-1008',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 12,
    date: '2024-01-25',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-008',
    description: 'Government Grant',
    deposit: 500000,
    withdrawal: 0,
    runningBalance: 736000,
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 13,
    date: '2024-01-29',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'PAY-005',
    description: 'Telephone bill payment',
    deposit: 0,
    withdrawal: 5500,
    runningBalance: 730500,
    reconciled: true,
    branchId: 'south',
    batchId: '2023'
  },
  {
    id: 14,
    date: '2024-01-30',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-009',
    description: 'Tuition fee - STU006',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 747000,
    chequeNo: 'CHQ-1009',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 15,
    date: '2024-01-31',
    bankId: 'hdfc-main',
    bankName: 'HDFC Bank',
    voucherNo: 'RCP-010',
    description: 'Hostel fee collection',
    deposit: 25000,
    withdrawal: 0,
    runningBalance: 772000,
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 16,
    date: '2024-01-01',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-001',
    description: 'Opening Balance',
    deposit: 0,
    withdrawal: 0,
    runningBalance: 350000,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 17,
    date: '2024-01-02',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-002',
    description: 'Tuition fee - STU007',
    deposit: 15000,
    withdrawal: 0,
    runningBalance: 365000,
    chequeNo: 'CHQ-2001',
    reconciled: true,
    branchId: 'north',
    batchId: '2023'
  },
  {
    id: 18,
    date: '2024-01-03',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'PAY-001',
    description: 'Salary payment - Non-Teaching Staff',
    deposit: 0,
    withdrawal: 85000,
    runningBalance: 280000,
    chequeNo: 'CHQ-2002',
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 19,
    date: '2024-01-04',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-003',
    description: 'Transport fee collection',
    deposit: 35000,
    withdrawal: 0,
    runningBalance: 315000,
    chequeNo: 'CHQ-2003',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 20,
    date: '2024-01-05',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'PAY-002',
    description: 'Security services payment',
    deposit: 0,
    withdrawal: 25000,
    runningBalance: 290000,
    reconciled: true,
    branchId: 'east',
    batchId: '2022'
  },
  {
    id: 21,
    date: '2024-01-08',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-004',
    description: 'Library fee collection',
    deposit: 2000,
    withdrawal: 0,
    runningBalance: 292000,
    chequeNo: 'CHQ-2004',
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 22,
    date: '2024-01-10',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-005',
    description: 'Tuition fee - STU008',
    deposit: 13500,
    withdrawal: 0,
    runningBalance: 305500,
    chequeNo: 'CHQ-2005',
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 23,
    date: '2024-01-12',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'PAY-003',
    description: 'Stationery purchase',
    deposit: 0,
    withdrawal: 5500,
    runningBalance: 300000,
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 24,
    date: '2024-01-15',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-006',
    description: 'Exam fee collection',
    deposit: 3500,
    withdrawal: 0,
    runningBalance: 303500,
    chequeNo: 'CHQ-2006',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 25,
    date: '2024-01-18',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'PAY-004',
    description: 'Building maintenance',
    deposit: 0,
    withdrawal: 45000,
    runningBalance: 258500,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 26,
    date: '2024-01-22',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-007',
    description: 'Tuition fee - STU009',
    deposit: 15000,
    withdrawal: 0,
    runningBalance: 273500,
    chequeNo: 'CHQ-2007',
    reconciled: true,
    branchId: 'north',
    batchId: '2022'
  },
  {
    id: 27,
    date: '2024-01-25',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-008',
    description: 'Sports fee collection',
    deposit: 3000,
    withdrawal: 0,
    runningBalance: 276500,
    chequeNo: 'CHQ-2008',
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 28,
    date: '2024-01-29',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'PAY-005',
    description: 'Internet bill payment',
    deposit: 0,
    withdrawal: 15000,
    runningBalance: 261500,
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 29,
    date: '2024-01-30',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-009',
    description: 'Tuition fee - STU010',
    deposit: 18000,
    withdrawal: 0,
    runningBalance: 279500,
    chequeNo: 'CHQ-2009',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 30,
    date: '2024-01-31',
    bankId: 'sbi-main',
    bankName: 'State Bank of India',
    voucherNo: 'RCP-010',
    description: 'Canteen rent collection',
    deposit: 5500,
    withdrawal: 0,
    runningBalance: 285000,
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 31,
    date: '2024-01-01',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-001',
    description: 'Opening Balance',
    deposit: 0,
    withdrawal: 0,
    runningBalance: 200000,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 32,
    date: '2024-01-02',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-002',
    description: 'Tuition fee - STU011',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 216500,
    chequeNo: 'CHQ-3001',
    reconciled: true,
    branchId: 'south',
    batchId: '2023'
  },
  {
    id: 33,
    date: '2024-01-03',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'PAY-001',
    description: 'Printing & Publishing',
    deposit: 0,
    withdrawal: 35000,
    runningBalance: 181500,
    chequeNo: 'CHQ-3002',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 34,
    date: '2024-01-04',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-003',
    description: 'Admission fee - STU012',
    deposit: 25000,
    withdrawal: 0,
    runningBalance: 206500,
    chequeNo: 'CHQ-3003',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 35,
    date: '2024-01-05',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'PAY-002',
    description: 'Vehicle maintenance',
    deposit: 0,
    withdrawal: 18000,
    runningBalance: 188500,
    chequeNo: 'CHQ-3004',
    reconciled: true,
    branchId: 'north',
    batchId: '2022'
  },
  {
    id: 36,
    date: '2024-01-08',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-004',
    description: 'Hostel fee - STU013',
    deposit: 25000,
    withdrawal: 0,
    runningBalance: 213500,
    chequeNo: 'CHQ-3005',
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 37,
    date: '2024-01-10',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-005',
    description: 'Tuition fee - STU014',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 230000,
    chequeNo: 'CHQ-3006',
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 38,
    date: '2024-01-12',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'PAY-003',
    description: 'Event expense - Annual Day',
    deposit: 0,
    withdrawal: 15000,
    runningBalance: 215000,
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 39,
    date: '2024-01-15',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-006',
    description: 'Fine collection',
    deposit: 2500,
    withdrawal: 0,
    runningBalance: 217500,
    chequeNo: 'CHQ-3007',
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 40,
    date: '2024-01-18',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'PAY-004',
    description: 'Library books purchase',
    deposit: 0,
    withdrawal: 45000,
    runningBalance: 172500,
    chequeNo: 'CHQ-3008',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 41,
    date: '2024-01-22',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-007',
    description: 'Tuition fee - STU015',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 189000,
    chequeNo: 'CHQ-3009',
    reconciled: true,
    branchId: 'south',
    batchId: '2022'
  },
  {
    id: 42,
    date: '2024-01-25',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-008',
    description: 'Uniform fee collection',
    deposit: 15000,
    withdrawal: 0,
    runningBalance: 204000,
    chequeNo: 'CHQ-3010',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 43,
    date: '2024-01-29',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'PAY-005',
    description: 'Gardening expense',
    deposit: 0,
    withdrawal: 3500,
    runningBalance: 200500,
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 44,
    date: '2024-01-30',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-009',
    description: 'Tuition fee - STU016',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 217000,
    chequeNo: 'CHQ-3011',
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 45,
    date: '2024-01-31',
    bankId: 'icici-main',
    bankName: 'ICICI Bank',
    voucherNo: 'RCP-010',
    description: 'Activity fee collection',
    deposit: 4000,
    withdrawal: 0,
    runningBalance: 221000,
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 46,
    date: '2024-01-01',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-001',
    description: 'Opening Balance',
    deposit: 0,
    withdrawal: 0,
    runningBalance: 150000,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 47,
    date: '2024-01-02',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-002',
    description: 'Tuition fee - STU017',
    deposit: 15000,
    withdrawal: 0,
    runningBalance: 165000,
    chequeNo: 'CHQ-4001',
    reconciled: true,
    branchId: 'east',
    batchId: '2023'
  },
  {
    id: 48,
    date: '2024-01-03',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'PAY-001',
    description: 'Tea & Refreshment',
    deposit: 0,
    withdrawal: 1500,
    runningBalance: 163500,
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 49,
    date: '2024-01-04',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-003',
    description: 'Transport fee - STU018',
    deposit: 3500,
    withdrawal: 0,
    runningBalance: 167000,
    chequeNo: 'CHQ-4002',
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 50,
    date: '2024-01-05',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'PAY-002',
    description: 'Cleaning supplies',
    deposit: 0,
    withdrawal: 2500,
    runningBalance: 164500,
    reconciled: true,
    branchId: 'south',
    batchId: '2022'
  },
  {
    id: 51,
    date: '2024-01-08',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-004',
    description: 'Tuition fee - STU019',
    deposit: 13500,
    withdrawal: 0,
    runningBalance: 178000,
    chequeNo: 'CHQ-4003',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  },
  {
    id: 52,
    date: '2024-01-10',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-005',
    description: 'Library fee - STU020',
    deposit: 2000,
    withdrawal: 0,
    runningBalance: 180000,
    chequeNo: 'CHQ-4004',
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 53,
    date: '2024-01-12',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'PAY-003',
    description: 'Water bill payment',
    deposit: 0,
    withdrawal: 8500,
    runningBalance: 171500,
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 54,
    date: '2024-01-15',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-006',
    description: 'Sports fee - STU021',
    deposit: 3000,
    withdrawal: 0,
    runningBalance: 174500,
    chequeNo: 'CHQ-4005',
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 55,
    date: '2024-01-18',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'PAY-004',
    description: 'Security services',
    deposit: 0,
    withdrawal: 25000,
    runningBalance: 149500,
    reconciled: true,
    branchId: 'main',
    batchId: '2024'
  },
  {
    id: 56,
    date: '2024-01-22',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-007',
    description: 'Tuition fee - STU022',
    deposit: 18000,
    withdrawal: 0,
    runningBalance: 167500,
    chequeNo: 'CHQ-4006',
    reconciled: true,
    branchId: 'east',
    batchId: '2022'
  },
  {
    id: 57,
    date: '2024-01-25',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-008',
    description: 'Exam fee - STU023',
    deposit: 3500,
    withdrawal: 0,
    runningBalance: 171000,
    chequeNo: 'CHQ-4007',
    reconciled: true,
    branchId: 'north',
    batchId: '2024'
  },
  {
    id: 58,
    date: '2024-01-29',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'PAY-005',
    description: 'Vehicle fuel expense',
    deposit: 0,
    withdrawal: 25000,
    runningBalance: 146000,
    reconciled: true,
    branchId: 'main',
    batchId: '2023'
  },
  {
    id: 59,
    date: '2024-01-30',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-009',
    description: 'Tuition fee - STU024',
    deposit: 16500,
    withdrawal: 0,
    runningBalance: 162500,
    chequeNo: 'CHQ-4008',
    reconciled: true,
    branchId: 'south',
    batchId: '2024'
  },
  {
    id: 60,
    date: '2024-01-31',
    bankId: 'axis-main',
    bankName: 'Axis Bank',
    voucherNo: 'RCP-010',
    description: 'Hostel fee - STU025',
    deposit: 25000,
    withdrawal: 0,
    runningBalance: 187500,
    chequeNo: 'CHQ-4009',
    reconciled: true,
    branchId: 'east',
    batchId: '2024'
  }]);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      if (selectedBankId !== 'all' && t.bankId !== selectedBankId) return false;
      if (
      !selectedBranches.includes('all') &&
      !selectedBranches.includes(t.branchId))

      return false;
      if (selectedBatch !== 'all' && t.batchId !== selectedBatch) return false;
      if (t.date < fromDate || t.date > toDate) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
        !t.description.toLowerCase().includes(q) &&
        !t.voucherNo.toLowerCase().includes(q) &&
        !t.chequeNo?.toLowerCase().includes(q))

        return false;
      }
      return true;
    });
  }, [
  selectedBankId,
  selectedBranches,
  selectedBatch,
  fromDate,
  toDate,
  searchQuery]
  );
  // Group transactions by branch
  const transactionsByBranch = useMemo(() => {
    const grouped: Record<string, BankTransaction[]> = {};
    filteredTransactions.forEach((t) => {
      if (!grouped[t.branchId]) grouped[t.branchId] = [];
      grouped[t.branchId].push(t);
    });
    return grouped;
  }, [filteredTransactions]);
  // Branch-wise summary
  const branchSummary = useMemo(() => {
    return branches.
    map((branch) => {
      const transactions = transactionsByBranch[branch.id] || [];
      const deposits = transactions.reduce((sum, t) => sum + t.deposit, 0);
      const withdrawals = transactions.reduce(
        (sum, t) => sum + t.withdrawal,
        0
      );
      return {
        ...branch,
        deposits,
        withdrawals,
        netFlow: deposits - withdrawals,
        count: transactions.length
      };
    }).
    filter(
      (b) =>
      b.count > 0 ||
      selectedBranches.includes('all') ||
      selectedBranches.includes(b.id)
    );
  }, [transactionsByBranch, branches, selectedBranches]);
  // Pagination
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  // Calculate Summary
  const summary = useMemo(() => {
    const totalDeposits = filteredTransactions.reduce(
      (sum, t) => sum + t.deposit,
      0
    );
    const totalWithdrawals = filteredTransactions.reduce(
      (sum, t) => sum + t.withdrawal,
      0
    );
    const netFlow = totalDeposits - totalWithdrawals;
    let openingBalance =
    selectedBankId === 'all' ?
    bankAccounts.reduce((sum, b) => sum + b.openingBalance, 0) :
    bankAccounts.find((b) => b.id === selectedBankId)?.openingBalance || 0;
    return {
      totalDeposits,
      totalWithdrawals,
      netFlow,
      openingBalance,
      endingBalance: openingBalance + netFlow,
      reconciledCount: filteredTransactions.filter((t) => t.reconciled).length,
      unreconciledCount: filteredTransactions.filter((t) => !t.reconciled).
      length
    };
  }, [filteredTransactions, selectedBankId, bankAccounts]);
  // Helpers
  const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  // Manual Bank Transaction Entry
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [newTxn, setNewTxn] = useState({
    date: '2024-01-31',
    bankId: bankAccounts[0]?.id || '',
    voucherNo: '',
    description: '',
    type: 'deposit' as 'deposit' | 'withdrawal',
    amount: '',
    chequeNo: '',
    referenceNo: '',
    branchId: branches[0]?.id || '',
    batchId: batches[1]?.id || batches[0]?.id || ''
  });
  const openAddTxnModal = () => {
    setNewTxn((f) => ({
      ...f,
      bankId: selectedBankId !== 'all' ? selectedBankId : f.bankId,
      branchId:
      selectedBranches.includes('all') || selectedBranches.length !== 1 ?
      f.branchId :
      selectedBranches[0],
      batchId: selectedBatch !== 'all' ? selectedBatch : f.batchId
    }));
    setShowAddTxnModal(true);
  };
  const handleAddTransaction = () => {
    const amount = Number(newTxn.amount) || 0;
    if (!newTxn.bankId || !newTxn.description.trim() || amount <= 0) return;
    const bank = bankAccounts.find((b) => b.id === newTxn.bankId);
    const bankTxns = allTransactions.
    filter((t) => t.bankId === newTxn.bankId).
    sort((a, b) => a.date < b.date ? -1 : 1);
    const lastBalance = bankTxns.length > 0 ?
    bankTxns[bankTxns.length - 1].runningBalance :
    bank?.openingBalance || 0;
    const deposit = newTxn.type === 'deposit' ? amount : 0;
    const withdrawal = newTxn.type === 'withdrawal' ? amount : 0;
    const txn: BankTransaction = {
      id: Math.max(0, ...allTransactions.map((t) => t.id)) + 1,
      date: newTxn.date,
      bankId: newTxn.bankId,
      bankName: bank?.name || '',
      voucherNo:
      newTxn.voucherNo ||
      `${newTxn.type === 'deposit' ? 'DEP' : 'WDL'}-${String(
        allTransactions.length + 1
      ).padStart(3, '0')}`,
      description: newTxn.description.trim(),
      deposit,
      withdrawal,
      runningBalance: lastBalance + deposit - withdrawal,
      chequeNo: newTxn.chequeNo || undefined,
      referenceNo: newTxn.referenceNo || undefined,
      reconciled: false,
      branchId: newTxn.branchId,
      batchId: newTxn.batchId
    };
    setAllTransactions((prev) => [...prev, txn]);
    setShowAddTxnModal(false);
    setNewTxn((f) => ({
      ...f,
      voucherNo: '',
      description: '',
      amount: '',
      chequeNo: '',
      referenceNo: ''
    }));
  };
  const formatCurrency = (n: number) => n.toLocaleString('en-IN');
  const getBankName = (id: string) =>
  bankAccounts.find((b) => b.id === id)?.name || id;
  const getBranchName = (id: string) =>
  branches.find((b) => b.id === id)?.name || id;
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      let newSelection = selectedBranches.filter((b) => b !== 'all');
      if (newSelection.includes(branchId)) {
        newSelection = newSelection.filter((b) => b !== branchId);
        if (newSelection.length === 0) newSelection = ['all'];
      } else {
        newSelection.push(branchId);
        if (newSelection.length === branches.length) newSelection = ['all'];
      }
      setSelectedBranches(newSelection);
    }
    setCurrentPage(1);
  };
  const handleExport = () => {
    const headers = [
    'Date',
    'Voucher No',
    'Bank',
    'Branch',
    'Batch',
    'Description',
    'Cheque No',
    'Deposit',
    'Withdrawal',
    'Balance',
    'Status'];

    const csvData = filteredTransactions.map((t) => [
    t.date,
    t.voucherNo,
    t.bankName,
    getBranchName(t.branchId),
    t.batchId,
    `"${t.description}"`,
    t.chequeNo || '-',
    t.deposit,
    t.withdrawal,
    t.runningBalance,
    t.reconciled ? 'Reconciled' : 'Pending']
    );
    const csvContent = [
    headers.join(','),
    ...csvData.map((r) => r.join(','))].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-book-${fromDate}-to-${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const handleResetFilters = () => {
    setSelectedBankId('all');
    setSelectedBranches(['all']);
    setSelectedBatch('all');
    setFromDate('2024-01-01');
    setToDate('2024-01-31');
    setSearchQuery('');
    setCurrentPage(1);
  };
  const getSelectedBranchesText = () => {
    if (selectedBranches.includes('all')) return 'All Branches';
    if (selectedBranches.length === 1) return getBranchName(selectedBranches[0]);
    return `${selectedBranches.length} Branches`;
  };
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-blue-600" /> Bank Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bank transactions and reconciliation view with branch-wise analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={openAddTxnModal}>
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Bank Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankAccounts.map((bank) =>
        <Card
          key={bank.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedBankId === bank.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
          onClick={() => {
            setSelectedBankId(selectedBankId === bank.id ? 'all' : bank.id);
            setCurrentPage(1);
          }}>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800 text-sm">
                  {bank.name}
                </span>
              </div>
              <span
              className={`text-xs px-2 py-0.5 rounded-full ${bank.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>

                {bank.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              A/C: ****{bank.accountNumber.slice(-4)}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Current Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{formatCurrency(bank.currentBalance)}
                </p>
              </div>
              <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBankId === bank.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>

                {selectedBankId === bank.id ? 'Selected' : 'Select'}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5" /> Search & Filters
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}>

              <ChevronDown
                className={`w-4 h-4 mr-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />

              {showFilters ? 'Hide' : 'Show'} Advanced
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <RefreshCw className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Bank Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Bank
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={selectedBankId}
                onChange={(e) => {
                  setSelectedBankId(e.target.value);
                  setCurrentPage(1);
                }}>

                <option value="all">All Banks</option>
                {bankAccounts.
                filter((b) => b.isActive).
                map((b) =>
                <option key={b.id} value={b.id}>
                      {b.name} - ****{b.accountNumber.slice(-4)}
                    </option>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Branch Multi-Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Branch(es)
            </label>
            <button
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}>

              <span className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-gray-400" />
                {getSelectedBranchesText()}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />

            </button>
            {showBranchDropdown &&
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedBranches.includes('all') ? 'bg-blue-50' : ''}`}
                onClick={() => handleBranchToggle('all')}>

                  <input
                  type="checkbox"
                  checked={selectedBranches.includes('all')}
                  readOnly
                  className="rounded" />

                  <span>All Branches</span>
                </div>
                {branches.map((branch) =>
              <div
                key={branch.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedBranches.includes(branch.id) ? 'bg-blue-50' : ''}`}
                onClick={() => handleBranchToggle(branch.id)}>

                    <input
                  type="checkbox"
                  checked={
                  selectedBranches.includes(branch.id) ||
                  selectedBranches.includes('all')
                  }
                  readOnly
                  className="rounded" />

                    <span>{branch.name}</span>
                    <span className="text-xs text-gray-400">
                      ({branch.code})
                    </span>
                  </div>
              )}
              </div>
            }
          </div>

          {/* Batch Single Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Batch
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setCurrentPage(1);
                }}>

                {batches.map((b) =>
                <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }} />

            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }} />

            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedBankId !== 'all' ||
        !selectedBranches.includes('all') ||
        selectedBatch !== 'all' ||
        searchQuery) &&
        <div className="mt-4 flex flex-wrap gap-2">
            {selectedBankId !== 'all' &&
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Bank: {getBankName(selectedBankId)}
                <button
              onClick={() => setSelectedBankId('all')}
              className="ml-2 hover:bg-blue-200 rounded-full p-0.5">

                  <X className="w-3 h-3" />
                </button>
              </span>
          }
            {!selectedBranches.includes('all') &&
          selectedBranches.map((bId) =>
          <span
            key={bId}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">

                  Branch: {getBranchName(bId)}
                  <button
              onClick={() => handleBranchToggle(bId)}
              className="ml-2 hover:bg-purple-200 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
          )}
            {selectedBatch !== 'all' &&
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Batch: {selectedBatch}
                <button
              onClick={() => setSelectedBatch('all')}
              className="ml-2 hover:bg-orange-200 rounded-full p-0.5">

                  <X className="w-3 h-3" />
                </button>
              </span>
          }
            {searchQuery &&
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                Search: "{searchQuery}"
                <button
              onClick={() => setSearchQuery('')}
              className="ml-2 hover:bg-gray-200 rounded-full p-0.5">

                  <X className="w-3 h-3" />
                </button>
              </span>
          }
          </div>
        }
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
        {
          label: 'Opening Balance',
          value: summary.openingBalance,
          icon: Wallet,
          color: 'blue'
        },
        {
          label: 'Total Deposits',
          value: summary.totalDeposits,
          icon: TrendingUp,
          color: 'green'
        },
        {
          label: 'Total Withdrawals',
          value: summary.totalWithdrawals,
          icon: TrendingDown,
          color: 'red'
        },
        {
          label: 'Net Flow',
          value: summary.netFlow,
          icon: summary.netFlow >= 0 ? TrendingUp : TrendingDown,
          color: summary.netFlow >= 0 ? 'green' : 'red'
        },
        {
          label: 'Ending Balance',
          value: summary.endingBalance,
          icon: Wallet,
          color: 'gray'
        }].
        map((item, i) =>
        <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className={`text-2xl font-bold text-${item.color}-600`}>
                  ₹{formatCurrency(item.value)}
                </p>
              </div>
              <div className={`p-3 bg-${item.color}-100 rounded-full`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Branch-wise Summary */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5" /> Branch-wise Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branchSummary.map((branch) =>
          <div
            key={branch.id}
            className={`p-4 rounded-lg border-2 ${selectedBranches.includes(branch.id) || selectedBranches.includes('all') ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>

              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">
                  {branch.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                  {branch.code}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Deposits</p>
                  <p className="font-bold text-green-600">
                    ₹{formatCurrency(branch.deposits)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Withdrawals</p>
                  <p className="font-bold text-red-600">
                    ₹{formatCurrency(branch.withdrawals)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Net</p>
                  <p
                  className={`font-bold ${branch.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                    ₹{formatCurrency(branch.netFlow)}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {branch.count} transactions
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Transaction Table */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Bank Transactions
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredTransactions.length} records)
            </span>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            {selectedBankId === 'all' ?
            'All Banks' :
            getBankName(selectedBankId)}
            {!selectedBranches.includes('all') &&
            <>
                <GitBranch className="w-4 h-4 ml-2" />
                {getSelectedBranchesText()}
              </>
            }
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                'Date',
                'Voucher',
                'Branch',
                'Batch',
                'Description',
                'Deposit (₹)',
                'Withdrawal (₹)',
                'Balance (₹)',
                'Bank',
                'Status'].
                map((h) =>
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${['Deposit', 'Withdrawal', 'Balance'].some((x) => h.includes(x)) ? 'text-right' : 'text-left'}`}>

                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.length > 0 ?
              paginatedTransactions.map((t) =>
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-blue-600">
                        {t.voucherNo}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                        {getBranchName(t.branchId)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                        {t.batchId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {t.description}
                      {t.chequeNo &&
                  <span className="ml-2 text-xs text-gray-400">
                          (Chq: {t.chequeNo})
                        </span>
                  }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="text-green-600 font-medium">
                        {t.deposit > 0 ? formatCurrency(t.deposit) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="text-red-600 font-medium">
                        {t.withdrawal > 0 ? formatCurrency(t.withdrawal) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span
                    className={`font-bold ${t.runningBalance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>

                        {formatCurrency(t.runningBalance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {t.bankName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.reconciled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>

                        {t.reconciled ?
                    <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Reconciled
                          </> :

                    <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Pending
                          </>
                    }
                      </span>
                    </td>
                  </tr>
              ) :

              <tr>
                  <td
                  colSpan={10}
                  className="px-4 py-8 text-center text-gray-500">

                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium">
                        No transactions found
                      </p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 &&
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}>

                Previous
              </Button>
              {Array.from(
              {
                length: Math.min(5, totalPages)
              },
              (_, i) => {
                let pageNum =
                totalPages <= 5 ?
                i + 1 :
                currentPage <= 3 ?
                i + 1 :
                currentPage >= totalPages - 2 ?
                totalPages - 4 + i :
                currentPage - 2 + i;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}>

                      {pageNum}
                    </Button>);

              }
            )}
              <Button
              variant="outline"
              size="sm"
              onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}>

                Next
              </Button>
            </div>
          </div>
        }

        {/* Footer Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {paginatedTransactions.length} of{' '}
              {filteredTransactions.length} transactions
              {filteredTransactions.length !== allTransactions.length &&
              <span> (Total: {allTransactions.length})</span>
              }
            </div>
            <div className="flex flex-wrap gap-6">
              {[
              {
                label: 'Total Deposits',
                value: summary.totalDeposits,
                color: 'green'
              },
              {
                label: 'Total Withdrawals',
                value: summary.totalWithdrawals,
                color: 'red'
              },
              {
                label: 'Net Flow',
                value: summary.netFlow,
                color: summary.netFlow >= 0 ? 'green' : 'red'
              },
              {
                label: 'Ending Balance',
                value: summary.endingBalance,
                color: 'gray'
              }].
              map((item, i) =>
              <div key={i} className="text-right">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className={`text-lg font-bold text-${item.color}-600`}>
                    ₹{formatCurrency(item.value)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Bank Details */}
      {selectedBankId !== 'all' &&
      <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Selected Bank Account</p>
                <p className="text-lg font-semibold text-gray-800">
                  {getBankName(selectedBankId)}
                </p>
                <p className="text-sm text-gray-600">
                  A/C:{' '}
                  {
                bankAccounts.find((b) => b.id === selectedBankId)?.
                accountNumber
                }{' '}
                  | IFSC:{' '}
                  {bankAccounts.find((b) => b.id === selectedBankId)?.ifsc}
                </p>
                <p className="text-xs text-gray-500">
                  Branch:{' '}
                  {bankAccounts.find((b) => b.id === selectedBankId)?.branch}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={() => setSelectedBankId('all')}>

                <X className="w-4 h-4 mr-2" /> Clear
              </Button>
              <Button variant="primary">
                <CheckCircle className="w-4 h-4 mr-2" /> Reconcile This Bank
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Add Bank Transaction Modal */}
      <Modal
        isOpen={showAddTxnModal}
        onClose={() => setShowAddTxnModal(false)}
        title="Add Bank Transaction"
        size="lg"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddTxnModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTransaction}>
              <Plus className="w-4 h-4 mr-2" /> Save Transaction
            </Button>
          </div>
        }>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={newTxn.date}
            onChange={(e) => setNewTxn((f) => ({ ...f, date: e.target.value }))} />

          <Select
            label="Bank Account"
            value={newTxn.bankId}
            onChange={(value: string) =>
            setNewTxn((f) => ({ ...f, bankId: value }))
            }
            options={bankAccounts.map((b) => ({
              value: b.id,
              label: `${b.name} • ****${b.accountNumber.slice(-4)}`
            }))} />

          <Select
            label="Transaction Type"
            value={newTxn.type}
            onChange={(value: string) =>
            setNewTxn((f) => ({ ...f, type: value as 'deposit' | 'withdrawal' }))
            }
            options={[
            { value: 'deposit', label: 'Deposit' },
            { value: 'withdrawal', label: 'Withdrawal' }]
            } />

          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            value={newTxn.amount}
            onChange={(e) => setNewTxn((f) => ({ ...f, amount: e.target.value }))} />

          <Input
            label="Voucher No"
            placeholder="Auto-generated if left blank"
            value={newTxn.voucherNo}
            onChange={(e) =>
            setNewTxn((f) => ({ ...f, voucherNo: e.target.value }))
            } />

          <Input
            label="Cheque No"
            placeholder="Optional"
            value={newTxn.chequeNo}
            onChange={(e) =>
            setNewTxn((f) => ({ ...f, chequeNo: e.target.value }))
            } />

          <Input
            label="Reference No"
            placeholder="Optional"
            value={newTxn.referenceNo}
            onChange={(e) =>
            setNewTxn((f) => ({ ...f, referenceNo: e.target.value }))
            } />

          <Select
            label="Branch"
            value={newTxn.branchId}
            onChange={(value: string) =>
            setNewTxn((f) => ({ ...f, branchId: value }))
            }
            options={branches.map((b) => ({ value: b.id, label: b.name }))} />

          <Select
            label="Batch"
            value={newTxn.batchId}
            onChange={(value: string) =>
            setNewTxn((f) => ({ ...f, batchId: value }))
            }
            options={batches.
            filter((b) => b.id !== 'all').
            map((b) => ({ value: b.id, label: b.name }))} />

          <div className="md:col-span-2">
            <Input
              label="Description / Narration"
              placeholder="e.g. Cash deposited to bank"
              value={newTxn.description}
              onChange={(e) =>
              setNewTxn((f) => ({ ...f, description: e.target.value }))
              } />
          </div>
        </div>
      </Modal>
    </div>);

}
export default BankBook;