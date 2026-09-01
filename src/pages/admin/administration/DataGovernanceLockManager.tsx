import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  LockIcon,
  UnlockIcon,
  PlusIcon,
  SaveIcon,
  ShieldIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  FilterIcon,
  DownloadIcon,
  HistoryIcon,
  SettingsIcon,
  CalendarIcon,
  SearchIcon,
  RefreshCwIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  InfoIcon } from
'lucide-react';

// ==================== TYPES ====================
interface DataLock {
  id: string;
  name: string;
  module: string;
  moduleId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  lockedBy: string;
  lockedById: string;
  lockDate: string;
  status: 'Locked' | 'Unlocked';
  lockType: 'Manual' | 'Auto';
  affectedRecords: number;
  description: string;
  canOverride: boolean;
  overrideCount: number;
}

interface OverrideLog {
  id: string;
  date: string;
  timestamp: string;
  user: string;
  userId: string;
  lockName: string;
  lockId: string;
  reason: string;
  approvedBy: string;
  duration: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  recordsModified: number;
}

interface AutoLockConfig {
  attendance: {
    enabled: boolean;
    daysAfterPeriod: number;
    applyToAllClasses: boolean;
  };
  marks: {
    enabled: boolean;
    lockAfterPublish: boolean;
    allowGracePeriod: boolean;
    gracePeriodDays: number;
  };
  payroll: {
    enabled: boolean;
    lockAfterDisbursement: boolean;
    requireApproval: boolean;
  };
  fees: {
    enabled: boolean;
    lockAfterReconciliation: boolean;
    daysAfterPeriod: number;
  };
  library: {
    enabled: boolean;
    lockAfterAudit: boolean;
  };
}

interface ModulePermission {
  module: string;
  icon: string;
  canLock: boolean;
  canUnlock: boolean;
  canOverride: boolean;
  requiresApproval: boolean;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

type TabType = 'locks' | 'overrides' | 'permissions';

// ==================== INITIAL DATA ====================
const initialLocksData: DataLock[] = [
{
  id: '1',
  name: 'April 2025 Attendance',
  module: 'Attendance',
  moduleId: 'attendance',
  period: 'April 2025',
  periodStart: '2025-04-01',
  periodEnd: '2025-04-30',
  lockedBy: 'System Admin',
  lockedById: 'admin001',
  lockDate: '2025-05-01T10:30:00',
  status: 'Locked',
  lockType: 'Auto',
  affectedRecords: 2547,
  description: 'Monthly attendance records locked after period end',
  canOverride: true,
  overrideCount: 2
},
{
  id: '2',
  name: 'Q1 Fee Collection',
  module: 'Finance',
  moduleId: 'finance',
  period: 'Q1 2025-26',
  periodStart: '2025-04-01',
  periodEnd: '2025-06-30',
  lockedBy: 'Accountant',
  lockedById: 'acc001',
  lockDate: '2025-07-15T14:20:00',
  status: 'Locked',
  lockType: 'Manual',
  affectedRecords: 1823,
  description: 'Quarter 1 fee collection records locked for audit',
  canOverride: true,
  overrideCount: 1
},
{
  id: '3',
  name: 'Term 1 Exam Marks',
  module: 'Assessment',
  moduleId: 'assessment',
  period: 'Term 1 2025-26',
  periodStart: '2025-04-01',
  periodEnd: '2025-09-30',
  lockedBy: '-',
  lockedById: '',
  lockDate: '-',
  status: 'Unlocked',
  lockType: 'Manual',
  affectedRecords: 0,
  description: 'Term 1 examination marks - pending lock',
  canOverride: false,
  overrideCount: 0
},
{
  id: '4',
  name: 'March 2025 Payroll',
  module: 'HR',
  moduleId: 'hr',
  period: 'March 2025',
  periodStart: '2025-03-01',
  periodEnd: '2025-03-31',
  lockedBy: 'HR Admin',
  lockedById: 'hr001',
  lockDate: '2025-04-05T09:00:00',
  status: 'Locked',
  lockType: 'Auto',
  affectedRecords: 156,
  description: 'Monthly payroll locked after disbursement',
  canOverride: true,
  overrideCount: 0
},
{
  id: '5',
  name: 'December 2024 Library',
  module: 'Library',
  moduleId: 'library',
  period: 'December 2024',
  periodStart: '2024-12-01',
  periodEnd: '2024-12-31',
  lockedBy: 'Librarian',
  lockedById: 'lib001',
  lockDate: '2025-01-10T16:45:00',
  status: 'Locked',
  lockType: 'Manual',
  affectedRecords: 892,
  description: 'Monthly library transactions locked after audit',
  canOverride: false,
  overrideCount: 0
},
{
  id: '6',
  name: 'May 2025 Attendance',
  module: 'Attendance',
  moduleId: 'attendance',
  period: 'May 2025',
  periodStart: '2025-05-01',
  periodEnd: '2025-05-31',
  lockedBy: '-',
  lockedById: '',
  lockDate: '-',
  status: 'Unlocked',
  lockType: 'Auto',
  affectedRecords: 0,
  description: 'Current month attendance - active',
  canOverride: false,
  overrideCount: 0
}];


const initialOverrideLogData: OverrideLog[] = [
{
  id: '1',
  date: '20-Jan-2025',
  timestamp: '2025-01-20T14:30:00',
  user: 'Principal',
  userId: 'principal001',
  lockName: 'Dec 2024 Attendance',
  lockId: '10',
  reason: 'Late entry correction for 3 students who were marked absent incorrectly',
  approvedBy: 'System Admin',
  duration: '2 hours',
  status: 'Approved',
  recordsModified: 3
},
{
  id: '2',
  date: '15-Jan-2025',
  timestamp: '2025-01-15T11:15:00',
  user: 'Admin',
  userId: 'admin002',
  lockName: 'Q4 Fee Collection',
  lockId: '11',
  reason: 'Refund processing required for scholarship students',
  approvedBy: 'Principal',
  duration: '4 hours',
  status: 'Approved',
  recordsModified: 12
},
{
  id: '3',
  date: '10-Jan-2025',
  timestamp: '2025-01-10T09:45:00',
  user: 'HOD Science',
  userId: 'hod001',
  lockName: 'Term 2 Marks',
  lockId: '12',
  reason: 'Mark correction for practical exam - calculation error',
  approvedBy: 'Principal',
  duration: '1 hour',
  status: 'Approved',
  recordsModified: 8
},
{
  id: '4',
  date: '05-Jan-2025',
  timestamp: '2025-01-05T16:20:00',
  user: 'Accountant',
  userId: 'acc002',
  lockName: 'Nov 2024 Fees',
  lockId: '13',
  reason: 'Correction in fee category assignment',
  approvedBy: '-',
  duration: '3 hours',
  status: 'Pending',
  recordsModified: 0
},
{
  id: '5',
  date: '28-Dec-2024',
  timestamp: '2024-12-28T13:00:00',
  user: 'Teacher',
  userId: 'teach015',
  lockName: 'Oct 2024 Attendance',
  lockId: '14',
  reason: 'Medical leave documentation received late',
  approvedBy: 'HOD',
  duration: '1 hour',
  status: 'Rejected',
  recordsModified: 0
}];


const initialPermissions: ModulePermission[] = [
{ module: 'Attendance', icon: '📅', canLock: true, canUnlock: true, canOverride: true, requiresApproval: false },
{ module: 'Finance', icon: '💰', canLock: true, canUnlock: true, canOverride: true, requiresApproval: true },
{ module: 'Assessment', icon: '📊', canLock: true, canUnlock: true, canOverride: true, requiresApproval: false },
{ module: 'HR', icon: '👥', canLock: true, canUnlock: false, canOverride: false, requiresApproval: true },
{ module: 'Library', icon: '📚', canLock: true, canUnlock: true, canOverride: false, requiresApproval: false }];


// ==================== CUSTOM TAB COMPONENT ====================
interface TabItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface CustomTabsProps {
  tabs: TabItem[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200
                ${isActive ?
              'border-blue-500 text-blue-600 bg-blue-50/50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'}
              `
              }
              type="button">

              <span className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 &&
              <span
                className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `}>

