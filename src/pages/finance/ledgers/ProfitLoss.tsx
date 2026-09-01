import React, { useMemo, useState } from 'react';
// File: src/pages/finance/reports/ProfitLoss.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Printer,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  Building,
  Percent,
  Calculator,
  X } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface DataItem {
  id: string;
  category: string;
  name: string;
  currentYear: number;
  previousYear: number;
  ledgerAccount: string;
  branch: string;
  batch: string;
  isDirect?: boolean;
}
interface Branch {
  id: string;
  name: string;
}
interface Batch {
  value: string;
  label: string;
}
const BRANCHES: Branch[] = [
{
  id: 'all',
  name: 'All Branches'
},
{
  id: 'main',
  name: 'Main Campus'
},
{
  id: 'north',
  name: 'North Branch'
},
{
  id: 'south',
  name: 'South Branch'
},
{
  id: 'east',
  name: 'East Branch'
}];

const BATCHES: Batch[] = [
{
  value: 'all',
  label: 'All Batches'
},
{
  value: '2024-25',
  label: 'Batch 2024-25'
},
{
  value: '2023-24',
  label: 'Batch 2023-24'
},
{
  value: '2022-23',
  label: 'Batch 2022-23'
}];

const YEARS = [
{
  value: '2024-25',
  label: 'FY 2024-25'
},
{
  value: '2023-24',
  label: 'FY 2023-24'
},
{
  value: '2022-23',
  label: 'FY 2022-23'
}];

