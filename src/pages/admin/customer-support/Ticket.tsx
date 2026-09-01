import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  RefreshCwIcon,
  XIcon,
  UploadIcon,
  FileIcon,
  SendIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  FileTextIcon,
  FileSpreadsheetIcon } from
'lucide-react';

// ==================== TYPES ====================
interface CommentType {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface TicketType {
  id: string;
  subject: string;
  category: 'Bug' | 'Query' | 'Enhancement';
  module: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reporter: string;
  updated: string;
  createdAt: string;
  description: string;
  assignedTo: string;
  attachments: string[];
  comments: CommentType[];
}

interface TicketFormData {
  subject: string;
  category: 'Bug' | 'Query' | 'Enhancement';
  module: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  attachments: File[];
}

// ==================== MOCK DATA ====================
const initialTicketsData: TicketType[] = [
{
  id: 'TKT-1001',
  subject: 'Fee receipt generation error',
  category: 'Bug',
  module: 'Finance',
  priority: 'High',
  status: 'Open',
  reporter: 'Accountant',
  updated: '2 hours ago',
  createdAt: '2024-01-15T10:30:00',
  description:
  'When generating fee receipts for Class 10 students, the system shows an error message "Unable to generate receipt". This happens for all students in that class.',
  assignedTo: 'Tech Support Team',
  attachments: ['screenshot1.png', 'error_log.txt'],
  comments: [
  {
    id: 'CMT-001',
    author: 'Tech Support',
    content:
    'We are looking into this issue. Can you please provide the exact time when this occurred?',
    timestamp: '2024-01-15T11:00:00'
  },
  {
    id: 'CMT-002',
    author: 'Accountant',
    content:
    'It happened around 10:15 AM today while processing fee for student ID STU-2024-001',
    timestamp: '2024-01-15T11:30:00'
  }]

},
{
  id: 'TKT-1002',
  subject: 'How to promote students?',
  category: 'Query',
  module: 'Student',
  priority: 'Medium',
  status: 'Resolved',
  reporter: 'Admin',
  updated: '1 day ago',
  createdAt: '2024-01-14T09:00:00',
  description:
  'I need guidance on how to promote students from one class to another at the end of the academic year. Please provide step-by-step instructions.',
  assignedTo: 'Support Team',
  attachments: [],
  comments: [
  {
    id: 'CMT-003',
    author: 'Support Team',
    content:
    'Go to Student Management > Promotions > Select Academic Year > Choose Class > Select Students > Click Promote',
    timestamp: '2024-01-14T10:00:00'
  }]

},
{
  id: 'TKT-1003',
  subject: 'Add new report card format',
  category: 'Enhancement',
  module: 'Assessment',
  priority: 'Low',
  status: 'In Progress',
  reporter: 'Principal',
  updated: '3 hours ago',
  createdAt: '2024-01-13T14:00:00',
  description:
  'We would like to add a new report card format that includes skill-based assessment for primary classes. The format should include behavioral skills, learning skills, and co-curricular activities.',
  assignedTo: 'Development Team',
  attachments: ['report_card_format.pdf', 'sample_design.docx'],
  comments: [
  {
    id: 'CMT-004',
    author: 'Development Team',
    content:
    'We have started working on this. Expected completion in 2 weeks.',
    timestamp: '2024-01-14T09:00:00'
  }]

},
{
  id: 'TKT-1004',
  subject: 'Login issue for new staff',
  category: 'Bug',
  module: 'Security',
  priority: 'Critical',
  status: 'Open',
  reporter: 'Admin',
  updated: '10 mins ago',
  createdAt: '2024-01-15T14:00:00',
  description:
  'Newly created staff accounts are unable to login. They receive "Invalid credentials" error even though the credentials are correct. This is affecting 15 new staff members.',
  assignedTo: 'Security Team',
  attachments: ['staff_list.xlsx'],
  comments: []
},
{
  id: 'TKT-1005',
  subject: 'Transport route update',
  category: 'Query',
  module: 'Transport',
  priority: 'Medium',
  status: 'Closed',
  reporter: 'Transport Mgr',
  updated: '2 days ago',
  createdAt: '2024-01-12T08:00:00',
  description:
  'Need to update the route for Bus #5. The new route should include 3 additional stops in the Greenwood area.',
  assignedTo: 'Transport Module Team',
  attachments: ['new_route_map.pdf'],
  comments: [
  {
    id: 'CMT-005',
    author: 'Transport Module Team',
    content: 'Route has been updated successfully. Please verify.',
    timestamp: '2024-01-12T16:00:00'
  },
  {
    id: 'CMT-006',
    author: 'Transport Mgr',
    content: 'Verified and working correctly. Thank you!',
    timestamp: '2024-01-12T17:00:00'
  }]

},
{
  id: 'TKT-1006',
  subject: 'Library fine calculation',
  category: 'Bug',
  module: 'Library',
  priority: 'High',
  status: 'In Progress',
  reporter: 'Librarian',
  updated: '5 hours ago',
  createdAt: '2024-01-14T11:00:00',
  description:
  'The library fine calculation is incorrect. It should be Rs. 2 per day but the system is calculating Rs. 5 per day. This is causing confusion among students.',
  assignedTo: 'Library Module Team',
  attachments: ['fine_calculation_screenshot.png'],
  comments: [
  {
    id: 'CMT-007',
    author: 'Library Module Team',
    content:
    'We found the issue. The fine rate was incorrectly set in the configuration. Fixing now.',
    timestamp: '2024-01-15T09:00:00'
  }]

},
{
  id: 'TKT-1007',
  subject: 'SMS not delivering',
  category: 'Bug',
  module: 'Communication',
  priority: 'Critical',
  status: 'Resolved',
  reporter: 'Admin',
  updated: '1 day ago',
  createdAt: '2024-01-13T10:00:00',
  description:
  'SMS notifications are not being delivered to parents. The system shows "Sent" but parents are not receiving any messages. This has been happening since yesterday.',
  assignedTo: 'Communication Team',
  attachments: ['sms_log.txt'],
  comments: [
  {
    id: 'CMT-008',
    author: 'Communication Team',
    content:
    'The SMS gateway had an issue. We have switched to the backup gateway and all pending messages have been delivered.',
    timestamp: '2024-01-14T08:00:00'
  }]

},
{
  id: 'TKT-1008',
  subject: 'Add parent occupation field',
  category: 'Enhancement',
  module: 'Student',
  priority: 'Low',
  status: 'Open',
  reporter: 'Admin',
  updated: '1 hour ago',
  createdAt: '2024-01-15T08:00:00',
  description:
  'Please add a field for parent occupation in the student registration form. This is required for our annual student demographic report.',
  assignedTo: 'Unassigned',
  attachments: [],
  comments: []
},
{
  id: 'TKT-1009',
  subject: 'Attendance report not showing correct data',
  category: 'Bug',
  module: 'Attendance',
  priority: 'High',
  status: 'Open',
  reporter: 'Class Teacher',
  updated: '30 mins ago',
  createdAt: '2024-01-15T13:00:00',
  description:
  'The monthly attendance report is showing incorrect percentages for students. Some students who have 100% attendance are showing as 85%.',
  assignedTo: 'Attendance Module Team',
  attachments: ['attendance_report.pdf', 'student_records.xlsx'],
  comments: []
},
{
  id: 'TKT-1010',
  subject: 'Request for bulk student import feature',
  category: 'Enhancement',
  module: 'Student',
  priority: 'Medium',
  status: 'Open',
  reporter: 'Data Entry Operator',
  updated: '4 hours ago',
  createdAt: '2024-01-15T09:00:00',
  description:
  'Currently we have to add students one by one. Please add a feature to import multiple students from an Excel file with all their details.',
  assignedTo: 'Development Team',
  attachments: ['sample_import_format.xlsx'],
  comments: [
  {
    id: 'CMT-009',
    author: 'Development Team',
    content: 'This is a great suggestion. We will add this to our roadmap.',
    timestamp: '2024-01-15T10:00:00'
  }]

}];


const moduleOptions = [
{ value: 'Finance', label: 'Finance' },
{ value: 'Student', label: 'Student' },
{ value: 'Assessment', label: 'Assessment' },
{ value: 'Security', label: 'Security' },
{ value: 'Transport', label: 'Transport' },
{ value: 'Library', label: 'Library' },
{ value: 'Communication', label: 'Communication' },
{ value: 'HR', label: 'Human Resources' },
{ value: 'Attendance', label: 'Attendance' },
{ value: 'Timetable', label: 'Timetable' },
{ value: 'Examination', label: 'Examination' },
{ value: 'Reports', label: 'Reports' }];


const categoryOptions = [
{ value: 'Bug', label: 'Bug' },
{ value: 'Query', label: 'Query' },
{ value: 'Enhancement', label: 'Enhancement' }];


const priorityOptions = [
{ value: 'Critical', label: 'Critical' },
{ value: 'High', label: 'High' },
{ value: 'Medium', label: 'Medium' },
{ value: 'Low', label: 'Low' }];


const statusOptions = [
{ value: 'Open', label: 'Open' },
{ value: 'In Progress', label: 'In Progress' },
{ value: 'Resolved', label: 'Resolved' },
{ value: 'Closed', label: 'Closed' }];


// ==================== CREATE TICKET MODAL ====================
interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: TicketType) => void;
  editTicket?: TicketType | null;
}

