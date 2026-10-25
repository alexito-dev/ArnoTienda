import React, { useState, useEffect } from 'react';
import { X, Key, Copy, Check, FileText, ShoppingBag, ShieldCheck, ExternalLink } from 'lucide-react';
import { getSavedOrders, SavedOrder } from '../services/ordersService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersHistoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrders(getSavedOrders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadReceipt = (order: SavedOrder) => {
    const text = `
========================================
ARNOTIENDA - COMPROBANTE DE COMPRA
========================================
Orden ID: ${order.id}
Fecha: ${order.date}
Total Pagado: S/ ${order.totalPEN.toFixed(2)} PEN
Método de Pago: ${order.paymentMethod}
Estado: ${order.status.toUpperCase()}

PRODUCTOS & CLAVES:
${order.items
  .map(
    (item, i) => `
${i + 1}. ${item.productName}
   - Cantidad: ${item.quantity}
   - Clave Digital: ${item.activationKey}
   - Precio: S/ ${item.pricePEN.toFixed(2)} PEN
`
  )
  .join('\n')}

Soporte Oficial: https://ia.arno.services / WhatsApp +51 900000000
Garantía 100% Protegida por ArnoAI Services
========================================
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-sidebar)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[var(--color-text)]">
                Mis Licencias y Compras
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Historial completo de claves adquiridas y comprobantes
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Key className="w-12 h-12 text-[var(--color-text-muted)] mx-auto opacity-40" />
              <h4 className="text-sm font-extrabold text-[var(--color-text)]">
                No tienes licencias registradas aún
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
                Tus compras completadas y sus claves de activación se guardarán automáticamente aquí.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)]/60 pb-3 text-xs">
                  <div>
                    <span className="font-extrabold text-[var(--color-text)] block">
                      Orden #{order.id}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {order.date} • Pago vía {order.paymentMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[var(--color-text)] block">
                      S/ {order.totalPEN.toFixed(2)} PEN
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--color-text)]">
                          {item.productName} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-[#847CB8]/15 text-[#847CB8] text-[10px] font-extrabold">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Key Box */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <div className="flex items-center space-x-2 font-mono text-xs font-black text-amber-500 dark:text-amber-300 truncate mr-2">
                          <Key className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.activationKey}</span>
                        </div>
                        <button
                          onClick={() => handleCopyKey(item.activationKey)}
                          className="px-3 py-1.5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-[11px] transition cursor-pointer flex items-center space-x-1 shrink-0"
                        >
                          {copiedKey === item.activationKey ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleDownloadReceipt(order)}
                    className="flex items-center space-x-1.5 text-[11px] font-bold text-[#847CB8] hover:underline cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Descargar Comprobante</span>
                  </button>

                  <div className="flex items-center space-x-1 text-[10px] text-emerald-500 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Garantía Activa</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
