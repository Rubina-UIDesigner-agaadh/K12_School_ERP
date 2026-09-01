import React, { useMemo, useState } from 'react';
// IncomeExpenditure.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  Building,
  X,
  Check } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface Branch {
  id: string;
  name: string;
  code: string;
}
interface Batch {
  id: string;
  name: string;
  year: string;
}
interface FinancialItem {
  id: string;
  category: string;
  name: string;
  ledgerAccount: string;
  branchData: {
    branchId: string;
    currentYear: number;
    previousYear: number;
  }[];
}
const branches: Branch[] = [
{
  id: 'BR001',
  name: 'Main Campus',
  code: 'MC'
},
{
  id: 'BR002',
  name: 'City Branch',
  code: 'CB'
},
{
  id: 'BR003',
  name: 'North Campus',
  code: 'NC'
},
{
  id: 'BR004',
  name: 'South Campus',
  code: 'SC'
}];

const batches: Batch[] = [
{
  id: 'BT001',
  name: '2024-25',
  year: '2024'
},
{
  id: 'BT002',
  name: '2023-24',
  year: '2023'
},
{
  id: 'BT003',
  name: '2022-23',
  year: '2022'
}];

const generateBranchData = (base: number, variance = 0.3) =>
branches.map((b) => ({
  branchId: b.id,
  currentYear: Math.round(base * (0.15 + Math.random() * variance)),
  previousYear: Math.round(base * (0.12 + Math.random() * variance))
}));
const incomeData: FinancialItem[] = [
{
  id: 'INC-001',
  category: 'Fee Income',
  name: 'Tuition Fee',
  ledgerAccount: '4001',
  branchData: generateBranchData(2500000)
},
{
  id: 'INC-002',
  category: 'Fee Income',
  name: 'Admission Fee',
  ledgerAccount: '4002',
  branchData: generateBranchData(350000)
},
{
  id: 'INC-003',
  category: 'Fee Income',
  name: 'Examination Fee',
  ledgerAccount: '4003',
  branchData: generateBranchData(125000)
},
{
  id: 'INC-004',
  category: 'Fee Income',
  name: 'Lab Fee',
  ledgerAccount: '4004',
  branchData: generateBranchData(75000)
},
{
  id: 'INC-005',
  category: 'Fee Income',
  name: 'Library Fee',
  ledgerAccount: '4005',
  branchData: generateBranchData(45000)
},
{
  id: 'INC-006',
  category: 'Fee Income',
  name: 'Sports Fee',
  ledgerAccount: '4006',
  branchData: generateBranchData(60000)
},
{
  id: 'INC-007',
  category: 'Fee Income',
  name: 'Transport Fee',
  ledgerAccount: '4007',
  branchData: generateBranchData(180000)
},
{
  id: 'INC-008',
  category: 'Fee Income',
  name: 'Hostel Fee',
  ledgerAccount: '4008',
  branchData: generateBranchData(450000)
},
{
  id: 'INC-009',
  category: 'Other Income',
  name: 'Interest Income',
  ledgerAccount: '4101',
  branchData: generateBranchData(25000)
},
{
  id: 'INC-010',
  category: 'Other Income',
  name: 'Donation Received',
  ledgerAccount: '4102',
  branchData: generateBranchData(150000)
},
{
  id: 'INC-011',
  category: 'Other Income',
  name: 'Government Grant',
  ledgerAccount: '4103',
  branchData: generateBranchData(200000)
},
{
  id: 'INC-012',
  category: 'Other Income',
  name: 'Canteen Rent',
  ledgerAccount: '4104',
  branchData: generateBranchData(120000)
},
{
  id: 'INC-013',
  category: 'Other Income',
  name: 'Late Fee & Fines',
  ledgerAccount: '4105',
  branchData: generateBranchData(35000)
},
{
  id: 'INC-014',
  category: 'Other Income',
  name: 'Miscellaneous Income',
  ledgerAccount: '4106',
  branchData: generateBranchData(15000)
}];

