import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  RotateCcw,
  AlertCircle,
  Info,
  History,
  ShieldAlert,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  User,
  GraduationCap,
  Download,
  Printer } from
'lucide-react';

/**
 * Scholarship Adjustment & Cancellation
 * ------------------------------------
 * Purpose:
 *  1) Adjust scholarship allocation amount (correction) OR
 *  2) Cancel / revoke scholarship (full or partial reversal)
 *
 * Key requirements implemented:
 *  - Clear action selection: Adjust vs Cancel
 *  - If Adjust: enter new adjustment amount (or delta) and justification
 *  - If Cancel: enter reversal amount, cancellation category, official note, reference no
 *  - Always capture: reason category + detailed note (mandatory)
 *  - Impact preview: shows how balances will change
 *  - Student/scholarship snapshot + transaction history
 *
 * Note:
 *  - This is UI-only with mock data. Hook your APIs where indicated.
 */

// ---------- Types ----------
type ActionType = 'adjust' | 'cancel';
type CancelMode = 'partial' | 'full';

type ScholarshipStatus = 'Active' | 'Sanctioned' | 'Cancelled' | 'On Hold';
type DocStatus = 'Verified' | 'Pending' | 'Missing';

interface ScholarshipTxn {
  id: string;
  date: string;
  type: 'Allocation' | 'Adjustment' | 'Reversal' | 'Disbursement';
  feeHead?: string;
  amount: number;
  refNo: string;
  by: string;
  note?: string;
}

interface StudentScholarshipRecord {
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  admissionNo: string;
  appNo: string;
  scheme: string;
  schemeYear: string;
  status: ScholarshipStatus;

  totalSanctioned: number;
  alreadyAdjusted: number;
  remainingSanction: number;

  // optional helpful fields
  category: string;
  rte: boolean;
  ews: boolean;
  guardianName: string;
  mobile: string;

  docs: {
    sanctionOrder: DocStatus;
    incomeCertificate: DocStatus;
    bankDetails: DocStatus;
  };

  photoUrl: string;
  transactions: ScholarshipTxn[];
}

// ---------- Mock "search result" ----------
const MOCK_RECORD: StudentScholarshipRecord = {
  studentId: 'STU-4491',
  studentName: 'Sneha Reddy',
  className: 'Class 11',
  section: 'A',
  admissionNo: 'ADM20240303',
  appNo: 'SCH-2024-055',
  scheme: 'Merit-Based Excellence',
  schemeYear: '2024-2025',
  status: 'Sanctioned',
  totalSanctioned: 20000,
  alreadyAdjusted: 15000,
  remainingSanction: 5000,
  category: 'General',
  rte: false,
  ews: true,
  guardianName: 'Mr. Reddy',
  mobile: '98XXXXXX21',
  docs: {
    sanctionOrder: 'Verified',
    incomeCertificate: 'Verified',
    bankDetails: 'Pending'
  },
  photoUrl: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f43f5e&color=fff',
  transactions: [
  {
    id: 'TXN-001',
    date: '2024-03-12',
    type: 'Allocation',
    feeHead: 'Tuition Fee - Term 1',
    amount: 7500,
    refNo: 'ALLOC-2024-0312-01',
    by: 'Accounts Office',
    note: 'Bulk allocation processed'
  },
  {
    id: 'TXN-002',
    date: '2024-03-14',
    type: 'Allocation',
    feeHead: 'Tuition Fee - Term 1',
    amount: 7500,
    refNo: 'ALLOC-2024-0314-02',
    by: 'Accounts Office',
    note: 'Second allocation processed'
  }]

};

// ---------- Helpers ----------
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const docBadge = (s: DocStatus) => {
  if (s === 'Verified') return <Badge variant="success">Verified</Badge>;
  if (s === 'Pending') return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="error">Missing</Badge>;
};

const statusBadge = (s: ScholarshipStatus) => {
  if (s === 'Sanctioned' || s === 'Active') return <Badge variant="success">{s}</Badge>;
  if (s === 'On Hold') return <Badge variant="warning">On Hold</Badge>;
  return <Badge variant="error">Cancelled</Badge>;
};

