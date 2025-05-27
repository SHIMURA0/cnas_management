import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Archives from './pages/Archives';
import Versions from './pages/Versions';
import Files from './pages/Files';
import Personnel from './pages/Personnel';
import ArchiveOperations from './pages/ArchiveOperations';
import EquipmentArchives from './pages/EquipmentArchives';
import Calibration from './pages/Calibration';
import Maintenance from './pages/Maintenance';
import MaterialSubmission from './pages/MaterialSubmission';
import type { Role } from './config/roles';
import { users } from './config/roles';

// 登录保护组件
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLogin = localStorage.getItem('isLogin') === 'true';
  const username = localStorage.getItem('username');
  
  if (!isLogin || !username) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 获取用户角色
  const user = users.find(u => u.username === username);
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 将用户角色存储在 localStorage 中
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userName', user.name);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="files" element={<Files />} />
          <Route path="versions" element={<Versions />} />
          <Route path="archives" element={<Archives />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="archive-operations" element={<ArchiveOperations />} />
          <Route path="equipment-archives" element={<EquipmentArchives />} />
          <Route path="calibration" element={<Calibration />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="material-submission" element={<MaterialSubmission />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
