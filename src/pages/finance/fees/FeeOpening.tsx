import React, { useMemo, useState, Fragment, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  X,
  FileSpreadsheet,
  FileText,
  Eye,
  Edit,
  Trash2,
  History,
  Info,
  GraduationCap,
  Hash,
  IndianRupee,
  Users,
  FileUp } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// ============================================
// Types
// ============================================
type BalanceType = 'debit' | 'credit';
type EntryStatus = 'draft' | 'confirmed' | 'locked';
type EntryType = 'manual' | 'imported' | 'carried_forward';
interface FeeHeadBalance {
  id: string;
  feeHeadId: string;
  feeHeadName: string;
  balanceType: BalanceType;
  amount: number;
  remarks?: string;
}
interface OpeningBalanceRecord {
  id: string;
  admissionNo: string;
  studentName: string;
  fatherName?: string;
  class: string;
  section: string;
  rollNo?: string;
  contactNo?: string;
  academicYear: string;
  previousAcademicYear: string;
  feeHeadBalances: FeeHeadBalance[];
  totalDebit: number;
  totalCredit: number;
  netBalance: number; // debit - credit
  effectiveDate: string;
  remarks?: string;
  entryType: EntryType;
  status: EntryStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  lockedAt?: string | null;
  lockedBy?: string | null;
}
interface Filters {
  academicYear: string;
  previousAcademicYear: string;
  class: string;
  section: string;
  status: '' | EntryStatus;
  entryType: '' | EntryType;
  q: string;
  showZeroBalance: boolean;
  itemsPerPage: number;
}
interface EntryFormState {
  admissionNo: string;
  studentName: string;
  fatherName: string;
  class: string;
  section: string;
  rollNo: string;
  contactNo: string;
  academicYear: string;
  previousAcademicYear: string;
  effectiveDate: string;
  remarks: string;
  feeHeadBalances: FeeHeadBalance[];
}
interface ImportRow {
  admissionNo: string;
  studentName: string;
  class: string;
  section: string;
  // For simplicity (migration): one line with net type+amount and optional fee head mapping
  // In real import we accept multiple fee heads columns.
  feeHeadId: string;
  feeHeadName: string;
  balanceType: BalanceType;
  amount: number;
  remarks?: string;
}
interface ImportModalState {
  open: boolean;
  step: 1 | 2 | 3;
  mode: 'classBulk' | 'excel';
  selectedClass: string;
  selectedSection: string;
  file: File | null;
  preview: ImportRow[];
  errors: string[];
}
// ============================================
// Constants
// ============================================
const ACADEMIC_YEARS = [
{
  value: '2025-2026',
  label: '2025-2026 (Current)'
},
{
  value: '2024-2025',
  label: '2024-2025'
},
{
  value: '2023-2024',
  label: '2023-2024'
}];

const PREV_YEARS = [
{
  value: '2024-2025',
  label: '2024-2025'
},
{
  value: '2023-2024',
  label: '2023-2024'
},
{
  value: '2022-2023',
  label: '2022-2023'
}];

const CLASSES = [
{
  value: '',
  label: 'All Classes'
},
{
  value: '1',
  label: 'Class 1'
},
{
  value: '2',
  label: 'Class 2'
},
{
  value: '3',
  label: 'Class 3'
},
{
  value: '4',
  label: 'Class 4'
},
{
  value: '5',
  label: 'Class 5'
},
{
  value: '6',
  label: 'Class 6'
},
{
  value: '7',
  label: 'Class 7'
},
{
  value: '8',
  label: 'Class 8'
},
{
  value: '9',
  label: 'Class 9'
},
{
  value: '10',
  label: 'Class 10'
},
{
  value: '11',
  label: 'Class 11'
},
{
  value: '12',
  label: 'Class 12'
}];

const SECTIONS = [
{
  value: '',
  label: 'All Sections'
},
{
  value: 'A',
  label: 'A'
},
{
  value: 'B',
  label: 'B'
},
{
  value: 'C',
  label: 'C'
},
{
  value: 'D',
  label: 'D'
}];

const STATUS_OPTIONS = [
{
  value: '',
  label: 'All Status'
},
{
  value: 'draft',
  label: 'Draft'
},
{
  value: 'confirmed',
  label: 'Confirmed'
},
{
  value: 'locked',
  label: 'Locked'
}] as
const;
const ENTRY_TYPES = [
{
  value: '',
  label: 'All Entry Types'
},
{
  value: 'manual',
  label: 'Manual'
},
{
  value: 'imported',
  label: 'Imported'
},
{
  value: 'carried_forward',
  label: 'Carried Forward'
}] as
const;
const ITEMS_PER_PAGE = [
{
  value: 10,
  label: '10'
},
{
  value: 25,
  label: '25'
},
{
  value: 50,
  label: '50'
},
{
  value: 100,
  label: '100'
}];

const FEE_HEADS = [
{
  value: 'tuition',
  label: 'Tuition Fee'
},
{
  value: 'transport',
  label: 'Transport Fee'
},
{
  value: 'annual',
  label: 'Annual Charges'
},
{
  value: 'hostel',
  label: 'Hostel Fee'
},
{
  value: 'library',
  label: 'Library Fee'
},
{
  value: 'fine',
  label: 'Previous Fines'
},
{
  value: 'other',
  label: 'Other Charges'
}];

