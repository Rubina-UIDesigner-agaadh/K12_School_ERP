import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  CheckCircle,
  XCircle,
  Search,
  User,
  GraduationCap,
  AlertTriangle,
  Scale,
  ShieldCheck,
  FileText,
  Calendar,
  Timer,
  BadgeCheck,
  BadgeX,
  HeartPulse,
  Trophy,
  Wallet,
  HandCoins,
  BookOpen,
  Home,
  Users,
  ClipboardCheck,
  Info,
  ChevronRight,
  ChevronDown,
  Download } from
'lucide-react';

/**
 * More detailed version with:
 * - Extra eligibility options (RTE/EWS, disability, sibling, single parent, orphan, sports level, attendance backlog, behavior, document status, domicile)
 * - Eligibility score + reason tags
 * - Expandable “Evidence & Documents” section
 * - Decision workflow with Hold reasons + next action date
 */

// --- Types ---
type SchemeType = 'Merit' | 'Means' | 'Sports';
type Recommendation = 'Approved' | 'Rejected' | 'Hold';

type DocStatus = 'Verified' | 'Pending' | 'Missing';
type Conduct = 'Excellent' | 'Good' | 'Average' | 'Poor';
type SportsLevel = 'None' | 'School' | 'District' | 'State' | 'National';

interface ApplicantEligibility {
  // Academic
  marksPercentage: number;
  attendance: number;
  backlogs: number;

  // Means / socio-economic
  annualIncome: number;
  rte: boolean;
  ews: boolean;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
  domicile: 'In-State' | 'Out-of-State';
  singleParent: boolean;
  orphan: boolean;
  siblingInSchool: boolean;
  guardianOccupation: string;

  // Special cases
  disabilityPct: number; // 0 to 100
  sportsLevel: SportsLevel;
  conduct: Conduct;

  // Documents
  docs: {
    incomeCertificate: DocStatus;
    casteCertificate: DocStatus;
    rteCertificate: DocStatus;
    disabilityCertificate: DocStatus;
    sportsCertificate: DocStatus;
    domicileCertificate: DocStatus;
  };
}

interface SchemeCriteria {
  // Academic criteria
  minMarks?: number;
  minAttendance?: number;
  maxBacklogs?: number;

  // Means criteria
  maxIncome?: number;
  requiredCategory?: string;
  requireDomicile?: 'In-State' | 'Out-of-State';

  // Special criteria
  minDisabilityPct?: number;
  minSportsLevel?: SportsLevel;

  // Doc requirements
  requiredDocs?: (keyof ApplicantEligibility['docs'])[];
}

interface Application {
  id: string;
  studentName: string;
  class: string;
  grNo: string;
  schemeName: string;
  schemeType: SchemeType;
  appliedDate: string;
  lastUpdated: string;
  submittedBy: string;

  data: ApplicantEligibility;
  criteria: SchemeCriteria;
}

