import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { UploadNotice } from './pages/UploadNotice';
import { ReportView } from './pages/ReportView';
import { LawyerRecommendation } from './pages/LawyerRecommendation';
import { LawyerDashboard } from './pages/LawyerDashboard';
import { LawyerCases } from './pages/LawyerCases';
import { Profile } from './pages/Profile';
import { ChatPage } from './pages/ChatPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<CustomerDashboard />} />
          <Route path="reports/:id" element={<ReportView />} />
          <Route path="upload" element={<UploadNotice />} />
          <Route path="lawyers" element={<LawyerRecommendation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat/:id" element={<ChatPage />} />
        </Route>
        
        <Route path="/lawyer" element={<DashboardLayout />}>
          <Route index element={<Navigate to="invitations" replace />} />
          <Route path="invitations" element={<LawyerDashboard />} />
          <Route path="cases" element={<LawyerCases />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat/:id" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
