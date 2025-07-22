import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401 && window.location.pathname !== '/auth') {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  createOrUpdateProfile: (userData: any) => api.post('/auth/profile', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  deleteAccount: () => api.delete('/auth/profile'),
};

// Loan API
export const loanAPI = {
  createRequest: (loanData: any) => api.post('/loans/request', loanData),
  getLoans: (params?: any) => api.get('/loans', { params }),
  getLoanById: (id: string) => api.get(`/loans/${id}`),
  fundLoan: (id: string) => api.post(`/loans/${id}/fund`),
  makePayment: (id: string, data: any) => api.post(`/loans/${id}/payment`, data),
};

// ROSCA API
export const roscaAPI = {
  create: (roscaData: any) => api.post('/roscas', roscaData),
  getROSCAs: (params?: any) => api.get('/roscas', { params }),
  getROSCAById: (id: string) => api.get(`/roscas/${id}`),
  joinROSCA: (id: string) => api.post(`/roscas/${id}/join`),
  contribute: (id: string, data: any) => api.post(`/roscas/${id}/contribute`, data),
  joinByInvite: (inviteCode: string) => api.post(`/roscas/join/${inviteCode}`),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (params?: any) => api.get('/transactions', { params }),
  getTransactionById: (id: string) => api.get(`/transactions/${id}`),
  getSummary: () => api.get('/transactions/summary'),
  create: (data: any) => api.post('/transactions', data),
  updateStatus: (id: string, data: any) => api.put(`/transactions/${id}/status`, data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateKYC: (id: string, data: any) => api.put(`/admin/users/${id}/kyc`, data),
  deactivateUser: (id: string, data: any) => api.put(`/admin/users/${id}/deactivate`, data),
  updateLoanStatus: (id: string, data: any) => api.put(`/admin/loans/${id}/status`, data),
  getLoans: (params?: any) => api.get('/admin/loans', { params }),
  getRoscas: (params?: any) => api.get('/admin/roscas', { params }),
  exportData: (params: any) => api.get('/admin/export', { 
    params, 
    // Handle binary data like CSV correctly
    responseType: params.format === 'csv' ? 'blob' : 'json' 
  }),
};

export default api;