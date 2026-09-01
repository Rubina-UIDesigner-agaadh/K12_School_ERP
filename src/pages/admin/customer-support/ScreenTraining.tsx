import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  VideoIcon,
  FileTextIcon,
  UsersIcon,
  CalendarIcon,
  PlayIcon,
  DownloadIcon,
  CheckCircleIcon,
  XIcon,
  SearchIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  AwardIcon,
  FilterIcon,
  ExternalLinkIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  ShareIcon,
  BookmarkIcon,
  RefreshCwIcon } from
'lucide-react';

// ==================== TYPES ====================
interface UpcomingTraining {
  id: string;
  title: string;
  module: string;
  type: 'Video' | 'Webinar' | 'On-site';
  date: string;
  duration: string;
  trainer: string;
  audience: string;
  description: string;
  prerequisites: string[];
  maxParticipants?: number;
  currentParticipants?: number;
  isRegistered: boolean;
  meetingLink?: string;
  location?: string;
}

interface PastTraining {
  id: string;
  title: string;
  module: string;
  type: 'Video' | 'Webinar' | 'On-site';
  date: string;
  recording: boolean;
  recordingUrl?: string;
  status: 'Completed' | 'Missed' | 'In Progress';
  progress?: number;
  rating?: number;
  certificate?: boolean;
  notes?: string;
  duration: string;
}

interface TrainingMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LINK';
  module: string;
  size: string;
  downloadUrl: string;
  description: string;
  uploadedDate: string;
  downloadCount: number;
  isBookmarked: boolean;
}

