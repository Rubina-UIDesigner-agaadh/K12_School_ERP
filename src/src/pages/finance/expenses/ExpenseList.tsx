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
  Paperclip,
  Eye,
  Printer,
  History,
  Download,
  FileText,
  Calendar,
  Building2,
  ChevronRight } from
'lucide-react';

export function ExpenseList() {
  // Mock Data for Expenses
  const [expenses] = useState([
  {
    id: '1',
    voucherNo: 'VCH-2024-101',
    billDate: '2024-03-15',
    vendorName: 'Global Electricity Corp',
    expenseHead: 'Electricity',
    billAmount: 12500,
    paidAmount: 12500,
    balance: 0,
    paymentStatus: 'Paid',
    approvalStatus: 'Approved',
    hasAttachment: true
  },
  {
    id: '2',
    voucherNo: 'VCH-2024-102',
    billDate: '2024-03-18',
    vendorName: 'Modern Stationery Hub',
    expenseHead: 'Office Supplies',
    billAmount: 4500,
    paidAmount: 2000,
    balance: 2500,
    paymentStatus: 'Partial',
    approvalStatus: 'Pending',
    hasAttachment: true
  },
  {
    id: '3',
    voucherNo: 'VCH-2024-103',
    billDate: '2024-03-20',
    vendorName: 'Apex Maintenance Services',
    expenseHead: 'Maintenance',
    billAmount: 8000,
    paidAmount: 0,
    balance: 8000,
    paymentStatus: 'Unpaid',
    approvalStatus: 'Approved',
    hasAttachment: false
  },
  {
    id: '4',
    voucherNo: 'VCH-2024-104',
    billDate: '2024-03-22',
    vendorName: 'Bounty Events & Catering',
    expenseHead: 'School Events',
    billAmount: 15000,
    paidAmount: 15000,
    balance: 0,
    paymentStatus: 'Paid',
    approvalStatus: 'Approved',
    hasAttachment: true
  }]
  );

  // Summary Calculation
  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.billAmount, 0);
  }, [expenses]);

  const columns = [
  {
    key: 'voucher',
    header: 'Voucher No',
    render: (row: any) =>
    <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.voucherNo}</span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Calendar className="w-3 h-3" /> {row.billDate}
          </div>
        </div>

  },
  {
    key: 'vendor',
    header: 'Vendor & Head',
    render: (row: any) =>
    <div>
          <div className="text-sm font-semibold text-gray-800">{row.vendorName}</div>
          <Badge variant="secondary" className="text-[9px] px-1 py-0 mt-1">{row.expenseHead}</Badge>
        </div>

  },
  {
    key: 'amount',
    header: 'Bill Amount',
    render: (row: any) => <span className="font-bold">₹{row.billAmount.toLocaleString()}</span>
  },
  {
    key: 'paid',
    header: 'Paid Amount',
    render: (row: any) => <span className="text-green-600 font-medium">₹{row.paidAmount.toLocaleString()}</span>
  },
  {
    key: 'balance',
    header: 'Balance',
    render: (row: any) =>
    <span className={`font-bold ${row.balance > 0 ? 'text-red-600 italic' : 'text-gray-400'}`}>
          ₹{row.balance.toLocaleString()}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <div className="flex flex-col gap-1">
          <Badge variant={row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Partial' ? 'warning' : 'danger'}>
            {row.paymentStatus}
          </Badge>
          <Badge variant={row.approvalStatus === 'Approved' ? 'info' : 'secondary'} className="opacity-80">
            {row.approvalStatus}
          </Badge>
        </div>

  },
  {
    key: 'attach',
    header: '',
    render: (row: any) => row.hasAttachment && <Paperclip className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="View Voucher"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" title="Print"><Printer className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" title="Payment History"><History className="w-4 h-4" /></Button>
        </div>

  }];


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Expense Master Registry <FileText className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500 uppercase font-bold tracking-widest opacity-60">Full Expenditure Ledger</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="primary" size="sm">
            + Record New Expense
          </Button>
        </div>
      </div>

      {/* Advanced Search & Filter Section */}
      <Card className="p-6 bg-gray-50/50 shadow-sm border-none ring-1 ring-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Vendor Name</label>
            <Select options={[{ label: 'Electricity Corp', value: '1' }, { label: 'Stationery Hub', value: '2' }]} placeholder="All Vendors" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Expense Head</label>
            <Select options={[{ label: 'Electricity', value: 'elec' }, { label: 'Maintenance', value: 'maint' }]} placeholder="All Heads" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Payment Status</label>
            <Select
              options={[
              { label: 'Fully Paid', value: 'paid' },
              { label: 'Unpaid', value: 'unpaid' },
              { label: 'Partially Paid', value: 'partial' }]
              }
              placeholder="All Payments" />

          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Approval Status</label>
            <Select options={[{ label: 'Approved', value: 'appr' }, { label: 'Pending', value: 'pend' }]} placeholder="All Status" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Bill Date From</label>
            <Input type="date" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Bill Date To</label>
            <Input type="date" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by Voucher No or Vendor..."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>
          <Button variant="primary" className="font-bold px-8">
            <Filter className="w-4 h-4 mr-2" /> Apply Filters
          </Button>
        </div>
      </Card>

      {/* Main Grid Section */}
      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-gray-200">
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <Building2 className="w-4 h-4 text-gray-400" /> Total Expense Records: {expenses.length}
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Full Paid
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="w-2 h-2 bg-orange-400 rounded-full" /> Partial
             </div>
          </div>
        </div>

        <Table columns={columns} data={expenses} />

        {/* Financial Summary Footer */}
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                   <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expense amount</p>
                  <p className="text-2xl font-black text-white italic tracking-tight">₹{totalExpenseAmount.toLocaleString()}</p>
                </div>
             </div>
             
             <div className="mt-4 md:mt-0 flex gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">Records Filtered</p>
                   <p className="text-lg font-bold">{expenses.length}</p>
                </div>
                <div className="w-[1px] bg-white/10" />
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">Total Outstanding</p>
                   <p className="text-lg font-bold text-red-400">
                      ₹{expenses.reduce((sum, item) => sum + item.balance, 0).toLocaleString()}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </Card>

      {/* Bottom Shortcuts */}
      <div className="flex justify-end gap-2 px-2">
         <button className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
            Reconcile with Bank Statement <ChevronRight className="w-3 h-3" />
         </button>
      </div>
    </div>);

}