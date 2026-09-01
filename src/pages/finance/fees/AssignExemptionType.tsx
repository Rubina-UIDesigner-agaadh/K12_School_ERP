import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Save,
  Filter,
  Search,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Users,
  UserCheck,
  FileText,
  Calendar,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  History,
  FilterX,
  UserPlus,
  Percent,
  DollarSign,
  Info,
  ClipboardList,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  User,
  Building } from
'lucide-react';

// Types
interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  category: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  currentExemption: string | null;
  exemptionType: string | null;
  exemptionPercentage: number;
  exemptionAmount: number;
  exemptionValidFrom: string | null;
  exemptionValidTo: string | null;
  feeStructure: string;
  totalFee: number;
  status: 'Active' | 'Inactive' | 'TC Issued';
  photo: string;
}

interface ExemptionType {
  id: string;
  name: string;
  code: string;
  description: string;
  defaultPercentage: number;
  applicableFeeHeads: string[];
  requiresDocument: boolean;
  maxStudents: number | null;
  currentCount: number;
}

interface ExemptionHistory {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  exemptionType: string;
  percentage: number;
  amount: number;
  validFrom: string;
  validTo: string;
  assignedBy: string;
  assignedOn: string;
  status: 'Active' | 'Expired' | 'Revoked';
  remarks: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// Academic Years
const academicYears = [
{ value: '2024-25', label: '2024-2025' },
{ value: '2023-24', label: '2023-2024' },
{ value: '2022-23', label: '2022-2023' }];


// Classes
const classes = [
'Nursery', 'LKG', 'UKG',
'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
'Class 11', 'Class 12'];


// Sections
const sections = ['A', 'B', 'C', 'D', 'E'];

// Categories
const categories = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'];

// Fee Heads
const feeHeads = [
'Tuition Fee',
'Transport Fee',
'Exam Fee',
'Library Fee',
'Lab Fee',
'Sports Fee',
'Development Fee',
'Annual Charges',
'Admission Fee',
'Computer Fee'];


// Exemption Types
const exemptionTypes: ExemptionType[] = [
{
  id: '1',
  name: 'RTE (Right to Education)',
  code: 'RTE',
  description: '100% fee exemption under RTE Act for economically weaker sections',
  defaultPercentage: 100,
  applicableFeeHeads: ['Tuition Fee', 'Exam Fee', 'Library Fee', 'Lab Fee'],
  requiresDocument: true,
  maxStudents: 50,
  currentCount: 32
},
{
  id: '2',
  name: 'Staff Ward',
  code: 'STAFF',
  description: 'Fee concession for children of school staff members',
  defaultPercentage: 50,
  applicableFeeHeads: ['Tuition Fee'],
  requiresDocument: false,
  maxStudents: null,
  currentCount: 15
},
{
  id: '3',
  name: 'Merit Scholarship',
  code: 'MERIT',
  description: 'Scholarship based on academic performance',
  defaultPercentage: 25,
  applicableFeeHeads: ['Tuition Fee', 'Exam Fee'],
  requiresDocument: true,
  maxStudents: 100,
  currentCount: 45
},
{
  id: '4',
  name: 'Sibling Discount',
  code: 'SIBLING',
  description: 'Discount for second/third child studying in same school',
  defaultPercentage: 10,
  applicableFeeHeads: ['Tuition Fee'],
  requiresDocument: false,
  maxStudents: null,
  currentCount: 78
},
{
  id: '5',
  name: 'Sports Quota',
  code: 'SPORTS',
  description: 'Concession for students with sports achievements',
  defaultPercentage: 30,
  applicableFeeHeads: ['Tuition Fee', 'Sports Fee'],
  requiresDocument: true,
  maxStudents: 30,
  currentCount: 12
},
{
  id: '6',
  name: 'Single Parent',
  code: 'SINGLE',
  description: 'Concession for students from single parent families',
  defaultPercentage: 20,
  applicableFeeHeads: ['Tuition Fee'],
  requiresDocument: true,
  maxStudents: null,
  currentCount: 23
},
{
  id: '7',
  name: 'Economically Weaker Section',
  code: 'EWS',
  description: 'Concession for students from EWS category',
  defaultPercentage: 50,
  applicableFeeHeads: ['Tuition Fee', 'Exam Fee', 'Development Fee'],
  requiresDocument: true,
  maxStudents: 75,
  currentCount: 41
},
{
  id: '8',
  name: 'Management Quota',
  code: 'MGMT',
  description: 'Special concession approved by management',
  defaultPercentage: 0,
  applicableFeeHeads: ['Tuition Fee'],
  requiresDocument: false,
  maxStudents: null,
  currentCount: 8
}];


// Generate mock student data
const generateStudents = (): Student[] => {
  const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai',
  'Priya', 'Ananya', 'Kavya', 'Isha', 'Riya', 'Sneha', 'Pooja', 'Divya',
  'Rahul', 'Amit', 'Rohit', 'Vikram', 'Neha', 'Shruti', 'Meera', 'Anjali'];

