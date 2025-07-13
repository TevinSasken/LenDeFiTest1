import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Loans from './pages/Loans';
import LoanRequest from './pages/LoanRequest';
import LoanDetails from './pages/LoanDetails';
import ROSCA from './pages/ROSCA';
import CreateROSCA from './pages/CreateROSCA';
import ROSCADetails from './pages/ROSCADetails';
import History from './pages/History';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute>
                  <Loans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans/request"
              element={
                <ProtectedRoute>
                  <LoanRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loan/:id"
              element={
                <ProtectedRoute>
                  <LoanDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rosca"
              element={
                <ProtectedRoute>
                  <ROSCA />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rosca/create"
              element={
                <ProtectedRoute>
                  <CreateROSCA />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rosca/:id"
              element={
                <ProtectedRoute>
                  <ROSCADetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposit"
              element={
                <ProtectedRoute>
                  <Deposit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/withdraw"
              element={
                <ProtectedRoute>
                  <Withdraw />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;