import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/api';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  Wallet,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = React.useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [transactionsRes, summaryRes] = await Promise.all([
          transactionAPI.getTransactions({ limit: 5 }),
          transactionAPI.getSummary()
        ]);

        if (transactionsRes.data.success) {
          setRecentActivity(transactionsRes.data.data.transactions);
        }

        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data.summary);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Active Loans',
      value: summary ? summary.totalBorrowed.toString() : '0',
      change: '+1 this month',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'ROSCA Groups',
      value: summary ? summary.totalROSCAContributions.toString() : '0',
      change: '+2 this month',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Earned',
      value: summary ? `₿${summary.totalLent.toFixed(3)}` : '₿0.000',
      change: '+12% this month',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Wallet Balance',
      value: summary ? `₿${summary.netBalance.toFixed(3)}` : '₿0.000',
      change: 'Available',
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    { title: 'Request Loan', href: '/loans/request', icon: Plus, color: 'bg-blue-600' },
    { title: 'Join ROSCA', href: '/rosca', icon: Users, color: 'bg-green-600' },
    { title: 'Lend Money', href: '/loans', icon: TrendingUp, color: 'bg-orange-600' },
    { title: 'Deposit Funds', href: '/deposit', icon: ArrowDownLeft, color: 'bg-purple-600' },
    { title: 'Withdraw Funds', href: '/withdraw', icon: ArrowUpRight, color: 'bg-red-600' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {state.user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            state.user?.kycStatus === 'verified' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            KYC: {state.user?.kycStatus}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isWalletBalance = stat.title === 'Wallet Balance';
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {isWalletBalance && !showBalance ? '••••••' : stat.value}
                    </p>
                    {isWalletBalance && (
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {showBalance ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 group-hover:text-orange-600 text-sm">
                    {action.title}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/history" className="text-orange-600 hover:text-orange-700 font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₿{activity.amount}</p>
                <p className={`text-sm capitalize ${
                  activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {activity.status}
                </p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel Link */}
      {state.user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-blue-100 mt-1">Manage users, loans, and platform settings</p>
            </div>
            <Link
              to="/admin"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Go to Admin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;