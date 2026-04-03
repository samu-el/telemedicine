import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  CheckSquare,
  Type,
  List,
  Calendar,
} from 'lucide-react';

interface QuestionnaireManagementViewProps {
  user: User;
  onBack: () => void;
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
  order: number;
}

interface Questionnaire {
  id: string;
  name: string;
  specialty: string;
  questions: Question[];
  active: boolean;
  updatedAt: string;
}

export function QuestionnaireManagementView({ user, onBack }: QuestionnaireManagementViewProps) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: '1',
      name: 'Hair Loss Consultation',
      specialty: 'Hair Loss',
      active: true,
      updatedAt: '2026-03-30',
      questions: [
        {
          id: 'q1',
          text: 'How long have you been experiencing hair loss?',
          type: 'radio',
          required: true,
          options: ['Less than 6 months', '6-12 months', '1-2 years', 'More than 2 years'],
          order: 1,
        },
        {
          id: 'q2',
          text: 'Please describe the pattern of your hair loss',
          type: 'textarea',
          required: true,
          order: 2,
        },
        {
          id: 'q3',
          text: 'Do you have a family history of hair loss?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No', 'Not sure'],
          order: 3,
        },
        {
          id: 'q4',
          text: 'Have you tried any hair loss treatments before?',
          type: 'checkbox',
          required: false,
          options: ['Minoxidil', 'Finasteride', 'Hair transplant', 'Other medications', 'None'],
          order: 4,
        },
        {
          id: 'q5',
          text: 'Do you have any of the following conditions?',
          type: 'checkbox',
          required: true,
          options: ['Thyroid issues', 'Diabetes', 'Scalp infections', 'Autoimmune diseases', 'None'],
          order: 5,
        },
        {
          id: 'q6',
          text: 'Are you currently taking any medications?',
          type: 'textarea',
          required: true,
          order: 6,
        },
        {
          id: 'q7',
          text: 'What are your treatment goals?',
          type: 'textarea',
          required: true,
          order: 7,
        },
      ],
    },
    {
      id: '2',
      name: 'Dermatology Assessment',
      specialty: 'Dermatology',
      active: true,
      updatedAt: '2026-03-28',
      questions: [
        {
          id: 'q1',
          text: 'What skin concern would you like to address?',
          type: 'radio',
          required: true,
          options: ['Acne', 'Eczema', 'Psoriasis', 'Rosacea', 'Other'],
          order: 1,
        },
        {
          id: 'q2',
          text: 'How long have you had this condition?',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          id: 'q3',
          text: 'Please describe your symptoms',
          type: 'textarea',
          required: true,
          order: 3,
        },
        {
          id: 'q4',
          text: 'Have you used any treatments for this condition?',
          type: 'textarea',
          required: true,
          order: 4,
        },
        {
          id: 'q5',
          text: 'Do you have any known allergies to medications?',
          type: 'textarea',
          required: true,
          order: 5,
        },
        {
          id: 'q6',
          text: 'Are you currently pregnant or breastfeeding?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No', 'Not applicable'],
          order: 6,
        },
        {
          id: 'q7',
          text: 'What is your skin type?',
          type: 'radio',
          required: false,
          options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
          order: 7,
        },
        {
          id: 'q8',
          text: 'Do you have any other medical conditions?',
          type: 'textarea',
          required: false,
          order: 8,
        },
      ],
    },
    {
      id: '3',
      name: 'General Medicine Questionnaire',
      specialty: 'General Medicine',
      active: true,
      updatedAt: '2026-03-25',
      questions: [
        {
          id: 'q1',
          text: 'What is the primary reason for your consultation?',
          type: 'textarea',
          required: true,
          order: 1,
        },
        {
          id: 'q2',
          text: 'When did your symptoms begin?',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          id: 'q3',
          text: 'Please describe your symptoms in detail',
          type: 'textarea',
          required: true,
          order: 3,
        },
        {
          id: 'q4',
          text: 'Are you currently taking any medications?',
          type: 'textarea',
          required: true,
          order: 4,
        },
        {
          id: 'q5',
          text: 'Do you have any chronic medical conditions?',
          type: 'checkbox',
          required: true,
          options: ['Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'None'],
          order: 5,
        },
        {
          id: 'q6',
          text: 'Do you have any known allergies?',
          type: 'textarea',
          required: true,
          order: 6,
        },
        {
          id: 'q7',
          text: 'Have you had any recent surgeries or hospitalizations?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
          order: 7,
        },
        {
          id: 'q8',
          text: 'If yes, please provide details',
          type: 'textarea',
          required: false,
          order: 8,
        },
      ],
    },
  ]);

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'text',
    required: true,
    options: [],
  });

  const handleSelectQuestionnaire = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setEditingQuestion(null);
    setShowAddQuestion(false);
  };

  const handleAddQuestion = () => {
    if (!selectedQuestionnaire || !newQuestion.text) return;

    const question: Question = {
      id: `q${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options || [],
      order: selectedQuestionnaire.questions.length + 1,
    };

    const updatedQuestionnaire = {
      ...selectedQuestionnaire,
      questions: [...selectedQuestionnaire.questions, question],
    };

    setQuestionnaires(
      questionnaires.map((q) => (q.id === selectedQuestionnaire.id ? updatedQuestionnaire : q))
    );
    setSelectedQuestionnaire(updatedQuestionnaire);
    setShowAddQuestion(false);
    setNewQuestion({ text: '', type: 'text', required: true, options: [] });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedQuestionnaire) return;

    const updatedQuestionnaire = {
      ...selectedQuestionnaire,
      questions: selectedQuestionnaire.questions.filter((q) => q.id !== questionId),
    };

    setQuestionnaires(
      questionnaires.map((q) => (q.id === selectedQuestionnaire.id ? updatedQuestionnaire : q))
    );
    setSelectedQuestionnaire(updatedQuestionnaire);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    if (!selectedQuestionnaire) return;

    const updatedQuestionnaire = {
      ...selectedQuestionnaire,
      questions: selectedQuestionnaire.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    };

    setQuestionnaires(
      questionnaires.map((q) => (q.id === selectedQuestionnaire.id ? updatedQuestionnaire : q))
    );
    setSelectedQuestionnaire(updatedQuestionnaire);
    setEditingQuestion(null);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'textarea':
        return <Type className="w-4 h-4" />;
      case 'radio':
        return <CheckSquare className="w-4 h-4" />;
      case 'checkbox':
        return <CheckSquare className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  if (selectedQuestionnaire) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedQuestionnaire(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questionnaires
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{selectedQuestionnaire.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              {selectedQuestionnaire.specialty}
            </span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              selectedQuestionnaire.active
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-700'
            }`}>
              {selectedQuestionnaire.active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-sm text-gray-500">
              {selectedQuestionnaire.questions.length} questions
            </span>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {/* Add Question Form */}
          {showAddQuestion && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">New Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                    placeholder="Enter question text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, type: e.target.value as Question['type'] })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="radio">Single Choice</option>
                      <option value="checkbox">Multiple Choice</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newQuestion.required}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, required: e.target.checked })
                        }
                        className="w-4 h-4 text-[#5B6FF8] border-gray-300 rounded focus:ring-[#5B6FF8]"
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>
                  </div>
                </div>

                {(newQuestion.type === 'radio' || newQuestion.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newQuestion.options?.join(', ')}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          options: e.target.value.split(',').map((opt) => opt.trim()),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddQuestion(false);
                      setNewQuestion({ text: '', type: 'text', required: true, options: [] });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            {selectedQuestionnaire.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-xl p-4">
                {editingQuestion?.id === question.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={editingQuestion.text}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, text: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                      />
                    </div>

                    {(editingQuestion.type === 'radio' || editingQuestion.type === 'checkbox') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingQuestion.options?.join(', ')}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              options: e.target.value.split(',').map((opt) => opt.trim()),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateQuestion(editingQuestion)}
                        className="px-3 py-1.5 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2 mt-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{question.text}</h4>
                            {question.required && (
                              <span className="text-xs text-red-600">*</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {getQuestionTypeIcon(question.type)}
                              {question.type}
                            </span>
                          </div>
                          {question.options && question.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Options:</p>
                              <div className="flex flex-wrap gap-1">
                                {question.options.map((option, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                                  >
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedQuestionnaire.questions.length === 0 && (
            <div className="text-center py-12">
              <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions added yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Question" to create your first question
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Content Management
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Questionnaires</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create and edit specialty-specific question sets for patient consultations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionnaires.map((questionnaire) => (
          <div
            key={questionnaire.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectQuestionnaire(questionnaire)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {questionnaire.name}
                </h3>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {questionnaire.specialty}
                </span>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                questionnaire.active
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {questionnaire.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium text-gray-900">
                  {questionnaire.questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">{questionnaire.updatedAt}</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors">
              Edit Questionnaire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
