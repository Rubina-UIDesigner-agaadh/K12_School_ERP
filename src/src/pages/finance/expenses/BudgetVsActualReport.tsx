import React, { useMemo, useState, Fragment } from 'react';
// src/features/expenses/components/BudgetVsActualReport.tsx
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  PieChart,
  ArrowRightLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Percent,
  FileText,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  X,
  Minus,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Building2,
  Printer,
  FileSpreadsheet,
  Share2,
  Settings,
  Zap,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// --- Enhanced Types ---
interface BudgetItem {
  id: number;
  head: string;
  budget: number;
  spent: number;
  dept: string;
  category?: string;
  quarter1?: number;
  quarter2?: number;
  quarter3?: number;
  quarter4?: number;
  lastYearSpent?: number;
  budgetHolder?: string;
  notes?: string;
}
interface VarianceAnalysis {
  variance: number;
  utilization: number;
  statusColor: string;
  textColor: string;
  status: 'healthy' | 'warning' | 'critical' | 'overspent';
  trend: 'increasing' | 'decreasing' | 'stable';
}
interface FilterOptions {
  fiscalYear: string;
  department: string;
  category: string;
  status: string;
  searchTerm: string;
}
// --- Enhanced Mock Data with Detailed Information ---
const BUDGET_DATA: BudgetItem[] = [
{
  id: 1,
  head: 'Library Books & Journals',
  budget: 150000,
  spent: 110000,
  dept: 'Academic',
  category: 'Learning Resources',
  quarter1: 30000,
  quarter2: 35000,
  quarter3: 25000,
  quarter4: 20000,
  lastYearSpent: 125000,
  budgetHolder: 'Dr. Sarah Johnson',
  notes: 'Annual subscriptions paid in Q1'
},
{
  id: 2,
  head: 'Sports Equipment',
  budget: 80000,
  spent: 85000,
  dept: 'Sports',
  category: 'Infrastructure',
  quarter1: 20000,
  quarter2: 25000,
  quarter3: 22000,
  quarter4: 18000,
  lastYearSpent: 75000,
  budgetHolder: 'Mr. John Smith',
  notes: 'Exceeded due to inter-school tournament hosting'
},
{
  id: 3,
  head: 'Laboratory Chemicals',
  budget: 60000,
  spent: 35000,
  dept: 'Science',
  category: 'Consumables',
  quarter1: 10000,
  quarter2: 12000,
  quarter3: 8000,
  quarter4: 5000,
  lastYearSpent: 58000,
  budgetHolder: 'Dr. Robert Williams',
  notes: 'Lower consumption due to online classes'
},
{
  id: 4,
  head: 'Staff Training & Development',
  budget: 100000,
  spent: 98000,
  dept: 'HR',
  category: 'Professional Development',
  quarter1: 25000,
  quarter2: 30000,
  quarter3: 23000,
  quarter4: 20000,
  lastYearSpent: 92000,
  budgetHolder: 'Ms. Emily Brown',
  notes: 'Certification programs and workshops'
},
{
  id: 5,
  head: 'Campus Maintenance',
  budget: 250000,
  spent: 275000,
  dept: 'Admin',
  category: 'Infrastructure',
  quarter1: 60000,
  quarter2: 70000,
  quarter3: 75000,
  quarter4: 70000,
  lastYearSpent: 240000,
  budgetHolder: 'Mr. David Lee',
  notes: 'Unplanned roof repair in Q3'
},
{
  id: 6,
  head: 'Scholarship Disbursals',
  budget: 1200000,
  spent: 950000,
  dept: 'Finance',
  category: 'Student Support',
  quarter1: 300000,
  quarter2: 250000,
  quarter3: 200000,
  quarter4: 200000,
  lastYearSpent: 1100000,
  budgetHolder: 'Ms. Jennifer Davis',
  notes: 'Merit and need-based scholarships'
},
{
  id: 7,
  head: 'IT Infrastructure & Software',
  budget: 180000,
  spent: 165000,
  dept: 'IT',
  category: 'Technology',
  quarter1: 45000,
  quarter2: 50000,
  quarter3: 40000,
  quarter4: 30000,
  lastYearSpent: 170000,
  budgetHolder: 'Mr. Michael Chen',
  notes: 'License renewals and hardware upgrades'
},
{
  id: 8,
  head: 'Marketing & Admissions',
  budget: 120000,
  spent: 135000,
  dept: 'Marketing',
  category: 'Outreach',
  quarter1: 35000,
  quarter2: 40000,
  quarter3: 35000,
  quarter4: 25000,
  lastYearSpent: 110000,
  budgetHolder: 'Ms. Lisa Anderson',
  notes: 'Additional campaigns for new programs'
},
{
  id: 9,
  head: 'Utilities (Electricity & Water)',
  budget: 300000,
  spent: 285000,
  dept: 'Admin',
  category: 'Operations',
  quarter1: 75000,
  quarter2: 70000,
  quarter3: 72000,
  quarter4: 68000,
  lastYearSpent: 310000,
  budgetHolder: 'Mr. David Lee',
  notes: 'Energy-saving measures implemented'
},
{
  id: 10,
  head: 'Student Activities & Events',
  budget: 90000,
  spent: 72000,
  dept: 'Student Affairs',
  category: 'Events',
  quarter1: 20000,
  quarter2: 22000,
  quarter3: 18000,
  quarter4: 12000,
  lastYearSpent: 85000,
  budgetHolder: 'Ms. Rachel Green',
  notes: 'Cultural fest and sports day expenses'
}];