function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  editTicket
}: CreateTicketModalProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    category: 'Bug',
    module: '',
    priority: 'Medium',
    description: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  useEffect(() => {
    if (editTicket) {
      setFormData({
        subject: editTicket.subject,
        category: editTicket.category,
        module: editTicket.module,
        priority: editTicket.priority,
        description: editTicket.description,
        attachments: []
      });
      setAttachmentNames(editTicket.attachments);
    } else {
      setFormData({
        subject: '',
        category: 'Bug',
        module: '',
        priority: 'Medium',
        description: '',
        attachments: []
      });
      setAttachmentNames([]);
    }
    setErrors({});
  }, [editTicket, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 10) {
      newErrors.subject = 'Subject must be at least 10 characters';
    }

    if (!formData.module) {
      newErrors.module = 'Module is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const ticketId =
    editTicket?.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: TicketType = {
      id: ticketId,
      subject: formData.subject,
      category: formData.category,
      module: formData.module,
      priority: formData.priority,
      status: editTicket?.status || 'Open',
      reporter: editTicket?.reporter || 'Current User',
      updated: 'Just now',
      createdAt: editTicket?.createdAt || now,
      description: formData.description,
      assignedTo: editTicket?.assignedTo || 'Unassigned',
      attachments: attachmentNames,
      comments: editTicket?.comments || []
    };

    onSubmit(newTicket);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      category: 'Bug',
      module: '',
      priority: 'Medium',
      description: '',
      attachments: []
    });
    setErrors({});
    setAttachmentNames([]);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFileNames = Array.from(files).map((file) => file.name);
      setAttachmentNames([...attachmentNames, ...newFileNames]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachmentNames.filter((_, i) => i !== index);
    setAttachmentNames(newAttachments);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={handleClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editTicket ? 'Edit Ticket' : 'Create New Ticket'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded">

              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <Input
                value={formData.subject}
                onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Brief description of the issue"
                className={errors.subject ? 'border-red-500' : ''} />

              {errors.subject &&
              <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              }
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as TicketFormData['category']
                  })
                  }
                  options={categoryOptions}
                  placeholder="Select category" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module *
                </label>
                <Select
                  value={formData.module}
                  onChange={(value) =>
                  setFormData({ ...formData, module: value })
                  }
                  options={moduleOptions}
                  placeholder="Select module"
                  className={errors.module ? 'border-red-500' : ''} />

                {errors.module &&
                <p className="text-red-500 text-xs mt-1">{errors.module}</p>
                }
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <Select
                value={formData.priority}
                onChange={(value) =>
                setFormData({
                  ...formData,
                  priority: value as TicketFormData['priority']
                })
                }
                options={priorityOptions}
                placeholder="Select priority" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide detailed description of your issue or request..."
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'}`
                } />

              {errors.description &&
              <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              }
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.xlsx,.xls" />

                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer">

                  <UploadIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Click to upload files
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, DOC, PNG, JPG, TXT, XLSX (Max 10MB each)
                  </span>
                </label>
              </div>

              {attachmentNames.length > 0 &&
              <div className="mt-3 space-y-2">
                  {attachmentNames.map((name, index) =>
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">

                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{name}</span>
                      </div>
                      <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700">

                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                )}
                </div>
              }
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editTicket ? 'Update Ticket' : 'Create Ticket'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>);

}

