// ManageEmployeeLogin.tsx - Comprehensive Employee Login Management
import React, { useState } from 'react';
import {
  Search, Key, UserCheck, UserX, RefreshCw, Download, Upload,
  Eye, EyeOff, Send, Mail, MessageSquare, Phone, Copy, CheckCircle,
  AlertTriangle, Users, Shield, Lock, Unlock, Filter, Settings,
  X, Save, Printer, FileText, Clock, Calendar, ChevronDown,
  MoreVertical, Edit, Trash2, Check, Info, Bell, Briefcase,
  Building, UserPlus, Fingerprint, Globe, Monitor, LogOut } from
'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// TYPES
// ============================================================================
interface Employee {
  id: string;
  empCode: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: 'Permanent' | 'Contract' | 'Visiting' | 'Probation';
  joiningDate: string;
  employeeStatus: 'Active' | 'Inactive' | 'Terminated' | 'On Leave';
  hasLogin: boolean;
  username?: string;
  assignedRole?: string;
  loginStatus: 'Enabled' | 'Disabled' | 'Locked' | 'Temporary' | 'No Login';
  twoFAEnabled: boolean;
  lastLogin?: string;
  loginCount: number;
  passwordLastChanged?: string;
  accessRestrictions?: {
    workingHoursOnly: boolean;
    startTime?: string;
    endTime?: string;
    ipRestricted: boolean;
    allowedIPs?: string[];
  };
  temporaryAccess?: {
    enabled: boolean;
    expiryDate?: string;
  };
  createdOn: string;
  photo?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const EMPLOYEES: Employee[] = [
{ id: '1', empCode: 'EMP001', name: 'Sarah Smith', firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@school.edu', phone: '+91 98765 43210', department: 'Science', designation: 'HOD - Physics', employmentType: 'Permanent', joiningDate: '2020-06-15', employeeStatus: 'Active', hasLogin: true, username: 't.sarah', assignedRole: 'Class Teacher', loginStatus: 'Enabled', twoFAEnabled: true, lastLogin: 'Today, 09:30 AM', loginCount: 245, passwordLastChanged: '2024-01-15', createdOn: '2020-06-15' },
{ id: '2', empCode: 'EMP002', name: 'Robert Johnson', firstName: 'Robert', lastName: 'Johnson', email: 'robert.j@school.edu', phone: '+91 98765 43211', department: 'Finance', designation: 'Senior Accountant', employmentType: 'Permanent', joiningDate: '2019-03-10', employeeStatus: 'Active', hasLogin: true, username: 'acc.robert', assignedRole: 'Accountant', loginStatus: 'Enabled', twoFAEnabled: false, lastLogin: 'Yesterday, 02:15 PM', loginCount: 189, passwordLastChanged: '2024-02-01', createdOn: '2019-03-10' },
{ id: '3', empCode: 'EMP003', name: 'Dr. Rajesh Kumar', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.k@school.edu', phone: '+91 98765 43212', department: 'Science', designation: 'Visiting Faculty', employmentType: 'Visiting', joiningDate: '2024-01-01', employeeStatus: 'Active', hasLogin: true, username: 'v.rajesh', assignedRole: 'Guest Teacher', loginStatus: 'Temporary', twoFAEnabled: false, lastLogin: '3 days ago', loginCount: 12, temporaryAccess: { enabled: true, expiryDate: '2024-06-30' }, createdOn: '2024-01-01' },
{ id: '4', empCode: 'EMP004', name: 'Priya Sharma', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@school.edu', phone: '+91 98765 43213', department: 'Administration', designation: 'Junior Clerk', employmentType: 'Probation', joiningDate: '2024-02-01', employeeStatus: 'Active', hasLogin: false, loginStatus: 'No Login', twoFAEnabled: false, loginCount: 0, createdOn: '2024-02-01' },
{ id: '5', empCode: 'EMP005', name: 'Michael Brown', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@school.edu', phone: '+91 98765 43214', department: 'IT', designation: 'System Admin', employmentType: 'Permanent', joiningDate: '2018-07-20', employeeStatus: 'Active', hasLogin: true, username: 'admin.michael', assignedRole: 'System Admin', loginStatus: 'Enabled', twoFAEnabled: true, lastLogin: 'Today, 06:00 AM', loginCount: 512, passwordLastChanged: '2024-03-01', accessRestrictions: { workingHoursOnly: false, ipRestricted: true, allowedIPs: ['192.168.1.*'] }, createdOn: '2018-07-20' },
{ id: '6', empCode: 'EMP006', name: 'Emily Davis', firstName: 'Emily', lastName: 'Davis', email: 'emily.d@school.edu', phone: '+91 98765 43215', department: 'HR', designation: 'HR Manager', employmentType: 'Permanent', joiningDate: '2017-11-05', employeeStatus: 'Active', hasLogin: true, username: 'hr.emily', assignedRole: 'HR Manager', loginStatus: 'Enabled', twoFAEnabled: true, lastLogin: 'Today, 10:15 AM', loginCount: 320, passwordLastChanged: '2024-02-15', createdOn: '2017-11-05' },
{ id: '7', empCode: 'EMP007', name: 'John Wilson', firstName: 'John', lastName: 'Wilson', email: 'john.w@school.edu', phone: '+91 98765 43216', department: 'Mathematics', designation: 'Senior Teacher', employmentType: 'Permanent', joiningDate: '2015-04-12', employeeStatus: 'Active', hasLogin: true, username: 't.john', assignedRole: 'Teacher', loginStatus: 'Disabled', twoFAEnabled: false, lastLogin: '2 weeks ago', loginCount: 156, passwordLastChanged: '2023-12-01', createdOn: '2015-04-12' },
{ id: '8', empCode: 'EMP008', name: 'Lisa Anderson', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@school.edu', phone: '+91 98765 43217', department: 'Library', designation: 'Librarian', employmentType: 'Contract', joiningDate: '2022-08-01', employeeStatus: 'Active', hasLogin: true, username: 'lib.lisa', assignedRole: 'Librarian', loginStatus: 'Locked', twoFAEnabled: false, lastLogin: '1 week ago', loginCount: 78, passwordLastChanged: '2024-01-01', createdOn: '2022-08-01' },
{ id: '9', empCode: 'EMP009', name: 'David Lee', firstName: 'David', lastName: 'Lee', email: 'david.l@school.edu', phone: '+91 98765 43218', department: 'Sports', designation: 'Sports Coach', employmentType: 'Permanent', joiningDate: '2021-01-15', employeeStatus: 'On Leave', hasLogin: true, username: 'sports.david', assignedRole: 'Staff', loginStatus: 'Disabled', twoFAEnabled: false, lastLogin: '1 month ago', loginCount: 45, createdOn: '2021-01-15' },
{ id: '10', empCode: 'EMP010', name: 'Former Employee', firstName: 'Former', lastName: 'Employee', email: 'former@school.edu', phone: '+91 98765 43219', department: 'Administration', designation: 'Clerk', employmentType: 'Permanent', joiningDate: '2019-05-01', employeeStatus: 'Terminated', hasLogin: true, username: 'admin.former', loginStatus: 'Disabled', twoFAEnabled: false, lastLogin: '3 months ago', loginCount: 89, createdOn: '2019-05-01' }];


const DEPARTMENTS = ['All', 'Science', 'Mathematics', 'English', 'Social Studies', 'Finance', 'Administration', 'HR', 'IT', 'Library', 'Sports'];
const DESIGNATIONS = ['All', 'Principal', 'Vice Principal', 'HOD', 'Senior Teacher', 'Teacher', 'Visiting Faculty', 'Accountant', 'HR Manager', 'System Admin', 'Librarian', 'Clerk', 'Coach'];
const EMPLOYMENT_TYPES = ['All', 'Permanent', 'Contract', 'Visiting', 'Probation'];
const EMPLOYEE_STATUSES = ['All', 'Active', 'Inactive', 'On Leave', 'Terminated'];
const LOGIN_STATUSES = ['All', 'Enabled', 'Disabled', 'Locked', 'Temporary', 'No Login'];
const ROLES = ['System Admin', 'Principal', 'Vice Principal', 'HOD', 'Class Teacher', 'Teacher', 'Accountant', 'HR Manager', 'Librarian', 'Staff', 'Guest Teacher', 'Data Entry'];

// Mock password function
const getMockPassword = (): string => 'Employee@123';

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
const Card = ({ children, className = '', noPadding = false, title, icon }: {children: React.ReactNode;className?: string;noPadding?: boolean;title?: string;icon?: React.ReactNode;}) =>
<div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {title &&
  <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        {icon && <div className="text-slate-500">{icon}</div>}
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
  }
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </div>;


const Badge = ({ variant, children, size = 'sm' }: {variant: 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'purple';children: React.ReactNode;size?: 'xs' | 'sm';}) => {
  const styles: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
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


const Tabs = ({ tabs, activeTab, onChange }: {tabs: {id: string;label: string;icon?: any;}[];activeTab: string;onChange: (id: string) => void;}) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
    {tabs.map((tab) =>
  <button key={tab.id} onClick={() => onChange(tab.id)}
  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
  activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`
  }>
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
      </button>
  )}
  </div>;


// ============================================================================
// VIEW CREDENTIALS MODAL
// ============================================================================
const ViewCredentialsModal = ({ isOpen, onClose, employee }: {isOpen: boolean;onClose: () => void;employee: Employee | null;}) => {
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

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="View Credentials" subtitle={`${employee.name} (${employee.empCode})`} size="sm">
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
              <input type="password" value={adminPassword} onChange={(e) => {setAdminPassword(e.target.value);setError('');}}
            placeholder="Admin password" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {/* Employee Info */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{employee.name}</h3>
              <p className="text-sm text-slate-600">{employee.designation} • {employee.department}</p>
              <p className="text-xs text-slate-400">Code: {employee.empCode}</p>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-xl">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Username</label>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-semibold text-slate-800">{employee.username}</code>
                <button onClick={() => copyToClipboard(employee.username!, 'username')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  {copiedField === 'username' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Password</label>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-semibold text-slate-800">
                  {showPassword ? getMockPassword() : '••••••••••••'}
                </code>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowPassword(!showPassword)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                  <button onClick={() => copyToClipboard(getMockPassword(), 'password')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    {copiedField === 'password' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <Info className="w-4 h-4 inline mr-1" />
            Mock password (Employee@123) shown for demonstration purposes.
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Role:</span>
              <span className="font-medium ml-2">{employee.assignedRole || 'Not Assigned'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">2FA:</span>
              <span className="font-medium ml-2">{employee.twoFAEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Last Login:</span>
              <span className="font-medium ml-2">{employee.lastLogin || 'Never'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500">Login Count:</span>
              <span className="font-medium ml-2">{employee.loginCount}</span>
            </div>
          </div>
        </div>
      }
    </Modal>);

};

// ============================================================================
// RESET PASSWORD MODAL
// ============================================================================
const ResetPasswordModal = ({ isOpen, onClose, employee, onReset }: {isOpen: boolean;onClose: () => void;employee: Employee | null;onReset: (data: any) => void;}) => {
  const [passwordType, setPasswordType] = useState<'auto' | 'manual'>('auto');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);
  const [forceChange, setForceChange] = useState(true);

  const generatedPassword = 'NewEmp@2024';

  const handleReset = () => {
    onReset({
      employee,
      password: passwordType === 'auto' ? generatedPassword : newPassword,
      notifications: { sendEmail, sendSMS },
      forceChange
    });
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Password" subtitle={`${employee.name} (${employee.empCode})`} size="md"
    actions={
    <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReset}><Key className="w-4 h-4 mr-2" /> Reset Password</Button>
        </>
    }>
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{employee.name}</h3>
            <p className="text-sm text-slate-600">{employee.designation} • Username: {employee.username}</p>
          </div>
        </div>

        {/* Password Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Password Generation</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${passwordType === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input type="radio" name="passwordType" checked={passwordType === 'auto'} onChange={() => setPasswordType('auto')} className="text-blue-600" />
              <div>
                <span className="font-medium text-slate-900">Auto Generate</span>
                <p className="text-xs text-slate-500">Secure random password</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${passwordType === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input type="radio" name="passwordType" checked={passwordType === 'manual'} onChange={() => setPasswordType('manual')} className="text-blue-600" />
              <div>
                <span className="font-medium text-slate-900">Set Manually</span>
                <p className="text-xs text-slate-500">Enter custom password</p>
              </div>
            </label>
          </div>
        </div>

        {/* Password Display/Input */}
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
                <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm pr-10" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        }

        {/* Options */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" /> Options
          </h4>
          <Checkbox checked={forceChange} onChange={(e: any) => setForceChange(e.target.checked)} label="Force password change on next login" />
        </div>

        {/* Notifications */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" /> Send Credentials
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Checkbox checked={sendEmail} onChange={(e: any) => setSendEmail(e.target.checked)} label="Send via Email" />
            <Checkbox checked={sendSMS} onChange={(e: any) => setSendSMS(e.target.checked)} label="Send via SMS" />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-sm">
            <p className="text-slate-600"><strong>Email:</strong> {employee.email}</p>
            <p className="text-slate-500 text-xs mt-1"><strong>Phone:</strong> {employee.phone}</p>
          </div>
        </div>
      </div>
    </Modal>);

};

// ============================================================================
// CREATE LOGIN MODAL
// ============================================================================
const CreateLoginModal = ({ isOpen, onClose, employee, onCreate }: {isOpen: boolean;onClose: () => void;employee: Employee | null;onCreate: (data: any) => void;}) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [passwordType, setPasswordType] = useState<'auto' | 'manual'>('auto');
  const [password, setPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [temporaryAccess, setTemporaryAccess] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  const generatedPassword = 'Welcome@123';

  React.useEffect(() => {
    if (employee) {
      const autoUsername = `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase().charAt(0)}`;
      setUsername(autoUsername);
      setTemporaryAccess(employee.employmentType === 'Visiting');
    }
  }, [employee]);

  const handleCreate = () => {
    onCreate({
      employee,
      username,
      role,
      password: passwordType === 'auto' ? generatedPassword : password,
      enable2FA,
      temporaryAccess,
      expiryDate,
      notifications: { sendEmail, sendSMS }
    });
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Login" subtitle={`${employee.name} (${employee.empCode})`} size="md"
    actions={
    <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}><UserPlus className="w-4 h-4 mr-2" /> Create Login</Button>
        </>
    }>
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{employee.name}</h3>
            <p className="text-sm text-slate-600">{employee.designation} • {employee.department}</p>
            <p className="text-xs text-slate-400">{employee.employmentType} • Joined: {employee.joiningDate}</p>
          </div>
        </div>

        {/* Username & Role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm">
              <option value="">Select Role</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Initial Password</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${passwordType === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input type="radio" checked={passwordType === 'auto'} onChange={() => setPasswordType('auto')} className="text-blue-600" />
              <span className="text-sm font-medium">Auto Generate</span>
            </label>
            <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${passwordType === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
              <input type="radio" checked={passwordType === 'manual'} onChange={() => setPasswordType('manual')} className="text-blue-600" />
              <span className="text-sm font-medium">Set Manually</span>
            </label>
          </div>
          {passwordType === 'auto' ?
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <code className="text-sm font-mono font-bold text-green-800">{generatedPassword}</code>
            </div> :

          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
          className="mt-3 w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
          }
        </div>

        {/* Security Options */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security
          </h4>
          <Checkbox checked={enable2FA} onChange={(e: any) => setEnable2FA(e.target.checked)} label="Enable Two-Factor Authentication" />
          
          <div className="pt-3 border-t border-slate-100">
            <Checkbox checked={temporaryAccess} onChange={(e: any) => setTemporaryAccess(e.target.checked)} label="Temporary Access (for visiting faculty)" />
            {temporaryAccess &&
            <div className="mt-3 ml-6">
                <label className="block text-sm text-slate-600 mb-1">Access Expiry Date</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            }
          </div>
        </div>

        {/* Notifications */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3">
          <h4 className="font-medium text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Send Credentials To
          </h4>
          <div className="flex gap-6">
            <Checkbox checked={sendEmail} onChange={(e: any) => setSendEmail(e.target.checked)} label={`Email (${employee.email})`} />
            <Checkbox checked={sendSMS} onChange={(e: any) => setSendSMS(e.target.checked)} label="SMS" />
          </div>
        </div>
      </div>
    </Modal>);

};

// ============================================================================
// SEND CREDENTIALS MODAL
// ============================================================================
const SendCredentialsModal = ({ isOpen, onClose, employees, onSend }: {isOpen: boolean;onClose: () => void;employees: Employee[];onSend: (data: any) => void;}) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);
  const [includePassword, setIncludePassword] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleSend = () => {
    onSend({ employees, sendEmail, sendSMS, includePassword, customMessage });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Credentials" subtitle={`${employees.length} employee(s) selected`} size="md"
    actions={
    <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend}><Send className="w-4 h-4 mr-2" /> Send</Button>
        </>
    }>
      <div className="space-y-6">
        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Recipients ({employees.length})</label>
          <div className="max-h-40 overflow-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {employees.map((emp) =>
            <div key={emp.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <span className="text-sm text-slate-800">{emp.name}</span>
                </div>
                <code className="text-xs text-slate-500 font-mono">{emp.username}</code>
              </div>
            )}
          </div>
        </div>

        {/* Channels */}
        <div className="p-4 border border-slate-200 rounded-xl space-y-3">
          <h4 className="font-medium text-slate-800">Notification Channels</h4>
          <div className="flex gap-6">
            <Checkbox checked={sendEmail} onChange={(e: any) => setSendEmail(e.target.checked)} label="Email" />
            <Checkbox checked={sendSMS} onChange={(e: any) => setSendSMS(e.target.checked)} label="SMS" />
          </div>
        </div>

        {/* Options */}
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl space-y-3">
          <Checkbox checked={includePassword} onChange={(e: any) => setIncludePassword(e.target.checked)} label="Include password in message (not recommended)" />
          {includePassword &&
          <p className="text-xs text-amber-700 ml-6">
              ⚠️ For security, consider sending a password reset link instead.
            </p>
          }
        </div>

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Custom Message (Optional)</label>
          <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={3}
          placeholder="Add a custom message to include in the notification..."
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
    </Modal>);

};

// ============================================================================
// BULK ACTIONS MODAL
// ============================================================================
const BulkActionsModal = ({ isOpen, onClose, employees, action, onConfirm }: any) => {
  const [sendNotification, setSendNotification] = useState(true);

  const actionConfig: Record<string, {title: string;description: string;icon: any;color: string;}> = {
    enable: { title: 'Enable Logins', description: 'Enable login access for selected employees', icon: UserCheck, color: 'green' },
    disable: { title: 'Disable Logins', description: 'Disable login access for selected employees', icon: UserX, color: 'red' },
    reset: { title: 'Reset Passwords', description: 'Reset passwords for selected employees', icon: Key, color: 'amber' },
    force_change: { title: 'Force Password Change', description: 'Require password change on next login', icon: RefreshCw, color: 'purple' },
    enable_2fa: { title: 'Enable 2FA', description: 'Enable two-factor authentication', icon: Shield, color: 'blue' },
    disable_2fa: { title: 'Disable 2FA', description: 'Disable two-factor authentication', icon: Unlock, color: 'slate' }
  };

  const config = actionConfig[action] || actionConfig.enable;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title} subtitle={`${employees.length} employees selected`} size="md"
    actions={
    <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {onConfirm({ sendNotification });onClose();}}>
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Selected Employees</label>
          <div className="max-h-48 overflow-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {employees.map((emp: Employee) =>
            <div key={emp.id} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div>
                    <span className="text-sm text-slate-800 block">{emp.name}</span>
                    <span className="text-xs text-slate-500">{emp.department}</span>
                  </div>
                </div>
                <Badge variant={emp.loginStatus === 'Enabled' ? 'success' : 'secondary'} size="xs">{emp.loginStatus}</Badge>
              </div>
            )}
          </div>
        </div>

        {(action === 'reset' || action === 'enable' || action === 'disable') &&
        <Checkbox checked={sendNotification} onChange={(e: any) => setSendNotification(e.target.checked)} label="Send email notification to employees" />
        }

        {action === 'disable' &&
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Disabled employees will not be able to access the system.
          </div>
        }
      </div>
    </Modal>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function ManageEmployeeLogin() {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    designation: 'All',
    employmentType: 'All',
    employeeStatus: 'All',
    loginStatus: 'All',
    twoFA: 'All'
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filtered employees
  const filteredEmployees = employees.filter((e) => {
    const searchLower = filters.search.toLowerCase();
    const matchSearch = !filters.search || e.name.toLowerCase().includes(searchLower) || e.empCode.toLowerCase().includes(searchLower) || (e.username?.toLowerCase() || '').includes(searchLower);
    const matchDept = filters.department === 'All' || e.department === filters.department;
    const matchDesig = filters.designation === 'All' || e.designation.includes(filters.designation);
    const matchEmpType = filters.employmentType === 'All' || e.employmentType === filters.employmentType;
    const matchEmpStatus = filters.employeeStatus === 'All' || e.employeeStatus === filters.employeeStatus;
    const matchLoginStatus = filters.loginStatus === 'All' || e.loginStatus === filters.loginStatus;
    const match2FA = filters.twoFA === 'All' || (filters.twoFA === 'Enabled' ? e.twoFAEnabled : !e.twoFAEnabled);
    return matchSearch && matchDept && matchDesig && matchEmpType && matchEmpStatus && matchLoginStatus && match2FA;
  });

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredEmployees.length ? [] : filteredEmployees.map((e) => e.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const selectedEmployees = employees.filter((e) => selectedIds.includes(e.id));

  const toggleStatus = (empId: string) => {
    setEmployees((prev) => prev.map((e) => {
      if (e.id === empId && e.hasLogin) {
        return { ...e, loginStatus: e.loginStatus === 'Enabled' ? 'Disabled' : 'Enabled' };
      }
      return e;
    }));
  };

  const openBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  // Stats
  const stats = [
  { label: 'Total Employees', value: employees.length, icon: Users, color: 'blue' },
  { label: 'With Login', value: employees.filter((e) => e.hasLogin).length, icon: Shield, color: 'emerald' },
  { label: 'Enabled', value: employees.filter((e) => e.loginStatus === 'Enabled').length, icon: UserCheck, color: 'green' },
  { label: '2FA Active', value: employees.filter((e) => e.twoFAEnabled).length, icon: Fingerprint, color: 'purple' }];


  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Employee Logins</h1>
            <p className="text-sm text-slate-500">Create, manage, and control staff access credentials</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <Button variant="outline" size="sm" onClick={() => {setSelectedEmployee(null);setShowSendModal(true);}}>
            <Send className="w-4 h-4 mr-2" /> Send Credentials
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Type</label>
            <select value={filters.employmentType} onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee Status</label>
            <select value={filters.employeeStatus} onChange={(e) => setFilters({ ...filters, employeeStatus: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
              {EMPLOYEE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Login Status</label>
            <select value={filters.loginStatus} onChange={(e) => setFilters({ ...filters, loginStatus: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
              {LOGIN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">2FA Status</label>
            <select value={filters.twoFA} onChange={(e) => setFilters({ ...filters, twoFA: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
              <option value="All">All</option>
              <option value="Enabled">2FA Enabled</option>
              <option value="Disabled">2FA Disabled</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, code, username..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 &&
      <div className="bg-purple-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">{selectedIds.length}</div>
            <span className="font-medium">employees selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('enable')}>
              <UserCheck className="w-4 h-4 mr-1" /> Enable
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('disable')}>
              <UserX className="w-4 h-4 mr-1" /> Disable
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('reset')}>
              <Key className="w-4 h-4 mr-1" /> Reset Password
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('force_change')}>
              <RefreshCw className="w-4 h-4 mr-1" /> Force Change
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => openBulkAction('enable_2fa')}>
              <Shield className="w-4 h-4 mr-1" /> Enable 2FA
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setShowSendModal(true)}>
              <Send className="w-4 h-4 mr-1" /> Send Credentials
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setSelectedIds([])}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      }

      {/* Employees Table */}
      <Card noPadding>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <p className="text-sm text-slate-600">Showing <strong>{filteredEmployees.length}</strong> employees</p>
          <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Login Info</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Last Login</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((employee) =>
              <tr key={employee.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(employee.id) ? 'bg-purple-50' : ''}`}>
                  <td className="px-4 py-4">
                    <Checkbox checked={selectedIds.includes(employee.id)} onChange={() => toggleSelect(employee.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{employee.name}</p>
                        <p className="text-xs text-slate-500">{employee.empCode} • {employee.employmentType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-800">{employee.department}</p>
                    <p className="text-xs text-slate-500">{employee.designation}</p>
                  </td>
                  <td className="px-4 py-4">
                    {employee.hasLogin ?
                  <div>
                        <code className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{employee.username}</code>
                        <p className="text-[10px] text-slate-400 mt-1">Password: ••••••••</p>
                      </div> :

                  <span className="text-xs text-slate-400 italic">Not Created</span>
                  }
                  </td>
                  <td className="px-4 py-4">
                    {employee.assignedRole ?
                  <Badge variant="info">{employee.assignedRole}</Badge> :

                  <span className="text-xs text-slate-400">Not Assigned</span>
                  }
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {employee.loginStatus === 'Enabled' && <Badge variant="success"><UserCheck className="w-3 h-3 mr-1" />Enabled</Badge>}
                      {employee.loginStatus === 'Disabled' && <Badge variant="danger"><UserX className="w-3 h-3 mr-1" />Disabled</Badge>}
                      {employee.loginStatus === 'Locked' && <Badge variant="warning"><Lock className="w-3 h-3 mr-1" />Locked</Badge>}
                      {employee.loginStatus === 'Temporary' && <Badge variant="purple"><Clock className="w-3 h-3 mr-1" />Temporary</Badge>}
                      {employee.loginStatus === 'No Login' && <Badge variant="secondary">No Login</Badge>}
                      {employee.twoFAEnabled && <Badge variant="info" size="xs"><Shield className="w-3 h-3 mr-1" />2FA</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-600">{employee.lastLogin || 'Never'}</div>
                    {employee.loginCount > 0 && <p className="text-xs text-slate-400">{employee.loginCount} logins</p>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      {!employee.hasLogin ?
                    <Button variant="outline" size="sm" onClick={() => {setSelectedEmployee(employee);setShowCreateModal(true);}}>
                          <UserPlus className="w-4 h-4 mr-1" /> Create
                        </Button> :

                    <>
                          <button onClick={() => {setSelectedEmployee(employee);setShowViewModal(true);}} className="p-2 hover:bg-slate-200 rounded-lg" title="View Credentials">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => {setSelectedEmployee(employee);setShowResetModal(true);}} className="p-2 hover:bg-slate-200 rounded-lg" title="Reset Password">
                            <Key className="w-4 h-4 text-amber-600" />
                          </button>
                          <button onClick={() => toggleStatus(employee.id)} className="p-2 hover:bg-slate-200 rounded-lg"
                      title={employee.loginStatus === 'Enabled' ? 'Disable' : 'Enable'}>
                            {employee.loginStatus === 'Enabled' ? <UserX className="w-4 h-4 text-red-600" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg" title="Send Credentials">
                            <Send className="w-4 h-4 text-purple-600" />
                          </button>
                        </>
                    }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 &&
        <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No employees found</p>
          </div>
        }
      </Card>

      {/* Special Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Auto Disable Settings" icon={<UserX className="w-5 h-5 text-red-500" />}>
          <div className="space-y-4">
            <Checkbox label="Auto disable on termination" />
            <div className="flex items-center gap-2">
              <Checkbox label="Auto disable after" />
              <input type="number" defaultValue="90" className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center" />
              <span className="text-sm text-slate-600">days of inactivity</span>
            </div>
            <Checkbox label="Disable on extended leave (>30 days)" />
          </div>
        </Card>

        <Card title="Temporary Access" icon={<Clock className="w-5 h-5 text-amber-500" />}>
          <div className="space-y-4">
            <Checkbox label="Enable for visiting faculty" />
            <div>
              <label className="block text-sm text-slate-600 mb-1">Default Expiry (Days)</label>
              <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <Checkbox label="Send expiry reminder (7 days before)" />
          </div>
        </Card>

        <Card title="Access Restrictions" icon={<Shield className="w-5 h-5 text-blue-500" />}>
          <div className="space-y-4">
            <Checkbox label="Restrict to working hours" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Start</label>
                <input type="time" defaultValue="08:00" className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">End</label>
                <input type="time" defaultValue="18:00" className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
              </div>
            </div>
            <Checkbox label="Restrict by IP address" />
            <Checkbox label="Require 2FA for admin roles" />
          </div>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Employee Login Management</h4>
          <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
            <li>All passwords shown are mock values (Employee@123) for demonstration</li>
            <li>Admin password to view credentials: admin123</li>
            <li>Terminated employees are automatically disabled</li>
            <li>Temporary access expires automatically on the set date</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <ViewCredentialsModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} employee={selectedEmployee} />
      <ResetPasswordModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} employee={selectedEmployee} onReset={(data) => console.log('Reset:', data)} />
      <CreateLoginModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} employee={selectedEmployee} onCreate={(data) => console.log('Create:', data)} />
      <SendCredentialsModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} employees={selectedEmployees.length > 0 ? selectedEmployees : selectedEmployee ? [selectedEmployee] : []} onSend={(data) => console.log('Send:', data)} />
      <BulkActionsModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} employees={selectedEmployees} action={bulkAction} onConfirm={(data: any) => console.log('Bulk:', bulkAction, data)} />
    </div>);

}

export default ManageEmployeeLogin;