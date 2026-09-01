import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Banknote,
  Landmark,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  FileText,
  BookOpen,
  ClipboardCheck,
  Hash,
  XCircle,
  RefreshCw } from
'lucide-react';

/**
 * Scholarship Disbursement (Single General Ledger)
 * ------------------------------------------------
 * Assumption: Your accounting system has ONE ledger ("General Ledger").
 * This page therefore:
 *  - Records scholarship payouts as a single GL posting batch
 *  - Uses ONE debit account for payout source (Cash/Bank/Scholarship Bank)
 *  - Uses ONE credit account for Scholarship Payable / Scholarship Expense (configurable text fields)
 *  - Generates a GL Posting Preview for clarity
 *
 * Note: In real production, these would map to Chart of Accounts IDs.
 */

// --- Types ---
type PaymentMode = 'Bank Transfer' | 'Cheque' | 'Cash' | 'Adjustment';

type RowStatus = 'Pending' | 'Recorded';

interface DisbursementRow {
  id: string;
  studentName: string;
  grNo: string;
  className: string;
  schemeName: string;
  sanctionedAmount: number;

  // Bank details (readonly)
  bankName: string;
  accountNo: string;
  ifscCode: string;

  // entry fields
  paymentRefNo: string; // UTR / Cheque / Receipt Ref
  status: RowStatus;
}

interface LedgerPreviewLine {
  lineNo: number;
  ledger: 'General Ledger';
  drCr: 'Dr' | 'Cr';
  accountHead: string;
  narration: string;
  amount: number;
}

// --- Mock Data ---
const PENDING_PAYOUTS: DisbursementRow[] = [
{
  id: '1',
  studentName: 'Amit Kumar',
  grNo: 'GR-008',
  className: '10-A',
  schemeName: 'Merit Scholarship',
  sanctionedAmount: 5000,
  bankName: 'SBI',
  accountNo: '30987654321',
  ifscCode: 'SBIN0001234',
  paymentRefNo: '',
  status: 'Pending'
},
{
  id: '2',
  studentName: 'Priya Patel',
  grNo: 'GR-012',
  className: '9-B',
  schemeName: 'EWS Grant',
  sanctionedAmount: 2500,
  bankName: 'HDFC Bank',
  accountNo: '501009876543',
  ifscCode: 'HDFC0000240',
  paymentRefNo: '',
  status: 'Pending'
},
{
  id: '3',
  studentName: 'Rohan Gupta',
  grNo: 'GR-005',
  className: '10-A',
  schemeName: 'Sports Quota',
  sanctionedAmount: 3000,
  bankName: 'ICICI Bank',
  accountNo: '1098273645',
  ifscCode: 'ICIC0001001',
  paymentRefNo: '',
  status: 'Pending'
}];


// --- Helpers ---
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const maskAccountNo = (acc: string) => {
  if (!acc) return '';
  if (acc.length <= 4) return acc;
  return `${'*'.repeat(Math.max(0, acc.length - 4))}${acc.slice(-4)}`;
};

