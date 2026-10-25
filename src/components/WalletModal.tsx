import React, { useState, useEffect } from 'react';
import { X, Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, QrCode, CheckCircle2, History, CreditCard } from 'lucide-react';
import { getWalletBalance, getWalletTransactions, rechargeWallet, WalletTransaction } from '../services/walletService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBalanceUpdated?: (newBalance: number) => void;
}

export const WalletModal: React.FC<Props> = ({ isOpen, onClose, onBalanceUpdated }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');

  // Recharge state
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [rechargeMethod, setRechargeMethod] = useState<'yape' | 'plin' | 'card'>('yape');
  const [operationCode, setOperationCode] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const loadWalletData = () => {
    const currentBalance = getWalletBalance();
    setBalance(currentBalance);
    setTransactions(getWalletTransactions());
  };

  useEffect(() => {
    if (isOpen) {
      loadWalletData();
      setIsSuccess(false);
      setOperationCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRechargeAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRechargeAmount <= 0) return;

    const methodName = rechargeMethod === 'yape' ? 'Yape' : rechargeMethod === 'plin' ? 'Plin' : 'Tarjeta';
    const result = rechargeWallet(currentRechargeAmount, methodName, operationCode || `OP-${Date.now().toString().slice(-6)}`);
    
    if (result.success) {
      setBalance(result.newBalance);
      setTransactions(getWalletTransactions());
      setIsSuccess(true);
      if (onBalanceUpdated) onBalanceUpdated(result.newBalance);
      setTimeout(() => {
        setIsSuccess(false);
        setOperationCode('');
        setCustomAmount('');
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-sidebar)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[var(--color-text)]">
                Arno Wallet - Monedero Digital
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Paga tus suscripciones al instante en 1 clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Highlight Banner */}
        <div className="p-6 bg-gradient-to-br from-[#847CB8]/20 via-[#847CB8]/5 to-transparent border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
              Saldo Disponible
            </span>
            <div className="text-3xl font-black text-[var(--color-text)] tracking-tight mt-1">
              S/ {balance.toFixed(2)} <span className="text-sm font-extrabold text-[#847CB8]">PEN</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Fondos Seguros</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--color-border)] px-6 pt-3 space-x-6 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`pb-3 transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'recharge'
                ? 'border-[#847CB8] text-[#847CB8]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Recargar Saldo</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 transition flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#847CB8] text-[#847CB8]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Movimientos ({transactions.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'recharge' ? (
            isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-extrabold text-[var(--color-text)]">
                  Recarga Exitosa
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
                  Se ha acreditado S/ {currentRechargeAmount.toFixed(2)} PEN a tu monedero Arno Wallet. Ya puedes realizar compras en 1 clic.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRechargeSubmit} className="space-y-5 text-xs font-semibold">
                {/* Amount Selection */}
                <div>
                  <label className="block text-[var(--color-text-muted)] mb-2">
                    Selecciona el Monto a Recargar
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[20, 50, 100, 200].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl border text-center font-extrabold transition cursor-pointer ${
                          selectedAmount === amt && !customAmount
                            ? 'bg-[#847CB8] text-white border-[#847CB8] shadow-sm'
                            : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[#847CB8]/50 bg-[var(--color-bg)]'
                        }`}
                      >
                        S/ {amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="O escribe otro monto en Soles (ej: 35)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                  />
                </div>

                {/* Method Selection */}
                <div>
                  <label className="block text-[var(--color-text-muted)] mb-2">
                    Método de Pago para la Recarga
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRechargeMethod('yape')}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        rechargeMethod === 'yape'
                          ? 'border-[#847CB8] bg-[#847CB8]/10 text-[var(--color-text)] font-extrabold'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-bg)]'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Yape</div>
                      <div className="text-[10px] text-zinc-400">QR o Número</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRechargeMethod('plin')}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        rechargeMethod === 'plin'
                          ? 'border-[#847CB8] bg-[#847CB8]/10 text-[var(--color-text)] font-extrabold'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-bg)]'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Plin</div>
                      <div className="text-[10px] text-zinc-400">Interbancario</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRechargeMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        rechargeMethod === 'card'
                          ? 'border-[#847CB8] bg-[#847CB8]/10 text-[var(--color-text)] font-extrabold'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-bg)]'
                      }`}
                    >
                      <div className="text-xs font-extrabold">Tarjeta</div>
                      <div className="text-[10px] text-zinc-400">Visa / Mastercard</div>
                    </button>
                  </div>
                </div>

                {/* Yape/Plin Instructions */}
                {(rechargeMethod === 'yape' || rechargeMethod === 'plin') && (
                  <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-muted)] font-bold">Número Destino:</span>
                      <span className="font-extrabold text-[var(--color-text)] font-mono text-sm">900 000 000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-muted)] font-bold">Titular:</span>
                      <span className="font-extrabold text-[var(--color-text)]">ArnoAI Services Perú</span>
                    </div>
                    <div>
                      <label className="block text-[var(--color-text-muted)] mb-1 text-[11px]">
                        Código de Operación o Referencia
                      </label>
                      <input
                        type="text"
                        required
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="Ej: 849201"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Confirmar Recarga de S/ {currentRechargeAmount.toFixed(2)} PEN</span>
                </button>
              </form>
            )
          ) : (
            /* Transactions History */
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-text-muted)] text-xs">
                  No tienes movimientos registrados todavía.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${tx.type === 'recharge' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#FF66C4]/10 text-[#FF66C4]'}`}>
                        {tx.type === 'recharge' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-[var(--color-text)] block">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {tx.date}
                        </span>
                      </div>
                    </div>
                    <div className={`text-xs font-black ${tx.type === 'recharge' ? 'text-emerald-500' : 'text-[var(--color-text)]'}`}>
                      {tx.type === 'recharge' ? '+' : '-'} S/ {tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