export function BudgetVsActualReport() {
  // --- State Management ---
  const [filters, setFilters] = useState<FilterOptions>({
    fiscalYear: '2024-2025',
    department: 'All Departments',
    category: 'All Categories',
    status: 'All Status',
    searchTerm: ''
  });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showQuarterlyBreakdown, setShowQuarterlyBreakdown] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  // --- Utility Functions ---
  const calculateVarianceAnalysis = (
  budget: number,
  spent: number,
  lastYearSpent?: number)
  : VarianceAnalysis => {
    const variance = budget - spent;
    const utilization = spent / budget * 100;
    let status: VarianceAnalysis['status'] = 'healthy';
    let statusColor = 'bg-green-500';
    let textColor = 'text-green-600';
    if (utilization > 100) {
      status = 'overspent';
      statusColor = 'bg-red-500';
      textColor = 'text-red-600';
    } else if (utilization >= 95) {
      status = 'critical';
      statusColor = 'bg-orange-500';
      textColor = 'text-orange-600';
    } else if (utilization >= 80) {
      status = 'warning';
      statusColor = 'bg-amber-500';
      textColor = 'text-amber-600';
    }
    // Determine trend
    let trend: VarianceAnalysis['trend'] = 'stable';
    if (lastYearSpent) {
      const percentageChange = (spent - lastYearSpent) / lastYearSpent * 100;
      if (percentageChange > 5) trend = 'increasing';else
      if (percentageChange < -5) trend = 'decreasing';
    }
    return {
      variance,
      utilization,
      statusColor,
      textColor,
      status,
      trend
    };
  };
  // --- Data Processing ---
  const reportRows = useMemo(() => {
    let filteredData = BUDGET_DATA;
    // Apply department filter
    if (filters.department !== 'All Departments') {
      filteredData = filteredData.filter(
        (item) => item.dept === filters.department
      );
    }
    // Apply category filter
    if (filters.category !== 'All Categories') {
      filteredData = filteredData.filter(
        (item) => item.category === filters.category
      );
    }
    // Apply search filter
    if (filters.searchTerm) {
      filteredData = filteredData.filter(
        (item) =>
        item.head.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.budgetHolder?.
        toLowerCase().
        includes(filters.searchTerm.toLowerCase())
      );
    }
    // Calculate variance analysis for each item
    const processed = filteredData.map((item) => ({
      ...item,
      analysis: calculateVarianceAnalysis(
        item.budget,
        item.spent,
        item.lastYearSpent
      )
    }));
    // Apply status filter
    if (filters.status !== 'All Status') {
      return processed.filter((item) => {
        if (filters.status === 'Healthy')
        return item.analysis.status === 'healthy';
        if (filters.status === 'Warning')
        return item.analysis.status === 'warning';
        if (filters.status === 'Critical')
        return item.analysis.status === 'critical';
        if (filters.status === 'Overspent')
        return item.analysis.status === 'overspent';
        return true;
      });
    }
    // Apply sorting
    if (sortConfig) {
      processed.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        switch (sortConfig.key) {
          case 'head':
            aValue = a.head;
            bValue = b.head;
            break;
          case 'budget':
            aValue = a.budget;
            bValue = b.budget;
            break;
          case 'spent':
            aValue = a.spent;
            bValue = b.spent;
            break;
          case 'variance':
            aValue = a.analysis.variance;
            bValue = b.analysis.variance;
            break;
          case 'utilization':
            aValue = a.analysis.utilization;
            bValue = b.analysis.utilization;
            break;
          default:
            return 0;
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return processed;
  }, [filters, sortConfig]);
  // --- Summary Statistics ---
  const summaryStats = useMemo(() => {
    const totalBudget = reportRows.reduce((sum, r) => sum + r.budget, 0);
    const totalSpent = reportRows.reduce((sum, r) => sum + r.spent, 0);
    const totalVariance = totalBudget - totalSpent;
    const overallUtilization = totalSpent / totalBudget * 100;
    const healthyCount = reportRows.filter(
      (r) => r.analysis.status === 'healthy'
    ).length;
    const warningCount = reportRows.filter(
      (r) => r.analysis.status === 'warning'
    ).length;
    const criticalCount = reportRows.filter(
      (r) => r.analysis.status === 'critical'
    ).length;
    const overspentCount = reportRows.filter(
      (r) => r.analysis.status === 'overspent'
    ).length;
    const totalLastYearSpent = reportRows.reduce(
      (sum, r) => sum + (r.lastYearSpent || 0),
      0
    );
    const yoyGrowth =
    totalLastYearSpent > 0 ?
    (totalSpent - totalLastYearSpent) / totalLastYearSpent * 100 :
    0;
    return {
      totalBudget,
      totalSpent,
      totalVariance,
      overallUtilization,
      healthyCount,
      warningCount,
      criticalCount,
      overspentCount,
      yoyGrowth,
      avgUtilization:
      reportRows.length > 0 ?
      reportRows.reduce((sum, r) => sum + r.analysis.utilization, 0) /
      reportRows.length :
      0
    };
  }, [reportRows]);
  // Get unique values for filters
  const uniqueDepartments = useMemo(
    () => Array.from(new Set(BUDGET_DATA.map((item) => item.dept))),
    []
  );
  const uniqueCategories = useMemo(
    () =>
    Array.from(
      new Set(BUDGET_DATA.map((item) => item.category).filter(Boolean))
    ),
    []
  );
  // --- Event Handlers ---
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return {
          key,
          direction: 'desc'
        };
      }
      if (current.direction === 'desc') {
        return {
          key,
          direction: 'asc'
        };
      }
      return null;
    });
  };
  const handleResetFilters = () => {
    setFilters({
      fiscalYear: '2024-2025',
      department: 'All Departments',
      category: 'All Categories',
      status: 'All Status',
      searchTerm: ''
    });
    setSortConfig(null);
  };
  const handleExport = (format: 'excel' | 'pdf') => {
    alert(
      `Exporting report as ${format.toUpperCase()}... (Feature in development)`
    );
  };
  const SortIcon = ({ columnKey }: {columnKey: string;}) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <ChevronDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />);

    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-3 h-3 text-indigo-600" /> :

    <ChevronDown className="w-3 h-3 text-indigo-600" />;

  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <MinusCircle className="w-4 h-4 text-amber-600" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'overspent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className="w-3 h-3 text-red-500" />;
      case 'decreasing':
        return <ArrowDownRight className="w-3 h-3 text-green-500" />;
      case 'stable':
        return <Minus className="w-3 h-3 text-gray-500" />;
      default:
        return null;
    }
  };
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen max-w-[1800px] mx-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
            Budget vs Actual Performance Analysis
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Comprehensive variance analysis with real-time tracking across
            departments, categories, and expense heads
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="bg-white">

            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="bg-white">

            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="bg-white">

            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <ReportFilters />

      {/* Enhanced Filters Section */}
      <Card className="p-6 border-2 border-gray-200 shadow-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Filters & Controls
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gray-600 hover:text-gray-900">

              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
              setViewMode(viewMode === 'table' ? 'cards' : 'table')
              }
              className="text-gray-600 hover:text-gray-900">

              {viewMode === 'table' ?
              <PieChart className="w-4 h-4 mr-2" /> :

              <BarChart3 className="w-4 h-4 mr-2" />
              }
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Fiscal Year */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <Calendar className="w-3 h-3" />
              Fiscal Year
            </label>
            <select
              value={filters.fiscalYear}
              onChange={(e) =>
              setFilters({
                ...filters,
                fiscalYear: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <Building2 className="w-3 h-3" />
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) =>
              setFilters({
                ...filters,
                department: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All Departments">All Departments</option>
              {uniqueDepartments.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <FileText className="w-3 h-3" />
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All Categories">All Categories</option>
              {uniqueCategories.map((cat) =>
              <option key={cat} value={cat}>
                  {cat}
                </option>
              )}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <Activity className="w-3 h-3" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value
              })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm font-medium">

              <option value="All Status">All Status</option>
              <option value="Healthy">Healthy (Under 80%)</option>
              <option value="Warning">Warning (80-95%)</option>
              <option value="Critical">Critical (95-100%)</option>
              <option value="Overspent">Overspent (Over 100%)</option>
            </select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <Search className="w-3 h-3" />
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expense heads..."
                value={filters.searchTerm}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  searchTerm: e.target.value
                })
                }
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />

              {filters.searchTerm &&
              <button
                onClick={() =>
                setFilters({
                  ...filters,
                  searchTerm: ''
                })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2">

                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              }
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.department !== 'All Departments' ||
        filters.category !== 'All Categories' ||
        filters.status !== 'All Status' ||
        filters.searchTerm) &&
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500">
              Active Filters:
            </span>
            {filters.department !== 'All Departments' &&
          <Badge variant="secondary" className="text-xs">
                Dept: {filters.department}
                <button
              onClick={() =>
              setFilters({
                ...filters,
                department: 'All Departments'
              })
              }
              className="ml-1">

                  <X className="w-3 h-3" />
                </button>
              </Badge>
          }
            {filters.category !== 'All Categories' &&
          <Badge variant="secondary" className="text-xs">
                Category: {filters.category}
                <button
              onClick={() =>
              setFilters({
                ...filters,
                category: 'All Categories'
              })
              }
              className="ml-1">

                  <X className="w-3 h-3" />
                </button>
              </Badge>
          }
            {filters.status !== 'All Status' &&
          <Badge variant="secondary" className="text-xs">
                Status: {filters.status}
                <button
              onClick={() =>
              setFilters({
                ...filters,
                status: 'All Status'
              })
              }
              className="ml-1">

                  <X className="w-3 h-3" />
                </button>
              </Badge>
          }
            {filters.searchTerm &&
          <Badge variant="secondary" className="text-xs">
                Search: "{filters.searchTerm}"
                <button
              onClick={() =>
              setFilters({
                ...filters,
                searchTerm: ''
              })
              }
              className="ml-1">

                  <X className="w-3 h-3" />
                </button>
              </Badge>
          }
          </div>
        }
      </Card>

      {/* Enhanced Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Allocated */}
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Allocated
            </Badge>
          </div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            Total Budget
          </p>
          <p className="text-3xl font-black text-gray-900">
            ₹{summaryStats.totalBudget.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Across {reportRows.length} expense heads
          </p>
        </Card>

        {/* Total Spent */}
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Actual
            </Badge>
          </div>
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            Total Spent
          </p>
          <p className="text-3xl font-black text-gray-900">
            ₹{summaryStats.totalSpent.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(
              summaryStats.yoyGrowth > 5 ?
              'increasing' :
              summaryStats.yoyGrowth < -5 ?
              'decreasing' :
              'stable'
            )}
            <p
              className={`text-xs font-semibold ${summaryStats.yoyGrowth > 0 ? 'text-red-600' : 'text-green-600'}`}>

              {summaryStats.yoyGrowth > 0 ? '+' : ''}
              {summaryStats.yoyGrowth.toFixed(1)}% YoY
            </p>
          </div>
        </Card>

        {/* Total Variance */}
        <Card
          className={`p-5 bg-gradient-to-br ${summaryStats.totalVariance >= 0 ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-rose-50 border-red-200'} hover:shadow-xl transition-all duration-300 group`}>

          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-3 ${summaryStats.totalVariance >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-xl group-hover:scale-110 transition-transform`}>

              {summaryStats.totalVariance >= 0 ?
              <TrendingDown className="w-6 h-6 text-green-600" /> :

              <TrendingUp className="w-6 h-6 text-red-600" />
              }
            </div>
            <Badge
              variant={
              summaryStats.totalVariance >= 0 ? 'success' : 'destructive'
              }
              className="text-xs">

              {summaryStats.totalVariance >= 0 ? 'Under Budget' : 'Over Budget'}
            </Badge>
          </div>
          <p
            className={`text-xs font-bold ${summaryStats.totalVariance >= 0 ? 'text-green-700' : 'text-red-700'} uppercase tracking-wider mb-1`}>

            Net Variance
          </p>
          <p
            className={`text-3xl font-black ${summaryStats.totalVariance >= 0 ? 'text-green-900' : 'text-red-900'}`}>

            {summaryStats.totalVariance >= 0 ? '+' : '-'} ₹
            {Math.abs(summaryStats.totalVariance).toLocaleString('en-IN')}
          </p>
          <p
            className={`text-xs ${summaryStats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>

            {summaryStats.totalVariance >= 0 ? 'Savings' : 'Overspend'} amount
          </p>
        </Card>

        {/* Overall Utilization */}
        <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6 text-amber-600" />
            </div>
            <Badge variant="warning" className="text-xs">
              Utilization
            </Badge>
          </div>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            Overall Used
          </p>
          <p className="text-3xl font-black text-gray-900">
            {summaryStats.overallUtilization.toFixed(1)}%
          </p>
          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-1000 ${summaryStats.overallUtilization > 100 ? 'bg-red-500' : summaryStats.overallUtilization >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{
                width: `${Math.min(summaryStats.overallUtilization, 100)}%`
              }} />

          </div>
        </Card>
      </div>

      {/* Status Distribution Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-2 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-xs font-bold text-green-700 uppercase">
                  Healthy
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {summaryStats.healthyCount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Under 80%</p>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mt-1">
                <span className="text-lg font-bold text-green-600">
                  {reportRows.length > 0 ?
                  Math.round(
                    summaryStats.healthyCount / reportRows.length * 100
                  ) :
                  0}
                  %
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-2 border-amber-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MinusCircle className="w-4 h-4 text-amber-600" />
                <p className="text-xs font-bold text-amber-700 uppercase">
                  Warning
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {summaryStats.warningCount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">80-95%</p>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mt-1">
                <span className="text-lg font-bold text-amber-600">
                  {reportRows.length > 0 ?
                  Math.round(
                    summaryStats.warningCount / reportRows.length * 100
                  ) :
                  0}
                  %
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-bold text-orange-700 uppercase">
                  Critical
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {summaryStats.criticalCount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">95-100%</p>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                <span className="text-lg font-bold text-orange-600">
                  {reportRows.length > 0 ?
                  Math.round(
                    summaryStats.criticalCount / reportRows.length * 100
                  ) :
                  0}
                  %
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-2 border-red-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase">
                  Overspent
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {summaryStats.overspentCount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Over 100%</p>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mt-1">
                <span className="text-lg font-bold text-red-600">
                  {reportRows.length > 0 ?
                  Math.round(
                    summaryStats.overspentCount / reportRows.length * 100
                  ) :
                  0}
                  %
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Data Table/Cards View */}
      {viewMode === 'table' ?
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden bg-white">
          <div className="p-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Detailed Variance Analysis
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {reportRows.length} of {BUDGET_DATA.length} expense
                  heads
                </p>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={() =>
              setShowQuarterlyBreakdown(!showQuarterlyBreakdown)
              }
              className="text-indigo-600">

                {showQuarterlyBreakdown ?
              <EyeOff className="w-4 h-4 mr-2" /> :

              <Eye className="w-4 h-4 mr-2" />
              }
                {showQuarterlyBreakdown ? 'Hide' : 'Show'} Quarterly Data
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left">
                    <button
                    onClick={() => handleSort('head')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 group">

                      Expense Head
                      <SortIcon columnKey="head" />
                    </button>
                  </th>
                  <th className="p-4 text-right">
                    <button
                    onClick={() => handleSort('budget')}
                    className="flex items-center gap-2 ml-auto text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 group">

                      Budget
                      <SortIcon columnKey="budget" />
                    </button>
                  </th>
                  <th className="p-4 text-right">
                    <button
                    onClick={() => handleSort('spent')}
                    className="flex items-center gap-2 ml-auto text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 group">

                      Actual Spent
                      <SortIcon columnKey="spent" />
                    </button>
                  </th>
                  <th className="p-4 text-right">
                    <button
                    onClick={() => handleSort('variance')}
                    className="flex items-center gap-2 ml-auto text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 group">

                      Variance
                      <SortIcon columnKey="variance" />
                    </button>
                  </th>
                  <th className="p-4">
                    <button
                    onClick={() => handleSort('utilization')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 group">

                      Utilization & Status
                      <SortIcon columnKey="utilization" />
                    </button>
                  </th>
                  <th className="p-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reportRows.map((row, index) =>
              <Fragment key={row.id}>
                    <tr
                  className={`
                        hover:bg-gray-50 transition-colors
                        ${expandedRows.has(row.id) ? 'bg-indigo-50' : ''}
                        ${index % 2 === 0 ? 'bg-gray-50/30' : ''}
                      `}>

                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-900 text-sm">
                            {row.head}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                          variant="secondary"
                          className="text-[10px] bg-blue-50 text-blue-700">

                              {row.dept}
                            </Badge>
                            {row.category &&
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-purple-50 text-purple-700">

                                {row.category}
                              </Badge>
                        }
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{row.budget.toLocaleString('en-IN')}
                        </p>
                        {row.lastYearSpent &&
                    <p className="text-xs text-gray-400 mt-1">
                            LY: ₹{row.lastYearSpent.toLocaleString('en-IN')}
                          </p>
                    }
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{row.spent.toLocaleString('en-IN')}
                        </p>
                        {row.lastYearSpent &&
                    <div className="flex items-center justify-end gap-1 mt-1">
                            {getTrendIcon(row.analysis.trend)}
                            <span
                        className={`text-xs font-semibold ${row.analysis.trend === 'increasing' ? 'text-red-600' : row.analysis.trend === 'decreasing' ? 'text-green-600' : 'text-gray-500'}`}>

                              {(
                        (row.spent - row.lastYearSpent) /
                        row.lastYearSpent *
                        100).
                        toFixed(1)}
                              %
                            </span>
                          </div>
                    }
                      </td>
                      <td
                    className={`p-4 text-right text-sm font-black ${row.analysis.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>

                        <div className="flex items-center justify-end gap-1">
                          {row.analysis.variance < 0 ?
                      <AlertTriangle className="w-4 h-4" /> :

                      <CheckCircle2 className="w-4 h-4" />
                      }
                          <span>
                            {row.analysis.variance < 0 ? '-' : '+'} ₹
                            {Math.abs(row.analysis.variance).toLocaleString(
                          'en-IN'
                        )}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-normal mt-1">
                          (
                          {(row.analysis.variance / row.budget * 100).toFixed(
                        1
                      )}
                          %)
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(row.analysis.status)}
                              <span
                            className={`text-xs font-bold ${row.analysis.textColor}`}>

                                {row.analysis.utilization.toFixed(1)}%
                              </span>
                            </div>
                            {row.analysis.utilization > 100 &&
                        <Badge
                          variant="destructive"
                          className="text-[10px]">

                                Overspent
                              </Badge>
                        }
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                          className={`h-full transition-all duration-500 ${row.analysis.statusColor}`}
                          style={{
                            width: `${Math.min(row.analysis.utilization, 100)}%`
                          }} />

                          </div>
                          {row.budgetHolder &&
                      <p className="text-[10px] text-gray-500">
                              Owner: {row.budgetHolder}
                            </p>
                      }
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(row.id)}
                      className="hover:bg-indigo-50">

                          {expandedRows.has(row.id) ?
                      <ChevronUp className="w-4 h-4 text-indigo-600" /> :

                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded Row Details */}
                    {expandedRows.has(row.id) &&
                <tr className="bg-indigo-50 border-l-4 border-l-indigo-500">
                        <td colSpan={6} className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-5 h-5 text-indigo-600" />
                              <h4 className="text-sm font-bold text-indigo-900">
                                Detailed Analysis for {row.head}
                              </h4>
                            </div>

                            {/* Quarterly Breakdown */}
                            {showQuarterlyBreakdown &&
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                                <h5 className="text-xs font-bold text-gray-900 uppercase mb-3">
                                  Quarterly Spending Pattern
                                </h5>
                                <div className="grid grid-cols-4 gap-3">
                                  {[
                          {
                            label: 'Q1',
                            amount: row.quarter1
                          },
                          {
                            label: 'Q2',
                            amount: row.quarter2
                          },
                          {
                            label: 'Q3',
                            amount: row.quarter3
                          },
                          {
                            label: 'Q4',
                            amount: row.quarter4
                          }].
                          map((quarter, i) =>
                          <div
                            key={i}
                            className="text-center p-3 bg-gray-50 rounded-lg">

                                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                                        {quarter.label}
                                      </p>
                                      <p className="text-sm font-bold text-gray-900">
                                        ₹
                                        {quarter.amount?.toLocaleString(
                                'en-IN'
                              ) || 0}
                                      </p>
                                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                                        <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${quarter.amount && row.budget ? quarter.amount / row.budget * 400 : 0}%`
                                }} />

                                      </div>
                                    </div>
                          )}
                                </div>
                              </div>
                      }

                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                                  Budget Holder
                                </p>
                                <p className="text-sm text-gray-900 font-medium">
                                  {row.budgetHolder || 'Not assigned'}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                                  Year-over-Year Change
                                </p>
                                <div className="flex items-center gap-2">
                                  {row.lastYearSpent &&
                            <>
                                      {getTrendIcon(row.analysis.trend)}
                                      <span
                                className={`text-sm font-bold ${row.analysis.trend === 'increasing' ? 'text-red-600' : row.analysis.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'}`}>

                                        {(
                                (row.spent - row.lastYearSpent) /
                                row.lastYearSpent *
                                100).
                                toFixed(1)}
                                        %
                                      </span>
                                    </>
                            }
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {row.notes &&
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                  <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-amber-900 mb-1">
                                      Notes:
                                    </p>
                                    <p className="text-xs text-amber-800">
                                      {row.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                      }
                          </div>
                        </td>
                      </tr>
                }
                  </Fragment>
              )}
              </tbody>

              {/* Table Footer with Totals */}
              <tfoot className="bg-gray-900 text-white sticky bottom-0">
                <tr>
                  <td className="p-4">
                    <p className="text-sm font-black uppercase">
                      Total ({reportRows.length} items)
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-sm font-bold">
                      ₹{summaryStats.totalBudget.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-sm font-bold">
                      ₹{summaryStats.totalSpent.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td
                  className={`p-4 text-right text-sm font-bold ${summaryStats.totalVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>

                    {summaryStats.totalVariance >= 0 ? '+' : '-'} ₹
                    {Math.abs(summaryStats.totalVariance).toLocaleString(
                    'en-IN'
                  )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {summaryStats.overallUtilization.toFixed(1)}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${summaryStats.overallUtilization > 100 ? 'bg-red-500' : summaryStats.overallUtilization >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{
                          width: `${Math.min(summaryStats.overallUtilization, 100)}%`
                        }} />

                      </div>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {reportRows.length === 0 &&
        <div className="text-center py-16">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-500 mb-2">
                No Data Found
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                No expense heads match your current filters
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
        }
        </Card> /* Card View */ :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportRows.map((row) =>
        <Card
          key={row.id}
          className="p-5 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">
                    {row.head}
                  </h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {row.dept}
                    </Badge>
                    {row.category &&
                <Badge variant="secondary" className="text-[10px]">
                        {row.category}
                      </Badge>
                }
                  </div>
                </div>
                {getStatusIcon(row.analysis.status)}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Budget:</span>
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{row.budget.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Spent:</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{row.spent.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Variance:</span>
                  <span
                className={`text-sm font-black ${row.analysis.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                    {row.analysis.variance >= 0 ? '+' : '-'} ₹
                    {Math.abs(row.analysis.variance).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span
                  className={`text-xs font-bold ${row.analysis.textColor}`}>

                      {row.analysis.utilization.toFixed(1)}% Utilized
                    </span>
                    {row.analysis.utilization > 100 &&
                <Badge variant="destructive" className="text-[10px]">
                        Overspent
                      </Badge>
                }
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                  className={`h-full transition-all duration-500 ${row.analysis.statusColor}`}
                  style={{
                    width: `${Math.min(row.analysis.utilization, 100)}%`
                  }} />

                  </div>
                </div>

                {row.budgetHolder &&
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Owner: {row.budgetHolder}
                  </div>
            }
              </div>
            </Card>
        )}
        </div>
      }

      {/* Legend & Help Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">
              Budget Status Legend
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              Color-coded indicators help identify spending patterns at a glance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-green-200">
            <div className="w-4 h-4 rounded-full bg-green-500 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Healthy</p>
              <p className="text-[10px] text-gray-500">Under 80% used</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-200">
            <div className="w-4 h-4 rounded-full bg-amber-500 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Warning</p>
              <p className="text-[10px] text-gray-500">80% - 95% used</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-orange-200">
            <div className="w-4 h-4 rounded-full bg-orange-500 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Critical</p>
              <p className="text-[10px] text-gray-500">95% - 100% used</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-200">
            <div className="w-4 h-4 rounded-full bg-red-500 shrink-0"></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Overspent</p>
              <p className="text-[10px] text-gray-500">Over 100% used</p>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}