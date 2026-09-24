import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ArrowUpCircle,
  Download,
  ToggleLeft,
  ToggleRight,
  History,
  FileText,
  Users,
  Package,
  Calendar,
  DollarSign,
  Zap } from
'lucide-react';
const STATUS_CONFIG = {
  Active: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    dot: 'bg-green-500'
  },
  Trial: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
    dot: 'bg-blue-500'
  },
  Suspended: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: AlertCircle,
    dot: 'bg-amber-500'
  },
  Expired: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    dot: 'bg-red-500'
  }
};
const activeModules = [
{
  name: 'Student Management',
  cost: 0,
  included: true
},
{
  name: 'Finance & Fees',
  cost: 0,
  included: true
},
{
  name: 'Assessment',
  cost: 2500,
  included: false
},
{
  name: 'HR & Payroll',
  cost: 3500,
  included: false
},
{
  name: 'Timetable',
  cost: 1500,
  included: false
},
{
  name: 'Communications',
  cost: 1200,
  included: false
}];

export function SubscriptionOverview() {
  const [status] = useState<keyof typeof STATUS_CONFIG>('Active');
  const StatusIcon = STATUS_CONFIG[status].icon;
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your ERP plan, modules, and billing cycle
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            View Plan History
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Agreement
          </Button>
          <Button variant="primary">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${STATUS_CONFIG[status].color}`}>

        <span
          className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[status].dot} animate-pulse`} />

        <StatusIcon className="w-5 h-5" />
        <span className="font-semibold text-base">
          Subscription Status: {status}
        </span>
        <span className="ml-auto text-sm opacity-75">
          Last verified: Today, 09:00 AM
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          icon: Package,
          label: 'Current Plan',
          value: 'EduManager Pro',
          sub: 'Yearly Billing',
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        },
        {
          icon: Users,
          label: 'Active Students',
          value: '1,248',
          sub: '₹45 per student/month',
          color: 'text-green-600',
          bg: 'bg-green-50'
        },
        {
          icon: Calendar,
          label: 'Next Billing Date',
          value: '01 Aug 2025',
          sub: '32 days remaining',
          color: 'text-purple-600',
          bg: 'bg-purple-50'
        },
        {
          icon: DollarSign,
          label: 'Next Invoice Est.',
          value: '₹1,24,800',
          sub: 'Before GST',
          color: 'text-orange-600',
          bg: 'bg-orange-50'
        }].
        map((m, i) =>
        <Card key={i}>
            <div className="flex items-start gap-3 p-1">
              <div className={`p-2.5 rounded-lg ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {m.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Details */}
        <Card title="Plan Details">
          <div className="space-y-3">
            {[
            {
              label: 'Plan Name',
              value: 'EduManager Pro'
            },
            {
              label: 'Billing Cycle',
              value: 'Yearly (12 months)'
            },
            {
              label: 'Per Student Price',
              value: '₹45 / student / month'
            },
            {
              label: 'Contract Start Date',
              value: '01 Aug 2024'
            },
            {
              label: 'Contract End Date',
              value: '31 Jul 2025'
            },
            {
              label: 'Billing Currency',
              value: 'INR (₹)'
            }].
            map((row, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">

                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-semibold text-gray-800">
                  {row.value}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Active Modules */}
        <Card
          title="Active Modules"
          headerAction={
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {activeModules.filter((m) => m.included || true).length} active
            </span>
          }>

          <div className="space-y-2">
            {activeModules.map((mod, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">

                <div className="flex items-center gap-2.5">
                  <Zap
                  className={`w-4 h-4 ${mod.included ? 'text-green-500' : 'text-blue-500'}`} />

                  <span className="text-sm font-medium text-gray-700">
                    {mod.name}
                  </span>
                  {mod.included &&
                <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                      Included
                    </span>
                }
                </div>
                <div className="flex items-center gap-2">
                  {!mod.included &&
                <span className="text-xs text-gray-500">
                      ₹{mod.cost.toLocaleString()}/yr
                    </span>
                }
                  <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                    Deactivate
                  </button>
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100">
              <Button variant="outline" className="w-full text-sm">
                <Package className="w-4 h-4 mr-2" />
                Activate New Module
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}