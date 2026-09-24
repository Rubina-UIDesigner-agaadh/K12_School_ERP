import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FilterX,
  Calendar,
  RefreshCw,
  SlidersHorizontal } from
'lucide-react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'secondary' | 'outline' | 'error';

type ApplicationStatus = 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold';
type ApplicantType = 'Student';
type ScholarshipType = 'Merit' | 'Need-based' | 'Sports' | 'Government' | 'Other';
type EligibilityTag = 'RTE' | 'EWS' | 'None';

interface ScholarshipApplication {
  id: string;
  appNo: string;
  name: string;
  admissionNo: string;
  applicantType: ApplicantType;
  className: string;
  section: string;
  scheme: string;
  scholarshipType: ScholarshipType;
  requestedAmount: number;
  appliedOn: string; // yyyy-mm-dd
  status: ApplicationStatus;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
  rteEligible: boolean;
  ewsEligible: boolean;
  familyIncome: number;
  verificationStatus: 'Not Started' | 'Docs Pending' | 'Verified';
  reviewer: string;
  lastUpdatedOn: string;
}

const mockApplications: ScholarshipApplication[] = [
{
  id: '1',
  appNo: 'APP-001',
  name: 'Aarav Sharma',
  admissionNo: 'ADM20240012',
  applicantType: 'Student',
  className: 'Class 10',
  section: 'A',
  scheme: 'Merit Scholarship',
  scholarshipType: 'Merit',
  requestedAmount: 25000,
  appliedOn: '2024-03-15',
  status: 'Pending Review',
  category: 'General',
  rteEligible: false,
  ewsEligible: false,
  familyIncome: 420000,
  verificationStatus: 'Docs Pending',
  reviewer: '-',
  lastUpdatedOn: '2024-03-15'
},
{
  id: '2',
  appNo: 'APP-002',
  name: 'Priya Patel',
  admissionNo: 'ADM20240198',
  applicantType: 'Student',
  className: 'Class 9',
  section: 'B',
  scheme: 'Need-based Aid',
  scholarshipType: 'Need-based',
  requestedAmount: 15000,
  appliedOn: '2024-03-14',
  status: 'Under Review',
  category: 'OBC',
  rteEligible: false,
  ewsEligible: true,
  familyIncome: 180000,
  verificationStatus: 'Verified',
  reviewer: 'Committee-1',
  lastUpdatedOn: '2024-03-16'
},
{
  id: '3',
  appNo: 'APP-003',
  name: 'Rohan Kumar',
  admissionNo: 'ADM20240077',
  applicantType: 'Student',
  className: 'Class 11',
  section: 'A',
  scheme: 'Sports Scholarship',
  scholarshipType: 'Sports',
  requestedAmount: 20000,
  appliedOn: '2024-03-13',
  status: 'Approved',
  category: 'General',
  rteEligible: false,
  ewsEligible: false,
  familyIncome: 520000,
  verificationStatus: 'Verified',
  reviewer: 'Committee-2',
  lastUpdatedOn: '2024-03-18'
},
{
  id: '4',
  appNo: 'APP-004',
  name: 'Ananya Singh',
  admissionNo: 'ADM20240221',
  applicantType: 'Student',
  className: 'Class 8',
  section: 'A',
  scheme: 'Government Scheme',
  scholarshipType: 'Government',
  requestedAmount: 12000,
  appliedOn: '2024-03-12',
  status: 'Rejected',
  category: 'EWS',
  rteEligible: true,
  ewsEligible: true,
  familyIncome: 90000,
  verificationStatus: 'Verified',
  reviewer: 'Committee-1',
  lastUpdatedOn: '2024-03-17'
}];