// --- Mock Data ---
const PENDING_APPLICATIONS: Application[] = [
{
  id: '1',
  studentName: 'Rohan Gupta',
  class: '10-A',
  grNo: 'GR-2024-005',
  schemeName: 'Merit Excellence 2024',
  schemeType: 'Merit',
  appliedDate: '2024-03-10',
  lastUpdated: '2024-03-12',
  submittedBy: 'Parent Portal',
  data: {
    marksPercentage: 88,
    annualIncome: 650000,
    attendance: 92,
    backlogs: 0,
    category: 'General',
    rte: false,
    ews: false,
    domicile: 'In-State',
    singleParent: false,
    orphan: false,
    siblingInSchool: true,
    guardianOccupation: 'Private Service',
    disabilityPct: 0,
    sportsLevel: 'School',
    conduct: 'Good',
    docs: {
      incomeCertificate: 'Pending',
      casteCertificate: 'Missing',
      rteCertificate: 'Missing',
      disabilityCertificate: 'Missing',
      sportsCertificate: 'Verified',
      domicileCertificate: 'Verified'
    }
  },
  criteria: {
    minMarks: 85,
    minAttendance: 85,
    maxBacklogs: 1,
    requiredDocs: ['sportsCertificate', 'domicileCertificate']
  }
},
{
  id: '2',
  studentName: 'Priya Patel',
  class: '9-B',
  grNo: 'GR-2024-012',
  schemeName: 'EWS Support Scheme',
  schemeType: 'Means',
  appliedDate: '2024-03-12',
  lastUpdated: '2024-03-16',
  submittedBy: 'School Office',
  data: {
    marksPercentage: 72,
    annualIncome: 180000,
    attendance: 78,
    backlogs: 1,
    category: 'OBC',
    rte: false,
    ews: true,
    domicile: 'In-State',
    singleParent: false,
    orphan: false,
    siblingInSchool: false,
    guardianOccupation: 'Daily Wage',
    disabilityPct: 0,
    sportsLevel: 'None',
    conduct: 'Good',
    docs: {
      incomeCertificate: 'Verified',
      casteCertificate: 'Verified',
      rteCertificate: 'Missing',
      disabilityCertificate: 'Missing',
      sportsCertificate: 'Missing',
      domicileCertificate: 'Verified'
    }
  },
  criteria: {
    minMarks: 60,
    minAttendance: 75,
    maxIncome: 200000,
    maxBacklogs: 2,
    requireDomicile: 'In-State',
    requiredDocs: ['incomeCertificate', 'domicileCertificate']
  }
},
{
  id: '3',
  studentName: 'Amit Kumar',
  class: '10-A',
  grNo: 'GR-2024-008',
  schemeName: 'Sports Quota Grant',
  schemeType: 'Sports',
  appliedDate: '2024-03-14',
  lastUpdated: '2024-03-14',
  submittedBy: 'Coach',
  data: {
    marksPercentage: 55,
    annualIncome: 400000,
    attendance: 65,
    backlogs: 2,
    category: 'SC',
    rte: false,
    ews: false,
    domicile: 'In-State',
    singleParent: false,
    orphan: false,
    siblingInSchool: false,
    guardianOccupation: 'Farmer',
    disabilityPct: 0,
    sportsLevel: 'District',
    conduct: 'Average',
    docs: {
      incomeCertificate: 'Pending',
      casteCertificate: 'Verified',
      rteCertificate: 'Missing',
      disabilityCertificate: 'Missing',
      sportsCertificate: 'Verified',
      domicileCertificate: 'Verified'
    }
  },
  criteria: {
    minMarks: 50,
    minAttendance: 75,
    maxIncome: 500000,
    maxBacklogs: 3,
    minSportsLevel: 'District',
    requiredDocs: ['sportsCertificate']
  }
},
{
  id: '4',
  studentName: 'Sneha Singh',
  class: '8-C',
  grNo: 'GR-2024-022',
  schemeName: 'EWS Support Scheme',
  schemeType: 'Means',
  appliedDate: '2024-03-15',
  lastUpdated: '2024-03-18',
  submittedBy: 'Parent Portal',
  data: {
    marksPercentage: 82,
    annualIncome: 250000,
    attendance: 90,
    backlogs: 0,
    category: 'General',
    rte: false,
    ews: true,
    domicile: 'Out-of-State',
    singleParent: true,
    orphan: false,
    siblingInSchool: true,
    guardianOccupation: 'Small Business',
    disabilityPct: 0,
    sportsLevel: 'None',
    conduct: 'Good',
    docs: {
      incomeCertificate: 'Verified',
      casteCertificate: 'Missing',
      rteCertificate: 'Missing',
      disabilityCertificate: 'Missing',
      sportsCertificate: 'Missing',
      domicileCertificate: 'Pending'
    }
  },
  criteria: {
    minMarks: 60,
    minAttendance: 75,
    maxIncome: 200000,
    maxBacklogs: 2,
    requireDomicile: 'In-State',
    requiredDocs: ['incomeCertificate', 'domicileCertificate']
  }
},
{
  id: '5',
  studentName: 'Meera Nair',
  class: '7-B',
  grNo: 'GR-2024-031',
  schemeName: 'Inclusive Education Support',
  schemeType: 'Means',
  appliedDate: '2024-03-17',
  lastUpdated: '2024-03-19',
  submittedBy: 'School Office',
  data: {
    marksPercentage: 68,
    annualIncome: 140000,
    attendance: 86,
    backlogs: 0,
    category: 'Minority',
    rte: false,
    ews: false,
    domicile: 'In-State',
    singleParent: false,
    orphan: false,
    siblingInSchool: false,
    guardianOccupation: 'Clerk',
    disabilityPct: 45,
    sportsLevel: 'None',
    conduct: 'Excellent',
    docs: {
      incomeCertificate: 'Verified',
      casteCertificate: 'Missing',
      rteCertificate: 'Missing',
      disabilityCertificate: 'Verified',
      sportsCertificate: 'Missing',
      domicileCertificate: 'Verified'
    }
  },
  criteria: {
    minMarks: 55,
    minAttendance: 80,
    maxIncome: 200000,
    minDisabilityPct: 40,
    requiredDocs: ['incomeCertificate', 'disabilityCertificate']
  }
}];


