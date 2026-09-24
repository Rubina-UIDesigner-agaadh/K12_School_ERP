import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Filter,
  XCircle,
  Clock,
  Download,
  FileText,
  Calendar,
  User,
  History,
  AlertCircle,
  ClipboardList } from
'lucide-react';
export function PendingRejectedApplicationsReport() {
  // Mock Data for Audit Trail
  const [reportData] = useState([
  {
    id: '1',
    applicantName: 'Amit Kumar',
    class: '9-C',
    scheme: 'Sports Scholarship',
    appDate: '2024-02-15',
    status: 'Rejected',
    remark: 'Missing State-level participation certificates.',
    rejectedBy: 'Dr. Ramesh (Principal)'
  },
  {
    id: '2',
    applicantName: 'Sneha Rao',
    class: '10-A',
    scheme: 'Merit Scholarship',
    appDate: '2024-03-01',
    status: 'Pending',
    remark: 'Under evaluator review (Phase 2)',
    rejectedBy: '-'
  },
  {
    id: '3',
    applicantName: 'Rohan Mehra',
    class: '12-B',
    scheme: 'Financial Aid',
    appDate: '2024-01-20',
    status: 'Rejected',
    remark: 'Family income exceeds the threshold for this scheme.',
    rejectedBy: 'S. Kapoor (Accounts Head)'
  },
  {
    id: '4',
    applicantName: 'Priya Das',
    class: '11-C',
    scheme: 'Sibling Concession',
    appDate: '2024-03-10',
    status: 'Pending',
    remark: 'Waiting for sibling enrollment verification.',
    rejectedBy: '-'
  },
  {
    id: '5',
    applicantName: 'Vikram Seth',
    class: '8-B',
    scheme: 'Special Talent',
    appDate: '2024-02-10',
    status: 'Rejected',
    remark: 'Application submitted after the deadline.',
    rejectedBy: 'Admin Team'
  }]
  );
  const columns = [
  {
    key: 'applicant',
    header: 'Applicant Details',
    render: (row: any) =>
    <div>
          <div className="font-bold text-gray-900">{row.applicantName}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase">
            {row.class}
          </div>
        </div>

  },
  {
    key: 'scheme',
    header: 'Scholarship Scheme',
    render: (row: any) =>
    <span className="text-sm font-medium text-gray-700">{row.scheme}</span>

  },
  {
    key: 'date',
    header: 'Application Date',
    render: (row: any) =>
    <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-3 h-3" />
          <span className="text-xs">{row.appDate}</span>
        </div>

  },
  {
    key: 'status',
    header: 'Current Status',
    render: (row: any) =>
    <Badge
      variant={row.status === 'Rejected' ? 'danger' : 'warning'}
      className="flex items-center gap-1 w-fit">

          {row.status === 'Rejected' ?
      <XCircle className="w-3 h-3" /> :

      <Clock className="w-3 h-3" />
      }
          {row.status}
        </Badge>

  },
  {
    key: 'remark',
    header: 'Audit Remarks / Rejection Reason',
    render: (row: any) =>
    <div className="max-w-[250px] group">
          <p
        className={`text-xs italic leading-relaxed ${row.status === 'Rejected' ? 'text-red-700 font-medium' : 'text-gray-500'}`}>

            "{row.remark}"
          </p>
        </div>

  },
  {
    key: 'handledBy',
    header: 'Handled By',
    render: (row: any) =>
    <div className="flex items-center gap-2">
          {row.rejectedBy !== '-' && <User className="w-3 h-3 text-gray-400" />}
          <span className="text-xs font-semibold text-gray-600">
            {row.rejectedBy}
          </span>
        </div>

  }];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Application Audit Trail{' '}
            <History className="w-6 h-6 text-gray-400" />
          </h1>
          <p className="text-sm text-gray-500">
            Transparency report for pending and rejected scholarship
            applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50">

            <FileText className="w-4 h-4 mr-2" /> PDF Report
          </Button>
          <Button
            variant="outline"
            className="text-green-700 border-green-200 bg-green-50">

            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <Card className="p-6 bg-gray-50/50 shadow-sm border-none ring-1 ring-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              From Date
            </label>
            <Input type="date" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              To Date
            </label>
            <Input type="date" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Rejection Reason Category
            </label>
            <Select
              options={[
              {
                label: 'Documentation Error',
                value: 'doc'
              },
              {
                label: 'Income Ineligible',
                value: 'income'
              },
              {
                label: 'Academic Non-performance',
                value: 'acad'
              },
              {
                label: 'Missed Deadline',
                value: 'dead'
              }]
              }
              placeholder="All Reasons" />

          </div>
          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Status
            </label>
            <Select
              options={[
              {
                label: 'Pending Only',
                value: 'pending'
              },
              {
                label: 'Rejected Only',
                value: 'rejected'
              }]
              }
              placeholder="Both Statuses" />

          </div>
          <Button variant="primary" className="w-full h-[42px] font-bold">
            <Filter className="w-4 h-4 mr-2" /> Search Audit
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Input
            placeholder="Search by Applicant Name or Staff Name..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

        </div>
      </Card>

      {/* Main Grid Card */}
      <Card className="overflow-hidden border-none shadow-xl">
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-gray-800">Audit Summary</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Pending: 02
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Rejected: 03
              </span>
            </div>
          </div>
        </div>

        <Table columns={columns} data={reportData} />

        <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            This report is generated for compliance and transparency purposes.
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase italic">
            Audit Compiled On: {new Date().toLocaleDateString()}
          </div>
        </div>
      </Card>

      {/* Footnote Card */}
      <Card className="p-4 bg-blue-50 border-blue-100 flex items-start gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ClipboardList className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-sm font-bold text-blue-900">
            Scholarship Transparency Policy
          </h5>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed italic">
            All rejections must include a clear remark to help the applicant
            understand the decision. Staff names are logged to prevent
            unauthorized adjustments and ensure accountability in fund
            distribution.
          </p>
        </div>
      </Card>
    </div>);

}