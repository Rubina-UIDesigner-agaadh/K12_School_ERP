import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import {
  Users,
  Zap,
  TrendingUp,
  BarChart2,
  DollarSign,
  MessageSquare,
  HardDrive } from
'lucide-react';
const monthlyData = [
{
  month: 'Feb',
  students: 1180,
  amount: 53100
},
{
  month: 'Mar',
  students: 1195,
  amount: 53775
},
{
  month: 'Apr',
  students: 1210,
  amount: 54450
},
{
  month: 'May',
  students: 1220,
  amount: 54900
},
{
  month: 'Jun',
  students: 1235,
  amount: 55575
},
{
  month: 'Jul',
  students: 1248,
  amount: 56160
}];

const moduleBreakdown = [
{
  name: 'Student Management',
  cost: 0,
  type: 'Included',
  color: 'bg-gray-200',
  pct: 0
},
{
  name: 'Finance & Fees',
  cost: 0,
  type: 'Included',
  color: 'bg-gray-200',
  pct: 0
},
{
  name: 'Assessment',
  cost: 2500,
  type: 'Add-on',
  color: 'bg-blue-500',
  pct: 28
},
{
  name: 'HR & Payroll',
  cost: 3500,
  type: 'Add-on',
  color: 'bg-purple-500',
  pct: 39
},
{
  name: 'Timetable',
  cost: 1500,
  type: 'Add-on',
  color: 'bg-green-500',
  pct: 17
},
{
  name: 'Communications',
  cost: 1200,
  type: 'Add-on',
  color: 'bg-orange-500',
  pct: 13
},
{
  name: 'SMS Credits',
  cost: 300,
  type: 'Usage',
  color: 'bg-pink-500',
  pct: 3
}];

const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
export function UsageInsights() {
  const [period, setPeriod] = useState('last-6-months');
  const baseErpCost = 56160;
  const moduleCost = 8700 + 300;
  const usageCost = 300;
  const total = baseErpCost + moduleCost;
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage Insights</h1>
          <p className="text-sm text-gray-500 mt-1">
            Transparent breakdown of your bill calculation
          </p>
        </div>
        <Select
          options={[
          {
            value: 'last-6-months',
            label: 'Last 6 Months'
          },
          {
            value: 'last-3-months',
            label: 'Last 3 Months'
          },
          {
            value: 'this-year',
            label: 'This Year'
          }]
          }
          value={period}
          onChange={setPeriod}
          className="w-44" />

      </div>

      {/* Bill Formula */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
        <p className="text-sm font-medium text-blue-200 mb-3">
          Current Month Bill Calculation
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {[
          {
            label: 'Base ERP Cost',
            value: `₹${baseErpCost.toLocaleString()}`,
            sub: '1,248 students × ₹45'
          },
          {
            op: '+'
          },
          {
            label: 'Module Cost',
            value: `₹${(moduleCost - usageCost).toLocaleString()}`,
            sub: '4 add-on modules'
          },
          {
            op: '+'
          },
          {
            label: 'Usage Cost',
            value: `₹${usageCost.toLocaleString()}`,
            sub: 'SMS & storage'
          },
          {
            op: '='
          },
          {
            label: 'Total Payable',
            value: `₹${total.toLocaleString()}`,
            sub: 'Before GST (18%)',
            highlight: true
          }].
          map((item, i) =>
          'op' in item ?
          <span key={i} className="text-2xl font-light text-blue-300">
                {item.op}
              </span> :

          <div
            key={i}
            className={`flex-1 min-w-[120px] rounded-lg p-3 ${item.highlight ? 'bg-white/20 ring-2 ring-white/40' : 'bg-white/10'}`}>

                <p className="text-xs text-blue-200">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-[11px] text-blue-300 mt-0.5">{item.sub}</p>
              </div>

          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Usage */}
        <Card title="Student Usage Trend">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
              {
                icon: Users,
                label: 'Current Active',
                value: '1,248',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: TrendingUp,
                label: 'MoM Growth',
                value: '+13',
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                icon: DollarSign,
                label: 'Projected Next',
                value: '₹57,600',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              }].
              map((s, i) =>
              <div key={i} className={`rounded-lg p-3 ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                </div>
              )}
            </div>
            {/* Bar Chart */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-3">
                Monthly Billing Trend (₹)
              </p>
              <div className="flex items-end gap-2 h-32">
                {monthlyData.map((d, i) =>
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1">

                    <span className="text-[10px] text-gray-400">
                      {(d.amount / 1000).toFixed(0)}k
                    </span>
                    <div
                    className="w-full rounded-t-md bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{
                      height: `${d.amount / maxAmount * 90}%`
                    }}
                    title={`₹${d.amount.toLocaleString()}`} />

                    <span className="text-[10px] text-gray-500">{d.month}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Module Cost Breakdown */}
        <Card title="Module-wise Cost Breakdown">
          <div className="space-y-3">
            {moduleBreakdown.
            filter((m) => m.cost > 0).
            map((mod, i) =>
            <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                    className={`w-2.5 h-2.5 rounded-full ${mod.color}`} />

                      <span className="text-gray-700 font-medium">
                        {mod.name}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                        {mod.type}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ₹{mod.cost.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                  className={`h-full ${mod.color} rounded-full transition-all`}
                  style={{
                    width: `${mod.pct}%`
                  }} />

                  </div>
                </div>
            )}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                Total Module Cost
              </span>
              <span className="text-base font-bold text-gray-900">
                ₹{moduleCost.toLocaleString()}/yr
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage-Based Consumption */}
      <Card title="Usage-Based Consumption">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
          {
            icon: MessageSquare,
            label: 'SMS Credits Used',
            used: 2840,
            total: 5000,
            color: 'bg-pink-500',
            cost: '₹284'
          },
          {
            icon: HardDrive,
            label: 'Storage Used',
            used: 12.4,
            total: 50,
            unit: 'GB',
            color: 'bg-indigo-500',
            cost: '₹0'
          },
          {
            icon: Zap,
            label: 'API Calls',
            used: 48200,
            total: 100000,
            unit: '',
            color: 'bg-amber-500',
            cost: '₹0'
          }].
          map((item, i) =>
          <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <item.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-bold text-gray-900">
                  {item.used.toLocaleString()}
                  {item.unit || ''}
                </span>
                <span className="text-xs text-gray-400">
                  / {item.total.toLocaleString()}
                  {item.unit || ''}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                className={`h-full ${item.color} rounded-full`}
                style={{
                  width: `${Number(item.used) / item.total * 100}%`
                }} />

              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {Math.round(Number(item.used) / item.total * 100)}% used
                </span>
                <span className="font-medium text-gray-700">{item.cost}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}