  const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Reddy', 'Joshi',
  'Khan', 'Ali', 'Rao', 'Nair', 'Menon', 'Pillai', 'Das', 'Bose'];


  const students: Student[] = [];
  let id = 1;

  classes.forEach((cls) => {
    sections.slice(0, Math.floor(Math.random() * 3) + 2).forEach((sec) => {
      const numStudents = Math.floor(Math.random() * 15) + 10;
      for (let i = 0; i < numStudents; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        const category = categories[Math.floor(Math.random() * categories.length)];
        const hasExemption = Math.random() > 0.7;
        const exemption = hasExemption ?
        exemptionTypes[Math.floor(Math.random() * exemptionTypes.length)] :
        null;

        students.push({
          id: String(id),
          admissionNo: `ADM${2024}${String(id).padStart(4, '0')}`,
          rollNo: String(i + 1),
          studentName: `${firstName} ${lastName}`,
          fatherName: `Mr. ${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastName}`,
          motherName: `Mrs. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
          className: cls,
          section: sec,
          category,
          gender: gender as 'Male' | 'Female',
          dateOfBirth: `${2010 + Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          phone: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          address: `${Math.floor(Math.random() * 500) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, City`,
          currentExemption: exemption?.name || null,
          exemptionType: exemption?.code || null,
          exemptionPercentage: exemption?.defaultPercentage || 0,
          exemptionAmount: exemption ? Math.floor(Math.random() * 10000) + 5000 : 0,
          exemptionValidFrom: exemption ? '2024-04-01' : null,
          exemptionValidTo: exemption ? '2025-03-31' : null,
          feeStructure: ['Regular', 'Management', 'NRI'][Math.floor(Math.random() * 3)],
          totalFee: Math.floor(Math.random() * 50000) + 30000,
          status: 'Active',
          photo: ''
        });
        id++;
      }
    });
  });

  return students;
};

// Generate exemption history
const generateExemptionHistory = (students: Student[]): ExemptionHistory[] => {
  const history: ExemptionHistory[] = [];
  const assignedByUsers = ['Admin', 'Ramesh Kumar', 'Sita Sharma', 'John Doe'];
  const statuses: ('Active' | 'Expired' | 'Revoked')[] = ['Active', 'Expired', 'Revoked'];

  students.
  filter((s) => s.currentExemption).
  slice(0, 20).
  forEach((student, idx) => {
    history.push({
      id: String(idx + 1),
      studentId: student.id,
      studentName: student.studentName,
      admissionNo: student.admissionNo,
      className: `${student.className}-${student.section}`,
      exemptionType: student.currentExemption!,
      percentage: student.exemptionPercentage,
      amount: student.exemptionAmount,
      validFrom: student.exemptionValidFrom!,
      validTo: student.exemptionValidTo!,
      assignedBy: assignedByUsers[Math.floor(Math.random() * assignedByUsers.length)],
      assignedOn: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      status: idx < 15 ? 'Active' : statuses[Math.floor(Math.random() * statuses.length)],
      remarks: ['Verified documents', 'Approved by principal', 'Auto-renewal', ''][Math.floor(Math.random() * 4)]
    });
  });

  return history;
};