const expenditureData: FinancialItem[] = [
{
  id: 'EXP-001',
  category: 'Salaries & Wages',
  name: 'Teaching Staff Salaries',
  ledgerAccount: '5001',
  branchData: generateBranchData(1800000)
},
{
  id: 'EXP-002',
  category: 'Salaries & Wages',
  name: 'Non-Teaching Staff Salaries',
  ledgerAccount: '5002',
  branchData: generateBranchData(650000)
},
{
  id: 'EXP-003',
  category: 'Salaries & Wages',
  name: 'Staff Welfare',
  ledgerAccount: '5003',
  branchData: generateBranchData(45000)
},
{
  id: 'EXP-004',
  category: 'Salaries & Wages',
  name: 'PF Contribution',
  ledgerAccount: '5004',
  branchData: generateBranchData(108000)
},
{
  id: 'EXP-005',
  category: 'Salaries & Wages',
  name: 'ESI Contribution',
  ledgerAccount: '5005',
  branchData: generateBranchData(27000)
},
{
  id: 'EXP-006',
  category: 'Administrative Expenses',
  name: 'Electricity Charges',
  ledgerAccount: '5101',
  branchData: generateBranchData(120000)
},
{
  id: 'EXP-007',
  category: 'Administrative Expenses',
  name: 'Water Charges',
  ledgerAccount: '5102',
  branchData: generateBranchData(18000)
},
{
  id: 'EXP-008',
  category: 'Administrative Expenses',
  name: 'Internet & Communication',
  ledgerAccount: '5103',
  branchData: generateBranchData(36000)
},
{
  id: 'EXP-009',
  category: 'Administrative Expenses',
  name: 'Stationery & Printing',
  ledgerAccount: '5104',
  branchData: generateBranchData(42000)
},
{
  id: 'EXP-010',
  category: 'Administrative Expenses',
  name: 'Maintenance & Repairs',
  ledgerAccount: '5105',
  branchData: generateBranchData(85000)
},
{
  id: 'EXP-011',
  category: 'Academic Expenses',
  name: 'Books & Periodicals',
  ledgerAccount: '5201',
  branchData: generateBranchData(65000)
},
{
  id: 'EXP-012',
  category: 'Academic Expenses',
  name: 'Lab Consumables',
  ledgerAccount: '5202',
  branchData: generateBranchData(55000)
},
{
  id: 'EXP-013',
  category: 'Academic Expenses',
  name: 'Sports Equipment',
  ledgerAccount: '5203',
  branchData: generateBranchData(45000)
},
{
  id: 'EXP-014',
  category: 'Academic Expenses',
  name: 'Computer & IT Expenses',
  ledgerAccount: '5204',
  branchData: generateBranchData(75000)
},
{
  id: 'EXP-015',
  category: 'Transport Expenses',
  name: 'Fuel & Diesel',
  ledgerAccount: '5301',
  branchData: generateBranchData(180000)
},
{
  id: 'EXP-016',
  category: 'Transport Expenses',
  name: 'Vehicle Maintenance',
  ledgerAccount: '5302',
  branchData: generateBranchData(95000)
},
{
  id: 'EXP-017',
  category: 'Transport Expenses',
  name: 'Driver Salaries',
  ledgerAccount: '5303',
  branchData: generateBranchData(144000)
},
{
  id: 'EXP-018',
  category: 'Other Expenses',
  name: 'Insurance Premium',
  ledgerAccount: '5401',
  branchData: generateBranchData(48000)
},
{
  id: 'EXP-019',
  category: 'Other Expenses',
  name: 'Bank Charges',
  ledgerAccount: '5402',
  branchData: generateBranchData(8500)
},
{
  id: 'EXP-020',
  category: 'Other Expenses',
  name: 'Interest on Loan',
  ledgerAccount: '5403',
  branchData: generateBranchData(180000)
},
{
  id: 'EXP-021',
  category: 'Other Expenses',
  name: 'Depreciation',
  ledgerAccount: '5404',
  branchData: generateBranchData(385000)
},
{
  id: 'EXP-022',
  category: 'Other Expenses',
  name: 'Audit Fees',
  ledgerAccount: '5405',
  branchData: generateBranchData(35000)
},
{
  id: 'EXP-023',
  category: 'Other Expenses',
  name: 'Legal & Professional Fees',
  ledgerAccount: '5406',
  branchData: generateBranchData(28000)
},
{
  id: 'EXP-024',
  category: 'Other Expenses',
  name: 'Miscellaneous Expenses',
  ledgerAccount: '5407',
  branchData: generateBranchData(32000)
}];

