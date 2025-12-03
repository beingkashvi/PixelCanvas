"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

export interface SavedAddress {
  _id: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  country: string;
}

// 1. Define the shape of our User Info
interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  savedAddresses?: SavedAddress[];
}

// 2. Define the shape of the Context
interface AuthContextType {
  userInfo: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 3. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 5. Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 6. Login Function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Fetch user data after successful login
      const userRes = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserInfo(userData);
      }

      router.push('/');
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
      throw err;
    }
  };

  // 7. Signup Function
  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Fetch user data after successful signup
      const userRes = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserInfo(userData);
      }

      router.push('/');
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
      throw err;
    }
  };

  // 8. Logout Function
  const logout = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserInfo(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{ userInfo, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 9. Create the 'useAuth' hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};