export function AssignExemptionType() {
  // State
  const [allStudents] = useState<Student[]>(generateStudents());
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter states
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAdmNo, setSearchAdmNo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [exemptionFilter, setExemptionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [showFilters, setShowFilters] = useState(true);

  // Assignment states
  const [selectedExemptionType, setSelectedExemptionType] = useState('');
  const [exemptionMode, setExemptionMode] = useState<'percentage' | 'amount'>('percentage');
  const [exemptionPercentage, setExemptionPercentage] = useState('');
  const [exemptionAmount, setExemptionAmount] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [selectedFeeHeads, setSelectedFeeHeads] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [documentReference, setDocumentReference] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'assign' | 'history'>('assign');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [exemptionHistory] = useState<ExemptionHistory[]>(generateExemptionHistory(allStudents));

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 3, 1); // April 1st
    const endOfYear = new Date(today.getFullYear() + 1, 2, 31); // March 31st
    setValidFrom(startOfYear.toISOString().split('T')[0]);
    setValidTo(endOfYear.toISOString().split('T')[0]);
  }, []);

  // Update fee heads when exemption type changes
  useEffect(() => {
    if (selectedExemptionType) {
      const exemption = exemptionTypes.find((e) => e.id === selectedExemptionType);
      if (exemption) {
        setSelectedFeeHeads(exemption.applicableFeeHeads);
        setExemptionPercentage(String(exemption.defaultPercentage));
      }
    }
  }, [selectedExemptionType]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      if (selectedClass && student.className !== selectedClass) return false;
      if (selectedSection && student.section !== selectedSection) return false;
      if (searchName && !student.studentName.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchAdmNo && !student.admissionNo.toLowerCase().includes(searchAdmNo.toLowerCase())) return false;
      if (selectedCategory && student.category !== selectedCategory) return false;
      if (selectedGender && student.gender !== selectedGender) return false;
      if (statusFilter && student.status !== statusFilter) return false;

      if (exemptionFilter === 'with' && !student.currentExemption) return false;
      if (exemptionFilter === 'without' && student.currentExemption) return false;

      return true;
    });
  }, [allStudents, selectedClass, selectedSection, searchName, searchAdmNo, selectedCategory, selectedGender, exemptionFilter, statusFilter]);

  // Notification handler
  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual selection
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  // Handle fee head toggle
  const handleFeeHeadToggle = (feeHead: string) => {
    setSelectedFeeHeads((prev) => {
      if (prev.includes(feeHead)) {
        return prev.filter((f) => f !== feeHead);
      }
      return [...prev, feeHead];
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSearchName('');
    setSearchAdmNo('');
    setSelectedCategory('');
    setSelectedGender('');
    setExemptionFilter('');
    setStatusFilter('Active');
    setSelectedStudents([]);
    setSelectAll(false);
    addNotification('Filters reset successfully!', 'info');
  };

  // Reset assignment form
  const resetAssignmentForm = () => {
    setSelectedExemptionType('');
    setExemptionMode('percentage');
    setExemptionPercentage('');
    setExemptionAmount('');
    setSelectedFeeHeads([]);
    setRemarks('');
    setDocumentReference('');
  };

  // Handle assignment
  const handleAssignExemption = () => {
    if (selectedStudents.length === 0) {
      addNotification('Please select at least one student!', 'error');
      return;
    }
    if (!selectedExemptionType) {
      addNotification('Please select an exemption type!', 'error');
      return;
    }
    if (!validFrom || !validTo) {
      addNotification('Please select valid dates!', 'error');
      return;
    }
    if (selectedFeeHeads.length === 0) {
      addNotification('Please select at least one fee head!', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const exemption = exemptionTypes.find((e) => e.id === selectedExemptionType);
      addNotification(
        `Successfully assigned "${exemption?.name}" exemption to ${selectedStudents.length} student(s)!`,
        'success'
      );
      setSelectedStudents([]);
      setSelectAll(false);
      resetAssignmentForm();
      setLoading(false);
    }, 1500);
  };

  // Handle remove exemption
  const handleRemoveExemption = (studentId: string) => {
    addNotification('Exemption removed successfully!', 'success');
  };

  // View student details
  const viewStudentDetails = (student: Student) => {
    setSelectedStudentDetail(student);
    setIsDetailModalOpen(true);
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5" />;
      case 'error':return <XCircle className="w-5 h-5" />;
      case 'warning':return <AlertCircle className="w-5 h-5" />;
      default:return <Info className="w-5 h-5" />;
    }
  };

  // Get sections for selected class
  const availableSections = useMemo(() => {
    if (!selectedClass) return sections;
    const sectionsInClass = [...new Set(allStudents.filter((s) => s.className === selectedClass).map((s) => s.section))];
    return sectionsInClass.sort();
  }, [selectedClass, allStudents]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) =>
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-lg text-white min-w-[320px] animate-slide-in ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' :
          notification.type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`
          }>

            {getNotificationIcon(notification.type)}
            <span className="font-medium flex-1">{notification.message}</span>
            <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
            className="text-white/80 hover:text-white">

              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              Assign Fee Exemption
            </h1>
            <p className="text-gray-500 mt-1">
              Map students to fee exemption categories (RTE, Staff Ward, Merit Scholarship, etc.)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'assign' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('assign')}>

              <UserCheck className="w-4 h-4 mr-2" />
              Assign Exemption
            </Button>
            <Button
              variant={activeTab === 'history' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('history')}>

              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'assign' ?
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Student Selection */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search Filters */}
            <Card className="overflow-hidden">
              <div
              className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}>

                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Search & Filter Students</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {filteredStudents.length} students found
                  </span>
                  {showFilters ?
                <ChevronUp className="w-5 h-5 text-gray-400" /> :

                <ChevronDown className="w-5 h-5 text-gray-400" />
                }
                </div>
              </div>

              {showFilters &&
            <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Academic Year */}
                    <Select
                  label="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  options={academicYears} />


                    {/* Class */}
                    <Select
                  label="Class"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedSection('');
                  }}
                  options={[
                  { value: '', label: 'All Classes' },
                  ...classes.map((c) => ({ value: c, label: c }))]
                  } />


                    {/* Section */}
                    <Select
                  label="Section"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  options={[
                  { value: '', label: 'All Sections' },
                  ...availableSections.map((s) => ({ value: s, label: `Section ${s}` }))]
                  } />


                    {/* Category */}
                    <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map((c) => ({ value: c, label: c }))]
                  } />


                    {/* Student Name Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student Name
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                      type="text"
                      placeholder="Search by name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)} />

                      </div>
                    </div>

                    {/* Admission Number Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission No.
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                      type="text"
                      placeholder="Search by adm. no..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchAdmNo}
                      onChange={(e) => setSearchAdmNo(e.target.value)} />

                      </div>
                    </div>

                    {/* Gender */}
                    <Select
                  label="Gender"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  options={[
                  { value: '', label: 'All Genders' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }]
                  } />


                    {/* Exemption Filter */}
                    <Select
                  label="Exemption Status"
                  value={exemptionFilter}
                  onChange={(e) => setExemptionFilter(e.target.value)}
                  options={[
                  { value: '', label: 'All Students' },
                  { value: 'with', label: 'With Exemption' },
                  { value: 'without', label: 'Without Exemption' }]
                  } />

                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button
                  variant="outline"
                  onClick={resetFilters}>

                      <FilterX className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export List
                    </Button>
                  </div>
                </div>
            }
            </Card>

            {/* Students Table */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Select Students</h2>
                      <p className="text-sm text-gray-500">
                        {selectedStudents.length} of {filteredStudents.length} selected
                      </p>
                    </div>
                  </div>
                  {selectedStudents.length > 0 &&
                <Badge variant="info" className="text-sm px-3 py-1">
                      {selectedStudents.length} student(s) selected for exemption
                    </Badge>
                }
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                        type="checkbox"
                        checked={selectAll && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />

                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Adm. No.</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Current Exemption</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Fee</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.slice(0, 50).map((student) =>
                  <tr
                    key={student.id}
                    className={`hover:bg-purple-50 transition-colors ${
                    selectedStudents.includes(student.id) ? 'bg-purple-50' : ''}`
                    }>

                        <td className="px-4 py-3">
                          <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />

                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-gray-600">{student.admissionNo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{student.studentName}</p>
                            <p className="text-xs text-gray-500">F/o {student.fatherName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="info">{student.className}-{student.section}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{student.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{student.gender}</span>
                        </td>
                        <td className="px-4 py-3">
                          {student.currentExemption ?
                      <div>
                              <Badge variant="success">{student.exemptionType}</Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {student.exemptionPercentage}% off
                              </p>
                            </div> :

                      <Badge variant="warning">None</Badge>
                      }
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700">₹{student.totalFee.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewStudentDetails(student)}>

                              <Eye className="w-4 h-4" />
                            </Button>
                            {student.currentExemption &&
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExemption(student.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50">

                                <Trash2 className="w-4 h-4" />
                              </Button>
                        }
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 &&
            <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-500">Try adjusting your search filters</p>
                </div>
            }

              {filteredStudents.length > 50 &&
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Showing 50 of {filteredStudents.length} students. Use filters to narrow down results.
                  </p>
                </div>
            }
            </Card>
          </div>

          {/* Right Panel - Assignment Form */}
          <div className="space-y-6">
            {/* Exemption Assignment */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Exemption Assignment</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Selected Students Count */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700">Selected Students</span>
                    <span className="text-2xl font-bold text-purple-600">{selectedStudents.length}</span>
                  </div>
                </div>

                {/* Exemption Type */}
                <Select
                label="Exemption Type *"
                value={selectedExemptionType}
                onChange={(e) => setSelectedExemptionType(e.target.value)}
                options={[
                { value: '', label: 'Select Exemption Type' },
                ...exemptionTypes.map((e) => ({
                  value: e.id,
                  label: `${e.name} (${e.code})`
                }))]
                } />


                {/* Exemption Type Details */}
                {selectedExemptionType &&
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="text-gray-600">
                      {exemptionTypes.find((e) => e.id === selectedExemptionType)?.description}
                    </p>
                    {exemptionTypes.find((e) => e.id === selectedExemptionType)?.requiresDocument &&
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Document verification required</span>
                      </div>
                }
                  </div>
              }

                {/* Exemption Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exemption Mode
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                      type="radio"
                      name="exemptionMode"
                      checked={exemptionMode === 'percentage'}
                      onChange={() => setExemptionMode('percentage')}
                      className="text-purple-600 focus:ring-purple-500" />

                      <Percent className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Percentage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                      type="radio"
                      name="exemptionMode"
                      checked={exemptionMode === 'amount'}
                      onChange={() => setExemptionMode('amount')}
                      className="text-purple-600 focus:ring-purple-500" />

                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Fixed Amount</span>
                    </label>
                  </div>
                </div>

                {/* Percentage or Amount */}
                {exemptionMode === 'percentage' ?
              <Input
                label="Exemption Percentage *"
                type="number"
                min="0"
                max="100"
                value={exemptionPercentage}
                onChange={(e) => setExemptionPercentage(e.target.value)}
                placeholder="e.g., 50" /> :


              <Input
                label="Exemption Amount (₹) *"
                type="number"
                min="0"
                value={exemptionAmount}
                onChange={(e) => setExemptionAmount(e.target.value)}
                placeholder="e.g., 5000" />

              }

                {/* Valid From */}
                <Input
                label="Valid From *"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)} />


                {/* Valid To */}
                <Input
                label="Valid To *"
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)} />


                {/* Applicable Fee Heads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Fee Heads *
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                    {feeHeads.map((head) =>
                  <label key={head} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                      type="checkbox"
                      checked={selectedFeeHeads.includes(head)}
                      onChange={() => handleFeeHeadToggle(head)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />

                        <span className="text-sm text-gray-700">{head}</span>
                      </label>
                  )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedFeeHeads.length} fee head(s) selected
                  </p>
                </div>

                {/* Document Reference */}
                <Input
                label="Document Reference"
                value={documentReference}
                onChange={(e) => setDocumentReference(e.target.value)}
                placeholder="e.g., RTE Certificate No." />


                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any additional notes..." />

                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleAssignExemption}
                  disabled={loading || selectedStudents.length === 0}>

                    {loading ?
                  <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Assigning...
                      </> :

                  <>
                        <Save className="w-4 h-4 mr-2" />
                        Assign Exemption ({selectedStudents.length})
                      </>
                  }
                  </Button>
                  <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetAssignmentForm}>

                    <X className="w-4 h-4 mr-2" />
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>

            {/* Exemption Types Quick Reference */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  Exemption Types Reference
                </h3>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {exemptionTypes.map((type) =>
                <div
                  key={type.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">

                      <div>
                        <p className="text-sm font-medium text-gray-900">{type.code}</p>
                        <p className="text-xs text-gray-500">{type.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="info">{type.defaultPercentage}%</Badge>
                        {type.maxStudents &&
                    <p className="text-xs text-gray-500 mt-1">
                            {type.currentCount}/{type.maxStudents} slots
                          </p>
                    }
                      </div>
                    </div>
                )}
                </div>
              </div>
            </Card>
          </div>
        </div> : (

      /* History Tab */
      <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Exemption History</h2>
                <p className="text-sm text-gray-500">View all assigned exemptions and their status</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
            columns={[
            {
              key: 'admissionNo',
              header: 'Adm. No.',
              render: (row: ExemptionHistory) =>
              <span className="font-mono text-sm text-gray-600">{row.admissionNo}</span>

            },
            {
              key: 'studentName',
              header: 'Student Name',
              render: (row: ExemptionHistory) =>
              <div>
                      <p className="font-medium text-gray-900">{row.studentName}</p>
                      <p className="text-xs text-gray-500">{row.className}</p>
                    </div>

            },
            {
              key: 'exemptionType',
              header: 'Exemption Type',
              render: (row: ExemptionHistory) =>
              <Badge variant="info">{row.exemptionType}</Badge>

            },
            {
              key: 'percentage',
              header: 'Percentage',
              render: (row: ExemptionHistory) =>
              <span className="font-medium text-gray-700">{row.percentage}%</span>

            },
            {
              key: 'amount',
              header: 'Amount',
              render: (row: ExemptionHistory) =>
              <span className="text-green-600">₹{row.amount.toLocaleString()}</span>

            },
            {
              key: 'validFrom',
              header: 'Valid Period',
              render: (row: ExemptionHistory) =>
              <div className="text-sm">
                      <p className="text-gray-700">{row.validFrom}</p>
                      <p className="text-gray-500">to {row.validTo}</p>
                    </div>

            },
            {
              key: 'assignedBy',
              header: 'Assigned By',
              render: (row: ExemptionHistory) =>
              <div className="text-sm">
                      <p className="text-gray-700">{row.assignedBy}</p>
                      <p className="text-xs text-gray-500">{row.assignedOn}</p>
                    </div>

            },
            {
              key: 'status',
              header: 'Status',
              render: (row: ExemptionHistory) =>
              <Badge
                variant={
                row.status === 'Active' ? 'success' :
                row.status === 'Expired' ? 'warning' : 'error'
                }>

                      {row.status}
                    </Badge>

            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row: ExemptionHistory) =>
              <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

            }]
            }
            data={exemptionHistory} />

          </div>
        </Card>)
      }

      {/* Student Detail Modal */}
      {isDetailModalOpen && selectedStudentDetail &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
              <button
              onClick={() => setIsDetailModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStudentDetail.studentName}</h3>
                  <p className="text-gray-500">Admission No: {selectedStudentDetail.admissionNo}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{selectedStudentDetail.className}-{selectedStudentDetail.section}</Badge>
                    <Badge variant="warning">{selectedStudentDetail.category}</Badge>
                    <Badge variant="success">{selectedStudentDetail.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Father's Name</p>
                  <p className="font-medium text-gray-900">{selectedStudentDetail.fatherName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Mother's Name</p>
                  <p className="font-medium text-gray-900">{selectedStudentDetail.motherName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Date of Birth</p>
                  <p className="font-medium text-gray-900">{selectedStudentDetail.dateOfBirth}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Gender</p>
                  <p className="font-medium text-gray-900">{selectedStudentDetail.gender}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedStudentDetail.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <p className="font-medium text-gray-900 text-sm">{selectedStudentDetail.email}</p>
                </div>
              </div>

              {/* Fee & Exemption Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase mb-1">Total Annual Fee</p>
                  <p className="text-2xl font-bold text-blue-700">₹{selectedStudentDetail.totalFee.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1">Fee Structure: {selectedStudentDetail.feeStructure}</p>
                </div>
                <div className={`p-4 rounded-lg border ${selectedStudentDetail.currentExemption ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs uppercase mb-1 ${selectedStudentDetail.currentExemption ? 'text-green-600' : 'text-gray-500'}`}>
                    Current Exemption
                  </p>
                  {selectedStudentDetail.currentExemption ?
                <>
                      <p className="text-xl font-bold text-green-700">{selectedStudentDetail.currentExemption}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {selectedStudentDetail.exemptionPercentage}% | ₹{selectedStudentDetail.exemptionAmount.toLocaleString()}
                      </p>
                    </> :

                <p className="text-xl font-bold text-gray-400">No Exemption</p>
                }
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase mb-1">Address</p>
                <p className="font-medium text-gray-900">{selectedStudentDetail.address}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
              {!selectedStudentDetail.currentExemption &&
            <Button
              variant="primary"
              onClick={() => {
                setSelectedStudents([selectedStudentDetail.id]);
                setIsDetailModalOpen(false);
              }}>

                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Exemption
                </Button>
            }
            </div>
          </div>
        </div>
      }
    </div>);

}