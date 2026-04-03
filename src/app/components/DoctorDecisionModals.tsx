import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Video,
  AlertTriangle,
  Calendar,
  Clock,
  X,
} from 'lucide-react';

type DecisionType = 'approve' | 'reject' | 'request-info' | 'video';

interface DoctorDecisionModalsProps {
  caseId: string;
  patientName: string;
  onClose: () => void;
  onDecisionMade: (decision: DecisionType, data: Record<string, any>) => void;
}

const REJECTION_CATEGORIES = [
  'Contraindication detected',
  'Insufficient information provided',
  'Case requires in-person consultation',
  'Outside scope of telemedicine',
  'Medical history incomplete',
  'Safety concern identified',
];

const MOCK_VIDEO_SLOTS = [
  { date: 'Apr 3, 2026', slots: ['09:00', '10:30', '14:00'] },
  { date: 'Apr 4, 2026', slots: ['08:30', '11:00', '15:30', '16:00'] },
  { date: 'Apr 5, 2026', slots: ['09:30', '13:00', '14:30'] },
  { date: 'Apr 7, 2026', slots: ['10:00', '11:30', '16:30'] },
];

export function DoctorDecisionModals({
  caseId,
  patientName,
  onClose,
  onDecisionMade,
}: DoctorDecisionModalsProps) {
  const [activeModal, setActiveModal] = useState<DecisionType | null>(null);

  // Approve state
  const [justification, setJustification] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Reject state
  const [rejectionCategory, setRejectionCategory] = useState('');
  const [rejectionJustification, setRejectionJustification] = useState('');

  // Request info state
  const [infoRequest, setInfoRequest] = useState('');

  // Video state
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const resetErrors = () => setErrors({});

  const handleApprove = () => {
    const e: Record<string, string> = {};
    if (!justification.trim()) e.justification = 'Medical justification is required.';
    else if (justification.trim().length < 50) e.justification = `Justification must be at least 50 characters (${justification.trim().length}/50 so far).`;
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(() => {
      onDecisionMade('approve', { justification, internalNotes });
    }, 1500);
  };

  const handleReject = () => {
    const e: Record<string, string> = {};
    if (!rejectionCategory) e.category = 'Please select a rejection category.';
    if (!rejectionJustification.trim()) e.justification = 'Written justification is required.';
    else if (rejectionJustification.trim().length < 30) e.justification = 'Justification must be at least 30 characters.';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(() => {
      onDecisionMade('reject', { category: rejectionCategory, justification: rejectionJustification });
    }, 1500);
  };

  const handleRequestInfo = () => {
    const e: Record<string, string> = {};
    if (!infoRequest.trim()) e.message = 'Please compose your information request.';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(() => {
      onDecisionMade('request-info', { message: infoRequest });
    }, 1500);
  };

  const handleVideoSchedule = () => {
    if (!selectedSlot) { setErrors({ slot: 'Please select an appointment slot.' }); return; }
    setSubmitted(true);
    setTimeout(() => {
      onDecisionMade('video', { slot: selectedSlot });
    }, 1500);
  };

  if (submitted) {
    const messages: Record<DecisionType, { title: string; desc: string; color: string; icon: React.ReactNode }> = {
      approve: {
        title: 'Case Approved',
        desc: 'The prescription has been generated and will be sent to the pharmacy partner.',
        color: 'text-green-600',
        icon: <CheckCircle className="w-14 h-14 text-green-500" />,
      },
      reject: {
        title: 'Case Rejected',
        desc: 'The patient has been notified. A refund review has been triggered.',
        color: 'text-red-600',
        icon: <XCircle className="w-14 h-14 text-red-500" />,
      },
      'request-info': {
        title: 'Information Requested',
        desc: `Your message has been sent to ${patientName}. The 14-day response timer has started.`,
        color: 'text-blue-600',
        icon: <MessageSquare className="w-14 h-14 text-blue-500" />,
      },
      video: {
        title: 'Video Consultation Scheduled',
        desc: `${patientName} will receive scheduling options for the video consultation.`,
        color: 'text-purple-600',
        icon: <Video className="w-14 h-14 text-purple-500" />,
      },
    };
    const msg = messages[activeModal!];
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="flex justify-center mb-4">{msg.icon}</div>
          <h3 className={`text-xl font-semibold ${msg.color} mb-2`}>{msg.title}</h3>
          <p className="text-sm text-gray-600 mb-6">{msg.desc}</p>
          <button onClick={onClose} className="w-full px-4 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  // Decision selection screen
  if (!activeModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Medical Decision</h2>
              <p className="text-sm text-gray-600 mt-0.5">Case {caseId} — {patientName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Important:</strong> All decisions are immutably recorded with your credentials, timestamp, and full justification as required by MBO-Ä and §630f BGB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setActiveModal('approve'); resetErrors(); }}
              className="p-5 border-2 border-gray-200 rounded-xl text-left hover:border-green-400 hover:bg-green-50 transition-all group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">Approve</p>
              <p className="text-xs text-gray-600 mt-1">Issue prescription and approve case</p>
            </button>

            <button
              onClick={() => { setActiveModal('reject'); resetErrors(); }}
              className="p-5 border-2 border-gray-200 rounded-xl text-left hover:border-red-400 hover:bg-red-50 transition-all group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="font-semibold text-gray-900">Reject</p>
              <p className="text-xs text-gray-600 mt-1">Decline remote treatment for this case</p>
            </button>

            <button
              onClick={() => { setActiveModal('request-info'); resetErrors(); }}
              className="p-5 border-2 border-gray-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">Request Info</p>
              <p className="text-xs text-gray-600 mt-1">Ask patient for more information</p>
            </button>

            <button
              onClick={() => { setActiveModal('video'); resetErrors(); }}
              className="p-5 border-2 border-gray-200 rounded-xl text-left hover:border-purple-400 hover:bg-purple-50 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900">Video Consult</p>
              <p className="text-xs text-gray-600 mt-1">Schedule a video consultation</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Approve Modal
  if (activeModal === 'approve') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Approve Case</h2>
                <p className="text-sm text-gray-600">{caseId} — {patientName}</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Medical Justification <span className="text-red-500">*</span>
                <span className="font-normal text-gray-500 ml-2">(min. 50 characters)</span>
              </label>
              <textarea
                value={justification}
                onChange={(e) => { setJustification(e.target.value); resetErrors(); }}
                rows={5}
                placeholder="Describe your clinical reasoning for approving this case, including relevant findings from the questionnaire and documents..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none ${errors.justification ? 'border-red-500' : 'border-gray-300'}`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.justification ? (
                  <p className="text-xs text-red-600">{errors.justification}</p>
                ) : <span />}
                <span className={`text-xs ${justification.trim().length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                  {justification.trim().length}/50 characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Internal Notes for Admin <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                placeholder="Notes only visible to platform administrators..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none"
              />
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-900">
              <p className="font-medium mb-1">Upon approval:</p>
              <ul className="space-y-1 text-green-800">
                <li>• A structured prescription will be generated with your LANR</li>
                <li>• The prescription payload will be dispatched to the pharmacy</li>
                <li>• The patient will be notified by email</li>
                <li>• This decision will be immutably logged in the Audit Log</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleApprove} className="flex-1 bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Confirm Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reject Modal
  if (activeModal === 'reject') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reject Case</h2>
                <p className="text-sm text-gray-600">{caseId} — {patientName}</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rejection Category <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REJECTION_CATEGORIES.map((cat) => (
                  <label key={cat} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${rejectionCategory === cat ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="rejection-cat"
                      value={cat}
                      checked={rejectionCategory === cat}
                      onChange={() => { setRejectionCategory(cat); resetErrors(); }}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm text-gray-900">{cat}</span>
                  </label>
                ))}
              </div>
              {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Written Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionJustification}
                onChange={(e) => { setRejectionJustification(e.target.value); resetErrors(); }}
                rows={4}
                placeholder="Explain the clinical or regulatory reason for rejection..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none ${errors.justification ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.justification && <p className="text-xs text-red-600 mt-1">{errors.justification}</p>}
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-900">
              <p className="font-medium mb-1">Upon rejection:</p>
              <ul className="space-y-1 text-orange-800">
                <li>• The patient will be notified via email with the rejection reason</li>
                <li>• A full refund review will be automatically triggered for Admin</li>
                <li>• The case is permanently closed — patients must open a new case</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleReject} className="flex-1 bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Request Info Modal
  if (activeModal === 'request-info') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Request More Information</h2>
                <p className="text-sm text-gray-600">{caseId} — {patientName}</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p>Once sent, the case will move to <strong>"Needs More Info"</strong> status. The patient has <strong>14 days</strong> to respond before the case is automatically cancelled.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message to Patient <span className="text-red-500">*</span>
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {[
                  'Please provide clearer photos of the affected area.',
                  'Please list all current medications including over-the-counter.',
                  'Please clarify the duration and severity of your symptoms.',
                  'Please upload recent blood test or lab results.',
                ].map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setInfoRequest((prev) => prev ? prev + '\n\n' + template : template)}
                    className="text-xs px-2.5 py-1 border border-[#5B6FF8] text-[#5B6FF8] rounded-full hover:bg-blue-50 transition-colors"
                  >
                    + {template.slice(0, 35)}...
                  </button>
                ))}
              </div>
              <textarea
                value={infoRequest}
                onChange={(e) => { setInfoRequest(e.target.value); resetErrors(); }}
                rows={5}
                placeholder="Dear patient, to complete your medical evaluation I need the following additional information..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleRequestInfo} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video Consultation Modal
  if (activeModal === 'video') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Schedule Video Consultation</h2>
                <p className="text-sm text-gray-600">{caseId} — {patientName}</p>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-900">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <p>Select an available appointment slot. The patient will receive scheduling options and confirm a time. The case will move to <strong>"Awaiting Video"</strong> status.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Select Appointment Slot</label>
              <div className="space-y-4">
                {MOCK_VIDEO_SLOTS.map((day) => (
                  <div key={day.date}>
                    <p className="text-sm font-medium text-gray-700 mb-2">{day.date}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot) => (
                        <button
                          key={`${day.date}-${slot}`}
                          onClick={() => { setSelectedSlot({ date: day.date, time: slot }); resetErrors(); }}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedSlot?.date === day.date && selectedSlot?.time === slot
                              ? 'border-[#5B6FF8] bg-[#5B6FF8] text-white'
                              : 'border-gray-200 text-gray-700 hover:border-[#5B6FF8] hover:text-[#5B6FF8]'
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.slot && <p className="text-xs text-red-600 mt-2">{errors.slot}</p>}
            </div>

            {selectedSlot && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
                <p className="font-medium text-green-900">Selected slot:</p>
                <p className="text-green-800 mt-1">{selectedSlot.date} at {selectedSlot.time}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleVideoSchedule} className="flex-1 bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Video className="w-4 h-4" /> Confirm & Send Invite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
