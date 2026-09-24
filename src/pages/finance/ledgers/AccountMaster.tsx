import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Book,
  Plus,
  Search,
  Edit2,
  Eye,
  Power,
  Save,
  X,
  Landmark,
  Printer,
  Filter,
  Calendar,
  Lock,
  CheckCircle2,
  AlertTriangle,
  History,
  MoreVertical } from
'lucide-react';

// --- Types ---
type RootType = 'Asset' | 'Liability' | 'Income' | 'Expense';

interface Account {
  id: string;
  code: string;
  name: string;
  parentGroup: string;
  rootType: RootType;
  openingBalance: number;
  openingType: 'Dr' | 'Cr';
  isActive: boolean;
  // Bank Specific Fields
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNo: string;
    accountType: 'Savings' | 'Current' | 'Overdraft';
    branchName: string;
    ifsc: string;
    micrCode: string;
    chequePrinting: boolean;
  };
}

type YearStatus = 'Active' | 'Closed' | 'Locked';

interface AccountingYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: YearStatus;
  isCurrent: boolean;
}

// --- Constants ---
const PARENT_GROUPS = [
{ value: 'Bank Accounts', label: 'Bank Accounts', root: 'Asset' },
{ value: 'Cash-in-Hand', label: 'Cash-in-Hand', root: 'Asset' },
{ value: 'Sundry Debtors', label: 'Sundry Debtors (Receivables)', root: 'Asset' },
{ value: 'Sundry Creditors', label: 'Sundry Creditors (Payables)', root: 'Liability' },
{ value: 'Direct Income', label: 'Direct Income (Fees)', root: 'Income' },
{ value: 'Indirect Expense', label: 'Indirect Expense', root: 'Expense' },
{ value: 'Duties & Taxes', label: 'Duties & Taxes', root: 'Liability' },
{ value: 'Fixed Assets', label: 'Fixed Assets', root: 'Asset' }];


const INITIAL_ACCOUNTS: Account[] = [
{
  id: '1', code: '1001', name: 'HDFC Bank - Main', parentGroup: 'Bank Accounts', rootType: 'Asset',
  openingBalance: 500000, openingType: 'Dr', isActive: true,
  bankDetails: { accountName: 'K12 School ERP - Main Account', bankName: 'HDFC Bank', accountNo: '50200012345678', accountType: 'Current', branchName: 'Navrangpura, Ahmedabad', ifsc: 'HDFC0001234', micrCode: '380240001', chequePrinting: true }
},
{
  id: '2', code: '2001', name: 'Tuition Fee Income', parentGroup: 'Direct Income', rootType: 'Income',
  openingBalance: 0, openingType: 'Cr', isActive: true
},
{
  id: '3', code: '3001', name: 'ABC Stationery Suppliers', parentGroup: 'Sundry Creditors', rootType: 'Liability',
  openingBalance: 15000, openingType: 'Cr', isActive: true
},
{
  id: '4', code: '4001', name: 'Electricity Charges', parentGroup: 'Indirect Expense', rootType: 'Expense',
  openingBalance: 0, openingType: 'Dr', isActive: true
}];


const INITIAL_YEARS: AccountingYear[] = [
{
  id: 'FY-2425', name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31',
  status: 'Active', isCurrent: true
},
{
  id: 'FY-2324', name: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31',
  status: 'Closed', isCurrent: false
},
{
  id: 'FY-2223', name: '2022-2023', startDate: '2022-04-01', endDate: '2023-03-31',
  status: 'Locked', isCurrent: false
}];


