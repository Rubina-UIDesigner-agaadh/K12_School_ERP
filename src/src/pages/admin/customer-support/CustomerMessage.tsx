import React, { useCallback, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import {
  SendIcon,
  PaperclipIcon,
  MailIcon,
  BellIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  TrashIcon,
  ArchiveIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ReplyIcon,
  ForwardIcon,
  PrinterIcon,
  XIcon,
  CheckIcon,
  CheckCheckIcon,
  ClockIcon,
  AlertTriangleIcon,
  InfoIcon,
  WrenchIcon,
  MegaphoneIcon,
  ShieldIcon,
  HeadphonesIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  ExternalLinkIcon,
  CopyIcon,
  InboxIcon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  BellOffIcon,
  FlagIcon } from
'lucide-react';
// Types
interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'excel' | 'zip' | 'link';
  size: string;
  url: string;
}
interface Reply {
  id: string;
  message: string;
  sentAt: string;
  sentBy: string;
  attachments: Attachment[];
}
interface Message {
  id: string;
  subject: string;
  body: string;
  sender: string;
  senderEmail: string;
  senderDepartment: string;
  category:
  'announcement' |
  'alert' |
  'maintenance' |
  'feature' |
  'security' |
  'support' |
  'billing' |
  'newsletter';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  receivedDate: string;
  receivedTime: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isMuted: boolean;
  isFlagged: boolean;
  labels: string[];
  attachments: Attachment[];
  relatedVersion?: string;
  expiresAt?: string;
  requiresAcknowledgment: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  replyHistory: Reply[];
}
// Mock Data
const initialMessagesData: Message[] = [
{
  id: 'msg-001',
  subject: 'Scheduled Maintenance - System Upgrade on Feb 20, 2025',
  body: `Dear Valued Customer,

We are writing to inform you about a scheduled system maintenance that will take place on February 20, 2025.

Maintenance Window:
- Start Time: 02:00 AM IST
- End Time: 06:00 AM IST
- Expected Duration: 4 hours

What to Expect:
- The ERP system will be unavailable during this maintenance window
- All scheduled reports and automated tasks will be paused
- Data backup will be performed before maintenance begins

Actions Required:
1. Please ensure all pending transactions are completed before the maintenance window
2. Inform your staff about the scheduled downtime
3. Download any urgent reports before the maintenance begins

What We're Upgrading:
- Database optimization for faster performance
- Security patches and updates
- New dashboard widgets (will be available after maintenance)
- Bug fixes for reported issues

If you have any concerns or need to schedule urgent work before the maintenance, please contact our support team.

Thank you for your patience and understanding.

Best regards,
Technical Operations Team
ERP Solutions Inc.`,
  sender: 'Technical Operations',
  senderEmail: 'techops@erpsolutions.com',
  senderDepartment: 'Infrastructure',
  category: 'maintenance',
  priority: 'high',
  receivedDate: '18-Feb-2025',
  receivedTime: '10:30 AM',
  isRead: false,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: true,
  labels: ['important', 'action-required'],
  attachments: [
  {
    id: 'att-001',
    name: 'Maintenance_Schedule.pdf',
    type: 'pdf',
    size: '245 KB',
    url: '/downloads/maintenance-schedule.pdf'
  },
  {
    id: 'att-002',
    name: 'Preparation_Checklist.pdf',
    type: 'pdf',
    size: '128 KB',
    url: '/downloads/checklist.pdf'
  }],

  relatedVersion: '3.2.0',
  expiresAt: '2025-02-20',
  requiresAcknowledgment: true,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-002',
  subject: 'New Feature Release: Online Examination Module Now Available!',
  body: `Dear Customer,

We are excited to announce the release of our highly anticipated Online Examination Module!

Key Features:
- Create and manage online exams with multiple question types (MCQ, Subjective, Fill-in-the-blanks)
- Automated grading for objective questions
- Anti-cheating measures including tab-switch detection and screen lock
- Real-time progress monitoring for invigilators
- Comprehensive result analytics and reports
- Integration with existing student database

How to Get Started:
1. Navigate to Assessment > Online Exams in your dashboard
2. Click on "Create New Exam" to set up your first online test
3. Watch the tutorial video (attached) for a complete walkthrough

Training Sessions:
We are offering free online training sessions for this module:
- Session 1: Feb 18, 2025 at 3:00 PM IST
- Session 2: Feb 20, 2025 at 11:00 AM IST
- Session 3: Feb 22, 2025 at 4:00 PM IST

Register through the link in the attachments.

Documentation:
Complete user guide and FAQ are attached for your reference.

If you need any assistance, our support team is ready to help!

Best regards,
Product Team
ERP Solutions Inc.`,
  sender: 'Product Team',
  senderEmail: 'product@erpsolutions.com',
  senderDepartment: 'Product Development',
  category: 'feature',
  priority: 'normal',
  receivedDate: '15-Feb-2025',
  receivedTime: '02:15 PM',
  isRead: true,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['new-feature', 'training'],
  attachments: [
  {
    id: 'att-003',
    name: 'Online_Exam_User_Guide.pdf',
    type: 'pdf',
    size: '3.2 MB',
    url: '/downloads/exam-guide.pdf'
  },
  {
    id: 'att-004',
    name: 'Tutorial_Video.mp4',
    type: 'video',
    size: '45 MB',
    url: '/videos/exam-tutorial.mp4'
  },
  {
    id: 'att-005',
    name: 'Training_Registration.pdf',
    type: 'pdf',
    size: '156 KB',
    url: '/downloads/training-registration.pdf'
  },
  {
    id: 'att-006',
    name: 'FAQ_Document.pdf',
    type: 'pdf',
    size: '890 KB',
    url: '/downloads/exam-faq.pdf'
  }],

  relatedVersion: '3.1.0',
  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: [
  {
    id: 'reply-001',
    message:
    'Thank you for this update. We are excited to try the new module. Will there be support for offline exam mode in future updates?',
    sentAt: '2025-02-15T16:30:00Z',
    sentBy: 'Admin User',
    attachments: []
  },
  {
    id: 'reply-002',
    message:
    'Great question! Yes, offline mode is planned for Q2 2025. We will keep you updated on the progress.',
    sentAt: '2025-02-16T09:00:00Z',
    sentBy: 'Product Team',
    attachments: []
  }]

},
{
  id: 'msg-003',
  subject: 'URGENT: Security Alert - Update Your Password Immediately',
  body: `SECURITY ALERT

Dear Administrator,

Our security team has detected unusual login patterns across multiple accounts in your region. As a precautionary measure, we strongly recommend that all users update their passwords immediately.

Immediate Actions Required:
1. Change your admin password right away
2. Notify all staff members to update their passwords
3. Review recent login activity in Security > Audit Logs
4. Enable Two-Factor Authentication if not already active

Security Recommendations:
- Use passwords with minimum 12 characters
- Include uppercase, lowercase, numbers, and special characters
- Do not reuse passwords from other platforms
- Consider using a password manager

What We're Doing:
- Enhanced monitoring on all accounts
- Additional security layers have been activated
- Suspicious IP addresses have been blocked
- We are conducting a thorough security audit

Signs of Compromised Account:
- Unexpected password reset emails
- Login notifications from unknown locations
- Changes to settings you didn't make
- Missing or modified data

If you notice any suspicious activity, please contact our security team immediately at security@erpsolutions.com or call our 24/7 helpline.

Stay vigilant and stay secure!

Security Team
ERP Solutions Inc.`,
  sender: 'Security Team',
  senderEmail: 'security@erpsolutions.com',
  senderDepartment: 'Information Security',
  category: 'security',
  priority: 'urgent',
  receivedDate: '12-Feb-2025',
  receivedTime: '08:45 AM',
  isRead: true,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: true,
  labels: ['security', 'urgent', 'action-required'],
  attachments: [
  {
    id: 'att-007',
    name: 'Security_Best_Practices.pdf',
    type: 'pdf',
    size: '1.1 MB',
    url: '/downloads/security-practices.pdf'
  },
  {
    id: 'att-008',
    name: '2FA_Setup_Guide.pdf',
    type: 'pdf',
    size: '567 KB',
    url: '/downloads/2fa-guide.pdf'
  }],

  requiresAcknowledgment: true,
  isAcknowledged: true,
  acknowledgedAt: '2025-02-12T10:30:00Z',
  replyHistory: []
},
{
  id: 'msg-004',
  subject: 'Your Support Ticket #45678 Has Been Resolved',
  body: `Dear Customer,

We are pleased to inform you that your support ticket #45678 has been resolved.

Ticket Details:
- Ticket ID: #45678
- Issue: Fee calculation showing incorrect late fee amount
- Category: Bug Report
- Priority: High
- Submitted: Feb 5, 2025
- Resolved: Feb 10, 2025

Resolution Summary:
The issue was caused by an incorrect date comparison in the late fee calculation logic. This has been fixed in the latest patch (v3.0.6). The fix includes:

1. Corrected date comparison for due date calculation
2. Fixed timezone handling for international schools
3. Added validation for fee structure entries

Action Required:
Please verify that the late fee calculations are now working correctly. If you encounter any further issues, please reopen this ticket or create a new one.

Patch Information:
The fix has been automatically applied to your system. No manual update is required.

We apologize for any inconvenience caused and thank you for your patience.

Best regards,
Support Team
ERP Solutions Inc.

---
To rate your support experience, click the Rate Support link.
Ticket Reference: SUP-2025-45678`,
  sender: 'Support Team',
  senderEmail: 'support@erpsolutions.com',
  senderDepartment: 'Customer Support',
  category: 'support',
  priority: 'normal',
  receivedDate: '10-Feb-2025',
  receivedTime: '04:20 PM',
  isRead: true,
  isStarred: false,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['support', 'resolved'],
  attachments: [
  {
    id: 'att-009',
    name: 'Ticket_Resolution_Report.pdf',
    type: 'pdf',
    size: '234 KB',
    url: '/downloads/ticket-45678.pdf'
  }],

  relatedVersion: '3.0.6',
  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-005',
  subject: 'Invoice #INV-2025-0234 - Subscription Renewal',
  body: `Dear Customer,

Please find attached your invoice for the upcoming subscription renewal.

Invoice Details:
- Invoice Number: INV-2025-0234
- Invoice Date: February 8, 2025
- Due Date: February 28, 2025
- Amount: ₹1,25,000.00

Subscription Details:
- Plan: Enterprise Annual
- Period: March 1, 2025 - February 28, 2026
- Modules Included: All Modules
- User Licenses: 50 Users
- Storage: 100 GB

Payment Options:
1. Online Payment: Pay through your dashboard (Settings > Billing > Pay Now)
2. Bank Transfer: Details provided in the attached invoice
3. Cheque: Payable to "ERP Solutions Inc."

Early Payment Discount:
Pay before February 20, 2025 and get 5% discount on your renewal amount!

If you have any questions about this invoice or wish to modify your subscription, please contact our billing team.

Thank you for being a valued customer!

Best regards,
Billing Department
ERP Solutions Inc.`,
  sender: 'Billing Department',
  senderEmail: 'billing@erpsolutions.com',
  senderDepartment: 'Finance',
  category: 'billing',
  priority: 'high',
  receivedDate: '08-Feb-2025',
  receivedTime: '11:00 AM',
  isRead: true,
  isStarred: false,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['billing', 'invoice'],
  attachments: [
  {
    id: 'att-010',
    name: 'Invoice_INV-2025-0234.pdf',
    type: 'pdf',
    size: '156 KB',
    url: '/downloads/invoice-0234.pdf'
  },
  {
    id: 'att-011',
    name: 'Subscription_Details.pdf',
    type: 'pdf',
    size: '89 KB',
    url: '/downloads/subscription-details.pdf'
  }],

  expiresAt: '2025-02-28',
  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-006',
  subject: 'February Newsletter - Tips, Updates & Community Highlights',
  body: `Dear Valued Customer,

Welcome to our February 2025 newsletter! Here's what's new in the ERP community.

Product Updates:
- Online Examination Module launched
- Performance improvements (50% faster report generation)
- Mobile app v2.5 released with offline support
- New CBSE report card templates added

Tips & Tricks:
1. Bulk Student Import: Did you know you can import 1000+ students at once? Check out our guide!
2. Custom Dashboards: Create personalized dashboards with drag-and-drop widgets
3. Automated Fee Reminders: Set up WhatsApp notifications for fee collection

Community Highlights:
- Delhi Public School achieved 100% digital attendance tracking
- St. Mary's School generated 5000+ report cards in under 10 minutes
- 15 new schools joined our community this month!

Upcoming Events:
- Webinar: "Maximizing ERP ROI" - Feb 25, 2025
- User Conference 2025 - March 15-16, Mumbai
- Training: Advanced Reporting - Feb 28, 2025

Feature Request Spotlight:
Your most requested feature - Offline Mode - is now in development! Expected release: Q2 2025

Thank you for being part of our growing community!

Best regards,
Marketing Team
ERP Solutions Inc.`,
  sender: 'Marketing Team',
  senderEmail: 'newsletter@erpsolutions.com',
  senderDepartment: 'Marketing',
  category: 'newsletter',
  priority: 'low',
  receivedDate: '05-Feb-2025',
  receivedTime: '09:00 AM',
  isRead: false,
  isStarred: false,
  isArchived: false,
  isDeleted: false,
  isMuted: true,
  isFlagged: false,
  labels: ['newsletter'],
  attachments: [
  {
    id: 'att-012',
    name: 'February_Newsletter.pdf',
    type: 'pdf',
    size: '2.8 MB',
    url: '/downloads/newsletter-feb.pdf'
  },
  {
    id: 'att-013',
    name: 'Conference_Brochure.pdf',
    type: 'pdf',
    size: '4.5 MB',
    url: '/downloads/conference-2025.pdf'
  }],

  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-007',
  subject: 'Important Announcement: New Data Privacy Compliance Requirements',
  body: `Dear Administrator,

We are writing to inform you about important updates regarding data privacy compliance that may affect your institution.

Background:
Recent regulatory changes require educational institutions to implement enhanced data protection measures. As your ERP partner, we are here to help you stay compliant.

Key Changes:
1. Data Retention Policies: Student data must be retained for specific periods
2. Consent Management: Explicit consent required for data processing
3. Data Access Rights: Students/Parents can request their data
4. Breach Notification: 72-hour notification requirement

What We've Done:
- Added Data Subject Request module (Settings > Privacy)
- Implemented automated data retention policies
- Enhanced audit logging for data access
- Created consent management workflows

What You Need to Do:
1. Review your institution's privacy policy
2. Configure data retention settings in the ERP
3. Communicate changes to parents/students
4. Train staff on new privacy features

Resources:
We have created comprehensive guides to help you with compliance. Please review the attached documents.

Compliance Deadline: March 31, 2025

If you need assistance with compliance setup, our team offers free consultation sessions.

Stay compliant, stay trusted!

Legal & Compliance Team
ERP Solutions Inc.`,
  sender: 'Legal & Compliance',
  senderEmail: 'compliance@erpsolutions.com',
  senderDepartment: 'Legal',
  category: 'announcement',
  priority: 'high',
  receivedDate: '01-Feb-2025',
  receivedTime: '03:45 PM',
  isRead: true,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: true,
  labels: ['compliance', 'legal', 'action-required'],
  attachments: [
  {
    id: 'att-014',
    name: 'Privacy_Compliance_Guide.pdf',
    type: 'pdf',
    size: '1.8 MB',
    url: '/downloads/privacy-guide.pdf'
  },
  {
    id: 'att-015',
    name: 'Data_Retention_Policy_Template.docx',
    type: 'doc',
    size: '245 KB',
    url: '/downloads/retention-template.docx'
  },
  {
    id: 'att-016',
    name: 'Compliance_Checklist.xlsx',
    type: 'excel',
    size: '78 KB',
    url: '/downloads/compliance-checklist.xlsx'
  },
  {
    id: 'att-017',
    name: 'Parent_Communication_Template.pdf',
    type: 'pdf',
    size: '156 KB',
    url: '/downloads/parent-template.pdf'
  }],

  expiresAt: '2025-03-31',
  requiresAcknowledgment: true,
  isAcknowledged: true,
  acknowledgedAt: '2025-02-02T09:15:00Z',
  replyHistory: []
},
{
  id: 'msg-008',
  subject: 'Alert: Unusual Activity Detected on Your Account',
  body: `SECURITY NOTICE

Dear Administrator,

Our security monitoring system has detected unusual activity on your ERP account.

Activity Details:
- Date/Time: January 28, 2025 at 11:45 PM IST
- IP Address: 192.168.45.123
- Location: Unknown (VPN detected)
- Activity: Multiple failed login attempts (7 attempts)

Our Actions:
- Temporarily blocked the suspicious IP address
- Increased monitoring on your account
- No unauthorized access was successful

Recommended Actions:
1. If this was you, no action needed
2. If this was NOT you:
   - Change your password immediately
   - Review your login history
   - Enable Two-Factor Authentication
   - Contact our security team

Review Your Security Settings:
Go to Settings > Security > Login Activity to review all recent access attempts.

If you need any assistance, please don't hesitate to reach out.

Stay secure!

Security Team
ERP Solutions Inc.

---
This is an automated security alert.
Report suspicious activity: security@erpsolutions.com`,
  sender: 'Security Team',
  senderEmail: 'security@erpsolutions.com',
  senderDepartment: 'Information Security',
  category: 'alert',
  priority: 'urgent',
  receivedDate: '29-Jan-2025',
  receivedTime: '12:30 AM',
  isRead: true,
  isStarred: false,
  isArchived: true,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['security', 'alert'],
  attachments: [],
  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-009',
  subject: 'Server Downtime Notice - Emergency Maintenance',
  body: `URGENT: UNPLANNED MAINTENANCE

Dear Customer,

We regret to inform you that we are experiencing technical difficulties that require immediate attention.

Current Status:
- Issue: Database connectivity issues
- Impact: Intermittent service disruptions
- Started: Jan 25, 2025 at 02:30 PM IST

Expected Resolution:
Our engineering team is working on resolving this issue. Expected resolution time: 2-3 hours.

What's Affected:
- Report generation may be slow
- Some data sync operations may fail
- Real-time notifications may be delayed

What's NOT Affected:
- Core data integrity
- Previously saved records
- Offline capabilities (if enabled)

Updates:
We will send updates every 30 minutes until the issue is resolved. You can also check our status page at status.erpsolutions.com

We apologize for any inconvenience caused.

Engineering Team
ERP Solutions Inc.`,
  sender: 'Engineering Team',
  senderEmail: 'engineering@erpsolutions.com',
  senderDepartment: 'Engineering',
  category: 'alert',
  priority: 'urgent',
  receivedDate: '25-Jan-2025',
  receivedTime: '02:45 PM',
  isRead: true,
  isStarred: false,
  isArchived: true,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['alert', 'resolved'],
  attachments: [],
  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
},
{
  id: 'msg-010',
  subject: 'Welcome to ERP Solutions - Getting Started Guide',
  body: `Dear Administrator,

Welcome to ERP Solutions! We are thrilled to have you on board.

Your Account Details:
- Organization: ABC International School
- Plan: Enterprise Annual
- Account ID: ORG-2025-1234
- Activation Date: January 15, 2025

Getting Started:
Here's how to make the most of your new ERP system:

Step 1: Initial Setup (Day 1-2)
- Configure institution details
- Set up academic year and terms
- Import staff and student data

Step 2: Module Configuration (Day 3-5)
- Set up fee structures
- Configure timetable
- Set up attendance rules

Step 3: User Training (Week 2)
- Admin training session (scheduled)
- Teacher orientation
- Parent portal introduction

Resources:
- Video tutorials: tutorials.erpsolutions.com
- Documentation: docs.erpsolutions.com
- Community forum: community.erpsolutions.com

Your Dedicated Support:
- Account Manager: Priya Sharma
- Email: priya.sharma@erpsolutions.com
- Phone: +91 98765 43210

We're here to help you succeed!

Welcome Team
ERP Solutions Inc.`,
  sender: 'Welcome Team',
  senderEmail: 'welcome@erpsolutions.com',
  senderDepartment: 'Customer Success',
  category: 'announcement',
  priority: 'normal',
  receivedDate: '15-Jan-2025',
  receivedTime: '10:00 AM',
  isRead: true,
  isStarred: true,
  isArchived: false,
  isDeleted: false,
  isMuted: false,
  isFlagged: false,
  labels: ['onboarding', 'important'],
  attachments: [
  {
    id: 'att-018',
    name: 'Getting_Started_Guide.pdf',
    type: 'pdf',
    size: '5.2 MB',
    url: '/downloads/getting-started.pdf'
  },
  {
    id: 'att-019',
    name: 'Quick_Reference_Card.pdf',
    type: 'pdf',
    size: '890 KB',
    url: '/downloads/quick-reference.pdf'
  },
  {
    id: 'att-020',
    name: 'Data_Import_Template.xlsx',
    type: 'excel',
    size: '156 KB',
    url: '/downloads/import-template.xlsx'
  },
  {
    id: 'att-021',
    name: 'Welcome_Video.mp4',
    type: 'video',
    size: '120 MB',
    url: '/videos/welcome.mp4'
  }],

  requiresAcknowledgment: false,
  isAcknowledged: false,
  replyHistory: []
}];

