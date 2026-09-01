import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Trash2,
  Save,
  Send,
  Paperclip,
  FileText,
  UserPlus,
  Calendar,
  Calculator,
  Building2,
  Hash,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Upload,
  File,
  Image,
  Eye,
  Copy,
  ChevronDown,
  ChevronUp,
  Percent,
  IndianRupee,
  FileCheck,
  ArrowRight,
  HelpCircle,
  Banknote,
  Receipt,
  Tag,
  MessageSquare,
  History,
  Link,
  ExternalLink,
  Zap,
  AlertTriangle,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  RefreshCw,
  Printer } from
'lucide-react';

// --- Types ---
interface ExpenseItem {
  id: string;
  head: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percent' | 'fixed';
  taxRate: number;
  hsnCode: string;
}

interface Attachment {
  id: string;
  file: File;
  type: 'invoice' | 'receipt' | 'other';
  preview?: string;
}

// --- Mock Data ---
const VENDORS = [
{ value: 'v_001', label: 'ABC Stationers', gstin: '27AABCU9603R1ZM', address: 'Mumbai, Maharashtra' },
{ value: 'v_002', label: 'City Power Corp', gstin: '27AADCC9604R1ZN', address: 'Pune, Maharashtra' },
{ value: 'v_003', label: 'Global Tech Solutions', gstin: '29AABCG9605R1ZO', address: 'Bangalore, Karnataka' },
{ value: 'v_004', label: 'Fresh Foods Catering', gstin: '27AABCF9606R1ZP', address: 'Mumbai, Maharashtra' },
{ value: 'v_005', label: 'Office Mart India', gstin: '27AABCO9607R1ZQ', address: 'Thane, Maharashtra' }];


const EXPENSE_HEADS = [
{ value: 'h_001', label: 'Lab Chemicals', code: 'EXP-LAB-001' },
{ value: 'h_002', label: 'Office Stationery', code: 'EXP-OFF-002' },
{ value: 'h_003', label: 'Electricity Charges', code: 'EXP-UTL-003' },
{ value: 'h_004', label: 'Event Refreshments', code: 'EXP-EVT-004' },
{ value: 'h_005', label: 'IT Maintenance', code: 'EXP-IT-005' },
{ value: 'h_006', label: 'Printing & Publishing', code: 'EXP-PRT-006' },
{ value: 'h_007', label: 'Transport & Logistics', code: 'EXP-TRN-007' },
{ value: 'h_008', label: 'Building Maintenance', code: 'EXP-BLD-008' }];


const TAX_RATES = [
{ value: '0', label: '0% (Exempt)' },
{ value: '5', label: 'GST 5%' },
{ value: '12', label: 'GST 12%' },
{ value: '18', label: 'GST 18%' },
{ value: '28', label: 'GST 28%' }];


const DEPARTMENTS = [
{ value: 'admin', label: 'Administration' },
{ value: 'academics', label: 'Academics' },
{ value: 'sports', label: 'Sports & Activities' },
{ value: 'transport', label: 'Transport' },
{ value: 'hostel', label: 'Hostel' },
{ value: 'library', label: 'Library' }];


const COST_CENTERS = [
{ value: 'cc_main', label: 'Main Campus' },
{ value: 'cc_branch1', label: 'Branch Campus - North' },
{ value: 'cc_branch2', label: 'Branch Campus - South' }];


const PAYMENT_TERMS = [
{ value: 'immediate', label: 'Immediate' },
{ value: 'net_7', label: 'Net 7 Days' },
{ value: 'net_15', label: 'Net 15 Days' },
{ value: 'net_30', label: 'Net 30 Days' },
{ value: 'net_45', label: 'Net 45 Days' },
{ value: 'net_60', label: 'Net 60 Days' }];


const RECENT_VENDOR_BILLS = [
{ id: 'VCH-2024-089', date: '2024-08-15', amount: 45000, status: 'Paid' },
{ id: 'VCH-2024-076', date: '2024-07-22', amount: 32500, status: 'Paid' },
{ id: 'VCH-2024-058', date: '2024-06-10', amount: 28000, status: 'Paid' }];


