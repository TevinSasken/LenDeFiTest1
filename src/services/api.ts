import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
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
  exportData: (params: any) => api.get('/admin/export', { params }),
};

export default api;