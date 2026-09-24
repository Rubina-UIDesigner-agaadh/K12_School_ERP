// FILE: ScholarshipConcessionRules.jsx
// PURPOSE: Advanced scholarship & concession rule builder with eligibility conditions, benefit calculator, and approval workflow

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, RotateCcw, Plus, Trash2, Settings } from 'lucide-react';

export function ScholarshipConcessionRules() {
  const [conditions, setConditions] = useState([
  { id: 1, field: 'percentage', operator: '>=', value: '60' }]
  );
  const [selectedComponents, setSelectedComponents] = useState([]);

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), field: '', operator: '>=', value: '' }]);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const conditionFields = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'attendance', label: 'Attendance %' },
  { value: 'category', label: 'Category' },
  { value: 'gender', label: 'Gender' },
  { value: 'sibling', label: 'Sibling Studying' },
  { value: 'entrance', label: 'Entrance Score' }];


  const operators = [
  { value: '>=', label: '≥' },
  { value: '<=', label: '≤' },
  { value: '=', label: '=' },
  { value: '!=', label: '≠' }];


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarship & Concession Rules</h1>
          <p className="text-sm text-gray-500">Define eligibility, benefits, and approval workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button variant="primary"><Save className="w-4 h-4 mr-2" />Save Rules</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 1: Master Configuration */}
        <Card title="1. Rule Master" className="lg:col-span-1">
          <div className="space-y-4">
            <Input label="Rule Name" placeholder="e.g., Merit Scholarship 2024" />
            
            <Select
              label="Rule Type"
              options={[
              { value: 'scholarship', label: 'Scholarship' },
              { value: 'concession', label: 'Concession' }]
              } />


            <Select
              label="Academic Year"
              options={[
              { value: '2024-25', label: '2024-25' },
              { value: '2025-26', label: '2025-26' }]
              } />


            <Select
              label="Applicable Classes"
              options={[
              { value: 'all', label: 'All Classes' },
              { value: '9-12', label: 'Class 9-12' },
              { value: 'custom', label: 'Select Classes...' }]
              } />


            <Select
              label="Student Category"
              options={[
              { value: 'all', label: 'All Categories' },
              { value: 'general', label: 'General' },
              { value: 'sc-st', label: 'SC/ST' },
              { value: 'obc', label: 'OBC' }]
              } />


            <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Active Status</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </label>
          </div>
        </Card>

        {/* SECTION 2: Eligibility Rule Builder */}
        <Card title="2. Eligibility Rule Builder" className="lg:col-span-2">
          <div className="space-y-4">
            {conditions.map((condition, index) =>
            <div key={condition.id} className="flex gap-2 items-end">
                {index > 0 &&
              <Select
                options={[
                { value: 'and', label: 'AND' },
                { value: 'or', label: 'OR' }]
                }
                defaultValue="and"
                className="w-20" />

              }
                <Select
                label={index === 0 ? "Field" : ""}
                options={conditionFields}
                defaultValue={condition.field}
                className="flex-1" />

                <Select
                label={index === 0 ? "Operator" : ""}
                options={operators}
                defaultValue={condition.operator}
                className="w-20" />

                <Input
                label={index === 0 ? "Value" : ""}
                defaultValue={condition.value}
                className="flex-1" />

                <Button variant="ghost" onClick={() => removeCondition(condition.id)} className="mb-1">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={addCondition} className="w-full">
              <Plus className="w-4 h-4 mr-2" />Add Condition
            </Button>
          </div>
        </Card>

        {/* SECTION 3: Benefit Definition */}
        <Card title="3. Benefit Definition" className="lg:col-span-1">
          <div className="space-y-4">
            <Select
              label="Benefit Type"
              options={[
              { value: 'percentage', label: 'Percentage Discount' },
              { value: 'fixed', label: 'Fixed Amount' },
              { value: 'component', label: 'Component-Specific' }]
              } />


            <Input label="Discount Value" type="number" placeholder="e.g., 50 or 5000" />

            <div className="p-3 border rounded-lg bg-gray-50">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Fee Components</label>
              {['Tuition Fee', 'Transport Fee', 'Library Fee', 'Lab Fee'].map((comp) =>
              <label key={comp} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-600">{comp}</span>
                </label>
              )}
            </div>

            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700">Apply Before Late Fee</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </label>
          </div>
        </Card>

        {/* SECTION 4: Limits & Controls */}
        <Card title="4. Limits & Controls" className="lg:col-span-1">
          <div className="space-y-4">
            <Input label="Max Benefit Amount (₹)" type="number" placeholder="e.g., 50000" />
            <Input label="Max Students Allowed" type="number" placeholder="e.g., 100" />
            
            <Select
              label="Benefit Frequency"
              options={[
              { value: 'per-installment', label: 'Per Installment' },
              { value: 'annual', label: 'Annual' }]
              } />


            <label className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 cursor-pointer">
              <span className="text-sm text-gray-700">Auto Disable at Limit</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
            </label>
          </div>
        </Card>

        {/* SECTION 5: Application & Approval */}
        <Card title="5. Application & Approval" className="lg:col-span-1">
          <div className="space-y-4">
            {[
            { label: 'Student Can Apply', checked: true },
            { label: 'Document Upload Required', checked: true },
            { label: 'Approval Workflow Required', checked: true },
            { label: 'Auto Renewal Next Year', checked: false }].
            map((item) =>
            <label key={item.label} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-700">{item.label}</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked={item.checked} />
              </label>
            )}

            <Select
              label="Approval Role"
              options={[
              { value: 'principal', label: 'Principal' },
              { value: 'accountant', label: 'Accountant' },
              { value: 'committee', label: 'Scholarship Committee' }]
              } />

          </div>
        </Card>

        {/* SECTION 6: Conflict Handling */}
        <Card title="6. Conflict Handling (Multi-Concession)">
          <div className="space-y-4">
            <Select
              label="If Multiple Eligible, Apply"
              options={[
              { value: 'highest', label: 'Only Highest Benefit' },
              { value: 'combine', label: 'Combine All Benefits' },
              { value: 'priority', label: 'Based on Priority Order' }]
              }
              defaultValue="highest" />


            <div className="p-3 border rounded-lg bg-blue-50">
              <div className="text-sm font-medium text-gray-700 mb-2">Priority Order (Drag to reorder)</div>
              {['Merit Scholarship', 'Need-based Concession', 'Sibling Discount'].map((rule, idx) =>
              <div key={rule} className="flex items-center gap-2 p-2 mb-1 bg-white rounded border">
                  <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm flex-1">{rule}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Summary */}
      <Card title="Rule Summary Preview">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">50%</div>
              <div className="text-xs text-gray-600">Max Discount</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">100</div>
              <div className="text-xs text-gray-600">Max Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{conditions.length}</div>
              <div className="text-xs text-gray-600">Eligibility Rules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">Active</div>
              <div className="text-xs text-gray-600">Current Status</div>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}