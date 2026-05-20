import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

// Dữ liệu mẫu (mock data)
const initialMembers = [
  { 
    id: 1, 
    name: 'Rey Mibourne', 
    email: 'rey@example.com',
    nickname: 'Rey',
    team: 'BD Miền Nam',
    rank: 'Senior 1',
    level: 3, 
    dailyRevenue: {
      '2026-05-18': 5000,
      '2026-05-19': 8000,
      '2026-04-20': 2000,
    },
    monthlyKPI: {
      '2026-05': 20000,
      '2026-04': 15000,
    },
    newCustomers: 12, 
    renewedCustomers: 25, 
    avatar: 'https://i.pravatar.cc/150?u=1' 
  },
  { 
    id: 2, 
    name: 'John Doe', 
    email: 'john@example.com',
    nickname: 'Johnny',
    team: 'BD Miền Bắc',
    rank: 'Middle 2',
    level: 3, 
    dailyRevenue: {
      '2026-05-18': 4000,
      '2026-05-19': 6000,
      '2026-04-20': 2000,
    },
    monthlyKPI: {
      '2026-05': 18000,
      '2026-04': 15000,
    },
    newCustomers: 8, 
    renewedCustomers: 18, 
    avatar: 'https://i.pravatar.cc/150?u=2' 
  },
  { 
    id: 3, 
    name: 'Augusta Mitchell', 
    email: 'augusta@example.com',
    nickname: 'Auggie',
    team: 'BD Miền Nam',
    rank: 'Junior 3',
    level: 3, 
    dailyRevenue: {
      '2026-05-18': 3000,
      '2026-05-19': 7000,
      '2026-04-20': 1000,
    },
    monthlyKPI: {
      '2026-05': 15000,
      '2026-04': 12000,
    },
    newCustomers: 15, 
    renewedCustomers: 20, 
    avatar: 'https://i.pravatar.cc/150?u=3' 
  },
  { 
    id: 4, 
    name: 'Sarah Connor', 
    email: 'sarah@example.com',
    nickname: 'Sarah',
    team: 'BD Miền Bắc',
    rank: 'Junior 1',
    level: 2, 
    dailyRevenue: {
      '2026-05-19': 9500,
    },
    monthlyKPI: {
      '2026-05': 12000,
    },
    newCustomers: 5, 
    renewedCustomers: 12, 
    avatar: 'https://i.pravatar.cc/150?u=4' 
  },
  { 
    id: 5, 
    name: 'Michael Smith', 
    email: 'michael@example.com',
    nickname: 'Mike',
    team: 'BD Miền Nam',
    rank: 'Middle 1',
    level: 2, 
    dailyRevenue: {
      '2026-05-19': 8000,
    },
    monthlyKPI: {
      '2026-05': 16000,
    },
    newCustomers: 4, 
    renewedCustomers: 10, 
    avatar: 'https://i.pravatar.cc/150?u=5' 
  }
];

export const DataProvider = ({ children }) => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('sales_members_v2');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  // Time filter state shared across the app if needed, or we can just compute it on the fly.
  // We'll expose helper functions.

  useEffect(() => {
    localStorage.setItem('sales_members_v2', JSON.stringify(members));
  }, [members]);

  const updateMember = (id, updatedData) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const updateDailyRevenue = (id, date, amount) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          dailyRevenue: {
            ...m.dailyRevenue,
            [date]: amount
          }
        };
      }
      return m;
    }));
  };

  const batchUpdateDailyRevenue = (draftData) => {
    setMembers(prev => prev.map(m => {
      if (draftData[m.id]) {
        return {
          ...m,
          dailyRevenue: {
            ...m.dailyRevenue,
            ...draftData[m.id]
          }
        };
      }
      return m;
    }));
  };

  const batchUpdateMonthlyKPI = (kpiDraft) => {
    // kpiDraft: { memberId: { 'YYYY-MM': amount } }
    setMembers(prev => prev.map(m => {
      if (kpiDraft[m.id]) {
        return {
          ...m,
          monthlyKPI: {
            ...(m.monthlyKPI || {}),
            ...kpiDraft[m.id]
          }
        };
      }
      return m;
    }));
  };

  // Helper: get KPI for a month
  const getMonthlyKPI = (member, monthStr) => {
    if (!member.monthlyKPI) return 0;
    return member.monthlyKPI[monthStr] || 0;
  };

  // Helper: get KPI completion rate (%) for current month
  const getKPIRate = (member, monthStr) => {
    const kpi = getMonthlyKPI(member, monthStr);
    if (!kpi) return null;
    const revenue = calculateRevenue(member, 'thisMonth');
    return Math.round((revenue / kpi) * 100);
  };

  const addMember = (newMember) => {
    setMembers(prev => [...prev, { ...newMember, id: Date.now() }]);
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Helper function to calculate revenue based on filter
  const calculateRevenue = (member, filterType) => {
    if (!member.dailyRevenue) return 0;
    
    let total = 0;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    Object.entries(member.dailyRevenue).forEach(([dateStr, amount]) => {
      if (filterType === 'thisMonth') {
        const dateObj = new Date(dateStr);
        if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
          total += amount;
        }
      } else {
        // allTime
        total += amount;
      }
    });
    
    return total;
  };

  return (
    <DataContext.Provider value={{ 
      members, 
      updateMember, 
      addMember, 
      deleteMember, 
      updateDailyRevenue,
      batchUpdateDailyRevenue,
      batchUpdateMonthlyKPI,
      calculateRevenue,
      getMonthlyKPI,
      getKPIRate
    }}>
      {children}
    </DataContext.Provider>
  );
};
