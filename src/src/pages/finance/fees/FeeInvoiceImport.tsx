import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
export function FeeInvoiceImport() {
  const previewData = [
  {
    row: 1,
    student: 'Rahul Sharma',
    gr: '2023001',
    amount: 25000,
    status: 'Valid'
  },
  {
    row: 2,
    student: 'Priya Patel',
    gr: '2023002',
    amount: 25000,
    status: 'Valid'
  },
  {
    row: 3,
    student: 'Unknown',
    gr: 'INVALID',
    amount: 0,
    status: 'Error: Invalid GR'
  }];

  const columns = [
  {
    key: 'row',
    header: 'Row #',
    render: (row: any) => row.row
  },
  {
    key: 'student',
    header: 'Student Name',
    render: (row: any) => row.student
  },
  {
    key: 'gr',
    header: 'GR No',
    render: (row: any) => row.gr
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: any) => row.amount
  },
  {
    key: 'status',
    header: 'Validation',
    render: (row: any) =>
    <span
      className={`flex items-center gap-1 ${row.status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>

          {row.status.includes('Error') ?
      <AlertTriangle className="w-4 h-4" /> :

      <CheckCircle className="w-4 h-4" />
      }
          {row.status}
        </span>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Import Fee Invoices
          </h1>
          <p className="text-sm text-gray-500">
            Bulk upload fee demands via Excel/CSV
          </p>
        </div>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      <Card title="1. Upload File">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Excel (.xlsx) or CSV files only
          </p>
        </div>
      </Card>

      <Card title="2. Data Preview & Validation">
        <Table columns={columns} data={previewData} />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Process Import</Button>
        </div>
      </Card>
    </div>);

}