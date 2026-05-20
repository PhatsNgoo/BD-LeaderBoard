import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const { members, calculateRevenue, getMonthlyKPI, getKPIRate } = useContext(DataContext);
  const [metric, setMetric] = useState('revenue');
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [selectedUser, setSelectedUser] = useState(null);

  const currentMonthStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const getMetricValue = (member, met) => {
    if (met === 'revenue') return calculateRevenue(member, timeFilter);
    return member[met] || 0;
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
  }, [members, metric, timeFilter]);

  const top3 = sortedMembers.slice(0, 3);
  const restList = sortedMembers.slice(3);
  const displayUser = selectedUser || top3[0] || members[0];

  const formatValue = (val, met) => {
    if (met === 'revenue') return `$${val.toLocaleString()}`;
    return val;
  };

  // KPI completion for the display user (current month)
  const kpi = displayUser ? getMonthlyKPI(displayUser, currentMonthStr) : 0;
  const totalRevenue = displayUser ? calculateRevenue(displayUser, 'thisMonth') : 0;
  const kpiRate = kpi > 0 ? Math.round((totalRevenue / kpi) * 100) : null;

  const kpiColor = kpiRate === null ? '#94a3b8'
    : kpiRate >= 100 ? '#10b981'
    : kpiRate >= 70 ? '#f59e0b'
    : '#ef4444';

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <header className="header flex justify-between items-center">
        <div>
          <h1 className="page-title">Bảng Xếp Hạng</h1>
          <p className="page-subtitle">Tất cả đại diện &gt; So sánh</p>
        </div>

        <div className="header-actions flex gap-4 items-center">
          <div className="search-bar flex items-center relative">
            <input type="text" placeholder="Tìm kiếm" className="input search-input" />
            <Search size={18} className="search-icon" />
          </div>

          <select className="select" value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="revenue">Tổng quan (Doanh thu)</option>
            <option value="newCustomers">Khách hàng mới</option>
            <option value="renewedCustomers">Khách hàng tái ký</option>
          </select>

          <div className="time-toggle flex">
            <button
              className={`btn ${timeFilter === 'thisMonth' ? 'btn-primary' : 'btn-outline bg-white'}`}
              style={{ borderRadius: '8px 0 0 8px' }}
              onClick={() => setTimeFilter('thisMonth')}
            >
              Tháng này
            </button>
            <button
              className={`btn ${timeFilter === 'allTime' ? 'btn-primary' : 'btn-outline bg-white'}`}
              style={{ borderRadius: '0 8px 8px 0', borderLeft: timeFilter === 'allTime' ? 'none' : '1px solid var(--primary)' }}
              onClick={() => setTimeFilter('allTime')}
            >
              Tất cả
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="content-grid">

        {/* Left: Podium + List */}
        <div className="left-panel">
          <div className="podium-section">
            {top3[1] && (
              <div className="podium-item place-2" onClick={() => setSelectedUser(top3[1])}>
                <img src={top3[1].avatar} alt="" className="avatar" />
                <h3 className="name">{top3[1].name}</h3>
                <p className="metric-val">{formatValue(getMetricValue(top3[1], metric), metric)}</p>
                <div className="pillar">2</div>
              </div>
            )}
            {top3[0] && (
              <div className="podium-item place-1" onClick={() => setSelectedUser(top3[0])}>
                <div className="crown">👑</div>
                <img src={top3[0].avatar} alt="" className="avatar" />
                <h3 className="name">{top3[0].name}</h3>
                <p className="metric-val">{formatValue(getMetricValue(top3[0], metric), metric)}</p>
                <div className="pillar">1</div>
              </div>
            )}
            {top3[2] && (
              <div className="podium-item place-3" onClick={() => setSelectedUser(top3[2])}>
                <img src={top3[2].avatar} alt="" className="avatar" />
                <h3 className="name">{top3[2].name}</h3>
                <p className="metric-val">{formatValue(getMetricValue(top3[2], metric), metric)}</p>
                <div className="pillar">3</div>
              </div>
            )}
          </div>

          <div className="list-section">
            {restList.map((member, idx) => (
              <div
                key={member.id}
                className={`list-item glass flex items-center justify-between ${displayUser?.id === member.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(member)}
              >
                <div className="flex items-center gap-6">
                  <span className="rank">{idx + 4}</span>
                  <img src={member.avatar} alt="" className="avatar-sm" />
                  <div>
                    <h4 className="name-sm">{member.name}</h4>
                    <p className="level-sm">{member.rank} · {member.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="metric-sm">{formatValue(getMetricValue(member, metric), metric)}</span>
                  <span className={`trend ${idx % 2 === 0 ? 'up' : 'down'} flex items-center gap-2`}>
                    {idx % 2 === 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.floor(Math.random() * 5) + 1} so với tháng trước
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        {displayUser && (
          <div className="right-panel glass">
            {/* Profile */}
            <div className="profile-header flex items-center gap-6">
              <img src={displayUser.avatar} alt="" className="avatar-lg" />
              <div>
                <h2 className="profile-name">{displayUser.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{displayUser.email}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="tag-team">{displayUser.team}</span>
                  <span className="tag-rank">{displayUser.rank}</span>
                </div>
              </div>
            </div>

            {/* KPI Section */}
            <div className="kpi-section mt-12">
              <h3 className="section-title">Tỉ lệ hoàn thành KPI tháng này</h3>

              <div className="kpi-stats mt-6 flex gap-6">
                <div className="kpi-stat-card">
                  <p className="kpi-label">Doanh thu</p>
                  <p className="kpi-value" style={{ color: 'var(--primary)' }}>
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="kpi-divider" />
                <div className="kpi-stat-card">
                  <p className="kpi-label">KPI tháng</p>
                  <p className="kpi-value" style={{ color: '#64748b' }}>
                    {kpi > 0 ? `$${kpi.toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>

              <div className="kpi-rate-display mt-8 flex items-center gap-6">
                {/* Circular progress */}
                <div className="kpi-circle-wrapper">
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={kpiColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(kpiRate || 0, 100) * 2.638} 263.8`}
                      strokeDashoffset="65.95"
                      style={{ transition: 'stroke-dasharray 0.6s ease' }}
                    />
                    <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill={kpiColor}>
                      {kpiRate !== null ? `${kpiRate}%` : 'N/A'}
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="kpi-status-text" style={{ color: kpiColor, fontWeight: 700, fontSize: '18px' }}>
                    {kpiRate === null ? 'Chưa có KPI'
                      : kpiRate >= 100 ? '🎉 Đạt KPI!'
                      : kpiRate >= 70 ? '⚡ Đang tiến tới'
                      : '⚠️ Cần cố gắng thêm'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {kpiRate !== null && kpi > 0 && totalRevenue < kpi
                      ? `Còn $${(kpi - totalRevenue).toLocaleString()} nữa là đạt KPI`
                      : kpiRate !== null
                      ? `Vượt $${(totalRevenue - kpi).toLocaleString()} so với KPI`
                      : 'Vào CMS để thiết lập KPI'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-container mt-6 flex items-center gap-4">
                <div className="progress-bar flex-1 rounded-full" style={{ background: '#e2e8f0', height: '10px' }}>
                  <div
                    className="progress-fill rounded-full"
                    style={{
                      width: `${Math.min(kpiRate || 0, 100)}%`,
                      height: '10px',
                      background: kpiColor,
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
                <span className="text-sm font-bold" style={{ color: kpiColor, minWidth: '44px' }}>
                  {kpiRate !== null ? `${kpiRate}%` : '—'}
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="quick-stats mt-12 flex gap-4">
              <div className="quick-stat-card">
                <p className="quick-label">Khách hàng mới</p>
                <p className="quick-value">{displayUser.newCustomers}</p>
              </div>
              <div className="quick-stat-card">
                <p className="quick-label">Khách tái ký</p>
                <p className="quick-value">{displayUser.renewedCustomers}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
