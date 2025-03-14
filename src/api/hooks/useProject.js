import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import projectApi from '../endpoints/projectApi';
import { extractData } from '../utils/apiUtils';

/**
 * Hook for getting all projects
 * @param {Object} params - Query parameters
 * @returns {Object} - Projects query
 */
export const useProjects = (params = {}) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => projectApi.getProjects(params),
        select: (response) => extractData(response)
    });
};

/**
 * Hook for getting project by ID
 * @param {String} id - Project ID
 * @returns {Object} - Project query
 */
export const useProject = (id) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => projectApi.getProjectById(id),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for creating project
 * @returns {Object} - Create project mutation
 */
export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectData) => projectApi.createProject(projectData),
        onSuccess: () => {
            // Invalidate projects query to refetch data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
};

/**
 * Hook for updating project
 * @returns {Object} - Update project mutation
 */
export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, projectData }) => projectApi.updateProject(id, projectData),
        onSuccess: (_, variables) => {
            // Invalidate specific project query
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
            // Invalidate projects list query
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
};

/**
 * Hook for deleting project
 * @returns {Object} - Delete project mutation
 */
export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => projectApi.deleteProject(id),
        onSuccess: () => {
            // Invalidate projects query to refetch data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
};

/**
 * Hook for getting project tasks
 * @param {String} id - Project ID
 * @param {Object} params - Query parameters
 * @returns {Object} - Project tasks query
 */
export const useProjectTasks = (id, params = {}) => {
    return useQuery({
        queryKey: ['projects', id, 'tasks', params],
        queryFn: () => projectApi.getProjectTasks(id, params),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for assigning project to employee
 * @returns {Object} - Assign project mutation
 */
export const useAssignProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, assignmentData }) => projectApi.assignProject(id, assignmentData),
        onSuccess: (_, variables) => {
            // Invalidate specific project query
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
            // Invalidate project team query
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id, 'team'] });
        }
    });
};

/**
 * Hook for getting project team members
 * @param {String} id - Project ID
 * @returns {Object} - Project team query
 */
export const useProjectTeam = (id) => {
    return useQuery({
        queryKey: ['projects', id, 'team'],
        queryFn: () => projectApi.getProjectTeam(id),
        select: (response) => extractData(response),
        enabled: !!id
    });
};

/**
 * Hook for getting my projects
 * @param {Object} params - Query parameters
 * @returns {Object} - My projects query
 */
export const useMyProjects = (params = {}) => {
    return useQuery({
        queryKey: ['myProjects', params],
        queryFn: () => projectApi.getMyProjects(params),
        select: (response) => extractData(response)
    });
}; 