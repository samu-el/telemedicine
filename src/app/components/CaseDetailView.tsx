import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft,
  FileText,
  Clock,
  MessageSquare,
  Video,
  AlertCircle,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import { DoctorDecisionModals } from './DoctorDecisionModals';

interface CaseDetailViewProps {
  user: User;
  caseId: string;
  onBack: () => void;
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface CaseData {
  id: string;
  patientName: string;
  patientAvatar: string;
  patientEmail: string;
  patientDOB: string;
  patientGender: string;
  specialty: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  paymentStatus: 'paid' | 'pending' | 'failed';
  submittedAt: string;
  waitingTime: string;
  questionnaire: QuestionAnswer[];
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }[];
  medicalAlerts: string[];
  patientHistory: {
    date: string;
    type: string;
    description: string;
    doctor?: string;
  }[];
}

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export function CaseDetailView({ user, caseId, onBack }: CaseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'documents' | 'history' | 'messages' | 'prescription'>('questionnaire');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [newPrescription, setNewPrescription] = useState<Prescription>({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    quantity: 0,
  });
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [caseStatus, setCaseStatus] = useState<'pending' | 'in-review' | 'approved' | 'rejected' | 'completed'>('in-review');

  // Mock case data
  const caseData: CaseData = {
    id: caseId,
    patientName: 'Max Müller',
    patientAvatar: 'MM',
    patientEmail: 'max.mueller@email.de',
    patientDOB: 'January 15, 1985',
    patientGender: 'Male',
    specialty: 'Vitamin Supplements',
    status: 'in-review',
    priority: 'medium',
    paymentStatus: 'paid',
    submittedAt: '28.3.2024',
    waitingTime: '1h48m waiting',
    questionnaire: [
      { question: 'What is your biological sex?', answer: 'Male' },
      { question: 'What is your current weight (kg)?', answer: '82' },
      { question: 'What is your height (cm)?', answer: '178' },
      { question: 'Do you have any known allergies to medications?', answer: 'No' },
      { question: 'Do you currently have any of the following conditions?', answer: 'None of the above' },
      { question: 'Please list any medications you are currently taking.', answer: 'None' },
      { question: 'Have you used this type of medication before?', answer: 'No, this is my first time' },
      {
        question: 'Please describe your main symptoms or reason for seeking treatment.',
        answer: 'I have been experiencing symptoms for the past 3 months and would like to explore treatment options.',
      },
    ],
    documents: [
      {
        id: '1',
        name: 'blood_test_results.pdf',
        type: 'PDF',
        size: '2.4 MB',
        uploadedAt: '28.3.2024',
      },
      {
        id: '2',
        name: 'previous_prescription.jpg',
        type: 'Image',
        size: '1.8 MB',
        uploadedAt: '28.3.2024',
      },
    ],
    medicalAlerts: [
      'No known allergies reported',
      'No current medications',
      'First time using this treatment',
    ],
    patientHistory: [
      {
        date: '15.2.2024',
        type: 'Consultation',
        description: 'General health checkup - All vitals normal',
        doctor: 'Dr. Schmidt',
      },
      {
        date: '10.1.2024',
        type: 'Prescription',
        description: 'Vitamin D supplement - 3 month course',
        doctor: 'Dr. Weber',
      },
      {
        date: '05.12.2023',
        type: 'Lab Results',
        description: 'Blood test - Vitamin D deficiency detected',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'in-review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const isDoctor = user.role === 'doctor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Cases</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                <Clock className="w-4 h-4 inline mr-1" />
                {caseData.waitingTime}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {caseData.patientAvatar}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {caseData.patientName}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      caseData.status
                    )}`}
                  >
                    {caseData.status === 'in-review' ? 'In Review' : caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {caseData.specialty}
                  </span>
                  <span>Submitted {caseData.submittedAt}</span>
                </div>
              </div>
            </div>

            {isDoctor && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Request Info
                </button>
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Schedule Video
                </button>
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('questionnaire')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'questionnaire'
                  ? 'border-[#5B6FF8] text-[#5B6FF8]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Questionnaire
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-[#5B6FF8] text-[#5B6FF8]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[#5B6FF8] text-[#5B6FF8]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient History
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'messages'
                  ? 'border-[#5B6FF8] text-[#5B6FF8]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </button>
            {isDoctor && (
              <button
                onClick={() => setActiveTab('prescription')}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'prescription'
                    ? 'border-[#5B6FF8] text-[#5B6FF8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Prescription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'questionnaire' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Medical Questionnaire</h2>
                <p className="text-sm text-gray-600 mt-1">Submitted on {caseData.submittedAt}</p>
              </div>

              <div className="space-y-6">
                {caseData.questionnaire.map((qa, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <p className="text-sm text-gray-600 mb-2">{qa.question}</p>
                    <p className="text-base text-gray-900 font-medium">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {caseData.documents.length} file(s) uploaded
                </p>
              </div>

              <div className="space-y-3">
                {caseData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        {doc.type === 'PDF' ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.size} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Patient History</h2>
                <p className="text-sm text-gray-600 mt-1">Previous consultations and treatments</p>
              </div>

              <div className="space-y-4">
                {caseData.patientHistory.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      {index < caseData.patientHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{item.type}</span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.doctor && (
                        <p className="text-sm text-gray-500 mt-1">Treated by {item.doctor}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Case Messages</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Communication related to this case
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {caseData.patientAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-900">
                        I've uploaded my recent blood test results. Please let me know if you need
                        any additional information.
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">28.3.2024 10:30</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 max-w-md">
                    <div className="bg-[#5B6FF8] rounded-lg p-3">
                      <p className="text-sm text-white">
                        Thank you. I'll review your information and get back to you shortly.
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">28.3.2024 11:15</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescription' && isDoctor && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Prescription</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Create and manage prescriptions for this case
                  </p>
                </div>
                {!showPrescriptionForm && (
                  <button
                    onClick={() => setShowPrescriptionForm(true)}
                    className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Add Prescription
                  </button>
                )}
              </div>

              {showPrescriptionForm && (
                <div className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-4">New Prescription</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medication Name
                      </label>
                      <input
                        type="text"
                        value={newPrescription.medication}
                        onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                        placeholder="e.g., Vitamin D3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                        placeholder="e.g., 1000 IU"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={newPrescription.frequency}
                        onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      >
                        <option value="">Select frequency</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Every other day">Every other day</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        value={newPrescription.duration}
                        onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      >
                        <option value="">Select duration</option>
                        <option value="7 days">7 days</option>
                        <option value="14 days">14 days</option>
                        <option value="30 days">30 days</option>
                        <option value="60 days">60 days</option>
                        <option value="90 days">90 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={newPrescription.quantity || ''}
                        onChange={(e) => setNewPrescription({ ...newPrescription, quantity: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                      placeholder="Additional instructions for the patient..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (newPrescription.medication && newPrescription.dosage) {
                          setPrescriptions([...prescriptions, newPrescription]);
                          setNewPrescription({
                            medication: '',
                            dosage: '',
                            frequency: '',
                            duration: '',
                            instructions: '',
                            quantity: 0,
                          });
                          setShowPrescriptionForm(false);
                        }
                      }}
                      className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                    >
                      Save Prescription
                    </button>
                    <button
                      onClick={() => {
                        setShowPrescriptionForm(false);
                        setNewPrescription({
                          medication: '',
                          dosage: '',
                          frequency: '',
                          duration: '',
                          instructions: '',
                          quantity: 0,
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {prescriptions.length === 0 && !showPrescriptionForm && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No prescriptions yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add a prescription to order medication for this patient
                  </p>
                </div>
              )}

              {prescriptions.length > 0 && (
                <div className="space-y-4">
                  {prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {prescription.medication}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{prescription.dosage}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Frequency</p>
                          <p className="text-sm font-medium text-gray-900">
                            {prescription.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Duration</p>
                          <p className="text-sm font-medium text-gray-900">
                            {prescription.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="text-sm font-medium text-gray-900">
                            {prescription.quantity} {prescription.quantity === 1 ? 'unit' : 'units'}
                          </p>
                        </div>
                      </div>

                      {prescription.instructions && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700 font-medium mb-1">Instructions</p>
                          <p className="text-sm text-blue-900">{prescription.instructions}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setPrescriptions(prescriptions.filter((_, i) => i !== index));
                          }}
                          className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                        <button className="ml-auto px-4 py-2 text-sm bg-[#5B6FF8] text-white rounded-lg hover:bg-[#4A5FE7] transition-colors">
                          Send to Pharmacy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{caseData.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900">{caseData.patientDOB}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Gender</p>
                <p className="text-sm font-medium text-gray-900">{caseData.patientGender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{caseData.patientEmail}</p>
              </div>
            </div>
          </div>

          {/* Case Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Case Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Case ID</p>
                <p className="text-sm font-medium text-gray-900">{caseData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Treatment Type</p>
                <p className="text-sm font-medium text-gray-900">{caseData.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Priority</p>
                <p className={`text-sm font-medium ${getPriorityColor(caseData.priority)}`}>
                  {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {caseData.paymentStatus.charAt(0).toUpperCase() + caseData.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Medical Alerts</h3>
            </div>
            <ul className="space-y-2">
              {caseData.medicalAlerts.map((alert, index) => (
                <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Modals */}
      {showDecisionModal && isDoctor && (
        <DoctorDecisionModals
          caseId={caseId}
          patientName={caseData.patientName}
          onClose={() => setShowDecisionModal(false)}
          onDecisionMade={(decision, data) => {
            setShowDecisionModal(false);
            if (decision === 'approve') setCaseStatus('approved');
            else if (decision === 'reject') setCaseStatus('rejected');
            else if (decision === 'request-info') setCaseStatus('pending');
          }}
        />
      )}
    </div>
  );
}