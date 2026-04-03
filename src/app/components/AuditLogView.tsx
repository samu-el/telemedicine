import { useState } from 'react';
import { User } from '../App';
import {
  Search,
  Filter,
  Download,
  User as UserIcon,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
} from 'lucide-react';

interface AuditLogViewProps {
  user: User;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  action: string;
  category: 'user' | 'case' | 'prescription' | 'system' | 'security' | 'data';
  description: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  metadata?: Record<string, string>;
}

export function AuditLogView({ user }: AuditLogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'user' | 'case' | 'prescription' | 'system' | 'security' | 'data'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'warning'>('all');

  const auditLogs: AuditLog[] = [
    {
      id: 'AL-001',
      timestamp: '2026-04-02 14:23:45',
      actor: {
        name: 'Dr. Michael Weber',
        email: 'dr.weber@example.com',
        role: 'Doctor',
      },
      action: 'PRESCRIPTION_CREATED',
      category: 'prescription',
      description: 'Created prescription for patient Emma Schmidt - Finasteride 1mg',
      ipAddress: '192.168.1.45',
      status: 'success',
      metadata: {
        patientId: 'P-5678',
        caseId: 'C-1234',
        medication: 'Finasteride 1mg',
      },
    },
    {
      id: 'AL-002',
      timestamp: '2026-04-02 14:15:20',
      actor: {
        name: 'Admin User',
        email: 'admin@mediconnect.de',
        role: 'Admin',
      },
      action: 'USER_ROLE_CHANGED',
      category: 'user',
      description: 'Changed user role from Patient to Doctor for user@example.com',
      ipAddress: '192.168.1.10',
      status: 'success',
      metadata: {
        userId: 'U-9876',
        previousRole: 'Patient',
        newRole: 'Doctor',
      },
    },
    {
      id: 'AL-003',
      timestamp: '2026-04-02 14:05:12',
      actor: {
        name: 'Emma Schmidt',
        email: 'emma.s@example.com',
        role: 'Patient',
      },
      action: 'LOGIN_FAILED',
      category: 'security',
      description: 'Failed login attempt - incorrect password',
      ipAddress: '203.45.67.89',
      status: 'failed',
      metadata: {
        attempts: '3',
        reason: 'Invalid credentials',
      },
    },
    {
      id: 'AL-004',
      timestamp: '2026-04-02 13:58:30',
      actor: {
        name: 'Pharmacy Alpha',
        email: 'contact@pharmacy-alpha.de',
        role: 'Pharmacy',
      },
      action: 'PRESCRIPTION_FULFILLED',
      category: 'prescription',
      description: 'Fulfilled prescription order #5678 - shipment created',
      ipAddress: '192.168.2.50',
      status: 'success',
      metadata: {
        orderId: '#5678',
        shipmentId: 'SH-001',
      },
    },
    {
      id: 'AL-005',
      timestamp: '2026-04-02 13:45:00',
      actor: {
        name: 'System',
        email: 'system@mediconnect.de',
        role: 'System',
      },
      action: 'BACKUP_COMPLETED',
      category: 'system',
      description: 'Daily database backup completed successfully',
      ipAddress: '127.0.0.1',
      status: 'success',
      metadata: {
        backupSize: '2.3 GB',
        duration: '45 seconds',
      },
    },
    {
      id: 'AL-006',
      timestamp: '2026-04-02 13:30:15',
      actor: {
        name: 'Dr. Thomas Weber',
        email: 'dr.thomas@example.com',
        role: 'Doctor',
      },
      action: 'CASE_APPROVED',
      category: 'case',
      description: 'Approved case #1234 for patient Lisa Müller',
      ipAddress: '192.168.1.46',
      status: 'success',
      metadata: {
        caseId: '#1234',
        patientId: 'P-4567',
      },
    },
    {
      id: 'AL-007',
      timestamp: '2026-04-02 13:15:42',
      actor: {
        name: 'Admin User',
        email: 'admin@mediconnect.de',
        role: 'Admin',
      },
      action: 'DATA_EXPORT',
      category: 'data',
      description: 'Exported patient data for GDPR compliance request',
      ipAddress: '192.168.1.10',
      status: 'warning',
      metadata: {
        patientId: 'P-3456',
        requestType: 'GDPR Export',
        fileSize: '1.2 MB',
      },
    },
    {
      id: 'AL-008',
      timestamp: '2026-04-02 13:00:00',
      actor: {
        name: 'System',
        email: 'system@mediconnect.de',
        role: 'System',
      },
      action: 'SECURITY_SCAN',
      category: 'security',
      description: 'Automated security vulnerability scan completed - no issues found',
      ipAddress: '127.0.0.1',
      status: 'success',
    },
    {
      id: 'AL-009',
      timestamp: '2026-04-02 12:45:30',
      actor: {
        name: 'Tom Fischer',
        email: 'tom.f@example.com',
        role: 'Patient',
      },
      action: 'CASE_SUBMITTED',
      category: 'case',
      description: 'Submitted new consultation case for Hair Loss treatment',
      ipAddress: '203.45.78.90',
      status: 'success',
      metadata: {
        caseId: '#5679',
        specialty: 'Hair Loss',
      },
    },
    {
      id: 'AL-010',
      timestamp: '2026-04-02 12:30:18',
      actor: {
        name: 'Admin User',
        email: 'admin@mediconnect.de',
        role: 'Admin',
      },
      action: 'SETTINGS_UPDATED',
      category: 'system',
      description: 'Updated system email notification settings',
      ipAddress: '192.168.1.10',
      status: 'success',
      metadata: {
        setting: 'Email Notifications',
        previousValue: 'Enabled',
        newValue: 'Enabled with digest',
      },
    },
    {
      id: 'AL-011',
      timestamp: '2026-04-02 12:15:00',
      actor: {
        name: 'Pharmacy Beta',
        email: 'contact@pharmacy-beta.de',
        role: 'Pharmacy',
      },
      action: 'INVENTORY_UPDATED',
      category: 'system',
      description: 'Updated inventory stock levels for 15 medications',
      ipAddress: '192.168.2.51',
      status: 'success',
    },
    {
      id: 'AL-012',
      timestamp: '2026-04-02 12:00:45',
      actor: {
        name: 'System',
        email: 'system@mediconnect.de',
        role: 'System',
      },
      action: 'SESSION_CLEANUP',
      category: 'security',
      description: 'Cleaned up 42 expired user sessions',
      ipAddress: '127.0.0.1',
      status: 'success',
      metadata: {
        sessionsRemoved: '42',
      },
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <UserIcon className="w-4 h-4" />;
      case 'case':
        return <FileText className="w-4 h-4" />;
      case 'prescription':
        return <FileText className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'data':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user':
        return 'bg-blue-50 text-blue-700';
      case 'case':
        return 'bg-purple-50 text-purple-700';
      case 'prescription':
        return 'bg-green-50 text-green-700';
      case 'system':
        return 'bg-gray-50 text-gray-700';
      case 'security':
        return 'bg-red-50 text-red-700';
      case 'data':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const stats = {
    total: auditLogs.length,
    success: auditLogs.filter(log => log.status === 'success').length,
    failed: auditLogs.filter(log => log.status === 'failed').length,
    warning: auditLogs.filter(log => log.status === 'warning').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-600 mt-1">
          Complete system activity and security audit trail
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Successful</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.success}</p>
          <p className="text-xs text-green-600 mt-1">Completed actions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Failed</h3>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.failed}</p>
          <p className="text-xs text-red-600 mt-1">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Warnings</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.warning}</p>
          <p className="text-xs text-yellow-600 mt-1">Review needed</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('user')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setFilterCategory('case')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'case'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => setFilterCategory('prescription')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'prescription'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Prescriptions
            </button>
            <button
              onClick={() => setFilterCategory('security')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'security'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setFilterCategory('system')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'system'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              System
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Status:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('success')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilterStatus('failed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Failed
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'warning'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Warning
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getCategoryColor(log.category)}`}>
                        {getCategoryIcon(log.category)}
                        {log.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{log.id}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{log.action.replace(/_/g, ' ')}</h3>
                    <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        {log.actor.name} ({log.actor.role})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="ml-7 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-gray-500">{key}: </span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No audit logs found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
