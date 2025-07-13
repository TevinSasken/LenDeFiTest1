import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { ArrowLeft, User, Calendar, DollarSign, Shield, CreditCard } from 'lucide-react';

const LoanDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLoanDetails();
    }
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await loanAPI.getLoanById(id!);
      if (response.data.success) {
        setLoan(response.data.data.loan);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch loan details');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) {
      alert('Please enter a payment amount');
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await loanAPI.makePayment(id!, { amount: parseFloat(paymentAmount) });
      if (response.data.success) {
        alert(`Payment of ₿${paymentAmount} submitted successfully!`);
        setPaymentAmount('');
        fetchLoanDetails(); // Refresh loan data
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loan Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The requested loan could not be found.'}</p>
        <button
          onClick={() => navigate('/loans')}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Back to Loans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Loan Details</h1>
          <p className="text-gray-600 mt-1">Loan ID: {loan.id}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">₿{loan.amount}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
            {loan.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Borrower</p>
                    <p className="font-medium text-gray-900">{loan.borrower?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="font-medium text-gray-900">₿{loan.amount}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{loan.duration} months</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-medium text-gray-900">{loan.interestRate}% APR</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Collateral</p>
                    <p className="font-medium text-gray-900">{loan.collateral}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{new Date(loan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{loan.description}</p>
            </div>
          </div>

        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          {/* Loan Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-medium text-gray-900">₿{loan.monthlyPayment || '0.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Repaid:</span>
                <span className="font-medium text-green-600">₿{loan.totalRepaid || '0.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Balance:</span>
                <span className="font-medium text-orange-600">₿{loan.remainingBalance || loan.amount}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-600">Next Payment Due:</span>
                <span className="font-medium text-gray-900">
                  {loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Make Payment - Only show for active loans */}
          {loan.status === 'active' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Make Payment</h2>
              <form onSubmit={handleMakePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount (BTC)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      step="0.001"
                      min="0"
                      max={loan.remainingBalance || loan.amount}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={(loan.monthlyPayment || 0).toString()}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Suggested: ₿{loan.monthlyPayment || '0.000'} (monthly payment)
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((loan.monthlyPayment || 0).toString())}
                    className="flex-1 border border-orange-600 text-orange-600 py-2 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    Monthly Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((loan.remainingBalance || loan.amount).toString())}
                    className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors"
                  >
                    Pay in Full
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? 'Processing...' : 'Submit Payment'}
                </button>
              </form>
            </div>
          )}

          {/* Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Repayment Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(((loan.totalRepaid || 0) / loan.amount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((loan.totalRepaid || 0) / loan.amount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ₿{loan.totalRepaid || '0.000'} of ₿{loan.amount} repaid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;