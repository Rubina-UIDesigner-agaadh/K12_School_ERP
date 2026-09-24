import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  CreditCard,
  Smartphone,
  Building2,
  RefreshCw,
  Banknote,
  Bell,
  Shield,
  Save,
  AlertTriangle,
  RotateCcw,
  Lock,
  Unlock,
  Receipt } from
'lucide-react';
const paymentMethods = [
{
  id: 'upi',
  label: 'UPI',
  icon: Smartphone,
  enabled: true,
  desc: 'Google Pay, PhonePe, BHIM'
},
{
  id: 'netbanking',
  label: 'Net Banking',
  icon: Building2,
  enabled: true,
  desc: 'All major banks supported'
},
{
  id: 'card',
  label: 'Credit / Debit Card',
  icon: CreditCard,
  enabled: true,
  desc: 'Visa, Mastercard, RuPay'
},
{
  id: 'autodebit',
  label: 'Auto-Debit Mandate',
  icon: RefreshCw,
  enabled: false,
  desc: 'NACH mandate setup'
},
{
  id: 'manual',
  label: 'Manual Bank Transfer',
  icon: Banknote,
  enabled: true,
  desc: 'NEFT / RTGS / IMPS'
}];

export function PaymentConfiguration() {
  const [methods, setMethods] = useState(paymentMethods);
  const [autoPayment, setAutoPayment] = useState(false);
  const [partialPayment, setPartialPayment] = useState(false);
  const [subscriptionLocked, setSubscriptionLocked] = useState(false);
  const [reminderDays, setReminderDays] = useState('7');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [currency, setCurrency] = useState('INR');
  const toggleMethod = (id: string) => {
    setMethods((prev) =>
    prev.map((m) =>
    m.id === id ?
    {
      ...m,
      enabled: !m.enabled
    } :
    m
    )
    );
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage payment methods, billing settings, and admin controls
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card title="Payment Methods">
          <div className="space-y-3">
            {methods.map((method) =>
            <div
              key={method.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${method.enabled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}`}>

                <div
                className={`p-2 rounded-lg ${method.enabled ? 'bg-blue-100' : 'bg-gray-200'}`}>

                  <method.icon
                  className={`w-4 h-4 ${method.enabled ? 'text-blue-600' : 'text-gray-400'}`} />

                </div>
                <div className="flex-1">
                  <p
                  className={`text-sm font-semibold ${method.enabled ? 'text-gray-800' : 'text-gray-400'}`}>

                    {method.label}
                  </p>
                  <p className="text-xs text-gray-400">{method.desc}</p>
                </div>
                <button
                onClick={() => toggleMethod(method.id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${method.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>

                  <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${method.enabled ? 'translate-x-5' : 'translate-x-0'}`} />

                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Billing Settings */}
        <Card title="Billing Settings">
          <div className="space-y-4">
            {/* Auto Payment Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Auto Payment
                </p>
                <p className="text-xs text-gray-500">
                  Automatically charge on billing date
                </p>
              </div>
              <button
                onClick={() => setAutoPayment(!autoPayment)}
                className={`relative w-11 h-6 rounded-full transition-colors ${autoPayment ? 'bg-green-500' : 'bg-gray-300'}`}>

                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoPayment ? 'translate-x-5' : 'translate-x-0'}`} />

              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Billing Reminder (days before)"
                type="number"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)} />

              <Input
                label="Grace Period (days)"
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)} />

            </div>

            <Select
              label="Currency"
              options={[
              {
                value: 'INR',
                label: 'INR (₹) - Indian Rupee'
              },
              {
                value: 'USD',
                label: 'USD ($) - US Dollar'
              },
              {
                value: 'AED',
                label: 'AED - UAE Dirham'
              }]
              }
              value={currency}
              onChange={setCurrency} />


            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Late Fee Rules
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Late Fee (%)" type="number" defaultValue="2" />
                <Input
                  label="Apply After (days)"
                  type="number"
                  defaultValue="7" />

              </div>
            </div>
          </div>
        </Card>

        {/* Admin Controls */}
        <Card title="Admin Controls">
          <div className="space-y-4">
            {/* Lock Subscription */}
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border ${subscriptionLocked ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>

              <div
                className={`p-2 rounded-lg ${subscriptionLocked ? 'bg-red-100' : 'bg-gray-200'}`}>

                {subscriptionLocked ?
                <Lock className="w-4 h-4 text-red-600" /> :

                <Unlock className="w-4 h-4 text-gray-500" />
                }
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Lock Subscription on Non-Payment
                </p>
                <p className="text-xs text-gray-500">
                  Suspend access after grace period expires
                </p>
              </div>
              <button
                onClick={() => setSubscriptionLocked(!subscriptionLocked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${subscriptionLocked ? 'bg-red-500' : 'bg-gray-300'}`}>

                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${subscriptionLocked ? 'translate-x-5' : 'translate-x-0'}`} />

              </button>
            </div>

            {/* Partial Payment */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Partial Payment Support
                </p>
                <p className="text-xs text-gray-500">
                  Allow paying less than full invoice amount
                </p>
              </div>
              <button
                onClick={() => setPartialPayment(!partialPayment)}
                className={`relative w-11 h-6 rounded-full transition-colors ${partialPayment ? 'bg-blue-500' : 'bg-gray-300'}`}>

                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${partialPayment ? 'translate-x-5' : 'translate-x-0'}`} />

              </button>
            </div>

            {/* Credit Notes & Refunds */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <Receipt className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Issue Credit Note
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Apply credit to account
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <RotateCcw className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Process Refund
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Refund to original method
                  </p>
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card title="Notification Settings">
          <div className="space-y-3">
            {[
            {
              label: 'Invoice Generated',
              sub: 'Send when new invoice is created',
              enabled: true
            },
            {
              label: 'Payment Received',
              sub: 'Confirm successful payment',
              enabled: true
            },
            {
              label: 'Payment Reminder',
              sub: `Send ${reminderDays} days before due date`,
              enabled: true
            },
            {
              label: 'Overdue Alert',
              sub: 'Alert when payment is overdue',
              enabled: true
            },
            {
              label: 'Subscription Expiry',
              sub: '30 days before contract end',
              enabled: false
            },
            {
              label: 'Module Activated/Deactivated',
              sub: 'Notify on module changes',
              enabled: false
            }].
            map((notif, i) =>
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">

                <div className="flex items-center gap-2.5">
                  <Bell className="w-3.5 h-3.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {notif.label}
                    </p>
                    <p className="text-xs text-gray-400">{notif.sub}</p>
                  </div>
                </div>
                <button
                className={`relative w-9 h-5 rounded-full transition-colors ${notif.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>

                  <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notif.enabled ? 'translate-x-4' : 'translate-x-0'}`} />

                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Important: Payment Configuration Changes
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Changes to auto-debit mandates or subscription lock settings will
            take effect from the next billing cycle. Ensure your school's
            finance team is notified before making changes.
          </p>
        </div>
      </div>
    </div>);

}