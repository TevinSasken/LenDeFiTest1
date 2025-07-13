import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roscaAPI } from '../services/api';
import { ArrowLeft, Users, DollarSign, Calendar, UserPlus, Link as LinkIcon } from 'lucide-react';

const CreateROSCA: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contributionAmount: '',
    contributionPeriod: 'monthly',
    maxMembers: '',
    description: '',
    isOnChain: false,
  });

  const [inviteLink, setInviteLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const roscaData = {
        name: formData.name,
        description: formData.description,
        contributionAmount: parseFloat(formData.contributionAmount),
        cycleDuration: getCycleDurationInDays(formData.contributionPeriod),
        maxMembers: parseInt(formData.maxMembers),
        isOnChain: formData.isOnChain,
      };

      const response = await roscaAPI.create(roscaData);
      
      if (response.data.success) {
        setInviteLink(response.data.data.inviteLink);
        alert('ROSCA created successfully!');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create ROSCA');
    } finally {
      setLoading(false);
    }
  };

  const getCycleDurationInDays = (period: string) => {
    switch (period) {
      case 'weekly': return 7;
      case 'bi-weekly': return 14;
      case 'monthly': return 30;
      case 'quarterly': return 90;
      default: return 30;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
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
          <h1 className="text-3xl font-bold text-gray-900">Create ROSCA Group</h1>
          <p className="text-gray-600 mt-1">Set up a new rotating savings and credit association</p>
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
              ROSCA Name
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tech Entrepreneurs Circle"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Choose a descriptive name for your ROSCA group</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount (BTC)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="contributionAmount"
                value={formData.contributionAmount}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.1"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Amount each member contributes per cycle</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Period
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="contributionPeriod"
                value={formData.contributionPeriod}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-1">How often members contribute to the pool</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members
            </label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleInputChange}
                min="2"
                max="50"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Maximum number of members (2-50)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Describe the purpose and goals of your ROSCA group..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">Explain what this ROSCA is for and any specific requirements</p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isOnChain"
              checked={formData.isOnChain}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label className="text-sm text-gray-700">
              Enable on-chain transactions (using smart contracts)
            </label>
          </div>

          {/* ROSCA Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">ROSCA Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Pool Size</p>
                <p className="font-medium">
                  ₿{formData.contributionAmount && formData.maxMembers
                    ? (parseFloat(formData.contributionAmount) * parseInt(formData.maxMembers)).toFixed(3)
                    : '0.000'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Contribution Period</p>
                <p className="font-medium capitalize">{formData.contributionPeriod}</p>
              </div>
              <div>
                <p className="text-gray-600">Maximum Members</p>
                <p className="font-medium">{formData.maxMembers || '0'}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction Type</p>
                <p className="font-medium">{formData.isOnChain ? 'On-Chain' : 'Off-Chain'}</p>
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
              {loading ? 'Creating...' : 'Create ROSCA'}
            </button>
          </div>
        </form>

        {/* Invite Link Section */}
        {inviteLink && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Invite Members</h3>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <button
                onClick={copyInviteLink}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link with potential members to invite them to your ROSCA group
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateROSCA;