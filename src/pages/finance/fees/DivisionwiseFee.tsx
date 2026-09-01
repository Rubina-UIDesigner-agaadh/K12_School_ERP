import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Eye, Download, Filter } from 'lucide-react';
export function DivisionwiseFee() {
  const divisionData = [
  {
    id: '1',
    class: '10',
    section: 'A',
    students: 45,
    demand: 4500000,
    collected: 3500000,
    balance: 1000000,
    collectionRate: 77.7
  },
  {
    id: '2',
    class: '10',
    section: 'B',
    students: 42,
    demand: 4200000,
    collected: 3800000,
    balance: 400000,
    collectionRate: 90.4
  },
  {
    id: '3',
    class: '9',
    section: 'A',
    students: 40,
    demand: 4000000,
    collected: 2000000,
    balance: 2000000,
    collectionRate: 50.0
  },
  {
    id: '4',
    class: '9',
    section: 'B',
    students: 38,
    demand: 3800000,
    collected: 3600000,
    balance: 200000,
    collectionRate: 94.7
  }];

  const columns = [
  {
    key: 'classSection',
    header: 'Class & Section',
    render: (row: any) =>
    <span className="font-bold text-gray-900">
          {row.class} - {row.section}
        </span>

  },
  {
    key: 'students',
    header: 'Students',
    render: (row: any) =>
    <span className="text-gray-700">{row.students}</span>

  },
  {
    key: 'demand',
    header: 'Total Demand',
    render: (row: any) =>
    <span className="font-medium">₹{row.demand.toLocaleString()}</span>

  },
  {
    key: 'collected',
    header: 'Collected',
    render: (row: any) =>
    <span className="text-green-600 font-medium">
          ₹{row.collected.toLocaleString()}
        </span>

  },
  {
    key: 'balance',
    header: 'Balance',
    render: (row: any) =>
    <span className="text-red-600 font-medium">
          ₹{row.balance.toLocaleString()}
        </span>

  },
  {
    key: 'rate',
    header: 'Collection %',
    render: (row: any) =>
    <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
          className={`h-2 rounded-full ${row.collectionRate > 80 ? 'bg-green-500' : row.collectionRate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{
            width: `${row.collectionRate}%`
          }} />

          </div>
          <span className="text-xs font-medium">{row.collectionRate}%</span>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge
      variant={
      row.collectionRate > 90 ?
      'success' :
      row.collectionRate > 70 ?
      'warning' :
      'danger'
      }>

          {row.collectionRate > 90 ?
      'Excellent' :
      row.collectionRate > 70 ?
      'Good' :
      'Low'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <Button variant="ghost" size="sm" title="View Details">
          <Eye className="w-4 h-4" />
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Division-wise Fee Status
          </h1>
          <p className="text-sm text-gray-500">
            Detailed fee collection breakdown by class divisions
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select
            label="Academic Year"
            options={[
            {
              value: '2024-2025',
              label: '2024-2025'
            },
            {
              value: '2023-2024',
              label: '2023-2024'
            }]
            } />

          <Select
            label="Class"
            options={[
            {
              value: 'all',
              label: 'All Classes'
            },
            {
              value: '10',
              label: 'Class 10'
            },
            {
              value: '9',
              label: 'Class 9'
            }]
            } />

          <Select
            label="Fee Head"
            options={[
            {
              value: 'all',
              label: 'All Heads'
            },
            {
              value: 'tuition',
              label: 'Tuition Fee'
            },
            {
              value: 'transport',
              label: 'Transport Fee'
            }]
            } />

          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total Demand</p>
            <p className="text-2xl font-bold text-blue-900">₹1,65,00,000</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-600 font-medium">
              Total Collected
            </p>
            <p className="text-2xl font-bold text-green-900">₹1,29,00,000</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm text-red-600 font-medium">
              Total Outstanding
            </p>
            <p className="text-2xl font-bold text-red-900">₹36,00,000</p>
          </div>
        </div>

        <Table columns={columns} data={divisionData} />
      </Card>
    </div>);

}