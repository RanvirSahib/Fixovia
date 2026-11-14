// Shared utility for syncing partner custom visiting rate across Fixovia

export const getStoredPartnerRate = (fallbackRate = 499) => {
  try {
    const direct = localStorage.getItem('fixovia_partner_visiting_rate');
    if (direct !== null && direct !== undefined && direct !== '') {
      const n = Number(direct);
      if (!isNaN(n) && n > 0) return n;
    }
    const userRaw = localStorage.getItem('fixovia_user');
    if (userRaw) {
      const u = JSON.parse(userRaw);
      if (u.visitRate && !isNaN(Number(u.visitRate))) {
        return Number(u.visitRate);
      }
    }
    const dbRaw = localStorage.getItem('fixovia_users_db');
    if (dbRaw) {
      const db = JSON.parse(dbRaw);
      const wUser = db.find(u => u.role === 'worker' && u.visitRate);
      if (wUser && !isNaN(Number(wUser.visitRate))) {
        return Number(wUser.visitRate);
      }
    }
  } catch (e) {
    console.error('Failed to get stored partner rate', e);
  }
  return fallbackRate;
};

export const getStoredPartnerInfo = () => {
  let rate = getStoredPartnerRate(499);
  let trade = 'Electrical';
  let name = 'Raj Kumar';

  try {
    const t = localStorage.getItem('fixovia_partner_trade');
    if (t) trade = t;
    const n = localStorage.getItem('fixovia_partner_name');
    if (n) name = n;

    const userRaw = localStorage.getItem('fixovia_user');
    if (userRaw) {
      const u = JSON.parse(userRaw);
      if (u.role === 'worker') {
        if (u.trade) trade = u.trade;
        if (u.name) name = u.name;
        if (u.visitRate) rate = Number(u.visitRate);
      }
    }
  } catch (e) {
    console.error('Failed to get stored partner info', e);
  }

  return { rate, trade, name };
};

export const mergeWorkersWithPartnerRate = (baseWorkers = []) => {
  const { rate, trade, name } = getStoredPartnerInfo();
  if (!rate || isNaN(Number(rate))) return baseWorkers;

  const tradeKeyword = (trade || 'electrician').toLowerCase().replace(/repair|servicing/g, '').trim();

  return baseWorkers.map(w => {
    // The partner maps to Worker 1 (Raj Kumar/Raj Singh) or any worker matching partner trade/name
    const isPartner = w.id === 1 ||
      (name && w.name.toLowerCase() === name.toLowerCase()) ||
      (tradeKeyword && w.role.toLowerCase().includes(tradeKeyword));

    if (isPartner) {
      return {
        ...w,
        name: name || w.name,
        role: trade ? (trade.toLowerCase().includes('elect') ? 'Electrician' : trade.toLowerCase().includes('plumb') ? 'Plumber' : trade.toLowerCase().includes('ac') ? 'AC Technician' : trade.toLowerCase().includes('carp') ? 'Carpenter' : w.role) : w.role,
        rate: Number(rate),
      };
    }
    return w;
  });
};
