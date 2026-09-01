// ManageStudentLogin.tsx - Comprehensive Student Login Management
import React, { useState } from 'react';
import {
  Search, Key, UserCheck, UserX, RefreshCw, Download, Upload,
  Eye, EyeOff, Send, Mail, MessageSquare, Phone, Copy, CheckCircle,
  AlertTriangle, Users, Shield, Lock, Unlock, Filter, Settings,
  X, Save, Printer, FileText, Clock, Calendar, ChevronDown,
  MoreVertical, Edit, Trash2, Check, Info, Bell, GraduationCap } from
'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// TYPES
// ============================================================================
interface Student {
  id: string;
  admNo: string;
  name: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  rollNo: string;
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  username: string;
  hasLogin: boolean;
  status: 'Enabled' | 'Disabled' | 'Locked';
  lastLogin?: string;
  loginCount: number;
  passwordLastChanged?: string;
  createdOn: string;
  photo?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const STUDENTS: Student[] = [
{ id: '1', admNo: 'A-2024-001', name: 'Aarav Patel', firstName: 'Aarav', lastName: 'Patel', class: '10', section: 'A', rollNo: '01', email: 'aarav@student.edu', phone: '+91 98765 43210', parentName: 'Rajesh Patel', parentEmail: 'rajesh.patel@email.com', parentPhone: '+91 98765 43211', username: 'std.2024001', hasLogin: true, status: 'Enabled', lastLogin: 'Today, 08:45 AM', loginCount: 45, passwordLastChanged: '2024-01-15', createdOn: '2024-04-01' },
{ id: '2', admNo: 'A-2024-002', name: 'Diya Sharma', firstName: 'Diya', lastName: 'Sharma', class: '10', section: 'A', rollNo: '02', email: 'diya@student.edu', phone: '+91 98765 43212', parentName: 'Suresh Sharma', parentEmail: 'suresh.sharma@email.com', parentPhone: '+91 98765 43213', username: 'std.2024002', hasLogin: true, status: 'Enabled', lastLogin: 'Yesterday, 06:30 PM', loginCount: 38, passwordLastChanged: '2024-02-10', createdOn: '2024-04-01' },
{ id: '3', admNo: 'A-2024-003', name: 'Rohan Gupta', firstName: 'Rohan', lastName: 'Gupta', class: '10', section: 'A', rollNo: '03', email: 'rohan@student.edu', phone: '+91 98765 43214', parentName: 'Amit Gupta', parentEmail: 'amit.gupta@email.com', parentPhone: '+91 98765 43215', username: 'std.2024003', hasLogin: true, status: 'Disabled', lastLogin: 'Never', loginCount: 0, createdOn: '2024-04-01' },
{ id: '4', admNo: 'A-2024-004', name: 'Ananya Singh', firstName: 'Ananya', lastName: 'Singh', class: '10', section: 'A', rollNo: '04', email: 'ananya@student.edu', phone: '+91 98765 43216', parentName: 'Vikram Singh', parentEmail: 'vikram.singh@email.com', parentPhone: '+91 98765 43217', username: 'std.2024004', hasLogin: true, status: 'Enabled', lastLogin: '3 days ago', loginCount: 22, passwordLastChanged: '2024-03-01', createdOn: '2024-04-01' },
{ id: '5', admNo: 'A-2024-005', name: 'Arjun Mehta', firstName: 'Arjun', lastName: 'Mehta', class: '10', section: 'A', rollNo: '05', email: 'arjun@student.edu', phone: '+91 98765 43218', parentName: 'Pradeep Mehta', parentEmail: 'pradeep.mehta@email.com', parentPhone: '+91 98765 43219', username: 'std.2024005', hasLogin: true, status: 'Locked', lastLogin: '1 week ago', loginCount: 15, passwordLastChanged: '2024-01-20', createdOn: '2024-04-01' },
{ id: '6', admNo: 'A-2024-006', name: 'Ishita Reddy', firstName: 'Ishita', lastName: 'Reddy', class: '10', section: 'B', rollNo: '01', email: 'ishita@student.edu', phone: '+91 98765 43220', parentName: 'Ramesh Reddy', parentEmail: 'ramesh.reddy@email.com', parentPhone: '+91 98765 43221', username: 'std.2024006', hasLogin: false, status: 'Disabled', loginCount: 0, createdOn: '2024-04-01' },
{ id: '7', admNo: 'A-2024-007', name: 'Kabir Khan', firstName: 'Kabir', lastName: 'Khan', class: '10', section: 'B', rollNo: '02', email: 'kabir@student.edu', phone: '+91 98765 43222', parentName: 'Saleem Khan', parentEmail: 'saleem.khan@email.com', parentPhone: '+91 98765 43223', username: 'std.2024007', hasLogin: true, status: 'Enabled', lastLogin: 'Today, 10:15 AM', loginCount: 52, passwordLastChanged: '2024-02-28', createdOn: '2024-04-01' },
{ id: '8', admNo: 'A-2024-008', name: 'Neha Joshi', firstName: 'Neha', lastName: 'Joshi', class: '9', section: 'A', rollNo: '01', email: 'neha@student.edu', phone: '+91 98765 43224', parentName: 'Dinesh Joshi', parentEmail: 'dinesh.joshi@email.com', parentPhone: '+91 98765 43225', username: 'std.2024008', hasLogin: true, status: 'Enabled', lastLogin: 'Today, 09:00 AM', loginCount: 35, passwordLastChanged: '2024-03-15', createdOn: '2024-04-01' }];


const CLASSES = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['All', 'A', 'B', 'C', 'D'];
const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023'];
const STATUSES = ['All', 'Enabled', 'Disabled', 'Locked', 'No Login'];

// Mock password - same for all students for demo
const getMockPassword = (): string => 'Student@123';

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
const Card = ({ children, className = '', noPadding = false }: {children: React.ReactNode;className?: string;noPadding?: boolean;}) =>
<div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${noPadding ? '' : 'p-5'} ${className}`}>
    {children}
  </div>;


const Badge = ({ variant, children, size = 'sm' }: {variant: 'success' | 'danger' | 'warning' | 'info' | 'secondary';children: React.ReactNode;size?: 'xs' | 'sm';}) => {
  const styles: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  const sizes: Record<string, string> = { xs: 'px-1.5 py-0.5 text-[10px]', sm: 'px-2 py-0.5 text-xs' };
  return <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizes[size]}`}>{children}</span>;
};

