import { User } from '../App';
import { Calendar, FileText, Download, Eye } from 'lucide-react';

interface HistoryViewProps {
  user: User;
}

interface HistoricalRecord {
  id: string;
  type: 'consultation' | 'prescription' | 'document' | 'appointment';
  title: string;
  specialty: string;
  doctor: string;
  date: string;
  status: string;
  summary: string;
  attachments?: number;
}

export function HistoryView({ user }: HistoryViewProps) {
  const history: HistoricalRecord[] = [
    {
      id: '#1234',
      type: 'consultation',
      title: 'Hair Loss Treatment Consultation',
      specialty: 'Dermatology',
      doctor: 'Dr. Michael Weber',
      date: 'Apr 2, 2026',
      status: 'completed',
      summary:
        'Diagnosed with androgenetic alopecia. Prescribed Finasteride 1mg daily for 90 days.',
      attachments: 3,
    },
    {
      id: '#1233',
      type: 'prescription',
      title: 'Finasteride 1mg - 90 day supply',
      specialty: 'Dermatology',
      doctor: 'Dr. Michael Weber',
      date: 'Apr 2, 2026',
      status: 'active',
      summary: 'Take one tablet daily with water. Continue for 3 months.',
    },
    {
      id: '#1232',
      type: 'consultation',
      title: 'Acne Treatment Follow-up',
      specialty: 'Dermatology',
      doctor: 'Dr. Sarah Johnson',
      date: 'Mar 15, 2026',
      status: 'completed',
      summary:
        'Significant improvement noted. Continue current treatment regimen.',
      attachments: 2,
    },
    {
      id: '#1231',
      type: 'document',
      title: 'Blood Test Results',
      specialty: 'General Medicine',
      doctor: 'Dr. James Wilson',
      date: 'Mar 1, 2026',
      status: 'completed',
      summary: 'All markers within normal range. No action required.',
      attachments: 1,
    },
    {
      id: '#1230',
      type: 'consultation',
      title: 'Anxiety Management Consultation',
      specialty: 'Mental Health',
      doctor: 'Dr. Emma Brown',
      date: 'Feb 20, 2026',
      status: 'completed',
      summary:
        'Discussed coping strategies and prescribed Sertraline 50mg daily.',
      attachments: 0,
    },
    {
      id: '#1229',
      type: 'prescription',
      title: 'Sertraline 50mg - 30 day supply',
      specialty: 'Mental Health',
      doctor: 'Dr. Emma Brown',
      date: 'Feb 20, 2026',
      status: 'expired',
      summary: 'Completed. Follow-up scheduled.',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return '💬';
      case 'prescription':
        return '💊';
      case 'document':
        return '📄';
      case 'appointment':
        return '📅';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      case 'expired':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Medical History</h1>
        <p className="text-sm text-gray-600 mt-1">
          View your complete medical records and consultation history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Total Consultations
            </h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">Since Jan 2025</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Active Prescriptions
            </h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">💊</span>
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">2</p>
          <p className="text-xs text-green-600 mt-1">Currently taking</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Documents</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">Stored securely</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Last Visit</h3>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">Apr 2</p>
          <p className="text-xs text-gray-500 mt-1">2026</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Medical Timeline
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Export All
            </span>
          </button>
        </div>

        <div className="space-y-6">
          {history.map((record, index) => (
            <div key={record.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {getTypeIcon(record.type)}
                </div>
                {index < history.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {record.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{record.specialty}</span>
                        <span>•</span>
                        <span>{record.doctor}</span>
                        <span>•</span>
                        <span>{record.date}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {record.id}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{record.summary}</p>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {record.attachments && record.attachments > 0 && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        {record.attachments}{' '}
                        {record.attachments === 1 ? 'File' : 'Files'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Notice */}
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Your Data Rights (GDPR)
            </h3>
            <p className="text-sm text-blue-800">
              You have the right to access, download, and delete your medical
              records at any time. All data is encrypted and stored securely in
              compliance with GDPR regulations. For data requests, please contact
              our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
