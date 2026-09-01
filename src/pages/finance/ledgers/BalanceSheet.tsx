import React, { useMemo, useState } from 'react';
// File: pages/finance/ledgers/BalanceSheet.tsx

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Calendar,
  Building,
  Users,
  X,
  Check,
  Scale,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  AlertTriangle } from
'lucide-react';
const branchOptions = [
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
},
{
  id: 'west',
  name: 'West Branch'
}];

const batchOptions = [
{
  value: 'all',
  label: 'All Batches'
},
{
  value: '2024-25',
  label: '2024-25'
},
{
  value: '2023-24',
  label: '2023-24'
},
{
  value: '2022-23',
  label: '2022-23'
}];

// Balance Sheet data: Assets (Dr) vs Liabilities + Capital (Cr)
const balanceSheetData = {
  assets: {
    title: 'Assets',
    sections: [
    {
      title: 'Fixed Assets',
      items: [
      {
        name: 'Building',
        branches: {
          main: 2000000,
          north: 1200000,
          south: 1000000,
          east: 500000,
          west: 300000
        }
      },
      {
        name: 'Furniture & Fixtures',
        branches: {
          main: 200000,
          north: 125000,
          south: 100000,
          east: 100000,
          west: 50000
        }
      },
      {
        name: 'Computer Equipment',
        branches: {
          main: 175000,
          north: 100000,
          south: 100000,
          east: 60000,
          west: 40000
        }
      },
      {
        name: 'Lab Equipment',
        branches: {
          main: 400000,
          north: 250000,
          south: 200000,
          east: 100000,
          west: 50000
        }
      },
      {
        name: 'Vehicles',
        branches: {
          main: 500000,
          north: 300000,
          south: 200000,
          east: 100000,
          west: 100000
        }
      }]

    },
    {
      title: 'Current Assets',
      items: [
      {
        name: 'Cash in Hand',
        branches: {
          main: 30000,
          north: 20000,
          south: 25000,
          east: 10000,
          west: 5000
        }
      },
      {
        name: 'Cash at Bank - HDFC',
        branches: {
          main: 150000,
          north: 100000,
          south: 80000,
          east: 40000,
          west: 30000
        }
      },
      {
        name: 'Cash at Bank - SBI',
        branches: {
          main: 75000,
          north: 40000,
          south: 30000,
          east: 20000,
          west: 10000
        }
      },
      {
        name: 'Student Fees Receivable',
        branches: {
          main: 200000,
          north: 150000,
          south: 120000,
          east: 80000,
          west: 50000
        }
      },
      {
        name: 'Accounts Receivable',
        branches: {
          main: 75000,
          north: 40000,
          south: 30000,
          east: 20000,
          west: 10000
        }
      }]

    },
    {
      title: 'Prepaid & Other Assets',
      items: [
      {
        name: 'Prepaid Insurance',
        branches: {
          main: 20000,
          north: 12000,
          south: 8000,
          east: 5000,
          west: 3000
        }
      },
      {
        name: 'Prepaid Rent',
        branches: {
          main: 30000,
          north: 20000,
          south: 15000,
          east: 10000,
          west: 5000
        }
      }]

    }]

  },
  liabilitiesAndCapital: {
    title: 'Liabilities & Capital',
    sections: [
    {
      title: 'Capital & Reserves',
      items: [
      {
        name: 'Capital Account',
        branches: {
          main: 2000000,
          north: 1200000,
          south: 1000000,
          east: 500000,
          west: 300000
        }
      },
      {
        name: 'Reserves & Surplus',
        branches: {
          main: 700000,
          north: 450000,
          south: 350000,
          east: 170000,
          west: 80000
        }
      },
      {
        name: 'Retained Earnings',
        branches: {
          main: 300000,
          north: 200000,
          south: 160000,
          east: 90000,
          west: 50000
        }
      }]

    },
    {
      title: 'Long-term Liabilities',
      items: [
      {
        name: 'Bank Loan - HDFC',
        branches: {
          main: 800000,
          north: 500000,
          south: 300000,
          east: 150000,
          west: 50000
        }
      },
      {
        name: 'Equipment Loan',
        branches: {
          main: 150000,
          north: 100000,
          south: 80000,
          east: 50000,
          west: 20000
        }
      }]

    },
    {
      title: 'Current Liabilities',
      items: [
      {
        name: 'Accounts Payable',
        branches: {
          main: 50000,
          north: 30000,
          south: 25000,
          east: 12000,
          west: 8000
        }
      },
      {
        name: 'Salaries Payable',
        branches: {
          main: 80000,
          north: 50000,
          south: 35000,
          east: 20000,
          west: 10000
        }
      },
      {
        name: 'Security Deposits',
        branches: {
          main: 150000,
          north: 100000,
          south: 80000,
          east: 45000,
          west: 25000
        }
      },
      {
        name: 'Advance Fees Received',
        branches: {
          main: 250000,
          north: 180000,
          south: 140000,
          east: 80000,
          west: 50000
        }
      },
      {
        name: 'TDS Payable',
        branches: {
          main: 8000,
          north: 4000,
          south: 3000,
          east: 2000,
          west: 1000
        }
      },
      {
        name: 'GST Payable',
        branches: {
          main: 22000,
          north: 12000,
          south: 10000,
          east: 5000,
          west: 3000
        }
      },
      {
        name: 'PF Payable',
        branches: {
          main: 12000,
          north: 7000,
          south: 5000,
          east: 3000,
          west: 1000
        }
      }]

    }]

  }
};
type BranchKey = 'main' | 'north' | 'south' | 'east' | 'west';
export function BalanceSheet() {
  const [asOnDate, setAsOnDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
  'main',
  'north',
  'south',
  'east',
  'west']
  );
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'assets-Fixed Assets',
  'assets-Current Assets',
  'assets-Prepaid & Other Assets',
  'liabilities-Capital & Reserves',
  'liabilities-Long-term Liabilities',
  'liabilities-Current Liabilities']
  );
  const toggleBranch = (id: string) => {
    setSelectedBranches((prev) =>
    prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };
  const toggleSection = (key: string) => {
    setExpandedSections((prev) =>
    prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const getItemTotal = (item: {branches: Record<string, number>;}) =>
  selectedBranches.reduce(
    (sum, b) => sum + (item.branches[b as BranchKey] || 0),
    0
  );
  const getSectionTotal = (section: {
    items: {
      branches: Record<string, number>;
    }[];
  }) => section.items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const getSideTotal = (side: typeof balanceSheetData.assets) =>
  side.sections.reduce((sum, section) => sum + getSectionTotal(section), 0);
  const { assetsTotal, liabilitiesTotal, isBalanced, difference } =
  useMemo(() => {
    const a = getSideTotal(balanceSheetData.assets);
    const l = getSideTotal(balanceSheetData.liabilitiesAndCapital);
    return {
      assetsTotal: a,
      liabilitiesTotal: l,
      isBalanced: a === l,
      difference: Math.abs(a - l)
    };
  }, [selectedBranches]);
  const fmt = (n: number) => n === 0 ? '—' : `₹${n.toLocaleString('en-IN')}`;
  const branchTotals = useMemo(() => {
    const result: Record<
      string,
      {
        assets: number;
        liabilities: number;
      }> =
    {};
    selectedBranches.forEach((b) => {
      let assets = 0,
        liabilities = 0;
      balanceSheetData.assets.sections.forEach((s) =>
      s.items.forEach((i) => {
        assets += i.branches[b as BranchKey] || 0;
      })
      );
      balanceSheetData.liabilitiesAndCapital.sections.forEach((s) =>
      s.items.forEach((i) => {
        liabilities += i.branches[b as BranchKey] || 0;
      })
      );
      result[b] = {
        assets,
        liabilities
      };
    });
    return result;
  }, [selectedBranches]);
  const renderSide = (
  side:
  typeof balanceSheetData.assets |
  typeof balanceSheetData.liabilitiesAndCapital,
  sideKey: 'assets' | 'liabilities') =>

  <div className="flex-1 min-w-0">
      <div
      className={`px-4 py-3 font-bold text-white text-base ${sideKey === 'assets' ? 'bg-blue-700' : 'bg-purple-700'}`}>

        {side.title}
      </div>
      {side.sections.map((section) => {
      const key = `${sideKey}-${section.title}`;
      const isOpen = expandedSections.includes(key);
      const sectionTotal = getSectionTotal(section);
      return (
        <div key={section.title} className="border-b border-gray-200">
            {/* Section header */}
            <button
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors ${sideKey === 'assets' ? 'text-blue-800 bg-blue-50' : 'text-purple-800 bg-purple-50'}`}
            onClick={() => toggleSection(key)}>

              <span className="flex items-center gap-2">
                {isOpen ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                {section.title}
              </span>
              <span className="font-bold">{fmt(sectionTotal)}</span>
            </button>
            {/* Items */}
            {isOpen &&
          section.items.map((item, idx) => {
            const total = getItemTotal(item);
            return (
              <div key={idx} className="border-t border-gray-100">
                    {/* Consolidated row */}
                    <div className="flex items-center justify-between px-6 py-2 hover:bg-gray-50">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {fmt(total)}
                      </span>
                    </div>
                    {/* Branch breakdown */}
                    {selectedBranches.length > 1 &&
                <div className="px-8 pb-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
                        {selectedBranches.map((b) => {
                    const val = item.branches[b as BranchKey] || 0;
                    const branch = branchOptions.find((br) => br.id === b);
                    return (
                      <div
                        key={b}
                        className="flex items-center justify-between text-xs text-gray-500">

                              <span className="truncate">{branch?.name}</span>
                              <span className="ml-2 text-gray-600">
                                {fmt(val)}
                              </span>
                            </div>);

                  })}
                      </div>
                }
                  </div>);

          })}
            {/* Section subtotal */}
            {isOpen &&
          <div
            className={`flex items-center justify-between px-4 py-2 text-sm font-semibold border-t ${sideKey === 'assets' ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'}`}>

                <span>Subtotal — {section.title}</span>
                <span>{fmt(sectionTotal)}</span>
              </div>
          }
          </div>);

    })}
      {/* Side total */}
      <div
      className={`flex items-center justify-between px-4 py-3 font-bold text-white text-base ${sideKey === 'assets' ? 'bg-blue-600' : 'bg-purple-600'}`}>

        <span>Total {side.title}</span>
        <span>
          {fmt(sideKey === 'assets' ? assetsTotal : liabilitiesTotal)}
        </span>
      </div>
    </div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Statement of financial position as on selected date
          </p>
        </div>
        <div className="flex gap-2">
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
            Export
          </Button>
        </div>
      </div>

      {/* Balance Status */}
      <Card
        className={`p-4 ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${isBalanced ? 'bg-green-500' : 'bg-red-500'}`}>

              {isBalanced ?
              <CheckCircle className="w-5 h-5 text-white" /> :

              <AlertTriangle className="w-5 h-5 text-white" />
              }
            </div>
            <div>
              <p
                className={`font-semibold ${isBalanced ? 'text-green-800' : 'text-red-800'}`}>

                {isBalanced ?
                'Balance Sheet is Balanced' :
                'Warning: Balance Sheet Mismatch!'}
              </p>
              <p
                className={`text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>

                {isBalanced ?
                'Assets = Liabilities + Capital' :
                `Difference of ₹${difference.toLocaleString('en-IN')}`}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Assets</p>
              <p className="text-xl font-bold text-blue-600">
                {fmt(assetsTotal)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Liabilities + Capital</p>
              <p className="text-xl font-bold text-purple-600">
                {fmt(liabilitiesTotal)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Multi-select Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building className="w-4 h-4 inline mr-1" />
              Branch (Multi-Select)
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-60 px-3 py-2 border rounded-lg bg-white text-left flex items-center justify-between text-sm">

                <span className="truncate">
                  {selectedBranches.length === branchOptions.length ?
                  'All Branches' :
                  selectedBranches.length === 0 ?
                  'No Branch Selected' :
                  `${selectedBranches.length} branch(es) selected`}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {showBranchDropdown &&
              <div className="absolute z-20 w-60 mt-1 bg-white border rounded-lg shadow-lg">
                  <div className="flex justify-between px-3 py-2 border-b text-xs">
                    <button
                    className="text-blue-600 font-medium"
                    onClick={() =>
                    setSelectedBranches(branchOptions.map((b) => b.id))
                    }>

                      Select All
                    </button>
                    <button
                    className="text-gray-500"
                    onClick={() => setSelectedBranches([])}>

                      Clear
                    </button>
                  </div>
                  <div className="py-1">
                    {branchOptions.map((branch) =>
                  <label
                    key={branch.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">

                        <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedBranches.includes(branch.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>

                          {selectedBranches.includes(branch.id) &&
                      <Check className="w-3 h-3 text-white" />
                      }
                        </div>
                        <span className="text-sm">{branch.name}</span>
                      </label>
                  )}
                  </div>
                  <div className="p-2 border-t">
                    <button
                    onClick={() => setShowBranchDropdown(false)}
                    className="w-full py-1.5 bg-blue-600 text-white text-sm rounded-lg">

                      Done
                    </button>
                  </div>
                </div>
              }
            </div>
            {selectedBranches.length > 0 &&
            selectedBranches.length < branchOptions.length &&
            <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBranches.map((id) =>
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">

                      {branchOptions.find((b) => b.id === id)?.name}
                      <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleBranch(id)} />

                    </span>
              )}
                </div>
            }
          </div>

          {/* Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Batch
            </label>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              options={batchOptions}
              className="w-36" />

          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              As On Date
            </label>
            <Input
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              className="w-40" />

          </div>

          <Button variant="primary" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Generate
          </Button>
        </div>
      </Card>

      {/* Branch-wise Summary */}
      {selectedBranches.length > 1 &&
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {selectedBranches.map((b) => {
          const branch = branchOptions.find((br) => br.id === b);
          const totals = branchTotals[b];
          const balanced = totals.assets === totals.liabilities;
          return (
            <Card key={b} className="p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  {branch?.name}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Assets
                    </span>
                    <span className="font-medium text-blue-600">
                      {fmt(totals.assets)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Liab+Cap
                    </span>
                    <span className="font-medium text-purple-600">
                      {fmt(totals.liabilities)}
                    </span>
                  </div>
                  <div
                  className={`text-center text-[10px] font-medium mt-1 rounded px-1 py-0.5 ${balanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                    {balanced ? '✓ Balanced' : '✗ Mismatch'}
                  </div>
                </div>
              </Card>);

        })}
        </div>
      }

      {/* Balance Sheet Table */}
      <Card className="overflow-hidden">
        {/* Report Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Balance Sheet</h2>
              <p className="text-sm text-gray-300">
                As on{' '}
                {new Date(asOnDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            {selectedBranches.length === branchOptions.length ?
            'All Branches' :
            `${selectedBranches.length} Branch(es)`}
            {' | '}Batch: {selectedBatch === 'all' ? 'All' : selectedBatch}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex divide-x divide-gray-200">
          {renderSide(balanceSheetData.assets, 'assets')}
          {renderSide(balanceSheetData.liabilitiesAndCapital, 'liabilities')}
        </div>

        {/* Grand Total Footer */}
        <div
          className={`px-6 py-4 flex items-center justify-between text-white font-bold text-base ${isBalanced ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>

          <div className="flex items-center gap-2">
            {isBalanced ?
            <CheckCircle className="w-5 h-5" /> :

            <AlertTriangle className="w-5 h-5" />
            }
            <span>GRAND TOTAL</span>
          </div>
          <div className="flex gap-12">
            <span>Assets: {fmt(assetsTotal)}</span>
            <span>Liabilities + Capital: {fmt(liabilitiesTotal)}</span>
          </div>
        </div>
      </Card>

      {/* Footer Info */}
      <Card className="p-3 bg-gray-50">
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 gap-3">
          <span>
            <FileText className="w-4 h-4 inline mr-1" />
            <b>Generated:</b> {new Date().toLocaleString('en-IN')}
          </span>
          <span>
            <Building className="w-4 h-4 inline mr-1" />
            <b>Branches:</b>{' '}
            {selectedBranches.length === branchOptions.length ?
            'All' :
            selectedBranches.
            map((b) => branchOptions.find((br) => br.id === b)?.name).
            join(', ')}
          </span>
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            <b>Batch:</b> {selectedBatch === 'all' ? 'All' : selectedBatch}
          </span>
          <span>
            <Calendar className="w-4 h-4 inline mr-1" />
            <b>As On:</b> {new Date(asOnDate).toLocaleDateString('en-IN')}
          </span>
          <span
            className={
            isBalanced ?
            'text-green-600 font-medium' :
            'text-red-600 font-medium'
            }>

            {isBalanced ? '✓ Balanced' : '✗ Unbalanced'}
          </span>
        </div>
      </Card>
    </div>);

}