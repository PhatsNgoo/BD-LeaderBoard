import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar glass">
      <div className="sidebar-logo">
        <span className="logo-icon">S</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
           <Settings size={20} />
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