                  {tab.count}
                </span>
              }
            </button>);

        })}
      </nav>
    </div>);

};

// ==================== TOAST COMPONENT ====================
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <InfoIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] ${getToastStyles(toast.type)}`}
        style={{ animation: 'slideIn 0.3s ease-out' }}>

          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button
          onClick={() => onDismiss(toast.id)}
          className="hover:opacity-70 transition-opacity"
          type="button">

            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

// ==================== STAT CARD COMPONENT ====================
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick?: () => void;
  isActive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor, onClick, isActive }) =>
<div
  onClick={onClick}
  className={`
      p-4 bg-white rounded-lg border-l-4 ${color} cursor-pointer transition-all duration-200
      hover:shadow-md hover:scale-[1.02]
      ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
    `}>

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    </div>
  </div>;


// ==================== CONFIRM DIALOG COMPONENT ====================
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            type="button">

            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${getButtonStyle()}`}
            type="button">

            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>);

};

// ==================== LOCK DETAILS MODAL ====================
interface LockDetailsModalProps {
  lock: DataLock | null;
  isOpen: boolean;
  onClose: () => void;
}

const LockDetailsModal: React.FC<LockDetailsModalProps> = ({ lock, isOpen, onClose }) => {
  if (!lock || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lock Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{lock.name}</h3>
          <Badge variant={lock.status === 'Locked' ? 'danger' : 'success'} className="flex items-center gap-1">
            {lock.status === 'Locked' ? <LockIcon className="w-3 h-3" /> : <UnlockIcon className="w-3 h-3" />}
            {lock.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Module</h4>
            <p className="text-lg font-semibold text-gray-900">{lock.module}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Lock Type</h4>
            <Badge variant={lock.lockType === 'Auto' ? 'primary' : 'secondary'}>{lock.lockType}</Badge>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Period</h4>
            <p className="text-lg font-semibold text-gray-900">{lock.period}</p>
            <p className="text-sm text-gray-500">
              {lock.periodStart} to {lock.periodEnd}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Affected Records</h4>
            <p className="text-lg font-semibold text-gray-900">{lock.affectedRecords.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Locked By</h4>
            <p className="text-lg font-semibold text-gray-900">{lock.lockedBy || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Lock Date</h4>
            <p className="text-lg font-semibold text-gray-900">
              {lock.lockDate !== '-' ? new Date(lock.lockDate).toLocaleString('en-GB') : '-'}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
          <p className="text-gray-700">{lock.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Override Count:</span>
            <Badge variant={lock.overrideCount > 0 ? 'warning' : 'secondary'}>{lock.overrideCount}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Can Override:</span>
            <Badge variant={lock.canOverride ? 'success' : 'danger'}>{lock.canOverride ? 'Yes' : 'No'}</Badge>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

};

// ==================== MAIN COMPONENT ====================
export function DataGovernanceLockManager() {
  // Core State
  const [locks, setLocks] = useState<DataLock[]>(initialLocksData);
  const [overrideLogs, setOverrideLogs] = useState<OverrideLog[]>(initialOverrideLogData);
  const [permissions, setPermissions] = useState<ModulePermission[]>(initialPermissions);

  // Tab State - Using explicit TabType
  const [activeTab, setActiveTab] = useState<TabType>('locks');

  // Filter State
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [overrideStatusFilter, setOverrideStatusFilter] = useState('');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);

  // Selected Items State
  const [selectedLock, setSelectedLock] = useState<DataLock | null>(null);

  // Form State
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideDuration, setOverrideDuration] = useState('1');
  const [newLock, setNewLock] = useState({
    name: '',
    module: '',
    periodStart: '',
    periodEnd: '',
    description: ''
  });

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-Lock Configuration State
  const [autoLockConfig, setAutoLockConfig] = useState<AutoLockConfig>({
    attendance: {
      enabled: true,
      daysAfterPeriod: 7,
      applyToAllClasses: true
    },
    marks: {
      enabled: true,
      lockAfterPublish: true,
      allowGracePeriod: true,
      gracePeriodDays: 3
    },
    payroll: {
      enabled: true,
      lockAfterDisbursement: true,
      requireApproval: false
    },
    fees: {
      enabled: true,
      lockAfterReconciliation: true,
      daysAfterPeriod: 5
    },
    library: {
      enabled: false,
      lockAfterAudit: true
    }
  });

  // ==================== TOAST HELPERS ====================
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ==================== COMPUTED VALUES ====================
  const filteredLocks = useMemo(() => {
    return locks.filter((lock) => {
      const matchesModule = !selectedModule || lock.moduleId === selectedModule;
      const matchesStatus = !selectedStatus || lock.status === selectedStatus;
      const matchesSearch =
      !searchTerm ||
      lock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lock.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lock.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lock.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesModule && matchesStatus && matchesSearch;
    });
  }, [locks, selectedModule, selectedStatus, searchTerm]);

  const filteredOverrideLogs = useMemo(() => {
    return overrideLogs.filter((log) => {
      const matchesStatus = !overrideStatusFilter || log.status === overrideStatusFilter;
      return matchesStatus;
    });
  }, [overrideLogs, overrideStatusFilter]);

  const statistics = useMemo(() => {
    return {
      total: locks.length,
      locked: locks.filter((l) => l.status === 'Locked').length,
      unlocked: locks.filter((l) => l.status === 'Unlocked').length,
      autoLocked: locks.filter((l) => l.lockType === 'Auto' && l.status === 'Locked').length,
      totalOverrides: overrideLogs.length,
      pendingOverrides: overrideLogs.filter((o) => o.status === 'Pending').length,
      approvedOverrides: overrideLogs.filter((o) => o.status === 'Approved').length,
      rejectedOverrides: overrideLogs.filter((o) => o.status === 'Rejected').length
    };
  }, [locks, overrideLogs]);

  // Tab Configuration
  const tabItems: TabItem[] = useMemo(() => [
  {
    id: 'locks',
    label: 'Active Locks',
    icon: <LockIcon className="w-4 h-4" />,
    count: statistics.locked
  },
  {
    id: 'overrides',
    label: 'Override Log',
    icon: <HistoryIcon className="w-4 h-4" />,
    count: statistics.pendingOverrides
  },
  {
    id: 'permissions',
    label: 'Permissions',
    icon: <UserIcon className="w-4 h-4" />
  }],
  [statistics.locked, statistics.pendingOverrides]);

  // ==================== HANDLERS ====================

  // Tab Change Handler
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    // Reset filters when changing tabs
    if (tab === 'locks') {
      setOverrideStatusFilter('');
    } else if (tab === 'overrides') {
      setSelectedModule('');
      setSelectedStatus('');
      setSearchTerm('');
    }
  }, []);

  // Lock/Unlock Handler
  const handleLockToggle = useCallback((lock: DataLock) => {
    if (lock.status === 'Locked') {
      setSelectedLock(lock);
      setShowOverrideModal(true);
    } else {
      setSelectedLock(lock);
      setShowLockConfirm(true);
    }
  }, []);

  const confirmLock = useCallback(() => {
    if (!selectedLock) return;

    setIsLoading(true);
    setTimeout(() => {
      setLocks((prev) =>
      prev.map((l) =>
      l.id === selectedLock.id ?
      {
        ...l,
        status: 'Locked' as const,
        lockedBy: 'Current User',
        lockedById: 'current_user',
        lockDate: new Date().toISOString(),
        lockType: 'Manual' as const,
        affectedRecords: Math.floor(Math.random() * 1000) + 100
      } :
      l
      )
      );
      setIsLoading(false);
      setShowLockConfirm(false);
      setSelectedLock(null);
      addToast('success', `"${selectedLock.name}" has been locked successfully`);
    }, 1000);
  }, [selectedLock, addToast]);

  // Create Lock Handler
  const handleCreateLock = useCallback(() => {
    if (!newLock.name || !newLock.module || !newLock.periodStart || !newLock.periodEnd) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const moduleNames: Record<string, string> = {
        attendance: 'Attendance',
        finance: 'Finance',
        assessment: 'Assessment',
        hr: 'HR',
        library: 'Library'
      };

      const lock: DataLock = {
        id: String(Date.now()),
        name: newLock.name,
        module: moduleNames[newLock.module] || 'Other',
        moduleId: newLock.module,
        period: `${newLock.periodStart} to ${newLock.periodEnd}`,
        periodStart: newLock.periodStart,
        periodEnd: newLock.periodEnd,
        lockedBy: 'Current User',
        lockedById: 'current_user',
        lockDate: new Date().toISOString(),
        status: 'Locked',
        lockType: 'Manual',
        affectedRecords: Math.floor(Math.random() * 1000) + 100,
        description: newLock.description || 'No description provided',
        canOverride: true,
        overrideCount: 0
      };

      setLocks((prev) => [lock, ...prev]);
      setIsSaving(false);
      setShowCreateModal(false);
      setNewLock({
        name: '',
        module: '',
        periodStart: '',
        periodEnd: '',
        description: ''
      });
      addToast('success', `Lock "${lock.name}" created successfully`);
    }, 1500);
  }, [newLock, addToast]);

  // Override Request Handler
  const handleOverrideRequest = useCallback(() => {
    if (!selectedLock || !overrideReason.trim()) {
      addToast('error', 'Please provide a reason for the override request');
      return;
    }

    if (overrideReason.trim().length < 20) {
      addToast('error', 'Reason must be at least 20 characters');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const override: OverrideLog = {
        id: String(Date.now()),
        date: new Date().toLocaleDateString('en-GB'),
        timestamp: new Date().toISOString(),
        user: 'Current User',
        userId: 'current_user',
        lockName: selectedLock.name,
        lockId: selectedLock.id,
        reason: overrideReason,
        approvedBy: '-',
        duration: `${overrideDuration} hour${parseInt(overrideDuration) > 1 ? 's' : ''}`,
        status: 'Pending',
        recordsModified: 0
      };

      setOverrideLogs((prev) => [override, ...prev]);
      setLocks((prev) =>
      prev.map((l) => l.id === selectedLock.id ? { ...l, overrideCount: l.overrideCount + 1 } : l)
      );
      setIsSaving(false);
      setShowOverrideModal(false);
      setOverrideReason('');
      setOverrideDuration('1');
      setSelectedLock(null);
      addToast('success', 'Override request submitted successfully');
    }, 1500);
  }, [selectedLock, overrideReason, overrideDuration, addToast]);

  // Approve/Reject Override Handler
  const handleOverrideAction = useCallback(
    (logId: string, action: 'Approved' | 'Rejected') => {
      setOverrideLogs((prev) =>
      prev.map((log) =>
      log.id === logId ?
      {
        ...log,
        status: action,
        approvedBy: action === 'Approved' ? 'Current User' : log.approvedBy,
        recordsModified: action === 'Approved' ? Math.floor(Math.random() * 20) + 1 : 0
      } :
      log
      )
      );
      addToast('success', `Override request ${action.toLowerCase()} successfully`);
    },
    [addToast]
  );

  // Delete Lock Handler
  const handleDeleteLock = useCallback(() => {
    if (!selectedLock) return;

    setIsLoading(true);
    setTimeout(() => {
      setLocks((prev) => prev.filter((l) => l.id !== selectedLock.id));
      setIsLoading(false);
      setShowDeleteConfirm(false);
      addToast('success', `Lock "${selectedLock.name}" deleted successfully`);
      setSelectedLock(null);
    }, 1000);
  }, [selectedLock, addToast]);

  // Permission Toggle Handler
  const handlePermissionToggle = useCallback(
    (module: string, field: keyof Omit<ModulePermission, 'module' | 'icon'>) => {
      setPermissions((prev) =>
      prev.map((p) => p.module === module ? { ...p, [field]: !p[field] } : p)
      );
    },
    []
  );

  // Save Permissions Handler
  const handleSavePermissions = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('success', 'Permissions saved successfully');
    }, 1500);
  }, [addToast]);

  // Save Auto-Lock Settings Handler
  const handleSaveAutoLockSettings = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSettingsModal(false);
      addToast('success', 'Auto-lock settings saved successfully');
    }, 1500);
  }, [addToast]);

  // Reset Filters Handler
  const handleResetFilters = useCallback(() => {
    setSelectedModule('');
    setSelectedStatus('');
    setSearchTerm('');
    setOverrideStatusFilter('');
    addToast('info', 'Filters reset');
  }, [addToast]);

  // Refresh Data Handler
  const handleRefreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('success', 'Data refreshed successfully');
    }, 1000);
  }, [addToast]);

  // Export Locks Report Handler
  const exportLocksReport = useCallback(() => {
    const csvContent = [
    ['Lock Name', 'Module', 'Period', 'Status', 'Lock Type', 'Locked By', 'Lock Date', 'Records', 'Overrides'].join(','),
    ...filteredLocks.map((lock) =>
    [
    `"${lock.name}"`,
    lock.module,
    `"${lock.period}"`,
    lock.status,
    lock.lockType,
    lock.lockedBy,
    lock.lockDate !== '-' ? new Date(lock.lockDate).toLocaleDateString() : '-',
    lock.affectedRecords,
    lock.overrideCount].
    join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-locks-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('success', 'Report exported successfully');
  }, [filteredLocks, addToast]);

  // Export Override Log Handler
  const exportOverrideLog = useCallback(() => {
    const csvContent = [
    ['Date', 'Time', 'User', 'Lock Name', 'Reason', 'Status', 'Approved By', 'Duration', 'Records Modified'].join(','),
    ...filteredOverrideLogs.map((log) =>
    [
    log.date,
    new Date(log.timestamp).toLocaleTimeString('en-GB'),
    log.user,
    `"${log.lockName}"`,
    `"${log.reason}"`,
    log.status,
    log.approvedBy,
    log.duration,
    log.recordsModified].
    join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `override-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('success', 'Override log exported successfully');
  }, [filteredOverrideLogs, addToast]);

  // View Lock Details Handler
  const handleViewDetails = useCallback((lock: DataLock) => {
    setSelectedLock(lock);
    setShowDetailsModal(true);
  }, []);

  // Initiate Delete Handler
  const handleInitiateDelete = useCallback((lock: DataLock) => {
    setSelectedLock(lock);
    setShowDeleteConfirm(true);
  }, []);

  // ==================== TABLE COLUMNS ====================
  const lockColumns = useMemo(
    () => [
    {
      key: 'name',
      header: 'Lock Name',
      render: (row: DataLock) =>
      <div className="max-w-xs">
            <div className="font-medium text-gray-900 truncate">{row.name}</div>
            <div className="text-xs text-gray-500 truncate">{row.description}</div>
          </div>

    },
    {
      key: 'module',
      header: 'Module',
      render: (row: DataLock) =>
      <Badge variant="secondary" className="font-medium">
            {row.module}
          </Badge>

    },
    {
      key: 'period',
      header: 'Period',
      render: (row: DataLock) =>
      <div className="text-sm">
            <div className="font-medium text-gray-900">{row.period}</div>
            <div className="text-xs text-gray-500">
              {row.periodStart} to {row.periodEnd}
            </div>
          </div>

    },
    {
      key: 'lockType',
      header: 'Type',
      render: (row: DataLock) =>
      <Badge variant={row.lockType === 'Auto' ? 'primary' : 'secondary'}>{row.lockType}</Badge>

    },
    {
      key: 'affectedRecords',
      header: 'Records',
      render: (row: DataLock) =>
      <span className="font-mono text-sm text-gray-900">
            {row.status === 'Locked' ? row.affectedRecords.toLocaleString() : '-'}
          </span>

    },
    {
      key: 'lockedBy',
      header: 'Locked By',
      render: (row: DataLock) =>
      <div className="text-sm">
            <div className="font-medium text-gray-700">{row.lockedBy || '-'}</div>
            {row.lockDate !== '-' &&
        <div className="text-xs text-gray-500">{new Date(row.lockDate).toLocaleDateString('en-GB')}</div>
        }
          </div>

    },
    {
      key: 'status',
      header: 'Status',
      render: (row: DataLock) =>
      <div className="flex items-center gap-2">
            <Badge variant={row.status === 'Locked' ? 'danger' : 'success'} className="flex items-center gap-1">
              {row.status === 'Locked' ? <LockIcon className="w-3 h-3" /> : <UnlockIcon className="w-3 h-3" />}
              {row.status}
            </Badge>
            {row.overrideCount > 0 &&
        <Badge variant="warning" className="text-xs">
                {row.overrideCount}
              </Badge>
        }
          </div>

    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: DataLock) =>
      <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(row)} title="View Details">
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
          variant={row.status === 'Locked' ? 'outline' : 'primary'}
          size="sm"
          onClick={() => handleLockToggle(row)}
          disabled={row.status === 'Locked' && !row.canOverride}
          title={row.status === 'Locked' ? 'Request Override' : 'Lock'}>

              {row.status === 'Locked' ? <UnlockIcon className="w-4 h-4" /> : <LockIcon className="w-4 h-4" />}
            </Button>
            {row.status === 'Unlocked' &&
        <Button variant="ghost" size="sm" onClick={() => handleInitiateDelete(row)} title="Delete">
                <TrashIcon className="w-4 h-4 text-red-500" />
              </Button>
        }
          </div>

    }],

    [handleViewDetails, handleLockToggle, handleInitiateDelete]
  );

  const overrideColumns = useMemo(
    () => [
    {
      key: 'date',
      header: 'Date & Time',
      render: (row: OverrideLog) =>
      <div className="text-sm">
            <div className="font-medium text-gray-900">{row.date}</div>
            <div className="text-xs text-gray-500">{new Date(row.timestamp).toLocaleTimeString('en-GB')}</div>
          </div>

    },
    {
      key: 'user',
      header: 'User',
      render: (row: OverrideLog) =>
      <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.user}</div>
              <div className="text-xs text-gray-500">{row.userId}</div>
            </div>
          </div>

    },
    {
      key: 'lockName',
      header: 'Lock Name',
      render: (row: OverrideLog) => <span className="font-medium text-gray-900">{row.lockName}</span>
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row: OverrideLog) =>
      <div className="max-w-xs">
            <p className="text-sm text-gray-700 line-clamp-2" title={row.reason}>
              {row.reason}
            </p>
          </div>

    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row: OverrideLog) => <span className="text-sm text-gray-700">{row.duration}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: OverrideLog) => {
        const statusConfig = {
          Approved: { variant: 'success' as const, icon: CheckCircleIcon },
          Pending: { variant: 'warning' as const, icon: ClockIcon },
          Rejected: { variant: 'danger' as const, icon: XCircleIcon }
        };
        const config = statusConfig[row.status];
        const Icon = config.icon;

        return (
          <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
              <Icon className="w-3 h-3" />
              {row.status}
            </Badge>);

      }
    },
    {
      key: 'approvedBy',
      header: 'Approved By',
      render: (row: OverrideLog) => <span className="text-sm text-gray-700">{row.approvedBy}</span>
    },
    {
      key: 'recordsModified',
      header: 'Records',
      render: (row: OverrideLog) => <span className="font-mono text-sm text-gray-900">{row.recordsModified}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: OverrideLog) =>
      row.status === 'Pending' ?
      <div className="flex gap-1">
              <button
          onClick={() => handleOverrideAction(row.id, 'Approved')}
          className="p-1.5 rounded text-green-600 hover:bg-green-50 transition-colors"
          title="Approve"
          type="button">

                <CheckIcon className="w-4 h-4" />
              </button>
              <button
          onClick={() => handleOverrideAction(row.id, 'Rejected')}
          className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
          title="Reject"
          type="button">

                <XIcon className="w-4 h-4" />
              </button>
            </div> :

      <span className="text-sm text-gray-400">-</span>

    }],

    [handleOverrideAction]
  );

  // ==================== RENDER ====================
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ==================== HEADER SECTION ==================== */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShieldIcon className="w-8 h-8 text-blue-600" />
            </div>
            Data Governance & Lock Manager
          </h1>
          <p className="text-sm text-gray-600 mt-2 ml-14">
            Manage data locks, access controls, and override requests across all modules
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={handleRefreshData}
            disabled={isLoading}>

            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            leftIcon={<SettingsIcon className="w-4 h-4" />}
            onClick={() => setShowSettingsModal(true)}>

            Auto-Lock Settings
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}>

            Create New Lock
          </Button>
        </div>
      </section>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Locks"
            value={statistics.total}
            icon={<ShieldIcon className="w-6 h-6 text-blue-600" />}
            color="border-l-blue-500"
            bgColor="bg-blue-100"
            onClick={() => {
              setSelectedStatus('');
              handleTabChange('locks');
            }}
            isActive={activeTab === 'locks' && !selectedStatus} />

          <StatCard
            title="Locked"
            value={statistics.locked}
            icon={<LockIcon className="w-6 h-6 text-red-600" />}
            color="border-l-red-500"
            bgColor="bg-red-100"
            onClick={() => {
              setSelectedStatus('Locked');
              handleTabChange('locks');
            }}
            isActive={activeTab === 'locks' && selectedStatus === 'Locked'} />

          <StatCard
            title="Unlocked"
            value={statistics.unlocked}
            icon={<UnlockIcon className="w-6 h-6 text-green-600" />}
            color="border-l-green-500"
            bgColor="bg-green-100"
            onClick={() => {
              setSelectedStatus('Unlocked');
              handleTabChange('locks');
            }}
            isActive={activeTab === 'locks' && selectedStatus === 'Unlocked'} />

          <StatCard
            title="Auto-Locked"
            value={statistics.autoLocked}
            icon={<SettingsIcon className="w-6 h-6 text-purple-600" />}
            color="border-l-purple-500"
            bgColor="bg-purple-100"
            onClick={() => handleTabChange('locks')} />

          <StatCard
            title="Total Overrides"
            value={statistics.totalOverrides}
            icon={<HistoryIcon className="w-6 h-6 text-orange-600" />}
            color="border-l-orange-500"
            bgColor="bg-orange-100"
            onClick={() => {
              setOverrideStatusFilter('');
              handleTabChange('overrides');
            }}
            isActive={activeTab === 'overrides' && !overrideStatusFilter} />

          <StatCard
            title="Pending Approvals"
            value={statistics.pendingOverrides}
            icon={<ClockIcon className="w-6 h-6 text-yellow-600" />}
            color="border-l-yellow-500"
            bgColor="bg-yellow-100"
            onClick={() => {
              setOverrideStatusFilter('Pending');
              handleTabChange('overrides');
            }}
            isActive={activeTab === 'overrides' && overrideStatusFilter === 'Pending'} />

        </div>
      </section>

      {/* ==================== MAIN CONTENT SECTION WITH TABS ==================== */}
      <section>
        <Card className="p-0 overflow-hidden">
          {/* Custom Tabs Component */}
          <CustomTabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={handleTabChange} />


          {/* Tab Content */}
          <div className="p-6">
            {/* ==================== LOCKS TAB CONTENT ==================== */}
            {activeTab === 'locks' &&
            <div className="space-y-6">
                {/* Filters Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FilterIcon className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">Filters</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Input
                      placeholder="Search by name, module, or period..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />} />

                    </div>
                    <Select
                    value={selectedModule}
                    onChange={setSelectedModule}
                    options={[
                    { value: '', label: 'All Modules' },
                    { value: 'attendance', label: 'Attendance' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'assessment', label: 'Assessment' },
                    { value: 'hr', label: 'HR' },
                    { value: 'library', label: 'Library' }]
                    }
                    className="w-48" />

                    <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={[
                    { value: '', label: 'All Status' },
                    { value: 'Locked', label: 'Locked' },
                    { value: 'Unlocked', label: 'Unlocked' }]
                    }
                    className="w-48" />

                    <Button variant="ghost" onClick={handleResetFilters}>
                      Reset
                    </Button>
                    <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={exportLocksReport}>
                      Export
                    </Button>
                  </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredLocks.length}</span> of{' '}
                    <span className="font-semibold">{locks.length}</span> locks
                  </p>
                  {(selectedModule || selectedStatus || searchTerm) &&
                <Badge variant="secondary" className="flex items-center gap-1">
                      <FilterIcon className="w-3 h-3" />
                      Filters Applied
                    </Badge>
                }
                </div>

                {/* Locks Table */}
                {filteredLocks.length > 0 ?
              <div className="overflow-x-auto">
                    <Table columns={lockColumns} data={filteredLocks} />
                  </div> :

              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <LockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No locks found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedModule || selectedStatus ?
                  'Try adjusting your filters' :
                  'Create your first data lock to get started'}
                    </p>
                    <Button
                  variant="primary"
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => setShowCreateModal(true)}>

                      Create New Lock
                    </Button>
                  </div>
              }
              </div>
            }

            {/* ==================== OVERRIDES TAB CONTENT ==================== */}
            {activeTab === 'overrides' &&
            <div className="space-y-6">
                {/* Override Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                  type="button"
                  onClick={() => setOverrideStatusFilter('')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                  overrideStatusFilter === '' ?
                  'bg-blue-50 border-blue-300 ring-2 ring-blue-500' :
                  'bg-white border-gray-200 hover:bg-gray-50'}`
                  }>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">All Requests</span>
                      <span className="text-2xl font-bold text-gray-900">{statistics.totalOverrides}</span>
                    </div>
                  </button>
                  <button
                  type="button"
                  onClick={() => setOverrideStatusFilter('Pending')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                  overrideStatusFilter === 'Pending' ?
                  'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-500' :
                  'bg-white border-gray-200 hover:bg-gray-50'}`
                  }>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Pending</span>
                      <span className="text-2xl font-bold text-yellow-600">{statistics.pendingOverrides}</span>
                    </div>
                  </button>
                  <button
                  type="button"
                  onClick={() => setOverrideStatusFilter('Approved')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                  overrideStatusFilter === 'Approved' ?
                  'bg-green-50 border-green-300 ring-2 ring-green-500' :
                  'bg-white border-gray-200 hover:bg-gray-50'}`
                  }>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Approved</span>
                      <span className="text-2xl font-bold text-green-600">{statistics.approvedOverrides}</span>
                    </div>
                  </button>
                  <button
                  type="button"
                  onClick={() => setOverrideStatusFilter('Rejected')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                  overrideStatusFilter === 'Rejected' ?
                  'bg-red-50 border-red-300 ring-2 ring-red-500' :
                  'bg-white border-gray-200 hover:bg-gray-50'}`
                  }>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Rejected</span>
                      <span className="text-2xl font-bold text-red-600">{statistics.rejectedOverrides}</span>
                    </div>
                  </button>
                </div>

                {/* Results Info & Export */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredOverrideLogs.length}</span> of{' '}
                    <span className="font-semibold">{overrideLogs.length}</span> requests
                    {overrideStatusFilter &&
                  <Badge variant="secondary" className="ml-2">
                        {overrideStatusFilter}
                      </Badge>
                  }
                  </span>
                  <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={exportOverrideLog}>
                    Export Log
                  </Button>
                </div>

                {/* Override Log Table */}
                {filteredOverrideLogs.length > 0 ?
              <div className="overflow-x-auto">
                    <Table columns={overrideColumns} data={filteredOverrideLogs} />
                  </div> :

              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No override requests</h3>
                    <p className="text-gray-500">
                      {overrideStatusFilter ?
                  `No ${overrideStatusFilter.toLowerCase()} requests found` :
                  'Override requests will appear here when users request access to locked data'}
                    </p>
                  </div>
              }
              </div>
            }

            {/* ==================== PERMISSIONS TAB CONTENT ==================== */}
            {activeTab === 'permissions' &&
            <div className="space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Lock Permissions Configuration</h4>
                      <p className="text-sm text-blue-800">
                        Configure which user roles can lock, unlock, and override data locks for each module.
                        Changes will take effect immediately after saving.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="space-y-4">
                  {permissions.map((permission) =>
                <Card key={permission.module} className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-3">
                          <span className="text-2xl">{permission.icon}</span>
                          {permission.module} Module
                        </h3>
                        <Badge
                      variant={
                      permission.canLock && permission.canUnlock && permission.canOverride ?
                      'success' :
                      permission.canLock ?
                      'warning' :
                      'secondary'
                      }>

                          {permission.canLock && permission.canUnlock && permission.canOverride ?
                      'Full Access' :
                      permission.canLock ?
                      'Limited' :
                      'Restricted'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                        type="checkbox"
                        checked={permission.canLock}
                        onChange={() => handlePermissionToggle(permission.module, 'canLock')}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                          <div>
                            <span className="text-sm font-medium text-gray-700 block">Can Lock</span>
                            <span className="text-xs text-gray-500">Create new locks</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                        type="checkbox"
                        checked={permission.canUnlock}
                        onChange={() => handlePermissionToggle(permission.module, 'canUnlock')}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                          <div>
                            <span className="text-sm font-medium text-gray-700 block">Can Unlock</span>
                            <span className="text-xs text-gray-500">Remove locks</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                        type="checkbox"
                        checked={permission.canOverride}
                        onChange={() => handlePermissionToggle(permission.module, 'canOverride')}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                          <div>
                            <span className="text-sm font-medium text-gray-700 block">Can Override</span>
                            <span className="text-xs text-gray-500">Temporary access</span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                        type="checkbox"
                        checked={permission.requiresApproval}
                        onChange={() => handlePermissionToggle(permission.module, 'requiresApproval')}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                          <div>
                            <span className="text-sm font-medium text-gray-700 block">Requires Approval</span>
                            <span className="text-xs text-gray-500">Need authorization</span>
                          </div>
                        </label>
                      </div>
                    </Card>
                )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                  variant="primary"
                  leftIcon={<SaveIcon className="w-4 h-4" />}
                  onClick={handleSavePermissions}
                  disabled={isSaving}>

                    {isSaving ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </div>
              </div>
            }
          </div>
        </Card>
      </section>

      {/* ==================== MODALS ==================== */}

      {/* Create Lock Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Data Lock" size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lock Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., June 2025 Attendance"
              value={newLock.name}
              onChange={(e) => setNewLock({ ...newLock, name: e.target.value })} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module <span className="text-red-500">*</span>
            </label>
            <Select
              value={newLock.module}
              onChange={(value) => setNewLock({ ...newLock, module: value })}
              options={[
              { value: '', label: 'Select Module' },
              { value: 'attendance', label: 'Attendance' },
              { value: 'finance', label: 'Finance' },
              { value: 'assessment', label: 'Assessment' },
              { value: 'hr', label: 'HR & Payroll' },
              { value: 'library', label: 'Library' }]
              } />

          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={newLock.periodStart}
                onChange={(e) => setNewLock({ ...newLock, periodStart: e.target.value })}
                leftIcon={<CalendarIcon className="w-4 h-4 text-gray-400" />} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={newLock.periodEnd}
                onChange={(e) => setNewLock({ ...newLock, periodEnd: e.target.value })}
                leftIcon={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                min={newLock.periodStart} />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newLock.description}
              onChange={(e) => setNewLock({ ...newLock, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the purpose of this lock..." />

          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-800">
                  This will immediately lock all records in the selected module for the specified period.
                  Ensure all data entry is complete before proceeding.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateLock}
              disabled={!newLock.name || !newLock.module || !newLock.periodStart || !newLock.periodEnd || isSaving}
              leftIcon={<LockIcon className="w-4 h-4" />}
              className="flex-1">

              {isSaving ? 'Creating...' : 'Create & Lock'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Override Request Modal */}
      <Modal
        isOpen={showOverrideModal}
        onClose={() => {
          setShowOverrideModal(false);
          setSelectedLock(null);
          setOverrideReason('');
          setOverrideDuration('1');
        }}
        title="Request Override Access"
        size="lg">

        {selectedLock &&
        <div className="space-y-5">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <LockIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Data Lock Override</h4>
                  <p className="text-sm text-red-800">
                    You are requesting temporary access to modify locked data. This action will be logged
                    and may require approval from an administrator.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900 mb-2">Lock Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-gray-600">Lock Name:</span>
                  <p className="font-medium text-gray-900">{selectedLock.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Module:</span>
                  <p className="font-medium text-gray-900">{selectedLock.module}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Period:</span>
                  <p className="font-medium text-gray-900">{selectedLock.period}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Affected Records:</span>
                  <p className="font-medium text-gray-900">{selectedLock.affectedRecords.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Override <span className="text-red-500">*</span>
              </label>
              <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Provide a detailed reason for requesting override access..." />

              <p className={`text-xs mt-1 ${overrideReason.length < 20 ? 'text-red-500' : 'text-green-600'}`}>
                {overrideReason.length}/20 characters minimum
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Access Duration</label>
              <Select
              value={overrideDuration}
              onChange={setOverrideDuration}
              options={[
              { value: '1', label: '1 Hour' },
              { value: '2', label: '2 Hours' },
              { value: '4', label: '4 Hours' },
              { value: '8', label: '8 Hours (Half Day)' },
              { value: '24', label: '24 Hours (Full Day)' }]
              } />

            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                setShowOverrideModal(false);
                setSelectedLock(null);
                setOverrideReason('');
                setOverrideDuration('1');
              }}
              className="flex-1">

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleOverrideRequest}
              disabled={overrideReason.trim().length < 20 || isSaving}
              leftIcon={<UnlockIcon className="w-4 h-4" />}
              className="flex-1">

                {isSaving ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Auto-Lock Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Auto-Lock Configuration"
        size="lg">

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Attendance Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Attendance Module
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLockConfig.attendance.enabled}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    attendance: { ...autoLockConfig.attendance, enabled: e.target.checked }
                  })
                  }
                  className="sr-only peer" />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {autoLockConfig.attendance.enabled &&
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lock after (days from period end)
                  </label>
                  <Input
                  type="number"
                  value={autoLockConfig.attendance.daysAfterPeriod}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    attendance: {
                      ...autoLockConfig.attendance,
                      daysAfterPeriod: parseInt(e.target.value) || 0
                    }
                  })
                  }
                  className="w-32"
                  min={0}
                  max={30} />

                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.attendance.applyToAllClasses}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    attendance: { ...autoLockConfig.attendance, applyToAllClasses: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Apply to all classes simultaneously</span>
                </label>
              </div>
            }
          </Card>

          {/* Assessment Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Assessment Module
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLockConfig.marks.enabled}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    marks: { ...autoLockConfig.marks, enabled: e.target.checked }
                  })
                  }
                  className="sr-only peer" />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {autoLockConfig.marks.enabled &&
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.marks.lockAfterPublish}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    marks: { ...autoLockConfig.marks, lockAfterPublish: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Lock immediately after result publish</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.marks.allowGracePeriod}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    marks: { ...autoLockConfig.marks, allowGracePeriod: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Allow grace period for corrections</span>
                </label>
                {autoLockConfig.marks.allowGracePeriod &&
              <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grace period (days)</label>
                    <Input
                  type="number"
                  value={autoLockConfig.marks.gracePeriodDays}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    marks: { ...autoLockConfig.marks, gracePeriodDays: parseInt(e.target.value) || 0 }
                  })
                  }
                  className="w-32"
                  min={0}
                  max={14} />

                  </div>
              }
              </div>
            }
          </Card>

          {/* Payroll Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Payroll Module
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLockConfig.payroll.enabled}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    payroll: { ...autoLockConfig.payroll, enabled: e.target.checked }
                  })
                  }
                  className="sr-only peer" />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {autoLockConfig.payroll.enabled &&
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.payroll.lockAfterDisbursement}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    payroll: { ...autoLockConfig.payroll, lockAfterDisbursement: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Lock after salary disbursement</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.payroll.requireApproval}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    payroll: { ...autoLockConfig.payroll, requireApproval: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Require approval before auto-lock</span>
                </label>
              </div>
            }
          </Card>

          {/* Fee Collection Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Fee Collection Module
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLockConfig.fees.enabled}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    fees: { ...autoLockConfig.fees, enabled: e.target.checked }
                  })
                  }
                  className="sr-only peer" />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {autoLockConfig.fees.enabled &&
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.fees.lockAfterReconciliation}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    fees: { ...autoLockConfig.fees, lockAfterReconciliation: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Lock after monthly reconciliation</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lock after (days from period end)
                  </label>
                  <Input
                  type="number"
                  value={autoLockConfig.fees.daysAfterPeriod}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    fees: { ...autoLockConfig.fees, daysAfterPeriod: parseInt(e.target.value) || 0 }
                  })
                  }
                  className="w-32"
                  min={0}
                  max={30} />

                </div>
              </div>
            }
          </Card>

          {/* Library Settings */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Library Module
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLockConfig.library.enabled}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    library: { ...autoLockConfig.library, enabled: e.target.checked }
                  })
                  }
                  className="sr-only peer" />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {autoLockConfig.library.enabled &&
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={autoLockConfig.library.lockAfterAudit}
                  onChange={(e) =>
                  setAutoLockConfig({
                    ...autoLockConfig,
                    library: { ...autoLockConfig.library, lockAfterAudit: e.target.checked }
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Lock after library audit completion</span>
                </label>
              </div>
            }
          </Card>
        </div>

        <div className="flex gap-3 pt-4 mt-4 border-t">
          <Button variant="outline" onClick={() => setShowSettingsModal(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAutoLockSettings}
            leftIcon={<SaveIcon className="w-4 h-4" />}
            className="flex-1"
            disabled={isSaving}>

            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Modal>

      {/* Lock Details Modal */}
      <LockDetailsModal
        lock={selectedLock}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedLock(null);
        }} />


      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedLock(null);
        }}
        onConfirm={handleDeleteLock}
        title="Delete Lock"
        message={`Are you sure you want to delete "${selectedLock?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isLoading} />


      {/* Lock Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLockConfirm}
        onClose={() => {
          setShowLockConfirm(false);
          setSelectedLock(null);
        }}
        onConfirm={confirmLock}
        title="Confirm Lock"
        message={`Are you sure you want to lock "${selectedLock?.name}"? This will prevent any modifications to the affected records.`}
        confirmText="Lock Now"
        variant="warning"
        isLoading={isLoading} />


      {/* Global Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>);

}

export default DataGovernanceLockManager;