// Available labels
const availableLabels = [
'important',
'action-required',
'new-feature',
'training',
'security',
'urgent',
'support',
'resolved',
'billing',
'invoice',
'newsletter',
'compliance',
'legal',
'alert',
'onboarding'];

// Category list
const categoryList = [
'announcement',
'alert',
'maintenance',
'feature',
'security',
'support',
'billing',
'newsletter'];

type FolderView = 'inbox' | 'starred' | 'archived' | 'deleted';
type SortOrder = 'newest' | 'oldest';
export function CustomerMessage() {
  // State
  const [messages, setMessages] = useState<Message[]>(initialMessagesData);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('');
  const [labelFilter, setLabelFilter] = useState<string>('');
  const [folderView, setFolderView] = useState<FolderView>('inbox');
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingAttachments, setDownloadingAttachments] = useState<
    string[]>(
    []);
  const [processingActions, setProcessingActions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;
  // Parse date helper
  const parseMessageDate = useCallback(
    (dateStr: string, timeStr: string): number => {
      const [day, month, year] = dateStr.split('-');
      const monthMap: Record<string, string> = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      };
      return new Date(`${year}-${monthMap[month]}-${day} ${timeStr}`).getTime();
    },
    []
  );
  // Filtered messages
  const filteredMessages = useMemo(() => {
    let result = messages.filter((msg) => {
      // Folder view filter
      switch (folderView) {
        case 'inbox':
          if (msg.isDeleted || msg.isArchived) return false;
          break;
        case 'starred':
          if (!msg.isStarred || msg.isDeleted) return false;
          break;
        case 'archived':
          if (!msg.isArchived || msg.isDeleted) return false;
          break;
        case 'deleted':
          if (!msg.isDeleted) return false;
          break;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
        msg.subject.toLowerCase().includes(query) ||
        msg.body.toLowerCase().includes(query) ||
        msg.sender.toLowerCase().includes(query) ||
        msg.senderDepartment.toLowerCase().includes(query) ||
        msg.labels.some((l) => l.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      // Category filter
      if (categoryFilter && msg.category !== categoryFilter) return false;
      // Priority filter
      if (priorityFilter && msg.priority !== priorityFilter) return false;
      // Read filter
      if (readFilter === 'read' && !msg.isRead) return false;
      if (readFilter === 'unread' && msg.isRead) return false;
      // Label filter
      if (labelFilter && !msg.labels.includes(labelFilter)) return false;
      return true;
    });
    // Sort messages
    result.sort((a, b) => {
      const dateA = parseMessageDate(a.receivedDate, a.receivedTime);
      const dateB = parseMessageDate(b.receivedDate, b.receivedTime);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [
  messages,
  folderView,
  searchQuery,
  categoryFilter,
  priorityFilter,
  readFilter,
  labelFilter,
  sortOrder,
  parseMessageDate]
  );
  // Paginated messages
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * messagesPerPage;
    return filteredMessages.slice(startIndex, startIndex + messagesPerPage);
  }, [filteredMessages, currentPage]);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  // Selected message
  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || null;
  }, [messages, selectedMessageId]);
  // Statistics
  const stats = useMemo(() => {
    const inboxMessages = messages.filter((m) => !m.isDeleted && !m.isArchived);
    return {
      total: inboxMessages.length,
      unread: inboxMessages.filter((m) => !m.isRead).length,
      starred: messages.filter((m) => m.isStarred && !m.isDeleted).length,
      archived: messages.filter((m) => m.isArchived && !m.isDeleted).length,
      deleted: messages.filter((m) => m.isDeleted).length,
      requiresAction: inboxMessages.filter(
        (m) => m.requiresAcknowledgment && !m.isAcknowledged
      ).length
    };
  }, [messages]);
  const hasActiveFilters =
  searchQuery || categoryFilter || priorityFilter || readFilter || labelFilter;
  // Message actions
  const handleOpenMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId);
    setShowReplyForm(false);
    setReplyText('');
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isRead: true
    } :
    msg
    )
    );
  }, []);
  const handleCloseMessage = useCallback(() => {
    setSelectedMessageId(null);
    setShowReplyForm(false);
    setReplyText('');
  }, []);
  const handleToggleStar = useCallback(
    (messageId: string, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }
      setMessages((prev) =>
      prev.map((msg) =>
      msg.id === messageId ?
      {
        ...msg,
        isStarred: !msg.isStarred
      } :
      msg
      )
      );
    },
    []
  );
  const handleToggleRead = useCallback((messageId: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isRead: !msg.isRead
    } :
    msg
    )
    );
  }, []);
  const handleArchive = useCallback(
    (messageId: string) => {
      setProcessingActions((prev) => [...prev, messageId]);
      setTimeout(() => {
        setMessages((prev) =>
        prev.map((msg) =>
        msg.id === messageId ?
        {
          ...msg,
          isArchived: true
        } :
        msg
        )
        );
        setProcessingActions((prev) => prev.filter((id) => id !== messageId));
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null);
        }
      }, 500);
    },
    [selectedMessageId]
  );
  const handleUnarchive = useCallback((messageId: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isArchived: false
    } :
    msg
    )
    );
  }, []);
  const handleDelete = useCallback(
    (messageId: string) => {
      setProcessingActions((prev) => [...prev, messageId]);
      setTimeout(() => {
        setMessages((prev) =>
        prev.map((msg) =>
        msg.id === messageId ?
        {
          ...msg,
          isDeleted: true
        } :
        msg
        )
        );
        setProcessingActions((prev) => prev.filter((id) => id !== messageId));
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null);
        }
      }, 500);
    },
    [selectedMessageId]
  );
  const handleRestore = useCallback((messageId: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isDeleted: false
    } :
    msg
    )
    );
  }, []);
  const handlePermanentDelete = useCallback(
    (messageId: string) => {
      if (
      window.confirm(
        'Are you sure you want to permanently delete this message? This action cannot be undone.'
      ))
      {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null);
        }
      }
    },
    [selectedMessageId]
  );
  const handleToggleMute = useCallback((messageId: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isMuted: !msg.isMuted
    } :
    msg
    )
    );
  }, []);
  const handleToggleFlag = useCallback((messageId: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isFlagged: !msg.isFlagged
    } :
    msg
    )
    );
  }, []);
  const handleAcknowledge = useCallback(async (messageId: string) => {
    setProcessingActions((prev) => [...prev, `ack-${messageId}`]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      isAcknowledged: true,
      acknowledgedAt: new Date().toISOString()
    } :
    msg
    )
    );
    setProcessingActions((prev) =>
    prev.filter((id) => id !== `ack-${messageId}`)
    );
  }, []);
  const handleSendReply = useCallback(async () => {
    if (!replyText.trim() || !selectedMessageId) return;
    setIsSendingReply(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      message: replyText.trim(),
      sentAt: new Date().toISOString(),
      sentBy: 'Current User',
      attachments: []
    };
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === selectedMessageId ?
    {
      ...msg,
      replyHistory: [...msg.replyHistory, newReply]
    } :
    msg
    )
    );
    setReplyText('');
    setShowReplyForm(false);
    setIsSendingReply(false);
    alert('Reply sent successfully!');
  }, [replyText, selectedMessageId]);
  const handleDownloadAttachment = useCallback(
    async (attachment: Attachment) => {
      setDownloadingAttachments((prev) => [...prev, attachment.id]);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setDownloadingAttachments((prev) =>
      prev.filter((id) => id !== attachment.id)
      );
      if (attachment.type === 'video' || attachment.type === 'link') {
        window.open(attachment.url, '_blank');
      } else {
        alert(`Downloaded: ${attachment.name}`);
      }
    },
    []
  );
  const handleDownloadAllAttachments = useCallback(
    async (attachments: Attachment[]) => {
      const ids = attachments.map((a) => a.id);
      setDownloadingAttachments((prev) => [...prev, ...ids]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDownloadingAttachments((prev) =>
      prev.filter((id) => !ids.includes(id))
      );
      alert(`Downloaded ${attachments.length} file(s)`);
    },
    []
  );
  const handleCopyContent = useCallback(
    async (content: string, type: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
      } catch {
        alert('Failed to copy to clipboard');
      }
    },
    []
  );
  const handlePrintMessage = useCallback((message: Message) => {
    const cssStyles = [
    'body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }',
    'h1 { color: #1a365d; font-size: 24px; margin-bottom: 20px; }',
    '.meta { background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }',
    '.meta p { margin: 5px 0; font-size: 14px; }',
    '.body-content { white-space: pre-wrap; margin: 20px 0; }',
    '.attachments { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; }',
    '.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096; }'].
    join('\n');
    const attachmentsHtml =
    message.attachments.length > 0 ?
    '<div class="attachments"><strong>Attachments (' +
    message.attachments.length +
    '):</strong><ul>' +
    message.attachments.
    map(function (a) {
      return '<li>' + a.name + ' (' + a.size + ')</li>';
    }).
    join('') +
    '</ul></div>' :
    '';
    const printContent = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<title>' + message.subject + '</title>',
    '<style>{`' + cssStyles + '`}</style>',
    '</head>',
    '<body>',
    '<h1>' + message.subject + '</h1>',
    '<div class="meta">',
    '<p><strong>From:</strong> ' +
    message.sender +
    ' (' +
    message.senderEmail +
    ')</p>',
    '<p><strong>Department:</strong> ' + message.senderDepartment + '</p>',
    '<p><strong>Date:</strong> ' +
    message.receivedDate +
    ' at ' +
    message.receivedTime +
    '</p>',
    '<p><strong>Category:</strong> ' + message.category + '</p>',
    '<p><strong>Priority:</strong> ' +
    message.priority.toUpperCase() +
    '</p>',
    '</div>',
    '<div class="body-content">' + message.body + '</div>',
    attachmentsHtml,
    '<div class="footer">',
    '<p>Printed on ' + new Date().toLocaleString() + '</p>',
    '</div>',
    '</body>',
    '</html>'].
    join('\n');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  }, []);
  const handleForwardMessage = useCallback(
    (message: Message) => {
      const content = `
---------- Forwarded Message ----------
From: ${message.sender} <${message.senderEmail}>
Date: ${message.receivedDate} at ${message.receivedTime}
Subject: ${message.subject}

${message.body}
    `.trim();
      handleCopyContent(content, 'forward');
      alert('Message content copied for forwarding!');
    },
    [handleCopyContent]
  );
  // Bulk operations
  const handleSelectMessage = useCallback(
    (messageId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedMessageIds((prev) =>
      prev.includes(messageId) ?
      prev.filter((id) => id !== messageId) :
      [...prev, messageId]
      );
    },
    []
  );
  const handleSelectAll = useCallback(() => {
    const visibleIds = paginatedMessages.map((m) => m.id);
    const allSelected = visibleIds.every((id) =>
    selectedMessageIds.includes(id)
    );
    if (allSelected) {
      setSelectedMessageIds((prev) =>
      prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedMessageIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  }, [paginatedMessages, selectedMessageIds]);
  const handleBulkMarkRead = useCallback(() => {
    setMessages((prev) =>
    prev.map((msg) =>
    selectedMessageIds.includes(msg.id) ?
    {
      ...msg,
      isRead: true
    } :
    msg
    )
    );
    setSelectedMessageIds([]);
  }, [selectedMessageIds]);
  const handleBulkMarkUnread = useCallback(() => {
    setMessages((prev) =>
    prev.map((msg) =>
    selectedMessageIds.includes(msg.id) ?
    {
      ...msg,
      isRead: false
    } :
    msg
    )
    );
    setSelectedMessageIds([]);
  }, [selectedMessageIds]);
  const handleBulkArchive = useCallback(() => {
    setMessages((prev) =>
    prev.map((msg) =>
    selectedMessageIds.includes(msg.id) ?
    {
      ...msg,
      isArchived: true
    } :
    msg
    )
    );
    setSelectedMessageIds([]);
  }, [selectedMessageIds]);
  const handleBulkDelete = useCallback(() => {
    setMessages((prev) =>
    prev.map((msg) =>
    selectedMessageIds.includes(msg.id) ?
    {
      ...msg,
      isDeleted: true
    } :
    msg
    )
    );
    setSelectedMessageIds([]);
  }, [selectedMessageIds]);
  const handleBulkStar = useCallback(() => {
    setMessages((prev) =>
    prev.map((msg) =>
    selectedMessageIds.includes(msg.id) ?
    {
      ...msg,
      isStarred: true
    } :
    msg
    )
    );
    setSelectedMessageIds([]);
  }, [selectedMessageIds]);
  const handleEmptyTrash = useCallback(() => {
    if (
    window.confirm(
      'Are you sure you want to permanently delete all messages in trash?'
    ))
    {
      setMessages((prev) => prev.filter((msg) => !msg.isDeleted));
    }
  }, []);
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setMessages(initialMessagesData);
    setIsRefreshing(false);
  }, []);
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('');
    setPriorityFilter('');
    setReadFilter('');
    setLabelFilter('');
  }, []);
  const handleRemoveLabel = useCallback((messageId: string, label: string) => {
    setMessages((prev) =>
    prev.map((msg) =>
    msg.id === messageId ?
    {
      ...msg,
      labels: msg.labels.filter((l) => l !== label)
    } :
    msg
    )
    );
  }, []);
  const handleFolderChange = useCallback(
    (folder: FolderView) => {
      setFolderView(folder);
      setCurrentPage(1);
      handleCloseMessage();
    },
    [handleCloseMessage]
  );
  // Helper functions for rendering
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      announcement: <MegaphoneIcon className="w-4 h-4" />,
      alert: <AlertTriangleIcon className="w-4 h-4" />,
      maintenance: <WrenchIcon className="w-4 h-4" />,
      feature: <InfoIcon className="w-4 h-4" />,
      security: <ShieldIcon className="w-4 h-4" />,
      support: <HeadphonesIcon className="w-4 h-4" />,
      billing: <FileTextIcon className="w-4 h-4" />,
      newsletter: <MailIcon className="w-4 h-4" />
    };
    return icons[category] || <MailIcon className="w-4 h-4" />;
  };
  const getCategoryBadge = (category: string) => {
    const variants: Record<
      string,
      'danger' | 'warning' | 'info' | 'success' | 'secondary'> =
    {
      alert: 'danger',
      maintenance: 'warning',
      feature: 'success',
      security: 'danger',
      support: 'info',
      billing: 'warning',
      newsletter: 'secondary',
      announcement: 'info'
    };
    return <Badge variant={variants[category] || 'secondary'}>{category}</Badge>;
  };
  const getPriorityBadge = (priority: string) => {
    const variants: Record<
      string,
      'danger' | 'warning' | 'info' | 'secondary'> =
    {
      urgent: 'danger',
      high: 'warning',
      normal: 'info',
      low: 'secondary'
    };
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
  };
  const getAttachmentIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      pdf: <FileTextIcon className="w-4 h-4 text-red-500" />,
      doc: <FileTextIcon className="w-4 h-4 text-blue-500" />,
      excel: <FileIcon className="w-4 h-4 text-green-500" />,
      image: <ImageIcon className="w-4 h-4 text-purple-500" />,
      video: <VideoIcon className="w-4 h-4 text-pink-500" />,
      zip: <FileIcon className="w-4 h-4 text-yellow-500" />
    };
    return icons[type] || <FileIcon className="w-4 h-4 text-gray-500" />;
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Messages
          </h1>
          <p className="text-sm text-gray-500">
            Messages and announcements from ERP Solutions
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span>Total: {stats.total}</span>
            <span className="text-blue-600 font-medium">
              Unread: {stats.unread}
            </span>
            <span>Starred: {stats.starred}</span>
            {stats.requiresAction > 0 &&
            <span className="text-red-600 font-medium">
                Action Required: {stats.requiresAction}
              </span>
            }
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            leftIcon={
            <RefreshCwIcon
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />

            }>

            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {/* Folders */}
          <Card className="p-2">
            <nav className="space-y-1">
              <button
                onClick={() => handleFolderChange('inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${folderView === 'inbox' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>

                <span className="flex items-center gap-2">
                  <InboxIcon className="w-4 h-4" />
                  Inbox
                </span>
                {stats.unread > 0 &&
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.unread}
                  </span>
                }
              </button>
              <button
                onClick={() => handleFolderChange('starred')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${folderView === 'starred' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>

                <span className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4" />
                  Starred
                </span>
                <span className="text-xs text-gray-400">{stats.starred}</span>
              </button>
              <button
                onClick={() => handleFolderChange('archived')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${folderView === 'archived' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>

                <span className="flex items-center gap-2">
                  <ArchiveIcon className="w-4 h-4" />
                  Archived
                </span>
                <span className="text-xs text-gray-400">{stats.archived}</span>
              </button>
              <button
                onClick={() => handleFolderChange('deleted')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${folderView === 'deleted' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>

                <span className="flex items-center gap-2">
                  <Trash2Icon className="w-4 h-4" />
                  Deleted
                </span>
                <span className="text-xs text-gray-400">{stats.deleted}</span>
              </button>
            </nav>
          </Card>

          {/* Categories */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Categories
            </h3>
            <div className="space-y-1">
              {categoryList.map((cat) =>
              <button
                key={cat}
                onClick={() =>
                setCategoryFilter(categoryFilter === cat ? '' : cat)
                }
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${categoryFilter === cat ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}>

                  {getCategoryIcon(cat)}
                  <span className="capitalize">{cat}</span>
                </button>
              )}
            </div>
          </Card>

          {/* Labels */}
          <Card className="p-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Labels
            </h3>
            <div className="flex flex-wrap gap-1">
              {availableLabels.slice(0, 8).map((label) =>
              <button
                key={label}
                onClick={() =>
                setLabelFilter(labelFilter === label ? '' : label)
                }
                className={`text-xs px-2 py-1 rounded transition-colors ${labelFilter === label ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>

                  #{label}
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <Card className="p-4 mb-4">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative flex-1 min-w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                {searchQuery &&
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1">

                    <XIcon className="w-4 h-4 text-gray-400" />
                  </button>
                }
              </div>
              <Select
                value={priorityFilter}
                onChange={(value) => setPriorityFilter(value)}
                options={[
                {
                  value: '',
                  label: 'All Priorities'
                },
                {
                  value: 'urgent',
                  label: 'Urgent'
                },
                {
                  value: 'high',
                  label: 'High'
                },
                {
                  value: 'normal',
                  label: 'Normal'
                },
                {
                  value: 'low',
                  label: 'Low'
                }]
                }
                className="w-36" />

              <Select
                value={readFilter}
                onChange={(value) => setReadFilter(value)}
                options={[
                {
                  value: '',
                  label: 'All Messages'
                },
                {
                  value: 'unread',
                  label: 'Unread'
                },
                {
                  value: 'read',
                  label: 'Read'
                }]
                }
                className="w-36" />

              <Select
                value={sortOrder}
                onChange={(value) => setSortOrder(value as SortOrder)}
                options={[
                {
                  value: 'newest',
                  label: 'Newest First'
                },
                {
                  value: 'oldest',
                  label: 'Oldest First'
                }]
                }
                className="w-36" />

            </div>

            {/* Active Filters */}
            {hasActiveFilters &&
            <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs text-gray-500">Active:</span>
                {searchQuery &&
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
              }
                {categoryFilter &&
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {categoryFilter}
                    <button onClick={() => setCategoryFilter('')}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
              }
                {priorityFilter &&
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {priorityFilter}
                    <button onClick={() => setPriorityFilter('')}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
              }
                {labelFilter &&
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #{labelFilter}
                    <button onClick={() => setLabelFilter('')}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
              }
                <button
                onClick={handleClearFilters}
                className="text-xs text-blue-600 hover:underline">

                  Clear all
                </button>
              </div>
            }
          </Card>

          {/* Bulk Actions */}
          {selectedMessageIds.length > 0 &&
          <Card className="p-3 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {selectedMessageIds.length} message(s) selected
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBulkMarkRead}>

                    Mark Read
                  </Button>
                  <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBulkMarkUnread}>

                    Mark Unread
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleBulkStar}>
                    Star
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleBulkArchive}>
                    Archive
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleBulkDelete}>
                    Delete
                  </Button>
                  <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedMessageIds([])}>

                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          }

          {/* Message Detail or List */}
          {selectedMessage ?
          <Card className="overflow-hidden">
              {/* Detail Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseMessage}
                leftIcon={<ChevronLeftIcon className="w-4 h-4" />}>

                  Back
                </Button>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStar(selectedMessage.id)}
                  leftIcon={
                  <StarIcon
                    className={`w-4 h-4 ${selectedMessage.isStarred ? 'fill-current text-yellow-500' : ''}`} />

                  }>

                    {selectedMessage.isStarred ? 'Starred' : 'Star'}
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRead(selectedMessage.id)}
                  leftIcon={
                  selectedMessage.isRead ?
                  <EyeOffIcon className="w-4 h-4" /> :

                  <EyeIcon className="w-4 h-4" />

                  }>

                    {selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArchive(selectedMessage.id)}
                  leftIcon={<ArchiveIcon className="w-4 h-4" />}>

                    Archive
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrintMessage(selectedMessage)}
                  leftIcon={<PrinterIcon className="w-4 h-4" />}>

                    Print
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  leftIcon={<TrashIcon className="w-4 h-4" />}>

                    Delete
                  </Button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                {/* Subject */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-2">
                      {selectedMessage.isFlagged &&
                    <FlagIcon className="w-4 h-4 text-red-500 fill-current" />
                    }
                      {selectedMessage.isMuted &&
                    <BellOffIcon className="w-4 h-4 text-gray-400" />
                    }
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getCategoryIcon(selectedMessage.category)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedMessage.sender}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMessage.senderEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedMessage.receivedDate} at{' '}
                      {selectedMessage.receivedTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {getCategoryBadge(selectedMessage.category)}
                    {getPriorityBadge(selectedMessage.priority)}
                    {selectedMessage.labels.map((label) =>
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">

                        #{label}
                        <button
                      onClick={() =>
                      handleRemoveLabel(selectedMessage.id, label)
                      }
                      className="hover:text-red-500">

                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                  )}
                  </div>
                </div>

                {/* Acknowledgment Required */}
                {selectedMessage.requiresAcknowledgment &&
              !selectedMessage.isAcknowledged &&
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-800">
                            This message requires acknowledgment
                          </span>
                        </div>
                        <Button
                    size="sm"
                    onClick={() => handleAcknowledge(selectedMessage.id)}
                    disabled={processingActions.includes(
                      `ack-${selectedMessage.id}`
                    )}
                    leftIcon={
                    processingActions.includes(
                      `ack-${selectedMessage.id}`
                    ) ?
                    <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                    <CheckIcon className="w-4 h-4" />

                    }>

                          {processingActions.includes(
                      `ack-${selectedMessage.id}`
                    ) ?
                    'Processing...' :
                    'Acknowledge'}
                        </Button>
                      </div>
                    </div>
              }

                {selectedMessage.isAcknowledged &&
              selectedMessage.acknowledgedAt &&
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCheckIcon className="w-4 h-4" />
                        <span className="text-sm">
                          Acknowledged on{' '}
                          {new Date(
                      selectedMessage.acknowledgedAt
                    ).toLocaleString()}
                        </span>
                      </div>
                    </div>
              }

                {/* Expiry Notice */}
                {selectedMessage.expiresAt &&
              <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">
                        Relevant until:{' '}
                        {new Date(
                      selectedMessage.expiresAt
                    ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
              }

                {/* Body */}
                <div className="mb-6">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedMessage.body}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                  handleCopyContent(selectedMessage.body, 'body')
                  }
                  leftIcon={<CopyIcon className="w-4 h-4" />}>

                    {copiedText === 'body' ? 'Copied!' : 'Copy Content'}
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleForwardMessage(selectedMessage)}
                  leftIcon={<ForwardIcon className="w-4 h-4" />}>

                    {copiedText === 'forward' ? 'Copied!' : 'Forward'}
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFlag(selectedMessage.id)}
                  leftIcon={
                  <FlagIcon
                    className={`w-4 h-4 ${selectedMessage.isFlagged ? 'fill-current text-red-500' : ''}`} />

                  }>

                    {selectedMessage.isFlagged ? 'Flagged' : 'Flag'}
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleMute(selectedMessage.id)}
                  leftIcon={
                  selectedMessage.isMuted ?
                  <BellIcon className="w-4 h-4" /> :

                  <BellOffIcon className="w-4 h-4" />

                  }>

                    {selectedMessage.isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                </div>

                {/* Related Version */}
                {selectedMessage.relatedVersion &&
              <div className="mb-6">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Related Version
                    </span>
                    <p className="mt-1">
                      <Badge variant="info">
                        v{selectedMessage.relatedVersion}
                      </Badge>
                    </p>
                  </div>
              }

                {/* Attachments */}
                {selectedMessage.attachments.length > 0 &&
              <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Attachments ({selectedMessage.attachments.length})
                      </span>
                      {selectedMessage.attachments.length > 1 &&
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                    handleDownloadAllAttachments(
                      selectedMessage.attachments
                    )
                    }
                    leftIcon={<DownloadIcon className="w-4 h-4" />}>

                          Download All
                        </Button>
                  }
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMessage.attachments.map((att) =>
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">

                          <div className="flex items-center gap-3">
                            {getAttachmentIcon(att.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-48">
                                {att.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {att.size}
                              </p>
                            </div>
                          </div>
                          <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadAttachment(att)}
                      disabled={downloadingAttachments.includes(att.id)}>

                            {downloadingAttachments.includes(att.id) ?
                      <RefreshCwIcon className="w-4 h-4 animate-spin" /> :
                      att.type === 'video' || att.type === 'link' ?
                      <ExternalLinkIcon className="w-4 h-4" /> :

                      <DownloadIcon className="w-4 h-4" />
                      }
                          </Button>
                        </div>
                  )}
                    </div>
                  </div>
              }

                {/* Reply History */}
                {selectedMessage.replyHistory.length > 0 &&
              <div className="mb-6">
                    <span className="text-xs font-semibold text-gray-500 uppercase mb-3 block">
                      Conversation ({selectedMessage.replyHistory.length}{' '}
                      replies)
                    </span>
                    <div className="space-y-3">
                      {selectedMessage.replyHistory.map((reply) =>
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${reply.sentBy === 'Current User' ? 'bg-blue-50 border border-blue-200 ml-8' : 'bg-gray-50 border border-gray-200 mr-8'}`}>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {reply.sentBy}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(reply.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                  )}
                    </div>
                  </div>
              }

                {/* Reply Form */}
                <div className="border-t border-gray-200 pt-6">
                  {!showReplyForm ?
                <Button
                  variant="outline"
                  onClick={() => setShowReplyForm(true)}
                  leftIcon={<ReplyIcon className="w-4 h-4" />}>

                      Reply to this message
                    </Button> :

                <div className="space-y-4">
                      <Textarea
                    label="Your Reply"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5} />

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<PaperclipIcon className="w-4 h-4" />}>

                          Attach File
                        </Button>
                        <div className="flex gap-2">
                          <Button
                        variant="outline"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyText('');
                        }}>

                            Cancel
                          </Button>
                          <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSendingReply}
                        leftIcon={
                        isSendingReply ?
                        <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                        <SendIcon className="w-4 h-4" />

                        }>

                            {isSendingReply ? 'Sending...' : 'Send Reply'}
                          </Button>
                        </div>
                      </div>
                    </div>
                }
                </div>
              </div>
            </Card> :

          <Card className="overflow-hidden">
              {/* List Header */}
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                  type="checkbox"
                  checked={
                  paginatedMessages.length > 0 &&
                  paginatedMessages.every((m) =>
                  selectedMessageIds.includes(m.id)
                  )
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300" />

                  <span className="text-sm text-gray-500">
                    {filteredMessages.length} message(s)
                  </span>
                </div>
                {folderView === 'deleted' && stats.deleted > 0 &&
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEmptyTrash}
                className="text-red-600">

                    Empty Trash
                  </Button>
              }
              </div>

              {/* Messages List */}
              {paginatedMessages.length === 0 ?
            <div className="p-12 text-center">
                  <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    No messages found
                  </p>
                  <p className="text-gray-400 text-sm">
                    {hasActiveFilters ?
                'Try adjusting your filters' :
                'Your inbox is empty'}
                  </p>
                </div> :

            <div className="divide-y divide-gray-100">
                  {paginatedMessages.map((message) =>
              <div
                key={message.id}
                onClick={() => handleOpenMessage(message.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50/50' : ''} ${selectedMessageIds.includes(message.id) ? 'bg-blue-100' : ''}`}>

                      <div className="flex items-start gap-3">
                        <input
                    type="checkbox"
                    checked={selectedMessageIds.includes(message.id)}
                    onChange={() => {}}
                    onClick={(e) => handleSelectMessage(message.id, e)}
                    className="mt-1 rounded border-gray-300" />

                        <button
                    onClick={(e) => handleToggleStar(message.id, e)}
                    className="mt-1">

                          <StarIcon
                      className={`w-4 h-4 ${message.isStarred ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />

                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                          className={`text-sm ${!message.isRead ? 'font-semibold' : ''} text-gray-900`}>

                                {message.sender}
                              </span>
                              {getCategoryBadge(message.category)}
                              {message.priority === 'urgent' &&
                        <Badge variant="danger">Urgent</Badge>
                        }
                              {message.requiresAcknowledgment &&
                        !message.isAcknowledged &&
                        <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />
                        }
                              {message.isFlagged &&
                        <FlagIcon className="w-3 h-3 text-red-500 fill-current" />
                        }
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {message.receivedDate}
                            </span>
                          </div>
                          <h3
                      className={`text-sm ${!message.isRead ? 'font-semibold' : ''} text-gray-800 truncate`}>

                            {message.subject}
                          </h3>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.body.substring(0, 120)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {message.attachments.length > 0 &&
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                                <PaperclipIcon className="w-3 h-3" />
                                {message.attachments.length}
                              </span>
                      }
                            {message.replyHistory.length > 0 &&
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                                <ReplyIcon className="w-3 h-3" />
                                {message.replyHistory.length}
                              </span>
                      }
                            {message.labels.slice(0, 3).map((label) =>
                      <span
                        key={label}
                        className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">

                                #{label}
                              </span>
                      )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {folderView === 'deleted' ?
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(message.id);
                      }}>

                              Restore
                            </Button> :
                    folderView === 'archived' ?
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnarchive(message.id);
                      }}>

                              Unarchive
                            </Button> :

                    <>
                              <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(message.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Archive">

                                <ArchiveIcon className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete">

                                <TrashIcon className="w-4 h-4 text-gray-400" />
                              </button>
                            </>
                    }
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }

              {/* Pagination */}
              {totalPages > 1 &&
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  leftIcon={<ChevronLeftIcon className="w-4 h-4" />}>

                      Previous
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  leftIcon={<ChevronRightIcon className="w-4 h-4" />}>

                      Next
                    </Button>
                  </div>
                </div>
            }
            </Card>
          }
        </div>
      </div>
    </div>);

}