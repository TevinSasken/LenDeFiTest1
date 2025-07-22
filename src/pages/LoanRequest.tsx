import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { ArrowLeft, DollarSign, Percent, Calendar, FileText, Upload } from 'lucide-react';

const LoanRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    duration: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const totalSize = files ? Array.from(files).reduce((acc, file) => acc + file.size, 0) : 0;
    if (totalSize > 25 * 1024 * 1024) {
      setError('Total file size cannot exceed 25MB.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('interestRate', formData.interestRate);
      data.append('duration', formData.duration);
      data.append('description', formData.description);

      if (files) {
        for (let i = 0; i < files.length; i++) {
          data.append('attachments', files[i]);
        }
      }

      const response = await loanAPI.createRequest(data);
      
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.amount);
    const monthlyRate = parseFloat(formData.interestRate) / 100;
    const months = parseInt(formData.duration, 10);

    if (!principal || !monthlyRate || !months) {
      return '0.000';
    }
    
    if (monthlyRate === 0) {
      return (principal / months).toFixed(3);
    }

    const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    const payment = principal * (numerator / denominator);
    return isNaN(payment) ? '0.000' : payment.toFixed(3);
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
                min="0.01"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.5"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Minimum loan amount: ₿0.01</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% per month, compounded)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.1"
                min="5"
                max="15"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="8.5"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Monthly interest rate (5-15%)</p>
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
                max="6"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="3"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Loan term in months (1-6)</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                            <span>Upload files</span>
                            <input id="file-upload" name="attachments" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".doc,.docx,.pdf,.jpg,.png,.jpeg"/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">DOC, PDF, JPG, PNG up to 25MB total</p>
                </div>
            </div>
            {files && (
                <div className="mt-2 text-sm text-gray-600">
                    <p>{files.length} file(s) selected:</p>
                    <ul className="list-disc list-inside">
                        {Array.from(files).map((file, index) => (
                            <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        ))}
                    </ul>
                </div>
            )}
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
                <p className="font-medium">{formData.interestRate || '0.0'}% / month</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{formData.duration || '0'} months</p>
              </div>
              <div>
                <p className="text-gray-600">Est. Monthly Payment</p>
                <p className="font-medium">
                  ₿{calculateMonthlyPayment()}
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