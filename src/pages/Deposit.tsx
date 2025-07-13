import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');

  const depositMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: CreditCard,
      description: 'Transfer from your bank account',
      fee: '0.5%',
      processingTime: '1-3 business days',
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Mobile money transfer',
      fee: '1.0%',
      processingTime: 'Instant',
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      icon: Smartphone,
      description: 'MTN mobile wallet',
      fee: '1.0%',
      processingTime: 'Instant',
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: Smartphone,
      description: 'Airtel mobile wallet',
      fee: '1.0%',
      processingTime: 'Instant',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'PayPal account transfer',
      fee: '2.9%',
      processingTime: 'Instant',
    },
    {
      id: 'payoneer',
      name: 'Payoneer',
      icon: Wallet,
      description: 'Payoneer account transfer',
      fee: '2.0%',
      processingTime: '1-2 hours',
    },
  ];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !amount) {
      alert('Please select a deposit method and enter an amount');
      return;
    }
    alert(`Deposit of $${amount} via ${depositMethods.find(m => m.id === selectedMethod)?.name} initiated!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposit Funds</h1>
          <p className="text-gray-600 mt-1">Add money to your LenDeFi wallet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit Methods */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Deposit Method</h2>
          
          {depositMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    selectedMethod === method.id ? 'bg-orange-600' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      selectedMethod === method.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-400">Fee: {method.fee}</span>
                      <span className="text-xs text-gray-400">Processing: {method.processingTime}</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deposit Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Amount</h2>
          
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="10"
                  max="10000"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100.00"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum: $10, Maximum: $10,000</p>
            </div>

            {selectedMethod && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Transaction Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Amount:</span>
                    <span className="font-medium">${amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">
                      ${amount ? (parseFloat(amount) * parseFloat(depositMethods.find(m => m.id === selectedMethod)?.fee.replace('%', '') || '0') / 100).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">
                      ${amount ? (parseFloat(amount) + (parseFloat(amount) * parseFloat(depositMethods.find(m => m.id === selectedMethod)?.fee.replace('%', '') || '0') / 100)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedMethod || !amount}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Deposit
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Deposits are converted to BTC at current market rates</li>
              <li>• Processing times may vary based on network conditions</li>
              <li>• All transactions are secured and encrypted</li>
              <li>• Contact support for deposits over $10,000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;