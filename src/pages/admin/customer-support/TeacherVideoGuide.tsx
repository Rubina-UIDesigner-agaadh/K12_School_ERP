import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlayIcon, SearchIcon, StarIcon, PlusIcon } from 'lucide-react';
const videosData = [
{
  id: '1',
  title: 'Taking Daily Attendance',
  duration: '5:30',
  module: 'Attendance',
  description: 'Learn how to mark daily attendance for your class.',
  favorite: true
},
{
  id: '2',
  title: 'Entering Exam Marks',
  duration: '8:15',
  module: 'Assessment',
  description: 'Step-by-step guide to entering subject marks.',
  favorite: false
},
{
  id: '3',
  title: 'Generating Report Cards',
  duration: '6:45',
  module: 'Assessment',
  description: 'How to generate and print student report cards.',
  favorite: true
},
{
  id: '4',
  title: 'Managing Student Profiles',
  duration: '4:20',
  module: 'Student',
  description: 'Update student details and contact info.',
  favorite: false
},
{
  id: '5',
  title: 'Using the Timetable',
  duration: '3:50',
  module: 'Academics',
  description: 'View and manage your weekly class schedule.',
  favorite: false
},
{
  id: '6',
  title: 'Parent Communication',
  duration: '5:10',
  module: 'Communication',
  description: 'Send messages and remarks to parents.',
  favorite: true
}];

export function TeacherVideoGuide() {
  const [moduleFilter, setModuleFilter] = useState('');
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Video Guides
          </h1>
          <p className="text-sm text-gray-500">
            Video tutorials focused on teacher workflows
          </p>
        </div>
        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
          Add Video
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <Select
            placeholder="Filter by Module"
            value={moduleFilter}
            onChange={setModuleFilter}
            options={[
            {
              value: 'all',
              label: 'All Modules'
            },
            {
              value: 'attendance',
              label: 'Attendance'
            },
            {
              value: 'assessment',
              label: 'Assessment'
            },
            {
              value: 'student',
              label: 'Student'
            }]
            }
            className="w-48" />

          <div className="flex-1">
            <Input
              placeholder="Search videos..."
              leftIcon={<SearchIcon className="w-4 h-4" />} />

          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videosData.map((video) =>
        <Card
          key={video.id}
          noPadding
          className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">

            <div className="relative h-40 bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayIcon className="w-6 h-6 text-white ml-1" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-xs">
                  {video.module}
                </Badge>
                <button
                className={`text-gray-300 hover:text-yellow-400 transition-colors ${video.favorite ? 'text-yellow-400' : ''}`}>

                  <StarIcon className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {video.description}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>);

}