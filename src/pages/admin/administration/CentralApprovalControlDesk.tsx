// CentralApprovalControlDesk.tsx - Comprehensive Approval Workflow Management System
import React, { useState, Fragment } from 'react';
import {
  Plus,
  Copy,
  Save,
  ArrowRight,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  BarChart2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  TrendingUp,
  Activity,
  Layers,
  GitBranch,
  Play,
  Pause,
  MoreVertical,
  History,
  Info,
  Zap,
  Shield,
  UserCheck,
  ClipboardList,
  Send,
  RotateCcw,
  Lock,
  Unlock,
  ArrowUpRight,
  Timer,
  Target,
  Award } from
'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface Workflow {
  id: string;
  name: string;
  description: string;
  processType: string;
  category: string;
  steps: number;
  status: 'Active' | 'Inactive' | 'Draft';
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  createdBy: string;
  lastModified: string;
  totalApprovals: number;
  pendingApprovals: number;
  avgApprovalTime: string;
}

interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  approverType: 'Role' | 'User' | 'Manager' | 'Committee';
  approver: string;
  escalationDays: number;
  reminderDays: number;
  autoApprove: boolean;
  autoReject: boolean;
  parallelApproval: boolean;
  requiredApprovers: number;
  conditions: string[];
  actions: string[];
}

interface PendingApproval {
  id: string;
  requestId: string;
  workflow: string;
  requester: string;
  requesterDept: string;
  subject: string;
  amount?: number;
  submittedDate: string;
  currentStep: number;
  totalSteps: number;
  currentApprover: string;
  status: 'Pending' | 'In Review' | 'Escalated' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  daysOverdue: number;
}

