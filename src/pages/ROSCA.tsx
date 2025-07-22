import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roscaAPI } from '../services/api';
import { Plus, Users, Clock, Bitcoin, ChevronRight } from 'lucide-react';
import { ROSCA as ROSCAType } from '../types';

const ROSCA: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [roscas, setROSCAs] = useState<ROSCAType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchROSCAs();
  }, [activeTab]);

  const fetchROSCAs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: any = {};
      
      if (activeTab === 'available') {
        params.type = 'available';
      } else if (activeTab === 'my-roscas') {
        params.type = 'my-roscas';
      }
      
      const response = await roscaAPI.getROSCAs(params);
      
      if (response.data.success) {
        setROSCAs(response.data.data.roscas);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch ROSCAs');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinROSCA = async (roscaId: string) => {
    try {
      const response = await roscaAPI.joinROSCA(roscaId);
      if (response.data.success) {
        alert('Successfully joined ROSCA!');
        fetchROSCAs(); // Refresh the list
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to join ROSCA');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ROSCA Groups</h1>
          <p className="text-gray-600 mt-1">
            Join rotating savings and credit associations for community-based savings
          </p>
        </div>
        <Link
          to="/rosca/create"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create ROSCA</span>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">What is a ROSCA?</h3>
            <p className="text-blue-800 text-sm mt-1">
              A Rotating Savings and Credit Association (ROSCA) is a group of people who agree to meet 
              regularly and contribute to a fund that is given to one member at each meeting. 
              It's a traditional way of saving money and accessing credit within a trusted community.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Groups
          </button>
          <button
            onClick={() => setActiveTab('my-roscas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-roscas'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My ROSCAs
          </button>
        </nav>
      </div>

      {activeTab === 'available' && (
        <div className="grid gap-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {roscas.map((rosca) => (
            <div key={rosca.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rosca.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {rosca.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rosca.isOnChain 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rosca.isOnChain ? 'On-Chain' : 'Off-Chain'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₿{rosca.contributionAmount}</p>
                  <p className="text-sm text-gray-500">per cycle</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{rosca.description}</p>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="font-medium">{rosca.currentMembers}/{rosca.maxMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cycle</p>
                  <p className="font-medium">{rosca.cycleDuration} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Payout</p>
                  <p className="font-medium">{new Date(rosca.nextPayoutDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pool</p>
                  <p className="font-medium">₿{(rosca.contributionAmount * rosca.maxMembers).toFixed(3)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Members</span>
                  <span>{rosca.currentMembers}/{rosca.maxMembers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(rosca.currentMembers / rosca.maxMembers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/rosca/${rosca.id}`}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleJoinROSCA(rosca.id)}
                  disabled={rosca.currentMembers >= rosca.maxMembers}
                  className="flex-1 border border-orange-600 text-orange-600 py-2 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Group
                </button>
              </div>
            </div>
          ))}
          {roscas.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No ROSCAs found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-roscas' && (
        <div className="grid gap-6">
          {roscas.map((rosca) => (
            <div key={rosca.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{rosca.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rosca.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rosca.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₿{rosca.contributionAmount}</p>
                  <p className="text-sm text-gray-500">per cycle</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="font-medium">{rosca.currentMembers}/{rosca.maxMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cycle</p>
                  <p className="font-medium">{rosca.cycleDuration} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{rosca.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Payout</p>
                  <p className="font-medium">{new Date(rosca.nextPayoutDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/rosca/${rosca.id}`}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors"
                >
                  View Details
                </Link>
                {rosca.status === 'active' && (
                  <button className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
                    Contribute Now
                  </button>
                )}
              </div>
            </div>
          ))}
          {roscas.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't joined any ROSCAs yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ROSCA;