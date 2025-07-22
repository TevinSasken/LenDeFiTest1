export interface User {
  _id: string; // Changed from id to _id to match MongoDB
  email: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  idNumber: string;
  walletAddress?: string;
  role: 'user' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
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
  lenderId?: string;
  amount: number;
  interestRate: number;
  duration: number;
  collateral: string;
  description: string;
  status: 'pending' | 'funded' | 'active' | 'repaid' | 'defaulted';
  monthlyPayment: number;
  totalRepaid: number;
  remainingBalance: number;
  nextPaymentDate?: string;
  fundedAt?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  borrower?: User;
  lender?: User;
}

export interface ROSCA {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  cycleDuration: number;
  maxMembers: number;
  currentMembers: number;
  isOnChain: boolean;
  status: 'active' | 'completed' | 'cancelled';
  currentCycle: number;
  nextPayoutDate: string;
  createdBy: string;
  creator?: User;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'loan' | 'rosca' | 'deposit' | 'withdrawal';
  subType: 'request' | 'funded' | 'repayment' | 'contribution' | 'payout' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  referenceId?: string;
  txHash?: string;
  metadata?: object;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}