interface TrainingFeedback {
  id: string;
  odule: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface Certificate {
  id: string;
  trainingId: string;
  trainingTitle: string;
  completedDate: string;
  certificateUrl: string;
  validUntil?: string;
}

// ==================== MOCK DATA ====================
const initialUpcomingTrainingData: UpcomingTraining[] = [
{
  id: '1',
  title: 'Fee Receipt Module Training',
  module: 'Finance',
  type: 'Webinar',
  date: '15-Feb-2025 10:00 AM',
  duration: '1h',
  trainer: 'Sarah Johnson',
  audience: 'Accountants',
  description: 'Learn how to generate, customize, and manage fee receipts efficiently. This training covers receipt templates, bulk generation, and troubleshooting common issues.',
  prerequisites: ['Basic Finance Module Knowledge', 'Active System Account'],
  maxParticipants: 50,
  currentParticipants: 32,
  isRegistered: false,
  meetingLink: 'https://meet.example.com/fee-training'
},
{
  id: '2',
  title: 'New Assessment Features',
  module: 'Assessment',
  type: 'Video',
  date: 'Available Now',
  duration: '15m',
  trainer: 'System',
  audience: 'Teachers',
  description: 'Explore the latest assessment features including rubric-based grading, automated score calculation, and report card integration.',
  prerequisites: [],
  isRegistered: false
},
{
  id: '3',
  title: 'Admin Tools Overview',
  module: 'Admin',
  type: 'On-site',
  date: '01-Mar-2025 09:00 AM',
  duration: '4h',
  trainer: 'Rahul Mehta',
  audience: 'Admins',
  description: 'Comprehensive training on administrative tools including user management, role permissions, system configuration, and security settings.',
  prerequisites: ['Admin Access', 'Completed Basic Training'],
  maxParticipants: 20,
  currentParticipants: 15,
  isRegistered: true,
  location: 'Training Room A, Main Campus'
},
{
  id: '4',
  title: 'Student Enrollment Workflow',
  module: 'Student',
  type: 'Webinar',
  date: '20-Feb-2025 02:00 PM',
  duration: '1.5h',
  trainer: 'Priya Sharma',
  audience: 'Admission Staff',
  description: 'Master the complete student enrollment process from inquiry to admission confirmation, including document verification and fee collection.',
  prerequisites: ['Student Module Access'],
  maxParticipants: 40,
  currentParticipants: 28,
  isRegistered: false,
  meetingLink: 'https://meet.example.com/enrollment-training'
},
{
  id: '5',
  title: 'Library System Deep Dive',
  module: 'Library',
  type: 'Video',
  date: 'Available Now',
  duration: '25m',
  trainer: 'System',
  audience: 'Librarians',
  description: 'Complete guide to library management including cataloging, circulation, fine management, and inventory reports.',
  prerequisites: [],
  isRegistered: false
},
{
  id: '6',
  title: 'Transport Module Essentials',
  module: 'Transport',
  type: 'Webinar',
  date: '25-Feb-2025 11:00 AM',
  duration: '1h',
  trainer: 'Amit Kumar',
  audience: 'Transport Managers',
  description: 'Learn to manage routes, vehicles, drivers, and student transport assignments efficiently.',
  prerequisites: ['Transport Module Access'],
  maxParticipants: 30,
  currentParticipants: 12,
  isRegistered: false,
  meetingLink: 'https://meet.example.com/transport-training'
}];


const initialPastTrainingData: PastTraining[] = [
{
  id: '1',
  title: 'Student Admission Process',
  module: 'Student',
  type: 'Webinar',
  date: '10-Jan-2025',
  recording: true,
  recordingUrl: 'https://recordings.example.com/admission-process',
  status: 'Completed',
  progress: 100,
  rating: 5,
  certificate: true,
  notes: 'Great session covering all admission workflows.',
  duration: '1h 30m'
},
{
  id: '2',
  title: 'HR Payroll Setup',
  module: 'HR',
  type: 'Video',
  date: '05-Jan-2025',
  recording: false,
  status: 'Completed',
  progress: 100,
  rating: 4,
  certificate: true,
  duration: '45m'
},
{
  id: '3',
  title: 'Library Management Basics',
  module: 'Library',
  type: 'Webinar',
  date: '20-Dec-2024',
  recording: true,
  recordingUrl: 'https://recordings.example.com/library-basics',
  status: 'Missed',
  progress: 0,
  duration: '1h'
},
{
  id: '4',
  title: 'Transport Route Optimization',
  module: 'Transport',
  type: 'Video',
  date: '15-Dec-2024',
  recording: false,
  status: 'Completed',
  progress: 100,
  rating: 4,
  certificate: false,
  duration: '30m'
},
{
  id: '5',
  title: 'Finance Module Introduction',
  module: 'Finance',
  type: 'Webinar',
  date: '01-Dec-2024',
  recording: true,
  recordingUrl: 'https://recordings.example.com/finance-intro',
  status: 'Completed',
  progress: 100,
  rating: 5,
  certificate: true,
  notes: 'Covered fee structure, payment modes, and reporting.',
  duration: '2h'
},
{
  id: '6',
  title: 'Exam Configuration Workshop',
  module: 'Assessment',
  type: 'On-site',
  date: '25-Nov-2024',
  recording: false,
  status: 'Completed',
  progress: 100,
  rating: 5,
  certificate: true,
  duration: '3h'
},
{
  id: '7',
  title: 'Communication Tools Training',
  module: 'Communication',
  type: 'Video',
  date: '15-Nov-2024',
  recording: true,
  recordingUrl: 'https://recordings.example.com/communication-tools',
  status: 'In Progress',
  progress: 60,
  duration: '40m'
},
{
  id: '8',
  title: 'Attendance System Setup',
  module: 'Attendance',
  type: 'Webinar',
  date: '10-Nov-2024',
  recording: true,
  recordingUrl: 'https://recordings.example.com/attendance-setup',
  status: 'Completed',
  progress: 100,
  rating: 3,
  certificate: true,
  notes: 'Need to revisit biometric integration section.',
  duration: '1h 15m'
}];


const initialTrainingMaterials: TrainingMaterial[] = [
{
  id: '1',
  title: 'Admin User Guide v3.0',
  type: 'PDF',
  module: 'Admin',
  size: '2.5 MB',
  downloadUrl: '/materials/admin-guide-v3.pdf',
  description: 'Comprehensive guide for system administrators covering all administrative functions and configurations.',
  uploadedDate: '2024-12-01',
  downloadCount: 245,
  isBookmarked: true
},
{
  id: '2',
  title: 'Fee Collection Manual',
  type: 'PDF',
  module: 'Finance',
  size: '1.8 MB',
  downloadUrl: '/materials/fee-collection-manual.pdf',
  description: 'Step-by-step guide for fee collection process, payment modes, and reconciliation.',
  uploadedDate: '2024-11-15',
  downloadCount: 189,
  isBookmarked: false
},
{
  id: '3',
  title: 'Exam Configuration Steps',
  type: 'PDF',
  module: 'Assessment',
  size: '1.2 MB',
  downloadUrl: '/materials/exam-config-steps.pdf',
  description: 'Detailed instructions for setting up exams, marking schemes, and grade configurations.',
  uploadedDate: '2024-11-10',
  downloadCount: 156,
  isBookmarked: true
},
{
  id: '4',
  title: 'Teacher Portal Handbook',
  type: 'PDF',
  module: 'Academic',
  size: '3.1 MB',
  downloadUrl: '/materials/teacher-handbook.pdf',
  description: 'Complete guide for teachers on using the portal for attendance, grades, and communication.',
  uploadedDate: '2024-10-25',
  downloadCount: 312,
  isBookmarked: false
},
{
  id: '5',
  title: 'Mobile App Setup Guide',
  type: 'PDF',
  module: 'General',
  size: '0.8 MB',
  downloadUrl: '/materials/mobile-app-guide.pdf',
  description: 'Instructions for setting up and using the mobile application for parents and staff.',
  uploadedDate: '2024-10-20',
  downloadCount: 428,
  isBookmarked: false
},
{
  id: '6',
  title: 'Student Registration Video',
  type: 'VIDEO',
  module: 'Student',
  size: '45 MB',
  downloadUrl: '/materials/student-registration.mp4',
  description: 'Video tutorial on complete student registration process.',
  uploadedDate: '2024-10-15',
  downloadCount: 89,
  isBookmarked: false
},
{
  id: '7',
  title: 'Transport Management Guide',
  type: 'DOC',
  module: 'Transport',
  size: '1.5 MB',
  downloadUrl: '/materials/transport-guide.docx',
  description: 'Guide for managing transport routes, vehicles, and driver assignments.',
  uploadedDate: '2024-10-10',
  downloadCount: 67,
  isBookmarked: false
},
{
  id: '8',
  title: 'HR Module Quick Reference',
  type: 'PDF',
  module: 'HR',
  size: '0.6 MB',
  downloadUrl: '/materials/hr-quick-ref.pdf',
  description: 'Quick reference card for common HR operations.',
  uploadedDate: '2024-10-05',
  downloadCount: 134,
  isBookmarked: true
},
{
  id: '9',
  title: 'Library System Tutorial',
  type: 'LINK',
  module: 'Library',
  size: '-',
  downloadUrl: 'https://help.example.com/library-tutorial',
  description: 'Interactive online tutorial for library management system.',
  uploadedDate: '2024-09-30',
  downloadCount: 201,
  isBookmarked: false
},
{
  id: '10',
  title: 'Report Generation Masterclass',
  type: 'VIDEO',
  module: 'Reports',
  size: '120 MB',
  downloadUrl: '/materials/report-masterclass.mp4',
  description: 'Advanced training on creating custom reports and dashboards.',
  uploadedDate: '2024-09-25',
  downloadCount: 156,
  isBookmarked: true
}];


const initialCertificates: Certificate[] = [
{
  id: 'CERT-001',
  trainingId: '1',
  trainingTitle: 'Student Admission Process',
  completedDate: '10-Jan-2025',
  certificateUrl: '/certificates/cert-001.pdf',
  validUntil: '10-Jan-2026'
},
{
  id: 'CERT-002',
  trainingId: '2',
  trainingTitle: 'HR Payroll Setup',
  completedDate: '05-Jan-2025',
  certificateUrl: '/certificates/cert-002.pdf'
},
{
  id: 'CERT-003',
  trainingId: '5',
  trainingTitle: 'Finance Module Introduction',
  completedDate: '01-Dec-2024',
  certificateUrl: '/certificates/cert-003.pdf',
  validUntil: '01-Dec-2025'
},
{
  id: 'CERT-004',
  trainingId: '6',
  trainingTitle: 'Exam Configuration Workshop',
  completedDate: '25-Nov-2024',
  certificateUrl: '/certificates/cert-004.pdf'
},
{
  id: 'CERT-005',
  trainingId: '8',
  trainingTitle: 'Attendance System Setup',
  completedDate: '10-Nov-2024',
  certificateUrl: '/certificates/cert-005.pdf'
}];


const moduleOptions = [
{ value: 'all', label: 'All Modules' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Student', label: 'Student' },
{ value: 'Assessment', label: 'Assessment' },
{ value: 'Admin', label: 'Admin' },
{ value: 'HR', label: 'HR' },
{ value: 'Library', label: 'Library' },
{ value: 'Transport', label: 'Transport' },
{ value: 'Communication', label: 'Communication' },
{ value: 'Attendance', label: 'Attendance' },
{ value: 'Academic', label: 'Academic' },
{ value: 'Reports', label: 'Reports' },
{ value: 'General', label: 'General' }];


const typeOptions = [
{ value: 'all', label: 'All Types' },
{ value: 'Video', label: 'Video' },
{ value: 'Webinar', label: 'Webinar' },
{ value: 'On-site', label: 'On-site' }];


const statusOptions = [
{ value: 'all', label: 'All Status' },
{ value: 'Completed', label: 'Completed' },
{ value: 'In Progress', label: 'In Progress' },
{ value: 'Missed', label: 'Missed' }];


// ==================== TRAINING DETAIL MODAL ====================
interface TrainingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: UpcomingTraining | null;
  onRegister: (trainingId: string) => void;
  onUnregister: (trainingId: string) => void;
}

function TrainingDetailModal({
  isOpen,
  onClose,
  training,
  onRegister,
  onUnregister
}: TrainingDetailModalProps) {
  if (!isOpen || !training) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <VideoIcon className="w-6 h-6 text-blue-500" />;
      case 'Webinar':
        return <UsersIcon className="w-6 h-6 text-purple-500" />;
      case 'On-site':
        return <CalendarIcon className="w-6 h-6 text-green-500" />;
      default:
        return <FileTextIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              {getTypeIcon(training.type)}
              <div>
                <h2 className="text-xl font-semibold">{training.title}</h2>
                <p className="text-sm text-gray-500">{training.module} Module</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{training.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  Date & Time
                </div>
                <p className="font-medium">{training.date}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <ClockIcon className="w-4 h-4" />
                  Duration
                </div>
                <p className="font-medium">{training.duration}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <UsersIcon className="w-4 h-4" />
                  Trainer
                </div>
                <p className="font-medium">{training.trainer}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <UsersIcon className="w-4 h-4" />
                  Target Audience
                </div>
                <p className="font-medium">{training.audience}</p>
              </div>
            </div>

            {training.maxParticipants &&
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700">Registration Status</span>
                  <span className="text-sm font-medium text-blue-900">
                    {training.currentParticipants} / {training.maxParticipants} registered
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(training.currentParticipants || 0) / training.maxParticipants * 100}%`
                  }} />

                </div>
              </div>
            }

            {training.prerequisites.length > 0 &&
            <div>
                <h3 className="font-medium text-gray-900 mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1">
                  {training.prerequisites.map((prereq, index) =>
                <li key={index} className="text-gray-600 text-sm">
                      {prereq}
                    </li>
                )}
                </ul>
              </div>
            }

            {training.type === 'On-site' && training.location &&
            <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-1">Location</h3>
                <p className="text-green-700">{training.location}</p>
              </div>
            }

            {training.type === 'Webinar' && training.meetingLink && training.isRegistered &&
            <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-1">Meeting Link</h3>
                <a
                href={training.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:underline flex items-center gap-1">

                  {training.meetingLink}
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </div>
            }
          </div>

          <div className="flex justify-end gap-3 p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {training.type === 'Video' ?
            <Button variant="primary" leftIcon={<PlayIcon className="w-4 h-4" />}>
                Watch Now
              </Button> :
            training.isRegistered ?
            <Button
              variant="outline"
              onClick={() => onUnregister(training.id)}
              className="text-red-600 border-red-300 hover:bg-red-50">

                Cancel Registration
              </Button> :

            <Button variant="primary" onClick={() => onRegister(training.id)}>
                Register Now
              </Button>
            }
          </div>
        </div>
      </div>
    </div>);

}

// ==================== VIDEO PLAYER MODAL ====================
interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: PastTraining | UpcomingTraining | null;
  onUpdateProgress?: (trainingId: string, progress: number) => void;
}

function VideoPlayerModal({
  isOpen,
  onClose,
  training,
  onUpdateProgress
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (training && 'progress' in training && training.progress) {
      setProgress(training.progress);
    } else {
      setProgress(0);
    }
  }, [training]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 0.5, 100);
          return newProgress;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handleClose = () => {
    if (training && onUpdateProgress) {
      onUpdateProgress(training.id, progress);
    }
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen || !training) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="text-white">
            <h2 className="text-lg font-semibold">{training.title}</h2>
            <p className="text-sm text-gray-400">{training.module} Module</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              leftIcon={<MessageSquareIcon className="w-4 h-4" />}
              className="text-white border-gray-600">

              Notes
            </Button>
            <button onClick={handleClose} className="text-white hover:bg-gray-800 p-2 rounded">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className={`flex-1 flex items-center justify-center bg-gray-950 ${showNotes ? 'w-2/3' : 'w-full'}`}>
            <div className="text-center">
              <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <VideoIcon className="w-24 h-24 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm">Video Player Simulation</p>
              <p className="text-gray-500 text-xs mt-1">
                In production, this would be an actual video player
              </p>
            </div>
          </div>

          {showNotes &&
          <div className="w-1/3 bg-gray-900 p-4 border-l border-gray-800">
              <h3 className="text-white font-medium mb-3">Training Notes</h3>
              <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes during the training..."
              className="w-full h-64 bg-gray-800 text-white border border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <Button variant="primary" size="sm" className="mt-3 w-full">
                Save Notes
              </Button>
            </div>
          }
        </div>

        <div className="bg-gray-900 p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 text-xs">{Math.floor(progress)}%</span>
              <div className="flex-1 bg-gray-700 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{ width: `${progress}%` }} />

              </div>
              <span className="text-gray-400 text-xs">{training.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200">

                {isPlaying ?
                <PauseIcon className="w-6 h-6 text-gray-900" /> :

                <PlayIcon className="w-6 h-6 text-gray-900 ml-1" />
                }
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-300">

                  {isMuted ?
                  <VolumeXIcon className="w-5 h-5" /> :

                  <Volume2Icon className="w-5 h-5" />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20" />

              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm">

                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <button className="text-white hover:text-gray-300">
                <MaximizeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== REGISTRATION MODAL ====================
interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: UpcomingTraining | null;
  onConfirm: (trainingId: string, data: any) => void;
}

function RegistrationModal({
  isOpen,
  onClose,
  training,
  onConfirm
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: 'Current User',
    email: 'user@school.edu',
    phone: '',
    department: '',
    specialRequirements: '',
    agreeToTerms: false
  });

  if (!isOpen || !training) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onConfirm(training.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Training Registration</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900">{training.title}</p>
              <p className="text-sm text-blue-700">{training.date}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Optional" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Accounts, Administration" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requirements
              </label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) =>
                setFormData({ ...formData, specialRequirements: e.target.value })
                }
                placeholder="Any accessibility needs or special requests..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
                className="mt-1 rounded border-gray-300" />

              <span className="text-sm text-gray-600">
                I agree to attend the training and understand the cancellation policy. I will
                notify in advance if I cannot attend.
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>);

}

// ==================== FEEDBACK MODAL ====================
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: PastTraining | null;
  onSubmit: (trainingId: string, rating: number, comment: string) => void;
}

function FeedbackModal({ isOpen, onClose, training, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (training?.rating) {
      setRating(training.rating);
    } else {
      setRating(0);
    }
    setComment('');
  }, [training]);

  if (!isOpen || !training) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(training.id, rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Rate This Training</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{training.title}</p>
              <p className="text-sm text-gray-500">{training.date}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) =>
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none">

                    <StarIcon
                    className={`w-8 h-8 ${
                    star <= (hoverRating || rating) ?
                    'text-yellow-400 fill-yellow-400' :
                    'text-gray-300'}`
                    } />

                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this training..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>);

}

// ==================== MATERIALS MODAL ====================
interface MaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: TrainingMaterial[];
  onDownload: (material: TrainingMaterial) => void;
  onToggleBookmark: (materialId: string) => void;
}

function MaterialsModal({
  isOpen,
  onClose,
  materials,
  onDownload,
  onToggleBookmark
}: MaterialsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
      !searchQuery ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModule =
      moduleFilter === 'all' || material.module === moduleFilter;

      const matchesType = typeFilter === 'all' || material.type === typeFilter;

      return matchesSearch && matchesModule && matchesType;
    });
  }, [materials, searchQuery, moduleFilter, typeFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileTextIcon className="w-5 h-5 text-red-500" />;
      case 'DOC':
        return <FileTextIcon className="w-5 h-5 text-blue-500" />;
      case 'VIDEO':
        return <VideoIcon className="w-5 h-5 text-purple-500" />;
      case 'LINK':
        return <ExternalLinkIcon className="w-5 h-5 text-green-500" />;
      default:
        return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Training Materials</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                leftIcon={<SearchIcon className="w-4 h-4" />} />

              <Select
                value={moduleFilter}
                onChange={setModuleFilter}
                options={moduleOptions}
                className="w-40" />

              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                { value: 'all', label: 'All Types' },
                { value: 'PDF', label: 'PDF' },
                { value: 'DOC', label: 'Document' },
                { value: 'VIDEO', label: 'Video' },
                { value: 'LINK', label: 'Link' }]
                }
                className="w-40" />

            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-4">
            <div className="space-y-3">
              {filteredMaterials.map((material) =>
              <div
                key={material.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border">
                      {getTypeIcon(material.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{material.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {material.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{material.module}</span>
                        <span>•</span>
                        <span>{material.size}</span>
                        <span>•</span>
                        <span>{material.downloadCount} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                    onClick={() => onToggleBookmark(material.id)}
                    className={`p-2 rounded hover:bg-gray-200 ${
                    material.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`
                    }>

                      <BookmarkIcon
                      className={`w-5 h-5 ${material.isBookmarked ? 'fill-yellow-500' : ''}`} />

                    </button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(material)}
                    leftIcon={
                    material.type === 'LINK' ?
                    <ExternalLinkIcon className="w-4 h-4" /> :

                    <DownloadIcon className="w-4 h-4" />

                    }>

                      {material.type === 'LINK' ? 'Open' : 'Download'}
                    </Button>
                  </div>
                </div>
              )}
              {filteredMaterials.length === 0 &&
              <div className="text-center py-8 text-gray-500">
                  No materials found matching your criteria
                </div>
              }
            </div>
          </div>

          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <span className="text-sm text-gray-500">
              {filteredMaterials.length} materials found
            </span>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== CERTIFICATES MODAL ====================
interface CertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: Certificate[];
  onDownload: (certificate: Certificate) => void;
  onShare: (certificate: Certificate) => void;
}

function CertificatesModal({
  isOpen,
  onClose,
  certificates,
  onDownload,
  onShare
}: CertificatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <AwardIcon className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">My Certificates</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh] p-4">
            {certificates.length === 0 ?
            <div className="text-center py-8">
                <AwardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No certificates earned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Complete trainings to earn certificates
                </p>
              </div> :

            <div className="space-y-4">
                {certificates.map((certificate) =>
              <div
                key={certificate.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <AwardIcon className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {certificate.trainingTitle}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Certificate ID: {certificate.id}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              Completed: {certificate.completedDate}
                            </span>
                            {certificate.validUntil &&
                        <span className="text-gray-600">
                                Valid until: {certificate.validUntil}
                              </span>
                        }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(certificate)}
                    leftIcon={<ShareIcon className="w-4 h-4" />}>

                        Share
                      </Button>
                      <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onDownload(certificate)}
                    leftIcon={<DownloadIcon className="w-4 h-4" />}>

                        Download
                      </Button>
                    </div>
                  </div>
              )}
              </div>
            }
          </div>

          <div className="flex justify-end p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>);

}

// ==================== MAIN COMPONENT ====================
export function ScreenTraining() {
  const [upcomingTrainings, setUpcomingTrainings] = useState<UpcomingTraining[]>(
    initialUpcomingTrainingData
  );
  const [pastTrainings, setPastTrainings] = useState<PastTraining[]>(
    initialPastTrainingData
  );
  const [materials, setMaterials] = useState<TrainingMaterial[]>(
    initialTrainingMaterials
  );
  const [certificates] = useState<Certificate[]>(initialCertificates);

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedUpcomingTraining, setSelectedUpcomingTraining] =
  useState<UpcomingTraining | null>(null);
  const [selectedPastTraining, setSelectedPastTraining] =
  useState<PastTraining | null>(null);
  const [trainingForRegistration, setTrainingForRegistration] =
  useState<UpcomingTraining | null>(null);
  const [trainingForFeedback, setTrainingForFeedback] =
  useState<PastTraining | null>(null);
  const [videoTraining, setVideoTraining] = useState<
    PastTraining | UpcomingTraining | null>(
    null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] = useState(false);

  const filteredPastTrainings = useMemo(() => {
    return pastTrainings.filter((training) => {
      const matchesSearch =
      !searchQuery ||
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.module.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModule =
      moduleFilter === 'all' || training.module === moduleFilter;

      const matchesType = typeFilter === 'all' || training.type === typeFilter;

      const matchesStatus =
      statusFilter === 'all' || training.status === statusFilter;

      return matchesSearch && matchesModule && matchesType && matchesStatus;
    });
  }, [pastTrainings, searchQuery, moduleFilter, typeFilter, statusFilter]);

  const handleRegister = useCallback((trainingId: string) => {
    setUpcomingTrainings((prev) =>
    prev.map((t) =>
    t.id === trainingId ?
    {
      ...t,
      isRegistered: true,
      currentParticipants: (t.currentParticipants || 0) + 1
    } :
    t
    )
    );
    alert('Successfully registered for the training!');
  }, []);

  const handleUnregister = useCallback((trainingId: string) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      setUpcomingTrainings((prev) =>
      prev.map((t) =>
      t.id === trainingId ?
      {
        ...t,
        isRegistered: false,
        currentParticipants: Math.max((t.currentParticipants || 1) - 1, 0)
      } :
      t
      )
      );
      alert('Registration cancelled successfully');
    }
  }, []);

  const handleRegistrationConfirm = useCallback(
    (trainingId: string, data: any) => {
      handleRegister(trainingId);
      console.log('Registration data:', data);
    },
    [handleRegister]
  );

  const handleUpdateProgress = useCallback(
    (trainingId: string, progress: number) => {
      setPastTrainings((prev) =>
      prev.map((t) =>
      t.id === trainingId ?
      {
        ...t,
        progress,
        status: progress >= 100 ? 'Completed' : 'In Progress'
      } :
      t
      )
      );
    },
    []
  );

  const handleSubmitFeedback = useCallback(
    (trainingId: string, rating: number, comment: string) => {
      setPastTrainings((prev) =>
      prev.map((t) =>
      t.id === trainingId ?
      {
        ...t,
        rating,
        notes: comment || t.notes
      } :
      t
      )
      );
      alert('Thank you for your feedback!');
    },
    []
  );

  const handleDownloadMaterial = useCallback((material: TrainingMaterial) => {
    if (material.type === 'LINK') {
      window.open(material.downloadUrl, '_blank');
    } else {
      alert(`Downloading: ${material.title}`);
      setMaterials((prev) =>
      prev.map((m) =>
      m.id === material.id ?
      { ...m, downloadCount: m.downloadCount + 1 } :
      m
      )
      );
    }
  }, []);

  const handleToggleBookmark = useCallback((materialId: string) => {
    setMaterials((prev) =>
    prev.map((m) =>
    m.id === materialId ? { ...m, isBookmarked: !m.isBookmarked } : m
    )
    );
  }, []);

  const handleDownloadCertificate = useCallback((certificate: Certificate) => {
    alert(`Downloading certificate: ${certificate.trainingTitle}`);
  }, []);

  const handleShareCertificate = useCallback((certificate: Certificate) => {
    const shareText = `I completed "${certificate.trainingTitle}" training! Certificate ID: ${certificate.id}`;
    if (navigator.share) {
      navigator.share({
        title: 'Training Certificate',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Certificate link copied to clipboard!');
    }
  }, []);

  const handleWatchRecording = useCallback((training: PastTraining) => {
    setVideoTraining(training);
    setIsVideoModalOpen(true);
  }, []);

  const handleWatchVideo = useCallback((training: UpcomingTraining) => {
    setVideoTraining(training);
    setIsVideoModalOpen(true);
  }, []);

  const handleOpenTrainingDetail = useCallback((training: UpcomingTraining) => {
    setSelectedUpcomingTraining(training);
    setIsDetailModalOpen(true);
  }, []);

  const handleOpenRegistration = useCallback((training: UpcomingTraining) => {
    setTrainingForRegistration(training);
    setIsRegistrationModalOpen(true);
  }, []);

  const handleOpenFeedback = useCallback((training: PastTraining) => {
    setTrainingForFeedback(training);
    setIsFeedbackModalOpen(true);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setModuleFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  }, []);

  const completedCount = pastTrainings.filter(
    (t) => t.status === 'Completed'
  ).length;
  const certificateCount = certificates.length;
  const bookmarkedMaterialsCount = materials.filter((m) => m.isBookmarked).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <VideoIcon className="w-5 h-5 text-blue-500" />;
      case 'Webinar':
        return <UsersIcon className="w-5 h-5 text-purple-500" />;
      case 'On-site':
        return <CalendarIcon className="w-5 h-5 text-green-500" />;
      default:
        return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const pastColumns = [
  {
    key: 'title',
    header: 'Training Title',
    render: (row: PastTraining) =>
    <span className="font-medium">{row.title}</span>

  },
  {
    key: 'module',
    header: 'Module'
  },
  {
    key: 'type',
    header: 'Type',
    render: (row: PastTraining) =>
    <div className="flex items-center gap-2">
          {getTypeIcon(row.type)}
          <span>{row.type}</span>
        </div>

  },
  {
    key: 'date',
    header: 'Date'
  },
  {
    key: 'duration',
    header: 'Duration'
  },
  {
    key: 'recording',
    header: 'Recording',
    render: (row: PastTraining) =>
    row.recording ?
    <span
      className="text-blue-600 flex items-center gap-1 cursor-pointer hover:underline"
      onClick={() => handleWatchRecording(row)}>

            <PlayIcon className="w-3 h-3" /> Watch
          </span> :

    <span className="text-gray-400">-</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: PastTraining) =>
    <div className="flex items-center gap-2">
          <Badge
        variant={
        row.status === 'Completed' ?
        'success' :
        row.status === 'In Progress' ?
        'warning' :
        'secondary'
        }>

            {row.status}
          </Badge>
          {row.status === 'In Progress' && row.progress !== undefined &&
      <span className="text-xs text-gray-500">{row.progress}%</span>
      }
        </div>

  },
  {
    key: 'rating',
    header: 'Rating',
    render: (row: PastTraining) =>
    row.rating ?
    <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) =>
      <StarIcon
        key={star}
        className={`w-4 h-4 ${
        star <= row.rating! ?
        'text-yellow-400 fill-yellow-400' :
        'text-gray-300'}`
        } />

      )}
          </div> :
    row.status === 'Completed' ?
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleOpenFeedback(row)}
      className="text-blue-600">

            Rate
          </Button> :

    <span className="text-gray-400">-</span>

  },
  {
    key: 'certificate',
    header: 'Certificate',
    render: (row: PastTraining) =>
    row.certificate ?
    <CheckCircleIcon className="w-5 h-5 text-green-500" /> :

    <span className="text-gray-400">-</span>

  }];


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screen Training</h1>
          <p className="text-sm text-gray-500">
            Access training resources and schedules for system modules
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCertificatesModalOpen(true)}
            leftIcon={<AwardIcon className="w-4 h-4" />}>

            My Certificates ({certificateCount})
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsMaterialsModalOpen(true)}
            leftIcon={<BookOpenIcon className="w-4 h-4" />}>

            All Materials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Upcoming Trainings</p>
          <p className="text-2xl font-bold text-blue-700">
            {upcomingTrainings.length}
          </p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">Certificates Earned</p>
          <p className="text-2xl font-bold text-yellow-700">{certificateCount}</p>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Bookmarked Materials</p>
          <p className="text-2xl font-bold text-purple-700">
            {bookmarkedMaterialsCount}
          </p>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Training
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrainings.map((training) =>
          <Card
            key={training.id}
            className="hover:shadow-md transition-shadow">

              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  {getTypeIcon(training.type)}
                </div>
                <div className="flex items-center gap-2">
                  {training.isRegistered &&
                <Badge variant="success">Registered</Badge>
                }
                  <Badge variant="outline">{training.type}</Badge>
                </div>
              </div>
              <h3
              className="font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
              onClick={() => handleOpenTrainingDetail(training)}>

                {training.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {training.module} Module
              </p>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>{training.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span>Duration: {training.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span>For: {training.audience}</span>
                </div>
                {training.maxParticipants &&
              <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      {training.currentParticipants}/{training.maxParticipants}{' '}
                      registered
                    </span>
                  </div>
              }
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {training.type === 'Video' ?
              <Button
                className="w-full"
                variant="primary"
                size="sm"
                onClick={() => handleWatchVideo(training)}
                leftIcon={<PlayIcon className="w-4 h-4" />}>

                    Watch Now
                  </Button> :
              training.isRegistered ?
              <>
                    <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenTrainingDetail(training)}>

                      View Details
                    </Button>
                    <Button
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnregister(training.id)}>

                      Cancel Registration
                    </Button>
                  </> :

              <Button
                className="w-full"
                variant="primary"
                size="sm"
                onClick={() => handleOpenRegistration(training)}>

                    Register
                  </Button>
              }
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Past Training History
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                Reset Filters
              </Button>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search trainings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
                leftIcon={<SearchIcon className="w-4 h-4" />} />

              <Select
                value={moduleFilter}
                onChange={setModuleFilter}
                options={moduleOptions}
                className="w-36" />

              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                className="w-32" />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-36" />

            </div>
          </div>
          <Table columns={pastColumns} data={filteredPastTrainings} />
          {filteredPastTrainings.length === 0 &&
          <div className="p-8 text-center text-gray-500">
              No trainings found matching your criteria
            </div>
          }
        </Card>

        <Card title="Training Materials">
          <div className="space-y-3">
            {materials.slice(0, 5).map((material) =>
            <div
              key={material.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleDownloadMaterial(material)}>

                <div className="flex items-center gap-3">
                  <FileTextIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {material.title}
                    </span>
                    <p className="text-xs text-gray-400">{material.module}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {material.isBookmarked &&
                <BookmarkIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                }
                  <DownloadIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full text-blue-600"
              onClick={() => setIsMaterialsModalOpen(true)}>

              View All Materials ({materials.length})
            </Button>
          </div>
        </Card>
      </div>

      <TrainingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUpcomingTraining(null);
        }}
        training={selectedUpcomingTraining}
        onRegister={handleRegister}
        onUnregister={handleUnregister} />


      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setTrainingForRegistration(null);
        }}
        training={trainingForRegistration}
        onConfirm={handleRegistrationConfirm} />


      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setVideoTraining(null);
        }}
        training={videoTraining}
        onUpdateProgress={handleUpdateProgress} />


      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setTrainingForFeedback(null);
        }}
        training={trainingForFeedback}
        onSubmit={handleSubmitFeedback} />


      <MaterialsModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        materials={materials}
        onDownload={handleDownloadMaterial}
        onToggleBookmark={handleToggleBookmark} />


      <CertificatesModal
        isOpen={isCertificatesModalOpen}
        onClose={() => setIsCertificatesModalOpen(false)}
        certificates={certificates}
        onDownload={handleDownloadCertificate}
        onShare={handleShareCertificate} />

    </div>);

}