// ============================================
// Mock Data (migration-like)
// ============================================
const INITIAL_DATA: OpeningBalanceRecord[] = [
{
  id: 'OB-0001',
  admissionNo: 'ADM-2020-1045',
  studentName: 'Rahul Sharma',
  fatherName: 'Mr. Rajesh Sharma',
  class: '10',
  section: 'A',
  rollNo: '15',
  contactNo: '+91 98765 43210',
  academicYear: '2025-2026',
  previousAcademicYear: '2024-2025',
  feeHeadBalances: [
  {
    id: 'FH-1',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    balanceType: 'debit',
    amount: 15000,
    remarks: 'Q4 pending'
  },
  {
    id: 'FH-2',
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    balanceType: 'debit',
    amount: 3000,
    remarks: 'March pending'
  },
  {
    id: 'FH-3',
    feeHeadId: 'fine',
    feeHeadName: 'Previous Fines',
    balanceType: 'debit',
    amount: 500,
    remarks: 'Late fee fine'
  }],

  totalDebit: 18500,
  totalCredit: 0,
  netBalance: 18500,
  effectiveDate: '2025-04-01',
  remarks: 'Carried forward dues.',
  entryType: 'carried_forward',
  status: 'confirmed',
  createdAt: '2025-03-25 10:30',
  createdBy: 'Accountant',
  updatedAt: '2025-03-25 10:30',
  updatedBy: 'Accountant',
  lockedAt: null,
  lockedBy: null
},
{
  id: 'OB-0002',
  admissionNo: 'ADM-2021-0892',
  studentName: 'Priya Patel',
  fatherName: 'Mr. Vikram Patel',
  class: '9',
  section: 'B',
  rollNo: '08',
  contactNo: '+91 98765 43211',
  academicYear: '2025-2026',
  previousAcademicYear: '2024-2025',
  feeHeadBalances: [
  {
    id: 'FH-1',
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    balanceType: 'credit',
    amount: 5000,
    remarks: 'Advance paid'
  },
  {
    id: 'FH-2',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    balanceType: 'credit',
    amount: 2000,
    remarks: 'Extra payment'
  }],

  totalDebit: 0,
  totalCredit: 7000,
  netBalance: -7000,
  effectiveDate: '2025-04-01',
  remarks: 'Advance to be adjusted.',
  entryType: 'carried_forward',
  status: 'confirmed',
  createdAt: '2025-03-25 11:00',
  createdBy: 'Accountant',
  updatedAt: '2025-03-25 11:00',
  updatedBy: 'Accountant',
  lockedAt: null,
  lockedBy: null
},
{
  id: 'OB-0003',
  admissionNo: 'ADM-2022-0567',
  studentName: 'Amit Kumar',
  fatherName: 'Mr. Suresh Kumar',
  class: '8',
  section: 'C',
  rollNo: '22',
  contactNo: '+91 98765 43212',
  academicYear: '2025-2026',
  previousAcademicYear: '2024-2025',
  feeHeadBalances: [
  {
    id: 'FH-1',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    balanceType: 'debit',
    amount: 25000,
    remarks: 'H2 pending'
  },
  {
    id: 'FH-2',
    feeHeadId: 'hostel',
    feeHeadName: 'Hostel Fee',
    balanceType: 'debit',
    amount: 15000,
    remarks: 'Q3-Q4 pending'
  }],

  totalDebit: 40000,
  totalCredit: 0,
  netBalance: 40000,
  effectiveDate: '2025-04-01',
  remarks: 'Draft during migration.',
  entryType: 'manual',
  status: 'draft',
  createdAt: '2025-03-26 09:15',
  createdBy: 'Accountant',
  updatedAt: '2025-03-26 09:15',
  updatedBy: 'Accountant',
  lockedAt: null,
  lockedBy: null
},
{
  id: 'OB-0004',
  admissionNo: 'ADM-2023-0234',
  studentName: 'Sneha Reddy',
  fatherName: 'Mr. Venkat Reddy',
  class: '11',
  section: 'A',
  rollNo: '05',
  contactNo: '+91 98765 43213',
  academicYear: '2025-2026',
  previousAcademicYear: '2024-2025',
  feeHeadBalances: [
  {
    id: 'FH-1',
    feeHeadId: 'tuition',
    feeHeadName: 'Tuition Fee',
    balanceType: 'debit',
    amount: 8000,
    remarks: 'March pending'
  },
  {
    id: 'FH-2',
    feeHeadId: 'transport',
    feeHeadName: 'Transport Fee',
    balanceType: 'credit',
    amount: 3000,
    remarks: 'Advance for April'
  }],

  totalDebit: 8000,
  totalCredit: 3000,
  netBalance: 5000,
  effectiveDate: '2025-04-01',
  remarks: 'Imported and locked.',
  entryType: 'imported',
  status: 'locked',
  createdAt: '2025-03-24 08:00',
  createdBy: 'System Import',
  updatedAt: '2025-03-28 16:00',
  updatedBy: 'Admin',
  lockedAt: '2025-03-28 16:00',
  lockedBy: 'Admin'
}];

