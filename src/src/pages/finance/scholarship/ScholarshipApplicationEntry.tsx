import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Save,
  Award,
  Upload,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  Download,
  Printer,
  Home,
  Users,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Shield,
  GraduationCap,
  Heart,
  Building,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Star,
  Briefcase,
  BookOpen,
  Percent,
  Hash,
  Globe,
  Landmark,
  RefreshCw,
  Send,
  Copy,
  ExternalLink } from
'lucide-react';

// Types
interface Student {
  id: string;
  grNo: string;
  admissionNo: string;
  name: string;
  nameHindi: string;
  fatherName: string;
  fatherNameHindi: string;
  motherName: string;
  motherNameHindi: string;
  guardianName: string;
  guardianRelation: string;
  class: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Other';
  subCategory: string;
  religion: string;
  caste: string;
  nationality: string;
  domicileState: string;
  isMinority: boolean;
  minorityType: string | null;
  isBPL: boolean;
  bplCardNo: string | null;
  isAAY: boolean;
  aayCardNo: string | null;
  isRTE: boolean;
  rteAdmissionYear: string | null;
  isEWS: boolean;
  ewsCertificateNo: string | null;
  isSingleParent: boolean;
  isOrphan: boolean;
  isDisabled: boolean;
  disabilityType: string | null;
  disabilityPercentage: number | null;
  udidNo: string | null;
  aadharNo: string;
  studentMobile: string;
  parentMobile: string;
  email: string;
  permanentAddress: string;
  correspondenceAddress: string;
  pincode: string;
  district: string;
  state: string;
  fatherOccupation: string;
  motherOccupation: string;
  fatherAnnualIncome: number;
  motherAnnualIncome: number;
  totalFamilyIncome: number;
  familyMembers: number;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  photo: string;
  annualFee: number;
  previousYearMarks: number;
  attendancePercentage: number;
}

interface ScholarshipScheme {
  id: string;
  code: string;
  name: string;
  nameHindi: string;
  type: 'RTE' | 'EWS' | 'Merit' | 'Sports' | 'Minority' | 'Disability' | 'BPL' | 'SC/ST' | 'OBC' | 'Girl Child' | 'Government' | 'Institution' | 'Other';
  category: 'Central' | 'State' | 'Private' | 'Institution';
  fundingAgency: string;
  maxAmount: number;
  minAmount: number;
  coverageType: 'Full Fee' | 'Partial Fee' | 'Fixed Amount' | 'Percentage';
  coveragePercentage: number | null;
  eligibilityCriteria: {
    category: string[];
    maxIncome: number;
    minMarks: number;
    minAttendance: number;
    otherCriteria: string[];
  };
  requiredDocuments: string[];
  applicationDeadline: string;
  disbursementMode: 'DBT' | 'Institution' | 'Cheque';
  renewalAllowed: boolean;
  isActive: boolean;
  description: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  file: File | null;
  status: 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';
  remarks: string;
  uploadedAt: string | null;
  isRequired: boolean;
}

type ApplicationStep = 'search' | 'scheme' | 'personal' | 'family' | 'income' | 'bank' | 'documents' | 'declaration' | 'review';

