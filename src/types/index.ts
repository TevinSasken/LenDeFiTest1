export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  role: 'user' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface KYCData {
  name: string;
  idNumber: string;
  dateOfBirth: string;
  phone: string;
  email: string;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  duration: number;
  collateral: string;
  status: 'pending' | 'funded' | 'active' | 'repaid';
  createdAt: string;
  borrowerName: string;
  borrowerKyc: 'pending' | 'verified' | 'rejected';
}

export interface ROSCA {
  id: string;
  name: string;
  contributionAmount: number;
  cycleDuration: number;
  maxMembers: number;
  currentMembers: number;
  isOnChain: boolean;
  status: 'active' | 'completed';
  createdAt: string;
  nextPayout: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'loan' | 'rosca';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}