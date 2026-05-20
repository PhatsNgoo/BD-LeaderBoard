import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Leaderboard from './pages/Leaderboard';
import AdminCMS from './pages/AdminCMS';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import './index.css';

const PrivateRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem('isAdmin');
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminCMS />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
