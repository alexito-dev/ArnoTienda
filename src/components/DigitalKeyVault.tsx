import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Download, ExternalLink, Key, Sparkles, FileText } from 'lucide-react';
import { CartItem } from '../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderId?: string;
}

export const DigitalKeyVault: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
}) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleDownloadReceipt = () => {
    const receiptText = `
========================================
ARNOTIENDA - COMPROBANTE DIGITAL DE COMPRA
========================================
Orden ID: ${orderId}
Fecha: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}
Vendedor: ArnoAI Official

PRODUCTOS ADQUIRIDOS:
${cartItems
  .map(
    (item, i) => `
${i + 1}. ${item.product.name}
   - Cantidad: ${item.quantity}
   - Clave Digital: ${item.product.activationKeySample || 'G2A-ARNO-LIVE-KEY-99X'}
   - Formato: ${item.product.badge || 'Cuenta Privada'}
   - Región: GLOBAL KEY
`
  )
  .join('\n')}

INSTRUCCIONES DE ACTIVACIÓN:
1. Copia tu clave digital de este comprobante.
2. Ingresa al enlace oficial del producto o a la consola de inicio.
3. Activa tu clave y disfruta de acceso garantizado.

Soporte Oficial: https://ia.arno.services / WhatsApp +51 900000000
Garantía 100% Protegida por ArnoAI Services
========================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recibo_${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--color-text)]">
                Bóveda Digital de Claves
              </h2>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                Orden #{orderId} • Entrega Instantánea Verificada
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keys List */}
        <div className="space-y-4">
          {cartItems.map((item, idx) => {
            const keySample = item.product.activationKeySample || `G2A-ARNO-${Date.now().toString().slice(-6)}-KEY`;
            return (
              <div
                key={item.product.id || idx}
                className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[var(--color-text)]">
                    {item.product.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                    Activa Verificada
                  </span>
                </div>

                {/* Key Box */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/10">
                  <div className="flex items-center space-x-2 font-mono text-xs font-black text-amber-300 tracking-wider truncate mr-2">
                    <Key className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="truncate">{keySample}</span>
                  </div>

                  <button
                    onClick={() => handleCopyKey(keySample, item.product.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 shrink-0 shadow-xs"
                  >
                    {copiedKeyId === item.product.id ? (
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

                <div className="text-[11px] text-[var(--color-text-muted)] space-y-1">
                  <span className="font-bold block">Guía Rápida de Activación:</span>
                  <p>1. Copia la clave arriba.</p>
                  <p>2. Ingresa a la plataforma oficial e introduce tu clave para disfrutar de tu suscripción.</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <button
            onClick={handleDownloadReceipt}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] font-bold text-xs transition cursor-pointer flex items-center space-x-2 border border-[var(--color-border)]"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar Comprobante TXT</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-black text-xs transition cursor-pointer shadow-md"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};
