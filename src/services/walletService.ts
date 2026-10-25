export interface WalletTransaction {
  id: string;
  type: 'recharge' | 'payment';
  amount: number;
  date: string;
  description: string;
  method?: string;
  referenceCode?: string;
}

const WALLET_BALANCE_KEY = 'arno_wallet_balance';
const WALLET_TXS_KEY = 'arno_wallet_transactions';

export const getWalletBalance = (): number => {
  try {
    const saved = localStorage.getItem(WALLET_BALANCE_KEY);
    return saved ? parseFloat(saved) : 0;
  } catch {
    return 0;
  }
};

export const getWalletTransactions = (): WalletTransaction[] => {
  try {
    const saved = localStorage.getItem(WALLET_TXS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const rechargeWallet = (amount: number, method: string, referenceCode: string): { success: boolean; newBalance: number } => {
  if (amount <= 0) return { success: false, newBalance: getWalletBalance() };

  const current = getWalletBalance();
  const newBalance = Math.round((current + amount) * 100) / 100;
  
  localStorage.setItem(WALLET_BALANCE_KEY, newBalance.toString());

  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'recharge',
    amount,
    date: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    description: `Recarga de saldo vía ${method}`,
    method,
    referenceCode,
  };

  const txs = [newTx, ...getWalletTransactions()];
  localStorage.setItem(WALLET_TXS_KEY, JSON.stringify(txs));

  window.dispatchEvent(new Event('arno_wallet_updated'));
  return { success: true, newBalance };
};

export const payWithWallet = (amount: number, description: string): { success: boolean; remainingBalance: number; error?: string } => {
  const current = getWalletBalance();
  if (current < amount) {
    return { success: false, remainingBalance: current, error: 'Saldo insuficiente en tu monedero' };
  }

  const remainingBalance = Math.round((current - amount) * 100) / 100;
  localStorage.setItem(WALLET_BALANCE_KEY, remainingBalance.toString());

  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'payment',
    amount,
    date: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    description,
  };

  const txs = [newTx, ...getWalletTransactions()];
  localStorage.setItem(WALLET_TXS_KEY, JSON.stringify(txs));

  window.dispatchEvent(new Event('arno_wallet_updated'));
  return { success: true, remainingBalance };
};