// ==================== TICKET DETAIL MODAL ====================
interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketType | null;
  onUpdate: (ticket: TicketType) => void;
  onDelete: (ticketId: string) => void;
  onEdit: (ticket: TicketType) => void;
}

function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
  onUpdate,
  onDelete,
  onEdit
}: TicketDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [localTicket, setLocalTicket] = useState<TicketType | null>(ticket);

  useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  if (!isOpen || !localTicket) return null;

  const handleStatusChange = (newStatus: string) => {
    const updatedTicket = {
      ...localTicket,
      status: newStatus as TicketType['status'],
      updated: 'Just now'
    };
    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  const handlePriorityChange = (newPriority: string) => {
    const updatedTicket = {
      ...localTicket,
      priority: newPriority as TicketType['priority'],
      updated: 'Just now'
    };
    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: CommentType = {
      id: `CMT-${Date.now()}`,
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...localTicket,
      comments: [...localTicket.comments, comment],
      updated: 'Just now'
    };

    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedTicket = {
      ...localTicket,
      comments: localTicket.comments.filter((c) => c.id !== commentId),
      updated: 'Just now'
    };
    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  const handleDeleteTicket = () => {
    if (
    window.confirm(
      'Are you sure you want to delete this ticket? This action cannot be undone.'
    ))
    {
      onDelete(localTicket.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === 'Critical' || priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'info';
  };

  const getStatusVariant = (status: string) => {
    if (status === 'Open') return 'danger';
    if (status === 'Resolved' || status === 'Closed') return 'success';
    return 'warning';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {localTicket.id}
              </span>
              <Badge variant={getStatusVariant(localTicket.status) as any}>
                {localTicket.status}
              </Badge>
              <Badge variant={getPriorityVariant(localTicket.priority) as any}>
                {localTicket.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(localTicket)}
                leftIcon={<EditIcon className="w-4 h-4" />}>

                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteTicket}
                leftIcon={<TrashIcon className="w-4 h-4" />}
                className="text-red-600 border-red-300 hover:bg-red-50">

                Delete
              </Button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded">

                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-xl font-semibold mb-4">
                {localTicket.subject}
              </h2>

              <div className="prose max-w-none mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {localTicket.description}
                </p>
              </div>

              {localTicket.attachments.length > 0 &&
              <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {localTicket.attachments.map((attachment, index) =>
                  <a
                    key={index}
                    href="#"
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading: ${attachment}`);
                    }}>

                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{attachment}</span>
                      </a>
                  )}
                  </div>
                </div>
              }

              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Comments ({localTicket.comments.length})
                </h4>

                <div className="space-y-4 mb-4">
                  {localTicket.comments.length === 0 ?
                  <p className="text-gray-500 text-sm">No comments yet</p> :

                  localTicket.comments.map((comment) =>
                  <div
                    key={comment.id}
                    className="bg-gray-50 rounded-lg p-4">

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {comment.author.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium text-sm">
                                {comment.author}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDate(comment.timestamp)}
                              </span>
                            </div>
                          </div>
                          {comment.author === 'Current User' &&
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700">

                              <TrashIcon className="w-4 h-4" />
                            </button>
                      }
                        </div>
                        <p className="text-gray-700 text-sm ml-10">
                          {comment.content}
                        </p>
                      </div>
                  )
                  }
                </div>

                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  <Button
                    variant="primary"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    leftIcon={<SendIcon className="w-4 h-4" />}>

                    Send
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-72 border-l bg-gray-50 p-4 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Ticket Details
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <AlertCircleIcon className="w-3 h-3" />
                    Status
                  </label>
                  <Select
                    value={localTicket.status}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    className="w-full" />

                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <TagIcon className="w-3 h-3" />
                    Priority
                  </label>
                  <Select
                    value={localTicket.priority}
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                    className="w-full" />

                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <TagIcon className="w-3 h-3" />
                    Category
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {localTicket.category}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <TagIcon className="w-3 h-3" />
                    Module
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {localTicket.module}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <UserIcon className="w-3 h-3" />
                    Reporter
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {localTicket.reporter}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <UserIcon className="w-3 h-3" />
                    Assigned To
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {localTicket.assignedTo}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <ClockIcon className="w-3 h-3" />
                    Created
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {formatDate(localTicket.createdAt)}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <ClockIcon className="w-3 h-3" />
                    Last Updated
                  </label>
                  <div className="bg-white border rounded px-3 py-2 text-sm">
                    {localTicket.updated}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== DELETE CONFIRM MODAL ====================
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketId: string;
  ticketSubject: string;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  ticketId,
  ticketSubject
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5" />
              Delete Ticket
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded">

              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this ticket? This action cannot be
              undone.
            </p>
            <div className="bg-gray-50 p-3 rounded mb-4">
              <p className="font-mono text-sm text-gray-500">{ticketId}</p>
              <p className="font-medium">{ticketSubject}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700">

              Delete Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== EXPORT MODAL ====================
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: TicketType[];
}

function ExportModal({ isOpen, onClose, tickets }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>(
    'csv'
  );
  const [includeComments, setIncludeComments] = useState(false);
  const [includeDescription, setIncludeDescription] = useState(true);

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    const exportData = tickets.map((ticket) => {
      const base: Record<string, string> = {
        'Ticket ID': ticket.id,
        Subject: ticket.subject,
        Category: ticket.category,
        Module: ticket.module,
        Priority: ticket.priority,
        Status: ticket.status,
        Reporter: ticket.reporter,
        'Assigned To': ticket.assignedTo,
        'Created At': ticket.createdAt,
        'Last Updated': ticket.updated
      };

      if (includeDescription) {
        base['Description'] = ticket.description;
      }

      if (includeComments) {
        base['Comments'] = ticket.comments.
        map((c) => `${c.author}: ${c.content}`).
        join(' | ');
      }

      return base;
    });

    switch (exportFormat) {
      case 'csv':
        if (exportData.length > 0) {
          const headers = Object.keys(exportData[0]);
          const csvRows = [
          headers.join(','),
          ...exportData.map((row) =>
          headers.
          map((header) => {
            const value = row[header] || '';
            return `"${String(value).replace(/"/g, '""')}"`;
          }).
          join(',')
          )];

          content = csvRows.join('\n');
        }
        filename = `tickets_export_${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;

      case 'json':
        content = JSON.stringify(exportData, null, 2);
        filename = `tickets_export_${Date.now()}.json`;
        mimeType = 'application/json';
        break;

      case 'pdf':
        alert(
          'PDF export would be generated here. In a real implementation, you would use a library like jsPDF or html2pdf.'
        );
        onClose();
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Export Tickets</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded">

              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                  exportFormat === 'csv' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-300 hover:bg-gray-50'}`
                  }>

                  <FileSpreadsheetIcon
                    className={`w-8 h-8 ${
                    exportFormat === 'csv' ? 'text-blue-500' : 'text-gray-400'}`
                    } />

                  <span className="text-sm mt-2">CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                  exportFormat === 'json' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-300 hover:bg-gray-50'}`
                  }>

                  <FileIcon
                    className={`w-8 h-8 ${
                    exportFormat === 'json' ?
                    'text-blue-500' :
                    'text-gray-400'}`
                    } />

                  <span className="text-sm mt-2">JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('pdf')}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                  exportFormat === 'pdf' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-300 hover:bg-gray-50'}`
                  }>

                  <FileTextIcon
                    className={`w-8 h-8 ${
                    exportFormat === 'pdf' ? 'text-blue-500' : 'text-gray-400'}`
                    } />

                  <span className="text-sm mt-2">PDF</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include in Export
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeDescription}
                    onChange={(e) => setIncludeDescription(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="ml-2 text-sm text-gray-600">
                    Include description
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeComments}
                    onChange={(e) => setIncludeComments(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="ml-2 text-sm text-gray-600">
                    Include comments
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                <strong>{tickets.length}</strong> tickets will be exported
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== MAIN TICKET COMPONENT ====================
export function Ticket() {
  const [tickets, setTickets] = useState<TicketType[]>(initialTicketsData);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<TicketType | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
      !statusFilter ||
      statusFilter === 'all' ||
      ticket.status.toLowerCase().replace(' ', '') ===
      statusFilter.toLowerCase().replace(' ', '');

      const matchesPriority =
      !priorityFilter ||
      priorityFilter === 'all' ||
      ticket.priority.toLowerCase() === priorityFilter.toLowerCase();

      const matchesCategory =
      !categoryFilter ||
      categoryFilter === 'all' ||
      ticket.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesModule =
      !moduleFilter ||
      moduleFilter === 'all' ||
      ticket.module.toLowerCase() === moduleFilter.toLowerCase();

      const matchesSearch =
      !searchQuery ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.reporter.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesModule &&
        matchesSearch);

    });
  }, [
  tickets,
  statusFilter,
  priorityFilter,
  categoryFilter,
  moduleFilter,
  searchQuery]
  );

  const kpiData = useMemo(() => {
    const openCount = tickets.filter((t) => t.status === 'Open').length;
    const inProgressCount = tickets.filter(
      (t) => t.status === 'In Progress'
    ).length;
    const resolvedThisWeek = tickets.filter(
      (t) => t.status === 'Resolved'
    ).length;
    const avgResolutionTime = '2.3 days';

    return { openCount, inProgressCount, resolvedThisWeek, avgResolutionTime };
  }, [tickets]);

  const handleCreateTicket = useCallback(
    (newTicket: TicketType) => {
      if (editingTicket) {
        setTickets((prev) =>
        prev.map((t) => t.id === newTicket.id ? newTicket : t)
        );
        setEditingTicket(null);
      } else {
        setTickets((prev) => [newTicket, ...prev]);
      }
    },
    [editingTicket]
  );

  const handleUpdateTicket = useCallback((updatedTicket: TicketType) => {
    setTickets((prev) =>
    prev.map((t) => t.id === updatedTicket.id ? updatedTicket : t)
    );
  }, []);

  const handleDeleteTicket = useCallback((ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setTicketToDelete(null);
  }, []);

  const handleViewTicket = useCallback((ticket: TicketType) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  }, []);

  const handleEditTicket = useCallback((ticket: TicketType) => {
    setEditingTicket(ticket);
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((ticket: TicketType) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setTickets(initialTicketsData);
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setModuleFilter('');
    setSearchQuery('');
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setModuleFilter('');
    setSearchQuery('');
  }, []);

  const hasActiveFilters =
  statusFilter ||
  priorityFilter ||
  categoryFilter ||
  moduleFilter ||
  searchQuery;

  const columns = [
  {
    key: 'id',
    header: 'Ticket ID',
    render: (row: TicketType) =>
    <span className="font-mono text-xs font-medium">{row.id}</span>

  },
  {
    key: 'subject',
    header: 'Subject',
    render: (row: TicketType) =>
    <span
      className="font-medium text-blue-600 hover:underline cursor-pointer"
      onClick={() => handleViewTicket(row)}>

          {row.subject}
        </span>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: TicketType) =>
    <Badge variant="outline">{row.category}</Badge>

  },
  {
    key: 'module',
    header: 'Module'
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row: TicketType) =>
    <Badge
      variant={
      row.priority === 'Critical' || row.priority === 'High' ?
      'danger' :
      row.priority === 'Medium' ?
      'warning' :
      'info'
      }>

          {row.priority}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: TicketType) =>
    <Badge
      variant={
      row.status === 'Open' ?
      'danger' :
      row.status === 'Resolved' || row.status === 'Closed' ?
      'success' :
      'warning'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'reporter',
    header: 'Reporter',
    render: (row: TicketType) =>
    <span className="text-sm text-gray-600">{row.reporter}</span>

  },
  {
    key: 'updated',
    header: 'Last Updated',
    render: (row: TicketType) =>
    <span className="text-xs text-gray-500">{row.updated}</span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: TicketType) =>
    <div className="flex items-center gap-2">
          <button
        onClick={() => handleViewTicket(row)}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        title="View Details">

            <EyeIcon className="w-4 h-4" />
          </button>
          <button
        onClick={() => handleEditTicket(row)}
        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
        title="Edit Ticket">

            <EditIcon className="w-4 h-4" />
          </button>
          <button
        onClick={() => handleDeleteClick(row)}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="Delete Ticket">

            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

  }];


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500">
            Report issues, request enhancements, and track resolutions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingTicket(null);
              setIsCreateModalOpen(true);
            }}
            leftIcon={<PlusIcon className="w-4 h-4" />}>

            Create New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-red-50 border-red-100">
          <p className="text-sm text-red-600 font-medium">Open Tickets</p>
          <p className="text-2xl font-bold text-red-700">{kpiData.openCount}</p>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">
            {kpiData.inProgressCount}
          </p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <p className="text-sm text-green-600 font-medium">
            Resolved This Week
          </p>
          <p className="text-2xl font-bold text-green-700">
            {kpiData.resolvedThisWeek}
          </p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-sm text-blue-600 font-medium">
            Avg Resolution Time
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {kpiData.avgResolutionTime}
          </p>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-4 flex-wrap flex-1">
              <Select
                placeholder="Filter Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'inprogress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }]
                }
                className="w-40" />

              <Select
                placeholder="Filter Priority"
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={[
                { value: 'all', label: 'All Priority' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }]
                }
                className="w-40" />

              <Select
                placeholder="Filter Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                { value: 'all', label: 'All Categories' },
                { value: 'bug', label: 'Bug' },
                { value: 'query', label: 'Query' },
                { value: 'enhancement', label: 'Enhancement' }]
                }
                className="w-40" />

              <Select
                placeholder="Filter Module"
                value={moduleFilter}
                onChange={setModuleFilter}
                options={[
                { value: 'all', label: 'All Modules' },
                { value: 'finance', label: 'Finance' },
                { value: 'student', label: 'Student' },
                { value: 'assessment', label: 'Assessment' },
                { value: 'security', label: 'Security' },
                { value: 'transport', label: 'Transport' },
                { value: 'library', label: 'Library' },
                { value: 'communication', label: 'Communication' },
                { value: 'attendance', label: 'Attendance' }]
                }
                className="w-40" />

              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                leftIcon={<SearchIcon className="w-4 h-4" />} />

            </div>
            <div className="flex gap-2">
              {hasActiveFilters &&
              <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              }
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export List
              </Button>
            </div>
          </div>
          {hasActiveFilters &&
          <div className="text-sm text-gray-500">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          }
        </div>
        <Table columns={columns} data={filteredTickets} />
        {filteredTickets.length === 0 &&
        <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm mt-1">
              {hasActiveFilters ?
            'Try adjusting your filters or search query' :
            'Create a new ticket to get started'}
            </p>
            {hasActiveFilters &&
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="mt-4">

                Clear All Filters
              </Button>
          }
          </div>
        }
      </Card>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTicket(null);
        }}
        onSubmit={handleCreateTicket}
        editTicket={editingTicket} />


      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onUpdate={handleUpdateTicket}
        onDelete={handleDeleteTicket}
        onEdit={handleEditTicket} />


      {ticketToDelete &&
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={() => handleDeleteTicket(ticketToDelete.id)}
        ticketId={ticketToDelete.id}
        ticketSubject={ticketToDelete.subject} />

      }

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tickets={filteredTickets} />

    </div>);

}