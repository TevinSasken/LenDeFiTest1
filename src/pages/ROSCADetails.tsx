import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Bitcoin, MessageCircle, CreditCard } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';

const ROSCADetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock ROSCA data
  const rosca = {
    id: '1',
    name: 'Tech Entrepreneurs Circle',
    contributionAmount: 0.1,
    cycleDuration: 30,
    maxMembers: 10,
    currentMembers: 7,
    isOnChain: true,
    status: 'active',
    nextPayout: '2025-02-15',
    description: 'Monthly savings group for tech professionals',
    members: [
      'Alice Johnson',
      'Bob Smith',
      'Carol Davis',
      'David Wilson',
      'Eva Martinez',
      'Frank Chen',
      'Grace Kim',
    ],
    contributions: [
      {
        id: '1',
        member: 'Alice Johnson',
        amount: 0.1,
        cycle: 1,
        date: '2025-01-15',
        status: 'completed',
      },
      {
        id: '2',
        member: 'Bob Smith',
        amount: 0.1,
        cycle: 1,
        date: '2025-01-15',
        status: 'completed',
      },
      {
        id: '3',
        member: 'Carol Davis',
        amount: 0.1,
        cycle: 1,
        date: '2025-01-15',
        status: 'pending',
      },
    ],
    payouts: [
      {
        id: '1',
        recipient: 'Alice Johnson',
        amount: 0.7,
        cycle: 1,
        date: '2025-01-15',
        status: 'completed',
      },
    ],
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'contributions', name: 'Contributions', icon: CreditCard },
    { id: 'chat', name: 'Group Chat', icon: MessageCircle },
  ];

  const handleContribute = () => {
    alert('Contribution submitted successfully!');
  };

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
          <h1 className="text-3xl font-bold text-gray-900">{rosca.name}</h1>
          <p className="text-gray-600 mt-1">{rosca.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">₿{rosca.contributionAmount}</p>
          <p className="text-sm text-gray-500">per cycle</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="text-2xl font-bold text-gray-900">{rosca.currentMembers}/{rosca.maxMembers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pool</p>
              <p className="text-2xl font-bold text-gray-900">₿{(rosca.contributionAmount * rosca.maxMembers).toFixed(1)}</p>
            </div>
            <Bitcoin className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cycle Duration</p>
              <p className="text-2xl font-bold text-gray-900">{rosca.cycleDuration}</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Next Payout</p>
              <p className="text-lg font-bold text-gray-900">{new Date(rosca.nextPayout).toLocaleDateString()}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Members</h2>
              <div className="space-y-3">
                {rosca.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{member}</span>
                    </div>
                    <span className="text-sm text-gray-500">Position #{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payouts */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payouts</h2>
              <div className="space-y-3">
                {rosca.payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payout.recipient}</p>
                      <p className="text-sm text-gray-500">Cycle {payout.cycle} • {new Date(payout.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₿{payout.amount}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {payout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Ready to contribute?</h3>
                <p className="text-gray-600">Your next contribution of ₿{rosca.contributionAmount} is due soon.</p>
              </div>
              <button
                onClick={handleContribute}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Contribute Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributions Tab */}
      {activeTab === 'contributions' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contribution History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rosca.contributions.map((contribution) => (
                  <tr key={contribution.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contribution.member}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₿{contribution.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contribution.cycle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(contribution.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contribution.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contribution.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <ChatWindow roscaName={rosca.name} members={rosca.members} />
      )}
    </div>
  );
};

export default ROSCADetails;