// ============================================
// Helpers
// ============================================
function currency(n: number) {
  const abs = Math.abs(n);
  const formatted = `₹${abs.toLocaleString('en-IN')}`;
  return n < 0 ? `-${formatted}` : formatted;
}
function toDT(s: string) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
function computeTotals(lines: FeeHeadBalance[]) {
  const totalDebit = lines.reduce(
    (sum, l) => sum + (l.balanceType === 'debit' ? l.amount : 0),
    0
  );
  const totalCredit = lines.reduce(
    (sum, l) => sum + (l.balanceType === 'credit' ? l.amount : 0),
    0
  );
  return {
    totalDebit,
    totalCredit,
    netBalance: totalDebit - totalCredit
  };
}
function statusBadge(status: EntryStatus) {
  if (status === 'draft') return <Badge variant="warning">Draft</Badge>;
  if (status === 'confirmed') return <Badge variant="success">Confirmed</Badge>;
  return <Badge variant="info">Locked</Badge>;
}
function entryTypeBadge(type: EntryType) {
  if (type === 'manual') return <Badge variant="secondary">Manual</Badge>;
  if (type === 'imported') return <Badge variant="info">Imported</Badge>;
  return <Badge variant="warning">Carried Forward</Badge>;
}
// ============================================
// Component
// ============================================
export function FeeOpening() {
  const [data, setData] = useState<OpeningBalanceRecord[]>(INITIAL_DATA);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    academicYear: '2025-2026',
    previousAcademicYear: '2024-2025',
    class: '',
    section: '',
    status: '',
    entryType: '',
    q: '',
    showZeroBalance: false,
    itemsPerPage: 25
  });
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryMode, setEntryMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<EntryFormState>(() => ({
    admissionNo: '',
    studentName: '',
    fatherName: '',
    class: '',
    section: '',
    rollNo: '',
    contactNo: '',
    academicYear: '2025-2026',
    previousAcademicYear: '2024-2025',
    effectiveDate: new Date().toISOString().split('T')[0],
    remarks: '',
    feeHeadBalances: FEE_HEADS.map((h, idx) => ({
      id: `line-${idx + 1}`,
      feeHeadId: h.value,
      feeHeadName: h.label,
      balanceType: 'debit',
      amount: 0,
      remarks: ''
    }))
  }));
  const [importModal, setImportModal] = useState<ImportModalState>({
    open: false,
    step: 1,
    mode: 'excel',
    selectedClass: '',
    selectedSection: '',
    file: null,
    preview: [],
    errors: []
  });
  // ------------------------------------------
  // Filtering + paging
  // ------------------------------------------
  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filters.academicYear && r.academicYear !== filters.academicYear)
      return false;
      if (
      filters.previousAcademicYear &&
      r.previousAcademicYear !== filters.previousAcademicYear)

      return false;
      if (filters.class && r.class !== filters.class) return false;
      if (filters.section && r.section !== filters.section) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.entryType && r.entryType !== filters.entryType) return false;
      if (!filters.showZeroBalance && r.netBalance === 0) return false;
      if (filters.q.trim()) {
        const q = filters.q.trim().toLowerCase();
        const hay =
        `${r.admissionNo} ${r.studentName} ${r.fatherName || ''} ${r.contactNo || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, filters]);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / filters.itemsPerPage)
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * filters.itemsPerPage;
  const pageRows = filtered.slice(start, start + filters.itemsPerPage);
  // ------------------------------------------
  // Validation: Cannot duplicate opening balance
  // Uniqueness key: (academicYear, admissionNo)
  // ------------------------------------------
  const existsOpening = (
  academicYear: string,
  admissionNo: string,
  ignoreId?: string | null) =>
  {
    const keyAy = academicYear.trim();
    const keyAdm = admissionNo.trim().toLowerCase();
    return data.some((r) => {
      if (ignoreId && r.id === ignoreId) return false;
      return (
        r.academicYear === keyAy &&
        r.admissionNo.trim().toLowerCase() === keyAdm);

    });
  };
  // ------------------------------------------
  // Actions
  // ------------------------------------------
  const toggleExpand = (id: string) =>
  setExpanded((p) => ({
    ...p,
    [id]: !p[id]
  }));
  const toggleSelectAll = () => {
    const allIds = pageRows.map((r) => r.id);
    const allSelected = allIds.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allSelected) allIds.forEach((id) => next.delete(id));else
    allIds.forEach((id) => next.add(id));
    setSelected(next);
  };
  const toggleSelect = (id: string, disabled: boolean) => {
    if (disabled) return;
    setSelected((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };
  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
  };
  const openAdd = () => {
    setEntryMode('add');
    setEditId(null);
    setForm((prev) => ({
      ...prev,
      admissionNo: '',
      studentName: '',
      fatherName: '',
      class: filters.class || '',
      section: filters.section || '',
      rollNo: '',
      contactNo: '',
      academicYear: filters.academicYear,
      previousAcademicYear: filters.previousAcademicYear,
      effectiveDate: new Date().toISOString().split('T')[0],
      remarks: '',
      feeHeadBalances: prev.feeHeadBalances.map((l) => ({
        ...l,
        balanceType: 'debit',
        amount: 0,
        remarks: ''
      }))
    }));
    setEntryModalOpen(true);
  };
  const openEdit = (row: OpeningBalanceRecord) => {
    if (row.status === 'locked') return;
    setEntryMode('edit');
    setEditId(row.id);
    setForm({
      admissionNo: row.admissionNo,
      studentName: row.studentName,
      fatherName: row.fatherName || '',
      class: row.class,
      section: row.section,
      rollNo: row.rollNo || '',
      contactNo: row.contactNo || '',
      academicYear: row.academicYear,
      previousAcademicYear: row.previousAcademicYear,
      effectiveDate: row.effectiveDate,
      remarks: row.remarks || '',
      feeHeadBalances:
      row.feeHeadBalances.length > 0 ?
      row.feeHeadBalances.map((l, idx) => ({
        ...l,
        id: l.id || `line-${idx + 1}`
      })) :
      FEE_HEADS.map((h, idx) => ({
        id: `line-${idx + 1}`,
        feeHeadId: h.value,
        feeHeadName: h.label,
        balanceType: 'debit',
        amount: 0,
        remarks: ''
      }))
    });
    setEntryModalOpen(true);
  };
  const closeEntry = () => setEntryModalOpen(false);
  const saveEntry = (status: EntryStatus) => {
    // Basic validation
    if (
    !form.admissionNo.trim() ||
    !form.studentName.trim() ||
    !form.class.trim() ||
    !form.section.trim())
    {
      alert('Please fill Admission No, Student Name, Class, Section.');
      return;
    }
    // Duplicate validation
    if (
    existsOpening(
      form.academicYear,
      form.admissionNo,
      entryMode === 'edit' ? editId : null
    ))
    {
      alert(
        `Duplicate opening balance detected for Admission No ${form.admissionNo} in ${form.academicYear}.`
      );
      return;
    }
    const totals = computeTotals(form.feeHeadBalances);
    const now = new Date().toISOString();
    const record: OpeningBalanceRecord = {
      id: entryMode === 'edit' && editId ? editId : `OB-${String(Date.now())}`,
      admissionNo: form.admissionNo.trim(),
      studentName: form.studentName.trim(),
      fatherName: form.fatherName.trim() || undefined,
      class: form.class,
      section: form.section,
      rollNo: form.rollNo.trim() || undefined,
      contactNo: form.contactNo.trim() || undefined,
      academicYear: form.academicYear,
      previousAcademicYear: form.previousAcademicYear,
      feeHeadBalances: form.feeHeadBalances.filter((l) => l.amount > 0),
      totalDebit: totals.totalDebit,
      totalCredit: totals.totalCredit,
      netBalance: totals.netBalance,
      effectiveDate: form.effectiveDate,
      remarks: form.remarks.trim() || undefined,
      entryType: entryMode === 'edit' ? 'manual' : 'manual',
      status,
      createdAt:
      entryMode === 'edit' ?
      data.find((d) => d.id === editId)?.createdAt || now :
      now,
      createdBy:
      entryMode === 'edit' ?
      data.find((d) => d.id === editId)?.createdBy || 'User' :
      'User',
      updatedAt: now,
      updatedBy: 'User',
      lockedAt: status === 'locked' ? now : null,
      lockedBy: status === 'locked' ? 'User' : null
    };
    setData((prev) => {
      if (entryMode === 'edit' && editId)
      return prev.map((p) => p.id === editId ? record : p);
      return [record, ...prev];
    });
    // Backend effects (placeholder):
    // - Post to student ledger
    // - Reflect in Trial Balance
    // This UI is migration entry; actual posting happens server-side.
    closeEntry();
    alert(
      status === 'draft' ?
      'Saved as Draft. (Will reflect in ledger/TB after confirmation posting)' :
      status === 'confirmed' ?
      'Saved & Confirmed. (Will reflect in student ledger and Trial Balance)' :
      'Saved & Locked. (Finalized and reflected in student ledger and Trial Balance)'
    );
  };
  const confirmSelected = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setData((prev) =>
    prev.map((r) =>
    ids.includes(r.id) && r.status === 'draft' ?
    {
      ...r,
      status: 'confirmed',
      updatedAt: new Date().toISOString(),
      updatedBy: 'User'
    } :
    r
    )
    );
    alert(
      'Selected draft entries confirmed. They will reflect in student ledger and Trial Balance.'
    );
  };
  const lockSelected = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    // Only confirmed can be locked
    const invalid = data.some(
      (r) => ids.includes(r.id) && r.status !== 'confirmed'
    );
    if (invalid) {
      alert(
        'Only CONFIRMED entries can be locked. Please confirm drafts first.'
      );
      return;
    }
    setData((prev) =>
    prev.map((r) =>
    ids.includes(r.id) ?
    {
      ...r,
      status: 'locked',
      lockedAt: new Date().toISOString(),
      lockedBy: 'User',
      updatedAt: new Date().toISOString(),
      updatedBy: 'User'
    } :
    r
    )
    );
    alert('Selected entries locked. They are now finalized and immutable.');
  };
  const deleteRow = (row: OpeningBalanceRecord) => {
    if (row.status === 'locked') return;
    if (
    !confirm(
      `Delete opening balance for ${row.studentName} (${row.admissionNo})?`
    ))

    return;
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };
  // ------------------------------------------
  // Import (class bulk + excel)
  // ------------------------------------------
  const openImport = (mode: 'classBulk' | 'excel') => {
    setImportModal({
      open: true,
      step: 1,
      mode,
      selectedClass: filters.class || '',
      selectedSection: filters.section || '',
      file: null,
      preview: [],
      errors: []
    });
  };
  const closeImport = () =>
  setImportModal((p) => ({
    ...p,
    open: false
  }));
  const buildImportPreview = () => {
    const errors: string[] = [];
    if (importModal.mode === 'classBulk') {
      if (!importModal.selectedClass)
      errors.push('Select Class for bulk upload.');
      // section optional
      if (errors.length) {
        setImportModal((p) => ({
          ...p,
          errors
        }));
        return;
      }
      // Simulated preview rows
      const preview: ImportRow[] = [
      {
        admissionNo: `BULK-${importModal.selectedClass}-001`,
        studentName: 'Student One',
        class: importModal.selectedClass,
        section: importModal.selectedSection || 'A',
        feeHeadId: 'tuition',
        feeHeadName: 'Tuition Fee',
        balanceType: 'debit',
        amount: 12000,
        remarks: 'Migration bulk'
      },
      {
        admissionNo: `BULK-${importModal.selectedClass}-002`,
        studentName: 'Student Two',
        class: importModal.selectedClass,
        section: importModal.selectedSection || 'A',
        feeHeadId: 'transport',
        feeHeadName: 'Transport Fee',
        balanceType: 'credit',
        amount: 2000,
        remarks: 'Advance'
      }];

      setImportModal((p) => ({
        ...p,
        step: 2,
        preview,
        errors: []
      }));
      return;
    }
    // Excel import mode
    if (!importModal.file) {
      setImportModal((p) => ({
        ...p,
        errors: ['Please select an Excel/CSV file.']
      }));
      return;
    }
    // Simulated parsed preview (normally parse via backend or xlsx lib)
    const preview: ImportRow[] = [
    {
      admissionNo: 'ADM-2024-9001',
      studentName: 'Imported Student A',
      class: '10',
      section: 'B',
      feeHeadId: 'tuition',
      feeHeadName: 'Tuition Fee',
      balanceType: 'debit',
      amount: 10000,
      remarks: 'Excel import'
    },
    {
      admissionNo: 'ADM-2024-9002',
      studentName: 'Imported Student B',
      class: '10',
      section: 'B',
      feeHeadId: 'annual',
      feeHeadName: 'Annual Charges',
      balanceType: 'debit',
      amount: 2500,
      remarks: ''
    }];

    setImportModal((p) => ({
      ...p,
      step: 2,
      preview,
      errors: []
    }));
  };
  const validateImportPreview = () => {
    const errors: string[] = [];
    // Cannot duplicate opening balance for academicYear + admissionNo
    const ay = filters.academicYear;
    importModal.preview.forEach((row) => {
      if (existsOpening(ay, row.admissionNo)) {
        errors.push(
          `Duplicate opening balance exists: ${row.admissionNo} (${ay})`
        );
      }
      if (!row.admissionNo || !row.studentName)
      errors.push(
        `Missing student identifiers for row: ${row.admissionNo || '(blank)'}`
      );
      if (row.amount < 0)
      errors.push(`Negative amount not allowed: ${row.admissionNo}`);
      if (row.balanceType !== 'debit' && row.balanceType !== 'credit')
      errors.push(`Invalid balance type: ${row.admissionNo}`);
    });
    // Detect duplicates within file
    const seen = new Set<string>();
    importModal.preview.forEach((r) => {
      const k = `${ay}::${r.admissionNo.trim().toLowerCase()}`;
      if (seen.has(k))
      errors.push(
        `Duplicate admission within import: ${r.admissionNo} (${ay})`
      );
      seen.add(k);
    });
    if (errors.length) {
      setImportModal((p) => ({
        ...p,
        errors
      }));
      return false;
    }
    setImportModal((p) => ({
      ...p,
      step: 3,
      errors: []
    }));
    return true;
  };
  const commitImport = () => {
    const ay = filters.academicYear;
    const prevAy = filters.previousAcademicYear;
    const now = new Date().toISOString();
    // Create records student-wise: group by admissionNo
    const grouped: Record<string, ImportRow[]> = {};
    importModal.preview.forEach((r) => {
      grouped[r.admissionNo] = grouped[r.admissionNo] || [];
      grouped[r.admissionNo].push(r);
    });
    const newRecords: OpeningBalanceRecord[] = Object.entries(grouped).map(
      ([admissionNo, rows], idx) => {
        const feeHeadBalances: FeeHeadBalance[] = rows.map((r, i) => ({
          id: `IMP-${admissionNo}-${i + 1}`,
          feeHeadId: r.feeHeadId,
          feeHeadName: r.feeHeadName,
          balanceType: r.balanceType,
          amount: r.amount,
          remarks: r.remarks || ''
        }));
        const totals = computeTotals(feeHeadBalances);
        const first = rows[0];
        return {
          id: `OB-IMP-${Date.now()}-${idx + 1}`,
          admissionNo,
          studentName: first.studentName,
          fatherName: undefined,
          class: first.class,
          section: first.section,
          rollNo: undefined,
          contactNo: undefined,
          academicYear: ay,
          previousAcademicYear: prevAy,
          feeHeadBalances,
          totalDebit: totals.totalDebit,
          totalCredit: totals.totalCredit,
          netBalance: totals.netBalance,
          effectiveDate: `${ay.split('-')[0]}-04-01`,
          remarks: 'Imported opening balance',
          entryType: 'imported',
          status: 'draft',
          createdAt: now,
          createdBy: 'System Import',
          updatedAt: now,
          updatedBy: 'System Import',
          lockedAt: null,
          lockedBy: null
        };
      }
    );
    setData((prev) => [...newRecords, ...prev]);
    closeImport();
    alert(
      'Import completed. Entries created as DRAFT. Confirm to post into Student Ledger and Trial Balance.'
    );
  };
  // ------------------------------------------
  // Finalize (lock once finalized)
  // ------------------------------------------
  const finalizeAndLockAllConfirmed = () => {
    const hasConfirmed = data.some(
      (r) =>
      r.academicYear === filters.academicYear && r.status === 'confirmed'
    );
    if (!hasConfirmed) {
      alert('No confirmed entries available to lock.');
      return;
    }
    if (
    !confirm(
      'Finalize and LOCK all confirmed entries for this academic year? This cannot be undone.'
    ))

    return;
    const now = new Date().toISOString();
    setData((prev) =>
    prev.map((r) =>
    r.academicYear === filters.academicYear && r.status === 'confirmed' ?
    {
      ...r,
      status: 'locked',
      lockedAt: now,
      lockedBy: 'User',
      updatedAt: now,
      updatedBy: 'User'
    } :
    r
    )
    );
    alert(
      'Finalized. Confirmed entries are now locked and reflected in Student Ledger and Trial Balance.'
    );
  };
  // ------------------------------------------
  // Derived: finalize state for the year
  // ------------------------------------------
  const yearStats = useMemo(() => {
    const inYear = data.filter((r) => r.academicYear === filters.academicYear);
    return {
      draft: inYear.filter((r) => r.status === 'draft').length,
      confirmed: inYear.filter((r) => r.status === 'confirmed').length,
      locked: inYear.filter((r) => r.status === 'locked').length
    };
  }, [data, filters.academicYear]);
  // ------------------------------------------
  // UI
  // ------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Opening</h1>
          <p className="text-sm text-gray-500">
            Migration / new session opening: student-wise pending (Debit) and
            advance (Credit) breakup.
          </p>
          <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Cannot duplicate opening balance (Academic Year + Admission No).
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Lock once finalized; locked entries are immutable.
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              Confirmed/Locked entries reflect in Student Ledger & Trial
              Balance.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => openImport('classBulk')}>
            <Users className="w-4 h-4 mr-2" />
            Class Bulk Upload
          </Button>
          <Button variant="outline" onClick={() => openImport('excel')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel Import
          </Button>
          <Button variant="outline" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />

            Refresh
          </Button>
          <Button variant="primary" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Opening Balance
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Filters (Academic year selector included) */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Filters</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters((p) => !p)}>

            {showFilters ?
            <ChevronUp className="w-4 h-4" /> :

            <ChevronDown className="w-4 h-4" />
            }
          </Button>
        </div>

        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select
            label="Academic Year (Current)"
            value={filters.academicYear}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                academicYear: v
              }));
              setPage(1);
            }}
            options={ACADEMIC_YEARS} />

            <Select
            label="Previous Academic Year"
            value={filters.previousAcademicYear}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                previousAcademicYear: v
              }));
              setPage(1);
            }}
            options={PREV_YEARS} />

            <Select
            label="Class"
            value={filters.class}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                class: v
              }));
              setPage(1);
            }}
            options={CLASSES} />

            <Select
            label="Section"
            value={filters.section}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                section: v
              }));
              setPage(1);
            }}
            options={SECTIONS} />

            <Select
            label="Status"
            value={filters.status}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                status: v as any
              }));
              setPage(1);
            }}
            options={STATUS_OPTIONS as any} />

            <Select
            label="Entry Type"
            value={filters.entryType}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                entryType: v as any
              }));
              setPage(1);
            }}
            options={ENTRY_TYPES as any} />


            <div className="md:col-span-3">
              <Input
              label="Search"
              placeholder="Admission No, Student Name, Contact..."
              value={filters.q}
              onChange={(e) => {
                setFilters((p) => ({
                  ...p,
                  q: e.target.value
                }));
                setPage(1);
              }} />

            </div>

            <Select
            label="Items / page"
            value={String(filters.itemsPerPage)}
            onChange={(v) => {
              setFilters((p) => ({
                ...p,
                itemsPerPage: Number(v)
              }));
              setPage(1);
            }}
            options={ITEMS_PER_PAGE.map((x) => ({
              value: String(x.value),
              label: x.label
            }))} />


            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                type="checkbox"
                checked={filters.showZeroBalance}
                onChange={(e) => {
                  setFilters((p) => ({
                    ...p,
                    showZeroBalance: e.target.checked
                  }));
                  setPage(1);
                }}
                className="w-4 h-4 rounded border-gray-300" />

                Show Zero Balance
              </label>
            </div>
          </div>
        }
      </Card>

      {/* Bulk Actions + Finalize */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Selected: <strong>{selected.size}</strong> &nbsp;|&nbsp; Year
            Status: <strong>{yearStats.draft}</strong> Draft,{' '}
            <strong>{yearStats.confirmed}</strong> Confirmed,{' '}
            <strong>{yearStats.locked}</strong> Locked
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={confirmSelected}
              disabled={selected.size === 0}>

              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Selected
            </Button>
            <Button
              variant="outline"
              onClick={lockSelected}
              disabled={selected.size === 0}>

              <Lock className="w-4 h-4 mr-2" />
              Lock Selected
            </Button>
            <Button
              variant="primary"
              onClick={finalizeAndLockAllConfirmed}
              disabled={yearStats.confirmed === 0}>

              <Lock className="w-4 h-4 mr-2" />
              Finalize & Lock Confirmed
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={
                    pageRows.length > 0 &&
                    pageRows.every((r) => selected.has(r.id))
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300" />

                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Effective
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Debit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Credit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Net
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {pageRows.map((r) => {
                const locked = r.status === 'locked';
                return (
                  <Fragment key={r.id}>
                    <tr
                      className={
                      locked ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                      }>

                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggleSelect(r.id, locked)}
                          disabled={locked}
                          className="w-4 h-4 rounded border-gray-300 disabled:opacity-50" />

                      </td>

                      <td className="px-4 py-3">
                        <button
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          onClick={() => toggleExpand(r.id)}>

                          {expanded[r.id] ?
                          <ChevronDown className="w-4 h-4" /> :

                          <ChevronRight className="w-4 h-4" />
                          }
                          Breakup
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {r.studentName}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="font-mono">{r.admissionNo}</span>
                              {r.contactNo &&
                              <span className="text-gray-400">
                                  • {r.contactNo}
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {r.class}-{r.section}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {toDT(r.effectiveDate)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">
                        {currency(r.totalDebit)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">
                        {currency(r.totalCredit)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-bold ${r.netBalance > 0 ? 'text-red-700' : r.netBalance < 0 ? 'text-green-700' : 'text-gray-600'}`}>

                        {currency(r.netBalance)}
                      </td>
                      <td className="px-4 py-3">
                        {entryTypeBadge(r.entryType)}
                      </td>
                      <td className="px-4 py-3">{statusBadge(r.status)}</td>

                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(r.id)}>

                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(r)}
                            disabled={locked}>

                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRow(r)}
                            disabled={locked}>

                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {expanded[r.id] &&
                    <tr className="bg-gray-50">
                        <td colSpan={11} className="px-4 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 bg-white border rounded-lg overflow-hidden">
                              <div className="px-4 py-2 border-b bg-gray-50 text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-gray-500" />
                                Student-wise pending breakup
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-white border-b">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                        Fee Head
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                        Dr/Cr
                                      </th>
                                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">
                                        Amount
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                                        Remarks
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {r.feeHeadBalances.map((l) =>
                                  <tr key={l.id}>
                                        <td className="px-4 py-2">
                                          <div className="font-medium text-gray-900">
                                            {l.feeHeadName}
                                          </div>
                                          <div className="text-xs text-gray-400 font-mono">
                                            {l.feeHeadId}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2">
                                          <Badge
                                        variant={
                                        l.balanceType === 'debit' ?
                                        'danger' :
                                        'success'
                                        }>

                                            {l.balanceType === 'debit' ?
                                        'Debit' :
                                        'Credit'}
                                          </Badge>
                                        </td>
                                        <td
                                      className={`px-4 py-2 text-right font-semibold ${l.balanceType === 'debit' ? 'text-red-600' : 'text-green-600'}`}>

                                          {currency(l.amount)}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                          {l.remarks || '-'}
                                        </td>
                                      </tr>
                                  )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="bg-white border rounded-lg p-4 space-y-2">
                              <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-500" />
                                Validation & Posting
                              </div>
                              <div className="text-xs text-gray-600 space-y-2">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                  <span>
                                    Duplicate check key:{' '}
                                    <strong>
                                      (Academic Year + Admission No)
                                    </strong>
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                  <span>
                                    On <strong>Confirm</strong>: system posts
                                    opening to <strong>Student Ledger</strong>{' '}
                                    and reflects in{' '}
                                    <strong>Trial Balance</strong>.
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                  <span>
                                    On <strong>Lock</strong>: entry becomes
                                    immutable (finalization for migration).
                                  </span>
                                </div>
                                {r.status === 'locked' &&
                              <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                                    Locked at:{' '}
                                    {r.lockedAt ? toDT(r.lockedAt) : '-'} by{' '}
                                    {r.lockedBy || '-'}
                                  </div>
                              }
                              </div>

                              <div className="pt-3 border-t flex gap-2">
                                <Button
                                variant="outline"
                                size="sm"
                                disabled={r.status !== 'draft'}
                                onClick={() => {
                                  setSelected(new Set([r.id]));
                                  confirmSelected();
                                }}>

                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                variant="outline"
                                size="sm"
                                disabled={r.status !== 'confirmed'}
                                onClick={() => {
                                  setSelected(new Set([r.id]));
                                  lockSelected();
                                }}>

                                  <Lock className="w-4 h-4 mr-1" />
                                  Lock
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  </Fragment>);

              })}

              {pageRows.length === 0 &&
              <tr>
                  <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-sm text-gray-500">

                    No opening balances found for selected filters.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing <strong>{filtered.length === 0 ? 0 : start + 1}</strong> -{' '}
            <strong>
              {Math.min(start + filters.itemsPerPage, filtered.length)}
            </strong>{' '}
            of <strong>{filtered.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={safePage === 1}>

              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}>

              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-gray-700">
              Page <strong>{safePage}</strong> / <strong>{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}>

              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}>

              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Entry Modal */}
      {entryModalOpen &&
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {entryMode === 'add' ?
                'Add Opening Balance' :
                'Edit Opening Balance'}
                </h2>
                <p className="text-sm text-gray-500">
                  Debit = Due from Student | Credit = Advance / Due to Student
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeEntry}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Student + Year */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                label="Admission No *"
                value={form.admissionNo}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  admissionNo: e.target.value
                }))
                }
                placeholder="ADM-XXXX" />

                <Input
                label="Student Name *"
                value={form.studentName}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  studentName: e.target.value
                }))
                }
                placeholder="Full name" />

                <Input
                label="Father Name"
                value={form.fatherName}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fatherName: e.target.value
                }))
                } />

                <Input
                label="Contact No"
                value={form.contactNo}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  contactNo: e.target.value
                }))
                } />


                <Select
                label="Class *"
                value={form.class}
                onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  class: v
                }))
                }
                options={CLASSES.filter((c) => c.value)} />

                <Select
                label="Section *"
                value={form.section}
                onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  section: v
                }))
                }
                options={SECTIONS.filter((s) => s.value)} />

                <Input
                label="Roll No"
                value={form.rollNo}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  rollNo: e.target.value
                }))
                } />

                <Input
                label="Effective Date *"
                type="date"
                value={form.effectiveDate}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  effectiveDate: e.target.value
                }))
                } />


                <Select
                label="Academic Year (Current) *"
                value={form.academicYear}
                onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  academicYear: v
                }))
                }
                options={ACADEMIC_YEARS} />

                <Select
                label="Previous Academic Year *"
                value={form.previousAcademicYear}
                onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  previousAcademicYear: v
                }))
                }
                options={PREV_YEARS} />

                <div className="md:col-span-2">
                  <Input
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    remarks: e.target.value
                  }))
                  }
                  placeholder="Optional" />

                </div>
              </div>

              {/* Fee head breakup */}
              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b font-semibold text-gray-800 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-gray-500" />
                  Student-wise pending breakup (Fee Head wise)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Fee Head
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Debit/Credit
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {form.feeHeadBalances.map((l, idx) =>
                    <tr key={l.id}>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">
                              {l.feeHeadName}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {l.feeHeadId}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <select
                          value={l.balanceType}
                          onChange={(e) => {
                            const value = e.target.value as BalanceType;
                            setForm((p) => {
                              const next = [...p.feeHeadBalances];
                              next[idx] = {
                                ...next[idx],
                                balanceType: value
                              };
                              return {
                                ...p,
                                feeHeadBalances: next
                              };
                            });
                          }}
                          className="w-full px-3 py-2 border rounded-lg text-sm">

                              <option value="debit">Debit (Due)</option>
                              <option value="credit">Credit (Advance)</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <input
                          type="number"
                          min={0}
                          value={l.amount}
                          onChange={(e) => {
                            const value = Number(e.target.value || 0);
                            setForm((p) => {
                              const next = [...p.feeHeadBalances];
                              next[idx] = {
                                ...next[idx],
                                amount: value
                              };
                              return {
                                ...p,
                                feeHeadBalances: next
                              };
                            });
                          }}
                          className="w-32 text-right px-3 py-2 border rounded-lg text-sm" />

                          </td>
                          <td className="px-4 py-2">
                            <input
                          value={l.remarks || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setForm((p) => {
                              const next = [...p.feeHeadBalances];
                              next[idx] = {
                                ...next[idx],
                                remarks: value
                              };
                              return {
                                ...p,
                                feeHeadBalances: next
                              };
                            });
                          }}
                          placeholder="Optional"
                          className="w-full px-3 py-2 border rounded-lg text-sm" />

                          </td>
                        </tr>
                    )}
                    </tbody>

                    <tfoot className="bg-gray-50 border-t">
                      {(() => {
                      const t = computeTotals(form.feeHeadBalances);
                      return (
                        <tr>
                            <td
                            className="px-4 py-3 font-semibold text-gray-800"
                            colSpan={2}>

                              Totals
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-xs text-gray-600">
                                Debit:{' '}
                                <strong className="text-red-600">
                                  {currency(t.totalDebit)}
                                </strong>
                              </div>
                              <div className="text-xs text-gray-600">
                                Credit:{' '}
                                <strong className="text-green-600">
                                  {currency(t.totalCredit)}
                                </strong>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                              className={`font-bold ${t.netBalance > 0 ? 'text-red-700' : t.netBalance < 0 ? 'text-green-700' : 'text-gray-600'}`}>

                                Net: {currency(t.netBalance)}
                              </span>
                            </td>
                          </tr>);

                    })()}
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-semibold">Posting & Impact</div>
                  <div className="text-xs mt-1">
                    After <strong>Confirm</strong>, the opening balance will be
                    posted to the student ledger and will appear in the Trial
                    Balance as opening receivable/payable. After{' '}
                    <strong>Lock</strong>, editing is blocked (final migration).
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" onClick={closeEntry}>
                Close
              </Button>
              <Button variant="outline" onClick={() => saveEntry('draft')}>
                Save Draft
              </Button>
              <Button variant="primary" onClick={() => saveEntry('confirmed')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save & Confirm
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {importModal.open &&
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {importModal.mode === 'classBulk' ?
                'Class-wise Bulk Opening Balance Upload' :
                'Excel Import (Opening Balances)'}
                </h2>
                <p className="text-sm text-gray-500">
                  Step {importModal.step} of 3 • Duplicate opening balances are
                  not allowed.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeImport}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Errors */}
              {importModal.errors.length > 0 &&
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Import Errors
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {importModal.errors.slice(0, 8).map((e, i) =>
                <li key={i}>{e}</li>
                )}
                    {importModal.errors.length > 8 &&
                <li>+ {importModal.errors.length - 8} more...</li>
                }
                  </ul>
                </div>
            }

              {/* Step 1 */}
              {importModal.step === 1 &&
            <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                  label="Academic Year (Current)"
                  value={filters.academicYear}
                  onChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    academicYear: v
                  }))
                  }
                  options={ACADEMIC_YEARS} />

                    <Select
                  label="Previous Academic Year"
                  value={filters.previousAcademicYear}
                  onChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    previousAcademicYear: v
                  }))
                  }
                  options={PREV_YEARS} />

                    <Input
                  label="Effective Date"
                  type="date"
                  value={`${filters.academicYear.split('-')[0]}-04-01`}
                  disabled />

                  </div>

                  {importModal.mode === 'classBulk' ?
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                  label="Class *"
                  value={importModal.selectedClass}
                  onChange={(v) =>
                  setImportModal((p) => ({
                    ...p,
                    selectedClass: v
                  }))
                  }
                  options={CLASSES.filter((c) => c.value)} />

                      <Select
                  label="Section (optional)"
                  value={importModal.selectedSection}
                  onChange={(v) =>
                  setImportModal((p) => ({
                    ...p,
                    selectedSection: v
                  }))
                  }
                  options={SECTIONS} />

                      <div className="flex items-end">
                        <Button
                    variant="primary"
                    onClick={buildImportPreview}
                    className="w-full">

                          <Eye className="w-4 h-4 mr-2" />
                          Generate Preview
                        </Button>
                      </div>
                    </div> :

              <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 font-medium">
                          Upload Excel/CSV
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Template
                        </Button>
                      </div>

                      <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImportModal((p) => ({
                      ...p,
                      file
                    }));
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />


                      <div className="flex justify-end">
                        <Button
                    variant="primary"
                    onClick={buildImportPreview}
                    disabled={!importModal.file}>

                          <Eye className="w-4 h-4 mr-2" />
                          Preview Import
                        </Button>
                      </div>
                    </div>
              }

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Note:</strong> Import creates entries as{' '}
                    <strong>DRAFT</strong>. Confirm to post into Student Ledger
                    and Trial Balance.
                  </div>
                </div>
            }

              {/* Step 2: Preview */}
              {importModal.step === 2 &&
            <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Preview Rows:{' '}
                      <strong>{importModal.preview.length}</strong>
                    </div>
                    <div className="flex gap-2">
                      <Button
                    variant="outline"
                    onClick={() =>
                    setImportModal((p) => ({
                      ...p,
                      step: 1
                    }))
                    }>

                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                    variant="primary"
                    onClick={validateImportPreview}
                    disabled={importModal.preview.length === 0}>

                        <CheckCircle className="w-4 h-4 mr-2" />
                        Validate
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Admission No
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Student
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Class
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Fee Head
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Dr/Cr
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {importModal.preview.slice(0, 20).map((r, i) =>
                      <tr key={i}>
                              <td className="px-4 py-2 font-mono text-xs">
                                {r.admissionNo}
                              </td>
                              <td className="px-4 py-2">{r.studentName}</td>
                              <td className="px-4 py-2">
                                {r.class}-{r.section}
                              </td>
                              <td className="px-4 py-2">{r.feeHeadName}</td>
                              <td className="px-4 py-2">
                                <Badge
                            variant={
                            r.balanceType === 'debit' ?
                            'danger' :
                            'success'
                            }>

                                  {r.balanceType === 'debit' ?
                            'Debit' :
                            'Credit'}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 text-right font-semibold">
                                {currency(r.amount)}
                              </td>
                            </tr>
                      )}
                          {importModal.preview.length > 20 &&
                      <tr>
                              <td
                          colSpan={6}
                          className="px-4 py-2 text-xs text-gray-500">

                                Showing first 20 rows. Continue to validate and
                                import the full file.
                              </td>
                            </tr>
                      }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            }

              {/* Step 3: Confirm Import */}
              {importModal.step === 3 &&
            <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-800">
                        Validation Passed
                      </div>
                      <div className="text-sm text-green-700">
                        Ready to import{' '}
                        <strong>{importModal.preview.length}</strong> rows as
                        draft opening balances for{' '}
                        <strong>{filters.academicYear}</strong>.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                  variant="outline"
                  onClick={() =>
                  setImportModal((p) => ({
                    ...p,
                    step: 2
                  }))
                  }>

                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button variant="primary" onClick={commitImport}>
                      <FileUp className="w-4 h-4 mr-2" />
                      Import as Draft
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    After import: Confirm entries to reflect in Student Ledger
                    and Trial Balance. Lock to finalize migration.
                  </div>
                </div>
            }
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Duplicate prevention: Academic Year + Admission No must be
                unique.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeImport}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Footer Note */}
      <Card className="p-4 bg-gray-50">
        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            This module is intended for{' '}
            <strong>migration / new session opening</strong>. Avoid using after
            regular fee transactions begin.
          </p>
          <p className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Maintain auditability: confirm/lock actions should be captured in
            Audit Trail (server-side).
          </p>
        </div>
      </Card>
    </div>);

}