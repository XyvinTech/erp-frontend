import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExpenseForm from '../../components/modules/frm/ExpenseForm';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import frmService from '@/services/frmService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ExpenseStats from '@/components/modules/frm/ExpenseStats';
import ExpenseCard from '@/components/modules/frm/ExpenseCard';

const ExpenseList = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, expense: null });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    paidAmount: 0,
    paidCount: 0,
    pendingAmount: 0,
    pendingCount: 0
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await frmService.getExpenses(filters);
      setExpenses(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (expenses) => {
    const newStats = {
      totalAmount: 0,
      totalCount: 0,
      paidAmount: 0,
      paidCount: 0,
      pendingAmount: 0,
      pendingCount: 0
    };

    expenses.forEach(expense => {
      newStats.totalAmount += expense.amount;
      newStats.totalCount += 1;

      if (expense.status === 'Approved') {
        newStats.paidAmount += expense.amount;
        newStats.paidCount += 1;
      } else if (expense.status === 'Pending') {
        newStats.pendingAmount += expense.amount;
        newStats.pendingCount += 1;
      }
    });

    setStats(newStats);
  };

  useEffect(() => {
    fetchExpenses();
    calculateStats(expenses);
  }, [filters]);

  const handleSubmit = async (data) => {
    try {
      if (editingExpense) {
        // Remove any unnecessary fields and empty values
        const { _id, status, submittedBy, approvedBy, createdAt, updatedAt, __v, ...updateFields } = data;
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add all fields to FormData
        Object.entries(updateFields).forEach(([key, value]) => {
          if (key === 'documents') {
            // Handle file uploads
            if (value && value.length) {
              for (let i = 0; i < value.length; i++) {
                formData.append('documents', value[i]);
              }
            }
          } else if (value !== undefined && value !== '') {
            formData.append(key, value);
          }
        });
        
        await frmService.updateExpense(editingExpense._id, formData);
        toast.success('Expense updated successfully');
      } else {
        // Create FormData for new expense
        const formData = new FormData();
        
        // Add all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'documents') {
            // Handle file uploads
            if (value && value.length) {
              for (let i = 0; i < value.length; i++) {
                formData.append('documents', value[i]);
              }
            }
          } else if (value !== undefined && value !== '') {
            formData.append(key, value);
          }
        });

        await frmService.createExpense(formData);
        toast.success('Expense created successfully');
      }
      setShowExpenseForm(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    // Format the expense data for the form
    const formattedExpense = {
      description: expense.description,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      notes: expense.notes || ''
    };
    // Store the ID separately in the editingExpense state
    setEditingExpense({
      ...formattedExpense,
      _id: expense._id
    });
    setShowExpenseForm(true);
  };

  const handleDelete = (expense) => {
    setDeleteModal({ isOpen: true, expense });
  };

  const confirmDelete = async () => {
    try {
      await frmService.deleteExpense(deleteModal.expense._id);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete expense');
    } finally {
      setDeleteModal({ isOpen: false, expense: null });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderMobileView = () => (
    <div className="space-y-4 lg:hidden">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );

  const renderDesktopView = () => (
    <div className="hidden lg:block">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Expense No.
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {expense.expenseNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                      {expense.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {expense.status === 'Pending' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-black hover:text-gray-800"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all expenses including their description, amount, date, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowExpenseForm(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Expense
          </button>
        </div>
      </div>

      <ExpenseStats stats={stats} />

      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          <option value="travel">Travel</option>
          <option value="office">Office Supplies</option>
          <option value="meals">Meals & Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="other">Other</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {renderMobileView()}
            {renderDesktopView()}
          </>
        )}
      </div>

      <ExpenseForm
        open={showExpenseForm}
        setOpen={(open) => {
          setShowExpenseForm(open);
          if (!open) setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expense: null })}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete the expense "${deleteModal.expense?.description}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ExpenseList; 