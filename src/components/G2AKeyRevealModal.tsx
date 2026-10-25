import React, { useState } from 'react';
import { Key, Copy, Check, X, ShieldCheck, Eye } from 'lucide-react';
import { CartItem } from '../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

export const G2AKeyRevealModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
}) => {
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: true }));
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Top Header */}
        <div className="p-6 bg-[#1E1C21] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Tus Claves Digitales de Activación</h3>
              <p className="text-xs text-zinc-300">Entrega digital instantánea verificada ✓</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Keys List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {cartItems.map((item, idx) => {
            const keyText = `${item.product.activationKeySample}-${Math.floor(1000 + Math.random() * 9000)}`;
            const isRevealed = revealedKeys[item.product.id];
            const isCopied = copiedKey === keyText;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[var(--color-text)]">{item.product.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#A7D792]/20 text-emerald-600 dark:text-emerald-400">
                    SE PUEDE ACTIVAR ✓
                  </span>
                </div>

                {!isRevealed ? (
                  <button
                    onClick={() => handleReveal(item.product.id)}
                    className="w-full p-4 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>DESVELAR MI CLAVE DIGITAL</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-[#1E1C21] text-[#A7D792] font-mono text-xs font-bold flex items-center justify-between border border-white/10">
                    <span className="truncate mr-2">{keyText}</span>
                    <button
                      onClick={() => handleCopy(keyText)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Instrucciones: Copia la clave desvelada y pégala en la extensión de VS Code o en la pestaña Configuración de ArnoAI.
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-[var(--color-text-muted)] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Arno Protect Guarantee 100%</span>
          </div>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
