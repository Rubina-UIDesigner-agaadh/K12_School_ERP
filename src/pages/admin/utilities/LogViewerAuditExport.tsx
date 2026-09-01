// File: src/pages/admin/LogViewerAuditExport.tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  FileText,
  FileJson,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Play,
  Pause,
  X } from
'lucide-react';

// Types
interface LogEntry {
  id: number;
  time: string;
  timestamp: Date;
  level: 'Info' | 'Warning' | 'Error' | 'Critical' | 'Debug';
  module: string;
  message: string;
  user: string;
  ip: string;
  details?: string;
  stackTrace?: string;
  requestId?: string;
  sessionId?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
}

interface FilterState {
  search: string;
  level: string;
  module: string;
  startDate: string;
  endDate: string;
  user: string;
  ip: string;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface ExportOptions {
  format: 'csv' | 'json' | 'txt';
  includeDetails: boolean;
  dateRange: 'all' | 'filtered' | 'current-page';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// Mock data generator
const generateMockLogs = (): LogEntry[] => {
  const levels: LogEntry['level'][] = ['Info', 'Warning', 'Error', 'Critical', 'Debug'];
  const modules = ['Auth', 'Fee', 'System', 'Student', 'Security', 'API', 'Database', 'Email', 'Report', 'Backup'];
  const users = ['admin', 'accountant', 'registrar', 'teacher', 'system', 'unknown', 'principal', 'clerk'];
  const ips = ['192.168.1.1', '192.168.1.5', '192.168.1.3', 'localhost', '10.0.0.1', '45.22.11.9', '172.16.0.50', '192.168.2.100'];

  const messages: Record<string, string[]> = {
    Auth: [
    'User login successful',
    'User logout',
    'Password changed successfully',
    'Failed login attempt',
    'Session expired',
    'Two-factor authentication enabled',
    'Password reset requested',
    'Account locked due to multiple failed attempts',
    'New user registration',
    'Role permissions updated'],

    Fee: [
    'Receipt generated with manual override',
    'Payment processed successfully',
    'Fee structure updated',
    'Refund initiated',
    'Invoice generated',
    'Late fee applied',
    'Discount applied to student fee',
    'Bulk fee collection completed',
    'Payment gateway timeout',
    'Fee reminder sent'],

    System: [
    'SMTP Connection timeout',
    'System startup completed',
    'Cache cleared',
    'Configuration updated',
    'Scheduled task executed',
    'Memory usage exceeded threshold',
    'Disk space warning',
    'System backup initiated',
    'Service restarted',
    'Health check passed'],

    Student: [
    'New student profile created',
    'Student record updated',
    'Attendance marked',
    'Grade submitted',
    'Transfer certificate generated',
    'Student promoted to next class',
    'Student document uploaded',
    'Student photo updated',
    'Parent contact updated',
    'Student deactivated'],

    Security: [
    'Multiple failed login attempts detected',
    'Suspicious activity detected',
    'IP blocked',
    'Firewall rule updated',
    'SSL certificate renewed',
    'Security scan completed',
    'Unauthorized access attempt',
    'API key regenerated',
    'Audit trail accessed',
    'Permission violation detected'],

    API: [
    'API request received',
    'Rate limit exceeded',
    'API key validated',
    'External service called',
    'Webhook delivered',
    'API response time exceeded threshold',
    'API version deprecated warning',
    'New API key generated',
    'API endpoint accessed',
    'API authentication failed'],

    Database: [
    'Database connection established',
    'Query executed successfully',
    'Database backup completed',
    'Index rebuilt',
    'Connection pool exhausted',
    'Slow query detected',
    'Database migration completed',
    'Table optimized',
    'Deadlock detected and resolved',
    'Replication lag detected'],

    Email: [
    'Email sent successfully',
    'Email delivery failed',
    'Bounce notification received',
    'Email template updated',
    'Bulk email queued',
    'SMTP configuration updated',
    'Email opened',
    'Unsubscribe request processed',
    'Email attachment uploaded',
    'Email quota exceeded'],

    Report: [
    'Report generated successfully',
    'Report scheduled',
    'Report export completed',
    'Report template created',
    'Report data refreshed',
    'Report access logged',
    'Custom report saved',
    'Report generation failed',
    'Report emailed to recipient',
    'Dashboard widget updated'],

    Backup: [
    'Backup started',
    'Backup completed successfully',
    'Backup verification passed',
    'Backup uploaded to cloud',
    'Restore point created',
    'Backup rotation executed',
    'Backup integrity check passed',
    'Incremental backup completed',
    'Backup notification sent',
    'Backup storage cleanup']

  };

  const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  'PostmanRuntime/7.28.4',
  'curl/7.68.0'];


  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 500; i++) {
    const module = modules[Math.floor(Math.random() * modules.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const moduleMessages = messages[module] || messages['System'];
    const message = moduleMessages[Math.floor(Math.random() * moduleMessages.length)];

    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    const log: LogEntry = {
      id: i + 1,
      time: timestamp.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      timestamp,
      level,
      module,
      message,
      user: users[Math.floor(Math.random() * users.length)],
      ip: ips[Math.floor(Math.random() * ips.length)],
      requestId: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      sessionId: `SES-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      duration: Math.floor(Math.random() * 5000),
      statusCode: level === 'Error' || level === 'Critical' ? [400, 401, 403, 404, 500, 502, 503][Math.floor(Math.random() * 7)] : 200
    };

    if (level === 'Error' || level === 'Critical') {
      log.details = `Error occurred while processing request. Module: ${module}, Action: ${message.toLowerCase()}`;
      log.stackTrace = `Error: ${message}\n    at processRequest (${module.toLowerCase()}.js:${Math.floor(Math.random() * 500)}:${Math.floor(Math.random() * 50)})\n    at handleEvent (server.js:${Math.floor(Math.random() * 200)}:${Math.floor(Math.random() * 30)})\n    at EventEmitter.emit (events.js:315:20)`;
    }

    logs.push(log);
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const initialLogs = generateMockLogs();

export function LogViewerAuditExport() {
  // State management
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: 'all',
    module: 'all',
    startDate: '',
    endDate: '',
    user: '',
    ip: ''
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 20,
    totalItems: initialLogs.length
  });

  // Modal states
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Export state
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeDetails: true,
    dateRange: 'filtered'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Real-time state
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected logs for bulk actions
  const [selectedLogIds, setSelectedLogIds] = useState<Set<number>>(new Set());

  // Copied state for copy to clipboard
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Notification helper
  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
        log.message.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.module.toLowerCase().includes(searchLower) ||
        log.ip.toLowerCase().includes(searchLower) ||
        log.requestId?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Level filter
      if (filters.level !== 'all' && log.level.toLowerCase() !== filters.level) {
        return false;
      }

      // Module filter
      if (filters.module !== 'all' && log.module.toLowerCase() !== filters.module.toLowerCase()) {
        return false;
      }

      // User filter
      if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) {
        return false;
      }

      // IP filter
      if (filters.ip && !log.ip.includes(filters.ip)) {
        return false;
      }

      // Date range filter
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (log.timestamp < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (log.timestamp > endDate) return false;
      }

      return true;
    });
  }, [logs, filters]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredLogs.slice(start, end);
  }, [filteredLogs, pagination.currentPage, pagination.pageSize]);

  // Total pages
  const totalPages = Math.ceil(filteredLogs.length / pagination.pageSize);

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      totalItems: filteredLogs.length
    }));
  }, [filteredLogs.length]);

  // Live mode - simulate real-time log updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const levels: LogEntry['level'][] = ['Info', 'Warning', 'Error', 'Debug'];
      const modules = ['Auth', 'API', 'System', 'Fee', 'Student'];
      const newMessages = [
      'New request received',
      'Processing completed',
      'Cache hit',
      'User action logged',
      'Health check ping'];


      const newLog: LogEntry = {
        id: Date.now(),
        time: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: newMessages[Math.floor(Math.random() * newMessages.length)],
        user: 'system',
        ip: '192.168.1.1',
        requestId: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        sessionId: `SES-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        duration: Math.floor(Math.random() * 100),
        statusCode: 200
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 999)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Handle search change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  }, []);

  // Handle level filter change
  const handleLevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, level: e.target.value }));
  }, []);

  // Handle module filter change
  const handleModuleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, module: e.target.value }));
  }, []);

  // Handle date filter change
  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, startDate: e.target.value }));
  }, []);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, endDate: e.target.value }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      level: 'all',
      module: 'all',
      startDate: '',
      endDate: '',
      user: '',
      ip: ''
    });
    addNotification('info', 'Filters Cleared', 'All filters have been reset');
  }, [addNotification]);

  // Refresh logs
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs(generateMockLogs());
      setIsRefreshing(false);
      addNotification('success', 'Logs Refreshed', 'Log data has been refreshed');
    }, 1000);
  }, [addNotification]);

  // Toggle live mode
  const handleToggleLiveMode = useCallback(() => {
    setIsLiveMode((prev) => {
      const newValue = !prev;
      addNotification(
        newValue ? 'success' : 'info',
        newValue ? 'Live Mode Enabled' : 'Live Mode Disabled',
        newValue ? 'Logs will update in real-time' : 'Real-time updates stopped'
      );
      return newValue;
    });
  }, [addNotification]);

  // View log details
  const handleViewDetails = useCallback((log: LogEntry) => {
    setSelectedLog(log);
    setShowLogDetailModal(true);
  }, []);

  // Copy log to clipboard
  const handleCopyLog = useCallback((log: LogEntry) => {
    const logText = `[${log.time}] [${log.level}] [${log.module}] ${log.message} | User: ${log.user} | IP: ${log.ip}`;
    navigator.clipboard.writeText(logText);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification('success', 'Copied', 'Log entry copied to clipboard');
  }, [addNotification]);

  // Pagination handlers
  const handleFirstPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1)
    }));
  }, []);

  const handleNextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.min(totalPages, prev.currentPage + 1)
    }));
  }, [totalPages]);

  const handleLastPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, currentPage: totalPages }));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(e.target.value),
      currentPage: 1
    }));
  }, []);

  // Export functions
  const handleOpenExportModal = useCallback(() => {
    setShowExportModal(true);
    setExportProgress(0);
  }, []);

  const generateCSV = useCallback((logsToExport: LogEntry[]): string => {
    const headers = ['Timestamp', 'Level', 'Module', 'Message', 'User', 'IP Address', 'Request ID', 'Duration (ms)', 'Status Code'];
    const rows = logsToExport.map((log) => [
    log.time,
    log.level,
    log.module,
    `"${log.message.replace(/"/g, '""')}"`,
    log.user,
    log.ip,
    log.requestId || '',
    log.duration?.toString() || '',
    log.statusCode?.toString() || '']
    );
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }, []);

  const generateJSON = useCallback((logsToExport: LogEntry[]): string => {
    const exportData = logsToExport.map((log) => ({
      timestamp: log.time,
      level: log.level,
      module: log.module,
      message: log.message,
      user: log.user,
      ipAddress: log.ip,
      requestId: log.requestId,
      sessionId: log.sessionId,
      duration: log.duration,
      statusCode: log.statusCode,
      ...(exportOptions.includeDetails && log.details ? { details: log.details } : {}),
      ...(exportOptions.includeDetails && log.stackTrace ? { stackTrace: log.stackTrace } : {})
    }));
    return JSON.stringify(exportData, null, 2);
  }, [exportOptions.includeDetails]);

  const generateTXT = useCallback((logsToExport: LogEntry[]): string => {
    return logsToExport.map((log) => {
      let text = `[${log.time}] [${log.level.toUpperCase().padEnd(8)}] [${log.module.padEnd(10)}] ${log.message}`;
      text += `\n    User: ${log.user} | IP: ${log.ip} | Request: ${log.requestId || 'N/A'}`;
      if (exportOptions.includeDetails && log.details) {
        text += `\n    Details: ${log.details}`;
      }
      return text;
    }).join('\n\n');
  }, [exportOptions.includeDetails]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    let logsToExport: LogEntry[];
    switch (exportOptions.dateRange) {
      case 'current-page':
        logsToExport = paginatedLogs;
        break;
      case 'filtered':
        logsToExport = filteredLogs;
        break;
      case 'all':
      default:
        logsToExport = logs;
    }

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (exportOptions.format) {
      case 'json':
        content = generateJSON(logsToExport);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'txt':
        content = generateTXT(logsToExport);
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
      case 'csv':
      default:
        content = generateCSV(logsToExport);
        mimeType = 'text/csv';
        fileExtension = 'csv';
    }

    clearInterval(progressInterval);
    setExportProgress(100);

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      addNotification('success', 'Export Complete', `${logsToExport.length} log entries exported as ${fileExtension.toUpperCase()}`);
    }, 500);
  }, [exportOptions, logs, filteredLogs, paginatedLogs, generateCSV, generateJSON, generateTXT, addNotification]);

  // Delete log entry (admin function)
  const handleDeleteLog = useCallback((logId: number) => {
    setLogs((prev) => prev.filter((log) => log.id !== logId));
    addNotification('success', 'Log Deleted', 'Log entry has been removed');
    if (showLogDetailModal) {
      setShowLogDetailModal(false);
    }
  }, [addNotification, showLogDetailModal]);

  // Bulk select
  const handleToggleSelect = useCallback((logId: number) => {
    setSelectedLogIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedLogIds.size === paginatedLogs.length) {
      setSelectedLogIds(new Set());
    } else {
      setSelectedLogIds(new Set(paginatedLogs.map((log) => log.id)));
    }
  }, [paginatedLogs, selectedLogIds.size]);

  const handleBulkDelete = useCallback(() => {
    setLogs((prev) => prev.filter((log) => !selectedLogIds.has(log.id)));
    addNotification('success', 'Logs Deleted', `${selectedLogIds.size} log entries have been removed`);
    setSelectedLogIds(new Set());
  }, [selectedLogIds, addNotification]);

  // Statistics
  const stats = useMemo(() => ({
    total: filteredLogs.length,
    info: filteredLogs.filter((l) => l.level === 'Info').length,
    warning: filteredLogs.filter((l) => l.level === 'Warning').length,
    error: filteredLogs.filter((l) => l.level === 'Error').length,
    critical: filteredLogs.filter((l) => l.level === 'Critical').length,
    debug: filteredLogs.filter((l) => l.level === 'Debug').length
  }), [filteredLogs]);

  // Get unique modules for filter
  const uniqueModules = useMemo(() => {
    const modules = new Set(logs.map((log) => log.module));
    return Array.from(modules).sort();
  }, [logs]);

  // Table columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={selectedLogIds.size === paginatedLogs.length && paginatedLogs.length > 0}
      onChange={handleSelectAll}
      className="rounded border-gray-300" />,


    render: (row: LogEntry) =>
    <input
      type="checkbox"
      checked={selectedLogIds.has(row.id)}
      onChange={() => handleToggleSelect(row.id)}
      className="rounded border-gray-300" />


  },
  {
    key: 'time',
    header: 'Timestamp',
    render: (row: LogEntry) =>
    <span className="font-mono text-xs">{row.time}</span>

  },
  {
    key: 'level',
    header: 'Level',
    render: (row: LogEntry) => {
      const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
        Info: 'info',
        Warning: 'warning',
        Error: 'danger',
        Critical: 'danger',
        Debug: 'secondary'
      };
      return (
        <Badge variant={variants[row.level] || 'secondary'}>
            {row.level}
          </Badge>);

    }
  },
  {
    key: 'module',
    header: 'Module',
    render: (row: LogEntry) =>
    <span className="font-medium">{row.module}</span>

  },
  {
    key: 'message',
    header: 'Message',
    render: (row: LogEntry) =>
    <span
      className="text-sm truncate max-w-xs block cursor-pointer hover:text-blue-600"
      title={row.message}
      onClick={() => handleViewDetails(row)}>

          {row.message}
        </span>

  },
  {
    key: 'user',
    header: 'User'
  },
  {
    key: 'ip',
    header: 'IP Address',
    render: (row: LogEntry) =>
    <span className="font-mono text-xs text-gray-500">{row.ip}</span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: LogEntry) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleViewDetails(row)}
        title="View Details">

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleCopyLog(row)}
        title="Copy to Clipboard">

            {copiedId === row.id ?
        <CheckCircle className="w-4 h-4 text-green-600" /> :

        <Copy className="w-4 h-4" />
        }
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleDeleteLog(row.id)}
        title="Delete Log"
        className="text-red-600 hover:text-red-700">

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) =>
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' :
          notification.type === 'error' ? 'bg-red-50 border border-red-200' :
          notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'}`
          }>

            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
            </div>
            <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
            className="text-gray-400 hover:text-gray-600">

              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {showLogDetailModal && selectedLog &&
      <Modal
        isOpen={showLogDetailModal}
        onClose={() => setShowLogDetailModal(false)}
        title="Log Entry Details">

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Timestamp</p>
                <p className="font-mono">{selectedLog.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Level</p>
                <Badge
                variant={
                selectedLog.level === 'Info' ? 'info' :
                selectedLog.level === 'Warning' ? 'warning' :
                selectedLog.level === 'Error' || selectedLog.level === 'Critical' ? 'danger' :
                'secondary'
                }>

                  {selectedLog.level}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Module</p>
                <p>{selectedLog.module}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">User</p>
                <p>{selectedLog.user}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">IP Address</p>
                <p className="font-mono">{selectedLog.ip}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Status Code</p>
                <p className={selectedLog.statusCode && selectedLog.statusCode >= 400 ? 'text-red-600' : 'text-green-600'}>
                  {selectedLog.statusCode || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Request ID</p>
                <p className="font-mono text-xs">{selectedLog.requestId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Duration</p>
                <p>{selectedLog.duration ? `${selectedLog.duration}ms` : 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase">Message</p>
              <p className="mt-1">{selectedLog.message}</p>
            </div>
            
            {selectedLog.sessionId &&
          <div>
                <p className="text-xs text-gray-500 uppercase">Session ID</p>
                <p className="font-mono text-xs">{selectedLog.sessionId}</p>
              </div>
          }
            
            {selectedLog.userAgent &&
          <div>
                <p className="text-xs text-gray-500 uppercase">User Agent</p>
                <p className="text-xs text-gray-600 break-all">{selectedLog.userAgent}</p>
              </div>
          }
            
            {selectedLog.details &&
          <div>
                <p className="text-xs text-gray-500 uppercase">Details</p>
                <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{selectedLog.details}</p>
              </div>
          }
            
            {selectedLog.stackTrace &&
          <div>
                <p className="text-xs text-gray-500 uppercase">Stack Trace</p>
                <pre className="mt-1 text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                  {selectedLog.stackTrace}
                </pre>
              </div>
          }
            
            <div className="flex gap-3 pt-4">
              <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowLogDetailModal(false)}>

                Close
              </Button>
              <Button
              className="flex-1"
              onClick={() => handleCopyLog(selectedLog)}>

                <Copy className="w-4 h-4 mr-2" />
                Copy Log
              </Button>
              <Button
              variant="danger"
              onClick={() => handleDeleteLog(selectedLog.id)}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Export Modal */}
      {showExportModal &&
      <Modal
        isOpen={showExportModal}
        onClose={() => !isExporting && setShowExportModal(false)}
        title="Export Logs">

          <div className="space-y-4">
            {isExporting ?
          <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="font-semibold">Exporting Logs...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }} />

                </div>
                <p className="text-sm text-gray-500 mt-2">{exportProgress}% complete</p>
              </div> :

          <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                  className={`p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  exportOptions.format === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`
                  }
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: 'csv' }))}>

                      <FileSpreadsheet className="w-6 h-6" />
                      <span className="text-xs">CSV</span>
                    </button>
                    <button
                  className={`p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  exportOptions.format === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`
                  }
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: 'json' }))}>

                      <FileJson className="w-6 h-6" />
                      <span className="text-xs">JSON</span>
                    </button>
                    <button
                  className={`p-3 border rounded-lg flex flex-col items-center gap-1 ${
                  exportOptions.format === 'txt' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`
                  }
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: 'txt' }))}>

                      <FileText className="w-6 h-6" />
                      <span className="text-xs">TXT</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Range</label>
                  <Select
                value={exportOptions.dateRange}
                onChange={(e) => setExportOptions((prev) => ({
                  ...prev,
                  dateRange: e.target.value as ExportOptions['dateRange']
                }))}
                options={[
                { value: 'current-page', label: `Current Page (${paginatedLogs.length} entries)` },
                { value: 'filtered', label: `Filtered Results (${filteredLogs.length} entries)` },
                { value: 'all', label: `All Logs (${logs.length} entries)` }]
                } />

                </div>
                
                <div className="flex items-center gap-2">
                  <input
                type="checkbox"
                id="includeDetails"
                checked={exportOptions.includeDetails}
                onChange={(e) => setExportOptions((prev) => ({
                  ...prev,
                  includeDetails: e.target.checked
                }))}
                className="rounded border-gray-300" />

                  <label htmlFor="includeDetails" className="text-sm text-gray-700">
                    Include error details and stack traces
                  </label>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="text-gray-600">
                    <strong>Summary:</strong> Exporting{' '}
                    {exportOptions.dateRange === 'current-page' ? paginatedLogs.length :
                exportOptions.dateRange === 'filtered' ? filteredLogs.length : logs.length}{' '}
                    log entries as {exportOptions.format.toUpperCase()}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowExportModal(false)}>

                    Cancel
                  </Button>
                  <Button
                className="flex-1"
                onClick={handleExport}>

                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </>
          }
          </div>
        </Modal>
      }

      {/* Advanced Filter Modal */}
      {showFilterModal &&
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Advanced Filters">

          <div className="space-y-4">
            <Input
            label="Filter by User"
            placeholder="Enter username..."
            value={filters.user}
            onChange={(e) => setFilters((prev) => ({ ...prev, user: e.target.value }))} />

            <Input
            label="Filter by IP Address"
            placeholder="Enter IP address..."
            value={filters.ip}
            onChange={(e) => setFilters((prev) => ({ ...prev, ip: e.target.value }))} />

            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange} />

              <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={handleEndDateChange} />

            </div>
            <div className="flex gap-3 pt-4">
              <Button
              variant="ghost"
              className="flex-1"
              onClick={handleClearFilters}>

                Clear All
              </Button>
              <Button
              className="flex-1"
              onClick={() => setShowFilterModal(false)}>

                Apply Filters
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Log Viewer
          </h1>
          <p className="text-sm text-gray-500">
            View and export system audit logs and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isLiveMode ? 'primary' : 'outline'}
            onClick={handleToggleLiveMode}
            title={isLiveMode ? 'Stop Live Updates' : 'Start Live Updates'}>

            {isLiveMode ?
            <>
                <Pause className="w-4 h-4 mr-2" />
                Live
              </> :

            <>
                <Play className="w-4 h-4 mr-2" />
                Live
              </>
            }
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}>

            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleOpenExportModal}>
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Logs</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
          <p className="text-xs text-gray-500">Info</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.error}</p>
          <p className="text-xs text-gray-500">Errors</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-red-800">{stats.critical}</p>
          <p className="text-xs text-gray-500">Critical</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.debug}</p>
          <p className="text-xs text-gray-500">Debug</p>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search logs..."
              value={filters.search}
              onChange={handleSearchChange} />

          </div>
          <Select
            placeholder="Log Level"
            value={filters.level}
            onChange={handleLevelChange}
            options={[
            { value: 'all', label: 'All Levels' },
            { value: 'info', label: 'Info' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' },
            { value: 'critical', label: 'Critical' },
            { value: 'debug', label: 'Debug' }]
            } />

          <Select
            placeholder="Module"
            value={filters.module}
            onChange={handleModuleChange}
            options={[
            { value: 'all', label: 'All Modules' },
            ...uniqueModules.map((module) => ({
              value: module.toLowerCase(),
              label: module
            }))]
            } />

          <Input
            type="date"
            value={filters.startDate}
            onChange={handleStartDateChange}
            placeholder="Start Date" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(true)}
              className="flex-1">

              <Filter className="w-4 h-4 mr-2" />
              More
            </Button>
            {(filters.search || filters.level !== 'all' || filters.module !== 'all' || filters.startDate || filters.endDate) &&
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              title="Clear Filters">

                <X className="w-4 h-4" />
              </Button>
            }
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLogIds.size > 0 &&
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedLogIds.size} log{selectedLogIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLogIds(new Set())}>

                Clear Selection
              </Button>
              <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        }

        {/* Live Mode Indicator */}
        {isLiveMode &&
        <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-800">Live mode active - logs updating in real-time</span>
          </div>
        }

        {/* Table */}
        <Table columns={columns} data={paginatedLogs} />

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, filteredLogs.length)} of{' '}
              {filteredLogs.length} events
            </span>
            <Select
              value={pagination.pageSize.toString()}
              onChange={handlePageSizeChange}
              options={[
              { value: '10', label: '10 per page' },
              { value: '20', label: '20 per page' },
              { value: '50', label: '50 per page' },
              { value: '100', label: '100 per page' }]
              } />

          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirstPage}
              disabled={pagination.currentPage === 1}>

              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pagination.currentPage === 1}>

              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {pagination.currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pagination.currentPage >= totalPages}>

              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
              disabled={pagination.currentPage >= totalPages}>

              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}