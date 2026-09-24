import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  ShieldCheck,
  Search,
  XCircle,
  CheckCircle2,
  Info,
  Filter,
  UserCheck,
  MessageSquare,
  AlertCircle,
  FileText,
  Calendar,
  ClipboardCheck,
  Stamp,
  Download,
  Clock,
  CheckCircle,
  Building2,
  Gavel,
  FileSignature,
  Printer,
  Hash,
  FileWarning } from
'lucide-react';

/**
 * Simple, government-style workflow (no black/dark panels):
 * - Clear “Sanction Order Draft” section
 * - Straightforward table + selection summary
 * - Formal Reject / Return modals with mandatory notes
 * - Audit log preview
 */

// ---------- Types ----------
type AppStatus =
'Recommended' |
'Under Scrutiny' |
'Sanctioned' |
'Rejected' |
'Returned for Clarification';

type SchemeType = 'Merit' | 'Means' | 'Sports' | 'Other';

type ScrutinyStatus = 'Pending' | 'Completed';

type DecisionType = 'Reject' | 'Return';

type RejectReasonCode =
'INCOME_EXCEEDS_LIMIT' |
'DOCUMENTS_NOT_SUBMITTED' |
'ELIGIBILITY_NOT_MET' |
'DUPLICATE_BENEFIT' |
'MISREPRESENTATION' |
'OTHER';

interface RecommendedApplication {
  id: string; // APP-xxx
  studentName: string;
  admissionNo: string;
  class: string;
  schemeName: string;
  schemeType: SchemeType;
  recommendedAmount: number;
  sanctionedAmount: number;
  evaluatorRemarks: string;
  scrutinyStatus: ScrutinyStatus;
  status: AppStatus;
  appliedOn: string;
  verifiedOn: string;
  verifiedBy: string;
  ruleRef: {
    orderType: 'GO' | 'Proceedings' | 'Circular';
    referenceNo: string;
    clause: string;
  };
}

interface SanctionDraftMeta {
  officeName: string;
  officeAddress: string;
  fileNo: string;
  sanctionOrderNo: string;
  sanctionOrderDate: string;
  financialYear: string;
  subject: string;
  headOfAccount: string;
  budgetProvision: number;
  budgetUtilized: number;
  sanctioningAuthority: string;
  designation: string;
  noting: string;
}

interface ActionLogEntry {
  at: string;
  by: string;
  action: string;
  details: string;
}

// ---------- Mock Data ----------
const initialApps: RecommendedApplication[] = [
{
  id: 'APP-001',
  studentName: 'Rahul Sharma',
  admissionNo: 'ADM20240091',
  class: '10-A',
  schemeName: 'Merit-Based Excellence',
  schemeType: 'Merit',
  recommendedAmount: 15000,
  sanctionedAmount: 15000,
  evaluatorRemarks: 'High consistent academic performer (95% avg).',
  scrutinyStatus: 'Pending',
  status: 'Recommended',
  appliedOn: '2024-03-02',
  verifiedOn: '2024-03-10',
  verifiedBy: 'Scholarship Cell',
  ruleRef: {
    orderType: 'Circular',
    referenceNo: 'SCH/CIRC/2024/11',
    clause: 'Clause 4.2(a)'
  }
},
{
  id: 'APP-002',
  studentName: 'Ananya Gupta',
  admissionNo: 'ADM20240211',
  class: '8-C',
  schemeName: 'Sports Scholarship',
  schemeType: 'Sports',
  recommendedAmount: 10000,
  sanctionedAmount: 10000,
  evaluatorRemarks: 'National level swimming gold medalist.',
  scrutinyStatus: 'Completed',
  status: 'Under Scrutiny',
  appliedOn: '2024-03-05',
  verifiedOn: '2024-03-11',
  verifiedBy: 'Sports Dept.',
  ruleRef: {
    orderType: 'Proceedings',
    referenceNo: 'SPORT/PROC/2024/07',
    clause: 'Para 3(ii)'
  }
},
{
  id: 'APP-003',
  studentName: 'Vikram Singh',
  admissionNo: 'ADM20240155',
  class: '9-B',
  schemeName: 'Sibling Concession',
  schemeType: 'Other',
  recommendedAmount: 5000,
  sanctionedAmount: 5000,
  evaluatorRemarks: 'Verified sibling in Class 12.',
  scrutinyStatus: 'Completed',
  status: 'Recommended',
  appliedOn: '2024-03-06',
  verifiedOn: '2024-03-12',
  verifiedBy: 'Admin Office',
  ruleRef: {
    orderType: 'Circular',
    referenceNo: 'FEE/CIRC/2024/03',
    clause: 'Clause 2.1'
  }
},
{
  id: 'APP-004',
  studentName: 'Sneha Reddy',
  admissionNo: 'ADM20240303',
  class: '11-A',
  schemeName: 'Financial Aid',
  schemeType: 'Means',
  recommendedAmount: 20000,
  sanctionedAmount: 20000,
  evaluatorRemarks: 'Verified low-income certificate; highly recommended.',
  scrutinyStatus: 'Pending',
  status: 'Under Scrutiny',
  appliedOn: '2024-03-07',
  verifiedOn: '2024-03-13',
  verifiedBy: 'Scholarship Cell',
  ruleRef: {
    orderType: 'GO',
    referenceNo: 'GO(EDU) 14/2024',
    clause: 'Rule 5(b)'
  }
}];


