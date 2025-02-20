import ApiService from './api.service';

class HRMService extends ApiService {
  constructor() {
    super('/hrm');
  }

  // Department methods
  async getAllDepartments() {
    return await this.get('/departments');
  }

  async getDepartment(id) {
    return await this.get(`/departments/${id}`);
  }

  async createDepartment(data) {
    return await this.post('/departments', data);
  }

  async updateDepartment(id, data) {
    return await this.patch(`/departments/${id}`, data);
  }

  async deleteDepartment(id) {
    return await this.delete(`/departments/${id}`);
  }

  // Employee methods
  async getAllEmployees() {
    return await this.get('/employees');
  }

  async getEmployee(id) {
    return await this.get(`/employees/${id}`);
  }

  async createEmployee(data) {
    return await this.post('/employees', data);
  }

  async updateEmployee(id, data) {
    return await this.patch(`/employees/${id}`, data);
  }

  async deleteEmployee(id) {
    return await this.delete(`/employees/${id}`);
  }

  async updateEmployeePosition(id, data) {
    return await this.patch(`/employees/${id}/position`, data);
  }

  async updateEmployeeDepartment(id, data) {
    return await this.patch(`/employees/${id}/department`, data);
  }
}

// Create and export a singleton instance
const hrmService = new HRMService();
export default hrmService; 