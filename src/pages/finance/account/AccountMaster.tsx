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
  Filter } from
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
    accountNo: string;
    ifsc: string;
    bankName: string;
    chequePrinting: boolean;
  };
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
  bankDetails: { accountNo: '50100099', ifsc: 'HDFC0001', bankName: 'HDFC', chequePrinting: true }
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


export function AccountMaster() {
  // --- State ---
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
    bankDetails: { accountNo: '', ifsc: '', bankName: '', chequePrinting: false }
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
      bankDetails: { accountNo: '', ifsc: '', bankName: '', chequePrinting: false }
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
            Chart of Accounts
          </h1>
          <p className="text-sm text-gray-500">
            Manage accounting ledgers, groups, and opening balances.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
        </Button>
      </div>

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

      {/* --- Drawer / Modal for Add/Edit --- */}
      {isFormOpen &&
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right-10">
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
                label="Bank Name"
                value={formData.bankDetails?.bankName}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, bankName: e.target.value } })} />

                        <div className="grid grid-cols-2 gap-4">
                           <Input
                  label="Account No"
                  value={formData.bankDetails?.accountNo}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, accountNo: e.target.value } })} />

                           <Input
                  label="IFSC Code"
                  value={formData.bankDetails?.ifsc}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails!, ifsc: e.target.value } })} />

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

    </div>);

}