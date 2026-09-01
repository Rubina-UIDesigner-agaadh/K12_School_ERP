// src/pages/support-admin/documents/SupportDocument.tsx

import React, { useState, useRef, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  FileTextIcon,
  DownloadIcon,
  SearchIcon,
  UploadIcon,
  ArchiveIcon,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  File,
  FileImage,
  FileVideo,
  Clock,
  User,
  FolderOpen } from
'lucide-react';

interface Document {
  id: string;
  title: string;
  category: string;
  updated: string;
  audience: string;
  size: string;
  description?: string;
  version?: string;
  uploadedBy?: string;
  downloads?: number;
  fileType?: string;
  status: 'active' | 'archived';
  tags?: string[];
}

interface UploadFormData {
  title: string;
  category: string;
  audience: string;
  description: string;
  version: string;
  tags: string;
  file: File | null;
}

const initialDocumentsData: Document[] = [
{
  id: '1',
  title: 'Student Admission Guide v2.1',
  category: 'Student',
  updated: '15-Jan-2025',
  audience: 'Admin',
  size: '2.4 MB',
  description: 'Comprehensive guide for student admission process including online and offline procedures.',
  version: '2.1',
  uploadedBy: 'Support Admin',
  downloads: 145,
  fileType: 'pdf',
  status: 'active',
  tags: ['admission', 'student', 'enrollment']
},
{
  id: '2',
  title: 'Fee Collection Manual',
  category: 'Finance',
  updated: '10-Jan-2025',
  audience: 'Accountant',
  size: '1.8 MB',
  description: 'Step-by-step guide for fee collection, payment tracking, and receipt generation.',
  version: '1.5',
  uploadedBy: 'Finance Team',
  downloads: 89,
  fileType: 'pdf',
  status: 'active',
  tags: ['fees', 'payment', 'collection']
},
{
  id: '3',
  title: 'HR Module User Guide',
  category: 'HR',
  updated: '05-Jan-2025',
  audience: 'HR Admin',
  size: '3.1 MB',
  description: 'Complete documentation for HR module including employee management, payroll, and leave tracking.',
  version: '3.0',
  uploadedBy: 'HR Department',
  downloads: 67,
  fileType: 'pdf',
  status: 'active',
  tags: ['hr', 'payroll', 'employee']
},
{
  id: '4',
  title: 'Assessment Configuration Guide',
  category: 'Assessment',
  updated: '20-Dec-2024',
  audience: 'Admin',
  size: '1.5 MB',
  description: 'Guide for configuring assessments, grading schemes, and report card templates.',
  version: '2.0',
  uploadedBy: 'Academic Team',
  downloads: 112,
  fileType: 'pdf',
  status: 'active',
  tags: ['assessment', 'exam', 'grading']
},
{
  id: '5',
  title: 'Admin Tools Reference',
  category: 'Admin',
  updated: '15-Dec-2024',
  audience: 'System Admin',
  size: '4.2 MB',
  description: 'Technical reference for system administration tools and configurations.',
  version: '4.1',
  uploadedBy: 'Tech Support',
  downloads: 234,
  fileType: 'pdf',
  status: 'active',
  tags: ['admin', 'system', 'configuration']
},
{
  id: '6',
  title: 'Parent Portal FAQ',
  category: 'Portal',
  updated: '10-Dec-2024',
  audience: 'Parent',
  size: '0.5 MB',
  description: 'Frequently asked questions and answers for parent portal users.',
  version: '1.2',
  uploadedBy: 'Support Team',
  downloads: 456,
  fileType: 'pdf',
  status: 'active',
  tags: ['parent', 'portal', 'faq']
},
{
  id: '7',
  title: 'Transport Module Setup',
  category: 'Transport',
  updated: '01-Dec-2024',
  audience: 'Admin',
  size: '1.2 MB',
  description: 'Setup guide for transport management including route planning and vehicle tracking.',
  version: '1.0',
  uploadedBy: 'Operations Team',
  downloads: 78,
  fileType: 'pdf',
  status: 'active',
  tags: ['transport', 'route', 'vehicle']
},
{
  id: '8',
  title: 'Quick Start Guide',
  category: 'General',
  updated: '01-Nov-2024',
  audience: 'All Users',
  size: '0.8 MB',
  description: 'Quick start guide for new users to get started with the ERP system.',
  version: '5.0',
  uploadedBy: 'Documentation Team',
  downloads: 892,
  fileType: 'pdf',
  status: 'active',
  tags: ['quickstart', 'beginner', 'introduction']
}];