export function AccountMaster() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'accounts' | 'years'>('accounts');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal/Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    code: '',
    parentGroup: '',
    openingBalance: 0,
    openingType: 'Dr',
    isActive: true,
    bankDetails: { accountName: '', bankName: '', accountNo: '', accountType: 'Current', branchName: '', ifsc: '', micrCode: '', chequePrinting: false }
  });

  // Accounting Year State
  const [years, setYears] = useState<AccountingYear[]>(INITIAL_YEARS);
  const [showYearModal, setShowYearModal] = useState(false);
  const [editingYear, setEditingYear] = useState<string | null>(null);
  const [yearForm, setYearForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    isLocked: false
  });

  // --- Logic ---

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.code.includes(searchQuery);
      const matchesType = filterType === 'all' || acc.rootType === filterType;
      return matchesSearch && matchesType;
    });
  }, [accounts, searchQuery, filterType]);

  // --- Handlers ---

  const handleAddNew = () => {
    setFormData({
      name: '',
      code: '',
      parentGroup: '', // Reset
      openingBalance: 0,
      openingType: 'Dr',
      isActive: true,
      bankDetails: { accountName: '', bankName: '', accountNo: '', accountType: 'Current', branchName: '', ifsc: '', micrCode: '', chequePrinting: false }
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (acc: Account) => {
    setFormData(acc);
    setEditingId(acc.id);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const handleSave = () => {
    if (!formData.name || !formData.parentGroup) {
      alert("Account Name and Parent Group are required.");
      return;
    }

    // Determine Root Type based on Group
    const groupInfo = PARENT_GROUPS.find((g) => g.value === formData.parentGroup);
    const rootType = (groupInfo?.root || 'Asset') as RootType;

    // Clean up bank details if not bank account
    let finalData = { ...formData, rootType };
    if (formData.parentGroup !== 'Bank Accounts') {
      delete finalData.bankDetails;
    }

    if (editingId) {
      setAccounts((prev) => prev.map((a) => a.id === editingId ? { ...finalData, id: editingId } as Account : a));
    } else {
      const newAccount = {
        ...finalData,
        id: Math.random().toString(36).substr(2, 9),
        code: formData.code || Math.floor(1000 + Math.random() * 9000).toString() // Auto-gen code if empty
      } as Account;
      setAccounts([...accounts, newAccount]);
    }
    setIsFormOpen(false);
  };

  const getYearStatusBadge = (status: YearStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'Locked':
        return <Badge variant="danger" className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </Badge>;
      default:
        return null;
    }
  };

  const openYearModal = (year?: AccountingYear) => {
    if (year) {
      setEditingYear(year.id);
      setYearForm({
        name: year.name,
        startDate: year.startDate,
        endDate: year.endDate,
        isCurrent: year.isCurrent,
        isLocked: year.status === 'Locked'
      });
    } else {
      setEditingYear(null);
      setYearForm({
        name: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        isLocked: false
      });
    }
    setShowYearModal(true);
  };

  const handleYearSave = () => {
    if (!yearForm.name.trim() || !yearForm.startDate || !yearForm.endDate) {
      alert('Financial Year Name, Start Date and End Date are required.');
      return;
    }
    const isCurrent = yearForm.isLocked ? false : yearForm.isCurrent;
    const status: YearStatus = yearForm.isLocked ?
    'Locked' :
    isCurrent ?
    'Active' :
    'Closed';
    setYears((prev) => {
      let next = isCurrent ? prev.map((y) => ({ ...y, isCurrent: false })) : prev;
      if (editingYear) {
        next = next.map((y) =>
        y.id === editingYear ?
        { ...y, name: yearForm.name.trim(), startDate: yearForm.startDate, endDate: yearForm.endDate, isCurrent, status } :
        y
        );
      } else {
        next = [...next, {
          id: `FY-${Date.now()}`,
          name: yearForm.name.trim(),
          startDate: yearForm.startDate,
          endDate: yearForm.endDate,
          isCurrent,
          status
        }];
      }
      // only one year may be Active/Current
      return next.map((y) => ({
        ...y,
        status: y.isCurrent ? 'Active' : y.status === 'Active' ? 'Closed' : y.status
      }));
    });
    setShowYearModal(false);
  };

  // --- Columns ---
  const columns = [
  {
    key: 'info',
    header: 'Account Details',
    render: (row: Account) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">Code: {row.code}</div>
        </div>

  },
  {
    key: 'group',
    header: 'Parent Group',
    render: (row: Account) =>
    <div>
          <span className="text-sm text-gray-700">{row.parentGroup}</span>
          <div className="flex gap-1 mt-1">
             <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200">
               {row.rootType}
             </Badge>
          </div>
        </div>

  },
  {
    key: 'balance',
    header: 'Opening Balance',
    render: (row: Account) =>
    <span className="font-mono text-sm">
           {row.openingBalance.toLocaleString()} <span className="text-xs text-gray-400">{row.openingType}</span>
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Account) =>
    <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Account) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} title="Edit">
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" title="View Ledger">
            <Eye className="w-4 h-4 text-gray-500" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title={row.isActive ? "Deactivate" : "Activate"}
        onClick={() => handleToggleStatus(row.id)}
        className={row.isActive ? "text-red-600" : "text-green-600"}>

            <Power className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Book className="w-6 h-6 text-blue-600" />
            Account Master
          </h1>
          <p className="text-sm text-gray-500">
            {activeTab === 'accounts' ?
            'Manage accounting ledgers, groups, and opening balances.' :
            'Define fiscal periods and manage transaction locking for audits.'}
          </p>
        </div>
        {activeTab === 'accounts' ?
        <Button variant="primary" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button> :

        <Button variant="primary" onClick={() => openYearModal()}>
            <Plus className="w-4 h-4 mr-2" />
            New Financial Year
          </Button>
        }
      </div>

      {/* Tabs */}
      <Card className="p-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'accounts' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('accounts')}>

            <Book className="w-4 h-4 mr-2" />
            Chart of Accounts
          </Button>
          <Button
            variant={activeTab === 'years' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('years')}>

            <Calendar className="w-4 h-4 mr-2" />
            Accounting Year Master
          </Button>
        </div>
      </Card>

      {activeTab === 'accounts' &&
      <>
      {/* Filter Bar */}
      <Card className="p-4 bg-gray-50 border-gray-200">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
            placeholder="Search by Account Name or Code..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />

            <Select
            placeholder="Filter by Type"
            options={[
            { value: 'all', label: 'All Types' },
            { value: 'Asset', label: 'Assets' },
            { value: 'Liability', label: 'Liabilities' },
            { value: 'Income', label: 'Income' },
            { value: 'Expense', label: 'Expenses' }]
            }
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            leftIcon={<Filter className="w-4 h-4 text-gray-400" />} />

         </div>
      </Card>

      {/* Grid */}
      <Card className="p-0 border-gray-200">
         <Table columns={columns} data={filteredAccounts} />
      </Card>
      </>
      }

      {activeTab === 'years' &&
      <>
      {/* Date Validation Note */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Date Validation Note</p>
          <p className="text-xs text-amber-700 mt-1">
            New financial years cannot overlap with existing periods. Ensure
            "Locked" years are audited before closing.
          </p>
        </div>
      </div>

      {/* Accounting Years Grid */}
      <Card className="p-0 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Year Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Start Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">End Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Current?</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {years.map((year) =>
              <tr key={year.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                      className={`p-2 rounded-lg ${year.status === 'Locked' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>

                        <History className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900">FY {year.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{year.startDate}</td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{year.endDate}</td>
                  <td className="p-4">{getYearStatusBadge(year.status)}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {year.isCurrent ?
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div> :

                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        </div>
                    }
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => openYearModal(year)}
                      disabled={year.status === 'Locked'}>

                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      </>
      }

      {/* --- Drawer / Modal for Add/Edit --- */}
      {isFormOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">
                   {editingId ? "Edit Account" : "New Account"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                   <X className="w-5 h-5" />
                </Button>
             </div>

             {/* Modal Body */}
             <div className="p-6 space-y-6">
                
                {/* Basic Details */}
                <div className="space-y-4">
                   <Input
                label="Account Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                   
                   <div className="grid grid-cols-2 gap-4">
                      <Input
                  label="Account Code"
                  placeholder="Auto"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })} />

                      <Select
                  label="Parent Group"
                  required
                  options={PARENT_GROUPS}
                  value={formData.parentGroup}
                  onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })} />

                   </div>

                   <div className="grid grid-cols-3 gap-2 items-end">
                      <div className="col-span-2">
                        <Input
                    type="number"
                    label="Opening Balance"
                    value={formData.openingBalance}
                    onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })} />

                      </div>
                      <div className="col-span-1">
                        <div className="flex bg-gray-100 p-1 rounded-md">
                           <button
                      className={`flex-1 py-1 text-xs font-medium rounded ${formData.openingType === 'Dr' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                      onClick={() => setFormData({ ...formData, openingType: 'Dr' })}>

                             Dr
                           </button>
                           <button
                      className={`flex-1 py-1 text-xs font-medium rounded ${formData.openingType === 'Cr' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                      onClick={() => setFormData({ ...formData, openingType: 'Cr' })}>

                             Cr
                           </button>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Conditional Bank Details */}
                {formData.parentGroup === 'Bank Accounts' &&
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-2 text-blue-800 border-b border-blue-200 pb-2 mb-2">
                           <Landmark className="w-4 h-4" />
                           <h3 className="font-semibold text-sm">Bank Details</h3>
                        </div>
                        
                        <Input
                label="Account Holder Name"
                placeholder="e.g. K12 School ERP - Main Account"
                value={formData.bankDetails?.accountName}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, accountName: e.target.value } })} />

                        <div className="grid grid-cols-2 gap-4">
                           <Input
                  label="Account Number"
                  placeholder="e.g. 50200012345678"
                  value={formData.bankDetails?.accountNo}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, accountNo: e.target.value } })} />

                           <Select
                  label="Account Type"
                  options={[
                  { value: 'Savings', label: 'Savings' },
                  { value: 'Current', label: 'Current' },
                  { value: 'Overdraft', label: 'Overdraft (OD)' }]
                  }
                  value={formData.bankDetails?.accountType}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, accountType: e.target.value as 'Savings' | 'Current' | 'Overdraft' } })} />

                        </div>

                        <Input
                label="Bank Name"
                placeholder="e.g. HDFC Bank"
                value={formData.bankDetails?.bankName}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, bankName: e.target.value } })} />

                        <Input
                label="Branch Name"
                placeholder="e.g. Navrangpura, Ahmedabad"
                value={formData.bankDetails?.branchName}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, branchName: e.target.value } })} />

                        <div className="grid grid-cols-2 gap-4">
                           <Input
                  label="IFSC Code"
                  placeholder="e.g. HDFC0001234"
                  value={formData.bankDetails?.ifsc}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, ifsc: e.target.value } })} />

                           <Input
                  label="MICR Code"
                  placeholder="e.g. 380240001"
                  value={formData.bankDetails?.micrCode}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, micrCode: e.target.value } })} />

                        </div>

                        <div className="flex items-center gap-2 pt-2">
                           <input
                  type="checkbox"
                  checked={formData.bankDetails?.chequePrinting}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, chequePrinting: e.target.checked } })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                           <span className="text-sm text-gray-700 flex items-center gap-1">
                              Enable Cheque Printing <Printer className="w-3 h-3 text-gray-400" />
                           </span>
                        </div>
                    </div>
            }

             </div>

             {/* Modal Footer */}
             <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Account
                </Button>
             </div>
          </div>
        </div>
      }

      {/* --- Financial Year Modal --- */}
      {showYearModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl border-none">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                {editingYear ? 'Update Financial Year' : 'Create Financial Year'}
              </h2>
              <button
              onClick={() => setShowYearModal(false)}
              className="p-1 hover:bg-gray-100 rounded-full">

                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
              label="Financial Year Name"
              placeholder="e.g. 2025-2026"
              value={yearForm.name}
              onChange={(e) =>
              setYearForm({ ...yearForm, name: e.target.value })
              } />

              <div className="grid grid-cols-2 gap-4">
                <Input
                type="date"
                label="Start Date"
                value={yearForm.startDate}
                onChange={(e) =>
                setYearForm({ ...yearForm, startDate: e.target.value })
                } />

                <Input
                type="date"
                label="End Date"
                value={yearForm.endDate}
                onChange={(e) =>
                setYearForm({ ...yearForm, endDate: e.target.value })
                } />
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl cursor-pointer">
                  <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  checked={yearForm.isCurrent}
                  disabled={yearForm.isLocked}
                  onChange={(e) =>
                  setYearForm({ ...yearForm, isCurrent: e.target.checked })
                  } />

                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Set as Current Active Year
                    </p>
                    <p className="text-[10px] text-emerald-600">
                      Only one financial year can be "Current" at a time.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl cursor-pointer">
                  <input
                  type="checkbox"
                  className="w-4 h-4 accent-red-600"
                  checked={yearForm.isLocked}
                  onChange={(e) =>
                  setYearForm({ ...yearForm, isLocked: e.target.checked })
                  } />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-red-900">
                        Lock Financial Year
                      </p>
                      <Lock className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-[10px] text-red-600">
                      Locked years prevent all new entries and edits for
                      auditing.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3 border-t">
              <Button variant="outline" onClick={() => setShowYearModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleYearSave}>
                {editingYear ? 'Save Changes' : 'Create Year'}
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}