const generateData = (type: 'revenue' | 'direct' | 'operating') => {
  const branches = ['main', 'north', 'south', 'east'];
  const batches = ['2024-25', '2023-24', '2022-23'];
  const templates = {
    revenue: [
    {
      category: 'Fee Revenue',
      items: [
      'Tuition Fees',
      'Admission Fees',
      'Examination Fees',
      'Lab Fees',
      'Library Fees',
      'Sports Fees']

    },
    {
      category: 'Ancillary Revenue',
      items: ['Transport Fees', 'Hostel Fees', 'Canteen Revenue']
    },
    {
      category: 'Other Revenue',
      items: [
      'Late Fees & Fines',
      'Interest Income',
      'Donation & Grants',
      'Miscellaneous Income']

    }],

    direct: [
    {
      category: 'Direct Costs',
      items: [
      'Teaching Staff Salaries',
      'Academic Materials',
      'Lab Consumables',
      'Books & Library',
      'Sports Equipment',
      'Transport Operations',
      'Hostel Operations']

    }],

    operating: [
    {
      category: 'Administrative',
      items: [
      'Non-Teaching Staff Salaries',
      'Office Rent',
      'Utilities',
      'Communication & Internet',
      'Stationery & Supplies',
      'Maintenance & Repairs']

    },
    {
      category: 'Employee Benefits',
      items: ['Staff Welfare', 'PF Contribution', 'ESI Contribution']
    },
    {
      category: 'Professional Services',
      items: ['Legal & Professional Fees', 'Audit Fees', 'Insurance Premium']
    },
    {
      category: 'Marketing',
      items: ['Advertisement & Marketing', 'Student Recruitment']
    },
    {
      category: 'IT & Technology',
      items: ['Software & Licenses', 'IT Maintenance']
    },
    {
      category: 'Finance Costs',
      items: ['Interest on Loans', 'Bank Charges']
    },
    {
      category: 'Depreciation',
      items: ['Depreciation - Building', 'Depreciation - Equipment']
    },
    {
      category: 'Other Expenses',
      items: ['Bad Debts', 'Miscellaneous Expenses']
    }]

  };
  const data: DataItem[] = [];
  let counter = 1;
  templates[type].forEach(({ category, items }) => {
    items.forEach((name) => {
      branches.forEach((branch) => {
        batches.forEach((batch) => {
          const baseAmount = Math.floor(Math.random() * 500000) + 50000;
          data.push({
            id: `${type.toUpperCase()}-${String(counter++).padStart(3, '0')}`,
            category,
            name,
            currentYear: baseAmount,
            previousYear: Math.floor(baseAmount * (0.85 + Math.random() * 0.2)),
            ledgerAccount: `${type === 'revenue' ? '4' : '5'}${String(counter).padStart(3, '0')}`,
            branch,
            batch,
            isDirect: type === 'direct'
          });
        });
      });
    });
  });
  return data;
};
export function ProfitLoss() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [showComparison, setShowComparison] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const allRevenue = useMemo(() => generateData('revenue'), []);
  const allDirectExpenses = useMemo(() => generateData('direct'), []);
  const allOperatingExpenses = useMemo(() => generateData('operating'), []);
  const filterData = (data: DataItem[]) => {
    return data.filter((item) => {
      const branchMatch =
      selectedBranches.includes('all') ||
      selectedBranches.includes(item.branch);
      const batchMatch = selectedBatch === 'all' || item.batch === selectedBatch;
      return branchMatch && batchMatch;
    });
  };
  const revenueData = useMemo(
    () => filterData(allRevenue),
    [allRevenue, selectedBranches, selectedBatch]
  );
  const directExpenses = useMemo(
    () => filterData(allDirectExpenses),
    [allDirectExpenses, selectedBranches, selectedBatch]
  );
  const operatingExpenses = useMemo(
    () => filterData(allOperatingExpenses),
    [allOperatingExpenses, selectedBranches, selectedBatch]
  );
  const getActiveBranches = () =>
  selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;
  const getBranchData = (data: DataItem[], branch: string) =>
  data.filter((item) => item.branch === branch);
  const calculateTotals = (data: DataItem[]) => ({
    current: data.reduce((sum, item) => sum + item.currentYear, 0),
    previous: data.reduce((sum, item) => sum + item.previousYear, 0)
  });
  const summary = useMemo(() => {
    const revenue = calculateTotals(revenueData);
    const direct = calculateTotals(directExpenses);
    const operating = calculateTotals(operatingExpenses);
    const grossProfit = revenue.current - direct.current;
    const netProfit = grossProfit - operating.current;
    const prevGrossProfit = revenue.previous - direct.previous;
    const prevNetProfit = prevGrossProfit - operating.previous;
    return {
      totalRevenue: revenue.current,
      previousTotalRevenue: revenue.previous,
      directExpenses: direct.current,
      grossProfit,
      grossProfitMargin: grossProfit / revenue.current * 100,
      operatingExpenses: operating.current,
      operatingProfit: netProfit,
      operatingProfitMargin: netProfit / revenue.current * 100,
      netProfit,
      netProfitMargin: netProfit / revenue.current * 100,
      previousGrossProfit: prevGrossProfit,
      previousNetProfit: prevNetProfit
    };
  }, [revenueData, directExpenses, operatingExpenses]);
  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
  const getVariance = (current: number, previous: number) =>
  previous === 0 ? 0 : (current - previous) / previous * 100;
  const getBranchName = (id: string) =>
  BRANCHES.find((b) => b.id === id)?.name || id;
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const newSelection = selectedBranches.includes('all') ?
      [branchId] :
      selectedBranches.includes(branchId) ?
      selectedBranches.filter((b) => b !== branchId) :
      [...selectedBranches, branchId];
      setSelectedBranches(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };
  const groupByCategory = (items: DataItem[]) =>
  items.reduce(
    (acc, item) => {
      ;(acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    },
    {} as Record<string, DataItem[]>
  );
  const MetricCard = ({
    title,
    value,
    margin,
    icon: Icon,
    gradient,
    variance,
    showVariance
  }: any) =>
  <Card className={`p-4 bg-gradient-to-br ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
          {margin !== undefined &&
        <Badge variant="success" className="mt-2">
              {margin.toFixed(1)}% Margin
            </Badge>
        }
          {showVariance && variance !== undefined &&
        <div className="flex items-center mt-2 gap-1">
              {variance >= 0 ?
          <ArrowUpRight className="w-4 h-4 text-green-600" /> :

          <ArrowDownRight className="w-4 h-4 text-red-600" />
          }
              <span
            className={`text-sm ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                {Math.abs(variance).toFixed(1)}%
              </span>
            </div>
        }
        </div>
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>;

  const DataSection = ({
    title,
    data,
    icon: Icon,
    colorClass,
    totalLabel
  }: any) => {
    const activeBranches = getActiveBranches();
    const totals = calculateTotals(data);
    return (
      <div>
        <div
          className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${colorClass.border}`}>

          <h3
            className={`text-lg font-semibold ${colorClass.text} flex items-center gap-2`}>

            <Icon className="w-5 h-5" />
            {title}
          </h3>
          <div className="flex items-center gap-4">
            {showComparison &&
            <span className="text-sm text-gray-500 w-32 text-right font-medium">
                Previous Year
              </span>
            }
            <span className="text-sm text-gray-700 w-32 text-right font-medium">
              Current Year
            </span>
          </div>
        </div>

        {showBreakdown &&
        activeBranches.map((branch) => {
          const branchData = getBranchData(data, branch);
          const branchTotals = calculateTotals(branchData);
          const categories = groupByCategory(branchData);
          return (
            <div
              key={branch}
              className="mb-6 border rounded-lg overflow-hidden">

                <div
                className={`${colorClass.headerBg} px-4 py-2 flex justify-between items-center`}>

                  <span className="font-semibold flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {getBranchName(branch)}
                  </span>
                  <div className="flex gap-4">
                    {showComparison &&
                  <span className="text-sm w-32 text-right">
                        {formatCurrency(branchTotals.previous)}
                      </span>
                  }
                    <span className="font-bold w-32 text-right">
                      {formatCurrency(branchTotals.current)}
                    </span>
                  </div>
                </div>
                {Object.entries(categories).map(([category, items]) =>
              <div key={category}>
                    <div
                  className={`flex justify-between py-2 px-4 ${colorClass.categoryBg}`}>

                      <span className="font-medium text-gray-700">
                        {category}
                      </span>
                      <div className="flex gap-4">
                        {showComparison &&
                    <span className="text-sm text-gray-600 w-32 text-right">
                            {formatCurrency(
                        items.reduce((s, i) => s + i.previousYear, 0)
                      )}
                          </span>
                    }
                        <span className="font-semibold w-32 text-right">
                          {formatCurrency(
                        items.reduce((s, i) => s + i.currentYear, 0)
                      )}
                        </span>
                      </div>
                    </div>
                    {items.map((item) =>
                <div
                  key={item.id}
                  className="flex justify-between py-2 px-4 pl-8 hover:bg-gray-50">

                        <span className="text-gray-600 text-sm">
                          {item.name}
                        </span>
                        <div className="flex gap-4">
                          {showComparison &&
                    <span className="text-sm text-gray-500 w-32 text-right">
                              {formatCurrency(item.previousYear)}
                            </span>
                    }
                          <span className="text-sm w-32 text-right">
                            {formatCurrency(item.currentYear)}
                          </span>
                        </div>
                      </div>
                )}
                  </div>
              )}
              </div>);

        })}

        <div
          className={`flex justify-between py-3 px-4 ${colorClass.totalBg} rounded font-bold`}>

          <span className={colorClass.totalText}>{totalLabel}</span>
          <div className="flex gap-4">
            {showComparison &&
            <span className="w-32 text-right">
                {formatCurrency(totals.previous)}
              </span>
            }
            <span className="w-32 text-right text-lg">
              {formatCurrency(totals.current)}
            </span>
          </div>
        </div>
      </div>);

  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600" />
            Profit & Loss Statement
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Business Performance Report for Private School
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
          {
            icon: RefreshCw,
            text: 'Refresh'
          },
          {
            icon: Printer,
            text: 'Print'
          },
          {
            icon: Download,
            text: 'Export Excel'
          }].
          map(({ icon: Icon, text }) =>
          <Button key={text} variant="outline">
              <Icon className="w-4 h-4 mr-2" />
              {text}
            </Button>
          )}
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                options={YEARS}
                className="w-40" />

            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <Select
                value={selectedBatch}
                onChange={setSelectedBatch}
                options={BATCHES}
                className="w-44" />

            </div>
            {[
            {
              id: 'showComparison',
              checked: showComparison,
              onChange: setShowComparison,
              icon: BarChart3,
              label: 'Compare Years'
            },
            {
              id: 'showBreakdown',
              checked: showBreakdown,
              onChange: setShowBreakdown,
              icon: Eye,
              label: 'Show Details'
            }].
            map(({ id, checked, onChange, icon: Icon, label }) =>
            <label
              key={id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer">

                <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded" />

                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            )}
          </div>

          {/* Branch Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <Building className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Branches:</span>
            {BRANCHES.map((branch) =>
            <button
              key={branch.id}
              onClick={() => handleBranchToggle(branch.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1
                  ${selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>

                {branch.name}
                {selectedBranches.includes(branch.id) &&
              branch.id !== 'all' &&
              <X
                className="w-3 h-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBranchToggle(branch.id);
                }} />

              }
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Revenue"
          value={summary.totalRevenue}
          icon={TrendingUp}
          gradient="from-blue-500 to-blue-600 text-white"
          variance={getVariance(
            summary.totalRevenue,
            summary.previousTotalRevenue
          )}
          showVariance={showComparison} />

        <MetricCard
          title="Gross Profit"
          value={summary.grossProfit}
          margin={summary.grossProfitMargin}
          icon={Calculator}
          gradient="from-green-500 to-green-600 text-white" />

        <MetricCard
          title="Operating Profit"
          value={summary.operatingProfit}
          margin={summary.operatingProfitMargin}
          icon={Percent}
          gradient="from-purple-500 to-purple-600 text-white" />

        <MetricCard
          title={summary.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
          value={Math.abs(summary.netProfit)}
          margin={summary.netProfitMargin}
          icon={DollarSign}
          gradient={
          summary.netProfit >= 0 ?
          'from-emerald-500 to-emerald-600 text-white' :
          'from-red-500 to-red-600 text-white'
          } />

        <MetricCard
          title="YoY Growth"
          value={Math.abs(
            getVariance(summary.netProfit, summary.previousNetProfit)
          )}
          icon={BarChart3}
          gradient="from-gray-600 to-gray-700 text-white"
          showVariance={false} />

      </div>

      {/* Main P&L Statement */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Profit & Loss Statement
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              For the year ended 31st March {selectedYear.split('-')[1]}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-white text-gray-800">FY {selectedYear}</Badge>
            <Badge className="bg-blue-500">
              {selectedBranches.includes('all') ?
              'All Branches' :
              `${selectedBranches.length} Branch(es)`}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <DataSection
            title="Revenue"
            data={revenueData}
            icon={TrendingUp}
            totalLabel="Total Revenue"
            colorClass={{
              border: 'border-blue-200',
              text: 'text-blue-900',
              headerBg: 'bg-blue-100',
              categoryBg: 'bg-blue-50',
              totalBg: 'bg-blue-100',
              totalText: 'text-blue-900'
            }} />


          <DataSection
            title="Direct Expenses (Cost of Services)"
            data={directExpenses}
            icon={TrendingDown}
            totalLabel="Total Direct Expenses"
            colorClass={{
              border: 'border-red-200',
              text: 'text-red-900',
              headerBg: 'bg-red-100',
              categoryBg: 'bg-red-50',
              totalBg: 'bg-red-100',
              totalText: 'text-red-900'
            }} />


          {/* Gross Profit */}
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-lg font-bold text-green-900">
                  GROSS PROFIT
                </span>
                <Badge variant="success">
                  {summary.grossProfitMargin.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex gap-4">
                {showComparison &&
                <span className="text-green-800 w-32 text-right font-bold">
                    {formatCurrency(summary.previousGrossProfit)}
                  </span>
                }
                <span className="text-green-900 w-32 text-right font-bold text-xl">
                  {formatCurrency(summary.grossProfit)}
                </span>
              </div>
            </div>
          </div>

          <DataSection
            title="Operating Expenses"
            data={operatingExpenses}
            icon={Building}
            totalLabel="Total Operating Expenses"
            colorClass={{
              border: 'border-orange-200',
              text: 'text-orange-900',
              headerBg: 'bg-orange-100',
              categoryBg: 'bg-orange-50',
              totalBg: 'bg-orange-100',
              totalText: 'text-orange-900'
            }} />


          {/* Net Profit/Loss */}
          <div
            className={`rounded-lg p-4 border-2 ${summary.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {summary.netProfit >= 0 ?
                <CheckCircle className="w-6 h-6 text-emerald-600" /> :

                <AlertCircle className="w-6 h-6 text-red-600" />
                }
                <span
                  className={`text-xl font-bold ${summary.netProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>

                  {summary.netProfit >= 0 ? 'NET PROFIT' : 'NET LOSS'}
                </span>
                <Badge variant={summary.netProfit >= 0 ? 'success' : 'danger'}>
                  {summary.netProfitMargin.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex gap-4">
                {showComparison &&
                <span
                  className={`w-32 text-right font-bold ${summary.netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>

                    {formatCurrency(Math.abs(summary.previousNetProfit))}
                  </span>
                }
                <span
                  className={`w-32 text-right font-bold text-2xl ${summary.netProfit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>

                  {formatCurrency(Math.abs(summary.netProfit))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-600">
          <div>
            <p className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <strong>School:</strong> ABC International School
            </p>
            <p className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              <strong>Generated:</strong> {new Date().toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Prepared by:</strong> Accounts Department
            </p>
            <p className="mt-1">
              <strong>Status:</strong> <Badge variant="success">Verified</Badge>
            </p>
          </div>
        </div>
      </Card>
    </div>);

}