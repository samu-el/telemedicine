import { useState } from 'react';
import { User } from '../App';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  User as UserIcon,
  Calendar,
} from 'lucide-react';

interface AdminAllCasesViewProps {
  user: User;
}

interface Case {
  id: string;
  caseNumber: string;
  patient: {
    name: string;
    email: string;
    avatar: string;
  };
  doctor?: {
    name: string;
    email: string;
  };
  specialty: string;
  status: 'submitted' | 'paid' | 'in-review' | 'approved' | 'sent-to-pharmacy' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  lastUpdated: string;
  amount: string;
}

export function AdminAllCasesView({ user }: AdminAllCasesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Case['status']>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<'all' | string>('all');

  const cases: Case[] = [
    {
      id: '1',
      caseNumber: '#C-1234',
      patient: {
        name: 'Emma Schmidt',
        email: 'emma.s@example.com',
        avatar: 'ES',
      },
      doctor: {
        name: 'Dr. Michael Weber',
        email: 'dr.weber@example.com',
      },
      specialty: 'Hair Loss',
      status: 'approved',
      priority: 'medium',
      submittedDate: '2026-03-28',
      lastUpdated: '2026-04-01',
      amount: '€149.00',
    },
    {
      id: '2',
      caseNumber: '#C-1235',
      patient: {
        name: 'Lisa Müller',
        email: 'lisa.m@example.com',
        avatar: 'LM',
      },
      doctor: {
        name: 'Dr. Thomas Weber',
        email: 'dr.thomas@example.com',
      },
      specialty: 'Dermatology',
      status: 'sent-to-pharmacy',
      priority: 'high',
      submittedDate: '2026-03-29',
      lastUpdated: '2026-04-02',
      amount: '€189.00',
    },
    {
      id: '3',
      caseNumber: '#C-1236',
      patient: {
        name: 'Tom Fischer',
        email: 'tom.f@example.com',
        avatar: 'TF',
      },
      specialty: 'Hair Loss',
      status: 'in-review',
      priority: 'medium',
      submittedDate: '2026-03-30',
      lastUpdated: '2026-03-30',
      amount: '€149.00',
    },
    {
      id: '4',
      caseNumber: '#C-1237',
      patient: {
        name: 'Anna Becker',
        email: 'anna.b@example.com',
        avatar: 'AB',
      },
      doctor: {
        name: 'Dr. Sarah Klein',
        email: 'dr.klein@example.com',
      },
      specialty: 'General Medicine',
      status: 'completed',
      priority: 'low',
      submittedDate: '2026-03-25',
      lastUpdated: '2026-03-31',
      amount: '€99.00',
    },
    {
      id: '5',
      caseNumber: '#C-1238',
      patient: {
        name: 'Max Hoffmann',
        email: 'max.h@example.com',
        avatar: 'MH',
      },
      specialty: 'Mental Health',
      status: 'paid',
      priority: 'urgent',
      submittedDate: '2026-04-01',
      lastUpdated: '2026-04-01',
      amount: '€129.00',
    },
    {
      id: '6',
      caseNumber: '#C-1239',
      patient: {
        name: 'Sophie Wagner',
        email: 'sophie.w@example.com',
        avatar: 'SW',
      },
      doctor: {
        name: 'Dr. Michael Weber',
        email: 'dr.weber@example.com',
      },
      specialty: 'Dermatology',
      status: 'approved',
      priority: 'high',
      submittedDate: '2026-03-31',
      lastUpdated: '2026-04-02',
      amount: '€179.00',
    },
    {
      id: '7',
      caseNumber: '#C-1240',
      patient: {
        name: 'Felix Meyer',
        email: 'felix.m@example.com',
        avatar: 'FM',
      },
      specialty: 'Hair Loss',
      status: 'submitted',
      priority: 'low',
      submittedDate: '2026-04-02',
      lastUpdated: '2026-04-02',
      amount: '€149.00',
    },
    {
      id: '8',
      caseNumber: '#C-1241',
      patient: {
        name: 'Julia Schulz',
        email: 'julia.s@example.com',
        avatar: 'JS',
      },
      doctor: {
        name: 'Dr. Thomas Weber',
        email: 'dr.thomas@example.com',
      },
      specialty: 'General Medicine',
      status: 'in-review',
      priority: 'medium',
      submittedDate: '2026-03-30',
      lastUpdated: '2026-04-01',
      amount: '€119.00',
    },
    {
      id: '9',
      caseNumber: '#C-1242',
      patient: {
        name: 'Lukas Braun',
        email: 'lukas.b@example.com',
        avatar: 'LB',
      },
      specialty: 'Mental Health',
      status: 'rejected',
      priority: 'low',
      submittedDate: '2026-03-27',
      lastUpdated: '2026-03-29',
      amount: '€129.00',
    },
    {
      id: '10',
      caseNumber: '#C-1243',
      patient: {
        name: 'Sarah Richter',
        email: 'sarah.r@example.com',
        avatar: 'SR',
      },
      doctor: {
        name: 'Dr. Sarah Klein',
        email: 'dr.klein@example.com',
      },
      specialty: 'Dermatology',
      status: 'sent-to-pharmacy',
      priority: 'medium',
      submittedDate: '2026-03-29',
      lastUpdated: '2026-04-01',
      amount: '€169.00',
    },
  ];

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch =
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (caseItem.doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesSpecialty = filterSpecialty === 'all' || caseItem.specialty === filterSpecialty;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const getStatusBadge = (status: Case['status']) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          color: 'bg-gray-100 text-gray-700',
          icon: <FileText className="w-3 h-3" />,
        };
      case 'paid':
        return {
          label: 'Paid',
          color: 'bg-blue-100 text-blue-700',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'in-review':
        return {
          label: 'In Review',
          color: 'bg-yellow-100 text-yellow-700',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'approved':
        return {
          label: 'Approved',
          color: 'bg-green-100 text-green-700',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'sent-to-pharmacy':
        return {
          label: 'Sent to Pharmacy',
          color: 'bg-purple-100 text-purple-700',
          icon: <FileText className="w-3 h-3" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-teal-100 text-teal-700',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'bg-red-100 text-red-700',
          icon: <XCircle className="w-3 h-3" />,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-700',
          icon: <FileText className="w-3 h-3" />,
        };
    }
  };

  const getPriorityBadge = (priority: Case['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: cases.length,
    submitted: cases.filter(c => c.status === 'submitted').length,
    inReview: cases.filter(c => c.status === 'in-review').length,
    approved: cases.filter(c => c.status === 'approved').length,
    completed: cases.filter(c => c.status === 'completed').length,
    rejected: cases.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">All Cases</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage all patient cases across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Cases</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Submitted</p>
          <p className="text-2xl font-semibold text-gray-700">{stats.submitted}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">In Review</p>
          <p className="text-2xl font-semibold text-yellow-700">{stats.inReview}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-semibold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-semibold text-teal-700">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-semibold text-red-700">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by case number, patient, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            onClick={() => setFilterStatus('submitted')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'submitted'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilterStatus('in-review')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'in-review'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Review
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>

          <div className="mx-2 h-4 w-px bg-gray-300"></div>

          <span className="text-sm text-gray-600">Specialty:</span>
          <button
            onClick={() => setFilterSpecialty('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterSpecialty === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSpecialty('Hair Loss')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterSpecialty === 'Hair Loss'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hair Loss
          </button>
          <button
            onClick={() => setFilterSpecialty('Dermatology')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterSpecialty === 'Dermatology'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dermatology
          </button>
          <button
            onClick={() => setFilterSpecialty('General Medicine')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterSpecialty === 'General Medicine'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            General Medicine
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((caseItem) => {
                const statusBadge = getStatusBadge(caseItem.status);
                return (
                  <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#5B6FF8]">
                        {caseItem.caseNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#5B6FF8] text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {caseItem.patient.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {caseItem.patient.name}
                          </p>
                          <p className="text-xs text-gray-500">{caseItem.patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {caseItem.doctor ? (
                        <div>
                          <p className="text-sm text-gray-900">{caseItem.doctor.name}</p>
                          <p className="text-xs text-gray-500">{caseItem.doctor.email}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{caseItem.specialty}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadge(caseItem.priority)}`}
                      >
                        {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {caseItem.submittedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {caseItem.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#5B6FF8] hover:bg-[#F0F2FF] rounded-lg transition-colors">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No cases found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
