import api from './api';

const EXPENSE_URL = '/api/frm/expenses';
const PERSONAL_LOAN_URL = '/api/frm/personal-loans';
const OFFICE_LOAN_URL = '/api/frm/office-loans';

// Expense Services
const createExpense = async (expenseData) => {
  try {
    // Log the incoming data for debugging
    console.log('Creating expense with data:', {
      ...expenseData,
      documents: expenseData.documents ? `${expenseData.documents.length} files` : 'no files'
    });

    // Create form data only if there are files
    let requestData = expenseData;
    let headers = { 'Content-Type': 'application/json' };

    if (expenseData.documents?.length > 0) {
      const formData = new FormData();
      
      // Append expense data
      Object.keys(expenseData).forEach(key => {
        if (key !== 'documents') {
          formData.append(key, expenseData[key]);
        }
      });

      // Append documents if any
      Array.from(expenseData.documents).forEach(file => {
        formData.append('documents', file);
      });

      requestData = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      // Remove empty documents array if no files
      delete requestData.documents;
    }

    const response = await api.post(EXPENSE_URL, requestData, { headers });
    return response.data;
  } catch (error) {
    console.error('Expense creation error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
};

const getExpenses = async (filters = {}) => {
  const response = await api.get(EXPENSE_URL, { params: filters });
  return response.data;
};

const getExpenseById = async (id) => {
  const response = await api.get(`${EXPENSE_URL}/${id}`);
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  try {
    // Log the incoming data for debugging
    console.log('Updating expense with data:', {
      id,
      ...expenseData,
      documents: expenseData.documents ? `${expenseData.documents.length} files` : 'no files'
    });

    // Create request data based on whether there are files
    let requestData = expenseData;
    let headers = { 'Content-Type': 'application/json' };

    if (expenseData.documents?.length > 0) {
      const formData = new FormData();
      
      // Append expense data
      Object.keys(expenseData).forEach(key => {
        if (key !== 'documents') {
          formData.append(key, expenseData[key]);
        }
      });

      // Append documents if any
      Array.from(expenseData.documents).forEach(file => {
        formData.append('documents', file);
      });

      requestData = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      // Remove empty documents array if no files
      delete requestData.documents;
    }

    const response = await api.put(`${EXPENSE_URL}/${id}`, requestData, { headers });
    return response.data;
  } catch (error) {
    console.error('Expense update error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
};

const deleteExpense = async (id) => {
  const response = await api.delete(`${EXPENSE_URL}/${id}`);
  return response.data;
};

const processExpense = async (id, { status, notes }) => {
  const response = await api.post(`${EXPENSE_URL}/${id}/process`, { status, notes });
  return response.data;
};

const getExpenseStats = async () => {
  const response = await api.get(`${EXPENSE_URL}/stats/overview`);
  return response.data;
};

// Get next expense number
const getNextExpenseNumber = async () => {
  try {
    console.log('Requesting next expense number...');
    const response = await api.get(`${EXPENSE_URL}/next-number`);
    console.log('Next expense number response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get next expense number');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching next expense number:', error);
    throw error;
  }
};

// Personal Loan Services
const createPersonalLoan = async (loanData) => {
  const formData = new FormData();
  
  Object.keys(loanData).forEach(key => {
    if (key !== 'documents') {
      if (typeof loanData[key] === 'object') {
        formData.append(key, JSON.stringify(loanData[key]));
      } else {
        formData.append(key, loanData[key]);
      }
    }
  });

  if (loanData.documents) {
    loanData.documents.forEach(file => {
      formData.append('documents', file);
    });
  }

  const response = await api.post(PERSONAL_LOAN_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const getPersonalLoans = async (filters = {}) => {
  const response = await api.get(PERSONAL_LOAN_URL, { params: filters });
  return response.data;
};

const getPersonalLoanById = async (id) => {
  const response = await api.get(`${PERSONAL_LOAN_URL}/${id}`);
  return response.data;
};

const updatePersonalLoan = async (id, loanData) => {
  const formData = new FormData();
  
  Object.keys(loanData).forEach(key => {
    if (key !== 'documents') {
      if (typeof loanData[key] === 'object') {
        formData.append(key, JSON.stringify(loanData[key]));
      } else {
        formData.append(key, loanData[key]);
      }
    }
  });

  if (loanData.documents) {
    loanData.documents.forEach(file => {
      formData.append('documents', file);
    });
  }

  const response = await api.put(`${PERSONAL_LOAN_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const processPersonalLoan = async (id, { status, notes }) => {
  const response = await api.post(`${PERSONAL_LOAN_URL}/${id}/process`, { status, notes });
  return response.data;
};

const recordPersonalLoanPayment = async (id, paymentData) => {
  const response = await api.post(`${PERSONAL_LOAN_URL}/${id}/payment`, paymentData);
  return response.data;
};

const getPersonalLoanStats = async () => {
  const response = await api.get(`${PERSONAL_LOAN_URL}/stats/overview`);
  return response.data;
};

// Office Loan Services
const createOfficeLoan = async (loanData) => {
  const formData = new FormData();
  
  Object.keys(loanData).forEach(key => {
    if (key !== 'documents') {
      if (typeof loanData[key] === 'object') {
        formData.append(key, JSON.stringify(loanData[key]));
      } else {
        formData.append(key, loanData[key]);
      }
    }
  });

  if (loanData.documents) {
    loanData.documents.forEach(file => {
      formData.append('documents', file);
    });
  }

  const response = await api.post(OFFICE_LOAN_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const getOfficeLoans = async (filters = {}) => {
  const response = await api.get(OFFICE_LOAN_URL, { params: filters });
  return response.data;
};

const getOfficeLoanById = async (id) => {
  const response = await api.get(`${OFFICE_LOAN_URL}/${id}`);
  return response.data;
};

const updateOfficeLoan = async (id, loanData) => {
  const formData = new FormData();
  
  Object.keys(loanData).forEach(key => {
    if (key !== 'documents') {
      if (typeof loanData[key] === 'object') {
        formData.append(key, JSON.stringify(loanData[key]));
      } else {
        formData.append(key, loanData[key]);
      }
    }
  });

  if (loanData.documents) {
    loanData.documents.forEach(file => {
      formData.append('documents', file);
    });
  }

  const response = await api.put(`${OFFICE_LOAN_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const processOfficeLoan = async (id, { status, notes, repaymentPlan }) => {
  const response = await api.post(`${OFFICE_LOAN_URL}/${id}/process`, { status, notes, repaymentPlan });
  return response.data;
};

const recordOfficeLoanPayment = async (id, paymentData) => {
  const response = await api.post(`${OFFICE_LOAN_URL}/${id}/payment`, paymentData);
  return response.data;
};

const getOfficeLoanStats = async () => {
  const response = await api.get(`${OFFICE_LOAN_URL}/stats/department`);
  return response.data;
};

const frmService = {
  // Expense services
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  processExpense,
  getExpenseStats,
  getNextExpenseNumber,

  // Personal Loan services
  createPersonalLoan,
  getPersonalLoans,
  getPersonalLoanById,
  updatePersonalLoan,
  processPersonalLoan,
  recordPersonalLoanPayment,
  getPersonalLoanStats,

  // Office Loan services
  createOfficeLoan,
  getOfficeLoans,
  getOfficeLoanById,
  updateOfficeLoan,
  processOfficeLoan,
  recordOfficeLoanPayment,
  getOfficeLoanStats
};

export default frmService; 