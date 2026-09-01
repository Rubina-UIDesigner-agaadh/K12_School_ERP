import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Calendar,
  Play,
  Plus,
  Trash2,
  Edit2,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
  Search,
  X } from
'lucide-react';

interface Schedule {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  status: 'Active' | 'Paused' | 'Scheduled' | 'Completed';
  lastRun: string;
  feeHead: string;
  targetClass: string;
  amount: string;
  autoGenerate: boolean;
  notifyParents: boolean;
  createdBy: string;
  successRate?: string;
}

interface ScheduleLog {
  id: string;
  scheduleId: string;
  runDate: string;
  status: 'Success' | 'Failed' | 'Partial';
  demandsGenerated: number;
  totalStudents: number;
  errors?: string;
}

export function FeeAutoDemandScheduler() {
  const [schedules, setSchedules] = useState<Schedule[]>([
  {
    id: '1',
    name: 'Monthly Tuition Fee',
    frequency: 'Monthly',
    nextRun: '2024-04-01',
    status: 'Active',
    lastRun: '2024-03-01',
    feeHead: 'Tuition Fee',
    targetClass: 'All Classes',
    amount: '₹5,000',
    autoGenerate: true,
    notifyParents: true,
    createdBy: 'Admin',
    successRate: '98%'
  },
  {
    id: '2',
    name: 'Term 1 Exam Fee',
    frequency: 'One-time',
    nextRun: '2024-09-01',
    status: 'Scheduled',
    lastRun: '-',
    feeHead: 'Exam Fee',
    targetClass: 'Class 10',
    amount: '₹1,500',
    autoGenerate: true,
    notifyParents: true,
    createdBy: 'Admin',
    successRate: '-'
  },
  {
    id: '3',
    name: 'Quarterly Transport Fee',
    frequency: 'Quarterly',
    nextRun: '2024-04-01',
    status: 'Active',
    lastRun: '2024-01-01',
    feeHead: 'Transport Fee',
    targetClass: 'All Classes',
    amount: '₹3,000',
    autoGenerate: true,
    notifyParents: false,
    createdBy: 'Accounts',
    successRate: '100%'
  },
  {
    id: '4',
    name: 'Annual Development Fee',
    frequency: 'Yearly',
    nextRun: '2024-06-01',
    status: 'Paused',
    lastRun: '2023-06-01',
    feeHead: 'Development Fee',
    targetClass: 'All Classes',
    amount: '₹10,000',
    autoGenerate: false,
    notifyParents: true,
    createdBy: 'Admin',
    successRate: '95%'
  }]
  );

  const [logs] = useState<ScheduleLog[]>([
  {
    id: '1',
    scheduleId: '1',
    runDate: '2024-03-01',
    status: 'Success',
    demandsGenerated: 485,
    totalStudents: 495
  },
  {
    id: '2',
    scheduleId: '1',
    runDate: '2024-02-01',
    status: 'Success',
    demandsGenerated: 492,
    totalStudents: 495
  },
  {
    id: '3',
    scheduleId: '3',
    runDate: '2024-01-01',
    status: 'Success',
    demandsGenerated: 245,
    totalStudents: 245
  }]
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'monthly',
    runDay: '1',
    feeHead: '',
    targetClass: '',
    amount: '',
    autoGenerate: true,
    notifyParents: true,
    runTime: '09:00'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSchedule = () => {
    const newSchedule: Schedule = {
      id: String(schedules.length + 1),
      name: formData.name,
      frequency: formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1),
      nextRun: calculateNextRun(formData.frequency, formData.runDay),
      status: 'Scheduled',
      lastRun: '-',
      feeHead: formData.feeHead,
      targetClass: formData.targetClass,
      amount: formData.amount,
      autoGenerate: formData.autoGenerate,
      notifyParents: formData.notifyParents,
      createdBy: 'Current User',
      successRate: '-'
    };
    setSchedules([...schedules, newSchedule]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const calculateNextRun = (frequency: string, day: string) => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, parseInt(day));
    return nextMonth.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      frequency: 'monthly',
      runDay: '1',
      feeHead: '',
      targetClass: '',
      amount: '',
      autoGenerate: true,
      notifyParents: true,
      runTime: '09:00'
    });
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setSchedules(schedules.map((s) =>
    s.id === id ?
    { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' as any } :
    s
    ));
  };

  const handleRunNow = (id: string) => {
    if (confirm('Run this schedule now?')) {
      // Simulate running the schedule
      alert('Schedule executed successfully!');
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesStatus = filterStatus === 'all' || schedule.status.toLowerCase() === filterStatus;
    const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.feeHead.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
  {
    key: 'name',
    header: 'Schedule Name',
    render: (row: Schedule) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.feeHead}</div>
        </div>

  },
  {
    key: 'freq',
    header: 'Frequency',
    render: (row: Schedule) =>
    <div>
          <div className="text-sm">{row.frequency}</div>
          <div className="text-xs text-gray-500">{row.targetClass}</div>
        </div>

  },
  {
    key: 'next',
    header: 'Next Run',
    render: (row: Schedule) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.nextRun}</span>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Schedule) =>
    <Badge
      variant={
      row.status === 'Active' ? 'success' :
      row.status === 'Paused' ? 'warning' :
      row.status === 'Completed' ? 'default' : 'info'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'success',
    header: 'Success Rate',
    render: (row: Schedule) =>
    <div className="text-sm font-medium text-gray-900">
          {row.successRate}
        </div>

  },
  {
    key: 'last',
    header: 'Last Run',
    render: (row: Schedule) =>
    <div className="text-sm text-gray-600">{row.lastRun}</div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Schedule) =>
    <div className="flex items-center gap-2">
          <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => {
          setSelectedSchedule(row);
          setIsViewModalOpen(true);
        }}>

            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Run Now"
        onClick={() => handleRunNow(row.id)}>

            <Play className="w-4 h-4 text-green-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title={row.status === 'Active' ? 'Pause' : 'Activate'}
        onClick={() => handleToggleStatus(row.id)}>

            {row.status === 'Active' ?
        <Pause className="w-4 h-4 text-orange-600" /> :

        <Play className="w-4 h-4 text-green-600" />
        }
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Edit">

            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => handleDeleteSchedule(row.id)}>

            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];


  const statsCards = [
  {
    title: 'Active Schedules',
    value: schedules.filter((s) => s.status === 'Active').length,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Scheduled',
    value: schedules.filter((s) => s.status === 'Scheduled').length,
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Paused',
    value: schedules.filter((s) => s.status === 'Paused').length,
    icon: Pause,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Total Schedules',
    value: schedules.length,
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }];


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Auto-Demand Scheduler
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automate fee demand generation and streamline payment collection
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) =>
        <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schedules..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'paused', 'scheduled'].map((status) =>
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status ?
              'bg-blue-600 text-white' :
              'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }>

                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card title="All Schedules" className="overflow-hidden">
          <Table columns={columns} data={filteredSchedules} />
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {logs.map((log) => {
              const schedule = schedules.find((s) => s.id === log.scheduleId);
              return (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                    log.status === 'Success' ? 'bg-green-100' :
                    log.status === 'Failed' ? 'bg-red-100' : 'bg-yellow-100'}`
                    }>
                      {log.status === 'Success' ?
                      <CheckCircle className="w-5 h-5 text-green-600" /> :

                      <AlertCircle className="w-5 h-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{schedule?.name}</div>
                      <div className="text-sm text-gray-500">
                        Generated {log.demandsGenerated} of {log.totalStudents} demands
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">{log.runDate}</div>
                    <Badge variant={log.status === 'Success' ? 'success' : 'error'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>);

            })}
          </div>
        </Card>
      </div>

      {/* Create Schedule Modal */}
      {isCreateModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Create New Schedule</h2>
              <button
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Basic Information</h3>
                <Input
                label="Schedule Name"
                placeholder="e.g. Monthly Transport Fee"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required />

                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                  label="Frequency"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'half-yearly', label: 'Half-Yearly' },
                  { value: 'yearly', label: 'Yearly' },
                  { value: 'one-time', label: 'One-time' }]
                  } />

                  
                  <Input
                  label="Run on Day"
                  type="number"
                  min="1"
                  max="28"
                  placeholder="1-28"
                  value={formData.runDay}
                  onChange={(e) => handleInputChange('runDay', e.target.value)}
                  helperText="Day of month (1-28)" />

                </div>

                <Input
                label="Run Time"
                type="time"
                value={formData.runTime}
                onChange={(e) => handleInputChange('runTime', e.target.value)} />

              </div>

              {/* Fee Details */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-gray-900">Fee Details</h3>
                
                <Select
                label="Fee Head"
                value={formData.feeHead}
                onChange={(e) => handleInputChange('feeHead', e.target.value)}
                options={[
                { value: 'tuition', label: 'Tuition Fee' },
                { value: 'transport', label: 'Transport Fee' },
                { value: 'exam', label: 'Exam Fee' },
                { value: 'library', label: 'Library Fee' },
                { value: 'development', label: 'Development Fee' }]
                }
                required />


                <Select
                label="Target Class/Group"
                value={formData.targetClass}
                onChange={(e) => handleInputChange('targetClass', e.target.value)}
                options={[
                { value: 'all', label: 'All Classes' },
                { value: 'class-1', label: 'Class 1' },
                { value: 'class-2', label: 'Class 2' },
                { value: 'class-10', label: 'Class 10' },
                { value: 'class-12', label: 'Class 12' }]
                }
                required />


                <Input
                label="Amount"
                type="text"
                placeholder="₹5,000"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required />

              </div>

              {/* Options */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-gray-900">Options</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={formData.autoGenerate}
                  onChange={(e) => handleInputChange('autoGenerate', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                  <div>
                    <div className="font-medium text-gray-900">Auto-generate demands</div>
                    <div className="text-sm text-gray-500">Automatically create fee demands without manual approval</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={formData.notifyParents}
                  onChange={(e) => handleInputChange('notifyParents', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                  <div>
                    <div className="font-medium text-gray-900">Notify parents</div>
                    <div className="text-sm text-gray-500">Send SMS/Email notifications to parents</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleCreateSchedule}
              disabled={!formData.name || !formData.feeHead || !formData.targetClass || !formData.amount}>

                Create Schedule
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {isViewModalOpen && selectedSchedule &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Schedule Details</h2>
              <button
              onClick={() => setIsViewModalOpen(false)}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Schedule Name</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedSchedule.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedSchedule.status === 'Active' ? 'success' : 'warning'}>
                      {selectedSchedule.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Frequency</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.frequency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fee Head</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.feeHead}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Target Class</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.targetClass}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Next Run Date</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.nextRun}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Run</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.lastRun}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Success Rate</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.successRate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <p className="text-gray-900 mt-1">{selectedSchedule.createdBy}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {selectedSchedule.autoGenerate ?
                  <CheckCircle className="w-5 h-5 text-green-600" /> :

                  <X className="w-5 h-5 text-red-600" />
                  }
                    <span className="text-gray-700">Auto-generate demands</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSchedule.notifyParents ?
                  <CheckCircle className="w-5 h-5 text-green-600" /> :

                  <X className="w-5 h-5 text-red-600" />
                  }
                    <span className="text-gray-700">Notify parents</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Runs</h3>
                <div className="space-y-3">
                  {logs.
                filter((log) => log.scheduleId === selectedSchedule.id).
                map((log) =>
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {log.demandsGenerated} demands generated
                            </div>
                            <div className="text-sm text-gray-500">{log.runDate}</div>
                          </div>
                        </div>
                        <Badge variant="success">{log.status}</Badge>
                      </div>
                )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}