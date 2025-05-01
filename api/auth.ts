interface LoginResponse {
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
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(text.includes('<!DOCTYPE html>') 
        ? 'Server error - check your backend'
        : text || 'Invalid server response');
    }
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
  
    return data;
  };