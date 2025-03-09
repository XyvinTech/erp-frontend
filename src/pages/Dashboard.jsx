import { useEffect, useState } from 'react';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import useDashboardStore from '@/stores/dashboardStore';

const Dashboard = () => {
  const {
    stats,
    loading,
    fetchStats,
    fetchAttendance,
    fetchDepartments,
  } = useDashboardStore();

  // State for selected month in calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchStats();
    fetchAttendance();
    fetchDepartments();
  }, []);

  if (loading.stats || loading.attendance || loading.departments) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  // Sample event data (replace with real data from your store)
  const events = [
    {
      title: 'Team Meeting',
      start: '2025-03-10T10:00:00',
      end: '2025-03-10T11:00:00',
      status: 'Upcoming',
      backgroundColor: '#36A2EB',
    },
    {
      title: 'Project Deadline',
      start: '2025-03-15',
      end: '2025-03-15',
      status: 'Upcoming',
      backgroundColor: '#36A2EB',
    },
    {
      title: 'Conference Call',
      start: '2025-03-07T14:00:00',
      end: '2025-03-07T15:00:00',
      status: 'Ongoing',
      backgroundColor: '#FFCE56',
    },
    {
      title: 'Training Session',
      start: '2025-03-05',
      end: '2025-03-05',
      status: 'Completed',
      backgroundColor: '#4BC0C0',
    },
  ];

  const cards = [
    {
      name: 'Total Events',
      value: events.length,
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Upcoming Events',
      value: events.filter((e) => e.status === 'Upcoming').length,
      icon: BuildingOfficeIcon,
      change: '0%',
      changeType: 'neutral',
    },
    {
      name: 'Ongoing Events',
      value: events.filter((e) => e.status === 'Ongoing').length,
      icon: BriefcaseIcon,
      change: '+2.5%',
      changeType: 'positive',
    },
    {
      name: 'Completed Events',
      value: events.filter((e) => e.status === 'Completed').length,
      icon: ClockIcon,
      change: '-3%',
      changeType: 'negative',
    },
  ];

  // Filter events for the current month
  const getMonthlyEvents = () => {
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  };

  const monthlyEvents = getMonthlyEvents();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {card.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  card.changeType === 'positive'
                    ? 'text-green-600'
                    : card.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {card.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Calendar and Monthly Events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FullCalendar */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Event Calendar
          </h3>
          <div className="mt-4 h-[400px]">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventContent={(eventInfo) => (
                <div>
                  <b>{eventInfo.event.title}</b>
                  <p>{eventInfo.event.extendedProps.status}</p>
                </div>
              )}
              datesSet={(dateInfo) => setCurrentMonth(dateInfo.start)}
              height="100%"
            />
          </div>
        </div>

        {/* Monthly Event Listing */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Monthly Events (
            {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
            {currentMonth.getFullYear()})
          </h3>
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {monthlyEvents.length > 0 ? (
              <ul className="space-y-2">
                {monthlyEvents.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.start).toLocaleDateString()} -{' '}
                        {event.status}
                      </p>
                    </div>
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: event.backgroundColor }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No events this month.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;