const schemeOptions = [
{ label: 'All Schemes', value: 'all' },
{ label: 'Merit-Based Excellence', value: 'Merit-Based Excellence' },
{ label: 'Sports Scholarship', value: 'Sports Scholarship' },
{ label: 'Sibling Concession', value: 'Sibling Concession' },
{ label: 'Financial Aid', value: 'Financial Aid' }];


const statusOptions = [
{ label: 'All Status', value: 'all' },
{ label: 'Recommended', value: 'Recommended' },
{ label: 'Under Scrutiny', value: 'Under Scrutiny' },
{ label: 'Sanctioned', value: 'Sanctioned' },
{ label: 'Returned for Clarification', value: 'Returned for Clarification' },
{ label: 'Rejected', value: 'Rejected' }];


// ---------- Helpers ----------
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function rejectReasonLabel(code: RejectReasonCode) {
  switch (code) {
    case 'INCOME_EXCEEDS_LIMIT':
      return 'Income exceeds permissible limit';
    case 'DOCUMENTS_NOT_SUBMITTED':
      return 'Mandatory documents not submitted';
    case 'ELIGIBILITY_NOT_MET':
      return 'Eligibility criteria not met';
    case 'DUPLICATE_BENEFIT':
      return 'Duplicate benefit / already availing';
    case 'MISREPRESENTATION':
      return 'Misrepresentation / incorrect information';
    case 'OTHER':
      return 'Other';
  }
}

