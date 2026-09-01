import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Mail,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreVertical,
  Bell,
  FileSpreadsheet } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface ClassFeeData {
  id: string;
  class: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  activeStudents: number;
  totalDemand: number;
  concession: number;
  netDemand: number;
  collected: number;
  advance: number;
  balance: number;
  defaultersCount: number;
  partialPayersCount: number;
  fullPaidCount: number;
  collectionRate: number;
  lastUpdated: string;
  feeType: string;
}
interface FilterState {
  academicYear: string;
  class: string;
  section: string;
  feeType: string;
  collectionStatus: string;
  month: string;
  quarter: string;
  minCollectionRate: string;
  maxCollectionRate: string;
  searchQuery: string;
  showDefaultersOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
const INITIAL_FILTERS: FilterState = {
  academicYear: '2024-2025',
  class: '',
  section: '',
  feeType: '',
  collectionStatus: '',
  month: '',
  quarter: '',
  minCollectionRate: '',
  maxCollectionRate: '',
  searchQuery: '',
  showDefaultersOnly: false,
  sortBy: 'class',
  sortOrder: 'asc'
};
const ACADEMIC_YEARS = [
{
  value: '2024-2025',
  label: '2024-2025'
},
{
  value: '2023-2024',
  label: '2023-2024'
},
{
  value: '2022-2023',
  label: '2022-2023'
}];

const CLASSES = [
{
  value: '',
  label: 'All Classes'
},
{
  value: 'nursery',
  label: 'Nursery'
},
{
  value: 'lkg',
  label: 'LKG'
},
{
  value: 'ukg',
  label: 'UKG'
},
{
  value: '1',
  label: 'Class 1'
},
{
  value: '2',
  label: 'Class 2'
},
{
  value: '3',
  label: 'Class 3'
},
{
  value: '4',
  label: 'Class 4'
},
{
  value: '5',
  label: 'Class 5'
},
{
  value: '6',
  label: 'Class 6'
},
{
  value: '7',
  label: 'Class 7'
},
{
  value: '8',
  label: 'Class 8'
},
{
  value: '9',
  label: 'Class 9'
},
{
  value: '10',
  label: 'Class 10'
},
{
  value: '11',
  label: 'Class 11'
},
{
  value: '12',
  label: 'Class 12'
}];

const SECTIONS = [
{
  value: '',
  label: 'All Sections'
},
{
  value: 'A',
  label: 'Section A'
},
{
  value: 'B',
  label: 'Section B'
},
{
  value: 'C',
  label: 'Section C'
},
{
  value: 'D',
  label: 'Section D'
},
{
  value: 'E',
  label: 'Section E'
}];

const FEE_TYPES = [
{
  value: '',
  label: 'All Fee Types'
},
{
  value: 'tuition',
  label: 'Tuition Fee'
},
{
  value: 'transport',
  label: 'Transport Fee'
},
{
  value: 'hostel',
  label: 'Hostel Fee'
},
{
  value: 'exam',
  label: 'Examination Fee'
},
{
  value: 'library',
  label: 'Library Fee'
},
{
  value: 'lab',
  label: 'Laboratory Fee'
},
{
  value: 'sports',
  label: 'Sports Fee'
},
{
  value: 'annual',
  label: 'Annual Fee'
},
{
  value: 'admission',
  label: 'Admission Fee'
}];

const COLLECTION_STATUS = [
{
  value: '',
  label: 'All Status'
},
{
  value: 'excellent',
  label: 'Excellent (>90%)'
},
{
  value: 'good',
  label: 'Good (70-90%)'
},
{
  value: 'average',
  label: 'Average (50-70%)'
},
{
  value: 'poor',
  label: 'Poor (<50%)'
}];

const MONTHS = [
{
  value: '',
  label: 'All Months'
},
{
  value: 'april',
  label: 'April'
},
{
  value: 'may',
  label: 'May'
},
{
  value: 'june',
  label: 'June'
},
{
  value: 'july',
  label: 'July'
},
{
  value: 'august',
  label: 'August'
},
{
  value: 'september',
  label: 'September'
},
{
  value: 'october',
  label: 'October'
},
{
  value: 'november',
  label: 'November'
},
{
  value: 'december',
  label: 'December'
},
{
  value: 'january',
  label: 'January'
},
{
  value: 'february',
  label: 'February'
},
{
  value: 'march',
  label: 'March'
}];

const QUARTERS = [
{
  value: '',
  label: 'All Quarters'
},
{
  value: 'q1',
  label: 'Q1 (Apr-Jun)'
},
{
  value: 'q2',
  label: 'Q2 (Jul-Sep)'
},
{
  value: 'q3',
  label: 'Q3 (Oct-Dec)'
},
{
  value: 'q4',
  label: 'Q4 (Jan-Mar)'
}];

const COLLECTION_RATE_OPTIONS = [
{
  value: '',
  label: 'Any'
},
{
  value: '0',
  label: '0%'
},
{
  value: '25',
  label: '25%'
},
{
  value: '50',
  label: '50%'
},
{
  value: '75',
  label: '75%'
},
{
  value: '90',
  label: '90%'
},
{
  value: '100',
  label: '100%'
}];

const SORT_OPTIONS = [
{
  value: 'class',
  label: 'Class Name'
},
{
  value: 'students',
  label: 'Total Students'
},
{
  value: 'demand',
  label: 'Total Demand'
},
{
  value: 'collected',
  label: 'Amount Collected'
},
{
  value: 'balance',
  label: 'Balance Amount'
},
{
  value: 'collectionRate',
  label: 'Collection Rate'
},
{
  value: 'defaulters',
  label: 'Defaulters Count'
}];

// Sample data
const CLASS_FEE_DATA: ClassFeeData[] = [
{
  id: '1',
  class: '10',
  section: 'A',
  classTeacher: 'Mrs. Sharma',
  totalStudents: 45,
  activeStudents: 44,
  totalDemand: 4500000,
  concession: 150000,
  netDemand: 4350000,
  collected: 3500000,
  advance: 50000,
  balance: 800000,
  defaultersCount: 12,
  partialPayersCount: 8,
  fullPaidCount: 24,
  collectionRate: 80.5,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '2',
  class: '10',
  section: 'B',
  classTeacher: 'Mr. Verma',
  totalStudents: 42,
  activeStudents: 42,
  totalDemand: 4200000,
  concession: 100000,
  netDemand: 4100000,
  collected: 3800000,
  advance: 25000,
  balance: 275000,
  defaultersCount: 5,
  partialPayersCount: 4,
  fullPaidCount: 33,
  collectionRate: 92.7,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '3',
  class: '9',
  section: 'A',
  classTeacher: 'Mrs. Gupta',
  totalStudents: 40,
  activeStudents: 39,
  totalDemand: 4000000,
  concession: 200000,
  netDemand: 3800000,
  collected: 2000000,
  advance: 0,
  balance: 1800000,
  defaultersCount: 25,
  partialPayersCount: 10,
  fullPaidCount: 4,
  collectionRate: 52.6,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '4',
  class: '9',
  section: 'B',
  classTeacher: 'Mr. Singh',
  totalStudents: 38,
  activeStudents: 38,
  totalDemand: 3800000,
  concession: 80000,
  netDemand: 3720000,
  collected: 3200000,
  advance: 30000,
  balance: 490000,
  defaultersCount: 8,
  partialPayersCount: 6,
  fullPaidCount: 24,
  collectionRate: 86.0,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '5',
  class: '8',
  section: 'A',
  classTeacher: 'Mrs. Patel',
  totalStudents: 44,
  activeStudents: 43,
  totalDemand: 3960000,
  concession: 120000,
  netDemand: 3840000,
  collected: 3600000,
  advance: 45000,
  balance: 195000,
  defaultersCount: 4,
  partialPayersCount: 5,
  fullPaidCount: 34,
  collectionRate: 93.8,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '6',
  class: '8',
  section: 'B',
  classTeacher: 'Mr. Kumar',
  totalStudents: 41,
  activeStudents: 40,
  totalDemand: 3690000,
  concession: 90000,
  netDemand: 3600000,
  collected: 2500000,
  advance: 15000,
  balance: 1085000,
  defaultersCount: 18,
  partialPayersCount: 12,
  fullPaidCount: 10,
  collectionRate: 69.4,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '7',
  class: '7',
  section: 'A',
  classTeacher: 'Mrs. Reddy',
  totalStudents: 46,
  activeStudents: 45,
  totalDemand: 3680000,
  concession: 100000,
  netDemand: 3580000,
  collected: 3400000,
  advance: 60000,
  balance: 120000,
  defaultersCount: 3,
  partialPayersCount: 4,
  fullPaidCount: 38,
  collectionRate: 95.0,
  lastUpdated: '2024-01-15',
  feeType: 'All'
},
{
  id: '8',
  class: '6',
  section: 'A',
  classTeacher: 'Mr. Joshi',
  totalStudents: 48,
  activeStudents: 48,
  totalDemand: 3360000,
  concession: 60000,
  netDemand: 3300000,
  collected: 1500000,
  advance: 0,
  balance: 1800000,
  defaultersCount: 30,
  partialPayersCount: 8,
  fullPaidCount: 10,
  collectionRate: 45.5,
  lastUpdated: '2024-01-15',
  feeType: 'All'
}];

export function ClasswiseFeeStatus() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  // Filter handlers
  const handleFilterChange = (
  key: keyof FilterState,
  value: string | boolean) =>
  {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };
  const handleApplyFilters = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const handleSelectAll = () => {
    if (selectedRows.length === CLASS_FEE_DATA.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(CLASS_FEE_DATA.map((item) => item.id));
    }
  };
  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  // Get collection status badge
  const getCollectionStatusBadge = (rate: number) => {
    if (rate >= 90) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Excellent
        </Badge>);

    } else if (rate >= 70) {
      return (
        <Badge variant="info" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Good
        </Badge>);

    } else if (rate >= 50) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Average
        </Badge>);

    } else {
      return (
        <Badge variant="danger" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Poor
        </Badge>);

    }
  };
  // Table columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={selectedRows.length === CLASS_FEE_DATA.length}
      onChange={handleSelectAll}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />,


    render: (row: ClassFeeData) =>
    <input
      type="checkbox"
      checked={selectedRows.includes(row.id)}
      onChange={() => handleSelectRow(row.id)}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />


  },
  {
    key: 'class',
    header: 'Class & Section',
    render: (row: ClassFeeData) =>
    <div>
          <span className="font-bold text-gray-900">
            Class {row.class}-{row.section}
          </span>
          <p className="text-xs text-gray-500">{row.classTeacher}</p>
        </div>

  },
  {
    key: 'students',
    header: 'Students',
    render: (row: ClassFeeData) =>
    <div className="text-center">
          <span className="font-semibold text-gray-900">
            {row.activeStudents}
          </span>
          <span className="text-gray-500">/{row.totalStudents}</span>
          <p className="text-xs text-gray-400">Active/Total</p>
        </div>

  },
  {
    key: 'demand',
    header: 'Total Demand',
    render: (row: ClassFeeData) =>
    <div>
          <span className="font-medium text-gray-900">
            ₹{row.totalDemand.toLocaleString()}
          </span>
          {row.concession > 0 &&
      <p className="text-xs text-orange-500">
              -₹{row.concession.toLocaleString()} concession
            </p>
      }
        </div>

  },
  {
    key: 'netDemand',
    header: 'Net Demand',
    render: (row: ClassFeeData) =>
    <span className="font-semibold text-gray-900">
          ₹{row.netDemand.toLocaleString()}
        </span>

  },
  {
    key: 'collected',
    header: 'Collected',
    render: (row: ClassFeeData) =>
    <div>
          <span className="font-semibold text-green-600">
            ₹{row.collected.toLocaleString()}
          </span>
          {row.advance > 0 &&
      <p className="text-xs text-blue-500">
              +₹{row.advance.toLocaleString()} advance
            </p>
      }
        </div>

  },
  {
    key: 'balance',
    header: 'Balance',
    render: (row: ClassFeeData) =>
    <span className="font-semibold text-red-600">
          ₹{row.balance.toLocaleString()}
        </span>

  },
  {
    key: 'collectionRate',
    header: 'Collection %',
    render: (row: ClassFeeData) =>
    <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">{row.collectionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
          className={`h-2 rounded-full transition-all ${row.collectionRate >= 90 ? 'bg-green-500' : row.collectionRate >= 70 ? 'bg-blue-500' : row.collectionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{
            width: `${row.collectionRate}%`
          }} />

          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ClassFeeData) =>
    getCollectionStatusBadge(row.collectionRate)
  },
  {
    key: 'breakdown',
    header: 'Payment Breakdown',
    render: (row: ClassFeeData) =>
    <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" title="Full Paid">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">{row.fullPaidCount}</span>
          </div>
          <div className="flex items-center gap-1" title="Partial Paid">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600">
              {row.partialPayersCount}
            </span>
          </div>
          <div className="flex items-center gap-1" title="Defaulters">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">{row.defaultersCount}</span>
          </div>
        </div>

  },
  {
    key: 'defaulters',
    header: 'Defaulters',
    render: (row: ClassFeeData) =>
    <Badge
      variant={
      row.defaultersCount > 15 ?
      'danger' :
      row.defaultersCount > 8 ?
      'warning' :
      'success'
      }>

          {row.defaultersCount} students
        </Badge>

  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    render: (row: ClassFeeData) =>
    <span className="text-sm text-gray-500">{row.lastUpdated}</span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ClassFeeData) =>
    <div className="relative">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" title="View Details">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="View Defaulters">
              <Users className="w-4 h-4" />
            </Button>
            <Button
          variant="ghost"
          size="sm"
          title="More Actions"
          onClick={() =>
          setShowActionMenu(showActionMenu === row.id ? null : row.id)
          }>

              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {showActionMenu === row.id &&
      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Reminders
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notify Parents
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Summary
              </button>
            </div>
      }
        </div>

  }];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Classwise Fee Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive summary of fee collection and dues organized by class
            and section
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleApplyFilters}
            disabled={isLoading}>

            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />

            Refresh
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}>

              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showExportMenu &&
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as Excel
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Report
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Search & Filter Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select
              label="Academic Year"
              value={filters.academicYear}
              onChange={(e) =>
              handleFilterChange('academicYear', e.target.value)
              }
              options={ACADEMIC_YEARS} />


            <Select
              label="Class"
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              options={CLASSES} />


            <Select
              label="Section"
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              options={SECTIONS} />


            <Select
              label="Fee Type"
              value={filters.feeType}
              onChange={(e) => handleFilterChange('feeType', e.target.value)}
              options={FEE_TYPES} />


            <Select
              label="Collection Status"
              value={filters.collectionStatus}
              onChange={(e) =>
              handleFilterChange('collectionStatus', e.target.value)
              }
              options={COLLECTION_STATUS} />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search class, teacher..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                  handleFilterChange('searchQuery', e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">

              <Filter className="w-4 h-4" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              {showAdvancedFilters ?
              <ChevronUp className="w-4 h-4" /> :

              <ChevronDown className="w-4 h-4" />
              }
            </button>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showDefaultersOnly}
                  onChange={(e) =>
                  handleFilterChange('showDefaultersOnly', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Show Defaulters Only
                </span>
              </label>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters &&
          <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Select
                label="Month"
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                options={MONTHS} />


                <Select
                label="Quarter"
                value={filters.quarter}
                onChange={(e) =>
                handleFilterChange('quarter', e.target.value)
                }
                options={QUARTERS} />


                <Select
                label="Min Collection %"
                value={filters.minCollectionRate}
                onChange={(e) =>
                handleFilterChange('minCollectionRate', e.target.value)
                }
                options={COLLECTION_RATE_OPTIONS} />


                <Select
                label="Max Collection %"
                value={filters.maxCollectionRate}
                onChange={(e) =>
                handleFilterChange('maxCollectionRate', e.target.value)
                }
                options={COLLECTION_RATE_OPTIONS} />


                <Select
                label="Sort By"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                options={SORT_OPTIONS} />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <button
                  onClick={toggleSortOrder}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">

                    <span className="text-sm">
                      {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </span>
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          }

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold">{CLASS_FEE_DATA.length}</span>{' '}
              classes
              {selectedRows.length > 0 &&
              <span className="ml-2">
                  |{' '}
                  <span className="font-semibold text-blue-600">
                    {selectedRows.length}
                  </span>{' '}
                  selected
                </span>
              }
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                disabled={isLoading}>

                {isLoading ?
                <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </> :

                <>
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </>
                }
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions (when rows are selected) */}
      {selectedRows.length > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedRows.length} class(es) selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Send Bulk Reminders
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Generate Combined Report
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print Selected
              </Button>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}>

                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={columns} data={CLASS_FEE_DATA} />
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-500">
              Showing 1 to {CLASS_FEE_DATA.length} of {CLASS_FEE_DATA.length}{' '}
              entries
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded bg-blue-600 text-white text-sm font-medium">
                  1
                </button>
              </div>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-500">per page</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">Excellent (≥90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600">Good (70-89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600">Average (50-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">Poor (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Full Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">Partial Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">Defaulters</span>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}