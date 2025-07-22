import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Shield, 
  Eye, 
  EyeOff,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Smartphone,
  Key,
  Fingerprint,
  History
} from 'lucide-react';

const Profile: React.FC = () => {
  const { state, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
  });

  useEffect(() => {
    if (state.user) {
      setFormData({
        phone: state.user.phone || '',
      });
    }
  }, [state.user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUserProfile(formData);
    if (result.success) {
      alert('Profile updated successfully!');
      setIsEditing(false);
    } else {
      alert(`Update failed: ${result.message}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const securityChecklist = [
    {
      id: 'phone',
      title: 'Phone Number Verification',
      status: 'verified',
      description: 'Your phone number has been verified',
    },
    {
      id: 'password',
      title: 'Password Updated',
      status: 'warning',
      description: 'Password should be changed every 90 days (Last changed: 45 days ago)',
    },
    {
      id: 'security-question',
      title: 'Security Question',
      status: 'pending',
      description: 'Set up security questions for account recovery',
    },
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      status: 'disabled',
      description: 'Enable 2FA for enhanced security',
    },
  ];

  const signInHistory = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, US',
      timestamp: '2025-01-15T14:30:00Z',
      status: 'success',
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, US',
      timestamp: '2025-01-14T09:15:00Z',
      status: 'success',
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'Unknown Location',
      timestamp: '2025-01-13T22:45:00Z',
      status: 'failed',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'disabled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const isKycVerified = state.user?.kycStatus === 'verified';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and security settings</p>
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{state.user?.name}</h3>
                <p className="text-sm text-gray-500">Upload a new profile picture</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <form onSubmit={handleSaveChanges} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
              <button
                type="button"
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700"
              >
                {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showSensitiveInfo ? 'Hide' : 'Show'} Details</span>
              </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-500 flex items-center"><User className="h-4 w-4 mr-2" />Full Name</label>
                  <input type="text" value={state.user?.name || ''} disabled className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"/>
                  {isKycVerified && <p className="text-xs text-gray-400 mt-1">Cannot be changed after KYC verification.</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm text-gray-500 flex items-center"><Mail className="h-4 w-4 mr-2" />Email Address</label>
                    <input type="email" value={state.user?.email || ''} disabled={isKycVerified} className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-50 disabled:cursor-not-allowed"/>
                    {isKycVerified && <p className="text-xs text-gray-400 mt-1">Contact support to change your email.</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="text-sm text-gray-500 flex items-center"><Phone className="h-4 w-4 mr-2" />Phone Number</label>
                    <input type="tel" name="phone" value={isEditing ? formData.phone : (showSensitiveInfo ? state.user?.phone : '••••••••' + state.user?.phone?.slice(-2))} onChange={handleInputChange} disabled={!isEditing} className="mt-1 w-full p-2 border border-gray-200 rounded-md disabled:bg-gray-50 disabled:cursor-not-allowed"/>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                 {/* Date of Birth */}
                 <div>
                    <label className="text-sm text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-2" />Date of Birth</label>
                    <input type="text" value={showSensitiveInfo || !isKycVerified ? new Date(state.user?.dateOfBirth || '').toLocaleDateString() : '••/••/••••'} disabled className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"/>
                    {isKycVerified && <p className="text-xs text-gray-400 mt-1">Cannot be changed after KYC verification.</p>}
                 </div>

                 {/* ID Number */}
                 <div>
                    <label className="text-sm text-gray-500 flex items-center"><FileText className="h-4 w-4 mr-2" />ID Number</label>
                    <input type="text" value={showSensitiveInfo || !isKycVerified ? state.user?.idNumber : '••••••' + state.user?.idNumber?.slice(-3)} disabled className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"/>
                    {isKycVerified && <p className="text-xs text-gray-400 mt-1">Cannot be changed after KYC verification.</p>}
                 </div>

                {/* KYC Status */}
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">KYC Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      state.user?.kycStatus === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {state.user?.kycStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
              {isEditing ? (
                <>
                  <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Checklist */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Checklist</h2>
            <div className="space-y-4">
              {securityChecklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      {item.status === 'verified' ? 'Manage' : 'Setup'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">PIN Code</h3>
              </div>
              <p className="text-gray-600 mb-4">Set up a PIN code for quick access</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Setup PIN
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Fingerprint className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Biometrics</h3>
              </div>
              <p className="text-gray-600 mb-4">Enable fingerprint or face recognition</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Enable Biometrics
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Authenticator</h3>
              </div>
              <p className="text-gray-600 mb-4">Use an authenticator app for 2FA</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Setup Authenticator
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage advanced security options</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Manage Settings
              </button>
            </div>
          </div>

          {/* Sign-in History */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <History className="h-6 w-6 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Sign-in History</h2>
            </div>
            <div className="space-y-4">
              {signInHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{entry.device}</h3>
                    <p className="text-sm text-gray-500">{entry.location}</p>
                    <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;