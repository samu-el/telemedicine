import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { DynamicQuestionnaire } from './DynamicQuestionnaire';
import {
  getIntakeSession,
  getTreatmentById,
  hasPreAuthQuestionnaireComplete,
  mergeIntakeDocuments,
  mergeIntakePayment,
  markQuestionnaireComplete,
} from '../lib/intakeSession';

type WizardStep = 'questionnaire' | 'documents' | 'payment' | 'confirmation';

function initialWizardStep(): WizardStep {
  const i = getIntakeSession();
  if (!i) return 'questionnaire';
  if (!hasPreAuthQuestionnaireComplete()) return 'questionnaire';
  if (!i.documentsCompletedAt) return 'documents';
  if (!i.paymentCompletedAt) return 'payment';
  return 'confirmation';
}

const TOTAL_PRE_AUTH_STEPS = 5;

interface PreAuthIntakeWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PreAuthIntakeWizard({ onComplete, onBack }: PreAuthIntakeWizardProps) {
  const [step, setStep] = useState<WizardStep>(initialWizardStep);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const intake = getIntakeSession();
  const treatment = intake ? getTreatmentById(intake.treatmentId) : undefined;

  const stepIndex = useMemo(() => {
    const map: Record<WizardStep, number> = {
      questionnaire: 2,
      documents: 3,
      payment: 4,
      confirmation: 5,
    };
    return map[step];
  }, [step]);

  if (!intake) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-gray-700 mb-4">Select a treatment on the home page first.</p>
          <button type="button" onClick={onBack} className="text-[#5B6FF8] font-medium hover:underline">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const handleQuestionnaireSubmit = (_answers: Record<string, unknown>) => {
    markQuestionnaireComplete();
    setStep('documents');
  };

  const handleDocumentsContinue = () => {
    const names = uploadedFiles.map((f) => f.name);
    mergeIntakeDocuments(names);
    setStep('payment');
  };

  const handlePaymentContinue = () => {
    const label = paymentMethod === 'card' ? 'Credit card (demo)' : 'PayPal (demo)';
    mergeIntakePayment(label);
    setStep('confirmation');
  };

  const fresh = getIntakeSession();

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => {
            if (step === 'questionnaire') onBack();
            else if (step === 'documents') setStep('questionnaire');
            else if (step === 'payment') setStep('documents');
            else setStep('payment');
          }}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'questionnaire' ? 'Back to home' : 'Back'}
        </button>

        <div className="mb-6">
          <p className="text-sm font-medium text-[#5B6FF8]">
            Step {stepIndex} of {TOTAL_PRE_AUTH_STEPS} · Pre-account intake
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">
            {step === 'questionnaire' && 'Medical questionnaire'}
            {step === 'documents' && 'Document upload'}
            {step === 'payment' && 'Payment'}
            {step === 'confirmation' && 'Review intake'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Treatment: <strong>{treatment?.title}</strong>. Account creation is the final step (after this flow).
          </p>
        </div>

        <div className="flex gap-1 mb-6">
          {(['questionnaire', 'documents', 'payment', 'confirmation'] as const).map((s, i) => {
            const currentIndex = ['questionnaire', 'documents', 'payment', 'confirmation'].indexOf(step);
            return (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${i <= currentIndex ? 'bg-[#5B6FF8]' : 'bg-gray-200'}`}
              />
            );
          })}
        </div>

        {step === 'questionnaire' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <DynamicQuestionnaire
              specialty={intake.specialty}
              onSubmit={handleQuestionnaireSubmit}
              onBack={onBack}
            />
          </div>
        )}

        {step === 'documents' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload supporting documents</h3>
              <p className="text-sm text-gray-600">
                Optional — photos or PDFs that help the doctor assess your case. You can continue without files.
              </p>
            </div>
            <label
              htmlFor="preauth-file-upload"
              className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#5B6FF8] transition-colors cursor-pointer"
            >
              <input
                id="preauth-file-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => {
                  if (e.target.files) setUploadedFiles(Array.from(e.target.files));
                }}
                className="hidden"
              />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB each</p>
            </label>
            {uploadedFiles.length > 0 && (
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="text-gray-800">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep('questionnaire')}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleDocumentsContinue}
                className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7]"
              >
                Continue to payment
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment (demo)</h3>
              <p className="text-sm text-gray-600">Consultation fee: €29.99 — captured as intent before account binding.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
              In production, payment may be finalized after doctor approval; this mock completes your pre-account checkout.
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Payment method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg text-left ${
                    paymentMethod === 'card' ? 'border-[#5B6FF8] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Credit card</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-lg text-left ${
                    paymentMethod === 'paypal' ? 'border-[#5B6FF8] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-gray-900">PayPal</div>
                  <div className="text-sm text-gray-600">Quick checkout</div>
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep('documents')}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePaymentContinue}
                className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7]"
              >
                Continue to review
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && fresh && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review your intake</h3>
              <p className="text-sm text-gray-600">
                Next step is <strong>account creation</strong> (email, verification, profile). Mandatory consents happen after sign-in.
              </p>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Treatment</p>
                <p className="text-sm text-gray-900 mt-1">{treatment?.title}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Questionnaire</p>
                <p className="text-sm text-gray-900 mt-1">
                  {fresh.questionnaireCompletedAt ? 'Completed (responses not stored in this browser)' : '—'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Documents</p>
                <p className="text-sm text-gray-900 mt-1">
                  {fresh.documentFileNames && fresh.documentFileNames.length > 0
                    ? fresh.documentFileNames.join(', ')
                    : 'No files uploaded'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Payment</p>
                <p className="text-sm text-gray-900 mt-1">€29.99 · {fresh.paymentMethodLabel ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Pre-account intake is complete. Create your account to bind this session to your identity.</span>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7]"
              >
                Create account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