const categoryOptions = [
{ value: '', label: 'All Categories' },
{ value: 'Student', label: 'Student' },
{ value: 'Finance', label: 'Finance' },
{ value: 'HR', label: 'HR' },
{ value: 'Admin', label: 'Admin' },
{ value: 'Assessment', label: 'Assessment' },
{ value: 'Portal', label: 'Portal' },
{ value: 'Transport', label: 'Transport' },
{ value: 'General', label: 'General' }];


const audienceOptions = [
{ value: '', label: 'All Audiences' },
{ value: 'Admin', label: 'Admin' },
{ value: 'System Admin', label: 'System Admin' },
{ value: 'HR Admin', label: 'HR Admin' },
{ value: 'Accountant', label: 'Accountant' },
{ value: 'Teacher', label: 'Teacher' },
{ value: 'Parent', label: 'Parent' },
{ value: 'Student', label: 'Student' },
{ value: 'All Users', label: 'All Users' }];


export function SupportDocument() {
  const [documents, setDocuments] = useState<Document[]>(initialDocumentsData);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    title: '',
    category: '',
    audience: '',
    description: '',
    version: '1.0',
    tags: '',
    file: null
  });

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Document>>({});

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Status filter
      if (showArchivedOnly && doc.status !== 'archived') return false;
      if (!showArchivedOnly && doc.status === 'archived') return false;

      // Category filter
      if (categoryFilter && doc.category !== categoryFilter) return false;

      // Audience filter
      if (audienceFilter && doc.audience !== audienceFilter) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesDescription = doc.description?.toLowerCase().includes(query);
        const matchesTags = doc.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      return true;
    });
  }, [documents, categoryFilter, audienceFilter, searchQuery, showArchivedOnly]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.category || !uploadForm.audience || !uploadForm.file) {
      return;
    }

    const newDocument: Document = {
      id: (documents.length + 1).toString(),
      title: uploadForm.title,
      category: uploadForm.category,
      audience: uploadForm.audience,
      description: uploadForm.description,
      version: uploadForm.version,
      updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      size: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: 'Current User',
      downloads: 0,
      fileType: uploadForm.file.name.split('.').pop() || 'unknown',
      status: 'active',
      tags: uploadForm.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag)
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setShowUploadModal(false);
    resetUploadForm();
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      category: '',
      audience: '',
      description: '',
      version: '1.0',
      tags: '',
      file: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle download with progress simulation
  const handleDownload = (doc: Document) => {
    setDownloadingDocId(doc.id);
    setDownloadProgress(0);
    setShowDownloadProgress(true);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowDownloadProgress(false);
            setDownloadingDocId(null);
            // Update download count
            setDocuments((prevDocs) =>
            prevDocs.map((d) =>
            d.id === doc.id ? { ...d, downloads: (d.downloads || 0) + 1 } : d
            )
            );
          }, 500);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);
  };

  // Handle view document
  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  // Handle edit document
  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setEditForm({
      title: doc.title,
      category: doc.category,
      audience: doc.audience,
      description: doc.description,
      version: doc.version,
      tags: doc.tags
    });
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!selectedDocument) return;

    setDocuments((prev) =>
    prev.map((doc) =>
    doc.id === selectedDocument.id ?
    {
      ...doc,
      ...editForm,
      updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } :
    doc
    )
    );
    setShowEditModal(false);
    setSelectedDocument(null);
  };

  // Handle archive
  const handleArchiveClick = (doc: Document) => {
    setSelectedDocument(doc);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    if (!selectedDocument) return;

    setDocuments((prev) =>
    prev.map((doc) =>
    doc.id === selectedDocument.id ?
    { ...doc, status: doc.status === 'active' ? 'archived' : 'active' } :
    doc
    )
    );
    setShowArchiveModal(false);
    setSelectedDocument(null);
  };

  // Handle delete
  const handleDeleteClick = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedDocument) return;

    setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDocument.id));
    setShowDeleteModal(false);
    setSelectedDocument(null);
  };

  // Get file icon based on type
  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileTextIcon className="w-6 h-6 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileTextIcon className="w-6 h-6 text-blue-600" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage className="w-6 h-6 text-green-600" />;
      case 'mp4':
      case 'avi':
        return <FileVideo className="w-6 h-6 text-purple-600" />;
      default:
        return <File className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Documents
          </h1>
          <p className="text-sm text-gray-500">
            Central library of user manuals, FAQs, and guides
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={showArchivedOnly ? 'primary' : 'outline'}
            leftIcon={<ArchiveIcon className="w-4 h-4" />}
            onClick={() => setShowArchivedOnly(!showArchivedOnly)}>

            {showArchivedOnly ? 'Show Active' : 'Show Archived'}
          </Button>
          <Button
            variant="primary"
            leftIcon={<UploadIcon className="w-4 h-4" />}
            onClick={() => setShowUploadModal(true)}>

            Upload Document
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Filter by Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            className="w-48" />

          <Select
            placeholder="Filter by Audience"
            value={audienceFilter}
            onChange={setAudienceFilter}
            options={audienceOptions}
            className="w-48" />

          <div className="flex-1">
            <Input
              placeholder="Search documents by title, description, or tags..."
              leftIcon={<SearchIcon className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          {(categoryFilter || audienceFilter || searchQuery) &&
          <Button
            variant="ghost"
            onClick={() => {
              setCategoryFilter('');
              setAudienceFilter('');
              setSearchQuery('');
            }}>

              Clear Filters
            </Button>
          }
        </div>
      </Card>

      {filteredDocuments.length === 0 ?
      <Card className="p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">
            {showArchivedOnly ?
          'No archived documents match your filters.' :
          'No active documents match your filters.'}
          </p>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            Upload New Document
          </Button>
        </Card> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) =>
        <Card
          key={doc.id}
          className={`hover:shadow-md transition-shadow flex flex-col h-full ${
          doc.status === 'archived' ? 'opacity-75' : ''}`
          }>

              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex gap-2">
                  {doc.status === 'archived' &&
              <Badge variant="secondary">Archived</Badge>
              }
                  <Badge variant="outline">{doc.category}</Badge>
                </div>
              </div>

              <h3
            className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-blue-600"
            onClick={() => handleView(doc)}>

                {doc.title}
              </h3>

              {doc.description &&
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {doc.description}
                </p>
          }

              <div className="space-y-2 text-xs text-gray-500 mb-4 flex-1">
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span className="font-medium text-gray-700">{doc.updated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audience:</span>
                  <span className="font-medium text-gray-700">{doc.audience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium text-gray-700">{doc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="font-medium text-gray-700">{doc.downloads || 0}</span>
                </div>
                {doc.version &&
            <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium text-gray-700">v{doc.version}</span>
                  </div>
            }
              </div>

              {doc.tags && doc.tags.length > 0 &&
          <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.slice(0, 3).map((tag, index) =>
            <span
              key={index}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">

                      {tag}
                    </span>
            )}
                </div>
          }

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                {downloadingDocId === doc.id ?
            <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                  className="h-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${Math.min(downloadProgress, 100)}%` }} />

                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.min(Math.round(downloadProgress), 100)}%
                    </span>
                  </div> :

            <>
                    <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<DownloadIcon className="w-3 h-3" />}
                onClick={() => handleDownload(doc)}>

                      Download
                    </Button>
                    <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={() => handleView(doc)}>

                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={() => handleEdit(doc)}>

                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                variant="ghost"
                size="sm"
                className="px-2 text-gray-400 hover:text-amber-500"
                onClick={() => handleArchiveClick(doc)}>

                      {doc.status === 'archived' ?
                <RefreshCw className="w-4 h-4" /> :

                <ArchiveIcon className="w-4 h-4" />
                }
                    </Button>
                  </>
            }
              </div>
            </Card>
        )}
        </div>
      }

      {/* Upload Document Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Upload New Document</h3>
              <button
              onClick={() => {
                setShowUploadModal(false);
                resetUploadForm();
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium mb-2">Document File *</label>
                <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}>

                  <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />

                  {uploadForm.file ?
                <div className="flex items-center justify-center gap-3">
                      <FileTextIcon className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{uploadForm.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadForm((prev) => ({ ...prev, file: null }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>

                        <X className="w-4 h-4" />
                      </Button>
                    </div> :

                <>
                      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to select a file</p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
                      </p>
                    </>
                }
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Title *</label>
                <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title" />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Select
                  value={uploadForm.category}
                  onChange={(value) => setUploadForm((prev) => ({ ...prev, category: value }))}
                  options={categoryOptions.filter((opt) => opt.value !== '')}
                  placeholder="Select category" />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience *</label>
                  <Select
                  value={uploadForm.audience}
                  onChange={(value) => setUploadForm((prev) => ({ ...prev, audience: value }))}
                  options={audienceOptions.filter((opt) => opt.value !== '')}
                  placeholder="Select audience" />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Version</label>
                <Input
                value={uploadForm.version}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 1.0" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the document"
                rows={3}
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input
                value={uploadForm.tags}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas" />

                <p className="text-xs text-gray-500 mt-1">e.g., admission, student, guide</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={handleUpload}
                disabled={!uploadForm.title || !uploadForm.category || !uploadForm.audience || !uploadForm.file}>

                  Upload Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* View Document Modal */}
      {showViewModal && selectedDocument &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Document Details</h3>
              <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedDocument(null);
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {getFileIcon(selectedDocument.fileType)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedDocument.title}</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{selectedDocument.category}</Badge>
                    {selectedDocument.version &&
                  <Badge variant="secondary">v{selectedDocument.version}</Badge>
                  }
                  </div>
                </div>
              </div>

              {selectedDocument.description &&
            <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p className="text-gray-900">{selectedDocument.description}</p>
                </div>
            }

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Last Updated
                  </label>
                  <p className="text-gray-900">{selectedDocument.updated}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Uploaded By
                  </label>
                  <p className="text-gray-900">{selectedDocument.uploadedBy || 'Unknown'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Target Audience</label>
                  <p className="text-gray-900">{selectedDocument.audience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">File Size</label>
                  <p className="text-gray-900">{selectedDocument.size}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Downloads</label>
                  <p className="text-gray-900">{selectedDocument.downloads || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <Badge variant={selectedDocument.status === 'active' ? 'success' : 'secondary'}>
                    {selectedDocument.status === 'active' ? 'Active' : 'Archived'}
                  </Badge>
                </div>
              </div>

              {selectedDocument.tags && selectedDocument.tags.length > 0 &&
            <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) =>
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">

                        {tag}
                      </span>
                )}
                  </div>
                </div>
            }

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedDocument);
                }}
                leftIcon={<Edit className="w-4 h-4" />}>

                  Edit
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowViewModal(false);
                  handleDownload(selectedDocument);
                }}
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Edit Document Modal */}
      {showEditModal && selectedDocument &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Document</h3>
              <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedDocument(null);
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Document Title *</label>
                <Input
                value={editForm.title || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title" />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Select
                  value={editForm.category || ''}
                  onChange={(value) => setEditForm((prev) => ({ ...prev, category: value }))}
                  options={categoryOptions.filter((opt) => opt.value !== '')}
                  placeholder="Select category" />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience *</label>
                  <Select
                  value={editForm.audience || ''}
                  onChange={(value) => setEditForm((prev) => ({ ...prev, audience: value }))}
                  options={audienceOptions.filter((opt) => opt.value !== '')}
                  placeholder="Select audience" />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Version</label>
                <Input
                value={editForm.version || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 1.0" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the document"
                rows={3}
                className="w-full px-3 py-2 border rounded-md" />

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input
                value={editForm.tags?.join(', ') || ''}
                onChange={(e) => setEditForm((prev) => ({
                  ...prev,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter((t) => t)
                }))}
                placeholder="Enter tags separated by commas" />

              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDocument(null);
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveEdit}>

                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Archive Confirmation Modal */}
      {showArchiveModal && selectedDocument &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {selectedDocument.status === 'active' ? 'Archive Document' : 'Restore Document'}
              </h3>
              <button
              onClick={() => {
                setShowArchiveModal(false);
                setSelectedDocument(null);
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    {selectedDocument.status === 'active' ?
                  'This document will be archived' :
                  'This document will be restored'}
                  </p>
                  <p className="text-sm text-amber-700">
                    {selectedDocument.status === 'active' ?
                  'Users will no longer see this document in the active list.' :
                  'The document will be visible to users again.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedDocument.title}</p>
                <p className="text-sm text-gray-500">{selectedDocument.category} • {selectedDocument.audience}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedDocument(null);
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={confirmArchive}>

                  {selectedDocument.status === 'active' ? 'Archive' : 'Restore'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDocument &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-600">Delete Document</h3>
              <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedDocument(null);
              }}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-red-700">
                    The document will be permanently deleted from the system.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedDocument.title}</p>
                <p className="text-sm text-gray-500">{selectedDocument.category} • {selectedDocument.audience}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDocument(null);
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}>

                  Delete Permanently
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}