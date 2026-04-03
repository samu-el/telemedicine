import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  Send,
  Download,
  Phone,
  X,
} from 'lucide-react';

interface PharmacyOrderDetailViewProps {
  user: User;
  orderId: string;
  onBack: () => void;
}

type OrderStatus = 'pending' | 'acknowledged' | 'in-preparation' | 'quality-check' | 'dispatched' | 'delivered';

interface OrderData {
  id: string;
  caseId: string;
  patientName: string;
  patientAddress: string;
  patientPhone: string;
  prescribingDoctor: string;
  doctorLANR: string;
  prescriptionDate: string;
  prescriptionSignature: string;
  status: OrderStatus;
  receivedAt: string;
  medications: {
    pzn: string;
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  statusHistory: { status: string; timestamp: string; actor: string }[];
}

const ORDER_DATA: OrderData = {
  id: '#5678',
  caseId: '#1234',
  patientName: 'Emma Schmidt',
  patientAddress: 'Musterstraße 12, 10115 Berlin',
  patientPhone: '+49 30 12345678',
  prescribingDoctor: 'Dr. Michael Weber',
  doctorLANR: '123456789',
  prescriptionDate: 'Apr 2, 2026',
  prescriptionSignature: 'SHA256:a1b2c3d4e5f6...',
  status: 'pending',
  receivedAt: 'Apr 2, 2026 14:30',
  medications: [
    {
      pzn: '04096516',
      name: 'Finasteride 1mg',
      dosage: '1 mg',
      quantity: 90,
      frequency: 'Once daily',
      duration: '90 days',
      instructions: 'Take one tablet daily with water in the morning. Avoid crushing or chewing.',
    },
  ],
  statusHistory: [
    { status: 'Prescription Received', timestamp: 'Apr 2, 2026 14:30', actor: 'System' },
    { status: 'Pending Processing', timestamp: 'Apr 2, 2026 14:30', actor: 'System' },
  ],
};

const STATUS_FLOW: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Received' },
  { status: 'acknowledged', label: 'Acknowledged' },
  { status: 'in-preparation', label: 'In Preparation' },
  { status: 'quality-check', label: 'Quality Check' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
];

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  pending: 'acknowledged',
  acknowledged: 'in-preparation',
  'in-preparation': 'quality-check',
  'quality-check': 'dispatched',
  dispatched: 'delivered',
  delivered: null,
};

const STATUS_ACTIONS: Record<OrderStatus, string> = {
  pending: 'Acknowledge Receipt',
  acknowledged: 'Start Preparation',
  'in-preparation': 'Send to Quality Check',
  'quality-check': 'Mark as Dispatched',
  dispatched: 'Confirm Delivery',
  delivered: 'Completed',
};

