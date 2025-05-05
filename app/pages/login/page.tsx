'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiLogIn, FiMail, FiLock, FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { loginUser, generateOTP, verifyOTP } from '../../../api/auth';
import OTPModal from '../../components/OTPModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First verify credentials
      const { token } = await loginUser({ email, password });
      
      // Store temp token and show OTP modal
      setTempToken(token);
      await generateOTP(email);
      setShowOTPModal(true);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message.includes('Invalid credentials') 
            ? 'Invalid email or password'
            : err.message
          : 'Login failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    await verifyOTP(email, otp);
    localStorage.setItem('token', tempToken);
    router.push('/pages/dashboard');
  };

  const handleOTPResend = async () => {
    await generateOTP(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Company<span className="text-blue-600">Manager</span>
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Streamline your business operations
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-blue-100/50 transition-all duration-300 hover:shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Show either the login form or OTP modal */}
          {showOTPModal ? (
            <OTPModal
              email={email}
              onVerify={handleOTPVerify}
              onResend={handleOTPResend}
              onClose={() => setShowOTPModal(false)}
            />
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    href="/pages/forgot-password" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-md hover:shadow-lg ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiLogIn className={`h-5 w-5 ${isLoading ? 'text-blue-300' : 'text-blue-200 group-hover:text-blue-100'} transition-colors`} />
                  </span>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Back to Home Link - Only show when not in OTP modal */}
          {!showOTPModal && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <Link 
                    href="/pages/dashboard" 
                    className="px-3 bg-white text-sm font-medium text-gray-600 hover:text-blue-600 inline-flex items-center transition-colors duration-200"
                  >
                    <FiHome className="mr-2" />
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}