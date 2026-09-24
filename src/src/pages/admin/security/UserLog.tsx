// UserLog.tsx - User Activity & Audit Trail System with Revert/Restore Functionality
import React, { useState } from 'react';
import {
  Download, Search, Filter, Calendar, Archive, Trash2, Eye, Activity, Shield,
  AlertCircle, CheckCircle, XCircle, RefreshCw, Clock, User, Laptop, Globe,
  Database, Edit, Plus, LogIn, LogOut, RotateCcw, History, AlertTriangle } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';

interface UserLog {
  id: string;timestamp: string;user: string;role: string;actionType: string;
  module: string;subModule: string;recordAffected: string;oldValue: string;
  newValue: string;ip: string;device: string;browser: string;os: string;
  status: 'Success' | 'Failed';error?: string;isReverted?: boolean;revertedAt?: string;revertedBy?: string;
}

const INITIAL_LOGS: UserLog[] = [
{ id: 'LOG001', timestamp: '2024-03-15 10:45:32', user: 'admin.john', role: 'System Admin', actionType: 'Login', module: 'Authentication', subModule: 'User Login', recordAffected: '-', oldValue: '-', newValue: '-', ip: '192.168.1.10', device: 'Desktop', browser: 'Chrome 122', os: 'Windows 11', status: 'Success' },
{ id: 'LOG002', timestamp: '2024-03-15 10:30:15', user: 't.sarah', role: 'Teacher', actionType: 'Create', module: 'Assessment', subModule: 'Marks Entry', recordAffected: 'Exam-101 (Class 10-A)', oldValue: '-', newValue: 'Math Marks: 45 students', ip: '192.168.1.15', device: 'Desktop', browser: 'Firefox 123', os: 'Windows 10', status: 'Success' },
{ id: 'LOG003', timestamp: '2024-03-15 10:15:45', user: 'Unknown', role: 'N/A', actionType: 'Login', module: 'Authentication', subModule: 'User Login', recordAffected: '-', oldValue: '-', newValue: '-', ip: '45.22.11.88', device: 'Unknown', browser: 'Chrome 120', os: 'Unknown', status: 'Failed', error: 'Invalid Password (3 attempts)' },
{ id: 'LOG004', timestamp: '2024-03-15 10:00:22', user: 'acc.robert', role: 'Accountant', actionType: 'Create', module: 'Finance', subModule: 'Fee Receipt', recordAffected: 'RCP-2024-005', oldValue: '-', newValue: 'Receipt: ₹15,000', ip: '192.168.1.22', device: 'Desktop', browser: 'Edge 121', os: 'Windows 11', status: 'Success' },
{ id: 'LOG005', timestamp: '2024-03-15 09:45:10', user: 'admin.john', role: 'System Admin', actionType: 'Update', module: 'User Management', subModule: 'Role Assignment', recordAffected: 'User: t.sarah', oldValue: 'Role: Subject Teacher', newValue: 'Role: Class Teacher, Subject Teacher', ip: '192.168.1.10', device: 'Desktop', browser: 'Chrome 122', os: 'Windows 11', status: 'Success' },
{ id: 'LOG006', timestamp: '2024-03-15 09:30:00', user: 'System', role: 'Automated Task', actionType: 'Create', module: 'Utilities', subModule: 'Backup', recordAffected: 'BKP-20240315', oldValue: '-', newValue: 'Database Backup: 2.4GB', ip: 'Localhost', device: 'Server', browser: 'System', os: 'Linux Ubuntu', status: 'Success' },
{ id: 'LOG007', timestamp: '2024-03-15 09:15:30', user: 's.emily', role: 'Student', actionType: 'View', module: 'Student Portal', subModule: 'Report Card', recordAffected: 'Student ID: STU2024001', oldValue: '-', newValue: '-', ip: '10.0.0.5', device: 'Mobile', browser: 'Safari 17', os: 'iOS 17', status: 'Success' },
{ id: 'LOG008', timestamp: '2024-03-15 09:00:00', user: 'hr.jennifer', role: 'HR Manager', actionType: 'Delete', module: 'HR Management', subModule: 'Employee Leave', recordAffected: 'Leave Request: LR-2024-045', oldValue: 'Status: Pending', newValue: 'Status: Cancelled', ip: '192.168.1.30', device: 'Tablet', browser: 'Chrome 122', os: 'Android 14', status: 'Success' },
{ id: 'LOG009', timestamp: '2024-03-15 08:45:12', user: 'admin.john', role: 'System Admin', actionType: 'Update', module: 'Security', subModule: 'Password Reset', recordAffected: 'User: acc.robert', oldValue: '-', newValue: 'Password changed', ip: '192.168.1.10', device: 'Desktop', browser: 'Chrome 122', os: 'Windows 11', status: 'Success' },
{ id: 'LOG010', timestamp: '2024-03-15 08:30:00', user: 'p.michael', role: 'Parent', actionType: 'View', module: 'Parent Portal', subModule: 'Attendance', recordAffected: 'Student: Emily Davis', oldValue: '-', newValue: '-', ip: '10.0.0.8', device: 'Mobile', browser: 'Chrome 122', os: 'Android 13', status: 'Success' },
{ id: 'LOG011', timestamp: '2024-03-15 08:15:45', user: 't.sarah', role: 'Teacher', actionType: 'Logout', module: 'Authentication', subModule: 'User Logout', recordAffected: '-', oldValue: '-', newValue: 'Session ended', ip: '192.168.1.15', device: 'Desktop', browser: 'Firefox 123', os: 'Windows 10', status: 'Success' },
{ id: 'LOG012', timestamp: '2024-03-14 18:00:00', user: 'System', role: 'Automated Task', actionType: 'Create', module: 'Utilities', subModule: 'Log Archive', recordAffected: 'Archive-20240314', oldValue: '-', newValue: 'Archived 10,000 logs', ip: 'Localhost', device: 'Server', browser: 'System', os: 'Linux Ubuntu', status: 'Success' }];


