import { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import { NavigationItem } from '../Dashboard';
import { DataTable } from '../DataTable';
import { Calendar, MessageSquare, FileText, Clock } from 'lucide-react';
import {
  DynamicQuestionnaire,
  SpecialtyType,
} from '../DynamicQuestionnaire';
import { MessagesView } from '../MessagesView';
import { HistoryView } from '../HistoryView';
import { SettingsView } from '../SettingsView';
import { PatientCaseDetailView } from '../PatientCaseDetailView';
import { ConsentAcceptanceStep } from '../ConsentAcceptanceStep';
import { getIntakeSession } from '../../lib/intakeSession';

interface PatientViewProps {
  activeNav: NavigationItem;
  user: User;
  onNavigate: (nav: NavigationItem) => void;
}

interface SubmittedCase {
  id: string;
  specialty: SpecialtyType;
  answers: Record<string, any>;
  files: File[];
  submittedAt: Date;
  status: string;
}

export function PatientView({ activeNav, user, onNavigate }: PatientViewProps) {
  const [consultationStep, setConsultationStep] = useState<
    'specialty' | 'consent' | 'questionnaire' | 'documents' | 'payment' | 'confirmation'
  >('specialty');
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialtyType>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, any>
  >({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submittedCases, setSubmittedCases] = useState<SubmittedCase[]>([]);
  const [viewingCaseId, setViewingCaseId] = useState<string | null>(null);
  const intakeBootstrapRef = useRef(false);

  useEffect(() => {
    if (activeNav !== 'new-case') {
      intakeBootstrapRef.current = false;
      return;
    }
    if (intakeBootstrapRef.current) return;
    const intake = getIntakeSession();
    if (intake) {
      intakeBootstrapRef.current = true;
      setSelectedSpecialty(intake.specialty);
      setConsultationStep('consent');
    }
  }, [activeNav]);

  if (activeNav === 'home') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Here's an overview of your health consultations
            </p>
          </div>
          <button
            onClick={() => onNavigate('new-case')}
            className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
          >
            Start New Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Active Cases
              </h3>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">2</p>
            <p className="text-xs text-blue-600 mt-1">In review</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Completed
              </h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
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
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">8</p>
            <p className="text-xs text-gray-500 mt-1">This year</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Next Appointment
              </h3>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">Apr 5</p>
            <p className="text-xs text-gray-500 mt-1">3 days away</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Messages</h3>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">3</p>
            <p className="text-xs text-orange-600 mt-1">Unread</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Cases
            </h2>
            <div className="space-y-3">
              {[
                {
                  caseId: '#1234',
                  specialty: 'Dermatology',
                  condition: 'Hair Loss Treatment',
                  status: 'in-review',
                  date: 'Apr 2, 2026',
                },
                {
                  caseId: '#1233',
                  specialty: 'General',
                  condition: 'Skin Condition',
                  status: 'pending',
                  date: 'Apr 1, 2026',
                },
              ].map((case_) => (
                <div
                  key={case_.caseId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {case_.caseId}
                      </span>
                      <span className="text-sm text-gray-600">
                        {case_.specialty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {case_.condition}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {case_.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        case_.status === 'in-review'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {case_.status
                        .split('-')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </span>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  type: 'message',
                  title: 'New message from Dr. Weber',
                  time: '2 hours ago',
                  icon: MessageSquare,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  type: 'prescription',
                  title: 'Prescription approved',
                  time: '1 day ago',
                  icon: FileText,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                },
                {
                  type: 'appointment',
                  title: 'Appointment scheduled',
                  time: '2 days ago',
                  icon: Calendar,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'cases') {
    // If viewing a specific case, show case details
    if (viewingCaseId) {
      return (
        <PatientCaseDetailView
          user={user}
          caseId={viewingCaseId}
          onBack={() => setViewingCaseId(null)}
        />
      );
    }

    // Default case list view
    const columns = [
      { key: 'caseId', label: 'CASE ID' },
      { key: 'specialty', label: 'SPECIALTY' },
      { key: 'condition', label: 'CONDITION' },
      { key: 'date', label: 'DATE' },
      { key: 'status', label: 'STATUS' },
      { key: 'priority', label: 'PRIORITY' },
    ];

    // Merge submitted cases with mock data
    const mockCases = [
      {
        id: '2',
        caseId: '#1233',
        specialty: 'General',
        condition: 'Skin Condition',
        date: 'Apr 1, 2026',
        status: 'in-review',
        priority: 'medium',
      },
      {
        id: '3',
        caseId: '#1232',
        specialty: 'Dermatology',
        condition: 'Acne Treatment',
        date: 'Mar 30, 2026',
        status: 'approved',
        priority: 'low',
      },
      {
        id: '4',
        caseId: '#1231',
        specialty: 'Mental Health',
        condition: 'Anxiety Management',
        date: 'Mar 28, 2026',
        status: 'completed',
        priority: 'medium',
      },
      {
        id: '5',
        caseId: '#1230',
        specialty: 'General',
        condition: 'Sleep Issues',
        date: 'Mar 25, 2026',
        status: 'completed',
        priority: 'low',
      },
    ];

    const specialtyNames: Record<string, string> = {
      dermatology: 'Dermatology',
      general: 'General Medicine',
      'mental-health': 'Mental Health',
    };

    const submittedCasesForTable = submittedCases.map((c, index) => ({
      id: c.id,
      caseId: c.id,
      specialty: specialtyNames[c.specialty || ''] || 'Unknown',
      condition: Object.values(c.answers)[0] || 'Consultation',
      date: c.submittedAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'pending',
      priority: 'high',
    }));

    const data = [...submittedCasesForTable, ...mockCases];

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Cases</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track all your medical consultations
            </p>
          </div>
          <button
            onClick={() => onNavigate('new-case')}
            className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
          >
            Start New Consultation
          </button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          onRowClick={(row) => setViewingCaseId(row.caseId)}
        />
      </div>
    );
  }

  if (activeNav === 'new-case') {
    const intakeSnap = getIntakeSession();
    const preAuthQuestionnaireDone = Boolean(intakeSnap?.questionnaireCompletedAt);
    const preAuthDocumentsDone = Boolean(intakeSnap?.documentsCompletedAt);
    const preAuthPaymentDone = Boolean(intakeSnap?.paymentCompletedAt);
    const preAuthFullIntakeDone =
      preAuthQuestionnaireDone && preAuthDocumentsDone && preAuthPaymentDone;

    const specialties = [
      {
        id: 'dermatology' as SpecialtyType,
        name: 'Dermatology',
        desc: 'Skin, hair & nail conditions',
        icon: '🩺',
      },
      {
        id: 'general' as SpecialtyType,
        name: 'General Medicine',
        desc: 'Common health issues',
        icon: '⚕️',
      },
      {
        id: 'mental-health' as SpecialtyType,
        name: 'Mental Health',
        desc: 'Psychological support',
        icon: '🧠',
      },
    ];

    const handleSpecialtySelect = (specialtyId: SpecialtyType) => {
      setSelectedSpecialty(specialtyId);
      setConsultationStep('consent');
    };

    const handleQuestionnaireSubmit = (answers: Record<string, any>) => {
      setQuestionnaireAnswers(answers);
      setConsultationStep('documents');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setUploadedFiles(Array.from(e.target.files));
      }
    };

    const handleFinalSubmit = () => {
      const newCase: SubmittedCase = {
        id: `#${1234 + submittedCases.length}`,
        specialty: selectedSpecialty,
        answers: questionnaireAnswers,
        files: uploadedFiles,
        submittedAt: new Date(),
        status: 'pending',
      };

      // Add to submitted cases
      setSubmittedCases([newCase, ...submittedCases]);

      // Set the viewing case ID to show the case details
      setViewingCaseId(newCase.id);

      // Reset form
      setConsultationStep('specialty');
      setSelectedSpecialty(null);
      setQuestionnaireAnswers({});
      setUploadedFiles([]);
    };

    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Start New Consultation
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Complete the following steps to submit your consultation
            </p>
            {intakeSnap && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                Your <strong>pre-signup treatment choice</strong> is applied to this consultation.
                {preAuthFullIntakeDone && (
                  <span className="block mt-1">
                    Your <strong>full pre-account intake</strong> (questionnaire, documents, payment) is on file — after consents you can review and submit your case.
                  </span>
                )}
                {preAuthQuestionnaireDone && !preAuthFullIntakeDone && (
                  <span className="block mt-1">
                    Partial pre-signup data on file — complete remaining steps in the portal if needed.
                  </span>
                )}
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2">
              {[
                { id: 'specialty', label: 'Select Treatment', icon: '📋', completed: !!selectedSpecialty },
                { id: 'consent', label: 'Consent', icon: '✍️', completed: consultationStep === 'questionnaire' || consultationStep === 'documents' || consultationStep === 'payment' || consultationStep === 'confirmation' },
                {
                  id: 'questionnaire',
                  label: 'Questionnaire',
                  icon: '📝',
                  completed:
                    Object.keys(questionnaireAnswers).length > 0 || preAuthQuestionnaireDone,
                },
                {
                  id: 'documents',
                  label: 'Documents',
                  icon: '📎',
                  completed:
                    consultationStep === 'payment' ||
                    consultationStep === 'confirmation' ||
                    preAuthDocumentsDone,
                },
                {
                  id: 'payment',
                  label: 'Payment',
                  icon: '💳',
                  completed: consultationStep === 'confirmation' || preAuthPaymentDone,
                },
                { id: 'confirmation', label: 'Confirmation', icon: '✅', completed: false },
              ].map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      consultationStep === step.id
                        ? 'bg-[#5B6FF8] text-white'
                        : step.completed
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    <span className="text-base">{step.icon}</span>
                    <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
                  </div>
                  {index < 5 && (
                    <svg className="w-4 h-4 mx-1.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {consultationStep === 'specialty' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Select Specialty
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty.id}
                        onClick={() => handleSpecialtySelect(specialty.id)}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#5B6FF8] hover:bg-blue-50 transition-all text-left group"
                      >
                        <div className="text-3xl mb-3">{specialty.icon}</div>
                        <div className="font-semibold text-gray-900 group-hover:text-[#5B6FF8] transition-colors">
                          {specialty.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {specialty.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">What to expect</p>
                    <p className="text-blue-800 mt-1">
                      After selecting a specialty, you'll answer tailored
                      questions to help our doctors understand your condition
                      better.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {consultationStep === 'consent' && (
              <ConsentAcceptanceStep
                onAccepted={() => {
                  const snap = getIntakeSession();
                  const hasQ = Boolean(snap?.questionnaireCompletedAt);
                  const hasDocs = snap?.documentsCompletedAt;
                  const hasPay = snap?.paymentCompletedAt;
                  if (hasQ && hasDocs && hasPay) {
                    setConsultationStep('confirmation');
                  } else if (hasQ) {
                    setConsultationStep('documents');
                  } else {
                    setConsultationStep('questionnaire');
                  }
                }}
                onBack={() => { setConsultationStep('specialty'); setSelectedSpecialty(null); }}
              />
            )}

            {consultationStep === 'questionnaire' && (
              <DynamicQuestionnaire
                specialty={selectedSpecialty}
                onSubmit={handleQuestionnaireSubmit}
                onBack={() => {
                  setConsultationStep('specialty');
                  setSelectedSpecialty(null);
                }}
              />
            )}

            {consultationStep === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Supporting Documents
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload photos or documents that will help the doctor assess
                    your condition (optional)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#5B6FF8] transition-colors cursor-pointer"
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </label>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        Uploaded files:
                      </p>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <button
                            onClick={() =>
                              setUploadedFiles(
                                uploadedFiles.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                  <div className="text-sm text-green-900">
                    <p className="font-medium">Almost done!</p>
                    <p className="text-green-800 mt-1">
                      Once submitted, a licensed physician will review your
                      consultation within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      setConsultationStep(
                        preAuthFullIntakeDone ? 'consent' : preAuthQuestionnaireDone ? 'consent' : 'questionnaire'
                      )
                    }
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setConsultationStep('payment')}
                    className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {consultationStep === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Consultation fee: €29.99
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-blue-800 mt-1">
                        Your payment information is encrypted and secure. Payment will only be processed after your consultation is approved.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border-2 border-[#5B6FF8] bg-blue-50 rounded-lg text-left">
                        <div className="font-semibold text-gray-900">Credit Card</div>
                        <div className="text-sm text-gray-600 mt-1">Visa, Mastercard</div>
                      </button>
                      <button className="p-4 border-2 border-gray-200 rounded-lg text-left hover:border-gray-300">
                        <div className="font-semibold text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-600 mt-1">Quick checkout</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setConsultationStep('documents')}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setConsultationStep('confirmation')}
                    className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Review & Confirm
                  </button>
                </div>
              </div>
            )}

            {consultationStep === 'confirmation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Review Your Consultation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please review all information before submitting
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Specialty</h4>
                    <p className="text-sm text-gray-600">
                      {selectedSpecialty === 'dermatology' ? 'Dermatology' : selectedSpecialty === 'general' ? 'General Medicine' : 'Mental Health'}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Questionnaire</h4>
                    <p className="text-sm text-gray-600">
                      {Object.keys(questionnaireAnswers).length > 0
                        ? `${Object.keys(questionnaireAnswers).length} questions answered`
                        : preAuthQuestionnaireDone
                          ? 'Completed during pre-signup (responses not stored in this browser)'
                          : '—'}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.length > 0
                        ? `${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'file' : 'files'} uploaded`
                        : intakeSnap?.documentFileNames && intakeSnap.documentFileNames.length > 0
                          ? `${intakeSnap.documentFileNames.length} file(s) from pre-signup: ${intakeSnap.documentFileNames.join(', ')}`
                          : 'No files uploaded'}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                    <p className="text-sm text-gray-600">
                      €29.99
                      {intakeSnap?.paymentMethodLabel
                        ? ` — ${intakeSnap.paymentMethodLabel}`
                        : ' — Credit Card'}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-green-900">
                      <p className="font-medium">Ready to Submit</p>
                      <p className="text-green-800 mt-1">
                        A licensed physician will review your consultation within 24 hours. You'll receive email notifications about your consultation status.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      setConsultationStep(preAuthFullIntakeDone ? 'consent' : 'payment')
                    }
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Submit Consultation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeNav === 'messages') {
    return <MessagesView user={user} />;
  }

  if (activeNav === 'history') {
    return <HistoryView user={user} />;
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