import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'HouseNow@123456') {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass">
        <h2>Đăng nhập CMS</h2>
        <p className="subtitle">Chỉ dành cho Quản trị viên</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Tài khoản</label>
            <input 
              type="text" 
              className="input w-full" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required 
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              className="input w-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" style={{padding: '12px'}}>Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
