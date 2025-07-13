import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Mail, Phone, Calendar, FileText, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    dateOfBirth: '',
    idNumber: '',
    adminSecret: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    
    // Email validation
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    setEmailError('');

    // Password validation for registration
    if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setPasswordError('Password does not meet security requirements');
        setLoading(false);
        return;
      }
    }
    setPasswordError('');
    
    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          idNumber: formData.idNumber,
          role: isAdmin ? 'admin' : 'user',
          ...(isAdmin && { adminSecret: formData.adminSecret })
        };
        result = await register(userData);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear errors when user starts typing
    if (e.target.name === 'email') {
      setEmailError('');
    }
    if (e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your email address. This feature will be implemented soon.');
  };

  const passwordValidation = !isLogin ? validatePassword(formData.password) : null;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isLogin ? 'Sign in to your LenDeFi account' : 'Join the LenDeFi community'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
              required
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          {!isLogin && formData.password && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">Password must contain:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center ${passwordValidation?.minLength ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{passwordValidation?.minLength ? '✓' : '✗'}</span>
                  8+ characters
                </div>
                <div className={`flex items-center ${passwordValidation?.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{passwordValidation?.hasUpperCase ? '✓' : '✗'}</span>
                  Uppercase letter
                </div>
                <div className={`flex items-center ${passwordValidation?.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{passwordValidation?.hasLowerCase ? '✓' : '✗'}</span>
                  Lowercase letter
                </div>
                <div className={`flex items-center ${passwordValidation?.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{passwordValidation?.hasNumbers ? '✓' : '✗'}</span>
                  Number
                </div>
                <div className={`flex items-center ${passwordValidation?.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{passwordValidation?.hasSpecialChar ? '✓' : '✗'}</span>
                  Special character
                </div>
              </div>
            </div>
          )}
          {isLogin && (
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID/Passport Number
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your ID or passport number"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Admin Account</span>
            </label>
          </div>
          
          {isLogin && (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me for 30 days</span>
            </label>
          )}
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Secret Code
            </label>
            <input
              type="password"
              name="adminSecret"
              value={formData.adminSecret}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter admin secret code"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;