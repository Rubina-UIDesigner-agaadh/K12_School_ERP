import React from 'react';
import { FileDown, Search, Filter, Info } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
export function MyFormsLibrary() {
  const forms = [
  {
    id: 1,
    title: 'Leave Application Form',
    category: 'HR',
    description: 'For medical or casual leave requests > 3 days.',
    format: 'PDF'
  },
  {
    id: 2,
    title: 'Transport Request Form',
    category: 'Admin',
    description: 'To apply for school bus service or change route.',
    format: 'Word'
  },
  {
    id: 3,
    title: 'Bonafide Certificate Request',
    category: 'Academic',
    description: 'Physical form for certificate issuance.',
    format: 'PDF'
  },
  {
    id: 4,
    title: 'Reimbursement Claim Form',
    category: 'Finance',
    description: 'For claiming official expenses.',
    format: 'Excel'
  }];

  const columns = [
  {
    key: 'title',
    header: 'Form Title'
  },
  {
    key: 'category',
    header: 'Category',
    render: (row: any) => <Badge variant="secondary">{row.category}</Badge>
  },
  {
    key: 'description',
    header: 'Description',
    render: (row: any) =>
    <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">{row.description}</span>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Download, fill, and submit to {row.category} Dept.
            </div>
          </div>
        </div>

  },
  {
    key: 'format',
    header: 'Format',
    render: (row: any) =>
    <Badge variant="outline" className="font-mono text-xs">
          {row.format}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Action',
    render: () =>
    <Button variant="outline" size="xs">
          <FileDown className="w-4 h-4 mr-2" /> Download
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forms Library</h1>
        <p className="text-sm text-gray-500">
          Download printable forms for offline submission.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: 'all',
              label: 'All Categories'
            },
            {
              value: 'hr',
              label: 'HR'
            },
            {
              value: 'academic',
              label: 'Academic'
            },
            {
              value: 'finance',
              label: 'Finance'
            }]
            }
            className="w-40" />

        </div>

        <Table columns={columns} data={forms} />
      </Card>
    </div>);

}