export function ScholarshipDisbursement() {
  // --- State ---
  const [rows, setRows] = useState<DisbursementRow[]>(PENDING_PAYOUTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filters / Controls
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [schemeFilter, setSchemeFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Single ledger (user asked: only one ledger)
  const [ledgerName] = useState<'General Ledger'>('General Ledger');

  // Posting heads: kept as simple text to match "single GL" environments.
  const [debitHead, setDebitHead] = useState<string>('Bank / Cash (Scholarship Payout)');
  const [creditHead, setCreditHead] = useState<string>('Scholarship Payable / Scholarship Expense');

  // Batch reference (optional)
  const [batchRef, setBatchRef] = useState<string>('');

  // --- Filtering ---
  const filteredRows = useMemo(() => {
    return rows.
    filter((r) => schemeFilter === 'all' ? true : r.schemeName === schemeFilter).
    filter((r) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.grNo.toLowerCase().includes(q) ||
        r.className.toLowerCase().includes(q) ||
        r.schemeName.toLowerCase().includes(q) ||
        r.accountNo.toLowerCase().includes(q));

    });
  }, [rows, schemeFilter, search]);

  // --- Selection ---
  const isAllSelected = filteredRows.length > 0 && selectedIds.length === filteredRows.length;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredRows.map((r) => r.id) : []);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // --- Editing payment ref no ---
  const handlePaymentRefChange = (id: string, value: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, paymentRefNo: value } : r));
  };

  // --- Totals ---
  const selectedRows = useMemo(() => rows.filter((r) => selectedIds.includes(r.id)), [rows, selectedIds]);

  const totalPayout = useMemo(
    () => selectedRows.reduce((sum, r) => sum + r.sanctionedAmount, 0),
    [selectedRows]
  );

  // --- Ledger Preview (Single GL) ---
  const ledgerPreview: LedgerPreviewLine[] = useMemo(() => {
    if (selectedRows.length === 0) return [];
    const narrationBase = `Scholarship disbursement via ${paymentMode} on ${paymentDate}${
    batchRef.trim() ? ` (Batch Ref: ${batchRef.trim()})` : ''}`;


    // Minimal accounting preview:
    // Dr: Scholarship Payable / Expense (or vice versa as per your convention)
    // Cr: Bank/Cash
    // Here we use:
    //   Dr = creditHead (Expense/Payable settlement)
    //   Cr = debitHead (Cash/Bank outflow)
    // You can swap labels as per your institution accounting rule.
    return [
    {
      lineNo: 1,
      ledger,
      drCr: 'Dr',
      accountHead: creditHead,
      narration: narrationBase,
      amount: totalPayout
    },
    {
      lineNo: 2,
      ledger,
      drCr: 'Cr',
      accountHead: debitHead,
      narration: narrationBase,
      amount: totalPayout
    }];

  }, [selectedRows, paymentMode, paymentDate, batchRef, creditHead, debitHead, totalPayout, ledgerName]);

  // --- Validation & Record Disbursement ---
  const handleRecordDisbursement = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one beneficiary.');
      return;
    }

    const requireRef = paymentMode === 'Bank Transfer' || paymentMode === 'Cheque' || paymentMode === 'Cash';
    if (requireRef) {
      const missingRef = selectedRows.filter((r) => !r.paymentRefNo.trim());
      if (missingRef.length > 0) {
        alert(
          `Please enter ${paymentMode === 'Cheque' ? 'Cheque Number' : 'Transaction Reference'} for all selected rows.`
        );
        return;
      }
    }

    if (!debitHead.trim() || !creditHead.trim()) {
      alert('Please enter both posting heads (Debit Head and Credit Head).');
      return;
    }

    // Simulate “posting to General Ledger”
    alert(
      `Recorded disbursement:\nLedger: ${ledgerName}\nMode: ${paymentMode}\nDate: ${paymentDate}\nCount: ${
      selectedRows.length}\nTotal: ${
      formatINR(totalPayout)}`
    );

    // Mark recorded & remove from list (or keep with status)
    setRows((prev) =>
    prev.
    map((r) =>
    selectedIds.includes(r.id) ?
    { ...r, status: 'Recorded' as const } :
    r
    ).
    filter((r) => r.status !== 'Recorded')
    );
    setSelectedIds([]);
  };

  // --- Columns ---
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={isAllSelected}
      onChange={(e) => toggleSelectAll(e.target.checked)} />,


    render: (row: DisbursementRow) =>
    <input
      type="checkbox"
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={selectedIds.includes(row.id)}
      onChange={() => toggleSelectRow(row.id)} />


  },
  {
    key: 'beneficiary',
    header: 'Beneficiary',
    render: (row: DisbursementRow) =>
    <div>
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">
            {row.grNo} • {row.className}
          </div>
          <div className="text-xs text-blue-600 mt-1">{row.schemeName}</div>
        </div>

  },
  {
    key: 'bank',
    header: 'Bank Details (Read-only)',
    render: (row: DisbursementRow) =>
    <div className="text-sm">
          <div className="font-medium text-gray-700">{row.bankName}</div>
          <div className="font-mono text-gray-500 text-xs">
            A/C: {maskAccountNo(row.accountNo)}
          </div>
          <div className="font-mono text-gray-400 text-[10px]">IFSC: {row.ifscCode}</div>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: DisbursementRow) =>
    <span className="font-semibold text-gray-900">{formatINR(row.sanctionedAmount)}</span>

  },
  {
    key: 'ref',
    header:
    paymentMode === 'Cheque' ?
    'Cheque No.' :
    paymentMode === 'Bank Transfer' ?
    'UTR / Ref No.' :
    paymentMode === 'Cash' ?
    'Cash Receipt Ref' :
    'Adjustment Ref',
    render: (row: DisbursementRow) =>
    <Input
      className={`h-8 w-44 font-mono text-sm ${
      !selectedIds.includes(row.id) ? 'bg-gray-50 text-gray-400' : 'bg-white'}`
      }
      placeholder={
      paymentMode === 'Cheque' ?
      'e.g., 004521' :
      paymentMode === 'Bank Transfer' ?
      'e.g., UTR123...' :
      'e.g., RCPT-...'
      }
      value={row.paymentRefNo}
      onChange={(e) => handlePaymentRefChange(row.id, (e.target as HTMLInputElement).value)}
      disabled={!selectedIds.includes(row.id) || paymentMode === 'Adjustment'} />


  }];


  // Schemes list for filter
  const schemeOptions = useMemo(() => {
    const unique = Array.from(new Set(rows.map((r) => r.schemeName)));
    return [{ value: 'all', label: 'All Schemes' }, ...unique.map((s) => ({ value: s, label: s }))];
  }, [rows]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-green-600" />
            Scholarship Disbursement (General Ledger)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Record scholarship payouts and post a single batch entry into the General Ledger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Bank List (Excel)
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <ClipboardCheck className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold">Disbursement Batch Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label="Payment Mode"
            options={[
            { value: 'Bank Transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
            { value: 'Cheque', label: 'Cheque' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Adjustment', label: 'Fee Adjustment (No external payout)' }]
            }
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as PaymentMode)} />


          <Input
            type="date"
            label="Payment Date"
            value={paymentDate}
            onChange={(e) => setPaymentDate((e.target as HTMLInputElement).value)} />


          <Select
            label="Scheme"
            options={schemeOptions}
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)} />


          <Input
            label="Batch Reference (Optional)"
            placeholder="e.g., SCH-BATCH-0008"
            value={batchRef}
            onChange={(e) => setBatchRef((e.target as HTMLInputElement).value)} />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Posting Head (Credit)"
            placeholder="Scholarship Payable / Scholarship Expense"
            value={creditHead}
            onChange={(e) => setCreditHead((e.target as HTMLInputElement).value)} />

          <Input
            label="Posting Head (Debit)"
            placeholder="Bank / Cash (Scholarship Payout)"
            value={debitHead}
            onChange={(e) => setDebitHead((e.target as HTMLInputElement).value)} />

        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Single General Ledger Posting</p>
            <p className="mt-1">
              This screen records payout details per beneficiary and creates <span className="font-medium">one</span>{' '}
              posting batch in the <span className="font-medium">General Ledger</span> (total debit equals total credit).
            </p>
          </div>
        </div>
      </Card>

      {/* Beneficiaries list */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Search name / GR / class / scheme / account..."
              className="text-sm outline-none w-full md:w-[420px] bg-transparent"
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />

          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 ?
            <Badge variant="info">{selectedIds.length} selected</Badge> :

            <Badge variant="secondary">{filteredRows.length} pending</Badge>
            }
          </div>
        </div>

        <Table columns={columns as any} data={filteredRows as any} />

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between md:justify-start gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Selected Payout</p>
              <p className="text-xl font-semibold text-gray-900">{formatINR(totalPayout)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Ledger</p>
              <p className="text-sm font-medium text-gray-700">{ledgerName}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setSelectedIds([])} disabled={selectedIds.length === 0}>
              <XCircle className="w-4 h-4 mr-2" />
              Clear Selection
            </Button>
            <Button
              variant="primary"
              onClick={handleRecordDisbursement}
              disabled={selectedIds.length === 0}
              className="bg-green-600 hover:bg-green-700">

              <CheckCircle2 className="w-5 h-5 mr-2" />
              Record & Post to GL
            </Button>
          </div>
        </div>
      </Card>

      {/* GL Posting Preview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-800">General Ledger Posting Preview</h2>
        </div>

        {selectedRows.length === 0 ?
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            Select beneficiaries to see the GL batch preview.
          </div> :

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Line</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ledger</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Dr/Cr</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Account Head</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Narration</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {ledgerPreview.map((l) =>
              <tr key={l.lineNo}>
                    <td className="px-4 py-3 text-sm text-gray-700">{l.lineNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{l.ledger}</td>
                    <td className="px-4 py-3">
                      <Badge variant={l.drCr === 'Dr' ? 'info' : 'warning'}>{l.drCr}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.accountHead}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{l.narration}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatINR(l.amount)}
                    </td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatINR(totalPayout)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        }

        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Important</p>
            <p className="mt-1">
              Bank details are read-only here. To correct beneficiary bank information, update it in{' '}
              <span className="font-medium">Student Master</span>.
            </p>
          </div>
        </div>
      </Card>
    </div>);

}