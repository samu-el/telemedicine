import { useState } from 'react';
import { User } from '../../App';
import { NavigationItem } from '../Dashboard';
import { DataTable } from '../DataTable';
import { Clock, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { MessagesView } from '../MessagesView';
import { SettingsView } from '../SettingsView';
import { ScheduleView } from '../ScheduleView';
import { CaseDetailView } from '../CaseDetailView';

interface DoctorViewProps {
  activeNav: NavigationItem;
  user: User;
}

export function DoctorView({ activeNav, user }: DoctorViewProps) {
  const [viewingCaseId, setViewingCaseId] = useState<string | null>(null);

  // If viewing a case detail, show that instead
  if (viewingCaseId) {
    return (
      <CaseDetailView
        user={user}
        caseId={viewingCaseId}
        onBack={() => setViewingCaseId(null)}
      />
    );
  }
  if (activeNav === 'home') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, Dr. {user.name.split(' ')[1] || user.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Here's your patient review dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Reviews
              </h3>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">5</p>
            <p className="text-xs text-orange-600 mt-1">Needs attention</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Completed Today
              </h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-1">Great progress</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Avg Response Time
              </h3>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">2.5h</p>
            <p className="text-xs text-green-600 mt-1">-30 min vs yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">287</p>
            <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Priority Cases
          </h2>
          <div className="space-y-3">
            {[
              {
                caseId: '#1234',
                patient: 'Emma Schmidt',
                condition: 'Hair Loss Treatment',
                specialty: 'Dermatology',
                submitted: '3 hours ago',
                priority: 'high',
              },
              {
                caseId: '#1233',
                patient: 'Max Weber',
                condition: 'Skin Condition Assessment',
                specialty: 'Dermatology',
                submitted: '5 hours ago',
                priority: 'high',
              },
              {
                caseId: '#1232',
                patient: 'Lisa Müller',
                condition: 'Acne Treatment Follow-up',
                specialty: 'Dermatology',
                submitted: '1 day ago',
                priority: 'medium',
              },
            ].map((case_) => (
              <div
                key={case_.caseId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {case_.patient
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {case_.caseId}
                      </span>
                      <span className="text-sm text-gray-600">
                        {case_.patient}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          case_.priority === 'high'
                            ? 'bg-red-500'
                            : 'bg-orange-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {case_.condition}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {case_.submitted}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingCaseId(case_.caseId)}
                  className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'reviews') {
    const columns = [
      { key: 'caseId', label: 'CASE ID' },
      { key: 'patient', label: 'PATIENT' },
      { key: 'condition', label: 'CONDITION' },
      { key: 'date', label: 'SUBMITTED' },
      { key: 'status', label: 'STATUS' },
      { key: 'priority', label: 'PRIORITY' },
    ];

    const data = [
      {
        id: '1',
        caseId: '#1234',
        patient: 'Emma Schmidt',
        patientAvatar: 'ES',
        condition: 'Hair Loss Treatment',
        date: 'Apr 2, 2026',
        status: 'pending',
        priority: 'high',
      },
      {
        id: '2',
        caseId: '#1233',
        patient: 'Max Weber',
        patientAvatar: 'MW',
        condition: 'Skin Condition',
        date: 'Apr 2, 2026',
        status: 'in-review',
        priority: 'high',
      },
      {
        id: '3',
        caseId: '#1232',
        patient: 'Lisa Müller',
        patientAvatar: 'LM',
        condition: 'Acne Treatment',
        date: 'Apr 1, 2026',
        status: 'pending',
        priority: 'medium',
      },
      {
        id: '4',
        caseId: '#1231',
        patient: 'Tom Fischer',
        patientAvatar: 'TF',
        condition: 'Anxiety Management',
        date: 'Apr 1, 2026',
        status: 'approved',
        priority: 'low',
      },
      {
        id: '5',
        caseId: '#1230',
        patient: 'Anna Becker',
        patientAvatar: 'AB',
        condition: 'Sleep Issues',
        date: 'Mar 31, 2026',
        status: 'completed',
        priority: 'medium',
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Case Reviews
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Review patient consultations and provide medical decisions
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data}
          showAvatar
          onRowClick={(row) => setViewingCaseId(row.caseId)}
        />
      </div>
    );
  }

  if (activeNav === 'patients') {
    const columns = [
      { key: 'name', label: 'NAME' },
      { key: 'email', label: 'EMAIL' },
      { key: 'totalCases', label: 'TOTAL CASES' },
      { key: 'lastVisit', label: 'LAST VISIT' },
      { key: 'status', label: 'STATUS' },
      { key: 'priority', label: 'PRIORITY' },
    ];

    const data = [
      {
        id: '1',
        name: 'Emma Schmidt',
        patientAvatar: 'ES',
        email: 'emma.s@example.com',
        totalCases: '5',
        lastVisit: 'Apr 2, 2026',
        status: 'active',
        priority: 'high',
      },
      {
        id: '2',
        name: 'Max Weber',
        patientAvatar: 'MW',
        email: 'max.w@example.com',
        totalCases: '3',
        lastVisit: 'Apr 1, 2026',
        status: 'active',
        priority: 'medium',
      },
      {
        id: '3',
        name: 'Lisa Müller',
        patientAvatar: 'LM',
        email: 'lisa.m@example.com',
        totalCases: '8',
        lastVisit: 'Mar 30, 2026',
        status: 'active',
        priority: 'low',
      },
      {
        id: '4',
        name: 'Tom Fischer',
        patientAvatar: 'TF',
        email: 'tom.f@example.com',
        totalCases: '2',
        lastVisit: 'Mar 25, 2026',
        status: 'inactive',
        priority: 'low',
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Patients
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your patient roster and history
            </p>
          </div>
        </div>

        <DataTable columns={columns} data={data} showAvatar />
      </div>
    );
  }

  if (activeNav === 'schedule') {
    return <ScheduleView user={user} onCaseClick={setViewingCaseId} />;
  }

  if (activeNav === 'messages') {
    return <MessagesView user={user} />;
  }

  if (activeNav === 'settings') {
    return <SettingsView user={user} />;
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
