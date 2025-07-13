import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [exportPeriod, setExportPeriod] = useState('3');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: any = {};
      
      if (activeTab !== 'all') {
        params.type = activeTab;
      }
      
      const response = await transactionAPI.getTransactions(params);
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exporting ${exportPeriod} months of transaction history as ${format.toUpperCase()}...`);
    setShowExportOptions(false);
  };

  const getTransactionIcon = (type: string, subType: string) => {
    if (type === 'loan') {
      return subType === 'funded' || subType === 'request' ? 
        <ArrowUpRight className="h-4 w-4 text-red-500" /> : 
        <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    } else {
      return subType === 'contribution' ? 
        <ArrowUpRight className="h-4 w-4 text-red-500" /> : 
        <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeTab === 'all' || tx.type === activeTab;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'all', name: 'All Transactions', count: transactions.length },
    { id: 'loan', name: 'Loans', count: transactions.filter(t => t.type === 'loan').length },
    { id: 'rosca', name: 'ROSCA', count: transactions.filter(t => t.type === 'rosca').length },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View all your loan and ROSCA transactions</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">Export Options</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Export Period
                    </label>
                    <select
                      value={exportPeriod}
                      onChange={(e) => setExportPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="3">Last 3 months</option>
                      <option value="6">Last 6 months</option>
                      <option value="12">Last 12 months</option>
                      <option value="24">Last 24 months</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTransactionIcon(transaction.type, transaction.subType)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {transaction.type} • {transaction.subType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.subType === 'funded' || transaction.subType === 'contribution' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transaction.subType === 'funded' || transaction.subType === 'contribution' ? '-' : '+'}
                    ₿{transaction.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                  {transaction.txHash && (
                    <p className="text-xs text-gray-400 mt-1">
                      {transaction.txHash}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Lent</p>
              <p className="text-2xl font-bold text-gray-900">₿0.75</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">₿2.042</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Balance</p>
              <p className="text-2xl font-bold text-green-600">₿1.292</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;