interface ApprovalHistory {
  id: string;
  requestId: string;
  workflow: string;
  requester: string;
  subject: string;
  status: 'Approved' | 'Rejected' | 'Cancelled';
  processedDate: string;
  processedBy: string;
  duration: string;
  steps: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  usageCount: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const WORKFLOWS: Workflow[] = [
{
  id: '1',
  name: 'Leave Approval',
  description: 'Employee leave request approval workflow',
  processType: 'HR',
  category: 'Human Resources',
  steps: 3,
  status: 'Active',
  priority: 'Medium',
  createdDate: '15-Jan-2024',
  createdBy: 'Admin',
  lastModified: '20-Mar-2024',
  totalApprovals: 245,
  pendingApprovals: 12,
  avgApprovalTime: '1.5 days'
},
{
  id: '2',
  name: 'Fee Concession Approval',
  description: 'Student fee concession request approval',
  processType: 'Finance',
  category: 'Fee Management',
  steps: 2,
  status: 'Active',
  priority: 'High',
  createdDate: '20-Jan-2024',
  createdBy: 'Finance Admin',
  lastModified: '18-Mar-2024',
  totalApprovals: 89,
  pendingApprovals: 5,
  avgApprovalTime: '2.3 days'
},
{
  id: '3',
  name: 'TC Issue Approval',
  description: 'Transfer Certificate issuance approval',
  processType: 'Academic',
  category: 'Student Records',
  steps: 3,
  status: 'Active',
  priority: 'High',
  createdDate: '25-Jan-2024',
  createdBy: 'Academic Admin',
  lastModified: '15-Mar-2024',
  totalApprovals: 156,
  pendingApprovals: 8,
  avgApprovalTime: '3.1 days'
},
{
  id: '4',
  name: 'Expense Reimbursement',
  description: 'Staff expense reimbursement approval',
  processType: 'Finance',
  category: 'Accounts',
  steps: 2,
  status: 'Inactive',
  priority: 'Medium',
  createdDate: '01-Feb-2024',
  createdBy: 'Admin',
  lastModified: '10-Feb-2024',
  totalApprovals: 67,
  pendingApprovals: 0,
  avgApprovalTime: '2.0 days'
},
{
  id: '5',
  name: 'Scholarship Approval',
  description: 'Student scholarship application approval',
  processType: 'Finance',
  category: 'Fee Management',
  steps: 4,
  status: 'Active',
  priority: 'High',
  createdDate: '10-Feb-2024',
  createdBy: 'Academic Admin',
  lastModified: '22-Mar-2024',
  totalApprovals: 45,
  pendingApprovals: 15,
  avgApprovalTime: '5.2 days'
},
{
  id: '6',
  name: 'Purchase Requisition',
  description: 'Asset and material purchase approval',
  processType: 'Procurement',
  category: 'Inventory',
  steps: 3,
  status: 'Active',
  priority: 'Medium',
  createdDate: '15-Feb-2024',
  createdBy: 'Admin',
  lastModified: '20-Mar-2024',
  totalApprovals: 78,
  pendingApprovals: 6,
  avgApprovalTime: '2.8 days'
},
{
  id: '7',
  name: 'Grade Change Request',
  description: 'Student grade modification approval',
  processType: 'Academic',
  category: 'Examination',
  steps: 4,
  status: 'Draft',
  priority: 'High',
  createdDate: '01-Mar-2024',
  createdBy: 'Exam Controller',
  lastModified: '05-Mar-2024',
  totalApprovals: 0,
  pendingApprovals: 0,
  avgApprovalTime: '-'
}];


const WORKFLOW_STEPS: WorkflowStep[] = [
{
  id: '1',
  order: 1,
  name: 'Initial Review',
  approverType: 'Role',
  approver: 'Class Teacher',
  escalationDays: 2,
  reminderDays: 1,
  autoApprove: false,
  autoReject: false,
  parallelApproval: false,
  requiredApprovers: 1,
  conditions: ['Leave days <= 3'],
  actions: ['Send email notification', 'Update leave balance']
},
{
  id: '2',
  order: 2,
  name: 'Department Approval',
  approverType: 'Role',
  approver: 'HOD',
  escalationDays: 3,
  reminderDays: 2,
  autoApprove: false,
  autoReject: false,
  parallelApproval: false,
  requiredApprovers: 1,
  conditions: ['Leave days > 3 AND <= 7'],
  actions: ['Send SMS notification']
},
{
  id: '3',
  order: 3,
  name: 'Final Approval',
  approverType: 'Role',
  approver: 'Principal',
  escalationDays: 5,
  reminderDays: 3,
  autoApprove: true,
  autoReject: false,
  parallelApproval: false,
  requiredApprovers: 1,
  conditions: ['Leave days > 7'],
  actions: ['Generate leave letter', 'Update attendance system']
}];


const PENDING_APPROVALS: PendingApproval[] = [
{
  id: '1',
  requestId: 'LV-2024-0245',
  workflow: 'Leave Approval',
  requester: 'Rahul Kumar',
  requesterDept: 'Science',
  subject: 'Casual Leave - 3 days',
  submittedDate: '22-Mar-2024',
  currentStep: 2,
  totalSteps: 3,
  currentApprover: 'Dr. Sharma (HOD)',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '25-Mar-2024',
  daysOverdue: 0
},
{
  id: '2',
  requestId: 'FC-2024-0089',
  workflow: 'Fee Concession',
  requester: 'Amit Singh (Class 10-A)',
  requesterDept: 'Student',
  subject: 'Fee Concession Request - 25%',
  amount: 15000,
  submittedDate: '20-Mar-2024',
  currentStep: 1,
  totalSteps: 2,
  currentApprover: 'Finance Officer',
  status: 'In Review',
  priority: 'High',
  dueDate: '23-Mar-2024',
  daysOverdue: 2
},
{
  id: '3',
  requestId: 'TC-2024-0156',
  workflow: 'TC Issue',
  requester: 'Priya Verma (Class 12-B)',
  requesterDept: 'Student',
  subject: 'Transfer Certificate Request',
  submittedDate: '18-Mar-2024',
  currentStep: 2,
  totalSteps: 3,
  currentApprover: 'Academic Head',
  status: 'Escalated',
  priority: 'High',
  dueDate: '21-Mar-2024',
  daysOverdue: 4
},
{
  id: '4',
  requestId: 'PR-2024-0078',
  workflow: 'Purchase Requisition',
  requester: 'Lab Coordinator',
  requesterDept: 'Science Lab',
  subject: 'Lab Equipment Purchase',
  amount: 45000,
  submittedDate: '21-Mar-2024',
  currentStep: 1,
  totalSteps: 3,
  currentApprover: 'Store Manager',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '26-Mar-2024',
  daysOverdue: 0
},
{
  id: '5',
  requestId: 'SC-2024-0045',
  workflow: 'Scholarship Approval',
  requester: 'Neha Gupta (Class 11-A)',
  requesterDept: 'Student',
  subject: 'Merit Scholarship Application',
  amount: 30000,
  submittedDate: '15-Mar-2024',
  currentStep: 3,
  totalSteps: 4,
  currentApprover: 'Principal',
  status: 'On Hold',
  priority: 'High',
  dueDate: '25-Mar-2024',
  daysOverdue: 0
}];


const APPROVAL_HISTORY: ApprovalHistory[] = [
{ id: '1', requestId: 'LV-2024-0244', workflow: 'Leave Approval', requester: 'Sunita Devi', subject: 'Medical Leave - 5 days', status: 'Approved', processedDate: '21-Mar-2024', processedBy: 'Principal', duration: '2 days', steps: 3 },
{ id: '2', requestId: 'FC-2024-0088', workflow: 'Fee Concession', requester: 'Ravi Kumar (Class 8-B)', subject: 'Fee Concession - 50%', status: 'Rejected', processedDate: '20-Mar-2024', processedBy: 'Finance Head', duration: '3 days', steps: 2 },
{ id: '3', requestId: 'TC-2024-0155', workflow: 'TC Issue', requester: 'Mohan Lal (Class 10-C)', subject: 'Transfer Certificate', status: 'Approved', processedDate: '19-Mar-2024', processedBy: 'Principal', duration: '4 days', steps: 3 },
{ id: '4', requestId: 'LV-2024-0243', workflow: 'Leave Approval', requester: 'Amit Sharma', subject: 'Casual Leave - 1 day', status: 'Approved', processedDate: '18-Mar-2024', processedBy: 'HOD', duration: '1 day', steps: 2 },
{ id: '5', requestId: 'PR-2024-0077', workflow: 'Purchase Requisition', requester: 'Office Admin', subject: 'Stationery Purchase', status: 'Approved', processedDate: '17-Mar-2024', processedBy: 'Principal', duration: '3 days', steps: 3 },
{ id: '6', requestId: 'SC-2024-0044', workflow: 'Scholarship Approval', requester: 'Anjali Rao (Class 12-A)', subject: 'Sports Scholarship', status: 'Approved', processedDate: '16-Mar-2024', processedBy: 'Committee', duration: '7 days', steps: 4 }];


const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
{ id: '1', name: 'Simple Approval', description: 'Single step approval workflow', category: 'Basic', steps: 1, usageCount: 12 },
{ id: '2', name: 'Two-Level Approval', description: 'Manager and HOD approval', category: 'Standard', steps: 2, usageCount: 25 },
{ id: '3', name: 'Hierarchical Approval', description: 'Multi-level hierarchical approval', category: 'Complex', steps: 4, usageCount: 8 },
{ id: '4', name: 'Committee Approval', description: 'Committee-based decision making', category: 'Special', steps: 3, usageCount: 5 },
{ id: '5', name: 'Financial Approval', description: 'Amount-based conditional approval', category: 'Finance', steps: 3, usageCount: 15 }];


