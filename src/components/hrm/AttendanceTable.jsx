import React from 'react';
import { format } from 'date-fns';
import { useHrmStore } from '../../store/hrmStore';
import { Badge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

const AttendanceTable = () => {
  const { attendance } = useHrmStore();

  const getStatusBadge = (status) => {
    const statusColors = {
      Present: 'bg-green-100 text-green-800',
      Absent: 'bg-red-100 text-red-800',
      Late: 'bg-yellow-100 text-yellow-800',
      'Half-Day': 'bg-orange-100 text-orange-800',
      'On-Leave': 'bg-blue-100 text-blue-800',
      'Early-Leave': 'bg-purple-100 text-purple-800',
      Holiday: 'bg-indigo-100 text-indigo-800',
      'Day-Off': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} px-2 py-1 text-xs font-medium rounded`}>
        {status}
      </Badge>
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '-';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance && attendance.length > 0 ? (
            attendance.map((record, index) => (
              <TableRow key={record._id || index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                <TableCell>
                  {record.employee ? (
                    <div className="flex items-center gap-2">
                      {record.employee.avatar && (
                        <img
                          src={record.employee.avatar}
                          alt={`${record.employee.firstName} ${record.employee.lastName}`}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <span>{`${record.employee.firstName} ${record.employee.lastName}`}</span>
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>
                  {record.checkIn ? (
                    <div>
                      <div>{formatTime(record.checkIn.time)}</div>
                      {record.checkIn.late && (
                        <span className="text-xs text-red-500">Late by {record.checkIn.lateBy}</span>
                      )}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {record.checkOut ? (
                    <div>
                      <div>{formatTime(record.checkOut.time)}</div>
                      {record.checkOut.early && (
                        <span className="text-xs text-orange-500">Left early by {record.checkOut.earlyBy}</span>
                      )}
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {record.workHours ? (
                    <span className="font-medium">{record.workHours.toFixed(2)}h</span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {record.notes || '-'}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No attendance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable; 