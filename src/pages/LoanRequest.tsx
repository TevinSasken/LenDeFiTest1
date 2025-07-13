import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { ArrowLeft, DollarSign, Percent, Calendar, FileText } from 'lucide-react';

const LoanRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    duration: '',
    collateral: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loanData = {
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        duration: parseInt(formData.duration),
        collateral: formData.collateral,
        description: formData.description,
      };

      const response = await loanAPI.createRequest(loanData);
      
      if (response.data.success) {
        alert('Loan request submitted successfully!');
        navigate('/loans');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit loan request');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request a Loan</h1>
          <p className="text-gray-600 mt-1">Fill out the form to request a loan from the community</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (BTC)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.5"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Minimum loan amount: ₿0.01</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% APR)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="50"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="8.5"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Annual percentage rate you're willing to pay</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (months)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max="60"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="12"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Loan term in months (1-60)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collateral Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="collateral"
                value={formData.collateral}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Real estate deed, vehicle title, etc."
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">What you're offering as collateral</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Describe what you'll use the loan for..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">Explain the purpose of your loan</p>
          </div>

          {/* Loan Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Loan Amount</p>
                <p className="font-medium">₿{formData.amount || '0.00'}</p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate</p>
                <p className="font-medium">{formData.interestRate || '0.0'}% APR</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{formData.duration || '0'} months</p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Monthly Payment</p>
                <p className="font-medium">
                  ₿{formData.amount && formData.interestRate && formData.duration
                    ? (parseFloat(formData.amount) * (1 + parseFloat(formData.interestRate) / 100) / parseInt(formData.duration)).toFixed(3)
                    : '0.000'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanRequest;