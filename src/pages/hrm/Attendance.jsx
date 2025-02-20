import { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { toast } from 'react-hot-toast';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  UserGroupIcon,
  SunIcon,
  CalendarDaysIcon,
  CheckIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import useHrmStore from '../../store/hrm/useHrmStore';
import AttendanceModal from '../../components/modules/hrm/AttendanceModal';
import AttendanceEditModal from '../../components/modules/hrm/AttendanceEditModal';

const AttendanceTypeIcons = () => {
  const icons = [
    { icon: SunIcon, label: 'Present', color: 'text-green-500' },
    { icon: ClockIcon, label: 'Late', color: 'text-yellow-500' },
    { icon: ArrowRightOnRectangleIcon, label: 'Early-Leave', color: 'text-orange-500' },
    { icon: CalendarDaysIcon, label: 'Half-Day', color: 'text-blue-500' },
    { icon: PaperAirplaneIcon, label: 'On-Leave', color: 'text-purple-500' },
    { icon: XMarkIcon, label: 'Absent', color: 'text-red-500' },
    { icon: CalendarDaysIcon, label: 'Holiday', color: 'text-green-500' },
    { icon: MoonIcon, label: 'Day-Off', color: 'text-gray-500' }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium text-gray-700">Note:</span>
        {icons.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, value, change, isIncrease }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${isIncrease ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`h-6 w-6 ${isIncrease ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500"> vs last month</span>
      </div>
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Present':
      return SunIcon;
    case 'Late':
      return ClockIcon;
    case 'Early-Leave':
      return ArrowRightOnRectangleIcon;
    case 'Half-Day':
      return CalendarDaysIcon;
    case 'On-Leave':
      return PaperAirplaneIcon;
    case 'Absent':
      return XMarkIcon;
    case 'Holiday':
      return CalendarDaysIcon;
    case 'Day-Off':
      return MoonIcon;
    default:
      return XMarkIcon;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-green-100 text-green-500';
    case 'Late':
      return 'bg-yellow-100 text-yellow-500';
    case 'Early-Leave':
      return 'bg-orange-100 text-orange-500';
    case 'Half-Day':
      return 'bg-blue-100 text-blue-500';
    case 'On-Leave':
      return 'bg-purple-100 text-purple-500';
    case 'Absent':
      return 'bg-red-100 text-red-500';
    case 'Holiday':
      return 'bg-pink-100 text-pink-500';
    case 'Day-Off':
      return 'bg-gray-100 text-gray-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const formatTime = (dateObj, status, isHoliday) => {
  if (status === 'Holiday' || isHoliday) {
    return 'Not checked in - Holiday';
  }
  if (status === 'On-Leave') {
    return 'Not checked in - On Leave';
  }
  if (!dateObj) return null;
  try {
    // Handle both direct date strings and nested time objects
    const dateString = dateObj.time ? dateObj.time : dateObj;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Invalid date
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

const Attendance = () => {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const {
    attendance,
    attendanceLoading,
    attendanceError,
    fetchAttendance,
    checkIn,
    getAttendanceStats,
    deleteAttendance
  } = useHrmStore();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    halfDay: 0,
    onLeave: 0,
    changes: {
      employees: '0%',
      present: '0%',
      halfDay: '0%',
      leave: '0%'
    }
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchAttendance();
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load attendance data');
      }
    };

    loadInitialData();
  }, []); // Run only once on component mount

  // Load attendance stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get current month's date range
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get current month's stats
        const response = await getAttendanceStats({
          startDate: currentMonthStart.toISOString(),
          endDate: currentMonthEnd.toISOString()
        });
        
        console.log('Current Month Response:', response);

        if (response?.stats || Array.isArray(attendance)) {
          // Get unique employees from attendance data
          const uniqueEmployees = new Set(
            attendance.map(record => record.employee._id)
          );
          
          const totalEmployees = uniqueEmployees.size;
          const presentCount = attendance.filter(record => record.status === 'Present').length;
          const halfDayCount = attendance.filter(record => record.status === 'Half-Day').length;
          const leaveCount = attendance.filter(record => record.status === 'On-Leave').length;

          console.log('Current Month Counts:', {
            totalEmployees,
            presentCount,
            halfDayCount,
            leaveCount
          });

          // Get previous month's date range
          const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

          // Get previous month's stats
          const prevMonthResponse = await getAttendanceStats({
            startDate: prevMonthStart.toISOString(),
            endDate: prevMonthEnd.toISOString()
          });

          console.log('Previous Month Response:', prevMonthResponse);

          // Calculate previous month's stats
          const prevStats = prevMonthResponse?.stats || [];
          const prevTotalEmployees = prevStats.length > 0 ? new Set(prevStats.map(stat => stat._id)).size : 0;
          const prevPresentCount = prevStats.filter(stat => stat.status === 'Present').length;
          const prevHalfDayCount = prevStats.filter(stat => stat.status === 'Half-Day').length;
          const prevLeaveCount = prevStats.filter(stat => stat.status === 'On-Leave').length;

          console.log('Previous Month Counts:', {
            prevTotalEmployees,
            prevPresentCount,
            prevHalfDayCount,
            prevLeaveCount
          });

          // Calculate percentage changes
          const calculateChange = (current, previous) => {
            if (previous === 0) {
              return current > 0 ? '+100%' : '0%';
            }
            const change = ((current - previous) / previous) * 100;
            return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
          };

          const newStats = {
            totalEmployees,
            presentToday: presentCount,
            halfDay: halfDayCount,
            onLeave: leaveCount,
            changes: {
              employees: calculateChange(totalEmployees, prevTotalEmployees),
              present: calculateChange(presentCount, prevPresentCount),
              halfDay: calculateChange(halfDayCount, prevHalfDayCount),
              leave: calculateChange(leaveCount, prevLeaveCount)
            }
          };

          console.log('Setting new stats:', newStats);
          setStats(newStats);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
        toast.error('Failed to load attendance statistics');
      }
    };

    loadStats();
  }, [getAttendanceStats, attendance]);

  const handleCheckIn = async () => {
    try {
      await checkIn({ date: selectedDate });
      toast.success('Checked in successfully');
      // Refresh both attendance list and stats
      await Promise.all([
        fetchAttendance(),
        getAttendanceStats()
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleEdit = (attendance) => {
    setSelectedAttendance(attendance);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAttendance(id);
        toast.success('Attendance record deleted successfully');
        // Refresh both attendance list and stats
        await Promise.all([
          fetchAttendance(),
          getAttendanceStats()
        ]);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete attendance record');
      }
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Employee',
        accessor: (row) => `${row.employee.firstName} ${row.employee.lastName}`,
        Cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            
            <div>
              <p className="font-medium text-gray-900">
                {row.original.employee.firstName} {row.original.employee.lastName}
              </p>
              <p className="text-sm text-gray-500">{row.original.employee.employeeId}</p>
            </div>
          </div>
        )
      },
      {
        Header: 'Department',
        accessor: 'employee.department.name',
      },
      {
        Header: 'Position',
        accessor: 'employee.position.title',
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
        sortType: 'datetime'
      },
      {
        Header: 'Check In',
        accessor: 'checkIn',
        Cell: ({ row }) => {
          const time = formatTime(row.original.checkIn, row.original.status, row.original.isHoliday);
          if (row.original.status === 'Holiday' || row.original.isHoliday) {
            return (
              <div className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-500">
                <CalendarDaysIcon className="mr-1 h-4 w-4" />
                {time}
              </div>
            );
          }
          if (row.original.status === 'On-Leave') {
            return (
              <div className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-500">
                <PaperAirplaneIcon className="mr-1 h-4 w-4" />
                {time}
              </div>
            );
          }
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!time ? 'bg-yellow-100 text-yellow-500' : 'text-gray-500'}`}>
              {!time && <ClockIcon className="mr-1 h-4 w-4" />}
              {time || 'Not checked in'}
            </div>
          );
        },
        sortType: (rowA, rowB) => {
          const a = rowA.original.checkIn?.time || rowA.original.createdAt;
          const b = rowB.original.checkIn?.time || rowB.original.createdAt;
          return new Date(a) - new Date(b);
        }
      },
      {
        Header: 'Check Out',
        accessor: 'checkOut',
        Cell: ({ row }) => {
          const time = formatTime(row.original.checkOut, row.original.status, row.original.isHoliday);
          if (row.original.status === 'Holiday' || row.original.isHoliday) {
            return (
              <div className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-500">
                <CalendarDaysIcon className="mr-1 h-4 w-4" />
                {time}
              </div>
            );
          }
          if (row.original.status === 'On-Leave') {
            return (
              <div className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-500">
                <PaperAirplaneIcon className="mr-1 h-4 w-4" />
                {time}
              </div>
            );
          }
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!time ? 'bg-yellow-100 text-yellow-500' : 'text-gray-500'}`}>
              {!time && <ClockIcon className="mr-1 h-4 w-4" />}
              {time || 'Not checked out'}
            </div>
          );
        },
        sortType: (rowA, rowB) => {
          const a = rowA.original.checkOut?.time;
          const b = rowB.original.checkOut?.time;
          if (!a && !b) return 0;
          if (!a) return 1;
          if (!b) return -1;
          return new Date(a) - new Date(b);
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          const StatusIcon = getStatusIcon(value);
          const colorClass = getStatusColor(value);
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
              <StatusIcon className="mr-1 h-4 w-4" aria-hidden="true" />
              <span>{value}</span>
            </div>
          );
        },
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
              title="Edit Attendance"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="text-red-600 hover:text-red-900 transition-colors duration-200"
              title="Delete Attendance"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => {
    return Array.isArray(attendance) ? attendance : [];
  }, [attendance]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useSortBy,
    usePagination
  );

  if (attendanceLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        {attendanceError}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={UserGroupIcon}
          title="Total Employees"
          value={stats.totalEmployees}
          change={stats.changes.employees}
          isIncrease={stats.changes.employees.startsWith('+')}
        />
        <SummaryCard
          icon={CheckIcon}
          title="Present Today"
          value={stats.presentToday}
          change={stats.changes.present}
          isIncrease={stats.changes.present.startsWith('+')}
        />
        <SummaryCard
          icon={ClockIcon}
          title="Half Day"
          value={stats.halfDay}
          change={stats.changes.halfDay}
          isIncrease={stats.changes.halfDay.startsWith('+')}
        />
        <SummaryCard
          icon={PaperAirplaneIcon}
          title="On Leave"
          value={stats.onLeave}
          change={stats.changes.leave}
          isIncrease={stats.changes.leave.startsWith('+')}
        />
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Attendance Management</h2>
            <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePreviousMonth}
                  className="btn btn-icon btn-secondary transition-all duration-200 hover:scale-105"
                  title="Previous Month"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="min-w-[200px] text-center text-lg font-medium text-gray-900">
                  {formatMonthYear(currentDate)}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="btn btn-icon btn-secondary transition-all duration-200 hover:scale-105"
                  title="Next Month"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-secondary mt-3 inline-flex w-full items-center justify-center sm:mt-0 sm:w-auto"
              >
                <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" />
                Bulk Attendance
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <AttendanceTypeIcons />

          {/* Table */}
          <div className="mt-4 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300" {...getTableProps()}>
                    <thead className="bg-gray-50">
                      {headerGroups.map(headerGroup => {
                        const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                          <tr key={key} {...headerGroupProps}>
                            {headerGroup.headers.map(column => {
                              const { key, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());
                              return (
                                <th
                                  key={key}
                                  {...columnProps}
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  <div className="group inline-flex">
                                    {column.render('Header')}
                                    <span className="ml-2 flex-none rounded">
                                      {column.isSorted ? (
                                        column.isSortedDesc ? (
                                          <ChevronDownIcon className="h-5 w-5" />
                                        ) : (
                                          <ChevronUpIcon className="h-5 w-5" />
                                        )
                                      ) : null}
                                    </span>
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white" {...getTableBodyProps()}>
                      {page.map(row => {
                        prepareRow(row);
                        const { key, ...rowProps } = row.getRowProps();
                        return (
                          <tr key={key} {...rowProps}>
                            {row.cells.map(cell => {
                              const { key, ...cellProps } = cell.getCellProps();
                              return (
                                <td
                                  key={key}
                                  {...cellProps}
                                  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                >
                                  {cell.render('Cell')}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((pageIndex + 1) * pageSize, data.length)}
                  </span>{' '}
                  of <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="btn btn-icon btn-secondary"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="btn btn-icon btn-secondary"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Attendance Modal */}
      {showModal && (
        <AttendanceModal
          attendance={selectedAttendance}
          onClose={() => {
            setShowModal(false);
            setSelectedAttendance(null);
          }}
          onSuccess={async () => {
            setShowModal(false);
            setSelectedAttendance(null);
            // Refresh both attendance list and stats
            await Promise.all([
              fetchAttendance(),
              getAttendanceStats()
            ]);
          }}
        />
      )}

      {/* Edit Attendance Modal */}
      {showEditModal && (
        <AttendanceEditModal
          attendance={selectedAttendance}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAttendance(null);
          }}
          onSuccess={async () => {
            setShowEditModal(false);
            setSelectedAttendance(null);
            // Refresh both attendance list and stats
            await Promise.all([
              fetchAttendance(),
              getAttendanceStats()
            ]);
          }}
        />
      )}
    </div>
  );
};

export default Attendance; 