export function ScholarshipApplicationEntry() {
  // State Management
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFound, setStudentFound] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Application Form Data
  const [applicationData, setApplicationData] = useState({
    // Scheme Selection
    schemeId: '',
    academicYear: '2024-25',
    applicationDate: new Date().toISOString().split('T')[0],

    // Personal Details (editable overrides)
    nameAsPerAadhar: '',
    fatherNameAsPerAadhar: '',
    motherNameAsPerAadhar: '',
    dateOfBirthAsPerAadhar: '',

    // Category Details
    categoryConfirmed: false,
    subCategoryDetails: '',
    casteAsPerCertificate: '',

    // RTE Specific
    rteAdmissionDate: '',
    rteSchoolAllotmentOrder: '',
    rteVerificationStatus: '',

    // EWS Specific
    ewsCertificateDate: '',
    ewsIssuingAuthority: '',
    ewsValidityYear: '',

    // Minority Specific
    minorityCommunity: '',
    minorityCertificateNo: '',

    // Disability Specific
    disabilityCertificateNo: '',
    disabilityCertificateDate: '',
    disabilityIssuingHospital: '',

    // BPL Specific
    bplCertificateNo: '',
    bplIssuingAuthority: '',
    bplValidityYear: '',

    // Family Details
    fatherQualification: '',
    motherQualification: '',
    fatherEmploymentType: '',
    motherEmploymentType: '',
    fatherEmployerName: '',
    motherEmployerName: '',

    // Income Details
    fatherMonthlyIncome: 0,
    motherMonthlyIncome: 0,
    otherIncome: 0,
    agricultureIncome: 0,
    rentalIncome: 0,
    totalAnnualIncome: 0,
    incomeSource: '',
    isBelowPovertyLine: false,

    // Bank Details (for DBT)
    bankAccountType: 'Savings',
    isJointAccount: false,
    jointAccountHolderName: '',
    bankBranchAddress: '',
    bankMICRCode: '',
    isAccountLinkedWithAadhar: false,

    // Scholarship Amount
    requestedAmount: 0,
    feeDetails: {
      tuitionFee: 0,
      admissionFee: 0,
      examFee: 0,
      otherFee: 0,
      totalFee: 0
    },

    // Academic Details
    previousExamName: '',
    previousExamYear: '',
    previousExamBoard: '',
    previousExamRollNo: '',
    previousExamMarksObtained: 0,
    previousExamTotalMarks: 0,
    previousExamPercentage: 0,
    previousExamDivision: '',
    currentYearAttendance: 0,

    // Additional Information
    hasReceivedScholarshipBefore: false,
    previousScholarshipDetails: '',
    previousScholarshipYear: '',
    previousScholarshipAmount: 0,
    reasonForScholarship: '',

    // Hostel Details (if applicable)
    isHosteller: false,
    hostelName: '',
    hostelFee: 0,

    // Remarks
    applicantRemarks: ''
  });

  // Uploaded Documents
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
  { id: 'DOC001', name: 'Aadhar Card (Student)', type: 'Identity', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC002', name: 'Aadhar Card (Parent/Guardian)', type: 'Identity', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC003', name: 'Income Certificate', type: 'Income', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC004', name: 'Caste Certificate', type: 'Category', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC005', name: 'Domicile Certificate', type: 'Residence', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC006', name: 'Previous Year Marksheet', type: 'Academic', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC007', name: 'Bank Passbook (First Page)', type: 'Bank', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC008', name: 'Passport Size Photo', type: 'Photo', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC009', name: 'Fee Receipt', type: 'Fee', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: true },
  { id: 'DOC010', name: 'BPL Card', type: 'BPL', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC011', name: 'EWS Certificate', type: 'EWS', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC012', name: 'RTE Allotment Letter', type: 'RTE', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC013', name: 'Disability Certificate', type: 'Disability', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC014', name: 'Minority Certificate', type: 'Minority', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false },
  { id: 'DOC015', name: 'Single Parent Declaration', type: 'Family', file: null, status: 'Pending', remarks: '', uploadedAt: null, isRequired: false }]
  );

  // Mock Student Data
  const mockStudent: Student = {
    id: 'STU001',
    grNo: 'GR001',
    admissionNo: 'ADM-2024-001',
    name: 'Aarav Sharma',
    nameHindi: 'आरव शर्मा',
    fatherName: 'Rajesh Kumar Sharma',
    fatherNameHindi: 'राजेश कुमार शर्मा',
    motherName: 'Sunita Sharma',
    motherNameHindi: 'सुनीता शर्मा',
    guardianName: 'Rajesh Kumar Sharma',
    guardianRelation: 'Father',
    class: '10',
    section: 'A',
    rollNumber: '15',
    dateOfBirth: '2009-05-15',
    gender: 'Male',
    category: 'OBC',
    subCategory: 'OBC-NCL',
    religion: 'Hindu',
    caste: 'Sharma',
    nationality: 'Indian',
    domicileState: 'Maharashtra',
    isMinority: false,
    minorityType: null,
    isBPL: false,
    bplCardNo: null,
    isAAY: false,
    aayCardNo: null,
    isRTE: false,
    rteAdmissionYear: null,
    isEWS: true,
    ewsCertificateNo: 'EWS/MH/2024/12345',
    isSingleParent: false,
    isOrphan: false,
    isDisabled: false,
    disabilityType: null,
    disabilityPercentage: null,
    udidNo: null,
    aadharNo: '1234-5678-9012',
    studentMobile: '9876543210',
    parentMobile: '9876543211',
    email: 'rajesh.sharma@email.com',
    permanentAddress: '123, Green Valley Society, Sector 15, Andheri West',
    correspondenceAddress: '123, Green Valley Society, Sector 15, Andheri West',
    pincode: '400058',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    fatherOccupation: 'Private Job',
    motherOccupation: 'Homemaker',
    fatherAnnualIncome: 280000,
    motherAnnualIncome: 0,
    totalFamilyIncome: 280000,
    familyMembers: 4,
    bankName: 'State Bank of India',
    bankBranch: 'Andheri West',
    accountNumber: '1234567890123456',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Rajesh Kumar Sharma',
    photo: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff&size=200',
    annualFee: 75000,
    previousYearMarks: 85.6,
    attendancePercentage: 92
  };

  // Mock Scholarship Schemes
  const scholarshipSchemes: ScholarshipScheme[] = [
  {
    id: 'SCH001',
    code: 'RTE-2024',
    name: 'Right to Education (RTE) - Free Education',
    nameHindi: 'शिक्षा का अधिकार (आरटीई) - निःशुल्क शिक्षा',
    type: 'RTE',
    category: 'Central',
    fundingAgency: 'Ministry of Education, Government of India',
    maxAmount: 75000,
    minAmount: 0,
    coverageType: 'Full Fee',
    coveragePercentage: 100,
    eligibilityCriteria: {
      category: ['EWS', 'BPL', 'SC', 'ST', 'OBC'],
      maxIncome: 350000,
      minMarks: 0,
      minAttendance: 75,
      otherCriteria: [
      'Admitted under RTE quota',
      'Age between 6-14 years at time of admission',
      'Valid RTE allotment letter',
      'Family income below 3.5 Lakh per annum']

    },
    requiredDocuments: [
    'RTE Allotment Letter',
    'Income Certificate',
    'Aadhar Card',
    'Birth Certificate',
    'Residence Proof',
    'BPL/EWS Certificate'],

    applicationDeadline: '2024-06-30',
    disbursementMode: 'Institution',
    renewalAllowed: true,
    isActive: true,
    description: 'Under RTE Act 2009, 25% seats in private schools are reserved for children from economically weaker sections and disadvantaged groups. The government reimburses the fee to the school.'
  },
  {
    id: 'SCH002',
    code: 'EWS-FW-2024',
    name: 'Economically Weaker Section (EWS) Fee Waiver',
    nameHindi: 'आर्थिक रूप से कमजोर वर्ग (ईडब्ल्यूएस) शुल्क छूट',
    type: 'EWS',
    category: 'State',
    fundingAgency: 'State Education Department',
    maxAmount: 50000,
    minAmount: 10000,
    coverageType: 'Partial Fee',
    coveragePercentage: 75,
    eligibilityCriteria: {
      category: ['EWS', 'General'],
      maxIncome: 800000,
      minMarks: 50,
      minAttendance: 75,
      otherCriteria: [
      'Valid EWS Certificate',
      'Family income below 8 Lakh per annum',
      'Student of recognized school',
      'Regular attendance']

    },
    requiredDocuments: [
    'EWS Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Bank Passbook',
    'Fee Receipt'],

    applicationDeadline: '2024-07-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Fee waiver scheme for students belonging to Economically Weaker Section (EWS) with valid EWS certificate issued by competent authority.'
  },
  {
    id: 'SCH003',
    code: 'PMMS-2024',
    name: 'Post Matric Scholarship for SC/ST Students',
    nameHindi: 'अनुसूचित जाति/जनजाति छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
    type: 'SC/ST',
    category: 'Central',
    fundingAgency: 'Ministry of Social Justice and Empowerment',
    maxAmount: 100000,
    minAmount: 25000,
    coverageType: 'Full Fee',
    coveragePercentage: 100,
    eligibilityCriteria: {
      category: ['SC', 'ST'],
      maxIncome: 250000,
      minMarks: 40,
      minAttendance: 75,
      otherCriteria: [
      'Belongs to SC/ST category',
      'Family income below 2.5 Lakh per annum',
      'Studying in Class 9 and above',
      'Valid Caste Certificate']

    },
    requiredDocuments: [
    'Caste Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Bank Passbook',
    'Fee Receipt',
    'Bonafide Certificate'],

    applicationDeadline: '2024-10-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Central sector scheme providing financial assistance to SC/ST students for pursuing post-matriculation education.'
  },
  {
    id: 'SCH004',
    code: 'OBC-PMS-2024',
    name: 'Post Matric Scholarship for OBC Students',
    nameHindi: 'ओबीसी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
    type: 'OBC',
    category: 'Central',
    fundingAgency: 'Ministry of Social Justice and Empowerment',
    maxAmount: 50000,
    minAmount: 15000,
    coverageType: 'Partial Fee',
    coveragePercentage: 50,
    eligibilityCriteria: {
      category: ['OBC'],
      maxIncome: 150000,
      minMarks: 50,
      minAttendance: 75,
      otherCriteria: [
      'Belongs to OBC (Non-Creamy Layer)',
      'Family income below 1.5 Lakh per annum',
      'Valid OBC-NCL Certificate']

    },
    requiredDocuments: [
    'OBC-NCL Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Bank Passbook'],

    applicationDeadline: '2024-10-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Financial assistance for OBC students from economically weaker families.'
  },
  {
    id: 'SCH005',
    code: 'PMSM-2024',
    name: 'Pre-Matric Scholarship for Minority Students',
    nameHindi: 'अल्पसंख्यक छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति',
    type: 'Minority',
    category: 'Central',
    fundingAgency: 'Ministry of Minority Affairs',
    maxAmount: 25000,
    minAmount: 5000,
    coverageType: 'Fixed Amount',
    coveragePercentage: null,
    eligibilityCriteria: {
      category: ['Other'],
      maxIncome: 100000,
      minMarks: 50,
      minAttendance: 75,
      otherCriteria: [
      'Belongs to Minority Community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)',
      'Family income below 1 Lakh per annum',
      'Studying in Class 1 to 10']

    },
    requiredDocuments: [
    'Minority Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Bank Passbook',
    'Community Certificate'],

    applicationDeadline: '2024-09-30',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Scholarship for minority community students to encourage them to pursue education.'
  },
  {
    id: 'SCH006',
    code: 'PWD-SCH-2024',
    name: 'Scholarship for Students with Disabilities',
    nameHindi: 'दिव्यांग छात्रों के लिए छात्रवृत्ति',
    type: 'Disability',
    category: 'Central',
    fundingAgency: 'Department of Empowerment of Persons with Disabilities',
    maxAmount: 75000,
    minAmount: 20000,
    coverageType: 'Full Fee',
    coveragePercentage: 100,
    eligibilityCriteria: {
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 500000,
      minMarks: 40,
      minAttendance: 60,
      otherCriteria: [
      'Disability of 40% or more',
      'Valid UDID or Disability Certificate',
      'Family income below 5 Lakh per annum']

    },
    requiredDocuments: [
    'Disability Certificate',
    'UDID Card',
    'Medical Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Bank Passbook'],

    applicationDeadline: '2024-08-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Financial support for students with disabilities to pursue their education.'
  },
  {
    id: 'SCH007',
    code: 'BPL-SCH-2024',
    name: 'BPL Student Support Scheme',
    nameHindi: 'बीपीएल छात्र सहायता योजना',
    type: 'BPL',
    category: 'State',
    fundingAgency: 'State Social Welfare Department',
    maxAmount: 40000,
    minAmount: 10000,
    coverageType: 'Partial Fee',
    coveragePercentage: 60,
    eligibilityCriteria: {
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 100000,
      minMarks: 50,
      minAttendance: 75,
      otherCriteria: [
      'Valid BPL Card',
      'Family below poverty line',
      'Regular student']

    },
    requiredDocuments: [
    'BPL Card',
    'Ration Card',
    'Income Certificate',
    'Aadhar Card',
    'Bank Passbook'],

    applicationDeadline: '2024-07-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Support scheme for students from families below poverty line.'
  },
  {
    id: 'SCH008',
    code: 'MERIT-SCH-2024',
    name: 'Merit-cum-Means Scholarship',
    nameHindi: 'मेरिट-सह-मीन्स छात्रवृत्ति',
    type: 'Merit',
    category: 'Institution',
    fundingAgency: 'School Trust',
    maxAmount: 50000,
    minAmount: 15000,
    coverageType: 'Percentage',
    coveragePercentage: 50,
    eligibilityCriteria: {
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 600000,
      minMarks: 80,
      minAttendance: 90,
      otherCriteria: [
      'Previous year marks above 80%',
      'Good conduct',
      'Family income below 6 Lakh']

    },
    requiredDocuments: [
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Character Certificate',
    'Bank Passbook'],

    applicationDeadline: '2024-06-30',
    disbursementMode: 'Institution',
    renewalAllowed: true,
    isActive: true,
    description: 'Scholarship for meritorious students from economically weaker families.'
  },
  {
    id: 'SCH009',
    code: 'SPORTS-SCH-2024',
    name: 'Sports Scholarship',
    nameHindi: 'खेल छात्रवृत्ति',
    type: 'Sports',
    category: 'State',
    fundingAgency: 'State Sports Department',
    maxAmount: 30000,
    minAmount: 10000,
    coverageType: 'Fixed Amount',
    coveragePercentage: null,
    eligibilityCriteria: {
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 800000,
      minMarks: 45,
      minAttendance: 70,
      otherCriteria: [
      'State/National level sports participation',
      'Medal winner in recognized competition',
      'Valid sports certificate']

    },
    requiredDocuments: [
    'Sports Certificate',
    'Medal Certificate',
    'Selection Letter',
    'Aadhar Card',
    'Bank Passbook'],

    applicationDeadline: '2024-08-31',
    disbursementMode: 'DBT',
    renewalAllowed: false,
    isActive: true,
    description: 'Encouragement for students excelling in sports at state/national level.'
  },
  {
    id: 'SCH010',
    code: 'GIRL-CHILD-2024',
    name: 'Girl Child Education Scheme',
    nameHindi: 'बालिका शिक्षा योजना',
    type: 'Girl Child',
    category: 'State',
    fundingAgency: 'Women and Child Development Department',
    maxAmount: 35000,
    minAmount: 10000,
    coverageType: 'Partial Fee',
    coveragePercentage: 50,
    eligibilityCriteria: {
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 400000,
      minMarks: 55,
      minAttendance: 80,
      otherCriteria: [
      'Female student',
      'Family income below 4 Lakh',
      'Regular attendance']

    },
    requiredDocuments: [
    'Birth Certificate',
    'Income Certificate',
    'Aadhar Card',
    'Previous Year Marksheet',
    'Bank Passbook'],

    applicationDeadline: '2024-07-31',
    disbursementMode: 'DBT',
    renewalAllowed: true,
    isActive: true,
    description: 'Scheme to promote education of girl children from economically weaker families.'
  }];


  // Steps configuration
  const steps: {id: ApplicationStep;label: string;icon: React.ElementType;}[] = [
  { id: 'search', label: 'Student Search', icon: Search },
  { id: 'scheme', label: 'Scheme Selection', icon: Award },
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'family', label: 'Family Details', icon: Users },
  { id: 'income', label: 'Income Details', icon: IndianRupee },
  { id: 'bank', label: 'Bank Details', icon: Landmark },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'declaration', label: 'Declaration', icon: FileCheck },
  { id: 'review', label: 'Review & Submit', icon: CheckCircle }];


  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Check eligibility
  const checkEligibility = (scheme: ScholarshipScheme): {eligible: boolean;reasons: string[];} => {
    if (!selectedStudent) return { eligible: false, reasons: ['No student selected'] };

    const reasons: string[] = [];
    let eligible = true;

    // Category check
    if (!scheme.eligibilityCriteria.category.includes(selectedStudent.category) &&
    !scheme.eligibilityCriteria.category.includes('General')) {
      reasons.push(`Category ${selectedStudent.category} not eligible`);
      eligible = false;
    }

    // Income check
    if (selectedStudent.totalFamilyIncome > scheme.eligibilityCriteria.maxIncome) {
      reasons.push(`Family income exceeds ₹${scheme.eligibilityCriteria.maxIncome.toLocaleString()} limit`);
      eligible = false;
    }

    // Marks check
    if (selectedStudent.previousYearMarks < scheme.eligibilityCriteria.minMarks) {
      reasons.push(`Marks below ${scheme.eligibilityCriteria.minMarks}% minimum requirement`);
      eligible = false;
    }

    // Attendance check
    if (selectedStudent.attendancePercentage < scheme.eligibilityCriteria.minAttendance) {
      reasons.push(`Attendance below ${scheme.eligibilityCriteria.minAttendance}% minimum requirement`);
      eligible = false;
    }

    // Type specific checks
    if (scheme.type === 'RTE' && !selectedStudent.isRTE) {
      reasons.push('Not admitted under RTE quota');
      eligible = false;
    }

    if (scheme.type === 'EWS' && !selectedStudent.isEWS) {
      reasons.push('No valid EWS certificate');
      eligible = false;
    }

    if (scheme.type === 'Disability' && !selectedStudent.isDisabled) {
      reasons.push('Not a PwD student');
      eligible = false;
    }

    if (scheme.type === 'Minority' && !selectedStudent.isMinority) {
      reasons.push('Not from minority community');
      eligible = false;
    }

    if (scheme.type === 'BPL' && !selectedStudent.isBPL) {
      reasons.push('No valid BPL card');
      eligible = false;
    }

    if (scheme.type === 'Girl Child' && selectedStudent.gender !== 'Female') {
      reasons.push('Scheme only for female students');
      eligible = false;
    }

    return { eligible, reasons };
  };

  // Handle student search
  const handleStudentSearch = () => {
    setSelectedStudent(mockStudent);
    setStudentFound(true);
    setApplicationData({
      ...applicationData,
      nameAsPerAadhar: mockStudent.name,
      fatherNameAsPerAadhar: mockStudent.fatherName,
      motherNameAsPerAadhar: mockStudent.motherName,
      dateOfBirthAsPerAadhar: mockStudent.dateOfBirth,
      totalAnnualIncome: mockStudent.totalFamilyIncome,
      fatherMonthlyIncome: Math.round(mockStudent.fatherAnnualIncome / 12),
      motherMonthlyIncome: Math.round(mockStudent.motherAnnualIncome / 12)
    });
  };

  // Handle scheme selection
  const handleSchemeSelect = (scheme: ScholarshipScheme) => {
    setSelectedScheme(scheme);
    setApplicationData({
      ...applicationData,
      schemeId: scheme.id,
      requestedAmount: scheme.coverageType === 'Full Fee' ?
      selectedStudent?.annualFee || 0 :
      scheme.coveragePercentage ?
      Math.round((selectedStudent?.annualFee || 0) * (scheme.coveragePercentage / 100)) :
      scheme.maxAmount
    });

    // Update required documents based on scheme
    const updatedDocs = uploadedDocuments.map((doc) => {
      let isRequired = doc.isRequired;

      if (scheme.type === 'RTE' && doc.type === 'RTE') isRequired = true;
      if (scheme.type === 'EWS' && doc.type === 'EWS') isRequired = true;
      if (scheme.type === 'Minority' && doc.type === 'Minority') isRequired = true;
      if (scheme.type === 'Disability' && doc.type === 'Disability') isRequired = true;
      if (scheme.type === 'BPL' && doc.type === 'BPL') isRequired = true;
      if (['SC/ST', 'OBC'].includes(scheme.type) && doc.type === 'Category') isRequired = true;

      return { ...doc, isRequired };
    });
    setUploadedDocuments(updatedDocs);
  };

  // Handle file upload
  const handleFileUpload = (docId: string, file: File) => {
    setUploadedDocuments((prev) =>
    prev.map((doc) =>
    doc.id === docId ?
    { ...doc, file, status: 'Uploaded', uploadedAt: new Date().toISOString() } :
    doc
    )
    );
  };

  // Remove uploaded file
  const removeFile = (docId: string) => {
    setUploadedDocuments((prev) =>
    prev.map((doc) =>
    doc.id === docId ?
    { ...doc, file: null, status: 'Pending', uploadedAt: null } :
    doc
    )
    );
  };

  // Navigate steps
  const goToNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Save as draft
  const saveAsDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
    alert('Application saved as draft successfully!');
  };

  // Submit application
  const submitApplication = () => {
    if (!declarationAccepted) {
      alert('Please accept the declaration to submit the application.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully! Application ID: SCH-APP-2024-00125');
    }, 2000);
  };

  // Get scheme type badge
  const getSchemeTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      RTE: 'bg-green-100 text-green-700 border-green-200',
      EWS: 'bg-blue-100 text-blue-700 border-blue-200',
      Merit: 'bg-purple-100 text-purple-700 border-purple-200',
      Sports: 'bg-orange-100 text-orange-700 border-orange-200',
      Minority: 'bg-teal-100 text-teal-700 border-teal-200',
      Disability: 'bg-red-100 text-red-700 border-red-200',
      BPL: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'SC/ST': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      OBC: 'bg-pink-100 text-pink-700 border-pink-200',
      'Girl Child': 'bg-rose-100 text-rose-700 border-rose-200',
      Government: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      Institution: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return (
      <span className={`px-2 py-1 rounded border text-xs font-medium ${colors[type] || colors.Institution}`}>
        {type}
      </span>);

  };

  // Calculate required documents status
  const documentStatus = useMemo(() => {
    const required = uploadedDocuments.filter((d) => d.isRequired);
    const uploaded = required.filter((d) => d.status !== 'Pending');
    return {
      total: required.length,
      uploaded: uploaded.length,
      pending: required.length - uploaded.length,
      percentage: Math.round(uploaded.length / required.length * 100) || 0
    };
  }, [uploadedDocuments]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Scholarship Application Entry
            <Badge variant="info" className="ml-2">
              {applicationData.academicYear}
            </Badge>
          </h1>
          <p className="text-gray-500 mt-1">
            Apply for government and institutional scholarship schemes including RTE, EWS, SC/ST, OBC, Minority, and others
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveAsDraft} disabled={!studentFound}>
            <Save className="w-4 h-4 mr-2" />
            {isDraftSaved ? 'Saved!' : 'Save Draft'}
          </Button>
          <Select
            options={[
            { value: '2024-25', label: 'Academic Year 2024-25' },
            { value: '2023-24', label: 'Academic Year 2023-24' }]
            }
            value={applicationData.academicYear}
            onChange={(e) => setApplicationData({ ...applicationData, academicYear: e.target.value })} />

        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const isAccessible = studentFound || index === 0;

            return (
              <React.Fragment key={step.id}>
                <button
                  className={`flex flex-col items-center gap-2 min-w-[80px] ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`
                  }
                  onClick={() => isAccessible && (isCompleted || isActive) && setCurrentStep(step.id)}
                  disabled={!isAccessible}>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ?
                    'bg-blue-600 text-white shadow-lg' :
                    isCompleted ?
                    'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'}`
                    }>

                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`
                    }>

                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 &&
                <div
                  className={`flex-1 h-1 mx-1 rounded ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`
                  } />

                }
              </React.Fragment>);

          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Student Info */}
        {studentFound && selectedStudent &&
        <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="text-center">
                <img
                src={selectedStudent.photo}
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg" />

                <h3 className="text-lg font-bold text-gray-900 mt-3">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-500">{selectedStudent.nameHindi}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="info">{selectedStudent.grNo}</Badge>
                  <Badge variant="default">Class {selectedStudent.class}-{selectedStudent.section}</Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{selectedStudent.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Religion:</span>
                  <span className="font-medium">{selectedStudent.religion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium">{selectedStudent.gender}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.isRTE &&
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">RTE</span>
                }
                  {selectedStudent.isEWS &&
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">EWS</span>
                }
                  {selectedStudent.isBPL &&
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">BPL</span>
                }
                  {selectedStudent.isDisabled &&
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">PwD</span>
                }
                  {selectedStudent.isMinority &&
                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded font-medium">Minority</span>
                }
                  {selectedStudent.isSingleParent &&
                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded font-medium">Single Parent</span>
                }
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Annual Fee:</span>
                  <span className="font-bold text-purple-900">₹{selectedStudent.annualFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Family Income:</span>
                  <span className="font-bold text-orange-600">₹{selectedStudent.totalFamilyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Prev. Year Marks:</span>
                  <span className="font-bold text-green-600">{selectedStudent.previousYearMarks}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Attendance:</span>
                  <span className="font-bold text-blue-600">{selectedStudent.attendancePercentage}%</span>
                </div>
              </div>
            </Card>

            {/* Selected Scheme Info */}
            {selectedScheme &&
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h4 className="font-bold text-green-900 mb-2">Selected Scheme</h4>
                <p className="text-sm font-medium text-green-800">{selectedScheme.name}</p>
                <p className="text-xs text-green-600 mt-1">{selectedScheme.nameHindi}</p>
                <div className="mt-3 flex gap-2">
                  {getSchemeTypeBadge(selectedScheme.type)}
                  <Badge variant={selectedScheme.category === 'Central' ? 'info' : 'default'}>
                    {selectedScheme.category}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Max Amount:</span>
                    <span className="font-bold">₹{selectedScheme.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-green-700">Coverage:</span>
                    <span className="font-medium">{selectedScheme.coverageType}</span>
                  </div>
                </div>
              </Card>
          }

            {/* Document Progress */}
            {selectedScheme &&
          <Card className="p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uploaded:</span>
                    <span className="font-medium">{documentStatus.uploaded}/{documentStatus.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${documentStatus.percentage}%` }} />

                  </div>
                  {documentStatus.pending > 0 &&
              <p className="text-xs text-orange-600">
                      {documentStatus.pending} required document(s) pending
                    </p>
              }
                </div>
              </Card>
          }
          </div>
        }

        {/* Main Content Area */}
        <div className={`${studentFound ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {/* Step 1: Student Search */}
          {currentStep === 'search' &&
          <Card className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Find Student</h2>
                  <p className="text-gray-500 mt-2">
                    Search by GR Number, Admission Number, or Student Name
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                  placeholder="Enter GR No, Admission No, Name, or Aadhar Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-5 h-5 text-gray-400" />}
                  className="text-lg" />

                  <Button variant="primary" className="w-full" onClick={handleStudentSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search Student
                  </Button>
                </div>

                {studentFound &&
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <img
                    src={selectedStudent?.photo}
                    alt=""
                    className="w-16 h-16 rounded-full" />

                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{selectedStudent?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedStudent?.grNo} | Class {selectedStudent?.class}-{selectedStudent?.section}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="success">Student Found</Badge>
                          {selectedStudent?.isEWS && <Badge variant="info">EWS</Badge>}
                        </div>
                      </div>
                      <Button variant="primary" onClick={goToNextStep}>
                        Continue
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
              }

                <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Important Instructions:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>Ensure student is enrolled in the current academic year</li>
                        <li>Student must have valid Aadhar number linked with bank account for DBT</li>
                        <li>Previous year marksheet is mandatory for all schemes</li>
                        <li>RTE students must have valid RTE allotment letter</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          }

          {/* Step 2: Scheme Selection */}
          {currentStep === 'scheme' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select Scholarship Scheme</h2>
                <p className="text-gray-500 mb-6">
                  Choose from available government and institutional scholarship schemes based on eligibility
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarshipSchemes.map((scheme) => {
                  const eligibility = checkEligibility(scheme);
                  const isSelected = selectedScheme?.id === scheme.id;

                  return (
                    <div
                      key={scheme.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected ?
                      'border-blue-500 bg-blue-50' :
                      eligibility.eligible ?
                      'border-gray-200 hover:border-blue-300 hover:bg-gray-50' :
                      'border-gray-200 bg-gray-50 opacity-60'}`
                      }
                      onClick={() => eligibility.eligible && handleSchemeSelect(scheme)}>

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{scheme.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{scheme.nameHindi}</p>
                          </div>
                          {isSelected &&
                        <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        }
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {getSchemeTypeBadge(scheme.type)}
                          <Badge variant={scheme.category === 'Central' ? 'info' : scheme.category === 'State' ? 'success' : 'default'}>
                            {scheme.category}
                          </Badge>
                        </div>

                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Max Amount:</span>
                            <span className="font-bold text-green-600">₹{scheme.maxAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Coverage:</span>
                            <span className="font-medium">
                              {scheme.coverageType}
                              {scheme.coveragePercentage && ` (${scheme.coveragePercentage}%)`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Income Limit:</span>
                            <span>≤ ₹{scheme.eligibilityCriteria.maxIncome.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          {eligibility.eligible ?
                        <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Eligible</span>
                            </div> :

                        <div>
                              <div className="flex items-center gap-2 text-red-600 mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Not Eligible</span>
                              </div>
                              <ul className="text-xs text-red-500 list-disc list-inside">
                                {eligibility.reasons.slice(0, 2).map((reason, i) =>
                            <li key={i}>{reason}</li>
                            )}
                              </ul>
                            </div>
                        }
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheme(scheme);
                            setShowSchemeDetails(true);
                          }}>

                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          <span className="text-xs text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Deadline: {new Date(scheme.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>);

                })}
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep} disabled={!selectedScheme}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 3: Personal Details */}
          {currentStep === 'personal' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Verify and confirm personal details as per Aadhar and other government documents
                </p>

                <div className="space-y-6">
                  {/* Name Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name Details (As per Aadhar)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                      label="Student Name (English)"
                      value={applicationData.nameAsPerAadhar}
                      onChange={(e) => setApplicationData({ ...applicationData, nameAsPerAadhar: e.target.value })} />

                      <Input
                      label="Student Name (Hindi/Regional)"
                      value={selectedStudent.nameHindi}
                      disabled />

                      <Input
                      label="Father's Name (English)"
                      value={applicationData.fatherNameAsPerAadhar}
                      onChange={(e) => setApplicationData({ ...applicationData, fatherNameAsPerAadhar: e.target.value })} />

                      <Input
                      label="Mother's Name (English)"
                      value={applicationData.motherNameAsPerAadhar}
                      onChange={(e) => setApplicationData({ ...applicationData, motherNameAsPerAadhar: e.target.value })} />

                    </div>
                  </div>

                  {/* Identity Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Identity Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Aadhar Number"
                      value={selectedStudent.aadharNo}
                      disabled />

                      <Input
                      label="Date of Birth"
                      type="date"
                      value={selectedStudent.dateOfBirth}
                      disabled />

                      <Select
                      label="Gender"
                      options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' }]
                      }
                      value={selectedStudent.gender}
                      disabled />

                      <Input
                      label="Nationality"
                      value={selectedStudent.nationality}
                      disabled />

                      <Input
                      label="Domicile State"
                      value={selectedStudent.domicileState}
                      disabled />

                      <Input
                      label="Religion"
                      value={selectedStudent.religion}
                      disabled />

                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Category & Reservation Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                      label="Category"
                      options={[
                      { value: 'General', label: 'General' },
                      { value: 'OBC', label: 'OBC (Other Backward Class)' },
                      { value: 'SC', label: 'SC (Scheduled Caste)' },
                      { value: 'ST', label: 'ST (Scheduled Tribe)' },
                      { value: 'EWS', label: 'EWS (Economically Weaker Section)' }]
                      }
                      value={selectedStudent.category}
                      disabled />

                      <Input
                      label="Sub-Category"
                      value={selectedStudent.subCategory}
                      disabled />

                      <Input
                      label="Caste (As per Certificate)"
                      value={applicationData.casteAsPerCertificate || selectedStudent.caste}
                      onChange={(e) => setApplicationData({ ...applicationData, casteAsPerCertificate: e.target.value })} />

                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center gap-2 p-3 bg-white rounded border">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isRTE}
                        disabled
                        className="rounded" />

                        <span className="text-sm font-medium">RTE Admission</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-white rounded border">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isEWS}
                        disabled
                        className="rounded" />

                        <span className="text-sm font-medium">EWS Category</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-white rounded border">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isBPL}
                        disabled
                        className="rounded" />

                        <span className="text-sm font-medium">BPL Family</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-white rounded border">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isMinority}
                        disabled
                        className="rounded" />

                        <span className="text-sm font-medium">Minority</span>
                      </label>
                    </div>
                  </div>

                  {/* RTE Specific Fields */}
                  {selectedScheme?.type === 'RTE' &&
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        RTE Specific Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                      label="RTE Admission Date"
                      type="date"
                      value={applicationData.rteAdmissionDate}
                      onChange={(e) => setApplicationData({ ...applicationData, rteAdmissionDate: e.target.value })} />

                        <Input
                      label="RTE Allotment Order No."
                      placeholder="Enter order number"
                      value={applicationData.rteSchoolAllotmentOrder}
                      onChange={(e) => setApplicationData({ ...applicationData, rteSchoolAllotmentOrder: e.target.value })} />

                        <Select
                      label="RTE Verification Status"
                      options={[
                      { value: '', label: 'Select Status' },
                      { value: 'Verified', label: 'Verified' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Under Process', label: 'Under Process' }]
                      }
                      value={applicationData.rteVerificationStatus}
                      onChange={(e) => setApplicationData({ ...applicationData, rteVerificationStatus: e.target.value })} />

                      </div>
                    </div>
                }

                  {/* EWS Specific Fields */}
                  {(selectedScheme?.type === 'EWS' || selectedStudent.isEWS) &&
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        EWS Certificate Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                      label="EWS Certificate No."
                      value={selectedStudent.ewsCertificateNo || ''}
                      disabled />

                        <Input
                      label="Certificate Issue Date"
                      type="date"
                      value={applicationData.ewsCertificateDate}
                      onChange={(e) => setApplicationData({ ...applicationData, ewsCertificateDate: e.target.value })} />

                        <Input
                      label="Issuing Authority"
                      placeholder="e.g., Tehsildar"
                      value={applicationData.ewsIssuingAuthority}
                      onChange={(e) => setApplicationData({ ...applicationData, ewsIssuingAuthority: e.target.value })} />

                        <Input
                      label="Validity Year"
                      placeholder="e.g., 2024-25"
                      value={applicationData.ewsValidityYear}
                      onChange={(e) => setApplicationData({ ...applicationData, ewsValidityYear: e.target.value })} />

                      </div>
                    </div>
                }

                  {/* Contact Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Student Mobile"
                      value={selectedStudent.studentMobile}
                      disabled />

                      <Input
                      label="Parent Mobile"
                      value={selectedStudent.parentMobile}
                      disabled />

                      <Input
                      label="Email"
                      value={selectedStudent.email}
                      disabled />

                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                      label="Permanent Address"
                      value={selectedStudent.permanentAddress}
                      disabled />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                        label="District"
                        value={selectedStudent.district}
                        disabled />

                        <Input
                        label="State"
                        value={selectedStudent.state}
                        disabled />

                        <Input
                        label="PIN Code"
                        value={selectedStudent.pincode}
                        disabled />

                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 4: Family Details */}
          {currentStep === 'family' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Family Details</h2>

                <div className="space-y-6">
                  {/* Father's Details */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-4">Father's Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Father's Name"
                      value={selectedStudent.fatherName}
                      disabled />

                      <Select
                      label="Qualification"
                      options={[
                      { value: '', label: 'Select' },
                      { value: 'Below 10th', label: 'Below 10th' },
                      { value: '10th Pass', label: '10th Pass' },
                      { value: '12th Pass', label: '12th Pass' },
                      { value: 'Graduate', label: 'Graduate' },
                      { value: 'Post Graduate', label: 'Post Graduate' },
                      { value: 'Professional', label: 'Professional Degree' },
                      { value: 'Illiterate', label: 'Illiterate' }]
                      }
                      value={applicationData.fatherQualification}
                      onChange={(e) => setApplicationData({ ...applicationData, fatherQualification: e.target.value })} />

                      <Input
                      label="Occupation"
                      value={selectedStudent.fatherOccupation}
                      disabled />

                      <Select
                      label="Employment Type"
                      options={[
                      { value: '', label: 'Select' },
                      { value: 'Government', label: 'Government Employee' },
                      { value: 'Private', label: 'Private Employee' },
                      { value: 'Self-employed', label: 'Self-employed / Business' },
                      { value: 'Agriculture', label: 'Agriculture' },
                      { value: 'Daily Wage', label: 'Daily Wage Worker' },
                      { value: 'Unemployed', label: 'Unemployed' },
                      { value: 'Retired', label: 'Retired' },
                      { value: 'Deceased', label: 'Deceased' }]
                      }
                      value={applicationData.fatherEmploymentType}
                      onChange={(e) => setApplicationData({ ...applicationData, fatherEmploymentType: e.target.value })} />

                      <Input
                      label="Employer Name (if applicable)"
                      placeholder="Enter employer name"
                      value={applicationData.fatherEmployerName}
                      onChange={(e) => setApplicationData({ ...applicationData, fatherEmployerName: e.target.value })} />

                      <Input
                      label="Monthly Income (₹)"
                      type="number"
                      value={applicationData.fatherMonthlyIncome}
                      onChange={(e) => setApplicationData({ ...applicationData, fatherMonthlyIncome: parseInt(e.target.value) || 0 })} />

                    </div>
                  </div>

                  {/* Mother's Details */}
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h3 className="font-bold text-pink-800 mb-4">Mother's Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Mother's Name"
                      value={selectedStudent.motherName}
                      disabled />

                      <Select
                      label="Qualification"
                      options={[
                      { value: '', label: 'Select' },
                      { value: 'Below 10th', label: 'Below 10th' },
                      { value: '10th Pass', label: '10th Pass' },
                      { value: '12th Pass', label: '12th Pass' },
                      { value: 'Graduate', label: 'Graduate' },
                      { value: 'Post Graduate', label: 'Post Graduate' },
                      { value: 'Professional', label: 'Professional Degree' },
                      { value: 'Illiterate', label: 'Illiterate' }]
                      }
                      value={applicationData.motherQualification}
                      onChange={(e) => setApplicationData({ ...applicationData, motherQualification: e.target.value })} />

                      <Input
                      label="Occupation"
                      value={selectedStudent.motherOccupation}
                      disabled />

                      <Select
                      label="Employment Type"
                      options={[
                      { value: '', label: 'Select' },
                      { value: 'Government', label: 'Government Employee' },
                      { value: 'Private', label: 'Private Employee' },
                      { value: 'Self-employed', label: 'Self-employed / Business' },
                      { value: 'Homemaker', label: 'Homemaker' },
                      { value: 'Daily Wage', label: 'Daily Wage Worker' },
                      { value: 'Unemployed', label: 'Unemployed' },
                      { value: 'Deceased', label: 'Deceased' }]
                      }
                      value={applicationData.motherEmploymentType}
                      onChange={(e) => setApplicationData({ ...applicationData, motherEmploymentType: e.target.value })} />

                      <Input
                      label="Employer Name (if applicable)"
                      placeholder="Enter employer name"
                      value={applicationData.motherEmployerName}
                      onChange={(e) => setApplicationData({ ...applicationData, motherEmployerName: e.target.value })} />

                      <Input
                      label="Monthly Income (₹)"
                      type="number"
                      value={applicationData.motherMonthlyIncome}
                      onChange={(e) => setApplicationData({ ...applicationData, motherMonthlyIncome: parseInt(e.target.value) || 0 })} />

                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4">Family Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                      label="Total Family Members"
                      type="number"
                      value={selectedStudent.familyMembers}
                      disabled />

                      <Select
                      label="Family Type"
                      options={[
                      { value: 'Nuclear', label: 'Nuclear Family' },
                      { value: 'Joint', label: 'Joint Family' },
                      { value: 'Single Parent', label: 'Single Parent' }]
                      } />

                      <label className="flex items-center gap-2 p-3 bg-white rounded border self-end">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isSingleParent}
                        disabled
                        className="rounded" />

                        <span className="text-sm">Single Parent</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-white rounded border self-end">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isOrphan}
                        disabled
                        className="rounded" />

                        <span className="text-sm">Orphan</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 5: Income Details */}
          {currentStep === 'income' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Income Details</h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Provide accurate income details as per Income Certificate issued by competent authority
                </p>

                <div className="space-y-6">
                  {/* Income Breakdown */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Annual Income Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Father's Annual Income (₹)"
                      type="number"
                      value={selectedStudent.fatherAnnualIncome}
                      disabled />

                      <Input
                      label="Mother's Annual Income (₹)"
                      type="number"
                      value={selectedStudent.motherAnnualIncome}
                      disabled />

                      <Input
                      label="Other Income (₹)"
                      type="number"
                      value={applicationData.otherIncome}
                      onChange={(e) => setApplicationData({ ...applicationData, otherIncome: parseInt(e.target.value) || 0 })} />

                      <Input
                      label="Agriculture Income (₹)"
                      type="number"
                      value={applicationData.agricultureIncome}
                      onChange={(e) => setApplicationData({ ...applicationData, agricultureIncome: parseInt(e.target.value) || 0 })} />

                      <Input
                      label="Rental Income (₹)"
                      type="number"
                      value={applicationData.rentalIncome}
                      onChange={(e) => setApplicationData({ ...applicationData, rentalIncome: parseInt(e.target.value) || 0 })} />

                      <Input
                      label="Total Annual Family Income (₹)"
                      type="number"
                      value={selectedStudent.totalFamilyIncome}
                      disabled
                      className="bg-green-100" />

                    </div>
                  </div>

                  {/* Income Certificate Details */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Income Certificate Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Certificate Number"
                      placeholder="Enter certificate number" />

                      <Input
                      label="Issue Date"
                      type="date" />

                      <Input
                      label="Issuing Authority"
                      placeholder="e.g., Tehsildar, SDM" />

                      <Input
                      label="Valid Upto"
                      type="date" />

                      <Input
                      label="Income as per Certificate (₹)"
                      type="number" />

                    </div>
                  </div>

                  {/* BPL Details */}
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Below Poverty Line (BPL) Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 p-3 bg-white rounded border">
                        <input
                        type="checkbox"
                        checked={selectedStudent.isBPL}
                        disabled
                        className="rounded" />

                        <span className="text-sm font-medium">Family is Below Poverty Line (BPL)</span>
                      </label>
                      {selectedStudent.isBPL &&
                    <>
                          <Input
                        label="BPL Card Number"
                        value={selectedStudent.bplCardNo || ''}
                        disabled />

                          <Input
                        label="Ration Card Number"
                        placeholder="Enter ration card number" />

                        </>
                    }
                    </div>
                  </div>

                  {/* Eligibility Check */}
                  {selectedScheme &&
                <div className={`p-4 rounded-lg border ${
                selectedStudent.totalFamilyIncome <= selectedScheme.eligibilityCriteria.maxIncome ?
                'bg-green-50 border-green-200' :
                'bg-red-50 border-red-200'}`
                }>
                      <div className="flex items-center gap-3">
                        {selectedStudent.totalFamilyIncome <= selectedScheme.eligibilityCriteria.maxIncome ?
                    <>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-bold text-green-800">Income Eligibility: Satisfied</p>
                              <p className="text-sm text-green-600">
                                Family income (₹{selectedStudent.totalFamilyIncome.toLocaleString()}) is within the limit of ₹{selectedScheme.eligibilityCriteria.maxIncome.toLocaleString()}
                              </p>
                            </div>
                          </> :

                    <>
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <div>
                              <p className="font-bold text-red-800">Income Eligibility: Not Satisfied</p>
                              <p className="text-sm text-red-600">
                                Family income (₹{selectedStudent.totalFamilyIncome.toLocaleString()}) exceeds the limit of ₹{selectedScheme.eligibilityCriteria.maxIncome.toLocaleString()}
                              </p>
                            </div>
                          </>
                    }
                      </div>
                    </div>
                }
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 6: Bank Details */}
          {currentStep === 'bank' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bank Account Details for DBT</h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Bank account must be linked with Aadhar for Direct Benefit Transfer (DBT)
                </p>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      Bank Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                      label="Bank Name"
                      value={selectedStudent.bankName}
                      disabled />

                      <Input
                      label="Branch Name"
                      value={selectedStudent.bankBranch}
                      disabled />

                      <Input
                      label="IFSC Code"
                      value={selectedStudent.ifscCode}
                      disabled />

                      <Input
                      label="Account Number"
                      value={selectedStudent.accountNumber}
                      disabled />

                      <Input
                      label="Account Holder Name"
                      value={selectedStudent.accountHolderName}
                      disabled />

                      <Select
                      label="Account Type"
                      options={[
                      { value: 'Savings', label: 'Savings Account' },
                      { value: 'Current', label: 'Current Account' },
                      { value: 'Jan Dhan', label: 'Jan Dhan Account' }]
                      }
                      value={applicationData.bankAccountType}
                      onChange={(e) => setApplicationData({ ...applicationData, bankAccountType: e.target.value })} />

                      <Input
                      label="Branch Address"
                      placeholder="Enter branch address"
                      value={applicationData.bankBranchAddress}
                      onChange={(e) => setApplicationData({ ...applicationData, bankBranchAddress: e.target.value })} />

                      <Input
                      label="MICR Code"
                      placeholder="Enter MICR code"
                      value={applicationData.bankMICRCode}
                      onChange={(e) => setApplicationData({ ...applicationData, bankMICRCode: e.target.value })} />

                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-800 mb-4">Aadhar Linking Status</h3>
                    <label className="flex items-center gap-3 p-3 bg-white rounded border">
                      <input
                      type="checkbox"
                      checked={applicationData.isAccountLinkedWithAadhar}
                      onChange={(e) => setApplicationData({ ...applicationData, isAccountLinkedWithAadhar: e.target.checked })}
                      className="rounded w-5 h-5" />

                      <div>
                        <span className="font-medium">Bank Account is linked with Aadhar</span>
                        <p className="text-sm text-gray-500">
                          Required for Direct Benefit Transfer (DBT) of scholarship amount
                        </p>
                      </div>
                    </label>

                    {!applicationData.isAccountLinkedWithAadhar &&
                  <div className="mt-4 p-3 bg-yellow-100 rounded flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Aadhar-Bank Linking Required</p>
                          <p>Please link your bank account with Aadhar to receive scholarship through DBT. 
                          Visit your bank branch or use UIDAI portal for linking.</p>
                        </div>
                      </div>
                  }
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 7: Documents */}
          {currentStep === 'documents' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Required Documents</h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Upload clear scanned copies of all required documents. Accepted formats: PDF, JPG, PNG (Max 2MB each)
                </p>

                <div className="space-y-4">
                  {uploadedDocuments.map((doc) =>
                <div
                  key={doc.id}
                  className={`p-4 rounded-lg border-2 ${
                  doc.status === 'Uploaded' ?
                  'border-green-200 bg-green-50' :
                  doc.isRequired ?
                  'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'}`
                  }>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      doc.status === 'Uploaded' ? 'bg-green-100' : 'bg-gray-100'}`
                      }>
                            {doc.status === 'Uploaded' ?
                        <CheckCircle className="w-5 h-5 text-green-600" /> :

                        <FileText className="w-5 h-5 text-gray-400" />
                        }
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{doc.name}</span>
                              {doc.isRequired &&
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">Required</span>
                          }
                            </div>
                            <p className="text-xs text-gray-500">{doc.type}</p>
                            {doc.file &&
                        <p className="text-xs text-green-600 mt-1">
                                Uploaded: {doc.file.name} ({(doc.file.size / 1024).toFixed(1)} KB)
                              </p>
                        }
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'Uploaded' ?
                      <>
                              <Button variant="ghost" size="sm" onClick={() => removeFile(doc.id)}>
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                              <Badge variant="success">Uploaded</Badge>
                            </> :

                      <label className="cursor-pointer">
                              <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                          }} />

                              <span className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                <Upload className="w-4 h-4" />
                                Upload
                              </span>
                            </label>
                      }
                        </div>
                      </div>
                    </div>
                )}
                </div>

                {/* Document Upload Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">Upload Progress</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${documentStatus.percentage}%` }} />

                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-800">
                      {documentStatus.uploaded}/{documentStatus.total} Required Documents
                    </span>
                  </div>
                  {documentStatus.pending > 0 &&
                <p className="text-sm text-orange-600 mt-2">
                      ⚠️ {documentStatus.pending} required document(s) still pending
                    </p>
                }
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={goToNextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 8: Declaration */}
          {currentStep === 'declaration' && selectedStudent &&
          <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Declaration & Undertaking</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-4">Applicant's Declaration</h3>
                    <div className="prose prose-sm text-yellow-900">
                      <p>I, <strong>{selectedStudent.name}</strong>, son/daughter of <strong>{selectedStudent.fatherName}</strong>, 
                      hereby declare that:</p>
                      <ol className="list-decimal list-inside space-y-2 mt-3">
                        <li>All the information provided in this application is true and correct to the best of my knowledge and belief.</li>
                        <li>The documents uploaded are genuine and have been issued by competent authorities.</li>
                        <li>I have not concealed any material information regarding my family income, category, or any other relevant details.</li>
                        <li>I am not receiving any other scholarship/fee waiver from any other source for the same period. If found otherwise, I shall be liable to refund the entire scholarship amount.</li>
                        <li>I understand that providing false information may result in cancellation of my scholarship and legal action.</li>
                        <li>I agree to abide by the rules and regulations of the scholarship scheme.</li>
                        <li>I authorize the institution/government to verify my documents and information from relevant authorities.</li>
                        <li>I consent to the use of my Aadhar for verification and DBT purposes.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-4">Parent/Guardian's Undertaking</h3>
                    <div className="prose prose-sm text-blue-900">
                      <p>I, <strong>{selectedStudent.fatherName}</strong> ({selectedStudent.guardianRelation} of {selectedStudent.name}), 
                      hereby undertake that:</p>
                      <ol className="list-decimal list-inside space-y-2 mt-3">
                        <li>I have verified all the information provided in this application and confirm its accuracy.</li>
                        <li>I shall ensure regular attendance and satisfactory academic performance of my ward.</li>
                        <li>I understand that the scholarship may be discontinued if my ward fails to maintain required attendance or academic standards.</li>
                        <li>I shall inform the institution/authority of any change in family income or other relevant circumstances.</li>
                        <li>I authorize deduction from the scholarship amount in case of any outstanding dues.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="rounded w-5 h-5 mt-0.5" />

                      <div>
                        <span className="font-medium text-gray-900">
                          I have read and understood the above declaration and undertaking. I accept all the terms and conditions.
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          By checking this box, you are digitally signing this application on behalf of the student and parent/guardian.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="Place"
                    placeholder="Enter city/place"
                    defaultValue={selectedStudent.district} />

                    <Input
                    label="Date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]} />

                    <Input
                    label="Applicant's Mobile (for OTP)"
                    value={selectedStudent.parentMobile}
                    disabled />

                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={!declarationAccepted}>

                  Review Application
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {/* Step 9: Review & Submit */}
          {currentStep === 'review' && selectedStudent && selectedScheme &&
          <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Review Application</h2>
                  <Button variant="outline" onClick={() => setShowPreviewModal(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Full Preview
                  </Button>
                </div>

                {/* Summary Sections */}
                <div className="space-y-4">
                  {/* Student Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student Details
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep('personal')}>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-500">Name:</span> <strong>{selectedStudent.name}</strong></div>
                      <div><span className="text-gray-500">GR No:</span> <strong>{selectedStudent.grNo}</strong></div>
                      <div><span className="text-gray-500">Class:</span> <strong>{selectedStudent.class}-{selectedStudent.section}</strong></div>
                      <div><span className="text-gray-500">Category:</span> <strong>{selectedStudent.category}</strong></div>
                      <div><span className="text-gray-500">Aadhar:</span> <strong>{selectedStudent.aadharNo}</strong></div>
                      <div><span className="text-gray-500">Mobile:</span> <strong>{selectedStudent.parentMobile}</strong></div>
                    </div>
                  </div>

                  {/* Scheme Summary */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-green-800 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Scholarship Scheme
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep('scheme')}>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Change
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-green-600">Scheme:</span> <strong>{selectedScheme.name}</strong></div>
                      <div><span className="text-green-600">Type:</span> {getSchemeTypeBadge(selectedScheme.type)}</div>
                      <div><span className="text-green-600">Category:</span> <strong>{selectedScheme.category}</strong></div>
                      <div><span className="text-green-600">Academic Year:</span> <strong>{applicationData.academicYear}</strong></div>
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Amount Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-blue-600">Annual Fee:</span> <strong>₹{selectedStudent.annualFee.toLocaleString()}</strong></div>
                      <div><span className="text-blue-600">Max Eligible:</span> <strong>₹{selectedScheme.maxAmount.toLocaleString()}</strong></div>
                      <div><span className="text-blue-600">Requested:</span> <strong className="text-green-600">₹{applicationData.requestedAmount.toLocaleString()}</strong></div>
                      <div><span className="text-blue-600">Family Income:</span> <strong>₹{selectedStudent.totalFamilyIncome.toLocaleString()}</strong></div>
                    </div>
                  </div>

                  {/* Bank Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      Bank Details (for DBT)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-500">Bank:</span> <strong>{selectedStudent.bankName}</strong></div>
                      <div><span className="text-gray-500">A/C No:</span> <strong>{selectedStudent.accountNumber}</strong></div>
                      <div><span className="text-gray-500">IFSC:</span> <strong>{selectedStudent.ifscCode}</strong></div>
                      <div><span className="text-gray-500">Aadhar Linked:</span> 
                        {applicationData.isAccountLinkedWithAadhar ?
                      <span className="text-green-600 font-bold"> Yes ✓</span> :
                      <span className="text-red-600 font-bold"> No ✗</span>
                      }
                      </div>
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents ({documentStatus.uploaded}/{documentStatus.total} uploaded)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uploadedDocuments.filter((d) => d.isRequired).map((doc) =>
                    <span
                      key={doc.id}
                      className={`px-2 py-1 rounded text-xs ${
                      doc.status === 'Uploaded' ?
                      'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'}`
                      }>

                          {doc.name}: {doc.status === 'Uploaded' ? '✓' : 'Pending'}
                        </span>
                    )}
                    </div>
                  </div>
                </div>

                {/* Warning for incomplete application */}
                {documentStatus.pending > 0 &&
              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="font-bold text-orange-800">Application Incomplete</p>
                        <p className="text-sm text-orange-700">
                          {documentStatus.pending} required document(s) are still pending. Please upload all required documents before submitting.
                        </p>
                      </div>
                    </div>
                  </div>
              }

                {/* Declaration Status */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-bold text-green-800">Declaration Accepted</p>
                      <p className="text-sm text-green-700">
                        You have accepted the declaration and undertaking on {new Date().toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit Actions */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Ready to Submit?</h3>
                    <p className="text-sm text-gray-600">
                      Review your application carefully before final submission. You won't be able to edit after submission.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={saveAsDraft}>
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button variant="outline">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Preview
                    </Button>
                    <Button
                    variant="primary"
                    onClick={submitApplication}
                    disabled={isSubmitting || documentStatus.pending > 0 || !declarationAccepted}
                    className="bg-green-600 hover:bg-green-700">

                      {isSubmitting ?
                    <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </> :

                    <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                    }
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Declaration
                </Button>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Scheme Details Modal */}
      {showSchemeDetails && selectedScheme &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedScheme.name}</h2>
                  <p className="text-sm text-gray-500">{selectedScheme.nameHindi}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSchemeDetails(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {getSchemeTypeBadge(selectedScheme.type)}
                <Badge variant={selectedScheme.category === 'Central' ? 'info' : 'success'}>
                  {selectedScheme.category} Scheme
                </Badge>
                <Badge variant="default">{selectedScheme.fundingAgency}</Badge>
              </div>

              <div className="prose prose-sm max-w-none">
                <p>{selectedScheme.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Maximum Amount</p>
                  <p className="text-2xl font-bold text-green-900">₹{selectedScheme.maxAmount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Coverage</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedScheme.coverageType}
                    {selectedScheme.coveragePercentage && ` (${selectedScheme.coveragePercentage}%)`}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {selectedScheme.eligibilityCriteria.otherCriteria.map((criteria, index) =>
                <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {criteria}
                    </li>
                )}
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Family income below ₹{selectedScheme.eligibilityCriteria.maxIncome.toLocaleString()} per annum
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Minimum {selectedScheme.eligibilityCriteria.minMarks}% marks in previous exam
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Minimum {selectedScheme.eligibilityCriteria.minAttendance}% attendance required
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Required Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScheme.requiredDocuments.map((doc, index) =>
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {doc}
                    </span>
                )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm text-orange-600">Application Deadline</p>
                  <p className="font-bold text-orange-900">{new Date(selectedScheme.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Disbursement Mode</p>
                  <p className="font-bold text-orange-900">{selectedScheme.disbursementMode}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSchemeDetails(false)}>
                Close
              </Button>
              {checkEligibility(selectedScheme).eligible &&
            <Button
              variant="primary"
              onClick={() => {
                handleSchemeSelect(selectedScheme);
                setShowSchemeDetails(false);
              }}>

                  Select This Scheme
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Application Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Ensure all documents are clear, legible, and valid</li>
              <li>Income certificate should be issued within the current financial year</li>
              <li>Bank account must be in the name of parent/guardian for minor students</li>
              <li>RTE students must upload valid RTE allotment letter</li>
              <li>EWS certificate validity should cover the current academic year</li>
              <li>For DBT, bank account must be linked with Aadhar</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}