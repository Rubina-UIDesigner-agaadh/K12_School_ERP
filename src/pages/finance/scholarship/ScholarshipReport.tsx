import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Search,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ExternalLink } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// Mock data for the report
const REPORT_DATA = [
{
  id: '1',
  student: 'Aarav Sharma',
  class: '10-A',
  scheme: 'Merit Scholarship',
  donor: 'Alumni Association',
  sanctionDate: '2023-10-15',
  sanctioned: 25000,
  adjusted: 15000,
  disbursed: 5000,
  balance: 5000
},
{
  id: '2',
  student: 'Priya Patel',
  class: '9-B',
  scheme: 'Need-based Aid',
  donor: 'Trust Foundation',
  sanctionDate: '2023-11-02',
  sanctioned: 15000,
  adjusted: 15000,
  disbursed: 0,
  balance: 0
},
{
  id: '3',
  student: 'Rohan Kumar',
  class: '11-A',
  scheme: 'Sports Scholarship',
  donor: 'Corporate CSR',
  sanctionDate: '2023-09-20',
  sanctioned: 20000,
  adjusted: 10000,
  disbursed: 5000,
  balance: 5000
},
{
  id: '4',
  student: 'Ananya Singh',
  class: '8-A',
  scheme: 'Merit Scholarship',
  donor: 'Alumni Association',
  sanctionDate: '2023-10-18',
  sanctioned: 30000,
  adjusted: 20000,
  disbursed: 0,
  balance: 10000
}];

export function ScholarshipReport() {
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header & Export Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Scholarship Activities Report
          </h1>
          <p className="text-gray-500 text-sm">
            Detailed audit trail of sanctions, adjustments, and disbursements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white">

            <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export Excel
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white">

            <Printer className="w-4 h-4 text-red-600" /> Print PDF
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Advanced Filters */}
      <Card className="border-none shadow-sm overflow-visible">
        <div
          className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
          onClick={() => setIsFilterVisible(!isFilterVisible)}>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <Filter className="w-4 h-4" /> Filter Report Data
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isFilterVisible ? 'rotate-180' : ''}`} />

        </div>

        {isFilterVisible &&
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input placeholder="Select range" className="pl-9" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Scheme
              </label>
              <Select
              options={[
              {
                label: 'All Schemes',
                value: 'all'
              },
              {
                label: 'Merit',
                value: 'merit'
              }]
              }
              defaultValue="all" />

            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Donor
              </label>
              <Select
              options={[
              {
                label: 'All Donors',
                value: 'all'
              },
              {
                label: 'Alumni',
                value: 'alumni'
              }]
              }
              defaultValue="all" />

            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">
                Class
              </label>
              <Select
              options={[
              {
                label: 'All Classes',
                value: 'all'
              },
              {
                label: 'Class 10',
                value: '10'
              }]
              }
              defaultValue="all" />

            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Apply Filter
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Report Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">
                  Student & Class
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">
                  Scheme & Donor
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">
                  Sanction Date
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Sanctioned
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Adjusted (Fee)
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Disbursed
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase text-right">
                  Bal. Wallet
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {REPORT_DATA.map((row) =>
              <tr
                key={row.id}
                className="hover:bg-gray-50/80 transition-colors group">

                  <td className="p-4">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 flex items-center gap-1 cursor-pointer">
                      {row.student}{' '}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </p>
                    <p className="text-xs text-gray-500">{row.class}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-800">
                      {row.scheme}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      {row.donor}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(row.sanctionDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900 text-right">
                    ₹{row.sanctioned.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-blue-600 text-right">
                    ₹{row.adjusted.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-purple-600 text-right">
                    ₹{row.disbursed.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900 text-right">
                    <span
                    className={
                    row.balance > 0 ?
                    'bg-amber-50 px-2 py-1 rounded text-amber-700' :
                    'text-gray-400'
                    }>

                      ₹{row.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    {row.balance === 0 ?
                  <Badge variant="success">Fully Utilized</Badge> :

                  <Badge variant="warning">Partial Balance</Badge>
                  }
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Totals Footer */}
            <tfoot className="bg-gray-50/50 font-bold border-t-2 border-gray-100">
              <tr>
                <td colSpan={3} className="p-4 text-sm text-gray-600">
                  Total Report Summary
                </td>
                <td className="p-4 text-right text-sm text-gray-900">
                  ₹90,000
                </td>
                <td className="p-4 text-right text-sm text-blue-600">
                  ₹60,000
                </td>
                <td className="p-4 text-right text-sm text-purple-600">
                  ₹10,000
                </td>
                <td className="p-4 text-right text-sm text-amber-700">
                  ₹20,000
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Summary Helper Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200">
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider">
            Adjustment Ratio
          </p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold">66.7%</h3>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">
              Funds to Fees
            </span>
          </div>
        </div>
        <div className="bg-purple-600 p-4 rounded-xl text-white shadow-lg shadow-purple-200">
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider">
            Disbursement Ratio
          </p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold">11.1%</h3>
            <span className="text-xs bg-purple-500 px-2 py-1 rounded">
              Cash Payouts
            </span>
          </div>
        </div>
        <div className="bg-amber-500 p-4 rounded-xl text-white shadow-lg shadow-amber-200">
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider">
            Idle Scholarship Funds
          </p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold">₹20,000</h3>
            <span className="text-xs bg-amber-400 px-2 py-1 rounded">
              Pending Allocation
            </span>
          </div>
        </div>
      </div>
    </div>);

}