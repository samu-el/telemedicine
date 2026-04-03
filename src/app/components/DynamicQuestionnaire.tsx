import { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

export type SpecialtyType = 'dermatology' | 'general' | 'mental-health' | null;

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

interface QuestionnaireSet {
  specialty: string;
  questions: Question[];
}

// Mock questionnaire data - in production, this would come from the backend
const QUESTIONNAIRES: Record<string, QuestionnaireSet> = {
  dermatology: {
    specialty: 'Dermatology',
    questions: [
      {
        id: 'concern',
        type: 'select',
        question: 'What is your primary skin concern?',
        required: true,
        options: [
          'Hair Loss',
          'Acne',
          'Eczema/Dermatitis',
          'Psoriasis',
          'Skin Discoloration',
          'Rosacea',
          'Other',
        ],
      },
      {
        id: 'duration',
        type: 'select',
        question: 'How long have you had this condition?',
        required: true,
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          'More than 1 year',
        ],
      },
      {
        id: 'symptoms',
        type: 'textarea',
        question: 'Please describe your symptoms in detail',
        required: true,
        placeholder:
          'Include information about appearance, location, pain, itching, etc.',
        helpText: 'Be as specific as possible to help the doctor make an accurate assessment',
      },
      {
        id: 'previous-treatment',
        type: 'radio',
        question: 'Have you tried any treatments for this condition?',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        id: 'treatment-details',
        type: 'textarea',
        question: 'If yes, what treatments have you tried?',
        required: false,
        placeholder:
          'List any medications, creams, or therapies you have used...',
      },
      {
        id: 'allergies',
        type: 'textarea',
        question: 'Do you have any known allergies to medications or skincare products?',
        required: true,
        placeholder: 'List all known allergies, or write "None"',
      },
      {
        id: 'medical-conditions',
        type: 'checkbox',
        question: 'Do you have any of the following conditions?',
        required: false,
        options: [
          'Diabetes',
          'High blood pressure',
          'Autoimmune disease',
          'Thyroid disorder',
          'None of the above',
        ],
      },
    ],
  },
  general: {
    specialty: 'General Medicine',
    questions: [
      {
        id: 'chief-complaint',
        type: 'textarea',
        question: 'What is the main reason for your consultation?',
        required: true,
        placeholder: 'Describe your primary health concern...',
      },
      {
        id: 'symptom-duration',
        type: 'select',
        question: 'How long have you been experiencing these symptoms?',
        required: true,
        options: [
          'Less than 24 hours',
          '1-3 days',
          '3-7 days',
          '1-2 weeks',
          'More than 2 weeks',
        ],
      },
      {
        id: 'severity',
        type: 'radio',
        question: 'How would you rate the severity of your symptoms?',
        required: true,
        options: ['Mild', 'Moderate', 'Severe'],
      },
      {
        id: 'fever',
        type: 'radio',
        question: 'Have you experienced fever?',
        required: true,
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'temperature',
        type: 'number',
        question: 'If yes, what was your highest temperature (°C)?',
        required: false,
        placeholder: '37.5',
      },
      {
        id: 'current-medications',
        type: 'textarea',
        question: 'List any medications you are currently taking',
        required: true,
        placeholder: 'Include prescription and over-the-counter medications, or write "None"',
      },
      {
        id: 'chronic-conditions',
        type: 'checkbox',
        question: 'Do you have any chronic health conditions?',
        required: false,
        options: [
          'Heart disease',
          'Diabetes',
          'Asthma/COPD',
          'Kidney disease',
          'Liver disease',
          'Cancer (current or past)',
          'None of the above',
        ],
      },
      {
        id: 'smoking',
        type: 'radio',
        question: 'Do you smoke or use tobacco products?',
        required: true,
        options: ['Yes, currently', 'Former smoker', 'Never'],
      },
    ],
  },
  'mental-health': {
    specialty: 'Mental Health',
    questions: [
      {
        id: 'primary-concern',
        type: 'select',
        question: 'What brings you to seek mental health support?',
        required: true,
        options: [
          'Anxiety',
          'Depression',
          'Stress management',
          'Sleep problems',
          'Relationship issues',
          'Grief/Loss',
          'Other',
        ],
      },
      {
        id: 'symptom-duration',
        type: 'select',
        question: 'How long have you been experiencing these concerns?',
        required: true,
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          'More than 1 year',
        ],
      },
      {
        id: 'daily-impact',
        type: 'radio',
        question: 'How much do these concerns affect your daily life?',
        required: true,
        options: [
          'Not at all',
          'Slightly',
          'Moderately',
          'Significantly',
          'Severely',
        ],
      },
      {
        id: 'symptoms-description',
        type: 'textarea',
        question: 'Please describe what you are experiencing',
        required: true,
        placeholder:
          'Include feelings, thoughts, behaviors, and any triggers you have noticed...',
        helpText: 'Your information is confidential and will help us provide appropriate care',
      },
      {
        id: 'previous-therapy',
        type: 'radio',
        question: 'Have you received mental health treatment before?',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        id: 'current-medications',
        type: 'textarea',
        question: 'Are you currently taking any medications for mental health?',
        required: true,
        placeholder: 'List all psychiatric medications, or write "None"',
      },
      {
        id: 'support-system',
        type: 'radio',
        question: 'Do you have a support system (family, friends, etc.)?',
        required: true,
        options: ['Yes, strong support', 'Some support', 'Limited support', 'No support'],
      },
      {
        id: 'sleep-pattern',
        type: 'radio',
        question: 'How would you describe your sleep?',
        required: true,
        options: [
          'Sleeping well',
          'Difficulty falling asleep',
          'Difficulty staying asleep',
          'Sleeping too much',
        ],
      },
      {
        id: 'safety',
        type: 'radio',
        question: 'Are you having thoughts of harming yourself or others?',
        required: true,
        options: ['Yes', 'No'],
        helpText: 'If yes, please seek immediate help by calling emergency services',
      },
    ],
  },
};

