import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bitcoin, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Wallet
} from 'lucide-react';

const Home: React.FC = () => {
  const { state } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Mock wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      // In real implementation, this would connect to MetaMask/Citrea
      alert('Wallet connection will be implemented with Citrea ZK Rollup integration');
    }, 1000);
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Lending',
      description: 'Peer-to-peer lending with smart contract escrow and KYC verification',
    },
    {
      icon: Users,
      title: 'ROSCA Groups',
      description: 'Join rotating savings groups with automated payouts and transparency',
    },
    {
      icon: Bitcoin,
      title: 'Bitcoin Native',
      description: 'Built on Citrea ZK Rollup for fast, low-cost Bitcoin transactions',
    },
    {
      icon: TrendingUp,
      title: 'Competitive Rates',
      description: 'Market-driven interest rates with transparent fee structure',
    },
  ];

  const benefits = [
    'Decentralized lending without traditional banks',
    'Lower fees through blockchain technology',
    'Transparent and auditable transactions',
    'Global access to financial services',
    'Automated smart contract execution',
    'Community-driven savings groups',
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Decentralized P2P Lending
            <span className="text-orange-600"> on Bitcoin</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access peer-to-peer lending and join ROSCA savings groups powered by 
            Citrea ZK Rollup technology. Fast, secure, and transparent.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!state.isAuthenticated ? (
            <>
              <Link
                to="/auth"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Get Started
              </Link>
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-white border border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Wallet className="h-5 w-5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </section>

      {/* Benefits Section */}
      <section className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose LenDeFi?
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 p-8 rounded-lg">
            <div className="text-center space-y-4">
              <Bitcoin className="h-16 w-16 text-orange-600 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">
                Built on Bitcoin
              </h3>
              <p className="text-gray-600">
                Powered by Citrea ZK Rollup for scalable, secure, and 
                trust-minimized transactions on the Bitcoin network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-orange-600">₿2,500+</div>
          <div className="text-gray-600">Total Loans Funded</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-orange-600">1,250+</div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-orange-600">98.5%</div>
          <div className="text-gray-600">Repayment Rate</div>
        </div>
      </section>
    </div>
  );
};

export default Home;