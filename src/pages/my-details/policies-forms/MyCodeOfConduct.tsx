import React, { useState } from 'react';
import {
  Shield,
  Book,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  HelpCircle } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
export function MyCodeOfConduct() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'behaviour'
  );
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const sections = [
  {
    id: 'behaviour',
    title: 'Behaviour Expectations',
    content:
    'Students are expected to maintain high standards of behavior at all times within the school premises. Respect for teachers, staff, and fellow students is paramount. Bullying, harassment, or any form of discrimination will not be tolerated.'
  },
  {
    id: 'dress',
    title: 'Dress Code & Uniform',
    content:
    'All students must wear the prescribed school uniform. It should be clean and ironed. Black shoes and white socks are mandatory. Hair must be neatly groomed. Accessories and jewelry are not permitted.'
  },
  {
    id: 'academic',
    title: 'Academic Honesty',
    content:
    'Plagiarism, cheating in exams, or copying assignments is strictly prohibited. Any student found violating academic integrity rules will face disciplinary action including grade reduction or suspension.'
  },
  {
    id: 'discipline',
    title: 'Disciplinary Procedures',
    content:
    'Minor offenses will result in verbal warnings. Repeated offenses may lead to detention or parent meetings. Serious misconduct can result in suspension or expulsion as decided by the Disciplinary Committee.'
  }];

  const faqs = [
  {
    q: 'What happens if I forget my ID card?',
    a: 'You must report to the reception immediately to get a temporary pass.'
  },
  {
    q: 'Can I bring a mobile phone?',
    a: 'Mobile phones are strictly prohibited for students during school hours.'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Code of Conduct</h1>
          <p className="text-sm text-gray-500">
            Rules and regulations governing student life.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map((section) =>
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

              <button
              onClick={() =>
              setExpandedSection(
                expandedSection === section.id ? null : section.id
              )
              }
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-900">
                    {section.title}
                  </span>
                </div>
                {expandedSection === section.id ?
              <ChevronUp className="w-5 h-5 text-gray-400" /> :

              <ChevronDown className="w-5 h-5 text-gray-400" />
              }
              </button>
              {expandedSection === section.id &&
            <div className="p-4 pt-0 text-gray-700 leading-relaxed border-t border-gray-100 mt-2 bg-gray-50/50">
                  {section.content}
                </div>
            }
            </div>
          )}

          {/* Acknowledgement */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <CheckSquare className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900">Acknowledgement</h3>
                <p className="text-sm text-blue-800 mt-1 mb-4">
                  I have read and understood the Code of Conduct and agree to
                  abide by these rules.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ack"
                    checked={isAcknowledged}
                    onChange={(e) => setIsAcknowledged(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />

                  <label
                    htmlFor="ack"
                    className="text-sm font-medium text-blue-900">

                    I Acknowledge
                  </label>
                </div>
                <div className="mt-4">
                  <Button variant="primary" disabled={!isAcknowledged}>
                    Submit Acknowledgement
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Frequently Asked Questions">
            <div className="space-y-4">
              {faqs.map((faq, idx) =>
              <div
                key={idx}
                className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">

                  <p className="text-sm font-bold text-gray-900 flex gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 ml-6">{faq.a}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
            <h3 className="font-bold text-red-900 mb-2">Important Note</h3>
            <p className="text-sm text-red-800">
              Serious violations may lead to immediate suspension. Please ensure
              you are familiar with the disciplinary procedures.
            </p>
          </Card>
        </div>
      </div>
    </div>);

}