// Hard stop rules: if questionId has answer that matches, show a hard stop
const HARD_STOP_RULES: {
  questionId: string;
  triggerValue: string | string[];
  message: string;
  title: string;
}[] = [
  {
    questionId: 'safety',
    triggerValue: 'Yes',
    title: 'Immediate Support Required',
    message:
      'You have indicated you are having thoughts of harming yourself or others. This platform cannot provide emergency mental health support. Please contact emergency services immediately (112) or the German Crisis Hotline: 0800 111 0 111 (free, 24/7). Your safety is the top priority.',
  },
  {
    questionId: 'chronic-conditions',
    triggerValue: 'Cancer (current or past)',
    title: 'In-Person Consultation Required',
    message:
      'Based on your response, an in-person consultation with a specialist is required before this type of telemedicine treatment can be considered. Please contact your GP or a specialist clinic. No case has been created and no payment will be charged.',
  },
  {
    questionId: 'severity',
    triggerValue: 'Severe',
    title: 'Urgent In-Person Care Recommended',
    message:
      'You have reported severe symptoms. Telemedicine consultation is not appropriate for severe acute conditions. Please seek immediate in-person medical care or call emergency services (112) if needed. No case has been created.',
  },
];

interface DynamicQuestionnaireProps {
  specialty: SpecialtyType;
  onSubmit: (answers: Record<string, any>) => void;
  onBack: () => void;
}

export function DynamicQuestionnaire({
  specialty,
  onSubmit,
  onBack,
}: DynamicQuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hardStop, setHardStop] = useState<{ title: string; message: string } | null>(null);

  if (!specialty) return null;

  const questionnaire = QUESTIONNAIRES[specialty];
  if (!questionnaire) return null;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
    // Check hard stop rules
    const rule = HARD_STOP_RULES.find((r) => r.questionId === questionId);
    if (rule) {
      const triggered = Array.isArray(rule.triggerValue)
        ? rule.triggerValue.includes(value)
        : rule.triggerValue === value;
      if (triggered) {
        setHardStop({ title: rule.title, message: rule.message });
      } else {
        setHardStop(null);
      }
    }
  };

  const handleCheckboxChange = (questionId: string, option: string) => {
    const currentValues = answers[questionId] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter((v: string) => v !== option)
      : [...currentValues, option];
    handleAnswerChange(questionId, newValues);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    questionnaire.questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          newErrors[question.id] = 'This field is required';
        } else if (typeof answer === 'string' && answer.trim() === '') {
          newErrors[question.id] = 'This field is required';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(answers);
    }
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={question.type}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'textarea':
        return (
          <textarea
            rows={4}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'select':
        return (
          <select
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  className="w-4 h-4 text-[#5B6FF8] focus:ring-[#5B6FF8]"
                />
                <span className="text-sm text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={() => handleCheckboxChange(question.id, option)}
                  className="w-4 h-4 text-[#5B6FF8] rounded focus:ring-[#5B6FF8]"
                />
                <span className="text-sm text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hard Stop Overlay - non-dismissible */}
      {hardStop && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-900">{hardStop.title}</h2>
            </div>
            <p className="text-gray-800 mb-6 leading-relaxed">{hardStop.message}</p>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Emergency & Crisis Lines</p>
                  <p className="text-sm text-red-800 mt-0.5">Emergency: <strong>112</strong> • Crisis Hotline: <strong>0800 111 0 111</strong> (free, 24/7)</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 italic">
              ⚠️ This consultation cannot proceed. No case has been created and no payment will be charged. This event has been logged for compliance purposes.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setHardStop(null); onBack(); }}
                className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-gray-900"
            >
              ← Back to specialty selection
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {questionnaire.specialty} Assessment
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Please answer the following questions to help our doctors provide the
            best care
          </p>
        </div>

        {questionnaire.questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {index + 1}. {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.helpText && (
              <p className="text-xs text-gray-500">{question.helpText}</p>
            )}
            {renderQuestion(question)}
            {errors[question.id] && (
              <p className="text-sm text-red-600">{errors[question.id]}</p>
            )}
          </div>
        ))}

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
            <p className="font-medium">Your privacy is protected</p>
            <p className="text-blue-800 mt-1">
              All information is encrypted and GDPR compliant. Only licensed
              physicians will review your submission.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
          >
            Continue to Document Upload
          </button>
        </div>
      </form>
    </>
  );
}