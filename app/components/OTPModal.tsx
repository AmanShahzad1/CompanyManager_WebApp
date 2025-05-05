'use client';
import { useState, useEffect } from 'react';
import { FiClock, FiMail, FiX } from 'react-icons/fi';

interface OTPModalProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose: () => void;
}

export default function OTPModal({ email, onVerify, onResend, onClose }: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    setError('');
    try {
      await onVerify(otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Verify Your Email</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
                placeholder="------"
                autoFocus
              />
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-2" />
              <span>
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            
            {countdown <= 0 && (
              <button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await onResend();
                    setCountdown(180);
                  } catch (err) {
                    setError('Failed to resend code. Please try again.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                Resend Code
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}