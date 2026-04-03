import { useState } from 'react';
import { User } from '../App';
import { DollarSign, CheckCircle, XCircle, Clock, Search, Filter, AlertTriangle } from 'lucide-react';

interface AdminRefundViewProps {
  user: User;
}

interface RefundRequest {
  id: string;
  caseId: string;
  patientName: string;
  patientEmail: string;
  amount: number;
  rejectionCategory: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'partial' | 'denied';
  doctorName: string;
  notes?: string;
}

const MOCK_REFUNDS: RefundRequest[] = [
  {
    id: 'ref-001',
    caseId: '#1234',
    patientName: 'Emma Schmidt',
    patientEmail: 'emma.s@example.com',
    amount: 29.99,
    rejectionCategory: 'Case requires in-person consultation',
    requestedDate: 'Apr 2, 2026',
    status: 'pending',
    doctorName: 'Dr. Michael Weber',
  },
  {
    id: 'ref-002',
    caseId: '#1220',
    patientName: 'Klaus Bauer',
    patientEmail: 'k.bauer@example.de',
    amount: 29.99,
    rejectionCategory: 'Contraindication detected',
    requestedDate: 'Apr 1, 2026',
    status: 'pending',
    doctorName: 'Dr. Anna Hoffmann',
  },
  {
    id: 'ref-003',
    caseId: '#1215',
    patientName: 'Maria Weber',
    patientEmail: 'maria.w@example.de',
    amount: 29.99,
    rejectionCategory: 'Insufficient information provided',
    requestedDate: 'Mar 30, 2026',
    status: 'approved',
    doctorName: 'Dr. Michael Weber',
    notes: 'Full refund approved per platform policy.',
  },
  {
    id: 'ref-004',
    caseId: '#1210',
    patientName: 'Lars Fischer',
    patientEmail: 'lars.f@example.de',
    amount: 15.00,
    rejectionCategory: 'Outside scope of telemedicine',
    requestedDate: 'Mar 28, 2026',
    status: 'partial',
    doctorName: 'Dr. Sarah Klein',
    notes: 'Partial refund (€15.00) — partial service rendered.',
  },
  {
    id: 'ref-005',
    caseId: '#1205',
    patientName: 'Petra Schulz',
    patientEmail: 'petra.s@example.de',
    amount: 29.99,
    rejectionCategory: 'Medical history incomplete',
    requestedDate: 'Mar 26, 2026',
    status: 'denied',
    doctorName: 'Dr. Michael Weber',
    notes: 'Denied — patient did not complete required documentation.',
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  partial: { label: 'Partial Refund', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  denied: { label: 'Denied', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

export function AdminRefundView({ user }: AdminRefundViewProps) {
  const [refunds, setRefunds] = useState<RefundRequest[]>(MOCK_REFUNDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RefundRequest['status']>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [partialAmount, setPartialAmount] = useState('');
  const [actionType, setActionType] = useState<'full' | 'partial' | 'deny' | null>(null);

  const filtered = refunds.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.caseId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = refunds.filter((r) => r.status === 'pending').length;
  const totalPendingAmount = refunds.filter((r) => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  const handleProcessRefund = () => {
    if (!selectedRefund) return;
    let newStatus: RefundRequest['status'];
    let notes = adminNotes;
    let amount = selectedRefund.amount;

    if (actionType === 'full') {
      newStatus = 'approved';
      notes = notes || 'Full refund approved.';
    } else if (actionType === 'partial') {
      newStatus = 'partial';
      amount = parseFloat(partialAmount) || selectedRefund.amount;
      notes = notes || `Partial refund of €${amount.toFixed(2)} approved.`;
    } else {
      newStatus = 'denied';
      notes = notes || 'Refund denied by administrator.';
    }

    setRefunds((prev) =>
      prev.map((r) =>
        r.id === selectedRefund.id ? { ...r, status: newStatus, amount, notes } : r
      )
    );
    setSelectedRefund(null);
    setAdminNotes('');
    setPartialAmount('');
    setActionType(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Refund Management</h1>
        <p className="text-sm text-gray-600 mt-1">Review and process refund requests from rejected or cancelled cases</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting review</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Pending Amount</p>
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">€{totalPendingAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">To be processed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Approved This Month</p>
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">€149.95</p>
          <p className="text-xs text-green-600 mt-1">5 refunds processed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">1.8d</p>
          <p className="text-xs text-gray-500 mt-1">Business days</p>
        </div>
      </div>

      {/* Stripe note */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Stripe Refund Policy</p>
          <p className="text-blue-800 mt-0.5">Approved refunds are processed via Stripe's Refund API. Funds typically appear in the patient's account within 5–7 business days. Partial refunds are at Admin discretion.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or case ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="partial">Partial</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Refund list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rejection Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((refund) => {
                const config = STATUS_CONFIG[refund.status];
                return (
                  <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{refund.caseId}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{refund.patientName}</p>
                      <p className="text-xs text-gray-500">{refund.patientEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px]">
                      <span className="truncate block">{refund.rejectionCategory}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{refund.doctorName}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">€{refund.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{refund.requestedDate}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {refund.status === 'pending' ? (
                        <button
                          onClick={() => { setSelectedRefund(refund); setActionType(null); setAdminNotes(''); setPartialAmount(''); }}
                          className="px-3 py-1.5 bg-[#5B6FF8] text-white text-xs font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">{refund.notes ? 'Processed' : '—'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">No refund requests found.</div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Process Refund</h3>
            <p className="text-sm text-gray-600 mb-5">
              Case {selectedRefund.caseId} — {selectedRefund.patientName}
            </p>

            <div className="space-y-4 mb-5">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rejection reason:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">{selectedRefund.rejectionCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium text-gray-900">{selectedRefund.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment amount:</span>
                  <span className="font-semibold text-gray-900">€{selectedRefund.amount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Refund Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'full' as const, label: 'Full Refund', color: 'hover:border-green-400 hover:bg-green-50' },
                    { type: 'partial' as const, label: 'Partial Refund', color: 'hover:border-blue-400 hover:bg-blue-50' },
                    { type: 'deny' as const, label: 'Deny', color: 'hover:border-red-400 hover:bg-red-50' },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setActionType(opt.type)}
                      className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${actionType === opt.type ? 'border-[#5B6FF8] bg-blue-50 text-[#5B6FF8]' : `border-gray-200 text-gray-700 ${opt.color}`}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {actionType === 'partial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount (€)</label>
                  <input
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    placeholder={`Max: ${selectedRefund.amount.toFixed(2)}`}
                    max={selectedRefund.amount}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes for this refund decision..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRefund(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={!actionType}
                className="flex-1 bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