const PROCESS_TYPES = ['All', 'HR', 'Finance', 'Academic', 'Procurement', 'Administration'];
const STATUSES = ['All', 'Active', 'Inactive', 'Draft'];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  title,
  subtitle,
  icon,
  actions,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {title &&
      <div
        className={`px-5 py-4 border-b border-slate-200 flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}>

          <div className="flex items-center gap-3">
            {icon && <div className="text-blue-600">{icon}</div>}
            <div>
              <h3 className="font-semibold text-slate-800">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {collapsible &&
          <button className="p-1 hover:bg-slate-100 rounded">
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </button>
          }
          </div>
        </div>
      }
      {(!collapsible || !isCollapsed) &&
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      }
    </div>);

};

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'purple' | 'pink';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'xs' | 'sm';
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'sm', dot = false }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200'
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    secondary: 'bg-slate-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  const sizeStyles: Record<'xs' | 'sm', string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>);

};

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variantStyles: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500 disabled:opacity-50',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500 disabled:opacity-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 disabled:bg-rose-300'
  };

  const sizeStyles: Record<string, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>

      {children}
    </button>);

};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, size = 'md', actions }) => {
  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeStyles[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {actions && <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">{actions}</div>}
      </div>
    </div>);

};

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{className?: string;}>;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
    {tabs.map((tab) =>
  <button
    key={tab.id}
    onClick={() => onChange(tab.id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
    activeTab === tab.id ?
    'bg-white text-blue-600 shadow-sm' :
    'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`
    }>

        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
        {tab.count !== undefined &&
    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`
    }>
            {tab.count}
          </span>
    }
      </button>
  )}
  </div>;


interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{className?: string;}>;
  trend?: {value: number;positive: boolean;};
  colorScheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'pink';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, colorScheme }) => {
  const colorStyles: Record<string, {bg: string;iconBg: string;icon: string;text: string;}> = {
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', icon: 'text-rose-600', text: 'text-rose-700' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-700' },
    pink: { bg: 'bg-pink-50', iconBg: 'bg-pink-100', icon: 'text-pink-600', text: 'text-pink-700' }
  };

  const colors = colorStyles[colorScheme];

  return (
    <div className={`${colors.bg} rounded-xl p-4 border border-${colorScheme}-100`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {trend &&
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            {trend.value}%
          </div>
        }
      </div>
      <div className="mt-3">
        <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>);

};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
interface WorkflowCardProps {
  workflow: Workflow;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  isSelected: boolean;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onSelect, onEdit, isSelected }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'Active':return 'success';
      case 'Inactive':return 'secondary';
      case 'Draft':return 'warning';
      default:return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string): BadgeVariant => {
    switch (priority) {
      case 'High':return 'danger';
      case 'Medium':return 'warning';
      case 'Low':return 'info';
      default:return 'secondary';
    }
  };

  const getProcessTypeVariant = (type: string): BadgeVariant => {
    switch (type) {
      case 'HR':return 'info';
      case 'Finance':return 'success';
      case 'Academic':return 'purple';
      case 'Procurement':return 'pink';
      default:return 'secondary';
    }
  };

  return (
    <div
      className={`p-4 border rounded-xl transition-all cursor-pointer hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300'}`
      }
      onClick={() => onSelect(workflow.id)}>

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{workflow.name}</h4>
            <Badge variant={getStatusVariant(workflow.status)} size="xs" dot>
              {workflow.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">{workflow.description}</p>
        </div>
        <button
          onClick={(e) => {e.stopPropagation();onEdit(workflow.id);}}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">

          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={getProcessTypeVariant(workflow.processType)} size="xs">{workflow.processType}</Badge>
        <Badge variant={getPriorityVariant(workflow.priority)} size="xs">{workflow.priority}</Badge>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-500">{workflow.steps} steps</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">{workflow.totalApprovals}</p>
          <p className="text-[10px] text-slate-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-600">{workflow.pendingApprovals}</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{workflow.avgApprovalTime}</p>
          <p className="text-[10px] text-slate-500">Avg Time</p>
        </div>
      </div>
    </div>);

};

