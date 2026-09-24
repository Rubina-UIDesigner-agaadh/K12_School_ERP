import React, { useCallback, useMemo, useState, Fragment } from 'react';
// File: src/pages/finance/reports/DepartmentWiseExpense.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  PieChart,
  Download,
  Layers,
  Calendar,
  ArrowRightLeft,
  Building2,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Printer,
  Share2,
  Mail,
  FileText,
  BarChart3,
  Activity,
  Percent,
  DollarSign,
  Clock,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Settings,
  Maximize2,
  Minimize2,
  LayoutGrid,
  List,
  Table as TableIcon,
  LineChart,
  PieChartIcon,
  Sparkles,
  Calculator,
  Wallet,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  AlertCircle } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar } from
'recharts';
// --- Types ---
type ViewMode = 'monthly' | 'head-wise' | 'quarterly';
type ChartType = 'bar' | 'pie' | 'line' | 'area' | 'radar';
type ComparisonMode = 'budget' | 'previous-year' | 'none';
interface DeptData {
  id: string;
  department: string;
  departmentCode: string;
  headCount: number;
  budgetAllocated: number;
  budgetUtilization: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  status: 'under-budget' | 'on-track' | 'over-budget';
  topExpenseHead: string;
  lastUpdated: string;
  [key: string]: string | number;
}
interface ExpenseHead {
  name: string;
  color: string;
  amount: number;
  percentage: number;
}
interface MonthlyTrend {
  month: string;
  actual: number;
  budget: number;
  previousYear: number;
  variance: number;
}
interface DepartmentDetail {
  id: string;
  name: string;
  code: string;
  head: string;
  email: string;
  headCount: number;
  budgetAllocated: number;
  budgetSpent: number;
  budgetRemaining: number;
  utilizationPercentage: number;
  transactions: number;
  pendingApprovals: number;
  topVendors: {
    name: string;
    amount: number;
  }[];
  expenseBreakdown: ExpenseHead[];
  monthlyTrend: MonthlyTrend[];
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
  }[];
}
interface FilterState {
  searchQuery: string;
  department: string;
  status: string;
  minAmount: string;
  maxAmount: string;
}
// --- Mock Data ---
// 1. Monthly Data
const MONTHLY_DATA: DeptData[] = [
{
  id: '1',
  department: 'Administration',
  departmentCode: 'ADM',
  headCount: 25,
  budgetAllocated: 1500000,
  budgetUtilization: 48.7,
  trend: 'up',
  trendPercentage: 5.2,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Apr: 120000,
  May: 115000,
  Jun: 125000,
  Jul: 130000,
  Aug: 118000,
  Sep: 122000,
  total: 730000
},
{
  id: '2',
  department: 'Academics',
  departmentCode: 'ACA',
  headCount: 85,
  budgetAllocated: 5000000,
  budgetUtilization: 54.3,
  trend: 'stable',
  trendPercentage: 0.8,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Apr: 450000,
  May: 455000,
  Jun: 440000,
  Jul: 460000,
  Aug: 450000,
  Sep: 458000,
  total: 2713000
},
{
  id: '3',
  department: 'Sports',
  departmentCode: 'SPT',
  headCount: 12,
  budgetAllocated: 800000,
  budgetUtilization: 75.0,
  trend: 'up',
  trendPercentage: 12.5,
  status: 'over-budget',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-24',
  Apr: 85000,
  May: 90000,
  Jun: 150000,
  Jul: 95000,
  Aug: 88000,
  Sep: 92000,
  total: 600000
},
{
  id: '4',
  department: 'Transport',
  departmentCode: 'TRN',
  headCount: 18,
  budgetAllocated: 1800000,
  budgetUtilization: 69.9,
  trend: 'up',
  trendPercentage: 3.8,
  status: 'on-track',
  topExpenseHead: 'Fuel',
  lastUpdated: '2024-03-25',
  Apr: 210000,
  May: 205000,
  Jun: 190000,
  Jul: 215000,
  Aug: 220000,
  Sep: 218000,
  total: 1258000
},
{
  id: '5',
  department: 'IT & Lab',
  departmentCode: 'ITL',
  headCount: 15,
  budgetAllocated: 1200000,
  budgetUtilization: 75.8,
  trend: 'down',
  trendPercentage: -2.3,
  status: 'on-track',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-25',
  Apr: 150000,
  May: 145000,
  Jun: 160000,
  Jul: 155000,
  Aug: 148000,
  Sep: 152000,
  total: 910000
},
{
  id: '6',
  department: 'Library',
  departmentCode: 'LIB',
  headCount: 8,
  budgetAllocated: 400000,
  budgetUtilization: 62.5,
  trend: 'stable',
  trendPercentage: 1.2,
  status: 'under-budget',
  topExpenseHead: 'Books',
  lastUpdated: '2024-03-23',
  Apr: 40000,
  May: 42000,
  Jun: 38000,
  Jul: 45000,
  Aug: 43000,
  Sep: 42000,
  total: 250000
},
{
  id: '7',
  department: 'Cafeteria',
  departmentCode: 'CAF',
  headCount: 20,
  budgetAllocated: 600000,
  budgetUtilization: 58.3,
  trend: 'up',
  trendPercentage: 4.5,
  status: 'on-track',
  topExpenseHead: 'Supplies',
  lastUpdated: '2024-03-25',
  Apr: 55000,
  May: 58000,
  Jun: 60000,
  Jul: 62000,
  Aug: 57000,
  Sep: 58000,
  total: 350000
}];

