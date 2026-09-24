import React, { useState } from 'react';
import { Send, Upload, Eye, FileText } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
export function MyOnlineFormSubmissions() {
  const submissions = [
  {
    id: 'SUB-001',
    formType: 'Certificate Request',
    date: '10-Nov-2024',
    status: 'Processing',
    remarks: 'Expected by 15-Nov'
  },
  {
    id: 'SUB-002',
    formType: 'Transport Change',
    date: '01-Nov-2024',
    status: 'Approved',
    remarks: 'Route 5 assigned'
  }];

  const columns = [
  {
    key: 'id',
    header: 'Submission ID'
  },
  {
    key: 'formType',
    header: 'Form Type'
  },
  {
    key: 'date',
    header: 'Date'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge
      variant={
      row.status === 'Approved' ?
      'success' :
      row.status === 'Processing' ?
      'warning' :
      'default'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'remarks',
    header: 'Remarks'
  },
  {
    key: 'actions',
    header: 'Action',
    render: () =>
    <Button variant="ghost" size="xs">
          <Eye className="w-4 h-4" />
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Online Submissions</h1>
        <p className="text-sm text-gray-500">
          Submit and track digital forms directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Submission */}
        <Card className="lg:col-span-1 h-fit" title="New Submission">
          <div className="space-y-4">
            <Select
              label="Select Form"
              options={[
              {
                value: 'cert',
                label: 'Certificate Request'
              },
              {
                value: 'transport',
                label: 'Transport Change'
              },
              {
                value: 'hostel',
                label: 'Hostel Application'
              }]
              } />


            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                Applicant Details
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Name</span>
                  <span className="font-medium">Rajesh Kumar</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">ID</span>
                  <span className="font-medium">EMP-0042</span>
                </div>
              </div>
            </div>

            <Input label="Subject/Purpose" placeholder="Brief details" />
            <Textarea label="Additional Information" rows={3} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-xs">Upload supporting doc</span>
              </div>
            </div>

            <Button variant="primary" className="w-full mt-2">
              <Send className="w-4 h-4 mr-2" /> Submit Form
            </Button>
          </div>
        </Card>

        {/* History */}
        <Card className="lg:col-span-2" title="My Submissions">
          <Table columns={columns} data={submissions} />
        </Card>
      </div>
    </div>);

}