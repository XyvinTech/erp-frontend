import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTable, useSortBy } from 'react-table';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import useHrmStore from '../../store/hrm/useHrmStore';
import * as hrmService from '../../services/hrm/hrmService';
import PayrollModal from '../../components/modules/hrm/PayrollModal';
import PayrollStatusModal from '../../components/modules/hrm/PayrollStatusModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';

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

const Payroll = () => {
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, payroll: null });
  const { payroll, payrollLoading, payrollError, fetchPayroll } = useHrmStore();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalProcessed: 0,
    changes: {
      employees: '0%',
      paid: '0%',
      unpaid: '0%',
      processed: '0%'
    }
  });

  const fetchPayrollData = useCallback(() => {
    fetchPayroll();
  }, []);

  useEffect(() => {
    fetchPayrollData();
    console.log(payroll, 'payroll')
  }, [fetchPayrollData]);

  const handleDeleteClick = (payroll) => {
    setDeleteModal({ isOpen: true, payroll });
  };

  // Calculate stats from payroll data
  useEffect(() => {
    if (Array.isArray(payroll)) {
      const uniqueEmployees = new Set(payroll.map(record => record.employee._id));
      const paidEmployees = payroll.filter(record => record.status === 'paid').length;
      const unpaidEmployees = payroll.filter(record => record.status === 'pending').length;
      const processedEmployees = payroll.filter(record => record.status === 'processed').length;

      // Calculate mock changes (you can replace this with actual historical data comparison)
      const mockChanges = {
        employees: '+5%',
        paid: '+8%',
        unpaid: '-3%',
        processed: '+4%'
      };

      setStats({
        totalEmployees: uniqueEmployees.size,
        totalPaid: paidEmployees,
        totalUnpaid: unpaidEmployees,
        totalProcessed: processedEmployees,
        changes: mockChanges
      });
    }
  }, [payroll]);

  const columns = useMemo(
    () => [
      {
        Header: 'Employee Id',
        accessor: (row) => `${row.employee.firstName} ${row.employee.lastName}`,
      },
      {
        Header: 'Employee Name',
        accessor: 'employee.department.name',
      },
      {
        Header: 'Position',
        accessor: 'employee.position.title',
      },
      {
        Header: 'Email',
        accessor: 'employee.email',
      },
      {
        Header: 'Joining Date',
        accessor: 'employee.joiningDate',
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      },
      {
        Header: 'Salary',
        accessor: 'netSalary',
        Cell: ({ value }) => `$${value?.toLocaleString() || '0'}`,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              value === 'paid'
                ? 'bg-green-100 text-green-800'
                : value === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-blue-600 hover:text-blue-900"
              title="Edit Payroll"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleStatusUpdate(row.original)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Update Status"
            >
              <ClockIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="text-red-600 hover:text-red-900"
              title="Delete Payroll"
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
    return Array.isArray(payroll) ? payroll : [];
  }, [payroll]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const handleEdit = (payroll) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const handleStatusUpdate = (payroll) => {
    setSelectedPayroll(payroll);
    setShowStatusModal(true);
  };

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        const id = deleteModal.payroll._id || deleteModal.payroll.id;
        await hrmService.deletePayroll(id);
        toast.success('Payroll record deleted successfully');
        fetchPayroll();
        setDeleteModal({ isOpen: false, payroll: null });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete payroll record');
      }
    // }
  };

  if (payrollLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (payrollError) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        {payrollError}
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
          icon={CurrencyDollarIcon}
          title="Total Paid"
          value={stats.totalPaid}
          change={stats.changes.paid}
          isIncrease={stats.changes.paid.startsWith('+')}
        />
        <SummaryCard
          icon={ExclamationCircleIcon}
          title="Total Unpaid"
          value={stats.totalUnpaid}
          change={stats.changes.unpaid}
          isIncrease={stats.changes.unpaid.startsWith('+')}
        />
        <SummaryCard
          icon={PaperAirplaneIcon}
          title="Processed"
          value={stats.totalProcessed}
          change={stats.changes.processed}
          isIncrease={stats.changes.processed.startsWith('+')}
        />
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="flex justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Payroll Management</h2>
          <button
            onClick={() => {
              setSelectedPayroll(null);
              setShowModal(true);
            }}
            className="btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Payroll
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300" {...getTableProps()}>
                <thead>
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
                  {rows.map(row => {
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, payroll: null })}
        onConfirm={handleDelete}
        title="Delete Payroll"
        message={`Are you sure ! you want to delete the payroll record for
          ${deleteModal.payroll?.employee?.firstName} ${deleteModal.payroll?.employee?.lastName} ? This action cannot be undone.`}
        itemName="payroll"
      />

      {/* Payroll Edit Modal */}
      {showModal && (
        <PayrollModal
          payroll={selectedPayroll}
          onClose={() => {
            setShowModal(false);
            setSelectedPayroll(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedPayroll(null);
            fetchPayroll();
          }}
        />
      )}

      {/* Payroll Status Modal */}
      {showStatusModal && (
        <PayrollStatusModal
          payroll={selectedPayroll}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedPayroll(null);
          }}
          onSuccess={() => {
            setShowStatusModal(false);
            setSelectedPayroll(null);
            fetchPayroll();
          }}
        />
      )}
    </div>
  );
};

export default Payroll; 