export function ScholarshipAdjustmentCancellation() {
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [record, setRecord] = useState<StudentScholarshipRecord | null>(null);

  // Action selection
  const [actionType, setActionType] = useState<ActionType>('adjust');
  const [cancelMode, setCancelMode] = useState<CancelMode>('partial');

  // Common reason fields (mandatory)
  const [reasonCategory, setReasonCategory] = useState<string>('');
  const [officialNote, setOfficialNote] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>(''); // office memo / letter / order ref
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Adjust fields
  const [adjustAmount, setAdjustAmount] = useState<number>(0); // how much to adjust now (additional allocation / correction)
  const [targetFeeHead, setTargetFeeHead] = useState<string>(''); // if adjustment is applied to a fee head

  // Cancel fields (reversal)
  const [reversalAmount, setReversalAmount] = useState<number>(0);

  // Search handler (mock)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter Student Name / Admission No / Application No.');
      return;
    }
    // TODO: Replace with API: fetch scholarship record by query
    setRecord(MOCK_RECORD);

    // reset form
    setActionType('adjust');
    setCancelMode('partial');
    setReasonCategory('');
    setOfficialNote('');
    setReferenceNo('');
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setAdjustAmount(0);
    setTargetFeeHead('');
    setReversalAmount(0);
  };

  // Derived amounts
  const totals = useMemo(() => {
    if (!record) return null;
    const available = Math.max(0, record.totalSanctioned - record.alreadyAdjusted);

    // For cancellation: reversal can’t exceed already adjusted
    const maxReversal = record.alreadyAdjusted;

    // For adjustment: adjust can’t exceed available remaining sanction
    const maxAdjust = available;

    return { available, maxReversal, maxAdjust };
  }, [record]);

  // Auto behaviour on mode change
  const onCancelModeChange = (mode: CancelMode) => {
    setCancelMode(mode);
    if (!record) return;
    if (mode === 'full') {
      // Full cancellation reverses the adjusted amount (benefit already taken)
      setReversalAmount(record.alreadyAdjusted);
    } else {
      setReversalAmount(0);
    }
  };

  // Impact preview
  const impact = useMemo(() => {
    if (!record || !totals) return null;

    if (actionType === 'adjust') {
      const adj = Math.max(0, Math.min(adjustAmount || 0, totals.maxAdjust));
      return {
        title: 'Impact Preview (Adjustment)',
        lines: [
        { label: 'Remaining sanction before', value: formatINR(totals.available) },
        { label: 'Adjusting now (allocation)', value: formatINR(adj) },
        { label: 'Remaining sanction after', value: formatINR(Math.max(0, totals.available - adj)) }],

        warning:
        adj === 0 ?
        'Enter an amount to adjust.' :
        targetFeeHead ?
        undefined :
        'Select a target fee head to apply this adjustment.'
      };
    }

    // cancel
    const rev = Math.max(0, Math.min(reversalAmount || 0, totals.maxReversal));
    return {
      title: 'Impact Preview (Cancellation / Reversal)',
      lines: [
      { label: 'Already adjusted (benefit used)', value: formatINR(record.alreadyAdjusted) },
      { label: 'Reversal amount', value: formatINR(rev) },
      { label: 'Adjusted amount after reversal', value: formatINR(Math.max(0, record.alreadyAdjusted - rev)) }],

      warning:
      rev === 0 ? 'Enter reversal amount (or choose Full Cancellation).' : undefined
    };
  }, [record, totals, actionType, adjustAmount, reversalAmount, targetFeeHead]);

  const canSubmit = useMemo(() => {
    if (!record || !totals) return false;
    if (!reasonCategory || !officialNote.trim()) return false;

    if (actionType === 'adjust') {
      const adj = Math.max(0, Math.min(adjustAmount || 0, totals.maxAdjust));
      if (adj <= 0) return false;
      if (!targetFeeHead) return false;
      return true;
    }

    const rev = Math.max(0, Math.min(reversalAmount || 0, totals.maxReversal));
    if (rev <= 0) return false;
    return true;
  }, [record, totals, reasonCategory, officialNote, actionType, adjustAmount, targetFeeHead, reversalAmount]);

  const handleSubmit = () => {
    if (!record || !totals) return;

    if (!canSubmit) {
      alert('Please complete all mandatory fields.');
      return;
    }

    if (actionType === 'adjust') {
      const adj = Math.max(0, Math.min(adjustAmount || 0, totals.maxAdjust));
      alert(
        `Adjustment recorded (mock).\n\nStudent: ${record.studentName}\nScheme: ${record.scheme}\nFee Head: ${targetFeeHead}\nAdjusting: ${formatINR(
          adj
        )}\nReason: ${reasonCategory}\nEffective: ${effectiveDate}\nRef: ${referenceNo || 'N/A'}`
      );
      // TODO: API call: create scholarship adjustment entry + fee head allocation entry + audit note
    } else {
      const rev = Math.max(0, Math.min(reversalAmount || 0, totals.maxReversal));
      alert(
        `Cancellation/Reversal recorded (mock).\n\nStudent: ${record.studentName}\nScheme: ${record.scheme}\nReversal: ${formatINR(
          rev
        )}\nMode: ${cancelMode === 'full' ? 'Full cancellation' : 'Partial reversal'}\nReason: ${reasonCategory}\nEffective: ${effectiveDate}\nRef: ${referenceNo || 'N/A'}`
      );
      // TODO: API call: create reversal voucher + update scholarship status if full cancellation + audit note
    }

    // Reset selected record (optional); keeping record on screen is often better for user
    // setRecord(null)
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-red-600" />
            Scholarship Adjustment & Cancellation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Record scholarship corrections, reversals, and cancellations with proper reasons and audit notes.
          </p>
        </div>
        <Badge variant="danger" className="px-3 py-1">
          Financial Correction
        </Badge>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search Student / Application</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter Student Name / Admission No / Scholarship Application No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
          </div>

          <Button variant="primary" className="h-[46px]" onClick={handleSearch}>
            Fetch Record
          </Button>
        </div>
      </Card>

      {/* Main */}
      {record ?
      <div className="grid grid-cols-12 gap-6">
          {/* Left: Context */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-5">
                <img
                src={record.photoUrl}
                alt={record.studentName}
                className="w-20 h-20 rounded-xl border border-gray-200" />

                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">{record.studentName}</p>
                  <p className="text-sm text-gray-500">
                    {record.className}-{record.section} • {record.admissionNo}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    {statusBadge(record.status)}
                    <Badge variant="outline">{record.schemeYear}</Badge>
                    <Badge variant="secondary">{record.appNo}</Badge>
                    {record.rte && <Badge variant="info">RTE</Badge>}
                    {record.ews && <Badge variant="warning">EWS</Badge>}
                  </div>
                </div>
              </div>

              {/* Snapshot */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Scholarship Snapshot</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Scheme</span>
                    <span className="font-medium text-gray-900">{record.scheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Sanctioned</span>
                    <span className="font-medium text-gray-900">{formatINR(record.totalSanctioned)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Already Adjusted</span>
                    <span className="font-medium text-blue-700">{formatINR(record.alreadyAdjusted)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                    <span className="text-gray-500">Remaining Balance</span>
                    <span className="font-semibold text-gray-900">{formatINR(record.remainingSanction)}</span>
                  </div>
                </div>
              </div>

              {/* Docs */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <p className="text-xs text-gray-500">Sanction Order</p>
                  <div className="mt-2">{docBadge(record.docs.sanctionOrder)}</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <p className="text-xs text-gray-500">Income Certificate</p>
                  <div className="mt-2">{docBadge(record.docs.incomeCertificate)}</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <p className="text-xs text-gray-500">Bank Details</p>
                  <div className="mt-2">{docBadge(record.docs.bankDetails)}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Record
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </Card>

            {/* Transaction history */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-600" />
                <p className="text-base font-semibold text-gray-800">Previous Transactions</p>
              </div>

              {record.transactions.length === 0 ?
            <div className="text-sm text-gray-500">No transactions found.</div> :

            <div className="space-y-3">
                  {record.transactions.map((t) =>
              <div key={t.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {t.type}
                            {t.feeHead ? ` • ${t.feeHead}` : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {t.date} • Ref: {t.refNo} • By: {t.by}
                          </p>
                          {t.note && <p className="text-xs text-gray-500 mt-1">{t.note}</p>}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{formatINR(t.amount)}</div>
                      </div>
                    </div>
              )}
                </div>
            }
            </Card>
          </div>

          {/* Right: Action form */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <Card className="p-6 border-t-4 border-t-red-500">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    Action Form
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose whether you want to adjust scholarship allocation or cancel/reverse benefits.
                  </p>
                </div>
              </div>

              {/* Action selection */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                label="Action Type *"
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                options={[
                { value: 'adjust', label: 'Adjust Amount (Correction / Re-allocation)' },
                { value: 'cancel', label: 'Cancel / Reverse Scholarship Benefit' }]
                } />


                {actionType === 'cancel' ?
              <Select
                label="Cancellation Mode *"
                value={cancelMode}
                onChange={(e) => onCancelModeChange(e.target.value as CancelMode)}
                options={[
                { value: 'partial', label: 'Partial Reversal' },
                { value: 'full', label: 'Full Cancellation (Revoke & reverse adjusted amount)' }]
                } /> :


              <Select
                label="Target Fee Head *"
                value={targetFeeHead}
                onChange={(e) => setTargetFeeHead(e.target.value)}
                options={[
                { value: '', label: 'Select Fee Head' },
                { value: 'Tuition Fee - Term 1', label: 'Tuition Fee - Term 1' },
                { value: 'Tuition Fee - Term 2', label: 'Tuition Fee - Term 2' },
                { value: 'Annual Activity Fee', label: 'Annual Activity Fee' },
                { value: 'Exam Fee', label: 'Exam Fee' },
                { value: 'Transport Fee', label: 'Transport Fee' }]
                } />

              }
              </div>

              {/* Amount entry */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionType === 'adjust' ?
              <Input
                label={`Adjust Amount Now (₹) * (Max: ${formatINR(totals?.maxAdjust || 0)})`}
                type="number"
                value={adjustAmount ? String(adjustAmount) : ''}
                onChange={(e) => setAdjustAmount(Number((e.target as HTMLInputElement).value || 0))}
                placeholder="0" /> :


              <Input
                label={`Reversal Amount (₹) * (Max: ${formatINR(totals?.maxReversal || 0)})`}
                type="number"
                value={reversalAmount ? String(reversalAmount) : ''}
                onChange={(e) => setReversalAmount(Number((e.target as HTMLInputElement).value || 0))}
                placeholder="0"
                disabled={cancelMode === 'full'} />

              }

                <Input
                label="Effective Date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate((e.target as HTMLInputElement).value)} />

              </div>

              {/* Reason + Reference */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                label="Reason Category *"
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                options={[
                { value: '', label: 'Select reason' },
                { value: 'ERROR_IN_ALLOCATION', label: 'Error in Allocation / Posting' },
                { value: 'ELIGIBILITY_CHANGED', label: 'Eligibility Changed' },
                { value: 'DUPLICATE_BENEFIT', label: 'Duplicate Benefit / Duplicate Entry' },
                { value: 'STUDENT_WITHDRAWN', label: 'Student Withdrawn / Left School' },
                { value: 'DISCIPLINARY', label: 'Disciplinary Action' },
                { value: 'DOCUMENT_ISSUE', label: 'Document Issue / Verification Failure' },
                { value: 'OTHER', label: 'Other' }]
                } />


                <Input
                label="Reference No. (Optional)"
                placeholder="e.g., Office Memo / Letter / Order No."
                value={referenceNo}
                onChange={(e) => setReferenceNo((e.target as HTMLInputElement).value)} />

              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Official Note / Detailed Reason (Mandatory) *
                </label>
                <textarea
                className="mt-1 w-full min-h-[110px] p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                value={officialNote}
                onChange={(e) => setOfficialNote((e.target as HTMLTextAreaElement).value)}
                placeholder="Write an official note for audit (what happened, what is being changed, supporting documents, approvals, etc.)" />

              </div>

              {/* Impact preview */}
              {impact &&
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{impact.title}</p>
                    <Badge variant={actionType === 'cancel' ? 'danger' : 'info'}>
                      {actionType === 'cancel' ? 'Reversal' : 'Adjustment'}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {impact.lines.map((l) =>
                <div key={l.label} className="flex justify-between">
                        <span className="text-gray-500">{l.label}</span>
                        <span className="font-medium text-gray-900">{l.value}</span>
                      </div>
                )}
                  </div>
                  {impact.warning &&
              <div className="mt-3 flex items-start gap-2 text-sm text-amber-700">
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                      <span>{impact.warning}</span>
                    </div>
              }
                </div>
            }

              {/* Submit buttons */}
              <div className="mt-6 flex flex-col md:flex-row gap-3">
                <Button variant="outline" onClick={() => setRecord(null)}>
                  Close Record
                </Button>

                <Button
                variant="primary"
                className={actionType === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                disabled={!canSubmit}
                onClick={handleSubmit}>

                  {actionType === 'cancel' ?
                <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Confirm Cancellation / Reversal
                    </> :

                <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Adjustment
                    </>
                }
                </Button>
              </div>
            </Card>

            {/* Accounting note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Accounting note:</strong> Adjustments typically reduce remaining sanction and allocate to a fee
                head. Cancellations/reversals reduce the scholarship benefit already adjusted and may increase the
                student’s outstanding dues accordingly. All actions should be supported with notes and references.
              </p>
            </div>
          </div>
        </div> :

      <Card className="py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <RotateCcw className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Search a scholarship record to begin</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
            Enter student name, admission number, or scholarship application number to adjust amounts or cancel the scholarship.
          </p>
        </Card>
      }
    </div>);

}