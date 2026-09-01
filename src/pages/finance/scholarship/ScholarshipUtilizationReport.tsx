import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  PieChart,
  Download,
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertCircle } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// --- Types ---
interface UtilizationRow {
  id: string;
  schemeName: string;
  donorAgency: string;
  totalBudget: number;
  totalUtilized: number;
  studentCount: number;
}
// --- Mock Data ---
const REPORT_DATA: UtilizationRow[] = [
{
  id: '1',
  schemeName: 'Merit Excellence 2024',
  donorAgency: 'EduCorp Foundation',
  totalBudget: 1000000,
  totalUtilized: 850000,
  studentCount: 85
},
{
  id: '2',
  schemeName: 'EWS Support Scheme',
  donorAgency: 'Govt Grant',
  totalBudget: 500000,
  totalUtilized: 120000,
  studentCount: 24
},
{
  id: '3',
  schemeName: 'Sports Talent Fund',
  donorAgency: 'Sports Authority',
  totalBudget: 300000,
  totalUtilized: 295000,
  studentCount: 30
},
{
  id: '4',
  schemeName: 'Girl Child Education',
  donorAgency: 'NGO Alliance',
  totalBudget: 750000,
  totalUtilized: 400000,
  studentCount: 50
}];

export function ScholarshipUtilizationReport() {
  // --- State ---
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const [selectedDonor, setSelectedDonor] = useState('all');
  // --- Derived Data ---
  const filteredData = useMemo(() => {
    return REPORT_DATA.filter((row) => {
      if (selectedDonor !== 'all' && row.donorAgency !== selectedDonor)
      return false;
      return true;
    });
  }, [selectedDonor]);
  // Summary KPI Calculations
  const totalBudget = filteredData.reduce(
    (acc, curr) => acc + curr.totalBudget,
    0
  );
  const totalSpent = filteredData.reduce(
    (acc, curr) => acc + curr.totalUtilized,
    0
  );
  const overallUtilization =
  totalBudget > 0 ? totalSpent / totalBudget * 100 : 0;
  const totalStudents = filteredData.reduce(
    (acc, curr) => acc + curr.studentCount,
    0
  );
  // --- Render Helpers ---
  const renderProgressBar = (value: number, total: number) => {
    const percentage = Math.min(value / total * 100, 100);
    let colorClass = 'bg-blue-600';
    if (percentage > 90)
    colorClass = 'bg-red-500'; // High utilization (near exhaustion)
    else if (percentage < 30) colorClass = 'bg-yellow-500'; // Low utilization
    return (
      <div className="w-full min-w-[100px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold text-gray-700">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${colorClass}`}
            style={{
              width: `${percentage}%`
            }} />

        </div>
      </div>);

  };
  // --- Columns ---
  const columns = [
  {
    key: 'scheme',
    header: 'Scheme Details',
    render: (row: UtilizationRow) =>
    <div>
          <div className="font-medium text-gray-900">{row.schemeName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Briefcase className="w-3 h-3" /> {row.donorAgency}
          </div>
        </div>

  },
  {
    key: 'budget',
    header: 'Total Allocation',
    render: (row: UtilizationRow) =>
    <span className="font-mono text-gray-900">
          ₹{row.totalBudget.toLocaleString()}
        </span>

  },
  {
    key: 'utilized',
    header: 'Utilized (Sanctioned)',
    render: (row: UtilizationRow) =>
    <div>
          <span className="font-mono font-bold text-blue-700">
            ₹{row.totalUtilized.toLocaleString()}
          </span>
          <div className="text-[10px] text-gray-400">
            {row.studentCount} Beneficiaries
          </div>
        </div>

  },
  {
    key: 'progress',
    header: '% Utilization',
    render: (row: UtilizationRow) =>
    renderProgressBar(row.totalUtilized, row.totalBudget)
  },
  {
    key: 'balance',
    header: 'Remaining Funds',
    render: (row: UtilizationRow) => {
      const balance = row.totalBudget - row.totalUtilized;
      return (
        <span
          className={`font-mono font-medium ${balance < row.totalBudget * 0.1 ? 'text-red-600' : 'text-green-600'}`}>

            ₹{balance.toLocaleString()}
          </span>);

    }
  }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-purple-600" />
            Scholarship Utilization Report
          </h1>
          <p className="text-sm text-gray-500">
            Fund-centric view for Donors and Management to track budget
            consumption.
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF Report
        </Button>
      </div>

      <ReportFilters />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Total Allocated
              </p>
              <h3 className="text-xl font-bold text-gray-900">
                ₹{totalBudget.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Total Utilized
              </p>
              <h3 className="text-xl font-bold text-purple-700">
                ₹{totalSpent.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Funds Remaining
              </p>
              <h3 className="text-xl font-bold text-green-700">
                ₹{(totalBudget - totalSpent).toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900 text-white border-gray-800 shadow-sm">
          <div className="h-full flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Overall Burn Rate
              </p>
              <span className="text-xl font-bold">
                {overallUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-green-400 h-1.5 rounded-full"
                style={{
                  width: `${overallUtilization}%`
                }} />

            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              {' '}
              Across {totalStudents} students
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-0 border-gray-200">
        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Financial Year"
            options={[
            {
              value: '2024-2025',
              label: 'FY 2024-2025'
            },
            {
              value: '2023-2024',
              label: 'FY 2023-2024'
            }]
            }
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)} />

          <Select
            label="Donor Agency"
            options={[
            {
              value: 'all',
              label: 'All Agencies'
            },
            {
              value: 'EduCorp Foundation',
              label: 'EduCorp Foundation'
            },
            {
              value: 'Govt Grant',
              label: 'Govt Grant'
            },
            {
              value: 'Sports Authority',
              label: 'Sports Authority'
            }]
            }
            value={selectedDonor}
            onChange={(e) => setSelectedDonor(e.target.value)} />

        </div>

        {/* Data Table */}
        <Table columns={columns} data={filteredData} />

        {/* Legend / Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
            <p>
              <strong>Utilization Color Guide:</strong> <br />
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>{' '}
              Yellow: Low Utilization (&lt;30%) - Review Required. <br />
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1"></span>{' '}
              Blue: Healthy Utilization. <br />
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>{' '}
              Red: Near Exhaustion (&gt;90%) - Request Top-up.
            </p>
          </div>
        </div>
      </Card>
    </div>);

}