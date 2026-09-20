import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Discover } from './pages/Discover';
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';
import { Requests } from './pages/Requests';
import { Exchanges } from './pages/Exchanges';
import { Login } from './pages/Login';
import { PublicProfile } from './pages/PublicProfile';
import { Shop } from './pages/Shop';

const RequireAuth = () => {
  const user = localStorage.getItem('skillswap_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:id" element={<PublicProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/shop" element={<Shop />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
