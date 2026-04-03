import { User } from '../App';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
  Star,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminAnalyticsViewProps {
  user: User;
}

export function AdminAnalyticsView({ user }: AdminAnalyticsViewProps) {
  // Weekly cases data
  const weeklyCasesData = [
    { day: 'Mon', cases: 24, approved: 18, pending: 6 },
    { day: 'Tue', cases: 31, approved: 25, pending: 6 },
    { day: 'Wed', cases: 28, approved: 22, pending: 6 },
    { day: 'Thu', cases: 35, approved: 28, pending: 7 },
    { day: 'Fri', cases: 42, approved: 35, pending: 7 },
    { day: 'Sat', cases: 19, approved: 15, pending: 4 },
    { day: 'Sun', cases: 15, approved: 12, pending: 3 },
  ];

  // Monthly revenue data
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 72000 },
    { month: 'Aug', revenue: 69000 },
    { month: 'Sep', revenue: 78000 },
    { month: 'Oct', revenue: 85000 },
    { month: 'Nov', revenue: 90000 },
    { month: 'Dec', revenue: 95000 },
  ];

  // Specialty distribution
  const specialtyData = [
    { name: 'Hair Loss', value: 342, color: '#5B6FF8' },
    { name: 'Dermatology', value: 289, color: '#10B981' },
    { name: 'General Medicine', value: 234, color: '#F59E0B' },
    { name: 'Mental Health', value: 187, color: '#EF4444' },
    { name: 'Other', value: 95, color: '#8B5CF6' },
  ];

  // User growth data
  const userGrowthData = [
    { month: 'Jan', patients: 520, doctors: 12, pharmacies: 3 },
    { month: 'Feb', patients: 645, doctors: 14, pharmacies: 4 },
    { month: 'Mar', patients: 780, doctors: 16, pharmacies: 5 },
    { month: 'Apr', patients: 920, doctors: 18, pharmacies: 5 },
    { month: 'May', patients: 1050, doctors: 20, pharmacies: 6 },
    { month: 'Jun', patients: 1247, doctors: 22, pharmacies: 7 },
  ];

  // Case resolution time (in hours)
  const resolutionTimeData = [
    { week: 'Week 1', time: 24.5 },
    { week: 'Week 2', time: 22.3 },
    { week: 'Week 3', time: 20.1 },
    { week: 'Week 4', time: 18.5 },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: '€817K',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Active Users',
      value: '1,247',
      change: '+23',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Total Cases',
      value: '1,147',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'purple',
    },
    {
      label: 'Avg Response Time',
      value: '18.5h',
      change: '-2.3h',
      trend: 'up',
      icon: Clock,
      color: 'orange',
    },
    {
      label: 'Patient Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'yellow',
    },
    {
      label: 'Case Approval Rate',
      value: '94.2%',
      change: '+1.5%',
      trend: 'up',
      icon: Activity,
      color: 'teal',
    },
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-600';
      case 'blue':
        return 'bg-blue-50 text-blue-600';
      case 'purple':
        return 'bg-purple-50 text-purple-600';
      case 'orange':
        return 'bg-orange-50 text-orange-600';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600';
      case 'teal':
        return 'bg-teal-50 text-teal-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">
          Platform performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Cases */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Cases Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyCasesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar key="bar-approved" dataKey="approved" fill="#10B981" name="Approved" radius={[4, 4, 0, 0]} />
              <Bar key="bar-pending" dataKey="pending" fill="#F59E0B" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cases by Specialty</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specialtyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {specialtyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue and User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B6FF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B6FF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `€${(value / 1000).toFixed(0)}K`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5B6FF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                key="line-patients"
                type="monotone"
                dataKey="patients"
                stroke="#5B6FF8"
                strokeWidth={2}
                name="Patients"
                dot={{ r: 4 }}
              />
              <Line
                key="line-doctors"
                type="monotone"
                dataKey="doctors"
                stroke="#10B981"
                strokeWidth={2}
                name="Doctors"
                dot={{ r: 4 }}
              />
              <Line
                key="line-pharmacies"
                type="monotone"
                dataKey="pharmacies"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Pharmacies"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Case Resolution Time */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Average Case Resolution Time (Hours)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={resolutionTimeData}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value}h`}
            />
            <Area
              type="monotone"
              dataKey="time"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Great improvement!</span> Case resolution time has
            decreased by 6 hours (24.5% improvement) over the past month, indicating better
            operational efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}