interface PendingApprovalRowProps {
  approval: PendingApproval;
  onAction: (id: string, action: 'approve' | 'reject' | 'view') => void;
}

const PendingApprovalRow: React.FC<PendingApprovalRowProps> = ({ approval, onAction }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'Pending':return 'warning';
      case 'In Review':return 'info';
      case 'Escalated':return 'danger';
      case 'On Hold':return 'secondary';
      default:return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string): BadgeVariant => {
    switch (priority) {
      case 'High':return 'danger';
      case 'Medium':return 'warning';
      case 'Low':return 'info';
      default:return 'secondary';
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-blue-600 text-sm">{approval.requestId}</p>
          <p className="text-xs text-slate-500">{approval.workflow}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-800 text-sm">{approval.requester}</p>
          <p className="text-xs text-slate-500">{approval.requesterDept}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-slate-800">{approval.subject}</p>
          {approval.amount &&
          <p className="text-xs text-emerald-600 font-medium">₹{approval.amount.toLocaleString()}</p>
          }
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${approval.currentStep / approval.totalSteps * 100}%` }} />

          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {approval.currentStep}/{approval.totalSteps}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{approval.currentApprover}</p>
      </td>
      <td className="px-4 py-3">
        <Badge variant={getStatusVariant(approval.status)} size="xs" dot>
          {approval.status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={getPriorityVariant(approval.priority)} size="xs">
          {approval.priority}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-slate-800">{approval.dueDate}</p>
          {approval.daysOverdue > 0 &&
          <p className="text-xs text-rose-600 font-medium">{approval.daysOverdue} days overdue</p>
          }
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAction(approval.id, 'view')}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details">

            <Eye className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => onAction(approval.id, 'approve')}
            className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Approve">

            <Check className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => onAction(approval.id, 'reject')}
            className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
            title="Reject">

            <X className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </td>
    </tr>);

};

interface WorkflowStepCardProps {
  step: WorkflowStep;
  onUpdate: (id: string, updates: Partial<WorkflowStep>) => void;
  onRemove: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({ step, onUpdate, onRemove, isFirst, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">{step.order}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{step.name}</p>
              <p className="text-xs text-slate-500">{step.approverType}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-slate-100 rounded transition-colors">

              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => onRemove(step.id)}
              className="p-1 hover:bg-rose-100 rounded transition-colors">

              <Trash2 className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Approver</label>
            <select
              value={step.approver}
              onChange={(e) => onUpdate(step.id, { approver: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="Class Teacher">Class Teacher</option>
              <option value="HOD">HOD</option>
              <option value="Principal">Principal</option>
              <option value="Admin">Admin</option>
              <option value="Finance Officer">Finance Officer</option>
              <option value="Academic Head">Academic Head</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Escalation (days)</label>
              <input
                type="number"
                value={step.escalationDays}
                onChange={(e) => onUpdate(step.id, { escalationDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reminder (days)</label>
              <input
                type="number"
                value={step.reminderDays}
                onChange={(e) => onUpdate(step.id, { reminderDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={step.autoApprove}
                onChange={(e) => onUpdate(step.id, { autoApprove: e.target.checked })}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300" />

              <span className="text-xs text-slate-600">Auto Approve</span>
            </label>
            <label className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={step.parallelApproval}
                onChange={(e) => onUpdate(step.id, { parallelApproval: e.target.checked })}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300" />

              <span className="text-xs text-slate-600">Parallel</span>
            </label>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded &&
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Approver Type</label>
              <select
              value={step.approverType}
              onChange={(e) => onUpdate(step.id, { approverType: e.target.value as WorkflowStep['approverType'] })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="Role">Role</option>
                <option value="User">Specific User</option>
                <option value="Manager">Reporting Manager</option>
                <option value="Committee">Committee</option>
              </select>
            </div>

            {step.approverType === 'Committee' &&
          <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Required Approvers</label>
                <input
              type="number"
              value={step.requiredApprovers}
              onChange={(e) => onUpdate(step.id, { requiredApprovers: parseInt(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
          }

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Conditions</label>
              <div className="space-y-1">
                {step.conditions.map((condition, idx) =>
              <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex-1">{condition}</span>
                    <button className="p-0.5 hover:bg-slate-100 rounded">
                      <X className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
              )}
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  + Add Condition
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Actions on Approval</label>
              <div className="space-y-1">
                {step.actions.map((action, idx) =>
              <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full flex-1">{action}</span>
                    <button className="p-0.5 hover:bg-slate-100 rounded">
                      <X className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
              )}
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  + Add Action
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function CentralApprovalControlDesk() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>('1');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(WORKFLOW_STEPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showApprovalDetailModal, setShowApprovalDetailModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);

  // Stats
  const stats = {
    totalWorkflows: WORKFLOWS.length,
    activeWorkflows: WORKFLOWS.filter((w) => w.status === 'Active').length,
    pendingApprovals: PENDING_APPROVALS.length,
    overdueApprovals: PENDING_APPROVALS.filter((a) => a.daysOverdue > 0).length,
    avgProcessingTime: '2.4 days',
    approvalRate: 87
  };

  // Filter workflows
  const filteredWorkflows = WORKFLOWS.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || w.processType === filterType;
    const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Tab configuration
  const tabs: TabItem[] = [
  { id: 'workflows', label: 'Workflows', icon: GitBranch, count: WORKFLOWS.length },
  { id: 'pending', label: 'Pending Approvals', icon: Clock, count: PENDING_APPROVALS.length },
  { id: 'history', label: 'History', icon: History, count: APPROVAL_HISTORY.length },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings }];


  // Workflow step handlers
  const addStep = () => {
    const newStep: WorkflowStep = {
      id: String(Date.now()),
      order: workflowSteps.length + 1,
      name: `Step ${workflowSteps.length + 1}`,
      approverType: 'Role',
      approver: '',
      escalationDays: 3,
      reminderDays: 1,
      autoApprove: false,
      autoReject: false,
      parallelApproval: false,
      requiredApprovers: 1,
      conditions: [],
      actions: []
    };
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const removeStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setWorkflowSteps(workflowSteps.map((s) => s.id === id ? { ...s, ...updates } : s));
  };

  const handleApprovalAction = (id: string, action: 'approve' | 'reject' | 'view') => {
    const approval = PENDING_APPROVALS.find((a) => a.id === id);
    if (approval) {
      setSelectedApproval(approval);
      if (action === 'view') {
        setShowApprovalDetailModal(true);
      }
    }
  };

  const selectedWorkflowData = WORKFLOWS.find((w) => w.id === selectedWorkflow);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Central Approval Control Desk</h1>
            <p className="text-sm text-slate-500">Configure and manage approval workflows across the organization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowTemplateModal(true)}>
            <Copy className="w-4 h-4 mr-2" /> Use Template
          </Button>
          <Button onClick={() => setShowNewWorkflowModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Workflows"
          value={stats.totalWorkflows}
          icon={GitBranch}
          colorScheme="blue" />

        <StatCard
          label="Active Workflows"
          value={stats.activeWorkflows}
          icon={Play}
          colorScheme="emerald" />

        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          colorScheme="amber"
          trend={{ value: 12, positive: false }} />

        <StatCard
          label="Overdue"
          value={stats.overdueApprovals}
          icon={AlertTriangle}
          colorScheme="rose" />

        <StatCard
          label="Avg Processing"
          value={stats.avgProcessingTime}
          icon={Timer}
          colorScheme="purple" />

        <StatCard
          label="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={Target}
          colorScheme="pink"
          trend={{ value: 5, positive: true }} />

      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Workflows Tab */}
      {activeTab === 'workflows' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <Card noPadding>
              <div className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <div className="flex gap-2">
                  <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                    {PROCESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Workflow Cards */}
            <div className="space-y-3 max-h-[600px] overflow-auto pr-1">
              {filteredWorkflows.map((workflow) =>
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onSelect={setSelectedWorkflow}
              onEdit={(id) => console.log('Edit', id)}
              isSelected={workflow.id === selectedWorkflow} />

            )}
              {filteredWorkflows.length === 0 &&
            <div className="text-center py-8 text-slate-500">
                  <GitBranch className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="font-medium">No workflows found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
            }
            </div>
          </div>

          {/* Workflow Configuration */}
          <div className="lg:col-span-2">
            {selectedWorkflowData ?
          <Card
            title={`Configure: ${selectedWorkflowData.name}`}
            subtitle={selectedWorkflowData.description}
            icon={<Settings className="w-5 h-5" />}
            actions={
            <div className="flex items-center gap-2">
                    <Badge variant={selectedWorkflowData.status === 'Active' ? 'success' : 'secondary'} dot>
                      {selectedWorkflowData.status}
                    </Badge>
                  </div>
            }>

                <div className="space-y-6">
                  {/* Workflow Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500">Process Type</p>
                      <p className="font-medium text-slate-800">{selectedWorkflowData.processType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Category</p>
                      <p className="font-medium text-slate-800">{selectedWorkflowData.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Created By</p>
                      <p className="font-medium text-slate-800">{selectedWorkflowData.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Last Modified</p>
                      <p className="font-medium text-slate-800">{selectedWorkflowData.lastModified}</p>
                    </div>
                  </div>

                  {/* Steps Builder */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-slate-800">Approval Steps</h4>
                        <p className="text-xs text-slate-500">Configure the approval sequence</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={addStep}>
                        <Plus className="w-4 h-4 mr-1" /> Add Step
                      </Button>
                    </div>

                    <div className="flex items-start gap-4 overflow-x-auto pb-4 px-1">
                      {workflowSteps.map((step, index) =>
                  <Fragment key={step.id}>
                          <WorkflowStepCard
                      step={step}
                      onUpdate={updateStep}
                      onRemove={removeStep}
                      isFirst={index === 0}
                      isLast={index === workflowSteps.length - 1} />

                          {index < workflowSteps.length - 1 &&
                    <div className="flex-shrink-0 flex items-center h-32">
                              <ArrowRight className="w-6 h-6 text-slate-300" />
                            </div>
                    }
                        </Fragment>
                  )}
                      <button
                    onClick={addStep}
                    className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">

                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Add Step</span>
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Notification Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">Email Notifications</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">Push Notifications</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">SMS Notifications</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex gap-2">
                      {selectedWorkflowData.status === 'Active' ?
                  <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-1" /> Deactivate
                        </Button> :

                  <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" /> Activate
                        </Button>
                  }
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" /> Clone
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 mr-1 text-rose-500" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Save className="w-4 h-4 mr-2" /> Save Workflow
                      </Button>
                    </div>
                  </div>
                </div>
              </Card> :

          <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-slate-200">
                <div className="text-center">
                  <GitBranch className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="font-medium text-slate-600">Select a workflow to configure</p>
                  <p className="text-sm text-slate-400">Choose from the list on the left</p>
                </div>
              </div>
          }
          </div>
        </div>
      }

      {/* Pending Approvals Tab */}
      {activeTab === 'pending' &&
      <Card title="Pending Approvals" subtitle="Review and process pending requests" icon={<Clock className="w-5 h-5" />} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Requester</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PENDING_APPROVALS.map((approval) =>
              <PendingApprovalRow
                key={approval.id}
                approval={approval}
                onAction={handleApprovalAction} />

              )}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* History Tab */}
      {activeTab === 'history' &&
      <Card title="Approval History" subtitle="View past approval decisions" icon={<History className="w-5 h-5" />} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Request ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Workflow</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Requester</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Processed By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {APPROVAL_HISTORY.map((item) =>
              <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600 text-sm">{item.requestId}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.workflow}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">{item.requester}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.subject}</td>
                    <td className="px-4 py-3">
                      <Badge
                    variant={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'secondary'}
                    size="xs">

                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.processedBy}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.duration}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Button variant="ghost" size="xs">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Analytics Tab */}
      {activeTab === 'analytics' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Approval Trends" subtitle="Last 30 days" icon={<TrendingUp className="w-5 h-5" />}>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 mx-auto mb-3" />
                <p className="font-medium">Chart Placeholder</p>
                <p className="text-sm">Approval trend visualization</p>
              </div>
            </div>
          </Card>

          <Card title="Workflow Performance" subtitle="Processing time analysis" icon={<Activity className="w-5 h-5" />}>
            <div className="space-y-4">
              {WORKFLOWS.filter((w) => w.status === 'Active').slice(0, 5).map((w) =>
            <div key={w.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{w.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.random() * 60 + 40}%` }} />

                      </div>
                      <span className="text-xs text-slate-500">{w.avgApprovalTime}</span>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>

          <Card title="Approver Workload" icon={<Users className="w-5 h-5" />}>
            <div className="space-y-3">
              {['Principal', 'HOD - Science', 'Finance Officer', 'Academic Head', 'Admin'].map((approver, idx) =>
            <div key={approver} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{approver.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{approver}</p>
                      <p className="text-xs text-slate-500">{Math.floor(Math.random() * 10 + 1)} pending</p>
                    </div>
                  </div>
                  <Badge variant={idx < 2 ? 'warning' : 'success'} size="xs">
                    {idx < 2 ? 'High Load' : 'Normal'}
                  </Badge>
                </div>
            )}
            </div>
          </Card>

          <Card title="Approval Statistics" icon={<Award className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">87%</p>
                <p className="text-sm text-emerald-700 mt-1">Approval Rate</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-rose-600">13%</p>
                <p className="text-sm text-rose-700 mt-1">Rejection Rate</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-blue-600">2.4d</p>
                <p className="text-sm text-blue-700 mt-1">Avg Processing</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-amber-600">15%</p>
                <p className="text-sm text-amber-700 mt-1">Escalation Rate</p>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Settings Tab */}
      {activeTab === 'settings' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Global Settings" icon={<Settings className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Escalation Days</label>
                <input
                type="number"
                defaultValue={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Reminder Before (days)</label>
                <input
                type="number"
                defaultValue={1}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
                <div className="flex gap-2">
                  <input
                  type="time"
                  defaultValue="09:00"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  <span className="self-center text-slate-400">to</span>
                  <input
                  type="time"
                  defaultValue="18:00"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Exclude weekends from escalation calculations</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Exclude holidays from escalation calculations</span>
              </label>
            </div>
          </Card>

          <Card title="Notification Preferences" icon={<Bell className="w-5 h-5" />}>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Email notifications for new requests</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Push notifications for escalations</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">SMS for urgent approvals</span>
                </div>
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Daily digest of pending items</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
              </label>
            </div>
          </Card>

          <Card title="Delegation Settings" icon={<UserCheck className="w-5 h-5" />}>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Allow approvers to delegate authority</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Auto-delegate on leave</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Require reason for delegation</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max delegation period (days)</label>
                <input
                type="number"
                defaultValue={30}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
          </Card>

          <Card title="Security & Audit" icon={<Shield className="w-5 h-5" />}>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Enable audit trail for all actions</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Require 2FA for financial approvals</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Lock workflows during business hours only</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Audit log retention (months)</label>
                <input
                type="number"
                defaultValue={24}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
          </Card>
        </div>
      }

      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Workflow Templates"
        subtitle="Start with a pre-configured template"
        size="lg">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOW_TEMPLATES.map((template) =>
          <div
            key={template.id}
            className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
            onClick={() => {
              setShowTemplateModal(false);
              setShowNewWorkflowModal(true);
            }}>

              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <Badge variant="secondary" size="xs">{template.category}</Badge>
              </div>
              <h4 className="font-semibold text-slate-800 mb-1">{template.name}</h4>
              <p className="text-sm text-slate-500 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{template.steps} steps</span>
                <span>Used {template.usageCount} times</span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* New Workflow Modal */}
      <Modal
        isOpen={showNewWorkflowModal}
        onClose={() => setShowNewWorkflowModal(false)}
        title="Create New Workflow"
        subtitle="Set up a new approval workflow"
        size="lg"
        actions={
        <>
            <Button variant="outline" onClick={() => setShowNewWorkflowModal(false)}>Cancel</Button>
            <Button>Create Workflow</Button>
          </>
        }>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Workflow Name *</label>
              <input
                type="text"
                placeholder="Enter workflow name"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Process Type *</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select type</option>
                {PROCESS_TYPES.filter((t) => t !== 'All').map((t) =>
                <option key={t} value={t}>{t}</option>
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the workflow purpose"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g., Human Resources"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <Info className="w-4 h-4 inline mr-1" />
              After creating the workflow, you can configure approval steps and conditions from the workflow editor.
            </p>
          </div>
        </div>
      </Modal>

      {/* Approval Detail Modal */}
      <Modal
        isOpen={showApprovalDetailModal}
        onClose={() => setShowApprovalDetailModal(false)}
        title={`Request Details - ${selectedApproval?.requestId}`}
        subtitle={selectedApproval?.workflow}
        size="lg"
        actions={
        <>
            <Button variant="outline" onClick={() => setShowApprovalDetailModal(false)}>Close</Button>
            <Button variant="danger">
              <X className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button>
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
          </>
        }>

        {selectedApproval &&
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Requester</p>
                <p className="font-medium text-slate-800">{selectedApproval.requester}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Department</p>
                <p className="font-medium text-slate-800">{selectedApproval.requesterDept}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Submitted Date</p>
                <p className="font-medium text-slate-800">{selectedApproval.submittedDate}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Due Date</p>
                <p className="font-medium text-slate-800">{selectedApproval.dueDate}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Subject</p>
              <p className="font-medium text-slate-800">{selectedApproval.subject}</p>
              {selectedApproval.amount &&
            <p className="text-lg font-bold text-emerald-600 mt-2">₹{selectedApproval.amount.toLocaleString()}</p>
            }
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Approval Progress</h4>
              <div className="flex items-center gap-2">
                {Array.from({ length: selectedApproval.totalSteps }).map((_, idx) =>
              <Fragment key={idx}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                idx < selectedApproval.currentStep ?
                'bg-emerald-100' :
                idx === selectedApproval.currentStep - 1 ?
                'bg-blue-100 ring-2 ring-blue-300' :
                'bg-slate-100'}`
                }>
                      {idx < selectedApproval.currentStep - 1 ?
                  <Check className="w-5 h-5 text-emerald-600" /> :

                  <span className={`text-sm font-medium ${
                  idx === selectedApproval.currentStep - 1 ? 'text-blue-600' : 'text-slate-400'}`
                  }>{idx + 1}</span>
                  }
                    </div>
                    {idx < selectedApproval.totalSteps - 1 &&
                <div className={`flex-1 h-1 rounded ${
                idx < selectedApproval.currentStep - 1 ? 'bg-emerald-300' : 'bg-slate-200'}`
                } />
                }
                  </Fragment>
              )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
              <textarea
              rows={3}
              placeholder="Add your comments..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
        }
      </Modal>
    </div>);

}

export default CentralApprovalControlDesk;