// 2. Head-wise Data
const HEAD_WISE_DATA: DeptData[] = [
{
  id: '1',
  department: 'Administration',
  departmentCode: 'ADM',
  headCount: 25,
  budgetAllocated: 1500000,
  budgetUtilization: 48.7,
  trend: 'up',
  trendPercentage: 5.2,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Salaries: 500000,
  Maintenance: 150000,
  Supplies: 50000,
  Events: 30000,
  total: 730000
},
{
  id: '2',
  department: 'Academics',
  departmentCode: 'ACA',
  headCount: 85,
  budgetAllocated: 5000000,
  budgetUtilization: 54.3,
  trend: 'stable',
  trendPercentage: 0.8,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Salaries: 2500000,
  Maintenance: 50000,
  Supplies: 150000,
  Events: 13000,
  total: 2713000
},
{
  id: '3',
  department: 'Sports',
  departmentCode: 'SPT',
  headCount: 12,
  budgetAllocated: 800000,
  budgetUtilization: 75.0,
  trend: 'up',
  trendPercentage: 12.5,
  status: 'over-budget',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-24',
  Salaries: 300000,
  Maintenance: 100000,
  Supplies: 150000,
  Events: 50000,
  total: 600000
},
{
  id: '4',
  department: 'Transport',
  departmentCode: 'TRN',
  headCount: 18,
  budgetAllocated: 1800000,
  budgetUtilization: 69.9,
  trend: 'up',
  trendPercentage: 3.8,
  status: 'on-track',
  topExpenseHead: 'Fuel',
  lastUpdated: '2024-03-25',
  Salaries: 600000,
  Maintenance: 400000,
  Supplies: 258000,
  Events: 0,
  total: 1258000
},
{
  id: '5',
  department: 'IT & Lab',
  departmentCode: 'ITL',
  headCount: 15,
  budgetAllocated: 1200000,
  budgetUtilization: 75.8,
  trend: 'down',
  trendPercentage: -2.3,
  status: 'on-track',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-25',
  Salaries: 400000,
  Maintenance: 300000,
  Supplies: 210000,
  Events: 0,
  total: 910000
},
{
  id: '6',
  department: 'Library',
  departmentCode: 'LIB',
  headCount: 8,
  budgetAllocated: 400000,
  budgetUtilization: 62.5,
  trend: 'stable',
  trendPercentage: 1.2,
  status: 'under-budget',
  topExpenseHead: 'Books',
  lastUpdated: '2024-03-23',
  Salaries: 150000,
  Maintenance: 20000,
  Supplies: 60000,
  Events: 20000,
  total: 250000
},
{
  id: '7',
  department: 'Cafeteria',
  departmentCode: 'CAF',
  headCount: 20,
  budgetAllocated: 600000,
  budgetUtilization: 58.3,
  trend: 'up',
  trendPercentage: 4.5,
  status: 'on-track',
  topExpenseHead: 'Supplies',
  lastUpdated: '2024-03-25',
  Salaries: 180000,
  Maintenance: 50000,
  Supplies: 100000,
  Events: 20000,
  total: 350000
}];

