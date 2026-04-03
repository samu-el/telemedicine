import { useState } from 'react';
import { User } from '../App';
import { Calendar, Clock, ChevronLeft, ChevronRight, Video, MessageSquare } from 'lucide-react';

interface ScheduleViewProps {
  user: User;
  onCaseClick?: (caseId: string) => void;
}

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar: string;
  caseId: string;
  specialty: string;
  type: 'video' | 'chat';
  startTime: string;
  endTime: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

type ViewMode = 'day' | 'week' | 'month';

export function ScheduleView({ user, onCaseClick }: ScheduleViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Emma Schmidt',
      patientAvatar: 'ES',
      caseId: '#1234',
      specialty: 'Dermatology',
      type: 'video',
      startTime: '09:00',
      endTime: '09:30',
      date: '2026-04-02',
      status: 'confirmed',
      notes: 'Hair loss consultation follow-up',
    },
    {
      id: '2',
      patientName: 'Max Weber',
      patientAvatar: 'MW',
      caseId: '#1233',
      specialty: 'Dermatology',
      type: 'chat',
      startTime: '10:00',
      endTime: '10:30',
      date: '2026-04-02',
      status: 'confirmed',
      notes: 'Review photos and provide diagnosis',
    },
    {
      id: '3',
      patientName: 'Lisa Müller',
      patientAvatar: 'LM',
      caseId: '#1232',
      specialty: 'Dermatology',
      type: 'video',
      startTime: '11:30',
      endTime: '12:00',
      date: '2026-04-02',
      status: 'pending',
      notes: 'Initial acne consultation',
    },
    {
      id: '4',
      patientName: 'Tom Fischer',
      patientAvatar: 'TF',
      caseId: '#1231',
      specialty: 'Dermatology',
      type: 'video',
      startTime: '14:00',
      endTime: '14:30',
      date: '2026-04-02',
      status: 'confirmed',
    },
    {
      id: '5',
      patientName: 'Anna Becker',
      patientAvatar: 'AB',
      caseId: '#1230',
      specialty: 'General Medicine',
      type: 'chat',
      startTime: '15:30',
      endTime: '16:00',
      date: '2026-04-02',
      status: 'completed',
      notes: 'Prescription renewal discussion',
    },
    {
      id: '6',
      patientName: 'Peter Schmidt',
      patientAvatar: 'PS',
      caseId: '#1229',
      specialty: 'Dermatology',
      type: 'video',
      startTime: '09:30',
      endTime: '10:00',
      date: '2026-04-03',
      status: 'confirmed',
    },
    {
      id: '7',
      patientName: 'Maria Klein',
      patientAvatar: 'MK',
      caseId: '#1228',
      specialty: 'Dermatology',
      type: 'video',
      startTime: '13:00',
      endTime: '13:30',
      date: '2026-04-03',
      status: 'pending',
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    current.setDate(diff);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const todayAppointments = getAppointmentsForDate(new Date());
  const upcomingCount = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your appointments and availability
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Today's Appointments</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{todayAppointments.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {todayAppointments.filter(a => a.status === 'completed').length} completed
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{upcomingCount}</p>
          <p className="text-xs text-green-600 mt-1">Next 7 days</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Video Calls</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {appointments.filter(a => a.type === 'video').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Chat Consultations</h3>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {appointments.filter(a => a.type === 'chat').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="ml-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'day'
                  ? 'bg-[#5B6FF8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'week'
                  ? 'bg-[#5B6FF8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === 'month'
                  ? 'bg-[#5B6FF8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        {viewMode === 'day' && (
          <div className="space-y-2">
            {timeSlots.map((time) => {
              const appointment = getAppointmentsForDate(selectedDate).find(
                (apt) => apt.startTime === time
              );

              return (
                <div key={time} className="flex items-start gap-4 border-b border-gray-100 pb-2">
                  <div className="w-20 text-sm text-gray-600 font-medium pt-2">{time}</div>
                  <div className="flex-1">
                    {appointment ? (
                      <div
                        className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {appointment.patientAvatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">
                                  {appointment.patientName}
                                </p>
                                <span className="text-xs text-gray-500">{appointment.caseId}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{appointment.specialty}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm text-gray-600">
                                  {appointment.startTime} - {appointment.endTime}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                  {appointment.type === 'video' ? (
                                    <Video className="w-3.5 h-3.5 text-gray-600" />
                                  ) : (
                                    <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
                                  )}
                                  <span className="text-sm text-gray-600">
                                    {appointment.type === 'video' ? 'Video' : 'Chat'}
                                  </span>
                                </div>
                              </div>
                              {appointment.notes && (
                                <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                            <button
                              onClick={() => onCaseClick?.(appointment.caseId)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-12 border border-dashed border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center">
                        <span className="text-sm text-gray-400">Available</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-8 gap-px bg-gray-200">
                <div className="bg-white p-3 text-sm font-medium text-gray-600">Time</div>
                {getWeekDays(selectedDate).map((day) => (
                  <div
                    key={day.toISOString()}
                    className="bg-white p-3 text-center"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
              {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                <div key={time} className="grid grid-cols-8 gap-px bg-gray-200">
                  <div className="bg-white p-2 text-sm text-gray-600">{time}</div>
                  {getWeekDays(selectedDate).map((day) => {
                    const dayAppointments = getAppointmentsForDate(day).filter(
                      (apt) => apt.startTime === time
                    );

                    return (
                      <div key={day.toISOString()} className="bg-white p-1">
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-2 rounded text-xs ${getStatusColor(apt.status)} cursor-pointer hover:opacity-80`}
                          >
                            <p className="font-semibold truncate">{apt.patientName}</p>
                            <p className="truncate">{apt.caseId}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'month' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Month view coming soon</p>
            <p className="text-sm text-gray-500 mt-1">
              Use day or week view to manage your schedule
            </p>
          </div>
        )}
      </div>

      {/* Today's Appointments Summary */}
      {viewMode !== 'day' && todayAppointments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 rounded-lg border ${getStatusColor(apt.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {apt.patientAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{apt.patientName}</p>
                        <span className="text-xs text-gray-500">{apt.caseId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                          {apt.startTime} - {apt.endTime}
                        </span>
                        <span>•</span>
                        <span>{apt.specialty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        apt.status
                      )}`}
                    >
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    {apt.type === 'video' ? (
                      <Video className="w-5 h-5 text-gray-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    )}
                    <button
                      onClick={() => onCaseClick?.(apt.caseId)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
