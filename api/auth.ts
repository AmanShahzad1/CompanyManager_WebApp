interface ApiResponse {
  success: boolean;
  message?: string;
  [key: string]: any; // Flexible for additional fields
}

interface LoginResponse extends ApiResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface EmailCheckResponse extends ApiResponse {
  exists: boolean;
}

interface PasswordResetResponse extends ApiResponse {
  // Additional fields if needed
}

interface OTPResponse extends ApiResponse {
  otpId?: string;
  expiresAt?: number;
}

/**
 * Unified response handler for all API calls
 */
const handleApiResponse = async <T extends ApiResponse>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  
  // Handle non-JSON responses
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(text.includes('<!DOCTYPE html>') 
      ? 'Server error - check your backend'
      : text || `Request failed with status ${response.status}`);
  }

  const data: T = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Authentication Functions
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleApiResponse<LoginResponse>(response);
};

// Password Reset Functions
export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse<PasswordResetResponse>(response);
};

export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return handleApiResponse<PasswordResetResponse>(response);
};

// Email Verification
export const checkEmailExists = async (email: string): Promise<EmailCheckResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/check-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse<EmailCheckResponse>(response);
};

// OTP Functions
export const generateOTP = async (email: string): Promise<OTPResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/generate-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse<OTPResponse>(response);
};

export const verifyOTP = async (otpId: string, otp: string): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otpId, otp }),
  });
  return handleApiResponse<LoginResponse>(response);
};