// 3. Quarterly Data
const QUARTERLY_DATA: DeptData[] = [
{
  id: '1',
  department: 'Administration',
  departmentCode: 'ADM',
  headCount: 25,
  budgetAllocated: 1500000,
  budgetUtilization: 48.7,
  trend: 'up',
  trendPercentage: 5.2,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Q1: 360000,
  Q2: 370000,
  total: 730000
},
{
  id: '2',
  department: 'Academics',
  departmentCode: 'ACA',
  headCount: 85,
  budgetAllocated: 5000000,
  budgetUtilization: 54.3,
  trend: 'stable',
  trendPercentage: 0.8,
  status: 'on-track',
  topExpenseHead: 'Salaries',
  lastUpdated: '2024-03-25',
  Q1: 1345000,
  Q2: 1368000,
  total: 2713000
},
{
  id: '3',
  department: 'Sports',
  departmentCode: 'SPT',
  headCount: 12,
  budgetAllocated: 800000,
  budgetUtilization: 75.0,
  trend: 'up',
  trendPercentage: 12.5,
  status: 'over-budget',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-24',
  Q1: 325000,
  Q2: 275000,
  total: 600000
},
{
  id: '4',
  department: 'Transport',
  departmentCode: 'TRN',
  headCount: 18,
  budgetAllocated: 1800000,
  budgetUtilization: 69.9,
  trend: 'up',
  trendPercentage: 3.8,
  status: 'on-track',
  topExpenseHead: 'Fuel',
  lastUpdated: '2024-03-25',
  Q1: 605000,
  Q2: 653000,
  total: 1258000
},
{
  id: '5',
  department: 'IT & Lab',
  departmentCode: 'ITL',
  headCount: 15,
  budgetAllocated: 1200000,
  budgetUtilization: 75.8,
  trend: 'down',
  trendPercentage: -2.3,
  status: 'on-track',
  topExpenseHead: 'Equipment',
  lastUpdated: '2024-03-25',
  Q1: 455000,
  Q2: 455000,
  total: 910000
},
{
  id: '6',
  department: 'Library',
  departmentCode: 'LIB',
  headCount: 8,
  budgetAllocated: 400000,
  budgetUtilization: 62.5,
  trend: 'stable',
  trendPercentage: 1.2,
  status: 'under-budget',
  topExpenseHead: 'Books',
  lastUpdated: '2024-03-23',
  Q1: 120000,
  Q2: 130000,
  total: 250000
},
{
  id: '7',
  department: 'Cafeteria',
  departmentCode: 'CAF',
  headCount: 20,
  budgetAllocated: 600000,
  budgetUtilization: 58.3,
  trend: 'up',
  trendPercentage: 4.5,
  status: 'on-track',
  topExpenseHead: 'Supplies',
  lastUpdated: '2024-03-25',
  Q1: 173000,
  Q2: 177000,
  total: 350000
}];

// Pie Chart Data
const PIE_DATA = [
{
  name: 'Administration',
  value: 730000,
  color: '#3b82f6'
},
{
  name: 'Academics',
  value: 2713000,
  color: '#10b981'
},
{
  name: 'Sports',
  value: 600000,
  color: '#f59e0b'
},
{
  name: 'Transport',
  value: 1258000,
  color: '#8b5cf6'
},
{
  name: 'IT & Lab',
  value: 910000,
  color: '#ec4899'
},
{
  name: 'Library',
  value: 250000,
  color: '#6366f1'
},
{
  name: 'Cafeteria',
  value: 350000,
  color: '#14b8a6'
}];

// Trend Data for Line Chart
const TREND_DATA = [
{
  month: 'Apr',
  Administration: 120000,
  Academics: 450000,
  Sports: 85000,
  Transport: 210000,
  'IT & Lab': 150000
},
{
  month: 'May',
  Administration: 115000,
  Academics: 455000,
  Sports: 90000,
  Transport: 205000,
  'IT & Lab': 145000
},
{
  month: 'Jun',
  Administration: 125000,
  Academics: 440000,
  Sports: 150000,
  Transport: 190000,
  'IT & Lab': 160000
},
{
  month: 'Jul',
  Administration: 130000,
  Academics: 460000,
  Sports: 95000,
  Transport: 215000,
  'IT & Lab': 155000
},
{
  month: 'Aug',
  Administration: 118000,
  Academics: 450000,
  Sports: 88000,
  Transport: 220000,
  'IT & Lab': 148000
},
{
  month: 'Sep',
  Administration: 122000,
  Academics: 458000,
  Sports: 92000,
  Transport: 218000,
  'IT & Lab': 152000
}];

// Colors for Chart Stacks
const COLORS = [
'#3b82f6',
'#10b981',
'#f59e0b',
'#8b5cf6',
'#ec4899',
'#6366f1',
'#14b8a6',
'#ef4444'];

// Financial Years
const FINANCIAL_YEARS = [
{
  value: '2024-2025',
  label: 'FY 2024-2025'
},
{
  value: '2023-2024',
  label: 'FY 2023-2024'
},
{
  value: '2022-2023',
  label: 'FY 2022-2023'
}];