const Modal = ({ isOpen, onClose, title, subtitle, children, size = 'md', actions }: any) => {
  if (!isOpen) return null;
  const sizes: Record<string, string> = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
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

const Checkbox = ({ checked, onChange, label, disabled = false }: any) =>
<label className={`inline-flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    {label && <span className="text-sm text-slate-700">{label}</span>}
  </label>;


// ============================================================================
// VIEW CREDENTIALS MODAL
// ============================================================================
const ViewCredentialsModal = ({ isOpen, onClose, student }: {isOpen: boolean;onClose: () => void;student: Student | null;}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleAuthenticate = () => {
    if (adminPassword === 'admin123') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Hint: admin123');
    }
  };

  const handleClose = () => {
    setAuthenticated(false);
    setAdminPassword('');
    setShowPassword(false);
    setError('');
    onClose();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="View Credentials" subtitle={student.name} size="sm">
      {!authenticated ?
      <div className="py-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Authentication Required</h3>
            <p className="text-sm text-slate-500 mt-1">Enter admin password to view credentials</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
              type="password"
              value={adminPassword}
              onChange={(e) => {setAdminPassword(e.target.value);setError('');}}
              placeholder="Admin password"
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()} />

            </div>

            {error &&
          <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 px-4 py-3 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
          }

            <Button className="w-full" onClick={handleAuthenticate}>
              <Unlock className="w-4 h-4 mr-2" /> Authenticate
            </Button>
          </div>
        </div> :

      <div className="space-y-6">
          {/* Student Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500">Class {student.class}-{student.section} • Roll No: {student.rollNo}</p>
              <p className="text-xs text-slate-400">Adm No: {student.admNo}</p>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-xl">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Username</label>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-semibold text-slate-800">{student.username}</code>
                <button
                onClick={() => copyToClipboard(student.username, 'username')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors">

                  {copiedField === 'username' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Password</label>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-semibold text-slate-800">
                  {showPassword ? getMockPassword() : '••••••••••'}
                </code>
                <div className="flex items-center gap-1">
                  <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors">

                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                  <button
                  onClick={() => copyToClipboard(getMockPassword(), 'password')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors">

                    {copiedField === 'password' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <Info className="w-4 h-4 inline mr-1" />
            This is a mock password (Student@123) for demonstration purposes.
          </div>

          {/* Last Login Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Last Login:</span>
              <span className="font-medium ml-2">{student.lastLogin || 'Never'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Login Count:</span>
              <span className="font-medium ml-2">{student.loginCount}</span>
            </div>
          </div>
        </div>
      }
    </Modal>);

};

// ============================================================================
// RESET PASSWORD MODAL
// ============================================================================
const ResetPasswordModal = ({ isOpen, onClose, student, onReset }: {isOpen: boolean;onClose: () => void;student: Student | null;onReset: (data: any) => void;}) => {
  const [passwordType, setPasswordType] = useState<'auto' | 'manual'>('auto');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [sendToParent, setSendToParent] = useState(true);
  const [sendToStudent, setSendToStudent] = useState(false);

  const generatedPassword = 'NewPass@2024';

  const handleReset = () => {
    onReset({
      student,
      password: passwordType === 'auto' ? generatedPassword : newPassword,
      notifications: { sendEmail, sendSMS, sendToParent, sendToStudent }
    });
    onClose();
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
      subtitle={`${student.name} (${student.admNo})`}
      size="md"
      actions={
      <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReset}>
            <Key className="w-4 h-4 mr-2" /> Reset Password
          </Button>
        </>
      }>

      <div className="space-y-6">
        {/* Student Info Card */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{student.name}</h3>
            <p className="text-sm text-slate-600">Class {student.class}-{student.section} • Username: {student.username}</p>
          </div>
        </div>

        {/* Password Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Password Generation</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${passwordType === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="passwordType" checked={passwordType === 'auto'} onChange={() => setPasswordType('auto')} className="text-blue-600" />
              <div>
                <span className="font-medium text-slate-900">Auto Generate</span>
                <p className="text-xs text-slate-500">System generates secure password</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${passwordType === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="passwordType" checked={passwordType === 'manual'} onChange={() => setPasswordType('manual')} className="text-blue-600" />
              <div>
                <span className="font-medium text-slate-900">Set Manually</span>
                <p className="text-xs text-slate-500">Enter custom password</p>
              </div>
            </label>
          </div>
        </div>

        {/* Generated or Manual Password */}
        {passwordType === 'auto' ?
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <label className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-2">Generated Password</label>
            <div className="flex items-center justify-between">
              <code className="text-xl font-mono font-bold text-green-800">{generatedPassword}</code>
              <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div> :

        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />

                <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">

                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
        }

        {/* Notification Options */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            Send Credentials To
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-slate-700">Recipients</h5>
              <Checkbox checked={sendToParent} onChange={(e: any) => setSendToParent(e.target.checked)} label="Parent/Guardian" />
              <Checkbox checked={sendToStudent} onChange={(e: any) => setSendToStudent(e.target.checked)} label="Student" />
            </div>
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-slate-700">Channels</h5>
              <Checkbox checked={sendEmail} onChange={(e: any) => setSendEmail(e.target.checked)} label="Email" />
              <Checkbox checked={sendSMS} onChange={(e: any) => setSendSMS(e.target.checked)} label="SMS" />
            </div>
          </div>

          {sendToParent &&
          <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="text-slate-600"><strong>Parent:</strong> {student.parentName}</p>
              <p className="text-slate-500 text-xs">{student.parentEmail} • {student.parentPhone}</p>
            </div>
          }
        </div>
      </div>
    </Modal>);

};

// ============================================================================
// BULK ACTIONS MODAL
// ============================================================================
const BulkActionsModal = ({ isOpen, onClose, selectedStudents, action, onConfirm }: any) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);

  const actionConfig: Record<string, {title: string;description: string;icon: any;color: string;}> = {
    generate: { title: 'Generate Logins', description: 'Create login credentials for selected students', icon: UserCheck, color: 'blue' },
    reset: { title: 'Reset Passwords', description: 'Reset passwords for selected students', icon: Key, color: 'amber' },
    enable: { title: 'Enable Logins', description: 'Enable login access for selected students', icon: Unlock, color: 'green' },
    disable: { title: 'Disable Logins', description: 'Disable login access for selected students', icon: Lock, color: 'red' },
    send: { title: 'Send Credentials', description: 'Send login credentials to parents', icon: Send, color: 'purple' }
  };

  const config = actionConfig[action] || actionConfig.generate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={`${selectedStudents.length} students selected`}
      size="md"
      actions={
      <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {onConfirm({ sendEmail, sendSMS });onClose();}}>
            <config.icon className="w-4 h-4 mr-2" /> Confirm
          </Button>
        </>
      }>

      <div className="space-y-6">
        <div className={`p-4 bg-${config.color}-50 border border-${config.color}-200 rounded-xl flex items-start gap-4`}>
          <div className={`w-12 h-12 bg-${config.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <config.icon className={`w-6 h-6 text-${config.color}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{config.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{config.description}</p>
          </div>
        </div>

        {/* Selected Students */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Selected Students ({selectedStudents.length})</label>
          <div className="max-h-40 overflow-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {selectedStudents.map((student: Student) =>
            <div key={student.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <span className="text-sm text-slate-800">{student.name}</span>
                </div>
                <span className="text-xs text-slate-500">{student.class}-{student.section}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notification Options */}
        {(action === 'generate' || action === 'reset' || action === 'send') &&
        <div className="p-4 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-medium text-slate-800">Send Notifications</h4>
            <div className="flex gap-6">
              <Checkbox checked={sendEmail} onChange={(e: any) => setSendEmail(e.target.checked)} label="Send Email to Parents" />
              <Checkbox checked={sendSMS} onChange={(e: any) => setSendSMS(e.target.checked)} label="Send SMS to Parents" />
            </div>
          </div>
        }

        {/* Warning */}
        {action === 'disable' &&
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Disabled students will not be able to login to the student portal.
          </div>
        }
      </div>
    </Modal>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function ManageStudentLogin() {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [filters, setFilters] = useState({
    search: '',
    academicYear: '2024-2025',
    class: 'All',
    section: 'All',
    status: 'All'
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const searchLower = filters.search.toLowerCase();
    const matchSearch = !filters.search || s.name.toLowerCase().includes(searchLower) || s.admNo.toLowerCase().includes(searchLower) || s.username.toLowerCase().includes(searchLower);
    const matchClass = filters.class === 'All' || s.class === filters.class;
    const matchSection = filters.section === 'All' || s.section === filters.section;
    const matchStatus = filters.status === 'All' ||
    filters.status === 'No Login' && !s.hasLogin ||
    filters.status !== 'No Login' && s.status === filters.status;
    return matchSearch && matchClass && matchSection && matchStatus;
  });

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const selectedStudents = students.filter((s) => selectedIds.includes(s.id));

  // Action handlers
  const openViewCredentials = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const openResetPassword = (student: Student) => {
    setSelectedStudent(student);
    setShowResetModal(true);
  };

  const openBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const toggleStatus = (studentId: string) => {
    setStudents((prev) => prev.map((s) => {
      if (s.id === studentId) {
        const newStatus = s.status === 'Enabled' ? 'Disabled' : 'Enabled';
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  // Stats
  const stats = [
  { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
  { label: 'With Login', value: students.filter((s) => s.hasLogin).length, icon: Shield, color: 'emerald' },
  { label: 'Enabled', value: students.filter((s) => s.status === 'Enabled').length, icon: UserCheck, color: 'green' },
  { label: 'Disabled/Locked', value: students.filter((s) => s.status === 'Disabled' || s.status === 'Locked').length, icon: UserX, color: 'red' }];


  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Student Logins</h1>
            <p className="text-sm text-slate-500">Manage student credentials, access, and send to parents</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) =>
        <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Academic Year</label>
            <select
              value={filters.academicYear}
              onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Class</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {CLASSES.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Section</label>
            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {SECTIONS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, adm no, username..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 &&
      <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">
              {selectedIds.length}
            </div>
            <span className="font-medium">students selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('generate')}>
              <UserCheck className="w-4 h-4 mr-2" /> Generate Logins
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('reset')}>
              <Key className="w-4 h-4 mr-2" /> Reset Passwords
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('send')}>
              <Send className="w-4 h-4 mr-2" /> Send to Parents
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('enable')}>
              <Unlock className="w-4 h-4 mr-2" /> Enable
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('disable')}>
              <Lock className="w-4 h-4 mr-2" /> Disable
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setSelectedIds([])}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      }

      {/* Students Table */}
      <Card noPadding>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredStudents.length}</strong> students
          </p>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll} />

                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Login Credentials</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Parent Info</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Last Login</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) =>
              <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(student.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-4">
                    <Checkbox checked={selectedIds.includes(student.id)} onChange={() => toggleSelect(student.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">Adm: {student.admNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="info">{student.class}-{student.section}</Badge>
                    <p className="text-xs text-slate-500 mt-1">Roll: {student.rollNo}</p>
                  </td>
                  <td className="px-4 py-4">
                    {student.hasLogin ?
                  <div>
                        <code className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{student.username}</code>
                        <p className="text-[10px] text-slate-400 mt-1">Password: ••••••••</p>
                      </div> :

                  <span className="text-xs text-slate-400">No login created</span>
                  }
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-800">{student.parentName}</p>
                    <p className="text-xs text-slate-500">{student.parentPhone}</p>
                  </td>
                  <td className="px-4 py-4">
                    {!student.hasLogin ?
                  <Badge variant="secondary">No Login</Badge> :
                  student.status === 'Enabled' ?
                  <Badge variant="success"><UserCheck className="w-3 h-3 mr-1" />Enabled</Badge> :
                  student.status === 'Locked' ?
                  <Badge variant="warning"><Lock className="w-3 h-3 mr-1" />Locked</Badge> :

                  <Badge variant="danger"><UserX className="w-3 h-3 mr-1" />Disabled</Badge>
                  }
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-600">{student.lastLogin || 'Never'}</div>
                    {student.loginCount > 0 &&
                  <p className="text-xs text-slate-400">{student.loginCount} logins</p>
                  }
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                      onClick={() => openViewCredentials(student)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="View Credentials"
                      disabled={!student.hasLogin}>

                        <Eye className={`w-4 h-4 ${student.hasLogin ? 'text-blue-600' : 'text-slate-300'}`} />
                      </button>
                      <button
                      onClick={() => openResetPassword(student)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Reset Password">

                        <Key className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                      onClick={() => toggleStatus(student.id)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title={student.status === 'Enabled' ? 'Disable Login' : 'Enable Login'}
                      disabled={!student.hasLogin}>

                        {student.status === 'Enabled' ?
                      <UserX className="w-4 h-4 text-red-600" /> :

                      <UserCheck className={`w-4 h-4 ${student.hasLogin ? 'text-green-600' : 'text-slate-300'}`} />
                      }
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Send to Parent">
                        <Send className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 &&
        <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No students found</p>
          </div>
        }
      </Card>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Password Management</h4>
          <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
            <li>All passwords shown are mock values (Student@123) for demonstration</li>
            <li>Reset password to send new credentials via Email/SMS to parents</li>
            <li>Locked accounts require admin unlock after multiple failed attempts</li>
            <li>Admin password to view credentials: admin123</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <ViewCredentialsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        student={selectedStudent} />


      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        student={selectedStudent}
        onReset={(data) => console.log('Reset password:', data)} />


      <BulkActionsModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedStudents={selectedStudents}
        action={bulkAction}
        onConfirm={(data: any) => console.log('Bulk action:', bulkAction, data)} />

    </div>);

}

export default ManageStudentLogin;