import React, { useState, useEffect } from 'react'; 
import { adminAPI } from '../services/api';
import { 
  Users, 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await adminAPI.getUserById(userId);
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setShowUserModal(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to fetch user details');
    }
  };

  const handleUpdateKYC = async (userId: string, status: string) => {
    try {
      const response = await adminAPI.updateKYC(userId, { kycStatus: status });
      if (response.data.success) {
        alert(`KYC status updated to ${status}`);
        fetchUsers(); // Refresh users list
        setShowUserModal(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update KYC status');
    }
  };

  const handleExport = async (type: string, format: string) => {
    try {
      const response = await adminAPI.exportData({ type, format });
      if (response.data.success) {
        // In a real implementation, this would trigger a file download
        alert(`${type} data exported as ${format.toUpperCase()}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to export data');
    }
  };

  const loans = [
    {
      id: '1',
      borrower: 'Alice Johnson',
      amount: 0.5,
      interestRate: 8.5,
      status: 'pending',
      requestDate: '2025-01-10',
      riskScore: 'Low',
    },
    {
      id: '2',
      borrower: 'Bob Smith',
      amount: 0.25,
      interestRate: 12.0,
      status: 'active',
      requestDate: '2025-01-09',
      riskScore: 'Medium',
    },
    {
      id: '3',
      borrower: 'David Wilson',
      amount: 1.0,
      interestRate: 7.5,
      status: 'pending',
      requestDate: '2025-01-08',
      riskScore: 'High',
    },
  ];

  const roscas = [
    {
      id: '1',
      name: 'Tech Entrepreneurs Circle',
      members: 7,
      maxMembers: 10,
      totalFund: 1.0,
      status: 'active',
      nextPayout: '2025-02-15',
    },
    {
      id: '2',
      name: 'Small Business Fund',
      members: 15,
      maxMembers: 20,
      totalFund: 1.0,
      status: 'active',
      nextPayout: '2025-01-25',
    },
  ];

  const stats = dashboardData ? [
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Loans',
      value: `₿${dashboardData.stats.totalLoanAmount.toFixed(2)}`,
      change: '+8%',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'ROSCA Groups',
      value: dashboardData.stats.totalROSCAs.toString(),
      change: '+15%',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Verified Users',
      value: dashboardData.stats.verifiedUsers.toString(),
      change: '+22%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ] : [];

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'loans', name: 'Loans', icon: CreditCard },
    { id: 'roscas', name: 'ROSCAs', icon: Shield },
  ];

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage users, loans, and platform settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {dashboardData?.recentActivity?.users?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">New user registration</p>
                      <p className="text-sm text-gray-500">{user.name} - KYC: {user.kycStatus}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {dashboardData?.recentActivity?.loans?.map((loan: any) => (
                <div key={loan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">Loan requires review</p>
                      <p className="text-sm text-gray-500">₿{loan.amount} loan request from {loan.borrower?.name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(loan.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleExport('users', 'csv')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('users', 'pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Export PDF
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KYC Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getKYCStatusIcon(user.kycStatus)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKYCStatusColor(user.kycStatus)}`}>
                          {user.kycStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUser(user.id)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          View
                        </button>
                        {user.kycStatus === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateKYC(user.id, 'verified')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateKYC(user.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Loan Management</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.borrower}</div>
                      <div className="text-sm text-gray-500">{new Date(loan.requestDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₿{loan.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{loan.interestRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(loan.riskScore)}`}>
                        {loan.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-orange-600 hover:text-orange-900">Review</button>
                        <button className="text-green-600 hover:text-green-900">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROSCAs Tab */}
      {activeTab === 'roscas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">ROSCA Management</h2>
          </div>

          <div className="grid gap-6">
            {roscas.map((rosca) => (
              <div key={rosca.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rosca.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {rosca.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₿{rosca.totalFund}</p>
                    <p className="text-sm text-gray-500">Total Fund</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="font-medium">{rosca.members}/{rosca.maxMembers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Payout</p>
                    <p className="font-medium">{new Date(rosca.nextPayout).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion</p>
                    <p className="font-medium">{Math.round((rosca.members / rosca.maxMembers) * 100)}%</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user.dateOfBirth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user.idNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getKYCStatusColor(selectedUser.user.kycStatus)}`}>
                    {selectedUser.user.kycStatus}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {selectedUser.loans?.slice(0, 3).map((loan: any) => (
                    <div key={loan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">Loan: ₿{loan.amount}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                  ))}
                  {selectedUser.transactions?.slice(0, 3).map((transaction: any) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{transaction.description}</span>
                      <span className="text-sm text-gray-600">₿{transaction.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;