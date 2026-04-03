import { useState } from 'react';
import { User } from '../App';
import {
  Search,
  UserPlus,
  Mail,
  Shield,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Monitor,
  Lock,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface AdminUserManagementProps {
  user: User;
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Pharmacy' | 'Admin';
  joined: string;
  status: 'active' | 'suspended' | 'pending';
  activity: 'high' | 'medium' | 'low';
  lastLogin: string;
  loginHistory: { date: string; ip: string; device: string; success: boolean }[];
  sessions: { id: string; device: string; location: string; started: string; active: boolean }[];
  lanr?: string;
  pharmacy?: string;
  suspendedReason?: string;
}

const MOCK_USERS: PlatformUser[] = [
  {
    id: '1',
    name: 'Emma Schmidt',
    email: 'emma.s@example.com',
    role: 'Patient',
    joined: 'Jan 15, 2026',
    status: 'active',
    activity: 'high',
    lastLogin: 'Apr 2, 2026 14:30',
    loginHistory: [
      { date: 'Apr 2, 2026 14:30', ip: '89.12.34.56', device: 'Chrome / macOS', success: true },
      { date: 'Apr 1, 2026 09:15', ip: '89.12.34.56', device: 'Chrome / macOS', success: true },
      { date: 'Mar 31, 2026 18:22', ip: '192.168.1.1', device: 'Safari / iOS', success: false },
    ],
    sessions: [
      { id: 'sess-1', device: 'Chrome / macOS', location: 'Berlin, DE', started: 'Apr 2, 2026 14:30', active: true },
    ],
  },
  {
    id: '2',
    name: 'Dr. Michael Weber',
    email: 'dr.weber@example.com',
    role: 'Doctor',
    joined: 'Dec 1, 2025',
    status: 'active',
    activity: 'high',
    lastLogin: 'Apr 2, 2026 08:45',
    lanr: '123456789',
    loginHistory: [
      { date: 'Apr 2, 2026 08:45', ip: '212.45.67.89', device: 'Firefox / Windows', success: true },
      { date: 'Apr 1, 2026 07:30', ip: '212.45.67.89', device: 'Firefox / Windows', success: true },
    ],
    sessions: [
      { id: 'sess-2', device: 'Firefox / Windows', location: 'Munich, DE', started: 'Apr 2, 2026 08:45', active: true },
    ],
  },
  {
    id: '3',
    name: 'MedCare Pharmacy',
    email: 'pharmacy@example.com',
    role: 'Pharmacy',
    joined: 'Nov 10, 2025',
    status: 'active',
    activity: 'medium',
    lastLogin: 'Apr 2, 2026 11:00',
    pharmacy: 'PH-98765-43210',
    loginHistory: [
      { date: 'Apr 2, 2026 11:00', ip: '85.23.45.67', device: 'Chrome / Windows', success: true },
    ],
    sessions: [],
  },
  {
    id: '4',
    name: 'Lisa Müller',
    email: 'lisa.m@example.com',
    role: 'Patient',
    joined: 'Feb 3, 2026',
    status: 'suspended',
    activity: 'low',
    lastLogin: 'Mar 20, 2026 10:22',
    suspendedReason: 'Multiple failed payment attempts and suspicious account activity.',
    loginHistory: [
      { date: 'Mar 20, 2026 10:22', ip: '172.16.0.1', device: 'Chrome / Android', success: true },
      { date: 'Mar 19, 2026 22:45', ip: '172.16.0.1', device: 'Chrome / Android', success: false },
      { date: 'Mar 19, 2026 22:44', ip: '172.16.0.1', device: 'Chrome / Android', success: false },
    ],
    sessions: [],
  },
  {
    id: '5',
    name: 'Tom Fischer',
    email: 'tom.f@example.com',
    role: 'Patient',
    joined: 'Mar 12, 2026',
    status: 'pending',
    activity: 'low',
    lastLogin: '—',
    loginHistory: [],
    sessions: [],
  },
];

export function AdminUserManagement({ user }: AdminUserManagementProps) {
  const [users, setUsers] = useState<PlatformUser[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | string>('all');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [detailTab, setDetailTab] = useState<'profile' | 'sessions' | 'history'>('profile');

  // Invite modal state
  const [inviteRole, setInviteRole] = useState<'doctor' | 'pharmacy'>('doctor');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSpecialty, setInviteSpecialty] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleSuspend = () => {
    if (!selectedUser || !suspendReason.trim()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: 'suspended', suspendedReason: suspendReason } : u
      )
    );
    setSelectedUser(null);
    setShowSuspendModal(false);
    setSuspendReason('');
  };

  const handleUnsuspend = (u: PlatformUser) => {
    setUsers((prev) =>
      prev.map((pu) =>
        pu.id === u.id ? { ...pu, status: 'active', suspendedReason: undefined } : pu
      )
    );
    if (selectedUser?.id === u.id) {
      setSelectedUser({ ...u, status: 'active', suspendedReason: undefined });
    }
  };

  const handleSendInvite = () => {
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteSpecialty('');
      setInviteName('');
    }, 2000);
  };

  const STATUS_STYLES = {
    active: 'bg-green-50 text-green-700',
    suspended: 'bg-red-50 text-red-700',
    pending: 'bg-amber-50 text-amber-700',
  };
  const ACTIVITY_STYLES = {
    high: 'bg-green-50 text-green-700',
    medium: 'bg-blue-50 text-blue-700',
    low: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all platform users — invite, suspend, and review activity</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Doctor / Pharmacy
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
        >
          <option value="all">All Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Login</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Activity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded font-medium">{u.role}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{u.joined}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{u.lastLogin}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[u.status]}`}>
                    {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTIVITY_STYLES[u.activity]}`}>
                    {u.activity.charAt(0).toUpperCase() + u.activity.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedUser(u); setDetailTab('profile'); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {u.status === 'active' && u.role !== 'Admin' && (
                      <button
                        onClick={() => { setSelectedUser(u); setShowSuspendModal(true); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                        title="Suspend User"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                    {u.status === 'suspended' && (
                      <button
                        onClick={() => handleUnsuspend(u)}
                        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                        title="Unsuspend User"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No users found.</div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && !showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">{selectedUser.email}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded font-medium text-gray-600">{selectedUser.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[selectedUser.status]}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-gray-200">
              <div className="flex gap-6">
                {[
                  { id: 'profile', label: 'Profile', icon: Shield },
                  { id: 'sessions', label: 'Active Sessions', icon: Monitor },
                  { id: 'history', label: 'Login History', icon: Clock },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setDetailTab(id as any)}
                    className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === id ? 'border-[#5B6FF8] text-[#5B6FF8]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {detailTab === 'profile' && (
                <div className="space-y-4">
                  {selectedUser.status === 'suspended' && selectedUser.suspendedReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-900">Account Suspended</p>
                          <p className="text-sm text-red-800 mt-1">{selectedUser.suspendedReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: selectedUser.name },
                      { label: 'Email', value: selectedUser.email },
                      { label: 'Role', value: selectedUser.role },
                      { label: 'Joined', value: selectedUser.joined },
                      { label: 'Last Login', value: selectedUser.lastLogin },
                      { label: 'Status', value: selectedUser.status },
                      ...(selectedUser.lanr ? [{ label: 'LANR', value: selectedUser.lanr }] : []),
                      ...(selectedUser.pharmacy ? [{ label: 'License No.', value: selectedUser.pharmacy }] : []),
                    ].map((item) => (
                      <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    {selectedUser.status === 'active' && selectedUser.role !== 'Admin' && (
                      <button
                        onClick={() => setShowSuspendModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Lock className="w-4 h-4" /> Suspend Account
                      </button>
                    )}
                    {selectedUser.status === 'suspended' && (
                      <button
                        onClick={() => handleUnsuspend(selectedUser)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> Unsuspend Account
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-4 h-4" /> Send Email
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Export GDPR Data
                    </button>
                  </div>
                </div>
              )}

              {detailTab === 'sessions' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Active sessions for this user account.</p>
                  {selectedUser.sessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No active sessions.</div>
                  ) : (
                    selectedUser.sessions.map((sess) => (
                      <div key={sess.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{sess.device}</p>
                            <p className="text-xs text-gray-500">{sess.location} • Started {sess.started}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {sess.active && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">Active</span>}
                          <button className="text-xs text-red-600 hover:underline">Revoke</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'history' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Recent login activity for this account.</p>
                  {selectedUser.loginHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No login history.</div>
                  ) : (
                    selectedUser.loginHistory.map((entry, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.success ? 'bg-green-100' : 'bg-red-100'}`}>
                            {entry.success
                              ? <CheckCircle className="w-4 h-4 text-green-600" />
                              : <X className="w-4 h-4 text-red-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.device}</p>
                            <p className="text-xs text-gray-500">IP: {entry.ip} • {entry.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${entry.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {entry.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Suspend Account</h3>
                <p className="text-sm text-gray-600">{selectedUser.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Suspending this account will immediately revoke all active sessions and prevent the user from logging in.
            </p>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Suspension Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
                placeholder="Describe the reason for suspension (required for audit log)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] resize-none text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSuspendModal(false); setSuspendReason(''); }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={!suspendReason.trim()}
                className="flex-1 bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            {inviteSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Invitation Sent!</h3>
                <p className="text-sm text-gray-600 mt-2">An email invitation has been dispatched to <strong>{inviteEmail}</strong>.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-[#5B6FF8]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Invite Doctor / Pharmacy</h3>
                  </div>
                  <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-5 text-sm text-blue-900">
                  <p>Doctors and pharmacies can only join the platform via Admin invitation — no self-registration is permitted.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Invite as</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setInviteRole('doctor')}
                        className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${inviteRole === 'doctor' ? 'border-[#5B6FF8] bg-blue-50 text-[#5B6FF8]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                      >
                        🩺 Doctor
                      </button>
                      <button
                        onClick={() => setInviteRole('pharmacy')}
                        className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${inviteRole === 'pharmacy' ? 'border-[#5B6FF8] bg-blue-50 text-[#5B6FF8]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                      >
                        💊 Pharmacy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {inviteRole === 'doctor' ? 'Full Name' : 'Pharmacy Name'}
                    </label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder={inviteRole === 'doctor' ? 'Dr. Max Mustermann' : 'Muster Apotheke GmbH'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="invitee@example.de"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
                    />
                  </div>

                  {inviteRole === 'doctor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialty Queue Assignment</label>
                      <select
                        value={inviteSpecialty}
                        onChange={(e) => setInviteSpecialty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
                      >
                        <option value="">Select specialty...</option>
                        <option value="dermatology">Dermatology</option>
                        <option value="general">General Medicine</option>
                        <option value="mental-health">Mental Health</option>
                      </select>
                    </div>
                  )}

                  {inviteRole === 'pharmacy' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">DE Pharmacy License No. (Betriebserlaubnis)</label>
                      <input
                        type="text"
                        placeholder="PH-XXXXX-XXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowInviteModal(false)} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvite}
                    disabled={!inviteEmail || !inviteName}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" /> Send Invitation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