// --- Helpers ---
function asCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
function docBadge(status: DocStatus) {
  if (status === 'Verified') return <Badge variant="success">Verified</Badge>;
  if (status === 'Pending') return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="error">Missing</Badge>;
}
function sportsRank(level: SportsLevel) {
  const map: Record<SportsLevel, number> = {
    None: 0,
    School: 1,
    District: 2,
    State: 3,
    National: 4
  };
  return map[level];
}

export function ScholarshipEligibilityEvaluation() {
  // --- State ---
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>(PENDING_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // evaluation form
  const [meritScore, setMeritScore] = useState<string>('');
  const [recommendation, setRecommendation] = useState<Recommendation | ''>('');
  const [holdReason, setHoldReason] = useState<string>('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const [showDocs, setShowDocs] = useState(true);
  const [showMoreEligibility, setShowMoreEligibility] = useState(true);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || null;

  useEffect(() => {
    setMeritScore('');
    setRecommendation('');
    setHoldReason('');
    setNextFollowUpDate('');
    setRemarks('');
  }, [selectedAppId]);

  // --- Derived: eligibility evaluation ---
  const evaluation = useMemo(() => {
    if (!selectedApp) return null;
    const { data, criteria } = selectedApp;

    const checks: {
      label: string;
      actual: string;
      required: string;
      pass: boolean;
      severity: 'critical' | 'normal';
    }[] = [];

    // academic
    if (criteria.minMarks != null) {
      checks.push({
        label: 'Academic Performance',
        actual: `${data.marksPercentage}%`,
        required: `≥ ${criteria.minMarks}%`,
        pass: data.marksPercentage >= criteria.minMarks,
        severity: 'critical'
      });
    }
    if (criteria.minAttendance != null) {
      checks.push({
        label: 'Attendance',
        actual: `${data.attendance}%`,
        required: `≥ ${criteria.minAttendance}%`,
        pass: data.attendance >= criteria.minAttendance,
        severity: 'critical'
      });
    }
    if (criteria.maxBacklogs != null) {
      checks.push({
        label: 'Backlogs',
        actual: `${data.backlogs}`,
        required: `≤ ${criteria.maxBacklogs}`,
        pass: data.backlogs <= criteria.maxBacklogs,
        severity: 'normal'
      });
    }

    // means
    if (criteria.maxIncome != null) {
      checks.push({
        label: 'Annual Family Income',
        actual: asCurrency(data.annualIncome),
        required: `≤ ${asCurrency(criteria.maxIncome)}`,
        pass: data.annualIncome <= criteria.maxIncome,
        severity: 'critical'
      });
    }
    if (criteria.requiredCategory) {
      checks.push({
        label: 'Category',
        actual: data.category,
        required: `= ${criteria.requiredCategory}`,
        pass: data.category === criteria.requiredCategory,
        severity: 'normal'
      });
    }
    if (criteria.requireDomicile) {
      checks.push({
        label: 'Domicile',
        actual: data.domicile,
        required: `= ${criteria.requireDomicile}`,
        pass: data.domicile === criteria.requireDomicile,
        severity: 'normal'
      });
    }

    // disability
    if (criteria.minDisabilityPct != null) {
      checks.push({
        label: 'Disability %',
        actual: `${data.disabilityPct}%`,
        required: `≥ ${criteria.minDisabilityPct}%`,
        pass: data.disabilityPct >= criteria.minDisabilityPct,
        severity: 'normal'
      });
    }

    // sports
    if (criteria.minSportsLevel) {
      checks.push({
        label: 'Sports Level',
        actual: data.sportsLevel,
        required: `≥ ${criteria.minSportsLevel}`,
        pass: sportsRank(data.sportsLevel) >= sportsRank(criteria.minSportsLevel),
        severity: 'normal'
      });
    }

    // documents
    const requiredDocs = criteria.requiredDocs || [];
    const missingDocs = requiredDocs.filter((k) => data.docs[k] !== 'Verified');
    checks.push({
      label: 'Required Documents',
      actual: missingDocs.length === 0 ? 'All verified' : `${missingDocs.length} not verified`,
      required: 'All verified',
      pass: missingDocs.length === 0,
      severity: 'critical'
    });

    // simple conduct policy (optional, configurable)
    const conductPass = data.conduct !== 'Poor';
    checks.push({
      label: 'Conduct',
      actual: data.conduct,
      required: 'Not Poor',
      pass: conductPass,
      severity: 'normal'
    });

    const passCritical = checks.filter((c) => c.severity === 'critical').every((c) => c.pass);
    const passAll = checks.every((c) => c.pass);

    // score (illustrative)
    const score =
    25 +
    data.marksPercentage / 100 * 35 +
    data.attendance / 100 * 20 + (
    criteria.maxIncome ? Math.max(0, 20 - data.annualIncome / criteria.maxIncome * 20) : 10);

    const reasons: string[] = [];
    if (data.rte) reasons.push('RTE');
    if (data.ews) reasons.push('EWS');
    if (data.singleParent) reasons.push('Single Parent');
    if (data.orphan) reasons.push('Orphan');
    if (data.siblingInSchool) reasons.push('Sibling in School');
    if (data.disabilityPct >= 40) reasons.push('PwD ≥ 40%');
    if (sportsRank(data.sportsLevel) >= sportsRank('District')) reasons.push('Sports (District+)');

    return {
      checks,
      passCritical,
      passAll,
      missingDocs,
      score: Math.round(score),
      reasonTags: reasons
    };
  }, [selectedApp]);

  const handleEvaluate = () => {
    if (!selectedApp) return;
    if (!recommendation) {
      alert('Please select a recommendation status.');
      return;
    }
    if (recommendation === 'Hold' && !holdReason) {
      alert('Please select a hold reason.');
      return;
    }

    alert(`Application for ${selectedApp.studentName} marked as: ${recommendation}`);
    setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
    setSelectedAppId(null);
  };

  // --- UI helpers ---
  const statusPill = (pass: boolean) =>
  pass ?
  <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3" /> Pass
      </div> :

  <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
        <XCircle className="w-3 h-3" /> Fail
      </div>;


  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col p-6 bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            Eligibility & Evaluation
          </h1>
          <p className="text-sm text-gray-500">
            Vet scholarship applications against scheme rules and record decisions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Pending List
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* LEFT: Application List */}
        <div className="lg:col-span-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search student / GR No / scheme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wide">
              Pending Applications ({applications.length})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {applications.length === 0 ?
            <div className="text-center py-10 text-gray-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No pending applications.</p>
              </div> :

            applications.
            filter((app) => {
              const q = searchQuery.toLowerCase().trim();
              if (!q) return true;
              return (
                app.studentName.toLowerCase().includes(q) ||
                app.grNo.toLowerCase().includes(q) ||
                app.schemeName.toLowerCase().includes(q) ||
                app.class.toLowerCase().includes(q));

            }).
            map((app) =>
            <div
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
              selectedAppId === app.id ?
              'bg-blue-50 border-blue-300 ring-1 ring-blue-300' :
              'bg-white border-gray-200 hover:border-blue-200'}`
              }>

                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-gray-900">{app.studentName}</h4>
                      <Badge variant="secondary" className="text-[10px]">
                        {app.class}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-blue-600 font-medium">{app.schemeName}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {app.schemeType}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {app.data.rte && <Badge variant="info">RTE</Badge>}
                      {app.data.ews && <Badge variant="warning">EWS</Badge>}
                      {app.data.disabilityPct >= 40 && <Badge variant="success">PwD</Badge>}
                      {sportsRank(app.data.sportsLevel) >= sportsRank('District') &&
                <Badge variant="secondary">Sports</Badge>
                }
                      {app.data.singleParent && <Badge variant="outline">Single Parent</Badge>}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <span>{app.grNo}</span>
                      <span>{app.appliedDate}</span>
                    </div>
                  </div>
            )
            }
          </div>
        </div>

        {/* RIGHT: Evaluation */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedApp && evaluation ?
          <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
              {/* Top summary strip */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedApp.studentName}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedApp.schemeName} ({selectedApp.schemeType}) • {selectedApp.class} • {selectedApp.grNo}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">Applied: {selectedApp.appliedDate}</Badge>
                  <Badge variant="secondary">Updated: {selectedApp.lastUpdated}</Badge>
                  <Badge variant="secondary">Source: {selectedApp.submittedBy}</Badge>
                  {evaluation.passCritical ?
                <Badge variant="success">Eligible (Critical)</Badge> :

                <Badge variant="error">Not Eligible (Critical)</Badge>
                }
                </div>
              </div>

              {/* Eligibility Check */}
              <Card title="Eligibility Check" className="border-t-4 border-t-blue-500">
                {/* Reason tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {evaluation.reasonTags.length > 0 ?
                evaluation.reasonTags.map((t) =>
                <Badge key={t} variant="info">
                        {t}
                      </Badge>
                ) :

                <span className="text-sm text-gray-400">No special eligibility tags</span>
                }
                </div>

                {/* Score bar */}
                <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-gray-700">Eligibility Score (indicative)</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{evaluation.score}/100</p>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, evaluation.score)}%` }} />

                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This score is a supporting indicator. Final decision should follow policy and criteria results.
                  </p>
                </div>

                {/* Comparison table */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 bg-gray-100 px-2 py-2 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                    <div className="col-span-5">Criteria</div>
                    <div className="col-span-3">Actual</div>
                    <div className="col-span-2">Required</div>
                    <div className="col-span-2 text-right">Result</div>
                  </div>

                  <div className="p-2 bg-white">
                    {evaluation.checks.map((c) =>
                  <div
                    key={c.label}
                    className="grid grid-cols-12 gap-4 py-3 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50 transition-colors px-2 rounded">

                        <div className="col-span-5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-700">{c.label}</p>
                            {c.severity === 'critical' &&
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                                Critical
                              </span>
                        }
                          </div>
                        </div>

                        <div className="col-span-3 text-sm font-semibold text-gray-900">{c.actual}</div>
                        <div className="col-span-2 text-xs text-gray-500 font-mono bg-gray-100 p-1 rounded w-fit">
                          {c.required}
                        </div>

                        <div className="col-span-2 flex justify-end">{statusPill(c.pass)}</div>
                      </div>
                  )}
                  </div>
                </div>

                {/* Expandable sections */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-4 h-4 text-gray-600" />
                      <p className="text-sm font-medium text-gray-700">Means Details</p>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Income</span>
                        <span className="font-medium">{asCurrency(selectedApp.data.annualIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guardian Occupation</span>
                        <span className="font-medium">{selectedApp.data.guardianOccupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Domicile</span>
                        <span className="font-medium">{selectedApp.data.domicile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium">{selectedApp.data.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-gray-600" />
                      <p className="text-sm font-medium text-gray-700">Special Eligibility</p>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sports Level</span>
                        <span className="font-medium">{selectedApp.data.sportsLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Disability</span>
                        <span className="font-medium">{selectedApp.data.disabilityPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Single Parent</span>
                        <span className="font-medium">{selectedApp.data.singleParent ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sibling in School</span>
                        <span className="font-medium">{selectedApp.data.siblingInSchool ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  onClick={() => setShowDocs((s) => !s)}>

                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">Evidence & Documents</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDocs ? 'rotate-180' : ''}`} />
                  </button>

                  {showDocs &&
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(
                  Object.entries(selectedApp.data.docs) as [keyof ApplicantEligibility['docs'], DocStatus][]).
                  map(([k, v]) =>
                  <div key={k} className="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedApp.criteria.requiredDocs?.includes(k) ? 'Required by scheme' : 'Optional'}
                            </p>
                          </div>
                          {docBadge(v)}
                        </div>
                  )}
                    </div>
                }
                </div>
              </Card>

              {/* Decision */}
              <Card title="Evaluation & Decision">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {selectedApp.schemeType === 'Merit' &&
                  <Input
                    label="Merit Score (Optional)"
                    placeholder="0-100"
                    type="number"
                    value={meritScore}
                    onChange={(e) => setMeritScore(e.target.value)} />

                  }

                    <Select
                    label="Recommendation"
                    required
                    options={[
                    { value: 'Approved', label: 'Recommend for Approval' },
                    { value: 'Rejected', label: 'Recommend Rejection' },
                    { value: 'Hold', label: 'Put on Hold (Need Docs/Clarification)' }]
                    }
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value as Recommendation)} />


                    {recommendation === 'Hold' &&
                  <>
                        <Select
                      label="Hold Reason"
                      options={[
                      { value: 'missing_docs', label: 'Missing Documents' },
                      { value: 'income_verification', label: 'Income Verification Required' },
                      { value: 'sports_verification', label: 'Sports Certificate Verification' },
                      { value: 'committee_review', label: 'Committee Review Pending' },
                      { value: 'clarification', label: 'Need Clarification from Applicant' }]
                      }
                      value={holdReason}
                      onChange={(e) => setHoldReason(e.target.value)} />

                        <Input
                      type="date"
                      label="Next Follow-up Date"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)} />

                      </>
                  }
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Remarks / Notes</label>
                    <textarea
                    className="w-full h-28 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter justification, missing document details, or decision notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)} />

                    {!evaluation.passCritical &&
                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <p>
                          One or more <span className="font-semibold">critical</span> criteria failed. Approval may violate policy unless overridden by authorized committee.
                        </p>
                      </div>
                  }
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setRecommendation('')}>
                    Reset
                  </Button>
                  <Button
                  variant="primary"
                  onClick={handleEvaluate}
                  className={
                  recommendation === 'Rejected' ?
                  'bg-red-600 hover:bg-red-700' :
                  recommendation === 'Approved' ?
                  'bg-green-600 hover:bg-green-700' :
                  ''
                  }>

                    {recommendation === 'Rejected' ?
                  'Reject Application' :
                  recommendation === 'Approved' ?
                  'Approve Application' :
                  'Submit Evaluation'}
                  </Button>
                </div>
              </Card>
            </div> :

          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 m-1">
              <GraduationCap className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-gray-500">Select an Application</h3>
              <p className="text-sm max-w-xs text-center mt-1">
                Choose an application from the left panel to view criteria comparison, documents, and evaluation controls.
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}