import { useState } from 'react';
import { CheckCircle, FileText, AlertCircle, ExternalLink } from 'lucide-react';

interface ConsentItem {
  id: string;
  label: string;
  version: string;
  required: boolean;
  description: string;
}

const CONSULTATION_CONSENTS: ConsentItem[] = [
  {
    id: 'privacy',
    label: 'Privacy Policy (Datenschutzerklärung)',
    version: 'v2.1',
    required: true,
    description: 'I agree to the GDPR-compliant processing of my personal health data for this consultation.',
  },
  {
    id: 'medical',
    label: 'Medical Treatment Consent (Behandlungseinwilligung)',
    version: 'v3.0',
    required: true,
    description: 'I provide informed consent for telemedicine evaluation and potential treatment by a licensed physician via this platform.',
  },
  {
    id: 'dataTransfer',
    label: 'Data Transfer to Pharmacy',
    version: 'v1.5',
    required: true,
    description: 'I consent to my approved prescription data being securely shared with the designated pharmacy partner for fulfillment.',
  },
];

interface ConsentAcceptanceStepProps {
  onAccepted: () => void;
  onBack: () => void;
}

export function ConsentAcceptanceStep({ onAccepted, onBack }: ConsentAcceptanceStepProps) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [expandedConsent, setExpandedConsent] = useState<string | null>(null);

  const allRequired = CONSULTATION_CONSENTS.filter((c) => c.required);
  const allAccepted = allRequired.every((c) => accepted[c.id]);

  const handleToggle = (id: string) => {
    setAccepted((prev) => ({ ...prev, [id]: !prev[id] }));
    setError('');
  };

  const handleContinue = () => {
    if (!allAccepted) {
      setError('Please accept all required consent forms to proceed with your consultation.');
      return;
    }
    onAccepted();
  };

  const FULL_TEXTS: Record<string, string> = {
    privacy: `Under GDPR (General Data Protection Regulation) and DSGVO Art. 9, your health data is classified as a Special Category of personal data requiring explicit consent. By accepting, you agree that MediConnect GmbH may process your health information solely for the purpose of providing telemedicine services. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3), stored in EU data centers, and retained for the legally mandated 10-year period as per §630f BGB. You retain the right to access, correct, and request deletion of your data, subject to legal retention obligations. Data is never sold to third parties.`,
    medical: `This consent authorizes a licensed German physician (Arzt/Ärztin) to conduct a telemedicine evaluation of your case in accordance with the MBO-Ä (Musterberufsordnung für Ärzte). The physician will review your questionnaire responses and uploaded documents to determine if remote treatment is appropriate. As per MBO-Ä §7(4), the treating physician retains full clinical discretion and may require an in-person consultation if deemed medically necessary. All clinical decisions are made exclusively by the physician — no automated medical decisions are made by the platform. You may withdraw this consent before your case enters 'In Review' status.`,
    dataTransfer: `If your case is approved and a prescription is issued, the structured prescription data (including medication PZN, dosage, and physician LANR) will be securely transmitted to the designated pharmacy partner. This transmission uses a time-limited signed payload. The pharmacy may only use this data for prescription fulfillment. This consent is limited to the current case and must be re-confirmed for future consultations.`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Consent & Legal Agreement</h3>
        <p className="text-sm text-gray-600 mt-2">
          Before proceeding, you must review and accept the following consent documents. These are required by German healthcare law (MBO-Ä, DSGVO Art. 9) and platform policy.
        </p>
      </div>

      {/* GDPR notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Your Data Rights (DSGVO / GDPR)</p>
          <p className="text-blue-800 mt-1">
            All consents are individually timestamped, IP-logged, and version-tracked. You can review your consent history in Account Settings at any time.
          </p>
        </div>
      </div>

      {/* Consent items */}
      <div className="space-y-3">
        {CONSULTATION_CONSENTS.map((item) => (
          <div key={item.id} className={`border-2 rounded-xl transition-all ${accepted[item.id] ? 'border-[#5B6FF8] bg-blue-50' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`consent-${item.id}`}
                  checked={accepted[item.id] || false}
                  onChange={() => handleToggle(item.id)}
                  className="w-5 h-5 text-[#5B6FF8] rounded mt-0.5 flex-shrink-0 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label htmlFor={`consent-${item.id}`} className="text-sm font-semibold text-gray-900 cursor-pointer">
                      {item.label}
                    </label>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{item.version}</span>
                    {item.required && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-medium">Required</span>
                    )}
                    {accepted[item.id] && (
                      <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Accepted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5">{item.description}</p>
                  <button
                    type="button"
                    onClick={() => setExpandedConsent(expandedConsent === item.id ? null : item.id)}
                    className="text-xs text-[#5B6FF8] hover:underline mt-2 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {expandedConsent === item.id ? 'Hide full text' : 'Read full document'}
                  </button>
                </div>
              </div>
              {expandedConsent === item.id && (
                <div className="mt-4 ml-8 p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">{FULL_TEXTS[item.id]}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Acceptance summary */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${allAccepted ? 'bg-green-500' : 'bg-gray-300'}`}>
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
        <span>
          {allRequired.filter((c) => accepted[c.id]).length} / {allRequired.length} required consents accepted
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className={`flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors ${
            allAccepted
              ? 'bg-[#5B6FF8] text-white hover:bg-[#4A5FE7]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Accept & Continue to Consultation
        </button>
      </div>
    </div>
  );
}
