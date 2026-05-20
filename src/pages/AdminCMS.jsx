import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import './AdminCMS.css';

const TEAMS = ['BD Miền Bắc', 'BD Miền Nam'];
const RANKS = [
  'Junior 1', 'Junior 2', 'Junior 3',
  'Middle 1', 'Middle 2', 'Middle 3',
  'Senior 1', 'Senior 2', 'Senior 3'
];

const AdminCMS = () => {
  const { members, updateMember, addMember, deleteMember, batchUpdateDailyRevenue, batchUpdateMonthlyKPI } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState('personnel');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Revenue tab state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [revenueDraft, setRevenueDraft] = useState({});

  // KPI tab state
  const [kpiMonth, setKpiMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [kpiDraft, setKpiDraft] = useState({});

  // ─── Personnel methods ─────────────────────────────────────────────────────
  const handleEditClick = (member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
  };

  const handleSavePersonnel = () => {
    updateMember(editingId, editForm);
    setEditingId(null);
  };

  const handleChangePersonnel = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'newCustomers' || name === 'renewedCustomers' ? Number(value) : value
    }));
  };

  const handleAddNew = () => {
    addMember({
      name: 'Tên nhân viên mới',
      email: 'email@example.com',
      nickname: 'Nickname',
      team: 'BD Miền Bắc',
      rank: 'Junior 1',
      level: 1,
      dailyRevenue: {},
      monthlyKPI: {},
      newCustomers: 0,
      renewedCustomers: 0,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    });
  };

  // ─── Revenue matrix methods ────────────────────────────────────────────────
  const getDaysInMonth = (monthStr) => {
    if (!monthStr) return [];
    const [year, month] = monthStr.split('-');
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const daysList = getDaysInMonth(selectedMonth);

  const handleRevenueMatrixChange = (memberId, day, value) => {
    const val = Number(value) || 0;
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    setRevenueDraft(prev => ({
      ...prev,
      [memberId]: { ...(prev[memberId] || {}), [dateStr]: val }
    }));
  };

  const handleSaveAllRevenue = () => {
    batchUpdateDailyRevenue(revenueDraft);
    setRevenueDraft({});
    alert('Đã lưu thành công toàn bộ doanh thu tháng!');
  };

  const getRevenueValue = (member, day) => {
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    if (revenueDraft[member.id] && revenueDraft[member.id][dateStr] !== undefined)
      return revenueDraft[member.id][dateStr];
    if (member.dailyRevenue && member.dailyRevenue[dateStr] !== undefined)
      return member.dailyRevenue[dateStr];
    return '';
  };

  // ─── KPI methods ───────────────────────────────────────────────────────────
  const handleKpiChange = (memberId, value) => {
    const val = Number(value) || 0;
    setKpiDraft(prev => ({
      ...prev,
      [memberId]: { ...(prev[memberId] || {}), [kpiMonth]: val }
    }));
  };

  const getKpiValue = (member) => {
    if (kpiDraft[member.id] && kpiDraft[member.id][kpiMonth] !== undefined)
      return kpiDraft[member.id][kpiMonth];
    if (member.monthlyKPI && member.monthlyKPI[kpiMonth] !== undefined)
      return member.monthlyKPI[kpiMonth];
    return '';
  };

  const handleSaveAllKPI = () => {
    batchUpdateMonthlyKPI(kpiDraft);
    setKpiDraft({});
    alert('Đã lưu thành công KPI tháng!');
  };

  return (
    <div className="cms-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Quản trị hệ thống (CMS)</h1>
          <p className="page-subtitle">Quản lý nhân viên Sales và cập nhật số liệu</p>
        </div>
        <button
          className="btn btn-outline bg-white"
          onClick={() => { sessionStorage.removeItem('isAdmin'); window.location.reload(); }}
        >
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs mb-6 flex gap-4">
        {[
          { key: 'personnel', label: 'Quản lý Nhân sự' },
          { key: 'revenue',   label: 'Doanh thu Ngày' },
          { key: 'kpi',       label: 'KPI Tháng' },
        ].map(t => (
          <button
            key={t.key}
            className={`btn ${activeTab === t.key ? 'btn-primary' : 'btn-outline bg-white'}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Nhân sự ────────────────────────────────────── */}
      {activeTab === 'personnel' && (
        <div className="cms-table-container glass">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Danh sách Nhân sự</h2>
            <button className="btn btn-primary" onClick={handleAddNew}>+ Thêm nhân viên mới</button>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên / Nickname</th>
                <th>Email</th>
                <th>Team</th>
                <th>Cấp bậc</th>
                <th>Khách mới</th>
                <th>Khách tái ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td><img src={member.avatar} alt="" className="avatar-sm" /></td>
                  {editingId === member.id ? (
                    <>
                      <td>
                        <input type="text" name="name" value={editForm.name} onChange={handleChangePersonnel} className="input w-full mb-2" placeholder="Tên" />
                        <input type="text" name="nickname" value={editForm.nickname} onChange={handleChangePersonnel} className="input w-full" placeholder="Nickname" />
                      </td>
                      <td><input type="email" name="email" value={editForm.email} onChange={handleChangePersonnel} className="input w-full" /></td>
                      <td>
                        <select name="team" value={editForm.team} onChange={handleChangePersonnel} className="select">
                          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </td>
                      <td>
                        <select name="rank" value={editForm.rank} onChange={handleChangePersonnel} className="select">
                          {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td><input type="number" name="newCustomers" value={editForm.newCustomers} onChange={handleChangePersonnel} className="input" style={{ width: '70px' }} /></td>
                      <td><input type="number" name="renewedCustomers" value={editForm.renewedCustomers} onChange={handleChangePersonnel} className="input" style={{ width: '70px' }} /></td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <button className="btn btn-primary text-sm" onClick={handleSavePersonnel}>Lưu</button>
                          <button className="btn btn-outline bg-white text-sm" onClick={() => setEditingId(null)}>Hủy</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.nickname}</div>
                      </td>
                      <td>{member.email}</td>
                      <td><span className="tag-team">{member.team}</span></td>
                      <td><span className="tag-rank">{member.rank}</span></td>
                      <td>{member.newCustomers}</td>
                      <td>{member.renewedCustomers}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-outline bg-white text-sm" onClick={() => handleEditClick(member)}>Sửa</button>
                          <button className="btn btn-outline bg-white text-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => deleteMember(member.id)}>Xóa</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab: Doanh thu Ngày ─────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="cms-table-container glass">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Nhập Doanh Thu Tháng</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Chọn tháng:</label>
                <input type="month" className="input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveAllRevenue}>Lưu tất cả</button>
            </div>
          </div>
          <div className="matrix-table-wrapper">
            <table className="cms-table matrix-table">
              <thead>
                <tr>
                  <th className="sticky-col">Nhân viên</th>
                  {daysList.map(day => (
                    <th key={day} style={{ minWidth: '80px', textAlign: 'center' }}>Ngày {day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td className="sticky-col">
                      <div className="flex items-center gap-4" style={{ width: 'max-content' }}>
                        <img src={member.avatar} alt="" className="avatar-sm" />
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.nickname}</div>
                        </div>
                      </div>
                    </td>
                    {daysList.map(day => (
                      <td key={day} style={{ padding: '8px' }}>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '80px', padding: '8px', fontSize: '14px', textAlign: 'center' }}
                          value={getRevenueValue(member, day)}
                          onChange={(e) => handleRevenueMatrixChange(member.id, day, e.target.value)}
                          placeholder="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: KPI Tháng ──────────────────────────────────── */}
      {activeTab === 'kpi' && (
        <div className="cms-table-container glass">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">KPI Tháng</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Chọn tháng:</label>
                <input type="month" className="input" value={kpiMonth} onChange={(e) => setKpiMonth(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveAllKPI}>Lưu KPI</button>
            </div>
          </div>
          <table className="cms-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Team</th>
                <th>Cấp bậc</th>
                <th>KPI tháng {kpiMonth} ($)</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="flex items-center gap-4">
                      <img src={member.avatar} alt="" className="avatar-sm" />
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag-team">{member.team}</span></td>
                  <td><span className="tag-rank">{member.rank}</span></td>
                  <td>
                    <input
                      type="number"
                      className="input"
                      style={{ width: '180px' }}
                      value={getKpiValue(member)}
                      onChange={(e) => handleKpiChange(member.id, e.target.value)}
                      placeholder="Nhập KPI..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