export function IncomeExpenditure() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    branches.map((b) => b.id)
  );
  const [selectedBatch, setSelectedBatch] = useState('BT001');
  const [showComparison, setShowComparison] = useState(true);
  const [expandedIncomeCategories, setExpandedIncomeCategories] = useState<
    string[]>(
    ['Fee Income', 'Other Income']);
  const [expandedExpenditureCategories, setExpandedExpenditureCategories] =
  useState<string[]>(['Salaries & Wages', 'Administrative Expenses']);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [showBranchBreakdown, setShowBranchBreakdown] = useState(true);
  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
  const getVariance = (current: number, previous: number) =>
  previous === 0 ? 0 : (current - previous) / previous * 100;
  const getItemTotal = (item: FinancialItem, year: 'current' | 'previous') =>
  item.branchData.
  filter((b) => selectedBranches.includes(b.branchId)).
  reduce(
    (sum, b) => sum + (year === 'current' ? b.currentYear : b.previousYear),
    0
  );
  const getBranchAmount = (
  item: FinancialItem,
  branchId: string,
  year: 'current' | 'previous') =>

  item.branchData.find((b) => b.branchId === branchId)?.[
  year === 'current' ? 'currentYear' : 'previousYear'] ||
  0;
  const groupData = (data: FinancialItem[]) =>
  data.reduce(
    (acc, item) => ({
      ...acc,
      [item.category]: [...(acc[item.category] || []), item]
    }),
    {} as Record<string, FinancialItem[]>
  );
  const groupedIncome = useMemo(() => groupData(incomeData), []);
  const groupedExpenditure = useMemo(() => groupData(expenditureData), []);
  const getCategoryTotal = (
  items: FinancialItem[],
  year: 'current' | 'previous') =>
  items.reduce((sum, item) => sum + getItemTotal(item, year), 0);
  const summary = useMemo(() => {
    const totalIncome = incomeData.reduce(
      (sum, item) => sum + getItemTotal(item, 'current'),
      0
    );
    const totalExpenditure = expenditureData.reduce(
      (sum, item) => sum + getItemTotal(item, 'current'),
      0
    );
    const prevIncome = incomeData.reduce(
      (sum, item) => sum + getItemTotal(item, 'previous'),
      0
    );
    const prevExpenditure = expenditureData.reduce(
      (sum, item) => sum + getItemTotal(item, 'previous'),
      0
    );
    return {
      totalIncome,
      totalExpenditure,
      surplus: totalIncome - totalExpenditure,
      prevIncome,
      prevExpenditure,
      prevSurplus: prevIncome - prevExpenditure
    };
  }, [selectedBranches]);
  const branchSummary = useMemo(
    () =>
    branches.
    filter((b) => selectedBranches.includes(b.id)).
    map((branch) => {
      const income = incomeData.reduce(
        (sum, item) => sum + getBranchAmount(item, branch.id, 'current'),
        0
      );
      const expenditure = expenditureData.reduce(
        (sum, item) => sum + getBranchAmount(item, branch.id, 'current'),
        0
      );
      return {
        ...branch,
        income,
        expenditure,
        surplus: income - expenditure
      };
    }),
    [selectedBranches]
  );
  const toggleBranch = (branchId: string) =>
  setSelectedBranches((prev) =>
  prev.includes(branchId) ?
  prev.filter((id) => id !== branchId) :
  [...prev, branchId]
  );
  const selectAllBranches = () => setSelectedBranches(branches.map((b) => b.id));
  const SummaryCard = ({
    title,
    amount,
    prevAmount,
    icon: Icon,
    gradient,
    iconBg,
    isExpense = false
  }: any) =>
  <Card className={`p-4 bg-gradient-to-br ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm flex items-center gap-1">
            <Icon className="w-4 h-4" />
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(amount)}</p>
          {showComparison &&
        <div className="flex items-center mt-2 gap-1">
              {(
          isExpense ?
          getVariance(amount, prevAmount) <= 0 :
          getVariance(amount, prevAmount) >= 0) ?

          <ArrowUpRight className="w-4 h-4 text-green-600" /> :

          <ArrowDownRight className="w-4 h-4 text-red-600" />
          }
              <span
            className={`text-sm ${(isExpense ? getVariance(amount, prevAmount) <= 0 : getVariance(amount, prevAmount) >= 0) ? 'text-green-600' : 'text-red-600'}`}>

                {Math.abs(getVariance(amount, prevAmount)).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-600">vs last year</span>
            </div>
        }
        </div>
        <div
        className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>

          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>;

  const CategorySection = ({
    data,
    expanded,
    setExpanded,
    type





  }: {data: Record<string, FinancialItem[]>;expanded: string[];setExpanded: (v: string[]) => void;type: 'income' | 'expense';}) => {
    const colors =
    type === 'income' ?
    {
      bg: 'bg-green-50',
      hover: 'hover:bg-green-100',
      text: 'text-green-700',
      icon: 'text-green-600'
    } :
    {
      bg: 'bg-red-50',
      hover: 'hover:bg-red-100',
      text: 'text-red-700',
      icon: 'text-red-600'
    };
    return Object.entries(data).map(([category, items]) =>
    <div key={category} className="border-b border-gray-200">
        <div
        className={`flex items-center justify-between p-3 ${colors.bg} cursor-pointer ${colors.hover} transition-colors`}
        onClick={() =>
        setExpanded(
          expanded.includes(category) ?
          expanded.filter((c) => c !== category) :
          [...expanded, category]
        )
        }>

          <div className="flex items-center gap-2">
            {expanded.includes(category) ?
          <ChevronDown className={`w-4 h-4 ${colors.icon}`} /> :

          <ChevronRight className={`w-4 h-4 ${colors.icon}`} />
          }
            <span className="font-medium text-gray-800">{category}</span>
          </div>
          <div className="flex items-center gap-4">
            {showComparison &&
          <span className="text-sm text-gray-500 w-28 text-right">
                {formatCurrency(getCategoryTotal(items, 'previous'))}
              </span>
          }
            <span className={`font-semibold ${colors.text} w-32 text-right`}>
              {formatCurrency(getCategoryTotal(items, 'current'))}
            </span>
          </div>
        </div>
        {expanded.includes(category) &&
      <div className="bg-white">
            {items.map((item) =>
        <div key={item.id}>
                <div className="flex items-center justify-between px-4 py-2 pl-10 hover:bg-gray-50 text-sm">
                  <div className="flex-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      A/c: {item.ledgerAccount}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {showComparison &&
              <span className="text-gray-500 w-28 text-right">
                        {formatCurrency(getItemTotal(item, 'previous'))}
                      </span>
              }
                    <span className="text-gray-900 w-32 text-right font-medium">
                      {formatCurrency(getItemTotal(item, 'current'))}
                    </span>
                  </div>
                </div>
                {showBranchBreakdown && selectedBranches.length > 1 &&
          <div className="bg-gray-50 pl-14 pr-4 py-1">
                    {branches.
            filter((b) => selectedBranches.includes(b.id)).
            map((branch) =>
            <div
              key={branch.id}
              className="flex justify-between text-xs text-gray-500 py-0.5">

                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {branch.code}
                          </span>
                          <span>
                            {formatCurrency(
                  getBranchAmount(item, branch.id, 'current')
                )}
                          </span>
                        </div>
            )}
                  </div>
          }
              </div>
        )}
          </div>
      }
      </div>
    );
  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-7 h-7 text-blue-600" />
            Income & Expenditure Statement
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Non-Profit Organization Financial Statement
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                options={[
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
                },
                {
                  value: '2021-22',
                  label: 'FY 2021-22'
                }]
                }
                className="w-40" />

            </div>

            {/* Multi-select Branch Dropdown */}
            <div className="relative">
              <div
                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg cursor-pointer min-w-[200px]"
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}>

                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {selectedBranches.length === branches.length ?
                  'All Branches' :
                  `${selectedBranches.length} Branch(es)`}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </div>
              {branchDropdownOpen &&
              <div className="absolute z-10 mt-1 w-64 bg-white border rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={selectAllBranches}>

                      Select All
                    </Button>
                  </div>
                  {branches.map((branch) =>
                <div
                  key={branch.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleBranch(branch.id)}>

                      <div
                    className={`w-4 h-4 border rounded flex items-center justify-center ${selectedBranches.includes(branch.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>

                        {selectedBranches.includes(branch.id) &&
                    <Check className="w-3 h-3 text-white" />
                    }
                      </div>
                      <span className="text-sm">{branch.name}</span>
                      <Badge variant="default" className="ml-auto text-xs">
                        {branch.code}
                      </Badge>
                    </div>
                )}
                </div>
              }
            </div>

            {/* Batch Selector */}
            <Select
              value={selectedBatch}
              onChange={setSelectedBatch}
              options={batches.map((b) => ({
                value: b.id,
                label: `Batch ${b.name}`
              }))}
              className="w-40" />


            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <input
                type="checkbox"
                id="showComparison"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="w-4 h-4 rounded" />

              <label
                htmlFor="showComparison"
                className="text-sm font-medium text-gray-700 cursor-pointer">

                <BarChart3 className="w-4 h-4 inline mr-1" />
                Compare
              </label>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <input
                type="checkbox"
                id="showBreakdown"
                checked={showBranchBreakdown}
                onChange={(e) => setShowBranchBreakdown(e.target.checked)}
                className="w-4 h-4 rounded" />

              <label
                htmlFor="showBreakdown"
                className="text-sm font-medium text-gray-700 cursor-pointer">

                <Building className="w-4 h-4 inline mr-1" />
                Branch Details
              </label>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Info className="w-4 h-4 inline mr-1 text-blue-600" />
            Auto-calculated from ledger
          </div>
        </div>
      </Card>

      {/* Selected Branches Tags */}
      {selectedBranches.length > 0 &&
      selectedBranches.length < branches.length &&
      <div className="flex flex-wrap gap-2">
            {branches.
        filter((b) => selectedBranches.includes(b.id)).
        map((branch) =>
        <Badge
          key={branch.id}
          variant="primary"
          className="flex items-center gap-1">

                  {branch.name}
                  <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => toggleBranch(branch.id)} />

                </Badge>
        )}
          </div>
      }

      {/* Branch-wise Summary Cards */}
      {selectedBranches.length > 1 &&
      <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Branch-wise Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {branchSummary.map((branch) =>
          <div
            key={branch.id}
            className={`p-4 rounded-lg border-2 ${branch.surplus >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {branch.name}
                  </span>
                  <Badge variant={branch.surplus >= 0 ? 'success' : 'error'}>
                    {branch.code}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Income:</span>
                    <span className="font-medium">
                      {formatCurrency(branch.income)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Expenditure:</span>
                    <span className="font-medium">
                      {formatCurrency(branch.expenditure)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span
                  className={
                  branch.surplus >= 0 ?
                  'text-blue-700' :
                  'text-orange-700'
                  }>

                      {branch.surplus >= 0 ? 'Surplus:' : 'Deficit:'}
                    </span>
                    <span className="font-bold">
                      {formatCurrency(Math.abs(branch.surplus))}
                    </span>
                  </div>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome}
          prevAmount={summary.prevIncome}
          icon={TrendingUp}
          gradient="from-green-50 to-green-100 border-green-200"
          iconBg="bg-green-500" />

        <SummaryCard
          title="Total Expenditure"
          amount={summary.totalExpenditure}
          prevAmount={summary.prevExpenditure}
          icon={TrendingDown}
          gradient="from-red-50 to-red-100 border-red-200"
          iconBg="bg-red-500"
          isExpense />

        <Card
          className={`p-4 bg-gradient-to-br ${summary.surplus >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {summary.surplus >= 0 ? 'Surplus' : 'Deficit'}
              </p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(Math.abs(summary.surplus))}
              </p>
              <Badge
                variant={summary.surplus >= 0 ? 'success' : 'warning'}
                className="mt-2">

                {summary.surplus >= 0 ?
                <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Surplus
                  </> :

                <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Deficit
                  </>
                }
              </Badge>
            </div>
            <div
              className={`w-12 h-12 ${summary.surplus >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-full flex items-center justify-center`}>

              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Statement */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Income & Expenditure Account
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                For the year ended 31st March{' '}
                {selectedYear.split('-')[1] === '25' ?
                '2025' :
                selectedYear.split('-')[1]}
              </p>
            </div>
            <Badge variant="default" className="bg-white text-gray-800">
              FY {selectedYear}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b-2 border-gray-300">
          <div className="bg-red-50 p-3 border-r border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-red-800">EXPENDITURE</span>
              {showComparison &&
              <span className="text-xs text-red-600 font-medium">
                  Previous Year
                </span>
              }
            </div>
          </div>
          <div className="bg-green-50 p-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">INCOME</span>
              {showComparison &&
              <span className="text-xs text-green-600 font-medium">
                  Previous Year
                </span>
              }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="border-r border-gray-300">
            <CategorySection
              data={groupedExpenditure}
              expanded={expandedExpenditureCategories}
              setExpanded={setExpandedExpenditureCategories}
              type="expense" />

            {summary.surplus > 0 &&
            <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Surplus</span>
                </div>
                <div className="flex items-center gap-4">
                  {showComparison &&
                <span className="text-sm text-blue-600 w-28 text-right">
                      {summary.prevSurplus > 0 ?
                  formatCurrency(summary.prevSurplus) :
                  '-'}
                    </span>
                }
                  <span className="font-bold text-blue-700 w-32 text-right">
                    {formatCurrency(summary.surplus)}
                  </span>
                </div>
              </div>
            }
            <div className="bg-red-100 border-t-2 border-red-300 p-4 flex items-center justify-between">
              <span className="font-bold text-red-900 text-lg">TOTAL</span>
              <div className="flex items-center gap-4">
                {showComparison &&
                <span className="text-red-700 w-28 text-right font-semibold">
                    {formatCurrency(
                    summary.prevExpenditure +
                    Math.max(0, summary.prevSurplus)
                  )}
                  </span>
                }
                <span className="font-bold text-red-900 w-32 text-right text-xl">
                  {formatCurrency(
                    summary.totalExpenditure + Math.max(0, summary.surplus)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <CategorySection
              data={groupedIncome}
              expanded={expandedIncomeCategories}
              setExpanded={setExpandedIncomeCategories}
              type="income" />

            {summary.surplus < 0 &&
            <div className="bg-orange-50 border-b border-orange-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">Deficit</span>
                </div>
                <div className="flex items-center gap-4">
                  {showComparison &&
                <span className="text-sm text-orange-600 w-28 text-right">
                      {summary.prevSurplus < 0 ?
                  formatCurrency(Math.abs(summary.prevSurplus)) :
                  '-'}
                    </span>
                }
                  <span className="font-bold text-orange-700 w-32 text-right">
                    {formatCurrency(Math.abs(summary.surplus))}
                  </span>
                </div>
              </div>
            }
            <div className="bg-green-100 border-t-2 border-green-300 p-4 flex items-center justify-between">
              <span className="font-bold text-green-900 text-lg">TOTAL</span>
              <div className="flex items-center gap-4">
                {showComparison &&
                <span className="text-green-700 w-28 text-right font-semibold">
                    {formatCurrency(
                    summary.prevIncome + Math.max(0, -summary.prevSurplus)
                  )}
                  </span>
                }
                <span className="font-bold text-green-900 w-32 text-right text-xl">
                  {formatCurrency(
                    summary.totalIncome + Math.max(0, -summary.surplus)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Integration Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">
              Balance Sheet Integration
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              The {summary.surplus >= 0 ? 'surplus' : 'deficit'} of{' '}
              <strong>{formatCurrency(Math.abs(summary.surplus))}</strong> will
              be automatically transferred to the Balance Sheet under "Fund &
              Reserves" section.
            </p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <strong>School:</strong> ABC International School
            </p>
            <p className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              <strong>Generated:</strong> {new Date().toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-sm text-gray-600 text-right">
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