function getStatusVariant(status: ApplicationStatus): BadgeVariant {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Pending Review':
      return 'warning';
    case 'Under Review':
      return 'info';
    case 'Rejected':
      return 'danger';
    case 'On Hold':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function ScholarshipApplicationList() {
  // Filters
  const [query, setQuery] = useState('');
  const [scheme, setScheme] = useState('all');
  const [status, setStatus] = useState('all');
  const [scholarshipType, setScholarshipType] = useState('all');
  const [className, setClassName] = useState('all');
  const [section, setSection] = useState('all');
  const [category, setCategory] = useState('all');
  const [eligibility, setEligibility] = useState<'all' | 'rte' | 'ews' | 'rte_ews' | 'none'>('all');
  const [verificationStatus, setVerificationStatus] = useState('all');
  const [reviewer, setReviewer] = useState('all');
  const [incomeBand, setIncomeBand] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedRow, setSelectedRow] = useState<ScholarshipApplication | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const applications = mockApplications;

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      // Search query (name/appNo/admissionNo)
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${a.name} ${a.appNo} ${a.admissionNo}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (scheme !== 'all' && a.scheme !== scheme) return false;
      if (status !== 'all' && a.status !== status) return false;
      if (scholarshipType !== 'all' && a.scholarshipType !== scholarshipType) return false;
      if (className !== 'all' && a.className !== className) return false;
      if (section !== 'all' && a.section !== section) return false;
      if (category !== 'all' && a.category !== category) return false;
      if (verificationStatus !== 'all' && a.verificationStatus !== verificationStatus) return false;
      if (reviewer !== 'all' && a.reviewer !== reviewer) return false;

      // Eligibility filter: RTE/EWS
      if (eligibility === 'rte' && !a.rteEligible) return false;
      if (eligibility === 'ews' && !a.ewsEligible) return false;
      if (eligibility === 'rte_ews' && !(a.rteEligible && a.ewsEligible)) return false;
      if (eligibility === 'none' && (a.rteEligible || a.ewsEligible)) return false;

      // Income band filter
      if (incomeBand !== 'all') {
        const inc = a.familyIncome;
        if (incomeBand === '<1L' && !(inc < 100000)) return false;
        if (incomeBand === '1-2L' && !(inc >= 100000 && inc < 200000)) return false;
        if (incomeBand === '2-5L' && !(inc >= 200000 && inc < 500000)) return false;
        if (incomeBand === '5L+' && !(inc >= 500000)) return false;
      }

      // Date range filter
      if (fromDate && a.appliedOn < fromDate) return false;
      if (toDate && a.appliedOn > toDate) return false;

      return true;
    });
  }, [
  applications,
  query,
  scheme,
  status,
  scholarshipType,
  className,
  section,
  category,
  eligibility,
  verificationStatus,
  reviewer,
  incomeBand,
  fromDate,
  toDate]
  );

  const summary = useMemo(() => {
    const all = applications;
    const countBy = (s: ApplicationStatus) => all.filter((a) => a.status === s).length;
    return {
      pendingReview: countBy('Pending Review'),
      underReview: countBy('Under Review'),
      approved: countBy('Approved'),
      rejected: countBy('Rejected'),
      onHold: countBy('On Hold'),
      rte: all.filter((a) => a.rteEligible).length,
      ews: all.filter((a) => a.ewsEligible).length,
      totalRequested: all.reduce((sum, a) => sum + a.requestedAmount, 0)
    };
  }, [applications]);

  const columns = [
  {
    key: 'appNo',
    header: 'App No',
    render: (row: ScholarshipApplication) =>
    <div>
          <span className="font-mono text-sm text-gray-800">{row.appNo}</span>
          <div className="text-xs text-gray-500">{row.admissionNo}</div>
        </div>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: ScholarshipApplication) =>
    <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-sm text-gray-500">
            {row.className}-{row.section} • {row.category}
          </p>
        </div>

  },
  {
    key: 'scheme',
    header: 'Scheme',
    render: (row: ScholarshipApplication) =>
    <div className="space-y-1">
          <Badge variant="outline">{row.scheme}</Badge>
          <div className="text-xs text-gray-500">{row.scholarshipType}</div>
        </div>

  },
  {
    key: 'eligibility',
    header: 'Eligibility',
    render: (row: ScholarshipApplication) =>
    <div className="flex flex-wrap gap-2">
          {row.rteEligible && <Badge variant="info">RTE</Badge>}
          {row.ewsEligible && <Badge variant="warning">EWS</Badge>}
          {!row.rteEligible && !row.ewsEligible &&
      <span className="text-xs text-gray-400">—</span>
      }
        </div>

  },
  {
    key: 'amount',
    header: 'Requested',
    render: (row: ScholarshipApplication) =>
    <span className="font-semibold text-gray-900">{formatINR(row.requestedAmount)}</span>

  },
  {
    key: 'appliedOn',
    header: 'Applied On',
    render: (row: ScholarshipApplication) =>
    <span className="text-sm text-gray-600">{row.appliedOn}</span>

  },
  {
    key: 'verification',
    header: 'Verification',
    render: (row: ScholarshipApplication) =>
    <Badge
      variant={
      row.verificationStatus === 'Verified' ?
      'success' :
      row.verificationStatus === 'Docs Pending' ?
      'warning' :
      'secondary'
      }>

          {row.verificationStatus}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ScholarshipApplication) =>
    <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ScholarshipApplication) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="sm"
        title="View"
        onClick={() => {
          setSelectedRow(row);
          setDetailOpen(true);
        }}>

            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'Pending Review' &&
      <>
              <Button variant="ghost" size="sm" title="Approve" className="text-green-600">
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Reject" className="text-red-600">
                <XCircle className="w-4 h-4" />
              </Button>
            </>
      }
        </div>

  }];


  const resetFilters = () => {
    setQuery('');
    setScheme('all');
    setStatus('all');
    setScholarshipType('all');
    setClassName('all');
    setSection('all');
    setCategory('all');
    setEligibility('all');
    setVerificationStatus('all');
    setReviewer('all');
    setIncomeBand('all');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarship Application List</h1>
          <p className="text-gray-500 mt-1">Search, review, and process scholarship applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            <FilterX className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-600">{summary.pendingReview}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-600">{summary.underReview}</p>
          <p className="text-sm text-gray-500">Under Review</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-600">{summary.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-cyan-500">
          <p className="text-2xl font-bold text-cyan-600">{summary.rte}</p>
          <p className="text-sm text-gray-500">RTE</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-600">{summary.ews}</p>
          <p className="text-sm text-gray-500">EWS</p>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Search Filters</span>
          </div>
          <div className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> results
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <Input
            placeholder="Search name / app no / admission no..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)} />


          {/* Scheme */}
          <Select
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
            options={[
            { value: 'all', label: 'All Schemes' },
            { value: 'Merit Scholarship', label: 'Merit Scholarship' },
            { value: 'Need-based Aid', label: 'Need-based Aid' },
            { value: 'Sports Scholarship', label: 'Sports Scholarship' },
            { value: 'Government Scheme', label: 'Government Scheme' }]
            } />


          {/* Scholarship Type */}
          <Select
            value={scholarshipType}
            onChange={(e) => setScholarshipType(e.target.value)}
            options={[
            { value: 'all', label: 'All Types' },
            { value: 'Merit', label: 'Merit' },
            { value: 'Need-based', label: 'Need-based' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Government', label: 'Government' },
            { value: 'Other', label: 'Other' }]
            } />


          {/* Status */}
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Pending Review', label: 'Pending Review' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'On Hold', label: 'On Hold' }]
            } />


          {/* Eligibility: RTE/EWS */}
          <Select
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value as any)}
            options={[
            { value: 'all', label: 'All Eligibility' },
            { value: 'rte', label: 'RTE Only' },
            { value: 'ews', label: 'EWS Only' },
            { value: 'rte_ews', label: 'RTE + EWS' },
            { value: 'none', label: 'Neither RTE nor EWS' }]
            } />


          {/* Category */}
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
            { value: 'all', label: 'All Categories' },
            { value: 'General', label: 'General' },
            { value: 'OBC', label: 'OBC' },
            { value: 'SC', label: 'SC' },
            { value: 'ST', label: 'ST' },
            { value: 'EWS', label: 'EWS' },
            { value: 'Minority', label: 'Minority' }]
            } />


          {/* Class */}
          <Select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            options={[
            { value: 'all', label: 'All Classes' },
            { value: 'Class 8', label: 'Class 8' },
            { value: 'Class 9', label: 'Class 9' },
            { value: 'Class 10', label: 'Class 10' },
            { value: 'Class 11', label: 'Class 11' }]
            } />


          {/* Section */}
          <Select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            options={[
            { value: 'all', label: 'All Sections' },
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'C', label: 'C' }]
            } />


          {/* Verification Status */}
          <Select
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Verification' },
            { value: 'Not Started', label: 'Not Started' },
            { value: 'Docs Pending', label: 'Docs Pending' },
            { value: 'Verified', label: 'Verified' }]
            } />


          {/* Reviewer */}
          <Select
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            options={[
            { value: 'all', label: 'All Reviewers' },
            { value: '-', label: 'Unassigned' },
            { value: 'Committee-1', label: 'Committee-1' },
            { value: 'Committee-2', label: 'Committee-2' }]
            } />


          {/* Income Band */}
          <Select
            value={incomeBand}
            onChange={(e) => setIncomeBand(e.target.value)}
            options={[
            { value: 'all', label: 'All Income Bands' },
            { value: '<1L', label: '< ₹1,00,000' },
            { value: '1-2L', label: '₹1,00,000 - ₹2,00,000' },
            { value: '2-5L', label: '₹2,00,000 - ₹5,00,000' },
            { value: '5L+', label: '₹5,00,000+' }]
            } />


          {/* From Date */}
          <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate((e.target as HTMLInputElement).value)} />


          {/* To Date */}
          <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate((e.target as HTMLInputElement).value)} />


          {/* Filter Button */}
          <Button variant="outline" className="md:col-span-2">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Application List */}
      <Card noPadding>
        <Table columns={columns as any} data={filtered as any} />
      </Card>

      {/* Detail Modal */}
      {detailOpen && selectedRow &&
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Application Details</p>
                <p className="text-sm text-gray-500">{selectedRow.appNo} • {selectedRow.admissionNo}</p>
              </div>
              <button
              onClick={() => setDetailOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full">

                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="font-medium text-gray-900">{selectedRow.name}</p>
                  <p className="text-sm text-gray-500">{selectedRow.className}-{selectedRow.section}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scheme</p>
                  <p className="font-medium text-gray-900">{selectedRow.scheme}</p>
                  <p className="text-sm text-gray-500">{selectedRow.scholarshipType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Requested Amount</p>
                  <p className="font-semibold text-gray-900">{formatINR(selectedRow.requestedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge variant={getStatusVariant(selectedRow.status)}>{selectedRow.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Eligibility</p>
                  <div className="flex gap-2 mt-1">
                    {selectedRow.rteEligible && <Badge variant="info">RTE</Badge>}
                    {selectedRow.ewsEligible && <Badge variant="warning">EWS</Badge>}
                    {!selectedRow.rteEligible && !selectedRow.ewsEligible &&
                  <span className="text-sm text-gray-500">None</span>
                  }
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Family Income</p>
                  <p className="text-sm text-gray-700">{formatINR(selectedRow.familyIncome)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Verification</p>
                  <Badge
                  variant={
                  selectedRow.verificationStatus === 'Verified' ?
                  'success' :
                  selectedRow.verificationStatus === 'Docs Pending' ?
                  'warning' :
                  'secondary'
                  }>

                    {selectedRow.verificationStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reviewer</p>
                  <p className="text-sm text-gray-700">{selectedRow.reviewer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied On</p>
                  <p className="text-sm text-gray-700">{selectedRow.appliedOn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-700">{selectedRow.lastUpdatedOn}</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
              {selectedRow.status === 'Pending Review' &&
            <>
                  <Button variant="outline" className="text-red-600">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="primary">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
            }
            </div>
          </div>
        </div>
      }
    </div>);

}