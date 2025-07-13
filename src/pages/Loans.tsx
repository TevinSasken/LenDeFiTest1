import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { Plus, Search, Filter, Clock, CheckCircle, User } from 'lucide-react';

const Loans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, [activeTab]);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: any = {};
      
      if (activeTab === 'marketplace') {
        params.type = 'marketplace';
      } else if (activeTab === 'my-loans') {
        params.type = 'all';
      }
      
      const response = await loanAPI.getLoans(params);
      
      if (response.data.success) {
        setLoans(response.data.data.loans);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleFundLoan = async (loanId: string) => {
    try {
      const response = await loanAPI.fundLoan(loanId);
      if (response.data.success) {
        alert('Loan funded successfully!');
        fetchLoans(); // Refresh the list
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to fund loan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'repaid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLoans = loans.filter(loan =>
    (loan.borrower?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600 mt-1">Manage your loans and explore lending opportunities</p>
        </div>
        <Link
          to="/loans/request"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Request Loan</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'marketplace'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-loans'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Loans
          </button>
        </nav>
      </div>

      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Loan Cards */}
          <div className="grid gap-6">
            {filteredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{loan.borrower?.name || 'Unknown'}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                        {loan.borrower?.kycStatus === 'verified' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            KYC Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₿{loan.amount}</p>
                    <p className="text-sm text-gray-500">{loan.interestRate}% APR</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{loan.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{loan.duration} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Collateral</p>
                    <p className="font-medium">{loan.collateral}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(loan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/loan/${loan.id}`}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleFundLoan(loan.id)}
                    disabled={loan.status !== 'pending'}
                    className="flex-1 border border-orange-600 text-orange-600 py-2 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fund Loan
                  </button>
                </div>
              </div>
            ))}
            {filteredLoans.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <p>No loans found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'my-loans' && (
        <div className="space-y-6">
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {loan.lenderId ? 'Borrowed' : 'Requested'} Loan
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₿{loan.amount}</p>
                  <p className="text-sm text-gray-500">{loan.interestRate}% APR</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{loan.duration} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{loan.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(loan.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/loan/${loan.id}`}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors"
                >
                  View Details
                </Link>
                {loan.status === 'active' && (
                  <Link
                    to={`/loan/${loan.id}`}
                    className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors text-center"
                  >
                    Make Payment
                  </Link>
                )}
              </div>
            </div>
          ))}
          {loans.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No loans found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Loans;