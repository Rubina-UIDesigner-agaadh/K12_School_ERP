// UserMaster.tsx - Core User Identity Registry & Management
import React, { useState } from 'react';
import {
  UserPlus, Edit, Trash2, Mail, Phone, User, Calendar,
  Shield, Send, MessageSquare, AlertTriangle, Search, RefreshCw,
  CheckCircle, XCircle, Eye, Download, Upload, Users, IdCard,
  Lock, Unlock, Key, Copy, EyeOff, Building, Briefcase, X, Save,
  Settings, Link } from
'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// TYPES
// ============================================================================
interface User {
  id: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  photo?: string;
  designation: string;
  department: string;
  linkedEntityId?: string;
  linkedEntityName?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  hasLogin: boolean;
  username?: string;
  assignedRole?: string;
  createdOn: string;
  lastModified: string;
  lastLogin?: string;
  canDelete: boolean;
  deleteReason?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const USERS: User[] = [
{ id: 'USR001', fullName: 'Aarav Patel', firstName: 'Aarav', middleName: '', lastName: 'Patel', email: 'aarav@student.edu', mobile: '+91 98765 43210', gender: 'Male', dob: '2008-05-15', designation: 'Student', department: 'Class 10-A', linkedEntityId: 'STU2024001', linkedEntityName: 'Class 10-A', status: 'Active', hasLogin: true, username: 'aarav.patel', assignedRole: 'Student', createdOn: '2024-04-01', lastModified: '2024-04-01', lastLogin: 'Today, 08:45 AM', canDelete: false, deleteReason: 'Linked to active admission' },
{ id: 'USR002', fullName: 'Michael Wilson', firstName: 'Michael', middleName: '', lastName: 'Wilson', email: 'michael@email.com', mobile: '+91 98765 43214', gender: 'Male', dob: '1980-03-20', designation: 'Parent', department: 'Guardian', linkedEntityId: 'PAR001', linkedEntityName: '2 Students', status: 'Active', hasLogin: true, username: 'michael.wilson', assignedRole: 'Parent', createdOn: '2024-04-01', lastModified: '2024-04-10', lastLogin: 'Yesterday, 05:30 PM', canDelete: false, deleteReason: 'Active parent account' },
{ id: 'USR003', fullName: 'Sarah Smith', firstName: 'Sarah', middleName: 'Ann', lastName: 'Smith', email: 'sarah@school.edu', mobile: '+91 98765 43211', gender: 'Female', dob: '1985-08-12', designation: 'Teacher', department: 'Mathematics', linkedEntityId: 'EMP015', linkedEntityName: 'Teacher - Mathematics', status: 'Active', hasLogin: true, username: 'sarah.smith', assignedRole: 'Class Teacher', createdOn: '2023-02-15', lastModified: '2024-03-10', lastLogin: 'Today, 09:00 AM', canDelete: false, deleteReason: 'Active employee' },
{ id: 'USR004', fullName: 'James Wilson', firstName: 'James', middleName: '', lastName: 'Wilson', email: 'james.w@example.com', mobile: '+91 98765 00001', gender: 'Male', dob: '1990-11-05', designation: 'Guest Lecturer', department: 'Physics', status: 'Active', hasLogin: true, username: 'james.wilson', assignedRole: 'Guest Lecturer', createdOn: '2024-01-15', lastModified: '2024-01-15', lastLogin: '3 days ago', canDelete: true },
{ id: 'USR005', fullName: 'Emily Brown', firstName: 'Emily', middleName: 'Rose', lastName: 'Brown', email: 'emily@school.edu', mobile: '+91 98765 43215', gender: 'Female', dob: '1988-06-22', designation: 'Accountant', department: 'Finance', linkedEntityId: 'EMP020', linkedEntityName: 'Finance Team', status: 'Active', hasLogin: true, username: 'emily.brown', assignedRole: 'Accountant', createdOn: '2023-06-01', lastModified: '2024-02-15', lastLogin: 'Today, 10:30 AM', canDelete: false, deleteReason: 'Active employee' },
{ id: 'USR006', fullName: 'Robert Johnson', firstName: 'Robert', middleName: '', lastName: 'Johnson', email: 'robert@school.edu', mobile: '+91 98765 43216', gender: 'Male', dob: '1975-03-10', designation: 'Principal', department: 'Administration', linkedEntityId: 'EMP001', linkedEntityName: 'School Head', status: 'Active', hasLogin: true, username: 'robert.johnson', assignedRole: 'Principal', createdOn: '2020-01-01', lastModified: '2024-03-01', lastLogin: 'Today, 07:30 AM', canDelete: false, deleteReason: 'System administrator account' },
{ id: 'USR007', fullName: 'External Auditor', firstName: 'External', middleName: '', lastName: 'Auditor', email: 'audit@firm.com', mobile: '+91 99999 88888', gender: 'Male', dob: '1975-06-30', designation: 'Auditor', department: 'External', status: 'Inactive', hasLogin: false, assignedRole: 'Auditor', createdOn: '2023-12-01', lastModified: '2024-02-28', canDelete: true },
{ id: 'USR008', fullName: 'John Doe', firstName: 'John', middleName: '', lastName: 'Doe', email: 'john@school.edu', mobile: '+91 98765 99999', gender: 'Male', dob: '1982-04-15', designation: 'System Admin', department: 'IT', linkedEntityId: 'EMP002', linkedEntityName: 'System Administrator', status: 'Active', hasLogin: true, username: 'john.doe', assignedRole: 'System Admin', createdOn: '2022-01-10', lastModified: '2024-03-15', lastLogin: 'Today, 06:00 AM', canDelete: false, deleteReason: 'System administrator account' }];


const DESIGNATIONS = ['Student', 'Parent', 'Teacher', 'Principal', 'Accountant', 'HR Manager', 'System Admin', 'Guest Lecturer', 'Auditor', 'Librarian', 'Lab Assistant', 'Clerk', 'Peon', 'Driver', 'Security'];
const DEPARTMENTS = ['Administration', 'Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Finance', 'HR', 'IT', 'Library', 'Sports', 'Arts', 'Music', 'External', 'Guardian'];
const ROLES = ['Student', 'Parent', 'Teacher', 'Class Teacher', 'HOD', 'Principal', 'Vice Principal', 'Accountant', 'HR Manager', 'System Admin', 'Data Entry', 'Guest Lecturer', 'Auditor', 'Librarian', 'Staff'];
const GENDERS = ['Male', 'Female', 'Other'];
const STATUSES = ['All', 'Active', 'Inactive', 'Suspended'];

// Mock password generator - returns same mock password for demo
const getMockPassword = (userId: string): string => {
  const mockPasswords: Record<string, string> = {
    'USR001': 'Welcome@123',
    'USR002': 'Welcome@123',
    'USR003': 'Welcome@123',
    'USR004': 'Welcome@123',
    'USR005': 'Welcome@123',
    'USR006': 'Welcome@123',
    'USR007': 'Welcome@123',
    'USR008': 'Welcome@123'
  };
  return mockPasswords[userId] || 'Welcome@123';
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
const Card = ({ children, className = '', noPadding = false }: {children: React.ReactNode;className?: string;noPadding?: boolean;}) =>
<div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${noPadding ? '' : 'p-5'} ${className}`}>
    {children}
  </div>;


const Badge = ({ variant, children, size = 'sm' }: {variant: 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'outline';children: React.ReactNode;size?: 'xs' | 'sm';}) => {
  const styles: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-300'
  };
  const sizes: Record<string, string> = { xs: 'px-1.5 py-0.5 text-[10px]', sm: 'px-2 py-0.5 text-xs' };
  return <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizes[size]}`}>{children}</span>;
};

