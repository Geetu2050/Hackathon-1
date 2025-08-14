import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import FreelancerProfilePage from './pages/FreelancerProfilePage';
import PostJobPage from './pages/PostJobPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AuthenticationDemoPage from './pages/AuthenticationDemoPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse-jobs" element={<BrowseJobsPage />} />
              <Route path="/job/:id" element={<JobDetailsPage />} />
              <Route path="/freelancer/:id" element={<FreelancerProfilePage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/auth-demo" element={<AuthenticationDemoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
