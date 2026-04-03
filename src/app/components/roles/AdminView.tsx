import { useState, useEffect } from 'react';
import { User } from '../../App';
import { NavigationItem } from '../Dashboard';
import { DataTable } from '../DataTable';
import { Users, FileText, Activity, Shield, AlertTriangle, Clock } from 'lucide-react';
import { SettingsView } from '../SettingsView';
import { AuditLogView } from '../AuditLogView';
import { AdminAnalyticsView } from '../AdminAnalyticsView';
import { AdminAllCasesView } from '../AdminAllCasesView';
import { QuestionnaireManagementView } from '../QuestionnaireManagementView';
import { ConsentFormManagementView } from '../ConsentFormManagementView';
import { AdminRefundView } from '../AdminRefundView';
import { AdminUserManagement } from '../AdminUserManagement';

interface AdminViewProps {
  activeNav: NavigationItem;
  user: User;
}

export function AdminView({ activeNav, user }: AdminViewProps) {
  const [contentView, setContentView] = useState<'overview' | 'questionnaires' | 'consent-forms'>('overview');

  // Reset content view when navigating away from content management
  useEffect(() => {
    if (activeNav !== 'content') {
      setContentView('overview');
    }
  }, [activeNav]);
  if (activeNav === 'home') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            System overview and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Total Users
              </h3>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">1,247</p>
            <p className="text-xs text-green-600 mt-1">+23 this week</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Active Cases
              </h3>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">157</p>
            <p className="text-xs text-gray-500 mt-1">Across all doctors</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                System Health
              </h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">99.8%</p>
            <p className="text-xs text-green-600 mt-1">All systems operational</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Compliance
              </h3>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">100%</p>
            <p className="text-xs text-gray-500 mt-1">GDPR compliant</p>
          </div>
        </div>

        {/* SLA Breach Alerts */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">SLA Breach Alerts</h2>
            <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">2 Active</span>
          </div>
          <div className="space-y-3">
            {[
              { caseId: '#1228', doctor: 'Dr. Anna Hoffmann', patient: 'Klaus Bauer', claimedAt: '72h 14m ago', specialty: 'General Medicine' },
              { caseId: '#1225', doctor: 'Dr. Thomas Klein', patient: 'Petra Schulz', claimedAt: '73h 42m ago', specialty: 'Dermatology' },
            ].map((alert) => (
              <div key={alert.caseId} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{alert.caseId}</span>
                      <span className="text-sm text-gray-600">• {alert.specialty}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Assigned to <strong>{alert.doctor}</strong> for {alert.claimedAt} — patient: {alert.patient}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">SLA Breached</span>
                  <button className="px-3 py-1.5 border border-red-300 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
                    Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {[
                {
                  action: 'New user registration',
                  user: 'patient@example.com',
                  time: '5 min ago',
                  type: 'user',
                },
                {
                  action: 'Case approved',
                  user: 'Dr. Weber',
                  time: '12 min ago',
                  type: 'case',
                },
                {
                  action: 'Prescription fulfilled',
                  user: 'Pharmacy Alpha',
                  time: '23 min ago',
                  type: 'pharmacy',
                },
                {
                  action: 'System backup completed',
                  user: 'Automated',
                  time: '1 hour ago',
                  type: 'system',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.type === 'user'
                        ? 'bg-blue-50 text-blue-700'
                        : activity.type === 'case'
                        ? 'bg-green-50 text-green-700'
                        : activity.type === 'pharmacy'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Alerts
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Scheduled Maintenance
                  </p>
                  <p className="text-xs text-yellow-800 mt-1">
                    System update planned for Apr 5, 2:00 AM - 4:00 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    2 Refunds Pending
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    2 refund requests awaiting admin approval
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Backup Successful
                  </p>
                  <p className="text-xs text-green-800 mt-1">
                    Daily backup completed successfully at 3:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'users') {
    return <AdminUserManagement user={user} />;
  }

  if (activeNav === 'cases') {
    return <AdminAllCasesView user={user} />;
  }

  if (activeNav === 'analytics') {
    return <AdminAnalyticsView user={user} />;
  }

  if (activeNav === 'content') {
    if (contentView === 'questionnaires') {
      return <QuestionnaireManagementView user={user} onBack={() => setContentView('overview')} />;
    }

    if (contentView === 'consent-forms') {
      return <ConsentFormManagementView user={user} onBack={() => setContentView('overview')} />;
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Content Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage questionnaires, consent forms, and platform content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questionnaires */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Questionnaires
              </h2>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                3 Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Specialty-specific question sets for patient consultations
            </p>
            <div className="space-y-3">
              {[
                {
                  name: 'Hair Loss',
                  questions: 7,
                  updated: '2 days ago',
                },
                {
                  name: 'Dermatology',
                  questions: 8,
                  updated: '1 week ago',
                },
                {
                  name: 'General Medicine',
                  questions: 8,
                  updated: '3 days ago',
                },
              ].map((questionnaire, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {questionnaire.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {questionnaire.questions} questions • Updated{' '}
                        {questionnaire.updated}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setContentView('questionnaires')}
              className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Manage Questionnaires
            </button>
          </div>

          {/* Consent Forms */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Consent Forms
              </h2>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                GDPR
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Legal consent templates and privacy policies
            </p>
            <div className="space-y-3">
              {[
                { name: 'Privacy Policy', version: 'v2.1' },
                { name: 'Terms of Service', version: 'v1.8' },
                { name: 'Medical Consent', version: 'v3.0' },
                { name: 'Data Processing', version: 'v2.5' },
              ].map((form, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {form.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {form.version}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setContentView('consent-forms')}
              className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Manage Consent Forms
            </button>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Email Templates
              </h2>
              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                12 Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Automated email notifications and communications
            </p>
            <div className="space-y-3">
              {[
                { name: 'Welcome Email', usage: '45/week' },
                { name: 'Case Approved', usage: '120/week' },
                { name: 'Prescription Ready', usage: '95/week' },
                { name: 'Appointment Reminder', usage: '78/week' },
              ].map((template, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {template.usage}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Manage Email Templates
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Dynamic Questionnaire System
              </h3>
              <p className="text-sm text-blue-800">
                The platform uses specialty-specific questionnaires to gather
                detailed patient information. Each specialty (Dermatology,
                General Medicine, Mental Health) has a customized question set
                that adapts to patient responses. Admins can edit questions,
                add new specialties, and manage validation rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'audit-logs') {
    return <AuditLogView user={user} />;
  }

  if (activeNav === 'settings') {
    return <SettingsView user={user} />;
  }

  if (activeNav === 'refunds') {
    return <AdminRefundView user={user} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        {activeNav.toUpperCase()}
      </h1>
      <p className="text-gray-600 mt-2">Content for {activeNav}</p>
    </div>
  );
}