const MODULES = ['All', 'Authentication', 'User Management', 'Assessment', 'Finance', 'Student Portal', 'Parent Portal', 'HR Management', 'Security', 'Utilities'];
const ACTIONS = ['All', 'Login', 'Logout', 'Create', 'Update', 'Delete', 'View'];
const ROLES = ['All', 'System Admin', 'Teacher', 'Student', 'Parent', 'Accountant', 'HR Manager', 'Automated Task'];
const STATUSES = ['All', 'Success', 'Failed'];
const REVERTIBLE_ACTIONS = ['Create', 'Update', 'Delete'];

export function UserLog() {
  const [logs, setLogs] = useState<UserLog[]>(INITIAL_LOGS);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', user: '', role: '', module: '', action: '', status: '', ip: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [revertReason, setRevertReason] = useState('');

  const isRevertible = (log: UserLog) => REVERTIBLE_ACTIONS.includes(log.actionType) && log.status === 'Success' && !log.isReverted;

  const handleRevert = () => {
    if (!selectedLog) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLogs((prev) => prev.map((log) => log.id === selectedLog.id ?
    { ...log, isReverted: true, revertedAt: now, revertedBy: 'admin.john' } :
    log
    ));
    // Add revert log entry
    const revertLog: UserLog = {
      id: `LOG${String(logs.length + 1).padStart(3, '0')}`,
      timestamp: now, user: 'admin.john', role: 'System Admin', actionType: 'Revert',
      module: selectedLog.module, subModule: selectedLog.subModule,
      recordAffected: selectedLog.recordAffected, oldValue: selectedLog.newValue,
      newValue: selectedLog.oldValue !== '-' ? selectedLog.oldValue : 'Restored to previous state',
      ip: '192.168.1.10', device: 'Desktop', browser: 'Chrome 122', os: 'Windows 11', status: 'Success'
    };
    setLogs((prev) => [revertLog, ...prev]);
    setShowRevertModal(false);
    setRevertReason('');
    setSelectedLog(null);
  };

  const handleRestore = () => {
    if (!selectedLog) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const restoreLog: UserLog = {
      id: `LOG${String(logs.length + 1).padStart(3, '0')}`,
      timestamp: now, user: 'admin.john', role: 'System Admin', actionType: 'Restore',
      module: selectedLog.module, subModule: selectedLog.subModule,
      recordAffected: selectedLog.recordAffected, oldValue: 'Deleted',
      newValue: 'Restored', ip: '192.168.1.10', device: 'Desktop', browser: 'Chrome 122',
      os: 'Windows 11', status: 'Success'
    };
    setLogs((prev) => [restoreLog, ...prev.map((log) => log.id === selectedLog.id ?
    { ...log, isReverted: true, revertedAt: now, revertedBy: 'admin.john' } :
    log
    )]);
    setShowRestoreModal(false);
    setSelectedLog(null);
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch = !searchTerm || log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase()) || log.recordAffected.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !filters.role || filters.role === 'All' || log.role === filters.role;
    const matchModule = !filters.module || filters.module === 'All' || log.module === filters.module;
    const matchAction = !filters.action || filters.action === 'All' || log.actionType === filters.action;
    const matchStatus = !filters.status || filters.status === 'All' || log.status === filters.status;
    const matchIP = !filters.ip || log.ip.includes(filters.ip);
    return matchSearch && matchRole && matchModule && matchAction && matchStatus && matchIP;
  });

  const actionIcon = (action: string) => {
    const icons: Record<string, React.ElementType> = {
      Login: LogIn, Logout: LogOut, Create: Plus, Update: Edit, Delete: Trash2,
      View: Eye, Revert: RotateCcw, Restore: History
    };
    return icons[action] || Activity;
  };

  const ActionIcon = ({ action }: {action: string;}) => {
    const Icon = actionIcon(action);
    return <Icon className="w-4 h-4" />;
  };

  const statusBadge = (log: UserLog) => {
    if (log.isReverted) return <Badge variant="warning"><RotateCcw className="w-3 h-3 mr-1" /> Reverted</Badge>;
    return log.status === 'Success' ?
    <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Success</Badge> :
    <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
  };

  const actionColor = (action: string) => {
    const colors: Record<string, string> = {
      Delete: 'bg-red-100 text-red-600', Create: 'bg-green-100 text-green-600',
      Update: 'bg-blue-100 text-blue-600', Revert: 'bg-amber-100 text-amber-600',
      Restore: 'bg-purple-100 text-purple-600'
    };
    return colors[action] || 'bg-gray-100 text-gray-600';
  };

  const columns = [
  { key: 'id', header: 'Log ID', render: (r: UserLog) => <span className="font-mono text-xs text-gray-600">{r.id}</span> },
  { key: 'timestamp', header: 'Timestamp', render: (r: UserLog) =>
    <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <div>
          <p className="text-xs font-medium text-gray-900">{r.timestamp.split(' ')[0]}</p>
          <p className="text-xs text-gray-500">{r.timestamp.split(' ')[1]}</p>
        </div>
      </div>
  },
  { key: 'user', header: 'User & Role', render: (r: UserLog) =>
    <div>
        <p className="text-sm font-medium text-gray-900 flex items-center gap-1"><User className="w-3 h-3" /> {r.user}</p>
        <Badge variant="outline" className="text-xs mt-1">{r.role}</Badge>
      </div>
  },
  { key: 'action', header: 'Action', render: (r: UserLog) =>
    <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded ${actionColor(r.actionType)}`}><ActionIcon action={r.actionType} /></div>
        <span className="text-sm font-medium text-gray-800">{r.actionType}</span>
      </div>
  },
  { key: 'module', header: 'Module', render: (r: UserLog) =>
    <div>
        <p className="text-sm text-gray-800">{r.module}</p>
        <p className="text-xs text-gray-500">{r.subModule}</p>
      </div>
  },
  { key: 'record', header: 'Record', render: (r: UserLog) => <span className="text-xs text-gray-700">{r.recordAffected}</span> },
  { key: 'changes', header: 'Changes', render: (r: UserLog) =>
    <div className="text-xs max-w-[150px]">
        {r.oldValue !== '-' && <p className="text-red-600 truncate" title={r.oldValue}>Old: {r.oldValue}</p>}
        {r.newValue !== '-' && <p className="text-green-600 truncate" title={r.newValue}>New: {r.newValue}</p>}
        {r.oldValue === '-' && r.newValue === '-' && <span className="text-gray-400">-</span>}
      </div>
  },
  { key: 'device', header: 'Device & IP', render: (r: UserLog) =>
    <div className="text-xs">
        <p className="flex items-center gap-1 text-gray-700"><Laptop className="w-3 h-3" /> {r.device}</p>
        <p className="flex items-center gap-1 text-gray-500"><Globe className="w-3 h-3" /> {r.ip}</p>
      </div>
  },
  { key: 'status', header: 'Status', render: (r: UserLog) =>
    <div>
        {statusBadge(r)}
        {r.error && <p className="text-xs text-red-500 mt-1">{r.error}</p>}
        {r.isReverted && <p className="text-xs text-amber-600 mt-1">by {r.revertedBy}</p>}
      </div>
  },
  { key: 'actions', header: 'Actions', render: (r: UserLog) =>
    <div className="flex gap-1">
        <Button variant="ghost" size="xs" onClick={() => {setSelectedLog(r);setShowDetailModal(true);}} title="View Details">
          <Eye className="w-4 h-4" />
        </Button>
        {r.actionType === 'Delete' && r.status === 'Success' && !r.isReverted &&
      <Button variant="ghost" size="xs" className="text-purple-600 hover:bg-purple-50"
      onClick={() => {setSelectedLog(r);setShowRestoreModal(true);}} title="Restore Deleted Data">
            <History className="w-4 h-4" />
          </Button>
      }
        {isRevertible(r) && r.actionType !== 'Delete' &&
      <Button variant="ghost" size="xs" className="text-amber-600 hover:bg-amber-50"
      onClick={() => {setSelectedLog(r);setShowRevertModal(true);}} title="Revert Action">
            <RotateCcw className="w-4 h-4" />
          </Button>
      }
      </div>
  }];


  const stats = [
  { label: 'Total Logs', value: logs.length, icon: Database, color: 'blue' },
  { label: 'Success', value: logs.filter((l) => l.status === 'Success' && !l.isReverted).length, icon: CheckCircle, color: 'green' },
  { label: 'Failed', value: logs.filter((l) => l.status === 'Failed').length, icon: XCircle, color: 'red' },
  { label: 'Reverted', value: logs.filter((l) => l.isReverted).length, icon: RotateCcw, color: 'amber' }];


  const resetFilters = () => {
    setFilters({ dateFrom: '', dateTo: '', user: '', role: '', module: '', action: '', status: '', ip: '' });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" /> User Activity Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Audit trail with revert & restore capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowArchiveModal(true)}>
            <Archive className="w-4 h-4 mr-2" /> Archive
          </Button>
          <Button variant="primary" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) =>
        <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
              <div className={`p-3 rounded-full bg-${s.color}-100`}>
                <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <Input type="date" placeholder="From" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
            <Input type="date" placeholder="To" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
            <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
            <Select placeholder="Role" options={ROLES.map((r) => ({ value: r, label: r }))} value={filters.role} onChange={(v) => setFilters({ ...filters, role: v })} />
            <Select placeholder="Module" options={MODULES.map((m) => ({ value: m, label: m }))} value={filters.module} onChange={(v) => setFilters({ ...filters, module: v })} />
            <Select placeholder="Action" options={ACTIONS.map((a) => ({ value: a, label: a }))} value={filters.action} onChange={(v) => setFilters({ ...filters, action: v })} />
            <Select placeholder="Status" options={STATUSES.map((s) => ({ value: s, label: s }))} value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })} />
            <Input placeholder="IP Address" value={filters.ip} onChange={(e) => setFilters({ ...filters, ip: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}><RefreshCw className="w-4 h-4 mr-2" /> Reset</Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing {filteredLogs.length} of {logs.length} logs</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3 text-amber-500" /> Revertible actions highlighted</span>
            <span className="flex items-center gap-1"><History className="w-3 h-3 text-purple-500" /> Deleted data can be restored</span>
          </div>
        </div>
        <Table columns={columns} data={filteredLogs} />
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedLog &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Eye className="w-5 h-5" /> Log Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>✕</Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-gray-500">Log ID</span><p className="font-mono font-semibold">{selectedLog.id}</p></div>
                <div><span className="text-xs text-gray-500">Timestamp</span><p className="font-medium">{selectedLog.timestamp}</p></div>
                <div><span className="text-xs text-gray-500">User</span><p className="font-medium">{selectedLog.user}</p></div>
                <div><span className="text-xs text-gray-500">Role</span><p>{selectedLog.role}</p></div>
                <div><span className="text-xs text-gray-500">Action Type</span><p className="flex items-center gap-2"><ActionIcon action={selectedLog.actionType} /> {selectedLog.actionType}</p></div>
                <div><span className="text-xs text-gray-500">Status</span>{statusBadge(selectedLog)}</div>
                <div className="col-span-2"><span className="text-xs text-gray-500">Module</span><p>{selectedLog.module} → {selectedLog.subModule}</p></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">Record Affected</span><p className="font-medium">{selectedLog.recordAffected}</p></div>
                {selectedLog.oldValue !== '-' &&
              <div className="col-span-2 bg-red-50 p-3 rounded">
                    <span className="text-xs text-red-700 font-semibold">Old Value</span>
                    <p className="text-sm text-red-900">{selectedLog.oldValue}</p>
                  </div>
              }
                {selectedLog.newValue !== '-' &&
              <div className="col-span-2 bg-green-50 p-3 rounded">
                    <span className="text-xs text-green-700 font-semibold">New Value</span>
                    <p className="text-sm text-green-900">{selectedLog.newValue}</p>
                  </div>
              }
                <div><span className="text-xs text-gray-500">IP Address</span><p className="font-mono">{selectedLog.ip}</p></div>
                <div><span className="text-xs text-gray-500">Device</span><p>{selectedLog.device}</p></div>
                <div><span className="text-xs text-gray-500">Browser</span><p>{selectedLog.browser}</p></div>
                <div><span className="text-xs text-gray-500">OS</span><p>{selectedLog.os}</p></div>
                {selectedLog.error &&
              <div className="col-span-2 bg-red-50 border border-red-200 p-3 rounded flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-900">{selectedLog.error}</p>
                  </div>
              }
                {selectedLog.isReverted &&
              <div className="col-span-2 bg-amber-50 border border-amber-200 p-3 rounded">
                    <div className="flex items-center gap-2 text-amber-800">
                      <RotateCcw className="w-4 h-4" />
                      <span className="font-medium">This action was reverted</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">By {selectedLog.revertedBy} at {selectedLog.revertedAt}</p>
                  </div>
              }
              </div>
              {isRevertible(selectedLog) &&
            <div className="pt-4 border-t flex gap-2">
                  {selectedLog.actionType === 'Delete' ?
              <Button variant="outline" className="flex-1 text-purple-600 border-purple-300 hover:bg-purple-50"
              onClick={() => {setShowDetailModal(false);setShowRestoreModal(true);}}>
                      <History className="w-4 h-4 mr-2" /> Restore Deleted Data
                    </Button> :

              <Button variant="outline" className="flex-1 text-amber-600 border-amber-300 hover:bg-amber-50"
              onClick={() => {setShowDetailModal(false);setShowRevertModal(true);}}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Revert This Action
                    </Button>
              }
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Revert Modal */}
      {showRevertModal && selectedLog &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRevertModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" /> Revert Action
            </h2>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Are you sure you want to revert this action?</p>
                    <p className="text-sm text-amber-700 mt-1">This will undo the changes made by this operation.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="text-gray-500">Action:</span> <span className="font-medium">{selectedLog.actionType}</span></p>
                <p className="text-sm"><span className="text-gray-500">Module:</span> {selectedLog.module} → {selectedLog.subModule}</p>
                <p className="text-sm"><span className="text-gray-500">Record:</span> {selectedLog.recordAffected}</p>
                <p className="text-sm"><span className="text-gray-500">Performed by:</span> {selectedLog.user}</p>
                <p className="text-sm"><span className="text-gray-500">At:</span> {selectedLog.timestamp}</p>
              </div>
              {selectedLog.actionType === 'Update' &&
            <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-semibold mb-1">Will Restore To:</p>
                    <p className="text-sm text-green-900">{selectedLog.oldValue !== '-' ? selectedLog.oldValue : 'Previous state'}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="text-xs text-red-700 font-semibold mb-1">Will Remove:</p>
                    <p className="text-sm text-red-900">{selectedLog.newValue}</p>
                  </div>
                </div>
            }
              {selectedLog.actionType === 'Create' &&
            <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-xs text-red-700 font-semibold mb-1">Will Delete:</p>
                  <p className="text-sm text-red-900">{selectedLog.recordAffected}</p>
                </div>
            }
              <div>
                <label className="text-sm font-medium text-gray-700">Reason for Reverting *</label>
                <textarea
                className="mt-1 w-full border rounded-lg p-3 text-sm" rows={3}
                placeholder="Enter the reason for reverting this action..."
                value={revertReason} onChange={(e) => setRevertReason(e.target.value)} />

              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => {setShowRevertModal(false);setRevertReason('');}}>Cancel</Button>
              <Button variant="warning" onClick={handleRevert} disabled={!revertReason.trim()}>
                <RotateCcw className="w-4 h-4 mr-2" /> Confirm Revert
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Restore Modal */}
      {showRestoreModal && selectedLog &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRestoreModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" /> Restore Deleted Data
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <History className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Restore this deleted record?</p>
                    <p className="text-sm text-purple-700 mt-1">The data will be recovered to its state before deletion.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="text-gray-500">Deleted Record:</span> <span className="font-medium">{selectedLog.recordAffected}</span></p>
                <p className="text-sm"><span className="text-gray-500">Module:</span> {selectedLog.module} → {selectedLog.subModule}</p>
                <p className="text-sm"><span className="text-gray-500">Deleted by:</span> {selectedLog.user}</p>
                <p className="text-sm"><span className="text-gray-500">Deleted at:</span> {selectedLog.timestamp}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Data Recovery Preview</span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Previous State: <span className="font-medium">{selectedLog.oldValue !== '-' ? selectedLog.oldValue : 'Full record data'}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRestoreModal(false)}>Cancel</Button>
              <Button variant="primary" className="bg-purple-600 hover:bg-purple-700" onClick={handleRestore}>
                <History className="w-4 h-4 mr-2" /> Restore Data
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Archive Modal */}
      {showArchiveModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowArchiveModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[450px] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Archive className="w-5 h-5" /> Archive Logs</h2>
            <div className="space-y-4">
              <Select label="Archive logs older than" options={[
            { value: '30', label: '30 days' }, { value: '60', label: '60 days' },
            { value: '90', label: '90 days' }, { value: '180', label: '6 months' }, { value: '365', label: '1 year' }]
            } />
              <Input label="Archive Location" placeholder="/backups/logs/" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" /> Archived logs will be compressed and encrypted
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowArchiveModal(false)}>Cancel</Button>
              <Button variant="primary">Archive Now</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default UserLog;