function getStatusBadge(status: AppStatus) {
  switch (status) {
    case 'Sanctioned':
      return <Badge variant="success">Sanctioned</Badge>;
    case 'Recommended':
      return <Badge variant="info">Recommended</Badge>;
    case 'Under Scrutiny':
      return <Badge variant="warning">Under Scrutiny</Badge>;
    case 'Returned for Clarification':
      return <Badge variant="secondary">Returned</Badge>;
    case 'Rejected':
      return <Badge variant="danger">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getScrutinyBadge(s: ScrutinyStatus) {
  return s === 'Completed' ?
  <span className="inline-flex items-center gap-1 text-green-700 text-xs">
      <CheckCircle className="w-3.5 h-3.5" />
      Scrutiny Completed
    </span> :

  <span className="inline-flex items-center gap-1 text-amber-700 text-xs">
      <Clock className="w-3.5 h-3.5" />
      Scrutiny Pending
    </span>;

}

function SimpleModal({
  open,
  title,
  subtitle,
  icon,
  children,
  onClose,
  footer








}: {open: boolean;title: string;subtitle?: string;icon?: React.ReactNode;children: React.ReactNode;onClose: () => void;footer: React.ReactNode;}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex items-start gap-3">
            {icon}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">{footer}</div>
      </Card>
    </div>);

}

export function ScholarshipApprovalSanction() {
  const [applications, setApplications] = useState<RecommendedApplication[]>(initialApps);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // filters
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  // sanction order draft
  const [draft, setDraft] = useState<SanctionDraftMeta>({
    officeName: 'Office of the Principal',
    officeAddress: 'ABC Public School, Sector 10, City',
    fileNo: 'FILE/SCH/2024/118',
    sanctionOrderNo: 'SO/2024-25/0007',
    sanctionOrderDate: new Date().toISOString().slice(0, 10),
    financialYear: '2024-2025',
    subject: 'Sanction of Scholarship Amount for Eligible Students',
    headOfAccount: '2202-01-102-01 (Scholarship Grants)',
    budgetProvision: 5000000,
    budgetUtilized: 3850000,
    sanctioningAuthority: 'Principal',
    designation: 'Sanctioning Authority',
    noting:
    'The following cases were placed before the Scholarship Sanction Authority. After scrutiny of eligibility and verification of records, sanction is hereby accorded as per rules and references indicated.'
  });

  // decision modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionApp, setActionApp] = useState<RecommendedApplication | null>(null);
  const [decisionType, setDecisionType] = useState<DecisionType>('Reject');
  const [rejectReason, setRejectReason] = useState<RejectReasonCode>('DOCUMENTS_NOT_SUBMITTED');
  const [decisionNote, setDecisionNote] = useState('');
  const [returnDueDate, setReturnDueDate] = useState('');

  // audit log
  const [auditLog, setAuditLog] = useState<ActionLogEntry[]>([
  {
    at: '2024-03-12 11:25',
    by: 'Scholarship Cell',
    action: 'Verification Completed',
    details: 'Income certificate verified; attendance verified.'
  },
  {
    at: '2024-03-13 14:10',
    by: 'Committee-1',
    action: 'Recommended',
    details: 'Recommended for sanction as per criteria.'
  }]
  );

  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      if (schemeFilter !== 'all' && a.schemeName !== schemeFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${a.studentName} ${a.id} ${a.admissionNo} ${a.class} ${a.schemeName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [applications, schemeFilter, statusFilter, query]);

  const selectedApps = useMemo(
    () => applications.filter((a) => selectedIds.includes(a.id)),
    [applications, selectedIds]
  );

  const totalSanctionValue = useMemo(
    () => selectedApps.reduce((sum, a) => sum + a.sanctionedAmount, 0),
    [selectedApps]
  );

  const remainingBudget = useMemo(() => draft.budgetProvision - draft.budgetUtilized, [draft]);
  const utilizedAfter = useMemo(() => draft.budgetUtilized + totalSanctionValue, [draft, totalSanctionValue]);
  const budgetOk = utilizedAfter <= draft.budgetProvision;

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredApps.map((a) => a.id) : []);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSanctionAmountChange = (id: string, value: string) => {
    const amt = Math.max(0, Number(value || 0));
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, sanctionedAmount: amt } : a));
  };

  const openActionModal = (app: RecommendedApplication, type: DecisionType) => {
    setActionApp(app);
    setDecisionType(type);
    setRejectReason('DOCUMENTS_NOT_SUBMITTED');
    setDecisionNote('');
    setReturnDueDate('');
    setActionModalOpen(true);
  };

  const applyDecision = () => {
    if (!actionApp) return;

    if (decisionType === 'Reject') {
      if (!decisionNote.trim()) {
        alert('Rejection note is mandatory.');
        return;
      }
      const reasonText = rejectReasonLabel(rejectReason);
      setApplications((prev) => prev.map((a) => a.id === actionApp.id ? { ...a, status: 'Rejected' } : a));
      setAuditLog((prev) => [
      ...prev,
      {
        at: new Date().toLocaleString('en-IN'),
        by: draft.sanctioningAuthority,
        action: 'Rejected',
        details: `${actionApp.id}: ${reasonText}. Note: ${decisionNote}`
      }]
      );
    } else {
      if (!decisionNote.trim() || !returnDueDate) {
        alert('Return note and due date are mandatory.');
        return;
      }
      setApplications((prev) =>
      prev.map((a) => a.id === actionApp.id ? { ...a, status: 'Returned for Clarification' } : a)
      );
      setAuditLog((prev) => [
      ...prev,
      {
        at: new Date().toLocaleString('en-IN'),
        by: draft.sanctioningAuthority,
        action: 'Returned for Clarification',
        details: `${actionApp.id}: Due by ${returnDueDate}. Note: ${decisionNote}`
      }]
      );
    }

    setActionModalOpen(false);
  };

  const bulkSanction = () => {
    if (selectedIds.length === 0) return alert('Select at least one application to sanction.');
    if (!draft.noting.trim()) return alert('Office noting is mandatory to issue a sanction order.');
    if (!budgetOk) return alert('Insufficient budget provision. Adjust amounts or revise budget.');

    setApplications((prev) => prev.map((a) => selectedIds.includes(a.id) ? { ...a, status: 'Sanctioned' } : a));
    setDraft((prev) => ({ ...prev, budgetUtilized: prev.budgetUtilized + totalSanctionValue }));
    setAuditLog((prev) => [
    ...prev,
    {
      at: new Date().toLocaleString('en-IN'),
      by: draft.sanctioningAuthority,
      action: 'Sanction Order Issued',
      details: `Order ${draft.sanctionOrderNo} dated ${draft.sanctionOrderDate}. Cases: ${selectedIds.join(
        ', '
      )}. Total: ${formatINR(totalSanctionValue)}.`
    }]
    );

    alert(`Sanction Order issued: ${draft.sanctionOrderNo}`);
    setSelectedIds([]);
  };

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 h-4 w-4"
      checked={filteredApps.length > 0 && selectedIds.length === filteredApps.length}
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: RecommendedApplication) =>
    <input
      type="checkbox"
      className="rounded border-gray-300 h-4 w-4"
      checked={selectedIds.includes(row.id)}
      onChange={() => toggleSelect(row.id)}
      disabled={row.status === 'Sanctioned' || row.status === 'Rejected'} />


  },
  {
    key: 'student',
    header: 'Applicant',
    render: (row: RecommendedApplication) =>
    <div>
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">
            {row.class} • {row.admissionNo}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Hash className="w-3 h-3" /> {row.id}
          </div>
        </div>

  },
  {
    key: 'scheme',
    header: 'Scheme & Rule Reference',
    render: (row: RecommendedApplication) =>
    <div className="space-y-1">
          <Badge variant="info">{row.schemeName}</Badge>
          <div className="text-xs text-gray-500">
            {row.ruleRef.orderType}: {row.ruleRef.referenceNo} • {row.ruleRef.clause}
          </div>
          <div className="text-xs text-gray-500">{getScrutinyBadge(row.scrutinyStatus)}</div>
        </div>

  },
  {
    key: 'recommended',
    header: 'Recommended',
    render: (row: RecommendedApplication) =>
    <div className="text-sm text-gray-700">
          <div className="font-medium">{formatINR(row.recommendedAmount)}</div>
          <div className="text-xs text-gray-500">
            Verified: {row.verifiedOn} • {row.verifiedBy}
          </div>
        </div>

  },
  {
    key: 'remarks',
    header: 'Scrutiny Note',
    render: (row: RecommendedApplication) =>
    <div className="flex items-start gap-2 max-w-[260px]">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <span className="text-sm text-gray-600">{row.evaluatorRemarks}</span>
        </div>

  },
  {
    key: 'sanctioned',
    header: 'Sanction Amount',
    render: (row: RecommendedApplication) =>
    <div className="space-y-1">
          <div className="relative w-36">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
            <input
          type="number"
          className="w-full pl-5 pr-2 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          value={row.sanctionedAmount}
          onChange={(e) => handleSanctionAmountChange(row.id, e.target.value)}
          disabled={row.status === 'Sanctioned' || row.status === 'Rejected'} />

          </div>
          <div className="text-xs text-gray-500">≤ {formatINR(row.recommendedAmount)}</div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: RecommendedApplication) => getStatusBadge(row.status)
  },
  {
    key: 'actions',
    header: 'Action',
    render: (row: RecommendedApplication) =>
    <div className="flex flex-wrap gap-2">
          <Button
        variant="outline"
        size="sm"
        onClick={() => openActionModal(row, 'Return')}
        disabled={row.status === 'Sanctioned' || row.status === 'Rejected'}>

            <FileText className="w-4 h-4 mr-2" />
            Return
          </Button>
          <Button
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => openActionModal(row, 'Reject')}
        disabled={row.status === 'Sanctioned' || row.status === 'Rejected'}>

            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Scholarship Sanction Authority
          </h1>
          <p className="text-sm text-gray-500">
            Review recommended cases, record formal notes, and issue sanction orders.
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 max-w-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Note</p>
            <p className="text-xs mt-1">
              Sanction amount must be equal to or less than the recommended amount. Return/Reject requires a written note.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <Select
              label="Scheme"
              options={schemeOptions}
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)} />

          </div>

          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />


          <Input
            label="Search"
            placeholder="Student / App No / Admission No / Class..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)} />


          <Button variant="primary" className="h-[42px]">
            <Filter className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </Card>

      {/* Sanction Order Draft */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-semibold text-gray-800">Sanction Order Draft</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meta */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Office Name"
                value={draft.officeName}
                onChange={(e) =>
                setDraft((p) => ({ ...p, officeName: (e.target as HTMLInputElement).value }))
                } />

              <Input
                label="File No."
                value={draft.fileNo}
                onChange={(e) => setDraft((p) => ({ ...p, fileNo: (e.target as HTMLInputElement).value }))} />

              <Input
                label="Sanction Order No."
                value={draft.sanctionOrderNo}
                onChange={(e) =>
                setDraft((p) => ({ ...p, sanctionOrderNo: (e.target as HTMLInputElement).value }))
                } />

              <Input
                label="Sanction Order Date"
                type="date"
                value={draft.sanctionOrderDate}
                onChange={(e) =>
                setDraft((p) => ({ ...p, sanctionOrderDate: (e.target as HTMLInputElement).value }))
                } />

              <Input
                label="Financial Year"
                value={draft.financialYear}
                onChange={(e) =>
                setDraft((p) => ({ ...p, financialYear: (e.target as HTMLInputElement).value }))
                } />

              <Input
                label="Head of Account"
                value={draft.headOfAccount}
                onChange={(e) =>
                setDraft((p) => ({ ...p, headOfAccount: (e.target as HTMLInputElement).value }))
                } />

            </div>

            <Input
              label="Subject"
              value={draft.subject}
              onChange={(e) => setDraft((p) => ({ ...p, subject: (e.target as HTMLInputElement).value }))} />


            <div>
              <label className="text-sm font-medium text-gray-700">
                Office Noting / Order Note (Mandatory)
              </label>
              <textarea
                className="mt-1 w-full min-h-[120px] p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={draft.noting}
                onChange={(e) => setDraft((p) => ({ ...p, noting: (e.target as HTMLTextAreaElement).value }))}
                placeholder="Record formal note / justification / authority..." />

              <p className="text-xs text-gray-500 mt-2">
                This note is included in the sanction order and stored in audit logs.
              </p>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase">Budget Provision</p>
              <p className="text-lg font-semibold text-gray-900">{formatINR(draft.budgetProvision)}</p>

              <p className="text-xs text-gray-500 uppercase mt-3">Utilized</p>
              <p className="text-lg font-semibold text-gray-900">{formatINR(draft.budgetUtilized)}</p>

              <p className="text-xs text-gray-500 uppercase mt-3">Remaining</p>
              <p className={`text-lg font-semibold ${remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatINR(remainingBudget)}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
              budgetOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`
              }>

              <p className="text-sm font-semibold text-gray-900">Selected Impact</p>
              <div className="mt-2 flex justify-between text-sm text-gray-700">
                <span>Selected Cases</span>
                <span className="font-semibold">{selectedIds.length}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-gray-700">
                <span>Total Sanction</span>
                <span className="font-semibold">{formatINR(totalSanctionValue)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-gray-700">
                <span>Utilized After</span>
                <span className="font-semibold">{formatINR(utilizedAfter)}</span>
              </div>
              {!budgetOk &&
              <div className="mt-2 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>Insufficient budget provision.</span>
                </div>
              }
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">Authority</p>
              <p className="text-sm font-semibold text-gray-900">{draft.sanctioningAuthority}</p>
              <p className="text-xs text-gray-600">{draft.designation}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Application Table */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-white border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Applications ({filteredApps.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && <Badge variant="success">{selectedIds.length} Selected</Badge>}
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
              Clear Selection
            </Button>
            <Button variant="outline" size="sm" disabled={selectedIds.length === 0}>
              <FileSignature className="w-4 h-4 mr-2" />
              Generate Draft Order
            </Button>
            <Button variant="primary" size="sm" disabled={selectedIds.length === 0 || !budgetOk} onClick={bulkSanction}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Issue Sanction Order
            </Button>
          </div>
        </div>

        <Table columns={columns as any} data={filteredApps as any} />

        <div className="p-4 border-t bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Selected Total:</span>{' '}
            {formatINR(totalSanctionValue)}
            <span className="text-gray-400"> • </span>
            <span className="font-medium text-gray-900">Order No:</span> {draft.sanctionOrderNo}
          </div>
          {!budgetOk &&
          <div className="text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Budget is insufficient for the current selection.
            </div>
          }
        </div>
      </Card>

      {/* Reject/Return Modal */}
      <SimpleModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={decisionType === 'Reject' ? 'Reject Application (Speaking Order)' : 'Return for Clarification (Memo)'}
        subtitle={
        actionApp ? `${actionApp.id} • ${actionApp.studentName} • ${actionApp.schemeName}` : undefined
        }
        icon={
        decisionType === 'Reject' ?
        <div className="bg-red-100 p-2 rounded-lg">
              <Gavel className="w-5 h-5 text-red-600" />
            </div> :

        <div className="bg-amber-100 p-2 rounded-lg">
              <FileWarning className="w-5 h-5 text-amber-600" />
            </div>

        }
        footer={
        <>
            <Button variant="outline" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            className={decisionType === 'Reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            onClick={applyDecision}>

              {decisionType === 'Reject' ? 'Issue Rejection Order' : 'Issue Return Memo'}
            </Button>
          </>
        }>

        {decisionType === 'Reject' ?
        <>
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
              Rejection requires a reason code and a written speaking note.
            </div>

            <Select
            label="Reason Code (Mandatory)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value as RejectReasonCode)}
            options={[
            { value: 'INCOME_EXCEEDS_LIMIT', label: rejectReasonLabel('INCOME_EXCEEDS_LIMIT') },
            { value: 'DOCUMENTS_NOT_SUBMITTED', label: rejectReasonLabel('DOCUMENTS_NOT_SUBMITTED') },
            { value: 'ELIGIBILITY_NOT_MET', label: rejectReasonLabel('ELIGIBILITY_NOT_MET') },
            { value: 'DUPLICATE_BENEFIT', label: rejectReasonLabel('DUPLICATE_BENEFIT') },
            { value: 'MISREPRESENTATION', label: rejectReasonLabel('MISREPRESENTATION') },
            { value: 'OTHER', label: rejectReasonLabel('OTHER') }]
            } />


            <div>
              <label className="text-sm font-medium text-gray-700">Speaking Note (Mandatory)</label>
              <textarea
              className="mt-1 w-full min-h-[120px] p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="Write the formal rejection note (facts, reference, rule/clause, reason)..." />

            </div>
          </> :

        <>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
              Return memo is used when documents/clarifications are needed.
            </div>

            <Input
            type="date"
            label="Due Date (Mandatory)"
            value={returnDueDate}
            onChange={(e) => setReturnDueDate((e.target as HTMLInputElement).value)} />


            <div>
              <label className="text-sm font-medium text-gray-700">Return Memo Note (Mandatory)</label>
              <textarea
              className="mt-1 w-full min-h-[120px] p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="List missing documents/clarifications and instructions..." />

            </div>
          </>
        }
      </SimpleModal>

      {/* Audit Trail */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-semibold text-gray-800">Audit Trail (Preview)</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
        <div className="divide-y divide-gray-100 bg-white">
          {auditLog.slice(-6).map((l, idx) =>
          <div key={idx} className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div>
                <p className="text-sm text-gray-900 font-medium">{l.action}</p>
                <p className="text-xs text-gray-500 mt-1">{l.details}</p>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{l.at}</span>
                <span className="text-gray-300">•</span>
                <span>By: {l.by}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t text-xs text-gray-500 flex items-center gap-2">
          <Info className="w-4 h-4" />
          All actions are logged with timestamp and authority identity for audit transparency.
        </div>
      </Card>
    </div>);

}