export function ExpenseVoucherEntry() {
  // --- State ---
  // Header
  const [vendorId, setVendorId] = useState('');
  const [isNewVendor, setIsNewVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorGstin, setNewVendorGstin] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('net_30');
  const [referenceNo, setReferenceNo] = useState('');
  const [narration, setNarration] = useState('');

  // Grid
  const [items, setItems] = useState<ExpenseItem[]>([
  { id: '1', head: '', description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'percent', taxRate: 18, hsnCode: '' }]
  );

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // UI State
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'attachments' | 'notes'>('items');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get selected vendor details
  const selectedVendor = useMemo(() => {
    return VENDORS.find((v) => v.value === vendorId);
  }, [vendorId]);

  // --- Logic & Calculations ---

  const handleAddItem = () => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      head: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percent',
      taxRate: 18,
      hsnCode: ''
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    } else {
      setItems([
      {
        id: '1',
        head: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percent',
        taxRate: 18,
        hsnCode: ''
      }]
      );
    }
  };

  const handleDuplicateItem = (item: ExpenseItem) => {
    const newItem: ExpenseItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    const index = items.findIndex((i) => i.id === item.id);
    const newItems = [...items];
    newItems.splice(index + 1, 0, newItem);
    setItems(newItems);
  };

  const updateItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: Attachment['type']) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Calculate row totals
  const calculateRowTotals = (item: ExpenseItem) => {
    const baseAmount = item.quantity * item.unitPrice;
    const discountAmount =
    item.discountType === 'percent' ? baseAmount * (item.discount / 100) : item.discount;
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = taxableAmount * (item.taxRate / 100);
    const totalAmount = taxableAmount + taxAmount;

    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      totalAmount
    };
  };

  // Calculate Totals
  const totals = useMemo(() => {
    let baseTotal = 0;
    let discountTotal = 0;
    let taxableTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    items.forEach((item) => {
      const rowTotals = calculateRowTotals(item);
      baseTotal += rowTotals.baseAmount;
      discountTotal += rowTotals.discountAmount;
      taxableTotal += rowTotals.taxableAmount;
      taxTotal += rowTotals.taxAmount;
      grandTotal += rowTotals.totalAmount;
    });

    return {
      baseTotal,
      discountTotal,
      taxableTotal,
      taxTotal,
      grandTotal,
      itemCount: items.filter((i) => i.head).length
    };
  }, [items]);

  // Auto-calculate due date based on payment terms
  const handlePaymentTermsChange = (terms: string) => {
    setPaymentTerms(terms);
    if (billDate) {
      const baseDate = new Date(billDate);
      let daysToAdd = 0;

      switch (terms) {
        case 'immediate':
          daysToAdd = 0;
          break;
        case 'net_7':
          daysToAdd = 7;
          break;
        case 'net_15':
          daysToAdd = 15;
          break;
        case 'net_30':
          daysToAdd = 30;
          break;
        case 'net_45':
          daysToAdd = 45;
          break;
        case 'net_60':
          daysToAdd = 60;
          break;
      }

      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setDueDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vendorId && !newVendorName) {
      newErrors.vendor = 'Please select a vendor or enter a new payee name';
    }
    if (!billNo) {
      newErrors.billNo = 'Bill/Invoice number is required';
    }
    if (!billDate) {
      newErrors.billDate = 'Bill date is required';
    }
    if (!department) {
      newErrors.department = 'Please select a department';
    }
    if (items.every((i) => !i.head)) {
      newErrors.items = 'At least one expense item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !validateForm()) {
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const actionText = action === 'draft' ? 'Saved as Draft' : 'Submitted for Approval';
    alert(`${actionText} successfully!\nVoucher Total: ₹${totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);

    setIsSaving(false);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all entered data?')) {
      setVendorId('');
      setIsNewVendor(false);
      setNewVendorName('');
      setNewVendorGstin('');
      setBillNo('');
      setBillDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setDepartment('');
      setCostCenter('');
      setPaymentTerms('net_30');
      setReferenceNo('');
      setNarration('');
      setItems([
      {
        id: '1',
        head: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percent',
        taxRate: 18,
        hsnCode: ''
      }]
      );
      setAttachments([]);
      setErrors({});
    }
  };

  // Generate voucher number preview
  const voucherPreview = useMemo(() => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `VCH-${year}${month}-XXXX`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Voucher Entry</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Record vendor invoices and initiate the payment approval workflow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-xs text-gray-500">Voucher Number (Auto)</p>
                <p className="font-mono text-sm font-medium text-gray-700">{voucherPreview}</p>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden lg:block" />
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor & Bill Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-900">Vendor & Bill Information</h2>
                  </div>
                  <Badge variant="info" className="text-xs">
                    Step 1 of 3
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Vendor Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Vendor / Payee <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => {
                          setIsNewVendor(!isNewVendor);
                          setVendorId('');
                          setNewVendorName('');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">

                        <UserPlus className="w-3 h-3" />
                        {isNewVendor ? 'Select Existing Vendor' : 'Add One-time Payee'}
                      </button>
                    </div>

                    {isNewVendor ?
                    <div className="space-y-3">
                        <Input
                        placeholder="Enter Payee/Vendor Name"
                        value={newVendorName}
                        onChange={(e) => setNewVendorName(e.target.value)}
                        className="bg-yellow-50 border-yellow-300 focus:border-yellow-500" />

                        <Input
                        placeholder="GSTIN (Optional)"
                        value={newVendorGstin}
                        onChange={(e) => setNewVendorGstin(e.target.value)}
                        className="bg-yellow-50 border-yellow-300 focus:border-yellow-500" />

                      </div> :

                    <Select
                      options={VENDORS.map((v) => ({ value: v.value, label: v.label }))}
                      placeholder="Search or select vendor..."
                      value={vendorId}
                      onChange={(e) => {
                        setVendorId(e.target.value);
                        setShowVendorDetails(true);
                      }}
                      className={errors.vendor ? 'border-red-300' : ''} />

                    }
                    {errors.vendor && <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.vendor}
                    </p>}

                    {/* Vendor Details Card */}
                    {selectedVendor && showVendorDetails &&
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{selectedVendor.label}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span>GSTIN: {selectedVendor.gstin}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{selectedVendor.address}</span>
                            </div>
                          </div>
                          <button
                          onClick={() => setShowVendorDetails(false)}
                          className="p-1 hover:bg-gray-200 rounded">

                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    }
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Bill / Invoice Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., INV-2024-001"
                        value={billNo}
                        onChange={(e) => setBillNo(e.target.value)}
                        className={errors.billNo ? 'border-red-300' : ''} />

                      {errors.billNo && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.billNo}
                      </p>}
                    </div>
                  </div>
                </div>

                {/* Date and Terms Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Bill Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                      className={errors.billDate ? 'border-red-300' : ''} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Payment Terms
                    </label>
                    <Select
                      options={PAYMENT_TERMS}
                      value={paymentTerms}
                      onChange={(e) => handlePaymentTermsChange(e.target.value)} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)} />

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Reference No.
                    </label>
                    <Input
                      placeholder="PO/Quotation No."
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)} />

                  </div>
                </div>

                {/* Department and Cost Center */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={DEPARTMENTS}
                      placeholder="Select department..."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={errors.department ? 'border-red-300' : ''} />

                    {errors.department && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Cost Center
                    </label>
                    <Select
                      options={COST_CENTERS}
                      placeholder="Select cost center..."
                      value={costCenter}
                      onChange={(e) => setCostCenter(e.target.value)} />

                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">

                  {showAdvancedOptions ?
                  <ChevronUp className="w-4 h-4" /> :

                  <ChevronDown className="w-4 h-4" />
                  }
                  <span>{showAdvancedOptions ? 'Hide' : 'Show'} Additional Options</span>
                </button>

                {showAdvancedOptions &&
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Narration / Purpose
                      </label>
                      <textarea
                      placeholder="Enter purpose or description of this expense..."
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3} />

                    </div>
                  </div>
                }
              </div>
            </div>

            {/* Expense Items Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <h2 className="font-semibold text-gray-900">Expense Line Items</h2>
                      <p className="text-xs text-gray-500">Add expense heads and amounts</p>
                    </div>
                  </div>
                  <Badge variant="info" className="text-xs">
                    Step 2 of 3
                  </Badge>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="px-6 pt-4 border-b border-gray-100">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('items')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'items' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Items ({items.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('attachments')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'attachments' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attachments ({attachments.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'notes' ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-500 hover:text-gray-700'}`
                    }>

                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Notes
                    </span>
                  </button>
                </div>
              </div>

              {/* Items Tab */}
              {activeTab === 'items' &&
              <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Expense Head <span className="text-red-500">*</span>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Discount
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Tax
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                            Amount
                          </th>
                          <th className="px-4 py-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {items.map((item, index) => {
                        const rowTotals = calculateRowTotals(item);

                        return (
                          <tr key={item.id} className="group hover:bg-blue-50/50 transition-colors">
                              <td className="px-4 py-3 text-gray-400 text-center">{index + 1}</td>
                              <td className="px-4 py-3">
                                <select
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={item.head}
                                onChange={(e) => updateItem(item.id, 'head', e.target.value)}>

                                  <option value="">Select...</option>
                                  {EXPENSE_HEADS.map((h) =>
                                <option key={h.value} value={h.value}>
                                      {h.label}
                                    </option>
                                )}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                type="text"
                                placeholder="Item description..."
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)} />

                              </td>
                              <td className="px-4 py-3">
                                <input
                                type="number"
                                min="1"
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} />

                              </td>
                              <td className="px-4 py-3">
                                <div className="relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                  <input
                                  type="number"
                                  placeholder="0.00"
                                  className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-md text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.unitPrice || ''}
                                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />

                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input
                                  type="number"
                                  placeholder="0"
                                  className="w-14 px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.discount || ''}
                                  onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)} />

                                  <select
                                  className="w-12 px-1 py-1.5 border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={item.discountType}
                                  onChange={(e) => updateItem(item.id, 'discountType', e.target.value)}>

                                    <option value="percent">%</option>
                                    <option value="fixed">₹</option>
                                  </select>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.taxRate}
                                onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}>

                                  {TAX_RATES.map((r) =>
                                <option key={r.value} value={r.value}>
                                      {r.label}
                                    </option>
                                )}
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-semibold text-gray-900">
                                  ₹{rowTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                  onClick={() => handleDuplicateItem(item)}
                                  className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                                  title="Duplicate row">

                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1.5 hover:bg-red-100 rounded text-red-600"
                                  title="Remove row">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>);

                      })}
                      </tbody>
                    </table>
                  </div>

                  {errors.items &&
                <div className="px-6 py-2 bg-red-50 border-t border-red-100">
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.items}
                      </p>
                    </div>
                }

                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <Button variant="ghost" onClick={handleAddItem} className="text-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Item
                    </Button>
                  </div>
                </div>
              }

              {/* Attachments Tab */}
              {activeTab === 'attachments' &&
              <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Invoice Upload */}
                    <div className="relative">
                      <input
                      type="file"
                      id="invoice-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'invoice')} />

                      <label
                      htmlFor="invoice-upload"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">

                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="text-sm font-medium text-blue-700">Invoice/Bill</span>
                        <span className="text-xs text-blue-500 mt-1">PDF, JPG, PNG</span>
                      </label>
                    </div>

                    {/* Receipt Upload */}
                    <div className="relative">
                      <input
                      type="file"
                      id="receipt-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'receipt')} />

                      <label
                      htmlFor="receipt-upload"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-200 rounded-xl bg-green-50 cursor-pointer hover:bg-green-100 transition-colors">

                        <Receipt className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm font-medium text-green-700">Receipt</span>
                        <span className="text-xs text-green-500 mt-1">PDF, JPG, PNG</span>
                      </label>
                    </div>

                    {/* Other Documents */}
                    <div className="relative">
                      <input
                      type="file"
                      id="other-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'other')} />

                      <label
                      htmlFor="other-upload"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">

                        <Paperclip className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Other Documents</span>
                        <span className="text-xs text-gray-500 mt-1">Any format</span>
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {attachments.length > 0 &&
                <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
                      <div className="space-y-2">
                        {attachments.map((attachment) =>
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">

                            <div className="flex items-center gap-3">
                              {attachment.preview ?
                        <img
                          src={attachment.preview}
                          alt="Preview"
                          className="w-10 h-10 object-cover rounded" /> :


                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                  <File className="w-5 h-5 text-gray-500" />
                                </div>
                        }
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(attachment.file.size / 1024).toFixed(1)} KB •{' '}
                                  <span className="capitalize">{attachment.type}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="p-1.5 hover:bg-red-100 rounded text-red-500">

                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                    )}
                      </div>
                    </div>
                }

                  {attachments.length === 0 &&
                <div className="text-center py-8 text-gray-500">
                      <Paperclip className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No attachments uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Upload invoice, receipt, or supporting documents</p>
                    </div>
                }
                </div>
              }

              {/* Notes Tab */}
              {activeTab === 'notes' &&
              <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Internal Notes</label>
                      <textarea
                      placeholder="Add internal notes for this voucher (visible only to finance team)..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4} />

                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Approval Comments (Optional)
                      </label>
                      <textarea
                      placeholder="Add any comments for the approver..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3} />

                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Bill Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <h2 className="font-semibold text-gray-900">Bill Summary</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Item Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <Badge variant="outline">{totals.itemCount} items</Badge>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">
                      ₹{totals.baseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {totals.discountTotal > 0 &&
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">
                        -₹{totals.discountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  }

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxable Amount</span>
                    <span className="text-gray-900">
                      ₹{totals.taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (GST)</span>
                    <span className="text-gray-900">
                      ₹{totals.taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                    variant="primary"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSave('submit')}
                    disabled={isSaving}>

                    {isSaving ?
                    <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </> :

                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Approval
                      </>
                    }
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}>

                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>

                {/* Workflow Preview */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Approval Workflow
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Create Voucher</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500">HOD Approval</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500">Finance Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500">Payment Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor History (shows when vendor is selected) */}
            {selectedVendor &&
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-gray-500" />
                      <h3 className="font-medium text-gray-900">Recent Bills</h3>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {RECENT_VENDOR_BILLS.map((bill) =>
                <div key={bill.id} className="px-6 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{bill.id}</p>
                          <p className="text-xs text-gray-500">{bill.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{bill.amount.toLocaleString()}
                          </p>
                          <Badge variant="success" className="text-xs">
                            {bill.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {/* Help Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <ul className="space-y-1.5 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>All fields marked with * are mandatory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>Attach scanned invoice for quick approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>Draft vouchers can be edited later</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}