// Departments for Filter
const DEPARTMENTS = [
{
  value: 'all',
  label: 'All Departments'
},
{
  value: 'administration',
  label: 'Administration'
},
{
  value: 'academics',
  label: 'Academics'
},
{
  value: 'sports',
  label: 'Sports'
},
{
  value: 'transport',
  label: 'Transport'
},
{
  value: 'it-lab',
  label: 'IT & Lab'
},
{
  value: 'library',
  label: 'Library'
},
{
  value: 'cafeteria',
  label: 'Cafeteria'
}];

export function DepartmentWiseExpense(): JSX.Element {
  // --- State ---
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('none');
  const [finYear, setFinYear] = useState<string>('2024-2025');
  const [selectedDepartment, setSelectedDepartment] = useState<DeptData | null>(
    null
  );
  const [showDepartmentDetail, setShowDepartmentDetail] =
  useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [sortColumn, setSortColumn] = useState<string>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  // --- Data Selection ---
  const getDataByViewMode = useCallback(() => {
    switch (viewMode) {
      case 'monthly':
        return MONTHLY_DATA;
      case 'head-wise':
        return HEAD_WISE_DATA;
      case 'quarterly':
        return QUARTERLY_DATA;
      default:
        return MONTHLY_DATA;
    }
  }, [viewMode]);
  const currentData = useMemo(() => getDataByViewMode(), [getDataByViewMode]);
  // --- Filtered & Sorted Data ---
  const filteredData = useMemo(() => {
    let data = [...currentData];
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
        item.department.toLowerCase().includes(query) ||
        item.departmentCode.toLowerCase().includes(query)
      );
    }
    // Department filter
    if (filters.department !== 'all') {
      data = data.filter(
        (item) =>
        item.department.toLowerCase().replace(/\s+/g, '-') ===
        filters.department
      );
    }
    // Status filter
    if (filters.status !== 'all') {
      data = data.filter((item) => item.status === filters.status);
    }
    // Amount filter
    if (filters.minAmount) {
      data = data.filter((item) => item.total >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      data = data.filter((item) => item.total <= parseFloat(filters.maxAmount));
    }
    // Sort
    data.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortOrder === 'asc' ?
      String(aValue).localeCompare(String(bValue)) :
      String(bValue).localeCompare(String(aValue));
    });
    return data;
  }, [currentData, filters, sortColumn, sortOrder]);
  // Determine Columns dynamically based on the first data row
  const dynamicKeys = useMemo(() => {
    if (filteredData.length === 0) return [];
    return Object.keys(filteredData[0]).filter(
      (k) =>
      ![
      'id',
      'department',
      'departmentCode',
      'headCount',
      'budgetAllocated',
      'budgetUtilization',
      'trend',
      'trendPercentage',
      'status',
      'topExpenseHead',
      'lastUpdated',
      'total'].
      includes(k)
    );
  }, [filteredData]);
  // Calculate Column Totals for the Footer
  const columnTotals = useMemo(() => {
    return dynamicKeys.reduce(
      (acc, key) => {
        acc[key] = filteredData.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0
        );
        return acc;
      },
      {} as Record<string, number>
    );
  }, [filteredData, dynamicKeys]);
  const grandTotal = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
  }, [filteredData]);
  // Calculate Summary Statistics
  const summaryStats = useMemo(() => {
    const totalBudget = filteredData.reduce(
      (sum, row) => sum + row.budgetAllocated,
      0
    );
    const totalSpent = grandTotal;
    const avgUtilization =
    filteredData.reduce((sum, row) => sum + row.budgetUtilization, 0) /
    filteredData.length;
    const overBudgetDepts = filteredData.filter(
      (row) => row.status === 'over-budget'
    ).length;
    const underBudgetDepts = filteredData.filter(
      (row) => row.status === 'under-budget'
    ).length;
    const totalHeadCount = filteredData.reduce(
      (sum, row) => sum + row.headCount,
      0
    );
    const highestSpender = filteredData.reduce((prev, curr) =>
    prev.total > curr.total ? prev : curr
    );
    const lowestSpender = filteredData.reduce((prev, curr) =>
    prev.total < curr.total ? prev : curr
    );
    return {
      totalBudget,
      totalSpent,
      budgetRemaining: totalBudget - totalSpent,
      avgUtilization,
      overBudgetDepts,
      underBudgetDepts,
      totalHeadCount,
      highestSpender,
      lowestSpender,
      departmentCount: filteredData.length
    };
  }, [filteredData, grandTotal]);
  // --- Handlers ---
  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortOrder('desc');
      }
    },
    [sortColumn]
  );
  const toggleRowExpand = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);
  const handleDepartmentClick = useCallback((dept: DeptData) => {
    setSelectedDepartment(dept);
    setShowDepartmentDetail(true);
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      department: 'all',
      status: 'all',
      minAmount: '',
      maxAmount: ''
    });
  }, []);
  // --- Render Functions ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under-budget':
        return (
          <Badge variant="success" className="text-[9px]">
            Under Budget
          </Badge>);

      case 'on-track':
        return (
          <Badge variant="info" className="text-[9px]">
            On Track
          </Badge>);

      case 'over-budget':
        return (
          <Badge variant="danger" className="text-[9px]">
            Over Budget
          </Badge>);

      default:
        return null;
    }
  };
  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">{percentage}%</span>
        </div>);

    } else if (trend === 'down') {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">{Math.abs(percentage)}%</span>
        </div>);

    }
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Activity className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold">{percentage}%</span>
      </div>);

  };
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
              layout="vertical">

              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f0f0f0" />

              <XAxis type="number" hide />
              <YAxis
                dataKey="department"
                type="category"
                width={100}
                tick={{
                  fontSize: 11
                }} />

              <Tooltip
                formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                '']
                }
                cursor={{
                  fill: '#f9fafb'
                }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }} />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '11px'
                }} />

              {dynamicKeys.map((key, index) =>
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                barSize={25}
                radius={index === dynamicKeys.length - 1 ? [0, 4, 4, 0] : 0} />

              )}
            </BarChart>
          </ResponsiveContainer>);

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={{
                  stroke: '#374151',
                  strokeWidth: 1
                }}>

                {PIE_DATA.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                'Amount']
                }
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }} />

            </RechartsPieChart>
          </ResponsiveContainer>);

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={TREND_DATA}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11
                }} />

              <YAxis
                tick={{
                  fontSize: 11
                }}
                tickFormatter={(value) => `₹${value / 1000}k`} />

              <Tooltip
                formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                '']
                }
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }} />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '11px'
                }} />

              {[
              'Administration',
              'Academics',
              'Sports',
              'Transport',
              'IT & Lab'].
              map((dept, index) =>
              <Line
                key={dept}
                type="monotone"
                dataKey={dept}
                stroke={COLORS[index]}
                strokeWidth={2}
                dot={{
                  r: 4
                }}
                activeDot={{
                  r: 6
                }} />

              )}
            </RechartsLineChart>
          </ResponsiveContainer>);

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={TREND_DATA}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11
                }} />

              <YAxis
                tick={{
                  fontSize: 11
                }}
                tickFormatter={(value) => `₹${value / 1000}k`} />

              <Tooltip
                formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                '']
                }
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }} />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  fontSize: '11px'
                }} />

              {[
              'Administration',
              'Academics',
              'Sports',
              'Transport',
              'IT & Lab'].
              map((dept, index) =>
              <Area
                key={dept}
                type="monotone"
                dataKey={dept}
                stackId="1"
                stroke={COLORS[index]}
                fill={COLORS[index]}
                fillOpacity={0.6} />

              )}
            </AreaChart>
          </ResponsiveContainer>);

      case 'radar':
        const radarData = filteredData.slice(0, 5).map((item) => ({
          subject: item.department,
          utilization: item.budgetUtilization,
          fullMark: 100
        }));
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fontSize: 10
                }} />

              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{
                  fontSize: 10
                }} />

              <Radar
                name="Budget Utilization %"
                dataKey="utilization"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5} />

              <Tooltip
                formatter={(value: number) => [
                `${value.toFixed(1)}%`,
                'Utilization']
                }
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }} />

              <Legend
                wrapperStyle={{
                  fontSize: '11px'
                }} />

            </RadarChart>
          </ResponsiveContainer>);

      default:
        return null;
    }
  };
  return (
    <div
      className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-gray-50 p-6 overflow-auto' : ''}`}>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>
            Department-wise Expense
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Cost Center Analysis: Analyze spending patterns across different
            departments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}>

            {isFullScreen ?
            <Minimize2 className="w-4 h-4 mr-1" /> :

            <Maximize2 className="w-4 h-4 mr-1" />
            }
            {isFullScreen ? 'Exit' : 'Fullscreen'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowExportOptions(!showExportOptions)}>

            <Download className="w-4 h-4 mr-2" />
            Export
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
          {showExportOptions &&
          <Card className="absolute right-6 mt-32 p-2 shadow-lg z-10 min-w-[160px]">
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Export as PDF
              </button>
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                Export as Excel
              </button>
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                <Printer className="w-4 h-4 text-gray-500" />
                Print Report
              </button>
              <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email Report
              </button>
            </Card>
          }
        </div>
      </div>

      <ReportFilters />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-600 font-bold uppercase">
                Total Spent
              </p>
              <p className="text-xl font-black text-indigo-900">
                ₹{(grandTotal / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-green-600 font-bold uppercase">
                Total Budget
              </p>
              <p className="text-xl font-black text-green-900">
                ₹{(summaryStats.totalBudget / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Percent className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] text-orange-600 font-bold uppercase">
                Avg Utilization
              </p>
              <p className="text-xl font-black text-orange-900">
                {summaryStats.avgUtilization.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] text-purple-600 font-bold uppercase">
                Total Staff
              </p>
              <p className="text-xl font-black text-purple-900">
                {summaryStats.totalHeadCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-red-600 font-bold uppercase">
                Over Budget
              </p>
              <p className="text-xl font-black text-red-900">
                {summaryStats.overBudgetDepts} Dept
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] text-teal-600 font-bold uppercase">
                Under Budget
              </p>
              <p className="text-xl font-black text-teal-900">
                {summaryStats.underBudgetDepts} Dept
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <Card className="lg:col-span-1 p-5 space-y-5 h-fit">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Financial Year
            </label>
            <Select
              value={finYear}
              onChange={(e) => setFinYear(e.target.value)}
              options={FINANCIAL_YEARS} />

          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Pivot View By
            </label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('monthly')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all ${viewMode === 'monthly' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>

                <Calendar className="w-3.5 h-3.5" /> Month
              </button>
              <button
                onClick={() => setViewMode('quarterly')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all ${viewMode === 'quarterly' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>

                <BarChart3 className="w-3.5 h-3.5" /> Qtr
              </button>
              <button
                onClick={() => setViewMode('head-wise')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all ${viewMode === 'head-wise' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>

                <Layers className="w-3.5 h-3.5" /> Head
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Chart Type
            </label>
            <div className="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-lg">
              {[
              {
                type: 'bar',
                icon: BarChart3
              },
              {
                type: 'pie',
                icon: PieChartIcon
              },
              {
                type: 'line',
                icon: LineChart
              },
              {
                type: 'area',
                icon: Activity
              },
              {
                type: 'radar',
                icon: Target
              }].
              map(({ type, icon: Icon }) =>
              <button
                key={type}
                onClick={() => setChartType(type as ChartType)}
                className={`p-2 rounded-md transition-all ${chartType === type ? 'bg-white shadow text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                title={type.charAt(0).toUpperCase() + type.slice(1)}>

                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-indigo-600">

              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </span>
              {showFilters ?
              <ChevronUp className="w-4 h-4" /> :

              <ChevronDown className="w-4 h-4" />
              }
            </button>

            {showFilters &&
            <div className="mt-4 space-y-3">
                <Input
                placeholder="Search department..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                value={filters.searchQuery}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: e.target.value
                }))
                } />


                <Select
                options={DEPARTMENTS}
                placeholder="Department"
                value={filters.department}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  department: e.target.value
                }))
                } />


                <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'under-budget',
                  label: 'Under Budget'
                },
                {
                  value: 'on-track',
                  label: 'On Track'
                },
                {
                  value: 'over-budget',
                  label: 'Over Budget'
                }]
                }
                placeholder="Status"
                value={filters.status}
                onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
                } />


                <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={resetFilters}>

                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Filters
                </Button>
              </div>
            }
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <p className="text-xs text-gray-500 uppercase font-bold">
              Grand Total Spend
            </p>
            <p className="text-3xl font-black text-gray-900">
              ₹{(grandTotal / 100000).toFixed(2)}{' '}
              <span className="text-lg text-gray-500">Lakhs</span>
            </p>

            <div className="text-sm text-gray-600 space-y-1 mt-3">
              <div className="flex justify-between">
                <span>Total Departments:</span>
                <span className="font-bold">{filteredData.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Spender:</span>
                <span className="font-bold text-indigo-600">
                  {summaryStats.highestSpender?.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lowest Spender:</span>
                <span className="font-bold text-green-600">
                  {summaryStats.lowestSpender?.department}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Chart Area */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Comparative Analysis
              <Badge variant="secondary" className="ml-2 text-[9px]">
                {viewMode === 'monthly' ?
                'Monthly Trend' :
                viewMode === 'quarterly' ?
                'Quarterly View' :
                'Expense Composition'}
              </Badge>
            </h3>
            <div className="flex gap-2">
              <Select
                className="w-40"
                options={[
                {
                  value: 'none',
                  label: 'No Comparison'
                },
                {
                  value: 'budget',
                  label: 'vs Budget'
                },
                {
                  value: 'previous-year',
                  label: 'vs Previous Year'
                }]
                }
                value={comparisonMode}
                onChange={(e) =>
                setComparisonMode(e.target.value as ComparisonMode)
                } />

            </div>
          </div>

          <div className="h-80 w-full">{renderChart()}</div>

          {/* Chart Legend */}
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 justify-center">
            {filteredData.slice(0, 7).map((dept, index) =>
            <div key={dept.id} className="flex items-center gap-2">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }} />

                <span className="text-xs text-gray-600">{dept.department}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pivot Table */}
      <Card className="overflow-hidden shadow-xl">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-indigo-600" />
            Department Expense Matrix
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {filteredData.length} Departments
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Columns
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                  <button
                    onClick={() => handleSort('department')}
                    className="flex items-center gap-1 font-bold text-xs uppercase text-gray-700 hover:text-indigo-600">

                    Department
                    {sortColumn === 'department' && (
                    sortOrder === 'asc' ?
                    <ChevronUp className="w-3 h-3" /> :

                    <ChevronDown className="w-3 h-3" />)
                    }
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs uppercase text-gray-700 min-w-[80px]">
                  Staff
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs uppercase text-gray-700 min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs uppercase text-gray-700 min-w-[80px]">
                  Trend
                </th>
                {dynamicKeys.map((key) =>
                <th
                  key={key}
                  className="px-4 py-3 text-right font-bold text-xs uppercase text-gray-700 whitespace-nowrap min-w-[100px]">

                    <button
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1 ml-auto hover:text-indigo-600">

                      {key}
                      {sortColumn === key && (
                    sortOrder === 'asc' ?
                    <ChevronUp className="w-3 h-3" /> :

                    <ChevronDown className="w-3 h-3" />)
                    }
                    </button>
                  </th>
                )}
                <th className="px-4 py-3 text-right bg-indigo-50 font-bold text-xs uppercase text-indigo-900 min-w-[120px]">
                  <button
                    onClick={() => handleSort('total')}
                    className="flex items-center gap-1 ml-auto hover:text-indigo-600">

                    Total
                    {sortColumn === 'total' && (
                    sortOrder === 'asc' ?
                    <ChevronUp className="w-3 h-3" /> :

                    <ChevronDown className="w-3 h-3" />)
                    }
                  </button>
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs uppercase text-gray-700 min-w-[60px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((row, rowIndex) =>
              <Fragment key={row.id}>
                  <tr
                  className={`hover:bg-indigo-50/30 transition-colors ${expandedRows.has(row.id) ? 'bg-indigo-50/50' : ''}`}>

                    <td className="px-4 py-3 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                      <div className="flex items-center gap-3">
                        <button
                        onClick={() => toggleRowExpand(row.id)}
                        className="p-1 hover:bg-gray-100 rounded">

                          {expandedRows.has(row.id) ?
                        <ChevronDown className="w-4 h-4 text-gray-400" /> :

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                        </button>
                        <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[rowIndex % COLORS.length]
                        }} />

                        <div>
                          <button
                          onClick={() => handleDepartmentClick(row)}
                          className="font-bold text-gray-900 hover:text-indigo-600 hover:underline">

                            {row.department}
                          </button>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {row.departmentCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">
                          {row.headCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getTrendIcon(row.trend, row.trendPercentage)}
                    </td>
                    {dynamicKeys.map((key) =>
                  <td
                    key={key}
                    className="px-4 py-3 text-right font-mono text-gray-600">

                        ₹{Number(row[key]).toLocaleString()}
                      </td>
                  )}
                    <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700 bg-indigo-50/30">
                      ₹{row.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                        onClick={() => handleDepartmentClick(row)}
                        className="p-1.5 hover:bg-indigo-100 rounded text-indigo-600"
                        title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400"
                        title="More Options">

                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRows.has(row.id) &&
                <tr className="bg-gray-50">
                      <td
                    colSpan={dynamicKeys.length + 6}
                    className="px-8 py-4">

                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Budget Allocated
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ₹{(row.budgetAllocated / 100000).toFixed(2)}L
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Budget Utilized
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-gray-900">
                                {row.budgetUtilization}%
                              </p>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div
                              className={`h-full rounded-full ${row.budgetUtilization > 80 ? 'bg-red-500' : row.budgetUtilization > 60 ? 'bg-orange-500' : 'bg-green-500'}`}
                              style={{
                                width: `${Math.min(row.budgetUtilization, 100)}%`
                              }} />

                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Top Expense
                            </p>
                            <Badge variant="secondary">
                              {row.topExpenseHead}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                              Last Updated
                            </p>
                            <p className="text-sm text-gray-700">
                              {row.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300 font-bold">
              <tr>
                <td className="px-4 py-4 text-gray-900 sticky left-0 bg-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <span className="uppercase">Grand Total</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-bold text-gray-800">
                  {summaryStats.totalHeadCount}
                </td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4"></td>
                {dynamicKeys.map((key) =>
                <td
                  key={key}
                  className="px-4 py-4 text-right font-mono text-gray-800">

                    ₹{columnTotals[key]?.toLocaleString()}
                  </td>
                )}
                <td className="px-4 py-4 text-right font-mono text-xl text-indigo-900 bg-indigo-100">
                  ₹{grandTotal.toLocaleString()}
                </td>
                <td className="px-4 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-green-900">
                Under Budget Departments
              </h4>
              <p className="text-sm text-green-700 mt-1">
                {summaryStats.underBudgetDepts} department(s) are spending below
                allocated budget
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-green-700 hover:text-green-900">

                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-orange-900">Over Budget Alert</h4>
              <p className="text-sm text-orange-700 mt-1">
                {summaryStats.overBudgetDepts} department(s) have exceeded their
                allocated budget
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-orange-700 hover:text-orange-900">

                Take Action <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Top Performer</h4>
              <p className="text-sm text-blue-700 mt-1">
                {summaryStats.lowestSpender?.department} has the most efficient
                spending pattern
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-blue-700 hover:text-blue-900">

                View Analysis <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Info className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-indigo-900 mb-2">
              Understanding This Report
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-700">
              <div>
                <p className="font-medium mb-1">View Modes</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • <strong>Monthly</strong>: Shows month-by-month breakdown
                  </li>
                  <li>
                    • <strong>Quarterly</strong>: Aggregated quarterly view
                  </li>
                  <li>
                    • <strong>Head-wise</strong>: Expense category breakdown
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Status Indicators</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • <span className="text-green-600">Under Budget</span>:
                    &lt;50% utilized
                  </li>
                  <li>
                    • <span className="text-blue-600">On Track</span>: 50-80%
                    utilized
                  </li>
                  <li>
                    • <span className="text-red-600">Over Budget</span>: &gt;80%
                    utilized
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Export Options</p>
                <ul className="space-y-1 text-xs">
                  <li>• PDF format for formal reports</li>
                  <li>• Excel for data analysis</li>
                  <li>• Email scheduling available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Department Detail Modal */}
      {showDepartmentDetail && selectedDepartment &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-4xl shadow-2xl border-none my-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedDepartment.department}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Code: {selectedDepartment.departmentCode} •{' '}
                      {selectedDepartment.headCount} Staff
                    </p>
                  </div>
                </div>
                <button
                onClick={() => setShowDepartmentDetail(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl text-center">
                  <p className="text-xs text-indigo-600 font-bold uppercase">
                    Total Spent
                  </p>
                  <p className="text-2xl font-black text-indigo-900 mt-1">
                    ₹{(selectedDepartment.total / 100000).toFixed(2)}L
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-xs text-green-600 font-bold uppercase">
                    Budget
                  </p>
                  <p className="text-2xl font-black text-green-900 mt-1">
                    ₹{(selectedDepartment.budgetAllocated / 100000).toFixed(2)}L
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <p className="text-xs text-orange-600 font-bold uppercase">
                    Utilization
                  </p>
                  <p className="text-2xl font-black text-orange-900 mt-1">
                    {selectedDepartment.budgetUtilization}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-xs text-purple-600 font-bold uppercase">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedDepartment.status)}
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Monthly Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={dynamicKeys.map((key) => ({
                      name: key,
                      amount: Number(selectedDepartment[key])
                    }))}>

                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11
                      }} />

                      <YAxis
                      tick={{
                        fontSize: 11
                      }}
                      tickFormatter={(value) => `₹${value / 1000}k`} />

                      <Tooltip
                      formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      'Amount']
                      } />

                      <Bar
                      dataKey="amount"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]} />

                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Top Expense Category
                  </h4>
                  <Badge variant="secondary" className="text-sm">
                    {selectedDepartment.topExpenseHead}
                  </Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Last Updated</h4>
                  <p className="text-sm text-gray-600">
                    {selectedDepartment.lastUpdated}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
              variant="primary"
              onClick={() => setShowDepartmentDetail(false)}>

                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}