import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { AuthState, User } from '../types';

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
};

// Check if user is logged in on app start
if (initialState.token) {
  // Verify token with backend
  authAPI.getProfile()
    .then(response => {
      if (response.data.success) {
        initialState.user = response.data.data.user;
        initialState.isAuthenticated = true;
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      initialState.token = null;
    });
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        const { user, token } = response.data.data;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return { success: true, user, token };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        const { user, token } = response.data.data;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return { success: true, user, token };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};