const Input = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, disabled = false, required = false, className = '' }: any) =>
<div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
    className={`w-full border border-slate-200 rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${Icon ? 'pl-10 pr-4' : 'px-4'}`} />
    </div>
  </div>;


const Select = ({ label, options, value, onChange, placeholder, disabled = false, required = false, className = '' }: any) =>
<div className={className}>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;


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

const Tabs = ({ tabs, activeTab, onChange }: {tabs: {id: string;label: string;icon?: any;}[];activeTab: string;onChange: (id: string) => void;}) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
    {tabs.map((tab) =>
  <button key={tab.id} onClick={() => onChange(tab.id)}
  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
  activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`
  }>
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
      </button>
  )}
  </div>;


// ============================================================================
// CREDENTIALS VIEWER MODAL (WITH MOCK PASSWORDS)
// ============================================================================
const CredentialsModal = ({ isOpen, onClose, users }: {isOpen: boolean;onClose: () => void;users: User[];}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchCred, setSearchCred] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'admin123';

  const handleAuthenticate = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin password. Hint: admin123');
    }
  };

  const handleClose = () => {
    setAuthenticated(false);
    setAdminPassword('');
    setShowPasswords(false);
    setSearchCred('');
    setError('');
    onClose();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const usersWithLogin = users.filter((u) => u.hasLogin && u.username);
  const filteredUsers = usersWithLogin.filter((u) =>
  u.fullName.toLowerCase().includes(searchCred.toLowerCase()) ||
  u.username?.toLowerCase().includes(searchCred.toLowerCase()) ||
  u.email.toLowerCase().includes(searchCred.toLowerCase()) ||
  u.assignedRole?.toLowerCase().includes(searchCred.toLowerCase()) ||
  u.designation.toLowerCase().includes(searchCred.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="User Credentials" subtitle={authenticated ? 'View and manage login credentials' : 'Authentication required'} size="lg">
      {!authenticated ?
      <div className="max-w-sm mx-auto py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Protected Content</h3>
            <p className="text-sm text-slate-500 mt-2">Enter admin password to view credentials</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" value={adminPassword} onChange={(e) => {setAdminPassword(e.target.value);setError('');}}
            placeholder="Enter admin password" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()} />
            </div>

            {error &&
          <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
          }

            <Button className="w-full" onClick={handleAuthenticate}>
              <Unlock className="w-4 h-4 mr-2" /> Authenticate
            </Button>

            <p className="text-xs text-center text-slate-400">This action is logged for security purposes</p>
          </div>
        </div> :

      <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchCred} onChange={(e) => setSearchCred(e.target.value)}
            placeholder="Search by name, username, email, role, designation..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
            <button onClick={() => setShowPasswords(!showPasswords)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          showPasswords ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`
          }>
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPasswords ? 'Hide' : 'Show'} Passwords
            </button>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Mock Credentials for Demo</p>
              <p className="text-xs text-blue-600 mt-1">All passwords shown are mock values (Welcome@123) for demonstration purposes only.</p>
            </div>
          </div>

          {/* Credentials Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Designation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Password</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) =>
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-800">{user.designation}</p>
                          <p className="text-xs text-slate-500">{user.assignedRole}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">{user.username}</code>
                          <button onClick={() => copyToClipboard(user.username!, `${user.id}-user`)} className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Copy">
                            {copiedId === `${user.id}-user` ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">
                            {showPasswords ? getMockPassword(user.id) : '••••••••••'}
                          </code>
                          <button onClick={() => copyToClipboard(getMockPassword(user.id), `${user.id}-pass`)} className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Copy">
                            {copiedId === `${user.id}-pass` ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>{user.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600" title="Reset Password">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600" title="Send Credentials">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Showing {filteredUsers.length} of {usersWithLogin.length} users with login</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export (Encrypted)
            </Button>
          </div>
        </div>
      }
    </Modal>);

};

// ============================================================================
// USER FORM MODAL
// ============================================================================
const UserFormModal = ({ isOpen, onClose, mode, user, onSave }: {isOpen: boolean;onClose: () => void;mode: 'add' | 'edit' | 'view';user: User | null;onSave: (data: any) => void;}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState({
    firstName: user?.firstName || '', middleName: user?.middleName || '', lastName: user?.lastName || '',
    gender: user?.gender || '', dob: user?.dob || '', email: user?.email || '', mobile: user?.mobile || '',
    designation: user?.designation || '', department: user?.department || '',
    linkedEntityId: user?.linkedEntityId || '', linkedEntityName: user?.linkedEntityName || '',
    generateLogin: true, assignRole: user?.assignedRole || '',
    sendEmail: false, sendSMS: false, status: user?.status || 'Active'
  });

  const isViewMode = mode === 'view';
  const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'work', label: 'Work', icon: Briefcase },
  ...(isViewMode ? [] : [{ id: 'account', label: 'Account', icon: Shield }])];


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Create New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
    subtitle={mode === 'add' ? 'Add a new user to the system' : user?.fullName} size="lg"
    actions={!isViewMode &&
    <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {onSave(form);onClose();}}>
            <Save className="w-4 h-4 mr-2" />{mode === 'add' ? 'Create' : 'Update'} User
          </Button>
        </>
    }>
      <div className="space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'personal' &&
        <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={(e: any) => setForm({ ...form, firstName: e.target.value })} disabled={isViewMode} placeholder="Enter first name" />
            <Input label="Middle Name" value={form.middleName} onChange={(e: any) => setForm({ ...form, middleName: e.target.value })} disabled={isViewMode} placeholder="Enter middle name" />
            <Input label="Last Name" required value={form.lastName} onChange={(e: any) => setForm({ ...form, lastName: e.target.value })} disabled={isViewMode} placeholder="Enter last name" />
            <Select label="Gender" required options={GENDERS.map((g) => ({ value: g, label: g }))} value={form.gender} onChange={(v: string) => setForm({ ...form, gender: v })} disabled={isViewMode} placeholder="Select" />
            <Input label="Date of Birth" required type="date" value={form.dob} onChange={(e: any) => setForm({ ...form, dob: e.target.value })} disabled={isViewMode} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                {!isViewMode && <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" /> Upload</Button>}
              </div>
            </div>
          </div>
        }

        {activeTab === 'contact' &&
        <div className="space-y-4">
            <Input label="Email Address" required type="email" icon={Mail} value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} disabled={isViewMode} placeholder="Enter email" />
            <Input label="Mobile Number" required icon={Phone} value={form.mobile} onChange={(e: any) => setForm({ ...form, mobile: e.target.value })} disabled={isViewMode} placeholder="Enter mobile" />
            {isViewMode && user &&
          <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Created:</span> <span className="font-medium ml-2">{user.createdOn}</span></div>
                <div><span className="text-slate-500">Modified:</span> <span className="font-medium ml-2">{user.lastModified}</span></div>
                <div><span className="text-slate-500">Last Login:</span> <span className="font-medium ml-2">{user.lastLogin || 'Never'}</span></div>
                <div><span className="text-slate-500">User ID:</span> <code className="ml-2 bg-slate-200 px-2 py-0.5 rounded text-xs">{user.id}</code></div>
              </div>
          }
          </div>
        }

        {activeTab === 'work' &&
        <div className="grid grid-cols-2 gap-4">
            <Select label="Designation" required options={DESIGNATIONS.map((d) => ({ value: d, label: d }))} value={form.designation} onChange={(v: string) => setForm({ ...form, designation: v })} disabled={isViewMode} placeholder="Select" />
            <Select label="Department" required options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} value={form.department} onChange={(v: string) => setForm({ ...form, department: v })} disabled={isViewMode} placeholder="Select" />
            <Input label="Linked Entity ID" icon={Link} value={form.linkedEntityId} onChange={(e: any) => setForm({ ...form, linkedEntityId: e.target.value })} disabled={isViewMode} placeholder="e.g., EMP001" />
            <Input label="Entity Description" value={form.linkedEntityName} onChange={(e: any) => setForm({ ...form, linkedEntityName: e.target.value })} disabled={isViewMode} placeholder="e.g., Teacher - Math" />
            {!isViewMode &&
          <Select label="Status" className="col-span-2" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Suspended', label: 'Suspended' }]} value={form.status} onChange={(v: string) => setForm({ ...form, status: v })} />
          }
            {isViewMode && user &&
          <div className="col-span-2 flex gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <span className="text-sm text-slate-500">Status:</span>
                  <div className="mt-1"><Badge variant={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'secondary'}>{user.status}</Badge></div>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-slate-500">Can Delete:</span>
                  <div className="mt-1">{user.canDelete ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No - {user.deleteReason}</Badge>}</div>
                </div>
              </div>
          }
          </div>
        }

        {activeTab === 'account' && !isViewMode &&
        <div className="space-y-6">
            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={form.generateLogin} onChange={(e) => setForm({ ...form, generateLogin: e.target.checked })} className="w-5 h-5 rounded text-blue-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-slate-700">Generate Login Credentials</span>
                <p className="text-xs text-slate-500 mt-0.5">Create username and password for this user</p>
              </div>
            </label>

            {form.generateLogin &&
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <Select label="Assign Role" required options={ROLES.map((r) => ({ value: r, label: r }))} value={form.assignRole} onChange={(v: string) => setForm({ ...form, assignRole: v })} placeholder="Select role" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Notifications</p>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={form.sendEmail} onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })} className="rounded text-blue-600" />
                    <Mail className="w-4 h-4" /> Send Welcome Email
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={form.sendSMS} onChange={(e) => setForm({ ...form, sendSMS: e.target.checked })} className="rounded text-blue-600" />
                    <MessageSquare className="w-4 h-4" /> Send Login SMS
                  </label>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-xs text-blue-800">
                  <strong>Note:</strong> Username will be firstname.lastname. Default password: Welcome@123
                </div>
              </div>
          }
          </div>
        }
      </div>
    </Modal>);

};

// ============================================================================
// DELETE MODAL
// ============================================================================
const DeleteModal = ({ isOpen, onClose, user, onDelete }: {isOpen: boolean;onClose: () => void;user: User | null;onDelete: () => void;}) => {
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="sm">
      <div className="text-center py-4">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${user.canDelete ? 'bg-red-100' : 'bg-slate-100'}`}>
          {user.canDelete ? <Trash2 className="w-8 h-8 text-red-600" /> : <XCircle className="w-8 h-8 text-slate-400" />}
        </div>
        {user.canDelete ?
        <>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete {user.fullName}?</h3>
            <p className="text-sm text-slate-600 mb-4">This will soft-delete the user. Record retained for audit.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
            </div>
          </> :

        <>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Cannot Delete</h3>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-800">{user.deleteReason}</div>
            <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
          </>
        }
      </div>
    </Modal>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function UserMaster() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [filters, setFilters] = useState({ search: '', designation: '', role: '', status: '' });
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const openUserModal = (mode: 'add' | 'edit' | 'view', user?: User) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter((u) => {
    const s = filters.search.toLowerCase();
    const matchSearch = !filters.search || u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) ||
    u.mobile.includes(filters.search) || u.designation.toLowerCase().includes(s) || (u.assignedRole?.toLowerCase() || '').includes(s);
    return matchSearch && (!filters.designation || filters.designation === 'All' || u.designation === filters.designation) && (
    !filters.role || filters.role === 'All' || u.assignedRole === filters.role) && (
    !filters.status || filters.status === 'All' || u.status === filters.status);
  });

  const stats = [
  { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
  { label: 'Active', value: users.filter((u) => u.status === 'Active').length, icon: CheckCircle, color: 'emerald' },
  { label: 'With Login', value: users.filter((u) => u.hasLogin).length, icon: Shield, color: 'purple' },
  { label: 'Inactive', value: users.filter((u) => u.status !== 'Active').length, icon: XCircle, color: 'slate' }];


  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <IdCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Master</h1>
            <p className="text-sm text-slate-500">Core identity registry</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowCredentialsModal(true)}>
            <Key className="w-4 h-4 mr-2" /> View Credentials
          </Button>
          <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button onClick={() => openUserModal('add')}><UserPlus className="w-4 h-4 mr-2" /> Create User</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search name, email, mobile, designation, role..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Select options={[{ value: 'All', label: 'All Designations' }, ...DESIGNATIONS.map((d) => ({ value: d, label: d }))]} value={filters.designation} onChange={(v: string) => setFilters({ ...filters, designation: v })} />
          <Select options={[{ value: 'All', label: 'All Roles' }, ...ROLES.map((r) => ({ value: r, label: r }))]} value={filters.role} onChange={(v: string) => setFilters({ ...filters, role: v })} />
          <Button variant="outline" onClick={() => setFilters({ search: '', designation: '', role: '', status: '' })}>
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <p className="text-sm text-slate-600">Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users</p>
          <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['User', 'Contact', 'Designation', 'Role', 'Login', 'Status', 'Actions'].map((h) =>
                <th key={h} className={`px-4 py-3 text-${h === 'Actions' ? 'center' : 'left'} text-xs font-semibold text-slate-600 uppercase`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) =>
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{user.email}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{user.mobile}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{user.designation}</p>
                    <p className="text-xs text-slate-500">{user.department}</p>
                  </td>
                  <td className="px-4 py-4">
                    {user.assignedRole ? <Badge variant="info">{user.assignedRole}</Badge> : <span className="text-xs text-slate-400">Not assigned</span>}
                  </td>
                  <td className="px-4 py-4">
                    {user.hasLogin ? <Badge variant="success"><Shield className="w-3 h-3 mr-1" />Enabled</Badge> : <Badge variant="secondary">No Login</Badge>}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'secondary'}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => openUserModal('view', user)} className="p-2 hover:bg-slate-200 rounded-lg" title="View"><Eye className="w-4 h-4 text-slate-600" /></button>
                      <button onClick={() => openUserModal('edit', user)} className="p-2 hover:bg-slate-200 rounded-lg" title="Edit"><Edit className="w-4 h-4 text-slate-600" /></button>
                      <button onClick={() => {setSelectedUser(user);setShowDeleteModal(true);}} className={`p-2 rounded-lg ${user.canDelete ? 'hover:bg-red-100' : 'opacity-50 cursor-not-allowed'}`}
                    title={user.canDelete ? 'Delete' : user.deleteReason} disabled={!user.canDelete}>
                        <Trash2 className={`w-4 h-4 ${user.canDelete ? 'text-red-600' : 'text-slate-300'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 &&
        <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No users found</p>
          </div>
        }
      </Card>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Important Notes</h4>
          <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
            <li>Users linked to active records cannot be deleted</li>
            <li>Viewing credentials requires admin authentication (password: admin123)</li>
            <li>All passwords shown are mock values for demo purposes</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} mode={modalMode} user={selectedUser} onSave={() => {}} />
      <DeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} user={selectedUser} onDelete={() => {setUsers((prev) => prev.filter((u) => u.id !== selectedUser?.id));setShowDeleteModal(false);}} />
      <CredentialsModal isOpen={showCredentialsModal} onClose={() => setShowCredentialsModal(false)} users={users} />
    </div>);

}

export default UserMaster;