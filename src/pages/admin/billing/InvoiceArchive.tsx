import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  FileText,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building,
  Hash } from
'lucide-react';
const STATUS_STYLES = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700'
};
const STATUS_ICONS = {
  Paid: CheckCircle,
  Pending: Clock,
  Overdue: AlertTriangle
};
const invoices = [
{
  id: 'INV-2025-007',
  period: 'Jun 2025',
  students: 1248,
  baseAmount: 56160,
  moduleAmount: 9000,
  cgst: 2354,
  sgst: 2354,
  igst: 0,
  total: 69868,
  status: 'Pending' as const,
  dueDate: '01 Aug 2025',
  paymentDate: null,
  sacCode: '998314'
},
{
  id: 'INV-2025-006',
  period: 'May 2025',
  students: 1235,
  baseAmount: 55575,
  moduleAmount: 9000,
  cgst: 2323,
  sgst: 2323,
  igst: 0,
  total: 69221,
  status: 'Paid' as const,
  dueDate: '01 Jul 2025',
  paymentDate: '28 Jun 2025',
  sacCode: '998314'
},
{
  id: 'INV-2025-005',
  period: 'Apr 2025',
  students: 1220,
  baseAmount: 54900,
  moduleAmount: 9000,
  cgst: 2322,
  sgst: 2322,
  igst: 0,
  total: 68544,
  status: 'Paid' as const,
  dueDate: '01 Jun 2025',
  paymentDate: '30 May 2025',
  sacCode: '998314'
},
{
  id: 'INV-2025-004',
  period: 'Mar 2025',
  students: 1210,
  baseAmount: 54450,
  moduleAmount: 9000,
  cgst: 2322,
  sgst: 2322,
  igst: 0,
  total: 68094,
  status: 'Paid' as const,
  dueDate: '01 May 2025',
  paymentDate: '29 Apr 2025',
  sacCode: '998314'
},
{
  id: 'INV-2025-003',
  period: 'Feb 2025',
  students: 1195,
  baseAmount: 53775,
  moduleAmount: 9000,
  cgst: 2254,
  sgst: 2254,
  igst: 0,
  total: 67283,
  status: 'Overdue' as const,
  dueDate: '01 Apr 2025',
  paymentDate: null,
  sacCode: '998314'
}];

export function InvoiceArchive() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = invoices.filter((inv) => {
    const matchSearch =
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.period.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Archive</h1>
          <p className="text-sm text-gray-500 mt-1">
            All generated invoices with GST-compliant details
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Total Invoiced',
          value: '₹4,13,010',
          sub: 'Last 6 months',
          color: 'text-gray-900'
        },
        {
          label: 'Paid',
          value: '₹2,73,142',
          sub: '4 invoices',
          color: 'text-green-600'
        },
        {
          label: 'Outstanding',
          value: '₹1,39,868',
          sub: '2 invoices',
          color: 'text-red-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search invoice number or period..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          className="flex-1" />

        <Select
          options={[
          {
            value: 'all',
            label: 'All Status'
          },
          {
            value: 'Paid',
            label: 'Paid'
          },
          {
            value: 'Pending',
            label: 'Pending'
          },
          {
            value: 'Overdue',
            label: 'Overdue'
          }]
          }
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-40" />

      </div>

      {/* Invoice List */}
      <Card noPadding>
        <div className="divide-y divide-gray-100">
          {filtered.map((inv) => {
            const StatusIcon = STATUS_ICONS[inv.status];
            const isExpanded = expandedId === inv.id;
            return (
              <div key={inv.id}>
                <div
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : inv.id)}>

                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {inv.id}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 text-sm">
                        {inv.period}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {inv.students} students • SAC: {inv.sacCode}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{inv.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">Due: {inv.dueDate}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[inv.status]}`}>

                    <StatusIcon className="w-3 h-3" />
                    {inv.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download PDF">

                      <Download className="w-4 h-4" />
                    </button>
                    {isExpanded ?
                    <ChevronUp className="w-4 h-4 text-gray-400" /> :

                    <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Expanded Invoice Detail */}
                {isExpanded &&
                <div className="bg-gray-50 border-t border-gray-100 px-5 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ERP Company Details */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Building className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            ERP Company (Supplier)
                          </span>
                        </div>
                        {[
                      {
                        label: 'Company',
                        value: 'EduManager Technologies Pvt. Ltd.'
                      },
                      {
                        label: 'GSTIN',
                        value: '27AABCE1234F1Z5'
                      },
                      {
                        label: 'SAC Code',
                        value: inv.sacCode
                      },
                      {
                        label: 'State',
                        value: 'Maharashtra (27)'
                      }].
                      map((r, i) =>
                      <div
                        key={i}
                        className="flex justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">

                            <span className="text-gray-500">{r.label}</span>
                            <span className="font-medium text-gray-800">
                              {r.value}
                            </span>
                          </div>
                      )}
                      </div>

                      {/* School Details */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Hash className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            School (Recipient)
                          </span>
                        </div>
                        {[
                      {
                        label: 'School',
                        value: 'Sunrise International School'
                      },
                      {
                        label: 'GSTIN',
                        value: '27AABCS5678G1Z2'
                      },
                      {
                        label: 'State',
                        value: 'Maharashtra (27)'
                      },
                      {
                        label: 'Payment Date',
                        value: inv.paymentDate || 'Not yet paid'
                      }].
                      map((r, i) =>
                      <div
                        key={i}
                        className="flex justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">

                            <span className="text-gray-500">{r.label}</span>
                            <span className="font-medium text-gray-800">
                              {r.value}
                            </span>
                          </div>
                      )}
                      </div>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Tax Breakdown (GST @ 18%)
                      </p>
                      <div className="space-y-2">
                        {[
                      {
                        label: 'Base ERP Cost (Students)',
                        value: `₹${inv.baseAmount.toLocaleString()}`
                      },
                      {
                        label: 'Module Add-ons',
                        value: `₹${inv.moduleAmount.toLocaleString()}`
                      },
                      {
                        label: 'Subtotal (Taxable Value)',
                        value: `₹${(inv.baseAmount + inv.moduleAmount).toLocaleString()}`,
                        bold: true
                      },
                      {
                        label: 'CGST @ 9%',
                        value: `₹${inv.cgst.toLocaleString()}`
                      },
                      {
                        label: 'SGST @ 9%',
                        value: `₹${inv.sgst.toLocaleString()}`
                      },
                      {
                        label: 'IGST @ 0%',
                        value: `₹${inv.igst}`
                      },
                      {
                        label: 'Total Invoice Amount',
                        value: `₹${inv.total.toLocaleString()}`,
                        bold: true,
                        highlight: true
                      }].
                      map((r, i) =>
                      <div
                        key={i}
                        className={`flex justify-between text-sm py-1.5 ${r.highlight ? 'border-t-2 border-gray-200 mt-2 pt-3' : 'border-b border-gray-50'}`}>

                            <span
                          className={
                          r.bold ?
                          'font-semibold text-gray-800' :
                          'text-gray-500'
                          }>

                              {r.label}
                            </span>
                            <span
                          className={
                          r.bold ?
                          'font-bold text-gray-900' :
                          'text-gray-700'
                          }>

                              {r.value}
                            </span>
                          </div>
                      )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1 text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Download GST Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              </div>);

          })}
        </div>
      </Card>
    </div>);

}