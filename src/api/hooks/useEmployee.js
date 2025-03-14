import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import employeeApi from '../endpoints/employeeApi';
import { extractData } from '../utils/apiUtils';

/**
 * Hook for getting all employees
 * @param {Object} params - Query parameters
 * @returns {Object} - Employees query
 */
export const useEmployees = (params = {}) => {
    return useQuery({
        queryKey: ['employees', params],
        queryFn: () => employeeApi.getEmployees(params),
        select: (response) => extractData(response)
    });
};

/**
 * Hook for getting employee by ID
 * @param {String} id - Employee ID
 * @returns {Object} - Employee query
 */
export const useEmployee = (id) => {
    return useQuery({
        queryKey: ['employees', id],
        queryFn: () => employeeApi.getEmployeeById(id),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for creating employee
 * @returns {Object} - Create employee mutation
 */
export const useCreateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (employeeData) => employeeApi.createEmployee(employeeData),
        onSuccess: () => {
            // Invalidate employees query to refetch data
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });
};

/**
 * Hook for updating employee
 * @returns {Object} - Update employee mutation
 */
export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, employeeData }) => employeeApi.updateEmployee(id, employeeData),
        onSuccess: (_, variables) => {
            // Invalidate specific employee query
            queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
            // Invalidate employees list query
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });
};

/**
 * Hook for deleting employee
 * @returns {Object} - Delete employee mutation
 */
export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => employeeApi.deleteEmployee(id),
        onSuccess: () => {
            // Invalidate employees query to refetch data
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });
};

/**
 * Hook for getting employee attendance
 * @param {String} id - Employee ID
 * @param {Object} params - Query parameters
 * @returns {Object} - Employee attendance query
 */
export const useEmployeeAttendance = (id, params = {}) => {
    return useQuery({
        queryKey: ['employees', id, 'attendance', params],
        queryFn: () => employeeApi.getEmployeeAttendance(id, params),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for getting employee leave
 * @param {String} id - Employee ID
 * @param {Object} params - Query parameters
 * @returns {Object} - Employee leave query
 */
export const useEmployeeLeave = (id, params = {}) => {
    return useQuery({
        queryKey: ['employees', id, 'leave', params],
        queryFn: () => employeeApi.getEmployeeLeave(id, params),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for getting employee payslips
 * @param {String} id - Employee ID
 * @param {Object} params - Query parameters
 * @returns {Object} - Employee payslips query
 */
export const useEmployeePayslips = (id, params = {}) => {
    return useQuery({
        queryKey: ['employees', id, 'payslips', params],
        queryFn: () => employeeApi.getEmployeePayslips(id, params),
        select: (response) => extractData(response),
        enabled: !!id
    });
}; 