import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft,
  FileText,
  Clock,
  MessageSquare,
  CheckCircle,
  Upload,
  Send,
  Download,
  Receipt,
} from 'lucide-react';

interface PatientCaseDetailViewProps {
  user: User;
  caseId: string;
  onBack: () => void;
}

interface CaseData {
  id: string;
  title: string;
  status: 'submitted' | 'paid' | 'in-review' | 'approved' | 'sent-to-pharmacy' | 'completed';
  createdDate: string;
  lastUpdated: string;
  assignedDoctor: string;
  consultationFee: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  documents: {
    id: string;
    name: string;
    size: string;
  }[];
  messages: {
    from: string;
    message: string;
    timestamp: string;
    isDoctor: boolean;
  }[];
}

export function PatientCaseDetailView({ user, caseId, onBack }: PatientCaseDetailViewProps) {
  const [messageText, setMessageText] = useState('');

  // Mock case data
  const caseData: CaseData = {
    id: caseId,
    title: 'Vitamin Supplements',
    status: 'in-review',
    createdDate: '28. März 2024',
    lastUpdated: '28. März 2024',
    assignedDoctor: 'Dr. Thomas Weber',
    consultationFee: 29.99,
    paymentStatus: 'paid',
    documents: [
      {
        id: '1',
        name: 'Questionnaire Response',
        size: '241 KB',
      },
    ],
    messages: [
      {
        from: 'Dr. Thomas Weber',
        message: 'I have reviewed your questionnaire. I may need to schedule a video consultation.',
        timestamp: '28.3.2024, 17:36:00',
        isDoctor: true,
      },
    ],
  };

  const progressSteps = [
    { id: 'submitted', label: 'Submitted', completed: true },
    { id: 'paid', label: 'Paid', completed: true },
    { id: 'in-review', label: 'In Review', completed: true, current: true },
    { id: 'approved', label: 'Approved', completed: false },
    { id: 'sent-to-pharmacy', label: 'Sent to Pharmacy', completed: false },
    { id: 'completed', label: 'Completed', completed: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-gray-100 text-gray-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'in-review':
        return 'bg-orange-100 text-orange-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'sent-to-pharmacy':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'paid':
        return 'Paid';
      case 'in-review':
        return 'In Review';
      case 'approved':
        return 'Approved';
      case 'sent-to-pharmacy':
        return 'Sent to Pharmacy';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Cases</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{caseData.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(caseData.status)}`}>
                  {getStatusLabel(caseData.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Created {caseData.createdDate}
                </span>
                <span>•</span>
                <span>Dr. {caseData.assignedDoctor}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Contact Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Case Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Case Progress</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track the status of your consultation
              </p>
            </div>

            <div className="space-y-4">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-[#5B6FF8] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    {index < progressSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-2 ${
                          step.completed ? 'bg-[#5B6FF8]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p
                      className={`font-medium ${
                        step.current
                          ? 'text-[#5B6FF8]'
                          : step.completed
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.current && (
                      <p className="text-sm text-gray-600 mt-1">Current status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <p className="text-sm text-gray-600">
                Communication with your healthcare provider
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {caseData.messages.map((msg, index) => (
                <div key={index}>
                  {msg.isDoctor ? (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {msg.from.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {msg.from} • {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <div className="flex-1 max-w-md">
                        <div className="bg-[#5B6FF8] rounded-lg p-4">
                          <p className="text-sm text-white">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {msg.timestamp}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                />
                <button className="px-6 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Case Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Case ID</p>
                <p className="text-sm font-medium text-gray-900">{caseData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Treatment Type</p>
                <p className="text-sm font-medium text-gray-900">{caseData.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">{caseData.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{caseData.lastUpdated}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Assigned Doctor</p>
                <p className="text-sm font-medium text-gray-900">{caseData.assignedDoctor}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <p className="text-base font-semibold text-gray-900">
                  €{caseData.consultationFee.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">VAT (19%)</p>
                <p className="text-sm text-gray-700">€{(caseData.consultationFee * 0.19 / 1.19).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Status</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {caseData.paymentStatus.charAt(0).toUpperCase() + caseData.paymentStatus.slice(1)}
                </span>
              </div>
              {caseData.paymentStatus === 'paid' && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors">
                  <Receipt className="w-4 h-4" />
                  Download Invoice (PDF)
                </button>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3 mb-4">
              {caseData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}