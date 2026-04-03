import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  showAvatar?: boolean;
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, showAvatar = false, onRowClick }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved'>(
    'all'
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      approved: 'bg-green-50 text-green-700',
      completed: 'bg-gray-50 text-gray-700',
      pending: 'bg-orange-50 text-orange-700',
      'in-review': 'bg-blue-50 text-blue-700',
      'more-info': 'bg-yellow-50 text-yellow-700',
      processing: 'bg-blue-50 text-blue-700',
      shipped: 'bg-purple-50 text-purple-700',
      delivered: 'bg-green-50 text-green-700',
      active: 'bg-green-50 text-green-700',
      inactive: 'bg-gray-50 text-gray-700',
    };
    return statusMap[status] || 'bg-gray-50 text-gray-700';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: { [key: string]: { bg: string; text: string } } = {
      high: { bg: 'bg-red-500', text: 'High' },
      medium: { bg: 'bg-orange-500', text: 'Medium' },
      low: { bg: 'bg-yellow-500', text: 'Low' },
    };
    const config = priorityMap[priority] || priorityMap.low;
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.bg}`} />
        <span className="text-sm text-gray-700">{config.text}</span>
      </div>
    );
  };

  const formatCellValue = (key: string, value: any, row: any) => {
    if (key === 'status') {
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(
            value
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {value
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </span>
      );
    }

    if (key === 'priority') {
      return getPriorityBadge(value);
    }

    if (key === 'patient' && showAvatar && row.patientAvatar) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {row.patientAvatar}
          </div>
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      );
    }

    if (key === 'name' && showAvatar && row.patientAvatar) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {row.patientAvatar}
          </div>
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      );
    }

    return <span className="text-sm text-gray-900">{value}</span>;
  };

  const filteredData = data.filter((item) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'pending')
      return item.status === 'pending' || item.status === 'in-review';
    if (filterTab === 'approved')
      return item.status === 'approved' || item.status === 'completed';
    return true;
  });

  const pendingCount = data.filter(
    (item) => item.status === 'pending' || item.status === 'in-review'
  ).length;

  const approvedCount = data.filter(
    (item) => item.status === 'approved' || item.status === 'completed'
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTab === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
              <span className="ml-2 text-xs">{data.length}</span>
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTab === 'pending'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
              {pendingCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-orange-500 text-white rounded text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterTab('approved')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTab === 'approved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
              {approvedCount > 0 && (
                <span className="ml-2 text-xs">{approvedCount}</span>
              )}
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Export All</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-[#5B6FF8] focus:ring-[#5B6FF8]"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.has(row.id) ? 'bg-blue-50' : ''
                } ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#5B6FF8] focus:ring-[#5B6FF8]"
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {formatCellValue(column.key, row[column.key], row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> -{' '}
          <span className="font-medium">{Math.min(itemsPerPage, filteredData.length)}</span> of{' '}
          <span className="font-medium">{filteredData.length}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {[1, 2, 3, '...', totalPages].map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-gray-900 text-white'
                  : page === '...'
                  ? 'cursor-default'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
