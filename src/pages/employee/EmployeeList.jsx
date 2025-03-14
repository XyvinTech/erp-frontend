import { useState } from "react";
import { useEmployees, useDeleteEmployee } from "../../api/hooks/useEmployee";
import useUiStore from "../../store/uiStore";
import useAuthHook from "../../hooks/useAuthHook";
import { RoleBasedRenderer } from "../../components/common/RoleBasedRenderer";

/**
 * EmployeeList component that displays a list of employees
 * Uses TanStack Query for data fetching and Zustand for UI state
 */
const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // TanStack Query hooks
  const {
    data: employees,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  const deleteEmployeeMutation = useDeleteEmployee();

  // Zustand store
  const { openModal, addToast } = useUiStore();

  // Auth hook
  const { checkRole } = useAuthHook();

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteEmployeeMutation.mutateAsync(id);
      addToast({
        type: "success",
        message: "Employee deleted successfully",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Failed to delete employee",
      });
    }
  };

  // Handle edit
  const handleEdit = (employee) => {
    openModal("editEmployee", employee);
  };

  // Handle view
  const handleView = (employee) => {
    openModal("viewEmployee", employee);
  };

  // Handle add
  const handleAdd = () => {
    openModal("addEmployee");
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          {error?.message || "Failed to load employees"}
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>

        <RoleBasedRenderer roles={["HR Manager", "ERP System Administrator"]}>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAdd}
          >
            Add Employee
          </button>
        </RoleBasedRenderer>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees?.data?.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.employeeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.position?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleView(employee)}
                  >
                    View
                  </button>

                  <RoleBasedRenderer
                    roles={["HR Manager", "ERP System Administrator"]}
                  >
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </RoleBasedRenderer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">entries</span>
        </div>

        <div className="flex">
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          <span className="mx-2 py-1">
            Page {currentPage} of {employees?.totalPages || 1}
          </span>

          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            disabled={currentPage === (employees?.totalPages || 1)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
