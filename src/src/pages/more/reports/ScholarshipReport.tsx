import React from 'react';
import { ReportPageTemplate } from './ReportPageTemplate';
import { GiftIcon, ShieldIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
export function ScholarshipReport() {
  return (
    <ReportPageTemplate
      pageTitle="Scholarship Reports"
      pageDescription="Scholarship disbursement, category-wise (RTE/EWS/Minority/Merit), pending applications and renewal reports"
      reportCategories={[
      {
        id: 'disbursement',
        label: 'Disbursement Reports',
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        icon: <GiftIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'disbursement-summary',
          name: 'Scholarship Disbursement Summary',
          description:
          'Total scholarships disbursed with amount and beneficiaries',
          tags: ['Disbursement', 'Summary'],
          isFeatured: true
        },
        {
          id: 'monthly-disbursement',
          name: 'Monthly Disbursement Report',
          description: 'Month-wise scholarship disbursement details',
          tags: ['Monthly', 'Disbursement']
        }]

      },
      {
        id: 'category',
        label: 'Category-wise Reports',
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        icon: <ShieldIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'rte-scholarship',
          name: 'RTE Scholarship Report',
          description: 'Scholarships under RTE 25% quota',
          tags: ['RTE', 'Scholarship'],
          isFeatured: true,
          isNew: true
        },
        {
          id: 'ews-scholarship',
          name: 'EWS Scholarship Report',
          description: 'EWS category scholarship beneficiaries',
          tags: ['EWS', 'Scholarship']
        },
        {
          id: 'minority-scholarship',
          name: 'Minority Scholarship Report',
          description:
          'Scholarships for religious and linguistic minorities',
          tags: ['Minority', 'Scholarship']
        },
        {
          id: 'merit-scholarship',
          name: 'Merit Scholarship Report',
          description:
          'Merit-based scholarship recipients with performance',
          tags: ['Merit', 'Performance']
        },
        {
          id: 'sc-st-scholarship',
          name: 'SC/ST Scholarship Report',
          description: 'Scholarships for SC and ST category students',
          tags: ['SC', 'ST', 'Scholarship']
        }]

      },
      {
        id: 'pending',
        label: 'Pending Applications',
        color: 'bg-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <ClockIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'pending-applications',
          name: 'Pending Scholarship Applications',
          description: 'Applications awaiting approval or documentation',
          tags: ['Pending', 'Applications']
        },
        {
          id: 'incomplete-docs',
          name: 'Incomplete Documentation Report',
          description: 'Applications with missing documents',
          tags: ['Documents', 'Incomplete']
        }]

      },
      {
        id: 'renewal',
        label: 'Renewal Reports',
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        icon: <TrendingUpIcon className="w-4 h-4" />,
        reports: [
        {
          id: 'renewal-due',
          name: 'Scholarship Renewal Due Report',
          description: 'Scholarships due for renewal in current year',
          tags: ['Renewal', 'Due']
        },
        {
          id: 'renewal-status',
          name: 'Renewal Status Report',
          description:
          'Status of scholarship renewals — renewed, lapsed, pending',
          tags: ['Renewal', 'Status']
        }]

      }]
      }
      liveStats={[
      {
        label: 'Active Scholarships',
        value: '186',
        subtitle: 'Current beneficiaries',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-100',
        icon: <GiftIcon className="w-4 h-4" />
      },
      {
        label: 'Amount Disbursed',
        value: '₹12.4L',
        subtitle: 'This academic year',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-100',
        icon: <TrendingUpIcon className="w-4 h-4" />
      },
      {
        label: 'RTE Beneficiaries',
        value: '104',
        subtitle: 'RTE 25% quota',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-100',
        icon: <ShieldIcon className="w-4 h-4" />
      },
      {
        label: 'EWS Beneficiaries',
        value: '62',
        subtitle: 'EWS category',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-100',
        icon: <ShieldIcon className="w-4 h-4" />
      }]
      } />);


}