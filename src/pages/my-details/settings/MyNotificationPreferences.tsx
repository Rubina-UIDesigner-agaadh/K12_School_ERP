import React from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Lock,
  RotateCcw } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
export function MyNotificationPreferences() {
  const preferences = [
  {
    id: 1,
    category: 'Emergency Alerts',
    app: true,
    email: true,
    sms: true,
    push: true,
    locked: true
  },
  {
    id: 2,
    category: 'General Announcements',
    app: true,
    email: true,
    sms: false,
    push: true,
    locked: false
  },
  {
    id: 3,
    category: 'Attendance Alerts',
    app: true,
    email: false,
    sms: true,
    push: true,
    locked: false
  },
  {
    id: 4,
    category: 'Fee Reminders',
    app: true,
    email: true,
    sms: true,
    push: false,
    locked: false
  },
  {
    id: 5,
    category: 'Homework/Assignments',
    app: true,
    email: false,
    sms: false,
    push: true,
    locked: false
  }];

  const Toggle = ({
    checked,
    disabled



  }: {checked: boolean;disabled?: boolean;}) =>
  <div className="flex justify-center">
      {disabled ?
    <Lock className="w-4 h-4 text-gray-300" /> :

    <label className="relative inline-flex items-center cursor-pointer">
          <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={checked} />

          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    }
    </div>;

  const columns = [
  {
    key: 'category',
    header: 'Notification Type',
    render: (row: any) =>
    <span className={row.locked ? 'font-semibold text-gray-900' : ''}>
          {row.category}
          {row.locked && <span className="text-red-500 ml-1">*</span>}
        </span>

  },
  {
    key: 'app',
    header:
    <div className="flex flex-col items-center gap-1">
          <Bell className="w-4 h-4" />{' '}
          <span className="text-[10px]">In-App</span>
        </div>,

    render: (row: any) => <Toggle checked={row.app} disabled={row.locked} />
  },
  {
    key: 'email',
    header:
    <div className="flex flex-col items-center gap-1">
          <Mail className="w-4 h-4" />{' '}
          <span className="text-[10px]">Email</span>
        </div>,

    render: (row: any) =>
    <Toggle checked={row.email} disabled={row.locked} />

  },
  {
    key: 'sms',
    header:
    <div className="flex flex-col items-center gap-1">
          <MessageSquare className="w-4 h-4" />{' '}
          <span className="text-[10px]">SMS</span>
        </div>,

    render: (row: any) => <Toggle checked={row.sms} disabled={row.locked} />
  },
  {
    key: 'push',
    header:
    <div className="flex flex-col items-center gap-1">
          <Smartphone className="w-4 h-4" />{' '}
          <span className="text-[10px]">Push</span>
        </div>,

    render: (row: any) => <Toggle checked={row.push} disabled={row.locked} />
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notification Preferences
          </h1>
          <p className="text-sm text-gray-500">
            Choose how you want to receive updates.
          </p>
        </div>
        <Button variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Restore Defaults
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={preferences} />
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
          <span className="text-red-500">*</span> Mandatory notifications cannot
          be disabled.
        </div>
      </Card>
    </div>);

}