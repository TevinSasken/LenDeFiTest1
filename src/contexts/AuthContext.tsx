import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api, { authAPI } from '../services/api';
import { AuthState, User } from '../types';

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE'; payload: { user: User | null; isAuthenticated: boolean; token: string | null } };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        token: action.payload.token,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, userData: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: any) => Promise<any>;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'Logged in' : 'Logged out');
      
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await authAPI.getProfile();
          
          if (response.data.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.data.user, token } });
          } else {
            // User in Firebase but not DB, treat as logged out until profile is created
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Error during auth state initialization:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await authAPI.getProfile();
      
      if (response.data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.data.user, token } });
        return { success: true };
      } else {
        throw new Error('User profile not found on backend.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGOUT' });
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await authAPI.createOrUpdateProfile({ ...userData, email });
      
      if (response.data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.data.user, token } });
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to create profile.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGOUT' });
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const updateUserProfile = async (userData: any) => {
    try {
      const response = await authAPI.createOrUpdateProfile(userData);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUserProfile }}>
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