export function PharmacyOrderDetailView({ user, orderId, onBack }: PharmacyOrderDetailViewProps) {
  const [order, setOrder] = useState<OrderData>({ ...ORDER_DATA, id: orderId });
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueFlagged, setIssueFlagged] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  const currentStatusIndex = STATUS_FLOW.findIndex((s) => s.status === order.status);
  const nextStatus = STATUS_NEXT[order.status];

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    if (nextStatus === 'dispatched' && !trackingNumber) {
      setShowTrackingInput(true);
      return;
    }
    const statusLabel = STATUS_FLOW.find((s) => s.status === nextStatus)?.label || '';
    setOrder((prev) => ({
      ...prev,
      status: nextStatus,
      statusHistory: [
        ...prev.statusHistory,
        { status: statusLabel, timestamp: 'Apr 2, 2026 ' + new Date().toLocaleTimeString(), actor: user.name },
      ],
    }));
    setShowTrackingInput(false);
  };

  const handleFlagIssue = () => {
    if (!issueType || !issueDetails.trim()) return;
    setIssueFlagged(true);
    setShowIssueModal(false);
    setOrder((prev) => ({
      ...prev,
      statusHistory: [
        ...prev.statusHistory,
        { status: `Issue Flagged: ${issueType}`, timestamp: 'Apr 2, 2026 ' + new Date().toLocaleTimeString(), actor: user.name },
      ],
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'acknowledged': return 'bg-blue-50 text-blue-700';
      case 'in-preparation': return 'bg-purple-50 text-purple-700';
      case 'quality-check': return 'bg-indigo-50 text-indigo-700';
      case 'dispatched': return 'bg-green-50 text-green-700';
      case 'delivered': return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Order {order.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {STATUS_FLOW.find((s) => s.status === order.status)?.label}
              </span>
              {issueFlagged && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Issue Flagged
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">Received {order.receivedAt} • Case {order.caseId}</p>
          </div>
          <div className="flex items-center gap-3">
            {!issueFlagged && order.status !== 'delivered' && (
              <button
                onClick={() => setShowIssueModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Flag Issue
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Download Prescription
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Main */}
        <div className="flex-1 space-y-6">
          {/* Prescription Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Prescription Details</h2>
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Cryptographically Verified
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-xl text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Prescribing Doctor</p>
                <p className="font-medium text-gray-900">{order.prescribingDoctor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Doctor LANR</p>
                <p className="font-medium text-gray-900 font-mono">{order.doctorLANR}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Prescription Date</p>
                <p className="font-medium text-gray-900">{order.prescriptionDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Signature Hash</p>
                <p className="font-medium text-gray-900 font-mono text-xs truncate">{order.prescriptionSignature}</p>
              </div>
            </div>

            {order.medications.map((med, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">PZN: {med.pzn}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                    Qty: {med.quantity}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Dosage', value: med.dosage },
                    { label: 'Frequency', value: med.frequency },
                    { label: 'Duration', value: med.duration },
                    { label: 'Quantity', value: `${med.quantity} tablets` },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-900 mb-1">Dispensing Instructions</p>
                  <p className="text-sm text-amber-800">{med.instructions}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>

            {/* Status Progress */}
            <div className="flex items-center mb-6 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, index) => (
                <div key={s.status} className="flex items-center flex-shrink-0">
                  <div className={`flex flex-col items-center ${index <= currentStatusIndex ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStatusIndex ? 'bg-[#5B6FF8] text-white' :
                      index === currentStatusIndex ? 'bg-[#5B6FF8] text-white ring-4 ring-blue-100' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStatusIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="text-xs mt-1 text-center text-gray-600 max-w-[60px]">{s.label}</span>
                  </div>
                  {index < STATUS_FLOW.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 mb-4 ${index < currentStatusIndex ? 'bg-[#5B6FF8]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {showTrackingInput && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tracking Number (required for dispatch)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g., DHL: 1234567890"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
                  />
                  <button
                    onClick={() => {
                      if (trackingNumber) handleAdvanceStatus();
                    }}
                    className="px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            )}

            {order.status !== 'delivered' && !issueFlagged && (
              <button
                onClick={handleAdvanceStatus}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
              >
                <Package className="w-4 h-4" />
                {STATUS_ACTIONS[order.status]}
              </button>
            )}
            {order.status === 'delivered' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Order successfully delivered and closed</span>
              </div>
            )}
            {issueFlagged && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Issue Flagged — Admin Notified</p>
                  <p className="text-sm text-red-800 mt-0.5">This order has been escalated to the platform administrator for review.</p>
                </div>
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
            <div className="space-y-3">
              {order.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#5B6FF8] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                    <p className="text-xs text-gray-500">{entry.timestamp} • {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 space-y-5">
          {/* Patient Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{order.patientName}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Delivery Address</p>
                  <p className="text-sm text-gray-900">{order.patientAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="text-sm text-gray-900">{order.patientPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Truck className="w-4 h-4" /> Track Shipment
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4" /> Print Label
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Send className="w-4 h-4" /> Notify Patient
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> Download Invoice
              </button>
            </div>
          </div>

          {/* SLA Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">SLA Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Received</span>
                <span className="font-medium text-gray-900">Apr 2, 14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing deadline</span>
                <span className="font-medium text-green-600">Apr 4, 14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery target</span>
                <span className="font-medium text-gray-900">Apr 5, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Flag Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Flag an Issue</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              Flagging an issue will alert the platform administrator. Processing of this order will be paused pending resolution.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Issue Type</label>
                <div className="space-y-2">
                  {[
                    'Medication out of stock',
                    'Address undeliverable',
                    'Prescription verification failed',
                    'Patient unresponsive',
                    'Medication recalled',
                    'Other',
                  ].map((type) => (
                    <label key={type} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${issueType === type ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="issue-type"
                        value={type}
                        checked={issueType === type}
                        onChange={() => setIssueType(type)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Details</label>
                <textarea
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide additional context about the issue..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowIssueModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleFlagIssue}
                disabled={!issueType || !issueDetails.trim()}
                className="flex-1 bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Flag Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
